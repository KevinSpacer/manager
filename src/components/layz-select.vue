<template>
	<!-- 下拉选择+底部分页懒加载数据+动态数据搜索 -->
	<div class="select-box">
		<el-select
			ref="selectRef"
			:disabled="disabled"
			:popper-append-to-body="false"
			:filter-method="filterMethod"
			:popper-class="popperClass"
			v-model="value"
			:placeholder="placeholder"
			filterable
			clearable
			@change="resetValue"
			@visible-change="showPopper"
			@clear="clearFilter"
		>
			<slot
				:data="{
					result: options,
					props: masterProps,
				}"
			>
				<el-option
					v-for="(item, index) in options"
					:key="'options' + index"
					:label="item[masterProps.labelKey]"
					:value="item[masterProps.valueKey]"
				>
					{{ item[masterProps.labelKey] }}
				</el-option>
			</slot>

			<div class="select-loading" v-if="showLoading != 'ready'">
				<el-icon color="gray" class="loading-icon" v-if="showLoading"
					><Loading
				/></el-icon>
				<span v-else>{{$LANG_TEXT('暂无更多')}} ~</span>
			</div>
		</el-select>
	</div>
</template>

<script setup>
import {
	reactive,
	ref,
	computed,
	watch,
	toRefs,
	getCurrentInstance,
	onMounted,
	nextTick,
} from "vue";
const { proxy } = getCurrentInstance();

const mainModule = proxy.$usePiniaModule("mainModule");

const selectRef = ref();

const emits = defineEmits(["scrolltolower", "update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: "",
	},
	placeholder: {
		type: String,
		default: "请选择",
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	// 第二语言设置参数
	selectPropsSecond: {
		type: Object,
		default: () => ({
		}),
	},
	selectProps: {
		type: Object,
		default: () => ({
			labelKey: "label",
			valueKey: "value",
		}),
	},
	filterable: {
		type: Boolean,
		default: true,
	},
	// 唯一class
	popperClass: {
		type: String,
		default: "select-popper",
	},
	// 调用接口名
	disApiName: {
		type: String,
		default: "",
	},
	// 列表请求函数名
	storeDispatchName: {
		type: String,
		default: "",
	},
	clearable: {
		type: Boolean,
		default: true,
	},
	// 筛选参数名称
	filterName: {
		type: String,
		default: "name",
	},
	// 筛选参数名称
	filterId: {
		type: String,
		default: "id",
	},
	// 筛选参数中 固定查询
	lastingParams: {
		type: Function,
		default: () => {},
	},
});

// 使用的语言参数
const masterProps = computed(() => {
	const is = mainModule.isSecondLanguage;
	const secondProps = props.selectPropsSecond
	
	return is ?  (!Object.keys(secondProps).length?props.selectProps:secondProps): props.selectProps;
});
// 选择器值
let value = ref(props.modelValue);

// 赋值
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal ? String(nVal) : nVal;

		// 回显时 赋值选中字段 以免分页状态下丢失选项
		const findItem =
			options.value.find((item) => item[masterProps.value.valueKey] == nVal) ||
			{};
		params[props.filterName] = findItem[masterProps.value.labelKey] || "";
		params[props.filterId] = nVal || "";
		// console.log('回显时 赋值选中字段')
		// console.log(value.value)
		proxy.$forceUpdate();
	}
);

// 回显
watch(
	() => value.value,
	(nVal) => {
		// console.log('value.value')
		// console.log(nVal)
		// console.log(options.value)
		// console.log(selectRef.value)
		emits("update:modelValue", nVal);
	}
);

// 选择数据
const options = ref([]);

// 重置懒加载
watch(
	() => options.value,
	(nVal) => {
		showLoading.value = "ready";
	}
);

// 加载参数
const params = reactive({
	pageNum: 1,
	pageSize: 10,
});
// 当前数据
const currList = ref([]);

// 监听加载
watch(
	() => currList.value,
	(nVal) => {
		// console.log(nVal);
		// 暂无数据|当前页无数据
		if (!nVal.length) {
			if (params.pageNum == 1) {
				showLoading.value = "ready";
			} else {
				showLoading.value = false;
			}
		}
	}
);

