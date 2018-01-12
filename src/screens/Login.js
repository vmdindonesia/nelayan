import React, { Component } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { login } from '../actions'

class Login extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
	
		this.state = {
			email: '',
			password: '',
		}
	}

	componentWillReceiveProps(nextProps) {
		this.onLoginComplete(nextProps)
	}

	onLoginComplete(props) {
		if (props.user.token) {
			Keyboard.dismiss()

			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: 'Home'})
				]
			})
			this.props.navigation.dispatch(resetAction)
		}
	}

	onChange = (name, value) => {
		this.setState({ [name]: value })
	}

	login = () => {
		const { email, password } = this.state
		//To do: validate
		
		this.props.login(email, password)
	}

	renderButton = () => {
		if (this.props.user.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={() => this.login()}>
				Login
			</Button>
		)
	}

	render() {
		const { navigate } = this.props.navigation
		const { email, password } = this.state

		return (
			<View style={styles.container}>
				<Container>
					<ContainerSection>
						<Input
							label='Email'
							onChangeText={val => this.onChange('email', val)}
							value={email}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							secureTextEntry
							onChangeText={val => this.onChange('password', val)}
							value={password}
						/>
					</ContainerSection>
					<ContainerSection>
						{this.renderButton()}
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

const mapStateToProps = (state) => {
	return {user: state.user}
}

export default connect(mapStateToProps, {login})(Login)
