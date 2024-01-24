<template>
	<ml-dialog ref="joinCarRef" :title="dialogTitle" width="60%" height="700px">
		<template #content>
			<div class="dialog-join-car">
				<!-- 菜品 -->
				<div class="spec-list" v-if="goodsType == 'DISHES'">
					<!-- 规格项 -->
					<div
						class="spce-item"
						v-for="(item, index) in currDetail.dishesSpecificationList"
						:key="'goods' + index"
					>
						<p class="item-title">
							<span class="title">
								<second-language
									:firstText="item.name"
									:secondText="item.nameLanguage"
								></second-language>
							</span>
						</p>

						<!-- 规格值 -->
						<div class="spec-child-list">
							<div
								class="child-list-item"
								:class="{ active: chooseSpecIds[index].includes(d.id) }"
								v-for="(d, i) in item.dishesSpecificationAttributeList"
								:key="index + '-' + i"
								@click="changeSpecIds(d.id, index)"
							>
								<second-language
									:firstText="d.name"
									:secondText="d.nameLanguage"
								></second-language>
							</div>
						</div>
					</div>

					<!-- 调味品 -->
					<div
						class="spce-item"
						v-for="(item, index) in currDetail.dishesSpicesList"
						:key="'condiment' + index"
					>
						<p class="item-title">
							<span class="title">
								<second-language
									:firstText="item.name"
									:secondText="item.nameLanguage"
								></second-language>
							</span>
						</p>

						<!-- 调味品值 -->
						<div class="spec-child-list">
							<div
								class="child-list-item"
								:class="{ active: chooseCondmentIds[index].includes(d.id) }"
								v-for="(d, i) in item.dishesSpicesAttributeList"
								:key="'condiment' + index + '-' + i"
								@click="changeCondIds(d.id, index)"
							>
								<second-language
									:firstText="d.name"
									:secondText="d.nameLanguage"
								></second-language>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 套餐 -->
				<div class="spec-list" v-else>
					<!-- 规格项 -->
					<div
						class="spce-item"
						v-for="(item, index) in currDetail.specificationList"
						:key="'goods' + index"
					>
						<div class="item-title">
							<p class="title">
								<second-language
									:firstText="item.name"
									:secondText="item.nameLanguage"
								></second-language>
							</p>
							<p class="tips">
								({{ $LANG_TEXT(`请选择`) }}
								{{
									$LANG_TEXT(item.name, {
										mode: "second",
										secondValue: item.nameLanguage,
									})
								}}
								{{ item.optionalCount }}
								{{ $LANG_TEXT(`份`) }})
							</p>
						</div>

						<!-- 规格值 -->
						<div class="spec-child-list">
							<div
								class="child-list-item"
								:class="{ active: chooseSpecIds[index].includes(d.id) }"
								v-for="(d, i) in item.setMealSpecificationDishesList"
								:key="index + '-' + i"
								@click="changeSpecIds(d.id, index)"
							>
								<second-language
									:firstText="d.name"
									:secondText="d.nameLanguage"
								></second-language>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template #btn>
			<div class="dialog-btn">
				<div class="left">{{ $LANG_TEXT("总计") }}：${{ chooseSpecTotal }}</div>
				<div class="right">
					<el-button type="primary" @click="submitJoinCar">{{
						$LANG_TEXT("加入购物车")
					}}</el-button>
				</div>
			</div>
		</template>
	</ml-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, computed, watch, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const mainModule = proxy.$usePiniaModule("mainModule");

// 基本信息
const baseConfigInfo = computed(() => mainModule.baseConfigInfo);

const emits = defineEmits(["joinCar"]);

const props = defineProps({
	goodsId: {
		type: [String, Number],
		default: "",
	},
	// 菜品类型
	goodsType: {
		type: String,
		default: "",
	},
	// 下单类型
	// 堂食、外卖、自取
	playType: {
		type: String,
		default: "",
	},
	//已加入购物车的skuId
	goodsSkuId: {
		type: [String, Number],
		default:"",
	},
});

// 类型
const type = ref(props.playType);
watch(
	() => props.playType,
	(nVal) => {
		type.value = nVal;
	}
);

