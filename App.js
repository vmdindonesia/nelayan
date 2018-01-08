import React from 'react'
import { StackNavigator } from 'react-navigation'
import LoginForm from './src/components/LoginForm'
import RegisterForm from './src/components/RegisterForm'

// Routes
const Routes = StackNavigator({
  Login: { screen: LoginForm },
  Register: { 
    screen: RegisterForm,
    navigationOptions: {
      headerTitle: 'Registrasi',
    },
  },
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
