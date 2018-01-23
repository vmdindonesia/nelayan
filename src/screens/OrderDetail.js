import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import numeral from 'numeral'
import axios from 'axios'
import { CheckBox, Button, FormInput } from 'react-native-elements'
import { Card, CardSection, Container, ContainerSection, Spinner } from '../components/common'
import { BASE_URL } from '../constants'

class OrderDetail extends Component {
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
			loading: true,
			data: {},
			expanded: false,
			checked: false,
			isModalVisible: false
		}
	}

	componentWillMount() {
		this.fetchDetail()
	}

	fetchDetail = () => {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/supplier/orders/${id}`, {
			headers: {token}
		})
		.then(response => {
			this.setState({data: response.data.data, loading: false})
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

	_toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible })
	}

	render() {
		const { expanded, data } = this.state

		if (this.state.loading) {
			return <Spinner size='large' />
		}

		return (
			<View style={{flex: 1}}>
				<Container>
					<ContainerSection>
						<View style={{flexDirection: 'column', flex: 1}}>
							<Image 
								style={styles.thumbnailStyle}
								source={require('../../assets/11.jpg')} 
							/>
						</View>
						<View style={{justifyContent: 'space-around', flex: 2}}>
							<Text style={styles.buyerName}>{data.Request.Transaction.Fish.name}</Text>
							<Text>{data.Request.User.name}</Text>
							<Text>{data.Request.Transaction.quantity}</Text>
							<Text>Rp {numeral(data.Request.Transaction.minBudget).format('0,0')} - {numeral(data.Request.Transaction.maxBudget).format('0,0')}</Text>
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
											<Button raised title='Revisi' onPress={this._toggleModal} backgroundColor="red" containerViewStyle={{width: '100%', marginLeft: 0}} />
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

				<Modal
					isVisible={this.state.isModalVisible}
					onBackdropPress={() => this.setState({ isModalVisible: false })}
				>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{backgroundColor: 'white', borderRadius: 2, padding: 10}}>
							<Text style={{textAlign: 'center', marginBottom: 20}}>Catatan Revisi</Text>
							<FormInput />
							<Button raised title='Kirim' backgroundColor="blue" containerViewStyle={{marginTop: 20}} />
						</View>
					</View>
				</Modal>
			
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

const mapStateToProps = state => {
	const { user } = state
	return { user }
}

export default connect(mapStateToProps)(OrderDetail)
