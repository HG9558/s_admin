const ruleTemplate = {
  endMinute: null,
  validDates: [],
  totalNum: null,
  totalAmount: null,
  minAmount: null,
  maxAmount: null,
  multipleWater: null,
  adList: [],
  adZero: null,
  adOne: null,
  adTwo: null,
  isName: true,
  newRedPacketRainNumDtoList: [{
    count: null,
    depositAmount: null,
    validBet: null,
    isContinuous: false,
  }]
}

export default { // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  rebatesNeDtoTemplate: JSON.stringify(ruleTemplate.newRedPacketRainNumDtoList[0])
}
