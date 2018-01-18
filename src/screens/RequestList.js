import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Spinner } from '../components/common'

class RequestList extends Component {
	static navigationOptions = {
		title: 'Request'
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Spinner size='large' />
			</View>
		)
	}
}

export default RequestList
