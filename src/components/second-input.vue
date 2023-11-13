<!-- 第二语言输入框 -->
<template>
	<div class="second-input">
		<el-input :size="size" :rows="rows" :type="type" :placeholder="placeholder" v-model="first"></el-input>
		<el-input :size="size" :rows="rows" :type="type" placeholder="第二语言" v-model="second"></el-input>
	</div>
</template>

<script setup>
import { watch, ref } from "vue";

const emits = defineEmits(["update:firstValue", "update:secondValue"]);

const props = defineProps({
	placeholder: {
		type: String,
		default: "",
	},
	size:{
		type:String,
		default:"default"
	},
	// 类型
	type:{
		type:String,
		default:"text"
	},
	// 输入行数
	rows:{
		type:Number,
		default:4
	},
	// 主体
	firstValue: {
		type: String,
		default: "",
	},
	// 第二语言动态值
	secondValue: {
		type: String,
		default: "",
	},
});

const first = ref(props.firstValue);
watch(
	() => props.firstValue,
	(nVal) => {
		first.value = nVal;
	}
);
watch(
	() => first.value,
	(nVal) => {
		emits("update:firstValue", nVal);
	}
);

const second = ref(props.secondValue);
watch(
	() => props.secondValue,
	(nVal) => {
		second.value = nVal;
	}
);
watch(
	() => second.value,
	(nVal) => {
		emits("update:secondValue", nVal);
	}
);
</script>

<style lang="scss" scoped>
.second-input {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	width: 100%;

	.el-input,.el-textarea {
		min-width: 50%;
		&:nth-child(1) {
			margin-right: 10px;
			width: calc(100% - 10px);
		}
	}
	.el-textarea{
		max-width:100%;
	}
}
</style>