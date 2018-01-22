import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox, Button } from 'react-native-elements'
import { Card, CardSection, Container, ContainerSection, Spinner } from '../components/common'

class TransactionDetail extends Component {
	static navigationOptions = {
		title: 'Order 23049329',
		headerRight: 
			<TouchableOpacity>
				<View>
					<Icon style={{marginRight: 20}} size={30} name="md-chatboxes" />
				</View>
			</TouchableOpacity>
	}

	constructor(props) {
		super(props)
	
		this.state = {
			expanded: false,
			checked: false
		}
	}

	render() {
		const { expanded } = this.state

		return (
			<View>
				<Container>
					<ContainerSection>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Image 
								style={styles.thumbnailStyle}
								source={require('../../assets/11.jpg')} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>Nama Produk</Text>
							<Text>Pembeli</Text>
							<Text>Kuantitas</Text>
							<Text>Harga</Text>
						</View>
					</ContainerSection>
				</Container>

				<Card>
					<CardSection>
						<TouchableWithoutFeedback onPress={() => this.setState({expanded: !expanded})}>
							<View style={{flex: 1, flexDirection: 'row'}}>
								<Text style={{flex: 1, fontSize: 20}}>Kontrak</Text>
								<View style={{flex: 1}}>
									<Icon size={30} style={{alignSelf: 'flex-end'}} name={expanded ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
								</View>
							</View>
						</TouchableWithoutFeedback>
					</CardSection>
					{
						this.state.expanded ? 
							<CardSection>
								<View style={{flexDirection: 'column'}}>
									<View>
										<Text>Pembeli mengirim permintaan untuk produk sampel dan melakukan survei lokasi.</Text>
									</View>
									<View >
										<View style={{flexDirection: 'row', justifyContent: 'space-around' }}>
											<CheckBox
												title='Survei'
												checked="true"
											/>
											<CheckBox
												title='Sample'
												checked="true"
											/>
										</View>
									</View>
									<View style={{marginTop: 10}}>
										<Button raised title='Konfirmasi' backgroundColor="blue" containerViewStyle={{width: '100%', marginLeft: 0}} />
									</View>
									<View style={{height: 20, borderBottomWidth: 1, borderColor: '#eaeaea'}} />
									<View> 
										<TouchableOpacity onPress={() => Linking.openURL('http://komisiyudisial.go.id/downlot.php?file=Peraturan-KY-Nomor-2-Tahun-2015.pdf').catch(err => console.error('An error occurred', err))}>
											<View style={{marginTop: 15, flexDirection: 'row'}}>
												<Text style={{color: 'blue'}}>File Download.pdf</Text>
												<Icon size={20} style={{color: 'blue', marginLeft: 5}} name="md-download" />
											</View>
										</TouchableOpacity>
									</View>
									<View style={{marginTop: 10, flexDirection: 'row'}}>
										<View style={{flex: 1}}>
											<Button raised title='Revisi' backgroundColor="red" containerViewStyle={{width: '100%', marginLeft: 0}} />
										</View>
										<View style={{flex: 1}}>
											<Button raised title='Setuju' backgroundColor="green" containerViewStyle={{width: '100%', marginLeft: 0}} />
										</View>
									</View>
								</View>
							</CardSection>
						:
							<View />
					}
					
				</Card>

			</View>
		)
	}
}

const styles = {
	thumbnailStyle: {
		height: 100,
		width: 100,
		borderRadius: 5
	},
	buyerName: {
		textAlign: 'left'
	},
	productName: {
		textAlign: 'right',
		fontSize: 18,
		color: '#000'
	},
	titleStyle: {
		fontSize: 18,
		paddingLeft: 15,
		paddingTop: 400
	}
}

export default TransactionDetail
