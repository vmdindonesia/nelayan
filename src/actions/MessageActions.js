import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	MESSAGES_FETCH_SUCCESS,
	MESSAGES_FETCH_FAIL
} from './types'

export const messagesFetch = (token, params) => async (dispatch) => {
  const paramEncoded = encodeURI(params)

	axios.get(`${BASE_URL}/messages?${paramEncoded}`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: MESSAGES_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah [4]', ToastAndroid.SHORT)
		}

		dispatch({
			type: MESSAGES_FETCH_FAIL,
		})
	})
}

