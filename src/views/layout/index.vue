<template>
  <el-config-provider :locale="language">
    <div
      id="main"
      v-if="isRefresh"
      @touchmove="backMousemove($event, 'main')"
      @touchend="backMouseup"
      @mousemove="backMousemove($event, 'main')"
    >
      <!-- 顶部栏 -->
      <div class="header" :class="{ hide: currentRoute.path != '/main' }">
        <Header-Box
          v-if="currentRoute.path == '/main'"
          @changeLanguage="changeLanguage"
          ref="headerRef"
        ></Header-Box>
      </div>
      <!-- 内容 -->
      <div class="container">
        <!-- 右侧展示 -->
        <div class="component-box">
          <div class="iframe ml-scrollbar" v-if="isRefresh">
            <router-view></router-view>
          </div>
        </div>
        <!-- replace float button with regular button to avoid touch conflict by zizhen guo Oct-30-2023-->
        <div class="bottom" v-if="currentRoute.path != '/main'">
          <button class="bottom-button"
          @click="goBack">Home</button>
        </div>
      </div>
    </div>
    
    <!-- 悬浮按钮 -->
    <!-- 返回 -->
    <!-- <fixed-main-btn
      v-if="currentRoute.path != '/main'"
      type="back"
      @handClick="goBack"
      ref="fixedBackRef"
    >
      <el-icon><ArrowLeftBold /></el-icon>
    </fixed-main-btn> -->
    <!-- 键盘开关 -->
    <!-- <fixed-main-btn
      type="keyboard"
      :initStartTop="100"
      @handClick="togglerKeyboard"
      ref="fixedKeyboardRef"
    >
    </fixed-main-btn> -->
  </el-config-provider>
</template>

<script setup>
import {
  getCurrentInstance,
  ref,
  watch,
  computed,
  onMounted,
  nextTick,
  reactive,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { authName } from "@/utils/apiConfig.js";
import { ElConfigProvider } from "element-plus";
import * as locale from "element-plus/lib/locale";
import { languageOpts } from "@/utils/options";

import HeaderBox from "./components/header.vue";
import fixedMainBtn from "@/components/fixed-main-btn/index.vue";

const router = useRouter();
const route = useRoute();
const { currentRoute } = router;
const { proxy } = getCurrentInstance();

const { mainModule } = proxy.$usePiniaModule();

const userInfo = computed(() => mainModule.userInfo);

const headerRef = ref();

// 图标
const keyboardIcon = require("@/assets/images/keyoard.png");

// 语言
const language = computed(() => {
  const langParams = languageOpts();

  const lang =
    langParams.find((item) => item.value == mainModule.chooseLanguage) ||
    "zhCh";

  return locale[lang.elementLocale];
});

const isLogin = async () => {
  const token = proxy.$getItem(authName);
  if (!token) {
    router.replace("/login");
    return;
  } else {
    // 全局查询集合
    await getBaseConfigInfo();
    await getCurrUserInfo();
    await getCurrManageAuth();
    await getDiningRoomSelectInfo();
    return true;
  }
};

// 是否刷新
const isRefresh = ref(true);

// 刷新框架
const refreshLayout = () => {
  isRefresh.value = false;

  proxy.$nextTick(() => {
    isRefresh.value = true;
  });
};

// 监听语言选择
const changeLanguage = () => {
  // console.log("changeLanguage");
  refreshLayout();
};

// 刷新

// 处理面包屑
watch(
  () => currentRoute.value.matched,
  (nVal) => {
    isLogin();
  }
);

// 顶部header组件回调
const headerCall = (name) => {};
// 修改密码
const updatePwd = () => {};
// 退出登录
const loginOut = () => {};

// 查询当前登录用户信息
const getCurrUserInfo = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchSelectCurrentUserInfo");
    const result = res.result;

    mainModule.userInfo = result;

    mainModule.chooseLanguage =
      result.language ||
      mainModule.baseConfigInfo.defaultLanguage ||
      proxy.$getItem(languageName) ||
      "en_US";
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
};

// 基础设置信息
const baseDetail = ref();
// 查询
const getBaseConfigInfo = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetBaseSetting");
    const result = res.result;
    // console.log(result);
    baseDetail.value = result;

    // 赋值全局
    mainModule.baseConfigInfo = result;
    console.log("开始计时");
    timeRouterCall(route.path);
  } catch (error) {}
};

