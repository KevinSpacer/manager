
// 入口

import { defineStore } from "pinia";
import { authName } from '@/utils/apiConfig'
import { setItem } from '@/utils/module'
export default defineStore({
  id: 'main',
  state: () => ({
    // 多语言数据
    languageData: {},

    // 选中多语言
    chooseLanguage: 'en_US',

    // 是否为第二语言
    isSecondLanguage: false,

    // 用户信息
    userInfo: {},

    // 基本信息
    baseConfigInfo:{},

    // 当前可用权限
    isUseAuths:[],

    // 餐厅信息
    roomDetail:{}
  }),
  actions: {
    // 展示多语言
    /** 
     * @params {String} zn
     * @params {
     *  mode 语言模式 mult(多语言)|second(第二语言)
     * } config
     * 
    */
    LANG_TEXT(zn, config) {
      const { mode = 'mult' } = config || {}
      if(mode == 'mult'){

        return this.languageData[zn] || zn
      }else{
        if(this.isSecondLanguage){
          return config.secondValue || zn
        }else{
          return zn
        }
      }
    },

    // 清除记录
    clearUseStore() {
      this.baseConfigInfo = {}
      this.languageData = {}
      this.userInfo = {}
      setItem(authName, '')
    }
  },
  getters: {
    getUserInfo: state => state.userInfo
  }
})
