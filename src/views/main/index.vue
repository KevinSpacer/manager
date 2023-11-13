<template>
  <div class="main-container">
    <div class="left-box">
      <el-image class="image" fit="cover" :src="leftBg"></el-image>
    </div>

    <div class="right-box">
      <div
        class="menu-item"
        v-for="item in bodyMenuData"
        :key="item.title"
        @click="doActive(item)"
      >
        <el-image class="icon" :src="item.icon"></el-image>
        <p class="title">{{ item.title }}</p>
      </div>
    </div>
  </div>

  <!-- 客户基本信息弹窗 -->
  <customer-user-dialog
    :eatType="eatType"
    @confirm="customerConfirm"
    ref="customerDialogRef"
  >
  </customer-user-dialog>

  <!-- 数字键盘弹窗 -->
  <ml-dialog
    :showBtn="false"
    ref="numberDialogRef"
    class="numberDialog"
    :title="$LANG_TEXT(currNumberDialogInfo.title)"
  >
    <template #content>
      <div class="number-dialog-box">
        <div class="input-box">
          <el-form
            ref="numberFormRef"
            :model="numberFormData"
            :rules="numberFormRules"
          >
            <el-form-item :prop="currNumberDialogInfo.chooseInputName">
              <el-input
                class="big-keyboard"
                :type="
                  currNumberDialogInfo.type == 'openCashbox'
                    ? 'password'
                    : 'number'
                "
                v-model="numberFormData[currNumberDialogInfo.chooseInputName]"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="number-keyboard">
          <soft-keyboard-number
            :isString="currNumberDialogInfo.type == 'openCashbox'"
            @confirm="numberDialogConfirm"
            v-model="numberFormData[currNumberDialogInfo.chooseInputName]"
          ></soft-keyboard-number>
        </div>
      </div>
    </template>
  </ml-dialog>

  <!-- 座位键盘弹窗 -->
  <ml-dialog
    width="595px"
    :showBtn="false"
    ref="seatDialogRef"
    class="seatDialog"
    :title="$LANG_TEXT('输入座位')"
  >
    <template #content>
      <div class="number-dialog-box">
        <div class="input-box">
          <el-form
            ref="seatFormRef"
            :model="seatFormData"
            :rules="seatFormRules"
          >
            <el-form-item prop="seat">
              <el-input
                class="big-keyboard"
                v-model="seatFormData.seat"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="number-keyboard">
          <soft-keyboard-number
            type="seat"
            @confirm="seatDialogConfirm"
            :showBack="baseConfigInfo.isSelectPeopleNumber == 'YES'"
            @back="seatBackPrev"
            v-model="seatFormData.seat"
          ></soft-keyboard-number>
        </div>
      </div>
    </template>
  </ml-dialog>

  <!-- 退出弹窗 -->
  <ml-dialog width="600px" :showBtn="false" ref="exitDialogRef">
    <template #content>
      <div class="exit-box">
        <div class="exit-btn first" @click="loginOut">
          <div class="btn">
            <img :src="exitLoginIcon" alt="" />
          </div>
          <p class="name">{{ $LANG_TEXT("退出登录") }}</p>
        </div>

        <div class="exit-btn second" @click="closeWindow">
          <div class="btn">
            <img :src="exitProgramIcon" alt="" />
          </div>
          <p class="name">{{ $LANG_TEXT("退出程序") }}</p>
        </div>
      </div>
    </template>
  </ml-dialog>
</template>

<script setup>
import customerUserDialog from "@/views/eat-food/components/customer-user-dialog.vue";
import {
  computed,
  ref,
  getCurrentInstance,
  nextTick,
  reactive,
  onMounted,
} from "vue";
import { testPositiveInteger } from "@/utils/regExp";
import { useRouter } from "vue-router";
import { storeage_service_name } from "@/utils/apiConfig";

const router = useRouter();

const { proxy } = getCurrentInstance();

// 图片
// 退出登录
const exitLoginIcon = require("@/assets/images/exit-login.png");
// 退出程序
const exitProgramIcon = require("@/assets/images/exit-program.png");

// 点餐
const { eatFoodModule, mainModule } = proxy.$usePiniaModule();

// 基本信息
const baseConfigInfo = computed(() => mainModule.baseConfigInfo);

// 校验
const validPositiveInteger = (rules, value, call) => {
  if (value) {
    if (testPositiveInteger(value)) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("请输入正整数")));
    }
  } else {
    call(new Error(proxy.$LANG_TEXT("请先输入有效的用餐人数")));
  }
};

