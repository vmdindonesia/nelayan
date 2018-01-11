import React from 'react'
import { StackNavigator } from 'react-navigation'
import AuthScreen from './src/screens/AuthScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import CatalogList from './src/screens/CatalogList'
import CatalogCreate from './src/screens/CatalogCreate'
import HomeScreen from './src/screens/HomeScreen'

// Routes
const Routes = StackNavigator({
  Login: { screen: AuthScreen },
  Register: { screen: RegisterScreen },
  CatalogList: { screen: CatalogList },
  CatalogCreate: { screen: CatalogCreate },
  HomeScreen: { screen: HomeScreen },
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
