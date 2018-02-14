import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import { logout, setUserToken } from '../actions'
import { BASE_URL } from '../constants'
import RewardItemList from './RewardItemList'
import RewardHistory from './RewardHistory'

const RewardTab = TabNavigator({
  'Tukar Poin': { screen: RewardItemList },
  Riwayat: { screen: RewardHistory },
})

class Reward extends Component {
	static navigationOptions = {
		title: 'Reward',
		headerTitleStyle: {
			alignSelf: 'center'
		},
		headerRight: (<View />)
	}

	render() {
		const { 
			containerStyle, headerHomeStyle, menuContainerStyle, 
			profileName, coin, point,
		} = styles

		return (
			<View style={containerStyle}>
				<View style={headerHomeStyle}>
					<Text style={profileName}>{this.props.user.data.name}</Text>
					<TouchableWithoutFeedback>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
							<View style={{flexDirection: 'row'}}>
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
					<RewardTab />
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
		paddingTop: 10,
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: '#56bde6',
		width: '100%'
	},
	menuContainerStyle: {
		flex: 5,
	},
	profileImageContainer: {
		height: 70,
		width: 70,
		alignSelf: 'center',
	},
	profileImage: {
		height: 70,
		width: 70,
		borderRadius: 50,
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
		alignSelf: 'center'
	},
	point: {
		marginTop: 1, 
		marginLeft: 5,
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold'
	}
}

const mapStateToProps = (state) => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { logout, setUserToken })(Reward)

