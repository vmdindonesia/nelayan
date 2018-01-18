import React, { Component } from 'react'
import { FlatList, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { requestsFetch } from '../actions'
import { Card, CardSection, Spinner } from '../components/common'

class RequestList extends Component {
	static navigationOptions = {
		title: 'Request'
	}

	componentWillMount() {
		this.props.requestsFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<Card>
				<CardSection style={{flexDirection: 'row'}}>
					<View style={{flexDirection: 'column', flex: 1}}>
						<Image 
							style={styles.thumbnailStyle}
							source={require('../../assets/11.jpg')} 
						/>
					</View>
					<View style={{justifyContent: 'space-around', flex: 2}}>
						<Text style={styles.buyerName}>{item.BuyerId}</Text>
						<Text style={styles.productName}>{item.Transaction.Fish.name} - {item.Transaction.quantity} Kg</Text>
						<Text style={{textAlign: 'right'}}>{moment(item.createdAt).format('DD/MM/YYYY | HH:mm')} WIB</Text>
						<Text style={{textAlign: 'right'}}>{item.Status.name}</Text>
					</View>
				</CardSection>
			</Card>
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
	}
}

const mapStateToProps = state => {
	const { requests, user } = state

	return { requests, user }
}

export default connect(mapStateToProps, {requestsFetch})(RequestList)

