import React, { Component } from 'react'
import { View, Text, Image, Alert } from 'react-native'
import axios from 'axios'

import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { COLOR, BASE_URL } from '../constants'

class ResetPassword extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
	
		this.state = {
			password: '',
			confirmPassword: '',
			loading: false
		}
	}

	onChange = (name, value) => {
		this.setState({ [name]: value })
	}

	onSubmit = () => {
		if (this.state.password === '') {
			alert('Email harus diisi')
		}
		else if (this.state.password !== this.state.confirmPassword) {
			alert('Password dan Ulangi Password tidak cocok')
		}
		else {
			this.setState({loading: true})
			const data = {
				password: this.state.password
			}

			axios.post(`${BASE_URL}/reset-password`, data)
			.then(() => {
				Alert.alert('Berhasil', `Password berhasil disetel ulang. Silahkan coba login dengan password baru`, [])
				this.setState({loading: false})
			})
			.catch(error => {
				console.log(error.response)

				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}

				this.setState({loading: false})
			})
		}
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={() => this.onSubmit()}>
				Kirim 
			</Button>
		)
	}

	render() {
		const { password, confirmPassword } = this.state

		return (
			<View style={{flex: 1, paddingTop: 100, backgroundColor: '#2b76d2'}}>
				<Container>
					<ContainerSection>
						<Image
							style={{width: 35, height: 40, marginLeft: 10}}
							source={require('../../assets/ic_password_white.png')} 
						/>
					</ContainerSection>
				</Container>
				
				<Container>
					<ContainerSection>
						<Text style={{color: '#fff', marginBottom: -15}}>Masukkan password baru</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							placeholder="Password"
							secureTextEntry
							onChangeText={val => this.onChange('password', val)}
							value={password}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Ulangi Password'
							placeholder="Ulangi Password"
							secureTextEntry
							onChangeText={val => this.onChange('confirmPassword', val)}
							value={confirmPassword}
						/>
					</ContainerSection>

					<View style={{marginTop: 20, marginBottom: 20}}>
						<ContainerSection>
							{this.renderButton()}
						</ContainerSection>
					</View>
				</Container>
			</View>
		)
	}
}

export default ResetPassword

