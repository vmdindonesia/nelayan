import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'

class ForgotPassword extends Component {
	static navigationOptions = {
		title: 'Lupa Password'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			email: '',
		}
	}

	onChange = (name, value) => {
		this.setState({ [name]: value })
	}

	renderButton = () => {
		if (this.props.user.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={() => this.login()}>
				Kirim 
			</Button>
		)
	}

	render() {
		const { email } = this.state

		return (
			<View style={{flex: 1}}>
				<Container>
					<ContainerSection>
						<Input
							label='Email'
							onChangeText={val => this.onChange('email', val)}
							value={email}
						/>
					</ContainerSection>

					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</Container>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {user: state.user}
}

export default connect(mapStateToProps, {})(ForgotPassword)

