import React, { Component } from 'react'
import { Text, View, TouchableNativeFeedback } from 'react-native'
import { COLORS } from '../../constants'

class Button extends Component {
	render() {
		const { secondary } = this.props

		return (
			<TouchableNativeFeedback
				onPress={this.props.onPress}
				background={TouchableNativeFeedback.SelectableBackground()}
			>
				<View style={secondary ? styles.secondaryButtonStyle : styles.primaryButtonStyle}>
					<Text style={secondary ? styles.secondaryTextStyle : styles.primaryTextStyle}>{this.props.children}</Text>
				</View>
			</TouchableNativeFeedback>
		)
	}
}

const styles = {
	primaryTextStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		paddingTop: 12,
		paddingBottom: 12,
		fontFamily: 'Muli-Bold'
	},
	secondaryTextStyle: {
		alignSelf: 'center',
		color: COLORS.secondary_a,
		fontSize: 16,
		paddingTop: 12,
		paddingBottom: 12,
		fontFamily: 'Muli-Bold'
	},
	primaryButtonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: COLORS.secondary_a,
		borderRadius: 8,
	},
	secondaryButtonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 8,
	}
}

export { Button }
