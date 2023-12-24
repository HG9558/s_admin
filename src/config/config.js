console.log('config.js--------')
// import i18n from "../i18n/index"; // 这样导入竟然拿不到i18n实例，fuck!
// console.log('config.js-i18n---', i18n)
/*------------------------------------------*/
import Vue from "vue"
import VueI18n from "vue-i18n"
import { crc32 } from 'crc'

import zh from '../i18n/json/zh.json'
import en_us from '../i18n/json/en_us.json'
// import vi from './json/vi.json'
Vue.use(VueI18n)

export const locale = localStorage.getItem('lang') || 'zh'
export const i18n = new VueI18n({
  locale,
  fallbackLocale: locale,
  messages: {
    zh,
    en_us,
    // vi
  },
})
export const lang = (key, opt) => {
  let hashKey = `k${crc32(key).toString(16)}`
  let words = i18n.t(hashKey, opt)
  if (words === hashKey) {
    words = key
    console.log(key, "-未翻译")
  }
  return words
}
/*------------------------------------------*/

/* eslint-disable no-unused-vars */
import { getMaxDecimalsPattern } from "./utils";

const maxTwoDecimalsPattern = getMaxDecimalsPattern(2);

// 输入值获取对应整数
function getIntergite(value) {
  let arr = value.split("");
  let reg = /^[0-9]/;
  let returnValue = value,
    bool = true;
  if (arr.length) {
    arr.map((val, index) => {
      if (!val.match(reg) && bool) {
        bool = false;
        returnValue = arr.splice(0, index).join("");
      }
    });
  }
  return returnValue;
}

// 去空格
function deleteBlank(val) {
  return val.replace(/\s+/g, "");
}

// 6-10位字母数字组合
function matchSixTen(val) {
  return val.match(/^[a-zA-Z0-9]{6,10}$/)
}

// 获取日期
function getCurrentDate() {
  return new Date();
}

// 获取时分秒 格式 01:02:03
function getHourMinuteSecond(date) {
  if (!date) {
    var date = getCurrentDate();
  }
  var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return h + ":" + m + ":" + s;
}

//获取当前时间的时分秒
function getCurNowTime() {
  return getToday() + " " + getHourMinuteSecond();
}

//获取当前时间及前H小时的时分秒
function getSubCurNowTime(h) {
  var startStop = [];
  var date = new Date().getTime();
  var subMillSec = date - h * 60 * 60 * 1000;
  var ymd = formatDate(new Date(subMillSec));
  var hms = getHourMinuteSecond(new Date(subMillSec));
  var startTime = ymd + " " + hms;
  var endTime = getCurNowTime();
  startStop.push(startTime);
  startStop.push(endTime);
  return startStop;
}

// 日期格式 1992-12-26
function formatDate(dd) {
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return y + "-" + m + "-" + d;
}

