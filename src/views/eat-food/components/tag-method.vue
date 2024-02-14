<!-- 单选选择项 -->
<template>
	<div class="container">
		<div class="tag-list">
			<el-check-tag
				class="tag"
				size="large"
				v-for="(item, index) in options"
				:key="index"
				:checked="item.checked"
				@change="changeTag(item)"
			>
				<second-language
					:firstText="item[tagProps.keyName]"
					:secondText="item[tagProps.keyNameLanguage]"
				></second-language>
			</el-check-tag>
		</div>
	</div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, onMounted, reactive } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
	options: {
		type: Array,
		default: () => [],
	},
	tagProps: {
		type: Object,
		default: () => ({
			keyName: "name",
			keyNameLanguage: "nameLanguage",
			vlaueName: "id",
		}),
	},
});

const { proxy } = getCurrentInstance();

// 小费
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
		emits("update:modelValue", nVal);
	}
);
// 选择
const changeTag = (item) => {
	value.value = item.id;
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	width: 100%;

	.tag-list {
		// margin: 15px 0;
		width: 100%;
		display: flex;
		// justify-content: space-between;

		> .tag {
			margin-right: 15px;
			margin-bottom: 15px;
		}
		.el-check-tag{
			padding: 5px;
		}
	}

	.el-form {
		width: 92%;
	}
}
</style>