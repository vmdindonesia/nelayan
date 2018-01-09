import React from 'react'
import { StackNavigator } from 'react-navigation'
import AuthScreen from './src/screens/AuthScreen'
import RegisterScreen from './src/screens/RegisterScreen'

// Routes
const Routes = StackNavigator({
  Login: { screen: AuthScreen },
  Register: { screen: RegisterScreen },
}, {
  navigationOptions: { headerStyle: { marginTop: Expo.Constants.statusBarHeight } }
})

export default class App extends React.Component {
  render() {
    return (
      <Routes />
    )
  }
}
