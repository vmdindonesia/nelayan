import axios from 'axios'
import { AsyncStorage } from 'react-native'
import { BASE_URL } from '../constants'
import {
	FISHLOGS_FETCH_SUCCESS
} from './types'

export const fishLogsFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/fishlogs`, {
		headers: {'x-access-token': token}
	})
	.then(response => {
		dispatch({
			type: FISHLOGS_FETCH_SUCCESS,
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

