
export const menu = [{
  title: '系统管理',
  path: '',
  icon: 'User',
  children: [{
    title: '用户管理',
    path: '/systemUserManage',
    icon: 'List'
  },{
    title: '客户资料',
    path: '/systemCustomer',
    icon: 'List'
  },{
    title: '数据库管理',
    path: '/systemDatabase',
    icon: 'List'
  },{
    title: '语言管理',
    path: '/systemLanguage',
    icon: 'List'
  },{
    title: '打卡记录',
    path: '/systemCallLog',
    icon: 'List'
  },{
    title: '操作日志',
    path: '/systemOperationLog',
    icon: 'List'
  }]
},{
  title: '餐厅管理',
  path: '',
  icon: 'User',
  children: [{
    title: '餐厅信息',
    path: '/restaurantDetail',
    icon: 'List'
  },{
    title: '基础设置',
    path: '/restaurantConfig',
    icon: 'List'
  },{
    title: '税率',
    path: '/restaurantTaxRate',
    icon: 'List'
  },{
    title: '折扣',
    path: '/restaurantDiscount',
    icon: 'List'
  },{
    title: '服务费',
    path: '/restaurantService',
    icon: 'List'
  },{
    title: '付款方式',
    path: '/restaurantPaymentMethod',
    icon: 'List'
  }]
},{
  title: '菜品管理',
  path: '',
  icon: 'User',
  children: [{
    title: '菜品管理',
    path: '/productManage',
    icon: 'List'
  },{
    title: '分类管理',
    path: '/productClassification',
    icon: 'List'
  },{
    title: '组合管理',
    path: '/productCombination',
    icon: 'List'
  },{
    title: '套餐管理',
    path: '/productPackage',
    icon: 'List'
  },{
    title: '库存管理',
    path: '/productStock',
    icon: 'List'
  }]
},{
  title: '调味品管理',
  path: '',
  icon: 'User',
  children: [{
    title: '调味品组合',
    path: '/condimentClassify',
    icon: 'List'
  },{
    title: '调味品',
    path: '/condimentItem',
    icon: 'List'
  },{
    title: '自定义',
    path: '/condimentCustom',
    icon: 'List'
  }]
},{
  title: '活动管理',
  path: '',
  icon: 'User',
  children: [{
    title: '限时活动',
    path: '/activityTimeLimit',
    icon: 'List'
  },{
    title: '优惠活动',
    path: '/activityDiscount',
    icon: 'List'
  }]
},{
  title: '订单管理',
  path: '/hostList',
  icon: 'User',
},{
  title: '报表管理',
  path: '',
  icon: 'User',
  children: [{
    title: '报表管理',
    path: '/systemUserManage',
    icon: 'List'
  },{
    title: '报表明细',
    path: '/hostList',
    icon: 'List'
  }]
},{
  title: '硬件管理',
  path: '',
  icon: 'User',
  children: [{
    title: '打印机设置',
    path: '/systemUserManage',
    icon: 'List'
  },{
    title: '自定义小票',
    path: '/hostList',
    icon: 'List'
  }]
}]