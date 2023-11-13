<template>
  <div class="work-container">
    <!-- <div class="tab-box">
			<div
				class="tab-item"
				:class="{ active: userTypeValue == item.value }"
				v-for="(item, index) in userOptions"
				:key="index"
				@click="userTypeValue = item.value"
			>
				{{ $LANG_TEXT(item.label) }}
			</div>
		</div> -->
    <div class="container-box">
      <div class="login-box">
        <div class="form-box">
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
                  :prefix-icon="User"
                  @focus="chooseKeyDown('account')"
                  v-model.trim="formData.account"
                  :placeholder="$LANG_TEXT('请输入账号')"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="password" style="margin-bottom: 0">
                <el-input
                  :prefix-icon="Lock"
                  @focus="chooseKeyDown('password')"
                  v-model.trim="formData.password"
                  type="password"
                  :placeholder="$LANG_TEXT('请输入密码')"
                >
                </el-input>
              </el-form-item>
            </template>
          </ml-form>
        </div>
        <div class="keyboard-box">
          <soft-keyboard-number
            :isString="true"
            @confirm="keyboardConfirm"
            v-model="formData[keyboardName]"
          ></soft-keyboard-number>
        </div>
      </div>

      <div class="info-box">
        <div class="info-card">
          <div class="title">
            <span class="big">Hi</span>
            <span v-if="currClockInfo.account"
              >，{{ currClockInfo.account }}</span
            >
            <span v-else>，{{ $LANG_TEXT("请输入您的账号") }}</span>
          </div>

          <!-- 记录信息 -->
          <div class="log-list">
            <div class="log-item" v-for="item in logDetails" :key="item.label">
              {{ $LANG_TEXT(item.label) }}：{{ item.value }}
            </div>
          </div>

          <!-- 按钮 -->
          <div class="btn-box">
            <el-button
              class="big-btn"
              type="primary"
              size="large"
              @click="openClock('BE_ON_DUTY')"
              v-if="SHOW_ON_DUTY"
              >{{ $LANG_TEXT("上班打卡") }}</el-button
            ><el-button
              class="big-btn"
              type="primary"
              size="large"
              v-else
              disabled
              >{{ $LANG_TEXT("上班打卡") }}</el-button
            >

            <el-button
              class="big-btn"
              type="danger"
              size="large"
              v-if="SHOW_OFF_DUTY"
              @click="openClock('OFF_DUTY')"
              >{{ $LANG_TEXT("下班打卡") }}</el-button
            >
            <el-button
              class="big-btn"
              type="danger"
              size="large"
              v-else
              disabled
              >{{ $LANG_TEXT("下班打卡") }}</el-button
            >

            <el-button
              class="big-btn"
              type="warning"
              size="large"
              @click="openClock('REST')"
              v-if="SHOW_RESET_DUTY"
              >{{ $LANG_TEXT("休息打卡") }}</el-button
            >
            <el-button
              class="big-btn"
              type="warning"
              size="large"
              v-else
              disabled
              >{{ $LANG_TEXT("休息打卡") }}</el-button
            >

            <el-button class="big-btn" size="large" @click="router.go(-1)">{{
              $LANG_TEXT("退出")
            }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance, nextTick } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { userTypeOpts } from "@/utils/options";

const { proxy } = getCurrentInstance();
const router = useRouter();

// 选项卡
// STAFF_USER:员工、MANAGE_USER:经理
const userOptions = userTypeOpts();

// 选中选项卡
const userTypeValue = ref("MANAGE_USER");

// 打卡类型
const clockType = {
  BE_ON_DUTY: "上班打卡",
  OFF_DUTY: "下班打卡",
  REST: "休息打卡",
};

// 记录信息
const logDetails = computed(() => {
  const info = currClockInfo.value;
  const data = [
    {
      label: "手机号码",
      paramName: "contactWay",
      value: "----",
    },
    {
      label: "上次打卡时间",
      paramName: "punchCardRecord.clockTime",
      value: "----",
    },
    {
      label: "上次打卡类型",
      paramName: "punchCardRecord.type",
      value: "----",
    },
    {
      label: "上班总时长",
      paramName: "accumulativeWorkingTime",
      value: "----",
    },
  ];
  if (!Object.keys(info).length) {
    return data;
  }

  return data.map((item) => {
    const paramName = item.paramName;
    if (paramName.indexOf(".") != -1) {
      const [first, second] = paramName.split(".");
      try {
        const val = info[first][second];
        if (second == "type") {
          item.value = clockType[val];
        } else {
          item.value = val;
        }
      } catch (error) {
        item.value = "----";
      }
    } else {
      const val = info[paramName];
      if (paramName == "accumulativeWorkingTime") {
        item.value = val || "0h";
      } else {
        item.value = val;
      }
    }

    console.log(item);
    return item;
  });
});

// 接口
const apiConfig = computed(() => {
  const type = userTypeValue.value;

  // 获取打卡信息
  const infoApi = {
    MANAGE_USER: "fetchGetManageUserPunchCardInfo",
    STAFF_USER: "fetchGetStaffUserPunchCardInfo",
  };
  const info = infoApi[type];

  return {
    info,
  };
});

