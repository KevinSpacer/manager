<!-- 取消订单 -->
<template>
	<div class="reason-container">
		<el-tag
			v-for="(tag, index) in dynamicTags"
			:key="tag"
			class="mx-1"
			closable
			:disable-transitions="false"
			size="large"
			border
			color="white"
			:class="{ 'is-active': chooseIndex === index }"
			@click="chooseIndex = index"
			@close="handleClose(tag, index)"
		>
			{{ tag }}
		</el-tag>
		<el-input
			v-if="inputVisible"
			ref="InputRef"
			v-model="inputValue"
			class="ml-1 w-20"
			size="large"
			@keyup.enter="handleInputConfirm"
			@blur="handleInputConfirm"
		>
			<template #append>
				<div @click="handleInputConfirm">{{ $LANG_TEXT("确认") }}</div>
			</template>
		</el-input>
		<el-button v-else class="button-new-tag ml-1" @click="showInput">
			+ {{ $LANG_TEXT("添加原因") }}
		</el-button>
	</div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, getCurrentInstance } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
});

watch(
	() => props.modelValue,
	(nVal) => {
		chooseIndex.value = dynamicTags.value.indexOf(nVal);
	}
);

const { proxy } = getCurrentInstance();

const storeName = "cancelling-order-reason";

// tag 选中索引
const chooseIndex = ref("");
watch(
	() => chooseIndex.value,
	(nVal) => {
		const result = dynamicTags.value[nVal] || "";
    console.log(result)
		emits("update:modelValue", result);
	}
);

const inputValue = ref("");
const dynamicTags = ref([]);
watch(
	() => dynamicTags.value.length,
	(nVal) => {
		const json_data = JSON.stringify(dynamicTags.value);
		// console.log(json_data);
		proxy.$setItem(storeName, json_data);
	}
);

const inputVisible = ref(false);
const InputRef = ref();

// 初始化
const init = () => {
	const cancellingOrderReason = JSON.parse(proxy.$getItem(storeName) || "[]");
	dynamicTags.value = cancellingOrderReason;
};

// 删除标签
const handleClose = (tag, index) => {
	console.log('取消')
	dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
	if (index === chooseIndex.value) {
		chooseIndex.value = "";
	}
};

// 展示输入框
const showInput = () => {
	inputVisible.value = true;
	nextTick(() => {
		InputRef.value.input.focus();
	});
};

// 确认数据
const handleInputConfirm = () => {
	if (inputValue.value) {
		dynamicTags.value.push(inputValue.value);
	}
	inputVisible.value = false;
	inputValue.value = "";
};

onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.reason-container {
	.el-tag {
		margin-right: 15px;

		&.is-active {
			background-color: #e6fbf5 !important;
		}
	}
	.el-input {
		margin-top: 15px;
	}
}
</style>