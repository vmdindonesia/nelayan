import {
	ORDERS_FETCH_SUCCESS,
	ORDERS_FETCH_FAIL
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ORDERS_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		case ORDERS_FETCH_FAIL:
			return {...state, loading: false}
		default:
			return state
	}
}
