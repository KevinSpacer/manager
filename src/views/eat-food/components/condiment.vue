<!-- 调味品 -->
<template>
  <div class="condiment-container">
    <!-- 调味品组合 -->
    <div class="condiment-classify">
      <tab-scroll v-model="chooseCondimentClassify" :options="{
        keyName: 'name',
        valueName: 'id',
      }" :optionsSecond="{
  keyName: 'nameLanguage',
  valueName: 'id',
}" :data="spicesCondimentList"></tab-scroll>
    </div>

    <!-- 调味品内容 -->
    <div class="condiment-box">
      <div class="left-container">
        <!-- 标准调味品 -->
        <div class="normal-condiment condiment ml-scrollbar flex flex-col">
          <div class="condiment-item"
            :class="{ active: beforeCarCondimentIdsList && beforeCarCondimentIdsList.includes(item.id) }"
            @click="changeCondiment(item)" v-for="(item, index) in normalCondimentData" :key="'item' + index">
            <second-language :firstText="item.name" :secondText="item.nameLanguage"></second-language>
          </div>

        </div>
        <div class="flex" v-if="beforeCarCondimentIdsList && beforeCarCondimentIdsList.length > 0">
          <div class="num-item" :class="{ active: numAct === item.val }" @click="changelen(item)"
            v-for="(item, index) in numCount" :key="'item' + index">
            <second-language :firstText="item.name" :secondText="item.nameLanguage"></second-language>
          </div>
        </div>


        <!-- 自定义调味品 -->
      </div>

      <!-- 常规 -->
      <!-- 自定义 -->
    </div>
  </div>

  <!-- 自定义价格弹窗 -->
  <ml-dialog :showBtn="false" ref="priceDialogRef" class="priceDialog" :title="$LANG_TEXT('自定义价格')">
    <template #content>
      <div class="condiment-price ml-scrollbar">
        <div class="condiment-item" v-for="(item, index) in customPriceData" :key="'item-price' + index"
          @click="changeCustomPrice(item)">
          ${{ item.price }}
        </div>

        <div class="condiment-item" @click="openNumberDialog">
          {{ $LANG_TEXT("自定义价格") }}
        </div>
      </div>
    </template>
  </ml-dialog>

  <!-- 数字键盘弹窗 -->
  <ml-dialog width="fit-content" :showBtn="false" ref="numberDialogRef" class="numberDialog" :title="$LANG_TEXT('自定义价格')">
    <template #content>
      <div class="number-dialog-box">
        <div class="input-box">
          <el-form ref="numberFormRef" :model="numberFormData" :rules="numberFormRules">
            <el-form-item prop="price">
              <el-input class="big-keyboard" v-model="numberFormData.price"></el-input>
            </el-form-item>
          </el-form>
        </div>condiment
        <div class="number-keyboard">
          <keyboard-number @confirm="numberDialogConfirm" v-model="numberFormData.price">
          </keyboard-number>
          <!-- <soft-keyboard-number
						
					></soft-keyboard-number> -->
        </div>
      </div>
    </template>
  </ml-dialog>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  onMounted,
  reactive,
  watch,
  computed,
  nextTick,
  inject,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import tabScroll from "@/components/tab-scroll";
import { testPositiveNumberFlot } from "@/utils/regExp";

const props = defineProps({
  delItem: {
    type: Object,
    default: () => { }
  }
})

watch(() => props.delItem, (nval) => {
  console.log(nval);
  console.log(beforeCarCondimentIds.value);
  // changeCondiment(nval)
})
const route = useRoute();
const router = useRouter();
const routeParams = route.query;
const { proxy } = getCurrentInstance();
const numCount = ref([{
  name: '少',
  val: 0

},
{
  name: '多',
  val: 1
}])
const numAct = ref(0)
// 校验
const testPositiveNumberFlotValid = (rules, value, call) => {
  if (value) {
    if (testPositiveNumberFlot(value)) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("请输入正确的数字")));
    }
  } else {
    call(new Error(proxy.$LANG_TEXT("请先输入有效的数字")));
  }
};

const eatFoodModule = proxy.$usePiniaModule("eatFoodModule");
// 已加入购物车
const addedToCart = eatFoodModule.addedToCart

