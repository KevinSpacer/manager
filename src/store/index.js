import { createStore } from 'vuex'
import { setItem } from '@/utils/module'
import { authName } from '@/utils/apiConfig'

import mainModules from './mainModules'
import callWorkModules from './callWorkModules'
import updateFoodModule from './updateFoodModule'
import eatFoodModule from './eatFoodModule'

export default createStore({
  state: {
    // 请求接口配置项
    https: {},

    
  },
  mutations: {
    // 设置请求函数
    setHttps(state, res) {
      state.https = res
    },

  },
  actions: {
  },
  getters: {
    getHttps: state => state.https,
    getUserInfo: state => state.userInfo,
  },
  modules: {
    mainModules,
    callWorkModules,
    updateFoodModule,
    eatFoodModule
  }
})
