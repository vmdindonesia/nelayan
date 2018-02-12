import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, Alert, Image, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker'
import Modal from 'react-native-modal'
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import { CheckBox, Button, FormInput, Rating } from 'react-native-elements'
import { Card, CardSection, Container, ContainerSection, Spinner } from '../components/common'
import { BASE_URL } from '../constants'
import { ordersFetch } from '../actions'


class OrderDetail extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: `Order ${navigation.state.params.id}`,
		headerRight: 
			<TouchableOpacity onPress={() => navigation.navigate('Message', {id: navigation.state.params.id})}>
				<View>
					<Icon style={{marginRight: 20}} size={30} name="md-chatboxes" />
				</View>
			</TouchableOpacity>
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
			headers: {token}
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
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loading: false})
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
			headers: {token}
		})
		.then(response => {
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
			headers: {token}
		})
		.then(response => {
			this.fetchDetail()
			this.setState({loading: false})
			Alert.alert('Berhasil!', 'Permintaan revisi kontrak telah dikirim ke pembeli', [])
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
			headers: {token}
		})
		.then(response => {
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

	selectPhotoTapped = (name) => {
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
					[name]: source
				});

				this._toggleModal('isModalUploadVisible')
			}
		});
	}

	uploadShippingPhoto = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		this.setState({loading: true})

		let formData = new FormData()
		if (this.state.photo) {
			formData.append('photo', {
				uri: this.state.photo.uri,
				type: 'image/jpeg',
				name: 'shipping.jpg'
			})
		}

		axios.post(`${BASE_URL}/supplier/orders/${id}/shippings`, formData, {
			headers: {token}
		})
		.then(response => {
			this.fetchDetail()
			this._toggleModal('isModalUploadVisible')
			this.setState({loading: false})
			Alert.alert('Berhasil!', 'Unggah bukti pengiriman berhasil', [])
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

	toggleCheckBox = (name) => {
		if (this.state.data.Sample[name] === true) {
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
			<ScrollView style={{flex: 1}}>
				<Container>
					<ContainerSection>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${data.Request.Transaction.photo}`}} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>{data.Request.Transaction.Fish.name}</Text>
							<Text>{data.Request.Buyer.name}</Text>
							<Text>{data.Request.Transaction.quantity}</Text>
							<Text>Rp {numeral(data.Request.Transaction.minBudget).format('0,0')} - {numeral(data.Request.Transaction.maxBudget).format('0,0')}</Text>
						</View>
					</ContainerSection>
				</Container>

				{
					data.Sample &&
					<Card>
						<CardSection>
							<TouchableWithoutFeedback onPress={() => this.setState({sampleExpanded: !sampleExpanded})}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<Text style={{fontSize: 20}}>Survey & Sample</Text>
									<View style={{flex: 1}}>
										<Icon size={30} style={{alignSelf: 'flex-end'}} name={sampleExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CardSection>
						{
							sampleExpanded ? 
								<CardSection>
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
													raised 
													title='Konfirmasi' 
													backgroundColor="blue" 
													containerViewStyle={{width: '100%', marginLeft: 0}} 
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
												/>
											:
												<Text>Request Telah Dikonfirmasi</Text>
										}
										</View>
									</View>
								</CardSection>
							:
								<View />
						}
					</Card>
				}

				{
					data.Contract ?
						<Card>
							<CardSection>
								<TouchableWithoutFeedback onPress={() => this.setState({contractExpanded: !contractExpanded})}>
									<View style={{flex: 1, flexDirection: 'row'}}>
										<Text style={{flex: 1, fontSize: 20}}>Kontrak</Text>
										<View style={{flex: 1}}>
											<Icon size={30} style={{alignSelf: 'flex-end'}} name={contractExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
										</View>
									</View>
								</TouchableWithoutFeedback>
							</CardSection>
							{
								contractExpanded ? 
									<CardSection>
										<View style={{flexDirection: 'column', flex: 1}}>
											{
												data.Contract ?
													<View>
														<View> 
															<TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}/files/${data.Contract.file}`).catch(err => console.error('An error occurred', err))}>
																<View style={{marginTop: 10, flexDirection: 'row'}}>
																	<Text style={{color: 'blue'}}>File Kontrak.pdf</Text>
																	<Icon size={20} style={{color: 'blue', marginLeft: 5}} name="md-download" />
																</View>
															</TouchableOpacity>
														</View>
														{
															data.Contract.StatusId === 4 ?
																<View style={{marginTop: 10, flexDirection: 'row'}}>
																	<View style={{flex: 1}}>
																		<Button raised title='Revisi' onPress={() => this._toggleModal('isModalVisible')} backgroundColor="red" containerViewStyle={{width: '100%', marginLeft: 0}} />
																	</View>
																	<View style={{flex: 1}}>
																		<Button
																			raised 
																			title='Setuju' 
																			backgroundColor="green" 
																			containerViewStyle={{width: '100%', marginLeft: 0}} 
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
																		/>
																	</View>
																</View>
															:
																<Text>Status: {data.Contract.Status.name}</Text>
														}
													</View>
												:
													<View />
											}
										</View>
									</CardSection>
								:
									<View />
							}
							
						</Card>
					:
						<Card>
							<CardSection>
								<Text>Menunggu pembeli membuat kontrak</Text>
							</CardSection>
						</Card>
				}

				{
					data.downPayment &&
					<Card>
						<CardSection>
							<TouchableWithoutFeedback onPress={() => this.setState({dpExpanded: !dpExpanded})}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<Text style={{flex: 1, fontSize: 20}}>Pembayaran DP</Text>
									<View style={{flex: 1}}>
										<Icon size={30} style={{alignSelf: 'flex-end'}} name={dpExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CardSection>
						{
							dpExpanded ? 
								<CardSection>
									<View style={{flexDirection: 'column', flex: 1}}>
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
									</View>
								</CardSection>
							:
								<View />
						}
					</Card>
				}

				{
					data.downPayment && data.downPayment.StatusId === 26 &&
					<Card>
						<CardSection>
							<TouchableWithoutFeedback onPress={() => this.setState({deliveryExpanded: !deliveryExpanded})}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<Text style={{flex: 1, fontSize: 20}}>Pengiriman</Text>
									<View style={{flex: 1}}>
										<Icon size={30} style={{alignSelf: 'flex-end'}} name={deliveryExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CardSection>
						{
							deliveryExpanded ? 
								<CardSection>
									<View style={{flexDirection: 'column', flex: 1}}>
										{
											data.shipping && [28, 29].includes(data.shipping.StatusId) ?
												<View>
													<Text>Status: {data.shipping ? data.shipping.Status.name : '-'}</Text>
												</View>
											:
												<View>
													<Button 
														raised 
														title='Unggah Bukti' 
														backgroundColor="blue" 
														containerViewStyle={{width: '100%', marginLeft: 0}} 
														onPress={() => this.selectPhotoTapped('photo')}
													/>
													<Text>Status: {data.shipping ? data.shipping.Status.name : '-'}</Text>
												</View>
										}
										<View>
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
								</CardSection>
							:
								<View />
						}
					</Card>
				}

				{
					data.finalPayment &&
					<Card>
						<CardSection>
							<TouchableWithoutFeedback onPress={() => this.setState({paidExpanded: !paidExpanded})}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<Text style={{flex: 1, fontSize: 20}}>Pelunasan</Text>
									<View style={{flex: 1}}>
										<Icon size={30} style={{alignSelf: 'flex-end'}} name={paidExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CardSection>
						{
							paidExpanded ? 
								<CardSection>
									<View style={{flexDirection: 'column', flex: 1}}>
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
									</View>
								</CardSection>
							:
								<View />
						}
					</Card>
				}

				{
					data.Done &&
					<Card>
						<CardSection>
							<TouchableWithoutFeedback onPress={() => this.setState({doneExpanded: !doneExpanded})}>
								<View style={{flex: 1, flexDirection: 'row'}}>
									<Text style={{flex: 1, fontSize: 20}}>Selesai</Text>
									<View style={{flex: 1}}>
										<Icon size={30} style={{alignSelf: 'flex-end'}} name={doneExpanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CardSection>
						{
							doneExpanded ? 
								<CardSection>
									<View style={{alignItems: 'center', flex: 1}}>
										<Rating
											imageSize={20}
											readonly
											startingValue={3.5}
											// style={{ styles.rating }}
										/>
										<Text style={{textAlign: 'center'}}>Ini isinya komentar yang dikasih pembeli buat nelayan. bisa suka bisa gasuka</Text>
									</View>									
								</CardSection>
							:
								<View />
						}
					</Card>
				}

				<Modal
					isVisible={this.state.isModalVisible}
					onBackdropPress={() => this.setState({ isModalVisible: false })}
				>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{backgroundColor: 'white', borderRadius: 2, padding: 10}}>
							<Text style={{textAlign: 'center', marginBottom: 20}}>Catatan Revisi</Text>
							<FormInput 
								multiline
								autoCorrect={false}
								onChangeText={v => this.onChangeInput('declineNotes', v)}
							/>
							<Button 
								raised 
								title='Kirim' 
								backgroundColor="blue" 
								containerViewStyle={{marginTop: 20}}
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
							/>
						</View>
					</View>
				</Modal>

				<Modal
					isVisible={this.state.isModalUploadVisible}
					onBackdropPress={() => this.setState({ isModalUploadVisible: false })}
				>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{backgroundColor: 'white', borderRadius: 2, padding: 10}}>
							<Text style={{textAlign: 'center', marginBottom: 20}}>Unggah Bukti Pengiriman</Text>
							{ 
								photo &&
								<Image style={{height: 200}} source={photo} />
							}
							<Button 
								raised 
								title='Unggah' 
								backgroundColor="blue" 
								containerViewStyle={{marginTop: 20}}
								onPress={() => this.uploadShippingPhoto()}
							/>
						</View>
					</View>
				</Modal>
			
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
	titleStyle: {
		fontSize: 18,
		paddingLeft: 15,
		paddingTop: 400
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

export default connect(mapStateToProps, {ordersFetch})(OrderDetail)
