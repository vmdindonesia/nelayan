import React, { Component } from 'react'
import { View, Text, Image, TouchableNativeFeedback } from 'react-native'

class TransactionList extends Component {
	static navigationOptions = {
		title: 'Transaksi'
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<TouchableNativeFeedback
					onPress={() => this.props.navigation.navigate('TransactionDetail')}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image 
								style={styles.thumbnailStyle}
								source={require('../../assets/ikan.jpg')} 
							/>
						</View>
						<View style={styles.headerContentStyle}>
							<Text style={styles.hedaerTextStyle}>Kakap Merah - 400 Kg</Text>
							<View style={{flexDirection: 'row'}}>
								<Text style={{flex: 1}}>Kardi</Text>
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
							<Text style={{textAlign: 'right'}}>Proses Kontrak</Text>
							<Text style={{textAlign: 'right'}}>21/08/2018</Text>
						</View>
					</View>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback
					onPress={() => this.props.navigation.navigate('TransactionDetail')}
				>
					<View style={styles.itemContainerStyle}>
						<View style={styles.thumbnailContainerStyle}>
							<Image 
								style={styles.thumbnailStyle}
								source={require('../../assets/ikan.jpg')} 
							/>
						</View>
						<View style={styles.headerContentStyle}>
							<Text style={styles.hedaerTextStyle}>Kakap Merah - 400 Kg</Text>
							<View style={{flexDirection: 'row'}}>
								<Text style={{flex: 1}}>Kardi</Text>
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
							<Text style={{textAlign: 'right'}}>Proses Kontrak</Text>
							<Text style={{textAlign: 'right'}}>21/08/2018</Text>
						</View>
					</View>
				</TouchableNativeFeedback>
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

export default TransactionList
