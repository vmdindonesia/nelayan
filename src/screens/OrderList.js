import React, { Component } from 'react'
import { FlatList, View, Text, Image, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { ordersFetch } from '../actions'
import { Spinner, Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class OrderList extends Component {
	static navigationOptions = {
		title: 'Order',
		headerRight: <View />
	}

	componentWillMount() {
		this.props.ordersFetch(this.props.user.token)
	}

	imageIcon = (item, index) => {
		if (index <= item.StatusHistories.length) {
			switch (index) {
				case 1:
					return require('../../assets/status1f.png')
				case 2:
					return require('../../assets/status2f.png')
				case 3:
					return require('../../assets/status3f.png')
				case 4:
					return require('../../assets/status4f.png')
				case 5:
					return require('../../assets/status5f.png')
				default:
					return require('../../assets/status1f.png')
			}
		}
		
		switch (index) {
			case 1:
				return require('../../assets/status1.png')
			case 2:
				return require('../../assets/status2.png')
			case 3:
				return require('../../assets/status3.png')
			case 4:
				return require('../../assets/status4.png')
			case 5:
				return require('../../assets/status5.png')
			default:
				return require('../../assets/status1.png')
		}
	}

	renderItem = (item) => {
		return (
			<Card>
				<TouchableNativeFeedback
					onPress={() => this.props.navi.navigate('OrderDetail', {id: item.id})}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image 
								style={styles.thumbnailStyle}
								source={{uri: `${BASE_URL}/images/${item.Request.Transaction.photo}`}} 
							/>
						</View>
						<View style={styles.headerContentStyle}>
							<Text>No. PO {item.id}</Text>
							<Text>{item.Request.Transaction.Fish.name}</Text>
							<Text>{item.Request.Buyer.name}</Text>
							<Text style={styles.hedaerTextStyle}>{item.StatusHistories.length > 0 ? item.StatusHistories[item.StatusHistories.length - 1].Status.name : 'Menunggu Kontrak'}</Text>
							<View style={{flexDirection: 'row'}}>
								<Image 
									style={styles.statusIcon}
									source={this.imageIcon(item, 1)}
								/>
								<Image 
									style={styles.statusIcon}
									source={this.imageIcon(item, 2)}
								/>
								<Image 
									style={styles.statusIcon}
									source={this.imageIcon(item, 3)}
								/>
								<Image 
									style={styles.statusIcon}
									source={this.imageIcon(item, 4)}
								/>
								<Image 
									style={styles.statusIcon}
									source={this.imageIcon(item, 5)}
								/>
							</View>
						</View>
					</View>
				</TouchableNativeFeedback>
			</Card>
		)
	}

	render() {
		console.log(this.props.orders.data)
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
		height: 100,
		width: 100,
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
		color: COLOR.secondary_a
	},
	statusIcon: {
		height: 25,
		width: 25,
		marginRight: 3
	}
}

const mapStateToProps = state => {
	const { orders, user } = state

	return { orders, user }
}

export default connect(mapStateToProps, {ordersFetch})(OrderList)
