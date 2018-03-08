import {
	REWARD_HISTORIES_FETCH_SUCCESS,
	REWARD_HISTORIES_FETCH_FAIL
} from '../actions/types'

const INITIAL_STATE = {
	data: [],
	loading: true
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REWARD_HISTORIES_FETCH_SUCCESS:
			return {...state, data: action.payload, loading: false}
		case REWARD_HISTORIES_FETCH_FAIL:
			return {...state, loading: false}
		default:
			return state
	}
}
