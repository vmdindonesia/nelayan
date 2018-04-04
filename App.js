import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import numeral from 'numeral'
import { setCustomText } from 'react-native-global-props'
// import codePush from 'react-native-code-push'

import reducers from './src/reducers'

import SplashScreen from './src/screens/SplashScreen'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import Home from './src/screens/Home'
import StartScreen from './src/screens/StartScreen'

import FishLogList from './src/screens/FishLogList'
import FishLogEdit from './src/screens/FishLogEdit'
import FishLogCreate from './src/screens/FishLogCreate'
import ProductForm from './src/screens/ProductForm'
import Profile from './src/screens/Profile'
import ProfileEdit from './src/screens/ProfileEdit'
import OrderList from './src/screens/OrderList'
import OrderDetail from './src/screens/OrderDetail'
import RequestList from './src/screens/RequestList'
import RequestDetail from './src/screens/RequestDetail'
import MemberList from './src/screens/MemberList'
import MemberCreate from './src/screens/MemberCreate'
import MemberEdit from './src/screens/MemberEdit'
import NotificationList from './src/screens/NotificationList'
import Information from './src/screens/Information'
import Reward from './src/screens/Reward'
import ForgotPassword from './src/screens/ForgotPassword'
import ResetPassword from './src/screens/ResetPassword'
import Message from './src/screens/Message'
import MessageList from './src/screens/MessageList'
import MessageAdmin from './src/screens/MessageAdmin'
import Help from './src/screens/Help'
import Term from './src/screens/Term'
import CreateAuction from './src/screens/CreateAuction'
import OfficialStore from './src/screens/OfficialStore'
import PreviewPhoto from './src/screens/PreviewPhoto'
import ListAuction from './src/screens/ListAuction'
import { COLOR } from './src/constants'

numeral.register('locale', 'id', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  ordinal: function (number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: 'Rp'
  }
})
numeral.locale('id')

// Routes
const Routes = StackNavigator({
  SplashScreen: { screen: SplashScreen },
  Home: { screen: Home },
  StartScreen: { screen: StartScreen },
  Login: { screen: Login },
  Register: { screen: Register },
  ForgotPassword: { screen: ForgotPassword },
  ResetPassword: { screen: ResetPassword },

  FishLogList: { screen: FishLogList },
  FishLogEdit: { screen: FishLogEdit },
  FishLogCreate: { screen: FishLogCreate },

  ProductForm: { screen: ProductForm },

  RequestList: { screen: RequestList },
  RequestDetail: { screen: RequestDetail },

  Profile: { screen: Profile },
  ProfileEdit: { screen: ProfileEdit },

  OrderList: { screen: OrderList },
  OrderDetail: { screen: OrderDetail },

  MemberList: { screen: MemberList },
  MemberCreate: { screen: MemberCreate },
  MemberEdit: { screen: MemberEdit },
  NotificationList: { screen: NotificationList },
  Information: { screen: Information },
  Reward: { screen: Reward },
  Message: { screen: Message },
  MessageList: { screen: MessageList },
  MessageAdmin: { screen: MessageAdmin },
  Help: { screen: Help },
  Term: { screen: Term },
  Auction: { screen: CreateAuction },
  Store: { screen: OfficialStore },
  Preview: { screen: PreviewPhoto },
  ListAuctions: { screen: ListAuction }
}, {
    cardStyle: { backgroundColor: '#fafafa' },
    navigationOptions: {
      headerTitleStyle: {
        flex: 1,
        alignSelf: 'center',
        color: '#fff',
        fontFamily: 'Muli-Bold',
        fontWeight: '300',
        textAlign: 'center',
      },
      headerStyle: {
        backgroundColor: COLOR.secondary_a,
      },
      headerTintColor: '#fff',
    }
  })

// font
const customTextProps = {
  style: {
    fontFamily: 'Muli-Regular'
  }
}
setCustomText(customTextProps)

class App extends Component<{}> {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}

// App = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })(App)

export default App

