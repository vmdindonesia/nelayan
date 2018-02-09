import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import ImagePicker from 'react-native-image-picker'
import { View, ScrollView, Text, Picker, Keyboard, Alert, Image, TouchableNativeFeedback, TouchableOpacity, BackHandler, TouchableWithoutFeedback } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from '../constants'
import { setUserToken } from '../actions'

class FishLogCreate extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Tambah Fishlog',
		headerLeft: 
			<TouchableNativeFeedback
				onPress={() => 
					{
						if (navigation.state.params && navigation.state.params.change) {
							Alert.alert(
								'',
								'Yakin batal mengisi fishlog?',
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
				<Image 
					style={{marginLeft: 15, height: 26, width: 26}}
					source={require('../../assets/back-icon.png')} 
				/>
			</TouchableNativeFeedback>	
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			UserId: '1',

			FishId: '1',
			size: '',
			quantity: '',
			price: '',
			photo: null,
		}
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { params } = this.props.navigation.state
			
			if (params && params.change === true) {
				Alert.alert(
					'',
					'Yakin batal mengisi fishlog?',
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
		this.setState({[name]: v})

		this.props.navigation.setParams({change: true})
	}

	onSubmit = () => {
		Keyboard.dismiss()
		this.setState({loading: true})

		const data = this.state
		let token = this.props.user.token

		let formData = new FormData()
		formData.append('FishId', data.FishId)
		formData.append('size', data.size)
		formData.append('quantity', data.quantity)
		formData.append('price', data.price)
		if (data.photo) {
			formData.append('photo', {
				uri: data.photo.uri,
				type: 'image/jpeg',
				name: 'fishlog.jpg'
			})
		}

		axios.post(`${BASE_URL}/fishlogs`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				token
			}
		})
		.then(response => {			
			this.props.setUserToken(response.data.refreshToken)
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
						'Yakin sudah mengisi informasi dengan benar?',
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
		const {
			UserId,
			FishId,
			size,
			quantity,
			price,
			photo
		} = this.state
		console.log(price)

		return (
			<ScrollView keyboardShouldPersistTaps="always">
				<Container>
					<ContainerSection>
						<TouchableWithoutFeedback>
							<View style={{flex: 1, padding: 8}}>
								<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
									<View>
									{ photo === null ? 
										<Image
											style={{width: '100%'}}
											source={require('../../assets/uploader.png')} 
										/>
									:
										<Image style={{height: 200}} source={photo} />
									}
									</View>
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
					</ContainerSection>
					<ContainerSection>
						<Text style={{color: '#8e8e8e', paddingLeft: 5, fontSize: 16}}>Tanggal</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{paddingLeft: 5, fontSize: 16, marginBottom: 5}}>{moment().format('DD/MM/YYYY')}</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Komoditas</Text>
							<View style={styles.pickerStyle}>
								<Picker
									selectedValue={FishId}
									onValueChange={v => this.onChangeInput('FishId', v)}
								>
									<Picker.Item label="Tongkol" value="1" />
									<Picker.Item label="Tuna" value="2" />
								</Picker>
							</View>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Jumlah"
							keyboardType="numeric"
							value={quantity}
							onChangeText={v => this.onChangeInput('quantity', v)}
						/>
						<Text style={styles.unitStyle}>Kg</Text>
						<Input
							label="Ukuran"
							keyboardType="numeric"
							value={size}
							onChangeText={v => this.onChangeInput('size', v)}
						/>
						<Text style={styles.unitStyle}>Cm</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label="Harga/Kg"
							keyboardType="numeric"
							value={price ? numeral(parseInt(price)).format('0,0') : ''}
							onChangeText={v => this.onChangeInput('price', v.replace(/\./g, ''))}
						/>
					</ContainerSection>
					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</Container>
			</ScrollView>
		)
	}
}

const styles = {
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
		paddingLeft: 5,
		fontSize: 16
	},
	imageStyle: {
		
	},
	unitStyle: {
		marginTop: 30, 
		paddingRight: 30
	}
}

const mapStateToProps = state => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { setUserToken })(FishLogCreate)
