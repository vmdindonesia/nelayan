import React, { Component } from 'react'
import { View, ScrollView, Text, Keyboard, ToastAndroid, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import axios from 'axios'
import ImagePicker from 'react-native-image-picker'

import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'

class PeralatanEdit extends Component {
	static navigationOptions = {
		title: 'Ubah Anggota',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			loadingPage: true,
			data: {},
			photo: null,
		}
	}

	componentWillMount() {
		this.fetchData()
	}

	onChangeInput = (name, v) => {
		const { data } = this.state
		data[name] = v
		this.setState({data})
	}

	onSubmit = () => {
		let id = this.props.navigation.state.params.id
		let { data } = this.state
		let token = this.props.user.token

		Keyboard.dismiss()

		// form validation
		if (data.name === '') {
			ToastAndroid.show('Anda belum mengisi nama', ToastAndroid.SHORT)
		}
		else {
			this.setState({loading: true})
			let formData = new FormData()
			formData.append('name', data.name)
			formData.append('phone', data.phone)
			formData.append('address', data.address)
			formData.append('idNumber', data.idNumber)
			if (this.state.photo) {
				formData.append('photo', {
					uri: this.state.photo.uri,
					type: 'image/jpeg',
					name: 'fishlog.jpg'
				})
			}

			axios.put(`${BASE_URL}/supplier/members/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					token
				},
				timeout: REQUEST_TIME_OUT
			})
			.then(() => {
				const resetAction = NavigationActions.reset({
					index: 1,
					actions: [
						NavigationActions.navigate({ routeName: 'Home'}),
						NavigationActions.navigate({ routeName: 'MemberList'})
					]
				})
				this.props.navigation.dispatch(resetAction)

				this.setState({loading: false})
				ToastAndroid.show('Berhasil ubah anggota', ToastAndroid.SHORT)
			})
			.catch(error => {
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({loading: false})
			})
		}
	}

	fetchData = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/supplier/members/${id}`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			this.setState({
				data: response.data.data,
				loadingPage: false
			})
		})
		.catch(error => {
			if (error.response) {
				ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
			}
			this.setState({loadingPage: false})
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

		ImagePicker.launchCamera(options, (response) => {
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

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button
				onPress={() => this.onSubmit()}
			>
				Simpan
			</Button>
		)
	}

	render() {
		const { data, loadingPage, photo } = this.state

		if (loadingPage) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<ScrollView keyboardShouldPersistTaps="always">
				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Data Anggota
						</Text>
					</ContainerSection>
					
					<ContainerSection>
						<Input
							label="Nama Lengkap"
							placeholder="Nama Lengkap"
							value={data.name}
							onChangeText={v => this.onChangeInput('name', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							multiline
							label="Alamat"
							placeholder="Alamat"
							value={data.address}
							lines={5}
							textAlignVertical="top"
							onChangeText={v => this.onChangeInput('address', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="No. KTP"
							keyboardType="numeric"
							value={data.idNumber}
							onChangeText={v => this.onChangeInput('idNumber', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="No. Telpon / Handphone"
							keyboardType="numeric"
							value={data.phone}
							onChangeText={v => this.onChangeInput('phone', v)}
						/>
					</ContainerSection>

					<Text style={[styles.pickerTextStyle, {marginLeft: 5, marginTop: 10}]}>Upload Foto Anggota</Text>
					<ContainerSection>
						<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
							<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
								<View>
								{ photo === null ?
										<Image style={styles.avatar} source={{uri: `${BASE_URL}/images/${data.photo}`}} /> 
									:
										<Image style={styles.avatar} source={photo} />
								}
								</View>
							</TouchableOpacity>
						</View>
					</ContainerSection>
				
					<View style={{marginTop: 20, marginBottom: 20}}>
						<ContainerSection>
							{this.renderButton()}
						</ContainerSection>
					</View>
				</Container>
			</ScrollView>
		)
	}
}

const styles = {
	pickerTextStyle: {
		color: '#5e5e5e',
		fontSize: 14,
		flex: 1,
		marginTop: 10,
		marginBottom: 10
	},
	headerStyle: {
		color: COLOR.secondary_a,
		fontSize: 18,
	},
	formWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7
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

export default connect(mapStateToProps)(PeralatanEdit)

