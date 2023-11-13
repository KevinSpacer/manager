<template>
	<div class="eat-food-box">
		<!-- 右侧购物车菜单 -->
		<div class="cart-container">
			<!-- 购物车 -->
			<div class="car-menu-box">
				<!-- 人数、座位、服务员 -->
				<!-- 堂食 -->
				<div class="top-show-info" v-if="routeParams.type == 'EAT_IN'">
					<div
						class="peopel btn oneLineOver"
						@click="openPeopelDialog('peopel')"
					>
						<span>{{ $LANG_TEXT("人数") }}：</span>
						<span>{{ routeParams.peopleQuantity }}</span>
					</div>
					<div class="intercept btn oneLineOver" @click="openSeatDialog">
						<span>{{ $LANG_TEXT("座位") }}：</span>
						<span>{{ routeParams.location }}</span>
					</div>
					<div class="waiter btn oneLineOver" @click="openWaiterNameDialog">
						<span>{{ $LANG_TEXT("服务员") }}：</span>
						<span>{{ routeParams.waiterName }}</span>
					</div>
				</div>
				<!-- 客户、终端号、服务员 -->
				<!-- 其他 -->
				<div class="top-show-info" @click="openCustomerDialog" v-else>
					<div class="peopel btn oneLineOver">
						<span>{{ $LANG_TEXT("客户") }}：</span>
						<span>{{ routeParams.userName }}</span>
					</div>
					<div class="intercept btn oneLineOver">
						<span>{{ $LANG_TEXT("号码") }}：</span>
						<span>{{ routeParams.contactWay }}</span>
					</div>
					<div
						class="waiter btn oneLineOver"
						@click.stop="openWaiterNameDialog"
					>
						<span>{{ $LANG_TEXT("服务员") }}：</span>
						<span>{{ routeParams.waiterName }}</span>
					</div>
				</div>

				<!-- 购物车内容 -->
				<div class="car-container">
					<!-- 标题头 -->
					<div class="table-theader">
						<p>{{ $LANG_TEXT("商品") }}</p>
						<p>{{ $LANG_TEXT("数量") }}</p>
						<p class="oneLineOver">{{ $LANG_TEXT("金额") }}</p>
					</div>

					<!-- 内容 -->
					<div class="content">
						<div class="table-list ml-scrollbar">
							<div v-if="addedToCart.length">
								<!-- 菜品 -->
								<div
									class="list-item"
									:class="{ revoke: item.revocationStatus }"
									v-for="(item, index) in addedToCart"
									:key="'car-item' + index"
								>
									<!-- 菜品、套餐 -->
									<div class="first-item">
										<div class="product-name">
											<second-language
												class="oneLineOver"
												:firstText="item.name"
												:secondText="item.nameLanguage || item.name"
											></second-language>
										</div>
										<div class="product-num">
											<span>{{ item.goodsQuantity }}</span>
										</div>
										<div class="product-price">
											${{ (item.price * item.goodsQuantity || 0).toFixed(2) }}

											<div
												class="delete-action"
												@click="deleteDishes(item, index)"
												v-if="
													orderDetail.status == 'FINISH' &&
													!item.revocationStatus
												"
											>
												<el-icon size="14px"><DeleteFilled /></el-icon>
											</div>
										</div>
									</div>

									<!-- 规格 -->
									<list-item :goodsDetail="item"></list-item>
								</div>
							</div>

							<!-- 缺省 -->
							<el-empty
								class="ml-empty"
								v-else
								:description="$LANG_TEXT('暂无数据')"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 订单详情 -->
		<div class="order-detail">
			<h3 class="order-status">
				<span>{{ $LANG_TEXT("订单状态") }}：</span>
				<span>{{ $LANG_TEXT(orderStatusText) }}</span>
			</h3>

			<!-- 基本新 -->
			<div class="base-address">
				<p>
					<span>{{ $LANG_TEXT("订单号") }}：</span>
					<span>{{ routeParams.orderId }}</span>
				</p>
				<p>
					<span>{{ $LANG_TEXT("地址") }}：</span>
					<span>{{ routeParams.address || $LANG_TEXT("暂无") }}</span>
				</p>
				<p>
					<span>{{ $LANG_TEXT("备注") }}：</span>
					<span>{{ routeParams.remark || $LANG_TEXT("暂无") }}</span>
				</p>
				<p>
					<span>{{ $LANG_TEXT("是否免单") }}：</span>
					<span>{{ $LANG_TEXT(isStatus[orderDetail.isFreeOrder]) }}</span>
				</p>
				<p v-if="orderDetail.freeOrderReason">
					<span>{{ $LANG_TEXT("免单理由") }}：</span>
					<span>{{ orderDetail.freeOrderReason || $LANG_TEXT("暂无") }}</span>
				</p>
				<p v-if="orderDetail.canceledReason">
					<span>{{ $LANG_TEXT("取消理由") }}：</span>
					<span>{{ orderDetail.canceledReason || $LANG_TEXT("暂无") }}</span>
				</p>
			</div>

			<!-- 订单明细 -->
			<price-details :orderId="routeParams.orderId"></price-details>

			<!-- 基本信息 -->
			<div class="base-address">
				<p>
					<span>{{ $LANG_TEXT("支付类型") }}：</span>
					<span>{{ orderPayStatus[orderDetail.initiatePayType] }}</span>
				</p>
				<p>
					<span>{{ $LANG_TEXT("点餐类型") }}：</span>
					<span>{{
						$LANG_TEXT(
							(orderTypes.find((item) => item.value == orderDetail.type) || {})
								.label
						)
					}}</span>
				</p>

				<!-- 退款 条件：已支付 -->
				<el-button
					type="danger"
					v-if="orderDetail.status == 'FINISH'"
					@click="openPayOutDialog"
				>
					{{ $LANG_TEXT("退款") }}
				</el-button>
				<!-- 打印 -->
				<el-button
					type="primary"
					v-if="orderDetail.status == 'FINISH'"
					@click="printOrder"
				>
					{{ $LANG_TEXT("打印账单") }}
				</el-button>
			</div>

			<!-- 订单支付列表 -->
			<div class="order-list ml-scrollbar">
				<div
					class="order-item"
					v-for="(item, index) in payOrderList"
					:key="index"
				>
					<div class="title">
						<span class="name" v-if="item.paymentMethodName">
							<second-language
								:firstText="item.paymentMethodName"
								:secondText="item.paymentMethodNameLanguage"
							></second-language>
						</span>
						<span class="name" v-else>
							{{ $LANG_TEXT("金额") }}{{ index + 1 }}
						</span>
						<span class="price"> ${{ item.payAmount }} </span>
					</div>
					<div class="status">
						{{ orderStatus[item.status] }}
					</div>
				</div>
			</div>

			<!-- 退款列表 -->
			<div class="order-list payOut ml-scrollbar" v-if="payOutList.length">
				<div class="pay-out-title">
					{{ $LANG_TEXT("退款明细") }}
				</div>
				<div
					class="order-item"
					v-for="(item, index) in payOutList"
					:key="index"
				>
					<div class="title">
						<span class="name">
							<second-language
								:firstText="item.paymentMethodName"
								:secondText="item.paymentMethodNameLanguage"
							></second-language>
						</span>
						<span class="price"> ${{ item.refundAmount }} </span>
					</div>
					<div class="status">
						{{ $LANG_TEXT("已退款") }}
					</div>
				</div>
			</div>

			<!-- 小费列表 -->
			<div class="order-list ml-scrollbar">
				<div class="pay-out-title">
					{{ $LANG_TEXT("小费明细") }}
				</div>
				<div class="order-item" v-for="(item, index) in tipData" :key="index">
					<div class="title">
						<span class="name">
							<second-language
								:firstText="item.paymentMethodName"
								:secondText="item.paymentMethodNameLanguage"
							></second-language>
						</span>
						<span class="price"> ${{ item.payAmount }} </span>
					</div>
					<div class="status">
						{{ $LANG_TEXT("已支付") }}
					</div>
				</div>
			</div>
		</div>
	</div>

	<ml-dialog
		width="600px"
		:showClose="false"
		ref="payOutDialogRef"
		:showBtn="false"
	>
		<template #content>
			<payment-box
				:openPayBtn="true"
				v-model="payOutParms"
				:showDirect="false"
				:showGive="false"
				@confirm="payOutConfirm"
			></payment-box>
			<!-- <el-form>
        <el-form-item>
          <el-input
            class="big-keyboard"
            size="large"
            v-model.number="payOutCount"
          ></el-input>
        </el-form-item>
      </el-form>

      <keyboard-number v-model="payOutCount" @confirm="payOutConfirm">
      </keyboard-number> -->
		</template>
	</ml-dialog>

	<!-- 人数键盘弹窗 -->
	<ml-dialog
		:showBtn="false"
		ref="peopelDialogRef"
		:title="$LANG_TEXT(peopelDialogTitles[peopelType])"
	>
		<template #content>
			<div class="number-dialog-box">
				<div class="input-box">
					<el-form>
						<el-form-item>
							<el-input
								class="big-keyboard"
								v-model.number="peopelValue"
							></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="number-keyboard">
					<soft-keyboard-number
						@confirm="peopelDialogConfirm"
						v-model="peopelValue"
					></soft-keyboard-number>
				</div>
			</div>
		</template>
	</ml-dialog>

	<!-- 座位键盘弹窗 -->
	<ml-dialog
		width="595px"
		:showBtn="false"
		ref="seatDialogRef"
		:title="$LANG_TEXT('更新座位')"
	>
		<template #content>
			<div class="number-dialog-box">
				<div class="input-box">
					<el-form>
						<el-form-item>
							<el-input class="big-keyboard" v-model="seatValue"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="number-keyboard">
					<soft-keyboard-number
						type="seat"
						@confirm="seatDialogConfirm"
						v-model="seatValue"
					></soft-keyboard-number>
				</div>
			</div>
		</template>
	</ml-dialog>

	<!-- 客户基本信息弹窗 -->
	<customer-user-dialog
		v-model:data="customerData"
		@confirm="customerConfirm"
		ref="customerDialogRef"
	>
	</customer-user-dialog>

	<!-- 服务员表格弹窗 -->
	<ml-dialog
		width="595px"
		ref="waiterNameDialogRef"
		:title="$LANG_TEXT('选择服务员')"
		:showBtn="false"
	>
		<template #content>
			<div class="filter-box"></div>

			<div class="table-box">
				<!-- 表格 -->
				<ml-table
					@currentChange="currentChangeWaiterName"
					ref="tableRef"
					:tableData="tableData"
					:templateData="templateData"
					:pageParams="pageParams"
				>
					<template #waiterType="{ row }">
						{{
							$LANG_TEXT(userTypes.find((d) => d.value == row.waiterType).label)
						}}
					</template>
				</ml-table>
			</div>
		</template>
	</ml-dialog>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted,
	watch,
	getCurrentInstance,
	computed,
	nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { orderTypeOpts, userTypeOpts } from "@/utils/options";