// 选中的调味品组合
const chooseCondimentClassify = ref("");
watch(
  () => chooseCondimentClassify.value,
  (nVal) => {
    getCondimentIdDataList();
  }
);

// 调味品组合列表数据
const spicesCondimentList = ref([]);
const beforeCarCondimentIdsList = ref([])
// 查询调味品组合
const getCondiemntClassify = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetSpicesCombineList");
    const result = res.result;
    spicesCondimentList.value = result;
    chooseCondimentClassify.value = (result[0] || {}).id;
  } catch (error) { }
};

// 全标准调味品数据对象
const normalAllCondimentObj = ref({});
// 解析 全标准调味品数据对象
const normalAllCondimentList = computed(() => {
  return Object.keys(normalAllCondimentObj.value).reduce((add, curr) => {
    const item = normalAllCondimentObj.value[curr];
    console.log(item);
    console.log(add)
    return add.concat(item);
  }, []);
});

//当前展示 标准调味品
const normalCondimentData = ref([]);
// 根据选中组合查询 标准调味品
const getCondimentIdDataList = async () => {
  const spicesCombineId = chooseCondimentClassify.value;

  try {
    const res = await proxy.$storeDispatch(
      "fetchGetSpicesList",
      spicesCombineId
    );
    const result = res.result;
    normalCondimentData.value = result;

    normalAllCondimentObj.value[spicesCombineId] = result;
    console.log(normalAllCondimentObj.value);
  } catch (error) { }
};

// 自定义调味品
const customCondimentData = ref([]);
const getCustomCondimentData = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetCustomSpicesList");
    const result = res.result;
    customCondimentData.value = result;
  } catch (error) { }
};

// 自定义价格
const customPriceData = ref([]);
const getCustomPriceData = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetCustomPriceList");
    const result = res.result;
    customPriceData.value = result;
  } catch (error) { }
};

// 要加入购物车的调味品
let beforeCarCondimentIds = ref([]);
const beforeCarCondiment = computed(() => {
  const chooseIds = beforeCarCondimentIdsList.value;
  // 标准
  const result = [
    ...normalAllCondimentList.value,
    ...chooseCustomConds.value,
  ].filter((item) => chooseIds.includes(item.id));

  return result;
});
// 已选择的常规
const sureNormal = computed(() => {
  // console.log([...ormalAllCondimentList.value]);
  console.log(beforeCarCondimentIdsList.value);
  const res = normalAllCondimentList.value.filter((item) => {
    return beforeCarCondimentIdsList.value.includes(item.id)
  }
  )
  console.log(res);
  return res
}

);

// 选择加入购物车的调味品
const changeCondiment = (item, type, currIndex) => {
  console.log(item);
  curItem.value = item
  const id = item.id;
  const condiObj = {
    id: id,
    amount: 0
  }
  // beforeCarCondimentIds.value.push(condiObj);
  console.log(beforeCarCondimentIdsList.value);
  const index = beforeCarCondimentIds.value.findIndex((d) => d.id === id);
  console.log(index);
  // console.log(type)
  // console.log(currIndex)
  // console.log(index)
  // console.log(beforeCarCondimentIds.value.includes(id))
  // console.log(beforeCarCondimentIds.value)
  // console.log(chooseCustomConds.value)
  // 静态删除调味品
  if (type == "delete") {
    console.log(1);
    // 未在动态调味品中
    if (!beforeCarCondimentIdsList.value.includes(id)) {
      console.log(1);
      // 删除静态调味品
      chooseCustomConds.value.splice(currIndex, 1);
    } else {
      // 删除动态调味品
      beforeCarCondimentIds.value.splice(index, 1);
    }
  } else {
    // 已加入ID
    if (beforeCarCondimentIdsList.value && beforeCarCondimentIdsList.value.includes(id)) {
      console.log('删掉');
      beforeCarCondimentIds.value.splice(index, 1);
      beforeCarCondimentIdsList.value = beforeCarCondimentIds.value.map(i => i.id)
      console.log('#', beforeCarCondimentIds.value);
      condimentConfirm(dishValue.value);
    } else {
      console.log('添加');
      beforeCarCondimentIds.value.push(condiObj);
      beforeCarCondimentIdsList.value = beforeCarCondimentIds.value.map(i => i.id)
      console.log('#', beforeCarCondimentIds.value);
      console.log('#', beforeCarCondimentIdsList.value);
      condimentConfirm(dishValue.value);
    }
  }
  console.log(beforeCarCondimentIds.value);
};
// 选择调味品量的多少
const changelen = (item, type, currIndex) => {
  // const id = item.id
  console.log(beforeCarCondimentIds.value);
  numAct.value = item.val
  const index = beforeCarCondimentIds.value.findIndex((d) => d.id === curItem.value.id);
  console.log(beforeCarCondimentIds.value[index]);
  beforeCarCondimentIds.value[index].amount = numAct.value
  console.log(beforeCarCondimentIds.value[index]);
  // beforeCarCondimentIdsList.value = beforeCarCondimentIds.value.map(i=>i.id)
  condimentConfirm(dishValue.value);
}
// 自定义价格弹窗
// ref
const priceDialogRef = ref();
const curItem = ref({}) //当前选中的调味项
// 选中的自定义调味品
const chooseCustomCond = ref();
// 已选择好的自定义调味品
const chooseCustomConds = ref([]);
// 打开弹窗
const openCustomDialog = (item) => {
  chooseCustomCond.value = item;
  priceDialogRef.value.openDialog();
};

