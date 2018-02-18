import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'
import requests from './RequestReducer'
import orders from './OrderReducer'
import items from './ItemReducer'
import rewardHistories from './RewardHistoryReducer'
import members from './MemberReducer'

export default combineReducers({
	user,
	fishLogs,
	requests,
	orders,
	items,
	rewardHistories,
	members
})
