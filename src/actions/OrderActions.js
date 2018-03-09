import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	ORDERS_FETCH_SUCCESS,
	ORDERS_FETCH_FAIL
} from './types'

export const ordersFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/orders`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: ORDERS_FETCH_SUCCESS,
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
			type: ORDERS_FETCH_FAIL,
		})
	})
}

