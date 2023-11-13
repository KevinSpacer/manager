<template>
  <div class="login-container">
    <div class="login-box">
      <img
        class="logo"
        :src="roomDetail.logo ? $previewFileUrl + roomDetail.logo : logo"
        alt=""
      />

      <!-- <div class="fixed-bg"></div> -->

      <div class="login-form">
        <ml-form
          ref="formRef"
          :showBtn="false"
          :model="formData"
          :rules="formRules"
          labelWidth="0"
          formSize="large"
        >
          <template #form>
            <el-form-item prop="account">
              <el-input
                ref="accountRef"
                :prefix-icon="User"
                @focus="chooseKeyDown('account')"
                v-model.trim="formData.account"
                :placeholder="$LANG_TEXT('请输入账号')"
              >
                <template #prefix>
                  <!-- <el-image class="icon" :src="accountIcon"></el-image> -->
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" style="margin-bottom: 0">
              <el-input
                ref="passwordRef"
                :prefix-icon="Lock"
                @focus="chooseKeyDown('password')"
                v-model.trim="formData.password"
                type="password"
                :placeholder="$LANG_TEXT('请输入密码')"
              >
                <template #prefix>
                  <!-- <el-image class="icon" :src="passwordIcon"></el-image> -->
                </template>
              </el-input>
            </el-form-item>
          </template>
        </ml-form>

        <!-- 按钮 -->
        <div class="btn-box">
          <el-button
            :loading="showLoading"
            type="primary"
            size="large"
            @click="loginSubmit"
            >{{ $LANG_TEXT("登录") }}</el-button
          >
          <el-button
            type="danger"
            size="large"
            @click="$closeProgram"
            class="exit-"
          >
            <div class="icon-box">
              <img :src="exitProgramIcon" alt="" />
              {{ $LANG_TEXT("退出程序") }}
            </div>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 密码输入区域 -->
    <div class="keydown-box" :class="showKeydown ? 'haveWidth' : 'noWidth'">
      <transition name="fade">
        <div v-if="showKeydown" class="box-translate">
          <p class="title" v-if="roomDetail.name" @click="onHandTen">
            {{
              $LANG_TEXT(roomDetail.name, {
                mode: "second",
                secondValue: roomDetail.nameLanguage,
              })
            }}
          </p>
          <p class="title" @click="onHandTen" v-else>
            {{ $LANG_TEXT("餐饮") }}
          </p>
          <soft-keyboard-number
            ref="keyboardRef"
            :isString="true"
            @confirm="keyboardConfirm"
            v-model="formData[keyboardName]"
          ></soft-keyboard-number>
        </div>
      </transition>
    </div>
  </div>

  <!-- 服务器地址弹窗 -->
  <ml-dialog
    width="450px"
    ref="serviceDialogRef"
    :closeOnClickModal="false"
    :title="$LANG_TEXT('服务器地址')"
    @confirm="serviceDialogConfirm"
  >
    <template #content>
      <ml-form
        ref="serviceFormRef"
        :model="serviceForm"
        :rules="serviceRules"
        :showBtn="false"
      >
        <template #form>
          <el-form-item
            :label="`${$LANG_TEXT('服务器地址')}：`"
            prop="serviceUrl"
          >
            <el-input
              v-model="serviceForm.serviceUrl"
              :placeholder="$LANG_TEXT('请输入服务器地址')"
            />
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>
</template>

<script setup>
import {
  reactive,
  ref,
  getCurrentInstance,
  watch,
  nextTick,
  onMounted,
  computed,
} from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  authName,
  languageName,
  storeage_service_name,
} from "@/utils/apiConfig";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const mainModule = proxy.$usePiniaModule("mainModule");
const router = useRouter();

// 图标
const logo = require("@/assets/logo.png");
const accountIcon = require("@/assets/images/account-icon.png");
const passwordIcon = require("@/assets/images/password-icon.png");
// 退出程序
const exitProgramIcon = require("@/assets/images/exit-program.png");

// 是否显示固定软键盘
const showKeydown = ref(true);

// 软键盘确认
const keyboardConfirm = (call) => {
  // showKeydown.value = false;
  call();
  loginSubmit();
};

// 软键盘输入数据
const keyboardName = ref("");

const chooseKeyDown = (name) => {
  showKeydown.value = true;
  nextTick(() => {
    keyboardName.value = name;
  });
};

// ref
const formRef = ref();
const keyboardRef = ref();

// 加载
const showLoading = ref(false);

// 表单参数
const formData = reactive({
  account: "",
  password: "",
});
// 表单验证
const formRules = computed(() => ({
  account: [
    {
      message: proxy.$LANG_TEXT("请输入账号"),
      trigger: "change",
      required: true,
    },
  ],
  password: [
    {
      message: proxy.$LANG_TEXT("请输入密码"),
      trigger: "change",
      required: true,
    },
  ],
}));

// 选中焦点
const accountRef = ref();
const passwordRef = ref();
const formFocus = () => {
  const { account, password } = formData;
  focus.account = !account;
  if (!account) {
    accountRef.value.focus();
  }
  if (account) {
    if (!password) {
      passwordRef.value.focus();
    }
  }
};

