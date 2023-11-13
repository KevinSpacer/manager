<template>
	<div class="page-box">
		<el-pagination
			background
			layout="sizes, total, prev, pager, next, jumper"
			:total="pageConfig.total"
			:page-sizes="pageSize"
			:current-page="pageParams.pageNum"
			@size-change="(e) => (pageParams.pageSize = e)"
			@current-change="(e) => (pageParams.pageNum = e)"
		/>
	</div>
</template>

<script setup>
import { reactive, watch } from 'vue'

let props = defineProps({
	pageConfig: {
		type: Object,
		default: () => ({
			total: 0
		})
	},
	pageParams: {
		type: Object,
		default: () => ({
			pageSize: 10,
			pageNum: 1
		})
	}
})

// 分页的数据量大小
const pageSize = [10, 20, 30, 40, 50, 100]

const emit = defineEmits(['update:pageParams'])

let { pageParams } = reactive(props)

watch([() => pageParams.pageSize, () => pageParams.pageNum], () => {
	// console.log(pageParams);
	emit('update:pageParams', pageParams)
})
</script>

<style lang="scss" scoped>
.page-box {
	padding: 3px 0;
}
</style>