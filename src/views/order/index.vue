<template>
  <div class="order-container">
    <!-- 顶部筛选层 -->
    <div class="header-filter-box">
      <el-form :inline="false">
        <el-form-item>
          <el-radio-group v-model="dateVal" size="large">
            <el-radio-button
              :label="index + 1"
              v-for="(item, index) in dateOps"
              :key="'item' + item.label"
              >{{ $LANG_TEXT(item) }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$LANG_TEXT('订单状态')">
          <el-radio-group v-model="filterParams.status" size="large">
            <el-radio-button
              :label="item.value"
              v-for="item in orderStatusOpts"
              :key="'item' + item.label"
            >
              {{ $LANG_TEXT(item.label) }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$LANG_TEXT('订单类型')">
          <el-radio-group v-model="filterParams.type" size="large">
            <el-radio-button
              :label="item.value"
              v-for="item in orderTypeOpts"
              :key="'item' + item.label"
            >
              {{ $LANG_TEXT(item.label) }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$LANG_TEXT('服务员')">
          <layz-select
            clearable
            ref="waiterNameRef"
            filterName="waiterName"
            storeDispatchName="fetchGetOrderWaiterPageList"
            :placeholder="$LANG_TEXT('服务员')"
            :selectProps="{ labelKey: 'waiterName', valueKey: 'waiterName' }"
            v-model="filterParams.waiterName"
          >
            <template #default="{ data }">
              <div>
                <el-option
                  v-for="(item, index) in data.result"
                  :key="'options' + index"
                  :label="item[data.props.labelKey]"
                  :value="item[data.props.valueKey]"
                >
                  <div class="line-item">
                    <span>{{ $LANG_TEXT(item[data.props.labelKey]) }}</span>
                    <span>{{ $LANG_TEXT(waiterType[item.waiterType]) }}</span>
                  </div>
                </el-option>
              </div>
            </template>
          </layz-select>
        </el-form-item>
        <el-form-item :label="$LANG_TEXT('日期')" v-if="dateVal == 2">
          <el-date-picker
            clearable
            v-model="currDateTime"
            type="date"
            :placeholder="$LANG_TEXT('日期')"
          />
        </el-form-item>
        <el-form-item :label="$LANG_TEXT('时间')" v-if="dateVal == 2">
          <el-date-picker
            v-model="chooseDate"
            type="datetimerange"
            :start-placeholder="$LANG_TEXT('开始时间')"
            :end-placeholder="$LANG_TEXT('结束时间')"
            :default-time="defaultDate"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="container">
      <div class="left">
        <!-- 订单列表 -->
        <div class="order-list" v-if="orderList.length">
          <div
            class="order-item"
            v-for="item in orderList"
            :key="'order' + item.id"
            @click="navigateTo(item)"
          >
            <div class="top-info">
              <div class="line-1 item">
                <div class="number">
                  <span v-if="item.daySerialNo">#{{ item.daySerialNo }}</span>
                  <p v-else>
                    <span class="staging-text" v-if="item.status == 'AWAIT'">{{
                      $LANG_TEXT("暂存订单")
                    }}</span>
                    <span v-if="item.status == 'UNDER_WAY'">{{
                      $LANG_TEXT("进行中")
                    }}</span>
                    <span v-if="item.status == 'FINISH'">{{
                      $LANG_TEXT("已完成")
                    }}</span>
                    <span v-if="item.status == 'CANCELED'">{{
                      $LANG_TEXT("已取消")
                    }}</span>
                  </p>
                </div>
                <div class="date">{{ item.showTime }}</div>
              </div>

              <div class="line-2 item">
                <div class="type">
                  {{
                    $LANG_TEXT(
                      orderTypeOpts.find((d) => d.value == item.type).label
                    )
                  }}
                </div>
                <div class="price">：${{ item.actuallyPaidMoney || 0 }}</div>
              </div>
              <div class="line-3 item" v-if="item.location">
                <div class="seat">
                  {{ $LANG_TEXT("座位") }}：{{ item.location || "" }}
                </div>
              </div>

              <div class="line-3 item">
                <div class="people" v-if="item.peopleQuantity">
                  {{ $LANG_TEXT("人数") }}：{{ item.peopleQuantity }}
                </div>
              </div>
            </div>

            <div class="staff">
              {{ $LANG_TEXT("服务员") }}：{{ item.waiterName }}
            </div>
          </div>
        </div>

        <!-- 缺省 -->
        <div class="empty" v-else>
          {{ $LANG_TEXT("暂无订单") }}
        </div>

        <div class="pager">
          <el-pagination
            @next-click="(e) => (pageParams.pageNum = e)"
            @prev-click="(e) => (pageParams.pageNum = e)"
            @current-change="(e) => (pageParams.pageNum = e)"
            :page-size="20"
            background
            layout="prev, pager, next"
            :total="pageParams.total"
          />
        </div>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, reactive, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const eatFoodModule = proxy.$usePiniaModule("eatFoodModule");

// 日期
const dateOps = ["今日订单", "全部订单"];
const dateVal = ref();

watch(
  () => dateVal.value,
  (nVal) => {
    // 今日订单
    if (nVal == 1) {
      dateTime.value = proxy.$timeSpToDate(Date.now());
    } else {
      dateTime.value = "";
      currDateTime.value = "";
    }
    getOrderList();
  }
);
// 当前日期
const currDateTime = ref();
watch(
  () => currDateTime.value,
  (nVal) => {
    filterParams.dateTime = nVal ? proxy.$timeSpToDate(nVal) : "";
  }
);
// 日期
const dateTime = ref();
watch(
  () => dateTime.value,
  (nVal) => {
    filterParams.dateTime = nVal || "";
  }
);

// 订单状态
const orderStatusOpts = [
  {
    label: proxy.$LANG_TEXT("全部"),
    value: "",
  },
  {
    label: proxy.$LANG_TEXT("暂存订单"),
    value: "AWAIT",
  },
  {
    label: proxy.$LANG_TEXT("未支付"),
    value: "UNDER_WAY",
  },
  {
    label: proxy.$LANG_TEXT("已支付"),
    value: "FINISH",
  },
  {
    label: proxy.$LANG_TEXT("已取消"),
    value: "CANCELED",
  },
];

// 订单类型
const orderTypeOpts = [
  {
    label: proxy.$LANG_TEXT("全部"),
    value: "",
  },
  {
    label: proxy.$LANG_TEXT("堂食"),
    value: "EAT_IN",
  },
  {
    label: proxy.$LANG_TEXT("外卖"),
    value: "TAKE_OUT",
  },
  {
    label: proxy.$LANG_TEXT("等取"),
    value: "TAKE_FOOD",
  },
];

// 筛选参数
const filterParams = reactive({
  status: orderStatusOpts[0].value,
  type: orderTypeOpts[0].value,
  creationStartTime: "",
  creationEndTime: "",
  waiterName: "",
  dateTime: "",
});
watch(filterParams, (nVal) => {
  pageParams.pageNum = 1;
  getOrderList();
});
// 分页参数
const pageParams = reactive({
  total: 0,
  pageSize: 20,
  pageNum: 1,
});
watch([() => pageParams.pageNum, () => pageParams.pageSize], () => {
  getOrderList();
});

// 选择时间
const chooseDate = ref([]);
watch(
  () => chooseDate.value,
  (nVal) => {
    const [startTime = "", endTime = ""] = (nVal || []).map((item, index) => {
      const stNum = new Date(item).getTime();
      return proxy.$timeSpToDate(stNum, index);
    });

    filterParams.creationStartTime = startTime;
    filterParams.creationEndTime = endTime;
  }
);
// 默认时间
const defaultDate = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
];

// ref
const waiterNameRef = ref();
// 类型
const waiterType = {
  MANAGE_USER: proxy.$LANG_TEXT("经理"),
  STAFF_USER: proxy.$LANG_TEXT("员工"),
};

// 订单列表
const orderList = ref([]);
// 查询订单列表
const getOrderList = async () => {
  setTimeout(async () => {
    try {
      const res = await proxy.$storeDispatch("fetchGetOrderList", {
        ...pageParams,
        ...filterParams,
      });
      const result = res.result;
      orderList.value = result.map((item) => {
        const [year = "", hms = ""] = (item.creationTime || "").split(" ");

        item.showTime = `${year.split("-").reverse().join("/")} ${hms}`;
        return item;
      });
      pageParams.total = res.total;
    } catch (error) {}
  });
};

// 跳转
const navigateTo = (item) => {
  // 重置
  eatFoodModule.addedToCart = [];
  eatFoodModule.chooseOrderType = "";

  // 已支付 || 已完成 || 已取消
  if (
    item.initiatePayStatus == "YES_PAY" ||
    item.status == "FINISH" ||
    item.status == "CANCELED"
  ) {
    proxy.$navigateTo("/orderDetail", {
      orderId: item.id,
    });
  } else {
    proxy.$navigateTo("/eatFood", {
      orderId: item.id,
    });
  }
};

// 初始订单列表
const orderInit = () => {
  dateVal.value = 1;
  getOrderList();
};

onMounted(() => {
  waiterNameRef.value.getSelectList("info");
  orderInit();
});
</script>

<style lang="scss" scoped>
.order-container {
  padding: 15px;
  padding-top: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  box-sizing: border-box;
  .header-filter-box {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    .el-form {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 10px;
        margin-bottom: 10px;

        &:nth-child(1) {
          margin-left: 0;
        }

        .line-item {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 0;
    .left {
      background-color: #fcfcfc;
      border-radius: 10px;
      padding: 0 15px;
      display: grid;
      grid-template-rows: 1fr 40px;

      .order-list {
        display: grid;
        flex-direction: row;
        flex-wrap: wrap;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(5, 180px);
        height: 100%;

        .order-item {
          padding: 5px;
          width: 85%;
          height: auto;
          background-color: white;
          border-radius: 10px;
          margin: auto;
          box-shadow: 0px 0px 10px 0px #9e9e9e26;
          overflow: hidden;
          max-height: 100%;
          min-height: 85%;
          display: grid;
          grid-template-rows: 1fr auto;

          .item {
            display: grid;
            margin: 2px 0;
            flex-direction: row;
            justify-content: space-between;
            grid-template-columns: auto 1fr;
            align-items: center;
            font-size: 14px;
            .number {
              font-size: 14px;
              font-weight: 700;
            }

            > span {
              margin-right: 10px;
            }
            .staging-text {
              color: #f44336;
              font-size: 14px;
            }
            .date {
              text-align: right;
              font-size: 14px;
            }
            .seat {
              margin-right: 5px;
            }
          }

          .staff {
            min-width: 60%;
            text-align: center;
            color: white;
            background-color: #05d69d;
            border-radius: 30px;
            margin: 5px auto;
            padding: 5px 10px;
            font-size: 13px;
            width: fit-content;
          }
        }
      }

      .empty {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

<style lang="scss">
.el-select-dropdown__item {
  .line-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
