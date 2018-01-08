import React, { Component } from 'react'
import { View, Text, Picker } from 'react-native'
import { Card, CardSection, Input, Button, Spinner } from './common'

class RegisterForm extends Component {
	render() {
		return (
			<View>
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
							placeholder='Desa/Kelurahan'
						/>
					</CardSection>
					
				</Card>
			</View>
		)
	}
}

const styles = {
	headerStyle: {
		marginLeft: 5
	},
	pickerTextStyle: {
		color: '#8e8e8e',
		flex: 1,
		paddingLeft: 5
	}
}

export default RegisterForm
