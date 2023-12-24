const ruleTemplate = {
  auditCats: [],
  // 注册来源 开始
  appClient: true,
  pcClient: false,
  H5Client: false,
  adminManage: false,
  agentManage: false,
  friendRegister: false,
  // 注册来源 结束
  isName: false,
  isBank: false,
  isMobile: false,
  isMail: false,
  donateAmount: null,
  multipleWater: null,
  drawType: 0,
  totalCount: null, // 领取次数
}

export default {// 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
}