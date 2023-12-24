const ruleScopeDtosTemplate = {
  depositAmountType: 1,
  depositMin: null,
  lastDepositMin: null,
  lastDepositMinTimes: null,
  validBetType: 0,
  validBetMin: null,
  lastValidBetMin: null,
  donateAmount: null,
  multipleWater: null,
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
  ruleScopeDtos: [ruleScopeDtosTemplate]
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
};
