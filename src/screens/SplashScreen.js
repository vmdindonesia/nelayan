import React, { Component } from 'react'
import { View, Image, AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { setUserToken } from '../actions'
import { COLOR } from '../constants'

class SplashScreen extends Component {
	static navigationOptions = {
		header: null
	}
	
	componentWillMount() {
		// to do: check token expired

		setTimeout(() => {
			AsyncStorage.getItem('token', (err, result) => {
				console.log(result, 'Token')
				if (!result || result === '') {
					const resetAction = NavigationActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({ routeName: 'StartScreen'})
						]
					})
					this.props.navigation.dispatch(resetAction)
				} 
				else {
					this.props.setUserToken(result)
					const resetAction = NavigationActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({ routeName: 'Home'})
						]
					})
					this.props.navigation.dispatch(resetAction)
				}
			})
		}, 1000)
	}

	render() {
		return (
			<View 
				style={{
					backgroundColor: COLOR.secondary_a,
					flex: 1,
					justifyContent: 'center', 
					alignItems: 'center'
				}}
			>
				<Image source={require('../../assets/Ic_aruna_logogram.png')} />
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { setUserToken })(SplashScreen)