import listItem from "../../eat-food/components/list-item.vue";
import customerUserDialog from "../../eat-food/components/customer-user-dialog.vue";
import priceDetails from "../../eat-food/components/price-details.vue";
import paymentBox from "../../eat-food/components/payment-box.vue";

const { proxy } = getCurrentInstance();

const route = useRoute();
const routeQuery = reactive(route.query || {});
const router = useRouter();

const orderTypes = orderTypeOpts();

// 用户类型
const userTypes = userTypeOpts();

// 携带参数
const routeParams = reactive({
	orderId: "",
	id: "",
	serveDishesWay: proxy.$LANG_TEXT("无"),
	remark: proxy.$LANG_TEXT("无"),
	type: "",
	peopleQuantity: "",
	location: "",
	userName: "",
	contactWay: "",
	address: "",
	waiterName: "",
});

// 基本信息
const baseInfos = ref([]);

// 全局模块
const { eatFoodModule, mainModule } = proxy.$usePiniaModule();
// 已加入购物车
const { addedToCart } = storeToRefs(eatFoodModule);

// 基本信息
const baseConfigInfo = computed(() => mainModule.baseConfigInfo);

// 判断百分比、定额
const getPercentageQuota = (result, pot) => {
	const { valueName, typeName } = pot || {};
	const value = result[valueName];
	const type = result[typeName];
	if (type == "PERCENT") {
		return `${value}%`;
	} else {
		return `$${value}`;
	}
};

