<!-- 服务费 -->
<template>
	<div class="container">
		<second-radio
			:QUOTA_DATA="serviceObj.quota"
			:PERCENT_DATA="serviceObj.percent"
			:propsModel="{
				valueName: 'serviceCharge',
				typeName: 'serviceChargeType',
			}"
			v-model="value"
		></second-radio>

	</div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, computed, onMounted, reactive } from "vue";
import secondRadio from "./second-radio.vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({
			serviceChargeType: "QUOTA",
			serviceCharge: "",
		}),
	},
});

const { proxy } = getCurrentInstance();

// 服务费
const value = ref(props.modelValue);
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal
	}
);
watch(
	() => value.value,
	(nVal) => {
		emits("update:modelValue", value.value);
	}
);

const serviceObj = reactive({
	quota:[],
	percent:[]
})
// 查询服务费
const getServiceCharge = async () => {
	try {
		const res = await proxy.$storeDispatch("fetchGetServiceChargeList");
		const result = res.result.filter((item) => item.status == "SHOW");

		const quotas = result.filter((item) => item.type == "QUOTA");
		if (quotas.length) {
			quotas.unshift({
				name: "无",
				nameLanguage: "nothing",
				type: "QUOTA",
				value: 0,
			});
		}
		const percents = result.filter((item) => item.type == "PERCENT");
		if (percents.length) {
			percents.unshift({
				name: "无",
				nameLanguage: "nothing",
				type: "PERCENT",
				value: 0,
			});
		}
		serviceObj.quota = quotas;
		serviceObj.percent = percents;
	} catch (error) {}
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