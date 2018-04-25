import React, { Component } from 'react'
import { FlatList, ScrollView, View, RefreshControl, Image, Text, TouchableNativeFeedback, Picker, ToastAndroid } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import numeral from 'numeral'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'

import { fishLogsFetch } from '../actions'
import { Card } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'

class FishLogList extends Component {
	static navigationOptions = {
		title: 'Fishlog',
		headerRight: <View />
	}

	constructor(props) {
		super(props)

		this.state = {
			fishName: '',
			fishes: [],
			isDisable: false,
			dateCompare: '',
			paramsKey: ''
		}
	}

	componentWillMount() {
		this.props.fishLogsFetch(this.props.user.token, '')
		this.setState({ dateCompare: new Date() })
		this.fetchProducts()
	}

	onChangeInput = (name, v) => {
		this.setState({ [name]: v })

		// search params
		let params = `key=${v}`;
		this.setState({ paramsKey: `key=${v}` })
		this.props.fishLogsFetch(this.props.user.token, params)
	}

	fetchProducts = () => {
		let token = this.props.user.token

		axios.get(`${BASE_URL}/fishes-products`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				this.setState({ fishes: response.data.data })
			})
			.catch(error => {
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}
			})
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback
					onPress={
						() => {
							this.props.navigation.navigate('FishLogDetail', { id: item.id })
						}
					}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image
								style={styles.thumbnailStyle}
								source={{ uri: `${BASE_URL}/images/${item.photo}` }}
							/>
						</View>
						<View style={styles.headerContentStyle}>
							<Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
							<Text style={styles.hedaerTextStyle}>{item.Fish.name}</Text>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<Text style={{fontWeight: 'bold' }}>{numeral(item.quantity).format('0,0')} Kg</Text>
								<View style={{flexDirection: 'row'}}>
									<Text>Size: </Text><Text style={{fontWeight: 'bold' }}>{numeral(item.size).format('0,0')} {item.unit || 'Unit'}</Text>
								</View>
							</View>
							<Text>Rp {numeral(item.price).format('0,0')}</Text>
						</View>
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		const { fishName, fishes } = this.state
		console.log(this.props.fishLogs.loading, 'loading fishlogs')

		return (
			<View style={{ flex: 1 }}>
				<View style={styles.pickerContainer}>
					<View style={styles.pickerStyle}>
						<Icon name='md-search' size={24} style={{ position: 'absolute', margin: 13 }} />
						<Picker
							selectedValue={fishName}
							onValueChange={v => this.onChangeInput('fishName', v)}
							itemStyle={{fontWeight: 'bold', color: 'red'}} 
						>
							<Picker.Item label="       -- Cari Fishlog --" value="" />
							{
								fishes && fishes.map((item, index) =>
									<Picker.Item key={index} label={`       ${item.name}`} value={item.name} />
								)
							}
						</Picker>
					</View>
				</View>

				{
					this.props.fishLogs.data.length === 0 ?
						<ScrollView
							refreshControl={
								<RefreshControl
									onRefresh={() => this.props.fishLogsFetch(this.props.user.token)}
									refreshing={this.props.fishLogs.loading}
								/>
							}
							contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -20 }}
						>
							<View style={{justifyContent: 'center', alignItems: 'center'}}>
								<Image
									style={{width: 80, height: 80}}
									source={require('./../../assets/menu2.png')}
								/>
							</View>
							<Text style={{ textAlign: 'center' }}>Belum ada fishlog</Text>
						</ScrollView>
					:
						<FlatList
							data={this.props.fishLogs.data}
							renderItem={({ item }) => this.renderItem(item)}
							keyExtractor={(item, index) => index}
							onRefresh={() => this.props.fishLogsFetch(this.props.user.token, this.state.paramsKey)}
							refreshing={this.props.fishLogs.loading}
						/>
				}

				<ActionButton
					buttonColor={COLOR.element_b4}
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
		elevation: 1,
		backgroundColor: '#fff'
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
		width: 130,
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

export default connect(mapStateToProps, { fishLogsFetch })(FishLogList)
