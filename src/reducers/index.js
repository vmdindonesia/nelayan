import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'
import requests from './RequestReducer'
import orders from './OrderReducer'

export default combineReducers({
	user,
	fishLogs,
	requests,
	orders
})