// 是否
const isStatus = {
	YES: "是",
	NO: "否",
};

// 判空
const isEmpty = ["", undefined, null];

// 多功能表单
const toolForm = reactive({
	remark: "",
	// 折扣
	discount: {
		cashDiscountMoney: "",
		order: {
			orderDiscount: "",
			orderDiscountType: "",
		},
		product: {
			dishesDiscount: "",
			dishesDiscountType: "",
		},
	},
	// 抹零
	notCount: {
		maLingMoney: "",
		maLingType: "NO",
		maLingText: "不抹",
	},
	// 服务费
	service: {
		serviceChargeType: "",
		serviceCharge: "",
	},
	// 小费
	tip: {
		payAmount: "",
		paymentMethodName: "",
		paymentMethodNameLanguage: "",
	},
	// 税率
	taxRate: 0,
	// 合单
	consolidated: {
		mainOrder: "",
		order: "",
	},
	// 分额
	partialPay: {
		amount: [],
		dividedNumber: 0,
	},
	// 取消订单原因
	cancelingOrder: "",
	// 免单原因
	freeChargeReason: "",
	// 免单金额
	freeChargePrice: "",
});

// 订单数据查询
// 数据
const stagingCarData = ref([]);
// 获取暂存购物单列表
const getTemporaryOrderShoppingList = async (id) => {
	try {
		const res = await proxy.$storeDispatch(
			"fetchGetTemporaryOrderShoppingList",
			id
		);
		const result = res.result;
		stagingCarData.value = result;

		setAddCarData(result);
	} catch (error) {}
};
// 数据
const orderCarData = ref([]);
// 获取订单购物单列表
const getOrderShoppingList = async (id) => {
	try {
		const res = await proxy.$storeDispatch("fetchGetOrderShoppingList", id);
		const result = res.result;
		orderCarData.value = result;

		setAddCarData(result, "playOrder");
	} catch (error) {}
};

