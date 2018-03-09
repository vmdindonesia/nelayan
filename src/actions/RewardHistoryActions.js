import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { BASE_URL, REQUEST_TIME_OUT } from '../constants'
import {
	REWARD_HISTORIES_FETCH_SUCCESS,
	REWARD_HISTORIES_FETCH_FAIL
} from './types'

export const rewardHistoriesFetch = (token) => async (dispatch) => {
	axios.get(`${BASE_URL}/supplier/rewards`, {
		headers: {token},
		timeout: REQUEST_TIME_OUT
	})
	.then(response => {
		dispatch({
			type: REWARD_HISTORIES_FETCH_SUCCESS,
			payload: response.data.data
		})
	})
	.catch(error => {
		if (error.response) {
			ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
		}
		else {
			ToastAndroid.show('Koneksi internet bermasalah [8]', ToastAndroid.SHORT)
		}

		dispatch({
			type: REWARD_HISTORIES_FETCH_FAIL,
		})
	})
}

