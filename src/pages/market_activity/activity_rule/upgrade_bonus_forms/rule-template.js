const ruleScopeDtosTemplate = {
  donateAmount: null,
  multipleWater: null,
};

const ruleTemplate = {
  auditCats: [],
  isName: true,
  isBank: true,
  isMobile: true,
  isMail: false,
  memDayType: 1,
  validDates: [],
  ruleScopeDtos: [ruleScopeDtosTemplate]
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
};
