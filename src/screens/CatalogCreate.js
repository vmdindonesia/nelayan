import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Keyboard } from 'react-native'
import axios from 'axios'
import { Container, ContainerSection, Input, Button } from '../components/common'
import AutoComplete from '../components/AutoComplete'
import Constants from '../constants'

class CatalogCreate extends Component {
	static navigationOptions = {
		title: 'Tambah Katalog'
	}

	constructor(props) {
		super(props);
	
		this.state = {
			suggestions: []
		}
	}

	createCatalog = () => {
		Keyboard.dismiss()
		this.props.navigation.navigate('CatalogList')
	}

	querySuggestion = (text) => {
		axios.get(`${Constants.BASE_URL}/fishes/search?key=${text}`, {
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

	render() {
		const { suggestions } = this.state

		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior="padding"
				keyboardVerticalOffset={80}
			>
				<ScrollView
					keyboardShouldPersistTaps="always"
				>
					<Container>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas"
								suggestions={suggestions}
								onChangeText={text => this.querySuggestion(text)}
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label="Jumlah"
								keyboardType="numeric"
							/>
							<Text style={styles.unitStyle}>Kg</Text>
							<Input
								label="Ukuran"
								keyboardType="numeric"
							/>
							<Text style={styles.unitStyle}>Cm</Text>
						</ContainerSection>
						<ContainerSection>
							<Input
								label="Rentang Harga/Kg"
								keyboardType="numeric"
								placeholder="Harga Min"
							/>
							<Text style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}> - </Text>
							<Input
								keyboardType="numeric"
								placeholder="Harga Max"
							/>
						</ContainerSection>
						{
							// <ContainerSection>
							// 	<Image 
							// 		style={styles.imageStyle}
							// 		source={{ uri: 'http://pasarlaut.com/wp-content/uploads/2016/08/cakalang-842x474.jpg' }} 
							// 	/>
							// </ContainerSection>
						}
					</Container>
					<ContainerSection>
						<Button onPress={this.createCatalog}>
							Tambah
						</Button>
					</ContainerSection>
				</ScrollView>
			</KeyboardAvoidingView>
		)
	}
}

const styles = {
	imageStyle: {
		height: 200,
		flex: 1,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	unitStyle: {
		marginTop: 30, 
		paddingRight: 30
	}
}

export default CatalogCreate
