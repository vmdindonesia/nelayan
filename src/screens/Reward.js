import React, { Component } from 'react'
import { View, ScrollView, Dimensions, Animated, Text, Image, TouchableWithoutFeedback, TouchableNativeFeedback, RefreshControl } from 'react-native'
import { connect } from 'react-redux'

import { logout, setUserToken, rewardHistoriesFetch, itemsFetch } from '../actions'
import { COLOR } from '../constants'
import RewardItemList from './RewardItemList'
import RewardHistory from './RewardHistory'

class Reward extends Component {
	static navigationOptions = {
		title: 'Poin',
		headerRight: (<View />)
	}

	constructor(props) {
		super(props)

		this.state = {
			scrollY: new Animated.Value(0),
			screen: 'RewardItemList',
		}
	}

	renderScreen = () => {
		if (this.state.screen === 'RewardHistory') {
			return <RewardHistory />
		}

		return <RewardItemList />
	}

	render() {
		const { screen } = this.state
		const { 
			containerStyle, headerHomeStyle, 
			profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive,
		} = styles

		const toOne = this.state.scrollY.interpolate({
			inputRange: [70, 100],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		})

		const { width: SCREEN_WIDTH } = Dimensions.get('screen')

		return (
			<View style={containerStyle}>
				<Animated.View 
					style={{
						height: 50, 
						backgroundColor: COLOR.secondary_a,
						width: SCREEN_WIDTH, 
						position: 'absolute', 
						top: 0, 
						left: 0,
						zIndex: 99,
						opacity: toOne
					}} 
				>
					<View style={{ flexDirection: 'row'}}>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'RewardItemList' })}>
								<View style={screen === 'RewardItemList' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'RewardItemList' ? tabTextActive : tabText}>Tukar Poin</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'RewardHistory' })}>
								<View style={screen === 'RewardHistory' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'RewardHistory' ? tabTextActive : tabText}>Riwayat</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
				</Animated.View>

				<ScrollView 
					refreshControl={
						screen === 'RewardHistory' ?
							<RefreshControl
								refreshing={this.props.rewardHistories.loading}
								onRefresh={() => {
									this.props.rewardHistoriesFetch(this.props.user.token)
								}}
							/>
						:
							<RefreshControl
								onRefresh={() => this.props.itemsFetch(this.props.user.token)}
								refreshing={this.props.items.loading}
							/>
					}
					onScroll={Animated.event(
						[{ nativeEvent: {
									contentOffset: {
										y: this.state.scrollY
									}
								}
						}])}
					scrollEventThrottle={16}
				>
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

					<View style={{ flexDirection: 'row'}}>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'RewardItemList' })}>
								<View style={screen === 'RewardItemList' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'RewardItemList' ? tabTextActive : tabText}>Tukar Poin</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'RewardHistory' })}>
								<View style={screen === 'RewardHistory' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'RewardHistory' ? tabTextActive : tabText}>Riwayat</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>

						{this.renderScreen()}
				</ScrollView>
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
		paddingBottom: 10,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: COLOR.secondary_a,
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
		marginBottom: 5,
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold'
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
	},
	tabContainer: {
		backgroundColor: COLOR.secondary_b,
		height: 50,
		justifyContent: 'center'
	},
	tabContainerActive: {
		backgroundColor: COLOR.primary,
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
		fontSize: 18,
		fontFamily: 'Muli-Bold'
	},
}

const mapStateToProps = (state) => {
	const { user, rewardHistories, items } = state

	return { user, rewardHistories, items }
}

export default connect(mapStateToProps, { logout, setUserToken, rewardHistoriesFetch, itemsFetch })(Reward)

