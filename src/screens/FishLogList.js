import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback, Picker } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import numeral from 'numeral'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'

import { fishLogsFetch } from '../actions'
import { Spinner, Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class FishLogList extends Component {
	static navigationOptions = {
		title: 'Fishlog',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			fishName: '',
			fishes: []
		}
	}

	componentWillMount() {
		this.props.fishLogsFetch(this.props.user.token, '')

		this.fetchProducts()
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})

		// search params
		let params = `key=${v}`
		this.props.fishLogsFetch(this.props.user.token, params)
	}

	fetchProducts = () => {
		let token = this.props.user.token

		axios.get(`${BASE_URL}/fishes-products`, {
			headers: {token}
		})
		.then(response => {			
			this.setState({fishes: response.data.data})
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

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback 
					onPress={() => this.props.navigation.navigate('FishLogEdit', {id: item.id})}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${item.photo}`}} 
							/>
						</View>
						<View style={styles.headerContentStyle}>
							<Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
							<Text style={styles.hedaerTextStyle}>{item.Fish.name}</Text>
							<View style={{flexDirection: 'row'}}>
								<Text style={{flex: 1}}>{item.quantity} Kg</Text>
								<Text style={{flex: 1}}>{item.size} Cm</Text>
								<Text style={{flex: 1, textAlign: 'right'}}>Rp {numeral(item.price).format('0,0')}</Text>
							</View>
						</View>
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {	
		const { fishName, fishes } = this.state

		if (this.props.fishLogs.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				<View style={styles.pickerContainer}>
					<View style={styles.pickerStyle}>
						<Icon name='md-search' size={24} style={{position: 'absolute', margin: 13}} />
						<Picker
							selectedValue={fishName}
							onValueChange={v => this.onChangeInput('fishName', v)}
						>
							<Picker.Item label="       Cari Fishlog..." value="" />
							{
								fishes && fishes.map((item, index) => 
									<Picker.Item key={index} label={`       ${item.name}`} value={item.name} />
								)
							}
						</Picker>
					</View>
				</View>

				<FlatList
					data={this.props.fishLogs.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
				/>

				<ActionButton
					buttonColor={COLOR.secondary_b}
					onPress={() => this.props.navigation.navigate('FishLogCreate')}
				/>

			</View>
		)
	}
}

const styles = {
	pickerContainer: {
		margin: 15,
		marginBottom: 5,
	},
	pickerStyle: {
		borderRadius: 2,
		paddingLeft: 7,
		elevation: 1
	},
	pickerTextStyle: {
		color: '#5e5e5e',
		fontSize: 14,
		flex: 1,
		marginTop: 10,
		marginBottom: 10
	},
	itemContainerStyle: {
		borderBottomWidth: 1, 
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
		height: 100,
		width: 100,
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
		color: COLOR.secondary_a
	}
}

const mapStateToProps = state => {
	const { fishLogs, user } = state

	return { fishLogs, user }
}

export default connect(mapStateToProps, {fishLogsFetch})(FishLogList)
