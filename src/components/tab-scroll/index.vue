<!-- 键盘按键 -->

<template>
	<el-tabs class="product-classify" v-model="value">
		<el-tab-pane
			:label="item[dataProps.keyName]"
			v-for="(item,index) in tabData"
			:key="'el-tab-pane'+index"
			:name="item[dataProps.valueName]"
		></el-tab-pane>
	</el-tabs>
</template>

<script setup>
import { ref, watch, getCurrentInstance, computed } from "vue";
const emits = defineEmits(["update:modelValue"]);
const { proxy } = getCurrentInstance();

const mainModule = proxy.$usePiniaModule("mainModule");

const props = defineProps({
	data: {
		type: Object,
		default: () => [],
	},
	modelValue: {
		type: [String, Number],
		default: "",
	},
	options: {
		type: Object,
		default: () => ({
			keyName: "name",
			valueName: "value",
		}),
	},
	optionsSecond: {
		type: Object,
		default: () => ({
			keyName: "name",
			valueName: "value",
		}),
	},
});

console.log(props.data);
// 数据配置
const dataProps = computed(() => {
	const isSecondLanguage = mainModule.isSecondLanguage;

	// 使用第二语言
	if (isSecondLanguage) {
		return props.optionsSecond;
	} else {
		return props.options;
	}
});

// 选中值
const value = ref(props.modelValue);
watch(
	() => value.value,
	(nVal) => {
		emits("update:modelValue", nVal);
	}
);
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal;
	}
);

// 数据
const tabData = ref(props.data);
watch(
	() => props.data,
	(nVal) => {
		tabData.value = nVal;
		// console.log(nVal);
		// console.log(dataProps);
	}
);
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.product-classify {
	.el-tabs__header {
		.el-tabs__nav-wrap {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			padding: 0 40px;
			background-color: white;
			border-radius: 5px;
			&::after {
				display: none;
			}

			.el-tabs__nav-prev,
			.el-tabs__nav-next {
				line-height: 0;

				.el-icon {
					font-size: x-large;
				}
			}
			.el-tabs__nav-prev {
				left: 10px;
			}
			.el-tabs__nav-next {
				right: 10px;
			}

			.el-tabs__nav-scroll {
				.el-tabs__nav {
					padding: 5px 0;
					// 底部选中效果
					.el-tabs__active-bar {
						display: none;
					}

					.el-tabs__item {
						padding: 0;
						width: fit-content;
						min-width: 100px;
						text-align: center;
						font-size: 22px;
						border-radius: 10px;
						transition: background 100ms;
						height: 45px;
						line-height: 45px;
						width: fit-content;
						padding: 0 10px;

						&.is-active {
							background: #05d69d;
							box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
							color: white;
						}
					}
				}
			}
		}
	}
}
</style>