import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { ScrollView, View, Text, Image } from 'react-native'
import axios from 'axios'
import { BASE_URL } from '../constants'
import { Container, ContainerSection, Spinner } from '../components/common'

class RequestDetail extends Component {
	static navigationOptions = {
		title: 'Request Detail'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
		}
	}

	componentWillMount() {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/supplier/requests/${id}`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.data, loading: false})
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
		const { data } = this.state

		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<ScrollView>
				<Container>
					<ContainerSection style={{flexDirection: 'row'}}>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Image 
								style={styles.thumbnailStyle}
								source={require('../../assets/11.jpg')} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>{data.User ? data.User.name : ''}</Text>
							<Text style={styles.productName}>{data.Transaction ? data.Transaction.Fish.name : ''} - {data.Transaction ? data.Transaction.quantity : ''} Kg</Text>
							<Text style={{textAlign: 'right'}}>{moment(data.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							<Text style={{textAlign: 'right'}}>{data.Status ? data.Status.name : ''}</Text>
						</View>
					</ContainerSection>
				</Container>

				<View style={styles.detail}>
					<Text style={{fontSize: 18, fontWeight: 'bold'}}>Alamat Kirim</Text>
					<Text>Jalan Dago no. 119</Text>
					<Text>Kelurahan Dago</Text>
					<Text>Kecamatan Dago</Text>
					<Text>Bandng - Jawa Barat</Text>
					<Text>24 januari 2018</Text>
				</View>
			</ScrollView>
		)
	}
}

const styles = {
	thumbnailStyle: {
		height: 100,
		width: 100,
		borderRadius: 5
	},
	buyerName: {
		textAlign: 'left'
	},
	productName: {
		textAlign: 'right',
		fontSize: 18,
		color: '#000'
	},
	detail: {
		marginTop: 10,
		padding: 20,
		borderWidth: 1,
		borderColor: '#eaeaea'
	}
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(RequestDetail)
