import React, { Component } from 'react'
import { View } from 'react-native'

class Card extends Component {
	render() {
		return (
			<View style={[styles.containerStyle, this.props.style]}>
				{this.props.children}
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		borderWidth: 1, 
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 10,
		backgroundColor: '#fff'
	}
}

export { Card }
