<!-- 数字键盘 -->

<template>
  <div class="keyboard-box">
    <div class="number-box">
      <div class="all-number">
        <div
          class="key-item"
          v-for="item in keyboards"
          :key="'number' + item.value"
          @click="keyboardDown(item.value)"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- 0|. -->
      <div class="price-box">
        <div class="zero" @click="keyboardDown(0)">0</div>
        <div class="float" @click="keyboardDown('.')">.</div>
      </div>
    </div>
    <div class="action-box">
      <div class="delete" @click="keyboardDown('delete')">
        <ml-image :src="deleteIcon"></ml-image>
      </div>
      <div class="confirm" @click="keyboardDown('confirm')">
        {{ $LANG_TEXT("完成") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  isWrite: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["confirm", "update:modelValue", "delete"]);

// 图片
const deleteIcon = require("@/assets/images/key-board-delete.png");

const value = ref(props.modelValue);
watch(
  () => props.modelValue,
  (nVal) => {
    value.value = nVal;
  }
);

// 是否写入
const is_write = ref(props.isWrite);
watch(
  () => props.isWrite,
  (nVal) => {
    is_write.value = nVal;
  }
);

// 按钮数据
const keyboards = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
];

const isEmpty = ["", undefined, null];

// 按键
const keyboardDown = (key) => {
  if (typeof key == "string") {
    if (key == "delete") {
      // console.log(value.value)
      // console.log(!isEmpty.includes(value.value))
      // emits('delete',)
      // 清除一位输入值
      if (!isEmpty.includes(value.value)) {
        const val_str = value.value.toString();
        value.value = val_str.slice(0, val_str.length - 1);
      }
    } else if (key == "confirm") {
      if (isConfirm.value) {
        return;
      }
      isConfirm.value = true;
      emits("confirm", closeLoading);
    } else {
      if (!is_write.value) {
        return;
      }

      // 已存在小数点
      const val_str = value.value.toString();
      if (val_str.indexOf(".") == -1) {
        // value.value += key;
        const res = value.value + key;
        value.value = res;
      } else {
        const res = Number(value.value + key);
        console.log('res',res);
        value.value = isNaN(res) ? 0 : res;
      }
      console.log(value.value);
    }
  } else {
    if (!is_write.value) {
      return;
    }
    // 英文字母赋值
    value.value += key.toString();
    console.log(value.value);
  }
};

// 是否已点击确认
const isConfirm = ref(false);

// 关闭加载
const closeLoading = () => {
  isConfirm.value = false;
};

watch(
  () => value.value,
  (nVal) => {
    emits("update:modelValue", Number(nVal));
  }
);

defineExpose({
  value,
});
</script>

<style lang="scss" scoped>
.keyboard-box {
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  grid-template-columns: 1fr 135px;
  width: 550px;
  background-color: #f2f3f5;
  border-radius: 10px;
  padding: 10px;

  .number-box {
    font-size: 28px;
    .all-number {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 5px;
      grid-template-rows: repeat(3, 40px);
      .key-item {
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;

        &:active {
          opacity: 0.7;
        }
      }
    }

    .price-box {
      margin-top: 5px;
      display: grid;
      grid-template-columns: 1fr 135px;
      grid-template-rows: 40px;
      grid-gap: 5px;
      align-items: center;
      justify-items: center;

      .zero,
      .float {
        width: 98%;
        height: 90%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;

        &:active {
          opacity: 0.7;
        }
      }
    }
  }

  .action-box {
    display: grid;
    grid-template-rows: 1fr 90px;
    align-items: center;
    justify-items: center;

    .delete,
    .confirm {
      width: 90%;
      height: 40px;
      background-color: white;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;

      &:active {
        opacity: 0.7;
      }
    }
    .delete {
      height: 96%;

      .ml-image {
        width: 65%;
        height: auto;
      }
    }
    .confirm {
      height: 90%;
    }
  }
}
</style>