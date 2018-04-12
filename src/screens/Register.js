import React, { Component } from 'react'
import axios from 'axios'
import { NavigationActions } from 'react-navigation'
import { ScrollView, Text, Picker, Alert, Keyboard, ToastAndroid, TouchableOpacity, View, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { Container, ContainerSection, Input, Button, Spinner, PickerCustom } from '../components/common'
import { BASE_URL, COLOR, REQUEST_TIME_OUT } from '../constants'
import AutoComplete from '../components/AutoComplete'

class Register extends Component {
	static navigationOptions = {
		headerTitle: 'Pendaftaran Akun',
		headerRight: <View />,
	}

	constructor(props) {
		super(props)

		this.state = {
			organizationType: '',
			organization: '',
			CityId: '',
			subDistrict: '',
			village: '',

			name: '',
			idNumber: '',
			phone: '',
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
			referralCode: '',

			bank: '',
			bankBranch: '',
			bankAccount: '',
			bankAccountName: '',

			loading: false,
			suggestions: [],
			values: ['', '', '', '', ''],
			FishIds: ['', '', '', '', ''],
			loadings: [false, false, false, false, false],

			loadingCity: false,
			suggestionsCity: [],
			valueCity: '',

			photo: null,
			idPhoto: null,

			// Add Kapal dan Alat
			statusComboShip: true,
			ShipSize: [],
			textInputShipDropDown: [],
			textInputShip: [],
			tempShipName: '',
			tempShipSize: '',
			plusShip: false,
			ShipName: [],

			statusComboForge: true,
			forgeName: [],
			nameForge: '',
			textInputForge: [],
			plusForge: false
		}
	}

	componentWillMount() {
		console.log('Registrasi');
	}

	onCitySelected = (item) => {
		this.setState({
			suggestionsCity: [],
			CityId: item.id,
			valueCity: item.name
		})
	}

	onItemSelected = (index, item) => {
		const { FishIds, values } = this.state
		FishIds[index] = item.id
		values[index] = item.name

		this.setState({
			suggestions: [],
			FishIds,
			values
		})
	}

	onChangeInput = (name, v) => {
		this.setState({ [name]: v })
	}

	onChangeInputShip = (name, v) => {
		this.setState({
			statusComboShip: false,
			plusShip: true
		}, () => {
			this.addTextInputShipDropDown(this.state.textInputShipDropDown.length, v);
		});
	}

	onChangeInputForge = (name, v) => {
		this.setState({
			statusComboForge: false,
			plusForge: true
		}, () => {
			this.addTextInputForge(this.state.textInputForge.length, v);
		});
	}

	onChangeInputShipName = (name, v, key) => {
		console.log(name, 'Name');
		console.log(v, 'Value');
		console.log(key, 'Key');
		this.setState({ [name]: v }, () => {
			const newShipName = this.state.ShipName;
			newShipName[key] = v;
			this.setState({ ShipName: newShipName }, () => {
				console.log(this.state.ShipName, 'Ship Name');
			})
		});
	}

	onChangeInputShipSize = (name, v, key) => {
		console.log(name, 'Name');
		console.log(v, 'Value');
		console.log(key, 'Key')
		this.setState({ [name]: v }, () => {
			const newShipSize = this.state.ShipSize;
			newShipSize[key] = v;
			this.setState({ ShipSize: newShipSize }, () => {
				console.log(this.state.ShipSize, 'Ship Size');
			})
		});
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
				let source = { uri: response.uri };

				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					[name]: source
				});
			}
		});
	}

	queryCitySuggestion = (text) => {
		this.setState({
			valueCity: text,
			loadingCity: true,
			CityId: ''
		})

		axios.get(`${BASE_URL}/cities/search?key=${text}`)
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

		if (text.length === 1) {
			ToastAndroid.show('Geser halaman ke atas untuk lihat daftar pilihan kota', ToastAndroid.SHORT)
		}
	}

	querySuggestion = (index, text) => {
		const { values, suggestions, loadings, FishIds } = this.state
		values[index] = text
		loadings[index] = true
		FishIds[index] = ''

		this.setState({
			values, loadings
		})

		axios.get(`${BASE_URL}/fishes/search?key=${text}`)
			.then(response => {
				res = response.data.data
				suggestions[index] = res
				loadings[index] = false
				this.setState({ suggestions, loadings })
			})
			.catch(error => {
				if (error.response) {
					alert(error.response.data.message)
				}
				else {
					alert('Koneksi internet bermasalah')
				}
				loadings[index] = false
				this.setState({ loadings })
			})

		if (text.length === 1) {
			ToastAndroid.show('Geser halaman ke atas untuk lihat daftar pilihan Komoditas', ToastAndroid.SHORT)
		}
	}

	regexEmail = (email) => {
		const validate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return validate.test(email);
	};

	onSubmitRegister = () => {
		Keyboard.dismiss()
		console.log(this.state, 'STATE BOS')

		const data = this.state;
		// this.submitRegister(data)

		// Form Validation
		if (data.organizationType === '') {
			ToastAndroid.show('Belum mengisi Jenis Lembaga', ToastAndroid.SHORT)
		}
		else if (data.password !== data.confirmPassword) {
			ToastAndroid.show('Konfirmasi password tidak cocok dengan Password', ToastAndroid.SHORT)
		}
		else if (data.CityId === '') {
			ToastAndroid.show('Kota / Kabupaten harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (data.idNumber.length !== 16) {
			ToastAndroid.show(`No. KTP harus 16 digit, bukan ${data.idNumber.length} digit`, ToastAndroid.SHORT)
		}
		else if (data.FishIds[0] === '' && data.FishIds[1] === '' && data.FishIds[2] === '' && data.FishIds[3] === '' && data.FishIds[4] === '') {
			ToastAndroid.show('Harus pilih minimal 1 komoditas', ToastAndroid.SHORT)
		}
		else if (data.FishIds[0] === '' && data.values[0] !== '') {
			ToastAndroid.show('Komoditas ke 1 tidak valid. harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (data.FishIds[1] === '' && data.values[1] !== '') {
			ToastAndroid.show('Komoditas ke 2 tidak valid. harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (data.FishIds[2] === '' && data.values[2] !== '') {
			ToastAndroid.show('Komoditas ke 3 tidak valid. harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (data.FishIds[3] === '' && data.values[3] !== '') {
			ToastAndroid.show('Komoditas ke 4 tidak valid. harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (data.FishIds[4] === '' && data.values[4] !== '') {
			ToastAndroid.show('Komoditas ke 5 tidak valid. harus dipilih dari daftar pilihan', ToastAndroid.SHORT)
		}
		else if (!this.regexEmail(data.email)) {
			ToastAndroid.show('Format Email Salah', ToastAndroid.SHORT);
		}
		else {
			this.submitRegister(data)
		}
	}

	submitRegister = (data) => {
		this.setState({ loading: true });

		let formData = new FormData()
		// organization data
		formData.append('organizationType', data.organizationType)
		formData.append('organization', data.organization)
		formData.append('CityId', data.CityId)
		formData.append('subDistrict', data.subDistrict)
		formData.append('village', data.village)
		// personal data
		if (data.photo) {
			formData.append('photo', {
				uri: data.photo.uri,
				type: 'image/jpeg',
				name: 'profile.jpg'
			})
		}
		formData.append('name', data.name)
		formData.append('idNumber', data.idNumber)
		if (data.idPhoto) {
			formData.append('idPhoto', {
				uri: data.idPhoto.uri,
				type: 'image/jpeg',
				name: 'ktp.jpg'
			})
		}
		formData.append('phone', data.phone)
		formData.append('email', data.email)
		formData.append('username', data.username)
		formData.append('password', data.password)
		formData.append('referralCode', data.referralCode)
		// bank data
		formData.append('bank', data.bank)
		formData.append('bankBranch', data.bankBranch)
		formData.append('bankAccount', data.bankAccount)
		formData.append('bankAccountName', data.bankAccountName)
		// komoditas data
		data.FishIds.map((item, index) =>
			(item !== '' ? formData.append(`FishIds[${index}]`, item) : '')
		)

		if (data.ShipSize.length < 1) {
			data.ShipName.map((shiped) =>
				(shiped !== '' ? formData.append('MyShips', { 'name': shiped, 'type': data.shipId }) : '')
			)
		} else if (data.ShipSize.length >= 1) {
			data.ShipName.map((shiped, i) =>
				(shiped !== '' ? formData.append('MyShips', { 'name': shiped, 'size': data.ShipSize[i], 'type': data.shipId }) : '')
			)
		}

		data.forgeName.map((item) =>
			(shiped !== '' ? formData.append('MyFishingGearIds', item) : '')
		)
		// console.log(data, 'DATAAAA');
		console.log(formData, 'FORM DATA');
		axios.post(`${BASE_URL}/supplier/register`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			timeout: REQUEST_TIME_OUT
		})
			.then(response => {
				console.log(response.status)

				const resetAction = NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({ routeName: 'Login' })
					]
				})
				this.props.navigation.dispatch(resetAction)
				Alert.alert('Registrasi berhasil', `Silahkan cek email anda ${data.email} untuk verifikasi email`, [])

				this.setState({ loading: false })
			})
			.catch(error => {
				console.log(error.response)

				if (error.response) {
					ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
				}
				else {
					ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
				}

				this.setState({ loading: false })
			})
	}


	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button
				onPress={
					() => Alert.alert(
						'',
						'Yakin sudah mengisi informasi profil anda dengan tepat?',
						[
							{ text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
							{ text: 'Ya', onPress: () => this.onSubmitRegister() },
						]
					)
				}
			>
				Register
			</Button>
		)
	}

	addShipComboBox = () => {
		this.setState({
			statusComboShip: true,
			plusShip: false
		});
	}

	addForgeComboBox = () => {
		this.setState({
			statusComboForge: true,
			plusForge: false
		});
	}

	addTextInputShipDropDown = (key, value) => {
		// Dropdown
		const textInputShipDropDown = this.state.textInputShipDropDown;
		this.setState({ textInputShipDropDown });
		const sizeShip = value;

		// TextInput
		const { tempShipName, tempShipSize } = this.state;
		const textInputShip = this.state.textInputShip;
		this.setState({ textInputShip })

		if (value === '<=1 GT') {
			textInputShipDropDown.push(
				<View key={key}>
					<ContainerSection>
						<View style={{ padding: 5, width: '100%' }}>
							<Input
								label="Ukuran Kapal"
								placeholder="Ukuran Kapal"
								value={sizeShip}
								editable={false}
							/>
						</View>
					</ContainerSection>
					<ContainerSection>
						<View style={{ padding: 5, width: '100%' }}>
							<Input
								label='Nama Kapal'
								placeholder="Nama Kapal"
								value={tempShipName[key]}
								onChangeText={v => this.onChangeInputShipName(`tempShipName${key}`, v, key)}
							/>
						</View>
					</ContainerSection>
				</View>
			);
		} else if (value === '>1 GT') {
			textInputShipDropDown.push(
				<View key={key}>
					<ContainerSection>
						<View style={{ padding: 5, width: '100%' }}>
							<Input
								label="Ukuran Kapal"
								placeholder="Ukuran Kapal"
								value={sizeShip}
								editable={false}
							/>
						</View>
					</ContainerSection>
					<ContainerSection>
						<View style={{ padding: 5, width: '100%' }}>
							<Input
								label='Nama Kapal'
								placeholder="Nama Kapal"
								value={tempShipName[key]}
								onChangeText={v => this.onChangeInputShipName(`tempShipName${key}`, v, key)}
							/>
						</View>
					</ContainerSection>

					<ContainerSection>
						<View style={{ padding: 5, width: '100%' }}>
							<Input
								label='Ukuran Kapal'
								placeholder="Ukuran Kapal"
								value={tempShipSize[key]}
								onChangeText={v => this.onChangeInputShipSize(`tempShipSize${key}`, v, key)}
							/>
						</View>
					</ContainerSection>
				</View>
			);
		}
	}


	addTextInputForge = (key, value) => {
		//Alat TextInput
		const textInputForge = this.state.textInputForge;
		this.setState({ textInputForge });

		textInputForge.push(
			<View key={key}>
				<ContainerSection>
					<Input
						label="Alat Tangkap"
						placeholder="Alat Tangkap"
						value={value}
						editable={false}
					/>
				</ContainerSection>
			</View>
		);

		// Push Value
		const newforgeName = this.state.forgeName
		newforgeName[key] = value
		this.setState({ forgeName: newforgeName });
	}


	render() {
		const {
			organizationType,
			organization,
			subDistrict,
			village,

			name,
			idNumber,
			phone,
			email,
			username,
			password,
			confirmPassword,
			referralCode,

			bank,
			bankBranch,
			bankAccount,
			bankAccountName,

			suggestions,
			values,
			loadings,

			loadingCity,
			suggestionsCity,
			valueCity,

			idPhoto,
			photo,

			// Add Kapal da Alat
			statusComboShip,
			textInputShipDropDown,
			textInputShip,
			ShipSize,
			plusShip,


			statusComboForge,
			forgeName,
			nameForge,
			textInputForge,
			plusForge
		} = this.state;

		return (
			<ScrollView
				style={styles.containerStyle}
				keyboardShouldPersistTaps="always"
			>
				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Informasi Lembaga
						</Text>
					</ContainerSection>
					<ContainerSection>
						<View style={styles.pickerContainer}>
							<Text style={styles.pickerTextStyle}>Jenis Lembaga</Text>
							<View style={styles.pickerStyle}>
								<Picker
									style={{ flex: 1 }}
									selectedValue={organizationType}
									onValueChange={v => this.onChangeInput('organizationType', v)}
									textStyle={{ fontSize: 24 }}
								>
									<Picker.Item label="-- Pilih Jenis Lembaga --" value="" />
									<Picker.Item label="Kelompok Nelayan" value="Kelompok Nelayan" />
									<Picker.Item label="Personal" value="Personal" />
								</Picker>
							</View>
						</View>
					</ContainerSection>
					{
						organizationType !== 'Personal' &&
						<ContainerSection>
							<Input
								label='Nama Lembaga'
								value={organization}
								onChangeText={v => this.onChangeInput('organization', v)}
							/>
						</ContainerSection>
					}

					<ContainerSection>
						<Text style={styles.headerStyle}>
							Lokasi Nelayan
						</Text>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Kota / Kabupaten"
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
					<ContainerSection>
						<Input
							label='Kecamatan'
							placeholder='contoh: Antapani'
							value={subDistrict}
							onChangeText={v => this.onChangeInput('subDistrict', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Desa / Kelurahan'
							placeholder='contoh: Antapani Kidul'
							value={village}
							onChangeText={v => this.onChangeInput('village', v)}
						/>
					</ContainerSection>
				</Container>

				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Informasi Personal
						</Text>
					</ContainerSection>

					<Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Upload Foto Profil</Text>
					<ContainerSection>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<TouchableOpacity onPress={() => this.selectPhotoTapped('photo')}>
								<View>
									{photo === null ?
										<Image
											source={require('../../assets/ic_add_a_photo.png')}
										/>
										:
										<Image style={styles.avatar} source={photo} />
									}
								</View>
							</TouchableOpacity>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Nama Lengkap'
							placeholder='contoh: Ahmad Darudi'
							value={name}
							onChangeText={v => this.onChangeInput('name', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='No. KTP'
							placeholder='contoh: 3213179890294565'
							keyboardType="numeric"
							value={idNumber}
							onChangeText={v => this.onChangeInput('idNumber', v)}
						/>
					</ContainerSection>

					<Text style={[styles.pickerTextStyle, { marginLeft: 5, marginTop: 10 }]}>Upload Foto KTP</Text>
					<ContainerSection>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<TouchableOpacity onPress={() => this.selectPhotoTapped('idPhoto')}>
								<View>
									{idPhoto === null ?
										<Image
											source={require('../../assets/ic_add_a_photo.png')}
										/>
										:
										<Image style={{ height: 200, width: 300 }} source={idPhoto} />
									}
								</View>
							</TouchableOpacity>
						</View>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='No. HP'
							placeholder='contoh: 085621017922'
							keyboardType="numeric"
							value={phone}
							onChangeText={v => this.onChangeInput('phone', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Email'
							placeholder='contoh: erwin@gmail.com'
							value={email}
							onChangeText={v => this.onChangeInput('email', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Username'
							placeholder='contoh: erwin95'
							value={username}
							onChangeText={v => this.onChangeInput('username', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Password'
							placeholder='minimal 6 karakter'
							secureTextEntry
							value={password}
							onChangeText={v => this.onChangeInput('password', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Konfirmasi Password'
							placeholder='minimal 6 karakter'
							secureTextEntry
							value={confirmPassword}
							onChangeText={v => this.onChangeInput('confirmPassword', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Kode Referral'
							placeholder='boleh dikosongkan'
							value={referralCode}
							onChangeText={v => this.onChangeInput('referralCode', v)}
						/>
					</ContainerSection>
				</Container>

				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Informasi Rekening
						</Text>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Nama Bank'
							value={bank}
							onChangeText={v => this.onChangeInput('bank', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Cabang'
							value={bankBranch}
							onChangeText={v => this.onChangeInput('bankBranch', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Nomor Rekening'
							keyboardType="numeric"
							value={bankAccount}
							onChangeText={v => this.onChangeInput('bankAccount', v)}
						/>
					</ContainerSection>
					<ContainerSection>
						<Input
							label='Atas Nama'
							value={bankAccountName}
							onChangeText={v => this.onChangeInput('bankAccountName', v)}
						/>
					</ContainerSection>
				</Container>

				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Informasi Komoditas
						</Text>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions[0]}
							onChangeText={text => this.querySuggestion(0, text)}
							value={values[0]}
						>
							{
								loadings[0] ?
									<View style={{ flex: 1 }}>
										<Spinner size='large' />
									</View>
									:
									suggestions[0] && suggestions[0].map(item =>
										<TouchableOpacity
											key={item.id}
											onPress={() => this.onItemSelected(0, item)}
										>
											<View style={styles.containerItemAutoSelect}>
												<Text>{item.name}</Text>
											</View>
										</TouchableOpacity>
									)
							}
						</AutoComplete>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions[1]}
							onChangeText={text => this.querySuggestion(1, text)}
							value={values[1]}
						>
							{
								loadings[1] ?
									<View style={{ flex: 1 }}>
										<Spinner size='large' />
									</View>
									:
									suggestions[1] && suggestions[1].map(item =>
										<TouchableOpacity
											key={item.id}
											onPress={() => this.onItemSelected(1, item)}
										>
											<View style={styles.containerItemAutoSelect}>
												<Text>{item.name}</Text>
											</View>
										</TouchableOpacity>
									)
							}
						</AutoComplete>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions[2]}
							onChangeText={text => this.querySuggestion(2, text)}
							value={values[2]}
						>
							{
								loadings[2] ?
									<View style={{ flex: 1 }}>
										<Spinner size='large' />
									</View>
									:
									suggestions[2] && suggestions[2].map(item =>
										<TouchableOpacity
											key={item.id}
											onPress={() => this.onItemSelected(2, item)}
										>
											<View style={styles.containerItemAutoSelect}>
												<Text>{item.name}</Text>
											</View>
										</TouchableOpacity>
									)
							}
						</AutoComplete>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions[3]}
							onChangeText={text => this.querySuggestion(3, text)}
							value={values[3]}
						>
							{
								loadings[3] ?
									<View style={{ flex: 1 }}>
										<Spinner size='large' />
									</View>
									:
									suggestions[3] && suggestions[3].map(item =>
										<TouchableOpacity
											key={item.id}
											onPress={() => this.onItemSelected(3, item)}
										>
											<View style={styles.containerItemAutoSelect}>
												<Text>{item.name}</Text>
											</View>
										</TouchableOpacity>
									)
							}
						</AutoComplete>
					</ContainerSection>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions[4]}
							onChangeText={text => this.querySuggestion(4, text)}
							value={values[4]}
						>
							{
								loadings[4] ?
									<View style={{ flex: 1 }}>
										<Spinner size='large' />
									</View>
									:
									suggestions[4] && suggestions[4].map(item =>
										<TouchableOpacity
											key={item.id}
											onPress={() => this.onItemSelected(4, item)}
										>
											<View style={styles.containerItemAutoSelect}>
												<Text>{item.name}</Text>
											</View>
										</TouchableOpacity>
									)
							}
						</AutoComplete>
					</ContainerSection>
				</Container>

				<Container>
					<ContainerSection>
						<Text style={styles.headerStyle}>
							Peralatan (Opsional)
						</Text>
					</ContainerSection>

					{
						statusComboShip ?
							<View>
								<View style={{ flexDirection: 'row', flex: 1 }}>
									<Text style={{ flex: 1 }}>Pilih Ukuran Kapal</Text>
								</View>
								<ContainerSection>
									<View style={{ flex: 1, borderColor: '#a9a9a9', borderWidth: 1, height: 47 }}>
										<Picker
											selectedValue={ShipSize}
											onValueChange={v => this.onChangeInputShip('ShipSize', v)}
										>
											<Picker.Item label='--- Pilih ---' value='' />
											<Picker.Item label='<= 1 GT' value='<=1 GT' />
											<Picker.Item label='>1 GT' value='>1 GT' />
										</Picker>
									</View>
								</ContainerSection>
							</View>
							:
							<View />
					}

					{
						plusShip ?
							<View>
								<TouchableOpacity
									onPress={() => {
										console.log('Tambah Kapal Mas');
										this.setState({
											plusShip: false
										}, () => {
											this.addShipComboBox();
										});
									}}
								>
									<Text style={{ marginLeft: '65%' }}>Tambah Kapal +</Text>
								</TouchableOpacity>
							</View>
							:
							<View />
					}

					{
						textInputShipDropDown && textInputShipDropDown.map((item) =>
							item
						)
					}


					{
						statusComboForge ?
							<View>
								<View style={{ flexDirection: 'row', flex: 1 }}>
									<Text style={{ flex: 1 }}>Pilih Alat Tangkap</Text>
								</View>
								<ContainerSection>
									<View style={{ flex: 1, borderColor: '#a9a9a9', borderWidth: 1, height: 47 }}>
										<Picker
											selectedValue={nameForge}
											onValueChange={v => this.onChangeInputForge('nameForge', v)}
										>
											<Picker.Item label='--- Pilih ---' value='' />
											<Picker.Item label='Pukat Udang' value='Pukat Udang' />
											<Picker.Item label='Pukat Kantung' value='Pukat Kantung' />
											<Picker.Item label='Pukat Karang' value='Pukat Karang' />
										</Picker>
									</View>
								</ContainerSection>
							</View>
							:
							<View />
					}

					{
						plusForge ?
							<View style={{ flex: 1 }}>
								<TouchableOpacity
									onPress={() => {
										console.log('Tambah Alat Mas');
										this.setState({
											plusForge: false
										}, () => {
											this.addForgeComboBox();
										});
									}}
								>
									<Text style={{ marginLeft: '70%' }}>Tambah Alat +</Text>
								</TouchableOpacity>
							</View>
							:
							<View />
					}

					{
						textInputForge && textInputForge.map((item) =>
							item
						)
					}

					{/* <View style={{ flexDirection: 'row', flex: 1 }}>
						<Text style={{ flex: 1 }}>Alat Tangkap</Text>
						<TouchableOpacity
							onPress={() => {
								console.log('Tambah Alat Mas');
								this.addAlat(this.state.comboInput.length)
							}}
						>
							<Text style={{ flex: 1, marginLeft: '40%' }}>Tambah Alat +</Text>
						</TouchableOpacity>
					</View> */}

					<View style={{ marginTop: 20, marginBottom: 20 }}>
						<ContainerSection>
							{this.renderButton()}
						</ContainerSection>
					</View>
				</Container>


			</ScrollView>
		)
	}
}

const styles = {
	headerStyle: {
		color: COLOR.secondary_a,
		fontSize: 18
	},
	pickerContainer: {
		flex: 1,
		marginBottom: 5
	},
	pickerStyle: {
		borderColor: '#a9a9a9',
		borderRadius: 5,
		paddingLeft: 7,
		borderWidth: 1,
		backgroundColor: '#fff'
	},
	pickerTextStyle: {
		color: '#5e5e5e',
		fontSize: 14,
		flex: 1,
		marginTop: 10,
		marginBottom: 10
	},
	containerItemAutoSelect: {
		padding: 10,
	},
	avatar: {
		borderRadius: 75,
		width: 100,
		height: 100
	}
}

export default Register
