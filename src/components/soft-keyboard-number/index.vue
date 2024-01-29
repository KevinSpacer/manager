<!-- 数字键盘 -->

<template>
	<div class="keyboard-box" :class="type">

		<Keyboard v-if="type === 'number' || type === 'seat'" v-for="item in keyboards"
			:loading="item.value == 'confirm' && isConfirm" :key="item.key" :keyProps="item" @keyBtn="getKeyBtn" />

		<MultiKeyboard v-else v-for="item in keyboards" :key="item.value" :loading="item.value == 'confirm' && isConfirm"
			:keyProps="item" @keyBtn="getKeyBtn" />



	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, getCurrentInstance } from "vue";
import Keyboard from "../keyboard.vue";
import MultiKeyboard from "../multi-keyboard.vue"
const { proxy } = getCurrentInstance();
const emits = defineEmits(["keyBtn", "confirm", "update:modelValue", "back", "handleClose"]);
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
	callerKeyboard: {
		type: String,
		default: 'userName'
	}
});
const openBack = ref(props.showBack);
const inputVal = ref(props.modelValue);
const curKeyType = ref('String') //当前点击键盘类型 字符串/数字
// 是否已点击确认
const isConfirm = ref(false);
const userNameString = ref('') //客户姓名键盘信息
const contactWayString = ref('') //联系电话键盘信息
const addressString = ref(""); //收货地址键盘信息 Oneway 1.29
// 键盘表单同步 
watch(
	() => props.modelValue,
	(nVal) => {
		inputVal.value = nVal;
	}
);

watch(() => props.callerKeyboard, (newVal) => {
	// 键盘切换时将内容还原 Oneway 1.29
	inputVal.value = ''
	emits("update:modelValue", inputVal.value);

},)

watch(
	() => inputVal.value,
	(nVal, oVal) => {
		// 回显键盘传入的信息 Oneway 1.29
		if (props.type == "number") {
			if (props.isString) {
				contactWayString.value = nVal
				emits("update:modelValue", contactWayString.value);
			} else {
				contactWayString.value = nVal
				if (contactWayString.value.length > 10) {
					contactWayString.value = contactWayString.value.substring(0, 10)
				}
				emits("update:modelValue", contactWayString.value ? Number(contactWayString.value) : "");
			}
		} else {
			if (props.callerKeyboard === 'address') {
				let a = oVal.length;
				let addressChar = inputVal.value.substring(a)
				addressString.value = addressString.value.concat(addressChar);
				emits("update:modelValue", addressString.value);
			}
			else {
				userNameString.value = inputVal.value
				emits("update:modelValue", userNameString.value);
			}
		}
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
	} if (props.type == "seat") {
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
	} else {
		return [[
			{
				key: "1",
				value: "1",
			},
			{
				key: "2",
				value: "2",
			},
			{
				key: "3",
				value: "3",
			},
			{
				key: "4",
				value: "4",
			},
			{
				key: "5",
				value: "5",
			},
			{
				key: "6",
				value: "6",
			},
			{
				key: "7",
				value: "7",
			},
			{
				key: "8",
				value: "8",
			},
			{
				key: "9",
				value: "9",
			},
			{
				key: "0",
				value: "0",
			},
			{
				key: "回撤",
				value: "delete",
			},
			{
				key: "确认",
				value: "confirm",
			},
		],
		[
			{
				key: "q",
				value: "q",
			},
			{
				key: "w",
				value: "w",
			},
			{
				key: "e",
				value: "e",
			},
			{
				key: "r",
				value: "r",
			},
			{
				key: "t",
				value: "t",
			},
			{
				key: "y",
				value: "y",
			},
			{
				key: "u",
				value: "u",
			},
			{
				key: "i",
				value: "i",
			},
			{
				key: "o",
				value: "o",
			},
			{
				key: "p",
				value: "p",
			},
		],
		[
			{
				key: "a",
				value: "a",
			},
			{
				key: "s",
				value: "s",
			},
			{
				key: "d",
				value: "d",
			},
			{
				key: "f",
				value: "f",
			},
			{
				key: "g",
				value: "g",
			},
			{
				key: "h",
				value: "h",
			},
			{
				key: "j",
				value: "j",
			},
			{
				key: "k",
				value: "k",
			},
			{
				key: "l",
				value: "l",
			},
		],
		[
			{
				key: "z",
				value: "z",
			},
			{
				key: "x",
				value: "x",
			},
			{
				key: "c",
				value: "c",
			},
			{
				key: "空格",
				value: " ",
			},
			{
				key: "v",
				value: "v",
			},
			{
				key: "b",
				value: "b",
			},
			{
				key: "n",
				value: "n",
			},
			{
				key: "m",
				value: "m",
			},
			{
				key: "清空",
				value: "clear",
			},
		]
		]
	}
});

// 按下
const getKeyBtn = (key) => {
	curKeyType.value = typeof key
	if (curKeyType.value == "string") {
		if (key == "delete") {
			// 清除一位输入值
			if (inputVal.value) {
				const str_val = inputVal.value.toString();
				inputVal.value = str_val.slice(0, str_val.length - 1);
				const str_val1 = addressString.value.toString();
				addressString.value = str_val1.slice(0, str_val1.length - 1)
			}
		} else if (key == "confirm") {
			// 关闭键盘
			emits("handleClose")
			// 更新表单的值
			if (props.callerKeyboard === 'contactWay') {
				emits("update:modelValue", contactWayString.value);
			} else if (props.callerKeyboard === 'address') {
				emits("update:modelValue", addressString.value);
			} else {
				emits("update:modelValue", userNameString.value);
			}
		} else if (key == "back") {
			emits("back", closeLoading);
		} else if (key == "clear") {
			addressString.value = "";
			emits("update:modelValue", addressString.value);
		} else {
			inputVal.value += key;
		}
	} else {
		inputVal.value += key + '';
	}
};

// 关闭加载
const closeLoading = () => {
	isConfirm.value = false;
};



onMounted(() => {
	openBack.value = props.showBack;
	// 默认初始键盘 Oneway 1.29
	getKeyBtn('')
});
defineExpose({
	inputVal,
});
</script>

<style lang="scss" scoped>
.keyboard-box {
	width: 100%;
	display: grid;
	grid-template-rows: repeat(4, 80px);
	text-align: center;
	justify-items: center;

	&.number {
		grid-template-columns: repeat(3, 1fr);
	}

	&.seat {
		grid-template-columns: repeat(5, 1fr);
	}

	.keyboard+.keyboard {}

	.keyboard {
		margin-top: 20px;
	}
}
</style>