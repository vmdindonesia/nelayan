import React, { Component } from 'react'
import { View, ScrollView, Text, Image, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, DrawerLayoutAndroid } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import OneSignal from 'react-native-onesignal'

import { logout, unreadNotifFetch } from '../actions'
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
			redirectToNotification: false
		}
	}

	componentWillMount() {
		OneSignal.addEventListener('received', this.onReceived)
		OneSignal.addEventListener('opened', this.onOpened)
		OneSignal.addEventListener('registered', this.onRegistered)
		OneSignal.addEventListener('ids', this.onIds)

		this.props.unreadNotifFetch(this.props.user.token)
	}

	componentDidMount() {
		OneSignal.configure({})
	}

	componentWillUnmount() {
		OneSignal.removeEventListener('received', this.onReceived)
		OneSignal.removeEventListener('opened', this.onOpened)
		OneSignal.removeEventListener('registered', this.onRegistered)
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

	onRegistered(notifData) {
		console.log('Device had been registered for push notifications!', notifData)
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
		const { screen, redirectToNotification } = this.state

		console.log(this.props.user.unreadNotif, 'jumlah unread')

		if (this.props.user.unreadNotif > 0 && redirectToNotification === false) {
			this.props.navigation.navigate('NotificationList')
			this.setState({redirectToNotification: true})
		}

		const { 
			containerStyle, headerHomeStyle, menuContainerStyle, 
			profileImageContainer, profileImage, profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive
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
			}
		]

		const menuDrawer = (
			<ScrollView style={{flex: 1, backgroundColor: COLOR.secondary_a}}>
				<View style={{padding: 30, paddingTop: 20}}>
					<ContainerSection>
						<View style={{flexDirection: 'row', flex: 1}}>
							<Text style={styles.drawerItemText}>Nelayan Aruna</Text>
							<View style={{flex: 1}}>
								<TouchableOpacity onPress={() => this.refs.drawer.closeDrawer()}>
									<View>
										<Icon style={{color: '#fff', alignSelf: 'flex-end'}} st name="md-arrow-back" size={24} />
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</ContainerSection>
					<View style={{borderTopWidth: 1, borderColor: '#fff', width: '70%', marginLeft: 5, marginRight: 5, marginBottom: 20, marginTop: 10}} />
					
					{
						menus.map((item, index) =>
							<TouchableOpacity 
								key={index} 
								onPress={() => this.props.navigation.navigate(item.screen)}
							>
								<View style={{marginBottom: 20}}>
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

					<View style={{borderTopWidth: 1, borderColor: '#fff', width: '70%', marginLeft: 5, marginRight: 5, marginBottom: 20, marginTop: 10}} />

					<TouchableOpacity onPress={() => this.props.navigation.navigate('Term')}>
						<View style={{marginBottom: 20}}>
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
						<View style={{marginBottom: 20}}>
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
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({ routeName: 'Login'})
								]
							})
							this.props.navigation.dispatch(resetAction)
						})}
					>
						<View style={{marginBottom: 20}}>
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
				<DrawerLayoutAndroid
					ref="drawer"
					drawerWidth={300}
					drawerPosition={DrawerLayoutAndroid.positions.Left}
					renderNavigationView={() => menuDrawer}
				>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => this.refs.drawer.openDrawer()}>
							<Icon size={25} name="md-menu" color="#fff" />
						</TouchableOpacity>
						<Text style={styles.headerText}>Nelayan Aruna Staging</Text>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('NotificationList')}>
							<Image 
								style={{height: 20, width: 15}}
								source={
									this.props.user.unreadNotif > 0 ?
										require('../../assets/ic_notification_on.png')
									:
										require('../../assets/ic_notification.png')
								} 
							/>
						</TouchableOpacity>
					</View>

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
	},
	headerHomeStyle: {
		paddingTop: 20,
		paddingBottom: 10,
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
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { logout, unreadNotifFetch })(Home)
