import React, { Component } from 'react'
import axios from 'axios'
import { ScrollView, Text, Keyboard, TouchableOpacity, View, ToastAndroid } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import AutoComplete from '../components/AutoComplete'
import { Container, ContainerSection, Button, Spinner } from '../components/common'

class ProductForm extends Component {
	static navigationOptions = {
		title: 'Pilih Komoditas',
		headerRight: <View />
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			suggestions: [],
			value: '',
			FishId: '',
			loadingProduct: false
		}
	}

	componentWillMount() {
		const { params } = this.props.navigation.state
		console.log(params)

		if (params && params.FishId !== '') {
			this.setState({
				value: params.value,
				FishId: params.FishId
			})
		}
	}

	onItemSelected = (item) => {
		this.setState({
			suggestions: [],
			FishId: item.id,
			value: item.name
		})
	}

	onSubmit = () => {
		Keyboard.dismiss()
		
		// Validation
		if (this.state.FishId === '') {
      ToastAndroid.show('Nama komoditas tidak tersedia, harap hubungi Admin Aruna', ToastAndroid.SHORT)
		}
		else {
			this.setState({loading: true})

			let token = this.props.user.token
			const data = { FishId: this.state.FishId }
			const { params } = this.props.navigation.state

			const url = params ? `${BASE_URL}/products/${params.ProductId}` : `${BASE_URL}/products`

			axios({
				method: params ? 'put' : 'post',
				url,
				data,
				headers: {token},
				timeout: REQUEST_TIME_OUT
			})
			.then(() => {
				this.props.navigation.setParams({FishId: '', value: '', ProductId: ''})
				
				const resetAction = NavigationActions.reset({
					index: 1,
					actions: [
						NavigationActions.navigate({ routeName: 'Home'}),
						NavigationActions.navigate({ routeName: 'Profile'})
					]
				})
				this.props.navigation.dispatch(resetAction)
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
	}

	querySuggestion = (text) => {
		this.setState({
			value: text,
			loadingProduct: true,
			FishId: ''
		})

		axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
			timeout: REQUEST_TIME_OUT
		})
		.then(response => {
			res = response.data.data
			this.setState({suggestions: res, loadingProduct: false})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loadingProduct: false})
		})
	}

	renderButton = () => {
		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<Button 
				onPress={() => this.onSubmit()}
			>
				Simpan
			</Button>
		)
	}

	render() {
		const { suggestions, value, loadingProduct } = this.state

		return (
			<ScrollView 
				style={{flex: 1}}
				keyboardShouldPersistTaps="always"
			>
				<Container>
					<ContainerSection>
						<AutoComplete
							label="Nama Komoditas"
							suggestions={suggestions}
							onChangeText={text => this.querySuggestion(text)}
							value={value}
						>
						{
							loadingProduct ?
								<View style={{flex: 1}}>
									<Spinner size='large' />
								</View>
							:
								suggestions && suggestions.map(item => 
									<TouchableOpacity 
										key={item.id} 
										onPress={() => this.onItemSelected(item)}
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
						{this.renderButton()}
					</ContainerSection>
				</Container>
			</ScrollView>
		)
	}
}

const styles = {
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

export default connect(mapStateToProps)(ProductForm)
