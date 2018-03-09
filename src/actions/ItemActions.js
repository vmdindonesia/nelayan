import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	ITEMS_FETCH_SUCCESS,
	ITEMS_FETCH_FAIL
} from './types'

export const itemsFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/items`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: ITEMS_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah [2]', ToastAndroid.SHORT)
		}

		dispatch({
			type: ITEMS_FETCH_FAIL,
		})
	})
}

