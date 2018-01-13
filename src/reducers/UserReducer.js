import {
	USER_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
} from '../actions/types'

const INITIAL_STATE = {
	loading: false,
	error: '',
}

export default (state = INITIAL_STATE, action) => {
	console.log(action)

	switch (action.type) {
		case USER_LOADING:
			return {...state, loading: true, error: ''}
		case USER_LOGIN_SUCCESS:
			return {...state, loading: false, error: ''}
		case USER_LOGIN_FAIL:
			return {...state, loading: false, error: action.payload}
		default:
			return state
	}
}
