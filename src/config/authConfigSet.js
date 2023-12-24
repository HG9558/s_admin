  
import { lang as $t } from '@/config/config'

/* 会员列表 列权限 */
var memberList = {
  otherAll: {
    name: {
      label: $t("最新备注"),
      ok: false,
      key: "memberNewRemarkKey"
    },
    nameTrue: {
      label: $t("游戏管理"),
      ok: false,
      key: "memberGameManageKey"
    },
    memLi: {
      label: $t("登录日志"),
      ok: false,
      key: "loginLog"
    },

    ph: {
      label: $t("会员日志"),
      ok: false,
      key: "memberLogKey"
    },
    email: {
      label: $t("资金流水"),
      ok: false,
      key: "capitalBill"
    },
    reAdd: {
      label: $t("转账记录"),
      ok: false,
      key: "transferRecord"
    },
    reOri: {
      label: $t("存款记录"),
      ok: false,
      key: "depositRecord"
    },
    local: {
      label: $t("提款记录"),
      ok: false,
      key: "withdrawRecord"
    },
    allDe: {
      label: $t("红利记录"),
      ok: false,
      key: "bonusRecord"
    },
    chDe: {
      label: $t("资料变更"),
      ok: false,
      key: "informationChange"
    },
    one: {
      label: $t("发送站内信"),
      ok: false,
      key: "memberSendMessageKey"
    },
    two: {
      label: $t("人工增加调整"),
      ok: false,
      key: "memberManualAddKey"
    },
    three: {
      label: $t("人工减少调整"),
      ok: false,
      key: "memberManualReduceKey"
    },
    four: {
      label: $t("重置登录密码"),
      ok: false,
      key: "memberResetLoginPwdKey"
    },
    five: {
      label: $t("重置提款密码"),
      ok: false,
      key: "memberResetWithdrawPwdKey"
    },
    six: {
      label: $t("验证信息"),
      ok: false,
      key: "chkUserInfo"
    },
    task: {
      label: $t("红利记录"),
      ok: false,
      key: "taskRecord"
    },
  },
  hyzl: {
    nickName:{
      label: $t("昵称"),
      ok: false,
      key: "nickNameKey"
    },
    dSex:{
      label: $t("性别"),
      ok: false,
      key: "genderKey"
    },
    dBirthday:{
      label: $t("出生日期"),
      ok: false,
      key: "birthdayKey"
    },
    sexEdit: {
      label: $t("性别"),
      ok: true,
      key: "genderModifyKey",
      meta: true
    },
    birthdayEdit: {
      label: $t("出生日期"),
      ok: true,
      key: "birthdayModifyKey",
      meta: true
    },
    big: {
      label: $t("基本资料"),
      ok: false,
      key: "memberDataKey"
    },
    name: {
      label: $t("用户名"),
      ok: false,
      key: "loginNameKey"
    },
    nameTrue: {
      label: $t("银行卡及钱包"),
      ok: false,
      key: "bankCardKey"
    },
    reAdd: {
      label: $t("姓名"),
      ok: false,
      key: "realNameKey"
    },
    chDe: {
      label: $t("电话"),
      ok: false,
      key: "mobileKey"
    },
    memLi: {
      label: $t("微信"),
      ok: false,
      key: "weChatKey"
    },
    ph: {
      label: "QQ",
      ok: false,
      key: "qqKey"
    },
    reOri: {
      label: $t("邮箱"),
      ok: false,
      key: "emailKey"
    },
    email: {
      label: $t("注册网址"),
      ok: false,
      key: "registerUrlKey"
    },

    local: {
      label: $t("注册时间"),
      ok: false,
      key: "registerTimeKey"
    },
    allDe: {
      label: $t("最后登录时间"),
      ok: false,
      key: "loginTimeKey"
    },
    lastOn: {
      label: $t("最后在线时间"),
      ok: true,
      key: "offLineTime"
    },
    status: {
      label: $t("注册IP"),
      ok: false,
      key: "registerIpKey"
    },
    onliMem: {
      label: $t("最后登录IP"),
      ok: false,
      key: "loginIpKey"
    },
    qqEdit: {
      label: $t("最后登录IP"),
      ok: true,
      key: "qqModifyKey",
      meta: true
    },
    nameEdit: {
      label: $t("最后登录IP"),
      ok: true,
      key: "realNameModifyKey",
      meta: true
    },
    emailEdit: {
      label: $t("最后登录IP"),
      ok: true,
      key: "emailModifyKey",
      meta: true
    },
    telEdit: {
      label: $t("最后登录IP"),
      ok: true,
      key: "mobileModifyKey",
      meta: true
    },
    wxEdit: {
      label: $t("最后登录IP"),
      ok: true,
      key: "wechatModifyKey",
      meta: true
    },
    promotionUrl: {
      label: $t("推广链接"),
      ok: false,
      key: "promotionUrlKey"
    },
    promotionNum: {
      label: $t("推荐人数"),
      ok: false,
      key: "promotionNumKey"
    },
    referrer: {
      label: $t("推荐人"),
      ok: false,
      key: "referrerKey"
    },
    isOnline: {
      label: $t("是否在线"),
      ok: false,
      key: "isOnlineKey"
    },
    agyflag: {
      label: $t("权限身份"),
      ok: false,
      key: "agyFlagKey"
    }
  },
  qtzlNew: {
    big: {
      label: $t("账户资料"),
      ok: false,
      key: "memberOtherDataKey"
    },
    name: {
      label: $t("主账号余额"),
      ok: false,
      key: "totalBalanceKey"
    },
    nameTrue: {
      label: $t("会员组"),
      ok: false,
      key: "groupIdKey"
    },
    actLevelId: {
      label: $t("会员星级"),
      ok: false,
      key: "actLevelId"
    },
    actLevelModify: {
      label: $t("会员星级-编辑"),
      ok: true,
      key: "actLevelModifyKey",
      meta: true
    },
    email: {
      label: $t("状态"),
      ok: false,
      key: "availableKey"
    },
    reAdd: {
      label: $t("总代"),
      ok: false,
      key: "tagencyIdKey"
    },
    reOri: {
      label: $t("代理"),
      ok: false,
      key: "cagencyIdKey"
    },
    oneEdit: {
      label: "最后登录IP",
      ok: true,
      key: "groupIdModifyKey",
      meta: true
    },
    twoEdit: {
      label: "最后登录IP",
      ok: true,
      key: "availableModifyKey",
      meta: true
    },
    threeEdit: {
      label: "最后登录IP",
      ok: true,
      key: "tagencyIdModifyKey",
      meta: false
    },
    fourEdit: {
      label: "最后登录IP",
      ok: true,
      key: "cagencyIdModifyKey",
      meta: false
    },
    referrer: {
      label: $t("推荐人"),
      ok: false,
      key: "referrerKey"
    }
  },
  fksh: {
    labelid: {
      label: $t("会员标签"),
      ok: false,
      key: "labelidKey",
      controlMatch: "labelid"
    },
    big: {
      label: $t("风控审核"),
      ok: false,
      key: "memberRiskValidateKey"
    },
    local: {
      label: $t("同注册IP"),
      ok: false,
      key: "tRegisterIpKey",
      controlMatch: "registerIp"
    },
    chDe: {
      label: $t("同一代理"),
      ok: false,
      key: "tAgentKey",
      controlMatch: "agent"
    },
    status: {
      label: $t("同QQ"),
      ok: false,
      key: "tQqKey",
      controlMatch: "qq"
    },
    realName: {
      label: $t("同姓名"),
      ok: false,
      key: "tSameRealNameKey",
      controlMatch: "sameRealName"
    },
    allDe: {
      label: $t("同登录IP"),
      ok: false,
      key: "tLoginIpKey",
      controlMatch: "loginIp"
    },
    memLi: {
      label: $t("同邮箱"),
      ok: false,
      key: "tEmailKey",
      controlMatch: "email"
    },
    device: {
      label: $t("同设备"),
      ok: false,
      key: "tDeviceUuidKey",
      controlMatch: "deviceUuid"
    },
    agyLevelId: {
      label: $t("代理会员级别"),
      ok: false,
      key: "agyLevelIdKey",
      controlMatch: "agyLevelId"
    }
  },
  zcxx: {
    big: {
      label: $t("资产信息"),
      ok: false,
      key: "memberAssetInfoKey"
    },
    name: {
      label: $t("线上入款次数"),
      ok: false,
      key: "onlinedepositNumKey"
    },
    nameTrue: {
      label: $t("公司入款金额"),
      ok: false,
      key: "offlinedepositAmountsKey"
    },
    ph: {
      label: $t("红利次数"),
      ok: false,
      key: "bonusNumKey"
    },
    email: {
      label: $t("调整金额"),
      ok: false,
      key: "amountsKey"
    },
    reAdd: {
      label: $t("总派彩"),
      ok: false,
      key: "payoutKey"
    },
    reOri: {
      label: $t("线上入款金额"),
      ok: false,
      key: "onlinedepositAmountsKey"
    },
    local: {
      label: $t("提款次数"),
      ok: false,
      key: "withDrawNumKey"
    },
    allDe: {
      label: $t("红利金额"),
      ok: false,
      key: "bonusAmountsKey"
    },
    chDe: {
      label: $t("总投注额"),
      ok: false,
      key: "betKey"
    },
    memLi: {
      label: $t("即时稽核"),
      ok: false,
      key: "actualAuditKey"
    },
    status: {
      label: $t("公司入款次数"),
      ok: false,
      key: "offlinedepositNumKey"
    },
    status3: {
      label: $t("提款总额"),
      ok: false,
      key: "withdrawdrawingAmountsKey"
    },
    status4: {
      label: $t("人工调整次数"),
      ok: false,
      key: "adjustNumKey"
    },
    status5: {
      label: $t("有效投注额"),
      ok: false,
      key: "validBetKey"
    },
    batn: {
      label: $t("任务返利次数"),
      ok: false,
      key: "bonusAmountNumKey"
    },
    bat: {
      label: $t("任务返利金额"),
      ok: false,
      key: "bonusAmountTotalKey"
    },
    recommend: {
      label: $t('推荐好友'),
      ok: true,
      key: 'friendsNumKey',
    },
    income: {
      label: $t('好友返利'),
      ok: true,
      key: 'friendsRewardKey'
    },
  }
};

export default {
  memberList
};
