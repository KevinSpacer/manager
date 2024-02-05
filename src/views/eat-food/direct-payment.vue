<!-- 直接付款 -->
<template>
  <div class="container">
    <!-- 订单明细 -->
    <div>
      <price-details
      :orderId="routeParams.orderId"
      initiatePayType="DIRECT_PAY"
    ></price-details>
    </div>
    <div class="sum-box">
      <payment-box
        :openPayBtn="true"
        v-model="payParams"
        :currAcount="orderDetail.payAmount"
        @confirm="payOver"
        @printBill="printBill"
        @back="back"
      ></payment-box>
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
import priceDetails from "./components/price-details.vue";
import paymentBox from "./components/payment-box.vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
let routeParams = route.query;
//added emits event to call palce order
const emits = defineEmits(["submitOrder",]);
//
const props = defineProps({
	modelValue: {
		type: [String, Number,Object],
		default: "",
	},
});
// 判空
const isEmpty = ["", undefined, null];
// 支付参数
const payParams = ref({
  id: "",
  payAmount: "",
});

// 发起直接付款申请
const initiateOrderDirectPay = async () => {
  await proxy.$storeDispatch(
    "fetchInitiateOrderDirectPay",
    routeParams.orderId
  );
};

const orderDetail = ref({});
// 查询订单明细
const getOrderPayDetail = async () => {
  const id = routeParams.orderId;
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", id);
    const result = res.result;
    const curr = result[0];
    payParams.value = {
      id: curr.id,
      // payAmount: curr.payAmount,
      payAmount: 0,
    };
    orderDetail.value = curr;
    // console.log(payParams.value)
    // console.log(curr)
  } catch (error) {}
};

// 结账完成
const payOver = async (params) => {
  if(!props.modelValue.id || params.addNewItem){
    //console.log(params.id)
    emits("submitOrder",params)
  }else{
  const { payAmount } = params;
  const result = {
    ...params,
  };
  if (orderDetail.value.payAmount <= payAmount) {
    result.payAmount = orderDetail.value.payAmount;
  }
  try {
    console.log(result);
    await proxy.$storeDispatch("fetchPayOrderAmount", result);
    proxy.$message.success(proxy.$LANG_TEXT("结账完成"));
    printBill();
  } catch (error) {}
}};

// 打印账单
const printBill = (params) => {
  console.log(params); // 跳转打印
  router.push({ path: "/printMod", query: { orderId: routeParams.orderId,type:2,autoPrinted:1}});
};

// 返回
const back = () => {
  // 实是否都已支付
  const hasNoPays = orderDetail.value.status != "NO_PAY";
  if (hasNoPays) {
    router.replace("/order");
  } else {
    router.go(-1);
  }
};
onMounted(async () => {
  routeParams = props.modelValue
  if (routeParams.isInitiatePay != "YES") {
    await initiateOrderDirectPay();
  }
  await getOrderPayDetail();
});
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 1200px;
  grid-template-rows: 1fr 570px;
  margin: auto;

  .sum-box {
  }
}
</style>