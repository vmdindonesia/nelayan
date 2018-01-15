import React, { Component } from 'react'
import axios from 'axios'
import { ScrollView, Text, Keyboard, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { BASE_URL } from '../constants'
import AutoComplete from '../components/AutoComplete'
import { Container, ContainerSection, Button, Spinner } from '../components/common'

class ProductForm extends Component {
	static navigationOptions = {
		title: 'Pilih Komoditas'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			suggestions: [],
			value: '',
			FishId: ''
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
		this.setState({loading: true})

		let token = this.props.user.token
		const data = { FishId: this.state.FishId }
		const { params } = this.props.navigation.state

		const url = params ? `${BASE_URL}/products/${params.ProductId}` : `${BASE_URL}/products`

		axios({
			method: params ? 'put' : 'post',
			url,
			data,
			headers: {'x-access-token': token}
		})
		.then(response => {
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

	querySuggestion = (text) => {
		this.setState({value: text})

		axios.get(`${BASE_URL}/fishes/search?key=${text}`, {
			headers: {'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozNCwibmFtZSI6ImFyaWYiLCJlbWFpbCI6ImFyaWZAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJwaG9uZSI6IjA4MjExMTEyMjEiLCJwaG90byI6bnVsbCwiYWRkcmVzcyI6ImFsZGlyb24iLCJyb2xlIjoic3VwcGxpZXIiLCJwb2ludEFtb3VudCI6MCwiaWROdW1iZXIiOiIzMjQ3MDI0NDQiLCJvcmdhbml6YXRpb24iOiJtaXRyYSBrYXNpaCIsInR5cGVPcmdhbml6YXRpb24iOiJwdCIsImFjdGl2ZSI6ZmFsc2UsInZlcmlmeSI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMTgtMDEtMDlUMDc6NDc6MTAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDEtMDlUMDc6NDc6MTAuMDAwWiJ9LCJpYXQiOjE1MTU0OTExNDYsImV4cCI6MTUxNjA5NTk0Nn0.3X3XEV50K2vEZXsvd-BaXc8ElHE8qj2i_N-n-x9stUM'}
		})
		.then(response => {
			res = response.data.data
			this.setState({suggestions: res})
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
		const { suggestions, value } = this.state

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
		borderBottomWidth: 1, 
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
