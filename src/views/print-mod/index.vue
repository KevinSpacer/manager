<template>
  <div class="print-box">
    <!-- 左侧菜品列表 -->
    <div class="dishes-list">
      <!-- 购物车内容  非打印记录-->
      <div class="car-container" v-if="printTypeVal != 3">
        <!-- 标题头 -->
        <div class="table-theader">
          <p>{{ $LANG_TEXT("商品") }}</p>
          <p>{{ $LANG_TEXT("数量") }}</p>
          <p class="oneLineOver">{{ $LANG_TEXT("金额") }}</p>
        </div>

        <!-- 内容 -->
        <div class="content">
          <div class="table-list ml-scrollbar">
            <!-- 菜品 -->
            <div
              class="list-item"
              :class="{ 'split-item': item.showSplit }"
              v-for="(item, index) in addedToCart"
              :key="'car-item' + index"
            >
              <div
                class="show-split"
                :class="`type${printTypeVal}`"
                v-if="item.showSplit"
              >
                <el-button
                  v-if="printTypeVal == 1"
                  :label="index"
                  :type="`${item.select ? 'primary' : ''}`"
                  @click="selectGroup(item, !item.select)"
                >
                  {{ $LANG_TEXT("选择分组") }}({{ $LANG_TEXT("第")
                  }}{{ item.index + 1 }}{{ $LANG_TEXT("次点菜") }})
                </el-button>
              </div>
              <div class="show-item" @click.stop="selectDishe(item)" v-else>
                <!-- 菜品、套餐 -->
                <div class="first-item">
                  <div class="product-name">
                    <div class="check-item">
                      <div v-if="printTypeVal != 2">
                        <el-checkbox
                          checked
                          v-if="changeDisheIds.includes(item.shopId)"
                        />
                        <el-checkbox v-else />
                      </div>
                    </div>
                    <second-language
                      :firstText="item.name"
                      :secondText="item.nameLanguage || item.name"
                    ></second-language>
                  </div>
                  <div class="product-num">
                    <span>{{ item.goodsQuantity }}</span>
                  </div>
                  <div class="product-price">
                      ${{ (item.price * item.goodsQuantity || 0).toFixed(2) }}

                    <!-- 折扣 -->
                    <span>
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
                          (${{ item.discountPrice }})
                        <!-- (-{{ item.dishesDiscount }}%) -->
                      </span>
                      <!-- 定额 -->
                      <span
                        v-if="
                          item.dishesDiscountType == 'QUOTA' &&
                          Number(item.dishesDiscount)
                        "
                      >
                          (${{ item.discountPrice }})
                        <!-- (-${{ item.dishesDiscount }}) -->
                      </span>
                    </span>
                  </div>
                </div>

                <!-- 规格 -->
                <list-item
                  @handClick="selectDishe(item)"
                  :goodsDetail="item"
                ></list-item>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="router-view" v-else>
        <!-- 顶部功能 -->
        <div class="log-header">
          <p class="title">
            {{ $LANG_TEXT("打印记录列表") }}
          </p>

          <div class="tool">
            <ml-btn @submit="cleanPrintQueueRecord">
              {{ $LANG_TEXT("清除打印记录") }}
            </ml-btn>
            <el-button @click="refreshPrintLog">
              {{ $LANG_TEXT("刷新") }}
            </el-button>
          </div>
        </div>
        <router-view
          v-if="refreshPrintLogView"
          ref="printLogRef"
          @changePrint="showPrintLog"
        ></router-view>
      </div>
    </div>

    <div class="preview-box">
      <!-- 选项卡 -->
      <div class="print-type">
        <div
          @click="printTypeVal = item.value"
          class="type-item"
          :class="{ 'is-active': printTypeVal === item.value }"
          v-for="(item, index) in printTypes"
          :key="'type' + index"
        >
          {{ $LANG_TEXT(item.label) }}
        </div>
      </div>

      <!-- 预览区域 -->
      <div
        class="preview-area"
        :class="`preview${printTypeVal}`"
        v-if="changeDishes.length && printTypeVal != 3"
      >
        <!-- 打印后厨 -->
        <div class="chef" v-if="printTypeVal == 0">
          <div
            class="chef-item"
            v-for="(item, index) in changeDishes"
            :key="'ticket' + index"
          >
            <Ticket
              class="area-0"
              :isPrintOrder="true"
              :orderDetail="orderDetail"
              :goodsList="[item]"
            ></Ticket>
          </div>
        </div>
        <!-- 打印菜品 -->
        <div class="all-down" v-if="printTypeVal == 1">
          <div id="print-area">
            <Ticket
              :showLogo="true"
              :showOrder="true"
              :orderDetail="orderDetail"
              :goodsList="changeDishes"
            ></Ticket>
          </div>
        </div>
        <!-- 打印订单 -->
        <div class="all-down" v-if="printTypeVal == 2">
          <div id="print-area">
            <Ticket
              :isPrintOrder="true"
              :showLogo="true"
              :showOrder="true"
              :showPrice="true"
              :showTips="true"
              :orderDetail="orderDetail"
              :goodsList="changeDishes"
              :toolParams="toolForm"
            ></Ticket>
          </div>
        </div>
      </div>

      <!-- 缺省 -->
      <el-empty
        class="ml-empty"
        v-if="!changeDishes.length && printTypeVal != 3"
        :description="$LANG_TEXT('暂无数据')"
      />

      <!-- 打印记录 小票显示 -->
      <div class="print-log-type" v-if="printTypeVal == 3">
        <el-scrollbar height="100%">
          <ml-image :src="printLog.imageUrl"> </ml-image>
        </el-scrollbar>
      </div>

      <!-- 按钮 -->
      <div class="btn-box">
        <ml-btn
          size="large"
          class="big-btn"
          v-if="printTypeVal != 3"
          @submit="printData"
          >{{ $LANG_TEXT("打印") }}</ml-btn
        >
        <!-- <ml-btn size="large" class="big-btn" @submit="downLoadPrintLog" v-else>{{
          $LANG_TEXT("下载")
        }}</ml-btn> -->
      </div>
    </div>
  </div>
