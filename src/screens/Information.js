import React, { Component } from 'react'
import { View, Text } from 'react-native'

class Information extends Component {
	static navigationOptions = {
		title: 'Informasi',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>Coming Soon</Text>
			</View>
		)
	}
}

export default Information