// 查询当前经理所拥有的权限
const getCurrManageAuth = async () => {
  const info = baseDetail.value;
  try {
    const res = await proxy.$storeDispatch(
      "fetchGetUserCurrSelectList",
      userInfo.value.id
    );

    // 功能权限
    const titles = res.result.map((item) => item.title);

    // 处理进入功能权限
    // 进入页面（NORMAL:正常、EAT_IN:堂食、TAKE_OUT:外卖、TAKE_FOOD:自取）
    const enterPages = [
      {
        value: "EAT_IN",
        label: "堂食",
      },
      {
        value: "TAKE_OUT",
        label: "外卖",
      },
      {
        value: "TAKE_FOOD",
        label: "等取",
      },
    ];
    // 进行限制
    if (info.enterPage != "NORMAL") {
      // 先重置
      for (let i = 0; i < enterPages.length; i++) {
        const item = enterPages[i];
        const autIndex = titles.findIndex((d) => d == item.label);
        titles.splice(autIndex, 1);
      }

      // 当前权限
      const currAuth = enterPages.find((item) => item.value == info.enterPage);
      titles.push(currAuth.label);
    }
    // console.log(titles);
    // 赋值
    mainModule.isUseAuths = titles;
  } catch (error) {}
};

// 餐厅信息
// 查询餐厅信息
const getDiningRoomSelectInfo = async () => {
  try {
    const res = await proxy.$storeDispatch("fetchGetDiningRoomSelectInfo");
    const result = res.result;
    mainModule.roomDetail = result || {};
  } catch (error) {}
};

// 计时ID
const autoTimeId = ref({});
// 判断无操作自自动退出
const autoOut = (call) => {
  const detail = baseDetail.value;
  clearTime();
  try {
    // 已设置时间
    if (detail.autoExit) {
      // 转换成秒
      const mine = detail.autoExit;
      const second = mine * 60;
      const timeSp = second * 1000;

      console.log(`计时${mine}分钟`);
      autoTimeId.value = setTimeout(() => {
        console.log("时间到");
        call();
        clearTime();
      }, timeSp);
    }
  } catch (error) {}
};
// 清除计时
const clearTime = () => {
  clearTimeout(autoTimeId.value);
  autoTimeId.value = null;
};

watch(
  () => route.path,
  (nVal) => {
    console.log("重置");
    console.log(nVal);
    timeRouterCall(nVal);
  }
);

// 判断计时
const timeRouterCall = (path) => {
  if (path == "/login") {
    return;
  }
  // 主页
  if (path == "/main") {
    autoOut(() => {
      mainModule.clearUseStore();
      router.replace("/login");
      console.log("退出");
    });
  } else {
    //其他
    autoOut(() => {
      router.replace("/main");
      console.log("回主页");
    });
  }
};

// 浮动按钮
const fixedBackRef = ref();
const fixedKeyboardRef = ref();

// 移动
const backMousemove = (e) => {
  if (fixedBackRef.value) {
    fixedBackRef.value.backMousemove(e);
  }
  // fixedKeyboardRef.value.backMousemove(e);
};

// 结束
const backMouseup = (e) => {
  if (fixedBackRef.value) {
    fixedBackRef.value.backMouseup(e);
  }
  // fixedKeyboardRef.value.backMouseup(e);
};

// 点击返回
const goBack = () => {
  router.replace("/main");
};

// 控制键盘
const togglerKeyboard = () => {
  try {
    webForm.openOrCloseKeyborad();
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  const isResult = await isLogin();

  // 判断是否登录
  if (!isResult) {
    return;
  }

  // 初始语言
  setTimeout(() => {
    if (headerRef.value) {
      headerRef.value.init(mainModule.chooseLanguage);
    }
  });

  // 监听全局点击
  window.onclick = () => {
    if (route.path == "/login") {
      return;
    }
    console.log("重置");
    timeRouterCall(route.path);
  };
});
</script>

<style lang="scss" scoped>
$headerHeight: 100px;
$mainHeight: 100vh;

#main {
  display: grid;
  grid-template-rows: auto 1fr;
  height: $mainHeight;
  position: relative;
  animation: opacityShow 1s ease-in;

  @keyframes opacityShow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  > .header {
    height: $headerHeight;
    padding-bottom: 10px;
    box-sizing: border-box;

    &.hide {
      height: 0;
    }
  }

  // 内容区域
  > .container {
    width: 100%;
    display: grid;
    background-color: #f0f2f5e8;
    overflow: hidden;
    .bottom{
    position: absolute;
    bottom: 0; /* set the bottom to 0*/
    margin-left: 10px;
    display: flex;
    align-items: center;
    .bottom-button{
      background-color: #4CAF50;
      border: none;
      background-color: var(--el-color-primary);
      color: white;
      padding: 10px 8px;
      border-radius: 50px;
      text-align: center;
      text-decoration: none;
      font-size: 16px;
      margin: 4px 2px;
  cursor: pointer;

    }
    }
    > .component-box {
      overflow: hidden;
      > .iframe {
        background-color: white;
        overflow-y: auto;
        height: 100%;
      }
    }
  }
}

//
.fiexd-main-btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  &.keyboard {
    background-image: url(../../assets/images/keyoard.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 25px;
    z-index: 4000;
  }
}
</style>
