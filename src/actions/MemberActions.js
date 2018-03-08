import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	MEMBERS_FETCH_SUCCESS,
	MEMBERS_FETCH_FAIL
} from './types'

export const membersFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/members`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: MEMBERS_FETCH_SUCCESS,
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
			type: MEMBERS_FETCH_FAIL,
		})
	})
}

