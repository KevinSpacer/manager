<!-- 菜品 -->
<template>
  <!-- 更新菜品 -->
  <div
    class="product-card"
    :class="`${productType}`"
    v-if="productType == 'update'"
  >
    <div
      class="product-box"
      :style="{ 'grid-template-columns': ` ${imageWidth}px 1fr` }"
    >
      <div
        class="product-status"
        :style="{ height: imageHeight + 'px', width: imageWidth + 'px' }"
      >
        <ml-image
          fit="cover"
          :style="{ height: imageHeight + 'px', width: imageWidth + 'px' }"
          class="image"
          :src="proxy.$previewFileUrl + detail.logo"
        ></ml-image>

        <!-- 顶部标签 -->
        <!-- 是否是售罄 -->
        <p class="status-bar sell-out" v-if="detail.isSellOut == 'YES'">
          {{ proxy.$LANG_TEXT("售罄") }}
        </p>
        <!-- 是否是热售 -->
        <p class="status-bar hot-sale" v-else-if="detail.isHotSelling == 'YES'">
          {{ proxy.$LANG_TEXT("热售") }}
        </p>
        <!-- 是否是下架 -->
        <p
          class="status-bar btn-off"
          v-else-if="detail.status == 'OFF_SHELVES'"
        >
          {{ proxy.$LANG_TEXT("下架") }}
        </p>
        <!-- 是否是上架 -->
        <p class="status-bar btn-on" v-else-if="detail.status == 'ON_SHELVES'">
          {{ proxy.$LANG_TEXT("上架") }}
        </p>
      </div>

      <!-- 信息 -->
      <div class="productInfo">
        <div class="title">
          <second-language
            class="ml-line-2"
            :firstText="detail.name"
            :secondText="detail.nameLanguage"
          ></second-language>
          <div class="price">${{ detail.price }}</div>
        </div>

        <div class="bottom">
          <!-- 上下架、售罄 -->
          <div class="tool-btn">
            <!-- 是否是下架 上架&&正常库存 -->
            <p
              class="status-bar btn-off"
              @click="updateStatus('status', 'OFF_SHELVES')"
              v-if="detail.status == 'ON_SHELVES'"
            >
              {{ proxy.$LANG_TEXT("下架") }}
            </p>
            <!-- 是否是上架 下架&&售罄中 -->
            <p
              class="status-bar btn-on"
              @click="updateStatus('status', 'ON_SHELVES')"
              v-if="detail.status == 'OFF_SHELVES'"
            >
              {{ proxy.$LANG_TEXT("上架") }}
            </p>
          </div>

          <!-- 热售 -->
          <div
            class="hot-sale"
            @click="updateStatus('hotSale')"
            :class="`${detail.isHotSelling}`"
          >
            {{ proxy.$LANG_TEXT("热售") }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 点菜 -->
  <div class="product-card" :class="`${productType}`" v-else>
        <div class="product-box" @click="clickAllDishes">
      

      <!-- 信息 -->
      <div class="productInfo">
        <div class="title ml-line-2">
          <second-language
            :firstText="detail.name"
            :secondText="detail.nameLanguage"
          ></second-language>
        </div>
        <!-- bottom zone displayed and deleted by zizhen guo -->

      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  getCurrentInstance,
  reactive,
  nextTick,
} from "vue";
const { proxy } = getCurrentInstance();

// 点餐
const eatFoodModule = proxy.$usePiniaModule("eatFoodModule");
// 已加入购物车
const addedToCart = computed(() => eatFoodModule.addedToCart);

const emits = defineEmits(["changeCount", "changeSpec", "pushNew"]);
// create new click method by zizhen guo 11/07/2023
const submitJoinCar = () => {
  
  const obj = props.detail; 
  console.log(obj);
  emits("joinCar", obj);
}
// copy from previous dialog of join car by zizhen guo

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({
      name: "",
      price: "",
      logo: "",
      stockCount: 1,
    }),
  },
  imageHeight: {
    type: Number,
    default: 155,
  },
  imageWidth: {
    type: Number,
    default: 155,
  },
  // 菜品类型
  // update 更新菜品
  // eatFood 点菜
  productType: {
    type: String,
    default: "update",
  },
});