watch(
	() => props.goodsId,
	(nVal) => {
		getCurrDetailId();
	}
);

// 弹窗标题
const dialogTitle = computed(() => {
	if (props.goodsType == "DISHES") {
		return "选择规格";
	} else {
		const isSecondLanguage = mainModule.isSecondLanguage;
		if (isSecondLanguage) {
			return currDetail.value.nameLanguage;
		} else {
			return currDetail.value.name;
		}
	}
});

// 判空
const isEmpty = ["", undefined, null];

// 当前菜品信息
const currDetail = ref({});
// 根据菜品Id
const getCurrDetailId = async () => {
	const id = props.goodsId;

	const apiUrl =
		props.goodsType == "DISHES"
			? "fetchGetDishesDetails"
			: "fetchGetSetMealDetails";

	try {
		const res = await proxy.$storeDispatch(apiUrl, id);
		let result = res.result;

		// 堂食、等取
		const eats = ["EAT_IN", "TAKE_FOOD"];
		if (eats.includes(type.value)) {
			const price = result.price;
			const activityPrice = result.activityPrice;
			const showPrice = isEmpty.includes(activityPrice) ? price : activityPrice;
			result.price = showPrice;
			currDetail.value = result;
		} else {
			if (props.goodsType == "DISHES") {
				//外卖
				const activityPrice = result.activityPrice;
				const deliveryPrice = result.deliveryPrice;
				result.price = isEmpty.includes(activityPrice)
					? deliveryPrice
					: activityPrice;
			}

			// 原值
			// if (baseConfigInfo.value.showMoney == "ORIGINAL_VALUE") {
			// } else {
			// 	result.price = Math.round(showPrice);
			// }
			currDetail.value = result;
		}

		console.log(currDetail.value);

		let list = [];
		// 菜品
		if (props.goodsType == "DISHES") {
			list = result.dishesSpecificationList || [];
		} else {
			list = (result.specificationList || []).map((item) => {
				item.setMealSpecificationDishesList = item.dishesList;
				return item;
			});
		}

		// 规格
		// 默认选中每一组的第一个
		chooseSpecIds.value = list.length
			? list.map((item) => [
					(item.dishesSpecificationAttributeList[0] || {}).id,
			  ])
			: [[]];
		// console.log('规格')
		// console.log(list)
		// console.log(chooseSpecIds.value)
		// 调味品
		chooseCondmentIds.value = (result.dishesSpicesList || []).map((item) => []);
	} catch (error) {
		console.log(error);
	}
};

// 当前规格值最多选中数量
const currChangeNum = computed(() => {
	// 菜品
	if (props.goodsType == "DISHES") {
		const list = [
			...currDetail.value.dishesSpecificationList,
			currDetail.value.dishesSpicesList,
		];
		return new Array(list.length).fill([1]);
	} else {
		const list = currDetail.value.specificationList;
		return list.map((item) => item.optionalCount);
	}
});

// 基本 价格
const basePrice = computed(() => {
	const detail = currDetail.value;
	console.log(detail);
	// 菜品
	if (props.goodsType == "DISHES") {
		return detail.price;
	} else {
		//套餐
		return detail.price;
	}
});

// 当前规格列表
const currSpecList = computed(() => {
	if (props.goodsType == "DISHES") {
		return currDetail.value.dishesSpecificationList;
	} else {
		return currDetail.value.specificationList.map((item) => {
			item.setMealSpecificationDishesList = item.dishesList;
			return item;
		});
	}
});
// 当前调味品列表
const currCondments = computed(() => currDetail.value.dishesSpicesList);

// 当前规格列表 子级参数名
const currSpecChildName = computed(() =>
	props.goodsType == "DISHES"
		? "dishesSpecificationAttributeList"
		: "setMealSpecificationDishesList"
);

// 选中规格ID数据
const chooseSpecIds = ref([[]]);

// 调味品选中规格ID数据
const chooseCondmentIds = ref([[]]);

