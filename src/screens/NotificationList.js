import React, { Component } from 'react'
import { View, Text } from 'react-native'

class NotificationList extends Component {
	static navigationOptions = {
		title: 'Notifikasi',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>Tidak ada notifikasi</Text>
			</View>
		)
	}
}

export default NotificationList
