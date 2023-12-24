const ruleScopeDtosTemplate = [
  // {
  //   actLevelId:0,
  //   validbetMin:'',
  //   depositMin:'',
  //   donateAmount:'',
  //   multipleWater:''
  // },
  // {
  //   actLevelId:1,
  //   validbetMin:'',
  //   depositMin:'',
  //   donateAmount:'',
  //   multipleWater:''
  // }
]

const ruleTemplate = {
  // auditCats: [],
  isName: false,
  isBank: false,
  isMobile: false,
  isMail: false,
  // memDayType: 1,
  // validDates: [],
  ruleScopeDtos: ruleScopeDtosTemplate
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
};
