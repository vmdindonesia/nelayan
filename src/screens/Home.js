import React, { Component } from 'react'
import { View, Text, Image, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import { logout } from '../actions'
import { BASE_URL, COLOR } from '../constants'

import OrderList from './OrderList'
import MenuItem from './MenuItem'

class Home extends Component {
	static navigationOptions = {
		headerTitle: 'Nelayan Aruna',
		headerLeft:
			<TouchableNativeFeedback>
				<Icon size={25} style={{marginLeft: 20}} name="md-menu" color="#fff" />
			</TouchableNativeFeedback>,
		headerRight:
			<TouchableNativeFeedback>
				<Image 
					style={{height: 20, width: 15, margin: 20}}
					source={require('../../assets/ic_notification_on.png')} 
				/>
			</TouchableNativeFeedback>	
	}

	constructor(props) {
		super(props)
	
		this.state = {
			screen: 'MenuItem'
		}
	}

	renderScreen = () => {
		if (this.state.screen === 'OrderList') {
			return <OrderList navi={this.props.navigation} />
		}
		
		return <MenuItem navi={this.props.navigation} />
	}

	render() {
		const { 
			containerStyle, headerHomeStyle, menuContainerStyle, 
			profileImageContainer, profileImage, profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive
		} = styles

		const { screen } = this.state

		return (
			<View style={containerStyle}>
				<View style={headerHomeStyle}>
					<View style={profileImageContainer}>
						<Image 
							style={profileImage}
							source={{uri: `${BASE_URL}/images/${this.props.user.data.photo}`}} 
						/>
					</View>
					<Text style={profileName}>{this.props.user.data.name}</Text>
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Reward')}>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
							<View style={{flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 5}}>
								<Image 
									style={coin}
									source={require('../../assets/coin.png')}
								/>
								<Text style={point}>{this.props.user.data.pointNow}</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={menuContainerStyle}>
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<TouchableNativeFeedback onPress={() => this.setState({screen: 'MenuItem'})}>
								<View style={screen === 'MenuItem' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'MenuItem' ? tabTextActive : tabText}>Menu</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{flex: 1}}>
							<TouchableNativeFeedback onPress={() => this.setState({screen: 'OrderList'})}>
								<View style={screen === 'OrderList' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'OrderList' ? tabTextActive : tabText}>Transaksi</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
					{this.renderScreen()}
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
		paddingTop: 20,
		flex: 2,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: COLOR.secondary_a,
		width: '100%'
	},
	menuContainerStyle: {
		flex: 4
	},
	profileImageContainer: {
		height: 90,
		width: 90,
		alignSelf: 'center',
	},
	profileImage: {
		height: 90,
		width: 90,
		borderRadius: 50,
	},
	profileName: {
		textAlign: 'center',
		marginTop: 5,
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Muli-Bold'
	},
	coin: {
		height: 24,
		width: 24,
		alignSelf: 'center'
	},
	point: {
		marginTop: 1, 
		marginLeft: 5,
		fontSize: 15,
	},
	tabContainer: {
		backgroundColor: COLOR.element_a3,
		height: 50,
		justifyContent: 'center'
	},
	tabContainerActive: {
		backgroundColor: COLOR.element_a4,
		height: 50,
		justifyContent: 'center'
	},
	tabText: {
		color: '#eaeaea',
		textAlign: 'center',
		fontSize: 18
	},
	tabTextActive: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 18
	}
}

const mapStateToProps = (state) => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { logout })(Home)
