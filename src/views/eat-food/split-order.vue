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

      <!-- 菜品操作 -->
      <div class="tree-goods__box">
        <!-- 左侧选择 -->

        <div class="tree-change-box">
          <div class="title">
            <div class="title-left">
              <el-checkbox
                @change="chanageAll($event, 'left')"
                size="large"
                label="原订单"
                v-model="leftCheckStatus"
              ></el-checkbox>
            </div>

            <div class="title-right">{{ leftCountShow }}</div>
          </div>
          <div class="body ml-scrollbar">
            <div
              class="goods-list"
              style="height: auto"
              v-for="(item, index) in useLeftTreeData"
              :key="index"
              @click="item.checked = !item.checked"
            >
              <div class="detail">
                <p class="check-btn">
                  <el-checkbox
                    @change="(e) => (item.checked = !item.checked)"
                    size="large"
                    v-model="item.checked"
                  ></el-checkbox>
                </p>
                <p class="name">
                  <second-language
                    :firstText="item.name"
                    :secondText="item.nameLanguage"
                  ></second-language>
                </p>
                <p class="quantity">{{ item.goodsQuantity }}</p>
                <p class="price">
                  ${{ item.price ? item.goodsQuantity * item.price : 0 }}
                </p>
              </div>

              <!-- 额外数据 -->
              <div class="children">
                <!-- 规格 -->
                <list-item :goodsDetail="item"></list-item>
              </div>
            </div>
          </div>
        </div>

        <div class="tree-change-btn">
          <el-button @click="leftTransfer" :disabled="disabledLeftBtn">
            <el-icon><ArrowLeftBold /></el-icon>
          </el-button>
          <el-button @click="rightTransfer" :disabled="disabledRightBtn">
            <el-icon><ArrowRightBold /></el-icon>
          </el-button>
        </div>

        <div class="tree-change-box">
          <div class="title">
            <div class="title-left">
              <el-checkbox
                @change="chanageAll($event, 'right')"
                size="large"
                label="原订单"
                v-model="rightCheckStatus"
              ></el-checkbox>
            </div>

            <div class="title-right">{{ rightCountShow }}</div>
          </div>
          <div class="body ml-scrollbar">
            <div
              class="goods-list"
              style="height: auto"
              v-for="(item, index) in useRightTreeData"
              :key="index"
              @click="item.checked = !item.checked"
            >
              <div class="detail">
                <p class="check-btn">
                  <el-checkbox
                    @change="(e) => (item.checked = !item.checked)"
                    size="large"
                    v-model="item.checked"
                  ></el-checkbox>
                </p>
                <p class="name">
                  <second-language
                    :firstText="item.name"
                    :secondText="item.nameLanguage"
                  ></second-language>
                </p>
                <p class="quantity">{{ item.goodsQuantity }}</p>
                <p class="price">
                  ${{ item.price ? item.goodsQuantity * item.price : 0 }}
                </p>
              </div>

              <!-- 额外数据 -->
              <div class="children">
                <!-- 规格 -->
                <list-item :goodsDetail="item"></list-item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  computed,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import listItem from "./components/list-item.vue";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const routeParams = route.query;

// 点餐
const eatFoodModule = proxy.$usePiniaModule("eatFoodModule");
const { addedToCart } = storeToRefs(eatFoodModule);

// 数据
const data = ref([]);

// 删除上下文关系
const removeContext = (datas) => {
  return JSON.parse(JSON.stringify(datas));
};

// 监听更变的数据

// 继续分单
const isSplitOrders = ref(false);

// 左侧剩余菜品数量
const leftResidueCount = computed(() => {
  return useLeftTreeData.value.reduce((add, curr, index) => {
    return (add += curr.goodsQuantity || 0);
  }, 0);
});
// 右侧侧剩余菜品数量
const rightResidueCount = computed(() => {
  return useRightTreeData.value.reduce((add, curr, index) => {
    return (add += curr.goodsQuantity || 0);
  }, 0);
});

// 确认分单是否可以操作
const isOparenSubmit = computed(() => {
  // 右侧有数据
  const isRightDataLen = rightResidueCount.value;
  // 原数据
  const originLen = leftResidueCount.value;
  // 原数据大于1
  const isMaxOne = originLen >= 1;

  return isMaxOne && isRightDataLen;
});

// 确认分单
const sureSplitOrder = async (call) => {
  // id
  const orderShoppingIds = useRightTreeData.value
    .map((d) => d.shopId)
    .join(",");

  // 数量
  const orderShoppingQuantitys = useRightTreeData.value
    .map((d) => d.goodsQuantity)
    .join(",");
  const { orderId } = routeParams;
  const params = {
    orderId,
    orderShoppingIds,
    orderShoppingQuantitys,
  };
  try {
    await proxy.$storeDispatch("fetchSeparateOrder", params);
    proxy.$message.success(proxy.$LANG_TEXT("分单成功"));
    router.replace("/order");
  } catch (error) {
    call();
  }
};

// **************************************************************************************
// tree的选择
// **************************************************************************************

const transferState = reactive({
  leftTreeData: [],
  rightTreeData: [],
});
const { leftTreeData, rightTreeData } = toRefs(transferState);

