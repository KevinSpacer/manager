import mainApi from './mainApi'
import callWorkApi from './callWorkApi'
import updateFoodApi from './updateFoodApi'
import eatFoodApi from './eatFoodApi'

export default [
  ...mainApi,
  ...callWorkApi,
  ...updateFoodApi,
  ...eatFoodApi
]