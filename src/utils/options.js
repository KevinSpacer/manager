
// 用户状态
export const userStatusOpts = () => {
  return [{
    label: '启用',
    value: 'ENABLE'
  }, {
    label: '禁用',
    value: 'DISABLE'
  }]
}


// 打卡类型
export const callTypeOpts = ()=>[{
  label: '上班打卡',
  value: ''
}, {
  label: '下班打卡',
  value: ''
}, {
  label: '休息打卡',
  value: ''
}]

// 订单状态
export const orderStatusOpts = ()=>[{
  label: '待支付',
  value: ''
}, {
  label: '已取消',
  value: ''
}, {
  label: '已完成',
  value: ''
}]

// 订单类型
export const orderTypeOpts = ()=>[{
  label: '堂食',
  value: 'EAT_IN'
}, {
  label: '外卖',
  value: 'TAKE_OUT'
}, {
  label: '等取',
  value: 'TAKE_FOOD'
}]

// 用户类型
export const userTypeOpts = ()=>[{
  label:'员工',
  value:'STAFF_USER'
},{
  label:'经理',
  value:'MANAGE_USER'
}]


// 国际语言
export const languageOpts = () => [
  {
    "label": "中文",
    "value": "zh_CN",
    elementLocale:"zhCn"
  },
  // {
  //   "label": "中文（中国台湾，繁体中文）",
  //   "value": "zh_TW",
  //   elementLocale:"zhTw"
  // },
  // {
  //   "label": "中文（中国香港，繁体中文）",
  //   "value": "zh_HK",
  //   elementLocale:"zhTw"
  // },
  {
    "label": "英文",
    "value": "en_US",
    elementLocale:"en"
  },
  // {
  //   "label": "英文（英国）",
  //   "value": "en_GB",
  //   elementLocale:"en"
  // },
  // {
  //   "label": "英文（全球）",
  //   "value": "en_WW",
  //   elementLocale:"en"
  // },
  {
    "label": "德文",
    "value": "de_DE",
    elementLocale:"de"
  },
  {
    "label": "法语",
    "value": "fr_FR",
    elementLocale:"fr"
  },
  {
    "label": "韩文",
    "value": "ko_KR",
    elementLocale:"ko"
  },
  {
    "label": "日语",
    "value": "ja_JP",
    elementLocale:"ja"
  },
  {
    "label": "荷兰语",
    "value": "nl_NL",
    elementLocale:"nl"
  },
  {
    "label": "西班牙语",
    "value": "es_ES",
    elementLocale:"es"
  },
  {
    "label": "俄语",
    "value": "ru_RU",
    elementLocale:"ru"
  },
  {
    "label": "意大利语",
    "value": "it_IT",
    elementLocale:"it"
  },
  {
    "label": "希腊语",
    "value": "el_GR",
    elementLocale:"el"
  },
  {
    "label": "挪威语",
    "value": "no_NO",
    elementLocale:"nbNo"
  },
  {
    "label": "匈牙利语",
    "value": "hu_HU",
    elementLocale:"hu"
  },
  {
    "label": "土耳其语",
    "value": "tr_TR",
    elementLocale:"tr"
  },
  {
    "label": "捷克语",
    "value": "cs_CZ",
    elementLocale:"cs"
  },
  {
    "label": "斯洛文尼亚语",
    "value": "sl_SL",
    elementLocale:"sl"
  },
  {
    "label": "波兰语",
    "value": "pl_PL",
    elementLocale:"pl"
  },
  {
    "label": "瑞典语",
    "value": "sv_SE",
    elementLocale:"sv"
  },
  {
    "label": "葡萄牙语",
    "value": "pt_PT",
    elementLocale:"pt"
  },
  {
    "label": "葡萄牙语",
    "value": "pt_BR",
    elementLocale:"ptBr"
  },
  {
    "label": "芬兰语",
    "value": "fi_FI",
    elementLocale:"fi"
  },
  {
    "label": "希伯来语",
    "value": "he_IL",
    elementLocale:"he"
  }
]

// 折扣方式
export const discountMannerTypes = {
  ALL:'所有商品',
  NOT_DISCOUNT:'非打折商品'
}
// 折扣类型
export const discountTypes = {
  ORDER:'订单折扣',
  CASH:'现金折扣'
}
// 是否免单
export const isFreeOrderTypes = {
  YES:'是',
  NO:'否'
}
// 抹零类型
export const maLingTypes = {
  NO:'不抹',
  YUAN:'抹元',
  ANGLE:'抹角',
  POINTS:'抹分'
}
// 服务费类型
export const serviceChargeTypes = {
  QUOTA:'定额',
  PERCENT:'百分比'
}