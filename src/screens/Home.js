import React, { Component } from 'react'
import { View, Text, Image, TouchableNativeFeedback, TouchableWithoutFeedback, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { logout, setUserToken } from '../actions'

class Home extends Component {
	static navigationOptions = {
		header: null
	}

	componentWillMount() {
		// to do: check token expired

		AsyncStorage.getItem('token', (err, result) => {
			console.log(result, 'Token');
			if (!result || result === '') {
				const resetAction = NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({ routeName: 'Login'})
					]
				})
				this.props.navigation.dispatch(resetAction)
			} 
			else {
				this.props.setUserToken(result)
			}
		})
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
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Reward')}>
						<View style={{ flexDirection: 'row', marginTop: 10}}>
							<View style={{flex: 1}}>
								<Image 
									style={coin}
									source={require('../../assets/coin.png')} 
								/>
							</View>
							<Text style={point}>100</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={menuContainerStyle}>
					<View style={{flexDirection: 'row'}}>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Profile')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/katalog.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Profil</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('FishLogList')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/fishlog.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Fish Log</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('RequestList')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/permintaan.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Request</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
					<View style={{flexDirection: 'row'}}>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('OrderList')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/transaksi.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Order</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('MemberList')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/anggota.png')} 
								/>
								<Text style={{textAlign: 'center'}}>Anggota</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Information')}>
							<View style={menuItemStyle}>
								<Image 
									style={menuIcon}
									source={require('../../assets/informasi.png')} 
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
					<TouchableWithoutFeedback 
						onPress={() => this.props.logout(() => {
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({ routeName: 'Login'})
								]
							})
							this.props.navigation.dispatch(resetAction)
						})}
					>
						<View>
							<Text style={{textAlign: 'center'}}>Logout</Text>
						</View>
					</TouchableWithoutFeedback>
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

const mapStateToProps = (state) => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { logout, setUserToken })(Home)
