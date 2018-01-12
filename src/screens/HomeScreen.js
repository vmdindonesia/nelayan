import React, { Component } from 'react'
import { View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { Card } from '../components/common'

class HomeScreen extends Component {
	static navigationOptions = {
		header: null
	}

	render() {
		const { 
			containerStyle, headerHomeStyle, menuContainerStyle, 
			profileImageContainer, profileImage, profileName, coin, point,
			menuItemStyle, menuIcon
		} = styles

		return (
			<View style={containerStyle}>
				<View style={headerHomeStyle}>
					<View style={profileImageContainer}>
						<Image 
							style={profileImage}
							source={require('../../assets/photo.png')} 
						/>
					</View>
					<Text style={profileName}>Suhardi Suharman</Text>
					<View style={{ flexDirection: 'row', marginTop: 10}}>
						<View style={{flex: 1}}>
							<Image 
								style={coin}
								source={require('../../assets/coin.png')} 
							/>
						</View>
						<Text style={point}>100</Text>
					</View>
				</View>
				<View style={menuContainerStyle}>
					<View style={{flexDirection: 'row'}}>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Profil</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Fish Log</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Transaksi</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
					<View style={{flexDirection: 'row'}}>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Request</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Anggota</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/menuIcon.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Informasi</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
					<View>
						<Text style={{textAlign: 'center'}}>
							Butuh bantuan? 
							<Text
								style={{ color: 'green' }}
							> Hubungi Aruna</Text>
						</Text>
					</View>
				</View>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	headerHomeStyle: {
		paddingTop: 30,
		flex: 2,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: '#56bde6',
    width: '100%'
	},
	menuContainerStyle: {
		flex: 5,
		// flexDirection: 'row',
		alignSelf: 'center',
		paddingTop: 20
	},
	profileImageContainer: {
		backgroundColor: 'yellow',
		height: 60,
		width: 60,
		borderRadius: 30,
		alignSelf: 'center',
	},
	profileImage: {
		margin: 5,
		height: 50,
		width: 50
	},
	profileName: {
		textAlign: 'center',
		marginTop: 5,
		color: '#fff',
		fontSize: 18
	},
	coin: {
		height: 30,
		width: 30,
		alignSelf: 'flex-end'
	},
	point: {
		flex: 1, 
		marginTop: 1, 
		marginLeft: 5,
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold'
	},
	menuItemStyle: {
		borderWidth: 1, 
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 20,
		width: 90,
		height: 90,
	},
	menuIcon: {
		alignSelf: 'center',
		marginTop: 8,
		marginBottom: 5,
		height: 50,
		width: 50,
	}
}

export default HomeScreen
