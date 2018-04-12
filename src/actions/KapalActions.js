import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	KAPAL_FETCH_SUCCESS,
	KAPAL_FETCH_FAIL
} from './types'

export const kapalFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/my-ships`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: KAPAL_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah [3]', ToastAndroid.SHORT)
		}

		dispatch({
			type: KAPAL_FETCH_FAIL,
		})
	})
}