</template>
  
<script setup>
import Ticket from "./components/ticket.vue";
import html2canvas from "html2canvas";
import {
  ref,
  reactive,
  onMounted,
  watch,
  getCurrentInstance,
  computed,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import listItem from "../eat-food/components/list-item.vue";
import { orderTypeOpts } from "@/utils/options";

const { proxy } = getCurrentInstance();

const route = useRoute();
const routeQuery = reactive(route.query || {});
const router = useRouter();

const orderTypes = orderTypeOpts();

// 携带参数
const routeParams = reactive({
  orderId: "",
  id: "",
  serveDishesWay: proxy.$LANG_TEXT("无"),
  remark: proxy.$LANG_TEXT("无"),
  type: "",
  peopleQuantity: "",
  location: "",
  userName: "",
  contactWay: "",
  address: "",
  waiterName: "",
});

// 全局模块
const { mainModule } = proxy.$usePiniaModule();
// 已加入购物车
const addedToCart = ref([]);

// 基本信息
const baseConfigInfo = computed(() => mainModule.baseConfigInfo);

// 判空
const isEmpty = ["", undefined, null];

// 多功能表单
const toolForm = reactive({
  remark: "",
  // 折扣
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
  // 抹零
  notCount: {
    maLingMoney: "",
    maLingType: "NO",
    maLingText: "不抹",
  },
  // 服务费
  service: {
    serviceChargeType: "",
    serviceCharge: "",
  },
  // 小费
  tip: {
    payAmount: "",
    paymentMethodName: "",
    paymentMethodNameLanguage: "",
  },
  // 税率
  taxRate: 0,
  // 合单
  consolidated: {
    mainOrder: "",
    order: "",
  },
  // 分额
  partialPay: {
    amount: [],
    dividedNumber: 0,
  },
  // 取消订单原因
  cancelingOrder: "",
  // 免单原因
  freeChargeReason: "",
  // 免单金额
  freeChargePrice: "",
});

// 订单数据查询
// 数据
const stagingCarData = ref([]);
// 获取暂存购物单列表
const getTemporaryOrderShoppingList = async (id) => {
  try {
    const res = await proxy.$storeDispatch(
      "fetchGetTemporaryOrderShoppingList",
      id
    );
    const result = res.result;
    stagingCarData.value = result;

    setAddCarData(result);
  } catch (error) {}
};
// 数据
const orderCarData = ref([]);
// 获取订单购物单列表
const getOrderShoppingList = async (id) => {
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderShoppingList", id);
    const result = res.result;
    orderCarData.value = result;

    setAddCarData(result, "playOrder");
  } catch (error) {}
};

