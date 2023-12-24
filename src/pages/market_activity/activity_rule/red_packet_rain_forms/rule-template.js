const ruleTemplate = {
  endTime: "",
  startTime: "",
  validDates: [],
  randomAmount: [],
  multipleWater: "",
  redPacketRainRuleDtos: [{
    number: null,
    isAward: false,
    minAmount: null
  }]
}

export default { // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  rebatesNeDtoTemplate: JSON.stringify(ruleTemplate.redPacketRainRuleDtos[0])
}
