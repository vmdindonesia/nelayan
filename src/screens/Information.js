import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'

class Information extends Component {
	static navigationOptions = {
		title: 'Informasi',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Image style={{height: 200, width: 200}} source={require('../../assets/coming-soon.png')} />
			</View>
		)
	}
}

export default Information
