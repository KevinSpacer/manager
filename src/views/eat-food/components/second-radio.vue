<!-- 百分比、定额 展示 -->
<template>
	<div class="radios" v-if="QUOTA_DATA.length">
		<p class="title">{{ $LANG_TEXT("定额") }}</p>
		<div class="content">
			<el-radio-group v-model="QUOTA_VALUE">
				<el-radio
					:label="item.value"
					size="small"
					border
					v-for="item in QUOTA_DATA"
					:key="item.id"
					@change="changeQ(item)"
				>
					<second-language
						:firstText="item.name"
						:secondText="item.nameLanguage"
					></second-language>
				</el-radio>
			</el-radio-group>
		</div>
	</div>

	<div class="radios" v-if="PERCENT_DATA.length">
		<p class="title">{{ $LANG_TEXT("百分比") }}</p>
		<div class="content">
			<el-radio-group v-model="PERCENT_VALUE">
				<el-radio
					:label="item.value"
					size="small"
					border
					v-for="item in PERCENT_DATA"
					:key="item.id"
					@change="changeP(item)"
				>
					<second-language
						:firstText="item.name"
						:secondText="item.nameLanguage"
					></second-language>
				</el-radio>
			</el-radio-group>
		</div>
	</div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, onMounted } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
	propsModel: {
		type: Object,
		default: () => ({
			typeName: "type",
			valueName: "value",
		}),
	},
	// 定额
	QUOTA_DATA: {
		type: Array,
		default: () => [],
	},
	// 百分比
	PERCENT_DATA: {
		type: Array,
		default: () => [],
	},
});

const { proxy } = getCurrentInstance();

// 定额值
const QUOTA_VALUE = ref();
// 百分比值
const PERCENT_VALUE = ref();

watch(
	() => props.modelValue,
	(nVal) => {
		init(nVal);
	}
);

// 初始化
const init = () => {
	// console.log(props.modelValue);
	const prop = props.propsModel;
	const value = props.modelValue[prop.valueName];
	const type = props.modelValue[prop.typeName];

	if (type == "QUOTA") {
		QUOTA_VALUE.value = value;
	} else {
		PERCENT_VALUE.value = value;
	}
	// console.log(QUOTA_VALUE.value);
	// console.log(PERCENT_VALUE.value);
};

// 选择 定额
const changeQ = (item) => {
	QUOTA_VALUE.value = item.value;
	PERCENT_VALUE.value = "";

	const prop = props.propsModel;
	emits("update:modelValue", {
		[prop.valueName]: item.value,
		[prop.typeName]: item.type,
	});
};

// 选择 百分比
const changeP = (item) => {
	PERCENT_VALUE.value = item.value;
	QUOTA_VALUE.value = "";

	const prop = props.propsModel;
	emits("update:modelValue", {
		[prop.valueName]: item.value,
		[prop.typeName]: item.type,
	});
};

onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.radios {
	margin-bottom: 20px;

	.title {
		font-size: 16px;
		font-weight: bold;
		line-height: 40px;
		margin-bottom: 15px;
	}

	.el-radio-group{
		label{
			margin-bottom:10px;
		}
	}
}
</style>