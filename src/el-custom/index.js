import mlDialog from './ml-dialog'
import mlForm from './ml-form.vue'
import mlTable from './ml-table.vue'
import mlPage from './ml-page.vue'
import mlSwitch from './ml-switch.vue'
import mlBtn from './ml-btn.vue'
import mlImage from './ml-image.vue'

import secondInput from '../components/second-input.vue'
import layzSelect from '../components/layz-select.vue'
import secondLanguage from '../components/second-language.vue'
import softKeyboardNumber from "../components/soft-keyboard-number/index.vue";
import numberChange from "../components/number-change/index.vue";
import dialogJoinCar from "../components/dialog-join-car/index.vue";
import keyboardNumber from "../components/keyboard-number/index.vue";



const coms = {
  mlDialog,
  mlForm,
  mlTable,
  mlPage,
  mlSwitch,
  mlBtn,
  mlImage,

  secondInput,
  layzSelect,
  secondLanguage,
  softKeyboardNumber,
  numberChange,
  dialogJoinCar,
  keyboardNumber
}

export default {
  install(Vue) {
    for (let i in coms) {
      Vue.component(i, coms[i])
    }
  }
}