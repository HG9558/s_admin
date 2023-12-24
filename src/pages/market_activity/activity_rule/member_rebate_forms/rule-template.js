const ruleScopeDtosTemplate = {
  auditType: 0,
  auditMultiple: 0,
  minVipLevel: 0,
  maxVipLevel: 0,
  levelDtoList: [
    {
      level: 0,
      depthDtoList: [
        {
          depth: 1,
          catDtoList: [
            {
              "catId":1,
              "catName":'体育',
              "validBet":null,
              "topRebate":null
            },
            {
              "catId":3,
              "catName":'真人',
              "validBet":null,
              "topRebate":null
            },
            {
              "catId":5,
              "catName":'电子',
              "validBet":null,
              "topRebate":null
            },

            {
              "catId":6,
              "catName":'棋牌',
              "validBet":null,
              "topRebate":null
            },
            {
              "catId":8,
              "catName":'捕鱼',
              "validBet":null,
              "topRebate":null
            },
          {
            "catId":9,
            "catName":'电竞',
            "validBet":null,
            "topRebate":null
          },
            {
              "catId":12,
              "catName":'彩票',
              "validBet":null,
              "topRebate":null
            },
          ],
        }
      ],
      rebateFirstChargeDto: {
        minCharge: null,
        maxCharge: null,
        referrer: null,
        referee: null,
      },
      rebateVipDtoList: [
        {
          level: 1,
          award: null,
        },
        {
          level: 2,
          award: null,
        },
        {
          level: 3,
          award: null,
        },
        {
          level: 4,
          award: null,
        },
        {
          level: 5,
          award: null,
        },
        {
          level: 6,
          award: null,
        },
        {
          level: 7,
          award: null,
        },
        {
          level: 8,
          award: null,
        },
        {
          level: 9,
          award: null,
        },
        {
          level: 10,
          award: null,
        },
      ],
      rebateChargeDtoList: [
        {
          num: null,
          minCharge: null,
          award: null,
          multiple: null,
        },
        {
          num: null,
          minCharge: null,
          award: null,
          multiple: null,
        },
        {
          num: null,
          minCharge: null,
          award: null,
          multiple: null,
        },
      ],
    },
  ],
}

  const ruleTemplate = {
    auditMultiple: 0,
    startTime: '',
    endTime: '',
    startLevel: '',
    endLevel: '',
    // auditType: 0,
    ruleScopeDtos: [...ruleScopeDtosTemplate]
  }
  export default {// 为了避免指向问题 先转成JSON字符串 用的时候再转为Object
    ruleTemplate: JSON.stringify(ruleTemplate),
    ruleScopeDtosTemplate: JSON.stringify(ruleScopeDtosTemplate)
  }
