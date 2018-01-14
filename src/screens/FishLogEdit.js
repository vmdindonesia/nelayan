import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, Picker, Keyboard, Alert, Image, TouchableNativeFeedback, BackHandler } from 'react-native'
import axios from 'axios'
import { BASE_URL } from '../constants'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'

class FishLogEdit extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Ubah Fishlog',
		headerLeft: 
			<TouchableNativeFeedback
				onPress={() => 
					{
						if (navigation.state.params && navigation.state.params.change) {
							Alert.alert(
								'',
								'Yakin batal mengubah fishlog?',
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
			data: {},
		}
	}

	componentWillMount() {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/fishlogs/${id}`, {
			headers: {'x-access-token': token}
		})
		.then(response => {
			this.setState({data: response.data.data})
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

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { params } = this.props.navigation.state
			
			if (params && params.change === true) {
				Alert.alert(
					'',
					'Yakin batal mengubah fishlog?',
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

		axios.put(`${BASE_URL}/fishlogs/${id}`, data, {
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
		const { data } = this.state
			console.log(this.state)

		return (
			<View>
				<Container>
					<ContainerSection>
						<Text style={{color: '#8e8e8e', paddingLeft: 5, fontSize: 16}}>Tanggal</Text>
					</ContainerSection>
					<ContainerSection>
						<Text style={{paddingLeft: 5, fontSize: 16, marginBottom: 5}}>{data.createdAt}</Text>
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
						<Input
							label="Jumlah"
							keyboardType="numeric"
							value={data.quantity && data.quantity.toString()}
							onChangeText={v => this.onChangeInput('quantity', v)}
						/>
						<Text style={styles.unitStyle}>Kg</Text>
						<Input
							label="Ukuran"
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
							value={data.price && data.price.toString()}
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

export default connect(mapStateToProps)(FishLogEdit)
