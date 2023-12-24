const ruleTemplate = {
  startTime: "",
  activityLinkedList: {},
  applyType: 0,
  jDepositSentDto: {
    scope: 0,

  }
}

export default { // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
}
