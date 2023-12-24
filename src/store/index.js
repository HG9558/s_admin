/**
 * Created by Administrator on 2017/11/24.
 */
import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";
import axios from '@/config/ajax';
import { lang } from "../i18n";

Vue.use(Vuex);

const state = {
  permissions: JSON.parse(sessionStorage.getItem("permissions")) || [],
  treeData: "",
  indexActive: "1",
  isCollapse: false,
  titleArr: [],
  user: {},
  token: localStorage.getItem("token"),
  // 路由里面会重置 pagination的参数
  listReq: {
    pageSize: 10,
    pageNo: 1,
    pageSizeArr: [1, 5, 10, 20, 50, 100, 200]
  },
  listReqInner: {
    pageSize: 10,
    pageNo: 1,
    pageSizeArr: [1, 5, 10, 20, 50, 100, 200]
  },
  actModelOneShow: true,
  actModelTwoShow: false,
  actModelThreeShow: 0,
  categoryOptions: [],
  siteTitle: "",
  timeType: localStorage.getItem('timeType') || "bj", // 时区
  timeZone: Number(localStorage.getItem('timeZone')) || 0,
  searchLoading: true, // 请求数据的loading
  fullscreenLoading: false,
  logoPath: "",
  badNetNum: 2,
  timeout: "",
  visitedViews: JSON.parse(localStorage.getItem("visitedViews")) || [],
  cachedViews: [],
  resetPassShow: false,
  changePassShow: false,
  changePassFlag: "",
  passChangeObj: {
    userId: null,
    operationTitle: "",
    operationFlag: "",
    closeVisiable: true
  },
  isRefresh: 0,
  buttonDisable: false,
  crPayLeft: [],
  crPayRight: [],
  depositBankcardListLeft: [[]],
  depositBankcardListRight: [],
  qrCodesLeft: [],
  qrCodesRight: [],
  depositAutoLeft: [],
  depositAutoRight: [],
  onlineFirstListLeft: [],
  onlineFirstListRight: [],
  onlineSecondListLeft: [],
  onlineSecondListRight: [],
  onlineThirdListLeft: [],
  onlineThirdListRight: [],
  onlineFouthListLeft: [],
  onlineFouthListRight: [],
  onlineFifthListLeft: [],
  onlineFifthListRight: [],
  onlineSixthListLeft: [],
  onlineSixthListRight: [],
  onlineSeventhListLeft: [],
  onlineSeventhListRight: [],
  onlineEighthListLeft: [],
  onlineEighthListRight: [],
  onlineNineListLeft: [],
  onlineNineListRight: [],
  onlineTenListLeft: [],
  onlineTenListRight: [],
  onlineElevenListLeft: [],
  onlineElevenListRight: [],
  // 缓存组件keyValue
  compKeyValue: {},
  sanGongFlg: "",
  // 安全密码输入框
  safePasswordShow: false,
  safePassword: "",
  safePasswordCallbackPageBegin:"",
  safePasswordCallbackPageEnd:""
};

const getters = {
  hasPermission({ permissions }) {
    return perm => permissions.indexOf(perm) !== -1;
  },
  visitedViews: state => state.visitedViews,
  cachedViews: state => state.cachedViews,
  getTreeData: state => state.treeData,
  getSanGongFlag: state => data => {
    state[data] = localStorage.getItem(data);
    return Number(state[data]);
  }
};
const actions = {
  addVisitedViews({ commit }, view) {
    commit("ADD_VISITED_VIEWS", view);
  },
  delVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_VISITED_VIEWS", view);
      resolve([...state.visitedViews]);
    });
  },
  delOthersViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_VIEWS", view);
      resolve([...state.visitedViews]);
    });
  },
  delAllViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_VIEWS");
      resolve([...state.visitedViews]);
    });
  },
  addSanGongFlag({ commit }, view) {
    commit("ADD_SANGONGFLAG_VIEWS", view);
  },
  findAgentByloginName(context, loginName) {
    return axios
      .get('bkapi/agent/account/findAgentByloginName', {
        params: {
          loginName,
        },
      })
      .then(
        ({ data }) => data.data.map(({ agyAccount }) => agyAccount).join('-->')
      )
  }
};

