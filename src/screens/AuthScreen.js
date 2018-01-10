import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Container, ContainerSection, Input, Button } from '../components/common'

class AuthScreen extends Component {
	static navigationOptions = {
		header: null
	}

	render() {
		const { navigate } = this.props.navigation

		return (
			<View style={styles.container}>
				<Container>
					<ContainerSection>
						<Input
							label='Email'
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							secureTextEntry
						/>
					</ContainerSection>
					<ContainerSection>
						<Button onPress={() => alert('Login')}>
							Login
						</Button>
					</ContainerSection>
				</Container>
				
				<Text style={{ textAlign: 'center', marginTop: 10 }}>
					Belum punya akun?
					<Text
						onPress={() => navigate('Register')}
						style={{ color: 'green', fontWeight: 'bold' }}
					> Registrasi</Text>
				</Text>
			</View>
		)
	}
}

const styles = {
	container: {
		marginTop: 100,
		justifyContent: 'center'
	}
}

export default AuthScreen
