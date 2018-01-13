import axios from 'axios'
import { AsyncStorage } from 'react-native'
import { BASE_URL } from '../constants'
import {
	USER_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
} from './types'

export const login = (email, password) => {
	return (dispatch) => {
		loading(dispatch)

		const data = {email, password}

		axios.post(`${BASE_URL}/login`, data)
		.then(response => loginSuccess(dispatch, response))
		.catch(error => loginFail(dispatch, error))
	}
}

export const logout = (callback) => async dispatch => {
	await AsyncStorage.setItem('token', '')
	callback()
}

const loading = (dispatch) => {
  dispatch({
    type: USER_LOADING
  })
}

const loginSuccess = async (dispatch, response) => {
	await AsyncStorage.setItem('token', response.data.token)
	
	dispatch({
		type: USER_LOGIN_SUCCESS
	})
}

const loginFail = (dispatch, error) => {
	dispatch({
		type: USER_LOGIN_FAIL,
		payload: error.response ? error.response.data.message : 'Koneksi internet bermasalah'
	})
}
