import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { View, Text, Picker, Keyboard } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import { BASE_URL } from '../constants'

class FishLogCreate extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			UserId: '1',
			FishId: '1',
			size: '',
			capacity: '',
			price: '',
			photo: 'ikan.jpg'
		}
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})
	}

	postFishLog = () => {
		console.log('masuk')
		// Keyboard.dismiss()
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
			<Button onPress={() => this.postFishLog()}>
				Simpan
			</Button>
		)
	}

	render() {
		const {
			UserId,
			FishId,
			size,
			capacity,
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
							value={capacity}
							onChangeText={v => this.onChangeInput('capacity', v)}
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
		// flex: 1,
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
