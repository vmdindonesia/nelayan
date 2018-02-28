import React, { Component } from 'react'
import { View, Text, FlatList, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import { messagesFetch } from '../actions'
import { Spinner, Card } from '../components/common'
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
								source={{uri: `${BASE_URL}/images/1516800725941PPN Kabayan Aplikasi.jpeg`}} 
							/>
						</View>

						<View style={styles.headerContentStyle}>
							<Text>No. PO {item.Request.codeNumber}</Text>
							<Text style={{fontSize: 12}}>{item.lastUpdatedAt ? moment(item.lastUpdatedAt).format('DD MMM YYYY, HH:mm') : ''}</Text>
							<Text style={styles.hedaerTextStyle}>
								{item.Request.Buyer.organizationType} 
								{
									item.Request.Buyer.organization ? 
									`\n${item.Request.Buyer.organization}`
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
		if (this.props.messages.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.messages.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
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
	}
}

const mapStateToProps = state => {
	const { messages, user } = state

	return { messages, user }
}

export default connect(mapStateToProps, {messagesFetch})(MessageList)
