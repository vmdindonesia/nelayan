import React, { Component } from 'react'
import { View, Text } from 'react-native'

class RewardHistory extends Component {
	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{textAlign: 'center'}}>
					Anda belum memiliki 
					{'\n'}
					riwayat penukaran poin saat ini
				</Text>
			</View>
		)
	}
}

export default RewardHistory
