<!-- 数字键盘 -->

<template>
	<div class="keyboard-box" :class="type">

		<Keyboard v-if="type === 'number' || type === 'seat'" v-for="item in keyboards"
			:loading="item.value == 'confirm' && isConfirm" :key="item.key" :keyProps="item" @keyBtn="getKeyBtn" />

		<MultiKeyboard v-else v-for="item in keyboards" :key="item.value"
			:loading="item.value == 'confirm' && isConfirm" :keyProps="item" @keyBtn="getKeyBtn" />



	</div>
</template>

<script setup>
import { ref, watch, onMounted, computed, getCurrentInstance } from "vue";
import Keyboard from "../keyboard.vue";
import MultiKeyboard from "../multi-keyboard.vue"
const { proxy } = getCurrentInstance();
const emits = defineEmits(["keyBtn", "confirm", "changeInput", "back", "handleClose"]);
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
	// 输入框对应键盘 1.31 Oneway
	callerKeyboard: {
		type: String,
		default: 'userName'
	},
	// 表单数据 1.31 Oneway
	formObj: {
		type: Object,
		default: () => { }
	},
	seatval: {
		type: String,
		default: ''
	},
	peopelval: {
		type: String,
		default: ''
	},
	tp: {
		type: String,
		default: ''
	}
});
const openBack = ref(props.showBack);
const inputVal = ref('');
const curKeyType = ref('String') //当前点击键盘类型 字符串/数字
// 是否已点击确认
const isConfirm = ref(false);
const userNameString = ref('') //客户姓名键盘信息
const contactWayString = ref('') //联系电话键盘信息
const addressString = ref(""); //收货地址键盘信息 Oneway 1.29
// 切换表单时将内容回显到键盘 1.31 Oneway
watch(() => props.callerKeyboard, (newVal) => {
	inputVal.value = ''
	console.log('props.formObj', props.formObj);
	console.log(newVal);
	if (newVal === 'userName') {
		inputVal.value = props.formObj ? props.formObj.userName : ''
	} else if (newVal === 'contactWay') {
		inputVal.value = props.formObj ? props.formObj.contactWay : ''
	} else if (newVal === 'address') {
		inputVal.value = props.formObj ? props.formObj.address : ''
	} else if (newVal === 'account') {
		inputVal.value = props.formObj ? props.formObj.account : ''
	} else if (newVal === 'password') {
		inputVal.value = props.formObj ? props.formObj.password : ''
	}
	else if (newVal === 'peopel') {
		console.log(props.peopel);
		inputVal.value = props.peopelval ? props.peopelval : ''
	}
	else if (newVal === 'seat') {
		inputVal.value = props.seatval ? props.seatval : ''
	}

	console.log(inputVal.value);
}, { immediate: true })



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
	console.log(key)
	curKeyType.value = typeof key
	if (curKeyType.value == "string") {
		if (key == "delete") {
			// 清除一位输入值
			console.log(inputVal.value);
			if (inputVal.value) {
				const str_val = inputVal.value.toString();
				inputVal.value = str_val.slice(0, str_val.length - 1);
				const str_val1 = addressString.value.toString();
				addressString.value = str_val1.slice(0, str_val1.length - 1)
				console.log(inputVal.value);
			}
		} else if (key == "confirm") {
			// 键盘确认时收起键盘 同事表单更新 1.31 Oneway
			emits("handleClose")
			console.log(props.tp);
			if (props.tp == 'EAT_IN' || props.callerKeyboard === 'seat' || props.callerKeyboard === 'remark') {
				emits("confirm")
			}

			emits('changeInput', inputVal.value)
		} else if (key == "back") {
			emits("back", closeLoading);
		} else if (key == "clear") {
			inputVal.value = "";
		} else {
			inputVal.value += key;
			console.log(inputVal.value);
		}
	} else {
		console.log(inputVal.value);
		inputVal.value += key + '';

		console.log(inputVal.value);
	}

	// 键盘内容更新到表单 1.31 Oneway
	emits('changeInput', inputVal.value)
};

// 关闭加载
const closeLoading = () => {
	isConfirm.value = false;
};



onMounted(() => {
	openBack.value = props.showBack;
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
		width: 100%;
		justify-content: center;
		grid-template-columns: repeat(3, 200px);
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