const leftBg = require("@/assets/images/login-bg.png");

// 菜单数据
const bodyMenuData = computed(() => {
  const data = [
    {
      title: proxy.$LANG_TEXT("堂食"),
      isUse: proxy.$isUseAuth("堂食"),
      params: {
        title: "用餐人数",
        type: "EAT_IN",
        chooseInputName: "peopleNum",
      },
      methodFun: openNumberDialog,
    },
    {
      params: {
        type: "TAKE_FOOD",
      },
      title: proxy.$LANG_TEXT("等取"),
      isUse: proxy.$isUseAuth("等取"),
      methodFun: openCustomerDialog,
    },
    {
      params: {
        type: "TAKE_OUT",
      },
      title: proxy.$LANG_TEXT("外卖"),
      isUse: proxy.$isUseAuth("外卖"),
      methodFun: openCustomerDialog,
    },
    {
      title: proxy.$LANG_TEXT("订单"),
      isUse: proxy.$isUseAuth("订单"),
      params: "/order",
      methodFun: navigateTo,
    },
    {
      title: proxy.$LANG_TEXT("打开钱箱"),
      isUse: proxy.$isUseAuth("打开钱箱"),
      params: {
        title: "打开钱箱",
        type: "openCashbox",
        chooseInputName: "password",
      },
      methodFun: openNumberDialog,
    },
    {
      title: proxy.$LANG_TEXT("更新菜品"),
      isUse: proxy.$isUseAuth("更新菜品"),
      params: "/updateFood",
      methodFun: navigateTo,
    },
    {
      title: proxy.$LANG_TEXT("报表管理"),
      isUse: true,
      params: "/reportManagement",
      methodFun: navigateTo,
    },
    {
      title: proxy.$LANG_TEXT("打卡"),
      isUse: true,
      params: "/callWork",
      methodFun: navigateTo,
    },
    {
      title: proxy.$LANG_TEXT("退出"),
      isUse: true,
      methodFun: openExitDialog,
    },
  ];

  return data
    .map((item, index) => {
      item.icon = require(`@/assets/images/main/${index}.png`);
      return item;
    })
    .filter((item) => item.isUse);
});

// 点击操作
const doActive = (item) => {
  item.methodFun(item);
};

// 跳转页面
const navigateTo = (item) => {
  proxy.$navigateTo(item.params);
};

// 数字键盘弹窗
// 默认
const defaultNumberForm = () => ({
  // 用餐人数
  peopleNum: "",
  // 钱箱密码
  password: "",
});
// 数据
const numberFormData = reactive(defaultNumberForm());
// 校验
const numberFormRules = reactive({
  // 用餐人数
  peopleNum: [
    {
      validator: validPositiveInteger,
    },
  ],
  // 钱箱密码
  password: "",
});

// ref
const numberDialogRef = ref();
const numberFormRef = ref();

// 当前弹窗信息
const currNumberDialogInfo = ref({});
// 打开弹窗
const openNumberDialog = (item) => {
  const params = item.params;
  const info = baseConfigInfo.value;
  // 赋值
  currNumberDialogInfo.value = params;

  // 重置
  proxy.$updateParams(numberFormData, defaultNumberForm());

  // 堂食
  if (params.type == "EAT_IN") {
    // 堂食是否需要选择人数
    if (info.isSelectPeopleNumber == "YES" && info.isSelectSeat == "YES") {
      numberDialogRef.value.openDialog();
    } else {
      // 都无
      if (info.isSelectPeopleNumber == "NO" && info.isSelectSeat == "NO") {
        resetAddCartData();
        proxy.$navigateTo("/eatFood", {
          location: "",
          peopleQuantity: 0,
          type: params.type,
          waiterName: mainModule.userInfo.name,
        });
      } else {
        // 不需要选择人数
        if (info.isSelectPeopleNumber == "NO") {
          seatDialogRef.value.openDialog();
        } else {
          numberDialogRef.value.openDialog();
        }
      }
    }
  } else {
    // 打开钱箱
    numberDialogRef.value.openDialog();
  }
  // console.log(params)
};

