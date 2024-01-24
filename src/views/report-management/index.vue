

<template>
  <div class="report-container" id="report-container">
    <div class="top-header">
      <p class="title">
        {{ $LANG_TEXT("报表统计") }}
      </p>
      <div class="daterange">
        <label for="start">Start date:</label>
        <el-input type="datetime-local" v-model="currDateTime.startTime"></el-input>
        <label for="start">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;End date:</label>
        <el-input type="datetime-local" v-model="currDateTime.endTime"></el-input>
        <button @click="calculate">提交</button>
      </div>
      <div class="btn">
        <ml-btn type="primary" size="large" @submit="print">{{
          $LANG_TEXT("打印")
        }}</ml-btn>
      </div>
    </div>

    <div class="body" id="print-content">
      <div class="table-box">
        <div class="header">
          <div class="th">{{ $LANG_TEXT("方式") }}</div>
          <div class="th">{{ $LANG_TEXT("金额") }}</div>
          <div class="th">{{ $LANG_TEXT("订单") }}</div>
        </div>
        <div
          class="container"
          v-if="orderPayStatistics.length || orderPayStatistics.length"
        >
          <!-- 订单支付类型统计 -->
          <div v-if="orderPayStatistics.length">
            <div class="tr-box">
              <div class="tr" v-for="d in orderPayStatistics" :key="d.name">
                <div class="td">
                  <second-language
                    :firstText="d.name"
                    :secondText="d.nameLanguage"
                  ></second-language>
                </div>
                <div class="td">${{ d.money }}</div>
                <div class="td">{{ d.allCount }}</div>
              </div>
            </div>
          </div>

          <div v-if="orderMoneyStatistics.length">
            <div class="tr-box">
              <div class="tr" v-for="d in orderMoneyStatistics" :key="d.name">
                <div class="td">{{ $LANG_TEXT(d.name) }}</div>
                <div class="td">${{ d.money }}</div>
                <div class="td">{{ d.allCount }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty" v-else>
          {{ $LANG_TEXT("暂无数据") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive } from "vue";
import html2canvas from "html2canvas";

const { proxy } = getCurrentInstance();

// 当前时间
const currDateTime = reactive({
  startTime:proxy.$timeSpToDate(Date.now(), 0),
  endTime:proxy.$timeSpToDate(Date.now(), 1)
});
// 重新计算用户选择的时间
const calculate = () => {
  getSelectOrderPayStatistics();
  getSelectOrderMoneyStatistics();
  return;
};
// 订单支付方式统计
const orderPayStatistics = ref([]);
// 查询 获取订单支付方式统计
const getSelectOrderPayStatistics = async () => {
  try {
    const res = await proxy.$storeDispatch(
      "fetchSelectOrderPayStatistics",
      currDateTime
    );
    const result = res.result;

    orderPayStatistics.value = result;
    // console.log(result);
  } catch (error) {
    // console.log(error);
  }
};

// 获取订单金额统计
const orderMoneyStatistics = ref([]);
// 查询 获取订单金额统计
const getSelectOrderMoneyStatistics = async () => {
  try {
    const res = await proxy.$storeDispatch(
      "fetchSelectOrderMoneyStatistics",
      currDateTime.value
    );
    const result = res.result;

    orderMoneyStatistics.value = result;
    // console.log(result);
  } catch (error) {
    // console.log(error);
  }
};

// 打印

const print = (call) => {
  const dom = document.querySelector("#report-container");
  html2canvas(dom).then((canvas) => {
		const downUrl = canvas.toDataURL('image/png',1.0)

		const a = document.createElement('a')
		a.download = `${proxy.$timeSpToDate(Date.now())}`
		a.href = downUrl
		a.click()
		a.remove()
    call();
  });
};

onMounted(async () => {
  await getSelectOrderPayStatistics();
  await getSelectOrderMoneyStatistics();
});
</script>

<style lang="scss" scoped>
.report-container {
  display: grid;
  grid-template-rows: 122px 1fr;
  .top-header {
    text-align: center;
    position: relative;
    .title {
      font-size: 55px;
      font-weight: bold;
    }
    .daterange {
      padding-top: 20px;
      padding-left: 200px;
      padding-right: 200px;
      font-size: 20px;
      line-height: 30px;
      display: grid;
      grid-template-columns: auto auto auto auto auto;
    }
    .btn {
      width: auto;
      position: absolute;
      right: 30px;
      top: 20px;
      .el-button {
        width: 120px;
        height: 40px;
      }
    }
  }

  .body {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;

    .table-box {
      width: 80%;
      flex-direction: column;
      flex-wrap: nowrap;
      display: flex;
      align-items: center;
      .header,
      .tr-box {
        border-bottom: 1px solid #c4c4c4;
        padding: 10px 0;
      }
      .header,
      .tr {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        .th {
          font-size: 25px;
        }
        .td {
          font-size: 20px;
          line-height: 50px;
        }
        > .th,
        > .td {
          &:nth-child(2) {
            text-align: center;
          }
          &:nth-child(3) {
            text-align: right;
          }
        }
      }

      .container {
        width: 100%;
        .tr-box {
          width: 100%;
        }
      }

      .empty {
        line-height: 280px;
      }
    }
  }
}
</style>