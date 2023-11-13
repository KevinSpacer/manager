<template>
  <div class="update-food-box">
    <div class="left-container">
      <!-- 选项卡 -->
      <sortable-box domId="tabBox" @changeList="leftTabChange">
        <div id="tabBox" class="tab-list ml-scrollbar">
          <!-- data-id数据将会在排序改变后在事件changeList返回 -->
          <view
            class="list-item"
            :class="{ active: firtstChooseId == item.id }"
            v-for="item in firstClassify"
            :key="item.label"
            :data-id="item.id"
            @click="changeFirstClassify(item)"
          >
            <second-language
              :firstText="item.name"
              :secondText="item.nameLanguage"
            ></second-language>
          </view>
        </div>
      </sortable-box>
    </div>
    <div class="right-container">
      <sortable-box domId="combinationBox" @changeList="rightCombinationSort">
        <view id="combinationBox" class="ml-scrollbar">
          <!-- 组合 -->
          <view
            class="combination"
            v-for="item in combinationList"
            :key="'comb' + item.id"
            :data-id="item.id"
          >
            <!-- 组合标题 -->
            <div class="title">
              <second-language
                :firstText="item.name"
                :secondText="item.nameLanguage"
              ></second-language>
            </div>

            <!-- 菜品列表 -->
            <sortable-box
              :domId="'product-list' + item.id"
              @changeList="rightProductSort($event, item.id)"
            >
              <div :id="'product-list' + item.id" class="product-list">
                <view
                  class="product-item"
                  v-for="item in item.goodsList"
                  :key="'product' + item.goodsId"
                  :data-id="item.goodsId"
                >
                  <Product :detail="item" />
                </view>
              </div>
            </sortable-box>
          </view>
        </view>
      </sortable-box>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from "vue";
import Product from "@/components/product.vue";
import sortableBox from "@/components/sortable-renderjs/index.vue";

const { proxy } = getCurrentInstance();

// 分页数据
const pageParams = reactive({
  pageSize: 15,
  pageNum: 1,
});

// 分类选项卡
const firstClassify = ref([]);
// 分类选项卡 选中值
const firtstChooseId = ref("");
watch(
  () => firtstChooseId.value,
  (nVal) => {
    getClassifyIdProduct();
  }
);

// 组合菜品列表数据
const combinationList = ref([]);
// 组合菜品列表参数
const listParams = reactive({
  total: 0,
});

// 查询分类列表
const getClassifyList = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetUpdateDishesClassifyList");
    const result = res.result;
    // console.log(result);
    firstClassify.value = result;

    if (result.length) {
      firtstChooseId.value = (result[0] || {}).id;
    }
  } catch (error) {}
};

// 根据分类查询 组合菜品列表
const getClassifyIdProduct = async () => {
  const classifyId = firtstChooseId.value;
  console.log(classifyId);
  try {
    const res = await proxy.$storeDispatch(
      "fetchGetUpdateDishesClassifyCombineList",
      classifyId
    );
    const result = res.result;
    // console.log(result);
    listParams.total = res.total;
    combinationList.value = result;
  } catch (error) {}
};

// 选择一级分类
const changeFirstClassify = (item) => {
  firtstChooseId.value = item.id;
};

// 排序
// 左侧选项卡拖动排序
const leftTabChange = (res) => {
  const classifyIds = res.map((item) => Number(item));
  proxy.$storeDispatch("fetchSettingCustomSortClassify", classifyIds);
};
// 右侧组合排序
const rightCombinationSort = (res) => {
  const classifyCombineIds = res.map((item) => Number(item));
  proxy.$storeDispatch(
    "fetchSettingCustomSortClassifyCombine",
    classifyCombineIds
  );
};
// 右侧菜品排序
const rightProductSort = (res, classifyCombineId) => {
  const goodsIds = res.map((item) => Number(item));
  // console.log(goodsIds);

  // 筛选符合条件的菜品
  const goodsList = combinationList.value
    .filter((item) => classifyCombineId == item.id)
    .map((item) => {
      const list = goodsIds.map((id) => {
        const ch = item.goodsList.find((d) => d.goodsId == id);
        return {
          goodsId: ch.goodsId,
          goodsType: ch.goodsType,
        };
      });
      return list;
    });
  const arr = [].concat(...goodsList);

  // 参数
  const params = {
    classifyCombineId,
    classifyId: firtstChooseId.value,
    goodsList: arr,
  };
  proxy.$storeDispatch("fetchSettingCustomSortGoods", params);
};

onMounted(() => {
  getClassifyList();
});
</script>

<style lang="scss" scoped>
.update-food-box {
  display: grid;
  grid-template-columns: 240px 1fr;
  height: 100%;
  user-select: none;

  .left-container {
    background-color: #fdfdfd;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: hidden;

    .tab-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      overflow-y: auto;

      .list-item {
        height: 50px;
        background-color: white;
        border: 1px solid #ececec;
        border-bottom: none;
        line-height: 50px;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
        &:nth-last-child(1) {
          border-bottom: 1px solid #ececec;
        }

        &:hover {
          color: #9e9e9e;
        }

        &.active {
          color: white;
          background-color: var(--el-color-primary);
        }
      }
    }
  }

  .right-container {
    padding-left: 15px;
    overflow: hidden;
    height: 100%;

    #combinationBox {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      overflow-y: auto;
      height: 100%;
      .combination {
        .title {
          .second-show {
            font-size: 25px;
            font-weight: bold;
            line-height: 50px;
          }
        }
      }
      .product-list {
        display: flex;
        grid-template-columns: repeat(4, 1fr);
        justify-items: start;
        width: 100%;
        overflow-y: auto;
        flex-wrap: wrap;
        flex-direction: row;
        padding-left: 10px;
        padding-top: 10px;
        box-sizing: border-box;
        .product-item {
          margin-bottom: 15px;
          padding: 15px;
          box-shadow: 1px 1px 5px 0px #c3c4c6;
          border-radius: 10px;
          width: calc(412px - 15px);
          box-sizing: border-box;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
