import {
	ITEMS_FETCH_SUCCESS,
	ITEMS_FETCH_FAIL
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ITEMS_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		case ITEMS_FETCH_FAIL:
			return {...state, loading: false}
		default:
			return state
	}
}