// 查询下拉列表接口
const getSelectList = (requestType) => {
	if (requestType == "info") {
		params.pageNum = 1;
	}

	for (let i in props.lastingParams()) {
		const val = props.lastingParams()[i];
		params[i] = val;
	}

	return proxy
		.$storeDispatch(props.storeDispatchName, params)
		.then((res) => {
			const valueKey = masterProps.value.valueKey;

			const result = (res.result || []).map((item) => {
				item[valueKey] = (item[valueKey] || "").toString();
				return item;
			});
			currList.value = result;

			// 无数据&&带值筛选
			if (
				!result.length &&
				(params[props.filterId] || params[props.filterId])
			) {
				value.value = "";
			}

			if (requestType == "info") {
				options.value = result;
			} else if (requestType == "update") {
				options.value.push(...result);
			}
		})
		.catch((res) => {
			if (showLoading.value != "ready") {
				params.pageNum -= 1;
				showLoading.value = false;
			}
		});
};

// 计时器
let filterTimeId = null;
// 筛选操作方法
const filterMethod = (e) => {
	params[props.filterName] = e;
	// console.log(e)
	filterTimeId = setTimeout(() => {
		clearTimeout(filterTimeId);
		filterTimeId = null;
		value.value = "";

		// 参数不相同
		if (props.filterId !== props.filterName) {
			params[props.filterId] = "";
		}
		// 关闭懒加载提示
		showLoading.value = false;
		getSelectList("info");
	}, 300);
};
// 清除
const clearFilter = () => {
	resetValue();
	getSelectList("info");
};

// 重置 筛选数据
const resetValue = () => {
	params[props.filterName] = "";
	params[props.filterId] = "";
};

// 是否显示加载
const showLoading = ref("ready");

// 触碰底部
const scrolltolower = () => {
	// console.log("scrolltolower");
	// console.log(props.popperClass);
	if (currList.value.length) {
		// 显示懒加载
		showLoading.value = true;
		params.pageNum += 1;
		resetValue();
		getSelectList("update");
	} else {
		showLoading.value = false;
	}

	// emits("scrolltolower", showLoading);
};

// 是否已设置监听scroll
let isSetScroll = ref(false);

// 监听popper显隐
const showPopper = (show) => {
	// const filterId = params[props.filterId]
	// const label = params[props.filterName]

	nextTick(() => {
		if (show) {
			// console.log(show)
			// console.log(options.value)
			// console.log(options.value.slice(0,10))
			// 筛选前十个
			const isCurrPage = options.value
				.slice(0, 10)
				.filter((item) => item[masterProps.value.valueKey] == value.value);
			// console.log(value.value)
			// console.log(filterId)
			// console.log(label)
			// console.log(isCurrPage)
			// console.log(isSetScroll)

			console.log(isCurrPage);

			// 不是当前页
			if (!isCurrPage.length) {
				params[props.filterId] = value.value;
			} else {
			}

			// 初始
			if (!isSetScroll.value) {
				const SELECTWRAP_DOM = document.querySelector(
					`.${props.popperClass} .el-select-dropdown__wrap`
				);
				if (SELECTWRAP_DOM) {
					SELECTWRAP_DOM.addEventListener("scroll", function () {
						const CONDITION =
							this.scrollHeight - this.scrollTop <= this.clientHeight;

						// 触底
						if (CONDITION) {
							scrolltolower();
						}
					});
					isSetScroll.value = true;
				}
			}
		} else {
			if (!value.value) {
				clearFilter();
			}
		}

		// 关闭懒加载提示
		showLoading.value = "ready";
	});
};

defineExpose({
	getSelectList,
	options,
});
</script>

<style lang="scss" scoped>
.select-box {
}

.select-loading {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding-top: 5px;

	.loading-icon {
		animation: rotate 1s linear infinite;

		@keyframes rotate {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}
	}

	span {
		font-size: 12px;
		color: var(--el-color-info);
	}
}
</style>