// 赋值添加购物车数据
const setAddCarData = (result, type) => {
	// 赋值添加购物车数据
	setTimeout(() => {
		const addedCarDataResult = result.reduce((add, curr) => {
			return add.concat(toAddedCarData(curr.goodsList, type));
		}, []);
		addedToCart.value = JSON.parse(JSON.stringify(addedCarDataResult));
		console.log(addedCarDataResult);
		// console.log(addedToCart)
	});
};

//接口数据 转 加入购物车本地数据
const toAddedCarData = (list) => {
	return list.map((item) => {
		const {
			// 自定义菜品
			customDishes,
			// 调味品
			dishesSpicesList = [],
			// 自定义调味品
			customDishesSpicesList,
			// 菜品信息
			dishes = {},
			stockCount,
			goodsId,
			id,
			dishesDiscount,
			dishesDiscountType,
			goodsQuantity,
			goodsPrice,
			goodsType,
			// 套餐
			setMeal,
			status,
			revocationStatus,
		} = item;

		const result = {
			goodsId,
			shopId: id,
			goodsQuantity,
			goodsPrice,
			dishesDiscount,
			dishesDiscountType,
			isDiscount: (dishes || {}).isDiscount,
			isTaxRate: (dishes || {}).isTaxRate,
			price: goodsPrice,
			stockCount,
			goodsType,
			status,
			revocationStatus,
		};

		// 调味品
		result.dishesSpicesList = dishesSpicesList;
		// 自定义调味品
		result.customDishesSpicesList = customDishesSpicesList;

		// DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐
		if (goodsType == "DISHES") {
			// 赋值
			dishes.price = goodsPrice;
			Object.assign(result, dishes);
		} else if (goodsType == "CUSTOM_DISHES") {
			const obj = customDishes || {};
			result.name = obj.name;
			result.orderShoppingGoodsId = obj.orderShoppingGoodsId;
			result.orderShoppingId = obj.orderShoppingId;
			result.price = obj.price;
		} else if (goodsType == "SET_MEAL") {
			Object.assign(result, setMeal);
			result.specificationList = setMeal.setMealSpecificationList.map((d) => {
				const child = d.setMealSpecificationDishesList;
				d.setMealSpecificationDishesList = child.map((e) => {
					e.id = e.dishesId;
					return e;
				});
				return d;
			});
			// console.log(result)
			// .map((d) => {
			// d.dishesList = d.setMealSpecificationDishesList;
			// 	return d;
			// });
		}

		// 菜品、套餐
		if (goodsType == "DISHES" || goodsType == "SET_MEAL") {
			// 当前规格列表 子级参数名
			const currSpecChildName =
				goodsType == "DISHES"
					? "dishesSpecificationAttributeList"
					: "setMealSpecificationDishesList";
			// 规格数据
			const sureCarData =
				goodsType == "DISHES"
					? result.dishesSpecificationList || []
					: result.specificationList || [];
			// 规格ID
			const dataIds = sureCarData.reduce((add, curr, index) => {
				const childs = curr[currSpecChildName];
				add.push(curr.id);
				const ids = childs.map((item) => item.id);
				return add.concat(ids);
			}, []);
			// 规格ID
			const condmentDataIds = result.dishesSpicesList.reduce(
				(add, curr, index) => {
					const childs = curr.dishesSpicesAttributeList;
					add.push(curr.id);
					const ids = childs.map((item) => item.id);
					return add.concat(ids);
				},
				[]
			);
			//本地使用 唯一标识
			result.skuId = `${result.goodsId}-${
				dataIds.join("-") + "-" + condmentDataIds.join("-")
			}`;
		}

		// 打折金额
		result.discountPrice = proxy.$sumDisheDiscountPrice(result);

		// console.log(result);
		return result;
	});
};

