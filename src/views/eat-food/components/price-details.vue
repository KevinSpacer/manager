<template>
  <!-- 订单明细 -->
  <div class="price-info">
    <div class="pay-type" v-if="initiatePayType">
      <h3>{{ $LANG_TEXT("支付类型") }}：</h3>
      <h3>{{ $LANG_TEXT(orderPayStatus[initiatePayType]) }}</h3>
    </div>

    <p
      v-for="(item, index) in priceDetails"
      :class="item.className"
      :key="'index' + index"
    >
      <span>{{ $LANG_TEXT(item.label) }}：</span>
      <span class="value">{{ $LANG_TEXT(item.value) }}</span>
    </p>
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
import {
  discountMannerTypes,
  discountTypes,
  isFreeOrderTypes,
  maLingTypes,
  serviceChargeTypes,
} from "@/utils/options";
const { proxy } = getCurrentInstance();

const props = defineProps({
  orderId: {
    type: String,
    default: "",
  },
  initiatePayType: {
    type: String,
    default: "",
  },
});

// 发起支付类
const orderPayStatus = {
  DIRECT_PAY: proxy.$LANG_TEXT("直接支付"),
  AA_PAY: proxy.$LANG_TEXT("AA支付"),
  SHARE_PAY: proxy.$LANG_TEXT("分额支付"),
};

const order_id = computed(() => props.orderId);

// 数据
const priceInfo = ref({});
// 展示表
const priceDetails = ref([]);
// 查询计算价格
const getCurrOrderPirce = async () => {
  const id = order_id.value;
  if (!id) {
    return;
  }
  try {
    const res = await proxy.$storeDispatch("fetchCalculateOrderMoney", { id });
    const result = res.result;
    // 订单
    if (result.discountType == "ORDER") {
      result.cashDiscountMoney = 0;
    } else {
      //现金
      result.orderDiscount = 0;
      result.orderDiscountType = "";
    }
    const {
      actuallyPaidMoney,
      cashDiscountMoney,
      discountManner,
      discountType,
      isFreeOrder,
      maLingMoney,
      maLingType,
      orderDiscount,
      orderMoney,
      serviceCharge,
      serviceChargeType,
      taxRate,
    } = result;

    // 订单折扣
    if (discountType) {
      priceDetails.value.push({
        label: `折扣类型`,
        value: `${discountTypes[discountType]}`,
      });

      // 折扣方式
      if (discountManner) {
        priceDetails.value.push({
          label: `折扣方式`,
          value: `${discountMannerTypes[discountManner]}`,
        });
      }
    }

    // 现金折扣
    if (cashDiscountMoney) {
      priceDetails.value.push({
        label: `现金折扣（定额）`,
        value: `$${cashDiscountMoney}`,
      });
    }

    // 订单折扣
    if (orderDiscount) {
      priceDetails.value.push({
        label: `订单折扣（百分比）`,
        value: `$${orderDiscount}%`,
      });
    }

    // 服务费
    if (serviceCharge) {
      const typeText = `（${serviceChargeTypes[serviceChargeType]}）`;
      // 定额
      if (serviceChargeType == "QUOTA") {
        priceDetails.value.push({
          label: `服务费`,
          value: `$${serviceCharge} ${typeText}`,
        });
      } else {
        priceDetails.value.push({
          label: `服务费`,
          value: `${serviceCharge}% ${typeText}`,
        });
      }
    }

    // 服务费
    if (serviceCharge) {
      const typeText = `（${serviceChargeTypes[serviceChargeType]}）`;
      // 定额
      if (serviceChargeType == "QUOTA") {
        priceDetails.value.push({
          label: `服务费`,
          value: `$${serviceCharge} ${typeText}`,
        });
      } else {
        priceDetails.value.push({
          label: `服务费`,
          value: `${serviceCharge}% ${typeText}`,
        });
      }
    }

    // 税率
    if (taxRate) {
      priceDetails.value.push({
        label: `税率`,
        value: `${taxRate}%`,
      });
    }

    // 抹零
    if (maLingMoney) {
      priceDetails.value.push({
        label: `抹零`,
        value: `${maLingTypes[maLingType]}`,
      });
      priceDetails.value.push({
        label: `抹零金额`,
        value: `${maLingMoney}`,
      });
    }

    // 免单
    if (isFreeOrder) {
      priceDetails.value.push({
        label: `是否免单`,
        value: `${isFreeOrderTypes[isFreeOrder]}`,
      });
    }

    // 订单金额
    priceDetails.value.push({
      label: `订单金额（原价）`,
      value: `$${(orderMoney || 0).toFixed(2)}`,
      className: "total-price",
    });

    // 订单金额
    priceDetails.value.push({
      label: `实付金额`,
      value: `$${(actuallyPaidMoney || 0).toFixed(2)}`,
      className: "total-price",
    });

    priceInfo.value = res.result;
    // console.log(priceDetails.value);
  } catch (error) {
    console.log(error);
  }
};

// 查询小费列表
const getOrderTippingList = async () => {
  const orderId = order_id.value;
  if (!orderId) {
    return;
  }
  const res = await proxy.$storeDispatch("fetchGetOrderTippingList", {
    orderId,
  });
  const result = res.result;
  const data = result[result.length - 1];
  if (data) {
    priceDetails.value.push({
      label: `小费`,
      value: `$${(data.payAmount || 0).toFixed(2)}`,
    });
  }
};

onMounted(async () => {
  await getOrderTippingList();
  getCurrOrderPirce();
});
</script>

<style lang="scss" scoped>
.price-info {
  > p {
    margin: 10px 0;
  }
  line-height: 30px;
  font-size: 14px;
  padding-left: 15px;

  .pay-type {
    display: flex;
  }

  .total-price {
    font-weight: bold;
    .value {
      color: red;
    }
  }
}
</style>
