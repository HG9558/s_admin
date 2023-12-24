const rebatesNeDtoTemplate = {
  agentDtoList: [],
  levelDtoList: [
    {
      multipleWater: 0,
      rebatesLevelListDtos: []
    }
  ]
};

const ruleTemplate = {
  period: 0,
  rebatesNeDto: rebatesNeDtoTemplate
};
export default {
  // 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  rebatesNeDtoTemplate: JSON.stringify(rebatesNeDtoTemplate)
};
