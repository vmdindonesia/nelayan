import React, { Component } from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'
import { COLOR } from './../constants'
import Member from './Member'
import Peralatan from './Peralatan'

class MemberList extends Component {
	static navigationOptions = {
		title: 'Anggota',
		headerRight: <View />
	}

	constructor(props) {
		super(props)

		this.state = {
			screen: 'MemberList'
		}
	}

	renderScreen = () => {
		// console.log(this.props)
		if (this.state.screen === 'MemberList') {
			return <Member navi={this.props.navigation} />
		}

		return <Peralatan navi={this.props.navigation} />
	}

	render() {
		const { screen } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.menuContainerStyle}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'MemberList' })}>
								<View style={screen === 'MenuItem' ? styles.tabContainerActive : styles.tabContainer}>
									<Text style={screen === 'MenuItem' ? styles.tabTextActive : styles.tabText}>Anggota</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableNativeFeedback onPress={() => this.setState({ screen: 'Forge' })}>
								<View style={screen === 'OrderList' ? styles.tabContainerActive : styles.tabContainer}>
									<Text style={screen === 'OrderList' ? styles.tabTextActive : styles.tabText}>Peralatan</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
					{this.renderScreen()}
				</View>
			</View>
		)
	}
}

const styles = {
	menuContainerStyle: {
		flex: 4
	},
	tabContainer: {
		backgroundColor: COLOR.element_a3,
		height: 50,
		justifyContent: 'center'
	},
	tabContainerActive: {
		backgroundColor: COLOR.element_a4,
		height: 50,
		justifyContent: 'center'
	},
	tabText: {
		color: '#eaeaea',
		textAlign: 'center',
		fontSize: 18
	},
	tabTextActive: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 18
	},
}

export default MemberList