// 订单详情
const orderDetail = ref({});
// 根据ID查询订单详情
const getOrderIdDetail = async (id) => {
	try {
		const res = await proxy.$storeDispatch("fetchGetOrderDetails", id);
		const result = res.result;

		// 订单
		if (result.discountType == "ORDER") {
			result.cashDiscountMoney = 0;
		} else {
			//现金
			result.orderDiscount = 0;
			result.orderDiscountType = "";
		}
		orderDetail.value = result;

		const params = {
			type: "",
			peopleQuantity: "",
			location: "",
			userName: "",
			contactWay: "",
			address: "",
			remark: "",
			serveDishesWay: "",
			waiterName: "",
			isInitiatePay: "",
		};
		for (let i in params) {
			routeParams[i] = result[i];
		}
		routeParams.id = id;
		routeParams.orderId = id;

		// 多功能表单
		toolForm.remark = result.remark;
		// 折扣
		toolForm.discount = {
			cashDiscountMoney: result.cashDiscountMoney,
			order: {
				orderDiscount: result.orderDiscount,
				orderDiscountType: result.orderDiscountType,
			},
			product: {
				dishesDiscount: "",
				dishesDiscountType: "",
			},
		};

		// 抹零
		// 抹零options
		const notCountOpts = {
			NO: proxy.$LANG_TEXT("不抹"),
			YUAN: proxy.$LANG_TEXT("抹元"),
			ANGLE: proxy.$LANG_TEXT("抹角"),
			POINTS: proxy.$LANG_TEXT("抹分"),
		};
		toolForm.notCount = {
			maLingMoney: result.maLingMoney,
			maLingType: result.maLingType,
			maLingText: notCountOpts[result.maLingType],
		};

		// 服务费
		toolForm.service = {
			serviceCharge: result.serviceCharge,
			serviceChargeType: result.serviceChargeType,
		};

		// 税率
		toolForm.taxRate = result.taxRate;

		console.log(toolForm);
	} catch (error) {}
};

