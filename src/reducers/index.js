import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'
import requests from './RequestReducer'

export default combineReducers({
	user,
	fishLogs,
	requests
})
