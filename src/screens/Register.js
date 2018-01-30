import React, { Component } from 'react'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'
import { ScrollView, Text, Picker, Alert, Keyboard, TouchableOpacity, View, Image, TouchableWithoutFeedback, PixelRatio } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from '../constants'
import AutoComplete from '../components/AutoComplete'

class Register extends Component {
	static navigationOptions = {
		title: 'Registrasi'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			organizationType: 'Kelompok Nelayan',
			organization: '',
			CityId: '',
			subDistrict: '',
			village: '',

			name: '',
			idNumber: '',
			phone: '',
			email: '',
			password: '',
			confirmPassword: '',

			loading: false,
			suggestions: [],
			values: [],
			FishIds: [],
			loadings: [false, false, false, false, false],

			loadingCity: false,
			suggestionsCity: [],
			valueCity: '',

			photo: null,
			idPhoto: null,
		}
	}

	onCitySelected = (item) => {
		this.setState({
			suggestionsCity: [],
			CityId: item.id,
			valueCity: item.name
		})
	}

	onItemSelected = (index, item) => {
		const { FishIds, values } = this.state
		FishIds[index] = item.id
		values[index] = item.name

		this.setState({
			suggestions: [],
			FishIds,
			values
		})
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})
	}

	selectPhotoTapped = (name) => {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		}

		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled photo picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };

				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					[name]: source
				});
			}
		});
	}

	queryCitySuggestion = (text) => {
		this.setState({
			valueCity: text,
			loadingCity: true
		})
		
		axios.get(`${BASE_URL}/cities/search?key=${text}`)
		.then(response => {
			res = response.data.data
			this.setState({suggestionsCity: res, loadingCity: false})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loadingCity: false})
		})
	}

	querySuggestion = (index, text) => {
		const { values, suggestions, loadings } = this.state
		values[index] = text
		loadings[index] = true

		this.setState({
			values, loadings
		})

		axios.get(`${BASE_URL}/fishes/search?key=${text}`)
		.then(response => {
			res = response.data.data
			suggestions[index] = res
			loadings[index] = false
			this.setState({suggestions, loadings})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			loadings[index] = false
			this.setState({loadings})
		})
	}

	// to do: form validation
	// 

	register = () => {
		Keyboard.dismiss()
		this.setState({loading: true})
		
		const data = this.state

		let formData = new FormData()
		// organization data
		formData.append('organizationType', data.organizationType)
		formData.append('CityId', data.CityId)
		formData.append('subDistrict', data.subDistrict)
		formData.append('village', data.village)
		// personal data
		if (data.photo) {
			formData.append('photo', {
				uri: data.photo.uri,
				type: 'image/jpeg',
				name: 'profile.jpg'
			})
		}
		formData.append('name', data.name)
		formData.append('idNumber', data.idNumber)
		if (data.idPhoto) {
			formData.append('idPhoto', {
				uri: data.idPhoto.uri,
				type: 'image/jpeg',
				name: 'ktp.jpg'
			})
		}
		formData.append('phone', data.phone)
		formData.append('email', data.email)
		formData.append('password', data.password)
		// komoditas data
		data.FishIds.map((item, index) =>
			formData.append(`FishIds[${index}]`, item)
		)

		axios.post(`${BASE_URL}/supplier/register`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
		.then(response => {
			console.log(response.status)

			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({ routeName: 'Login'})
				]
			})
			this.props.navigation.dispatch(resetAction)
			Alert.alert('Registrasi berhasil', `Silahkan cek email anda ${data.email} untuk verifikasi email`, [])

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
			organizationType,
			CityId,
			subDistrict,
			village,

			name,
			idNumber,
			phone,
			email,
			password,
			confirmPassword,

			suggestions,
			values,
			loadings,

			loadingCity,
			suggestionsCity,
			valueCity,

			idPhoto,
			photo
		} = this.state

		console.log(this.state)

		return (
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
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Jenis Nelayan</Text>
							<View style={styles.pickerStyle}>
								<Picker
									style={{ flex: 1 }}
									selectedValue={organizationType}
									onValueChange={v => this.onChangeInput('organizationType', v)}
								>
									<Picker.Item label="Kelompok Nelayan" value="Kelompok Nelayan" />
									<Picker.Item label="Personal" value="Personal" />
								</Picker>
							</View>
						</View>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Kota / Kabupaten"
							suggestions={suggestionsCity}
							onChangeText={text => this.queryCitySuggestion(text)}
							value={valueCity}
						>
						{
							loadingCity ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
								suggestionsCity && suggestionsCity.map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onCitySelected(item)}
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
						<Input
							label='Kecamatan'
							placeholder='contoh: Antapani'
							value={subDistrict}
							onChangeText={v => this.onChangeInput('subDistrict', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Desa/Kelurahan'
							placeholder='contoh: Antapani Kidul'
							value={village}
							onChangeText={v => this.onChangeInput('village', v)}
						/>
					</ContainerSection>
				</Container>

				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							INFORMASI PERSONAL
						</Text>
					</ContainerSection>
					<ContainerSection>
						<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
							<View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
							{ photo === null ? <Text>Foto profil</Text> :
								<Image style={styles.avatar} source={photo} />
							}
							</View>
						</TouchableOpacity>

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

					<Text style={[styles.pickerTextStyle, {marginLeft: 5, marginTop: 10}]}>Upload Foto KTP</Text>
					<ContainerSection>
						<TouchableWithoutFeedback>
							<View style={{flex: 1, padding: 8}}>
								<TouchableOpacity onPress={() => this.selectPhotoTapped('idPhoto')}>
									<View>
									{ idPhoto === null ? 
										<Image
											source={require('../../assets/uploader-ktp.png')} 
										/>
									:
										<Image style={{height: 200}} source={idPhoto} />
									}
									</View>
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
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
							label="Nama Komoditas 1"
							suggestions={suggestions[0]}
							onChangeText={text => this.querySuggestion(0, text)}
							value={values[0]}
						>
						{
							loadings[0] ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
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
							label="Nama Komoditas 2"
							suggestions={suggestions[1]}
							onChangeText={text => this.querySuggestion(1, text)}
							value={values[1]}
						>
						{
							loadings[1] ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
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
							label="Nama Komoditas 3"
							suggestions={suggestions[2]}
							onChangeText={text => this.querySuggestion(2, text)}
							value={values[2]}
						>
						{
							loadings[2] ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
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
							label="Nama Komoditas 4"
							suggestions={suggestions[3]}
							onChangeText={text => this.querySuggestion(3, text)}
							value={values[3]}
						>
						{
							loadings[3] ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
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
							label="Nama Komoditas 5"
							suggestions={suggestions[4]}
							onChangeText={text => this.querySuggestion(4, text)}
							value={values[4]}
						>
						{
							loadings[4] ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
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
		)
	}
}

const styles = {
	containerStyle: {
		
	},
	headerStyle: {
		marginLeft: 5
	},
	pickerContainer: {
		flex: 1, 
		height: 65,
		marginBottom: 5
	},
	pickerStyle: {
		flex: 1,
		borderBottomWidth: 1,
		borderColor: '#716c6c',
		marginRight: 3,
		marginLeft: 3,
	},
	pickerTextStyle: {
		color: '#8e8e8e',
		fontSize: 16,
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
	avatarContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1 / PixelRatio.get(),
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	avatar: {
		borderRadius: 75,
		width: 100,
		height: 100
	}
}

export default Register
