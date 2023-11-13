// 响应拦截
/*
	@param {object} custom
	returnLogin 是否是需要登录页返回
	showTips 是否是需要响应呢提示
	customUrl 自定义接口（不会添加API的前置）
	isClearStore 是否清除授权
	isResetUseFrozen 是否重置特定拦截
 */

import { ElMessage } from 'element-plus'
import store from '@/piniaStore/index'
import router from '@/router'

import {
	setItem
} from '../module'
import {
	authName
} from '../apiConfig'

//状态 是否已使用
let isUseFrozen = false

// 提示消息实例
let  ELMSG = null

// 默认 true
const defaultValues = [undefined,'',null]

export const response = (axios) => {
	axios.interceptors.response.use(option => {
		// console.log('resolve')
		// console.log(option)

		// 响应数据
		let {
			config = {}, data = {}
		} = option || {}

		// 自定义设置
		let {
			returnLogin, showTips, customApiUrl = '', isClearStore,isResetUseFrozen
		} = config.custom || {}

		// 判断默认
		returnLogin = defaultValues.includes(returnLogin) || returnLogin
		showTips = defaultValues.includes(showTips) || showTips
		isClearStore = defaultValues.includes(isClearStore) || isClearStore

		// 清除旧数据
		if(ELMSG){
			// 关闭弹窗
			ELMSG.close()
		}
		
		// 自定义接口路径
		if (customApiUrl) {

		} else {
			// 授权失效
			if (data.code == 401) {

				if (isClearStore) {
					// 清授权
					setItem(authName, '')
				}

				// 是否显示提醒
				if (showTips) {
					ELMSG = ElMessage({
						showClose: true,
						message: store.mainModule.LANG_TEXT(data.message),
						type: 'warning',
					})
				}
				
				// console.log(returnLogin)
				// 是否返回登录
				if (returnLogin) {
					store.mainModule.clearUseStore()
					router.replace('/login')
				}

			}else{
				if (data.code != 200) {
					// 是否显示提醒
					if (showTips) {
						ELMSG = ElMessage({
							showClose: true,
							message: store.mainModule.LANG_TEXT(data.message),
							type: 'warning',
						})
					}
				}else{
					isUseFrozen = false
				}
			}
		}
		
		// 关于code状态交由 专门处理响应的函数 storeResponse
		return data
	}, option => {
		// console.log('reject')
		// console.log(option)

		// 响应
		let {
			config = {}
		} = option || {}

		// 自定义设置
		let {
			showTips
		} = config.custom || {}
		
		// 判断默认
		showTips = defaultValues.includes(showTips) || showTips
		
		// 清除旧数据
		if(ELMSG){
			// 关闭弹窗
			ELMSG.close()
		}

		if (!option.data) {
			if (showTips) {
				ELMSG = ElMessage({
					showClose: true,
					message: store.mainModule.LANG_TEXT('服务器异常，请重试'),
					type: 'error',
				})
			}
		}

		return option
	})
}
