<!-- 折扣 -->
<template>
	<div class="discount-container">
		<!-- 选项卡 -->
		<el-tabs @tab-click="changeTabs" v-model="tabActive">
			<el-tab-pane
				:label="item.label"
				:name="item.value"
				v-for="item in tabData"
				:key="item.label"
			>
				<!-- 折扣类型 -->
				<div v-if="item.value != 'DISHES_DISCOUNT'">
					<p class="title">{{$LANG_TEXT('折扣方式')}}</p>
					<div class="type-radio">
						<el-radio-group v-model="discountMannerVal">
							<el-radio label="ALL" size="large">{{$LANG_TEXT('所有商品')}}</el-radio>
							<el-radio label="NOT_DISCOUNT" size="large">{{$LANG_TEXT('非打折商品')}}</el-radio>
						</el-radio-group>
					</div>
				</div>
				<!-- 现金 -->
				<div v-if="item.value == 'CASH_DISCOUNT'" class="keyboard-box">
					<el-input
						type="number"
						size="large"
						class="big-keyboard"
						v-model.number="cashDiscountValue"
					></el-input>
					<soft-keyboard-number
						@confirm="numberDialogConfirm"
						v-model="cashDiscountValue" @changeInput="keyDown"
					></soft-keyboard-number>
				</div>
				<!-- 订单 -->
				<div v-if="item.value == 'ORDER_DISCOUNT'">
					<second-radio
						:PERCENT_DATA="discountObj.percent"
						:propsModel="{
							typeName: 'orderDiscountType',
							valueName: 'orderDiscount',
						}"
						v-model="order"
					></second-radio>
				</div>
				<!-- 菜品 -->
				<div v-if="item.value == 'DISHES_DISCOUNT'">
					<second-radio
						:QUOTA_DATA="discountObj.quota"
						:PERCENT_DATA="discountObj.percent"
						:propsModel="{
							typeName: 'dishesDiscountType',
							valueName: 'dishesDiscount',
						}"
						v-model="product"
					></second-radio>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	getCurrentInstance,
	computed,
	watch,
	nextTick,
} from "vue";
import secondRadio from "./second-radio.vue";

const emits = defineEmits(["update:modelValue", "numberConfirm","update:discountManner"]);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
	// 是否显示菜品折扣
	showProduct: {
		type: Boolean,
		default: false,
	},
	discountManner: {
		type: String,
		default: "ALL",
	},
});

const { proxy } = getCurrentInstance();
console.log(props);
const keyDown = (value) => {
  console.log(value);
  if (value) {
    value = value + '';
	cashDiscountValue.value = value
  }else {
	cashDiscountValue.value = ''
  }
}
const discountMannerVal = ref(props.discountManner);
watch(()=>discountMannerVal.value,nVal=>{
	// console.log('更新折扣方式:',nVal);
	emits('update:discountManner',nVal)
})
watch(
	() => props.discountManner,
	(nVal) => {
		discountMannerVal.value = nVal;
	}
);

const changeTabs = (e) => {
	// 回复默认
	cashDiscountValue.value = "";
	product.value = defaultProduct();
	order.value = defaultOrder();

	tabActive.value = e.props.name;

	// 查询
	getDiscountList();
};

// 选项卡选择值
const tabActive = ref();
// 选项卡
const tabData = computed(() => {
	const show = props.showProduct;
	const result = [
		{
			label: proxy.$LANG_TEXT("订单折扣"),
			value: "ORDER_DISCOUNT",
		},
		{
			label: proxy.$LANG_TEXT("现金折扣"),
			value: "CASH_DISCOUNT",
		},
	];

	// 显示
	if (show) {
		return [
			{
				label: proxy.$LANG_TEXT("菜品折扣"),
				value: "DISHES_DISCOUNT",
			},
		];
	} else {
		return result;
	}
});

