import React, { Component } from 'react'
import { StatusBar, Dimensions, Animated, View, ScrollView, Text, Image, TouchableNativeFeedback, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, DrawerLayoutAndroid } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import OneSignal from 'react-native-onesignal'

import { logout, unreadNotifFetch, ordersFetch } from '../actions'
import { BASE_URL, COLOR } from '../constants'
import { ContainerSection } from '../components/common'

import OrderList from './OrderList'
import MenuItem from './MenuItem'

class Home extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)

		this.state = {
			screen: 'MenuItem',
			redirectToNotification: false,
			scrollY: new Animated.Value(0),
			loading: false
		}
	}

	componentWillMount() {
		OneSignal.addEventListener('received', this.onReceived)
		OneSignal.addEventListener('opened', this.onOpened)
		// OneSignal.addEventListener('registered', this.onRegistered)
		OneSignal.addEventListener('ids', this.onIds)

		this.props.unreadNotifFetch(this.props.user.token)
	}

	componentDidMount() {
		OneSignal.configure({})
	}

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived)
		OneSignal.removeEventListener('opened', this.onOpened)
		// OneSignal.removeEventListener('registered', this.onRegistered)
		OneSignal.removeEventListener('ids', this.onIds)
	}

	onReceived(notification) {
		OneSignal.inFocusDisplaying(2)
		console.log('Notification received: ', notification)
	}

	onOpened(openResult) {
		console.log('Message: ', openResult.notification.payload.body)
		console.log('Data: ', openResult.notification.payload.additionalData)
		console.log('isActive: ', openResult.notification.isAppInFocus)
		console.log('openResult: ', openResult)
	}

	// onRegistered(notifData) {
	// 	console.log('Device had been registered for push notifications!', notifData)
	// }

	onRefresh = () => {
		this.setState({loading: true})

		this.props.unreadNotifFetch()
		.then(() => {
			this.setState({loading: false})
		})
		.catch(() => {
			this.setState({loading: false})
		})
	}

	onIds(device) {
		console.log('Device info: ', device)
	}

	renderScreen = () => {
		if (this.state.screen === 'OrderList') {
			return <OrderList navi={this.props.navigation} />
		}

		return <MenuItem navi={this.props.navigation} />
	}

	render() {
		const { screen } = this.state

		const toOne = this.state.scrollY.interpolate({
			inputRange: [185, 200],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		})
		const { width: SCREEN_WIDTH } = Dimensions.get('screen')

		const {
			containerStyle, headerHomeStyle,
			profileImageContainer, profileImage, profileImageContainerDrawer, profileImageDrawer, profileName, profileSupplierName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive
		} = styles


		const menus = [
			{
				label: 'Profil',
				icon: require('../../assets/menu1_white.png'),
				screen: 'Profile'
			},
			{
				label: 'Fishlog',
				icon: require('../../assets/menu2_white.png'),
				screen: 'FishLogList'
			},
			{
				label: 'PO',
				icon: require('../../assets/menu3_white.png'),
				screen: 'RequestList'
			},
			{
				label: 'Anggota',
				icon: require('../../assets/menu4_white.png'),
				screen: 'MemberList'
			},
			{
				label: 'Diskusi',
				icon: require('../../assets/menu5_white.png'),
				screen: 'MessageList'
			},
			{
				label: 'Informasi',
				icon: require('../../assets/menu6_white.png'),
				screen: 'Information'
			},
			// {
			// 	label: 'Official Store',
			// 	icon: require('../../assets/OS.png'),
			// 	screen: 'Store'
			// }
		]

		const menuDrawer = (
			<ScrollView style={{ flex: 1, backgroundColor: COLOR.secondary_a }}>
				<View style={{ backgroundColor: COLOR.primary, paddingTop: 20, padding: 16 }}>
					<View style={profileImageContainerDrawer}>
						<Image
							style={profileImageDrawer}
							source={{ uri: `${BASE_URL}/images/${this.props.user.data.photo}` }}
						/>
					</View>
					<View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 40}}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileEdit')}>
							<View>
								<Text style={{color: 'white', fontSize: 15}}>Nelayan Aruna</Text>
								<View style={{height: 5}} />
								<Text style={{color: 'white', fontSize: 12}}>Ubah profile</Text>
							</View>
						</TouchableOpacity>
						<View style={{ flex: 1 }}>
							<TouchableOpacity 
								style={{height: 45, position: 'absolute', right: -10, width: 50, paddingRight: 20, marginTop: -23, paddingTop: 10}}
								onPress={() => this.refs.drawer.closeDrawer()}
							>
								<View>
									<Icon style={{ color: '#fff', alignSelf: 'flex-end' }} st name="md-arrow-back" size={24} />
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={{ padding: 16, paddingTop: 10}}>

					{
						menus.map((item, index) =>
							<TouchableOpacity
								key={index}
								onPress={() => this.props.navigation.navigate(item.screen)}
							>
								<View style={{ marginBottom: 10, width: 100 }}>
									<ContainerSection>
										<Image
											style={styles.menuIcon}
											source={item.icon}
										/>
										<Text style={styles.drawerItemText}>{item.label}</Text>
									</ContainerSection>
								</View>
							</TouchableOpacity>
						)
					}
				</View>

				<View style={{ borderTopWidth: 1, borderColor: '#fff', marginBottom: 20, marginTop: -5 }} />
					
				<View style={{ paddingLeft: 16}}>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Term')}>
						<View style={{ marginBottom: 10 }}>
							<ContainerSection>
								<Image
									style={styles.menuIcon}
									source={require('../../assets/dokumen.png')}
								/>
								<Text style={styles.drawerItemText}>Terms & Conditions</Text>
							</ContainerSection>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Help')}>
						<View style={{ marginBottom: 10 }}>
							<ContainerSection>
								<Image
									style={styles.menuIcon}
									source={require('../../assets/ic_pusatbantuan_white.png')}
								/>
								<Text style={styles.drawerItemText}>Pusat Bantuan</Text>
							</ContainerSection>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.props.logout(() => {
							OneSignal.deleteTag('userid')
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({ routeName: 'Login' })
								]
							})
							this.props.navigation.dispatch(resetAction)
						})}
					>
						<View style={{ marginBottom: 10 }}>
							<ContainerSection>
								<Image
									style={styles.menuIcon}
									source={require('../../assets/ic_keluar_white.png')}
								/>
								<Text style={styles.drawerItemText}>Keluar</Text>
							</ContainerSection>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		)

		return (
			<View style={containerStyle}>
				<StatusBar
					backgroundColor={COLOR.primary}
					barStyle="light-content"
				/>
				<DrawerLayoutAndroid
					ref="drawer"
					drawerWidth={300}
					drawerPosition={DrawerLayoutAndroid.positions.Left}
					renderNavigationView={() => menuDrawer}
				>
					<View style={styles.header}>
						<TouchableOpacity 
							style={{ marginLeft: -20, height: 45, paddingTop: 10, width: 40, paddingLeft: 5 }} 
							onPress={() => this.refs.drawer.openDrawer()}
						>
							<View >
								<Icon size={25} name="md-menu" color="#fff" />
							</View>
						</TouchableOpacity>
						<Text style={styles.headerText}>Nelayan Aruna</Text>
						<TouchableOpacity 
							style={{ marginRight: -20, height: 45, paddingTop: 15, width: 40, paddingLeft: 20 }}
							onPress={() => this.props.navigation.navigate('NotificationList')}
						>
							<View>
								<Image
									style={{ height: 20, width: 15 }}
									source={
										this.props.user.unreadNotif > 0 ?
											require('../../assets/ic_notification_on.png')
											:
											require('../../assets/ic_notification.png')
									}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<Animated.View 
						style={{
							height: 50, 
							backgroundColor: COLOR.secondary_a,
							width: SCREEN_WIDTH, 
							position: 'absolute', 
							top: 0, 
							left: 0,
							zIndex: 99,
							opacity: toOne,
							marginTop: 60
						}} 
					>
						<View style={{ flexDirection: 'row'}}>
							<View style={{ flex: 1 }}>
								<TouchableNativeFeedback onPress={() => this.setState({ screen: 'MenuItem' })}>
									<View style={screen === 'MenuItem' ? tabContainerActive : tabContainer}>
										<Text style={screen === 'MenuItem' ? tabTextActive : tabText}>Profil</Text>
									</View>
								</TouchableNativeFeedback>
							</View>
							<View style={{ flex: 1 }}>
								<TouchableNativeFeedback onPress={() => this.setState({ screen: 'OrderList' })}>
									<View style={screen === 'OrderList' ? tabContainerActive : tabContainer}>
										<Text style={screen === 'OrderList' ? tabTextActive : tabText}>Transaksi</Text>
									</View>
								</TouchableNativeFeedback>
							</View>
						</View>
					</Animated.View>

					<ScrollView 
						refreshControl={
							screen === 'OrderList' ?
								<RefreshControl
									refreshing={this.props.orders.loading}
									onRefresh={() => {
										let params = `page=${0}&pageSize=${10}`;

										this.props.ordersFetch(this.props.user.token, params)
									}}
								/>
							:
								<RefreshControl
									refreshing={this.state.loading}
									onRefresh={() => this.onRefresh()}
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
							<View style={profileImageContainer}>
								<Image
									style={profileImage}
									source={{ uri: `${BASE_URL}/images/${this.props.user.data.photo}` }}
								/>
							</View>
							<Text style={profileName}>{this.props.user.data.name}</Text>
							<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Reward')}>
								<View style={{alignItems: 'center', marginTop: 3}}>
									<View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, padding: 5, paddingRight: 10 }}>
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
								<TouchableNativeFeedback onPress={() => this.setState({ screen: 'MenuItem' })}>
									<View style={screen === 'MenuItem' ? tabContainerActive : tabContainer}>
										<Text style={screen === 'MenuItem' ? tabTextActive : tabText}>Menu</Text>
									</View>
								</TouchableNativeFeedback>
							</View>
							<View style={{ flex: 1 }}>
								<TouchableNativeFeedback onPress={() => this.setState({ screen: 'OrderList' })}>
									<View style={screen === 'OrderList' ? tabContainerActive : tabContainer}>
										<Text style={screen === 'OrderList' ? tabTextActive : tabText}>Transaksi</Text>
									</View>
								</TouchableNativeFeedback>
							</View>
						</View>

						{this.renderScreen()}
					</ScrollView>
				</DrawerLayoutAndroid>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: COLOR.secondary_a,
		height: 60,
		shadowColor: '#000',
		shadowOffset: { width: 10, height: 20 },
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
	profileImageContainerDrawer: {
		height: 50,
		width: 50,
	},
	profileImageDrawer: {
		height: 80,
		width: 80,
		borderRadius: 50,
	},
	profileName: {
		textAlign: 'center',
		marginTop: 5,
		color: '#fff',
		fontSize: 20,
		fontFamily: 'Muli-Bold'
	},
	profileSupplierName: {
		textAlign: 'center',
		color: '#fff',
		marginBottom: 10,
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
	drawerItemText: {
		color: '#fff',
		fontSize: 14
	},
	menuIcon: {
		height: 20,
		width: 20,
		marginRight: 20
	}
}

const mapStateToProps = (state) => {
	const { user, orders } = state

	return { user, orders }
}

export default connect(mapStateToProps, { logout, unreadNotifFetch, ordersFetch })(Home)
