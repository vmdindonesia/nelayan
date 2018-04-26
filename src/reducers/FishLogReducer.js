import {
	FISHLOGS_FETCH,
	FISHLOGS_FETCH_SUCCESS,
	FISHLOGS_FETCH_FAIL
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FISHLOGS_FETCH:
			return {...state, loading: true}
		case FISHLOGS_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		case FISHLOGS_FETCH_FAIL:
			return {...state, loading: false}
		default:
			return state
	}
}
