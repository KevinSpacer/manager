import {
	storeResponse
} from '@Utils/module'
import { updateFileUrl } from '@/utils/apiConfig'


export default {
	actions: {
		// 账号密码登录
		async fetchManageUserLogin({ getters }, params) {

			const { manageUserLogin } = getters.getHttps

			const result = await manageUserLogin(params)

			return storeResponse(result)
		},
		// 查询当前登录信息
		async fetchSelectCurrentUserInfo({ getters }, params) {
			const { selectCurrentUserInfo } = getters.getHttps

			const result = await selectCurrentUserInfo(params)

			return storeResponse(result)
		},
		// 修改密码
		async fetchUpdatePasswordPost({ getters }, params) {

			const { updatePasswordPost } = getters.getHttps

			const result = await updatePasswordPost(params)

			return storeResponse(result)
		},

		// 查询基础设置信息
		async fetchGetBaseSetting({ getters }, params) {

			const { getBaseSetting } = getters.getHttps

			const result = await getBaseSetting(params)

			return storeResponse(result)
		},

		// 国际化
		// 获取国际化语言类型列表
		async fetchGetInternationalLanguageTypeList({ getters }, params) {

			const { getInternationalLanguageTypeList } = getters.getHttps

			const result = await getInternationalLanguageTypeList(params)

			return storeResponse(result)
		},
		// 修改经理用户语言
		async fetchEditManageUserLanguage({ getters }, params) {

			const { editManageUserLanguage } = getters.getHttps

			const result = await editManageUserLanguage(params, {
        custom: {
          isPathVariable: true
        }
      })

			return storeResponse(result)
		},
		// 修改经理用户语言
		async fetchGetInternationalLanguageContentList({ getters }, params) {

			const { getInternationalLanguageContentList } = getters.getHttps

			const result = await getInternationalLanguageContentList(params)

			return storeResponse(result)
		},
		// 获取经理用户菜单列表
		async fetchGetUserCurrSelectList({ getters }, params) {

			const { getUserCurrSelectList } = getters.getHttps

			const result = await getUserCurrSelectList(params, {
        custom: {
          isPathVariable: true
        }
      })

			return storeResponse(result)
		},

		// 获取餐厅信息
		async fetchGetDiningRoomSelectInfo({ getters }, params) {

			const { getDiningRoomSelectInfo } = getters.getHttps

			const result = await getDiningRoomSelectInfo(params)

			return storeResponse(result)
		},

		// 根据手机号码查询客户信息
		async fetchGetClientByContactWay({ getters }, params) {

			const { getClientByContactWay } = getters.getHttps

			const result = await getClientByContactWay(params)

			return storeResponse(result)
		},

		// 上传图片
		async fetchUploadImage({ getters }, params) {

			const { uploadImage } = getters.getHttps
			// console.log(updateFileUrl)
			const result = await uploadImage(params, {
				custom: {
					customApiUrl: updateFileUrl,
					isFile: true
				}
			})

			return storeResponse(result)
		},
	}

}