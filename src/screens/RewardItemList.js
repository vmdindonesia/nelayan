import React, { Component } from 'react'
import { FlatList, Picker, View, Image, Text, TouchableNativeFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from 'react-native-modal'

import { itemsFetch, rewardHistoriesFetch, setUserToken, membersFetch } from '../actions'
import { Spinner, Button, ContainerSection } from '../components/common'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'

class RewardItemList extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			MemberId: '',
			isModalVisible: false,
			itemPressed: {},
			memberName: ''
		}
	}

	componentWillMount() {
    this.props.membersFetch(this.props.user.token)
		this.props.itemsFetch(this.props.user.token)
	}

	onChangeInput = (name, v) => {
		memberName = this.props.members.data ? this.props.members.data.find(x => x.id === v).name : ''
		console.log(memberName, '---memberName')
		this.setState({ 
			MemberId: v,
			memberName
		})
	}

	_toggleModal = (name, item) => {
		this.setState({ 
			[name]: !this.state[name],
			itemPressed: (item === '' ? {} : item)
		})
	}

	itemPressed = (item) => {
		Alert.alert(
			'Tukarkan Poin',
			`Yakin ingin menukarkan ${item.pointAmount} poin dengan ${item.name} ?`,
			[
				{text: 'Batal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'Tukar', onPress: () => this.buyItem(item)},
			]
		)
	}

	buyItem = (item) => {
		this.setState({loading: true})

		let token = this.props.user.token
		let data = {
			ItemId: item.id,
		}
		let recepient = this.props.user.data.name

		if (this.state.MemberId !== '') {
			data = {
				ItemId: item.id,
				MemberId: this.state.MemberId
			}

			recepient = this.state.memberName
		}

		axios.post(`${BASE_URL}/supplier/rewards`, data, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			this.setState({
				loading: false,
			})

			Alert.alert(
				'Sukses',
				`Berhail menukarkan poin ${recepient} dengan ${item.name}`,
				[]
			)

			this.props.rewardHistoriesFetch(token)
			this.props.setUserToken(response.data.refreshToken)
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

		this._toggleModal('isModalVisible', '')
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback >
				<View style={styles.itemContainerStyle}>
					<Image 
						style={styles.thumbnailStyle}
						resizeMode="contain"
						source={
							item.photo ?
								{uri: `${BASE_URL}/images/${item.photo}`}
							:
								require('../../assets/coin.png')	
						}
					/>
					<View style={{flexDirection: 'row'}}>
						<View style={styles.headerContentStyle}>
							<Text style={{fontWeight: 'bold'}}>{item.name}</Text>
							<Text>{item.pointAmount} poin</Text>
						</View>
						<View style={{ height: 35, width: 100, paddingTop: 2}}>
							<Button textStyle={{paddingTop: 5}} onPress={() => this._toggleModal('isModalVisible', item)}>
								Tukarkan
							</Button>
						</View>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		const members = this.props.members.data
		const { itemPressed, MemberId } = this.state

		if (this.state.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{ flex: 1, paddingLeft: 15, paddingRight: 15}}>
				<FlatList
					data={this.props.items.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					onRefresh={() => this.props.itemsFetch(this.props.user.token)}
					refreshing={this.props.items.loading}
				/>

				<Modal
					isVisible={this.state.isModalVisible}
					onBackdropPress={() => this.setState({ isModalVisible: false })}
				>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{ backgroundColor: 'white', borderRadius: 2, padding: 10 }}>
							<Text style={{ textAlign: 'center' }}>Pilih Penerima</Text>
							<View style={{ margin: 10 }}>
								<ContainerSection>
									<View style={styles.pickerContainer}>
										<Text style={styles.pickerTextStyle}>Pilih Anggota</Text>
										<View style={styles.pickerStyle}>
											<Picker
												selectedValue={MemberId}
												onValueChange={v => this.onChangeInput('MemberId', v)}
											>
												<Picker.Item label="-- Pilih Penerima --" value="" />
												<Picker.Item label={this.props.user.data.name} value="" />
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
									<Button
										onPress={() => this.itemPressed(itemPressed)}
									>
										Tukarkan
									</Button>
								</ContainerSection>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		flex: 1,
		margin: 1,
		marginBottom: 10,
		elevation: 1,
		backgroundColor: '#fff',
		paddingLeft: 10,
		paddingRight: 10
	},
	thumbnailStyle: {
		height: 100,
		width: '100%',
	},
	headerContentStyle: {
		flex: 1,
		marginRight: 15,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	hedaerTextStyle: {
		fontSize: 20,
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
}

const mapStateToProps = state => {
	const { items, user, members } = state

	return { items, user, members }
}

export default connect(mapStateToProps, { itemsFetch, rewardHistoriesFetch, setUserToken, membersFetch })(RewardItemList)