// 赋值添加购物车数据
const setAddCarData = (result, type) => {
  // 赋值添加购物车数据
  setTimeout(() => {
    const addedCarDataResult = result.reduce((add, curr, groupIndex) => {
      const addData = toAddedCarData(curr.goodsList, type);
      const split = {
        showSplit: true,
        select: false,
        data: addData,
        index: groupIndex,
      };

      if (curr.goodsList.length) {
        return [...add.concat([split, ...addData])];
      } else {
        return [...add.concat([...addData])];
      }
    }, []);
    const list = JSON.parse(JSON.stringify(addedCarDataResult));
    addedToCart.value.push(...list);
    // console.log(addedCarDataResult);
    console.log(addedToCart);
  });
};

//接口数据 转 加入购物车本地数据
const toAddedCarData = (list) => {
  return list.map((item) => {
    const {
      // 自定义菜品
      customDishes,
      // 调味品
      dishesSpicesList = [],
      // 自定义调味品
      customDishesSpicesList,
      // 菜品信息
      dishes = {},
      stockCount,
      goodsId,
      id,
      dishesDiscount,
      dishesDiscountType,
      goodsQuantity,
      goodsPrice,
      goodsType,
      // 套餐
      setMeal,
      status,
      remark,
      serveDishesWay,
    } = item;

    const result = {
      goodsId,
      shopId: id,
      goodsQuantity,
      goodsPrice,
      dishesDiscount,
      dishesDiscountType,
      isDiscount: (dishes || {}).isDiscount,
      isTaxRate: (dishes || {}).isTaxRate,
      price: goodsPrice,
      stockCount,
      goodsType,
      status,
      remark,
      serveDishesWay,
    };

    // 调味品
    result.dishesSpicesList = dishesSpicesList;
    // 自定义调味品
    result.customDishesSpicesList = customDishesSpicesList;

    // DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐
    if (goodsType == "DISHES") {
      // 赋值
      dishes.price = goodsPrice;
      Object.assign(result, dishes);
    } else if (goodsType == "CUSTOM_DISHES") {
      const obj = customDishes || {};
      result.name = obj.name;
      result.orderShoppingGoodsId = obj.orderShoppingGoodsId;
      result.orderShoppingId = obj.orderShoppingId;
      result.price = obj.price;
    } else if (goodsType == "SET_MEAL") {
      Object.assign(result, setMeal);
      result.specificationList = setMeal.setMealSpecificationList.map((d) => {
        const child = d.setMealSpecificationDishesList;
        d.setMealSpecificationDishesList = child.map((e) => {
          e.id = e.dishesId;
          return e;
        });
        return d;
      });
      // console.log(result)
      // .map((d) => {
      // d.dishesList = d.setMealSpecificationDishesList;
      // 	return d;
      // });
    }

    // 菜品、套餐
    if (goodsType == "DISHES" || goodsType == "SET_MEAL") {
      // 当前规格列表 子级参数名
      const currSpecChildName =
        goodsType == "DISHES"
          ? "dishesSpecificationAttributeList"
          : "setMealSpecificationDishesList";
      // 规格数据
      const sureCarData =
        goodsType == "DISHES"
          ? result.dishesSpecificationList || []
          : result.specificationList || [];
      // 规格ID
      const dataIds = sureCarData.reduce((add, curr, index) => {
        const childs = curr[currSpecChildName];
        add.push(curr.id);
        const ids = childs.map((item) => item.id);
        return add.concat(ids);
      }, []);
      // 规格ID
      const condmentDataIds = result.dishesSpicesList.reduce(
        (add, curr, index) => {
          const childs = curr.dishesSpicesAttributeList;
          add.push(curr.id);
          const ids = childs.map((item) => item.id);
          return add.concat(ids);
        },
        []
      );
      //本地使用 唯一标识
      result.skuId = `${result.goodsId}-${
        dataIds.join("-") + "-" + condmentDataIds.join("-")
      }`;
    }

    // 打折金额
    result.discountPrice = proxy.$sumDisheDiscountPrice(result)

    // console.log(result);
    return result;
  });
};

