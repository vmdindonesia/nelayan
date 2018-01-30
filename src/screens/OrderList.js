import React, { Component } from 'react'
import { FlatList, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import { ordersFetch } from '../actions'
import { Spinner } from '../components/common'
import { BASE_URL } from '../constants'

class OrderList extends Component {
	static navigationOptions = {
		title: 'Order'
	}

	componentWillMount() {
		this.props.ordersFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback
				onPress={() => this.props.navigation.navigate('OrderDetail', {id: item.id})}
			>
				<View style={styles.itemContainerStyle}>
					<View style={styles.thumbnailContainerStyle}>
						<Image 
							style={styles.thumbnailStyle}
							source={{uri: `${BASE_URL}/images/${item.Request.Transaction.photo}`}} 
						/>
					</View>
					<View style={styles.headerContentStyle}>
						<Text style={styles.hedaerTextStyle}>{item.Request.Transaction.Fish.name}</Text>
						<View style={{flexDirection: 'row'}}>
							<Text style={{flex: 1}}>{item.Request.Buyer.name}</Text>
						</View>
						<View style={{flexDirection: 'row'}}>
							<Image 
								style={styles.statusIcon}
								source={require('../../assets/status1.png')} 
							/>
							<Image 
								style={styles.statusIcon}
								source={require('../../assets/status2.png')} 
							/>
							<Image 
								style={styles.statusIcon}
								source={require('../../assets/status3.png')} 
							/>
							<Image 
								style={styles.statusIcon}
								source={require('../../assets/status4.png')} 
							/>
							<Image 
								style={styles.statusIcon}
								source={require('../../assets/status5.png')} 
							/>
						</View>
					</View>
					<View style={styles.headerContentStyle2}>
						<Text style={{textAlign: 'right'}}>Status Sekarang</Text>
						<Text style={{textAlign: 'right'}}>21/08/2018</Text>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		if (this.props.orders.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.orders.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
				/>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		borderBottomWidth: 1, 
		padding: 5,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ddd',
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
	thumbnailStyle: {
		height: 80,
		width: 80,
		borderRadius: 5
	},
	headerContentStyle: {
		flex: 1,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	headerContentStyle2: {
		marginTop: 8,
	},
	hedaerTextStyle: {
		// fontSize: 20,
	},
	statusIcon: {
		height: 25,
		width: 25,
		marginRight: 2
	}
}

const mapStateToProps = state => {
	const { orders, user } = state

	return { orders, user }
}

export default connect(mapStateToProps, {ordersFetch})(OrderList)
