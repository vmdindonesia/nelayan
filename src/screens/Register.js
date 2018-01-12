import React, { Component } from 'react'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'
import { ScrollView, Text, Picker, KeyboardAvoidingView, Alert, Keyboard, TouchableOpacity, View } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import Constants from '../constants'
import AutoComplete from '../components/AutoComplete'

class Register extends Component {
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

			loading: false,
			suggestions: [],
			values: [],
			fishIds: [],
		}
	}

	onItemSelected = (index, item) => {
		const { fishIds, values } = this.state
		fishIds[index] = item.id
		values[index] = item.name

		this.setState({
			suggestions: [],
			fishIds,
			values
		})
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})
	}

	querySuggestion = (index, text) => {
		const { values, suggestions } = this.state
		values[index] = text

		this.setState({values})

		axios.get(`${Constants.BASE_URL}/fishes/search?key=${text}`, {
			headers: {'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozNCwibmFtZSI6ImFyaWYiLCJlbWFpbCI6ImFyaWZAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJwaG9uZSI6IjA4MjExMTEyMjEiLCJwaG90byI6bnVsbCwiYWRkcmVzcyI6ImFsZGlyb24iLCJyb2xlIjoic3VwcGxpZXIiLCJwb2ludEFtb3VudCI6MCwiaWROdW1iZXIiOiIzMjQ3MDI0NDQiLCJvcmdhbml6YXRpb24iOiJtaXRyYSBrYXNpaCIsInR5cGVPcmdhbml6YXRpb24iOiJwdCIsImFjdGl2ZSI6ZmFsc2UsInZlcmlmeSI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMTgtMDEtMDlUMDc6NDc6MTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDEtMDlUMDc6NDc6MTAuMDAwWiJ9LCJpYXQiOjE1MTU0OTExNDYsImV4cCI6MTUxNjA5NTk0Nn0.3X3XEV50K2vEZXsvd-BaXc8ElHE8qj2i_N-n-x9stUM'}
		})
		.then(response => {
			res = response.data.data
			suggestions[index] = res
			this.setState({suggestions})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
		})
	}

	// to do: form validation
	// 

	register = () => {
		Keyboard.dismiss()

		// for testing
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'Home'})
			]
		})
		this.props.navigation.dispatch(resetAction)

		this.setState({loading: true})

		const data = this.state

		axios.post(`${Constants.BASE_URL}/register-supplier`, data)
		.then(response => {
			console.log(response)
			if (response.status === 200) {
				this.props.navigation.navigate('Home')
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
				alert('Koneksi internet bermasalah')
			}

			this.setState({loading: false})
		})
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button 
				onPress={
					() => Alert.alert(
						'',
						'Yakin sudah mengisi informasi profil anda dengan tepat?',
						[
							{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
							{text: 'Ya', onPress: () => this.register()},
						]
					)
				}
			>
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

			loading,
			suggestions,
			values,
			fishIds
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
					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								PRODUK UNGGULAN
							</Text>
						</ContainerSection>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions[0]}
								onChangeText={text => this.querySuggestion(0, text)}
								value={values[0]}
							>
							{
								suggestions[0] && suggestions[0].map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(0, item)}
									>
										<View style={styles.containerItemAutoSelect}>
											<Text>{item.name}</Text>
										</View>
									</TouchableOpacity>
								)
							}
							</AutoComplete>
						</ContainerSection>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions[1]}
								onChangeText={text => this.querySuggestion(1, text)}
								value={values[1]}
							>
							{
								suggestions[1] && suggestions[1].map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(1, item)}
									>
										<View style={styles.containerItemAutoSelect}>
											<Text>{item.name}</Text>
										</View>
									</TouchableOpacity>
								)
							}
							</AutoComplete>
						</ContainerSection>	
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions[2]}
								onChangeText={text => this.querySuggestion(2, text)}
								value={values[2]}
							>
							{
								suggestions[2] && suggestions[2].map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(2, item)}
									>
										<View style={styles.containerItemAutoSelect}>
											<Text>{item.name}</Text>
										</View>
									</TouchableOpacity>
								)
							}
							</AutoComplete>
						</ContainerSection>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions[3]}
								onChangeText={text => this.querySuggestion(3, text)}
								value={values[3]}
							>
							{
								suggestions[3] && suggestions[3].map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(3, item)}
									>
										<View style={styles.containerItemAutoSelect}>
											<Text>{item.name}</Text>
										</View>
									</TouchableOpacity>
								)
							}
							</AutoComplete>
						</ContainerSection>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions[4]}
								onChangeText={text => this.querySuggestion(4, text)}
								value={values[4]}
							>
							{
								suggestions[4] && suggestions[4].map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(4, item)}
									>
										<View style={styles.containerItemAutoSelect}>
											<Text>{item.name}</Text>
										</View>
									</TouchableOpacity>
								)
							}
							</AutoComplete>
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
	},
	containerItemAutoSelect: {
		borderBottomWidth: 1, 
		padding: 10,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		position: 'relative'
	},
}

export default Register
