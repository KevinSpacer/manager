// 请求拦截
/* 
	@param {object} custom
	isAuth 是否是需要授权验证
	customUrl 自定义请求接口
 */

import {
	getItem
} from '../module'

import config from '../apiConfig.js'
// 默认 true
const defaultValues = [undefined, '', null]

export const request = (axios) => {
	axios.interceptors.request.use((option => {
		// console.log('resolve')
		// console.log(option)

		// 授权
		let auth = getItem(config.authName) || ''
		// console.log(auth)

		// 携带配置
		let {
			header = {}
		} = option || {}

		// 自定义 设置
		let { isAuth, customApiUrl = '' } = option.custom || {}

		isAuth = defaultValues.includes(isAuth) || isAuth

		// 请求配置
		let opt = {
			...option
		}

		// 需要授权验证
		if (isAuth) {
			opt.headers = {
				...opt.headers,
				'Auth-Token': auth
			}
		}

		// 自定义请求接口
		if (customApiUrl) {
			opt.baseURL = customApiUrl
			opt.url = ''
		}

		const lang = getItem(config.languageName)
		if (lang) {

			// 翻译参数
			opt.url = `${opt.url}?lang=${lang}`
		}

		// console.log(opt)
		return opt
	}), option => {
		// console.log('reject')
		// console.log(option)
		return Promise.reject(option)
	})
}
