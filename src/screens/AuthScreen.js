import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'

class AuthScreen extends Component {
	render() {
		const { navigate } = this.props.navigation

		return (
			<View style={styles.container}>
				<Text>Halaman Login</Text>
				<Button
					raised
					buttonStyle={{ backgroundColor: 'blue' }}
					textStyle={{ textAlign: 'center' }}
					title="Belum memiliki akun? Registrasi"
					onPress={() => navigate('Register')}
				/>
			</View>
		)
	}
}

const styles = {
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
}

export default AuthScreen
