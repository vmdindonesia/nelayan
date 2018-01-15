import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import ActionButton from 'react-native-action-button'
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../constants'
import { Container, ContainerSection } from '../components/common'

class Profile extends Component {
	static navigationOptions = {
		title: 'Profil'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			data: {},
		}
	}

	componentWillMount() {
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/profile`, {
			headers: {'x-access-token': token}
		})
		.then(response => {
			this.setState({data: response.data.user})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
		})
	}

	render() {
		const { 
			containerStyle, headerHomeStyle, menuContainerStyle,
			profileImageContainer, profileImage, profileName,
			labelStyle, dataStyle
		} = styles

		const { data } = this.state


		return (
			<View style={containerStyle}>
				<View style={headerHomeStyle}>
					<View style={profileImageContainer}>
						<Image 
							style={profileImage}
							source={require('../../assets/photo.png')} 
						/>
					</View>
					<Text style={profileName}>Suhardi Suharman</Text>
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

					<View style={{padding: 20}}>
						<Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>Komoditas</Text>
						<View style={{flexDirection: 'row'}}>
							{
								data.Products && data.Products.map(item =>
									<View style={{marginRight: 10}} key={item.id}>
										<Image 
											style={{width: 60, height: 60, borderRadius: 3}}
											source={require('../../assets/ikan.jpg')} 
										/>
										<Text key={item.id}>{item.Fish && item.Fish.name}</Text>
									</View> 
								)
							}
						</View>
					</View>
				</View>

				<ActionButton
					buttonColor="rgba(231,76,60,1)"
					onPress={() => console.log('hai')}
					icon={<Ionicons name="md-create" size={24} color="white" />}
				/>		
			</View>
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
		width: '100%'
	},
	menuContainerStyle: {
		flex: 5,
	},
	profileImageContainer: {
		backgroundColor: 'yellow',
		height: 60,
		width: 60,
		borderRadius: 30,
		alignSelf: 'center',
	},
	profileImage: {
		margin: 5,
		height: 50,
		width: 50
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
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(Profile)