// 选中的数据 规格子级数据组
const chooseSpecData = computed(() => {
	// 数据
	const list = currSpecList.value || [];
	const condiments = currCondments.value || [];

	// 数据名称名称
	const listChildName = currSpecChildName.value;

	let chooseData = [];
	let chooseCondments = [];

	// 初始无值
	if (!list.length && !condiments.length) {
		return [];
	} else {
		if (list.length) {
			// 选中数据
			chooseData = chooseSpecIds.value.reduce((add, currs, index) => {
				const childs = (list[index] || {})[listChildName] || [];

				// 符合条件
				const filters = childs.filter((item) => currs.includes(item.id));

				return add.concat(filters);
			}, []);
		}

		if (condiments.length) {
			// 调味品
			chooseCondments = chooseCondmentIds.value.reduce((add, currs, index) => {
				const childs =
					(currCondments.value[index] || {}).dishesSpicesAttributeList || [];

				// 符合条件
				const filters = childs.filter((item) => currs.includes(item.id));

				return add.concat(filters);
			}, []);
		}
	}

	return [...chooseData, ...chooseCondments];
});
// 选中的数据 的总计价格
const chooseSpecTotal = computed(() => {
	const bPrice = basePrice.value || 0;
	// console.log(bPrice);
	// console.log(chooseSpecData.value);
	if (props.goodsType == "DISHES") {
		return chooseSpecData.value.reduce((add, curr, index) => {
			return (add += curr.price);
		}, bPrice);
	} else {
		return bPrice;
	}
});
// 选中规格ID
const changeSpecIds = (id, pIndex) => {
	actionChooseIds(chooseSpecIds.value, id, pIndex);
};
// 选中规格ID
const changeCondIds = (id, pIndex) => {
	actionChooseIds(chooseCondmentIds.value, id, pIndex);
};
// 处理选中值
const actionChooseIds = (cIds, id, pIndex) => {
	let chooseIds = cIds[pIndex];
	const is = chooseIds.includes(Number(id));
	// 当前规格值选择上限
	const interceptVal = currChangeNum.value[pIndex];

	// console.log(pIndex);
	// console.log(currChangeNum.value
	// console.log(interceptVal);
	// console.log(Array.isArray(interceptVal));
	// console.log(interceptVal.length);
	// console.log(cIds);
	// console.log(pIndex);
	// 单选
	if (Array.isArray(interceptVal) || interceptVal.length <= 1) {
		if (!cIds[pIndex].includes(id)) {
			cIds[pIndex].splice(0);
			cIds[pIndex].push(id);
		}else{
			cIds[pIndex].splice(0);
		}
	} else {
		//多选规格值
		// 是否已选择
		if (is) {
			// 对比规则ID
			const index = chooseIds.findIndex((item) => item == id);
			chooseIds.splice(index, 1);
		} else {
			// 小于规定 选择最大值
			if (chooseIds.length < interceptVal) {
				chooseIds.push(Number(id));
			}
		}
	}

	// console.log(cIds.value);
};

// 确认加入购物车数据
const sureCarData = computed(() => {
	// 原数据
	// 数据
	const list = JSON.parse(JSON.stringify(currSpecList.value || []));
	// 数据名称
	const listChildName = currSpecChildName.value;

	// 选中数据ID
	const idss = chooseSpecIds.value;

	// 已选择的规格项
	const chooseSpecs = list
		.filter((item, index) => {
			const currIds = idss[index];
			const childs = item[listChildName];

			// 存在 [xx,xx]
			if (currIds.length) {
				// 筛选
				item[listChildName] = childs.filter((item) =>
					currIds.includes(item.id)
				);
				return item;
			} else {
				return;
			}
		})
		.filter((item) => item);

	return chooseSpecs;
});
// 调味品
const sureCondmentCarData = computed(() => {
	// 原数据
	// 数据
	const condmentList = JSON.parse(JSON.stringify(currCondments.value || []));

	// 选中数据ID
	const idss = chooseCondmentIds.value;

	// 已选择的调味品
	const chooseCondments = condmentList
		.filter((item, index) => {
			const currIds = idss[index];
			const childs = item.dishesSpicesAttributeList;

			// 存在 [xx,xx]
			if (currIds.length) {
				// 筛选
				item.dishesSpicesAttributeList = childs.filter((item) =>
					currIds.includes(item.id)
				);
				return item;
			} else {
				return;
			}
		})
		.filter((item) => item);

	return chooseCondments;
});

