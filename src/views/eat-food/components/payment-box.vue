<!-- 明细 付款 -->
<template>
  <div class="pay-container">
    <!-- 支付方式 -->
    <div class="pay-type-box">
      <tag-method v-model="chooseType" :options="playTypeList"></tag-method>
      <p class="give-change" v-if="chooseType == 4">
        <span>{{ $LANG_TEXT("找零") }}：</span>
        <span v-if="playParams.id">${{ payReceive }}</span>
        <span v-else>${{ payReceive }}</span>
        <!-- <span>{{ replayPrice }}</span> -->
      </p>
    </div>
    <div class="display" v-if="chooseType == 4">
      <span>{{ $LANG_TEXT("Amount Received: ") }}</span>
      <span>${{ playParams.payAmount.toFixed(2) }}</span>
    </div>
    <div class="button" v-if="chooseType == 4">
      <el-button size="large" type="primary" @click="payOverBtn(100)">$ 100</el-button>
      <el-button size="large" type="primary" @click="payOverBtn(50)">$ 50</el-button>
      <el-button size="large" type="primary" @click="payOverBtn(20)">$ 20</el-button>
      <el-button size="large" type="primary" @click="payOverBtn(10)">$ 10</el-button>
      <el-button size="large" type="primary" @click="payOverBtn(5)">$ 5 </el-button>
    </div>
    <div class="direct-active">
      <keyboard-number v-model="playParams.payAmount" @confirm="playOver" v-if="chooseType == 4">
      </keyboard-number>
    </div>
    <!-- 结账操作 -->
    <div class="direct-active" v-if="showDirect">
      <el-button size="large" type="danger" :disabled="!openPayBtn" @click="playOver()">
        {{ proxy.$LANG_TEXT("结账完成") }}
      </el-button>
      <!-- 3 button removed, change to setting in the admin -->
      <!-- <el-button
        size="large"
        type="danger"
        @click="printBill(0)"
        v-if="proxy.$isUseAuth('打印账单')"
      >
        {{ proxy.$LANG_TEXT("打印账单") }}
      </el-button>
      <el-button
        size="large"
        type="danger"
        @click="printBill(1)"
        v-if="proxy.$isUseAuth('打印账单')"
      >
        {{ proxy.$LANG_TEXT("English Receipt") }}
      </el-button>
      <el-button
        size="large"
        type="danger"
        @click="printBill(2)"
        v-if="proxy.$isUseAuth('打印账单')"
      >
        {{ proxy.$LANG_TEXT("中英账单") }}
      </el-button> -->
      <el-button size="large" type="danger" @click="returnBack">
        {{ proxy.$LANG_TEXT("退出") }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  watch,
  computed,
  onMounted,
  reactive,
  inject,
} from "vue";

import tagMethod from "./tag-method.vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const routeParams = route.query;
const payReceive = ref(0)
const emits = defineEmits([
  "confirm",
  "printBill",
  "update:modelValue",
  "back",
]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      payAmount: "",
      paymentMethodName: "",
      paymentMethodNameLanguage: "",
    }),
  },
  // 是否打开结束完成按钮
  openPayBtn: {
    type: [Boolean, String, Number],
    default: false,
  },
  currAcount: {
    type: [String, Number],
    default: 0,
  },
  // 显示结账
  showDirect: {
    type: Boolean,
    default: true,
  },
  // 显示找零
  showGive: {
    type: Boolean,
    default: true,
  },
});

// 输入框的价格
const activeAcount = ref(props.currAcount);
watch(
  () => props.currAcount,
  (nVal) => {
    activeAcount.value = nVal;
  }
);

// 找零价格
const giveChange = computed(() => {
  const price1 = activeAcount.value;
  const price2 = playParams.payAmount || 0;
  if (!price2 || !price1) {
    return 0;
  }

  return (price2 - price1).toFixed(2);
});

// const replayPrice = computed(() => {
//   if (playParams) {
//     if (playParams.id) {
//       var price = (playParams.payAmount - currAcount).toFixed(2)
//     } else {
//       var price = (playParams.payAmount - originalPrice).toFixed(2)
//     }
//     console.log(price);
//   }
// })