const defaultProduct = () => ({
	dishesDiscount: "",
	dishesDiscountType: "",
});
const defaultOrder = () => ({
	orderDiscount: "",
	orderDiscountType: "",
});
// 菜品折扣
const product = ref(props.modelValue.product || defaultProduct());
// 订单折扣
const order = ref(props.modelValue.order || defaultOrder());
// 赋值
watch(
	() => props.modelValue,
	(nVal) => {
		// console.log(nVal);
		// init(nVal);
	}
);

// 初始
const init = (nVal) => {
	setTimeout(() => {
		// 回显选中折扣
		if (nVal.product) {
			for (let i in product.value) {
				product.value[i] = nVal.product[i];
			}
		} else {
			product.value = defaultProduct();
		}
		if (nVal.order) {
			for (let i in order.value) {
				order.value[i] = nVal.order[i];
			}
		} else {
			order.value = defaultOrder();
		}

		// 订单、现金
		if (!props.showProduct) {
			if (nVal.order.orderDiscountType) {
				tabActive.value = "ORDER_DISCOUNT";
			} else {
				tabActive.value = "CASH_DISCOUNT";
			}
		} else {
			tabActive.value = "DISHES_DISCOUNT";
		}

	});
};

// 回调数据
// 菜品
watch(
	() => product.value,
	(nVal = {}) => {
		const vl = order.value.orderDiscountType;
		console.log('更新菜品',nVal);
		emits("update:modelValue", {
			order: vl ? order.value : props.modelValue.order,
			product: nVal,
			cashDiscountMoney: "",
		});
	}
);
// 订单
watch(
	() => order.value,
	(nVal = {}) => {
		console.log('更新订单',nVal);
		// console.log(order.value);
		// console.log(props.modelValue);
		const vl = product.value.dishesDiscountType;
		emits("update:modelValue", {
			order: nVal,
			product: vl ? product.value : props.modelValue.product,
			cashDiscountMoney: "",
		});
	}
);

// 折扣数据
const discountObj = ref({
	quota: [],
	percent: [],
});
// 查询折扣列表
const getDiscountList = async () => {
	try {
		const discountType = tabActive.value;
		const res = await proxy.$storeDispatch("fetchGetDiscountList", {
			discountType,
		});
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
				value: 100,
			});
		}
		discountObj.value.quota = quotas;
		discountObj.value.percent = percents;
	} catch (error) {}
};

// 现金折扣
const cashDiscountValue = ref(props.modelValue.cashDiscountMoney || "");
// 监听
// 现金
watch(
	() => cashDiscountValue.value,
	(nVal) => {
		console.log('更新现金',nVal);
		emits("update:modelValue", {
			order: order.value,
			product: product.value,
			cashDiscountMoney: nVal,
		});
	}
);
watch(
	() => props.modelValue.cashDiscountMoney,
	(nVal) => {
		cashDiscountValue.value = nVal;
		if (!isEmpty.includes(nVal)) {
			tabActive.value = "CASH_DISCOUNT";
		}
	}
);

const isEmpty = ["", null, undefined];
// 数字键盘确认
const numberDialogConfirm = (call) => {
	if (isEmpty.includes(cashDiscountValue.value)) {
		proxy.$message({
			type: "warning",
			message: proxy.$LANG_TEXT("请先输入现金折扣"),
		});
		call();
		return;
	}

	emits("update:modelValue", {
		order: order.value,
		product: product.value,
		cashDiscountMoney: cashDiscountValue.value,
	});
	emits("numberConfirm", call);
};

onMounted(async () => {

	//初始 赋值选项卡类型
	if (props.showProduct) {
		tabActive.value = "DISHES_DISCOUNT";
	} else {
		tabActive.value = tabData.value[0].value;
	}

	// console.log(props.discountManner)
	// 赋值订单类型
	discountMannerVal.value = props.discountManner;

	await getDiscountList();
	init(props.modelValue);
});
</script>

<style lang="scss" scoped>
.discount-container {
	.title{
		font-size: 16px;
    font-weight: bold;
    line-height: 40px;
	}
	.keyboard-box {
		width: 505px;
		margin: 10px auto;
	}
	.el-form {
		.el-radio-group {
			.el-radio {
				margin-right: 10px;
			}
		}
	}
}
</style>