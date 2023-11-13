<!-- 税率 -->
<template>
	<div class="container">
		<el-check-tag
			:checked="item.checked"
			@change="onChange($event, item)"
			v-for="(item, index) in serviceList"
			:key="index"
			size="large"
		>
			<second-language
				:firstText="item.name"
				:secondText="item.nameLanguage"
			></second-language>
		</el-check-tag>
	</div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, computed, onMounted } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
});

const { proxy } = getCurrentInstance();

const mainModule = proxy.$usePiniaModule("mainModule");
// 税率
const value = ref(props.modelValue);
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal;
	}
);
watch(
	() => value.value,
	(nVal) => {
		emits("update:modelValue", value.value);
	}
);

// 税率列表
const serviceList = ref([]);
// 查询税率
const getServiceCharge = async () => {
	const { taxRate=0 } = mainModule.baseConfigInfo;
	try {
		const res = await proxy.$storeDispatch("fetchGetTaxRateList");
		const result = res.result;
		serviceList.value = [
			{
				name: "默认",
				nameLanguage: "default",
				value: taxRate,
			},
			...result,
		].map((item) => {
			const status = item.value == value.value;
			item.checked = status;
			return item;
		});
	} catch (error) {}
};

// 选中
const onChange = (status, item) => {
	for (let i = 0; i < serviceList.value.length; i++) {
		const d = serviceList.value[i];
		d.checked = false;
	}

	// 选中赋值
	item.checked = status;
	value.value = status ? item.value : 0;
};

onMounted(() => {
	getServiceCharge();
});
</script>

<style lang="scss" scoped>
.container {
	.el-check-tag {
		margin-right: 10px;
	}
}
</style>