// 结账数据
const playParams = reactive({
  ...props.modelValue,
});
watch(
  () => props.modelValue,
  (nVal) => {
    console.log(nVal);
    for (let i in nVal) {
      playParams[i] = nVal[i];
    }
    console.log(playParams);
  }
);

const openPayBtn = ref(props.openPayBtn);

watch(
  () => props.openPayBtn,
  (nVal) => {
    console.log(nVal);
    openPayBtn.value = nVal;
  }
);

watch(playParams, (nVal) => {
  console.log(nVal);
  emits("update:modelValue", nVal);
});

// 选中的支付类型
const chooseType = ref("");
watch(
  () => chooseType.value,
  (nVal) => {
    console.log(nVal)
    if (nVal == 3) {
      playParams.payAmount = 0;//初始键盘付钱
    }
    playTypeList.value.map((d) => (d.checked = d.id == nVal));
    const item = playTypeList.value.find((d) => d.id == nVal);
    playParams.paymentMethodName = item.name;
    playParams.paymentMethodNameLanguage = item.nameLanguage;
  }
);

watch(() => playParams.payAmount, (nval) => {
  console.log(nval)
  console.log(playParams.payAmount);
  if (nval > 0) {
    payReceive.value = (playParams.payAmount - originalPrice.value.originPrice).toFixed(2)
    if (payReceive.value < 0) {
      payReceive.value = 0
      proxy.$message({
        message: proxy.$LANG_TEXT("当前金额不够找零"),
      });
    }
  }

})

// 支付类型列表
const playTypeList = ref([]);
// 查询支付类型
const getPlayTypeList = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetPaymentMethodList");
    const result = res.result.filter((item) => item.status == "SHOW");
    playTypeList.value = result;

    setTimeout(() => {
      if (!playParams.paymentMethodName) {
        chooseType.value = (result[0] || {}).id;
      } else {
        chooseType.value = result.find(
          (item) => item.name == playParams.paymentMethodName
        ).id;
      }
    });
  } catch (error) { }
};

// 结账完成
const playOver = async (call) => {
  if (!openPayBtn.value) {
    call ? call() : "";
    return;
  }

  // if (originalPrice.value.originPrice > props.currAcount) {
  //   console.log("new added item is here")
  //   playParams.addNewItem = true;
  //   playParams.payAmount = originalPrice.value.originPrice;
  // }
  call ? call() : "";
  console.log(playParams);
  emits("confirm", playParams);
};

//支付按钮
const payOverBtn = async (value, call) => {
  playParams.payAmount = value;
  console.log(playParams.payAmount);
  if (!openPayBtn.value) {
    call ? call() : "";
    return;
  }
  call ? call() : "";
  //emits("confirm", playParams);

  if (playParams.id) {
    console.log(1);
    console.log(props.currAcount);
    payReceive.value = (playParams.payAmount - props.currAcount).toFixed(2)
  } else {
    console.log(2);
    console.log(originalPrice);
    payReceive.value = (playParams.payAmount - originalPrice.value.originPrice).toFixed(2)
  }
  console.log(payReceive.value);
  if (payReceive.value < 0) {
    payReceive.value = 0
    proxy.$message({
      message: proxy.$LANG_TEXT("当前金额不够找零"),
    });
  }

  // 
};
// 打印账单
const printBill = async (value) => {
  // proxy.$tipsPending();
  playParams.receiptType = value;
  emits("printBill", playParams);
};

//inject below 2 to the child element of payment zizhen guo 01-25-2024
const originalPrice = inject('price');
// 返回
const returnBack = () => {
  emits("back");
};

onMounted(() => {
  getPlayTypeList();
  playParams.payAmount = 0
  console.log(playParams.payAmount);
});
</script>

<style lang="scss" scoped>
.pay-container {
  .display {
    padding-bottom: 20px;
    font-size: 20px;
  }

  .button {
    display: grid;
    grid-template-columns: repeat(5, auto);
  }

  .direct-active {
    margin: 15px 0;
  }

  .pay-type-box {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    .give-change {
      font-size: 20px;
    }
  }
}
</style>