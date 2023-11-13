<!-- 合单 -->
<template>
	<div class="container">
		<!-- 要合并订单列表 -->
		<div class="order-container">
			<div class="list" v-if="orderList.length">
				<div
					class="order-item"
					v-for="item in orderList"
					:class="{ 'is-active': secondOrderId == item.id }"
					:key="'order' + item.id"
					@click="changeOrder(item)"
				>
					<div class="line-1 item">
						<div class="number">
							<span v-if="item.daySerialNo">#{{ item.daySerialNo }}</span>
							<p v-else>
								<span class="staging-text" v-if="item.status == 'AWAIT'">{{
									$LANG_TEXT("暂存订单")
								}}</span>
								<span v-if="item.status == 'UNDER_WAY'">{{
									$LANG_TEXT("进行中")
								}}</span>
								<span v-if="item.status == 'FINISH'">{{
									$LANG_TEXT("已完成")
								}}</span>
								<span v-if="item.status == 'CANCELED'">{{
									$LANG_TEXT("已取消")
								}}</span>
							</p>
						</div>
						<div class="date">{{ item.showTime }}</div>
					</div>

					<div class="line-2 item">
						<div class="type">
							{{
								$LANG_TEXT(orderTypeOpt.find((d) => d.value == item.type).label)
							}}
						</div>
						<div class="price">${{ item.actuallyPaidMoney || 0 }}</div>
					</div>
					<div class="line-3 item">
						<div class="seat">
							{{ $LANG_TEXT("座位") }}：{{ item.location }}
						</div>
						<div class="people">
							{{ $LANG_TEXT("人数") }}：{{ item.peopleQuantity }}
						</div>
					</div>

					<div class="staff">
						{{ $LANG_TEXT("服务员") }}：{{ item.waiterName }}
					</div>
				</div>
			</div>

			<!-- 缺省 -->
			<div class="empty" v-else>
				{{ $LANG_TEXT("暂无订单") }}
			</div>

			<!-- 分页 -->
			<div class="pager">
				<el-pagination
					@next-click="(e) => (pageParams.pageNum = e)"
					@prev-click="(e) => (pageParams.pageNum = e)"
					@current-change="(e) => (pageParams.pageNum = e)"
					:page-size="12"
					background
					layout="prev, pager, next"
					:total="pageParams.total"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	getCurrentInstance,
	watch,
	computed,
	onMounted,
	reactive,
} from "vue";
import { orderTypeOpts } from "@/utils/options";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({
			mainOrder: "",
			order: "",
		}),
	},
	orderId: {
		type: String,
		default: "",
	},
});

const { proxy } = getCurrentInstance();

const orderTypeOpt = orderTypeOpts();

watch(
	() => props.modelValue,
	(nVal) => {
		init(nVal);
	}
);

// 订单数据
const orderValue = reactive(props.modelValue);

// 初始
const init = (value) => {
	// console.log(value);
	for (let i in orderValue) {
		orderValue[i] = value[i];
	}

	getOrderTableList();
};

// 分页参数
const pageParams = reactive({
	total: 0,
	pageSize: 12,
	pageNum: 1,
});
watch(pageParams, () => {
	getOrderTableList();
});

// 订单列表数据
const orderList = ref([]);
// 查询合并订单列表
const getOrderTableList = async () => {
	const mainOrderId = orderValue.mainOrder;
	if (!mainOrderId) {
		return;
	}
	try {
		const res = await proxy.$storeDispatch("fetchGetStayMergeOrderPageList", {
			...pageParams,
			mainOrderId,
		});
		const result = res.result;
		orderList.value = result;
		pageParams.total = res.total;
	} catch (error) {}
};

// 次订单选中ID
const secondOrderId = ref("");
// 选择次订单
const changeOrder = (item) => {
	secondOrderId.value = secondOrderId.value ? "" : item.id;
	orderValue.order = secondOrderId.value;
	emits("update:modelValue", orderValue);
};

onMounted(() => {
	init(props.modelValue);
});
</script>

<style lang="scss" scoped>
.container {
	.order-container {
		.list {
			display: grid;
			flex-direction: row;
			flex-wrap: wrap;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(4, 125px);
			height: 100%;

			.order-item {
				padding: 5px;
				width: 90%;
				height: 80%;
				background-color: white;
				border-radius: 10px;
				margin: auto;
				box-shadow: 0px 0px 10px 0px #9e9e9e26;
				overflow: hidden;
				border: 1px solid white;
				transition: border 300ms;

				&.is-active {
					border-color: #05d69d;
				}

				.item {
					display: flex;
					margin: 3px 0;
					flex-direction: row;
					justify-content: space-between;

					.staging-text {
						color: #f44336;
						font-size: 14px;
					}
					.date {
						text-align: right;
					}
					.seat {
						margin-right: 5px;
					}
				}

				.staff {
					min-width: 60%;
					text-align: center;
					color: white;
					background-color: #05d69d;
					border-radius: 30px;
					margin: auto;
					margin-top: 5px;
					padding: 5px 10px;
					font-size: 13px;
					width: fit-content;
				}
			}
		}

		.empty {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>