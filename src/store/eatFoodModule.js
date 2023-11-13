import {
  storeResponse
} from '@Utils/module'

export default {
  actions: {
    // 获取售卖菜品组合列表
    async fetchGetSellDishesClassifyCombineList({ getters }, params) {

      const { getSellDishesClassifyCombineList } = getters.getHttps

      const result = await getSellDishesClassifyCombineList(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取售卖菜品分类列表
    async fetchGetSellDishesClassifyList({ getters }, params) {
      const { getSellDishesClassifyList } = getters.getHttps

      const result = await getSellDishesClassifyList(params)

      return storeResponse(result)
    },
    // 获取菜品详情
    async fetchGetDishesDetails({ getters }, params) {
      const { getDishesDetails } = getters.getHttps

      const result = await getDishesDetails(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取套餐详情
    async fetchGetSetMealDetails({ getters }, params) {
      const { getSetMealDetails } = getters.getHttps

      const result = await getSetMealDetails(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    // 订单
    // 下单
    async fetchEatFoodAddOrder({ getters }, params) {
      const { eatFoodAddOrder } = getters.getHttps

      const result = await eatFoodAddOrder(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 暂存订单
    async fetchAddTemporaryOrder({ getters }, params) {
      const { addTemporaryOrder } = getters.getHttps

      const result = await addTemporaryOrder(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 获取暂存购物单列表
    async fetchGetTemporaryOrderShoppingList({ getters }, id) {
      const { getTemporaryOrderShoppingList } = getters.getHttps

      const result = await getTemporaryOrderShoppingList(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取订单购物单列表
    async fetchGetOrderShoppingList({ getters }, id) {
      const { getOrderShoppingList } = getters.getHttps

      const result = await getOrderShoppingList(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 订单列表
    async fetchGetOrderList({ getters }, params) {
      const { getOrderList } = getters.getHttps

      const result = await getOrderList(params)

      return storeResponse(result)
    },
    // 获取订单详情
    async fetchGetOrderDetails({ getters }, id) {
      const { getOrderDetails } = getters.getHttps

      const result = await getOrderDetails(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取订单服务员分页列表
    async fetchGetOrderWaiterPageList({ getters }, params) {
      const { getOrderWaiterPageList } = getters.getHttps

      const result = await getOrderWaiterPageList(params)

      return storeResponse(result)
    },
    // 获取所有服务员分页列表
    async fetchGetManageStaffUserListReporting({ getters }, params) {
      const { getManageStaffUserListReporting } = getters.getHttps

      const result = await getManageStaffUserListReporting(params)

      return storeResponse(result)
    },
    // 编辑订单信息
    async fetchEditOrderInfo({ getters }, params) {
      const { editOrderInfo } = getters.getHttps

      const result = await editOrderInfo(params)

      return storeResponse(result)
    },
    // 获取待合并订单分页列表
    async fetchGetStayMergeOrderPageList({ getters }, params) {
      const { getStayMergeOrderPageList } = getters.getHttps

      const result = await getStayMergeOrderPageList(params)

      return storeResponse(result)
    },
    // 合并订单
    async fetchConsolidateOrder({ getters }, params) {
      const { consolidateOrder } = getters.getHttps

      const result = await consolidateOrder(params)

      return storeResponse(result)
    },
    // 取消订单
    async fetchCancelingOrder({ getters }, params) {
      const { cancelingOrder } = getters.getHttps

      const result = await cancelingOrder(params)

      return storeResponse(result)
    },
    // 修改订单商品数量
    async fetchEditOrderGoodsQuantity({ getters }, params) {
      const { editOrderGoodsQuantity } = getters.getHttps

      const result = await editOrderGoodsQuantity(params)

      return storeResponse(result)
    },
    // 取消批量订单商品
    async fetchCancelingBatchOrderGoods({ getters }, params) {
      const { cancelingBatchOrderGoods } = getters.getHttps

      const result = await cancelingBatchOrderGoods(params)

      return storeResponse(result)
    },
    // 计算订单金额
    async fetchCalculateOrderMoney({ getters }, params) {
      const { calculateOrderMoney } = getters.getHttps

      const result = await calculateOrderMoney(params)

      return storeResponse(result)
    },
    // 获取订单支付方式统计
    async fetchSelectOrderPayStatistics({ getters }, params) {
      const { selectOrderPayStatistics } = getters.getHttps

      const result = await selectOrderPayStatistics(params)

      return storeResponse(result)
    },
    // 获取订单金额统计
    async fetchSelectOrderMoneyStatistics({ getters }, params) {
      const { selectOrderMoneyStatistics } = getters.getHttps

      const result = await selectOrderMoneyStatistics(params)

      return storeResponse(result)
    },
    // 分单
    async fetchSeparateOrder({ getters }, params) {
      const { separateOrder } = getters.getHttps

      const result = await separateOrder(params)

      return storeResponse(result)
    },
    // 修改订单商品
    async fetchEditOrderShoppingGoods({ getters }, params) {
      const { editOrderShoppingGoods } = getters.getHttps

      const result = await editOrderShoppingGoods(params)

      return storeResponse(result)
    },
    // 添加订单退款
    async fetchAddOrderRefund({ getters }, params) {
      const { addOrderRefund } = getters.getHttps

      const result = await addOrderRefund(params)

      return storeResponse(result)
    },
    // 获取订单退款列表
    async fetchGetOrderRefundList({ getters }, params) {
      const { getOrderRefundList } = getters.getHttps

      const result = await getOrderRefundList(params)

      return storeResponse(result)
    },
    // 打印后厨小票（加入打印队列）
    async fetchAddKitchenPrint({ getters }, params) {
      const { addKitchenPrint } = getters.getHttps

      const result = await addKitchenPrint(params,{
        custom:{
          isFormData:false
        }
      })

      return storeResponse(result)
    },
    // 打印菜品小票（加入打印队列）
    async fetchAddDishesPrint({ getters }, params) {
      const { addDishesPrint } = getters.getHttps

      const result = await addDishesPrint(params)

      return storeResponse(result)
    },
    // 打印订单小票（加入打印队列）
    async fetchAddOrderPrint({ getters }, params) {
      const { addOrderPrint } = getters.getHttps

      const result = await addOrderPrint(params)

      return storeResponse(result)
    },
    // 获取打印记录
    async fetchGetPrintQueueRecordPageList({ getters }, params) {
      const { getPrintQueueRecordPageList } = getters.getHttps

      const result = await getPrintQueueRecordPageList(params)

      return storeResponse(result)
    },
    // 获取打印票据
    async fetchGetPrintTaskImg({ getters }, params) {
      const { getPrintTaskImg } = getters.getHttps

      const result = await getPrintTaskImg(params)

      return storeResponse(result)
    },
    // 获取打印票据
    async fetchCleanPrintQueueRecord({ getters }, params) {
      const { cleanPrintQueueRecord } = getters.getHttps

      const result = await cleanPrintQueueRecord(params)

      return storeResponse(result)
    },
    // 获取订单小费列表
    async fetchGetOrderTippingList({ getters }, params) {
      const { getOrderTippingList } = getters.getHttps

      const result = await getOrderTippingList(params)

      return storeResponse(result)
    },



    // 支付
    // 支付类型
    async fetchGetPaymentMethodList({ getters }, params) {
      const { getPaymentMethodList } = getters.getHttps

      const result = await getPaymentMethodList(params)

      return storeResponse(result)
    },
    // 支付订单小费
    async fetchPayOrderTipping({ getters }, params) {
      const { payOrderTipping } = getters.getHttps

      const result = await payOrderTipping(params)

      return storeResponse(result)
    },
    // 支付订单小费
    async fetchPayOrderAmount({ getters }, params) {
      const { payOrderAmount } = getters.getHttps

      const result = await payOrderAmount(params)

      return storeResponse(result)
    },
    // 发起订单直接支付
    async fetchInitiateOrderDirectPay({ getters }, params) {
      const { initiateOrderDirectPay } = getters.getHttps

      const result = await initiateOrderDirectPay(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 发起订单AA支付
    async fetchInitiateOrderAaPay({ getters }, params) {
      const { initiateOrderAaPay } = getters.getHttps

      const result = await initiateOrderAaPay(params)

      return storeResponse(result)
    },
    // 发起分额支付
    async fetchInitiateOrderSharePay({ getters }, params) {
      const { initiateOrderSharePay } = getters.getHttps

      const result = await initiateOrderSharePay(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 订单支付明细列表
    async fetchGetOrderPayDetailList({ getters }, params) {
      const { getOrderPayDetailList } = getters.getHttps

      const result = await getOrderPayDetailList(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 取消支付
    async fetchCancelOrderPay({ getters }, params) {
      const { cancelOrderPay } = getters.getHttps

      const result = await cancelOrderPay(params)

      return storeResponse(result)
    },


    // 调味品
    // 获取调味品组合列表
    async fetchGetSpicesCombineList({ getters }, params) {
      const { getSpicesCombineList } = getters.getHttps

      const result = await getSpicesCombineList(params)

      return storeResponse(result)
    },
    // 获取调味品列表
    async fetchGetSpicesList({ getters }, id) {
      const { getSpicesList } = getters.getHttps

      const result = await getSpicesList(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    // 自定义调味品
    // 获取自定义调味品列表
    async fetchGetCustomSpicesList({ getters }, params) {
      const { getCustomSpicesList } = getters.getHttps

      const result = await getCustomSpicesList(params)

      return storeResponse(result)
    },
    // 获取自定义价格列表
    async fetchGetCustomPriceList({ getters }, params) {
      const { getCustomPriceList } = getters.getHttps

      const result = await getCustomPriceList(params)

      return storeResponse(result)
    },

    // 获取折扣列表
    async fetchGetDiscountList({ getters }, params) {
      const { getDiscountList } = getters.getHttps

      const result = await getDiscountList(params)

      return storeResponse(result)
    },
    // 获取服务费
    async fetchGetServiceChargeList({ getters }, params) {
      const { getServiceChargeList } = getters.getHttps

      const result = await getServiceChargeList(params)

      return storeResponse(result)
    },
    // 获取税率列表
    async fetchGetTaxRateList({ getters }, params) {
      const { getTaxRateList } = getters.getHttps

      const result = await getTaxRateList(params)

      return storeResponse(result)
    },

    // 点餐
    // 添加客户
    async fetchClientAdd({ getters }, params) {
      const { clientAdd } = getters.getHttps

      const result = await clientAdd(params)

      return storeResponse(result)
    },

  }

}