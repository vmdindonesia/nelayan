import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	MEMBERS_FETCH_SUCCESS
} from './types'

export const membersFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/members`, {
		headers: {token}
	})
	.then(response => {
		dispatch({
			type: MEMBERS_FETCH_SUCCESS,
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

