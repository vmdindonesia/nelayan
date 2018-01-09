import React, { Component } from 'react'
import { ScrollView, View, Text, Image, KeyboardAvoidingView } from 'react-native'
import { Button } from 'react-native-elements'
import { Container, ContainerSection, Input } from '../components/common'

class CatalogCreate extends Component {
	static navigationOptions = {
		title: 'Tambah Katalog'
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
					keyboardShouldPersistTaps="always"
				>
					<Container>
						<ContainerSection>
							<Input
								label="Nama Komoditas"
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
						<ContainerSection>
							<Image 
								style={styles.imageStyle}
								source={{ uri: 'http://pasarlaut.com/wp-content/uploads/2016/08/cakalang-842x474.jpg' }} 
							/>
						</ContainerSection>
					</Container>
					<Button
						raised
						title="Tambah"
						onPress={() => navigate('CatalogList')}
					/>
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
