import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'

import { BASE_URL, COLOR } from '../constants'
import { Card, CardSection, Spinner, ContainerSection, Button } from '../components/common'

class Profile extends Component {
	static navigationOptions = ({navigation}) => ({
		title: 'Profil',
		headerRight:
			<Button 
				style={{margin: 5, marginRight: 10}} 
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

			screen: 'Profile'

		}
	}

	componentDidMount() {
		this.getData()
	}

	getData = () => {
		this.setState({loading: true})
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/profile`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.user})
			this.setState({loading: false})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loading: false})
		})
	}

	renderProfile = (data) => {
		return (
			<ScrollView style={{marginBottom: 20}}>
				<View style={styles.card}>
					<View style={styles.cardSection}>
						<Text style={{color: COLOR.secondary_a}}>Data Pribadi</Text>
					</View>

					<View style={{borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5}} />

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

				<View style={styles.card}>
					<View style={styles.cardSection}>
						<Text style={{color: COLOR.secondary_a}}>Data Rekening</Text>
					</View>

					<View style={{borderWidth: 1, borderColor: '#eaeaea', width: '96%', marginLeft: '2%', margin: 5}} />

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
				</View>
			</ScrollView>
		)
	}

	renderProducts = (data) => {
		return (
			<ScrollView style={{marginBottom: 20}}>
				{
					data.Products && data.Products.map(item =>
						<Card key={item.id}>
							<CardSection>
								<Image
									style={{width: 100, height: 100}}
									source={{uri: `${BASE_URL}/images/${item.Fish.photo}`}} 
								/>
								<Text style={{color: COLOR.secondary_a, fontSize: 20, marginLeft: 10}}>{item.Fish && item.Fish.name}</Text>
							</CardSection>
						</Card>
					)
				}

				<View style={{margin: 10}}>
					<ContainerSection>
						<Button onPress={() => this.props.navigation.navigate('ProductForm')}>
							Tambah Komoditas
						</Button>
					</ContainerSection>
				</View>
			</ScrollView>
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
			containerStyle, headerHomeStyle, menuContainerStyle,
			profileImageContainer, profileImage, profileName, coin, point, tabContainer, tabContainerActive, tabText, tabTextActive, 
		} = styles

		const { data, loading, screen } = this.state

		if (loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

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
					<View style={{flexDirection: 'row', marginBottom: 10}}>
						<View style={{flex: 1}}>
							<TouchableNativeFeedback onPress={() => this.setState({screen: 'Profile'})}>
								<View style={screen === 'Profile' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Profile' ? tabTextActive : tabText}>Profil</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{flex: 1}}>
							<TouchableNativeFeedback onPress={() => this.setState({screen: 'Products'})}>
								<View style={screen === 'Products' ? tabContainerActive : tabContainer}>
									<Text style={screen === 'Products' ? tabTextActive : tabText}>Komoditas</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>

					{this.renderScreen(data)}
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
		paddingBottom: 10,
		flex: 2,
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
