import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, Alert, Image, TouchableOpacity, TouchableWithoutFeedback, Linking, ToastAndroid, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker'
import Modal from 'react-native-modal'
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import { CheckBox, Rating } from 'react-native-elements'
import { Card, ContainerSection, Spinner, Button, Input } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import { ordersFetch } from '../actions'


class OrderDetail extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: `No. PO ${navigation.state.params.codeNumber}`,
		headerRight: 
			<TouchableOpacity 
				onPress={() => navigation.navigate('Message', {
					id: navigation.state.params.id,
					codeNumber: navigation.state.params.codeNumber,
					organizationType: navigation.state.params.organizationType,
					organization: navigation.state.params.organization
				})}
			>
				<View>
					<Image 
						style={{height: 20, width: 20, margin: 20}}
						source={require('../../assets/ic_diskusi_alt_white.png')} 
					/>
				</View>
			</TouchableOpacity>,
		headerTitleStyle: {
			alignSelf: 'center',
			fontSize: 14
		}
	})

	constructor(props) {
		super(props)
	
		this.state = {
			loading: true,
			data: {},
			checked: false,
			isModalVisible: false,
			isModalUploadVisible: false,

			sampleExpanded: false,
			contractExpanded: false,
			dpExpanded: false,
			deliveryExpanded: false,
			paidExpanded: false,
			doneExpanded: false,

			declineNotes: '',

			photo: null,
			photoStatus: '',

			survey: false,
			sample: false
		}
	}

	componentWillMount() {
		this.fetchDetail()
	}

	onChangeInput = (name, value) => {
		this.setState({[name]: value})
	}

	fetchDetail = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/supplier/orders/${id}`, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			let data = this.state.data

			data = response.data.data

			this.setState({
				data,
				loading: false,
				survey: data.Sample ? data.Sample.survey : false,
				sample: data.Sample ? data.Sample.sample : false
			})
		})
		.catch(error => {
			if (error.response) {
				ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
			}
			this.props.navigation.goBack()
		})
	}

	_toggleModal = (name) => {
		this.setState({ [name]: !this.state[name] })
	}

	acceptContract = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		this.setState({loading: true})

		let data = {
			approval: 1
		}

		axios.put(`${BASE_URL}/supplier/orders/${id}/contracts`, data, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.fetchDetail()
			this.setState({loading: false})
			Alert.alert('Berhasil!', 'Kontrak berhasil disetujui', [])
			this.props.ordersFetch(token)
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

	declineContract = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		this.setState({loading: true})

		let data = {
			approval: 0,
			text: this.state.declineNotes
		}

		axios.put(`${BASE_URL}/supplier/orders/${id}/contracts`, data, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.fetchDetail()
			this.setState({loading: false})
			Alert.alert('', 'Revisi kontrak akan dikirim ke pembeli', [])
			this.props.ordersFetch(token)
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

		this._toggleModal('isModalVisible')
	}

	confirmRequestSample = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		this.setState({loading: true})

		let data = {
			survey: this.state.survey ? 1 : 0,
			sample: this.state.sample ? 1 : 0,
		}

		axios.put(`${BASE_URL}/supplier/orders/${id}/samples`, data, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.fetchDetail()
			this.setState({loading: false})
			Alert.alert('Berhasil!', 'Request survey dan sample berhasil disetujui', [])
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

	selectPhotoTapped = (name, status) => {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		}

		ImagePicker.launchCamera(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled photo picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = { uri: response.uri };

				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };				
				this.setState({
					[name]: source,
					photoStatus: status
				});

				this._toggleModal('isModalUploadVisible')
			}
		});
	}

	uploadPhoto = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		let { photoStatus } = this.state
		this.setState({loading: true})

		let formData = new FormData()
		if (this.state.photo) {
			formData.append('photo', {
				uri: this.state.photo.uri,
				type: 'image/jpeg',
				name: `${photoStatus}.jpg`
			})
		}

		axios.post(`${BASE_URL}/supplier/orders/${id}/${photoStatus}`, formData, {
			headers: {token},
			timeout: REQUEST_TIME_OUT
		})
		.then(() => {
			this.fetchDetail()
			this._toggleModal('isModalUploadVisible')
			this.setState({loading: false, photoStatus: ''})
			Alert.alert('Berhasil!', 'Unggah bukti berhasil', [])
			this.props.ordersFetch(token)
		})
		.catch(error => {
			if (error.response) {
				ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
			}
			else {
				ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
			}
			this.setState({loading: false, photoStatus: ''})
		})
	}

	toggleCheckBox = (name) => {
		if (this.state.data.Sample[name] === true && this.state.data.Sample.StatusId === 16) {
			this.setState({[name]: !this.state[name]})
		}
	}

	render() {
		const { 
			sampleExpanded, contractExpanded, dpExpanded, deliveryExpanded, paidExpanded, doneExpanded, 
			data, photo, survey, sample
		} = this.state

		console.log(data)

		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={{flex: 1, padding: 10}}>
				<ScrollView 
					refreshControl={
						<RefreshControl
							refreshing={this.state.loading}
							onRefresh={() => this.fetchDetail()}
						/>
					}
				>
					<ContainerSection>
						<View style={{flexDirection: 'column', flex: 1, marginLeft: 10, marginRight: 10}}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${data.Request.Transaction.photo}`}} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>{data.Request.Transaction.Fish.name}</Text>
							<Text style={styles.buyerName}>{numeral(data.Request.Transaction.quantity).format('0,0')} Kg</Text>
							<Text>Rp {numeral(data.Request.Transaction.minBudget).format('0,0')} - {numeral(data.Request.Transaction.maxBudget).format('0,0')}</Text>
							<Text>{data.Request.Buyer.organizationType} {data.Request.Buyer.organization}</Text>
						</View>
					</ContainerSection>

					<Card style={{borderBottomWidth: 1, borderColor: '#eaeaea'}}>
						{
							data.Sample &&
							<View style={styles.card}>
								<ContainerSection>
									<TouchableWithoutFeedback onPress={() => this.setState({sampleExpanded: !sampleExpanded})}>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<Text style={sampleExpanded ? styles.statusTextActive : styles.statusText}>Survey & Sample</Text>
											<View style={{flex: 1}}>
												<Icon size={30} style={{alignSelf: 'flex-end'}} name={sampleExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
											</View>
										</View>
									</TouchableWithoutFeedback>
								</ContainerSection>
								{
									sampleExpanded ? 
										<ContainerSection>
											<View style={{flexDirection: 'column', flex: 1}}>
												<View>
													<Text>
														Pembeli mengirim permintaan untuk:
													</Text>
												</View>
												<View >
													<View style={{flexDirection: 'row', justifyContent: 'space-around' }}>
														<CheckBox
															title='Survey'
															checked={survey}
															onPress={() => this.toggleCheckBox('survey')}
														/>
														<CheckBox
															title='Sample'
															checked={sample}
															onPress={() => this.toggleCheckBox('sample')}
														/>
													</View>
												</View>
												<View style={{marginTop: 10}}>
												{
													data.Sample.StatusId === 16 ?
														<Button
															onPress={
																() => Alert.alert(
																	'',
																	'Yakin ingin konfirmasi request survey dan/atau sample?',
																	[
																		{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
																		{text: 'Ya', onPress: () => this.confirmRequestSample()},
																	]
																)
															}
														>
															Konfirmasi
														</Button>
														
													:
														<Text>Request Telah Dikonfirmasi</Text>
												}
												</View>
											</View>
										</ContainerSection>
									:
										<View />
								}
							</View>
						}

						{
							data.Contract ?
								<View style={styles.card}>
									<ContainerSection>
										<TouchableWithoutFeedback onPress={() => this.setState({contractExpanded: !contractExpanded})}>
											<View style={{flex: 1, flexDirection: 'row'}}>
												<Text style={contractExpanded ? styles.statusTextActive : styles.statusText}>Kontrak</Text>
												<View style={{flex: 1}}>
													<Icon size={30} style={{alignSelf: 'flex-end'}} name={contractExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
												</View>
											</View>
										</TouchableWithoutFeedback>
									</ContainerSection>
									{
										contractExpanded ? 
											<ContainerSection>
												<View style={{flexDirection: 'column', flex: 1}}>
													{
														data.Contract ?
															<View>
																{
																	data.Contract.StatusId === 4 ?
																		<View style={{marginTop: 10, flexDirection: 'row'}}>
																			<View style={{flex: 1, marginRight: 10}}>
																				<Button onPress={() => this._toggleModal('isModalVisible')}>Revisi</Button>
																			</View>
																			<View style={{flex: 1, marginLeft: 10}}>
																				<Button
																					onPress={
																						() => Alert.alert(
																							'Yakin ingin menyetujui kontrak?',
																							'Kontrak yang telah disetujui tidak dapat diubah',
																							[
																								{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
																								{text: 'Ya', onPress: () => this.acceptContract()},
																							]
																						)
																					}
																				>
																					Setuju
																				</Button>
																			</View>
																		</View>
																	:
																		<Text>Status: {data.Contract.Status.name}</Text>
																}
																<View> 
																	<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/files/${data.Contract.file}`).catch(err => console.error('An error occurred', err))}>
																		<View style={{marginTop: 10, flexDirection: 'row'}}>
																			<Text style={{color: COLOR.secondary_a}}>File Kontrak.pdf</Text>
																			<Icon size={20} style={{color: COLOR.secondary_a, marginLeft: 5}} name="md-download" />
																		</View>
																	</TouchableOpacity>
																</View>
															</View>
														:
															<View />
													}
												</View>
											</ContainerSection>
										:
											<View />
									}
									
								</View>
							:
								<View style={styles.card}>
									<ContainerSection>
										<Text>Menunggu pembeli membuat kontrak</Text>
									</ContainerSection>
								</View>
						}
						{
							data.Contract && data.Contract.StatusId === 5 &&
							<View style={styles.card}>
								<ContainerSection>
									<TouchableWithoutFeedback onPress={() => this.setState({dpExpanded: !dpExpanded})}>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<Text style={dpExpanded ? styles.statusTextActive : styles.statusText}>Pembayaran DP</Text>
											<View style={{flex: 1}}>
												<Icon size={30} style={{alignSelf: 'flex-end'}} name={dpExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
											</View>
										</View>
									</TouchableWithoutFeedback>
								</ContainerSection>
								{
									dpExpanded ? 
										<ContainerSection>
											<View style={{flexDirection: 'column', flex: 1}}>
												{
													data.downPayment ?
														<View>
															<Text>Status: {data.downPayment.Status.name}</Text>
															<Text>{moment(data.downPayment.Status.createdAt).format('DD/MM/YYYY')}</Text>
															<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${data.downPayment.photo}`).catch(err => console.error('An error occurred', err))}>
																<View>
																	<Image 
																		style={{width: '100%', height: 150}}
																		source={{uri: `${BASE_URL}/images/${data.downPayment.photo}`}} 
																	/>
																</View>
															</TouchableOpacity>
														</View>	
													:
														<Text>Menunggu DP dari Admin Aruna</Text>
												}								
											</View>
										</ContainerSection>
									:
										<View />
								}
							</View>
						}
						{
							data.downPayment && data.downPayment.StatusId === 26 &&
							<View style={styles.card}>
								<ContainerSection>
									<TouchableWithoutFeedback onPress={() => this.setState({deliveryExpanded: !deliveryExpanded})}>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<Text style={deliveryExpanded ? styles.statusTextActive : styles.statusText}>Pengiriman</Text>
											<View style={{flex: 1}}>
												<Icon size={30} style={{alignSelf: 'flex-end'}} name={deliveryExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
											</View>
										</View>
									</TouchableWithoutFeedback>
								</ContainerSection>
								{
									deliveryExpanded ? 
										<ContainerSection>
											<View style={{flexDirection: 'column', flex: 1}}>
												<Text style={{fontFamily: 'Muli-Bold'}}>1. Pengumpulan</Text>
												<View style={{marginBottom: 20, marginTop: 10}}>
													{
														data.collection && [41, 42].includes(data.collection.StatusId) ?
															<Text>Status: {data.collection ? data.collection.Status.name : '-'}</Text>
														:
															<View style={{marginBottom: 10}}>
																<Text style={{marginBottom: 10}}>Status: {data.collection ? data.collection.Status.name : 'Menunggu Unggah Bukti'}</Text>
																<Button onPress={() => this.selectPhotoTapped('photo', 'collections')}>
																	Unggah Bukti
																</Button>
															</View>
													}
													{ 
														data.collection &&
														<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${data.collection.photo}`).catch(err => console.error('An error occurred', err))}>
															<View style={{marginBottom: 10}}>
																<Image 
																	style={{width: '100%', height: 150}}
																	source={{uri: `${BASE_URL}/images/${data.collection.photo}`}} 
																/>
															</View>
														</TouchableOpacity>
													}
												</View>

												<Text style={{fontFamily: 'Muli-Bold'}}>2. Produksi</Text>
												<View style={{marginBottom: 20, marginTop: 10}}>
													{
														data.production && [44, 45].includes(data.production.StatusId) ?
															<Text>Status: {data.production ? data.production.Status.name : '-'}</Text>
														:
															<View style={{marginBottom: 10}}>
																<Text style={{marginBottom: 10}}>Status: {data.production ? data.production.Status.name : 'Menunggu Unggah Bukti'}</Text>
																<Button onPress={() => this.selectPhotoTapped('photo', 'productions')}>
																	Unggah Bukti
																</Button>
															</View>
													}
													{ 
														data.production &&
														<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${data.production.photo}`).catch(err => console.error('An error occurred', err))}>
															<View style={{marginBottom: 10}}>
																<Image 
																	style={{width: '100%', height: 150}}
																	source={{uri: `${BASE_URL}/images/${data.production.photo}`}} 
																/>
															</View>
														</TouchableOpacity>
													}
												</View>

												<Text style={{fontFamily: 'Muli-Bold'}}>3. Pengiriman</Text>
												<View style={{marginBottom: 20, marginTop: 10}}>
													{
														data.shipping && [28, 29].includes(data.shipping.StatusId) ?
															<Text>Status: {data.shipping ? data.shipping.Status.name : '-'}</Text>
														:
															<View style={{marginBottom: 10}}>
																<Text style={{marginBottom: 10}}>Status: {data.shipping ? data.shipping.Status.name : 'Menunggu Unggah Bukti'}</Text>
																<Button onPress={() => this.selectPhotoTapped('photo', 'shippings')}>
																	Unggah Bukti
																</Button>
															</View>
													}
													{ 
														data.shipping &&
														<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${data.shipping.photo}`).catch(err => console.error('An error occurred', err))}>
															<View>
																<Image 
																	style={{width: '100%', height: 150}}
																	source={{uri: `${BASE_URL}/images/${data.shipping.photo}`}} 
																/>
															</View>
														</TouchableOpacity>
													}
												</View>
											</View>
										</ContainerSection>
									:
										<View />
								}
							</View>
						}
						{
							data.shippingDelivered &&
							<View style={styles.card}>
								<ContainerSection>
									<TouchableWithoutFeedback onPress={() => this.setState({paidExpanded: !paidExpanded})}>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<Text style={paidExpanded ? styles.statusTextActive : styles.statusText}>Pelunasan</Text>
											<View style={{flex: 1}}>
												<Icon size={30} style={{alignSelf: 'flex-end'}} name={paidExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
											</View>
										</View>
									</TouchableWithoutFeedback>
								</ContainerSection>
								{
									paidExpanded ? 
										<ContainerSection>
											<View style={{flexDirection: 'column', flex: 1}}>
												{
													data.finalPayment ?
														<View>
															<Text>Status: {data.finalPayment.Status.name}</Text>
															<Text>{moment(data.finalPayment.Status.createdAt).format('DD/MM/YYYY')}</Text>
															<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/images/${data.finalPayment.photo}`).catch(err => console.error('An error occurred', err))}>
																<View>
																	<Image 
																		style={{width: '100%', height: 150}}
																		source={{uri: `${BASE_URL}/images/${data.finalPayment.photo}`}} 
																	/>
																</View>
															</TouchableOpacity>
														</View>	
													:
														<View>
															<Text>Status: {data.shippingDelivered.Status.name}</Text>
														</View>
												}								
											</View>
										</ContainerSection>
									:
										<View />
								}
							</View>
						}
						{
							data.Review &&
							<View style={styles.card}>
								<ContainerSection>
									<TouchableWithoutFeedback onPress={() => this.setState({doneExpanded: !doneExpanded})}>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<Text style={doneExpanded ? styles.statusTextActive : styles.statusText}>Selesai</Text>
											<View style={{flex: 1}}>
												<Icon size={30} style={{alignSelf: 'flex-end'}} name={doneExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
											</View>
										</View>
									</TouchableWithoutFeedback>
								</ContainerSection>
								{
									doneExpanded ? 
										<ContainerSection>
											<View style={{alignItems: 'center', flex: 1}}>
												<Text style={{textAlign: 'center', color: COLOR.secondary_a}}>Rating</Text>
												<Rating
													imageSize={20}
													readonly
													startingValue={data.Review.rating}
												/>
												<Text style={{textAlign: 'center', marginTop: 20, color: COLOR.secondary_a}}>Komentar</Text>
												<Text style={{textAlign: 'center'}}>{data.Review.comment}</Text>
											</View>									
										</ContainerSection>
									:
										<View />
								}
							</View>
						}
					</Card>

					<Modal
						isVisible={this.state.isModalVisible}
						onBackdropPress={() => this.setState({ isModalVisible: false })}
					>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<View style={{backgroundColor: 'white', borderRadius: 2, padding: 10}}>
								<Text style={{textAlign: 'center'}}>Catatan Revisi</Text>
								<View style={{margin: 10}}>
									<ContainerSection>
										<Input
											multiline
											lines={10}
											onChangeText={v => this.onChangeInput('declineNotes', v)}
											textAlignVertical="top"
										/>
									</ContainerSection>
									<ContainerSection>
										<Button
											onPress={
												() => Alert.alert(
													'Yakin ingin merevisi kontrak?',
													'Revisi kontrak akan terkirim ke buyer',
													[
														{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
														{text: 'Ya', onPress: () => this.declineContract()},
													]
												)
											}
										>
											Kirim
										</Button>
									</ContainerSection>
								</View>
							</View>
						</View>
					</Modal>

					<Modal
						isVisible={this.state.isModalUploadVisible}
						onBackdropPress={() => this.setState({ isModalUploadVisible: false })}
					>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<View style={{backgroundColor: 'white', borderRadius: 2, padding: 10}}>
								<Text style={{textAlign: 'center'}}>Unggah Bukti</Text>
								<View style={{margin: 10}}>
									<View style={{margin: 5}}>
										{ 
											photo &&
											<Image style={{height: 200}} source={photo} />
										}
									</View>
									<ContainerSection>
										<Button onPress={() => this.uploadPhoto()}>
											Unggah
										</Button>
									</ContainerSection>
								</View>
							</View>
						</View>
					</Modal>
				
				</ScrollView>
			</View>
		)
	}
}

const styles = {
	card: {
		borderTopWidth: 1,
		borderColor: '#eaeaea',
		padding: 5
	},
	thumbnailStyle: {
		height: 100,
		width: 100,
		borderRadius: 2
	},
	buyerName: {
		fontSize: 20
	},
	statusText: {
		fontSize: 20, 
	},
	statusTextActive: {
		fontSize: 20, 
		color: COLOR.secondary_a
	}
}

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps, {ordersFetch})(OrderDetail)
