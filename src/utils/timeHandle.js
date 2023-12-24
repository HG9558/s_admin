import moment from 'moment'
import store from '../store'

/**
 * 返回数据的处理策略对象 -- 简单数据类型
 * @param { Object } data 接口返回的对象
 * {
    "msg": "success",
    "code": 0,
    "data": {
        ...
        "list": [
            {
                ...
                "betTime": "2022-03-15 15:18:33",
                ...
            },
        ]
      }
    }
 * @param { Object } key 后台返回包含时间需要处理的字段 betTime
 * @param { Object } strategiesValue 对应策略的值 data.list
 */
function arrType(url, data, key, strategiesValue, format) {
  const dataKeys = strategiesValue.split('.')
  // 根据返回的 data 里，遍历是否存在dataKeys的字段，决定是否要处理数据
  let needHandle = false
  let tmpData
  for (let len = dataKeys.length, i = 0; i < len; i++) {
    const keyIndex = dataKeys[i]
    const nowData = (tmpData || data)[keyIndex]
    if (nowData) {
      tmpData = nowData
      needHandle = true
    } else {
      needHandle = false
      break
    }
  }
  // 对数据进行处理
  if (needHandle) {
    // function ()
    tmpData = tmpData.map((tmpItem) => {
      if (tmpItem[key]) {
        // 2022-07-05 10:43:06
        console.log('99999-url:', url)
        console.log('99999-time', store.state.timeZone)
        // tmpItem[key] = moment(tmpItem[key]).valueOf().format('YYYY-MM-DD hh:mm:ss').add(7, 'h')
        tmpItem[key] = moment(tmpItem[key]).add(store.state.timeZone, 'h').format(format)
        console.log('99999-time-key', key)
        console.log('99999-time-tmpItem[key]', tmpItem[key])
      }
      return tmpItem
    })
  }
  return false
}

/**
 * 返回数据的处理策略对象
 */
const responseStrategies = {
  arrType,
}

/**
 * 查找字符串第几次出现的位置
 * @param {Object} str 源字符串
 * @param {Object} cha 要查询的字符或字符串
 * @param {Object} num 第几次出现，第一次则为 0
 */
function findStrIndex(str, cha, num) {
  let x = str.indexOf(cha)
  for (let i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1)
  }
  return x
}

/**
 * handleResponseTime 处理返回时间的修改
 * @param { String } url 请求的网址
 * @param { Object } data 接口返回的对象
 */

// const priceStrategies = {
//   "pre-sale": preSalePrice,
//   promotion: promotionPrice,
//   "black-friday": blackFridayPrice,
//   default: defaultPrice,
// };
//
// function getPrice(originalPrice, status) {
//   return responseStrategies[status](originalPrice);
// }

