import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import axios from 'axios'
import { BASE_URL } from '../constants'

class FishLogDetail extends Component {
	static navigationOptions = {
		title: 'Detail Fishlog'
	}

	constructor(props) {
		super(props)
	
		this.state = {
			data: {}
		}
	}

	componentWillMount() {
		let id = this.props.navigation.state.params.id
		let token = this.props.user.token
		
		axios.get(`${BASE_URL}/fishlogs/${id}`, {
			headers: {'x-access-token': token}
		})
		.then(response => {
			this.setState({data: response.data.data})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
		})
	}

	render() {
		const { data } = this.state

		return (
			<View>
				<Text>{data.Fish.name}</Text>
				<Text>{data.size}</Text>
				<Text>{data.quantity}</Text>
				<Text>{data.price}</Text>
			</View>
		)
	}
}

const mapStateToProps = state => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps)(FishLogDetail)