// 校验表单
const testForm = (call) => {
  return new Promise((resolve) => {
    formRef.value.validate((valid, fields) => {
      if (!valid) {
        showLoading.value = false;
      }
      resolve(valid);
    });
  });
};

// 点击登录
const loginSubmit = async () => {

  if (showLoading.value) {
    return;
  }
  showLoading.value = true;

  formFocus();
  const testRes = await testForm();
  if (!testRes) {
    return;
  }

  proxy
    .$storeDispatch("fetchManageUserLogin", formData)
    .then((res) => {
      const token = res.result || "";

      proxy.$setItem(authName, token);

      mainModule.languageData = {};

      ElMessage({
        message: res.message,
        type: "success",
      });

      router.replace("/");
    })
    .catch((res) => {
      showLoading.value = false;
    });
};

// 获取本地语言
const getCurrLanguage = () => {
  const language = proxy.$getItem(languageName) || "en_US";
  mainModule.chooseLanguage = language;

  // console.log(mainModule.chooseLanguage)
  proxy.$getCurrLanguageResult();
};

// 餐厅信息
const roomDetail = ref({});
// 查询餐厅信息
const getDiningRoomSelectInfo = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetDiningRoomSelectInfo");
    const result = res.result;
    roomDetail.value = result || {};
  } catch (error) {}
};

// 监听10次
// 值
const timeNum = ref(0);
const onHandTen = () => {
  timeNum.value += 1;

  if (timeNum.value >= 10) {
    timeNum.value = 0;
    openServiceDialog();
  }
};

// 服务器设置
// ref
const serviceDialogRef = ref();
const serviceFormRef = ref();

// 数据
const serviceForm = reactive({
  serviceUrl: "",
}); // 数据
const serviceRules = {};

// 打开弹窗
const openServiceDialog = () => {
  serviceDialogRef.value.openDialog();

  nextTick(() => {
    // 赋值
    const url = proxy.$getItem(storeage_service_name);
    serviceForm.serviceUrl = url || proxy.$serveIP;
  });
};

// 确认
const serviceDialogConfirm = async (call) => {
  const testResult = await proxy.$testForm(call, serviceFormRef.value);

  if (!testResult) {
    return;
  }

  proxy.$setItem(storeage_service_name, serviceForm.serviceUrl);
  serviceDialogRef.value.closeDialog();
  call();
  router.go(0);
};

const init = () => {
  getCurrLanguage();
  getDiningRoomSelectInfo();
  formFocus();
};

onMounted(async () => {
  try {
    CefSharp.BindObjectAsync("webForm");
    const url = proxy.$getItem(storeage_service_name);
    if (url) {
      serviceForm.serviceUrl = url;
      init();
      return;
    } else {
      await proxy.$updateOutsideUrl();
      window.history.go(0);
    }
  } catch (error) {
    // alert(error);
    init();
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";

.login-container {
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .login-box {
    width: 100%;
    min-width: 360px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/images/login-bg.png");
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: cover;
    background-attachment: fixed;
    position: relative;

    .logo {
      height: 80px;
      margin-bottom: 30px;
    }

    .login-title {
    }

    .fixed-bg {
      width: 100%;
      height: 100vh;
      position: absolute;
      z-index: 2;
      background-color: #0000001c;
    }

    .login-form {
      width: 380px;
      height: 240px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;
      justify-content: space-around;
      padding: 20px;
      position: relative;
      z-index: 3;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 5px 8px 10px 0px #00000038;
      background-color: white;
      border-top: 10px solid #05d69dff;

      .custom-form {
        width: 80%;

        .el-form-item {
          // .el-input__wrapper {
          // 	background-color: transparent;
          // 	color: white;
          // 	box-shadow: none;
          // 	border-bottom: 2px solid white;
          // }

          .icon {
            width: 25px;
            height: 25px;
          }

          .remember-box {
            width: 100%;
            text-align: right;

            // .label {
            // 	color: white;
            // }
          }
        }
      }
    }

    .btn-box {
      width: 80%;
      > button {
        width: 100%;
        margin: 0;
        &:nth-child(1) {
          margin-bottom: 10px;
        }
      }

      .icon-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        > img {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }

  // 软键盘
  .keydown-box {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    transition: width 300ms ease;

    &.haveWidth {
      width: 40%;
      min-width: 450px;
    }
    &.noWidth {
      width: 0%;
    }

    .box-translate {
      width: 80%;
      .title {
        font-size: 75px;
        font-weight: bold;
        color: #05d69d;
        text-align: center;
        user-select: none;
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: all 300ms ease;
      transform: translateX(100%);
      opacity: 0;
    }
    .fade-enter-to {
      transform: translateX(0);
      opacity: 1;
    }
    .fade-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
}
</style>

<style lang="scss">
.login-box {
  // .custom-form {
  // 	.el-form-item {
  // 		.el-input__wrapper {
  // 			background-color: transparent;
  // 			color: white;
  // 			box-shadow: none;
  // 			border-bottom: 2px solid white;

  // 			input {
  // 				color: white;
  // 				&::placeholder {
  // 					color: white;
  // 				}
  // 			}
  // 		}
  // 	}
  // }
}
</style>