export function handleResponseTime(url, data) {
  // key 是 url网址
  // value 是这条网址里，需要递归寻找处理的字段
  const responseUrlMap = {
    // 会员列表
    '/bkapi/member/mbraccount/list': [{
      // 首存时间
      'depositTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      // 登录时间
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      // 最后在线时间
      'offLineTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      // 注册时间
      'registerTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员详情-资金流水
    '/bkapi/member/mbraccount/fundList': [{
      // 时间
      'orderTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员详情-转账流水
    '/bkapi/member/mbraccount/manageList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员详情-转账记录
    '/bkapi/member/mbraccount/depositList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员详情-提款记录
    '/bkapi/member/mbraccount/withdrawList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'passTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员详情-任务返利
    '/bkapi/member/mbraccount/taskList': [{
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    // 会员详情-任务返利
    '/bkapi/member/mbraccount/bonusList': [{
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    // 会员列表>详情
    '/bkapi/member/mbractlevel/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/mbrAgent/level/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbraccount/accountAutoLog': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createEndTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createStartTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/friendsRebate/friendRebatePersonalList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbraccount/accountLogList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/log/logmbrlogin/list': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'logoutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbrbankcard/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/cryptoCurrencies/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbrbankcard/historyList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'updateTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbraccount/queryAccountAuditInfo': [{
      'createtime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbrmemo/listAll': [{
      'memoTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 在线会员
    '/bkapi/member/mbraccount/listOnline': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'loginTimeEnd': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'startTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 风控信息
    '/bkapi/member/wind/mbrList': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'registerTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    // 风控信息>会员风控信息
    '/bkapi/member/wind/mbrInfoByAcc': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'registerTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    '/bkapi/member/wind/depositList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrwithdrawList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrPreferDevice': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrPreferIP': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrbillList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrfinalBetDetailsAll': [{
      'betTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'downloadTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'matchTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'payoutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrbonusList': [{
      'applicationTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrauditList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/wind/mbrLoginlist': [{
      'loginTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'logoutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 会员预警
    '/bkapi/member/mbrwarning/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'dealTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/mbrwarning/conditionList': [{
      'updateTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 资金管理 - 会员入款
    '/bkapi/fund/deposit/depositList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 资金管理 - 会员提款
    '/bkapi/fund/withdraw/accList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'passTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 资金管理 - 户内转账
    '/bkapi/fund/report/billList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 资金管理 - 资金调整
    '/bkapi/fund/report/auditList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 广告管理 - 好友转账
    '/bkapi/mbrfreindtransdetail/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'updateTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 资金管理 - 存款锁定列表
    '/bkapi/mbrdepositlock/depositLockLog': [{
      'locktime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'unlocktime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 短信记录
    '/bkapi/analysis/smslog/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 稽核报表
    '/bkapi/member/audit/immediatelyAudit': [{
      'passTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/audit/getPlatformMaxTime': [{
      'maxTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 会员资金报表
    '/bkapi/analysis/mbrFundReport/list': [{
      'depositTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'registerTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 资金报表
    '/bkapi/analysis/fundReport/list': [{
      'betLastDate': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 输赢报表
    '/bkapi/analysis/winlost/getBetLastDate': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 - 投注记录
    '/bkapi/analysis/betDetails/finalBetDetailsAll': [{
      'betTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'payoutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 -账变流水
    '/bkapi/fund/report/billRecordList': [{
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 记录报表 -资金报表日志
    '/bkapi/analysis/mbrlog/rptBetRcdDayLogList': [{
      'timeStr': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -返水列表
    '/bkapi/operate/activity/water/waterList': [{
      'applicationTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'waterEnd': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'waterStart': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/activity/water/waterAuditList': [{
      'applicationTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -好友返利
    '/bkapi/operate/friendsRebate/friendRebateRewardDetails': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'giveOutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/friendsRebate/friendRebateList': [{
      'firstChargeTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -红利列表
    '/bkapi/operate/opractcat/listAll': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/activity/activityAuditList': [{
      'applicationTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/bonus/getActivitiesWithAuditCount': [{
      'useEnd': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'useStart': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -返利列表
    '/bkapi/mbrAgent/rebate/qryBonusList': [{
      'agyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'auditTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/mbrAgent/rebate/getMbrRebateAgentDayList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'giveOutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -活动类别
    '/bkapi/operate/opractcat/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -呼朋唤友
    '/bkapi/activity/hupeng/huPengRebateRewardDetails': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'giveOutTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -活动规则
    '/bkapi/operate/activity/activityRuleList': [{
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/topacttmpl/list': [{
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -活动介绍
    '/bkapi/operate/activity/activityList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'useEnd': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'useStart': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -任务中心
    '/bkapi/task/configList': [{
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'openingtime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/task/taskBlackList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -任务中心统计
    '/bkapi/task/bounsDetail': [{
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 市场活动 -好友返利明细
    '/bkapi/operate/friendsRebate/rebateDetailFriendList': [{
      'eventTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'incomeTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -信息模板
    '/bkapi/system/msgtemple/queryByConditions': [{
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -公告通知
    '/bkapi/operate/oprnotice/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'endTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'startTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'updateTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -会员留言
    '/bkapi/member/message/messageList': [{
      'lastTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'time': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/member/message/messageInfo': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -意见反馈
    '/bkapi/member/opinion/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -广告管理
    '/bkapi/operate/opradv/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'useEnd': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'useStart': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -帮助中心
    '/bkapi/operate/oprhelp/helpCategoryList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/oprhelp/helpTitleList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/operate/oprhelp/helpContentList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 公告管理 -猜你想问
    '/bkapi/operate/guessAsk/list': [{
      'updatetime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 支付配置- 入款管理 -支付列表
    '/bkapi/company/deposit/fastPayList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/company/deposit/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/onlinepay/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    '/bkapi/company/deposit/qrCodePayList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    '/bkapi/company/cryptocurrencies/crPayList': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'modifyTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      }
    }],
    '/bkapi/company/lineService/list': [{
      'updateTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 系统管理 基本设置>系统设置
    '/bkapi/setting/syssetting/queryPaySet': [{
      'endTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'startTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 系统管理 日志监控>操作日志
    '/bkapi/sys/logMonitor/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 系统管理 预警信息
    '/bkapi/sys/warning/list': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'data.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 系统管理 角色权限
    '/bkapi/sys/role/queryConditions': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    // 系统管理 用户管理
    '/bkapi/sys/user/queryConditions': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
      'expireTime': {
        strategiesType: 'arrType',
        strategiesValue: 'page.list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
    '/bkapi/sys/role/listAll': [{
      'createTime': {
        strategiesType: 'arrType',
        strategiesValue: 'list',
        format: 'YYYY-MM-DD HH:mm:ss'
      },
    }],
  }
  // url = url.slice(findStrIndex(url, '/', 2))
  let toIndex = url.indexOf('?')
  url = toIndex ? url.slice(0, toIndex) : url

  console.log('99999-1:', url)
  const baseURL = process.env.NODE_ENV === "development" ? '/apis' : location.protocol + '//' + location.hostname
  if (process.env.NODE_ENV === "development") {
    url = url.slice(5)
  } else {
    url = url.slice(window.location.origin.length)
  }
  if (Object.keys(responseUrlMap).includes(url)) {
    // if (url === '/bkapi/member/mbraccount/list') {
    //   console.log('99999-2:', url)
    // }
    // 第一步，检查url是否在我们需要处理的接口列表里
    responseUrlMap[url].forEach((keyItem) => {
      console.log('99999-3:', Object.keys(keyItem))
      Object.keys(keyItem).forEach((key) => {
        const { strategiesType, strategiesValue, format='YYYY-MM-DD HH:mm:ss' } = keyItem[key]
        responseStrategies[strategiesType](url, data, key, strategiesValue, format)
      })
    })
  }
  return data
}
