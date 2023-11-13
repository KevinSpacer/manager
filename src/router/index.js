import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/main',
    component: () => import('../views/layout/index.vue'),
    children: [
      {
        path: '/main',
        name: 'main',
        component: () => import('../views/main/index.vue')
      }, {
        path: '/reportManagement',
        name: 'reportManagement',
        component: () => import('../views/report-management/index.vue')
      }, {
        path: '/callWork',
        name: 'callWork',
        component: () => import('../views/call-work/index.vue')
      }, {
        path: '/eatFood',
        name: 'eatFood',
        component: () => import('../views/eat-food/index.vue')
      }, {
        path: '/eatFoodDirectPayment',
        name: 'eatFoodDirectPayment',
        component: () => import('../views/eat-food/direct-payment.vue')
      }, {
        path: '/eatFoodPaymentAA',
        name: 'eatFoodPaymentAA',
        component: () => import('../views/eat-food/payment-AA.vue')
      }, {
        path: '/eatFoodPartialPay',
        name: 'eatFoodPartialPay',
        component: () => import('../views/eat-food/partial-pay.vue')
      }, {
        path: '/eatFoodSplitOrder',
        name: 'eatFoodSplitOrder',
        component: () => import('../views/eat-food/split-order.vue')
      }, {
        // 调味品
        path: '/eatFoodCondiment',
        name: 'eatFoodCondiment',
        component: () => import('../views/eat-food/components/condiment.vue')
      }, {
        path: '/updateFood',
        name: 'updateFood',
        component: () => import('../views/update-food/index.vue')
      }, {
        // 订单
        path: '/order',
        name: 'order',
        component: () => import('../views/order/index.vue')
      }, {
        // 订单详情
        path: '/orderDetail',
        name: 'orderDetail',
        component: () => import('../views/order/components/detail.vue')
      }, {
        // 打印
        path: '/printMod',
        name: 'printMod',
        component: () => import('../views/print-mod/index.vue'),
        children: [{
          // 打印记录
          path: '/printLog',
          name: 'printLog',
          component: () => import('../views/print-log/index.vue')
        }]
      }


    ]
  }, {
    path: '/login',
    meta: {
      isAuth: false
    },
    component: () => import('../views/login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
