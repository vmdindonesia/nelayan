import React, { Component } from 'react'
import { View, Text, FlatList, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { messagesFetch } from '../actions'
import { Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class MessageList extends Component {
	static navigationOptions = {
		title: 'Diskusi',
		headerRight: <View />
	}

	componentWillMount() {
		this.props.messagesFetch(this.props.user.token, '')
	}

	renderItem = (item) => {
		console.log(item, 'Item Diskusi');
		return (
			<Card>
				<TouchableNativeFeedback 
					onPress={() => this.props.navigation.navigate('Message', 
						{
							id: item.id,
							codeNumber: item.Request.codeNumber,
							organizationType: item.Request.Buyer.organizationType,
							organization: item.Request.Buyer.organization
						})}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${item.Request.Buyer.photo}`}} 
							/>
						</View>

						<View style={styles.headerContentStyle}>
							<Text style={{fontSize: 11}}>No. PO {item.Request.codeNumber}</Text>
							<Text style={{fontSize: 12}}>{item.lastUpdatedAt ? moment(item.lastUpdatedAt).format('DD MMM YYYY, HH:mm') : moment().format('DD MMM YYYY, HH:mm')}</Text>
							<Text style={styles.hedaerTextStyle2}> 
								{
									item.Request.Buyer.organization ? 
									`${item.Request.Buyer.organizationType} ${item.Request.Buyer.organization}`
								: 
									item.Request.Buyer.name
								}
							</Text>
						</View>

						{
							item.unread > 0 && 
							<View style={{backgroundColor: 'red', borderRadius: 50, marginTop: 5, width: 20, height: 20}}>
								<Text style={{color: '#fff', fontFamily: 'Muli-Bold', textAlign: 'center'}}>{item.unread}</Text>
							</View>
						}
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Card>
					<TouchableNativeFeedback 
						onPress={() => this.props.navigation.navigate('MessageAdmin', {
								id: 1,
								codeNumber: 'chat admin',
								organizationType: 'Admin Aruna',
							})
						}
					>
						<View style={styles.itemContainerStyle}>
							<View style={styles.thumbnailContainerStyle}>
								<Image 
									style={styles.thumbnailStyle}
									source={require('../../assets/ic_launcher.png')} 
								/>
							</View>

							<View style={styles.headerContentStyle}>
								<Text style={styles.hedaerTextStyle}>
									Admin Aruna
								</Text>
							</View>

							{
								// item.unread > 0 && 
								// <View style={{backgroundColor: 'red', borderRadius: 50, marginTop: 5, width: 20, height: 20}}>
								// 	<Text style={{color: '#fff', fontFamily: 'Muli-Bold', textAlign: 'center'}}>{item.unread}</Text>
								// </View>
							}
						</View>
					</TouchableNativeFeedback>
				</Card>

				<FlatList
					data={this.props.messages.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					onRefresh={() => this.props.messagesFetch(this.props.user.token, '')}
					refreshing={this.props.messages.loading}
				/>
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
		backgroundColor: '#fff'
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	thumbnailStyle: {
		height: 70,
		width: 70,
		borderRadius: 50
	},
	headerContentStyle: {
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	hedaerTextStyle: {
		fontSize: 14,
		color: COLOR.secondary_a
	},
	hedaerTextStyle2: {
		fontSize: 14,
		fontWeight: 'bold',
	}
}

const mapStateToProps = state => {
	const { messages, user } = state

	return { messages, user }
}

export default connect(mapStateToProps, {messagesFetch})(MessageList)
