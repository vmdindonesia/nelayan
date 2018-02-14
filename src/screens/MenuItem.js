import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback, Image, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

import { logout } from '../actions'

class MenuItem extends Component {
	render() {
		const { 
			menuItemStyle, menuIcon, containerStyle
		} = styles

		return (
			<View style={containerStyle}>
				<View style={{flexDirection: 'row'}}>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('Profile')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/katalog.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Profil</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('FishLogList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/fishlog.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Fish Log</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('RequestList')}>
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
					<TouchableNativeFeedback>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/transaksi.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Diskusi</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('MemberList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/anggota.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Anggota</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('Information')}>
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
					<Text style={{textAlign: 'center', marginTop: 10}}>
						Butuh bantuan? 
						<Text
							style={{ color: 'green' }}
						> Hubungi Aruna</Text>
					</Text>
				</View>
				{
					<TouchableWithoutFeedback 
						onPress={() => this.props.logout(() => {
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({ routeName: 'Login'})
								]
							})
							this.props.navi.dispatch(resetAction)
						})}
					>
						<View>
							<Text style={{textAlign: 'center'}}>Logout</Text>
						</View>
					</TouchableWithoutFeedback>
				}
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		alignSelf: 'center',
		paddingTop: 20
	},
	menuItemStyle: {
		// borderWidth: 1, 
		borderRadius: 2,
		// borderColor: '#ddd',
		// shadowColor: '#000',
		// shadowOffset: { width: 5, height: 5 },
		// shadowOpacity: 0.7,
		// shadowRadius: 3,
		elevation: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
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

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps, { logout })(MenuItem)
