import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { AsyncStorage } from 'react-native'
import { BASE_URL } from '../constants'
import {
	USER_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
	SET_USER_TOKEN
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
	AsyncStorage.removeItem('token').then(console.log('token terhapus'))

	callback()

	return (dispatch) => {
		dispatch({
			type: USER_LOGOUT
		})
	}
}

export const setUserToken = (token) => {
	let decoded = jwtDecode(token)
	console.log('decoded ni bro')

	return {
		type: SET_USER_TOKEN,
		payload: {token, data: decoded.user}
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
