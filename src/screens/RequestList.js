import React, { Component } from 'react'
import { FlatList, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { requestsFetch } from '../actions'
import { Card, CardSection, Spinner } from '../components/common'
import { BASE_URL } from '../constants'

class RequestList extends Component {
	static navigationOptions = {
		title: 'Request List'
	}

	componentWillMount() {
		this.props.requestsFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback
				onPress={() => this.props.navigation.navigate('RequestDetail', {id: item.id})}
			>
				<View>
					<Card style={{backgroundColor: item.StatusId === 3 ? '#eaeaea' : '#fff'}}>
						<CardSection style={{flexDirection: 'row'}}>
							<View style={{flexDirection: 'column'}}>
								<Image 
									style={styles.thumbnailStyle}
									source={{uri: `${BASE_URL}/images/${item.Transaction.photo}`}} 
								/>
							</View>
							<View style={{justifyContent: 'space-around', flex: 1}}>
								<Text style={styles.buyerName}>{item.Buyer.name}</Text>
								<Text style={styles.productName}>{item.Transaction.Fish.name} - {item.Transaction.quantity} Kg</Text>
								<Text style={{textAlign: 'right'}}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
								<Text style={{textAlign: 'right'}}>{item.Status.name}</Text>
							</View>
						</CardSection>
					</Card>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		if (this.props.requests.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.requests.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
				/>
			</View>
		)
	}
}

const styles = {
	thumbnailStyle: {
		height: 80,
		width: 80,
		borderRadius: 5
	},
	buyerName: {
		textAlign: 'left',
		marginLeft: 10
	},
	productName: {
		textAlign: 'right',
		fontSize: 18,
		color: '#000'
	}
}

const mapStateToProps = state => {
	const { requests, user } = state

	return { requests, user }
}

export default connect(mapStateToProps, {requestsFetch})(RequestList)

