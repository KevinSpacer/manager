<!-- 分额付款 -->
<template>
  <div class="container">
    <div class="order-info">
      <!-- 订单明细 -->
      <price-details
        :orderId="routeParams.orderId"
        initiatePayType="SHARE_PAY"
      ></price-details>

      <!-- AA分单 制 -->
      <div class="order-list ml-scrollbar">
        <div
          class="order-item"
          :class="{ 'is-active': payParams.id == item.id }"
          v-for="(item, index) in payOrderList"
          :key="index"
          @click="changePayOrder(item)"
        >
          <div class="title">
            <span class="name" v-if="item.paymentMethodName">
              <second-language
                :firstText="item.paymentMethodName"
                :secondText="item.paymentMethodNameLanguage"
              ></second-language>
            </span>
            <span class="name" v-else>
              {{ $LANG_TEXT("金额") }}{{ index + 1 }}
            </span>
            <span class="price"> ${{ item.payAmount }} </span>
          </div>
          <div class="status">
            {{ orderStatus[item.status] }}
          </div>
        </div>
      </div>
    </div>
    <div class="sum-box">
      <payment-box
        :openPayBtn="openPayBtn"
        v-model="payParams"
        :currAcount="chooseAcount"
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
const routeParams = route.query;

// 支付参数
const payParams = ref({
  id: "",
  payAmount: "",
  paymentMethodName: "",
  paymentMethodNameLanguage: "",
});

// 明细列表
const payOrderList = ref([]);
// 查询订单明细
const getOrderPayDetail = async () => {
  const id = routeParams.orderId;
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", id);
    const result = res.result;
    payOrderList.value = result;

    const isPays = result.filter((item) => item.status == "NO_PAY");
    if (!isPays.length) {
      openPayBtn.value = false;
      payParams.value.id = "";
      chooseAcount.value = 0;
    }
  } catch (error) {}
};
// 订单状态
const orderStatus = {
  NO_PAY: proxy.$LANG_TEXT("未支付"),
  YES_PAY: proxy.$LANG_TEXT("已支付"),
};

const openPayBtn = ref(false);

// 选择的价格
const chooseAcount = ref(0);
// 选择订单支付
const changePayOrder = (item) => {
  if (item.status != "NO_PAY") {
    return;
  }
  // 已选择
  if (payParams.value.id === item.id) {
    payParams.value.id = "";
    payParams.value.payAmount = "";
    openPayBtn.value = false;
    chooseAcount.value = 0;
  } else {
    payParams.value.id = item.id;
    payParams.value.payAmount = item.payAmount;
    openPayBtn.value = true;
    chooseAcount.value = item.payAmount;
  }
  console.log(payParams.value);
};

// 结账完成
const payOver = async (params) => {
  const { payAmount } = params;
  const result = {
    ...params,
  };
  if (chooseAcount.value <= payAmount) {
    result.payAmount = chooseAcount.value;
  }
  try {
    await proxy.$storeDispatch("fetchPayOrderAmount", result);
    getOrderPayDetail();
  } catch (error) {}
};

// 打印账单
const printBill = (params) => {
  router.push({
    path: "/printMod",
    query: { orderId: routeParams.orderId, type: 2 },
  });
};

// 返回
const back = () => {
  // 实是否都已支付
  const hasNoPays = payOrderList.value.filter(
    (item) => item.status == "NO_PAY"
  );
  if (!hasNoPays.length) {
    router.replace("/order");
  } else {
    router.go(-1);
  }
};

onMounted(async () => {
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
  grid-template-columns: 1fr 570px;
  margin: auto;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  .order-info {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    overflow: hidden;
    .price-detail {
      > p {
        margin: 10px 0;
      }
    }

    .order-list {
      width: 80%;
      overflow-y: auto;
      height: 100%;
      .order-item {
        box-shadow: 0px 0px 10px 0px #9e9e9e59;
        margin: 15px 5px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 10px;
        display: grid;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border: 1px solid white;
        transition: 200ms;
        grid-template-columns: 1fr auto;

        &.is-active {
          border: 1px solid #05d69d;
        }

        .title {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;

          .name {
            padding-right: 15px;
          }
        }
        .status {
          color: #05d69d;
          font-size: 15px;
        }
      }
    }
  }
  .sum-box {
  }
}
</style>