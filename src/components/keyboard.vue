<!-- 键盘按键 -->

<template>
	<div class="keyboard">
		<div class="btn" v-loading="isLoading" @click="downBtn">
			<span>{{ keyProps.key }}</span>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
const emits = defineEmits(["keyBtn"]);
const props = defineProps({
	keyProps: {
		type: Object,
		default: () => ({
			key: "KEY",
			value: "",
		}),
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

const isLoading = ref(props.loading);
watch(
	() => props.loading,
	(nVal) => {
		isLoading.value = nVal;
	}
);

// 按下
const downBtn = () => {
	emits("keyBtn", props.keyProps.value);
};
</script>

<style lang="scss" scoped>
.keyboard {
	-moz-user-select: -moz-none;
	-moz-user-select: none;
	-o-user-select: none;
	-khtml-user-select: none; /* you could also put this in a class */
	-webkit-user-select: none; /* and add the CSS class here instead */
	-ms-user-select: none;
	user-select: none; /**禁止选中文字*/
	.btn {
		width: 70px;
		height: 70px;
		border-radius: 100px;
		border: 1px solid #c2c2c2;
		color: #05d69d;
		text-align: center;
		line-height: 70px;
		font-size: 25px;
		cursor: pointer;
		box-sizing: border-box;
		transition: 300ms;
		overflow: hidden;
		&:active {
			opacity: 0.5;
			background-color: #05d69d;
			border: 1px solid #05d69d;
			color: white;
		}
	}
}
</style>

<style lang="scss">
.keyboard {
	.el-loading-mask {
		.el-loading-spinner {
			top: 32px;
		}
	}
}
</style>