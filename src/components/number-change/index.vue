<template>
	<div class="number-change">
		<div class="del-btn btn-icon" @click="del">
			<el-icon :size="iconSize"><Minus /></el-icon>
		</div>
		<!-- <el-button :icon="Plus" size="small" @click="add"></el-button> -->
		<p class="value">{{ value }}</p>
		<div class="add-btn btn-icon" @click="add">
			<el-icon :size="iconSize"><Plus /></el-icon>
		</div>

		<!-- <el-button :icon="Minus" size="small" @click="del"></el-button> -->
	</div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from "vue";
import { Plus, Minus } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();

const emits = defineEmits(["update:modelValue","changeCount"]);

const props = defineProps({
	modelValue: {
		type: [Number, String],
		default: 0,
	},
	iconSize:{
		type:String,
		default:'16px'
	},
	// 是否禁止添加
	addDisabled:{
		type:Boolean,
		default:false
	}
});

const value = ref(props.modelValue);
watch(()=>props.modelValue,nVal=>{
	value.value = nVal
})
watch(
	() => value.value,
	(nVal) => {
		// console.log(nVal)
		emits("update:modelValue", nVal);
	}
);

const add = () => {
	if(props.addDisabled){
		return
	}
	value.value += 1;

	emits("changeCount",value.value)
};
const del = () => {
	if (value.value <= 0) {
		return;
	}
	value.value -= 1;
	emits("changeCount",value.value)
};
</script>

<style lang="scss" scoped>
.number-change {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;

	.btn-icon {
		// width: 30px;
		// height: 30px;
		padding: 8px;
		background-color: #f1f1f1;
		border-radius: 50px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;

		&:active{
			opacity: 0.6;
		}
	}

	.value {
		padding: 0 8px;
	}
}
</style>