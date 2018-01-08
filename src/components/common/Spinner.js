import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

class Spinner extends Component {
	render() {
		const { size } = this.props

		return (
			<View style={styles.spinnerStyle}>
				<ActivityIndicator size={size || 'large'} />
			</View>
		);
	}
}

const styles = {
	spinnerStyle:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
}

export {Spinner};
