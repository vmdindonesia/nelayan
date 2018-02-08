import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { itemsFetch } from '../actions'
import { Spinner } from '../components/common'
import { BASE_URL } from '../constants'

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
			`Apakah benar ingin menukarkan ${item.pointAmount} poin dengan ${item.name} ?`,
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
			headers: {token}
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
							source={require('../../assets/coin.png')}
						/>
					</View>
					<View style={styles.headerContentStyle}>
						<View style={{flexDirection: 'row'}}>
							<Text style={{flex: 1}}>{item.name}</Text>
						</View>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		if (this.props.items.loading || this.state.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{ flex: 1, padding: 15}}>
				<FlatList
					data={this.props.items.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					numColumns={2}
				/>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		flex: 1,
		borderWidth: 1,
		margin: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
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

export default connect(mapStateToProps, {itemsFetch})(RewardItemList)

