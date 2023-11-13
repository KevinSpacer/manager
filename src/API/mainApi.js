
// 入口
export default [
  // 账号密码登录
  {name:'manageUserLogin',url:'/open/manageUser/login',method:'post'},
  // 修改密码
  {name:'updatePasswordPut',url:'/systemUser/updatePassword',method:'put'},
  // 查询当前用户信息
  {name:'selectCurrentUserInfo',url:'/manageUser/selectCurrentUserInfo',method:'get'},

  // 查询基础设置信息
  {name:'getBaseSetting',url:'/baseSetting/getBaseSetting',method:'get'},

  // 获取国际化语言类型列表
  {name:'getInternationalLanguageTypeList',url:'/manageUser/getInternationalLanguageTypeList',method:'get'},
  // 修改经理用户语言
  {name:'editManageUserLanguage',url:'/manageUser/editManageUserLanguage',method:'put'},
  // 获取国际化语言内容列表
  {name:'getInternationalLanguageContentList',url:'/open/manageUser/getInternationalLanguageContentList',method:'get'},

  // 获取经理用户菜单列表
  {name:'getUserCurrSelectList',url:'/manageUser/selectList',method:'get'},

  // 餐厅信息
  {name:'getDiningRoomSelectInfo',url:'/open/diningRoom/selectInfo',method:'get'},

  // 根据手机号码查询客户信息
  {name:'getClientByContactWay',url:'/client/getClientByContactWay',method:'get'},

  // 文件上传
  {name:'uploadImage',url:'',method:'post'},

]