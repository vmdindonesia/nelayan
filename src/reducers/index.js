import { combineReducers } from 'redux'
import user from './UserReducer'
import fishLogs from './FishLogReducer'
import requests from './RequestReducer'
import orders from './OrderReducer'
import items from './ItemReducer'
import rewardHistories from './RewardHistoryReducer'
import members from './MemberReducer'
import alat from './AlatReducer'
import kapal from './KapalReducer'
import messages from './MessageReducer'
import notifications from './NotificationReducer'

export default combineReducers({
	user,
	fishLogs,
	requests,
	orders,
	items,
	rewardHistories,
	members,
	messages,
	notifications,
	alat,
	kapal
})
