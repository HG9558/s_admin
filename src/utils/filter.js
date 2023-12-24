// 不用var a =new Date()是因为safari兼容性  a.getTime()得到的值不一样
import Vue from 'vue'
import { lang } from "../i18n";

Vue.filter("formatdate", function(unixTimestamp, timeType) {
  if (!unixTimestamp) return "";
  switch (timeType) {
    case "md":
      unixTimestamp = unixTimestamp - 12 * 3600 * 1000;
      break;
    case "bj":
      unixTimestamp = unixTimestamp;
      break;
    case "yn":
      unixTimestamp = unixTimestamp - 3600 * 1000;
      break;
  }
  let date = new Date(unixTimestamp);
  var year = date.getFullYear();
  const zeroFn = num => num < 10 ? `0${num}` : num
  var month = zeroFn(date.getMonth() + 1)
  var day = zeroFn(date.getDate());
  var hours = zeroFn(date.getHours());
  var minutes = zeroFn(date.getMinutes());
  var seconds = zeroFn(date.getSeconds());
  var week = date.getDay();
  const weekObj = {
    0: lang('周日'),
    1: lang('周一'),
    2: lang('周二'),
    3: lang('周三'),
    4: lang('周四'),
    5: lang('周五'),
    6: lang('周六'),
  }
  week = weekObj[week] || lang('系统错误')
  return `${year}/${month}/${day} ${week} ${hours}:${minutes}:${seconds}`
});
