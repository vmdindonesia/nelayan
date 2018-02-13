import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback } from 'react-native'
import { COLORS } from '../../constants'

class Button extends Component {
	render() {
		console.log(this.props)
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
		paddingTop: 12,
		paddingBottom: 12,
		fontFamily: 'Muli-Bold'
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: COLORS.secondary_a,
		borderRadius: 8,
	}
}

export { Button }
