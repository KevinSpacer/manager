
// 更新菜单
export default [

  // 获取更新菜品组合列表
  { name: 'getUpdateDishesClassifyCombineList', url: '/goods/getUpdateDishesClassifyCombineList', method: 'get' },
  // 获取更新菜品分类列表
  { name: 'getUpdateDishesClassifyList', url: '/goods/getUpdateDishesClassifyList', method: 'get' },

  // 设置菜品热销状态
  { name: 'settingDishesHotSellingStatus', url: '/goods/settingDishesHotSellingStatus', method: 'put' },
  // 设置菜品售罄状态
  { name: 'settingDishesSellOutStatus', url: '/goods/settingDishesSellOutStatus', method: 'put' },
  // 设置菜品上下架状态
  { name: 'settingDishesShelvesStatus', url: '/goods/settingDishesShelvesStatus', method: 'put' },
  
  // 设置套餐热销状态
  { name: 'settingSetMealHotSellingStatus', url: '/goods/settingSetMealHotSellingStatus', method: 'put' },
  // 设置套餐售罄状态
  { name: 'settingSetMealSellOutStatus', url: '/goods/settingSetMealSellOutStatus', method: 'put' },
  // 设置套餐上架状态
  { name: 'settingSetMealShelvesStatus', url: '/goods/settingSetMealShelvesStatus', method: 'put' },

  // 设置自定义分类排序
  { name: 'settingCustomSortClassify', url: '/goods/settingCustomSortClassify', method: 'post' },
  // 设置自定义组合排序
  { name: 'settingCustomSortClassifyCombine', url: '/goods/settingCustomSortClassifyCombine', method: 'post' },
  // 设置自定义菜品排序
  { name: 'settingCustomSortGoods', url: '/goods/settingCustomSortGoods', method: 'post' },

]