// 订单详情
const orderDetail = ref({});
// 根据ID查询订单详情
const getOrderIdDetail = async (id) => {
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderDetails", id);
    const result = res.result;

    // 订单
    if (result.discountType == "ORDER") {
      result.cashDiscountMoney = 0;
    } else {
      //现金
      result.orderDiscount = 0;
      result.orderDiscountType = "";
    }
    orderDetail.value = result;

    const params = {
      type: "",
      peopleQuantity: "",
      location: "",
      userName: "",
      contactWay: "",
      address: "",
      remark: "",
      serveDishesWay: "",
      waiterName: "",
      isInitiatePay: "",
    };
    for (let i in params) {
      routeParams[i] = result[i];
    }
    routeParams.id = id;
    routeParams.orderId = id;

    // 多功能表单
    toolForm.remark = result.remark;
    // 折扣
    toolForm.discount = {
      cashDiscountMoney: result.cashDiscountMoney,
      order: {
        orderDiscount: result.orderDiscount,
        orderDiscountType: result.orderDiscountType,
      },
      product: {
        dishesDiscount: "",
        dishesDiscountType: "",
      },
    };

    // 抹零
    // 抹零options
    const notCountOpts = {
      NO: proxy.$LANG_TEXT("不抹"),
      YUAN: proxy.$LANG_TEXT("抹元"),
      ANGLE: proxy.$LANG_TEXT("抹角"),
      POINTS: proxy.$LANG_TEXT("抹分"),
    };
    toolForm.notCount = {
      maLingMoney: result.maLingMoney,
      maLingType: result.maLingType,
      maLingText: notCountOpts[result.maLingType],
    };

    // 服务费
    toolForm.service = {
      serviceCharge: result.serviceCharge,
      serviceChargeType: result.serviceChargeType,
    };

    // 税率
    toolForm.taxRate = result.taxRate;

    console.log(toolForm);
  } catch (error) {}
};

// 明细列表
const payOrderList = ref([]);
// 查询订单明细
const getOrderAAPayDetail = async (id) => {
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", id);
    const result = res.result;
    payOrderList.value = result;
  } catch (error) {}
};

// 打印类型
// 展示
const printTypes = [
  {
    label: "打印后厨",
    value: 0,
  },
  {
    label: "打印菜品",
    value: 1,
  },
  {
    label: "打印订单",
    value: 2,
  },
  {
    label: "打印记录",
    value: 3,
  },
];
// 选择值
const printTypeVal = ref();
watch(
  () => printTypeVal.value,
  (nVal) => {
    console.log(nVal);
    if (nVal == 2) {
      changeDishes.value = JSON.parse(
        JSON.stringify(addedToCart.value.filter((d) => d.shopId))
      );
    } else {
      if (nVal == 3) {
        router.push({
          path: "/printLog",
          query: { orderId: routeParams.orderId },
        });
      } else {
        changeDishes.value = [];
      }
    }
    console.log(changeDishes.value);
  }
);

// 选择菜品
// ids
const changeDisheIds = computed(() => {
  return changeDishes.value.map((item) => item.shopId);
});
// 选择数据
const changeDishes = ref([]);

// 选择菜品
const selectDishe = (item) => {
  if (printTypeVal.value == 2 || printTypeVal.value == 3) {
    return;
  }
  const index = changeDishes.value.findIndex((d) => d.shopId == item.shopId);
  if (changeDisheIds.value.includes(item.shopId)) {
    changeDishes.value.splice(index, 1);
  } else {
    changeDishes.value.push(item);
  }
  console.log(changeDishes.value);
};

// 选择分组
const selectGroup = (group, isCheck) => {
  console.log(group.data);

  console.log(isCheck);
  const ids = group.data.map((d) => d.shopId);
  if (isCheck) {
    const result = changeDishes.value.length
      ? group.data.filter((d) => !changeDishes.value.includes(d.shopId))
      : group.data;

    console.log(ids);
    console.log(result);
    console.log(changeDishes.value);

    changeDishes.value.push(...result);
  } else {
    changeDishes.value = changeDishes.value.filter(
      (d) => !ids.includes(d.shopId)
    );
  }
  group.select = !group.select;
  console.log(changeDishes.value);
};

