import React from 'react'
import { StackNavigator } from 'react-navigation'
import AuthScreen from './src/screens/AuthScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import CatalogCreate from './src/screens/CatalogCreate'
import HomeScreen from './src/screens/HomeScreen'

import FishLogList from './src/screens/FishLogList'
import Profil from './src/screens/Profil'
import TransactionList from './src/screens/TransactionList'
import RequestList from './src/screens/RequestList'
import MemberList from './src/screens/MemberList'
import Information from './src/screens/Information'
import Reward from './src/screens/Reward'

// Routes
const Routes = StackNavigator({
  HomeScreen: { screen: HomeScreen },
  Login: { screen: AuthScreen },
  Register: { screen: RegisterScreen },

  FishLogList: { screen: FishLogList },
  Profil: { screen: Profil },
  TransactionList: { screen: TransactionList },
  RequestList: { screen: RequestList },
  MemberList: { screen: MemberList },
  Information: { screen: Information },
  Reward: { screen: Reward },

  CatalogCreate: { screen: CatalogCreate },
}, {
  cardStyle: { backgroundColor: '#fff' },
  navigationOptions: { headerStyle: { marginTop: Expo.Constants.statusBarHeight } }

})

export default class App extends React.Component {
  render() {
    return (
      <Routes />
    )
  }
}
