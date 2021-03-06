import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	REQUESTS_FETCH_SUCCESS,
	REQUESTS_FETCH_FAIL
} from './types'

export const requestsFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/requests`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: REQUESTS_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah [7]', ToastAndroid.SHORT)
		}

		dispatch({
			type: REQUESTS_FETCH_FAIL,
		})
	})
}