// 打印数据
const printData = async (call) => {
  if (!changeDishes.value.length) {
    proxy.$message.warning(proxy.$LANG_TEXT("请先选择菜品"));
    call();
    return;
  }

  try {
    // 后厨
    if (printTypeVal.value == 0) {
      const areaDoms = document.querySelectorAll(".area-0");
      const canvasUrl = [];
      for (let i = 0; i < areaDoms.length; i++) {
        const dom = areaDoms[i];
        canvasUrl.push(await getHtmk2canvas(dom));
      }
      const files = await uploadImage(canvasUrl);

      const addKitchenPrintList = [];
      for (let i = 0; i < changeDishes.value.length; i++) {
        const file = files.files[i];
        const fileName = file.name;
        const item = changeDishes.value[i];
        addKitchenPrintList.push({
          fileName,
          shoppingGoodId: item.shopId,
        });
      }

      try {
        await proxy.$storeDispatch("fetchAddKitchenPrint", addKitchenPrintList);
        call();
        proxy.$message.success(proxy.$LANG_TEXT("已加入打印队列"));
      } catch (error) {
        call();
      }
    } else {
      // 打印记录
      if (printTypeVal.value == 3) {
      } else {
        const api = {
          1: "fetchAddDishesPrint",
          2: "fetchAddOrderPrint",
        };
        html2canvas(document.querySelector("#print-area"), {
          useCORS: true,
        }).then(async (canvas) => {
          const downUrl = canvas.toDataURL("image/png", 1.0);

          const files = await uploadImage([downUrl]);
          const [file] = files.files;
          try {
            await proxy.$storeDispatch(api[printTypeVal.value], {
              fileName: file.name,
            });
            call();
            proxy.$message.success(proxy.$LANG_TEXT("已加入打印队列"));
          } catch (error) {
            call();
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    call();
  }
};

// 获取
const getHtmk2canvas = (dom) => {
  return new Promise((resolve, resject) => {
    html2canvas(dom, {
      useCORS: true,
    }).then(async (canvas) => {
      const downUrl = canvas.toDataURL("image/png", 1.0);
      resolve(downUrl);
    });
  });
};

// 上传图片
const uploadImage = async (downUrls) => {
  const formdata = new FormData();
  formdata.append("folder", "PRINTED_BILL");
  formdata.append("sourceId", baseConfigInfo.value.id);
  formdata.append("sourceType", "manage");

  for (let i = 0; i < downUrls.length; i++) {
    const downUrl = downUrls[i];
    const files = proxy.$dataURLtoFile(downUrl, "print.png");
    formdata.append("files", files);
  }

  const res = await proxy.$storeDispatch("fetchUploadImage", formdata);
  const result = res.result;
  // const [file = {}] = result.files;
  return result;
};

// 打印记录
const printLog = reactive({
  imageUrl: "",
});
const showPrintLog = (res) => {
  proxy.$updateParams(printLog, res);
};

// 下载打印记录图片
const downLoadPrintLog = () => {
  proxy.$downLoadFile({
    href: printLog.imageUrl,
    download: proxy.$LANG_TEXT("打印记录"),
  });
};

// 刷新打印记录列表
// ref
const printLogRef = ref();

const refreshPrintLogView = ref(true);
const refreshPrintLog = () => {
  refreshPrintLogView.value = false;
  nextTick(() => {
    refreshPrintLogView.value = true;
  });
};

// 删除打印记录
const cleanPrintQueueRecord = async (call) => {
  try {
    await proxy.$storeDispatch("fetchCleanPrintQueueRecord");
    refreshPrintLog();
    call();
  } catch (error) {
    call();
  }
};

// 监听返回
watch(()=>proxy.$route.path,(nVal,old)=>{
  if(old == '/printLog'){
    router.go(-1)
  }
})
console.log(proxy.$route.path)

onMounted(async () => {
  const id = routeQuery.orderId;

  await getOrderIdDetail(id);
  await getTemporaryOrderShoppingList(id);
  await getOrderShoppingList(id);
  await getOrderAAPayDetail(id);

  printTypeVal.value = Number(routeQuery.type || 0);
});
</script>
  
  <style lang="scss" scoped>
$grayColor: #fdfdfd;
.print-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  user-select: none;
  overflow: hidden;

  .dishes-list {
    height: 100%;
    overflow: hidden;
    .car-container {
      height: calc(100% - 15px);
      display: grid;
      grid-template-rows: 43px 1fr;
      overflow: hidden;
      padding: 10px;
      box-sizing: border-box;

      .table-theader {
        display: grid;
        grid-template-columns: 1fr 120px 150px;
        border: 1px solid #f5f7fa;
        justify-items: center;
        border-radius: 10px;
        padding: 10px 0;

        p {
          width: 100%;
          text-align: center;

          &:nth-last-child(1) {
            text-align: left;
          }
        }
      }

      .content {
        box-shadow: 0px 2px 10px 0px #0000001a;
        border-radius: 10px;
        overflow: hidden;

        .table-list {
          height: 100%;
          font-size: 15px;
          overflow-y: auto;
          padding-bottom: 15px;
          box-sizing: border-box;
          .list-item {
            padding-top: 10px;
            transition: 300ms;
            .el-checkbox {
              height: 20px;
            }
            &.split-item {
              padding: 0;
              margin-top: 10px;
            }

            &:nth-child(1) {
              .show-split {
                border: none;
                padding: 0;
              }

              &.split-item {
                margin-top: 0;
              }
            }

            .show-split {
              border-top: 1px dashed #d1dbe5;
              // margin-top: 10px;
              padding: 10px 0;
              padding-bottom: 0;
              &.type0 {
                padding: 0px;
              }
              &.type1 {
                padding-top: 10px;
                padding-left: 10px;
              }
            }

            .first-item {
              display: grid;
              flex-direction: row;
              flex-wrap: nowrap;
              grid-template-columns: 1fr 120px 150px;
              justify-items: center;
              align-items: center;
            }

            .product-name {
              width: 100%;
              overflow: hidden;
              padding-left: 10px;
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 600;
              display: grid;
              grid-template-columns: auto 1fr;
              align-items: center;
              //   height: 40px;
              //   line-height: 40px;
              .check-item {
                margin-right: 6px;
              }
            }

            .product-status {
              font-size: 13px;
            }
            .product-price {
              width: 100%;
              > span {
                font-size: 14px;
                margin-left: 5px;
                .icon-discount {
                  font-size: 14px;
                }
              }
            }

            &.active {
              background-color: #8080800f;
            }
          }
        }

        .goods-detailed {
          line-height: 30px;
          font-size: 14px;
          padding-left: 15px;

          .total-price {
            font-weight: bold;
            span {
              color: red;
            }
          }
        }

        .down-log {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          justify-items: center;
          padding: 10px 0;
          border-top: 1px solid #f5f7fa;

          &.log2 {
            grid-template-columns: 1fr 1fr 280px;
          }

          &.log3 {
            display: flex;
            padding: 10px;
          }
        }
      }
    }

    .router-view {
      height: 100%;
      overflow: hidden;
      width: fit-content;
      margin: 0 auto;

      .log-header {
        padding: 0 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .title {
          font-size: 16px;
          font-weight: bold;
          margin-right: 10px;
        }
      }
    }
  }

  .preview-box {
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    // 选项卡
    .print-type {
      display: flex;
      margin: 10px 0;
      justify-content: center;

      .type-item {
        font-size: 14px;
        padding: 8px 15px;
        border-radius: 6px;
        margin: 0 10px;
        transition: 300ms;

        &.is-active {
          background-color: #05d69d;
          color: white;
        }
      }
    }

    // 区域
    .preview-area {
      box-sizing: border-box;
      width: fit-content;
      margin: 0 auto;
      height: fit-content;
      overflow-y: auto;
      max-height: 100%;
      &::-webkit-scrollbar {
        display: none;
      }

      &.preview1,
      &.preview2 {
      }

      .all-down {
        border: 1px solid #d1dbe5;
      }

      #print-area,
      .chef {
        width: 500px;
        margin: auto;
      }

      .chef {
        > div {
        }
      }

      > div {
        > div {
          // border: 1px solid #d1dbe5;
          margin-bottom: 20px;
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
      }
    }

    .print-log-type {
      width: 500px;
      margin: 0 auto;
      height: 100%;
      overflow: hidden;
      .ml-image {
        box-sizing: border-box;
        border: 1px solid #d1dbe5;
        height: auto !important;
      }
    }

    .btn-box {
      text-align: center;
      margin: 10px 0;

      .big-btn {
        font-size: 18px;
        padding: 8px 40px;
      }
    }
  }
}
</style>

<style lang="scss">
.chef-item {
  border: 1px solid #d1dbe5;
  &:nth-child(1) {
    margin-bottom: 0;
  }
  .ticket-box {
    &.area-0 {
    }
  }
}

.print-log-list,
.preview-box {
  .el-scrollbar__thumb {
    display: none;
  }
}
</style>
  