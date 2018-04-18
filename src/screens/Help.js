import React, { Component } from 'react'
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native'
import { Container, ContainerSection, Button } from '../components/common'

class Help extends Component {
	static navigationOptions = {
		title: 'Pusat Bantuan',
		headerRight: <View />
	}

	render() {
		return (
			<View style={{flex: 1, marginTop: 50}}>
				<Container>
					<View>
						<Image
							style={{alignSelf: 'center'}}
							source={require('../../assets/logo.png')} 
						/>
					</View>
					<Text style={{marginBottom: 30, marginTop: 10, textAlign: 'center'}}>v1.0.26</Text>

					<View style={{justifyContent: 'center', alignItems: 'center'}}>
						<Text>Hubungi</Text>
						<Text>Pusat Bantuan</Text>
						<TouchableOpacity
							onPress={() => Linking.openURL('tel:0217778888').catch(err => console.error('An error occurred', err))}
						>
							<View>
								<Text style={{fontSize: 20, marginTop: 10, marginBottom: 10}}>
									+62 21 777 8888
								</Text>
							</View>
						</TouchableOpacity>
						<Text>atau</Text>
						<TouchableOpacity
							onPress={() => Linking.openURL('mailto:info@aruna.id').catch(err => console.error('An error occurred', err))}
						>
							<View>
								<Text style={{fontSize: 20, marginTop: 10, marginBottom: 10}}>info@aruna.id</Text>
							</View>
						</TouchableOpacity>
						<Text>atau</Text>
						<View style={{height: 50, marginTop: 10}}>
							<Button 
								style={{paddingLeft: 10, paddingRight: 10}}
								onPress={() => this.props.navigation.navigate('MessageAdmin', {
										id: 1,
										codeNumber: 'chat admin',
										organizationType: 'Admin Aruna',
									})
								}
							>
								Chat dengan admin aruna
							</Button>
						</View>
					</View>
				</Container>
			</View>
		)
	}
}

export default Help
