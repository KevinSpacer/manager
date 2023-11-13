<template>
	<div class="container">
		<!-- 左侧区域 -->
		<div class="container-left" @click="goMain">
			<!-- logo -->
			<img class="logo" :src="$previewFileUrl + roomInfo.logo" alt="" />

			<!-- 标题 -->
			<div class="title">
				<p>
					<second-language
						:firstText="roomInfo.name || ''"
						:secondText="roomInfo.nameLanguage || ''"
					></second-language>
				</p>
			</div>
		</div>

		<!-- 右侧功能区域 -->
		<div class="container-right">
			<!-- 日期时间 -->
			<div class="show-date">
				<header-date-show></header-date-show>
			</div>

			<!-- 餐厅信息 -->
			<div class="restaurant-detail">
				<p>
					<span>{{ $LANG_TEXT("联系方式") }}：</span>
					<second-language
						:firstText="roomInfo.contactWay || ''"
						:secondText="roomInfo.contactWayLanguage || ''"
					></second-language>
				</p>
				<p>
					<span>{{ $LANG_TEXT("地址") }}：</span>
					<second-language
						:firstText="roomInfo.address || ''"
						:secondText="roomInfo.addressLanguage || ''"
					></second-language>
				</p>
			</div>

			<!-- 多语言 -->
			<div class="language-box">
				<el-dropdown
					type="primary"
					placement="bottom"
					max-height="300px"
					trigger="click"
					@visible-change="getCurrSetLanguage"
					v-if="proxy.$isUseAuth('语言切换')"
				>
					<el-button type="primary" text bg>{{
						$LANG_TEXT(currLanguage.label)
					}}</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="(item, index) in showLanguage"
								:key="'lang' + index"
								@click="changeLanguage(item.value)"
							>
								{{ $LANG_TEXT(item.label) }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>

			<!-- 右侧数据 -->
			<el-dropdown trigger="click">
				<!-- 用户信息 -->
				<div>
					<div class="user-detail">
						<!-- 头像 -->
						<!-- <div class="avatar">
							<el-avatar :icon="UserFilled" :size="40" />
						</div> -->

						<!-- 名称 -->
						<div class="nickname">
							<span>{{ userInfo.name || "user" }}</span>
						</div>
					</div>
				</div>
				<!-- <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openServiceDialog">
              {{ $LANG_TEXT("设置服务器地址") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template> -->
			</el-dropdown>
		</div>
	</div>

	<!-- 修改密码弹窗 -->
	<ml-dialog
		ref="pwdRef"
		:title="$LANG_TEXT('修改密码')"
		@confirm="dialogConfirm"
	>
		<template #content>
			<ml-form
				ref="formRef"
				:model="pwdForm"
				:rules="pwdRules"
				:showBtn="false"
			>
				<template #form>
					<el-form-item :label="`${$LANG_TEXT('旧密码')}：`" prop="oldPassWord">
						<el-input
							v-model="pwdForm.oldPassWord"
							:placeholder="$LANG_TEXT('请输入旧密码')"
							show-password
						/>
					</el-form-item>
					<el-form-item :label="`${$LANG_TEXT('新密码')}：`" prop="newPassWord">
						<el-input
							v-model="pwdForm.newPassWord"
							:placeholder="$LANG_TEXT('请输入新密码')"
							show-password
						/>
					</el-form-item>
					<el-form-item
						:label="`${$LANG_TEXT('确认密码')}：`"
						prop="confirmPwd"
					>
						<el-input
							v-model="pwdForm.confirmPwd"
							:placeholder="$LANG_TEXT('请输入确认密码')"
							show-password
						/>
					</el-form-item>
				</template>
			</ml-form>
		</template>
	</ml-dialog>

	<!-- 服务器地址弹窗 -->
	<ml-dialog
		width="450px"
		ref="serviceDialogRef"
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
	watch,
	ref,
	getCurrentInstance,
	computed,
	onMounted,
	nextTick,
} from "vue";
import headerDateShow from "@/components/header-date-show.vue";
import { useRouter } from "vue-router";
import { testPwd } from "@/utils/regExp.js";
import { languageOpts } from "@/utils/options";
import { languageName, storeage_service_name } from "@/utils/apiConfig";
import { UserFilled } from "@element-plus/icons-vue";

const emits = defineEmits(["changeLanguage"]);

const avatarIcon = require("@Assets/logo.png");
const router = useRouter();
const { proxy } = getCurrentInstance();

const mainModule = proxy.$usePiniaModule("mainModule");

// 用户信息
const userInfo = computed(() => mainModule.getUserInfo);
//餐厅信息
const roomInfo = computed(() => mainModule.roomDetail);
// 基本信息
const baseInfo = computed(() => mainModule.baseConfigInfo);

watch(
	() => mainModule.chooseLanguage,
	(nVal) => {
		init(nVal);
	}
);

// 初始
const init = async (nVal) => {
	await getCurrSetLanguage();
	await proxy.$getCurrLanguageResult();

	proxy.$setItem(languageName, nVal);

	const defaultLanguage = baseInfo.value.defaultLanguage;
	// console.log(defaultLanguage)
	// console.log(nVal)
	if (defaultLanguage) {
		// 选择默认语言外的语言
		mainModule.isSecondLanguage = nVal != defaultLanguage;
	}
};

// ref
const pwdRef = ref();
// 修改密码表单参数
const pwdForm = reactive({
	oldPassWord: "",
	newPassWord: "",
	confirmPwd: "",
});
const validPwd = () => ({
	validator: (params, value) => testPwd(value),
	message: proxy.$LANG_TEXT("密码为6~20位的数字、字母或其组合"),
});
// 是否相同
const validPwdRight = () => ({
	validator: (params, value) => {
		return (
			pwdForm.newPassWord &&
			pwdForm.confirmPwd &&
			pwdForm.newPassWord === pwdForm.confirmPwd
		);
	},
	message: proxy.$LANG_TEXT("两次密码不一致"),
});
// 修改密码表单校验
const pwdRules = reactive({
	oldPassWord: [
		{
			message: proxy.$LANG_TEXT("请先填写旧密码"),
			trigger: "change",
			required: true,
		},
		validPwd(),
	],
	newPassWord: [
		{
			message: proxy.$LANG_TEXT("请先填写新密码"),
			trigger: "change",
			required: true,
		},
		validPwd(),
		validPwdRight(),
	],
	confirmPwd: [
		{
			message: proxy.$LANG_TEXT("请先填写确认密码"),
			trigger: "change",
			required: true,
		},
		validPwd(),
		validPwdRight(),
	],
});

// 弹窗
// 打开窗口
const openCase = () => {
	pwdRef.value.openDialog();
};
// 表单ref
const formRef = ref();

// 弹窗确认
const dialogConfirm = async (call) => {
	const testResult = await proxy.$testForm(call, formRef.value);

	if (!testResult) {
		return;
	}

	// mainModule
	// 	.fetchUpdatePasswordPut(pwdForm)
	// 	.then((res) => {
	// 		proxy.$message({
	// 			type: "success",
	// 			message: proxy.$LANG_TEXT("修改成功"),
	// 		});
	// 		pwdRef.value.closeDialog();
	// 		formRef.value.resetFields();

	// 		loginOut();
	// 	})
	// 	.catch(() => {
	// 		call();
	// 	});

	// console.log(pwdForm);
};

// 语言
const languageOptions = languageOpts();

// 选择的语言显示文本
const currLanguage = computed(() => {
	const lang = languageOptions.find(
		(item) => item.value == mainModule.chooseLanguage
	);
	// console.log(mainModule.chooseLanguage);
	return lang;
});

// 监听当前语言变动
const 
changeLanguage = async (type) => {
	if (mainModule.chooseLanguage == type) {
		return;
	}
	mainModule.chooseLanguage = type;
	await proxy.$storeDispatch("fetchEditManageUserLanguage", type);
	setTimeout(async () => {
		await proxy.$getCurrLanguageResult();
		emits("changeLanguage");
	},500);
};

// 需要展示的语言
const showLanguage = ref();

// 查询当前已设置的语言
const getCurrSetLanguage = async () => {
	const res = await proxy.$storeDispatch(
		"fetchGetInternationalLanguageTypeList"
	);
	const result = res.result;
	const types = result.map((item) => item.type);

	showLanguage.value = languageOptions.filter((item) =>
		types.includes(item.value)
	);
};

// // 获取最终选择的语言数据 废弃
// const getCurrLanguageResult = async () => {
// 	// 赋值
// 	const res = await getCurrChangeLanguage();
// 	const result = res.result;
// 	mainModule.languageData = result.reduce((add, curr, index) => {
// 		add[curr.key] = curr.value;
// 		return add;
// 	}, {});
// };

// 查询当前选中语言数据
// const getCurrChangeLanguage = () => {
// 	const type = mainModule.chooseLanguage;
// 	console.log(type)
// 	return proxy.$storeDispatch("fetchGetInternationalLanguageContentList", {
// 		type,
// 	});
// };

// 回到首页
const goMain = () => {
	router.replace("/main");
};

// 退出登录
const loginOut = () => {
	mainModule.clearUseStore();
	router.replace("/login");
};

// 服务器设置
// ref
const serviceDialogRef = ref();
const serviceFormRef = ref();

// 数据
const serviceForm = reactive({
	serviceUrl: "",
}); // 数据
const serviceRules = {
	// 废弃
	//   serviceUrl: [
	//     {
	//       validator: (rules, value, call) => {
	//         if (value) {
	//           if (testServiceUrl(value)) {
	//             call();
	//           } else {
	//             call(new Error(proxy.$LANG_TEXT("请输入正确的服务器地址")));
	//           }
	//         } else {
	//           call();
	//         }
	//       },
	//     },
	//   ],
};

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

onMounted(async () => {
	// init(mainModule.chooseLanguage);
});

defineExpose({
	init,
});
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	justify-items: stretch;
	padding: 0 15px;
	box-sizing: border-box;
	background-color: white;
	box-shadow: 0px 5px 10px 0px #0000000d;

	&-left {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		position: relative;
		z-index: 1;
		cursor: pointer;

		.logo {
			width: 70px;
			height: auto;
			margin-right: 10px;
		}

		.title {
			font-size: 22px;
			font-weight: bold;
		}
	}

	&-right {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		z-index: 2;

		> div + div {
			margin-left: 20px;
		}

		.restaurant-detail {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			align-items: center;
			font-size: 16px;

			> p {
				margin-right: 20px;
				display: flex;
				align-items: center;

				&:nth-last-child(1) {
					margin-right: 0;
				}
			}
		}

		// 用户信息
		.user-detail {
			.avatar {
			}

			.nickname {
				min-width: 60px;
				max-width: 150px;
				font-size: 16px;
				margin-left: 10px;
			}
		}
	}
}
</style>