import React, { Component } from 'react'
import { View, Text } from 'react-native'

class Information extends Component {
	static navigationOptions = {
		title: 'Informasi',
		headerRight: <View />
	}

	render() {
		return (
			<View>
				<Text>Information</Text>
			</View>
		)
	}
}

export default Information
