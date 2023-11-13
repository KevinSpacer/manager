<template>
  <!-- 悬浮按钮 -->
  <div
    :class="`fiexd-main-btn ${type}`"
    @touchstart="backMousedown"
    @touchdown="backMousedown"
    @touchend="backMouseup"
    @touchmove="backMousemove($event, 'btn')"
    @mousedown="backMousedown"
    @mouseup="backMouseup"
    @mousemove="backMousemove($event, 'btn')"
    :style="{ left: backInfo.left + 'px', top: backInfo.top + 'px' }"
  >
    <slot> </slot>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const emits = defineEmits(["handClick"]);

const props = defineProps({
  initStartTop: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "",
  },
});

// 左侧浮动返回按钮

// 信息
const backInfo = reactive({
  startTop: 0,
  startLeft: 30,
  top: -100,
  left: 30,

  offsetX: 0,
  offsetY: 0,

  isMove: false,
});

// 长按计时ID
const museTimeId = ref(null);

// 结束计时
const clearBackTime = () => {
  clearTimeout(museTimeId.value);
  museTimeId.value = null;
  backInfo.isMove = false;
  touchType.value = "click";
};

// 是否可点击
const touchType = ref("click");

// 长按
const backMousedown = (e) => {
  // console.log("摁住", e);
  const backDom = document.querySelector(`.fiexd-main-btn.${props.type}`);
  // console.log(backDom.offsetLeft);
  const { changedTouches, target } = e;

  let touchs;
  if (changedTouches) {
    const [touch] = changedTouches;
    touchs = touch;
  } else {
    touchs = e;
  }
  const { pageY, pageX } = touchs;

  const btn_x = pageX - backDom.offsetLeft;
  const btn_y = pageY - backDom.offsetTop;

  // console.log(btn_x,btn_y)
  // console.log(e.target)
  clearBackTime();
  museTimeId.value = setTimeout(() => {
    backInfo.isMove = true;

    backInfo.startTop = pageY;
    backInfo.startLeft = pageX;

    backInfo.offsetY = btn_y;
    backInfo.offsetX = btn_x;
    console.log("长按");
    touchType.value = "move";
  }, 500);
};

// 移动
const backMousemove = (e) => {
  if (!backInfo.isMove && touchType.value != "move") {
    return;
  }
  // console.log("移动", e);

  const { changedTouches, target } = e;
  let touchs;
  if (changedTouches) {
    const [touch] = changedTouches;
    touchs = touch;
  } else {
    touchs = e;
  }

  const { pageY, pageX } = touchs;

  // 起始值+移动距离
  const move_x = backInfo.startLeft + (pageX - backInfo.startLeft) || 0;
  const move_y = backInfo.startTop + (pageY - backInfo.startTop) || 0;
  // console.log(move_x, move_y);

  // 当前距离 - 点击在按钮的区域
  const left = move_x - backInfo.offsetX;
  const top = move_y - backInfo.offsetY;
  backInfo.left = left <= 0 ? 0 : left;
  backInfo.top = top <= 0 ? 0 : top;

  // console.log(backInfo.left, backInfo.top);
};

// 结束
const backMouseup = (e) => {
  // console.log("结束", e);

  console.log(touchType.value);
  if (touchType.value == "click") {
    emits("handClick");
  }
  clearBackTime();
};

onMounted(async () => {
  // 初始高度
  const innerHeight = window.innerHeight;
  const int_innerHeight = innerHeight - innerHeight * 0.4;
  backInfo.startTop = int_innerHeight - props.initStartTop;
  backInfo.top = int_innerHeight - props.initStartTop;

  // console.log(backInfo.startTop);
});

defineExpose({
  backMousemove,
  backMouseup,
});
</script>

<style lang="scss" scoped>
.fiexd-main-btn {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  box-shadow: 0px 0px 11px 0px #00000024;
  position: fixed;
  bottom: 10vh;
  left: 3vw;
  background-color: gray;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 900;
  color: white;
}
</style>
