import React, { Component } from 'react'
import { FlatList, Image, View, Text, TouchableNativeFeedback, ToastAndroid, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import { Spinner, Card } from '../components/common'
import { notificationsFetch, unreadNotifFetch } from '../actions'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'

class NotificationList extends Component {
	static navigationOptions = {
		title: 'Notifikasi',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
		}
	}

	componentWillMount() {
		this.props.notificationsFetch(this.props.user.token, '')
	}

	componentDidMount() {
		this.props.unreadNotifFetch(this.props.user.token)
	}

	fetchDetail = (type, id) => {
		this.setState({loading: true})
		let token = this.props.user.token
		let newType = type

		if (type === 'Contact Admin') {
			link = 'MessageAdmin'

			additionalProps = {
				id: 1,
				codeNumber: 'chat admin',
				organizationType: 'Admin Aruna',
			}

			this.props.navigation.navigate(link, additionalProps)
			this.setState({loading: false})
		}
		else if (type === 'rewards') {
			this.props.navigation.navigate('Reward')
		}
		else {
			if (type === 'messages') {
				newType = 'orders'
			}
			
			axios.get(`${BASE_URL}/supplier/${newType}/${id}`, {
				headers: {token},
				timeout: REQUEST_TIME_OUT
			})
			.then(response => {
				let link = 'RequestDetail'
				let additionalProps = {id}
				let item = response.data.data

				if (type === 'orders') {
					link = 'OrderDetail'

					additionalProps = {
						id: item.id,
						codeNumber: item.Request.codeNumber,
						organizationType: item.Request.Buyer.organizationType,
						organization: item.Request.Buyer.organization
					}
				}
				else if (type === 'messages') {
					link = 'Message'

					additionalProps = {
						id: item.id,
						codeNumber: item.Request.codeNumber,
						organizationType: item.Request.Buyer.organizationType,
						organization: item.Request.Buyer.organization
					}
				}
			
				this.props.navigation.navigate(link, additionalProps)
				this.setState({loading: false})
			})
			.catch(error => {
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}
				this.setState({loading: false})
			})
		}
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback onPress={() => this.fetchDetail(item.type, item.typeId)}>
					<View style={styles.itemContainerStyle}>
						<View style={styles.headerContentStyle}>
							<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
								<Text style={{flex: 1}}>{moment(item.createdAt).format('DD/MM/YYYY - HH:mm')} WIB</Text>
								<View style={{margin: 2, height: 15, width: 15, backgroundColor: item.read ? '#eaeaea' : 'red', borderRadius: 25}} />
							</View>
							<Text style={styles.hedaerTextStyle}>{item.title}</Text>
							<Text>{item.message}</Text>
						</View>
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		console.log(this.props.notifications.data, '----data notif')
		if (this.state.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				{
					this.props.notifications.data.length === 0 ?
						<ScrollView
							refreshControl={
								<RefreshControl
									onRefresh={() => this.props.notificationsFetch(this.props.user.token)}
									refreshing={this.props.notifications.loading}
								/>
							}
							contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -20 }}
						>
							<Image
								style={{width: 70, height: 70, marginBottom: 5}}
								source={require('./../../assets/empty_notif.png')}
							/>
							<Text style={{ textAlign: 'center' }}>Belum ada</Text>
							<Text style={{ textAlign: 'center' }}>notifikasi</Text>
						</ScrollView>
					:
						<FlatList
							data={this.props.notifications.data}
							renderItem={({item}) => this.renderItem(item)}
							keyExtractor={(item, index) => index}
							onRefresh={() => this.props.notificationsFetch(this.props.user.token, '')}
							refreshing={this.props.notifications.loading}
						/>
				}
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		borderBottomWidth: 1, 
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		padding: 10,
		backgroundColor: '#fff'
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
		justifyContent: 'space-around',
	},
	hedaerTextStyle: {
		fontSize: 20,
		fontFamily: 'Muli-Bold',
	}
}

const mapStateToProps = state => {
	const { user, notifications } = state
	return { user, notifications }
}

export default connect(mapStateToProps, {notificationsFetch, unreadNotifFetch})(NotificationList)
