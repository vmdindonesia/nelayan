import React, { Component } from 'react'
import { View, Image, AsyncStorage, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { setUserToken } from '../actions'
import { COLOR } from '../constants'

class SplashScreen extends Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)

		this.state = {
			image: require('../../assets/splash2.png'),
		}
	}
	
	componentWillMount() {
		// to do: check token expired

			AsyncStorage.getItem('token', (err, result) => {
				if (result) {
					setTimeout(() => {
						this.redirect(result)
					}, 1000)
				}
				else {
					this.setState({image: require('../../assets/splash1.png')})

					setTimeout(() => {
						this.redirect('')
					}, 20000)
				}
			})
	}

	redirect = (result) => {
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
	}

	render() {
		return (
			<ImageBackground 
				source={this.state.image}
				style={{width: '100%', height: '100%'}}
			>
				<TouchableWithoutFeedback onPress={() => this.redirect('')}>
					<View style={{flex: 1}} />
				</TouchableWithoutFeedback>
			</ImageBackground>
		)
	}
}

const mapStateToProps = (state) => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, { setUserToken })(SplashScreen)
