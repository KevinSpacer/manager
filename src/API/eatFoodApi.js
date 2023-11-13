
// 更新菜单
export default [

  // 获取售卖菜品组合列表
  { name: 'getSellDishesClassifyCombineList', url: '/goods/getSellDishesClassifyCombineList', method: 'get' },
  // 获取售卖菜品分类列表
  { name: 'getSellDishesClassifyList', url: '/goods/getSellDishesClassifyList', method: 'get' },
  // 获取菜品详情
  { name: 'getDishesDetails', url: '/goods/getDishesDetails', method: 'get' },
  // 获取套餐详情
  { name: 'getSetMealDetails', url: '/goods/getSetMealDetails', method: 'get' },

  // 订单
  // 下单
  { name: 'eatFoodAddOrder', url: '/order/addOrder', method: 'post' },
  // 暂存订单
  { name: 'addTemporaryOrder', url: '/order/addTemporaryOrder', method: 'post' },
  // 获取暂存购物单列表
  { name: 'getTemporaryOrderShoppingList', url: '/order/getTemporaryOrderShoppingList', method: 'get' },
  // 获取订单购物单列表
  { name: 'getOrderShoppingList', url: '/order/getOrderShoppingList', method: 'get' },
  // 订单列表
  { name: 'getOrderList', url: '/order/getOrderPageList', method: 'get' },
  // 获取订单详情
  { name: 'getOrderDetails', url: '/order/getOrderDetails', method: 'get' },
  //  获取订单服务员分页列表
  { name: 'getOrderWaiterPageList', url: '/order/chooser/getOrderWaiterPageList', method: 'get' },
  //  获取全部经理员工用户列表
  { name: 'getManageStaffUserListReporting', url: '/user/getManageStaffUserListReporting', method: 'get' },
  // 修改订单信息
  { name: 'editOrderInfo', url: '/order/editOrderInfo', method: 'post' },
  // 获取待合并订单分页列表
  { name: 'getStayMergeOrderPageList', url: '/order/chooser/getStayMergeOrderPageList', method: 'get' },
  // 合并订单
  { name: 'consolidateOrder', url: '/open/order/consolidateOrder', method: 'post' },
  // 取消订单
  { name: 'cancelingOrder', url: '/order/cancelingOrder', method: 'post' },
  // 修改订单菜品数量
  { name: 'editOrderGoodsQuantity', url: '/order/editOrderGoodsQuantity', method: 'post' },
  // 取消批量订单商品
  { name: 'cancelingBatchOrderGoods', url: '/order/cancelingBatchOrderGoods', method: 'post' },
  // 计算订单金额
  { name: 'calculateOrderMoney', url: '/order/calculateOrderMoney', method: 'post' },
  // 获取订单支付方式统计
  { name: 'selectOrderPayStatistics', url: '/order/selectOrderPayStatistics', method: 'get' },
  // 获取订单金额统计
  { name: 'selectOrderMoneyStatistics', url: '/order/selectOrderMoneyStatistics', method: 'get' },
  // 分单
  { name: 'separateOrder', url: '/order/separateOrder', method: 'post' },
  // 修改订单商品
  { name: 'editOrderShoppingGoods', url: '/order/editOrderShoppingGoods', method: 'put' },
  // 添加订单退款
  { name: 'addOrderRefund', url: '/order/addOrderRefund', method: 'post' },
  // 获取订单退款列表
  { name: 'getOrderRefundList', url: '/order/getOrderRefundList', method: 'get' },
  // 获取订单小费列表
  { name: 'getOrderTippingList', url: '/order/getOrderTippingList', method: 'get' },
  

  // 支付
  // 支付类型
  { name: 'getPaymentMethodList', url: '/paymentMethod/getPaymentMethodList', method: 'get' },
  // 支付订单小费
  { name: 'payOrderTipping', url: '/order/payOrderTipping', method: 'post' },
  // 支付订单金额
  { name: 'payOrderAmount', url: '/order/payOrderAmount', method: 'post' },
  // 发起订单直接支付
  { name: 'initiateOrderDirectPay', url: '/order/initiateOrderDirectPay', method: 'post' },
  // 发起订单AA支付
  { name: 'initiateOrderAaPay', url: '/order/initiateOrderAaPay', method: 'post' },
  // 发起分额支付
  { name: 'initiateOrderSharePay', url: '/order/initiateOrderSharePay', method: 'post' },
  // 订单支付明细列表
  { name: 'getOrderPayDetailList', url: '/order/getOrderPayDetailList', method: 'get' },
  // 取消支付
  { name: 'cancelOrderPay', url: '/order/cancelOrderPay', method: 'delete' },
  // 打印后厨小票（加入打印队列）
  { name: 'addKitchenPrint', url: '/print/addKitchenPrint', method: 'post' },
  // 打印菜品小票（加入打印队列）
  { name: 'addDishesPrint', url: '/print/addDishesPrint', method: 'post' },
  // 打印订单小票（加入打印队列）
  { name: 'addOrderPrint', url: '/print/addOrderPrint', method: 'post' },
  // 获取打印记录
  { name: 'getPrintQueueRecordPageList', url: '/print/getPrintQueueRecordPageList', method: 'get' },
  // 获取打印票据
  { name: 'getPrintTaskImg', url: '/open/print/getPrintTaskImg', method: 'get' },
  // 清除打印记录（打印成功、打印失败）
  { name: 'cleanPrintQueueRecord', url: '/print/cleanPrintQueueRecord', method: 'delete' },


  // 调味品
  // 获取调味品组合列表
  { name: 'getSpicesCombineList', url: '/spices/getSpicesCombineList', method: 'get' },
  // 获取调味品列表
  { name: 'getSpicesList', url: '/spices/getSpicesList', method: 'get' },

  // 自定义调味品
  // 获取自定义调味品列表
  { name: 'getCustomSpicesList', url: '/customSpices/getCustomSpicesList', method: 'get' },
  // 获取自定义价格列表
  { name: 'getCustomPriceList', url: '/customPrice/getCustomPriceList', method: 'get' },

  // 折扣
  // 获取折扣列表
  { name: 'getDiscountList', url: '/discount/getDiscountList', method: 'get' },
  // 服务费
  // 获取服务费列表
  { name: 'getServiceChargeList', url: '/serviceCharge/getServiceChargeList', method: 'get' },
  // 税率
  // 获取税率列表
  { name: 'getTaxRateList', url: '/taxRate/getTaxRateList', method: 'get' },

  // 点餐
  // 添加客户
  { name: 'clientAdd', url: '/client/add', method: 'post' },

]