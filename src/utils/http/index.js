// 集成API
const qs = require('qs');
import axios from 'axios'

import config from '../apiConfig.js'
// 接口集合
import API from '../../API/indexConfig'
import { paramToStr } from '../module.js'

import { request } from './request.js'
import { response } from './response.js'

// 默认 true
const defaultValues = [undefined, '', null]

// 初始化请求配置
const instance = axios.create({
	baseURL: config.serveUrl,
	headers: {
		'content-type': 'application/x-www-form-urlencoded'
	}
})

let https = {}

/**
 * @name 初始化API配置
 */
export const initApi = (store) => {
	for (let i = 0; i < API.length; i++) {
		let item = API[i]

		// 用item.name名作为作为调用方法
		/*
			return response Promise
		*/
		// 设置请求前缀名
		item.url = `${config.prefix}${item.url}`
		https[item.name] = (param = {}, config = {}) => setMethods(item, param, config)
	}

	// console.log(https)
	// 请求 注入vuex
	store.commit('setHttps', https)

	// 设置请求响应
	request(instance)
	response(instance)
}

/**
	@name 处理API响应函数
	@describe 处理请求类型 get|upload|delete|post|put|patch

	@params {Object} custom
		@params {Boolean} isFormData 是否是formdata类型
		@params {Boolean} isPathVariable 是否路径后 /值 
		@params {Boolean} isQuery 是否使用路径后拼接
		@params {Boolean} isFile 是否是文件

	@params {Object} param 请求参数
	@params {Object} config 请求配置

	@return Promise响应函数
 */
async function setMethods({ url, method }, param, config) {
	let {
		custom = {}
	} = config

	let {
		isFormData,
		isPathVariable = false,
		isQuery = false,
		isFile = false
	} = custom

	// 设置默认
	isFormData = defaultValues.includes(isFormData) || isFormData
	// console.log(isFormData)
	if (isFile) {//文件
		config.headers = {
			'content-type': 'multipart/form-data'
		}
	} else {
		if (isFormData) {
			config.headers = {
				'content-type': 'application/x-www-form-urlencoded'
			}
		} else {
			config.headers = {
				'content-type': 'application/json'
			}
		}
	}

	// console.log(config)

	let response = {}

	// 判断类型
	if (['get', 'delete'].includes(method)) {
		try {
			// 是否值路径后参数
			if (isPathVariable) {
				response = await instance[method](url + `/${param}`)
			} else {
				if (method == 'get' || method == 'delete') {
					response = await instance[method](url, {
						params: param,
						...config
					})
				} else {
					response = await instance[method](url)
				}
			}

		} catch (error) {
			response = Promise.reject(error)
		}
	} else if (['post', 'put', 'patch'].includes(method)) {
		try {
			// 是否值路径后参数
			if (isPathVariable) {
				response = await instance[method](url + `/${param}`)
			} else if (isQuery) {//是否使用路径后拼接
				const urljson = paramToStr(param)
				response = await instance[method](url + `?${urljson}`)
			} else if (isFile) {
				response = await instance.request({
					method,
					url,
					data: param,
					...config
				})
			} else {
				if(isFormData){
					response = await instance.request({
						method,
						url,
						data: qs.stringify(param),
						...config
					})
				}else{
					response = await instance.request({
						method,
						url,
						data: param,
						...config
					})
				}
			}
		} catch (error) {
			response = Promise.reject(error)
		}
	}

	// console.log(response)
	return response
}

export default {
	initApi
}