// 选择价格
const changeCustomPrice = (item) => {
  chooseCustomCond.value.price = item.price;
  priceDialogRef.value.closeDialog();

  nextTick(() => {
    // 选择赋值
    if (!beforeCarCondimentIds.value.includes(item.id)) {
      beforeCarCondimentIds.value.push(item.id);
    }
    const result = JSON.parse(JSON.stringify(chooseCustomCond.value));
    chooseCustomConds.value.push(result);
  });
};

// 数字键盘弹窗
// ref
const numberDialogRef = ref();
const numberFormRef = ref();
// 数据
const numberFormData = reactive({
  // 价格
  price: "",
});
// 校验
const numberFormRules = reactive({
  // 价格
  price: [
    {
      validator: testPositiveNumberFlotValid,
    },
  ],
});

// 打开自定义调味品弹窗
const openNumberDialog = () => {
  numberDialogRef.value.openDialog();
};
// 确认
const numberDialogConfirm = async (call) => {
  const testRes = await proxy.$testForm(call, numberFormRef.value);

  if (!testRes) {
    return;
  }

  numberDialogRef.value.closeDialog();
  nextTick(() => {
    call();

    // 确认价格
    changeCustomPrice(numberFormData);
  });
};

// 赋值结果 调味品组合+子级
const condimentResult = computed(() => {
  // 组合
  const spicesList = JSON.parse(JSON.stringify(spicesCondimentList.value));
  // 要加入购物车中的调味品
  const condiments = beforeCarCondiment.value;

  // 要加入购物车中的组合ids
  const beforeSpicesIds = condiments.reduce((add, curr) => {
    if (!add.includes(curr.spicesCombineId)) {
      add.push(curr.spicesCombineId);
    }
    return add;
  }, []);
  const filter_spices = spicesList.filter((item) =>
    beforeSpicesIds.includes(item.id)
  );

  // 已筛选好 有组合的调味品
  const spices_condiment = filter_spices.map((item) => {
    const id = item.id;
    item.dishesSpicesAttributeList = condiments.filter(
      (d) => d.spicesCombineId == id
    );
    return item;
  });

  return [...spices_condiment, ...chooseCustomConds.value];
});

