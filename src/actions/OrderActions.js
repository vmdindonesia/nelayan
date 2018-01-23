import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	ORDERS_FETCH_SUCCESS
} from './types'

export const ordersFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/orders`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: ORDERS_FETCH_SUCCESS,
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