function formatTime(time) {
  function addZero(m) {
    return m < 10 ? "0" + m : m;
  }
  if (time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${addZero(month)}-${addZero(day)} ${addZero(
      hours
    )}:${addZero(minutes)}:${addZero(seconds)}`;
  } else {
    return "";
  }
}

// 转换秒时间进行比较
function getTime(time) {
  return new Date(time).getTime();
}

function getNowTime() {
  return new Date().getTime();
}

function getDateStr(addDayCount) {
  var dd = getCurrentDate();
  dd.setDate(dd.getDate() + addDayCount); // 获取AddDayCount天后的日期
  return formatDate(dd);
}

function getWeek(addDayCount) {
  // 起止日期数组
  var startStop = [];
  // 获取当前时间
  var currentDate = getCurrentDate();
  // 返回date是一周中的某一天
  var week = currentDate.getDay();
  // 一天的毫秒数
  var millisecond = 1000 * 60 * 60 * 24;
  // 减去的天数
  var minusDay = week !== 0 ? week - 1 : 6;
  // 增加的天数
  var addDay = week !== 0 ? 7 - week : 0;
  // 本周 周一
  var monday = new Date(
    currentDate.getTime() + (addDayCount - minusDay) * millisecond
  );
  // 本周 周日
  var sunday = new Date(
    currentDate.getTime() + (addDayCount + addDay) * millisecond
  );
  var startTime = formatDate(monday);
  startStop.push(startTime);
  var endTime = formatDate(sunday);
  startStop.push(endTime);
  return startStop;
}

function getMonth(addMonth) {
  // 起止日期数组
  var startStop = [];
  // 获取当前时间
  var currentDate = getCurrentDate();
  // 获得当前月份0-11
  var currentMonth = currentDate.getMonth() + 1 + addMonth;
  // 获得当前年份4位年
  var currentYear = currentDate.getFullYear();
  // 求出本月第一天
  var firstDay = new Date(currentYear, currentMonth, 1);
  // 当为12月的时候年份需要加1
  // 月份需要更新为0 也就是下一年的第一个月
  if (currentMonth === 11) {
    currentYear++;
    currentMonth = 0;
  } else {
    // 否则只是月份增加,以便求的下一月的第一天
    currentMonth++;
  }
  // 一天的毫秒数
  var millisecond = 1000 * 60 * 60 * 24;
  // 下月的第一天
  var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
  // 求出上月的最后一天
  var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);
  // 添加至数组中返回
  var startTime = formatDate(firstDay);
  startStop.push(startTime);
  var endTime = formatDate(lastDay);
  startStop.push(endTime);
  // 返回
  return startStop;
}

function getPreviousMonth() {
  // 从当前往前推一个月
  const currentDate = new Date();
  const endTime = formatDate(currentDate);
  currentDate.setMonth(currentDate.getMonth() - 1);
  const startTime = formatDate(currentDate);
  return [startTime, endTime];
}

function getCurrentMonth() {
  return getMonth(-1);
}

function getLastMonth() {
  return getMonth(-2);
}

function getPreviousThreeMonth() {
  return getMonth(-3);
}

function getPreviousSixMonth() {
  return getMonth(-6);
}

function getPreviousYear() {
  return getMonth(-12);
}

function getNextYear() {
  return getMonth(12);
}

function getCurrentWeek() {
  return getWeek(0);
}

function getPreviousWeek() {
  return getWeek(-7);
}

function getToday() {
  return getDateStr(0);
}

function getYesterday() {
  return getDateStr(-1);
}

function getBeforeYesterday() {
  return getDateStr(-2);
}

function getSevendayAgo() {
  return getDateStr(-6);
}

// 数字千分记位
// function toThousands(num) {
//   if (!num) {
//     return 0
//   }

//   var numArr = num.toString().split('.')
//   num = numArr[0]
//   var result = ''
//   while (num.length > 3) {
//     if (num > 0) {
//       result = ',' + num.slice(-3) + result
//       num = num.slice(0, num.length - 3)
//     } else {
//       break
//     }
//   }
//   if (num) {
//     result = num + result
//   }
//   if (numArr[1]) {
//     result = result + '.' + numArr[1]
//   }
//   return result
// }
function toThousands(num) {
  if (num) {
    return Number(num)
      .toFixed(2)
      .replace(/\d+/, s => s.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
  } else {
    return "0.00";
  }
}

// 数字过滤器
let numFilter = value => {
  return value.replace(/^[1-9]\d*|0$/g, "");
};

// 时间过滤器 '2018-01-27 09:45:20.0' 去掉最后两位
function timeFilter(str) {
  if (!str) {
    return "???";
  }
  let timeLength = str.length;
  if (timeLength > 18) {
    str = str.slice(0, 19);
  }
  return str;
}

// 0 1 转换成boolean
function transferToBoolean(param) {
  if (!param) {
    return false;
  } else {
    return true;
  }
}

function saveYmd(ymd) {
  return ymd.slice(0, 10);
}
// 当前时间 转换成美东时间  或者北京时间  或者其他    通过毫秒转换格式
/*
 * time 当前时间 String '2017-12-12 12:12:12',type 时区类型，number 转换的小时数
 */
function transferTimeByType(time, type) {
  if (!time) {
    return "";
  }
  let timeStr = "";
  let timeLength = time.length;
  if (timeLength > 18) {
    timeStr = time.slice(0, 10) + "T" + time.slice(11, 19) + "Z";
  } else {
    timeStr = time;
  }
  let timeAmount = Date.parse(timeStr);
  switch (type) {
    case "yn":
      timeAmount = timeAmount - 8 * 3600 * 1000;
      // console.log('yn:', timeAmount)
      break;
    case "md":
      timeAmount = timeAmount - 20 * 3600 * 1000;
      // console.log('md:', timeAmount)
      break;
    case "bj":
      timeAmount = timeAmount - 8 * 3600 * 1000;
      // console.log('bj:', timeAmount)
      break;
    case "mdToBj":
      timeAmount = timeAmount + 4 * 3600 * 1000;
      // console.log('mdToBj:', timeAmount)
      break;
  }
  let dd = new Date(timeAmount);
  var Y = dd.getFullYear();
  var M =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  var D = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  var h = dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours();
  var m = dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();
  var s = dd.getSeconds() < 10 ? "0" + dd.getSeconds() : dd.getSeconds();
  if (timeLength > 18) {
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  } else {
    return Y + "-" + M + "-" + D;
  }
}

// 计算2个日期之间的相差 分，时，天
function getDateDiff(startTime, diffType, timeType) {
  if (startTime == null || startTime === "") {
    return "";
  }
  // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  startTime = startTime.replace(/\\-/g, "/");
  // 将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase();
  // 开始时间
  let sTime = Date.parse(
    startTime.slice(0, 10) + "T" + startTime.slice(11, 19) + "Z"
  );
  switch (timeType) {
    case "md":
      sTime = sTime - 20 * 3600 * 1000;
      break;
    case "bj":
      sTime = sTime - 8 * 3600 * 1000;
      break;
  }
  let type = 1;
  switch (diffType) {
    case "minute":
      type = 1000 * 60;
      break;
    case "hour":
      type = 1000 * 3600;
      break;
    case "day":
      type = 1000 * 3600 * 24;
      break;
    default:
      break;
  }
  return Math.ceil((Date.now() - sTime) / parseInt(type));
}

// 数组去重
function filterArr(oldArr) {
  if (oldArr.length === 0 || oldArr.length === 1) {
    return oldArr;
  } else {
    var newArr = [];
    for (var i = 0; i < oldArr.length; i++) {
      if (newArr.indexOf(oldArr[i]) < 0) {
        newArr.push(oldArr[i]);
      }
    }
    return newArr;
  }
}

function saveTwoNumber(cellValue) {
  if (cellValue) {
    let i = (cellValue + "").split(".");
    let b = "";
    let c = "";
    if (i[1]) {
      if (i[1].length > 2) {
        c = i[1].slice(0, 2);
      } else {
        c = i[1];
      }
      b = i[0] + "." + c;
    } else {
      b = i[0];
    }
    return b;
  } else {
    return "0";
  }
}

function getStatusArr(statusValue) {
  if (statusValue.length === 1 && statusValue[0] === 0) {
    return [{ text: lang("拒绝"), value: 0 }];
  } else if (statusValue.length === 1 && statusValue[0] === 1) {
    return [{ text: lang("通过"), value: 1 }];
  } else if (statusValue.length === 1 && statusValue[0] === 2) {
    return [{ text: lang("待处理"), value: 2 }];
  } else if (statusValue.length === 1 && statusValue[0] === 3) {
    return [{ text: lang("出款中"), value: 3 }];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(1) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("通过"), value: 1 }
    ];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(2) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("待处理"), value: 2 }
    ];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(1) > -1 &&
    statusValue.indexOf(2) > -1
  ) {
    return [
      { text: lang("通过"), value: 1 },
      { text: lang("待处理"), value: 2 }
    ];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(1) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("通过"), value: 1 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (
    statusValue.length === 2 &&
    statusValue.indexOf(2) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("待处理"), value: 2 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (
    statusValue.length === 3 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(1) > -1 &&
    statusValue.indexOf(2) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("通过"), value: 1 },
      { text: lang("待处理"), value: 2 }
    ];
  } else if (
    statusValue.length === 3 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(1) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("通过"), value: 1 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (
    statusValue.length === 3 &&
    statusValue.indexOf(0) > -1 &&
    statusValue.indexOf(2) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("待处理"), value: 2 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (
    statusValue.length === 3 &&
    statusValue.indexOf(1) > -1 &&
    statusValue.indexOf(2) > -1 &&
    statusValue.indexOf(3) > -1
  ) {
    return [
      { text: lang("通过"), value: 1 },
      { text: lang("待处理"), value: 2 },
      { text: lang("出款中"), value: 3 }
    ];
  } else if (statusValue.length === 4) {
    return [
      { text: lang("拒绝"), value: 0 },
      { text: lang("通过"), value: 1 },
      { text: lang("待处理"), value: 2 },
      { text: lang("出款中"), value: 3 }
    ];
  }
}

function spliceStr(str, num) {
  if (str) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  } else {
    return "";
  }
}

function returnStatus(statusValue) {
  // if (!statusValue) {
  //   return ''
  // }
  if (statusValue == 0) {
    return "PC";
  }
  if (statusValue == 3) {
    return "H5";
  }
  if (statusValue == 2) {
    return lang("后台");
  }
  if (statusValue == "0,3") {
    return "PC,H5";
  }
  return "";
}

// 去重
function unique(array) {
  var res = [];
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];
    if (res.indexOf(current) === -1) {
      res.push(current);
    }
  }
  return res;
}

export default {
  urls: {
    alarmInfo: 'bkapi/sys/user/queryTSiteLimit',
    getMobileAreaCode: "/bkapi/sys/conf/mobileAreaCodes", // 获取国家及手机区号
    call: "bkapi/member/mbraccount/dial", //拨打会员电话 --post
    getRecodeCall: "bkapi/member/mbraccount/queryTelRecord", //查询会员被拨打电话记录 --post

    exportDepositExcel: "bkapi/fund/deposit/depositExportExcel", //会员入款的导出
    checkDepositIsDown: "bkapi/fund/deposit/checkFile", //会员入款是否可下载
    exportWithdrowExcel: "bkapi/fund/withdraw/accWithdrawExportExcel", //会员提款的导出
    checkWithdrowIsDown: "bkapi/fund/withdraw/checkFile", //会员提款是否可下载
    betRecodeExcel: "bkapi/analysis/betDetails/exportBetDetails", //投注记录的导出
    checkBetRecodeIsDown: "bkapi/analysis/betDetails/checkFile", //投注记录是否可下载

    googleAvailable: "bkapi/sys/googleAvailable",
    authenticatorLogin: "bkapi/sys/authenticatorLogin",
    login: "bkapi/sys/login",
    logout: "bkapi/sys/logout",
    dropdownShow: "bkapi/sys/menu/fundShow", // 头部下拉菜单显示隐藏
    getinfo: "bkapi/sys/user/info",
    // 线上支付-新增
    mbrGrouplist: "bkapi/member/mbrgroup/listAll",
    depositStatisticTotal: "bkapi/deposit/depositStatisticTotal", // 比数统计
    depositStatisticRate: "bkapi/deposit/depositStatisticRate", // 比率统计
    getDepositType: "bkapi/deposit/getDepositType", // 通道类型查询

    getALLPayTypelist: "bkapi/onlinepay/getALLPayTypelist",//支付列表- 线上支付的管理
    updatePaytypeList: "bkapi/onlinepay/updatePaytype",//支付列表- 线上支付 - 更新
    companyDeposit: "bkapi/fund/deposit/companyDeposit",
    getSiteCode: "bkapi/sys/getSiteCode", // 获取站点的前缀
    getLanguage: "/bkapi/sys/getI18n", //获取站点当前的语言设置
    getEgSanGongFlg: "/bkapi/sys/getEgSanGongFlg", //控制三公返利相关显示
    mbrGroupTablelist: "bkapi/member/mbrgroup/list", // 获取会员组Options
    mbrwithdrawalcondInfo: "bkapi/member/mbrwithdrawalcond/info/",
    mbrGroupSave: "bkapi/member/mbrgroup/save",
    mbrGroupUpdate: "bkapi/member/mbrgroup/update",
    mbrUpdateAvailable: "bkapi/member/mbrgroup/updateAvailable",
    mbrDepositCondInfo: "bkapi/member/mbrdepositcond/info/",
    mbrWithdrawCondInfo: "bkapi/member/mbrwithdrawalcond/info/",
    mbrDepositCondUpdate: "bkapi/member/mbrdepositcond/update",
    mbrWithdrawCondSave: "bkapi/member/mbrwithdrawalcond/save",
    mbrWithdrawCondUpdate: "bkapi/member/mbrwithdrawalcond/update",
    mbrDepositCondSave: "bkapi/member/mbrdepositcond/save",
    mbrGroupDelete: "bkapi/member/mbrgroup/delete",
    mbrAccountTablelist: "bkapi/member/mbraccount/list",
    mbrAccountLevellist: "bkapi/mbrAgent/level/list",
    saveRebateSetting: "bkapi/member/mbrgroup/rebateSave",
    getRebateSettingInfo: "bkapi/member/mbrgroup/rebateInfo",
    getRebateSettingCatList: "bkapi/operate/tgmdepot/catList",
    groupIdUpdate: "bkapi/member/mbraccount/groupIdUpdate",
    memberChangeGroup: "bkapi/member/mbraccount/changeMbrGroup",
    exportMbrAccountInfo: "bkapi/member/mbraccount/exportMbrAccountInfo",
    checkMbrExportFile: "bkapi/member/mbraccount/checkFile",
    downloadMbrExcel: "bkapi/file/export/downloadExcel",
    availableUpdate: "bkapi/member/mbraccount/avlUpdate",
    memberCheck: "bkapi/member/mbraccount/chkUser",
    memberSave: "bkapi/member/mbraccount/save",
    auditSave: "bkapi/fund/report/auditSave",
    auditAdd: "/bkapi/fund/report/auditAdd",
    manualFriendRebateReward: 'bkapi/operate/friendsRebate/addFriendRebateReward',
    reduceFriendRebateReward: 'bkapi/operate/friendsRebate/reduceFriendRebateReward',
    checkUserNames: "/bkapi/member/mbraccount/checkUserNames",
    auditRuduce: "bkapi/fund/report/auditReduce",
    auditInfo: "/bkapi/fund/report/auditInfo",
    activityListAll: "bkapi/operate/activity/listAll",
    cardDelete: "bkapi/member/mbrbankcard/delete",
    memberCrDelete: "bkapi/member/cryptoCurrencies/delete",
    listPro: "bkapi/base/baseArea/listProv",
    listCity: "bkapi/base/baseArea/listCity",
    bankList: "bkapi/base/baseBank/list",
    bankCardList: "bkapi/member/mbrbankcard/list",
    memberCrList: "/bkapi/member/cryptoCurrencies/list",
    historyList: "/bkapi/member/mbrbankcard/historyList",
    bankCardUpdate: "bkapi/member/mbrbankcard/update",
    bankCardSave: "bkapi/member/mbrbankcard/save",
    walletInfo: "bkapi/member/mbrwallet/info/",
    balances: "bkapi/member/mbrwallet/balances/",
    walletList: "bkapi/member/mbrwallet/list",
    agentUpdate: "bkapi/member/mbraccount/agentUpdate",
    accAvailableUpdate: "bkapi/member/mbraccount/avlUpdate",
    bankCardAvailable: "bkapi/member/mbrbankcard/available",
    memberCrAvailable: "/bkapi/member/cryptoCurrencies/available",
    authPwd: "bkapi/sys/user/authsecpwd",
    modifyPassword: "bkapi/sys/user/password",
    modifySafePassword: "bkapi/sys/user/secpassword",
    pwdUpdate: "bkapi/member/mbraccount/pwdUpdate",
    secPwdUpdate: "bkapi/member/mbraccount/secPwdUpdate",
    syncPwdUpdate: "bkapi/member/mbraccount/syncPwdUpdate",
    logLoginRecord: "bkapi/log/logmbrlogin/list",
    logLoginRecordInfo: "bkapi/log/logmbrlogin/info",
    taskList: 'bkapi/member/mbraccount/taskList',
    mbrMemoUpdate: "bkapi/member/mbrmemo/update",
    mbrMemoDelete: "bkapi/member/mbrmemo/delete",
    //好友返利日志
    incomeLogList: 'bkapi/operate/friendsRebate/friendRebatePersonalList',
    mbrMemoSave: "bkapi/member/mbrmemo/save",
    mbrMemoList: "bkapi/member/mbrmemo/listAll",
    immediatelyAudit: "bkapi/member/audit/immediatelyAudit",
    auditUpdate: "bkapi/member/audit/update",
    auditClear: "bkapi/member/audit/clear",
    getAgentList: "bkapi/agent/account/agyAccountList",
    getAgentBanner: "bkapi/agent/account/getAgentBanner",
    getMbrBanner: "bkapi/agent/account/getMbrBanner",
    updateAgyMerGroup: "/bkapi/agent/account/updateAgyMerGroup", //关联会员组
    getMemberList: "/bkapi/member/mbrgroup/listAll", //获取需要关联会员组列表
    subOrdinateList: "bkapi/agent/account/subordinate/list",
    subOrdinateUpdate: "bkapi/agent/account/subordinate/update",
    subOrdinateSave: "bkapi/agent/account/subordinate/save",
    accountUpdateAvailable: "bkapi/agent/account/updateAvailable",
    findCommissionAll: "bkapi/agent/commn/findCommissionAll",
    agentCommnChargeInfo: "bkapi/agent/commn/charge/info",
    agentCommnChargeUpdate: "bkapi/agent/commn/charge/update",
    agentCommnChargeSave: "bkapi/agent/commn/charge/save",
    agentCommnUpdate: "bkapi/agent/commn/update",
    agentCommnSave: "bkapi/agent/commn/save",
    agentCommnUpdateAvailable: "bkapi/agent/commn/updateAvailable",
    agentCommnDelete: "bkapi/agent/commn/delete",
    agentCommnList: "/bkapi/agent/commn/list",
    smslog: "bkapi/analysis/smslog/list", // 短信记录
    smsPlatformList: "/bkapi/analysis/smslog/platformList", // 短信平台列表
    smsReportSmsLog: "/bkapi/analysis/smslog/reportSmsLog", // 短信列表导出
    smsCheckFile: "/bkapi/analysis/smslog/checkFile", // 短信列表导出下载
    userInfo: "bkapi/member/mbraccount/viewAccountInfo/", //拆分的mbr接口
    updateMbrAgentLevel: "bkapi/member/mbraccount/updateMbrAgentLevel", //修改会员代理等级
    addMbrAgentLevel: "bkapi/mbrAgent/level/save", //新增会员代理等级
    qryBonusList: "bkapi/mbrAgent/rebate/qryBonusList", //红利审核列表查询
    getMbrRebateAgentDayList: "bkapi/mbrAgent/rebate/getMbrRebateAgentDayList", //红利审核-历史表查询
    exportBonusAudit: "bkapi/mbrAgent/rebate/exportBonusAudit", //红利审核-导出
    exportRebate: "bkapi/mbrAgent/rebate/checkFile", //红利审核-导出
    bonusAudit: "bkapi/mbrAgent/rebate/bonusAudit", //红利审核-单条审核
    bonusAuditEdit: "bkapi/mbrAgent/rebate/bonusAuditEdit", //红利审核-单条编辑
    bonusAuditBatch: "bkapi/mbrAgent/rebate/bonusAuditBatch", //红利审核-批量审核
    getChildBonusList: "bkapi/mbrAgent/rebate/getChildBonusList", //红利审核-上级查询直属下级
    delMbrAgentLevel: "bkapi/mbrAgent/level/delete", //删除会员代理等级
    operateTgmdepotListDepotCatAll: "bkapi/operate/tgmdepot/listDepotCatAll",
    flushBalance: "bkapi/depotOperat/flushBalance", // 会员详情--游戏管理--刷新钱包
    updateAccountAgent: "bkapi/member/mbraccount/updateAccountAgent", //更新代理编辑
    queryAddress: "/bkapi/member/cryptoCurrencies/queryAddress", // 获取加密货币存款钱包地址
    loginLockUpdate: "/bkapi/member/mbraccount/loginLockUpdate", // 修改登录锁定状态_ get
    accountMobileList: "/bkapi/member/mbraccount/accountMobileList", //  手机绑定记录
    depotOperatList: "bkapi/depotOperat/list", // 会员详情--游戏管理--列表
    depotOperatLogout: "bkapi/depotOperat/loginOut", // 会员详情--游戏管理--登出
    depotOperatLock: "/bkapi/depotOperat/lockPlayer", // 会员详情--游戏管理--锁定
    fundList: "bkapi/member/mbraccount/fundList", // 会员日志--资金流水
    manageList: "bkapi/member/mbraccount/manageList", //会员日志--转账记录
    depositList: "bkapi/member/mbraccount/depositList", // 会员日志--存款记录
    withdrawList: "bkapi/member/mbraccount/withdrawList", // 会员日志--提款记录
    memberDetailBonusList: "bkapi/member/mbraccount/bonusList", // 会员日志--红利记录
    nativeSportsSet: {
      query: 'bkapi/setting/syssetting/queryNativeSports', // 获取原生投注设置
      set: 'bkapi/setting/syssetting/queryNativeSportsSet'
    },
    // 呼朋唤友
    callFriends: {
      list: "/bkapi/activity/hupeng/huPengRebateRewardList",
      record: "/bkapi/activity/hupeng/huPengRebateRewardDetails", // 发放记录
      sum: "/bkapi/activity/hupeng/huPengRebateRewardDetailsSummary",// 发放记录
      subList: "/bkapi/activity/hupeng/huPengFriendsRebateRewardList", // 会员账号详情
      reportExport: "/bkapi/activity/hupeng/orderExport", //导出
      checkFile: "/bkapi/activity/hupeng/checkFile", //导出下载
    },
    bonusListForm: {
      // 红利列表表单
      save: "bkapi/operate/bonus/save",
      catsAndActs: "bkapi/operate/bonus/availableCatAndActList",
      getDiscountAudit: "bkapi/operate/bonus/getDiscountAudit"
    },
    gameCategory: {
      list: 'bkapi/operate/gameCategory/list',
      delete: 'bkapi/operate/gameCategory/delete',
      save: 'bkapi/operate/gameCategory/save',
      update: 'bkapi/operate/gameCategory/update'
    },
    audtiStatus: "bkapi/member/audit/isWithdrawal", // 稽核状态
    accountLogList: "bkapi/member/mbraccount/accountLogList", // 会员日志--资料变更
    queryAccountAuditInfo: "bkapi/member/mbraccount/queryAccountAuditInfo", // 风控审核--查看详情
    windMbrList: "bkapi/member/wind/mbrList", // 风控信息列表
    windMbrInfoByAcc: "bkapi/member/wind/mbrInfoByAcc", // 风控会员账号查询会员信息
    windDepositList: "bkapi/member/wind/depositList", // 风控会员提款
    windMbrwithdrawList: "bkapi/member/wind/mbrwithdrawList", // 风控会员存款
    windMbrbillList: "bkapi/member/wind/mbrbillList", // 风控户内转账
    windMbrbonusList: "bkapi/member/wind/mbrbonusList", // 风控红利优惠
    windMbrauditList: "bkapi/member/wind/mbrauditList", // 风控资金调整
    windMbrLoginlist: "bkapi/member/wind/mbrLoginlist", // 风控登陆历史
    windMbrfinalBetDetailsAll: "bkapi/member/wind/mbrfinalBetDetailsAll", // 风控投注记录
    windMbrNewMemo: "bkapi/member/wind/mbrNewMemo", // 风控修改备注信息
    windMemolist: "bkapi/member/wind/memolist", // 风控查询备注信息
    windMbrInfogame: "bkapi/member/wind/balance", // 风控查询余额信息
    windDepotBalance: "bkapi/member/wind/depotBalance", // 风控查询余额信息列表
    windFlushBalance: "bkapi/member/wind/flushBalance", // 风控查询余额信息列表刷新
    windMbrDeviceIpTop: "bkapi/member/wind/mbrDeviceIpTop", // 风控查询设备IP信息
    walletRecover: "bkapi/member/mbrwallet/walletRecover", // 会员详情  钱包回收
    memberInfoSave: "bkapi/member/mbraccount/update", // 会员详情 --保存个人信息
    resetMemberGoogle: "bkapi/member/mbraccount/resetMemberGoogle", // 会员详情 -- 重置谷歌验证
    updateDepositLockStatus: "bkapi/member/mbraccount/updateDepositLockStatus", // 会员详情 - 入款防刷修改
    queryAccountAuditList: "bkapi/member/mbraccount/queryAccountAuditList", // 会员详情--风控审核
    memberView: "bkapi/member/mbraccount/view/", // 某个会员的详情
    mbrWaterRateYestday: "bkapi/member/mbraccount/mbrWaterRateYestday/", // 某个会员的详情-今天待发放返水金额
    mbrWaterRate: "bkapi/member/mbraccount/mbrWaterRate/", // 某个会员的详情-今天产生返水金额
    otherMemberView: "bkapi/member/mbraccount/viewOther/", // 某个会员的详情
    innerMemoList: "bkapi/member/mbrmemo/sortList", // 根据类型获取不同类型备注
    otherInfoPost: "bkapi/member/mbraccount/updateAccountRest", // 修改其他资料
    getWebsiteTtile: "bkapi/setting/syssetting/queryStationInfo", // 获取站点的名称
    fundDepositList: "bkapi/fund/deposit/list", // 资金管理-线上入款查询列表
    fundDepositCompanyList: "bkapi/fund/deposit/companyList", // 资金管理-公司入款查询列表
    companyInfo: "/bkapi/fund/deposit/companyInfo/",
    onlineInfo: "/bkapi/fund/deposit/info",
    fundWithdrawAccList: "bkapi/fund/withdraw/accList", // 资金管理-会员提款
    updateAllLockStatus: "bkapi/fund/withdraw/updateAllLockStatus",//操作锁定--更新锁定状态
    lockStatus: "bkapi/fund/withdraw/lockStatus",// 操作锁定--状态查询_/
    updateAccStatusSucToFail: "bkapi/fund/withdraw/updateAccStatusSucToFail", // 订单变更为失败
    lock: "bkapi/fund/withdraw/lock",//操作锁定--锁定_/
    unLock: "bkapi/fund/withdraw/unLock",//操作锁定--解锁_/
    fundWithdrawAgyList: "bkapi/fund/withdraw/agyList", // 资金管理-代理提款
    fundReportBillList: "bkapi/fund/report/billList", // 资金管理-转账报表
    fundReportInfo: "bkapi/fund/report/billInfo/", // 资金管理-转账报表详情
    fundrefreshStatus: "bkapi/fund/report/apiTrfRefresh", // 转账报表-刷新状态
    fundReportAuditTopAgyList: "bkapi/fund/report/audit/topAgyList", // 资金管理-调整报表-总代查询
    fundReportAuditAgyList: "bkapi/fund/report/audit/agyList", // 资金管理-调整报表-二级代理查询
    fundReportAuditList: "bkapi/fund/report/auditList", // 资金管理-调整报表-总代查询
    exportFundReport: "/bkapi/fund/report/exportAuditList", // 资金管理-资金调整-导出
    checkFundAudit: "/bkapi/fund/report/checkFile", //
    analysisBetDetailsFinalBetDetailsAll:
      "bkapi/analysis/betDetails/finalBetDetailsAll", // 经营分析--投注记录
    getOnlinepayList: "bkapi/onlinepay/onlinePayList", // 线上入款--获取存款通道的OPTION
    getDepositList: "bkapi/company/deposit/sysDepositList", // 公司入款--获取存款通道
    getQrcodeList: "bkapi/company/deposit/qrCodeList", // 公司入款--获取存款通道
    getFundDepositSumDepositAmount: "bkapi/fund/deposit/sumDepositAmount", // 线上-公司入款 今日存款
    getFundDepositSumWithdrawAmount: "bkapi/fund/withdraw/accSumDrawingAmount", // 会员提款 今日提款
    exportExcel: "bkapi/fund/deposit/company/exportExecl", // 导出报表
    updateMemo: "bkapi/fund/deposit/updateMemo", // 线上入款-公司入款-更新备注
    updateStatus: "bkapi/fund/deposit/updateStatus", //  线上入款-公司入款-更新状态
    updateStatusRefuse: "bkapi/fund/deposit/updateStatusRefuse", //  线上入款-公司入款-更新状态(拒绝时调用)
    memberUpdateMemo: "bkapi/fund/withdraw/updateAccMemo", // 会员提款 修改备注
    memberUpdateStatus: "bkapi/fund/withdraw/updateAccStatus", // 会员提款 客服修改状态
    memberUpdateStatusRefuse: "bkapi/fund/withdraw/updateAccStatusRefuse", // 会员提款 客服修改状态(拒绝时调用)
    memberUpdateFinialStatus: "bkapi/fund/withdraw/updateAccStatusFinial", // 会员提款 财务修改状态
    memberUpdateFinialStatusRefuse: "bkapi/fund/withdraw/updateAccStatusFinialRefuse", // 会员提款 财务修改状态(拒绝时调用)
    updateAccStatusPendPass: "bkapi/fund/withdraw/updateAccStatusPendPass", // 会员提款 财务修改状态(初审待定通过时调用)
    updateAccStatusPendRefuse: "bkapi/fund/withdraw/updateAccStatusPendRefuse", // 会员提款 财务修改状态(初审待定拒绝时调用)
    updateAccStatusPend: "bkapi/fund/withdraw/updateAccStatusPend", // 会员提款 财务修改状态(初审待定时调用)
    agyUpdateMemo: "bkapi/fund/withdraw/updateAgyMemo", // 代理提款 修改备注
    agyUpdateStatus: "bkapi/fund/withdraw/updateAgyStatus", // 代理提款 修改状态
    getBankDataById: "bkapi/fund/withdraw/accInfo", // 会员提款 获取会员银行信息
    getAgyBankDataById: "bkapi/fund/withdraw/agyInfo", // 会员提款 获取会员银行信息
    fundAuditUpdateMemo: "bkapi/fund/report/auditUpdateMemo", // 调整报表  修改备注
    fundAuditUpdateStatus: "bkapi/fund/report/auditUpdateStatus", // 调整报表  修改状态
    fundAuditUpdateStatusRefuse: "bkapi/fund/report/auditUpdateStatusRefuse",  // 调整报表  修改状态
    fundReportAuditCauseList: "bkapi/fund/report/auditCauseList", // 调整报表 --获取存款类型
    getAllPlatform: "bkapi/operate/tgmdepot/listAll", // 转账报表 获取平台
    getActivitySheet: "/bkapi/operate/activity/findBonusReportList", // 活动报表
    getAllDepot: "/bkapi/operate/tgmdepot/listDepotCatAll", // 获取平台分类
    getAgyAccount: "bkapi/agent/account/findTopAccountAll", // 经营报表--获取总代
    findTopAccountLike: "bkapi/agent/account/findTopAccountLike", // 新经营报表--获取总代
    // getAgyAccountIncludeDisable: "bkapi/agent/account/findTopAccountAllIncludeDisable", // 经营报表--获取总代
    getAgyAccountIncludeDisable: "bkapi/agent/account/getAllParentAccount", // 经营报表--获取总代
    massTexting: "bkapi/member/mbraccount/massTexting", //短信群发
    getPlatform: "bkapi/analysis/betDetails/finalGameCode", // 经营报表---游戏平台
    getTopSort: "/bkapi/operate/tgmcat/listBaseAll", // 获取顶级的分类
    getPlatformByDepot: "/bkapi/operate/tgmcat/listCatDepot",
    getSubCat: "bkapi/operate/tgmcat/listSubCat",
    getOperateSheetData: "bkapi/analysis/betDetails/findRptBetDay", // 获取经营报表基本信息
    getActivityList: "bkapi/operate/activity/list", // 获取活动设置列表
    getActivityListAll: "bkapi/operate/activity/activityListAll", // 获取所有活动
    getActivityType: "bkapi/operate/topacttmpl/list", // 获取活动类型
    getActivityCategory: "bkapi/operate/opractcat/listAll", // 获取活动分类
    getNameOptions: "bkapi/operate/activity/activityList", // 查询所有活动
    saveActivity: "bkapi/operate/activity/save", // 保存活动
    updateActivity: "bkapi/operate/activity/update", // 保存活动
    getActivityTemList: "bkapi/operate/topacttmpl/list", // 获取活动模版列表
    changeClassify: "bkapi/operate/opractcat/update", // 修改活动分类的备注和名称  或者状态
    deleteClassify: "bkapi/operate/opractcat/delete", // 删除活动分类
    getClassifyList: "bkapi/operate/opractcat/list", // 获取活动分类列表
    getClassifyValid: "bkapi/operate/opractcat/listAll", // 获取有用的活动分类
    addClassifyValid: "bkapi/operate/opractcat/save", // 新增活动分类
    getAuditList: "/bkapi/operate/activity/activityAuditList", // 获取活动申请审批列表
    changeAuditStatus: "/bkapi/operate/activity/activityAudit", // 改变活动的审批状态
    activityAuditRefuse: "/bkapi/operate/activity/activityAuditRefuse", // 改变活动的审批状态(拒绝时调用)
    getNoticeList: "bkapi/operate/oprnotice/list", // 获取公告信息列表
    getNoticeInfo: "bkapi/operate/oprnotice/info", // 获取某条信息的详情
    changeNoticeAvailable: "bkapi/operate/oprnotice/available", // 改变某条数据的状态
    updateNotice: "bkapi/operate/oprnotice/update", // 更新某条数据的内容
    deleteNotice: "bkapi/operate/oprnotice/delete", // 删除某条或某些数据数据
    saveNotice: "bkapi/operate/oprnotice/save", // 保存公告
    deleteMessage: "bkapi/operate/oprrecmbr/deleteBatch", // 删除站内信
    getMessageList: "bkapi/operate/oprrecmbr/list", // 获取站内信列表
    readMessage: "bkapi/operate/oprrecmbr/readMsg", // 改变站内信的状态
    searchAgy: "bkapi/operate/oprrecmbr/agtList", // 代理搜索接口
    searchMbr: "bkapi/operate/oprrecmbr/mbrList", // 会员搜索接口
    saveMessage: "bkapi/operate/oprrecmbr/save", // 保存站内信
    getGameList: "bkapi/operate/tgmgame/gameCatList", // 获取游戏列表
    getIntraGamList: "bkapi/operate/tgmgame/gameList", // 获取某个分类的gamelist
    getAdList: "bkapi/operate/opradv/list", // 获取广告列表
    uploadImage: "/bkapi/operate/opradv/uploadImage", // 上传图片
    uploadExcel: "/bkapi/sdyexcel/upload", // 上传excel
    saveAd: "bkapi/operate/opradv/save", // 新增广告
    updateAd: "bkapi/operate/opradv/update", // 编辑广告
    availableAd: "bkapi/operate/opradv/enable", // 改变状态
    deleteAd: "bkapi/operate/opradv/delete", // 删除广告
    helpCenter: {
      helpCategoryList: 'bkapi/operate/oprhelp/helpCategoryList', // 分类列表查询
      saveHelpCategory: 'bkapi/operate/oprhelp/saveHelpCategory', // 新增分类
      updateHelpCategory: 'bkapi/operate/oprhelp/updateHelpCategory', // 更新分类
      enableCategory: 'bkapi/operate/oprhelp/enableCategory', // 启用分类
      deleteCategory: 'bkapi/operate/oprhelp/deleteCategory', // 刪除分类
      helpTitleList: 'bkapi/operate/oprhelp/helpTitleList', // 标题列表接口
      helpContentList: 'bkapi/operate/oprhelp/helpContentList', // 内容列表接口
      saveHelpTitle: 'bkapi/operate/oprhelp/saveHelpTitle', // 新增标题接口
      findCategory: 'bkapi/operate/oprhelp/findCategory', // 所有分类接口
      findTitle: 'bkapi/operate/oprhelp/findTitle', // 所有标题接口
      saveHelpContent: 'bkapi/operate/oprhelp/saveHelpContent', // 新增内容
      updateHelpContent: 'bkapi/operate/oprhelp/updateHelpContent', // 更新内容
      deleteContent: 'bkapi/operate/oprhelp/deleteContent', // 删除内容
      deleteTitle: 'bkapi/operate/oprhelp/deleteTitle', // 删除标题
      updateHelpTitle: 'bkapi/operate/oprhelp/updateHelpTitle', // 更新标题
    },
    // 猜你想问
    guessAsk: {
      list: 'bkapi/operate/guessAsk/list',  // 列表
      save: 'bkapi/operate/guessAsk/save', // 保存
      delete: 'bkapi/operate/guessAsk/delete', // 删除
      update: 'bkapi/operate/guessAsk/update' // 更新
    },
    opradvInfo: "bkapi/operate/opradv/info/",
    promotionSet: "bkapi/setting/syssetting/promotionSet",
    promotionSetForSysSetting:
      "/bkapi/setting/syssetting/promotionSetForSysSetting",
    queryPromotionOutCall: "/bkapi/setting/syssetting/queryOutCallset", //设置语音线路
    queryFriendRelegationSet: "/bkapi/setting/syssetting/queryFriendRelegationSet", // 查询好友推荐
    getSiteUrlList: "bkapi/sys/queryDomain",
    getSiteUrlListForSysSetting: "/bkapi/setting/syssetting/queryDomain",
    queryPromotionSet: "bkapi/setting/syssetting/queryPromotionSet",
    queryPromotionSetForSysSetting:
      "/bkapi/setting/syssetting/queryPromotionSetForSysSetting",
    promotionSetOutCall: "/bkapi/setting/syssetting/outCallSet", //获取语音线路值
    modifyFriendRelegationSet: "/bkapi/setting/syssetting/modifyFriendRelegationSet", //设置好友推荐
    queryRegisterSet: "bkapi/setting/syssetting/queryRegisterSet",
    querySmsSet: "/bkapi/setting/syssetting/querySmsConfig",
    querySysEncryptSet: "bkapi/sys/encrypt/info", // 查询数据库加密
    querySmsConfig: '/bkapi/setting/syssetting/querySmsConfig',
    queryMailSet: "bkapi/setting/syssetting/queryMailSet",
    queryMailContent: "bkapi/setting/syssetting/queryMailContent",
    queryStationSet: "bkapi/setting/syssetting/queryStationSet",
    // 系统-站点设置
    queryStationSetForSystSetting:
      "/bkapi/setting/syssetting/queryStationSetForSysSetting",
    sysEncryptUpdate: "bkapi/sys/encrypt/update", // 数据库加密
    modifyStationSet: "bkapi/setting/syssetting/modifyStationSet",
    modifyMailSet: "bkapi/setting/syssetting/modifyMailSet",
    modifyMailSave: "bkapi/setting/syssetting/updateMailContent",
    modifySmsSet: "/bkapi/setting/syssetting/modifySmsConfig",
    testReceiveMail: "bkapi/setting/syssetting/testReceiveMail",
    testReceiveSms: "bkapi/setting/syssetting/testReceiveSms",
    modifyRegisterSet: "bkapi/setting/syssetting/modifyRegisterSet",
    modifyAccWebRegister: "/bkapi/setting/syssetting/modifyAccWebRegister",
    queryWebTerms: "bkapi/setting/syssetting/queryWebTerms", // 查询条款
    modifyWebTerms: "bkapi/setting/syssetting/modifyWebTerms", // 修改条款
    activityAvailable: "bkapi/operate/activity/updateAvailable", // 活动状态修改
    activityDelete: "bkapi/operate/activity/delete", // 活动状态修改
    sysRoleUpdateEnable: "/bkapi/sys/role/updateEnable",
    sysRoleListAll: "/bkapi/sys/role/listAll",
    roleSelect: "/bkapi/sys/role/select",
    saveMenuForManyRole: "/bkapi/sys/menu/saveMenuForManyRole",
    treeList: "/bkapi/sys/menu/treeList", // 获取菜单和操作权限
    sysMenuTreeList: "/bkapi/sys/menu/initRoleMenuTree", // 获取完整的树
    getMenuTreeList: "/bkapi/sys/menu/updateRoleMenuTree", // 获取各自的树
    getTreeOperation: "/bkapi/sys/menu/getMenuAuth", // 获取各自的操作权限
    sysRoleUpdate: "/bkapi/sys/role/update",
    sysRoleSaveRole: "/bkapi/sys/role/saveRole",
    sysRoleDelete: "/bkapi/sys/role/delete",
    sysRoleInfo: "/bkapi/sys/role/info/",
    sysRoleQueryConditions: "/bkapi/sys/role/queryConditions",
    sysUserQueryConditions: "/bkapi/sys/user/queryConditions",
    msgtempleListAll: "/bkapi/msgtemple/systemmsgmoldetype/listAll",
    msgtempleDelete: "/bkapi/system/msgtemple/delete",
    msgtempleUpdate: "/bkapi/system/msgtemple/update",
    msgtempleInfo: "/bkapi/system/msgtemple/info/",
    msgtempleSave: "/bkapi/system/msgtemple/save",
    msgtempleQueryByConditions: "/bkapi/system/msgtemple/queryByConditions",
    activityInfo: "bkapi/operate/activity/info/", // 活动详情
    systemdomainUpdate: "bkapi/system/systemdomain/update", // 域名管理修改站点
    systemdomainDelete: "bkapi/system/systemdomain/delete", // 域名管理删除站点
    systemdomainSave: "bkapi/system/systemdomain/save", // 域名管理add站点
    systemdomainList: "bkapi/system/systemdomain/list", // 域名管理list站点
    systemAgencyQuery:
      "bkapi/systemAgencyUrl/systemagencyurl/queryAgyCountNoUrl", // 域名管理代理域名query
    systemAgencyUpdate: "bkapi/systemAgencyUrl/systemagencyurl/update", // 域名管理代理域名Update
    systemAgencyDelete: "bkapi/systemAgencyUrl/systemagencyurl/delete", // 域名管理代理域名Delete
    systemAgencySave: "bkapi/systemAgencyUrl/systemagencyurl/save", // 域名管理代理域名save
    systemAgencyListPage: "bkapi/systemAgencyUrl/systemagencyurl/queryListPage", // 域名管理代理域名queryListPage

    systemOtherSet: "bkapi/setting/syssetting/queryPaySet", // 出款设置
    systemOtherSetModify: "bkapi/setting/syssetting/modifyPaySet", // 出款设置修改

    systemFriToggleSet: "/bkapi/setting/syssetting/queryFriendTransSet", //好友转账设置
    systemFriToggleSetModify: "/bkapi/setting/syssetting/modifyFriendTransSet", //好友转账设置修改
    queryAiRecommendSet: "bkapi/setting/syssetting/queryAiRecommendSet", //ai推荐设置查询
    modifyAiRecommendSet: "bkapi/setting/syssetting/modifyAiRecommendSet", //ai推荐设置修改
    oprnoticeInfo: "bkapi/operate/oprnotice/info/",


    // 系统设置 -- 短信验证码设置
    modifySmsVfySecurityConfig: "bkapi/setting/syssetting/modifyVfySecurityConfig",
    querySmsVfySecurityConfig: "bkapi/setting/syssetting/queryVfySecurityConfig",

    checckSheetMemberGroup:
      "bkapi/member/audit/findAccouGroupByName" /*会员名查询会员组和余额*/,
    checckSheetJs: "bkapi/member/audit/immediatelyAudit" /*即时稽核*/,
    checckSheetCkJs: "bkapi/member/audit/withdrawAudit" /*出款订单 即时稽核*/,
    checckSheetJsDetail: "bkapi/member/audit/auditBonusInfo" /*即时稽核详情*/,

    checckSheetJsQc: "bkapi/member/audit/clearAudit" /*即时稽核清除*/,
    checckSheetJsXg: "bkapi/member/audit/updateAudit" /*即时稽核修改*/,

    checckSheetJsTime: "bkapi/member/audit/getPlatformMaxTime" /*及时稽核时间*/,

    checckSheetLs: "bkapi/member/audit/auditHistoryList" /*历史稽核*/,
    checckSheetLsYh:
      "bkapi/member/audit/auditHistoryBonusList" /*历史稽核优惠稽核*/,
    checckSheetMoney:
      "bkapi/member/audit/findAuditAccountBalance" /*即时优惠弹窗获取余额*/,

    checckSheetJsOne: "bkapi/member/audit/updateNormal" /*正常*/,
    checckSheetJsTwo: "bkapi/member/audit/addAuditBonus" /*增加*/,
    checckSheetJsThree: "bkapi/member/audit/clearAuditBonus" /*清除*/,
    checckSheetJsFour: "bkapi/member/audit/auditCharge" /*扣款*/,

    loseWinMainPage: "bkapi/analysis/winlost/findWinLostReportPage", // 输赢报表首页
    loseWinMainLastUpdateTime: "/bkapi/analysis/winlost/getBetLastDate", // 输赢报表首页最后更新时间
    loseWinInnerPage: "bkapi/analysis/winlost/findWinLostGroupAgentReportPage", // 输赢报表--总代
    findWinLostGroupUserReportPage:
      "bkapi/analysis/winlost/findWinLostGroupUserReportPage", // 输赢报表--代理
    findTransactionPage: "bkapi/analysis/winlost/findTransactionPage", // 输赢报表--会员
    findBonusReportPage: "/bkapi/analysis/bouns/findBonusReportPage", // 红利报表
    findBonusGroupTopAgentReportPage:
      "/bkapi/analysis/bouns/findBonusGroupTopAgentReportPage",
    findBonusGroupAgentReportPage:
      "/bkapi/analysis/bouns/findBonusGroupAgentReportPage",
    findSubAgent: 'bkapi/analysis/bouns/findSubAgent',
    findSubordinateBonus: 'bkapi/analysis/bouns/findSubordinateBonus',
    findBonusGroupUserReportPage:
      "/bkapi/analysis/bouns/findBonusGroupUserReportPage",
    findBonusGroupUserTotal: "/bkapi/analysis/bouns/findBonusGroupUserTotal",
    findBonusPage: "/bkapi/analysis/bouns/findBonusPage",
    findBonusExport: "/bkapi/analysis/bouns/exportBonus", //红利报表导出接口
    checkBonusExportFile: "/bkapi/analysis/bouns/checkFile", //导出查询
    findRptBetTotalPage: "/bkapi/analysis/gameData/findRptBetTotalPage", // 游戏数据报表
    findRptBetTotalList: "/bkapi/analysis/gameData/findRptBetTotalList",
    findBetDayTotal: "/bkapi/analysis/gameData/findBetDayTotalNew",
    findBetDayGroupGameTypePage:
      "/bkapi/analysis/gameData/findBetDayGroupGameTypePageNew",
    findBetDayGroupTopAgentPage:
      "/bkapi/analysis/gameData/findBetDayGroupTopAgentPage",
    findBetDayGroupAgentPage:
      "/bkapi/analysis/gameData/findBetDayGroupAgentPageNew",
    findBetDayBetAgent: '/bkapi/analysis/gameData/findBetDayBetAgent',
    findBetDayGroupUserPage: "/bkapi/analysis/gameData/findBetDayGroupUserPageNew",
    companyDpositSetting: "bkapi/setting/sysdeposit/list",
    bList: "bkapi/base/baseBank/list",
    oList: "bkapi/base/baseBank/list",

    /*资金报表*/
    findAll: "/bkapi/analysis/fundReport/totalInfo", // 首页统计数据
    allDepot: "/bkapi/analysis/fundReport/depotList", // 平台数据
    moneyMainPage: "/bkapi/analysis/fundReport/list", // 首页table数据
    moneyTotalList: "/bkapi/analysis/fundReport/totalList", //查询代理
    moneyTagencyList: "/bkapi/analysis/fundReport/tagencyList", //查询代理
    moneyMemberList: "/bkapi/analysis/fundReport/agentSubMbrList", // 查询会员
    totalInfoMbrSelf: "bkapi/analysis/fundReport/totalInfoMbrSelf", // 查询会员自身数据
    mbrSubMbrList: "bkapi/analysis/fundReport/mbrSubMbrList", // 查询会员自身下级数据
    totalMbrList: "bkapi/analysis/fundReport/totalMbrList", // 查询会员自身视图数据
    judgeTagency: "/bkapi/analysis/fundReport/judgeTagency", // 判断总代和子代
    statistAnalysis: "/bkapi/fund/deposit/depositStatisticByPay", //统计分析页

    // 代付
    findFundWhiteListOne: "/bkapi/fund/deposit/findFundWhiteListOne/", // 查询单个会员白名单信息
    addFundWhiteList: "/bkapi/fund/deposit/addFundWhiteList", // 添加白名单
    deleteFundWhiteList: "/bkapi/fund/deposit/deleteFundWhiteList/", // 删除白名单
    findFundMerchantPayListPage:
      "/bkapi/fund/deposit/findFundMerchantPayListPage", // 获取出款管理数据
    findTChannelPayListCr: "/bkapi/fund/deposit/findTChannelPayListCr",
    addFundMerchantPay: "/bkapi/fund/deposit/addFundMerchantPay", // 添加出款管理
    updateFundMerchantPay: "/bkapi/fund/deposit/updateFundMerchantPay", // 更新出款管理
    deleteFundMerchantPay: "/bkapi/fund/deposit/deleteFundMerchantPay", // 添加出款管理
    updateFundMerchantPayAvailable:
      "/bkapi/fund/deposit/updateFundMerchantPayAvailable", // 更新出款管理状态
    findFundMerchantPayOne: "/bkapi/fund/deposit/findFundMerchantPayOne/", // 查询单个出款管理
    getCount: "/bkapi/fund/deposit/listCount", // 首页获取消息
    getChannelIds: "/bkapi/fund/deposit/findTChannelPayList", // 获取代付的id
    getMenuAuth: "/bkapi/sys/menu/getMenuAuth", // 通过menuid获取操作权限
    getMenuSaveAuth: "/bkapi/sys/menu/getMenuAuthSaved", // 通过roleid和menuid获取操作权限
    getRoleMenu: "/bkapi/sys/menu/getRoleMenu", // 通过role获取menu
    saveRoleMenu: "/bkapi/sys/menu/saveRoleMenu", // 保存权限
    getAllChildAgent: "bkapi/agent/account/findAllSubAgency",
    getAllChildAgentIncludeDisable: "bkapi/agent/account/findAllSubAgencyIncludeDisable",
    /*新版权限*/
    getNewMenu: "/bkapi/sys/menu/treeList", //获取菜单栏列表
    getNewMenuDetail: "/bkapi/sys/columnAuth/getAllColumnAuth", //查询某个菜单下所有列权限
    saveAutoList: "/bkapi/sys/columnAuth/modifyColumnAuth",
    /* 树状权限 */
    getTreeNewMenu: "/bkapi/sys/menu/treeListNew", //获得登录角色的完整权限树
    queryRoleIdsByMenuId: "/bkapi/sys/role/queryRoleIdsByMenuId", //根据权限id 查询拥有该权限以及子权限的角色
    checkSysUser: "/bkapi/sys/role/checkSysUser", //修改多个用户的角色 用户校验
    deleteByUserId: "bkapi/sys/role/deleteByUserId", //删除用户的角色
    deleteMenuForManyRole: "bkapi/sys/menu/deleteMenuForManyRole", //删除用户的角色
    setManySysUserRole: "bkapi/sys/role/setManySysUserRole", //保存用户的角色
    getCurRoleLimit: "/bkapi/sys/menu/getRoleMenuNew", //获得某角色所有勾选权限
    /*会员支付  简版*/
    PayNewSearch: "/bkapi/fund/deposit/depositList" /*查询列表*/,
    PayNewOnlineDetail: "/bkapi/fund/deposit/info" /*查询线上入款详情*/,
    PayNewCompanyDetail: "/bkapi/fund/deposit/info" /*查询公司入款详情*/,
    getDepositSumStatistic:
      "/bkapi/fund/deposit/depositSumStatistic" /* 入款合计统计接口 */,
    getAccSumDrawingAmount:
      "/bkapi/fund/withdraw/accSumStatistics" /* 取款合计统计接口 */,

    // getAllChildAgent: 'bkapi/agent/account/findAllSubAgency',
    sevenData: "bkapi/analysis/winlost/mamberReport",
    mamberReportEx: "bkapi/analysis/winlost/mamberReportEx",
    findHomePageCounEx: "bkapi/member/mbraccount/findHomePageCountEx",
    baseNoticeList: "bkapi/base/oprNotice/oprNoticeList", // 所有公告
    baseNoticePage: "bkapi/base/oprNotice/oprNoticeListPage", // 根据bool获取已读 未读
    baseNoticeChangeStatus: "bkapi/base/oprNotice/oprNoticeRead", // 改变状态
    baseMenuCollectList: "bkapi/member/collect/collectList", // 会员收藏菜单
    baseMenuList: "bkapi/member/collect/menuList", // 会员所有菜单
    baseMenuAdd: "bkapi/member/collect/collectInsert", // 会员更新菜单
    todayData: "bkapi/member/mbraccount/findHomePageCount",
    queryDepotOrAccountBalance: "/bkapi/fund/report/queryDepotOrAccountBalance", // 根据账户和平台获取余额
    createOrderNumber: "/bkapi/fund/report/createOrderNumber", // 获取订单号
    updateManageStatus: "/bkapi/fund/report/updateManageStatus", // 修改转账状态
    reportSave: "/bkapi/fund/report/save", // 保存新增转账
    queryAccountBalance: "/bkapi/fund/report/queryAccountBalance", // 通过会员获取余额

    /*会员列表新版权限控制*/
    memberListInitAuthGriList: "/bkapi/member/mbraccount/list",
    memberListInitAuthGet: "/bkapi/member/mbraccount/seachList",
    memberListInitAuthGetDetail: "/bkapi/member/mbraccount/columnFrameList",
    billRecordList: "/bkapi/fund/report/billRecordList", // 账变流水
    balanceRecord: {
      detail: "/bkapi/mbrfreindtransdetail/info/" // GET /bkapi/mbrfreindtransdetail/info/{mbdId}
    },
    /*除会员列表的时候掉这个获取*/
    otherMemberList: "/bkapi/sys/menu/getChildMenuList",
    /* 输赢报表 */
    findDepotGameOne: "/bkapi/analysis/winlost/findDepotList", // 筛选条件联动
    findDepotGameOne2: "/bkapi/operate/tgmdepot/findCatDepot", // 筛选条件联动---update2018-8-20
    findDepotGameTwo: "/bkapi/analysis/winlost/findGameList", // 筛选条件联动  --depotId
    findDepotGameThree: "/bkapi/analysis/winlost/findSubGameList", // 筛选条件联动  --depotId，catId
    findWinLostList: "/bkapi/analysis/winlost/findWinLostList", // 股东数据
    findWinLostListOfTagency:
      "/bkapi/analysis/winlost/findWinLostListOfTagency", // 总代数据
    findWinLostListByTagencyId:
      "/bkapi/analysis/winlost/findWinLostListByTagencyId", // 次代数据
    findWinLostListByCagencyId:
      "/bkapi/analysis/winlost/findWinLostListByCagencyId", // 会员数据
    findWinLostListByAccountId:
      "/bkapi/analysis/winlost/findWinLostListByAccountId", // 会员投注数据
    validBetAccountCounts: "/bkapi/analysis/winlost/getValidBetAccountCounts", // 查询有效人数
    /*  游戏列表*/
    findGameTypes: "/bkapi/operate/tgmgame/findGameType", // 获取游戏类型
    findGameTypeEx: "/bkapi/operate/tgmgame/findGameTypeEx", // 获取游戏类型(带其他)
    findPlatforms: "/bkapi/operate/tgmgame/listCatDepot", // 根据游戏类型获取游戏平台
    tgmgameList: "/bkapi/operate/tgmgame/listGame", // 获取全部平台
    tgmgameListUpdate: "/bkapi/game/tgamelogo/update", // 平台修改
    findGameList: "/bkapi/operate/tgmgame/findGameList", // 查询电子游戏
    findGameListUpdate: "/bkapi/operate/tgmgame/update", // 游戏修改
    findGameHasSubcatList: "bkapi/operate/tgmgame/findGameHasSubcatList", // 查询电子游戏
    /*支付配置 */
    bankpayList: "/bkapi/company/deposit/list", // 支付配置银行卡
    saveBankCard: "/bkapi/company/deposit/save", // 公司入款保存， 上传凭证
    autoIncomeSavePlatform: "bkapi/company/deposit/fastPaySave",  // 快速入款保存， 上传凭证
    onlinePaySave: "/bkapi/onlinepay/save",  // 线上入款， 上传凭证
    updateBankCard: "/bkapi/company/deposit/update",
    deleteBankCard: "/bkapi/company/deposit/delete/",
    changeBankcardStatus: "/bkapi/company/deposit/updateStatus",
    companyDepositInfo: "/bkapi/company/deposit/companyInfo/",
    autoIncomeList: "bkapi/company/deposit/fastPayList", // 自动入款平台
    autoIncomeInfo: "bkapi/company/deposit/fastPayInfo",
    autoIncomeBankList: "bkapi/base/baseBank/payBankList",
    autoIncomeUpdatePlatform: "bkapi/company/deposit/fastPayUpdate",
    autoIncomeDeletePlatform: "bkapi/company/deposit/fastPayDelete",
    changePlatformStatus: "bkapi/company/deposit/fastPayAvailable",
    onlinePayList: "/bkapi/onlinepay/list", // 线上支付
    onlineUpdateJump: "/bkapi/onlinepay/updateJump", // 修改在线支付跳转方式
    qrCodePayList: "/bkapi/company/deposit/qrCodePayList", // 普通二维码支付
    qrCodeAvailable: "/bkapi/company/deposit/qrCodeAvailable",
    crPayList: "/bkapi/company/cryptocurrencies/crPayList", // 加密货币
    crAvailable: "/bkapi/company/cryptocurrencies/crAvailable", // 加密货币禁用启用
    updateCrSort: "/bkapi/company/cryptocurrencies/updateCrSort", // 加密货币禁用启用
    onlinePayupdateStatus: "/bkapi/onlinepay/updateStatus",
    onlinePayDelete: "/bkapi/onlinepay/delete/",
    onlinePayInfo: "/bkapi/onlinepay/onlinepayInfo/",
    qrCodePayInfo: "/bkapi/company/deposit/qrCodePayInfo",
    crPayInfo: "/bkapi/company/cryptocurrencies/crPayInfo",
    qrCodeSave: "/bkapi/company/deposit/qrCodeSave",
    qrCodeUpdate: "/bkapi/company/deposit/qrCodeUpdate",
    crSave: "/bkapi/company/cryptocurrencies/crSave",
    crUpdate: "/bkapi/company/cryptocurrencies/crUpdate",
    qrCodeDelete: "/bkapi/company/deposit/qrCodeDelete",
    crDelete: "/bkapi/company/cryptocurrencies/crDelete",
    qrTypeList: "/bkapi/base/baseBank/qrTypeList",
    crTypeList: "/bkapi/company/cryptocurrencies/crTypeList",
    onlinePayUpdate: "/bkapi/onlinepay/update",
    onlinePayListList: "/bkapi/onlinepay/payList",
    onlinePayShortcutPayList: "bkapi/onlinepay/shortcutPayList",
    /* 支付分配 */
    getAllotListByGroupId: "bkapi/onlinepay/allotListByGroupId",
    updateBankSort: "bkapi/onlinepay/updateBankSort", // 银行卡排序
    updateOnlineSort: "bkapi/onlinepay/updateOnlineSort", // 线上支付排序
    updateAutoSort: "bkapi/onlinepay/updateFastPaySort", // 自动入款平台排序
    updateQrCodeSort: "bkapi/onlinepay/updateQrCodeSort", // 二维码排序
    updateQuota: "bkapi/onlinepay/updateQuota", //修改限额
    updateQuotaBatch: "bkapi/onlinepay/updateQuotaBatch", // 自动入款平台修改限额
    lineSummary: "bkapi/deposit/statisticSucRate", //线路统计

    // 设置 --- 代理设置
    setProxyOne: "bkapi/agent/setting/agentRegister",
    setProxyTwo: "bkapi/agent/setting/agentCommission",
    getSetProxy: "bkapi/agent/setting/agentInfo",
    // 设置 --- 佣金设置
    getPlatformClass: "bkapi/agent/setting/commDepotList",
    getPlatformClassRule: "bkapi/agent/setting/commissionCompareInfo",
    getPlatformClassInfo: "bkapi/agent/setting/info",
    getPlatformClassSave: "bkapi/agent/setting/update",
    getPlatformClassDelete: "bkapi/agent/setting/delete",
    // 返利列表
    getRebateList: "bkapi/operate/rebate/listAll",
    getRebateDetail: "bkapi/operate/rebate/refferList",
    // 好友返利列表
    getRecommendList: '/bkapi/operate/friendsRebate/friendRebateList',
    getIncomeList: '/bkapi/operate/friendsRebate/friendRebateRewardList',
    getIncomeDetailList: '/bkapi/operate/friendsRebate/friendRebateRewardDetails',
    getIncomeTotal: '/bkapi/operate/friendsRebate/friendRebateRewardDetailsSummary',

    // 好友返利明细  --2704
    getrebateDetailFriendList: '/bkapi/operate/friendsRebate/rebateDetailFriendList',
    getexportRebateDetailFriendList: '/bkapi/operate/friendsRebate/exportRebateDetailFriendList',
    getcheckFile: '/bkapi/operate/friendsRebate/checkFile',

    // 优惠码
    getPromoCodeActivity: 'bkapi/activity/promocode/getPromoCodeActivity', // GET // 查询激活优惠活动
    getPromoCodeAllActivity: 'bkapi/activity/promocode/getPromoCodeAllActivity', // GET  请求 // 查询所有优惠活动
    generatePromoCode: 'bkapi/activity/promocode/generatePromoCode', // POST 请求 // 生成活动码
    promoCodeList: 'bkapi/activity/promocode/promoCodeList',  // get 请求 // 优惠码列表
    promoCodeRecordList: 'bkapi/activity/promocode/promoCodeRecordList',  // get 请求 // 优惠码列表

    // 红利列表
    bonusList: {
      list: "bkapi/operate/bonus/getActivitiesWithAuditCount",
      save: "bkapi/operate/bonus/save",
      auditList: "bkapi/operate/activity/activityAuditList",
      activityAuditListExport: "/bkapi/operate/activity/activityAuditListExport",
      audit: "bkapi/operate/activity/activityAudit",
      auditRefuse: "bkapi/operate/activity/activityAuditRefuse", //拒绝时调用
      getDiscountAudit: "bkapi/operate/bonus/getDiscountAudit",
      findMbrLevelAndAgyInfo: "bkapi/member/mbraccount/findMbrLevelAndAgyInfo",
      findOneMbrLevelAndAgyInfo: "bkapi/member/mbraccount/findOneMbrLevelAndAgyInfo", // 会员详情 - 会员代理/推荐人编辑
      activityModifyAmount: "bkapi/operate/activity/activityModifyAmount",
      allActivityAuditListExport: "bkapi/operate/bonus/allActivityAuditListExport",
      checkFile: "bkapi/operate/bonus/checkFile",
      checkBonusExportFile: "bkapi/operate/activity/checkFile",
    },
    // 返水列表
    waterRebateList: {
      list: "/bkapi/operate/activity/water/waterList",
      auditList: "/bkapi/operate/activity/water/waterAuditList",
      audit: "/bkapi/operate/activity/water/activityAudit"
    },
    // 活动分类
    activityCategory: {
      list: "/bkapi/operate/opractcat/list",
      save: "/bkapi/operate/opractcat/save",
      update: "/bkapi/operate/opractcat/update",
      delete: "/bkapi/operate/opractcat/delete",
      listAll: "/bkapi/operate/opractcat/listAll",
      available: "/bkapi/operate/opractcat/updateAvailable"
    },
    // 活动介绍
    activityIntroduction: {
      list: "bkapi/operate/activity/activityList",
      info: "bkapi/operate/activity/activityInfo",
      save: "bkapi/operate/activity/saveActivity",
      update: "bkapi/operate/activity/updateActivity"
    },
    //任务中心统计
    taskCenterStatistic: {
      bonunsStatistic: "bkapi/task/bounsStatistical",
      exportBounsStatistical: "bkapi/task/exportBounsStatistical",
      checkFile: "bkapi/task/checkFile",
      getRecodeList: "bkapi/task/bounsDetail"
    },
    // 渠道列表
    channel: {
      channelList: 'bkapi/agent/channel/list',
      channellogList: 'bkapi/agent/channelog/list',
      channelSave: 'bkapi/agent/channel/save',
      channelUpdate: 'bkapi/agent/channel/update',
      channelDel: 'bkapi/agent/channel/delete',
      channelExport: 'bkapi/agent/channelog/exportList',
      channelgroup: 'bkapi/agent/channelgroup/list',
      channelgroupSave: 'bkapi/agent/channelgroup/save',
      channelgroupUpdate: 'bkapi/agent/channelgroup/update',
      channelgroupDel: 'bkapi/agent/channelgroup/delete',
    },
    // 活动规则
    activityRule: {
      list: "bkapi/operate/activity/activityRuleList", // 查单条 kapi/operate/activity/activityRuleList/{id}
      save: "bkapi/operate/activity/saveActivityRule", // 保存
      update: "bkapi/operate/activity/updateActivityRule", // 更新
      delete: "bkapi/operate/activity/deleteRule",
      available: "bkapi/operate/activity/availableRule",
      category: "bkapi/operate/topacttmpl/list", // 获取活动模板
      oprActLabelList: 'bkapi/operate/activity/oprActLabelList',//获取活动标签
      listAll: "bkapi/operate/activity/ruleList", // 获取所有活动规则
      getPlatforms: "bkapi/operate/tgmcat/listCatDepot", // 根据分类获取平台
      setRebateLimit: "bkapi/operate/activity/setSelfHelp", //自助返水控制接口
      getActBlacklist: "bkapi/operate/activity/getActBlacklist", //查询黑名单
      getActBlacklistByName: '/bkapi/operate/activity/getActBlacklistByName',//批量查询黑名单
      saveActBlacklist: "bkapi/operate/activity/saveActBlacklist", //添加黑名单
      batchSaveActBlacklist: '/bkapi/operate/activity/batchSaveActBlacklist',//批量添加黑名单
      deleteActBlacklist: "bkapi/operate/activity/deleteActBlacklist", //删除黑名单
      batchDeleteActBlacklist: '/bkapi/operate/activity/batchDeleteActBlacklist', // 批量删除黑名单

      getAgent: "/bkapi/operate/activity/getAgent", //查询所有代理接口
      deleteAgy: "/bkapi/operate/activity/deleteAgentWaterRule", //代理规则删除
      taskCenter: "/bkapi/task/configList", //任务中心
      taskCenterConfigInfo: "/bkapi/task/configInfo", //任务中心详情
      signEnterExit: "/bkapi/task/updateTaskRule", //编辑签到
      changeStatus: "/bkapi/task/updateAvailable",
      getTaskBlacklist: "/bkapi/task/taskBlackList",
      deleteTaskBlacklist: "/bkapi/task/deletTaskBlackList",
      addTaskBlackList: "/bkapi/task/addTaskBlackList",
      getPaymentTypeList: "/bkapi/onlinepay/jDepositPayList",
      // 任务中心黑名单
      batchAddTaskBlackList: "/bkapi/task/batchAddTaskBlackList", // 批量新增
      batchDeletTaskBlackList:  "/bkapi/task/batchDeletTaskBlackList",// 批量删除
      taskBlackListByName: "/bkapi/task/taskBlackListByName",  // 根据名称查询
    },
    // 会员活动等级
    memberLevel: {
      list: "bkapi/member/mbractlevel/list",
      save: "bkapi/member/mbractlevel/save",
      delete: "bkapi/member/mbractlevel/delete",
      update: "bkapi/member/mbractlevel/update",
      info: "bkapi/member/mbractlevel/info",
      updateAvailable: "bkapi/member/mbractlevel/updateAvailable", //none use
      updateAvailableBatch: "/bkapi/member/mbractlevel/updateAvailableBatch", //会员活动层级-禁用启用
      activityLock: "bkapi/member/mbraccount/updateLevel", // 锁定会员星级
      getAutomatic: "bkapi/member/mbractlevel/findAutomatic",
      getAutomaticNew: "bkapi/member/mbractlevel/findDowngrade",
      setAutomatic: "bkapi/member/mbractlevel/setAutomatic",
      setAutomaticNew: "bkapi/member/mbractlevel/setDowngrade",
      getLevelNotLockMbrList: "bkapi/member/mbraccount/getLevelNotLockMbrList", // 获取未锁定会员等级的会员
      batchUpdateActLevel: "bkapi/member/mbraccount/batchUpdateActLevel", // 批量更新会员等级
      findActLevelStaticsRule:
        "bkapi/member/mbractlevel/findActLevelStaticsRule", // 查询会员等级统计周期
      setStaticsRule: "bkapi/member/mbractlevel/setStaticsRule", // 设置会员等级统计周期
      viewData: "/bkapi/member/mbraccount/viewData",
      updateSanGong: "/bkapi/member/mbraccount/modifyRebateRatio",
      getNumSendMessage: "/bkapi/member/mbraccount/massTextingCount",
      accountAutoLog: "/bkapi/member/mbraccount/accountAutoLog",
    },
    // 好友转账
    friendTransfer: {
      list: "bkapi/mbrfreindtransdetail/list",
      audit: "/bkapi/mbrfreindtransdetail/audit",
    },
    loseWinSheet: {
      reportList: "bkapi/analysis/gameWinLose/findWinLostReportList", // 上方表格
      sum: "bkapi/analysis/gameWinLose/findWinLostSum", // 总计
      listLevel: "bkapi/analysis/gameWinLose/findWinLostListLevel", // 下方表格
      loginName: "bkapi/analysis/gameWinLose/findWinLostLoginName", // 单个会员信息 当上方表格为会员时需要和下方表格合在一起
      getLastUpdate: "bkapi/analysis/winlost/getBetLastDate", // 最后更新时间
      loginNameList: "bkapi/analysis/gameWinLose/findWinLostLoginNameList", // 仅查询会员
      account: "bkapi/analysis/gameWinLose/findWinLostAccount", // 仅查询会员详情
      sumByLoginName: "bkapi/analysis/gameWinLose/findWinLostSumByLoginName", // 仅查询会员详情总计,
      getTypeByUsername: "bkapi/member/mbraccount/findAccountOrAgentByNameEx", // 根据username查询该账户是代理还是会员
      export: "bkapi/analysis/gameWinLose/exportMbrWinLoseInfo",
      checkFile: "bkapi/analysis/gameWinLose/checkFile",
      downloadExcel: "bkapi/file/export/downloadExcel",
      findWinLostReportView: "bkapi/analysis/gameWinLose/findWinLostReportView", // 获取视图
      findWinLostReportMbrView: "bkapi/analysis/gameWinLose/findWinLostReportMbrView", // 获取会员视图
      findWinLostReportViewAgent: "bkapi/analysis/gameWinLose/findWinLostReportViewAgent", // 根据代理获取子代
      exportWinLostReport: "bkapi/analysis/gameWinLose/exportWinLostReport",//导出输赢报表
      exportAccountWinLostReport: "bkapi/analysis/gameWinLose/exportAccountWinLostReport",//导出会员输赢报表
    },
    // 会员留言
    messageBoard: {
      list: "bkapi/member/message/messageList",
      getMessageInfo: "bkapi/member/message/messageInfo",
      sendMessage: "bkapi/member/message/messageSend"
    },
    // 会员反馈
    memberMessage: {
      list: "/bkapi/member/opinion/list",
      getMessageInfo: "bkapi/member/message/messageInfo",
      sendMessage: "bkapi/member/opinion/update"
    },
    //代理管理
    agentAgyCommissionCompareInfo:
      "bkapi/agent/account/agyCommissionCompareInfo",
    agentSave: "bkapi/agent/account/agyCommission",
    // 代理域名
    agentDomian: {
      list: "bkapi/agent/domain/agyDomainList",
      add: "bkapi/agent/domain/save", // 代理域名新增
      audit: "bkapi/agent/domain/audit",
      delete: "bkapi/agent/domain/delete",
      domainList: "bkapi/agent/domain/domainList", // 查询可以分配的域名
      domainSubList: "bkapi/agent/domain/domainSubList", // 查询可以分配的子域名
      editStatus: "bkapi/agent/domain/available", // 状态变更
      agentDomainExport: "bkapi/agent/export/agentDomainExport", // 状态变更
      exportDomainList: "bkapi/agent/domain/exportDomainList", // 域名导出
      checkFile: "bkapi/agent/domain/checkFile", // 导出检查
    },
    // 会员预警
    mbrwarning: {
      list: 'bkapi/member/mbrwarning/list', // 列表
      dealWith: 'bkapi/member/mbrwarning/dealWith', // 待处理
      conditionList: 'bkapi/member/mbrwarning/conditionList', // 查询预警条件
      switchCondition: 'bkapi/member/mbrwarning/switchCondition', // 修改预警状态
    },
    // 代理-推广素材
    material: {
      list: "bkapi/agent/material/materialList", // 推广素材文件夹
      add: "bkapi/agent/material/addMaterial",
      update: "bkapi/agent/material/updateMaterial",
      delete: "bkapi/agent/material/deleteMaterial",
      detailList: "bkapi/agent/material/materialDetailList",
      detailAdd: "bkapi/agent/material/addMaterialDetail",
      detailDelete: "bkapi/agent/material/deleteMaterialDetail",
      detailUpdate: "bkapi/agent/material/update"
    },
    // 代理报表-代理申请
    agentApply: {
      agyAccountReviewList: 'bkapi/agent/account/agyAccountReviewList', // 所有申请
      allContractList: 'bkapi/agent/contract/allContractList',// 所有契约列表
      agentReview: 'bkapi/agent/account/agentReview', // 保存
      superiorAgentList: 'bkapi/agent/account/superiorAgentList',// 直线代理
      sublineAgentList: 'bkapi/agent/account/sublineAgentList',// 分线代理 - 总线 （直线是所有，包含分线）
      agentListExport: 'bkapi/agent/export/agentListExport',// 代理列表导出
      agyAccountReviewExport: 'bkapi/agent/export/agyAccountReviewExport',// 分线代理 - 总线 （直线是所有，包含分线）
      agyAccountReviewExportCheck: 'bkapi/agent/export/checkFile',// 分线代理 - 总线 （直线是所有，包含分线）
      contractDelete: 'bkapi/agent/contract/delete', // 删除
    },
    // 新-代理列表
    newAggentList: {
      tableList: 'bkapi/agent/account/agyAccountList',
      alldDepartmentList: 'bkapi/agent/dmet/alldDepartmentList', // 查詢所有部門
      findServiceChargAgent: 'bkapi/agent/charge/findServiceChargAgent', // 查詢服务费
      findServiceChargAccount: 'bkapi/agent/charge/findServiceChargAccount', // 查詢服务费
      agentShareholderList: 'bkapi/agent/dmet/agentShareholderList', // 查询查询股东
      addDepartment: 'bkapi/agent/dmet/addDepartment', // 部门新增
      serviceChargAgentCostExport: 'bkapi/agent/export/serviceChargAgentCostExport', // 服务费导出
      serviceChargAccountCostExport: 'bkapi/agent/export/serviceChargAccountCostExport', // 服务费会员导出
      deleteDepartment: 'bkapi/agent/dmet/deleteDepartment', // 部门新增
      agentSave: 'bkapi/agent/account/saveAgent',
      agentReview: 'bkapi/agent/account/agentReview', // 代理申请审核
      saveEmployee: 'bkapi/agent/account/saveEmployee', // 新增员工
      agentDeposit: 'bkapi/agent/deposit/depositList', // 代理入款
      agentOnLineExport: 'bkapi/agent/export/agentOnLineExport', // 代理入款导出
      agyBankList: 'bkapi/agent/account/agyBankList', // 银行卡详情
      agyCryptocurrenciesList: 'bkapi/agent/account/agyCryptocurrenciesList', // 加密钱包详情
      updateFeeModel: 'bkapi/agent/account/updateFeeModel', // 修改服务费结算
      agyAccountInfo: 'bkapi/agent/account/agyAccountInfo', // 详情
      updateAgent: 'bkapi/agent/account/updateAgent', // 详情保存
      updateStatusd: 'bkapi/agent/deposit/updateStatus',// 线上支付审核 - 通过
      updateStatusRefuse: 'bkapi/agent/deposit/updateStatusRefuse', // 线上支付审核 - 拒绝
      agentWithdraw: 'bkapi/agent/withdraw/accList', // 代理提款款
      accWithdrawExport: 'bkapi/agent/export/accWithdrawExport', // 代理提款款导出
      memberUpdateStatus: 'bkapi/agent/withdraw/updateAccStatus',// 线上支付审核 - 客服审核-通过
      memberUpdateStatusRefuse: 'bkapi/agent/withdraw/updateAccStatusRefuse', // 客服审核 - 拒绝
      memberUpdateFinialStatus: "bkapi/agent/withdraw/updateAccStatusFinial", // 复审 财务修改状态
      memberUpdateFinialStatusRefuse: "bkapi/agent/withdraw/updateAccStatusFinialRefuse", // 复审 财务修改状态(拒绝时调用)
      accInfo: 'bkapi/agent/withdraw/accInfo', // 代理提款款-获取会员银行信息d
      auditList: 'bkapi/agent/audit/auditList', // 资金调整
      agentAuditExport: 'bkapi/agent/export/agentAuditExport', // 资金调整导出
      auditAdd: 'bkapi/agent/audit/auditAdd', // 资金调整 - 人工增加
      auditReduce: 'bkapi/agent/audit/auditReduce', // 资金调整 - 人工减少
      upperScoreRecord: 'bkapi/agent/repot/upperScoreRecord', // 代充记录
      upperScoreRecordExport: 'bkapi/agent/export/upperScoreRecordExport', // 代充记录导出
      agentAccountChange: 'bkapi/agent/repot/agentAccountChange', // 账变流水
      agentAccountChangeExport: 'bkapi/agent/export/agentAccountChangeExport', // 账变流水导出
      commissionReviewList: 'bkapi/agent/repot/commissionReviewList', // 代理佣金- 风控审核-列表
      commissionReviewExport: 'bkapi/agent/export/commissionReviewExport', // 代理佣金- 风控审核-列表导出
      updateReviewStatus: 'bkapi/agent/repot/updateReviewStatus', // 代理佣金- 风控审核-审核
      commissionFreedList: 'bkapi/agent/repot/commissionFreedList', // 代理佣金- 财务审核-列表
      commissionFreedListExport: 'bkapi/agent/export/commissionFreedListExport', // 代理佣金- 财务审核-列表导出
      updateFreedStatus: 'bkapi/agent/repot/updateFreedStatus', // 代理佣金- 财务审核-审核
      commissionDetails: 'bkapi/agent/repot/commissionDetails', // 代理佣金- 风控/财务审核-代理详情审核
      commissionReport: 'bkapi/agent/repot/commissionReport', // 代理报表-佣金报表
      commissionReportExport: 'bkapi/agent/export/commissionReportExport', // 代理报表-佣金报表导出
      // depotCostList: 'bkapi/agent/repot/depotCostList',// 代理报表-平台费率
      // depotCostList: 'bkapi/agent/cost/findCostReportViewAgent',// 代理报表-平台费率
      depotCostList: '/bkapi/agent/cost/newFindCostReportViewAgent',// 代理报表-平台费率
      findCostLostReportView: 'bkapi/agent/cost/findCostLostReportView',// 视图-平台费率
      findCostAccountListLevel: 'bkapi/agent/cost/findCostAccountListLevel',// 直属会员-平台费率
      agentDepotCostExport: 'bkapi/agent/export/agentDepotCostExport',// 代理报表-平台费导出
      accountDepotCostExport: 'bkapi/agent/export/accountDepotCostExport',// 代理报表-平台费会员导出
      sumDepotCost: 'bkapi/agent/repot/sumDepotCost', // 代理报表-总计
      depotCostDetail: 'bkapi/agent/cost/findCostAgentDetails',// 代理报表-平台费率-详情
      superiorRebateList: '/bkapi/agent/repot/commissionAllSubList', // 上级返佣列表
      superiorRebateExport: '/bkapi/agent/export/commissionAllSubListExport', // 上级返佣列表
    },
    // 代理报表-契约管理
    agentContract: {
      contractList: 'bkapi/agent/contract/contractList', // 查询契约列表
      info: 'bkapi/agent/contract/contractInfo', // get - 查询单个契约
      add: 'bkapi/agent/contract/addContract', // 新增
      update: 'bkapi/agent/contract/updateContract', // 修改
      agentContractExport: 'bkapi/agent/export/agentContractExport', // 导出
    },
    // 代理报表-综合报表
    agentReport: {
      totalInfo: "/bkapi/agent/comReport/totalInfo", //综合报表--总览详情
      totalListByDay: "/bkapi/agent/comReport/totalListByDay", //综合报表--按照天汇总视图
      tagencyList: "/bkapi/agent/comReport/tagencyList", // 综合报表--总代(股东/全选)视图/下级代理视图
      categoryList: "/bkapi/agent/comReport/categoryList", //综合报表--总代下部门
      subAgentTotalViewList: "/bkapi/agent/comReport/subAgentTotalViewList", //  综合报表--子代代理视图汇总表头
      memberList: "/bkapi/agent/comReport/memberList", // 综合报表--下级会员列表
      getAgentBanner: "/bkapi/agent/account/getAgentBanner", // 综合报表--获取面包屑导航-代理
      judgeTagency: "/bkapi/analysis/fundReport/judgeTagency", // 综合报表--判断总代子代
      comReportExport: "/bkapi/agent/comReport/comReportExport", // 综合报表--统一生成导出文件
      checkFile: '/bkapi/agent/comReport/checkFile', // 综合报表--统一查询导出文件是否可下载
      downloadExcel: 'bkapi/file/export/downloadExcel', // 运营后台--导出文件下载
    },
    /* 日志监控 */
    // 操作日志
    operationLog: {
      list: "bkapi/sys/logMonitor/list"
    },
    /* 会员详情 */
    memberDetail: {
      chkUserInfo: "/bkapi/member/mbraccount/chkUserInfo",
      getBanks: '/bkapi/sys/conf/banks',
      getProvs: '/bkapi/sys/conf/provs',
      getCitys: '/bkapi/sys/conf/citys',
      saveBankCard: 'bkapi/member/mbrbankcard/save',
      cryptoCurrenciesList: 'bkapi/member/cryptoCurrencies/cryptoCurrenciesList',
      cryptoCurrenciesSave: 'bkapi/member/cryptoCurrencies/save'
    },
    // 会员留存率报表
    retentionRate: {
      getList: '/bkapi/analysis/retentionRate/retentionRateDailyActiveReport',// 会员留存率报表查询
      exportReport: '/bkapi/analysis/retentionRate/exportRetentionRateDailyActiveReport',//会员留存率报表导出
      checkFile: '/bkapi/analysis/retentionRate/checkFile',//会员留存率报表检查导出
    },
    bankDifferentName: 'bkapi/member/mbrgroup/bankDifferentName',
    exportMoneySheet: '/bkapi/analysis/fundReport/',//资金报表导出
    moneySheetCheckFile: '/bkapi/analysis/fundReport/checkFile',//资金报表导出检查
    mbrdepositlockList: '/bkapi/mbrdepositlock/list',//存款锁定报表查询
    addDepositLock: '/bkapi/mbrdepositlock/depositLock',//存款锁定报表新增
    getLockInfo: '/bkapi/mbrdepositlock/getLockInfo',//存款锁定报表解锁获取锁定信息
    depositUnlock: '/bkapi/mbrdepositlock/depositUnlock',//存款锁定报表解锁
    depositLockLog: '/bkapi/mbrdepositlock/depositLockLog',//存款锁定报表详情
    getAutoLockSetting: '/bkapi/mbrdepositlock/getAutoLockSetting',//存款锁定报表设置获取设置信息
    saveAutoLockSetting: '/bkapi/mbrdepositlock/saveAutoLockSetting',//存款锁定报表设置保存设置
    getAPPSetting: '/bkapi/sys/push/get',//app推送设置获取
    saveAPPSetting: '/bkapi/sys/push/saveAndUpdate',//app推送设置
    // updateSafariStatus: '/bkapi/onlinepay/updateStatus',//IOS Safari浏览器设置
    fastDepositWithdrawSave: '/bkapi/company/deposit/fastDepositWithdrawSave',//新增极速取款自动入款平台
    fastDepositWithdrawUpdate: '/bkapi/company/deposit/fastDepositWithdrawUpdate',//编辑更新极速取款自动入款平台
    fastDepositUploadImage: '/bkapi/fund/deposit/uploadDepositImage',//会员入款订单类型为极速存取款上传凭证
    retentionRateReport: '/bkapi/analysis/retentionRate/retentionRateReport',//每日留存报表查询
    exportRetentionRateReport: '/bkapi/analysis/retentionRate/exportRetentionRateReport',//每日留存报表导出
    agentExportCheckFile: '/bkapi/analysis/retentionRate/checkFile',//每日留存报表检查导出
    agentLineReportExportCount: '/bkapi/agent/comReport/agentLineReportExportCount',//代理线导出信息核对
    agentLineReportExport: '/bkapi/agent/comReport/agentLineReportExport',//代理线导出
    getSysRoleByRoleMenuExten: '/bkapi/sys/roseMenuExten/getSysRoleByRoleMenuExten',//权限列表添加部门权限查询角色
    saveAndUpdateByRoleId: '/bkapi/sys/roseMenuExten/save',//权限列表保存更新添加部门权限
    deleteByRoleId: '/bkapi/sys/roseMenuExten/delete',//权限列表删除部门权限
    groupListAll: '/bkapi/member/mbrgroup/listAll',//新增代理账号时可选会员组
    warningList: '/bkapi/sys/warning/list',//预警信息列表
    dealWarningList: '/bkapi/sys/warning/dealWith',//处理预警信息列表
    updateStatusSucToFail: '/bkapi/fund/deposit/updateStatusSucToFail',//入款订单处理为失败
    mbrlabelList: '/bkapi/member/mbrlabel/listAll',//会员标签列表
    mbrlabel: '/bkapi/member/mbrlabel/list',//会员标签页查询列表数据
    saveMbrlabel: '/bkapi/member/mbrlabel/save',//新增会员标签
    updateMbrlabel: '/bkapi/member/mbrlabel/update',//新增会员标签规则-免审
    updateMbrlabelAvailable: '/bkapi/member/mbrlabel/updateAvailable',//更新会员标签状态
    setMbrLabel: '/bkapi/member/mbrlabel/setMbrLabel',//添加会员标签的会员
    updateExemptMemo: '/bkapi/fund/withdraw/updateExemptMemo',//添加会员标签的会员
    exportUserList: '/bkapi/sys/user/exportUserList',//导出用户管理列表
    checkFileUserList: '/bkapi/sys/user/checkFile',//导出用户管理列表
    artificialWithdrawal: '/bkapi/fund/withdraw/artificialWithdrawal',//添加人工提款
    artificialAccInfo: '/bkapi/fund/withdraw/accInfoByOrderno',//关联人工提款
    lineService: '/bkapi/company/lineService/list',//小额支付列表
    lineServiceUpdate: '/bkapi/company/lineService/update',//小额支付列表修改
    updateAdjustment: '/bkapi/fund/report/updateAdjustment',//会员详情账目调整
    mbrFundReport: '/bkapi/analysis/mbrFundReport/list',//会员资金报表
    mbrFundReportExport: '/bkapi/analysis/mbrFundReport/exportList',//会员资金报表导出
    mbrFundReportCheck: '/bkapi/analysis/mbrFundReport/checkFile',//会员资金报表导出检查
    queryVenturePlanSet: '/bkapi/setting/syssetting/queryVenturePlanSet',//获取合营计划设置
    venturePlanSet: '/bkapi/setting/syssetting/venturePlanSet',//合营计划设置
    agentDateList: '/bkapi/analysis/fundReport/agentList',//代理资金日期报表查询
    exportAgentDateList: '/bkapi/analysis/fundReport/exportAgentList',//代理资金日期报表导出
    tagencyFundList: '/bkapi/analysis/fundReport/tagencyFundList',//代理资金会员报表
    exportTagencyFundList: '/bkapi/analysis/fundReport/exportTagencyFundList',//代理资金会员报表导出
    tagencyCheckFile: '/bkapi/analysis/fundReport/checkFile',//代理资金会员报表导出
    updateAgentRate: '/bkapi/agent/account/updateAgentRate',//修改上级返利比例
    deleteMbrlabel: '/bkapi/member/mbrlabel/delete',//删除会员标签
    countOnline: '/bkapi/member/mbraccount/countOnline',//获取会员列表实时在线人数
    recoverBalance: "/bkapi/member/mbraccount/recoverBalance", // 会员列表 - 余额一键回收
    otherPayAccountList: '/bkapi/member/mbrbankcard/list',//会员详情其他钱包
    queryCuiDanSet: '/bkapi/setting/syssetting/queryCuiDanSet',//获取提款列表催单时间
    setCuiDanSet: '/bkapi/setting/syssetting/setCuiDanSet',//设置提款列表催单时间
    agentViewOther: '/bkapi/agent/account/viewOther',//代理详情弹窗服务费平台费获取
    mbrlog: '/bkapi/analysis/mbrlog/list',//资金报表日志
    rptBetRcdDayLogList: '/bkapi/analysis/mbrlog/rptBetRcdDayLogList',//资金报表日志更新2
    queryBroadcastSwitchSetting: "/bkapi/setting/syssetting/queryBroadcastSwitchSetting",//通知播报设置获取
    updateBroadcastSwitchSetting: "/bkapi/setting/syssetting/updateBroadcastSwitchSetting",//通知播报设置更改

    //会员提款 - 会员可自行取消提款订单
    updateAccStatusPaymentPend: "/bkapi/fund/withdraw/updateAccStatusPaymentPend", //会员提款 - 会员出款待定
    updateAccStatusCancel: "/bkapi/fund/withdraw/updateAccStatusCancel", //会员提款 - 会员出款取消订单


    depositStatisticTotalExport: "/bkapi/deposit/depositStatisticTotalExport", // 笔数统计导出
    depositCheckFile: "/bkapi/deposit/checkFile", // 导出下载
    depositStatisticRateExport: "/bkapi/deposit/depositStatisticRateExport",   // 比率统计导出


    resendAccOrder: "/bkapi/fund/withdraw/resendAccOrder",


    resetNewMemberCount: "/bkapi/member/mbraccount/resetNewMemberCount", // 系统设置 - - 充值新注册会员统计接口
  },
  rules: {
    maxLength: {
      mobile: 11,
      email: 30,
      qq: 15,
      wechat: 20,
      bankAccount: 19
    },
    commonRule: {
      numberRuleE: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        { pattern: /(^[0-9]*[1-9][0-9]*$)/, message: lang("请输入正整数") },
        { type: "number", min: 1, message: lang("请输入大于0的正整数") },
      ],
      expireTime: [{ type: "date", required: true, message: lang("请选择日期") }],
      shouldSelect: { required: true, message: lang("请选择一个") },
      changeNotNull: [
        { required: true, message: lang("不能为空"), trigger: "change" }
      ],
      notNull: [{ required: true, message: lang("不能为空"), trigger: "blur" }],
      numberRule: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        { pattern: /(^[1-9]\d*$)/, message: lang("请输入正整数") },
        { type: "number", min: 1, message: lang("请输入大于0的正整数") }
      ],
      percentRule: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        { pattern: /(^[1-9]\d*$)/, message: lang("请输入正整数") },
        { type: "number", min: 1, max: 100, message: lang("请输入1-100之间的正整数") }
      ],
      atLeastOne: [
        { required: true, message: lang("请至少选择一个会员组"), trigger: "change" },
        { type: "array" }
      ],
      chinese: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,20}$/,
          message: lang("请输入正确的中文名称")
        }
      ],
      chinese2: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,4}$/,
          message: lang("请输入2到4个中文汉字")
        }
      ],
      chinese3: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{5,20}$/,
          message: lang("请输入5到20个中文汉字")
        }
      ],
      chinese4: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,6}$/,
          message: lang("请输入2到6个中文汉字")
        }
      ],
      chinese5: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{1,15}$/,
          message: lang("输入1到15个中文汉字")
        }
      ],
      chinese6: [
        { required: true, message: lang("请输入中文"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{1,20}$/,
          message: lang("输入1到20个中文汉字")
        }
      ],
      cnAndEnAndVietnam: [
        { required: true, message: lang("请输入中文，英文或者越南文"), trigger: "blur" },
        {
          pattern: /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u0020]{1,30}$/,
          message: lang("输入1到30个中文，英文或者越南文")
        }
      ],
      realNameContainEnglishAndVietnamName: [
        { required: true, message: lang("请输入真实姓名"), trigger: "blur" },
        {
          pattern: /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u0020]{2,50}$/,
          message: lang("真实姓名只能为2-50位汉字(及·)或者英文(及空格符)或者越南文"),
          trigger: "blur"
        }
      ],
      douhao: [
        { required: true, message: lang('不能为空'), trigger: 'blur' },
        { pattern: /(^[0-9]|[,]\d*$)/, message: lang("请输入整数,多个数字请用,隔开") },
      ],
      realNameAustrlia: [
        { required: true, message: lang("请输入真实姓名"), trigger: "blur" },
      ]
    },
    mbrDepositRule: {
      numberRule: [
        { required: true, message: lang("不能为空") },
        { type: "integer", min: 1, message: lang("请输入大于0的正整数") }
      ]
    },
    manualRule: {
      moneyAmount: [
        { required: true, message: lang("金额不能为空") },
        { pattern: maxTwoDecimalsPattern, message: lang("最多允许两位小数") },
        { type: "number", min: 0, message: lang("金额必须大于等于0") }
      ],
      memo: [{ required: true, message: lang("备注不能为空") }],
      number: [
        { required: true, message: lang("倍数不能为空") },
        { pattern: /(^[1-9]\d*$)/, message: lang("请输入正整数") },
        { type: "number", min: 1, max: 100, message: lang("倍数为1-100之间的整数") }
      ]
    },
    bankAddRule: {
      account: [
        { required: true, message: lang("请输入开户账号") },
        { pattern: /^\d{1,19}$/, message: lang("请输入正确的开户账号") }
      ],
      ausAccount: [
        { required: true, message: lang("请输入开户账号") },
        // { pattern: /^\d{1,20}$/, message: lang("请输入正确的开户账号") }
      ],
      bankName: [
        { required: true, message: lang("请选择银行") },
      ],
      areaCode: [
        { required: true, message: lang("请选择银行") },
      ],
      bankBranchBsb: [
        { required: true, message: lang("请输入BSB码") },
        { pattern: /^\d{0,9}$/, message: lang("请输入正确的BSB码") }
      ],
      bankAccountAstBank: [
        { required: true, message: lang("请输入开户账号") },
        { pattern: /^\d{1,60}$/, message: lang("请输入正确的开户账号") }
      ],
      bankAccountAst: [
        { required: true, message: lang("请输入开户账号") },
      ],
    },
    memberInfoRule: {
      accountName: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        {
          pattern: /^[a-zA-Z\d]{6,10}$/,
          message: lang("会员账号为6~10位数字、字母或组合")
        }
      ],
      accountNameMore: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            const arr = value.split(',')
            const obj = arr.find(i => {
              const reg = /^[a-zA-Z\d]{6,10}$/
              if (!reg.test(i)) {
                callback(lang('会员账号为6~10位数字、字母或组合'))
                return true
              }
            })
            if (!obj) callback()
          },
          trigger: 'blur'
        }
      ],
      newAccountName: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        {
          pattern: /^[a-zA-Z\d]{6,16}$/,
          message: lang("会员账号为6~16位数字、字母或组合")
        }
      ],
      password: [
        { required: true, message: lang("不能为空"), trigger: "blur" },
        { pattern: /^[a-zA-Z\d]{6,18}$/, message: lang("6-18位数字/字母") }
      ],
      name: [
        { required: true, message: lang("请输入真实姓名"), trigger: "blur" },
        {
          pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,30}$|^[A-Za-z]{1}[ A-Za-z]{1,29}$/,
          message: lang("请输入正确的真实姓名（中文或英文）")
        }
      ],
      nameNoNeed: [
        { message: lang("请输入真实姓名"), trigger: "blur" }
        // {pattern: /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,15}$/, message: '请输入中文姓名'}
      ],
      mobile: [
        { required: true, message: lang("请输入手机号"), trigger: "blur" },
        {
          pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
          message: lang("请输入正确的电话号码")
        }
      ],
      taiWanMobile: [
        { required: true, message: lang("请输入手机号"), trigger: "blur" },
        {
          pattern: /09\d{8}$/,
          message: lang("请输入正确的电话号码")
        }
      ],
      mobileNoNeed: [
        { message: lang("请输入手机号"), trigger: "blur" },
        {
          pattern: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
          message: lang("请输入正确的电话号码")
        }
      ],
      telExtNo: [
        { message: lang("请输入分机号"), trigger: "blur" },
        { pattern: /^[0-9]{4,8}$/, message: lang("请输入正确的分机号") } //4到8位
      ],
      email: [
        { message: lang("请输入邮箱"), trigger: "blur" },
        {
          max: 30,
          pattern: /^[\\*\w]+@([a-zA-Z0-9-]+.){1,2}(com|cn|org|gov.cn|net|edu.cn)$/,
          message: lang("请输入正确的邮箱")
        }
        // {max: 30, pattern: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/, message: '请输入正确的邮箱'}
      ],
      emailNeed: [
        { required: true, message: lang("请输入邮箱"), trigger: "blur" },
        {
          max: 30,
          pattern: /^[\\*\w]+@([a-zA-Z0-9-]+.){1,2}(com|cn|org|gov.cn|net|edu.cn)$/,
          message: lang("请输入正确的邮箱")
        }
        // {max: 30, pattern: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/, message: '请输入正确的邮箱'}
      ],
      qq: [
        { message: lang("请输入QQ号"), trigger: "blur" },
        {
          pattern: /^[1-9][0-9]{4,14}$/,
          message: lang("请输入正确的QQ号码"),
          trigger: "blur"
        }
      ],
      wechat: [
        { message: lang("请输入微信号"), trigger: "blur" },
        { pattern: /^[a-zA-Z\d_]{5,20}$/, message: lang("微信号长度在5到20个字符") } // form-item源码只有blur一种验证方式
      ]
    },
    rebateRatioReg: [
      { required: true, message: lang("返利比例不能为空") },
      {
        pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        message: lang("请输入至多两位小数的数值"),
        trigger: "blur"
      }
    ]
  },
  toggleToDomain: 'https://cn.etherscan.com/tx/',
  toggleTotTrc: "https://tronscan.org/#/transaction/",
  formatTime,
  getCurrentWeek,
  getPreviousWeek,
  getToday,
  getYesterday,
  getBeforeYesterday,
  getSevendayAgo,
  getCurrentMonth,
  getLastMonth,
  getPreviousMonth,
  getPreviousThreeMonth,
  getPreviousSixMonth,
  getPreviousYear,
  getNextYear,
  toThousands,
  getSubCurNowTime,
  getTime,
  getNowTime,
  getHourMinuteSecond,
  numFilter,
  timeFilter,
  transferToBoolean,
  transferTimeByType,
  getDateDiff,
  filterArr,
  saveTwoNumber,
  getStatusArr,
  spliceStr,
  returnStatus,
  unique,
  saveYmd,
  getIntergite,
  deleteBlank,
  matchSixTen
};
