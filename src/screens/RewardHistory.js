import React, { Component } from 'react'
import { FlatList, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { BASE_URL, COLOR } from '../constants'
import { rewardHistoriesFetch } from '../actions'

class RewardHistory extends Component {
	componentWillMount() {
		this.props.rewardHistoriesFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<View key={item.id} style={styles.itemContainerStyle}>
				<View style={styles.thumbnailContainerStyle}>
					<Image 
						style={styles.thumbnailStyle}
						source={{uri: `${BASE_URL}/images/${item.Item ? item.Item.photo : ''}`}} 
					/>
				</View>
				<View style={styles.headerContentStyle}>
					<Text style={styles.hedaerTextStyle}>{item.Item ? item.Item.name : 'Nama Reward'}</Text>
					<View style={{flexDirection: 'row'}}>
						<Text style={{flex: 1}}>{item.Item ? item.Item.pointAmount : 'Poin'} Poin</Text>
					</View>
					<Text style={{fontSize: 12}}>Status: {item.Status ? item.Status.name : 'Status'}</Text>
				</View>
			</View>
		)
	}

	render() {
		return (
			<View style={{ flex: 1}}>
				<FlatList
					data={this.props.rewardHistories.data}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
					onRefresh={() => this.props.rewardHistoriesFetch(this.props.user.token)}
					refreshing={this.props.rewardHistories.loading}
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
		margin: 15,
	},
	thumbnailStyle: {
		height: 60,
		width: 60,
		borderRadius: 5
	},
	headerContentStyle: {
		flex: 1,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10,
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	hedaerTextStyle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLOR.primary
	}
}

const mapStateToProps = state => {
	const { user, rewardHistories } = state

	return { user, rewardHistories }
}

export default connect(mapStateToProps, {rewardHistoriesFetch})(RewardHistory)

