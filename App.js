import React from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import reducers from './src/reducers'

import Login from './src/screens/Login'
import Register from './src/screens/Register'
import Home from './src/screens/Home'

import FishLogList from './src/screens/FishLogList'
import FishLogDetail from './src/screens/FishLogDetail'
import FishLogCreate from './src/screens/FishLogCreate'
import Profil from './src/screens/Profil'
import TransactionList from './src/screens/TransactionList'
import RequestList from './src/screens/RequestList'
import MemberList from './src/screens/MemberList'
import Information from './src/screens/Information'
import Reward from './src/screens/Reward'

// Routes
const Routes = StackNavigator({
  Home: { screen: Home },
  Login: { screen: Login },
  Register: { screen: Register },

  FishLogList: { screen: FishLogList },
  FishLogDetail: { screen: FishLogDetail },
  FishLogCreate: { screen: FishLogCreate },
  
  Profil: { screen: Profil },
  TransactionList: { screen: TransactionList },
  RequestList: { screen: RequestList },
  MemberList: { screen: MemberList },
  Information: { screen: Information },
  Reward: { screen: Reward },

}, {
  cardStyle: { backgroundColor: '#fff' },
  navigationOptions: { headerStyle: { marginTop: Expo.Constants.statusBarHeight } }
})

export default class App extends React.Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}
