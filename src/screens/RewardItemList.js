import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { itemsFetch, rewardHistoriesFetch, setUserToken } from '../actions'
import { Spinner } from '../components/common'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'

class RewardItemList extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			loading: false
		}
	}

	componentWillMount() {
		this.props.itemsFetch(this.props.user.token)
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
			ItemId: item.id
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
				`Berhail menukarkan poin dengan ${item.name}`,
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
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback 
				onPress={() => this.itemPressed(item)}
			>
				<View style={styles.itemContainerStyle}>
					<View style={styles.thumbnailContainerStyle}>
						<Image 
							style={styles.thumbnailStyle}
							source={
								item.photo ?
									{uri: `${BASE_URL}/images/${item.photo}`}
								:
									require('../../assets/coin.png')	
							}
						/>
					</View>
					<View style={styles.headerContentStyle}>
						<Text style={{fontWeight: 'bold'}}>{item.name}</Text>
						<Text>({item.pointAmount}) poin</Text>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
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
					numColumns={2}
					onRefresh={() => this.props.itemsFetch(this.props.user.token)}
					refreshing={this.props.items.loading}
				/>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		flex: 1,
		margin: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		elevation: 1,
		backgroundColor: '#fff'
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	thumbnailStyle: {
		height: 30,
		width: 30,
		borderRadius: 5
	},
	headerContentStyle: {
		flex: 1,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	hedaerTextStyle: {
		fontSize: 20,
	}
}

const mapStateToProps = state => {
	const { items, user } = state

	return { items, user }
}

export default connect(mapStateToProps, { itemsFetch, rewardHistoriesFetch, setUserToken })(RewardItemList)

