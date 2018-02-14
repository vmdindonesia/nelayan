import React, { Component } from 'react'
import { View, Text } from 'react-native'

class MemberList extends Component {
	static navigationOptions = {
		title: 'Anggota Nelayan',
		headerRight: <View />
	}

	render() {
		return (
			<View>
				<Text>MemberList</Text>
			</View>
		)
	}
}

export default MemberList
