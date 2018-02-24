import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { COLOR } from '../../constants'

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
    backgroundColor: COLOR.secondary_a,
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 20},
    alignItems: 'center',
    shadowOpacity: 0.2,
    width: '100%',
    elevation: 3
  },
  headerText: {
    color: '#fff',
    fontFamily: 'Muli-Bold',
    fontWeight: '300',
    fontSize: 20
  }

});


export {Header};
