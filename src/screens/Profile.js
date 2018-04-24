import React, { Component } from 'react'
import { ScrollView, Dimensions, Animated, Alert, View, Text, Image, TouchableWithoutFeedback, TouchableNativeFeedback, RefreshControl, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import numeral from 'numeral'
import Icon from 'react-native-vector-icons/Ionicons'

import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { Card, CardSection, ContainerSection, Button } from '../components/common'

class Profile extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'Profil',
		headerRight:
			<Button
				style={{ margin: 5, marginRight: 10 }}
				onPress={() => navigation.navigate('ProfileEdit')}
			>
				Ubah
			</Button>
	})

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			data: {},
			modalVisible: false,

			suggestions: [],
			value: '',
			FishId: '',

			screen: 'Profile',
			scrollY: new Animated.Value(0)
		}
	}

	componentDidMount() {
		this.getData()
	}

	getData = () => {
		this.setState({ loading: true })
		let token = this.props.user.token

		axios.get(`${BASE_URL}/profile`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			this.setState({ data: response.data.user })
			this.setState({ loading: false })
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({ loading: false })
		})
	}

	deleteComodity = (id) => {
		this.setState({ loading: true })
		let token = this.props.user.token

		axios.delete(`${BASE_URL}/products/${id}`, {
			headers: { token },
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.getData()
			this.setState({ loading: false })
			ToastAndroid.show('Berhasil hapus komoditas', ToastAndroid.SHORT)
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({ loading: false })
		})
	}


	renderProfile = (data) => {
		return (
			<View>
				<View style={styles.card}>
					<View style={styles.cardSection}>
						<Text style={{ color: COLOR.secondary_a }}>Data Pribadi</Text>
					</View>

					<View style={{ borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5 }} />

					<View style={styles.cardSection}>
						<Text style={styles.labelStyle}>Alamat</Text>
						<Text style={styles.dataStyle}>
							{`${data.subDistrict} \n${data.village} \n${data.City && data.City.name}`}
						</Text>
					</View>
					<View style={styles.cardSection}>
						<Text style={styles.labelStyle}>No. Telp</Text>
						<Text style={styles.dataStyle}>{data.phone}</Text>
					</View>
					<View style={styles.cardSection}>
						<Text style={styles.labelStyle}>No. Identitas</Text>
						<Text style={styles.dataStyle}>{data.idNumber}</Text>
					</View>
					<View style={styles.cardSection}>
						<Text style={styles.labelStyle}>Email</Text>
						<Text style={styles.dataStyle}>{data.email}</Text>
					</View>
				</View>

				<View style={{ paddingBottom: '5%' }}>
					<View style={styles.card}>
						<View style={styles.cardSection}>
							<Text style={{ color: COLOR.secondary_a }}>Data Rekening</Text>
						</View>

						<View style={{ borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5 }} />

						<View style={styles.cardSection}>
							<Text style={styles.labelStyle}>Bank</Text>
							<Text style={styles.dataStyle}>{data.bank}</Text>
						</View>
						<View style={styles.cardSection}>
							<Text style={styles.labelStyle}>Cabang</Text>
							<Text style={styles.dataStyle}>{data.bankBranch}</Text>
						</View>
						<View style={styles.cardSection}>
							<Text style={styles.labelStyle}>Nomor Rekening</Text>
							<Text style={styles.dataStyle}>{data.bankAccount}</Text>
						</View>
						<View style={styles.cardSection}>
							<Text style={styles.labelStyle}>Atas Nama</Text>
							<Text style={styles.dataStyle}>{data.bankAccountName}</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}

	renderProducts = (data) => {
		console.log(data, 'DATA KOMODITAS')
		return (
			<View style={{ marginBottom: 20 }}>
				<Text style={{textAlign: 'right', marginRight: 15, marginTop: 5}}>
					{data.Products && data.Products.length} / 5 Komoditas
				</Text>
				{
					data.Products && data.Products.map(item =>
						<Card key={item.id}>
							<CardSection>
								<Image
									style={{ width: 100, height: 100 }}
									resizeMode="contain"
									source={{ uri: `${BASE_URL}/images/${item.Fish.photo}` }}
								/>
								<View style={{ flex: 1, margin: 13, flexDirection: 'column', justifyContent: 'space-around' }}>
									<Text style={{ color: COLOR.secondary_a, fontSize: 20, marginLeft: 10 }}>{item.Fish && item.Fish.name}</Text>
									<Text style={{ fontSize: 11, marginLeft: 10, fontFamily: 'Muli-Bold' }}>Kapasitas Produksi:</Text>
									<Text style={{ fontSize: 16, marginLeft: 10 }}>{numeral(item.capacity).format('0,0')}</Text>
								</View>
								<TouchableNativeFeedback 
									onPress={() =>
										Alert.alert(
											'Hapus Komoditas',
											'Yakin hapus komoditas?',
											[
												{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
												{text: 'Ya', onPress: () => this.deleteComodity(item.id)},
											]
										)
									}
								>
									<View style={{padding: 4}}>
										<Icon name="md-trash" size={18} />
									</View>
								</TouchableNativeFeedback>
							</CardSection>
						</Card>
					)
				}

				{
					data.Products && data.Products.length < 5 &&
					<View style={{ margin: 10 }}>
						<ContainerSection>
							<Button onPress={() => this.props.navigation.navigate('ProductForm')}>
								Tambah Komoditas
							</Button>
						</ContainerSection>
					</View>
				}
			</View>
		)
	}

	renderScreen = (data) => {
		if (this.state.screen === 'Products') {
			return this.renderProducts(data)
		}

		return this.renderProfile(data)
	}

	render() {
		const {
			headerHomeStyle,
			profileImageContainer, profileImage, profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive,
		} = styles

		const { data, screen } = this.state

		const toOne = this.state.scrollY.interpolate({
			inputRange: [185, 200],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		})

		const { width: SCREEN_WIDTH } = Dimensions.get('screen')

		return (
			<View style={styles.container}>
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
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Profile' })}>
								<View style={screen === 'Profile' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Profile' ? tabTextActive : tabText}>Profil</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Products' })}>
								<View style={screen === 'Products' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Products' ? tabTextActive : tabText}>Komoditas</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
				</Animated.View>
				<ScrollView 
					refreshControl={
						<RefreshControl
							refreshing={this.state.loading}
							onRefresh={() => this.getData()}
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
							<View style={{alignItems: 'center', marginBottom: 12}}>
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
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Profile' })}>
								<View style={screen === 'Profile' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Profile' ? tabTextActive : tabText}>Profil</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Products' })}>
								<View style={screen === 'Products' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Products' ? tabTextActive : tabText}>Komoditas</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
					{this.renderScreen(data)}
				</ScrollView>
			</View>
		)
	}
}

const styles = {
	container: {
		flex: 1
	},
	headerHomeStyle: {
		paddingTop: 20,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: COLOR.secondary_a,
		width: '100%'
	},
	menuContainerStyle: {
		flex: 4,
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
		marginBottom: 5,
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
	labelStyle: {
		fontWeight: 'bold',
		flex: 1
	},
	dataStyle: {
		flex: 1
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
	card: {
		elevation: 1,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 10,
		padding: 10,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#fff'
	},
	cardSection: {
		padding: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative'
	}
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(Profile)
