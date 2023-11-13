<!-- 小费 -->
<template>
  <div class="container">
    <!-- 支付方式 -->
    <tag-method v-model="chooseType" :options="playTypeList"></tag-method>

    <el-form>
      <el-form-item>
        <el-input
          class="big-keyboard"
          size="large"
          v-model.number="tip.payAmount"
        ></el-input>
      </el-form-item>
    </el-form>

    <keyboard-number @confirm="confirm" v-model="tip.payAmount">
    </keyboard-number>
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

const emits = defineEmits(["update:modelValue","confirm"]);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const { proxy } = getCurrentInstance();

// 小费
const tip = reactive(props.modelValue);
watch(
  () => tip.payAmount,
  (nVal) => {
    // console.log(tip);
    emits("update:modelValue", tip);
  }
);

// 选中的支付类型
const chooseType = ref("");
watch(
  () => chooseType.value,
  (nVal) => {
    playTypeList.value.map((d) => (d.checked = d.id == nVal));
    const item = playTypeList.value.find((d) => d.id == nVal);
    tip.paymentMethodName = item.name;
    tip.paymentMethodNameLanguage = item.nameLanguage;
    emits("update:modelValue", tip);
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
      if (!tip.paymentMethodName) {
        chooseType.value = (result[0] || {}).id;
      } else {
        chooseType.value = result.find(
          (item) => item.name == tip.paymentMethodName
        ).id;
      }
    });
  } catch (error) {}
};

const confirm = (call) => {
  emits("confirm", call);
};
onMounted(() => {
  getPlayTypeList();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;

  .play-type {
    margin: 15px 0;
    width: 92%;

    > .tag {
      margin-right: 15px;
    }
  }

  .el-form {
    width: 92%;
  }
}
</style>