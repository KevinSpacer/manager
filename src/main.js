import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import { createPinia } from 'pinia'
import { registerStore } from '@/piniaStore'
const pinia = createPinia()

// element-plus 样式
import 'element-plus/dist/index.css'
import elementPlus from 'element-plus'
// fade/zoom
// 内置过渡动画
import 'element-plus/theme-chalk/base.css'

// 自定义组件
import elCustom from './el-custom/index'

//disable context menu zizhen guo Oct-30-2023

// window.addEventListener('contextmenu', function (e) { 
//   e.preventDefault(); 
// }, false);

// 国际化
const app = createApp(App)

app.use(elementPlus).use(router).use(elCustom).use(pinia).use(store).mount('#app')

// 注册pinia库
registerStore()

import piniaStore from '@/piniaStore/index'
const { mainModule } = piniaStore

// 全局自定义插件方法设置
import * as globalModule from '@Utils/module';
import * as apiConfig from '@Utils/apiConfig';
const globalProperties = {
  ...globalModule,
  ...apiConfig
}
for (let i in globalProperties) {
  app.config.globalProperties['$' + i] = globalProperties[i]
}

// 多语言翻译方法
app.config.globalProperties.$LANG_TEXT = mainModule.LANG_TEXT

// 配置API请求设置
import { initApi } from '@/utils/http/index'
initApi(store)

// 图标
import * as icons from '@element-plus/icons-vue'

// 插入
Object.keys(icons).forEach(key => {
  app.component(key, icons[key])
})