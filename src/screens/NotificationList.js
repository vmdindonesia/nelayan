import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import { BASE_URL } from '../constants'
import { Spinner, Card } from '../components/common'
import { unreadNotifFetch } from '../actions'

class NotificationList extends Component {
	static navigationOptions = {
		title: 'Notifikasi',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
		}
	}

	componentWillMount() {
		this.getData()
		this.props.unreadNotifFetch(this.props.user.token)
	}

	getData = () => {
		this.setState({loading: true})
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/notifications`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.data})
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
	render() {
		const { data, loading } = this.state
		console.log(data)

		if (loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<ScrollView>
				{
					data ?
						data.map((item, index) =>
							<Card key={index}>
								<TouchableNativeFeedback>
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
					:
						<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
							<Text>Tidak ada notifikasi</Text>
						</View>
				}
			</ScrollView>
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
	const { user } = state
	return { user }
}

export default connect(mapStateToProps, {unreadNotifFetch})(NotificationList)
