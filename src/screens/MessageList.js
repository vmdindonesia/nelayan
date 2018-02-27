import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback, Image, FlatList } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'

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

	render() {
		return (
			<View style={{flex: 1}}>
				<Card>
					<TouchableNativeFeedback 
						onPress={() => this.props.navigation.navigate('Message', {id: item.id})}
					>
						<View style={styles.itemContainerStyle}>
							<View style={styles.thumbnailContainerStyle}>
								<Image 
									style={styles.thumbnailStyle}
									source={{uri: `${BASE_URL}/images/1516800725941PPN Kabayan Aplikasi.jpeg`}} 
								/>
							</View>

							<View style={styles.headerContentStyle}>
								<Text>No. PO 123132</Text>
								<Text style={{fontSize: 12}}>{moment().format('DD MMM YYYY, HH:mm')}</Text>
								<Text style={styles.hedaerTextStyle}>PT Bandar udara</Text>
							</View>
						</View>
					</TouchableNativeFeedback>
				</Card>
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
		fontSize: 16,
		color: COLOR.secondary_a
	}
}

const mapStateToProps = state => {
	const { messages, user } = state

	return { messages, user }
}

export default connect(mapStateToProps, {messagesFetch})(MessageList)

