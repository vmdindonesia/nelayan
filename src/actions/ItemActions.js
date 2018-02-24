import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	ITEMS_FETCH_SUCCESS
} from './types'

export const itemsFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/items`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: ITEMS_FETCH_SUCCESS,
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

