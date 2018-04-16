import React, { Component } from 'react';
import { Text, View, Image } from 'react-native'

class Term extends Component {
	static navigationOptions = {
		title: 'Terms & Conditions',
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

export default Term