// AA分单查询
// 订单状态
const orderStatus = {
	NO_PAY: proxy.$LANG_TEXT("未支付"),
	YES_PAY: proxy.$LANG_TEXT("已支付"),
};
// 发起支付类
const orderPayStatus = {
	DIRECT_PAY: proxy.$LANG_TEXT("直接支付"),
	AA_PAY: proxy.$LANG_TEXT("AA支付"),
	SHARE_PAY: proxy.$LANG_TEXT("分额支付"),
};

// 订单状态text
const orderStatusText = computed(() => {
	const { status } = orderDetail.value;
	const obj = {
		AWAIT: "暂存订单",
		UNDER_WAY: "未支付",
		FINISH: "已支付",
		CANCELED: "已取消",
	};
	return obj[status];
});

// 明细列表
const payOrderList = ref([]);
// 查询订单明细
const getOrderAAPayDetail = async (id) => {
	try {
		const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", id);
		const result = res.result;
		payOrderList.value = result;
	} catch (error) {}
};

// 退款
// ref
const payOutDialogRef = ref();
// 退款输入信息
// 默认
const defaultPayOut = () => ({
	payAmount: "",
	paymentMethodName: "",
	paymentMethodNameLanguage: "",
});
const payOutParms = reactive(defaultPayOut());
// 退款列表信息
const payOutList = ref([]);

// 打开弹窗
const openPayOutDialog = () => {
	payOutDialogRef.value.openDialog();
	nextTick(() => {
		proxy.$updateParams(payOutParms, defaultPayOut());
	});
};

// 确认
const payOutConfirm = async (res) => {
	proxy.$updateParams(payOutParms, res);
	payOutDialogRef.value.closeDialog();
	await addOrderRefund();
	await getOrderRefundList();
	// console.log(res);
};

// 添加退款
const addOrderRefund = async () => {
	await proxy.$storeDispatch("fetchAddOrderRefund", {
		orderId: routeQuery.orderId,
		...payOutParms,
		refundAmount: payOutParms.payAmount,
	});
};

// 查询退款列表
const getOrderRefundList = async () => {
	const res = await proxy.$storeDispatch("fetchGetOrderRefundList", {
		orderId: routeQuery.orderId,
	});
	const result = res.result;
	payOutList.value = result;
};

// 查询小费列表
const tipData = ref([]);
const getOrderTippingList = async (orderId) => {
	const res = await proxy.$storeDispatch("fetchGetOrderTippingList", {
		orderId,
	});
	const result = res.result;
	tipData.value = result.slice(result.length-1);
};

// 修改订单信息
const updateOrder = (params) => {
	proxy.$storeDispatch("fetchEditOrderInfo", {
		...params,
		id: routeParams.orderId,
	});
};

// 人数弹窗
// ref
const peopelDialogRef = ref();

// 人数数据
const peopelValue = ref();

// 标题
const peopelDialogTitles = {
	peopel: "修改人数",
	AA: "付款人数",
};

// 打开类型
const peopelType = ref("");

// 打开弹窗
const openPeopelDialog = (type) => {
	if (orderDetail.value.status != "FINISH") {
		return;
	}
	peopelType.value = type;
	// 赋值
	if (type == "peopel") {
		peopelValue.value = routeParams.peopleQuantity;
	}
	peopelDialogRef.value.openDialog();
};

// 确认
const peopelDialogConfirm = (call) => {
	// 修改人数
	if (peopelType.value == "peopel") {
		if (peopelValue.value) {
			routeParams.peopleQuantity = Number(peopelValue.value);
		}
	}

	call();
	peopelDialogRef.value.closeDialog();

	updateOrder({
		peopleQuantity: routeParams.peopleQuantity,
	});
};

// 座位弹窗

// ref
const seatDialogRef = ref();

// 座位数据
const seatValue = ref();

// 打开弹窗
const openSeatDialog = () => {
	if (orderDetail.value.status != "FINISH") {
		return;
	}
	seatValue.value = routeParams.location;
	seatDialogRef.value.openDialog();
};

