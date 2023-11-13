<!-- 抹零 -->
<template>
	<div class="not-count-container">
		<div class="price-box">
			<p class="label">{{$LANG_TEXT('应收金额')}}：</p>
			<p class="value">${{ (Number(afterPrice) || 0).toFixed(2) }}</p>
		</div>

		<!-- 抹零操作 -->
		<div class="not-count">
			<el-radio-group v-model="notCountValue" size="large">
				<el-radio-button
					:label="item.value"
					v-for="(item, index) in notCountOpts()"
					:key="index"
				>
					{{ $LANG_TEXT(item.label) }}
				</el-radio-button>
			</el-radio-group>
		</div>
	</div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, computed, onMounted } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({
			maLingMoney: "",
			maLingType: "NO",
			maLingText: "不抹",
		}),
	},
});

const { proxy } = getCurrentInstance();

// console.log(props);

// 抹零数据
const notCountValue = ref(props.modelValue.maLingType);
// 价格
const priceValue = ref(props.modelValue.maLingMoney);

watch(props.modelValue, (nVal) => {
	init(nVal);
});

// 初始
const init = (value) => {
	priceValue.value = value.maLingMoney;
	notCountValue.value = value.maLingType;
	updateCallData(notCountValue.value)
};


// 抹零后的价格
const afterPrice = computed(() => {
	const notCount = notCountValue.value;
	const value = priceValue.value;

	// console.log(props.modelValue)
	// console.log(value)
	// console.log(notCount)
	// console.log(proxy.$erasurePrice(value,notCount))

	return proxy.$erasurePrice(value, notCount);
});

watch(()=>notCountValue.value, (nVal) => {
	updateCallData(nVal)
});

// 更新回显数据
const updateCallData = (maLingType)=>{
	const potItem = notCountOpts().find((item) => item.value == maLingType);
	const maLingMoney = (Number(afterPrice.value) || 0).toFixed(2);
	console.log(maLingMoney);
	emits("update:modelValue", {
		maLingMoney,
		maLingType,
		maLingText: potItem.label,
	});
}

// 抹零options
const notCountOpts = () => [
	{
		label: proxy.$LANG_TEXT("不抹"),
		value: "NO",
	},
	{
		label: proxy.$LANG_TEXT("抹元"),
		value: "YUAN",
	},
	{
		label: proxy.$LANG_TEXT("抹角"),
		value: "ANGLE",
	},
	{
		label: proxy.$LANG_TEXT("抹分"),
		value: "POINTS",
	},
];


onMounted(() => {
	init(props.modelValue);
});
</script>

<style lang="scss" scoped>
.not-count-container {
	.price-box {
		line-height: 50px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
}
</style>