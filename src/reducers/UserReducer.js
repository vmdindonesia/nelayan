import {
	USER_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT,
} from '../actions/types'

const INITIAL_STATE = {
	loading: false,
	error: '',
	token: ''
}

export default (state = INITIAL_STATE, action) => {
	console.log(action)

	switch (action.type) {
		case USER_LOADING:
			return {...state, loading: true, error: ''}
		case USER_LOGIN_SUCCESS:
			return {...state, loading: false, token: action.payload, error: ''}
		case USER_LOGIN_FAIL:
			return {...state, loading: false, error: action.payload}
		case USER_LOGOUT:
			return {...state, token: ''}
		default:
			return state
	}
}
