import React, { Component } from 'react'
import { FlatList, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { requestsFetch } from '../actions'
import { Card, CardSection } from '../components/common'
import { BASE_URL } from '../constants'

class RequestList extends Component {
	static navigationOptions = {
		title: 'PO',
		headerRight: <View />
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
					<Card style={{backgroundColor: item.StatusId === 3 ? '#d0d0d0b3' : '#fff'}}>
						<CardSection style={{flexDirection: 'row'}}>
							<View style={{flexDirection: 'column'}}>
								<Image 
									style={styles.thumbnailStyle}
									source={{uri: `${BASE_URL}/images/${item.Transaction.photo}`}} 
								/>
							</View>
							<View style={{justifyContent: 'space-around', flex: 1}}>
								<View>
									<Text style={styles.buyerName}>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
									<Text style={styles.productName}>{item.Transaction.Fish.name}</Text>
									<Text style={styles.productName}>{item.Transaction.quantity} Kg</Text>
								</View>
								<View>
									<Text style={styles.buyerName}>{item.Status.name}</Text>
								</View>
							</View>
						</CardSection>
					</Card>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.requests.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					onRefresh={() => this.props.requestsFetch(this.props.user.token)}
					refreshing={this.props.requests.loading}
				/>
			</View>
		)
	}
}

const styles = {
	thumbnailStyle: {
		height: 100,
		width: 100,
	},
	buyerName: {
		textAlign: 'left',
		marginLeft: 10
	},
	productName: {
		fontSize: 18,
		marginLeft: 10,
		color: '#000'
	}
}

const mapStateToProps = state => {
	const { requests, user } = state

	return { requests, user }
}

export default connect(mapStateToProps, {requestsFetch})(RequestList)

