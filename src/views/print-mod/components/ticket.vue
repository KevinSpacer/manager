<!-- 票据 -->

<template>
  <div class="ticket-box">
    <!-- 顶部 -->
    <div class="box-header">
      <!-- logo -->
      <div class="logo" v-if="showLogo">
        <img
          crossorigin="anonymous"
          :src="$previewFileUrl + roomDetail.logo"
          alt=""
        />
      </div>
      <!-- 名称 -->
      <div class="restaurant-name">
        <second-language
          :firstText="roomDetail.name"
          :secondText="roomDetail.nameLanguage || roomDetail.name"
        ></second-language>
        <P class="ticket-address"  :firstText="roomDetail.name">{{roomDetail.address}}</P>
        <p class="tips-line"> TEL: {{roomDetail.contactWay}}</p>
        <span class="day-number">#{{ orderDetail.daySerialNo }}</span>
      </div>
      <!-- 信息 -->
      <div class="info">
        <p v-if="orderDetail.type !== 'EAT_IN'">
          <span>{{ $LANG_TEXT("座位") }}：</span>
          <span>{{ orderDetail.location }}</span>
        </p>
        <p v-else>
          <span>{{ $LANG_TEXT("客户") }}：</span>
          <span>{{ orderDetail.userName }}</span>
        </p>
        <p>
          {{
            $LANG_TEXT(
              (orderTypes.find((d) => d.value == orderDetail.type) || {}).label
            )
          }}
        </p>
        <p v-if="orderDetail.type == 'EAT_IN'">
          <span>{{ $LANG_TEXT("人数") }}：</span>
          <span>{{ orderDetail.peopleQuantity || 0 }}</span>
        </p>
        <p v-else>
          <span>{{ $LANG_TEXT("电话号码") }}：</span>
          <span>{{ orderDetail.contactWay || "" }}</span>
        </p>
      </div>
    </div>

    <!-- 菜品列表 -->
    <div class="dishes dashed-top">
      <div class="dishes-list">
        <div class="list-header">
          <!-- zizhen guo -->
          <!-- <p style="font-size: 26px;">{{ $LANG_TEXT("菜名") }}</p>
          <p style="font-size: 26px;">{{ $LANG_TEXT("数量") }}</p>
          <p style="font-size: 26px;">{{ $LANG_TEXT("小计") }}</p> -->
        </div>
        <div class="list-content">
          <div
            class="content-item"
            v-for="(item, index) in printGoods"
            :key="'goods' + index"
          >
            <div class="dishe">
              <p class="name">
                <second-language
                  :firstText="item.name"
                  :secondText="item.nameLanguage || item.name"
                ></second-language>
              </p>
              <p style="text-align: left;">{{ item.goodsQuantity }}</p>
              <p class="price" style="text-align: left;">
                {{ item.price }}
                <!-- 折扣 -->
                <span v-if="item.dishesDiscount || item.dishesDiscount != 0">
                  <i
                    class="iconfont icon-discount"
                    v-if="item.isDiscount == 'YES'"
                  ></i>
                  <!-- 百分比 -->
                  <span
                    v-if="
                      item.dishesDiscountType == 'PERCENT' &&
                      Number(item.dishesDiscount) &&
                      item.dishesDiscount != 100
                    "
                  >
                    ({{ item.discountPrice }})
                    <!-- (-{{ item.dishesDiscount }}%) -->
                  </span>
                  <!-- 定额 -->
                  <span
                    v-if="
                      item.dishesDiscountType == 'QUOTA' &&
                      Number(item.dishesDiscount)
                    "
                  >
                    ({{ item.discountPrice }})
                    <!-- (-${{ item.dishesDiscount }}) -->
                  </span>
                </span>
              </p>
            </div>
            <!-- 规格 -->
            <list-item :showUnit="false" :goodsDetail="item"></list-item>

          </div>
        </div>
      </div>
      <div class="info">
        <p v-if="orderDetail.remark">
          <span
            >{{ isPrintOrder ? $LANG_TEXT("订单备注") : $LANG_TEXT("备注") }}:
            {{ orderDetail.remark }}</span
          >
        </p>
        <p v-if="orderDetail.serveDishesWay">
          <span
            >{{
              isPrintOrder
                ? $LANG_TEXT("订单上菜方式")
                : $LANG_TEXT("上菜方式")
            }}: {{ $LANG_TEXT(orderDetail.serveDishesWay) }}</span
          >
        </p>
        <!-- <p>
          <span>{{ $LANG_TEXT("服务员") }}: {{ orderDetail.waiterName }}</span>
        </p> -->
      </div>
    </div>

    <!-- 金额信息 -->
    <!-- info display for total and tax zizhen -->
    <div class="price-info dashed-top" v-if="showPrice">
      <p class="info-line allCount">
        <span>{{ $LANG_TEXT("合计") }}</span>
        <span>{{ printGoods.length }}</span>
        <span>{{ resultPrice.orderMoney.toFixed(2) -resultPrice.taxRateMoney.toFixed(2) }}</span>
      </p>
      <p class="info-line">
        <span>{{ $LANG_TEXT("优惠金额") }}</span>
        <span>{{
          (resultPrice.orderMoney - resultPrice.actuallyPaidMoney).toFixed(2)
        }}</span>
      </p>
      <p class="info-line" v-if="resultPrice.maLingType !== 'NO'">
        <span>{{ $LANG_TEXT("抹零") }}</span>
        <span>{{ $LANG_TEXT(maLingTypes[resultPrice.maLingType]) }}</span>
      </p>
      <p class="info-line" v-if="resultPrice.maLingMoney">
        <span>{{ $LANG_TEXT("抹零金额") }}</span>
        <span>{{ resultPrice.maLingMoney.toFixed(2) }}</span>
      </p>
      <p
        class="info-line"
        v-if="resultPrice.cashDiscountMoney || resultPrice.orderDiscount"
      >
        <span>{{ $LANG_TEXT("折扣") }}</span>
        <span v-if="resultPrice.cashDiscountMoney">
          {{ resultPrice.cashDiscountMoney.toFixed(2) }}
        </span>
        <span v-if="resultPrice.orderDiscount">
          {{ resultPrice.orderDiscount }}%
        </span>
      </p>

      <p class="info-line" v-if="resultPrice.serviceCharge">
        <span>{{ $LANG_TEXT("服务费") }}</span>
        <span v-if="resultPrice.serviceChargeType == 'QUOTA'">
          {{ resultPrice.serviceCharge.toFixed(2) }}
        </span>
        <span v-else> {{ resultPrice.serviceCharge }}% </span>
      </p>

      <p class="info-line" v-if="resultPrice.taxRate">
        <span>{{ $LANG_TEXT("税率")}}({{resultPrice.taxRate}}%)</span>
        <span> {{ resultPrice.taxRateMoney }} </span>
      </p>
      <p class="info-line" v-if="resultPrice.isFreeOrder !== 'NO'">
        <span>{{ $LANG_TEXT("是否免单") }}</span>
        <span>{{ $LANG_TEXT(isFreeOrderTypes[resultPrice.isFreeOrder]) }}</span>
      </p>
      <!-- 外卖 -->
      <p class="info-line" v-if="orderDetail.type == 'TAKE_OUT'">
        <span>{{ $LANG_TEXT("外卖费用") }}</span>
        <span>{{ resultPrice.deliveryFeeValue }}</span>
      </p>

      <p class="info-line">
        <span>{{ $LANG_TEXT("应付金额") }}</span>
        <span>{{ resultPrice.orderMoney.toFixed(2) }}</span>
      </p>
      <!-- <p class="info-line">
        <span>{{ $LANG_TEXT("实付金额") }}</span>
        <span>{{ resultPrice.actuallyPaidMoney.toFixed(2) }}</span>
      </p> -->
      <p class="info-line" v-if="payOrderList.length">
        <span>{{ $LANG_TEXT("支付明细") }}</span>
        <span></span>
      </p>
      <div class="pay-list">
        <div
          class="info-line"
          v-for="(item, index) in payOrderList"
          :key="'pay' + index"
        >
          <p>
            <span class="name" v-if="item.paymentMethodName">
              <second-language
                :firstText="item.paymentMethodName"
                :secondText="item.paymentMethodNameLanguage"
              ></second-language>
            </span>
            <span class="name" v-else>
              {{ $LANG_TEXT("金额") }}{{ index + 1 }}
            </span>
          </p>
          <span>{{ Number(item.payAmount).toFixed(2) }}</span>
        </div>
      </div>
      <p class="info-line" v-if="tipData.length">
        <span>{{ $LANG_TEXT("小费明细") }}</span>
        <span></span>
      </p>
      <div class="pay-list">
        <div
          class="info-line"
          v-for="(item, index) in tipData"
          :key="'pay' + index"
        >
          <p>
            <span class="name" v-if="item.paymentMethodName">
              <second-language
                :firstText="item.paymentMethodName"
                :secondText="item.paymentMethodNameLanguage"
              ></second-language>
            </span>
            <span class="name" v-else>
              {{ $LANG_TEXT("金额") }}{{ index + 1 }}
            </span>
          </p>
          <span>{{ Number(item.payAmount).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 订单编号 -->
    <div class="order-id" v-if="showOrder">
      <p class="line">
        <span>{{ $LANG_TEXT("下单时间") }}: </span>
        <span>{{ orderDetail.creationTime }}</span>
      </p>
      <p class="line">
        <span>{{ $LANG_TEXT("订单编号") }}: </span>
        <span>{{ orderDetail.id }}</span>
      </p>
    </div>

    <!-- 提示语 -->
    <div class="tips-line" v-if="showTips">
      <!-- <p>
        <span>{{ $LANG_TEXT("联系电话") }}: </span>
        <span>{{ roomDetail.contactWay }}</span>
      </p> -->
      <p>
        <span>{{ $LANG_TEXT("欢迎下次光临") }}</span>
      </p>
    </div>
  </div>
</template>
<script setup>
import listItem from "../../eat-food/components/list-item.vue";
import { orderTypeOpts, maLingTypes, isFreeOrderTypes } from "@/utils/options";

import {
  computed,
  onMounted,
  ref,
  watch,
  getCurrentInstance,
  reactive,
} from "vue";

const orderTypes = orderTypeOpts();

const { proxy } = getCurrentInstance();

// 全局模块
const { mainModule } = proxy.$usePiniaModule();

// 餐厅信息
const roomDetail = computed(() => mainModule.roomDetail);

const props = defineProps({
  goodsList: {
    type: Array,
    defualt: () => [],
  },
  orderDetail: {
    type: Object,
    defualt: () => ({}),
  },
  toolParams: {
    type: Object,
    defualt: () => ({
      discount: {
        cashDiscountMoney: "",
        order: {
          orderDiscount: "",
          orderDiscountType: "",
        },
        product: {
          dishesDiscount: "",
          dishesDiscountType: "",
        },
      },
      taxRate: 0,
      service: {
        serviceCharge: "",
        serviceChargeType: "",
      },
    }),
  },

  showLogo: {
    type: Boolean,
    defualt: false,
  },
  showPrice: {
    type: Boolean,
    defualt: false,
  },
  showOrder: {
    type: Boolean,
    defualt: false,
  },
  showTips: {
    type: Boolean,
    defualt: false,
  },
  // 是否是打印订单
  isPrintOrder: {
    type: Boolean,
    defualt: false,
  },
});

const printGoods = ref(props.goodsList);
watch(
  () => props.goodsList.length,
  (nVal) => {
    printGoods.value = props.goodsList;
  }
);

// 计算金额
const resultPrice = reactive({
  orderMoney: 0,
  actuallyPaidMoney: 0,
  discountType: "",
  discountManner: "",
  orderDiscount: 0,
  cashDiscountMoney: 0,
  serviceChargeType: "",
  serviceCharge: 0,
  taxRate: 0,
  maLingType: "NO",
  maLingMoney: 0,
  isFreeOrder: "NO",
  taxRateMoney: 0,
  serviceChargeMoney: 0,
  deliveryFeeMoney: null,
});
const calculateOrderMoney = async () => {
  const { id } = props.orderDetail;
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
  proxy.$updateParams(resultPrice, result);
};

// 明细列表
const payOrderList = ref([]);
// 查询订单明细
const getOrderAAPayDetail = async () => {
  const { id } = props.orderDetail;
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", id);
    const result = res.result;
    payOrderList.value = result;
  } catch (error) {}
};

// 查询小费列表
const tipData = ref([]);
const getOrderTippingList = async () => {
  const { id } = props.orderDetail;
  const res = await proxy.$storeDispatch("fetchGetOrderTippingList", {
    orderId: id,
  });
  const result = res.result;
  tipData.value = result.slice(result.length - 1);
};

onMounted(() => {
  // console.log(props.orderDetail);
  if (props.showPrice) {
    calculateOrderMoney();
    getOrderAAPayDetail();
    getOrderTippingList();
  }
});
</script>

<style lang="scss" scoped>
.ticket-box {
  font-size: 10px;
  //expand print area to deeper bottom zizhen
  padding-bottom: 100px;
  letter-spacing: 2px;
  .dashed-top {
    border-top: 1px dashed #909399;
    margin-top: 10px;
  }

  // 顶部
  .box-header {
    .logo {
      text-align: center;
      margin-top: 10px;
      img {
        height: 80px;
      }
    }
    .restaurant-name {
      position: relative;
      text-align: center;
      line-height: 35px;
      //restaurant name zizhen guo
      font-size: 40px;
      //font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 15px 0;
      //小票地址样式
      .ticket-address{
        font-size: 20px;
        margin-top: 20px;
        margin-bottom: 10px;
        margin-right: 110px;
        margin-left: 110px;
        line-height: 20px;
      }
      .day-number {
        position: absolute;
        font-size: 25px;
        font-weight: bold;
        right: 15px;
        //serial No position name zizhen guo
        top: 18px;
      }
    }
    .info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      //zizhen
      font-size: 20px;
    }
  }

  .dishes,
  .price-info {
    padding: 10px;
    box-sizing: border-box;
    font-size: 16px;
    padding-bottom: 0;
  }

  // 菜品
  .dishes {
    .dishes-list {
      .list-header,
      .dishe {
        display: grid;
        grid-template-columns: 1fr 80px 130px;

        .price {
          display: grid;
          grid-template-columns: 1fr auto;
          .icon-discount {
            font-size: 16px;
          }
          > span {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }
      }
      .list-content {
        .content-item {
          margin-top: 10px;
          // dish name style by zizhen guo
          font-size: 38px;
          .dishe {
            display: grid;
            grid-template-columns: 1fr 80px 130px;
            margin: 5px 0;
          }
        }
      }
    }

    > .info {
      margin-top: 15px;
      > p {
        margin: 5px 0;
      }
    }
  }

  //   金额
  .info-line {
    margin: 5px 0;
    display: grid;
    grid-template-columns: 1fr 130px;
    //change price info area style by zizhen guo
    font-size: 18px;
  }
  .price-info {
    .info-line {
      &.allCount {
        grid-template-columns: 1fr 80px 130px;
      }
    }
    .pay-list {
      margin-left: 15px;

      .info-lin {
      }
    }
  }

  //   订单
  .order-id {
    font-size: 13px;
    padding: 10px;
    box-sizing: border-box;
  //订单時間和編號字體大小和加粗
    font-size: 20px;
    .line {
      margin: 2px 0;
      &.bold {
        font-weight: bold;
      }
    }
  }

  //   提示语
  .tips-line {
    width: 100%;
    text-align: center;
    font-size: 20px;
    margin-top: 1px;
    margin-bottom: 10px;
    p {
      line-height: 40px;
    }
  }
}
</style>

<style lang="scss">
.ticket-box {
  .list-box {
    font-size: 16px;
    .list-box-item {
      display: grid;
      grid-template-columns: 1fr 0 80px 130px !important;
      .item {
        text-align: left;
        &.number {
          &::before {
            content: "1";
          }
        }
      }
    }
  }
}
</style>
