<!-- 菜品分单 -->

<template>
  <div class="container">
    <!-- 顶部操作栏 -->
    <div class="top-box">
      <!-- 订单号 -->
      <div class="order-on">
        {{ $LANG_TEXT("订单号") }}：{{ routeParams.orderId }}
      </div>

      <!-- 操作按钮 -->
      <div class="operation-box">
        <!-- 分单限制 -->
        <!-- <div class="split-area-num">{{ $LANG_TEXT("分单") }}（1/10）</div> -->

        <!-- <el-button
					type="primary"
					size="large"
					@click="isSplitOrders = true"
				>
					{{ $LANG_TEXT("继续分单") }}
				</el-button> -->
        <el-button type="danger" size="large" @click="router.go(-1)">
          <el-icon><Warning /></el-icon>
          {{ $LANG_TEXT("退出") }}
        </el-button>
        <ml-btn
          size="large"
          :disabled="!isOparenSubmit"
          @submit="sureSplitOrder"
        >
          {{ $LANG_TEXT("确认分单") }}
        </ml-btn>
      </div>
    </div>

    <!-- 提示 -->
    <p class="split-tips">
      {{ $LANG_TEXT("原订单要至少保留一个菜品") }}
    </p>

    <!-- 菜品内容 -->
    <div class="goods-container">
      <!-- 标题 -->
      <div class="transfer-box">
        <div class="goods-title">
          <p class="name">{{ $LANG_TEXT("商品") }}</p>
          <p class="quantity">{{ $LANG_TEXT("数量") }}</p>
          <p class="price">{{ $LANG_TEXT("价格") }}</p>
        </div>
        <div></div>
        <div class="goods-title">
          <p class="name">{{ $LANG_TEXT("商品") }}</p>
          <p class="quantity">{{ $LANG_TEXT("数量") }}</p>
          <p class="price">{{ $LANG_TEXT("价格") }}</p>
        </div>
      </div>

      <el-transfer
        ref="transferRef"
        v-model="goodsMasterValue"
        style="text-align: left; display: inline-block"
        :left-default-checked="leftDefaultChecked"
        :titles="[$LANG_TEXT('原订单'), $LANG_TEXT('新订单')]"
        :props="{
          key: 'shopId',
          label: 'name',
        }"
        :data="splitOrderData"
      >
        <template #default="{ option }">
          <div style="height: auto" v-if="false">
            <div class="detail">
              <p class="name">
                <second-language
                  :firstText="option.name"
                  :secondText="option.nameLanguage"
                ></second-language>
              </p>
              <p class="quantity">{{ option.goodsQuantity }}</p>
              <p class="price">${{ option.price }}</p>
            </div>

            <!-- 额外数据 -->
            <div class="children">
              <!-- 规格 -->
              <list-item :goodsDetail="option"></list-item>
              <!-- <p v-for="item in option.value" :key="item.value">xxx</p> -->
            </div>
          </div>
        </template>
      </el-transfer>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import listItem from "./components/list-item.vue";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const routeParams = route.query;

// ref
const transferRef = ref();

// 点餐
const eatFoodModule = proxy.$usePiniaModule("eatFoodModule");
const { addedToCart } = storeToRefs(eatFoodModule);

// 数据
const data = ref([]);

// 监听更变的数据
// 右侧数据
const goodsMasterValue = ref([]);

// 选中
const leftDefaultChecked = ref([]);

// 继续分单
const isSplitOrders = ref(false);

// 分单数据
const splitOrderData = ref([]);

// 确认分单是否可以操作
const isOparenSubmit = computed(() => {
  // 右侧有数据
  const isRightDataLen = goodsMasterValue.value.length;
  // 原数据
  const originLen = splitOrderData.value.length;
  // 原数据大于1
  const isMaxOne = originLen > 1;
  // 未全选
  let isNoAllChange = true;
  if (originLen) {
    isNoAllChange = originLen !== isRightDataLen;
  }

  // 左侧数据量得>=1
  const leftDataLen = originLen - isRightDataLen >= 1;

  return isRightDataLen && isMaxOne && isNoAllChange && leftDataLen;
});

// 确认分单
const sureSplitOrder = async (call) => {
  const orderShoppingIds = goodsMasterValue.value.join(",");
  const { orderId } = routeParams;
  const params = {
    orderId,
    orderShoppingIds,
  };
  try {
    await proxy.$storeDispatch("fetchSeparateOrder", params);
    proxy.$message.success(proxy.$LANG_TEXT("分单成功"));
    router.replace("/order");
  } catch (error) {
    call();
  }
};

onMounted(async () => {
  // 赋值
  splitOrderData.value = JSON.parse(JSON.stringify(addedToCart.value))
    .filter((item) => item.orderType)
    .map((item) => {
      // item.disabled = !is;
      return item;
    });
});
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-rows: auto auto 1fr;

  .top-box {
    width: fit-content;
    display: grid;
    grid-template-columns: 1fr auto;
    padding-bottom: 15px;

    .order-on {
      margin-right: 12px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      padding: 0 20px;
      background-color: #05d69d;
      color: white;
    }

    .operation-box {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;

      .split-area-num {
        margin-right: 15px;
        padding: 10px 20px;
        background-color: #f56c6c8a;
        font-size: 13px;
        border-radius: 10px;
        color: white;
      }
    }
  }

  .split-tips {
    margin-bottom: 5px;
    font-size: 14px;
    color: red;
  }

  // 菜品内容
  .goods-container {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 40px 1fr;

    .transfer-box {
      display: grid;
      grid-template-columns: 1fr 165px 1fr;
      align-items: center;
      .goods-title {
        width: 478px;
        padding-left: 38px;
        display: grid;
        grid-template-columns: 280px 1fr 1fr;
      }
    }
  }
}
</style>

<style lang="scss">
.goods-container {
  .el-transfer {
    width: 100%;
    height: 100%;
    display: grid !important;
    grid-template-columns: 1fr 165px 1fr;
    .el-transfer-panel {
      width: 100%;
      .el-transfer-panel__body {
        height: 90%;
        .el-checkbox-group {
          height: 100%;
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 10px;
            transition: all 300ms ease-in-out;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #00000017;
          }
          &::-webkit-scrollbar-track {
            border-radius: 10px;
          }

          .el-checkbox__label {
            .detail {
              width: 470px;
              display: grid;
              grid-template-columns: 280px 1fr 1fr;

              .price {
                font-size: 16px;
                font-weight: bold;
              }
            }

            .children {
              padding-left: 20px;

              .list-box {
                margin: 0;
                .list-box-item {
                  display: grid;
                  grid-template-columns: 337px 0 0 1fr;
                  justify-items: start;
                }
              }
            }
          }
          > label {
            height: auto;
          }
        }
      }
    }
  }
}
</style>
