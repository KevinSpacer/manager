<!-- 第二语言与主语言展示 -->
<template>
	<div class="second-show">
		<span class="linethrought" v-if="showSecond">{{ secondText }}</span>
		<!-- <span class="linethrought" v-else-if="showCancle">{{ secondText }}</span> -->
		<span v-else :class="showCancle ? 'linethrought' : ''">{{ firstText }}</span>
	</div>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const mainModule = proxy.$usePiniaModule('mainModule')

const showSecond = computed(() => mainModule.isSecondLanguage)

const props = defineProps({
	// 主体
	firstText: {
		type: String,
		default: ''
	},
	// 第二语言动态值
	secondText: {
		type: String,
		default: ''
	},
	//是否显示划掉线样式
	showCancle: {
		type: Boolean,
		default: false
	}
})
</script>
<style lang="scss" scoped>
.linethrought {
	text-decoration: line-through;
}
</style>
