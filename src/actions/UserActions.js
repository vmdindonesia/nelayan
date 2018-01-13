import axios from 'axios'
import { BASE_URL } from '../constants'
import {
	USER_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
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

export const logout = (callback) => {
	callback()

	return (dispatch) => {
		dispatch({
			type: USER_LOGOUT
		})
	}
}

const loading = (dispatch) => {
	dispatch({
		type: USER_LOADING
	})
}

const loginSuccess = (dispatch, response) => {
	dispatch({
		type: USER_LOGIN_SUCCESS,
		payload: response.data.token
	})
}

const loginFail = (dispatch, error) => {
	dispatch({
		type: USER_LOGIN_FAIL,
		payload: error.response ? error.response.data.message : 'Koneksi internet bermasalah'
	})
}
