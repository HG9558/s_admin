const ruleScopeDtosTemplate = {
  isName: false,
  isBank: false,
  isMobile: false,
  isMail: false,
  depositType: 0,
  validDate: 0,
  activityRuleDtos: [
    {
      amountMin: null,
      amountMax: null,
      donateType: 0,
      donateAmount: null,
      donateAmountMax: null,
      multipleWater: null
    }
  ]
};

const ruleTemplate = {
  scope: 0,
  auditCats: [],
  ruleScopeDtos: [ruleScopeDtosTemplate]
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
};
