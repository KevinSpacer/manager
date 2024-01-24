<!-- 菜品、套餐 列表选项值的显示 -->
<!-- 调味品 -->
<template>
  <div
    class="list-box"
    v-for="(item, index) in showListData"
    :key="'list-box' + index"
  >
    <div class="list-box-item" @click.stop="handClick">
      <div class="item name">{{ item.name }}</div>
      <div class="item status"></div>
      <div class="item number" v-if="showUnit"></div>
      <div class="item price" v-if="showUnit" >
        <span v-if="showUnit">$</span>
        <span> {{ item.showPrice * parentData.goodsQuantity || 0 }} </span>
      </div>
    </div>

    <!-- <div
			class="list-child-item"
			v-for="(child, i) in item.children"
			:key="'item-child' + i"
		>
			<div class="item name">
				<second-language
					:firstText="child.name"
					:secondText="child.nameLanguage"
				></second-language>
			</div>
			<div class="item status"></div>
			<div class="item number"></div>
			<div class="item price">
				<span v-if="child.price"> ${{ child.price }} </span>
			</div>
		</div> -->
  </div>

  <div
    class="other-item"
    @click.stop="handClick"
    v-if="parentData.serveDishesWay"
  >
    <span class="textFold">{{ $LANG_TEXT("Serving Method") }}</span
    >：
    <span>{{ parentData.serveDishesWay }}</span>
  </div>

  <div class="other-item" @click.stop="handClick" v-if="parentData.remark">
    <span class="textFold">{{ $LANG_TEXT("Remarks") }}</span
    >：
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

const emits = defineEmits(["handClick"]);

const props = defineProps({
  // 菜品、套餐信息
  goodsDetail: {
    type: Object,
    default: () => ({}),
  },
  // 显示单位
  showUnit:{
    type:Boolean,
    default:true
  }
});

// 数据
const parentData = ref(props.goodsDetail);
watch(
  () => props.goodsDetail,
  (nVal) => {
    // console.log(nVal)
    parentData.value = nVal;
  }
);

// 展示
const showListData = computed(() => {
  const goods = JSON.parse(JSON.stringify(parentData.value));
  const goodsType = goods.goodsType;
  const { remark, serveDishesWay } = goods;
  const list = [];

  // 调味品
  const dishesSpicesList = (goods.dishesSpicesList || []).map((item) => {
    const children = item.dishesSpicesAttributeList || [];

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

    item.name = `${name} / ${childNames.join("、")}`;
    item.showPrice = children.reduce((add, curr) => {
      return (add += Number(curr.price || 0));
    }, 0);
    return item;
  });

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
    // 规格
    const dishesSpecificationList = (goods.dishesSpecificationList || []).map(
      (item) => {
        const children = item.dishesSpecificationAttributeList || [];
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

        item.name = `${name} / ${childNames.join("、")}`;
        item.showPrice = Number(children[0].price || 0);
        return item;
      }
    );

    list.push(...dishesSpecificationList);
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

      item.name = `${name} / ${childNames.join("、")}`;
      return item;
    });
    list.push(...specificationList);
  }
  list.push(...customDishesSpicesList, ...dishesSpicesList);
  // console.log(goods);
  // console.log(list);
  // console.log(goodsQuantity);
  return list;
});

const handClick = () => {
  emits("handClick");
};

onMounted(() => {});
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
    font-size: 30px;
    box-sizing: border-box;
    padding-left: 20px;
    display: grid;
    grid-template-columns: 1fr 80px 120px 150px;

    // &:active {
    // 	background-color: #0000001a;
    // }
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