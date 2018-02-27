import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	NOTIFICATIONS_FETCH_SUCCESS
} from './types'

export const notificationsFetch = (token, params) => async (dispatch) => {
  const paramEncoded = encodeURI(params)

	axios.get(`${BASE_URL}/notifications?${paramEncoded}`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: NOTIFICATIONS_FETCH_SUCCESS,
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

