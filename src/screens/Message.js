import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import { CheckBox, Button, FormInput, Rating } from 'react-native-elements'
import { Card, CardSection, Container, ContainerSection, Spinner, InputChat } from '../components/common'
import { BASE_URL } from '../constants'

class Message extends Component {
	static navigationOptions = ({navigation}) => ({
		title: 'Diskusi',
		headerRight: 
			<TouchableOpacity onPress={navigation.state.params.refresh}>
				<View>
					<Icon style={{marginRight: 20}} size={30} name="md-refresh" />
				</View>
			</TouchableOpacity>
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			data: {},
		}
	}

	componentDidMount() {
		this.fetchMessage()

		this.props.navigation.setParams({
      refresh: this.fetchMessage
    })
	}

	fetchMessage = () => {
		this.setState({loading: true})

		let id = this.props.navigation.state.params.id
		let token = this.props.user.token

		axios.get(`${BASE_URL}/orders/${id}/messages`, {
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
		const { loading, data } = this.state
		console.log(data)

		if (loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={styles.container}>

				<ScrollView style={styles.body}>
					{
						data && data.map(item =>
							<View key={item.id} style={styles.messageContainer}>
								<Text style={{textAlign: item.SupplierId === this.props.user.data.id ? 'right' : 'left', fontSize: 16}}>{item.text}</Text>
								<Text style={{textAlign: item.SupplierId === this.props.user.data.id ? 'right' : 'left', fontSize: 9}}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							</View>
						)
					}
				</ScrollView>

				<View style={styles.send}>
					<Container>
						<ContainerSection>
							<InputChat
								placeholder="Tulis pesan di sini"
								multiline
							/>
							<Button
								title='Kirim'
								backgroundColor="blue"
								containerViewStyle={{marginTop: 15}}
								buttonStyle={{padding: 10}}
							/>
						</ContainerSection>
					</Container>
				
				</View>
			</View>
		)
	}
}

const styles = {
	container: {
		justifyContent: 'space-between',
		flex: 1
	},
	body: {
		flex: 1
	},
	send: {
		backgroundColor: '#eaeaea',
		height: 80,
	},
	messageContainer: {
		padding: 15,
		borderWidth: 1,
		borderColor: '#eaeaea'
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(Message)

