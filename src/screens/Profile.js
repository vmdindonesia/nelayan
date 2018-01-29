import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../constants'
import { Card, CardSection, Container, ContainerSection, Button, Input, Spinner } from '../components/common'
import AutoComplete from '../components/AutoComplete'

class Profile extends Component {
	static navigationOptions = {
		title: 'Profil'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
			modalVisible: false,

			suggestions: [],
			value: '',
			FishId: ''
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

	render() {
		const { 
			containerStyle, headerHomeStyle, menuContainerStyle,
			profileImageContainer, profileImage, profileName,
			labelStyle, dataStyle
		} = styles

		const { data, FishId, value, loading } = this.state

		if (loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<ScrollView style={containerStyle}>
				<View style={headerHomeStyle}>
					<View style={profileImageContainer}>
						<Image 
							style={profileImage}
							source={{uri: `${BASE_URL}/images/${this.props.user.data.photo}`}} 
						/>
					</View>
					<Text style={profileName}>{this.props.user.data.name}</Text>
				</View>
				<View style={menuContainerStyle}>
					<Container>
						<ContainerSection>
							<Text style={labelStyle}>Data Lembaga</Text>
							<Text style={dataStyle}>
								{`${data.subDistrict} \n${data.village} \n${data.City && data.City.name}`}
							</Text>
						</ContainerSection>
						<ContainerSection>
							<Text style={labelStyle}>No. KTP</Text>
							<Text style={dataStyle}>{data.idNumber}</Text>
						</ContainerSection>
						<ContainerSection>
							<Text style={labelStyle}>No. Handphone</Text>
							<Text style={dataStyle}>{data.phone}</Text>
						</ContainerSection>
						<ContainerSection>
							<Text style={labelStyle}>Email</Text>
							<Text style={dataStyle}>{data.email}</Text>
						</ContainerSection>
					</Container>

					<View style={{paddingBottom: 20}}>
						<View style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 20}}>
							<Text style={{fontWeight: 'bold', fontSize: 20}}>
								Komoditas
							</Text>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('ProductForm')}>
								<View style={{width: 35}}>
									<Icon style={{marginLeft: 10}} name="md-add" size={20} />
								</View>
							</TouchableOpacity>
						</View>
						<Card>
							{
								data.Products && data.Products.map(item =>
									<CardSection key={item.id}>
										<Image
											style={{width: 60, height: 60, borderRadius: 3}}
											source={require('../../assets/ikan.jpg')} 
										/>
										<Text key={item.id}>{item.Fish && item.Fish.name}</Text>
										<TouchableOpacity onPress={() => this.props.navigation.navigate('ProductForm', {FishId: item.Fish.id, value: item.Fish.name, ProductId: item.id})}>
											<View style={{width: 35}}>
												<Icon style={{marginLeft: 10}} name="md-create" size={20} />
											</View>
										</TouchableOpacity>
									</CardSection>
								)
							}
						</Card>
					</View>
				</View>
			</ScrollView>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1
	},
	headerHomeStyle: {
		flex: 2,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: '#56bde6',
		width: '100%',
		paddingTop: 20,
		paddingBottom: 20
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
	labelStyle: {
		fontWeight: 'bold',
		flex: 1
	},
	dataStyle: {
		flex: 1
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(Profile)
