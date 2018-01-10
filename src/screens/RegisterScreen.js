import React, { Component } from 'react'
import axios from 'axios'
import { ScrollView, Text, Picker, KeyboardAvoidingView } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import Constants from '../constants'

class RegisterScreen extends Component {
	static navigationOptions = {
		title: 'Registrasi'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			typeOrganization: 'Kelompok Nelayan',
			organization: '',
			address: '',
			cityId: '',

			name: '',
			idNumber: '',
			phone: '',
			email: '',
			password: '',
			confirmPassword: '',

			loading: false
		}
	}

	onChangeInput = (name, v) => {
    this.setState({[name]: v})
	}

	// to do: form validation
	// 

	register = () => {
		this.setState({loading: true})

		const data = this.state

		axios.post(`${Constants.BASE_URL}register-supplier`, data)
		.then(response => {
			console.log(response)
			if (response.status === 200) {
				this.props.navigation.navigate('CatalogList')
			}
			else {
				alert(response.data.message)
			}

			this.setState({loading: false})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Tidak ada koneksi internet')
			}

			this.setState({loading: false})
		})
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button onPress={this.register}>
				Register
			</Button>
		)
	}

	render() {
		const { 
			typeOrganization,
			organization,
			address,
			cityId,

			name,
			idNumber,
			phone,
			email,
			password,
			confirmPassword,

			loading
		} = this.state

		console.log(this.state)

		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior="padding"
				keyboardVerticalOffset={80}
			>
				<ScrollView 
					style={styles.containerStyle}
					keyboardShouldPersistTaps="always"
				>
					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								INFORMASI LEMBAGA
							</Text>
						</ContainerSection>
						<ContainerSection>
							<Text style={styles.pickerTextStyle}>Jenis Supplier</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={typeOrganization}
								onValueChange={v => this.onChangeInput('typeOrganization', v)}
							>
								<Picker.Item label="Kelompok Nelayan" value="Kelompok Nelayan" />
								<Picker.Item label="Personal" value="Personal" />
							</Picker>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Desa/Kelurahan'
								placeholder='contoh: Antapani'
								value={address}
								onChangeText={v => this.onChangeInput('address', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Kecamatan'
								placeholder='contoh: Antapani Kidul'
							/>
						</ContainerSection>
						<ContainerSection>
							<Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={cityId}
								onValueChange={v => this.onChangeInput('cityId', v)}
							>
								<Picker.Item label="- Pilih Kota/Kabupaten" value="" />
								<Picker.Item label="Jakarta" value="1" />
								<Picker.Item label="Pangandaran" value="2" />
							</Picker>
						</ContainerSection>
					</Container>

					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								INFORMASI PERSONAL
							</Text>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Nama Lengkap'
								placeholder='contoh: Ahmad Darudi'
								value={name}
								onChangeText={v => this.onChangeInput('name', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='No. KTP'
								placeholder='contoh: 321317989029'
								keyboardType="numeric"
								value={idNumber}
								onChangeText={v => this.onChangeInput('idNumber', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='No. HP'
								placeholder='contoh: 085621017922'
								keyboardType="numeric"
								value={phone}
								onChangeText={v => this.onChangeInput('phone', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Email'
								placeholder='contoh: erwin@gmail.com'
								value={email}
								onChangeText={v => this.onChangeInput('email', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
								value={password}
								onChangeText={v => this.onChangeInput('password', v)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Konfirmasi Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
								value={confirmPassword}
								onChangeText={v => this.onChangeInput('confirmPassword', v)}
							/>
						</ContainerSection>
						
					</Container>
					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</ScrollView>
			</KeyboardAvoidingView>
		)
	}
}

const styles = {
	containerStyle: {
		
	},
	headerStyle: {
		marginLeft: 5
	},
	pickerTextStyle: {
		color: '#8e8e8e',
		flex: 1,
		paddingLeft: 5
	}
}

export default RegisterScreen
