import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../constants'
import { Spinner, Card, CardSection } from '../components/common'

class RewardHistory extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			loading: false,
			data: []
		}
	}

	componentWillMount() {
		this.dataFetch()
	}

	dataFetch = () => {
		this.setState({loading: true})

		let token = this.props.user.token

		axios.get(`${BASE_URL}/supplier/rewards`, {
			headers: {token}
		})
		.then(response => {
			this.setState({
				data: response.data.data,
				loading: false
			})
		})
		.catch(error => {
			if (error.response) {
				alert(error.response.data.message)
			}
			else {
				alert('Koneksi internet bermasalah')
			}
			this.setState({loading: false})
		})
	}

	render() {
		const { data, loading } = this.state

		if (loading) {
			return (
				<View style={{flex: 1}}>
					<Spinner size='large' />
				</View>
			)
		}

		return (
			<View>
			{
				data ?
					<View>
						{
							data.map(item =>
								<Card key={item.id}>
									<CardSection>
										<Text>{item.Item ? item.Item.name : 'Nama Reward'}</Text>
									</CardSection>
									<CardSection>
										<Text>Status: {item.Status ? item.Status.name : 'Status'}</Text>
									</CardSection>
								</Card>
							)
						}
					</View>
				:
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{textAlign: 'center'}}>
							Anda belum memiliki 
							{'\n'}
							riwayat penukaran poin saat ini
						</Text>
					</View>

			}
			</View>
		)
	}
}

const mapStateToProps = state => {
	const { user } = state

	return { user }
}

export default connect(mapStateToProps, {})(RewardHistory)

