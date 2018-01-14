import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { View, Text, Picker, Keyboard, Alert, Image, TouchableNativeFeedback, BackHandler } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from '../constants'

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
									{text: 'Ya', onPress: () => navigation.goBack()},
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
			photo: 'ikan.jpg',
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
						{text: 'Ya', onPress: () => this.props.navigation.goBack()},
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

		axios.post(`${BASE_URL}/fishlogs`, data, {
			headers: {'x-access-token': token}
		})
		.then(response => {
			console.log(response)
			if (response.status === 200) {
				this.props.navigation.navigate('FishLogList')
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
		console.log(this.props.navigation.state.params)
		const {
			UserId,
			FishId,
			size,
			quantity,
			price,
			photo
		} = this.state

		return (
			<View>
				<Container>
					<ContainerSection>
						<Text style={{color: '#8e8e8e', paddingLeft: 5, fontSize: 16}}>Tanggal</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{paddingLeft: 5, fontSize: 16, marginBottom: 5}}>02/01/2018</Text>
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
							value={price}
							onChangeText={v => this.onChangeInput('price', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						{this.renderButton()}
					</ContainerSection>
				</Container>
			</View>
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

export default connect(mapStateToProps)(FishLogCreate)
