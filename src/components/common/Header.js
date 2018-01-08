import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

class Header extends Component {
	render() {
		return (
			<View style={styles.header}>
				<Text style={styles.headerText}>{this.props.title}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0a0a0a',
    height: 50,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 20},
    alignItems: 'center',
    shadowOpacity: 0.2,
    width: '100%'
  },
  headerText: {
    color: 'white'
  }

});


export {Header};