// ref
const formRef = ref();
const formDefault = () => ({
  account: "",
  password: "",
});
// 表单参数
const formData = reactive(formDefault());
// 登录缓存
const loginStore = ref({});
// 表单验证
const formRules = reactive({
  account: [
    {
      message: proxy.$LANG_TEXT("请先输入账号"),
      trigger: "change",
      required: true,
    },
  ],
  password: [
    {
      message: proxy.$LANG_TEXT("请先输入密码"),
      trigger: "change",
      required: true,
    },
  ],
});

//不同端 打卡信息
const manageInfos = reactive({
  MANAGE_USER: {},
  STAFF_USER: {},
});
// 当前选中打卡信息
const currClockInfo = computed(() => manageInfos[userTypeValue.value]);

// 上班卡显示
const SHOW_ON_DUTY = computed(() => {
  const info = currClockInfo.value.punchCardRecord || {};
  const type = info.type;
  return (
    (currClockInfo.value.id && !type) ||
    (info.id && (type == "OFF_DUTY" || type == "REST"))
  );
});

// 下班卡显示
const SHOW_OFF_DUTY = computed(() => {
  const info = currClockInfo.value.punchCardRecord || {};
  const type = info.type;
  return type == "BE_ON_DUTY" || type == "REST";
});

// 休息卡显示
const SHOW_RESET_DUTY = computed(() => {
  const info = currClockInfo.value.punchCardRecord || {};
  const type = info.type;
  return type == "BE_ON_DUTY";
});

// 软键盘确认
const keyboardConfirm = async (call) => {
  keyboardName.value = "";
  const testRes = await proxy.$testForm(call, formRef.value);
  if (!testRes) {
    return;
  }
  try {
    await getUserCallDetail(formData);
    loginStore.value = JSON.parse(JSON.stringify(formData));
    call();
    proxy.$updateParams(formData, formDefault());
    formRef.value.resetFields();
    proxy.$message.success(proxy.$LANG_TEXT("登录成功"));
  } catch (error) {
    console.log(error);
    call();
  }
};

// 获取打卡信息
const getUserCallDetail = async (params) => {
  // 获取打卡信息
  const res = await proxy.$storeDispatch(apiConfig.value.info, params);
  const result = res.result;
  manageInfos[userTypeValue.value] = result;
};

// 软键盘输入数据
const keyboardName = ref("");
// 触发焦点 赋值
const chooseKeyDown = (name) => {
  nextTick(() => {
    keyboardName.value = name;
  });
};

// 打卡
const openClock = async (type) => {
  const currInfo = currClockInfo.value;
  const userType = userTypeValue.value;
  const params = {
    contactWay: "",
    id: "",
    name: "",
  };
  for (let i in params) {
    params[i] = currInfo[i];
  }
  params.userType = userType;
  params.type = type;

  try {
    const res = await proxy.$storeDispatch("fetchAddPunchCardRecord", params);
    const tips = clockType[type];

    proxy.$message.success(proxy.$LANG_TEXT(tips + "成功"));
    getUserCallDetail(loginStore.value);
  } catch (error) {}
};
</script>

<style lang="scss">
.work-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  .tab-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;

    .tab-item {
      padding: 10px 40px;
      margin: 0 20px;
      transition: background 300ms;
      cursor: pointer;
      border-radius: 10px;

      &.active {
        background-color: #05d69d;
        color: white;
      }
    }
  }

  .container-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
    > div {
      height: 100%;
    }

    .login-box {
      padding: 0px 80px;
      box-sizing: border-box;
      .form-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        justify-content: space-around;
        padding: 20px 0;

        .custom-form {
          width: 80%;

          .el-form-item {
            .el-input__wrapper {
              background-color: transparent;
              color: #c4c4c4;
              box-shadow: none;
              border-bottom: 2px solid #c4c4c4;

              .el-input__prefix {
                font-size: 25px;
              }

              input {
                color: #c4c4c4;
                &::placeholder {
                  color: #c4c4c4;
                }
              }
            }

            .icon {
              width: 25px;
              height: 25px;
            }
          }
        }
      }

      .keyboard-box {
        width: 90%;
        margin: auto;
      }
    }

    .info-box {
      padding: 15px;
      height: 100%;
      box-sizing: border-box;
      .info-card {
        padding: 30px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid #c4c4c4;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-evenly;

        .title {
          font-size: 45px;
          text-align: center;
          color: #666666;

          .big {
            font-size: 65px;
            vertical-align: -5px;
          }
        }

        .log-list {
          .log-item {
            height: 88px;
            background: #ffffff;
            box-shadow: 0px 0px 6px rgb(220 220 220 / 50%);
            opacity: 1;
            border-radius: 10px;
            font-size: 22px;
            padding: 30px;
            box-sizing: border-box;
            margin: 20px 0;
          }
        }

        .btn-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          justify-items: center;
          .big-btn {
            width: 140px;
            height: 50px;
            font-size: 16px;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>