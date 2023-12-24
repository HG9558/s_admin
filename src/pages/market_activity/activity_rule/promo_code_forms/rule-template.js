const ruleScopeDtosTemplate = {
  depositAmountFlag: 1,
  depositMin: null,
  lastDepositMin: null,
  lastDepositMinTimes: null,
  validBetFlag: 0,
  validBetMin: null,
  lastValidBetMin: null,
  donateAmountList: [0],
  minVipLv: 0,
  maxVipLevel: 0,
  multipleWater: null,
  exchangeTimes: 0,
  depositAmount: 0,
  depositStartTime: null,
  depositEndTime: null,
};

const ruleTemplate = {
  auditCats: [],
  isName: false,
  isBank: false,
  isMobile: false,
  isMail: false,
  day: 0 ,
  memDayType: 1,
  validDates: [],
  scope: 0,
  ruleScopeDto: ruleScopeDtosTemplate
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
};
