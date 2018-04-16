import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import { NavigationActions } from 'react-navigation'
import { View, ScrollView, Text, Picker, Keyboard, TouchableOpacity, Alert, ToastAndroid, Image, BackHandler } from 'react-native'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'

import ImagePicker from 'react-native-image-picker'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'

class FishlogDetail extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Detail Fishlog',
		headerLeft: 
			<TouchableOpacity
				onPress={() => 
					{
						if (navigation.state.params && navigation.state.params.change) {
							Alert.alert(
								'',
								'Yakin batal mengubah fishlog?',
								[
									{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
									{text: 'Ya', 
									onPress: () => {
										navigation.setParams({change: false})
										navigation.goBack()
									}},
								]
							)
						}
						else {
							navigation.goBack()
						}
					}
				}
			>
				<Icon style={{marginLeft: 20, color: '#fff'}} name="md-arrow-back" size={24} />
			</TouchableOpacity>,
		headerRight:
			<Button
				style={{ margin: 5, marginRight: 10 }}
				onPress={
					() => {
						const createdAt = moment(navigation.state.params.fishLog.createdAt, 'YYYY-MM-DD')
						const now = moment()
						const diff = now.diff(createdAt, 'days')
						console.log(diff, '-----diff')
						if (diff > 1) {
							ToastAndroid.show('Fislog tidak dapat di edit setelah 1x24 Jam', ToastAndroid.SHORT)
						}
						else {
							navigation.navigate('FishLogEdit', {id: navigation.state.params.fishLog.id})
						}
					}
				}
			>
				Ubah
			</Button>
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			loadingPage: true,
			data: {},
			photo: null,
			fishes: [],
			provinces: []
		}
	}

	componentWillMount() {
		this.fetchData()
		this.fetchProducts()
		this.fetchProvinces()
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { params } = this.props.navigation.state
			
			if (params && params.change === true) {
				Alert.alert(
					'',
					'Yakin batal mengubah fishlog?',
					[
						{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
						{text: 'Ya', 
						onPress: () => {
							this.props.navigation.setParams({change: false})
							this.props.navigation.goBack()
						}},
					]
				)

				return true
			}
		})
	}

	onChangeInput = (name, v) => {
		const { data } = this.state
		data[name] = v
		this.setState({data})

		this.props.navigation.setParams({change: true})
	}

	fetchData = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/fishlogs/${id}`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT

		})
		.then(response => {
			this.setState({
				data: response.data.data,
				loadingPage: false
			})

			this.props.navigation.setParams({fishLog: response.data.data})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loadingPage: false})
		})
	}

	fetchProducts = () => {
		this.setState({loadingPage: true})
		let token = this.props.user.token

		axios.get(`${BASE_URL}/fishes-products`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {			
			this.setState({fishes: response.data.data})

			this.setState({loadingPage: false})
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

	fetchProvinces = () => {
		this.setState({loading: true})
		let token = this.props.user.token

		axios.get(`${BASE_URL}/provinces`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {			
			this.setState({provinces: response.data.data})

			this.setState({loading: false})
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

	render() {
		const { data, loadingPage, photo, fishes, provinces } = this.state

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
							Info komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Komoditas</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={data.Fish && data.Fish.name}
							editable={false}
						/>	
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Tanggal Penangkapan</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={moment(data.createdAt).format('DD/MM/YYYY')}
							editable={false}
						/>	
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Lokasi Penangkapan</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={((provinces.length > 0) && provinces[data.ProvinceId]) ? provinces[data.ProvinceId].name : ''}
							editable={false}
						/>	
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Jumlah"
							keyboardType="numeric"
							value={numeral(parseInt(data.quantity, 0)).format('0,0')}
							onChangeText={v => this.onChangeInput('quantity', v)}
							editable={false}
						/>
						<Text style={styles.unitStyle}>Kg</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Ukuran"
							keyboardType="numeric"
							value={numeral(parseInt(data.size, 0)).format('0,0')}
							onChangeText={v => this.onChangeInput('size', v)}
							editable={false}
						/>
						<View style={{marginTop: 50, marginLeft: 10, flex: 1}}>
							<Input
								value={data.unit}
								editable={false}
							/>	
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Harga/Kg"
							keyboardType="numeric"
							value={data.price ? numeral(parseInt(data.price, 0)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
							editable={false}
						/>
					</ContainerSection>

					<ContainerSection>
						<Text style={styles.headerStyle}>
							Peralatan
						</Text>
					</ContainerSection>

					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Kapal</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={data.MyShip && data.MyShip.name}
							editable={false}
						/>	
					</ContainerSection>

					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Alat Tangkap</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={(data.MyFishingGear && data.MyFishingGear.FishingGear) ? data.MyFishingGear.FishingGear.name : ''}
							editable={false}
						/>	
					</ContainerSection>

					<ContainerSection>
						<Text style={styles.headerStyle}>
							Foto Komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5}}>
							<TouchableOpacity>
								<View>
								{ photo === null ? 
										<Image
											source={{uri: `${BASE_URL}/images/${data.photo}`}}
											style={{height: 200, width: 300}}
										/>
									:
										<Image style={{height: 200, width: 300}} source={photo} />
								}
								</View>
							</TouchableOpacity>
						</View>
					</ContainerSection>
					
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
	formWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(FishlogDetail)
