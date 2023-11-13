<!-- 明细 付款 -->
<template>
  <div class="pay-container">
    <!-- 支付方式 -->
    <div class="pay-type-box">
      <tag-method v-model="chooseType" :options="playTypeList"></tag-method>
      <p class="give-change" v-if="showGive">
        <span>{{ $LANG_TEXT("找零") }}：</span>
        <span>${{ giveChange }}</span>
      </p>
    </div>

    <el-form>
      <el-form-item>
        <el-input
          class="big-keyboard"
          size="large"
          v-model.number="playParams.payAmount"
        ></el-input>
      </el-form-item>
    </el-form>

    <keyboard-number v-model="playParams.payAmount" @confirm="playOver">
    </keyboard-number>

    <!-- 结账操作 -->
    <div class="direct-active" v-if="showDirect">
      <el-button
        size="large"
        type="danger"
        :disabled="!openPayBtn"
        @click="playOver()"
      >
        {{ proxy.$LANG_TEXT("结账完成") }}
      </el-button>
      <el-button
        size="large"
        type="danger"
        @click="printBill"
        v-if="proxy.$isUseAuth('打印账单')"
      >
        {{ proxy.$LANG_TEXT("打印账单") }}
      </el-button>
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
} from "vue";

import tagMethod from "./tag-method.vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const routeParams = route.query;

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

// 结账数据
const playParams = reactive({
  ...props.modelValue,
});
watch(
  () => props.modelValue,
  (nVal) => {
    // console.log(nVal);
    for (let i in nVal) {
      playParams[i] = nVal[i];
    }
  }
);

const openPayBtn = ref(props.openPayBtn);

watch(
  () => props.openPayBtn,
  (nVal) => {
    // console.log(nVal);
    openPayBtn.value = nVal;
  }
);

watch(playParams, (nVal) => {
  // console.log(nVal);
  emits("update:modelValue", nVal);
});

// 选中的支付类型
const chooseType = ref("");
watch(
  () => chooseType.value,
  (nVal) => {
    playTypeList.value.map((d) => (d.checked = d.id == nVal));
    const item = playTypeList.value.find((d) => d.id == nVal);
    playParams.paymentMethodName = item.name;
    playParams.paymentMethodNameLanguage = item.nameLanguage;
  }
);

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
  } catch (error) {}
};

// 结账完成
const playOver = async (call) => {
  if (!openPayBtn.value) {
    call ? call() : "";
    return;
  }
  call ? call() : "";
  emits("confirm", playParams);
};

// 打印账单
const printBill = async () => {
  // proxy.$tipsPending();
  emits("printBill", playParams);
};

// 返回
const returnBack = () => {
  emits("back");
};

onMounted(() => {
  getPlayTypeList();
});
</script>

<style lang="scss" scoped>
.pay-container {
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