// trees数据
// 左侧
// 展示数据
const useLeftTreeData = computed(() =>
  leftTreeData.value.filter((d) => d.goodsQuantity)
);
// 选中数据
const leftChangeData = computed(() =>
  useLeftTreeData.value.filter((d) => d.checked)
);
// 选中ids
const leftChangeDataIds = computed(() =>
  leftChangeData.value.map((d) => d.shopId)
);
// 右侧
// 展示数据
const useRightTreeData = computed(() =>
  rightTreeData.value.filter((d) => d.goodsQuantity)
);
// 选中数据
const rightChangeData = computed(() =>
  useRightTreeData.value.filter((d) => d.checked)
);
// 选中ids
const rightChangeDataIds = computed(() => {
  return rightChangeData.value.map((d) => d.shopId);
});

// 转移
// 左侧
// 数量显示
const leftCountShow = computed(() => {
  const total = leftTreeData.value.length;
  const size = leftChangeData.value.length;
  return `${size}/${total}`;
});
// 转移按钮的禁用
const disabledLeftBtn = computed(() => !rightChangeDataIds.value.length);
// 操作
const leftTransfer = () => {
  rightCheckStatus.value = false;
  transferData({
    curr_checked_datas: removeContext(rightChangeData.value),
    curr_checked_ids: rightChangeDataIds.value,
    // 被转移
    quiltTransferObject: rightTreeData,
    // 转移到
    transferObject: leftTreeData,
  });
};
// 右侧
// 数量显示
const rightCountShow = computed(() => {
  const total = rightTreeData.value.length;
  const size = rightChangeData.value.length;
  return `${size}/${total}`;
});
// 转移按钮的禁用
const disabledRightBtn = computed(() => {
  return !leftChangeDataIds.value.length;
});
const rightTransfer = () => {
  leftCheckStatus.value = false;
  transferData({
    curr_checked_datas: removeContext(leftChangeData.value),
    curr_checked_ids: leftChangeDataIds.value,
    // 被转移
    quiltTransferObject: leftTreeData,
    // 转移到
    transferObject: rightTreeData,
  });
};

// 转移数据操作
const transferData = (options) => {
  const {
    curr_checked_datas,
    curr_checked_ids,
    quiltTransferObject,
    transferObject,
  } = options || {};

  // 数量的操作
  // 选中的重置
  // 原数据的操作

  // 操作原数据
  for (let i = 0; i < curr_checked_ids.length; i++) {
    const id = curr_checked_ids[i];
    const index = quiltTransferObject.value.findIndex((d) => d.shopId == id);
    quiltTransferObject.value[index].goodsQuantity -= 1;
  }

  // 需要转移的数据
  // 转移到另一边 是否存在相同数据
  for (let i = 0; i < curr_checked_ids.length; i++) {
    const id = curr_checked_ids[i];
    const index = transferObject.value.findIndex((d) => d.shopId == id);

    // 存在
    if (index !== -1) {
      transferObject.value[index].checked = false;
      transferObject.value[index].goodsQuantity += 1;
    } else {
      const itme_data = curr_checked_datas[i];
      // 不存在
      transferObject.value.push({
        ...itme_data,
        checked: false,
        goodsQuantity: 1,
      });
    }
  }
  // console.log(useLeftTreeData.value);
  // console.log(useRightTreeData.value);
};

/* 顶部操作 */
// 全选/反选
const leftCheckStatus = ref();
const rightCheckStatus = ref();
const chanageAll = (status, type) => {
  (type == "left" ? leftTreeData.value : rightTreeData.value).map((item) => {
    item.checked = status;
    return item;
  });
};

onMounted(async () => {
  // 赋值
  const originData = JSON.parse(JSON.stringify(addedToCart.value)).filter(
    (item) => item.orderType
  );

  // console.log(originData);
  leftTreeData.value = originData;
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
  .tree-goods__box {
    width: 100%;
    height: 100%;
    display: grid !important;
    grid-template-columns: 1fr 165px 1fr;
    padding-bottom: 20px;
    box-sizing: border-box;
    overflow: hidden;

    .tree-change-box {
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #9e9e9e4a;
      overflow: hidden;
      height: 100%;

      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #efefef78;

        .title-left {
          display: flex;
          align-items: center;

          .el-checkbox {
            height: 15px;
            margin-right: 10px;
          }
        }

        .title-right {
          font-size: 14px;
          color: #9e9e9e;
        }
      }

      .body {
        padding: 10px;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;

        .goods-list {
          height: auto;
          margin-bottom: 12px;
        }
        .detail {
          width: 100%;
          display: grid;
          grid-template-columns: auto 285px 1fr 1fr;

          .price {
            font-size: 16px;
            font-weight: bold;
          }

          .check-btn {
            .el-checkbox {
              height: 23px;
              margin-right: 10px;
            }
          }
        }

        .children {
          padding-left: 20px;

          .list-box {
            margin: 0;
            .list-box-item {
              display: grid;
              grid-template-columns: 363px 0 0 1fr;
              justify-items: start;
              margin-top: 5px;
            }
          }
        }
      }
    }

    .tree-change-btn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
