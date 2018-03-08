import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	FISHLOGS_FETCH_SUCCESS,
	FISHLOGS_FETCH_FAIL
} from './types'

export const fishLogsFetch = (token, params) => async (dispatch) => {
  const paramEncoded = encodeURI(params)

	axios.get(`${BASE_URL}/fishlogs?${paramEncoded}`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: FISHLOGS_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah', ToastAndroid.SHORT)
		}

		dispatch({
			type: FISHLOGS_FETCH_FAIL,
		})
	})
}

