import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import numeral from 'numeral'
import { setCustomText } from 'react-native-global-props'
import OneSignal from 'react-native-onesignal'

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
import NotificationList from './src/screens/NotificationList'
import Information from './src/screens/Information'
import Reward from './src/screens/Reward'
import ForgotPassword from './src/screens/ForgotPassword'
import Message from './src/screens/Message'
import Help from './src/screens/Help'

import { COLOR } from './src/constants'

numeral.register('locale', 'id', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  ordinal: function (number) {
      return number === 1 ? 'er' : 'ème'
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
  NotificationList: { screen: NotificationList },
  Information: { screen: Information },
  Reward: { screen: Reward },
  Message: { screen: Message },
  Help: { screen: Help },

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
  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('registered', this.onRegistered)
    OneSignal.addEventListener('ids', this.onIds)
  }

  componentDidMount() {
    OneSignal.configure({})
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('registered', this.onRegistered)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived(notification) {
    console.log('Notification received: ', notification)
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onRegistered(notifData) {
    console.log('Device had been registered for push notifications!', notifData)
  }

  onIds(device) {
    console.log('Device info: ', device)
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}

