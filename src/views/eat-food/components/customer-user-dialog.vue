<template>
  <!-- 客户基本信息弹窗 -->
  <ml-dialog ref="customerDialogRef" :title="$LANG_TEXT('客户信息')" @confirm="customerConfirm">
    <template #content>
      <ml-form :showBtn="false" ref="customerFormRef" :model="customerForm" :rules="customerRules" formSize="large">
        <template #form>
          <el-form-item :label="$LANG_TEXT('客户姓名')" prop="userName">
            <el-input
            v-model="customerForm.userName"
            @click = "openKeyboard('multi','userName')"
            :placeholder="$LANG_TEXT('客户姓名')">
          </el-input>
          </el-form-item>
          <el-form-item :label="$LANG_TEXT('电话号码')" prop="contactWay">
          <el-input 
            v-model="customerForm.contactWay"
            @input="getInfoData" 
            @click = "openKeyboard('number','contactWay')"
            :placeholder="$LANG_TEXT('电话号码')"
            maxlength="10"
            show-word-limit
            >
          </el-input>
          </el-form-item>
          <el-form-item :label="$LANG_TEXT('地址')" prop="address">
            <el-input 
            @click = "openKeyboard('multi','address')"
            :placeholder="$LANG_TEXT('地址')" 
            v-model="customerForm.address"></el-input>
          </el-form-item>
        </template>
      </ml-form>
    </template>
    <template #btn>
      <div>
        <el-drawer 
        v-model="drawer"
        :size=sizeKeyboard
        :withHeader="false" 
        :direction="direction" 
        :before-close="handleClose">
          <div>
            <soft-keyboard-number
            :type=typeKeyboard
            @update:modelValue="keyDown($event)"
            @confirm="customerConfirm">
            </soft-keyboard-number>
          </div>
        </el-drawer>
      </div>
    </template>
  </ml-dialog>
</template>

<script setup>
import {
  computed,
  ref,
  getCurrentInstance,
  watch,
  reactive,
  onMounted,
  nextTick,
} from "vue";

const emits = defineEmits(["confirm"]);

const { proxy } = getCurrentInstance();

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      userName: "",
      contactWay: "",
      address: "",
      waiterName: "",
    }),
  },
  // 点餐类型
  eatType: {
    type: String,
    default: "",
  },
});

const useEatType = computed(() => props.eatType);

// 点餐
const mainModule = proxy.$usePiniaModule("mainModule");

// 客户基本信息
// ref
const customerDialogRef = ref();
const customerFormRef = ref();

// 数据
const customerForm = reactive(props.data);

watch(
  () => props.data,
  (nVal) => {
    proxy.$updateParams(customerForm, nVal);
  }
);

useEatType;
// 规则
const customerRules = computed(() => {
  const { contactWay, address } = {
    contactWay: [
      {
        trigger: "change",
        required: true,
        message: proxy.$LANG_TEXT("请输入电话号码"),
      },
      {
        validator: (rules, value, call) => {
          console.log(value)
          const val = Number(value);
          value = String(value);
          console.log(typeof val);
          console.log(typeof value);
          if (isNaN(val)) {
            console.log("i am here 1")
            call(new Error(proxy.$LANG_TEXT("请填写10位的数字")));
          } else {
            console.log("i am here 2")
            console.log(value)
            if (value.length >= 10) {
              call();
            } else {
              call(new Error(proxy.$LANG_TEXT("请填写10位的数字")));
              call();
            }
          }
        },
      },
    ],
    address: [
      {
        trigger: "change",
        required: true,
        message: proxy.$LANG_TEXT("请输入外卖地址"),
      },
    ],
  };

  // 外卖类型
  if (useEatType.value == "TAKE_OUT") {
    return { contactWay, address };
  } else {
    // Go to next page when click take out, no informaton has to be filled by zizhen guo 11/06/2023
    return { };
  }
});

// 打开客户信息弹窗
const openDialog = () => {
  customerDialogRef.value.openDialog();
  for (let i in customerForm) {
    customerForm[i] = "";
  }
  nextTick(() => {
    customerFormRef.value.resetFields();
  });
};
const closeDialog = () => {
  customerDialogRef.value.closeDialog();
};

// 确认
const customerConfirm = async (call) => {
  const testRes = await proxy.$testForm(call, customerFormRef.value);
  if (!testRes) {
    drawer.value=false;
    return;
  }
  //customerDialogRef.value.closeDialog();
  customerForm.waiterName = mainModule.userInfo.name;
  emits("confirm", customerForm, call);
};

// 根据手机号码查询其他信息
const getInfoData = async () => {
  const { contactWay, userName, address } = customerForm;

  const val = Number(contactWay);

  if (isNaN(val) || contactWay.length < 10) {
    return;
  }
  try {
    const res = await proxy.$storeDispatch("fetchGetClientByContactWay", {
      contactWay,
    });
    const result = res.result;
    // console.log(result)
    if (result) {
      proxy.$updateParams(customerForm, result);
      customerForm.userName = result.name || "";
    }
  } catch (error) {}
};
let drawer = ref(false)
let typeKeyboard = ref('number')
let sizeKeyboard = ref('50%')
let callerKeyboard = ref()
const direction = ref('btt')
//key was hit and received
const keyDown = (value) => {
  console.log("i am in the method of key Down")
  value=value+'';
  if(callerKeyboard.value=="userName"){
    console.log("button in username is hit "+ value)
    customerForm.userName=value;
  }
  if(callerKeyboard.value=="contactWay"){
  console.log(typeof value)
  console.log("button in contactway is hit "+ value)
  customerForm.contactWay=value;
  getInfoData();
  }
  if(callerKeyboard.value =="address"){
  console.log("button in address is hit "+ value)
  customerForm.address=value;
  }
}
//keyboard switch
const openKeyboard = (value1,value2) => {
  drawer.value=true;
  typeKeyboard.value=value1;
  callerKeyboard.value=value2;
  console.log(value1);
  console.log(value2);
  if(value1==('number'||'seat')){
    sizeKeyboard.value='50%';
  }else{
    sizeKeyboard.value='50%';
  }}
  //close drawer and clear value
const handleClose = () => {
  drawer.value = false
  if(callerKeyboard.value=="userName"){
    console.log("button in username is hit")
    customerForm.userName="";
  }
  if(callerKeyboard.value=="contactWay"){
  console.log("button in contactway is hit ")
  customerForm.contactWay="";
  getInfoData();
  }
  if(callerKeyboard.value =="address"){
  console.log("button in address is hit ")
  customerForm.address="";
  }}
defineExpose({
  openDialog,
  closeDialog,
});
</script>
<style lang="scss" scoped></style>
