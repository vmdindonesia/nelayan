import React, { Component } from 'react'
import { View, ScrollView, Text, Picker, KeyboardAvoidingView } from 'react-native'
import { Button } from 'react-native-elements'
import { Container, ContainerSection, Input } from '../components/common'

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
				<ScrollView 
					style={styles.containerStyle}
					keyboardShouldPersistTaps="always"
				>
					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								INFORMASI LEMBAGA
							</Text>
						</ContainerSection>
						<ContainerSection>
							<Text style={styles.pickerTextStyle}>Jenis Supplier</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={this.props.shift}
								onValueChange={() => console.log('pressed')}
							>
								<Picker.Item label="Koperasi" value="Koperasi" />
								<Picker.Item label="Perseorangan" value="Koperasi" />
							</Picker>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Desa/Kelurahan'
								placeholder='contoh: Antapani'
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Kecamatan'
								placeholder='contoh: Antapani Kidul'
							/>
						</ContainerSection>
						<ContainerSection>
							<Text style={styles.pickerTextStyle}>Kota/Kabupaten</Text>
							<Picker
								style={{ flex: 1 }}
								selectedValue={this.props.city}
								onValueChange={() => console.log('pressed')}
							>
								<Picker.Item label="Jakarta" value="Jakarta" />
								<Picker.Item label="Pangandaran" value="Pangandaran" />
							</Picker>
						</ContainerSection>
					</Container>

					<Container>
						<ContainerSection>
							<Text style={styles.headerStyle}>
								INFORMASI PERSONAL
							</Text>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Nama Lengkap'
								placeholder='contoh: Ahmad Darudi'
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='No. KTP'
								placeholder='contoh: 321317989029'
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='No. HP'
								placeholder='contoh: 085621017922'
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Email'
								placeholder='contoh: erwin@gmail.com'
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
							/>
						</ContainerSection>
						<ContainerSection>
							<Input
								label='Konfirmasi Password'
								placeholder='minimal 6 karakter'
								secureTextEntry
							/>
						</ContainerSection>
					</Container>

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
