const ruleTemplate = {
  isName: false,
  isBank: false,
  isMobile: false,
  drawType: 0,
  auditCats: [], //流水范围
  ruleDtos: [
    {
      payoutMin: null, //最小投注额
      payoutMax: null, //最大投注额
      donateAmount: null, //赠送比例
      donateAmountMax: null, //最高赠送金额
      depositAmountType: 0, //存款金额限制 0不限制 1限制
      depositMin: 0, //最小存款额，当depositAmountType=0时，可为空
      multipleWater: null //流水倍数
    }
  ]
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate)
  //ruleScopeDtosTemplate: ruleTemplate
};
