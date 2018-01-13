import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'

export default combineReducers({
	user,
	fishLogs
})
