const ruleTemplate = {
  // ruleName: null,
  // available: 1, // 是否启用
  // isAudit: 1, // 是否审核
  lotteryAreaDtos: [ // 抽奖区集合
    {
      prizeArea: 1,
      prizeAreaDtos: [ // 抽奖区列表 - 默认四行
        {
          prizeType: null, // 奖品类型 1谢谢参与,2彩金,3实物奖品
          prizeName: null, // 奖品名称
          donateAmount: null, // 彩金金额
          multipleWater: null, // 流水倍数
          probability: null, // 中奖概率
          prizeNumber: null, // 抽奖份数
        },
        {
          prizeType: null, // 奖品类型 1谢谢参与,2彩金,3实物奖品
          prizeName: null, // 奖品名称
          donateAmount: null, // 彩金金额
          multipleWater: null, // 流水倍数
          probability: null, // 中奖概率
          prizeNumber: null, // 抽奖份数
        },
        {
          prizeType: null, // 奖品类型 1谢谢参与,2彩金,3实物奖品
          prizeName: null, // 奖品名称
          donateAmount: null, // 彩金金额
          multipleWater: null, // 流水倍数
          probability: null, // 中奖概率
          prizeNumber: null, // 抽奖份数
        },
        {
          prizeType: null, // 奖品类型 1谢谢参与,2彩金,3实物奖品
          prizeName: null, // 奖品名称
          donateAmount: null, // 彩金金额
          multipleWater: null, // 流水倍数
          probability: null, // 中奖概率
          prizeNumber: null, // 抽奖份数
        },
      ],
      isName: false,
      isBank: false,
      isMobile: false,
      isMail: false,
      actLevelIds: [], // 等级id集合
      domains: null, // 域名集合注册来源 string
      registerCondition: 0, // 注册时间 0不限制  1多少天内注册  2日期之后注册
      registerNum: null, // 1多少天内注册
      registerDate: null, // 2日期之后注册
      cycle: 0, // 抽奖次数统计周期 0 每日  1周
      depositDtos: [ // 抽奖次数赠送规则
        {
          sign: 0, // 0累计充值 1首次单笔充值 2有效投注
          amountConditions: null, // 0累计充值 期间累计充值不少于  1期间首次单笔充值不少于  2期间有效投注不少于
          num: null, // 赠送次数
          isNewAdd: false, // 前端自定义，用于判断当前行是否是新添加的内容 默认false 新添加true
          isCheckSign: 0, // 前端自定义,唯一值，用于判断是否在勾选集合内，
          isSelected: 0 // 后端校验计算需要，是否已勾选
        },
        {
          sign: 1,
          amountConditions: null,
          num: null,
          isNewAdd: false,
          isCheckSign: 1,
          isSelected: 0
        },
        {
          sign: 2,
          amountConditions: null,
          num: null,
          isNewAdd: false,
          isCheckSign: 2,
          isSelected: 0
        }
      ],
      lotteryDepositDtoList: [], // 抽奖次数赠送规则勾选集合
      domainsCondition: false, // 域名是否选择 true选择 false未选择
      registerDomains: null, // 从域名注册
      num: null, // 域名注册送多少次数
      isCheckAllApplyLevel: true, // 申请等级只有在添加时默认全选
    }
  ],
}

const arr = JSON.parse(JSON.stringify(ruleTemplate.lotteryAreaDtos[0].depositDtos))
const addDepositDtos = arr.map(item => { // 增加抽奖次数赠送规则
  return {
    ...item,
    isNewAdd: true
  }
})

const rebatesNeDtoTemplate = {
  addDepositDtos: JSON.stringify(addDepositDtos),// 增加抽奖次数赠送规则
  addLotteryAreaDtos: JSON.stringify(ruleTemplate.lotteryAreaDtos[0]), // 增加抽奖
  prizeAreaDtos: JSON.stringify(ruleTemplate.lotteryAreaDtos[0].prizeAreaDtos[0])
}
export default {// 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
  ruleTemplate: JSON.stringify(ruleTemplate),
  rebatesNeDtoTemplate: rebatesNeDtoTemplate
}