// 确认
const seatDialogConfirm = (call) => {
	if (seatValue.value) {
		routeParams.location = seatValue.value;
	}
	call();
	seatDialogRef.value.closeDialog();

	updateOrder({
		location: routeParams.location,
	});
};

// 客户基本信息
// ref
const customerDialogRef = ref();

// 信息
const customerData = reactive({
	userName: "",
	contactWay: "",
	address: "",
	waiterName: "",
});
// 打开客户信息弹窗
const openCustomerDialog = () => {
	if (orderDetail.value.status != "FINISH") {
		return;
	}
	if (routeParams.orderId) {
		proxy.$updateParams(customerData, orderDetail.value);
	} else {
		proxy.$updateParams(customerData, routeParams);
	}
	// console.log(customerData)
	customerDialogRef.value.openDialog();
};

// 确认
const customerConfirm = async (result, call) => {
	// console.log(result,call)
	customerDialogRef.value.closeDialog();

	if (routeParams.orderId) {
		updateOrder(result);
	}
	proxy.$updateParams(routeParams, result);
	call();
};

// 更换服务员
// ref
const tableRef = ref();
const waiterNameDialogRef = ref();

// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true;
};

// 打开弹窗
const openWaiterNameDialog = () => {
	if (orderDetail.value.status != "FINISH") {
		return;
	}
	waiterNameDialogRef.value.openDialog();
	nextTick(() => {
		getTableList();
	});
};

// 表格数据
const tableData = ref({});

const pageParams = reactive({
	pageNum: 1,
	pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({});

// 接收筛选栏的数据
const fetchFilterData = (params) => {
	for (let i in params) {
		filterParams[i] = params[i];
	}
	pageParams.pageNum = 1;
	getTableList();
};

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
	getTableList();
});

// 模板数据
const templateData = [
	{
		type: "index",
		label: "编号",
		width: "100",
	},
	{
		prop: "name",
		label: "服务员",
		minWidth: "150",
	},
	{
		prop: "waiterType",
		label: "类型",
		showTemplate: true,
		minWidth: "150",
	},
];

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams,
	};

	openTableLoading();

	proxy
		.$storeDispatch("fetchGetManageStaffUserListReporting", params)
		.then((res) => {
			tableData.value = res;
		});
};
// 单选服务员
const currentChangeWaiterName = (res) => {
	// 关闭窗口
	waiterNameDialogRef.value.closeDialog();
	routeParams.waiterName = res.name;

	const { id, name, waiterType } = res;
	// 修改订单
	updateOrder({
		waiterId: id,
		waiterName: name,
		waiterType,
	});
};

// 删除菜品操作
const deleteDishes = async (dishe, index) => {
	const item = addedToCart.value[index];

	await cancelDishes(item.shopId);
	dishe.revocationStatus = true;
};
// 撤销菜品
const cancelDishes = async (id) => {
	// 取消菜品
	await proxy.$storeDispatch("fetchEditOrderShoppingGoods", {
		id,
		revocationStatus: true,
	});
};

// 打印订单
const printOrder = () => {
	router.push({
		path: "/printMod",
		query: { orderId: routeParams.orderId, type: 2 },
	});
};

// 初始
const init = async () => {
	const id = routeQuery.orderId;
	await getOrderIdDetail(id);
	await getTemporaryOrderShoppingList(id);
	await getOrderShoppingList(id);
	await getOrderAAPayDetail(id);
	await getOrderRefundList(id);
	await getOrderTippingList(id);
};

onMounted(async () => {
	init();
});
</script>

