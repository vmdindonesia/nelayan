import React, { Component } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { Container, ContainerSection, Button } from '../components/common'
import { COLOR } from '../constants'

class StartScreen extends Component {
	static navigationOptions = {
		header: null
	}

	render() {
		return (
			<ImageBackground 
				source={require('../../assets/bg.png')}
				style={{width: '100%', height: '100%', backgroundColor: COLOR.element_a1}}
			>
				<View style={styles.container}>
					<Container>
						<ContainerSection>
							<View style={{flex: 1, marginBottom: 120}}>
								<Image
									style={{alignSelf: 'center'}}
									source={require('../../assets/logo2.png')} 
								/>
							</View>
						</ContainerSection>
						
						<ContainerSection>
							<Button secondary onPress={() => this.props.navigation.navigate('Register')}>
								Daftar
							</Button>
						</ContainerSection>

						<ContainerSection>
							<Button onPress={() => this.props.navigation.navigate('Login')}>
								Masuk
							</Button>
						</ContainerSection>
					</Container>

					<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
						<Text style={{ textAlign: 'center', marginTop: 10, color: '#fff'}}>
							Lupa Kata Sandi?
						</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		)
	}
}

const styles = {
	container: {
		flex: 1,
		justifyContent: 'center'
	}
}

export default StartScreen
