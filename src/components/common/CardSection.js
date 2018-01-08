import React, { Component } from 'react'
import { View } from 'react-native'

class CardSection extends Component {
	render() {
		return (
			<View style={styles.containerStyle}>
				{this.props.children}
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		padding: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative'
	}
}

export { CardSection }