// 确认
const numberDialogConfirm = async (call) => {
  const { type } = currNumberDialogInfo.value;

  // console.log(currNumberDialogInfo.value);
  // 堂食
  if (type == "EAT_IN") {
    const testRes = await proxy.$testForm(call, numberFormRef.value);
    const info = baseConfigInfo.value;

    if (!testRes) {
      return;
    }

    numberDialogRef.value.closeDialog();

    // 不需要打开座位
    if (info.isSelectSeat == "NO") {
      resetAddCartData();
      proxy.$navigateTo("/eatFood", {
        location: "",
        peopleQuantity: numberFormData.peopleNum,
        type,
        waiterName: mainModule.userInfo.name,
      });
      call();
    } else {
      nextTick(() => {
        call();
        seatDialogRef.value.openDialog();
      });
    }
  } else if (type == "openCashbox") {
    // 打开钱箱 确认
    // console.log(numberFormData);
    numberDialogRef.value.closeDialog();
    proxy.$tipsPending();
    nextTick(() => {
      call();
    });
  }
};

// 座位弹窗
// 数据
const seatFormData = reactive({
  seat: "",
});
// 校验
const seatFormRules = reactive({
  seat: [
    {
      message: proxy.$LANG_TEXT("请先输入座位"),
      required: true,
      trigger: "change",
    },
  ],
});

// ref
const seatDialogRef = ref();
const seatFormRef = ref();

// 确认 堂食、等取
// 座位
const seatDialogConfirm = async (call) => {
  const testRes = await proxy.$testForm(call, seatFormRef.value);

  if (!testRes) {
    return;
  }

  seatDialogRef.value.closeDialog();

  nextTick(() => {
    resetAddCartData();
    proxy.$navigateTo("/eatFood", {
      location: seatFormData.seat,
      peopleQuantity: numberFormData.peopleNum,
      type: currNumberDialogInfo.value.type,
      waiterName: mainModule.userInfo.name,
    });
    call();
  });
};

// 客户基本信息
// ref
const customerDialogRef = ref();

// 点餐状态
const eatType = ref("");
// 打开客户信息弹窗
const openCustomerDialog = (res) => {
  customerDialogRef.value.openDialog();
  eatType.value = res.params.type;
};

// 确认
const customerConfirm = async (result, call) => {
  // console.log(result,call)
  customerDialogRef.value.closeDialog();
  result.type = eatType.value;
  await clientAdd(result);
  nextTick(() => {
    resetAddCartData();
    proxy.$navigateTo("/eatFood", result);
    call();
  });
};

// 重置数据
const resetAddCartData = () => {
  eatFoodModule.addedToCart = [];
  eatFoodModule.chooseOrderType = "";
};

// 添加客户信息
const clientAdd = async (result) => {
  const { address, contactWay, userName } = result;
  const params = {
    address,
    contactWay,
    name: userName,
  };
  await proxy.$storeDispatch("fetchClientAdd", params);
};

// 座位返回上一步
const seatBackPrev = (close) => {
  seatDialogRef.value.closeDialog();
  openNumberDialog(bodyMenuData.value[0]);
};

// 退出
// ref
const exitDialogRef = ref();

// 打开弹窗
const openExitDialog = () => {
  exitDialogRef.value.openDialog();
};

// 退出登录
const loginOut = () => {
  mainModule.clearUseStore();
  router.replace("/login");
};
// 关闭测试
// 加载状态
const closeWindow = () => {
  // console.log('关闭中')
  // console.log(proxy.$closeProgram)
  proxy.$closeProgram();
};

onMounted(() => {
  try {
    CefSharp.BindObjectAsync("webForm");
  } catch (error) {}
});
</script>

<style lang="scss" scoped>
.main-container {
  display: grid;
  grid-template-columns: 470px 1fr;
  height: 100%;

  > div {
    height: 100%;
  }

  .left-box {
    .image {
      width: 470px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
    }
  }

  .right-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: center;
    align-items: center;
    justify-items: center;
    padding: 35px;
    box-sizing: border-box;
    .menu-item {
      text-align: center;
      padding: 10px;
      box-shadow: 0px 0px 5px 0px #80808030;
      border-radius: 10px;
      cursor: pointer;

      .title {
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}

.exit-box {
  display: flex;
  margin-top: 50px;
  justify-content: center;
  margin-bottom: 65px;
  .exit-btn {
    width: 150px;
    height: 150px;
    .btn {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      color: white;
      font-size: 20px;
      overflow: hidden;
      cursor: pointer;
    }

    .name {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      line-height: 50px;
    }

    &.first {
      margin-right: 80px;
      .btn {
        background-color: #03a9f4;
        img {
          width: 70%;
        }
      }
    }
    &.second {
      .btn {
        background-color: red;
        img {
          width: 75%;
        }
      }
    }
  }
}
</style>