<style lang="scss" scoped>
$grayColor: #fdfdfd;
.eat-food-box {
	display: grid;
	grid-template-columns: 1fr 400px;
	height: 100%;
	user-select: none;

	// 右侧购物车菜单
	> .cart-container {
		padding: 10px 30px;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;

		// 购物车
		.car-menu-box {
			height: 100%;
			display: grid;
			grid-template-rows: 40px 1fr;
			.top-show-info {
				display: grid;
				flex-direction: row;
				grid-template-columns: repeat(3, 1fr);
				justify-items: center;

				> div {
					width: auto;
					height: 40px;
					color: white;
					border-radius: 10px;
					line-height: 40px;
					text-align: center;
					box-shadow: 0px 0px 6px #0000001a;
					padding: 0 5px;
					min-width: 120px;
					max-width: 220px;

					&.peopel {
						background-color: #2b68fe;
					}
					&.intercept {
						background-color: #ffa001;
					}
					&.waiter {
						background-color: #f20808;
					}
				}
			}

			.car-container {
				height: calc(100% - 15px);
				display: grid;
				grid-template-rows: 43px 1fr;
				overflow: hidden;
				padding: 10px;
				box-sizing: border-box;

				.table-theader {
					display: grid;
					grid-template-columns: 1fr 120px 150px;
					border: 1px solid #f5f7fa;
					justify-items: center;
					border-radius: 10px;
					padding: 10px 0;

					p {
						width: 100%;
						text-align: center;

						&:nth-last-child(1) {
							text-align: left;
						}
					}
				}

				.content {
					box-shadow: 0px 2px 10px 0px #0000001a;
					border-radius: 10px;
					overflow: hidden;

					.table-list {
						height: 100%;
						font-size: 15px;
						overflow-y: auto;
						padding-bottom: 15px;
						box-sizing: border-box;
						.list-item {
							// padding: 10px 0;
							transition: 300ms;

							&.revoke {
								text-decoration: line-through;
							}
							.first-item {
								display: grid;
								flex-direction: row;
								flex-wrap: nowrap;
								grid-template-columns: 1fr 120px 150px;
								justify-items: center;
								align-items: center;
							}

							.product-name {
								width: 100%;
								overflow: hidden;
								padding-left: 10px;
								box-sizing: border-box;
								font-size: 16px;
								font-weight: 600;
								height: 30px;
								line-height: 40px;
							}

							.product-status {
								font-size: 13px;
							}
							.product-price {
								width: 100%;
								position: relative;

								.delete-action {
									position: absolute;
									right: 20px;
									top: 0;
									width: 25px;
									height: 25px;
									background-color: red;
									border-radius: 50px;
									text-align: center;
									display: flex;
									flex-direction: row;
									justify-content: center;
									align-items: center;
									color: white;
								}
							}

							&.active {
								background-color: #8080800f;
							}
						}
					}

					.goods-detailed {
						line-height: 30px;
						font-size: 14px;
						padding-left: 15px;

						.total-price {
							font-weight: bold;
							span {
								color: red;
							}
						}
					}

					.down-log {
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						justify-items: center;
						padding: 10px 0;
						border-top: 1px solid #f5f7fa;

						&.log2 {
							grid-template-columns: 1fr 1fr 280px;
						}

						&.log3 {
							display: flex;
							padding: 10px;
						}
					}
				}
			}
		}
	}

	// 订单详情
	.order-detail {
		.order-status {
			padding-left: 15px;
		}
		.base-address {
			padding-left: 15px;
			font-size: 13px;

			p {
				margin: 10px 0;
			}
		}

		.goods-detailed {
			line-height: 30px;
			font-size: 14px;
			padding-left: 15px;

			.total-price {
				font-weight: bold;
				span {
					color: red;
				}
			}
		}

		.order-list {
			width: 80%;
			overflow-y: auto;

			&.payOut {
				.order-item {
					.status {
						color: red;
					}
				}
			}

			.order-item {
				box-shadow: 0px 0px 10px 0px #9e9e9e59;
				margin: 15px 5px;
				border-radius: 10px;
				box-sizing: border-box;
				padding: 10px;
				display: grid;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 50px;
				border: 1px solid white;
				transition: 200ms;
				grid-template-columns: 1fr auto;
				.title {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;

					.name {
						padding-right: 15px;
					}

					.refundAmount {
						padding-right: 15px;
					}
					.time {
						font-size: 14px;
						color: #665f5f;
					}
				}
				.status {
					color: #05d69d;
					font-size: 15px;
				}
			}
		}
	}

	.ml-empty {
		height: 100%;
		box-sizing: border-box;
	}
}
</style>
