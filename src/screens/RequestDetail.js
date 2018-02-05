import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import moment from 'moment'
import { Alert, View, Text, Image, TouchableNativeFeedback } from 'react-native'
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

		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<View>
				<Container>
					<ContainerSection>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${data.Transaction.photo}`}} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>{data.Buyer ? data.Buyer.name : ''}</Text>
							<Text style={styles.productName}>{data.Transaction ? data.Transaction.Fish.name : ''} - {data.Transaction ? data.Transaction.quantity : ''} Kg</Text>
							<Text style={{textAlign: 'right'}}>{moment(data.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
							<Text style={{textAlign: 'right'}}>{data.Status ? data.Status.name : ''}</Text>
						</View>
					</ContainerSection>
				</Container>

				<View style={{height: 10}} />

				<View style={styles.detail}>
					<Text style={{fontSize: 18, fontWeight: 'bold'}}>Alamat Buyer</Text>
					<Text>{data.Buyer.subDistrict}</Text>
					<Text>{data.Buyer.village}</Text>
					<Text>{moment(data.createdAt).format('DD MMM YYYY')}</Text>
				</View>
				<View style={styles.detail}>
					<Text>Status: {data.Status.name}</Text>
				</View>

				{
					data.Status && data.Status.id === 1 ?
						<View style={styles.actionButton}>
							<TouchableNativeFeedback
								onPress={() =>
									Alert.alert(
										'Ambil Request Order',
										'Yakin ambil request order?',
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
										'Tolak Request Order',
										'Yakin menolak request order?',
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
							<Text style={{margin: 15}}>{data.Status.id === 2 ? 'Menunggu Konfirmasi dari pembeli' : ''}</Text>
						</View>
				}
			</View>
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
		// marginTop: 10,
		padding: 20,
		borderWidth: 1,
		borderColor: '#eaeaea'
	},
	actionButton: {
		padding: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		position: 'relative'
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: 'green',
		borderRadius: 2,
		marginLeft: 5,
		marginRight: 5,
	},
	buttonStyle2: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: 'red',
		borderRadius: 2,
		marginLeft: 5,
		marginRight: 5,
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
