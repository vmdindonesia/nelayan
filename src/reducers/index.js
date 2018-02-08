import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'
import requests from './RequestReducer'
import orders from './OrderReducer'
import items from './ItemReducer'

export default combineReducers({
	user,
	fishLogs,
	requests,
	orders,
	items
})
