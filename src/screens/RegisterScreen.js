import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, KeyboardAvoidingView } from 'react-native'
import { Button } from 'react-native-elements'
import { Card, CardSection, Input, Spinner } from '../components/common'

class RegisterScreen extends Component {
	static navigationOptions = {
		title: 'Registrasi'
	}

	render() {
		const { navigate } = this.props.navigation

		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior="padding"
				keyboardVerticalOffset={80}
			>
				<ScrollView style={styles.containerStyle}>
					<Card>
						<CardSection>
							<Text style={styles.headerStyle}>
								INFORMASI LEMBAGA
							</Text>
						</CardSection>
						<CardSection>
							<Text style={styles.pickerTextStyle}>Jenis Supplier</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={this.props.shift}
								onValueChange={() => console.log('pressed')}
							>
								<Picker.Item label="Koperasi" value="Koperasi" />
								<Picker.Item label="Perseorangan" value="Koperasi" />
							</Picker>
						</CardSection>
						<CardSection>
							<Input
								label='Desa/Kelurahan'
								placeholder='contoh: Antapani'
							/>
						</CardSection>
						<CardSection>
							<Input
								label='Kecamatan'
								placeholder='contoh: Antapani Kidul'
							/>
						</CardSection>
						<CardSection>
							<Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={this.props.city}
								onValueChange={() => console.log('pressed')}
							>
								<Picker.Item label="Jakarta" value="Jakarta" />
								<Picker.Item label="Pangandaran" value="Pangandaran" />
							</Picker>
						</CardSection>
					</Card>

					<Card>
						<CardSection>
							<Text style={styles.headerStyle}>
								INFORMASI PERSONAL
							</Text>
						</CardSection>
						<CardSection>
							<Input
								label='Nama Lengkap'
								placeholder='contoh: Ahmad Darudi'
							/>
						</CardSection>
						<CardSection>
							<Input
								label='No. KTP'
								placeholder='contoh: 321317989029'
							/>
						</CardSection>
						<CardSection>
							<Input
								label='No. HP'
								placeholder='contoh: 085621017922'
							/>
						</CardSection>
						<CardSection>
							<Input
								label='Email'
								placeholder='contoh: erwin@gmail.com'
							/>
						</CardSection>
						<CardSection>
							<Input
								label='Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
							/>
						</CardSection>
						<CardSection>
							<Input
								label='Konfirmasi Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
							/>
						</CardSection>
					</Card>

					<View style={{ height: 20 }} />

					<Button
						raised
						title="Register"
						onPress={() => navigate('CatalogList')}
					/>

					<View style={{ height: 20 }} />


				</ScrollView>
			</KeyboardAvoidingView>
			
		)
	}
}

const styles = {
	containerStyle: {
		
	},
	headerStyle: {
		marginLeft: 5
	},
	pickerTextStyle: {
		color: '#8e8e8e',
		flex: 1,
		paddingLeft: 5
	}
}

export default RegisterScreen
