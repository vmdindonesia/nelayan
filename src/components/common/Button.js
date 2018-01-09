import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'

class Button extends Component {
	render() {
		const { buttonStyle, textStyle } = styles
		return (
			<TouchableOpacity onPress={this.props.onPress} style={buttonStyle}>
				<Text style={textStyle}>
					{this.props.children}
				</Text>
			</TouchableOpacity>
		)
	}
}

const styles = {
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 10,
		paddingBottom: 10,
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: '#007aff',
		borderRadius: 2,
		marginLeft: 5,
		marginRight: 5,
	}
}

export { Button }
