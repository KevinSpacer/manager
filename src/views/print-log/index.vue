
<template>
  <div class="print-log-box">
    <!-- 票子列表 -->
    <div class="print-log-list">
      <el-scrollbar height="100%" class="scroll-list">
        <div
          :infinite-scroll-immediate="false"
          v-infinite-scroll="getPrintQueueRecordPageList"
        >
          <div
            class="print-info"
            :class="`${item.id == changeLogNo ? 'is-active' : ''} ${
              printStatusClass[item.status]
            }`"
            v-for="(item, index) in logList"
            :key="'print' + index"
            @click.stop="selectLog(item)"
          >
            <p class="title">{{ item.printerId }}</p>
            <p class="info">
              <span>{{ $LANG_TEXT("打印类型") }}：</span>
              <span>{{ $LANG_TEXT(printType[item.type]) }}</span>
            </p>
            <p class="info">
              <span>{{ $LANG_TEXT("打印描述") }}：</span>
              <span>{{ item.describe }}</span>
            </p>
            <p class="info status">
              <span>{{ $LANG_TEXT(printStatus[item.status]) }}</span>
            </p>
            <p class="info">
              <span>{{ $LANG_TEXT("创建时间") }}：</span>
              <span>{{ item.creationTime }}</span>
            </p>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 预览区域 -->
    <div class="preview-area" v-if="false">
      <el-scrollbar wrap-class="scroll-worp" height="100%">
        <ml-image
          :previewSrcList="[printInfo.imageUrl]"
          :src="printInfo.imageUrl"
          v-if="printInfo.imageUrl"
        ></ml-image>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  getCurrentInstance,
  computed,
  nextTick,
} from "vue";

const { proxy } = getCurrentInstance();

const emits = defineEmits(["changePrint"]);

// 列表参数
const listParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 记录列表
const logList = ref([]);

// 选择记录值
const changeLogNo = ref();
watch(
  () => changeLogNo.value,
  (nVal) => {
    getPrintTaskImg();
  }
);

const currList = ref([]);

// 是否 禁用scroll
const scrollDisabled = computed(() => {
  return !currList.value.length && !logList.value.length;
});

// 获取打印记录
const getPrintQueueRecordPageList = async (requestType = "load") => {
  // console.log(requestType);
  // console.log(scrollDisabled.value);
  if (requestType == "info") {
    listParams.pageNum = 1;
  } else {
    listParams.pageNum += 1;
  }

  try {
    const res = await proxy.$storeDispatch(
      "fetchGetPrintQueueRecordPageList",
      listParams
    );
    const result = res.result;
    currList.value = result;

    if (!result.length) {
      listParams.pageNum -= 1;
      return;
    }

    if (requestType == "load") {
      logList.value.push(...result);
    } else {
      logList.value = result;
      changeLogNo.value = (result[0] || {}).id || "";
    }
  } catch (error) {
    listParams.pageNum -= 1;
  }
};

// 票据参数
const printInfo = reactive({
  imageUrl: "",
  tag: "",
});
// 获取打印票据
const getPrintTaskImg = async () => {
  if (!changeLogNo.value) {
    return;
  }
  const item = logList.value.find((d) => d.id == changeLogNo.value) || {};
  // console.log(changeLogNo.value);
  // console.log(item);
  proxy.$updateParams(printInfo, item);
  emits("changePrint", printInfo);
};

// 选择
const selectLog = (item) => {
  // console.log(item);
  changeLogNo.value = item.id;
};

// 类型
// 打印状态
const printStatus = {
  AWAIT: "等待打印",
  UNDER_WAY: "正在打印",
  SUCCESS: "打印成功",
  FAILURE: "打印失败",
}; // 打印状态className
const printStatusClass = {
  AWAIT: "await",
  UNDER_WAY: "online",
  SUCCESS: "finish",
  FAILURE: "error",
};
// 打印类型
const printType = {
  KITCHEN: "后厨打印",
  DISHES: "菜品打印",
  ORDER: "订单打印",
};

// 传输图片
const transmissionImage = (name) => {};

const init = async () => {
  await getPrintQueueRecordPageList("info");
  await getPrintTaskImg();
};

onMounted(async () => {
  init();
});

defineExpose({
  init,
});
</script>

<style lang="scss" scoped>
.print-log-box {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;

  .print-log-list {
    height: 100%;
    overflow-y: auto;
    .scroll-list {
      .print-info {
        width: calc(100% - 40px);
        padding: 10px;
        font-size: 14px;
        border-radius: 10px;
        box-shadow: 1px 1px 5px 0px #00000026;
        margin: 10px;
        margin-bottom: 15px;
        position: relative;

        &.is-active {
          background-color: #c4c4c47a;
        }

        &:last-nth-child(1) {
          margin-bottom: 0;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .info {
          line-height: 26px;
          &.status {
            position: absolute;
            top: 45px;
            right: 30px;
            font-weight: bold;
            font-size: 16px;
          }
        }
        &.await {
          .info {
            &.status {
              color: #ff9800;
            }
          }
        }
        &.online {
          .info {
            &.status {
              color: #05d69d;
            }
          }
        }
        &.finish {
          .info {
            &.status {
              color: #05d69d;
            }
          }
        }
        &.error {
          .info {
            &.status {
              color: #ff5722;
            }
          }
        }
      }
    }
  }

  .preview-area {
    overflow-y: auto;
    width: 95%;
    margin: 0 auto;
    // height: 100%;

    .ml-image {
      border: 1px solid #d1dbe5;
    }
  }
}
</style>