<!-- 数字键盘 -->

<template>
	<div class="keyboard-box" :class="type">
		<Keyboard
			v-for="item in keyboards"
			:loading="item.value == 'confirm' && isConfirm"
			:key="item.key"
			:keyProps="item"
			@keyBtn="getKeyBtn"
		/>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, getCurrentInstance } from "vue";
import Keyboard from "../keyboard.vue";

const { proxy } = getCurrentInstance();

const emits = defineEmits(["keyBtn", "confirm", "update:modelValue", "back"]);
const props = defineProps({
	keyProps: {
		type: Object,
		default: () => ({
			key: "KEY",
			value: "",
		}),
	},
	modelValue: {
		type: [String, Number],
		default: "",
	},
	// 软键盘类型
	/**
	 * seat 座位
	 * number 数字
	 * */
	type: {
		type: String,
		default: "number",
	},
	// 输入值为string
	isString: {
		type: Boolean,
		default: false,
	},
	// 是否打开返回按钮
	showBack: {
		type: Boolean,
		default: false,
	},
});

const openBack = ref(props.showBack);

const value = ref(props.modelValue);
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal;
	}
);

// 按钮数据
const keyboards = computed(() => {
	if (props.type == "number") {
		return [
			{
				key: "7",
				value: 7,
			},
			{
				key: "8",
				value: 8,
			},
			{
				key: "9",
				value: 9,
			},
			{
				key: "4",
				value: 4,
			},
			{
				key: "5",
				value: 5,
			},
			{
				key: "6",
				value: 6,
			},
			{
				key: "1",
				value: 1,
			},
			{
				key: "2",
				value: 2,
			},
			{
				key: "3",
				value: 3,
			},
			{
				key: proxy.$LANG_TEXT("回退"),
				value: "delete",
			},
			{
				key: "0",
				value: 0,
			},
			{
				key: proxy.$LANG_TEXT("确定"),
				value: "confirm",
			},
		];
	} else {
		const bases = [
			{
				key: "7",
				value: 7,
			},
			{
				key: "8",
				value: 8,
			},
			{
				key: "9",
				value: 9,
			},
			{
				key: "A",
				value: "A",
			},
			{
				key: "B",
				value: "B",
			},
			{
				key: "4",
				value: 4,
			},
			{
				key: "5",
				value: 5,
			},
			{
				key: "6",
				value: 6,
			},
			{
				key: "C",
				value: "C",
			},
			{
				key: "D",
				value: "D",
			},
			{
				key: "1",
				value: 1,
			},
			{
				key: "2",
				value: 2,
			},
			{
				key: "3",
				value: 3,
			},
			{
				key: "E",
				value: "E",
			},
			{
				key: "F",
				value: "F",
			},
			{
				key: "0",
				value: 0,
			},
			{
				key: proxy.$LANG_TEXT("回退"),
				value: "delete",
			},
			{
				key: proxy.$LANG_TEXT("确定"),
				value: "confirm",
			},
		];
		if (openBack.value) {
			bases.splice(bases.length - 1, 0, {
				key: proxy.$LANG_TEXT("返回"),
				value: "back",
			});
			return bases;
		} else {
			return bases;
		}
	}
});

// 是否已点击确认
const isConfirm = ref(false);

// 按下
const getKeyBtn = (key) => {
	// console.log(key);
	if (typeof key == "string") {
		if (key == "delete") {
			// 清除一位输入值
			if (value.value) {
				const str_val = value.value.toString();
				value.value = str_val.slice(0, str_val.length - 1);
				console.log(value.value);
			}
		} else if (key == "confirm") {
			if (isConfirm.value) {
				return;
			}
			isConfirm.value = true;
			emits("confirm", closeLoading);
		} else if (key == "back") {
			emits("back", closeLoading);
		} else {
			// 英文字母赋值
			value.value += key;
		}
	} else {
		value.value += key + "";
	}
};

// 关闭加载
const closeLoading = () => {
	isConfirm.value = false;
};

watch(
	() => value.value,
	(nVal) => {
		if (props.type == "number") {
			if (props.isString) {
				emits("update:modelValue", nVal);
			} else {
				emits("update:modelValue", nVal ? Number(nVal) : "");
			}
		} else {
			emits("update:modelValue", nVal);
		}
	}
);

onMounted(() => {
	openBack.value = props.showBack;
});
defineExpose({
	value,
});
</script>

<style lang="scss" scoped>
.keyboard-box {
	width: 100%;
	display: grid;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-evenly;
	justify-items: center;

	&.number {
		grid-template-columns: repeat(3, 1fr);
	}

	&.seat {
		grid-template-columns: repeat(5, 1fr);
	}

	.keyboard + .keyboard {
	}
	.keyboard {
		margin-top: 40px;
	}
}
</style>