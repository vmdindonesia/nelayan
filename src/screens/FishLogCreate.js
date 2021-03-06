import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, Keyboard, Alert, ToastAndroid, Image, TouchableOpacity, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Ionicons'

import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { setUserToken, membersFetch } from '../actions'

class FishLogCreate extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Tambah Fishlog',
		headerLeft:
			<TouchableOpacity
				onPress={() => {
					if (navigation.state.params && navigation.state.params.change) {
						Alert.alert(
							'',
							'Yakin batal mengisi fishlog?',
							[
								{ text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
								{
									text: 'Ya', onPress: () => {
										navigation.setParams({ change: false })
										navigation.goBack()
									}
								},
							]
						)
					}
					else {
						navigation.goBack()
					}
				}
				}
			>
				<Icon style={{ marginLeft: 20, color: '#fff' }} name="md-arrow-back" size={24} />
			</TouchableOpacity>,
		headerRight: <View />
	})

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			loader: null,
			// form
			FishId: '',
			ProvinceId: '',
			size: '',
			quantity: '',
			price: '',
			photo: null,
			unit: 'Kg',
			//data
			fishes: [],
			provinces: [],
			ship: [],
			forge: [],

			shipSize: '',
			shipName: '',
			forgeName: '',
			MemberId: ''
		}
	}

	componentWillMount() {
		this.fetchProducts()
    this.props.membersFetch(this.props.user.token)
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { params } = this.props.navigation.state

			if (params && params.change === true) {
				Alert.alert(
					'',
					'Yakin batal mengisi fishlog?',
					[
						{ text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
						{
							text: 'Ya',
							onPress: () => {
								this.props.navigation.setParams({ change: false })
								this.props.navigation.goBack()
							}
						},
					]
				)

				return true
			}
		})
	}

	onChangeInput = (name, v) => {
		this.setState({ [name]: v })

		this.props.navigation.setParams({ change: true })
	}

	onSubmit = () => {
		Keyboard.dismiss()

		const data = this.state
		// form validation
		if (data.FishId === '') {
			ToastAndroid.show('Anda belum pilih komoditas', ToastAndroid.SHORT)
		}
		else if (data.ProvinceId === '') {
			ToastAndroid.show('Anda belum pilih Provinsi', ToastAndroid.SHORT)
		}
		else {
			this.setState({ loading: true })

			let token = this.props.user.token

			let formData = new FormData()
			formData.append('FishId', data.FishId)
			formData.append('ProvinceId', data.ProvinceId)
			formData.append('size', data.size)
			formData.append('quantity', data.quantity)
			formData.append('unit', data.unit)
			formData.append('price', data.price)
			formData.append('MyFishingGearId', data.forgeName)
			formData.append('MyShipId', data.shipName)
			formData.append('MemberId', data.MemberId)
			if (data.photo) {
				formData.append('photo', {
					uri: data.photo.uri,
					type: 'image/jpeg',
					name: 'fishlog.jpg'
				})
			}
			console.log(formData, 'Form Data');
			axios.post(`${BASE_URL}/fishlogs`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					token
				},
				timeout: REQUEST_TIME_OUT
			})
				.then(response => {
					this.props.setUserToken(response.data.refreshToken)
					this.props.navigation.setParams({ change: false })

					const resetAction = NavigationActions.reset({
						index: 1,
						actions: [
							NavigationActions.navigate({ routeName: 'Home' }),
							NavigationActions.navigate({ routeName: 'FishLogList' }),
							// NavigationActions.navigate({ routeName: 'FishLogDetail', params: {id: data.id}})
						]
					})
					this.props.navigation.dispatch(resetAction)

					this.setState({ loading: false })
					ToastAndroid.show('Berhasil tambah fishlog', ToastAndroid.SHORT)
				})
				.catch(error => {
					if (error.response) {
						ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
					}
					else {
						ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
					}

					this.setState({ loading: false })
				})
		}
	}

	fetchProducts = () => {
		this.setState({ loader: true })
		let token = this.props.user.token

		axios.get(`${BASE_URL}/fishes-products`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				this.setState({ fishes: response.data.data }, () => {
					this.fetchProvinces()
				});
			})
			.catch(error => {
				console.log('Error Di Fetch Products');
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({ loader: false })
			})
	}

	fetchProvinces = () => {
		let token = this.props.user.token

		axios.get(`${BASE_URL}/provinces`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				this.setState({ provinces: response.data.data }, () => {
					this.fetchShip();
				});
			})
			.catch(error => {
				console.log('Error Di Fetch Province');
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({ loader: false })
			})
	}

	fetchShip = () => {
		let token = this.props.user.token

		axios.get(`${BASE_URL}/supplier/my-ships`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				this.setState({ ship: response.data.data }, () => {
					this.fetchForge();
				});
				console.log(response.data.data, 'SHIP');
			})
			.catch(error => {
				console.log('Error Di Fetch Ship');
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({ loader: false })
			})
	}

	fetchForge = () => {
		let token = this.props.user.token

		axios.get(`${BASE_URL}/supplier/my-fishing-gears`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				this.setState({ forge: response.data.data })
				console.log(response.data.data, 'FORGE');

				this.setState({ loader: false })
			})
			.catch(error => {
				console.log('Error Di Fetch Forge');
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({ loader: false })
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
				onPress={
					() => Alert.alert(
						'',
						'Yakin sudah mengisi informasi dengan benar?',
						[
							{ text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
							{ text: 'Ya', onPress: () => this.onSubmit() },
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
			FishId,
			ProvinceId,
			size,
			quantity,
			price,
			photo,
			fishes,
			unit,
			provinces,
			ship,
			forge,
			shipName,
			forgeName,
			MemberId
		} = this.state

		const members = this.props.members.data

		if (this.state.loader) {
			return <Spinner size='large' />
		}

		return (
			<ScrollView keyboardShouldPersistTaps="always">
				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Info komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Nama Komoditas</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={FishId}
									onValueChange={v => this.onChangeInput('FishId', v)}
								>
									<Picker.Item label="-- Pilih Komoditas --" value="" />
									{
										fishes && fishes.map((item, index) =>
											<Picker.Item key={index} label={item.name} value={item.id} />
										)
									}
								</Picker>
							</View>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Text style={{ color: '#5e5e5e', fontSize: 14 }}>Tanggal Penangkapan</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{ color: '#5e5e5e', fontSize: 14, marginLeft: 10, fontWeight: 'bold'}}>{moment().format('DD/MM/YYYY')}</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Lokasi Penangkapan</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={ProvinceId}
									onValueChange={v => this.onChangeInput('ProvinceId', v)}
								>
									<Picker.Item label="-- Pilih Provinsi --" value="" />
									{
										provinces && provinces.map((item, index) =>
											<Picker.Item key={index} label={item.name} value={item.id} />
										)
									}
								</Picker>
							</View>
						</View>
					</ContainerSection>

					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Pilih Anggota</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={MemberId}
									onValueChange={v => this.onChangeInput('MemberId', v)}
								>
									<Picker.Item label="-- Pilih Anggota --" value="" />
									{
										members && members.map((item, index) =>
											<Picker.Item key={index} label={item.name} value={item.id} />
										)
									}
								</Picker>
							</View>
						</View>
					</ContainerSection>

					<ContainerSection>
						<Input
							label="Jumlah"
							keyboardType="numeric"
							value={quantity ? numeral(parseInt(quantity, 0)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('quantity', v.replace(/\./g, ''))}
						/>
						<Text style={styles.unitStyle}>Kg</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Ukuran"
							keyboardType="numeric"
							value={size ? numeral(parseInt(size, 0)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('size', v.replace(/\./g, ''))}
						/>
						<View style={{ marginTop: 50, marginLeft: 10, flex: 1 }}>
							<View style={styles.pickerUnitStyle}>
								<Picker
									selectedValue={unit}
									onValueChange={v => this.onChangeInput('unit', v.replace(/\./g, ''))}
								>
									<Picker.Item label="Kg" value="Kg" />
									<Picker.Item label="Cm" value="Cm" />
									<Picker.Item label="Ekor/Kg" value="Ekor/Kg" />
								</Picker>
							</View>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Harga/Kg"
							keyboardType="numeric"
							value={price ? numeral(parseInt(price, 0)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
						/>
					</ContainerSection>

					<ContainerSection>
						<Text style={styles.headerStyle}>
							Peralatan
						</Text>
					</ContainerSection>

					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Pilih Kapal</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={shipName}
									onValueChange={v => this.onChangeInput('shipName', v)}
								>
									<Picker.Item label='-- Pilih Kapal --' value='' />
									{
										ship && ship.map((item, index) =>
											<Picker.Item key={index} label={item.name} value={item.id} />
										)
									}
								</Picker>
							</View>
						</View>
					</ContainerSection>

					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Alat Tangkap</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={forgeName}
									onValueChange={v => this.onChangeInput('forgeName', v)}
								>
									<Picker.Item label='-- Pilih Alat --' value='' />
									{
										forge && forge.map((item, index) =>
											<Picker.Item key={index} label={item.FishingGear.name} value={item.id} />
										)
									}
								</Picker>
							</View>
						</View>
					</ContainerSection>

					<ContainerSection>
						<Text style={styles.headerStyle}>
							Foto Komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{ color: '#5e5e5e', fontSize: 14 }}>Ambil Foto Komoditas</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
							<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
								<View>
									{photo === null ?
										<Image
											source={require('../../assets/ic_add_a_photo.png')}
										/>
										:
										<Image style={{ height: 200, width: 300 }} source={photo} />
									}
								</View>
							</TouchableOpacity>
						</View>
					</ContainerSection>
					<View style={{ marginTop: 20, marginBottom: 20 }}>
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
	headerStyle: {
		color: COLOR.secondary_a,
		fontSize: 18,
	},
	pickerContainer: {
		flex: 1,
		marginBottom: 5,
	},
	pickerStyle: {
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7,
		borderWidth: 1,
		backgroundColor: '#fff'
	},
	pickerUnitStyle: {
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7,
		borderWidth: 1,
		height: 46,
		backgroundColor: '#fff'
	},
	pickerTextStyle: {
		color: '#5e5e5e',
		fontSize: 14,
		flex: 1,
		marginTop: 10,
		marginBottom: 10
	},
	unitStyle: {
		marginTop: 55,
		flex: 1,
		marginLeft: 20,
		fontSize: 16,
		color: '#000'
	},
}

const mapStateToProps = state => {
	const { members, user } = state

	return { members, user }
}

export default connect(mapStateToProps, { setUserToken, membersFetch })(FishLogCreate)