// 最终确认结果 by zizhen guo
const condimentConfirm = (dishValue) => {
  // console.log(dishValue);
  // addedToCart[routeParams.carIndex].dishesSpicesList = condimentResult.value;
  // fix condiment disorder in the cart 
  console.log(sureNormal.value);
  sureNormal.value.reverse();
  // 处理调味品 至 自定义调味品

  const condiment_custom = sureNormal.value.map((item) => {
    console.log(item);
    beforeCarCondimentIds.value.forEach(o => {
      if (item.id === o.id) {
        item.amount = o.amount
      }
    })
    const classItem = spicesCondimentList.value.find((d) => {
      // console.log(d);
      d.id == item.spicesCombineId
    }) || {};
    return {
      id: item.spicesCombineId,
      name: `${item.name}/${item.amount ? '多' : '少'}`,
      nameLanguage: `${classItem.nameLanguage}/${item.nameLanguage}`,
      price: item.price,
      amount: item.amount
    };
  });
  addedToCart[dishValue].customDishesSpicesList = [
    ...condiment_custom,
    ...chooseCustomConds.value,
  ];
  // console.log(chooseCustomConds.value)
  // console.log(sureNormal.value)
  console.log(condiment_custom)
  console.log(addedToCart)
  // keep current page by zizhen guo 
  //router.go(-1);
};

// 回显调味品数据 废弃
const callBackData = () => {
  const dishesSpicesList =
    addedToCart[routeParams.carIndex].dishesSpicesList || [];
  // console.log(dishesSpicesList)

  // 无子级调味品值 赋值
  chooseCustomConds.value = dishesSpicesList.filter(
    (item) => !item.dishesSpicesAttributeList
  );

  // 赋值
  beforeCarCondimentIds.value = [
    ...dishesSpicesList.reduce((add, curr) => {
      const childs = curr.dishesSpicesAttributeList || [];
      return add.concat(childs.map((item) => item.id));
    }, []),
    ...chooseCustomConds.value.map((item) => item.id),
  ];
};
// define a index to receive value by zizhen guo
const dishValue = inject('index');
watch(dishValue,
  (nVal) => {
    console.log("i am dish value changed " + nVal);
    beforeCarCondimentIds.value = []
  }
);

// 取消全部
const cancelAll = () => {
  beforeCarCondimentIds.value = []
  chooseCustomConds.value = [];
};

onMounted(() => {
  getCondiemntClassify();
  getCustomCondimentData();
  getCustomPriceData();
  // callBackData()
});
</script>

<style lang="scss" scoped>
.condiment_ {
  padding: 15px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;

  .condiment-item {
    padding: 5px 10px;
    background-color: white;
    height: auto;
    font-size: 15px;
    border-radius: 10px;
    transition: 300ms;
    min-width: 40px;
    text-align: center;
    margin-left: 15px;
    margin-bottom: 15px;

    &.active {
      background-color: #05d69d;
      color: white;
    }
  }
}

.condiment-container {
  height: 100%;
  flex-direction: column;
  align-items: end;

  .condiment-box {
    // display: grid;
    // grid-template-columns: 100px;
    height: 100%;
    overflow: hidden;

    .left-container {
      background-color: #f9f9f9;
      height: 100%;
      overflow: hidden;

      .custom-condiment-box {
        border-top: 1px solid #9e9e9e21;
        height: 100%;
        overflow: hidden;

        .title {
          font-size: 13px;
          height: 20px;
          padding-left: 10px;
          line-height: 30px;
        }
      }

      .condiment {
        @extend .condiment_;
        height: calc(100% - 300px);
      }
    }

    .right-container {
      padding: 5px 10px;

      .join-container {
        border-radius: 10px;
        box-shadow: 0px 1px 5px 0px #9e9e9e4f;
        padding: 10px;
        display: grid;
        grid-template-rows: 41px 41px 1fr;
        overflow: hidden;

        .header,
        .title {
          display: grid;
          grid-template-columns: 1fr 100px 100px;
          padding: 10px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .join-list {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          overflow-y: auto;
          height: 250px;

          .list-item {
            display: grid;
            grid-template-columns: 1fr 100px 100px;
            padding: 5px 0;

            .product-action {
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              padding-left: 5px;
              box-sizing: border-box;
            }
          }
        }

        .tool-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}

.condiment-price {
  background-color: #f9f9f9;
  border-radius: 10px;
  @extend .condiment_;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.num-item {
  // width: 100px;
  padding: 5px 10px;
  background-color: white;
  height: auto;
  font-size: 15px;
  border-radius: 10px;
  transition: 300ms;
  min-width: 40px;
  text-align: center;
  margin-left: 15px;
  margin-bottom: 15px;

  &.active {
    background-color: #05d69d;
    color: white;
  }
}
</style>