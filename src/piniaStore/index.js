
// 集合

import mainModule from './mainModule'
import eatFoodModule from './eatFoodModule'

const stores = {
  mainModule,
  eatFoodModule
}

// 集合
const piniaStore = {}

// 挂载注册
export const registerStore = ()=>{
  for(let i in stores){
    piniaStore[i] = stores[i]()
  }
}

// 抛出集合
export default piniaStore