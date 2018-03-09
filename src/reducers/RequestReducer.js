import {
	REQUESTS_FETCH_SUCCESS,
	REQUESTS_FETCH_FAIL
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REQUESTS_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		case REQUESTS_FETCH_FAIL:
			return {...state, loading: false}
		default:
			return state
	}
}
