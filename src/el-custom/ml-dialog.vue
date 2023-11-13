<template>
	<div>
		<el-dialog
			custom-class="ml-dialog"
			v-model="showDialog"
			:title="title"
			:width="width"
			:show-close="showClose"
			:destroy-on-close="true"
			:close-on-click-modal="closeOnClickModal"
			draggable
			center
		>
			<!-- 内容 -->
			<slot name="content"></slot>

			<!-- 底部 -->
			<template #footer>
				<slot name="btn">
					<div v-if="showBtn" v-loading="showLoading">
						<el-button @click="cancel" v-if="showCancel">{{
							$LANG_TEXT(cancelText)
						}}</el-button>
						<el-button type="primary" @click="confirm" v-if="showConfirm">{{
							$LANG_TEXT(confirmText)
						}}</el-button>
					</div>
				</slot>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { reactive, ref, watch, toRefs } from "vue";
const props = defineProps({
	title: {
		type: String,
		default: "",
	},
	width: {
		type: String,
		default: "35%",
	},
	showClose: {
		type: Boolean,
		default: true,
	},
	// 是否显示操作按钮
	showBtn: {
		type: Boolean,
		default: true,
	},
	showConfirm: {
		type: Boolean,
		default: true,
	},
	showCancel: {
		type: Boolean,
		default: true,
	},
	cancelText: {
		type: String,
		default: "取消",
	},
	confirmText: {
		type: String,
		default: "确定",
	},
	closeOnClickModal:{
		type: Boolean,
		default: true,
	}
});

// 显示状态
const showDialog = ref(false);
// 加载状态
const showLoading = ref(false);

const emit = defineEmits(["cancel", "confirm"]);

let { title, width, showClose } = toRefs(props);

// 操作按钮
const cancel = () => {
	call();
	closeDialog();
	emit("cancel");
};
const confirm = () => {
	if (showLoading.value) {
		return;
	}
	showLoading.value = true;
	emit("confirm", call);
};
// 操作回调
const call = () => {
	showLoading.value = false;
};

// 打开弹窗
const openDialog = () => {
	showDialog.value = true;
};
// 关闭弹窗
const closeDialog = () => {
	showDialog.value = false;
	call();
};

defineExpose({
	openDialog,
	closeDialog,
});
</script>

<style lang="scss">
.el-overlay {
	.el-overlay-dialog {
		/*全局 滚动条样式*/
		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: transparent;
			border-radius: 10px;
			transition: all 300ms ease-in-out;
		}
		&::-webkit-scrollbar-thumb {
			background-color: #00000017;
		}
		&::-webkit-scrollbar-track {
			border-radius: 10px;
		}

		.el-dialog__headerbtn {
			top: 0;
			width: 45px;
			height: 45px;
		}
	}
	.ml-dialog {
		border-radius: 10px;

		.el-dialog__title {
			font-weight: bold;
		}

		.el-dialog__body {
			padding-top: 5px;
			padding-bottom: 0px;
		}

		.el-dialog__header {
			padding-top: 10px;
		}

		.el-dialog__headerbtn {
			.el-dialog__close {
				font-size: 25px;
			}
		}
	}
}
</style>