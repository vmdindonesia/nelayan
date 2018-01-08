import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

class LoginForm extends Component {
	render() {
		const { navigate } = this.props.navigation

		return (
			<View style={styles.container}>
				<Text>Halaman Login</Text>
				<Button
		      onPress={() => navigate('Register')}
		      title="Belum memiliki akun? Registrasi"
		    />
			</View>
		)
	}
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default LoginForm
