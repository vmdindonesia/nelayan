import {
	ITEMS_FETCH_SUCCESS
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ITEMS_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		default:
			return state
	}
}
