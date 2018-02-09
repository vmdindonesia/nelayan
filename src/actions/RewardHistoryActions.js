import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	REWARD_HISTORIES_FETCH_SUCCESS
} from './types'

export const rewardHistoriesFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/rewards`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: REWARD_HISTORIES_FETCH_SUCCESS,
			payload: response.data.data
		})
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

