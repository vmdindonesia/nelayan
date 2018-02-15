import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import { NavigationActions } from 'react-navigation'
import { View, ScrollView, Text, Picker, Keyboard, TouchableOpacity, Alert, Image, TouchableNativeFeedback, BackHandler } from 'react-native'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'

import ImagePicker from 'react-native-image-picker'
import { BASE_URL, COLOR } from '../constants'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'

class FishLogEdit extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Ubah Fishlog',
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
									{text: 'Ya', onPress: () => {
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
		headerRight: <View />
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			loadingPage: true,
			data: {},
			photo: null
		}
	}

	componentWillMount() {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/fishlogs/${id}`, {
			headers: {token}
		})
		.then(response => {
			this.setState({
				data: response.data.data,
				loadingPage: false
			})
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

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { params } = this.props.navigation.state
			
			if (params && params.change === true) {
				Alert.alert(
					'',
					'Yakin batal mengubah fishlog?',
					[
						{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
						{text: 'Ya', onPress: () => {
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

	onSubmit = () => {
		let id = this.props.navigation.state.params.id
		let { data } = this.state
		let token = this.props.user.token

		Keyboard.dismiss()
		this.setState({loading: true})

		let formData = new FormData()
		formData.append('FishId', data.FishId)
		formData.append('size', data.size)
		formData.append('quantity', data.quantity)
		formData.append('price', data.price)
		if (this.state.photo) {
			formData.append('photo', {
				uri: this.state.photo.uri,
				type: 'image/jpeg',
				name: 'fishlog.jpg'
			})
		}

		axios.put(`${BASE_URL}/fishlogs/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				token
			}
		})
		.then(response => {
			this.props.navigation.setParams({change: false})
			
			const resetAction = NavigationActions.reset({
				index: 1,
				actions: [
					NavigationActions.navigate({ routeName: 'Home'}),
					NavigationActions.navigate({ routeName: 'FishLogList'})
				]
			})
			this.props.navigation.dispatch(resetAction)

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
						'Yakin ingin merubah data?',
						[
							{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
							{text: 'Ya', onPress: () => this.onSubmit()},
						]
					)
				}
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
							Info komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Komoditas</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={data.FishId && data.FishId.toString()}
									onValueChange={v => this.onChangeInput('FishId', v)}
								>
									<Picker.Item label="Tongkol" value="1" />
									<Picker.Item label="Tuna" value="2" />
								</Picker>
							</View>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Tanggal</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							value={moment(data.createdAt).format('DD/MM/YYYY')}
							editable={false}
						/>	
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', paddingLeft: 5, fontSize: 14}}>Jumlah & Ukuran</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							keyboardType="numeric"
							value={data.quantity && data.quantity.toString()}
							onChangeText={v => this.onChangeInput('quantity', v)}
						/>
						<Text style={styles.unitStyle}>Kg</Text>
						<Input
							keyboardType="numeric"
							value={data.size && data.size.toString()}
							onChangeText={v => this.onChangeInput('size', v)}
						/>
						<Text style={styles.unitStyle}>Cm</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Harga/Kg"
							keyboardType="numeric"
							value={data.price ? numeral(parseInt(data.price)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
						/>
					</ContainerSection>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Foto Komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#5e5e5e', fontSize: 14}}>Ambil Foto Komoditas</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5}}>
							<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
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
	},
	pickerTextStyle: {
		color: '#5e5e5e',
		fontSize: 14,
		flex: 1,
		marginTop: 10,
		marginBottom: 10
	},
	imageStyle: {
		
	},
	unitStyle: {
		marginTop: 25, 
		paddingRight: 20,
		marginLeft: 5
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

export default connect(mapStateToProps)(FishLogEdit)
