import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'

import { Card, ContainerSection, Spinner, Input } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'

class Message extends Component {
	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.organizationType || ''} ${navigation.state.params.organization ? navigation.state.params.organization : ''}`,
		headerRight: <View />
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
			text: '',
		}
	}

	componentDidMount() {
		this.fetchMessage()
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	onChangeInput = (name, v) => {
		this.setState({[name]: v})
	}

	fetchMessage = () => {
		console.log('masuk rekursif')
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token

		axios.get(`${BASE_URL}/orders/${id}/messages`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			this.setState({data: response.data.data, loading: false})
		})
		.catch(error => {
			if (error.response) {
				ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show('Koneksi internet bermasalah [9]', ToastAndroid.SHORT)
			}
			this.setState({loading: false})
		})

		this.timer = setTimeout(() => this.fetchMessage(), 5000)
	}

	postMessage = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token

		let formData = new FormData()
		formData.append('text', this.state.text)

		axios.post(`${BASE_URL}/orders/${id}/messages`, formData, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.setState({text: ''})
			this.fetchMessage()
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
		const { loading, data, text } = this.state
		console.log(data)

		if (loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={styles.container}>

				<View style={{marginTop: 5}}>
					<Card style={{backgroundColor: '#fff', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
						<ContainerSection>
							<Text style={{textAlign: 'center'}}>
								No. PO {this.props.navigation.state.params.codeNumber}
							</Text>
						</ContainerSection>
					</Card>
				</View>

				<ScrollView
					style={styles.body}
					ref={ref => this.scrollView = ref}
					onContentSizeChange={(contentWidth, contentHeight) => {
						this.scrollView.scrollToEnd({animated: true})
					}}
				>
					{
						data !== undefined && data.map(item =>
							<View key={item.id} style={styles.messageContainer}>
								<View style={item.SupplierId === this.props.user.data.id ? styles.myCard : styles.card}>
									<Text style={item.SupplierId === this.props.user.data.id ? styles.textMyCard : styles.textCard}>{item.text}</Text>
								</View>
								<View style={item.SupplierId === this.props.user.data.id ? styles.statusMyCard : styles.statusCard}>
									<Text style={{textAlign: item.SupplierId === this.props.user.data.id ? 'right' : 'left', fontSize: 9}}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
									{
										item.SupplierId === this.props.user.data.id &&
											<View style={{flexDirection: 'row'}}>
												<Icon size={12} style={{marginLeft: 5}} color={item.read ? COLOR.primary : '#65636363'} name="md-checkmark" />
												<Icon size={12} style={{marginLeft: -5}} color={item.read ? COLOR.primary : '#65636363'} name="md-checkmark" />
											</View>
									}
								</View>
							</View>
						)
					}
				</ScrollView>

				<View style={styles.send}>
					<ContainerSection>
						<Input
							onChangeText={val => this.onChangeInput('text', val)}
							placeholder="Tulis Pesan..."
							value={text}
							multiline
						/>
						<TouchableOpacity 
							disabled={text === ''} 
							onPress={() => this.postMessage()}
						>
							<View style={{marginLeft: 10}}>
								<Icon size={46} color={text === '' ? '#eaeaea' : COLOR.secondary_a} name="md-send" />
							</View>
						</TouchableOpacity>
					</ContainerSection>
				
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
		margin: 10,
		marginLeft: 12,
		marginRight: 12
	},
	messageContainer: {
		padding: 15,
		paddingLeft: 18,
		paddingRight: 18,
	},
	card: {
		elevation: 1,
		padding: 15,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#eaeaea',
		justifyContent: 'flex-end',
		borderRadius: 25,
		alignSelf: 'flex-start',
		marginBottom: 2
	},
	textCard: {
		textAlign: 'left',
		fontSize: 16
	},
	statusCard: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
	},
	myCard: {
		elevation: 1,
		paddingTop: 10,
		paddingBottom: 10,
		padding: 15,
		backgroundColor: COLOR.secondary_b,
		justifyContent: 'flex-end',
		borderRadius: 25,
		alignSelf: 'flex-end',
		marginBottom: 2
	},
	textMyCard: {
		textAlign: 'left',
		fontSize: 16,
		color: '#fff'
	},
	statusMyCard: {
		flexDirection: 'row',
		alignSelf: 'flex-end',
	},

}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(Message)

