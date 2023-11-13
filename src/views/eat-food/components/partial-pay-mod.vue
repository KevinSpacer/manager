<!-- 分额支付 -->
<template>
  <div class="pay-container">
    <el-form>
      <el-form-item v-for="(item, index) in priceData" :key="index">
        <el-input
          v-model="item.value"
          @input="setFloat(item, index)"
          @blur="selectInput(item, index)"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="computed">
      <p class="price-text">
        <span>{{ $LANG_TEXT("剩余") }}：</span>
        <span>${{ showPrice }}</span>
      </p>
      <keyboard-number v-model="numberValue" :isWrite="is_write">
      </keyboard-number>
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

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  price: {
    type: [String, Number],
    default: 0,
  },
});

const resultPrice = ref(props.price);
watch(
  () => props.price,
  (nVal) => {
    resultPrice.value = nVal;
  }
);

// 剩余价格
const showPrice = computed(() => {
  return (Number(resultPrice.value) - totalPrice.value).toFixed(2);
});
const totalPrice = computed(() => {
  return priceData.value.reduce((add, curr) => {
    const val = Number(curr.value);
    return Number((add += val));
  }, 0);
});

// 数据
const payParams = ref(props.modelValue);
watch(
  () => props.modelValue,
  (nVal) => {
    payParams.value = nVal;
  }
);
watch(
  () => payParams.value,
  (nVal) => {
    // console.log(nVal);
    emits("update:modelValue", nVal);
  }
);

// 价格数据
const priceData = ref([
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
  { value: "" },
]);

const { proxy } = getCurrentInstance();

const isEmpty = ["", null, undefined];

const is_write = ref(true);

// 数字键盘输入值
const numberValue = ref("");
watch(
  () => numberValue.value,
  (nVal) => {
    // 重置
    is_write.value = true;

    if (!isEmpty.includes(chooseIndex.value)) {
      const str_val = nVal.toString();
      const NUM = Number(nVal);

      // 是否是数字
      if (isNaN(NUM)) {
        priceData.value[chooseIndex.value].value = "";
      } else {
        //   处理小数点
        if (str_val.indexOf(".") !== -1) {
          const [num, float] = str_val.split(".");
          // 存在小数位
          if (float) {
            const float_num = float.slice(0, 2);
            if (float.length >= 2) {
              is_write.value = false;
            }
            priceData.value[chooseIndex.value].value = `${num}.${float_num}`;
          } else {
            priceData.value[chooseIndex.value].value = nVal || "";
          }
        } else {
          priceData.value[chooseIndex.value].value = nVal || "";
        }
      }

      const haveValue = priceData.value.filter((item) => item.value);
      const dividedNumber = haveValue.length;
      const amount = haveValue.map((item) => Number(item.value));
      // 赋值
      payParams.value = {
        dividedNumber,
        amount,
      };

      //   console.log(payParams.value);
    }
  }
);

// 选中索引
const chooseIndex = ref(0);

// 获取焦点
const selectInput = (item, index) => {
  numberValue.value = item.value;
  chooseIndex.value = index;
};

const setFloat = (item, index) => {
  //   const str_val = item.value.toString();
  //   if (str_val.indexOf(".") !== -1) {
  //     const [n, f = 0] = str_val.split(".");
  //     numberValue.value = f;
  //     chooseIndex.value = index;
  //     console.log(f);
  //     console.log(numberValue.value);
  //   }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.pay-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;

  .el-form {
    width: 290px;
    padding: 0 10px;
  }

  .price-text {
    font-size: 20px;
    line-height: 60px;
    padding-left: 15px;
  }
}
</style>
