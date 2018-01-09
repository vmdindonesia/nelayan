import React, { Component } from 'react'
import { View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'

class CatalogList extends Component {
	static navigationOptions = {
		title: 'Katalog',
		headerLeft: null
	}

	render() {
		return (
			<View style={styles.containerStyle}>
				<Text style={styles.infoStyle}>
					Selamat, Anda telah berhasil membuat akun! {'\r'}
					Silahkan tambahkan komoditas unggulan kelompok nelayan Anda!
				</Text>

				<ActionButton
				  buttonColor="rgba(231,76,60,1)"
				  onPress={() => { alert("hi")}}
				/>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	infoStyle: {
		padding: 20,
		textAlign: 'center'
	},
	actionButtonIcon: {
   	fontSize: 20,
   	height: 22,
   	color: 'white',
 	},
}

export default CatalogList
