<template>
	<el-button 
    :size="size"
    :type="type"
    :loading="showLoading"
    @click="submit">
    <slot/>
  </el-button>
</template>

<script setup>
import { ref} from "vue";
const props = defineProps({
	size: {
		type: String,
		default: "default",
	},
  type:{
    type:String,
		default: "primary"
  }
});

// 加载状态
const showLoading = ref(false);

const emits = defineEmits(["submit"]);

const submit = ()=>{

  if(showLoading.value){
    return 
  }

  showLoading.value = true

  emits('submit',()=>{
    showLoading.value = false
  })
}
</script>

<style lang="scss">
</style>