import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import numeral from 'numeral'
import { setCustomText } from 'react-native-global-props'

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
import Information from './src/screens/Information'
import Reward from './src/screens/Reward'
import ForgotPassword from './src/screens/ForgotPassword'
import Message from './src/screens/Message'

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
  Information: { screen: Information },
  Reward: { screen: Reward },
  Message: { screen: Message },

}, {
  cardStyle: { backgroundColor: '#fafafa' },
  navigationOptions: {
    headerTitleStyle: {
      alignSelf: 'center',
      color: '#fff',
      fontFamily: 'Muli-Bold',
      fontWeight: '300',
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

export default class App extends Component<{}> {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}

