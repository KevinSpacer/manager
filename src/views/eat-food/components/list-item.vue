<!-- 菜品、套餐 列表选项值的显示 -->
<!-- 调味品 -->
<!-- 调味品显示列表 -->
<template>
  <div class="list-box" v-for="(item, index) in showListData" :key="'list-box' + index">
    <div class="list-box-item">
      <div class="item name">{{ item.name }}</div>
      <!-- <div class="item price" v-if="showUnit">$ {{ item.showPrice }}</div> -->
      <div class="m0-10">
        <el-icon v-if="goodsDetail.status == 'ON_SHELVES'">
          <Delete @click="deleteCondiments(item, index)" />
        </el-icon>
      </div>
      <div class="m0-10">
        <el-icon v-if="goodsDetail.status == 'ON_SHELVES'">
          <Edit @click="changeSpec(goodsDetail, item)" />
        </el-icon>
      </div>
    </div>

    <div class="list-child-item" v-for="(child, i) in item.children" :key="'item-child' + i">
      <div class="item name">
        <second-language :firstText="child.name" :secondText="child.nameLanguage"></second-language>
      </div>
      <div class="item status"></div>
      <div class="item number"></div>
      <div class="item price">
        <span v-if="child.price"> ${{ child.price }} </span>
      </div>
    </div>
  </div>

  <div class="other-item" @click.stop="handClick" v-if="parentData.serveDishesWay">
    <span class="textFold">{{ $LANG_TEXT("上菜方式") }}</span>：
    <span>{{ parentData.serveDishesWay }}</span>
  </div>

  <div class="other-item" @click.stop="handClick" v-if="parentData.remark">
    <span class="textFold">{{ $LANG_TEXT("备注") }}</span>：
    <span>{{ parentData.remark }}</span>
  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  onMounted,
  reactive,
  watch,
  computed,
  nextTick,
} from "vue";
import tabScroll from "@/components/tab-scroll";
const { proxy } = getCurrentInstance();

const emits = defineEmits(["deleteCondiments", "changeSpec", 'update:modelValue']);

const props = defineProps({
  // 菜品、套餐信息
  goodsDetail: {
    type: Object,
    default: () => ({}),
  },
  // 显示单位
  showUnit: {
    type: Boolean,
    default: true

  },
  modelValue: {
    type: Array,
    default: () => []
  }
});
const parentData = ref(props.goodsDetail);
watch(() => props.modelValue, (nval) => {
  showListData.value = nval
  console.log(showListData.value);
})
watch(() => props.goodsDetail, (nval) => {
  console.log(nval);
  parentData.value = nval
})
const isEmpty = ["", undefined, null];
// 展示 调味品展示数据
const showListData = computed(() => {
  const goods = JSON.parse(JSON.stringify(parentData.value));
  console.log(goods);
  const goodsType = goods.goodsType;
  const { remark, serveDishesWay } = goods;
  const list = [];

  // 调味品
  const dishesSpicesList = (goods.dishesSpicesList || []).map((item) => {
    const children = item.dishesSpicesAttributeList || [];
    console.log(item)
    item.children = [];
    // console.log(item);
    const name = proxy.$LANG_TEXT(item.name, {
      mode: "second",
      secondValue: item.nameLanguage,
    });
    const childNames = children.map((d) => {
      return proxy.$LANG_TEXT(d.name, {
        mode: "second",
        secondValue: d.nameLanguage,
      });
    });

    item.name = `${childNames.join("、")}`;
    item.showPrice = children.reduce((add, curr) => {
      return (add += Number(curr.price || 0));
    }, 0);
    return item;
  });
  // console.log(dishesSpicesList);
  // 自定义调味品
  const customDishesSpicesList = (goods.customDishesSpicesList || []).map(
    (item) => {

      item.showPrice = Number(item.price || 0);
      return item;
    }
  );

  // goodsType
  // DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐
  if (goodsType == "DISHES") {
    // // 规格
    // const dishesSpecificationList = (goods.dishesSpecificationList || []).map(
    //   (item) => {
    //     const children = item.dishesSpecificationAttributeList || [];
    //     item.children = [];
    //     // console.log(item);
    //     const name = proxy.$LANG_TEXT(item.name, {
    //       mode: "second",
    //       secondValue: item.nameLanguage,
    //     });
    //     const childNames = children.map((d) => {
    //       return proxy.$LANG_TEXT(d.name, {
    //         mode: "second",
    //         secondValue: d.nameLanguage,
    //       });
    //     });

    //     item.name = `${childNames.join("、")}哈哈哈`;
    //     item.showPrice = Number(children[0].price || 0);
    //     return item;
    //   }
    // );

    // list.push(...dishesSpecificationList);
  } else if (goodsType == "CUSTOM_DISHES") {
    // list.push(...dishesSpicesList);
  } else if (goodsType == "SET_MEAL") {
    // 规格
    const specificationList = goods.specificationList.map((item) => {
      const children = item.setMealSpecificationDishesList || [];
      item.children = [];
      // console.log(item);
      const name = proxy.$LANG_TEXT(item.name, {
        mode: "second",
        secondValue: item.nameLanguage,
      });
      const childNames = children.map((d) => {
        return proxy.$LANG_TEXT(d.name, {
          mode: "second",
          secondValue: d.nameLanguage,
        });
      });

      item.name = `${childNames.join("、")}`;
      return item;
    });
    list.push(...specificationList);
  }
  list.push(...dishesSpicesList, ...customDishesSpicesList);
  // console.log(goods);
  // console.log(list);
  // console.log(goodsQuantity);
  return list;
});

const deleteCondiments = (item, index) => {
  console.log(item);
  console.log(index);
  let value = {
    item,
    index
  }
  console.log(value);
  emits("deleteCondiments", value)
  console.log('删除后列表', showListData.value);
  emits('update:modelValue', JSON.parse(JSON.stringify(showListData.value)))
}
//变更spec, 只有规格和自定义调味变更时才emits 事件
const changeSpec = (goodsDetail, value) => {
  console.log(goodsDetail);
  if (value.dishesSpecificationAttributeList || value.dishesSpicesAttributeList) {
    emits("changeSpec", goodsDetail);
  }
};

onMounted(() => { });
</script>

<style lang="scss" scoped>
.list-box {
  margin-top: 10px;
  font-size: 15px;

  .item {
    text-align: center;
    box-sizing: border-box;

    &.name {
      text-align: left;
    }

    &.price {
      text-align: left;
    }
  }

  .list-box-item {
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-left: 20px;
    display: grid;
    grid-template-columns: 290px 70px 40px 40px;

    // &:active {
    // 	background-color: #0000001a;
    // }
  }

  .m0-10 {
    margin: 0 10px;
  }

  .list-child-item {
    box-sizing: border-box;
    padding-left: 30px;
    font-size: 13px;
    display: grid;
    grid-template-columns: 1fr 80px 120px 150px;

    &:active {
      background-color: #0000001a;
    }
  }
}

.other-item {
  padding-left: 20px;
  font-size: 14px;
  margin-top: 10px;

  .textFold {
    font-weight: bold;
  }
}
</style>