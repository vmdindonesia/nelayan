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


	constructor(props) {
		super(props);
		this.state = {
			lengthData: '',
			anyData: true,
			noListData: null
		};
	}

	componentWillMount() {
		this.props.requestsFetch(this.props.user.token)
	}

	componentWillReceiveProps() {
		setTimeout(() => {
			console.log(this.props.requests.data.length, 'Data');
			this.setState({ lengthData: this.props.requests.data.length })
			if (this.state.lengthData === 0) {
				this.setState({ noListData: true })
			}
		});
	}


	renderItem = (item) => {
		return (
			<TouchableNativeFeedback
				onPress={() => this.props.navigation.navigate('RequestDetail', { id: item.id })}
			>
				<View>
					<Card style={{ backgroundColor: item.StatusId === 3 ? '#d0d0d0b3' : '#fff' }}>
						<CardSection style={{ flexDirection: 'row' }}>
							<View style={{ flexDirection: 'column' }}>
								<Image
									style={styles.thumbnailStyle}
									source={{ uri: `${BASE_URL}/images/${item.Transaction.photo}` }}
								/>
							</View>
							<View style={{ justifyContent: 'space-around', flex: 1 }}>
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
		const { noListData, anyData } = this.state;
		return (
			<View style={{ flex: 1 }}>
				{
					anyData ?
						<FlatList
							data={this.props.requests.data}
							renderItem={({ item }) => this.renderItem(item)}
							keyExtractor={(item, index) => index}
							onRefresh={() => this.props.requestsFetch(this.props.user.token)}
							refreshing={this.props.requests.loading}
						/>
						:
						<View />
				}
				{
					noListData ?
						<View style={{ flex: 1, marginTop: '-60%' }}>
							<View style={styles.thumbnailContainerStyle}>
								<Image
									style={styles.thumbnailStyle}
									source={require('./../../assets/empty_transaksi.png')}
								/>
							</View>
							<Text style={{ textAlign: 'center' }}>Belum ada PO</Text>
						</View>
						:
						<View />
				}
			</View>
		)
	}
}

const styles = {
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
	},
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

export default connect(mapStateToProps, { requestsFetch })(RequestList)

