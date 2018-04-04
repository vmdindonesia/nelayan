import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, Picker, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import numeral from 'numeral';
import { setUserToken } from '../actions'
import { BASE_URL, COLOR } from '../constants'
import { ContainerSection, Input, Spinner, InputDate, Button } from '../components/common'
import AutoComplete from './../components/AutoComplete';

class CreateAuction extends Component {
	static navigationOptions = {
		title: 'Buat Lelang',
		headerRight: <View />
	}

	constructor(props) {
		super(props)

		this.state = {
			photo: null,
			suggestions: [],
			value: '',
			FishId: '',
			unitFish: '',
			isDisabled: false,
			valueCity: '',
			loadingCity: null,
			loader: null,
			idCity: '',
			address: '',
			openPrice: '',
			IncrementPrice: '',
			dateEnd: '',
			dateStart: '',
			PickerDate: false,
			loadingKomoditas: null,
			quantity: '',
			dating: '',
			temp: '',
			data: ''
		}
	}

	componentWillMount() {
		return this.getData();
	}


	onChangeInput = (name, v) => {
		this.setState({ [name]: v });
	}


	onCitySelected = (item) => {
		this.setState({
			suggestionsCity: [],
			idCity: item.id,
			valueCity: item.name
		})
	}


	getData = () => {
		this.setState({ loading: true })
		let token = this.props.user.token

		axios.get(`${BASE_URL}/profile`, {
			headers: { token },
		})
			.then(response => {
				this.setState({ data: response.data.user })
				this.setState({ loading: false })
			})
			.catch(error => {
				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}
				this.setState({ loading: false })
			})
	}

	queryCitySuggestion = (text) => {
		this.setState({
			valueCity: text,
			loadingCity: true,
			idCity: ''
		})

		axios.get(`${BASE_URL}/cities?key=${text}&pageSize=5sorting=ASC`)
			.then(response => {
				res = response.data.data
				this.setState({ suggestionsCity: res, loadingCity: false })
			})
			.catch(error => {
				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}
				this.setState({ loadingCity: false })
			})
	}

	takePhoto() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};


		ImagePicker.showImagePicker(options, (response) => {
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
				const source = { uri: response.uri };
				this.setState({ photo: source })
			}
		});
	}

	datePicker = (name) => {
		this.setState({ PickerDate: true, dating: name });
	};

	hideDatePicker = () => this.setState({ PickerDate: false });

	handleDatePicked = (date) => {
		console.log(date)
		console.log(this.state.dating, 'DATING')
		const dateTemp = moment(date).format('YYYY-MM-DD h:mm:ss');
		const dateNow = moment(date).format('DD/MM/YYYY');

		if (this.state.dating === 'dateStart') {
			this.setState({ datePick: dateTemp, dateStart: dateNow })
		} else {
			this.setState({ datePick: dateTemp, dateEnd: dateNow })
		}

		this.hideDatePicker();
	};


	checkSecurity() {
		const {
			photo,
			FishId,
			unitFish,
			idCity,
			address,
			openPrice,
			IncrementPrice,
			dateEnd,
			dateStart,
			quantity
		} = this.state;

		switch (photo) {
			case '':
				return ToastAndroid.show('Foto Ikan Tidak Boleh Kosong', ToastAndroid.SHORT);
			case null:
				return ToastAndroid.show('Foto Ikan Tidak Boleh Kosong', ToastAndroid.SHORT);
			default:
				console.log('Photo Lolos');
				switch (FishId) {
					case '':
						return ToastAndroid.show('Komoditas Tidak Boleh Kosong', ToastAndroid.SHORT);
					default:
						console.log('Komoditas Lolos');
						switch (unitFish) {
							case '':
								return ToastAndroid.show('Unit Tidak Boleh Kosong', ToastAndroid.SHORT);
							default:
								console.log('Unit Lolos');
								switch (address) {
									case '':
										return ToastAndroid.show('Alamat Tidak Boleh Kosong', ToastAndroid.SHORT);
									default:
										console.log('Address Lolos');
										switch (idCity) {
											case '':
												return ToastAndroid.show('Kota Tidak Boleh Kosong', ToastAndroid.SHORT);
											default:
												console.log('Kota Lolos');
												switch (openPrice) {
													case '':
														return ToastAndroid.show('Harga Pembuka Tidak Boleh Kosong', ToastAndroid.SHORT);
													default:
														console.log('Open Price Lolos');
														switch (IncrementPrice) {
															case '':
																return ToastAndroid.show('Increment Tidak Boleh Kosong', ToastAndroid.SHORT);
															default:
																console.log('Increment Lolos');
																switch (dateStart) {
																	case '':
																		return ToastAndroid.show('Tanggal Mulai Tidak Boleh Kosong', ToastAndroid.SHORT);
																	default:
																		console.log('Date Start Lolos');
																		switch (dateEnd) {
																			case '':
																				return ToastAndroid.show('Tanggal Berakhir Tidak Boleh Kosong', ToastAndroid.SHORT);
																			default:
																				console.log('Date End Lolos')
																				switch (quantity) {
																					case '':
																						return ToastAndroid.show('Tanggal Berakhir Tidak Boleh Kosong', ToastAndroid.SHORT);
																					default:
																						console.log('Kuantitas Lolos')
																						return this.createAuction();
																				}
																		}
																}
														}
												}
										}
								}
						}
				}
		}
	}

	createAuction() {
		this.setState({ loader: true })
		const dataAuction = new FormData();
		const {
			photo,
			FishId,
			unitFish,
			idCity,
			address,
			openPrice,
			IncrementPrice,
			dateEnd,
			dateStart,
			quantity
		} = this.state;

		dataAuction.append('FishId', FishId);
		dataAuction.append('DestinationCityId', idCity);
		dataAuction.append('quantity', quantity);
		dataAuction.append('unit', unitFish);
		dataAuction.append('openingPrice', openPrice);
		dataAuction.append('minIncrement', IncrementPrice);
		dataAuction.append('startDate', IncrementPrice);
		dataAuction.append('endDate', IncrementPrice);
		dataAuction.append('address', IncrementPrice);
		dataAuction.append('photo', {
			uri: photo,
			type: 'image/jpeg',
			name: 'auction.png'
		});

		const token = this.props.user.token

		axios.post(`${BASE_URL}/supplier/auctions`,
			dataAuction
			, {
				headers: {
					'Content-Type': 'multipart/form-data',
					token
				}
			}).then(response => {
				res = response.data.data;
				console.log(response, 'RES');
				this.setState({ loader: false });
				ToastAndroid.show('Sukses Buat Lelang', ToastAndroid.SHORT)
				const resetAction = NavigationActions.reset({
					index: 1,
					actions: [
						NavigationActions.navigate({ routeName: 'Home' }),
						NavigationActions.navigate({ routeName: 'Store' })
					]
				})
				this.props.navigation.dispatch(resetAction)
			})
			.catch(error => {
				this.setState({ loader: false });
				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}
			})
	}


	render() {
		const {
			loader,
			unitFish,
			address,
			suggestionsCity,
			valueCity,
			loadingCity,
			openPrice,
			IncrementPrice,
			dateStart,
			dateEnd,
			quantity,
			data
		} = this.state;
		return (
			<View style={styles.containerStyle}>
				<ScrollView>
					<View style={styles.card}>
						<ContainerSection>
							<View style={styles.thumbnailContainerStyle}>
								<TouchableOpacity onPress={this.takePhoto.bind(this)}>
									<View>
										{this.state.photo === null ?
											<Image
												style={styles.thumbnailStyle}
												source={require('./../../assets/ic_add_a_photo.png')}
												resizeMode='contain'
											/>
											:
											<Image style={{ marginLeft: '17%', height: 110, width: 95, borderRadius: 10 }} source={this.state.photo} />
										}
									</View>
								</TouchableOpacity>
							</View>
							<View style={styles.headerContentStyle}>
								<ContainerSection>
									<View style={{ flex: 1, borderColor: '#a9a9a9', borderRadius: 5, borderWidth: 1, height: 47 }}>
										<Picker
											selectedValue={unitFish}
											onValueChange={v => this.onChangeInput('unitFish', v)}
										>
											<Picker.Item label='Pilih Komoditas' value='' />
											{
												data ?
													data.Products && data.Products.map((item, index) =>
														<Picker.Item key={index} label={item.Fish.name} value={item.Fish.id} />
													)
													:
													<View />
											}
										</Picker>
									</View>
								</ContainerSection>
								<ContainerSection>
									<Input
										placeholder='Kuantitas'
										keyboardType="numeric"
										value={quantity ? numeral(parseInt(quantity, 0)).format('0,0') : ''}
										onChangeText={v => this.onChangeInput('quantity', v.replace(/\./g, ''))}
									/>
									<View style={{ flex: 1, borderRadius: 5, height: 47 }}>
										<Text style={{ padding: '10%', marginLeft: '20%' }}>Kg</Text>
									</View>
								</ContainerSection>
							</View>
						</ContainerSection>
						<View style={{ margin: 10 }}>
							<ContainerSection>
								<Input
									label='Alamat'
									placeholder="Alamat Asal"
									value={address}
									onChangeText={v => this.onChangeInput('address', v)}
								/>
							</ContainerSection>
							<ContainerSection>
								<AutoComplete
									label="Kota Tujuan"
									placeholder="Kota"
									suggestions={suggestionsCity}
									onChangeText={text => this.queryCitySuggestion(text)}
									value={valueCity}
									ref="input"
								>
									{
										loadingCity ?
											<View style={{ flex: 1 }}>
												<Spinner size='large' />
											</View>
											:
											suggestionsCity && suggestionsCity.map(item =>
												<TouchableOpacity
													key={item.id}
													onPress={() => this.onCitySelected(item)}
												>
													<View style={styles.containerItemAutoSelect}>
														<Text>{item.name}</Text>
													</View>
												</TouchableOpacity>
											)
									}
								</AutoComplete>
							</ContainerSection>
						</View>
					</View>

					<View style={styles.card}>
						<View style={{ margin: 10 }}>
							<ContainerSection>
								<Input
									label='Harga Pembuka'
									placeholder='Rp. 1.000.000'
									value={openPrice ? numeral(parseInt(openPrice, 0)).format('0,0') : ''}
									onChangeText={v => this.onChangeInput('openPrice', v)}
								/>
								<View style={{ flex: 1 }}>
									<Input
										label='Kelipatan'
										placeholder='Rp. 1.000.000'
										value={IncrementPrice ? numeral(parseInt(IncrementPrice, 0)).format('0,0') : ''}
										onChangeText={v => this.onChangeInput('IncrementPrice', v)}
									/>
								</View>
							</ContainerSection>
							<ContainerSection style={{ paddingBottom: 10 }}>
								<InputDate
									label='Tanggal Mulai'
									value={dateStart}
									onChangeText={v => this.onChangeInput('dateStart', v)}
									onFocus={() => this.datePicker('dateStart')}
									icon={'icon_date'}
								/>
								<InputDate
									label='Tanggal Selesai'
									value={dateEnd}
									onChangeText={v => this.onChangeInput('dateEnd', v)}
									onFocus={() => this.datePicker('dateEnd')}
									icon={'icon_date'}
								/>
								<DateTimePicker
									isVisible={this.state.PickerDate}
									onConfirm={this.handleDatePicked}
									onCancel={this.hideDatePicker}
									minimumDate={new Date()}
								/>
							</ContainerSection>
							<ContainerSection>
								<View />
							</ContainerSection>
						</View>
					</View>

					<View style={{ padding: 20 }}>
						<ContainerSection>
							{
								loader ?
									<View style={{ flex: 1 }}>
										<Spinner size='small' />
									</View>
									:
									<Button
										onPress={() => {
											this.checkSecurity();
										}}
									>
										Selesai
									</Button>
							}
						</ContainerSection>
					</View>

					<View>
						<Text style={{ textAlign: 'center', marginTop: 5 }}>
							Pertanyaan mengenai Official Store ?
						</Text>
					</View>
					<View>
						<Text style={{ textAlign: 'center', marginTop: 3, marginBottom: 15, color: COLOR.secondary_a }}>
							Hubungi Aruna
						</Text>
					</View>

				</ScrollView>
			</View>
		)
	}
}

const styles = {
	containerStyle: {
		flex: 1,
		marginTop: 20
	},
	card: {
		borderRadius: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: '2%',
		backgroundColor: '#FFF'
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		flex: 1
	},
	thumbnailStyle: {
		height: 50,
		width: 70,
		marginLeft: '20%'
	},
	itemContainerStyle: {
		borderBottomWidth: 1,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		backgroundColor: '#fff'
	},
	headerContentStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 2,
		flex: 1,
		// marginTop: 5,
		marginLeft: '-15%',
		// marginBottom: 10,
		// flexDirection: 'column',
		// justifyContent: 'space-around'
	},
	pickerUnitStyle: {
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7,
		borderWidth: 1,
		height: 47,
		backgroundColor: '#fff'
	},
	containerItemAutoSelect: {
		padding: 10,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		position: 'relative'
	},
}

const mapStateToProps = state => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { setUserToken })(CreateAuction)
