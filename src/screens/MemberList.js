import React, { Component } from 'react'
import { FlatList, View, Image, Text, TouchableNativeFeedback } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'

import { membersFetch } from '../actions'
import { Spinner, Card } from '../components/common'
import { BASE_URL, COLOR } from '../constants'

class MemberList extends Component {
	static navigationOptions = {
		title: 'Anggota',
		headerRight: <View />
	}

	componentWillMount() {
		// this.props.membersFetch(this.props.user.token)
	}

	renderItem = (item) => {
		return (
			<View />
		)
	}

	render() {
		// if (this.props.members.loading) {
		// 	return (
		// 		<View style={{flex: 1}}>
		// 			<Spinner size='large' />
		// 		</View>
		// 	)
		// }

		return (
			<View style={{flex: 1}}>
				<Card>
					<TouchableNativeFeedback 
						onPress={() => this.props.navigation.navigate('MemberEdit', {id: 1})}
					>
						<View style={styles.itemContainerStyle}>
							<View style={styles.thumbnailContainerStyle}>
								<Image 
									style={styles.thumbnailStyle}
									source={{uri: `${BASE_URL}/images/${'1517799513313profile.jpg'}`}} 
								/>
							</View>
							<View style={styles.headerContentStyle}>
								<Text style={styles.hedaerTextStyle}>Dudi Komaladi</Text>
								<Text>Tobelo, Maluku Utara</Text>
								<Text>08562101792</Text>
							</View>
						</View>
					</TouchableNativeFeedback>
				</Card>
				
				<ActionButton
					buttonColor={COLOR.secondary_b}
					onPress={() => this.props.navigation.navigate('MemberCreate')}
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
		borderRadius: 50
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
		color: COLOR.secondary_a
	}
}

const mapStateToProps = state => {
	const { members, user } = state

	return { members, user }
}

export default connect(mapStateToProps, {membersFetch})(MemberList)

