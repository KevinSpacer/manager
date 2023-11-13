<!-- 标准表格 -->
<template>
	<div class="table-container">
		<el-table
			ref="tableRef"
			@select-All="selectHand"
			@select="selectHand"
			@current-change="currentChange"
			tooltip-effect="light"
			v-loading="showLoading"
			:data="listData"
			:height="tableConfig.height"
			:empty-text="tableConfig.emptyText"
			:default-sort="tableConfig.defaultSort"
			style="width: 100%"
		>
			<el-table-column
				v-for="(item, index) in templateData"
				:key="'template' + index"
				:prop="item.prop"
				:label="$LANG_TEXT(item.label)"
				:width="item.width"
				:min-width="item.minWidth"
				:type="item.type"
				:index="item.index"
				:fixed="item.fixed"
				:sortable="item.sortable"
				:resizable="item.resizable"
				:formatter="item.formatter"
				:show-overflow-tooltip="true"
				:align="item.align || 'center'"
			>
				<!--( 是否显示模板|是否开启表格判空)&&特定模板 -->
				<template
					v-if="(item.showTemplate || tableConfig.openEmptyColumn) && !item.type"
					#default="{ row={} }"
				>
					<div>
						<!-- 自定义模板 -->
						<slot v-if="item.showTemplate" :name="item.prop" :row="row"></slot>

						<!-- 是否统一判空显示 -->
						<p v-else>
							<span v-if="tableConfig.emptyColumn.includes(row[item.prop])">
								{{ tableConfig.emptyResult }}
							</span>
							<span v-else>
								{{
									mainModule.isSecondLanguage
										? row[item.propSecond] || row[item.prop]
										: row[item.prop]
								}}
							</span>
						</p>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<ml-page
			v-if="showPage"
			:pageConfig="pageConfig"
			:pageParams="pageParams"
		></ml-page>
	</div>
</template>

<script setup>
import {
	toRefs,
	watch,
	onMounted,
	ref,
	reactive,
	getCurrentInstance
} from 'vue'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['update:pageParams','selectHand'])
const mainModule = proxy.$usePiniaModule('mainModule')

// ref
const tableRef = ref()

const props = defineProps({
	showPage: {
		type: Boolean,
		default: true
	},
	// 列表请求响应值
	tableData: {
		type: Object,
		default: () => ({})
	},
	filterParams: {
		type: Object,
		default: () => ({})
	},
	tableConfig: {
		type: Object,
		default: () => ({
			emptyText: '暂无数据',
			height: '462px',
			defaultSort: {},
			// 打开表格判空
			openEmptyColumn: true,
			// 看空条件
			emptyColumn: [null, '', undefined],
			// 判空显示结果
			emptyResult: '-'
		})
	},
	pageParams: {
		type: Object,
		default: () => ({})
	},
	// 模板数据
	templateData: {
		type: Array,
		default: () => []
	}
})

const { tableConfig, tableData, pageParams } = toRefs(props)

const showLoading = ref(true)
watch(
	() => showLoading.value,
	(nVal) => {
		if (nVal) {
			clear15sTime()
			tableConfig.value.emptyText == '加载中...'
		} else {
			tableConfig.value.emptyText == '暂无数据'
		}
	}
)

const listData = ref([])

const pageConfig = reactive({
	total: 0
})

// 延迟动画，赋值数据
watch(
	() => props.tableData,
	(opt) => {
		// console.log(opt)
		let timeId = setTimeout(() => {
			showLoading.value = false
			listData.value = (opt.result || []).filter(item=>item)
			pageConfig.total = opt.total

			clearTimeout(timeId)
			timeId = null
		}, 200)
	}
)

watch(pageParams.value, (nVal) => {
	showLoading.value = true
	emits('update:pageParams', nVal)
})

// 固定15s后加载动画停止
const timeId = ref()

const clear15sTime = () => {
	timeId.value = setTimeout(() => {
		showLoading.value = false
		clearTimeout(timeId.value)
		timeId.value = null
	}, 15000)
}

// 监听表格选择
const selectHand = (res,row={})=>{
	emits('selectHand',res,row)
}


// 用于多选表格，清空用户的选择
const clearSelection = ()=>{
	tableRef.value.clearSelection()
}

// 单选操作
const currentChange = (res)=>{
	emits('currentChange',res)
}

// 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
/** 
 * @params row
 * @params selected 
 */ 
const toggleRowSelection = (row, selected)=>{
	// console.log(row, selected)
	tableRef.value.toggleRowSelection(row, selected)
}

const getSelectionRows = ()=>{
	tableRef.value.getSelectionRows()
}

onMounted(() => {
	clear15sTime()
})

defineExpose({
	showLoading,
	clearSelection,
	toggleRowSelection,
	getSelectionRows
})
</script>

<style lang="scss" scoped>
.table-container {
	.tool-box {
		margin-bottom: 20px;
	}
}
</style>

<style lang="scss">
.table-container {
	.el-scrollbar__view {
		display: block !important;
	}
}
</style>