// 当前加入购物车数据
const currAddedCar = computed(() => {
  // console.log(addedToCart.value);
  return (
    addedToCart.value.find((item) => item.goodsId == props.detail.goodsId) || {
      goodsQuantity: 0,
    }
  );
});

// 判空
const isEmpty = ["", undefined, null];

// 判断库存限制
const isOutArea = computed(() => {
  const stockCount = props.detail.stockCount;
  if (props.detail.goodstype == "DISHES") {
    // 无设置库存
    if (isEmpty.includes(stockCount)) {
      return false;
    } else {
      if (carNum.value >= stockCount) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
});

// 购物车数量
const carNum = ref(currAddedCar.value.goodsQuantity);
watch(
  () => currAddedCar.value.goodsQuantity,
  (nVal) => {
    // 单规格 菜品
    if (!showSpecBtn.value) {
      carNum.value = nVal;
    }

    // // 清除该菜品 购物车数据
    if (!nVal) {
      const index = addedToCart.value.findIndex(
        (item) => item.goodsId == props.detail.goodsId
      );

      // 更新 废除
      // setTimeout(() => {
      // 	eatFoodModule.addedToCart.splice(index, 1);
      // 	proxy.$forceUpdate();
      // });
    }
  }
);

// 监听数量变动
const changeCount = (res) => {
  emits("changeCount", res);
};

// 接口
const apiConfig = computed(() => {
  const detail = props.detail;

  // 菜品
  if (detail.goodsType == "DISHES") {
    return {
      hotSellingStatusApi: "fetchSettingDishesHotSellingStatus",
      mealSellOutStatusApi: "fetchSettingDishesSellOutStatus",
      mealShelvesStatus: "fetchSettingDishesShelvesStatus",
    };
  } else {
    return {
      hotSellingStatusApi: "fetchSettingSetMealHotSellingStatus",
      mealSellOutStatusApi: "fetchSettingSetMealSellOutStatus",
      mealShelvesStatus: "fetchSettingSetMealShelvesStatus",
    };
  }
});

// 更新菜品状态
const updateStatus = async (type, res) => {
  const { status, isSellOut, isHotSelling } = props.detail;
  const id = props.detail.goodsId;

  // console.log(type)
  // console.log(res)
  if (type == "status") {
    // 上架
    if (res == "ON_SHELVES") {
      if (isSellOut == "YES") {
        proxy.$message({
          message: proxy.$LANG_TEXT("该菜品暂无库存，无法上架"),
        });
        return;
      }
      dispatchProductApi({
        tips: "上架",
        fetchName: apiConfig.value.mealShelvesStatus,
        res: "ON_SHELVES",
        id,
        statusName: "status",
        call: () => {
          props.detail.status = res;
          props.detail.isSellOut = "NO";
        },
      });
    } else if (res == "OFF_SHELVES") {
      //下架
      dispatchProductApi({
        tips: "下架",
        fetchName: apiConfig.value.mealShelvesStatus,
        res: "OFF_SHELVES",
        id,
        statusName: "status",
        call: () => {
          props.detail.status = res;
          props.detail.isHotSelling = "NO";
        },
      });
    }
  } else {
    //热售

    if (type == "hotSale") {
      const result = isHotSelling == "YES" ? "NO" : "YES";

      dispatchProductApi({
        tips: "设置",
        fetchName: apiConfig.value.hotSellingStatusApi,
        res: result,
        id,
        statusName: "isHotSelling",
        call: () => {
          props.detail.isHotSelling = result;
        },
      });
    }
  }
};
// 调用更新菜品状态
const dispatchProductApi = async (params) => {
  const { tips, fetchName, res, id, statusName, call } = params;
  const resp = await proxy.$storeDispatch(fetchName, {
    id,
    [statusName]: res,
  });

  proxy.$message({
    type: "success",
    message: proxy.$LANG_TEXT(resp.message),
  });
  call();
};

// 点菜
// 判断 多规格、单规格
const showSpecBtn = computed(() => {
  const detail = props.detail;
  // 菜品类型 菜品、套餐
  const goodsType = detail.goodsType;
  // 菜品类型 单规格、多规格
  const specificationType = detail.specificationType;

  // 单操作
  if (specificationType == "SINGLE" && goodsType == "DISHES") {
    if (detail.dishesSpicesCount) {
      return true;
    } else {
      return false;
    }
  } else {
    //规格按钮
    return true;
  }
});

// 添加新菜品
const pushNewGoods = () => {
  if (props.productType == "eatFood") {
    emits("pushNew", props.detail);
  }
};

// 选择规格
const changeSpec = () => {
  if (props.productType == "eatFood") {
    emits("changeSpec", props.detail);
  }
};

// 点击整个菜品
const clickAllDishes = () => {
  console.log(showSpecBtn.value);
  if (showSpecBtn.value) {
    changeSpec();
  } else {
    pushNewGoods();
  }
};

// watch(props.detail, (nVal) => {
// 	console.log(nVal);
// });
</script>

<style lang="scss" scoped>
.product-card {
  width: 100%;
  height: 100%;
  //added background and border by zizhen guo
  background-color: #05d69d;
  border-radius: 10px;
  // 上架
  $putOn: #05d69d;
  // 下架
  $putOff: #ff9800;
  // 售罄
  $sellOut: #9e9e9e;
  // 热售
  $hotSale: #ff5722;

  // 更新菜品
  &.update {
    .product-box {
      display: grid;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;

      .product-status {
        border-radius: 10px;
        overflow: hidden;
        position: relative;

        // 顶部标签
        .status-bar {
          position: absolute;
          top: 0;
          padding: 3px 13px;
          font-size: 13px;
          color: white;
          border-top-left-radius: 5px;
          left: 0px;
          border-bottom-right-radius: 20px;
          padding-right: 15px;
          &.btn-on {
            background-color: $putOn;
          }
          &.btn-off {
            background-color: $putOff;
          }
          &.sell-out {
            background-color: $sellOut;
          }
          &.hot-sale {
            background-color: $hotSale;
          }
        }
      }

      .productInfo {
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-between;

        .title {
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: flex-start;
          .price {
            color: #ff4848;
            font-size: 18px;
            line-height: 40px;
          }
        }
        .bottom {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .tool-btn,
          .hot-sale {
            width: 80px;
            text-align: center;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            transition: 300ms;
            overflow: hidden;
            &:active {
              opacity: 0.8;
            }
          }

          .tool-btn {
            .btn-on {
              background-color: $putOn;
            }
            .btn-off {
              background-color: $putOff;
            }
            .sell-out {
              background-color: $sellOut;
            }
          }

          .hot-sale {
            &.YES {
              background-color: $hotSale;
            }
            &.NO {
              background-color: $sellOut;
            }
          }
        }
      }
    }
  }

  // 点菜
  &.eatFood {
    .product-box {
      .product-status {
        box-shadow: 1px 1px 5px 0px #c3c4c6;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        // 顶部标签
        .status-bar {
          position: absolute;
          top: 0;
          padding: 3px 13px;
          font-size: 13px;
          color: white;
          border-top-left-radius: 5px;
          left: 0px;
          border-bottom-right-radius: 20px;
          padding-right: 15px;
          &.btn-on {
            background-color: $putOn;
          }
          &.btn-off {
            background-color: $putOff;
          }
          &.sell-out {
            background-color: $sellOut;
          }
          &.hot-sale {
            background-color: $hotSale;
          }
        }
      }
      .title {
        // change font colour and position by zizhen guo
        font-size: 18px;
        //font-weight: bold;
        //margin: 5px 0;
        height: 40px;
        color: white;
        text-align: center;
        line-height: 40px;
      }
      .bottom {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;

        .price {
          color: #ff4848;
          font-size: 18px;
        }
        .tool {
          .change-spec {
            padding: 5px 15px;
            background-color: var(--el-color-primary);
            color: white;
            border-radius: 50px;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            max-width: 70px;

            &:active {
              opacity: 0.8;
            }

            span {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
}
</style>