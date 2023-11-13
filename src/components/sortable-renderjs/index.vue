<template>
  <slot />
</template>

<script setup>
import { computed, ref, getCurrentInstance, onMounted } from "vue";
import Sortable from "sortablejs";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["changeList"]);

const props = defineProps({
  // 对Sortable参数配置可以写在此处或传递进入（App暂不可用）
  options: {
    type: Object,
    default: function () {
      return {};
    },
  },
  // 需要拖动元素的父级节点
  domId: {
    type: String,
    default: "",
  },
});

// 拖拽后改变 列表数据
const changeList = (list) => {
  emits("changeList", list);
};

// renderjs 貌似只接受一个prop参数 所以将数据打包传递
const renderJsOptions = computed(() => {
  return {
    options: props.options,
    domId: props.domId,
  };
});

// 实例
const sortable = ref();

// 创建
const create = () => {
  let { domId, options } = renderJsOptions.value;

  if (!domId) {
    console.error("props domId is null!!");
    return;
  }

  // 避免二次初始化
  if (sortable.value) {
    return;
  }

  sortable.value = Sortable.create(document.getElementById(domId), {
    animation: 500, //动画参数
    delay: 300,
    onAdd: function (evt) {
      //拖拽时候添加有新的节点的时候发生该事件
      // console.log('onAdd:', [evt.item, evt.from])
    },
    onUpdate: function (evt) {
      //拖拽更新节点位置发生该事件
      // console.log('onUpdate:', [evt.item, evt.from])
    },
    onRemove: function (evt) {
      //删除拖拽节点的时候促发该事件
      // console.log('onRemove:', [evt.item, evt.from])
    },
    onStart: function (evt) {
      //开始拖拽出发该函数
      // console.log('onStart:', [evt.item, evt.from])
    },
    onSort: function (evt) {
      //发生排序发生该事件
      // console.log('onSort:', [evt.item, evt.from])
    },
    onEnd: function (evt) {
      //拖拽完毕之后发生该事件
      // console.log('onEnd:', [evt.item, evt.from])
      // console.log(sortable)
      changeList(sortable.value.toArray());
    },
    onChoose: function ( evt) {
    //   evt.oldIndex; // element index within parent
    //   console.log('onChoose:', [evt.item, evt.from])
    },
    ...options,
  });

  // sortable = sortable
};

onMounted(() => {
  create();
});
</script>

<style scoped lang="scss">
</style>
