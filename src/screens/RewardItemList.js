import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import { itemsFetch } from '../actions'
import { Spinner } from '../components/common'
import { BASE_URL } from '../constants'

class RewardItemList extends Component {
	componentWillMount() {
		this.props.itemsFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback 
				onPress={() => console.log('pencet')}
			>
				<View style={styles.itemContainerStyle}>
					<View style={styles.thumbnailContainerStyle}>
						<Image 
							style={styles.thumbnailStyle}
							source={require('../../assets/coin.png')}
						/>
					</View>
					<View style={styles.headerContentStyle}>
						<View style={{flexDirection: 'row'}}>
							<Text style={{flex: 1}}>{item.name}</Text>
						</View>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {
		console.log(this.props.items.data)
		if (this.props.items.loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View style={{ flex: 1, padding: 15}}>
				<FlatList
					data={this.props.items.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					numColumns={2}
				/>
			</View>
		)
	}
}

const styles = {
	itemContainerStyle: {
		flex: 1,
		borderWidth: 1,
		margin: 5,
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
		height: 30,
		width: 30,
		borderRadius: 5
	},
	headerContentStyle: {
		flex: 1,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around'
	},
	hedaerTextStyle: {
		fontSize: 20,
	}
}

const mapStateToProps = state => {
	const { items, user } = state

	return { items, user }
}

export default connect(mapStateToProps, {itemsFetch})(RewardItemList)

