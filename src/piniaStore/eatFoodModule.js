
// 点餐

import { defineStore } from "pinia";
export default defineStore({
  id: 'eatFood',
  state: () => ({
    // 已加入购物车数据
    addedToCart: [],

    // 当前选中订单类型
    // stagingCarData 暂存订单
    // orderCarData 下单
    chooseOrderType: '',

    // 确认的调味品数据
    sureCondiment: [],

    // 当前订单保存的付款明细
    paymentDetails:{
      toolForm:{},
      goodsDetailed:{},
      getTotalOrderAmount: {}
    }
  }),
  actions: {
    
  },
  getters: {
    getAddedToCart: state => state.addedToCart
  }
})
