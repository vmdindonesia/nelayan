import React, { Component } from 'react'
import { ScrollView, Text, Picker, KeyboardAvoidingView, Alert, Keyboard, TouchableOpacity, View, Image, TouchableWithoutFeedback } from 'react-native'
import { Container, ContainerSection, Input, Button, Spinner } from '../components/common'
import AutoComplete from '../components/AutoComplete'

class ProfileEdit extends Component {
	static navigationOptions = {
		title: 'Ubah Profil'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			suggestions: [],
			values: [],
			FishIds: [],
		}
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

	querySuggestion = (index, text) => {
		const { values, suggestions } = this.state
		values[index] = text

		this.setState({values})

		axios.get(`${BASE_URL}/fishes/search?key=${text}`)
		.then(response => {
			res = response.data.data
			suggestions[index] = res
			this.setState({suggestions})
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
				onPress={
					() => Alert.alert(
						'',
						'Yakin sudah mengisi informasi profil anda dengan tepat?',
						[
							{text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
							{text: 'Ya', onPress: () => this.register()},
						]
					)
				}
			>
				Register
			</Button>
		)
	}

	render() {
		const {
			suggestions,
			values
		} = this.state

		return (
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={80}
			>
				<ScrollView
					style={styles.containerStyle}
					keyboardShouldPersistTaps="always"
				>
					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								KOMODITAS
							</Text>
						</ContainerSection>
						<ContainerSection>
							<AutoComplete
								label="Nama Komoditas 1"
								suggestions={suggestions[0]}
								onChangeText={text => this.querySuggestion(0, text)}
								value={values[0]}
							>
							{
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
								label="Nama Komoditas 2"
								suggestions={suggestions[1]}
								onChangeText={text => this.querySuggestion(1, text)}
								value={values[1]}
							>
							{
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
								label="Nama Komoditas 3"
								suggestions={suggestions[2]}
								onChangeText={text => this.querySuggestion(2, text)}
								value={values[2]}
							>
							{
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
								label="Nama Komoditas 4"
								suggestions={suggestions[3]}
								onChangeText={text => this.querySuggestion(3, text)}
								value={values[3]}
							>
							{
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
								label="Nama Komoditas 5"
								suggestions={suggestions[4]}
								onChangeText={text => this.querySuggestion(4, text)}
								value={values[4]}
							>
							{
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
				</ScrollView>
			</KeyboardAvoidingView>
		)
	}
}

const styles = {
	headerStyle: {
		marginLeft: 5
	},
	pickerContainer: {
		flex: 1, 
		height: 65,
		marginBottom: 5
	},
	pickerStyle: {
		flex: 1,
		borderBottomWidth: 1,
		borderColor: '#716c6c',
		marginRight: 3,
		marginLeft: 3,
	},
	pickerTextStyle: {
		color: '#8e8e8e',
		fontSize: 16,
		paddingLeft: 5
	},
	containerItemAutoSelect: {
		borderBottomWidth: 1, 
		padding: 10,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
		position: 'relative'
	},
}

export default ProfileEdit
