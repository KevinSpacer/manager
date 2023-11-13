import {
	storeResponse
} from '@Utils/module'

export default {
	actions: {
		// 添加打卡记录
		async fetchAddPunchCardRecord({ getters }, params) {

			const { addPunchCardRecord } = getters.getHttps

			const result = await addPunchCardRecord(params)

			return storeResponse(result)
		},
		// 获取经理打卡信息
		async fetchGetManageUserPunchCardInfo({ getters }, params) {
			const { getManageUserPunchCardInfo } = getters.getHttps

			const result = await getManageUserPunchCardInfo(params)

			return storeResponse(result)
		},
		// 获取员工打卡信息
		async fetchGetStaffUserPunchCardInfo({ getters }, params) {

			const { getStaffUserPunchCardInfo } = getters.getHttps

			const result = await getStaffUserPunchCardInfo(params)

			return storeResponse(result)
		},
	}

}