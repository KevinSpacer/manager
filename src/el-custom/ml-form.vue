<template>
	<div class="custom-form">
		<el-form
      ref="formRef"
			:model="model"
			:rules="rules"
			:size="formSize"
			:inline="inline"
			:label-position="labelPosition"
      :status-icon="statusIcon"
      :label-width="labelWidth"
			:validate-on-rule-change="validateOnRuleChange"
		>
      <slot name="form"></slot>
      <slot name="btn">
        <div class="btn-box" v-if="showBtn" v-loading="showLoading">
          <el-button @click="cancel" v-if="showCancel">{{$LANG_TEXT(cancelText)}}</el-button>
          <el-button type="primary" @click="confirm" v-if="showConfirm">{{$LANG_TEXT(confirmText)}}</el-button>
        </div>
      </slot>

		</el-form>
	</div>
</template>

<script setup>
import { reactive, ref,toRefs } from "vue";
import { useRouter } from 'vue-router'
const props = defineProps({
	model: {
		type: Object,
		default: () => ({}),
	},
	rules: {
		type: Object,
		default: () => ({}),
	},
	// 用于控制该表单内组件的尺寸 'large' | 'default' | 'small'
	formSize: {
		type: String,
		default: "default",
	},
	// 	行内表单模式 item独占一行 | item尾后排序
	inline: {
		type: Boolean,
		default: false,
	},
	// 表单域标签的位置 'left' | 'right' | 'top'
	labelPosition: {
		type: String,
		default: "right",
	},
  // 标签的长度
  labelWidth:{
		type: String,
		default: "auto",
  },
	// 是否在输入框中显示校验结果反馈图标
	statusIcon: {
		type: Boolean,
		default: false,
	},
  // 是否显示操作按钮
  showBtn:{
		type: Boolean,
		default: true
  },
  showConfirm:{
		type: Boolean,
		default: true
  },
  showCancel:{
		type: Boolean,
		default: true
  },
  cancelText:{
		type: String,
		default: "返回上一页",
  },
  confirmText:{
		type: String,
		default: "确定",
  },
	// 是否在 rules 属性改变后立即触发一次验证
	validateOnRuleChange:{
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["cancel", "confirm"]);

const router = useRouter()

const { model, rules, formSize, labelPosition, statusIcon } = toRefs(props);
// console.log(model, rules)
const formRef = ref()

// 加载状态
const showLoading = ref(false);

// 操作按钮
const cancel = () => {
  router.go(-1)
	emit("cancel");
};
const confirm = () => {
	if(showLoading.value){
		return 
	}
	showLoading.value = true;
	emit("confirm", call);
};
// 操作回调
const call = () => {
	showLoading.value = false;
};

// 对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
const validate = (callBack)=>{
  formRef.value.validate(callBack)
}
// 重置该表单项，将其值重置为初始值，并移除校验结果
const resetFields = ()=>{
  formRef.value.resetFields()
}
const validateField = (result,call)=>{
  formRef.value.validateField(result,call)
}

defineExpose({
  validate,
  resetFields,
	validateField
})

</script>

<style lang="scss">
  .custom-form{
		.btn-box{
			text-align: center;
		}
  }

</style>