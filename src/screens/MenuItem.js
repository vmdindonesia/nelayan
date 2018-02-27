import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { logout } from '../actions'
import { COLOR } from '../constants'

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
								source={require('../../assets/menu1.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Profil</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('FishLogList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/menu2.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Fishlog</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('RequestList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/menu3.png')} 
							/>
							<Text style={{textAlign: 'center'}}>PO</Text>
						</View>
					</TouchableNativeFeedback>
				</View>
				<View style={{flexDirection: 'row'}}>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('MemberList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/menu4.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Anggota</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('MessageList')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/menu5.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Diskusi</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => this.props.navi.navigate('Information')}>
						<View style={menuItemStyle}>
							<Image 
								style={menuIcon}
								source={require('../../assets/menu6.png')} 
							/>
							<Text style={{textAlign: 'center'}}>Informasi</Text>
						</View>
					</TouchableNativeFeedback>
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{textAlign: 'center'}}>
						Butuh bantuan? 
					</Text>
					<TouchableOpacity onPress={() => this.props.navi.navigate('Help')}>
						<View>
							<Text
								style={{ color: COLOR.secondary_a }}
							> Hubungi Aruna</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		alignSelf: 'center',
		paddingTop: 15
	},
	menuItemStyle: {
		borderRadius: 2,
		elevation: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		width: 90,
		height: 90,
		backgroundColor: '#fff'
	},
	menuIcon: {
		alignSelf: 'center',
		marginTop: 10,
		height: 50,
		width: 50,
	}
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps, { logout })(MenuItem)
