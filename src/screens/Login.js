import React, { Component } from 'react'
import { View, Text, Keyboard, Image, AsyncStorage, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { login } from '../actions'
import { COLORS } from '../constants'

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
			AsyncStorage.setItem('token', props.user.token).then(console.log('token tersimpan'))

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
		Keyboard.dismiss()

		const { email, password } = this.state
		//To do: validate
		
		this.props.login(email, password)
	}

	renderError = () => {
		if (this.props.user.error) {
			return (
				<Text style={styles.errorTextStyle}>
					{this.props.user.error}
				</Text>
			)
		}
	}

	renderButton = () => {
		if (this.props.user.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={() => this.login()}>
				Masuk
			</Button>
		)
	}

	render() {
		const { navigate } = this.props.navigation
		const { email, password } = this.state
		console.log(this.state)

		return (
			<View style={styles.container}>
				<Container>
					<ContainerSection>
						<View style={{flex: 1, marginBottom: 30}}>
							<Image
								style={{alignSelf: 'center'}}
								source={require('../../assets/logo.png')} 
							/>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Email'
							onChangeText={val => this.onChange('email', val)}
							placeholder="Username / Email"
							value={email}
							icon="ic_user"
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							secureTextEntry
							onChangeText={val => this.onChange('password', val)}
							placeholder="Password"
							value={password}
							icon="ic_password"
						/>
					</ContainerSection>

					{this.renderError()}

					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</Container>
				
				<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
					<Text style={{ textAlign: 'center'}}>
						Belum punya akun?
					</Text>
					<TouchableOpacity onPress={() => navigate('Register')}>
						<Text style={{ color: COLORS.secondary_a}}> 
							{` Daftar`}
						</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
					<Text style={{ textAlign: 'center', marginTop: 10, color: COLORS.secondary_a}}>
						Lupa Kata Sandi?
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = {
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	errorTextStyle: {
		textAlign: 'center',
		color: 'red'
	}
}

const mapStateToProps = (state) => {
	return {user: state.user}
}

export default connect(mapStateToProps, {login})(Login)
