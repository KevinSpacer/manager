<template>
	<el-switch
		v-model="useSwitch"
		inline-prompt
		style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
		width="55px"
		:active-text="$LANG_TEXT(activeText)"
		:inactive-text="$LANG_TEXT(inactiveText)"
	/>
</template>

<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["update:switch"]);

const props = defineProps({
	switch: {
		type:String,
		default: "",
	},
	activeText: {
		type: String,
		default: "启用",
	},
	inactiveText: {
		type: String,
		default: "禁用",
	},
	activeValue: {
		type: [Number,String],
		default: "",
	},
	inactiveValue: {
		type: [Number,String],
		default: "",
	},
});

const useSwitch = ref(props.switch == props.activeValue)

watch(
	() => props.switch,
	(nVal) => {
		useSwitch.value = nVal == props.activeValue
	}
);
watch(
	() => useSwitch.value,
	(nVal) => {
		const {activeValue,inactiveValue} = props
		const resault = nVal?activeValue:inactiveValue
		emits("update:switch", resault);
	}
);
</script>

<style lang="scss" scoped>
</style>