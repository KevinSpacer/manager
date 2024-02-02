<template>
  <!-- 客户基本信息弹窗 -->
  <ml-dialog ref="customerDialogRef" :title="$LANG_TEXT('客户信息')" @confirm="customerConfirm">
    <template #content>
      <ml-form :showBtn="true" showConfirm :confirmText="confirmText" :showCancel="false" ref="customerFormRef"
        :model="customerForm" :rules="customerRules" formSize="large">
        <template #form>
          <el-form-item :label="$LANG_TEXT('客户姓名')" prop="userName">
            <el-input v-model="customerForm.userName" @click="openKeyboard('multi', 'userName')"
              :placeholder="$LANG_TEXT('客户姓名')">
            </el-input>
          </el-form-item>
          <el-form-item :label="$LANG_TEXT('电话号码')" prop="contactWay">
            <el-input v-model="customerForm.contactWay" oninput="value=value.length>10?value.splice(0,10)" maxlength="10"
              @input="getInfoData" @click="openKeyboard('number', 'contactWay')" :placeholder="$LANG_TEXT('电话号码')"
              show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item :label="$LANG_TEXT('地址')" prop="address">
            <el-input @click="openKeyboard('multi', 'address')" :placeholder="$LANG_TEXT('地址')"
              v-model="customerForm.address"></el-input>
          </el-form-item>

        </template>
        <template #btn>
          <div class="btn-box" v-loading="showLoading">
            <el-button type="primary" @click="customerConfirm">{{ $LANG_TEXT(confirmText) }}</el-button>
          </div>

        </template>
      </ml-form>
    </template>
    <template #btn>
      <div>
        <el-drawer v-model="drawer" :size=sizeKeyboard :withHeader="false" :direction="direction"
          :before-close="handleClose">
          <div>
            <soft-keyboard-number :callerKeyboard="callerKeyboard" :type="typeKeyboard" :formObj="customerForm"
              @changeInput="keyDown" @confirm="customerConfirm" @handleClose="handleClose">
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
const confirmText = ref('确认')
// 加载状态
const showLoading = ref(false);
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
const customerForm = reactive({
  userName: '',
  contactWay: '',
  address: ''
});
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
          const val = Number(value);
          value = String(value);
          if (isNaN(val)) {
            call(new Error(proxy.$LANG_TEXT("请填写10位的数字")));
          } else {
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
    return {};
  }
});

watch(() => customerForm.contactWay, (newVal, oldVal) => {
  if (newVal.length > 10) {
    // 电话号码超出10位自动截取再做验证  Oneway 1.29
    customerForm.contactWay = newVal.substring(0, 10)
    customerFormRef.value.validate()
    keyDown(customerForm.contactWay)
  }
})

// 打开客户信息弹窗
const openDialog = () => {
  customerDialogRef.value.openDialog();
  // 克隆表单数据防止修改原数据 Oneway 1.29
  let formObj = JSON.parse(JSON.stringify(props.data))
  // 数据回显  Oneway 1.29
  Object.assign(customerForm, { ...formObj })
  // nextTick(() => {
  //   customerFormRef.value.resetFields();
  // });
};
const closeDialog = () => {
  customerDialogRef.value.closeDialog();
  // customerFormRef.value.resetFields()
};

// 确认
const customerConfirm = async (call) => {
  const testRes = await proxy.$testForm(call, customerFormRef.value);
  if (!testRes) {
    drawer.value = false;
    return;
  }
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
    if (result) {
      proxy.$updateParams(customerForm, result);
      customerForm.userName = result.name || "";
    }
  } catch (error) { }
};
let drawer = ref(false)
let typeKeyboard = ref('number')
let sizeKeyboard = ref('50%')
let callerKeyboard = ref()
const direction = ref('btt')
//key was hit and received
const keyDown = (value) => {
  if (value) {
    value = value + '';
  }
  if (callerKeyboard.value == "userName") {
    customerForm.userName = value;
  } else if (callerKeyboard.value == "contactWay") {
    customerForm.contactWay = value;
    getInfoData();
  } else {
    customerForm.address = value;
  }


}
//keyboard switch
const openKeyboard = (tp, key) => {
  drawer.value = true;
  typeKeyboard.value = tp;
  callerKeyboard.value = key;
  if (callerKeyboard.value === 'userName') {
    if (customerForm.userName) {
      keyDown(customerForm.userName)
    }
  } else if (callerKeyboard.value === 'contactWay') {
    if (customerForm.contactWay) {
      keyDown(customerForm.contactWay)
    }
  } else {
    if (customerForm.address) {
      keyDown(customerForm.address)
    }
  }
  if (tp == ('number' || 'seat')) {
    sizeKeyboard.value = '50%';
  } else {
    sizeKeyboard.value = '50%';
  }
}
//close drawer and clear value
const handleClose = () => {
  drawer.value = false

}

defineExpose({
  openDialog,
  closeDialog,
});
</script>
<style lang="scss" scoped></style>