// 加入购物车
const submitJoinCar = () => {
	// 原数据子级数据名称
	const listChildName = currSpecChildName.value;
	const obj = JSON.parse(JSON.stringify(currDetail.value));
	delete obj["dishesSpicesList"];
	delete obj["dishesSpecificationList"];
	obj.goodsId = obj.id;
	obj.goodsType = props.goodsType;
	delete obj["id"];

	if (props.goodsType == "DISHES") {
		// 规格
		obj.dishesSpecificationList = sureCarData.value;
		// 调味品
		obj.dishesSpicesList = sureCondmentCarData.value;
	} else {
		obj.specificationList = sureCarData.value;
	}

	const dataIds = sureCarData.value.reduce((add, curr, index) => {
		const childs = curr[listChildName];
		add.push(curr.id);
		const ids = childs.map((item) => item.id);
		return add.concat(ids);
	}, []);

	// 调味品
	const condmentDataIds = sureCondmentCarData.value.reduce(
		(add, curr, index) => {
			const childs = curr.dishesSpicesAttributeList;
			add.push(curr.id);
			const ids = childs.map((item) => item.id);
			return add.concat(ids);
		},
		[]
	);

	//本地使用 唯一标识
	console.log("before make a new skuid, the original id is " +props.goodsSkuId);
	obj.skuId = props.goodsSkuId;
	if(isEmpty.includes(props.goodsSkuId)){
		console.log("make a new skuid for new item in the cart")
		obj.skuId = `${obj.goodsId}-${
		dataIds.join("-") + "-" + condmentDataIds.join("-")}`
		console.log("new skuid for new item in the cart is "+ obj.skuId)
	}
	// 校验 提示语
	const tips = currSpecList.value
		.filter((item, index) => {
			const itemIds = chooseSpecIds.value[index];
			return !itemIds.length;
		})
		.map((item) => {
			const name = item.name;
			const nameLanguage = item.nameLanguage;
			return proxy.$LANG_TEXT(name, {
				mode: "second",
				secondValue: nameLanguage,
			});
		});

	// 拦截校验
	if (tips.length) {
		proxy.$message({
			type: "warning",
			message: `${proxy.$LANG_TEXT("请先选择")}${tips.join("、")}`,
		});
		return;
	}
	console.log(obj)
	emits("joinCar", obj);
};

// ref
const joinCarRef = ref();

// 打开弹窗
const openDialog = () => {
	joinCarRef.value.openDialog();
};
// 关闭弹窗
const closeDialog = () => {
	joinCarRef.value.closeDialog();
};

onMounted(() => {
	if (props.goodsId) {
		getCurrDetailId();
	}
});

defineExpose({
	openDialog,
	closeDialog,
});
</script>

<style lang="scss" scoped>
.dialog-join-car {
	min-height: 200px;
	.spec-list {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;

		.spce-item {
			color: black;
			.item-title {
				line-height: 50px;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;

				.title {
					font-weight: bold;
					font-size: 18px;
				}
				.tips {
					font-size: 14px;
					color: #c4c4c4;
					margin-left: 10px;
				}
			}

			.spec-child-list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;

				.child-list-item + .child-list-item {
					margin-left: 15px;
				}
				.child-list-item {
					font-size: 14px;
					padding: 8px 16px;
					border-radius: 20px;
					min-width: 80px;
					text-align: center;
					border: 1px solid #c4c4c4;
					cursor: pointer;

					&:active {
						opacity: 0.7;
					}
					&.active {
						background-color: #05d69d;
						border: 1px solid #05d69d;
						color: white;
					}

					&:nth-child(1) {
						margin-left: 0;
					}
				}
			}
		}
	}
}
.dialog-btn {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: space-between;
	padding-top: 10px;

	.left {
		font-size: 20px;
		font-weight: bold;
	}

	.right {
		width: 150px;

		button {
			width: 100%;
		}
	}
}
</style>