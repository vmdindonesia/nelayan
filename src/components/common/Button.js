import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback } from 'react-native'

class Button extends Component {
	render() {
		return (
			<TouchableNativeFeedback
				onPress={this.props.onPress}
				background={TouchableNativeFeedback.SelectableBackground()}
			>
				<View style={styles.buttonStyle}>
					<Text style={styles.textStyle}>{this.props.children}</Text>
				</View>
			</TouchableNativeFeedback>
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
