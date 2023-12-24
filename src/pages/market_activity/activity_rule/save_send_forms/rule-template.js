const ruleTemplate = {
  isName: false,
  isBank: false,
  isMobile: false,
  drawType: 0,
  auditCats:[],
  bettingGiftRuleDtos: [
    {
      depositMin:0,
      donateType:0,
      validBetMax:null,
      validBetMin:null,
      donateAmount:null,
      multipleWater:null,
      depositAmountType:0
    }
  ]
}
export default {// 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  //ruleScopeDtosTemplate: ruleTemplate
}