const mutations = {
  ADD_TOKEN: (state, data) => {
    state.token = data;
    window.localStorage.setItem("token", data);
  },
  ADD_SANGONGFLAG_VIEWS: (state, view) => {
    state.sanGongFlg = view;
    window.localStorage.setItem("sanGongFlg", view);
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
    window.sessionStorage.setItem("permissions", JSON.stringify(permissions));
  },
  [types.PAGESIZECHANGE](state, data) {
    state.listReq.pageSize = data;
  },
  [types.TREEDATA](state, data) {
    state.treeData = data;
  },
  [types.CHANGEPASSWORDSHOW](state, data) {
    state.changePassShow = data;
  },
  [types.CHANGEPASSWORDFLAG](state, data) {
    state.changePassFlag = data;
  },
  [types.PASSCHANGEOBJ](state, data) {
    state.passChangeObj = data;
  },
  [types.INDEXACTIVE](state, data) {
    state.indexActive = data;
  },
  [types.TITLEARR](state, data) {
    state.titleArr = data;
  },
  [types.ISCOLLAPSE](state, data) {
    state.isCollapse = data;
  },
  [types.SETUSER](state, user) {
    state.user = user;
  },
  [types.ACTMODELONESHOW](state, data) {
    state.actModelOneShow = data;
  },
  [types.ACTMODELTWOSHOW](state, data) {
    state.actModelTwoShow = data;
  },
  [types.ACTMODELTHREESHOW](state, data) {
    state.actModelThreeShow = data;
  },
  [types.CATEGORYOPTIONS](state, data) {
    state.categoryOptions = data;
  },
  [types.SITETITLE](state, data) {
    state.siteTitle = data;
  },
  [types.TIMETYPE](state, data) {
    localStorage.setItem('timeType', data)
    state.timeType = data;
  },
  [types.TIMEZONE](state, data) {
    localStorage.setItem('timeZone', data)
    state.timeZone = data;
  },
  [types.LOGOPATH](state, data) {
    state.logoPath = data;
  },
  [types.CLEARTIME](state, data) {
    state.timeout = data;
  },
  [types.RESETPAGE](state, data) {
    state.listReq = data;
    state.listReqInner = data;
  },
  [types.UPDATECRPAYLEFT](state, data) {
    state.crPayLeft = data;
  },
  [types.UPDATEDEPOSITBANKCARDLISTLEFT](state, data) {
    state.depositBankcardListLeft = data.filter(
      (ele, index, arr) => ele.length > 0 || index === arr.length - 1
    );
  },
  [types.ONLINEFIRSTLISTLEFT](state, data) {
    state.onlineFirstListLeft = data;
  },
  [types.ONLINESECONDLISTLEFT](state, data) {
    state.onlineSecondListLeft = data;
  },
  [types.ONLINETHIRDLISTLEFT](state, data) {
    state.onlineThirdListLeft = data;
  },
  [types.ONLINEFOUTHLISTLEFT](state, data) {
    state.onlineFouthListLeft = data;
  },
  [types.ONLINEFIFTHLISTLEFT](state, data) {
    state.onlineFifthListLeft = data;
  },
  [types.ONLINESIXTHLISTLEFT](state, data) {
    state.onlineSixthListLeft = data;
  },
  [types.ONLINESEVENLISTLEFT](state, data) {
    state.onlineSeventhListLeft = data;
  },
  [types.ONLINEEIGHTHLISTLEFT](state, data) {
    state.onlineEighthListLeft = data;
  },
  [types.ONLINENINELISTLEFT](state, data) {
    state.onlineNineListLeft = data;
  },
  [types.ONLINETENLISTLEFT](state, data) {
    state.onlineTenListLeft = data;
  },
  [types.ONLINEELEVENLISTLEFT](state, data) {
    state.onlineElevenListLeft = data;
  },
  [types.UPDATEDEPOSITAUTORIGHT](state, data) {
    state.depositAutoRight = data;
  },
  [types.UPDATEQRCODESRIGHT](state, data) {
    state.qrCodesRight = data;
  },
  [types.UPDATEDEPOSITAUTOLEFT](state, data) {
    state.depositAutoLeft = data;
  },
  [types.UPDATEQRCODESLEFT](state, data) {
    state.qrCodesLeft = data;
  },
  [types.UPDATECRPAYRIGHT](state, data) {
    state.crPayRight = data;
  },
  [types.UPDATEDEPOSITBANKCARDLISTRIGHT](state, data) {
    state.depositBankcardListRight = data;
  },
  [types.ONLINEFIRSTLISTRIGHT](state, data) {
    state.onlineFirstListRight = data;
  },
  [types.ONLINESECONDLISTRIGHT](state, data) {
    state.onlineSecondListRight = data;
  },
  [types.ONLINETHIRDLISTRIGHT](state, data) {
    state.onlineThirdListRight = data;
  },
  [types.ONLINEFOUTHLISTRIGHT](state, data) {
    state.onlineFouthListRight = data;
  },
  [types.ONLINEFIFTHLISTRIGHT](state, data) {
    state.onlineFifthListRight = data;
  },
  [types.ONLINESIXTHLISTRIGHT](state, data) {
    state.onlineSixthListRight = data;
  },
  [types.ONLINESEVENTHLISTRIGHT](state, data) {
    state.onlineSeventhListRight = data;
  },
  [types.ONLINEEIGHTHLISTRIGHT](state, data) {
    state.onlineEighthListRight = data;
  },
  [types.ONLINENINELISTRIGHT](state, data) {
    state.onlineNineListRight = data;
  },
  [types.ONLINETENLISTRIGHT](state, data) {
    state.onlineTenListRight = data;
  },
  [types.ONLINEELEVENLISTRIGHT](state, data) {
    state.onlineElevenListRight = data;
  },
  [types.SAFEPASSWORDSHOW](state, data) {
    state.safePasswordShow = data;
  },
  [types.SAFEPASSWORD](state, data) {
    state.safePassword = data;
  },
  [types.SAFEPASSWORDCALLBACKPAGEBEGIN](state, data) {
    state.safePasswordCallbackPageBegin = data;
  },
  [types.SAFEPASSWORDCALLBACKPAGEEND](state, data) {
    state.safePasswordCallbackPageEnd = data;
  },
  ADD_VISITED_VIEWS_O: (state, view) => {
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      title: view.title
    });
  },

  ADD_VISITED_VIEWS: (state, view) => {
    state.isRefresh++;
      if (view.name === "欢迎页" && !view.handleOpreta) return
    if (view.name === "会员详情") return;
    // if (view.name === "管理总览" && !view.handleOpreta) return;
    if (view.name === "角色权限新增") return;
    if (view.name === "返利列表详情") return;
    if (view.name === "活动规则表单") return;
    if (view.name === "契约管理详情") return;
    if (view.name === "活动介绍表单") return;
    if (view.name === "返水明细") return;
    if (view.name === "优惠发放明细") return;
    if (view.name === "活动规则返水表单") return;
    if (view.name === "任务中心表单") return;
    if (view.name === "任务中心统计表单") return;
    let tempStr = view.path;
    if (tempStr.slice(-1) === "/") {
      tempStr = tempStr.slice(0, tempStr.length - 1);
    }
    const oldView = state.visitedViews.find(v => v.path === tempStr);
    if (oldView ) {
      oldView.query = view.query;
    } else {
      // 有管理总览导航则展示管理总览，没有则展示欢迎页
      // const mananeObjIndex = state.visitedViews.findIndex(item => item.name === '管理总览')
      const welObjIndex = state.visitedViews.findIndex(item => item.name === '欢迎页')
      // if (mananeObjIndex !== -1) {
      //   state.visitedViews.splice(mananeObjIndex, 1)
      // }
      if (welObjIndex !== -1) {
        state.visitedViews.splice(welObjIndex, 1)
      }
      const obj = {
        name: view.name,
        path: tempStr,
        title: view.meta.title || "no-name",
        query: view.query
      }
      if (view.name === '管理总览' || view.name === '欢迎页') {
        state.visitedViews.unshift(obj);
      } else {
        state.visitedViews.push(obj);
      }
    }
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name);
    }
    // 保存到localstorage
    let arr = [].concat(state.visitedViews);
    window.localStorage.setItem("visitedViews", JSON.stringify(arr));
  },
  DEL_VISITED_VIEWS: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i);
        state.cachedViews.splice(index, 1);
        break;
      }
    }
    window.localStorage.setItem(
      "visitedViews",
      JSON.stringify(state.visitedViews)
    );
  },
  DEL_OTHERS_VIEWS: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews = state.visitedViews.slice(i, i + 1);
        break;
      }
    }
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i);
        state.cachedViews = state.cachedViews.slice(index, i + 1);
        break;
      }
    }
  },
  DEL_ALL_VIEWS: state => {
    state.visitedViews = [];
    state.cachedViews = [];
  },
  SET_COMP_KEYVALUE: (state, routeName) => {
    if (!state.compKeyValue[routeName]) {
      state.compKeyValue[routeName] = Date.now();
    }
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
