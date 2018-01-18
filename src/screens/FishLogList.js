import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import numeral from 'numeral'
import { fishLogsFetch } from '../actions'

class FishLogList extends Component {
	static navigationOptions = {
		title: 'Fish Log'
	}

	componentWillMount() {
		this.props.fishLogsFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<TouchableNativeFeedback 
				onPress={() => this.props.navigation.navigate('FishLogEdit', {id: item.id})}
			>
				<View style={styles.itemContainerStyle}>
					<View style={styles.thumbnailContainerStyle}>
						<Image 
							style={styles.thumbnailStyle}
							source={require('../../assets/ikan.jpg')} 
						/>
					</View>
					<View style={styles.headerContentStyle}>
						<Text style={styles.hedaerTextStyle}>{item.Fish.name}</Text>
						<View style={{flexDirection: 'row'}}>
							<Text style={{flex: 1}}>{item.size} Kg</Text>
							<Text style={{flex: 1, textAlign: 'right'}}>Rp {numeral(item.price).format('0,0')}</Text>
						</View>
						<Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
					</View>
				</View>
			</TouchableNativeFeedback>
		)
	}

	render() {		
		return (
			<View style={{flex: 1}}>
				<FlatList
					data={this.props.fishLogs}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => index}
				/>

				<ActionButton
					buttonColor="rgba(231,76,60,1)"
					onPress={() => this.props.navigation.navigate('FishLogCreate')}
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
		height: 100,
		width: 100,
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
	const { fishLogs, user } = state

	return { fishLogs, user }
}

export default connect(mapStateToProps, {fishLogsFetch})(FishLogList)
