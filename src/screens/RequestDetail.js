import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import moment from 'moment'
import { Alert, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons'

import { BASE_URL, COLOR } from '../constants'
import { Spinner } from '../components/common'

class RequestDetail extends Component {
	static navigationOptions = {
		title: 'Detail PO',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
		}
	}

	componentWillMount() {
		this.fetchDetail()
	}

	fetchDetail = () => {
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

	acceptRequest = () => {
		this.setState({loading: true})
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		let { data } = this.state

		let formData = {approval: 1}

		axios.put(`${BASE_URL}/supplier/requests/${id}`, formData, {
			headers: {token}
		})
		.then(() => {
			this.fetchDetail()
			this.setState({loading: false})
			Alert.alert(
				'Sukses!',
				`Terima kasih telah mengambil tawaran ${data.Buyer.name}\n\nTunggu kabar dari kami untuk transaksi selanjutnya`,
				[
					{text: 'Ok', onPress: () => {
						const resetAction = NavigationActions.reset({
							index: 1,
							actions: [
								NavigationActions.navigate({ routeName: 'Home'}),
								NavigationActions.navigate({ routeName: 'RequestList'})
							]
						})
						this.props.navigation.dispatch(resetAction)
					}}
				]
			)
		})
		.catch(error => {
			this.setState({loading: false})
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
		})
	}

	declineRequest = () => {
		this.setState({loading: true})
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		let { data } = this.state

		let formData = {approval: 0}

		axios.put(`${BASE_URL}/supplier/requests/${id}`, formData, {
			headers: {token}
		})
		.then(() => {
			this.setState({loading: false})
			Alert.alert(
				'Sukses!',
				'Request telah ditolak',
				[
					{text: 'Ok', onPress: () => {
						const resetAction = NavigationActions.reset({
							index: 1,
							actions: [
								NavigationActions.navigate({ routeName: 'Home'}),
								NavigationActions.navigate({ routeName: 'RequestList'})
							]
						})
						this.props.navigation.dispatch(resetAction)
					}}
				]
			)
		})
		.catch(error => {
			this.setState({loading: false})
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
		})
	}

	render() {
		const { data } = this.state
		console.log(data)

		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={styles.containerStyle}>
				<View>
					<Image 
						style={styles.thumbnailStyle}
						source={{uri: `${BASE_URL}/images/${data.Transaction.photo}`}} 
					/>
				</View>
				<View style={{margin: 5}}>
					<View style={{marginTop: 5, marginBottom: 10}}>
						<Text>{moment(data.createdAt).format('DD/MM/YYYY')}</Text>
						<Text style={styles.productName}>{data.Transaction ? data.Transaction.Fish.name : ''} - {data.Transaction ? data.Transaction.quantity : ''} Kg</Text>
					</View>
					<View style={{marginTop: 5, marginBottom: 10}}>
						<Text>Pengiriman Ke</Text>
						<Text style={styles.productName}>{data.Buyer ? (`${data.Buyer.organizationType} ${data.Buyer.organization}`) : ''}</Text>
						<Text style={{marginTop: 10}}>{data.Buyer ? data.Buyer.address : ''}</Text>
					</View>

					<View style={styles.detail}>
						<View style={{flex: 1, justifyContent: 'center'}}>
							<Icon name="md-information-circle" size={24} />
						</View>
						<View style={{flex: 6}}>
							<Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus officiis eum fugiat consequatur</Text>
						</View>
					</View>

					{
						data.Status && data.Status.id === 1 ?
							<View style={styles.actionButton}>
								<TouchableNativeFeedback
									onPress={() =>
										Alert.alert(
											'Ambil PO',
											'Yakin ambil PO?',
											[
												{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
												{text: 'Ya', onPress: () => this.acceptRequest()},
											]
										)
									}
								>
									<View style={styles.buttonStyle}>
										<Text style={styles.textStyle}>Ambil</Text>
									</View>
								</TouchableNativeFeedback>
								<TouchableNativeFeedback
									onPress={() =>
										Alert.alert(
											'Tolak PO',
											'Yakin menolak PO?',
											[
												{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
												{text: 'Ya', onPress: () => this.declineRequest()},
											]
										)
									}
								>
									<View style={styles.buttonStyle2}>
										<Text style={styles.textStyle}>Tolak</Text>
									</View>
								</TouchableNativeFeedback>
							</View>
						:
							<View style={styles.actionButton}>
								<Text>{data.Status.id === 2 ? 'Menunggu Konfirmasi dari pembeli' : ''}</Text>
							</View>
					}
				</View>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		padding: 20
	},
	thumbnailStyle: {
		height: 180,
		width: '100%',
		borderRadius: 2
	},
	buyerName: {
		textAlign: 'left'
	},
	productName: {
		fontSize: 20,
		color: '#000'
	},
	detail: {
		// flex: 1,
		flexDirection: 'row',
		marginTop: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: '#dfdfdf',
		borderRadius: 2
	},
	actionButton: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative',
		marginTop: 10
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: COLOR.secondary_a,
		borderRadius: 8,
		marginRight: 5,
	},
	buttonStyle2: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: COLOR.element_b4,
		borderRadius: 8,
		marginLeft: 5,
	},
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 10,
		paddingBottom: 10,
	},
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(RequestDetail)
