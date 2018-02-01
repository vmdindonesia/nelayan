import React, { Component } from 'react'
import { ScrollView, Text, Picker, KeyboardAvoidingView, Alert, Keyboard, TouchableOpacity, View, Image, TouchableWithoutFeedback, PixelRatio } from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import axios from 'axios'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import AutoComplete from '../components/AutoComplete'
import { BASE_URL } from '../constants'

class ProfileEdit extends Component {
	static navigationOptions = {
		title: 'Ubah Profil'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},

			loadingCity: false,
			suggestionsCity: [],
			valueCity: '',

			photo: null,
			idPhoto: null
		}
	}

	componentDidMount() {
		this.getData()
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
		let data = this.state.data
		data[name] = v

		this.setState({data})
	}

	getData = () => {
		this.setState({loading: true})
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/profile`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.user})
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
				})
			}
		})
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
				Simpan
			</Button>
		)
	}

	render() {
		const { 
			data, 
			loading,

			loadingCity,
			suggestionsCity,
			valueCity,

			photo,
			idPhoto
		} = this.state

		if (loading) {
			return <Spinner size='large' />
		}

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
									selectedValue={data ? data.organizationType : ''}
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
							value={data ? data.subDistrict : ''}
							onChangeText={v => this.onChangeInput('subDistrict', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Desa/Kelurahan'
							placeholder='contoh: Antapani Kidul'
							value={data ? data.village : ''}
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
							{ photo === null ? 
									<Image style={styles.avatar} source={{uri: `${BASE_URL}/images/${data.photo}`}} />
								:
									<Image style={styles.avatar} source={photo} />
							}
							</View>
						</TouchableOpacity>

						<Input
							label='Nama Lengkap'
							placeholder='contoh: Ahmad Darudi'
							value={data ? data.name : ''}
							onChangeText={v => this.onChangeInput('name', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='No. KTP'
							placeholder='contoh: 321317989029'
							keyboardType="numeric"
							value={data ? data.idNumber : ''}
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
										<Image style={{height: 200}} source={{uri: `${BASE_URL}/images/${data.idPhoto}`}} />
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
							value={data ? data.phone : ''}
							onChangeText={v => this.onChangeInput('phone', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Email'
							placeholder='contoh: erwin@gmail.com'
							value={data ? data.email : ''}
							onChangeText={v => this.onChangeInput('email', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							placeholder='minimal 6 karakter'
							secureTextEntry
							value={data ? data.password : ''}
							onChangeText={v => this.onChangeInput('password', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Konfirmasi Password'
							placeholder='minimal 6 karakter'
							secureTextEntry
							value={data ? data.confirmPassword : ''}
							onChangeText={v => this.onChangeInput('confirmPassword', v)}
						/>
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

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(ProfileEdit)
