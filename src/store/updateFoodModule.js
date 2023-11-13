import {
	storeResponse
} from '@Utils/module'

export default {
	actions: {
		// 获取更新菜品组合列表
		async fetchGetUpdateDishesClassifyCombineList({ getters }, id) {

			const { getUpdateDishesClassifyCombineList } = getters.getHttps

			const result = await getUpdateDishesClassifyCombineList(id,{
				custom:{
					isPathVariable:true
				}
			})

			return storeResponse(result)
		},
		// 获取更新菜品分类列表
		async fetchGetUpdateDishesClassifyList({ getters }, params) {
			const { getUpdateDishesClassifyList } = getters.getHttps

			const result = await getUpdateDishesClassifyList(params)

			return storeResponse(result)
		},

		// 设置菜品热销状态
		async fetchSettingDishesHotSellingStatus({ getters }, params) {
			const { settingDishesHotSellingStatus } = getters.getHttps

			const result = await settingDishesHotSellingStatus(params)

			return storeResponse(result)
		},
		// 设置菜品售罄状态
		async fetchSettingDishesSellOutStatus({ getters }, params) {
			const { settingDishesSellOutStatus } = getters.getHttps

			const result = await settingDishesSellOutStatus(params)

			return storeResponse(result)
		},
		// 设置菜品上下架状态
		async fetchSettingDishesShelvesStatus({ getters }, params) {
			const { settingDishesShelvesStatus } = getters.getHttps

			const result = await settingDishesShelvesStatus(params)

			return storeResponse(result)
		},

		// 设置套餐热销状态
		async fetchSettingSetMealHotSellingStatus({ getters }, params) {
			const { settingSetMealHotSellingStatus } = getters.getHttps

			const result = await settingSetMealHotSellingStatus(params)

			return storeResponse(result)
		},
		// 设置套餐售罄状态
		async fetchSettingSetMealSellOutStatus({ getters }, params) {
			const { settingSetMealSellOutStatus } = getters.getHttps

			const result = await settingSetMealSellOutStatus(params)

			return storeResponse(result)
		},
		// 设置套餐上架状态
		async fetchSettingSetMealShelvesStatus({ getters }, params) {
			const { settingSetMealShelvesStatus } = getters.getHttps

			const result = await settingSetMealShelvesStatus(params)

			return storeResponse(result)
		},
		
		// 设置自定义分类排序
		async fetchSettingCustomSortClassify({ getters }, params) {
			const { settingCustomSortClassify } = getters.getHttps

			const result = await settingCustomSortClassify(params,{
				custom:{
					isFormData:false
				}
			})

			return storeResponse(result)
		},
		// 设置自定义组合排序
		async fetchSettingCustomSortClassifyCombine({ getters }, params) {
			const { settingCustomSortClassifyCombine } = getters.getHttps

			const result = await settingCustomSortClassifyCombine(params,{
				custom:{
					isFormData:false
				}
			})

			return storeResponse(result)
		},
		// 设置自定义菜品排序
		async fetchSettingCustomSortGoods({ getters }, params) {
			const { settingCustomSortGoods } = getters.getHttps

			const result = await settingCustomSortGoods(params,{
				custom:{
					isFormData:false
				}
			})

			return storeResponse(result)
		},
		
	}

}