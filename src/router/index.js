import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { lang } from "../i18n"

const Login = () =>
  import( /* webpackChunkName: 'login' */ '../components/Login.vue')
const Main = () =>
  import( /* webpackChunkName: 'main' */ '../pages/Layout.vue')
const NotFound = () =>
  import( /* webpackChunkName: 'nofound' */ '../pages/404.vue')



/*----------------------------------------------已经抽象----------------------------------------------------*/
const MemberLevel = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/member_level/List'
  )
const AgentManageAgenApply = () =>
  import('../pages/agent_manage/agent_apply/Index')
const AgentManageContract = () =>
  import('../pages/agent_manage/agent_contract_manage/Index')
const contractManageAddorEdit = () =>
  import('../pages/agent_manage/agent_contract_manage/AddOrDetail')
const AgentManageAgentList = () =>
  import('../pages/agent_manage/agent_list/Index')
const AgentManageAgentWithdrawal = () =>
  import('../pages/agent_manage/agent_withdrawal/Index')
const AgentManageAgentDomain = () =>
  import('../pages/agent_manage/agent_domain/List')
const AgentComprehensiveSheet = () =>
  import('../pages/agent_manage/agentComprehensiveSheet/List')
const AgentMasterList = () =>
  import('../pages/agent_manage/agent_master_list/Index')

const FriendTransfer = () =>
  import('../pages/wage_manage/friend_transfer/Index')
const TransformSheet = () =>
  import('../pages/wage_manage/TransformSheet.vue')

// 素材管理
const MaterialsManage = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/agent_manage/materials_manage/Index'
  )

// 运营管理
const OnlinePay = () =>
  import(
    /* webpackChunkName: 'yy' */
    '../pages/operate_manage/OnlinePay.vue'
  )
const PayList = () =>
  import(
    /* webpackChunkName: 'yy' */
    '../pages/operate_manage/PayList.vue'
  )

const lineStatistics = () =>
  import('../pages/operate_manage/lineStatistics.vue')

const TotalNumStatistics = () =>
  import('../pages/operate_manage/TotalNumStatistics')

const RateStatistics = () =>
  import('../pages/operate_manage/RateStatistics')

const RebateList = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/rebate_list/NewIndex'
  )

const RebateDetailFriendList = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/market_activity/rebatet_detail_friend_list'
  )

const RebateDetail = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/rebate_list/Detail'
  )
const MessageBoard = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/message_board/Index'
  )
const MemberMessage = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/member_message/Index'
  )

// 市场活动
const ActivityRule = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/activity_rule/List'
  )
const ActivityRuleForm = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/activity_rule/Form'
  )
const ActivityWaterRuleForm = () =>
  import(
    '../pages/market_activity/activity_rule/water_rebate_forms/waterForm'
  )
const CallFriendsFrom = () =>
  import(
    '../pages/market_activity/activity_rule/callfriend_forms/callFriends'
  )
const RecommendList = () =>
  import(
    '../pages/market_activity/activity_rule/recommend_list/List'
  )
const IncomeList = () =>
  import(
    '../pages/market_activity/activity_rule/income_list/List'
  )
// const IncomeList = () => {
//   import(
//     '../pages/market_activity/activity_rule/income_list/List'
//   )
// }
const ActivityIntroduction = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/activity_introduction/List'
  )
const ActivityIntroductionForm = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/activity_introduction/Form'
  )
const taskCenter = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/task_center/List'
  )
const taskCenterForm = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/task_center/Form'
  )
const ActivityCategory = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/activity_category/List'
  )
const WaterRebateList = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/water_rebate_list/List'
  )
const WaterRebateDetail = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/water_rebate_list/Detail'
  )
const BonusList = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/bonus_list/List'
  )
const BonusListDetail = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/bonus_list/Detail'
  )
const promoCode = () =>
  import(
    /* webpackChunkName: 'active' */
    '../pages/market_activity/promoCode'
  )

// 经营分析

const LoseWinSheet = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/LoseWinSheet.vue'
  )

const ServiceSetting = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_basic/ServiceSetting.vue'
  )
const MessageTemplate = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_basic/MessageTemplate.vue'
  )

const OperationLog = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_log/operation_log/List'
  )
const RoleAuthAdd = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_auth/RoleAuthAdd'
  )
const WithdrawClock = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/wage_manage/DepositLock'
  )
const WithdrawClockDetail = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/wage_manage/DepositLockDetail'
  )
const DailyRetainSheet = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/wage_manage/DailyRetainSheet'
  )
const WarningList = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_basic/Warning'
  )
const MemberTag = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/member_manage/MemberTag'
  )
const RetentionRateSheet = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/wage_manage/RetentionRateSheet'
  )

const MbrMoneySheet = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/operate_analyze/MbrMoneySheet'
    )

const AgentDailySheet = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/operate_analyze/AgentDailySheet'
    )

const AgentSheet = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/operate_analyze/AgentSheet'
    )

const Mbrlog = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/operate_analyze/Mbrlog'
    )

// 资金管理
const AgentCommissionCheck = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/agent_content/agent_commission_check')
const AgentCommissionGrant = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/agent_content/agent_commission_grant')
const AgentDeposit = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/agent_content/AgentDeposit')
const AgentWithdrow = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/agent_content/AgentWithdrow')
const CapitalAdjust = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/CapitalAdjust')
const Transfer = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/Transfer')
const SuperiorRebate = () => import( /* webpackChunkName: 'wage_manage' */ '../pages/wage_manage/SuperiorRebate')

// 代理列表
const AgentTopUp = () => import( /* webpackChunkName: 'agent_statement' */ '../pages/wage_manage/agentStatement/AgentTopUp')
const CommissionStatement = () => import( /* webpackChunkName: 'agent_statement' */ '../pages/wage_manage/agentStatement/CommissionStatement')
const ChannelList = () => import( /* webpackChunkName: 'ChannelList' */ '../pages/wage_manage/change_list/ChannelList')
const ChannelGroup = () => import( /* webpackChunkName: 'ChannelGroup' */ '../pages/wage_manage/change_list/Group')
// /main/wageManage/agentManage/platformFeeStatement
const PlatformFeeStatement = () => import( /* webpackChunkName: 'platformFeeStatement' */ '../pages/wage_manage/agentStatement/PlatformFeeStatement')
const ServiceCharge = () => import( /* webpackChunkName: 'serviceCharge' */ '../pages/wage_manage/agentStatement/ServiceCharge')
const AgentCheckFlowingWater = () => import( /* webpackChunkName: 'agent_statement' */ '../pages/wage_manage/agentStatement/AgentCheckFlowingWater')

// 呼朋唤友
const CallFriends = () => import( /* webpackChunkName: 'call_friends' */ '../pages/call_friend/Index')

/*----------------------------------------------已经抽象----------------------------------------------------*/






/*----------------------- 未抽象的页面------------------------*/

const VipPay = () => import('../pages/wage_manage/vipPay')
const AdjustSheet = () => import('../pages/wage_manage/AdjustSheet.vue')

const PayAllocation = () =>
  import(
    /* webpackChunkName: 'yy' */
    '../pages/operate_manage/PayAllocation.vue'
  )
const WithdrawManage = () =>
  import(
    /* webpackChunkName: 'yy' */
    '../pages/operate_manage/WithdrawManage.vue'
  )
const GameList = () =>
  import(
    /* webpackChunkName: 'yy' */
    '../pages/operate_manage/GameList.vue'
  )
const GameCategory = () =>
  import(
    /* webpackChunkName: 'GameCategory' */
    '../pages/operate_manage/game_category/Index.vue'
  )

const AdManage = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/AdManage.vue'
  )

const GuessAskList = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/GuessAskList.vue'
  )
const helpManage = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/HelpManage.vue'
  )

const NoticeMessage = () =>
  import(
    /* webpackChunkName: 'sheet' */
    '../pages/operate_manage/NoticeMessage.vue'
  )

// 会员管理
const MemberList = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/MemberList.vue'
  )
const AgentLevel = () =>
  import(
    /* webpackChunkName: 'AgentLevel' */
    '../pages/member_manage/AgentLevel'
  )
const MemberGroup = () =>
  import(
    /* rebateListwebpackChunkName: 'member' */
    '../pages/member_manage/MemberGroup.vue'
  )
const OnlineMember = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/OnlineMember.vue'
  )
const MemberWarning = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/MemberWarning.vue'
  )
const MemberWind = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/MemberWind.vue'
  )
const Memolist = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/Memolist.vue'
  )
const MemberDetail = () =>
  import(
    /* webpackChunkName: 'member' */
    '../pages/member_manage/MemberDetail.vue'
  )

const managePandect = () =>
  import(
    /* webpackChunkName: 'mainCenter' */
    '../pages/mainCenter.vue'
  )
const WelcomePage = () =>
  import(
    /* webpackChunkName: 'mainCenter' */
    '../pages/welcomePage.vue'
  )
// 资金管理
const MemberWithdraw = () =>
  import('../pages/wage_manage/MemberWithdraw.vue')

const RoleAuth = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_auth/RoleAuth.vue'
  )
const MemberManage = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_auth/MemberManage.vue'
  )
const RoleList = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_auth/Rolelist.vue'
  )

const SystemSetting = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_basic/SystemSetting.vue'
  )
const ProxySetting = () =>
  import(
    /* webpackChunkName: 'three' */
    '../pages/system_manage_basic/ProxySetting.vue'
  )

const GameDataSheet = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/GameDataSheet.vue'
  )
const MoneySheet = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/MoneySheet.vue'
  )
const BetRecord = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/BetRecord.vue'
  )
const BalanceRecord = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/BalanceRecord.vue'
  )

const CheckSheet = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/CheckSheet'
  )
const Smslog = () =>
  import(
    /* webpackChunkName: 'Smslog' */
    '../pages/operate_analyze/Smslog'
  )
const DividendSheet = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/operate_analyze/DividendSheet.vue'
  )

const InfoSetting = () =>
  import(
    /* webpackChunkName: 'two' */
    '../pages/system_manage_basic/InfoSetting.vue'
    )
/*----------------------- 未抽象的页面------------------------*/

Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/main',
      meta: {
        requiresAuth: true
      },
      component: Main,
      children: [
        {
          path: '/main/welcomePage',
          name: '欢迎页',
          component: WelcomePage,
          meta: {
            title: '欢迎页',
            noCache: true,
            i18n: lang('欢迎页')
          }
        },
        {
          path: '/main/managePandect',
          name: '管理总览',
          component: managePandect,
          meta: {
            title: '管理总览',
            noCache: true,
            i18n: lang('管理总览')
          }
        },
        {
          path: 'agentManage/agentApply',
          name: '代理申请',
          component: AgentManageAgenApply,
          meta: {
            title: '代理申请',
            keepAlive: true,
            i18n: lang('代理申请')
          }
        },
        {
          path: 'agentManage/contractManage',
          name: '契约管理',
          component: AgentManageContract,
          meta: {
            title: '契约管理',
            keepAlive: true,
            i18n: lang('契约管理')
          },
        },
        {
          path: 'wageManage/agentManage/agentDeposi',
          name: '代理入款',
          component: AgentDeposit,
          meta: {
            title: '代理入款',
            keepAlive: true,
            i18n: lang('代理入款')
          },
        },
        {
          path: 'wageManage/agentManage/AgentWithdrow',
          name: '代理提款',
          component: AgentWithdrow,
          meta: {
            title: '代理提款',
            keepAlive: true,
            i18n: lang('代理提款')
          },
        },
        {
          path: 'wageManage/capitalAdjust',
          name: '资金调整',
          component: CapitalAdjust,
          meta: {
            title: '资金调整',
            keepAlive: true,
            i18n: lang('资金调整')
          },
        },
        {
          path: 'wageManage/transfer',
          name: '转账特殊名单',
          component: Transfer,
          meta: {
            title: '转账特殊名单',
            keepAlive: true,
            i18n: lang('转账特殊名单')
          },
        },
        {
          path: 'wageManage/agentManage/agentCommissionCheck',
          name: '佣金-风控审核',
          component: AgentCommissionCheck,
          meta: {
            title: '佣金-风控审核',
            keepAlive: true,
            i18n: lang('佣金-风控审核')
          },
        },
        {
          path: 'wageManage/agentManage/agentCommissionGrant',
          name: '佣金-市场二审',
          component: AgentCommissionGrant,
          meta: {
            title: '佣金-市场二审',
            keepAlive: true,
            i18n: lang('佣金-市场二审')
          },
        },
        {
          path: 'wageManage/agentManage/agentCommissionAllSubList',
          name: '上级返佣报表',
          component: SuperiorRebate,
          meta: {
            title: '上级返佣报表',
            keepAlive: true,
            i18n: lang('上级返佣报表')
          },
        },
        {
          path: 'wageManage/agentStatement/AgentTopUp',
          name: '代充记录',
          component: AgentTopUp,
          meta: {
            title: '代充记录',
            keepAlive: true,
            i18n: lang('代充记录')
          },
        },
        {
          path: 'wageManage/agentStatement/commissionStatement',
          name: '佣金报表',
          component: CommissionStatement,
          meta: {
            title: '佣金报表',
            keepAlive: true,
            i18n: lang('佣金报表')
          },
        },
        {
          path: 'wageManage/channel/list',
          name: '渠道列表',
          component: ChannelList,
          meta: {
            title: '渠道列表',
            i18n: lang('渠道列表')
          },
        },
        {
          path: 'wageManage/channel/group',
          name: '渠道分组',
          component: ChannelGroup,
          meta: {
            title: '渠道分组',
            i18n: lang('渠道分组')
          },
        },
        {
          path: 'wageManage/agentManage/platformFeeStatement',
          name: '平台费报表',
          component: PlatformFeeStatement,
          meta: {
            title: '平台费报表',
            keepAlive: true,
            i18n: lang('平台费报表')
          },
        },
        {
          path: 'wageManage/agentManage/serviceCharge',
          name: '服务费报表',
          component: ServiceCharge,
          meta: {
            title: '服务费报表',
            keepAlive: true,
            i18n: lang('服务费报表')
          },
        },
        {
          path: 'wageManage/agentStatement/AgentCheckFlowingWater',
          name: '账变流水',
          component: AgentCheckFlowingWater,
          meta: {
            title: '账变流水',
            keepAlive: true,
            i18n: lang('账变流水')
          },
        },
        {
          path: 'agentManage/contractManage/AddorEdit',
          name: '契约管理详情',
          component: contractManageAddorEdit,
          meta: {
            title: '契约管理详情',
            noCache: true,
            i18n: lang('契约管理详情')
          }
        },
        {
          path: 'agentManage/agentList',
          name: '代理列表',
          component: AgentManageAgentList,
          meta: {
            title: '代理列表',
            keepAlive: true,
            i18n: lang('代理列表')
          }
        },
        {
          path: 'agentManage/agentList',
          redirect: 'agentManage/agentList/List'
        },
        {
          path: 'agentManage/agentWithdrawal',
          name: '代理提款',
          component: AgentManageAgentWithdrawal,
          meta: {
            title: '代理提款',
            keepAlive: true,
            i18n: lang('代理提款')
          }
        },
        {
          path: 'agentManage/agentDomain',
          name: '代理域名',
          component: AgentManageAgentDomain,
          meta: {
            title: '代理域名',
            keepAlive: true,
            i18n: lang('代理域名')
          }
        },
        {
          path: 'agentManage/materialsManage',
          name: '素材管理',
          component: MaterialsManage,
          meta: {
            title: '素材管理',
            keepAlive: true,
            i18n: lang('素材管理')
          }
        },
        {
          path: 'agentManage/agentComprehensiveSheet',
          name: '综合报表',
          component: AgentComprehensiveSheet,
          meta: {
            title: '综合报表',
            keepAlive: true,
            i18n: lang('综合报表')
          }
        },
        {
          path: 'agentManage/agentMemberTotalView',
          name: '代理总览报表',
          component: AgentMasterList,
          meta: {
            title: '代理总览报表',
            keepAlive: true,
            i18n: lang('代理总览报表')
          }
        },
        {
          path: 'memberManage/memberList',
          name: '会员列表',
          component: MemberList,
          meta: {
            title: '会员列表',
            keepAlive: true,
            i18n: lang('会员列表')
          }
        },
        {
          path: 'memberManage/memberGroup',
          name: '会员组',
          component: MemberGroup,
          meta: {
            title: '会员组',
            keepAlive: true,
            i18n: lang('会员组')
          }
        },
        {
          path: 'memberManage/onlineMember',
          name: '在线会员',
          component: OnlineMember,
          meta: {
            title: '在线会员',
            keepAlive: true,
            i18n: lang('在线会员')
          }
        },
        {
          path: 'memberManage/warning',
          name: '会员预警',
          component: MemberWarning,
          meta: {
            title: '会员预警',
            keepAlive: true,
            i18n: lang('会员预警')
          }
        },
        {
          path: 'memberManage/memberDetail',
          name: '会员详情',
          component: MemberDetail,
          meta: {
            title: '会员详情',
            noCache: true,
            i18n: lang('会员详情')
          }
        },
        {
          path: 'memberManage/memberLevel',
          name: '活动等级',
          component: MemberLevel,
          meta: {
            title: '活动等级',
            keepAlive: true,
            i18n: lang('活动等级')
          }
        },
        {
          path: 'memberManage/memberAgentLevel',
          name: '代理会员级别',
          component: AgentLevel,
          meta: {
            title: '代理会员级别',
            keepAlive: true,
            i18n: lang('代理会员级别')
          }
        },
        {
          path: 'memberManage/windList',
          name: '风控信息',
          component: MemberWind,
          meta: {
            title: '风控信息',
            keepAlive: true,
            i18n: lang('风控信息')
          }
        },
        {
          path: 'memberManage/memolist',
          name: '风控查询备注',
          component: Memolist,
          meta: {
            title: '风控查询备注',
            keepAlive: true,
            i18n: lang('风控查询备注')
          }
        },
        {
          path: 'wageManage/memberWithdraw',
          name: '会员提款',
          component: MemberWithdraw,
          meta: {
            title: '会员提款',
            keepAlive: true,
            i18n: lang('会员提款')
          }
        },
        {
          path: 'wageManage/adjustSheet',
          name: '资金调整',
          component: AdjustSheet,
          meta: {
            title: '资金调整',
            keepAlive: true,
            i18n: lang('资金调整')
          }
        },
        {
          path: 'wageManage/friendTransfer',
          name: '好友转帐',
          component: FriendTransfer,
          meta: {
            title: '好友转帐',
            keepAlive: true,
            i18n: lang('好友转账')
          }
        },
        {
          path: 'wageManage/transformSheet',
          name: '户内转账',
          component: TransformSheet,
          meta: {
            title: '户内转账',
            keepAlive: true,
            i18n: lang('户内转账')
          }
        },
        {
          path: 'wageManage/vipPay',
          name: '会员入款',
          component: VipPay,
          meta: {
            title: '会员入款',
            keepAlive: true,
            i18n: lang('会员入款')
          }
        },
        {
          path: 'operateManage/payList',
          name: '支付列表',
          component: PayList,
          meta: {
            title: '支付列表',
            keepAlive: true,
            i18n: lang('支付列表')
          }
        },
        {
          path: 'operateManage/payAllocation',
          name: '支付分配',
          component: PayAllocation,
          meta: {
            title: '支付分配',
            keepAlive: true,
            i18n: lang('支付分配')
          }
        },
        {
          path: 'operateManage/totalNumStatistics',
          name: 'TotalNumStatistics',
          component: TotalNumStatistics,
          meta: {
            title: '笔数统计',
            keepAlive: true,
            i18n: lang('笔数统计')
          }
        },
        {
          path: 'operateManage/rateStatistics',
          name: 'RateStatistics',
          component: RateStatistics,
          meta: {
            title: '比率统计',
            keepAlive: true,
            i18n: lang('比率统计')
          }
        },
        {
          path: 'operateManage/lineStatistics',
          name: '线路统计',
          component: lineStatistics,
          meta: {
            title: '线路统计',
            keepAlive: true,
            i18n: lang('线路统计')
          }
        },
        {
          path: 'operateManage/onlinePay',
          name: '线上支付',
          component: OnlinePay,
          meta: {
            title: '线上支付',
            keepAlive: true,
            i18n: lang('线上支付')
          }
        },
        {
          path: 'operateManage/withdrawManage',
          name: '出款管理',
          component: WithdrawManage,
          meta: {
            title: '出款管理',
            keepAlive: true,
            i18n: lang('出款管理')
          }
        },
        {
          path: 'marketActivity/bonusList',
          name: '红利列表',
          component: BonusList,
          meta: {
            title: '红利列表',
            keepAlive: true,
            i18n: lang('红利列表')
          }
        },
        {
          path: 'marketActivity/bonusList/detail',
          name: '优惠发放明细',
          component: BonusListDetail,
          meta: {
            title: '优惠发放明细',
            i18n: lang('优惠发放明细')
          }
        },
        {
          path: 'marketActivity/promoCode',
          name: '优惠码',
          component: promoCode,
          meta: {
            title: '优惠码',
            i18n: lang('优惠码')
          }
        },
        {
          path: 'marketActivity/promoCodeRecode',
          name: '优惠码',
          component: promoCode,
          meta: {
            title: '优惠码记录',
            i18n: lang('优惠码记录')
          }
        },
        {
          path: 'gameManage/gameList',
          name: '游戏列表',
          component: GameList,
          meta: {
            title: '游戏列表',
            keepAlive: true,
            i18n: lang('游戏列表')
          }
        },
        {
          path: 'gameManage/gameCategory',
          name: '彩票分类',
          component: GameCategory,
          meta: {
            title: '彩票分类',
            keepAlive: true,
            i18n: lang('彩票分类')
          }
        },
        {
          path: 'operate/guessAskList',
          name: '猜你想问',
          component: GuessAskList,
          meta: {
            title: '猜你想问',
            keepAlive: true,
            i18n: lang('猜你想问')
          }
        },
        {
          path: 'operateManage/adManage',
          name: '广告管理',
          component: AdManage,
          meta: {
            title: '广告管理',
            keepAlive: true,
            i18n: lang('广告管理')
          }
        },
        {
          path: 'operateHelp/helpManage',
          name: '帮助中心',
          component: helpManage,
          meta: {
            title: '帮助中心',
            keepAlive: true,
            i18n: lang('帮助中心')
          }
        },
        {
          path: 'operateManage/noticeMessage',
          name: '公告通知',
          component: NoticeMessage,
          meta: {
            title: '公告通知',
            keepAlive: true,
            i18n: lang('公告通知')
          }
        },
        {
          path: 'operateManage/rebateList',
          name: '返利列表',
          component: RebateList,
          meta: {
            title: '返利列表',
            keepAlive: true,
            i18n: lang('返利列表')
          }
        },
        {
          path: 'marketActivity/rebateDetailFriendList',
          name: '好友推荐明细',
          component: RebateDetailFriendList,
          meta: {
            title: '好友推荐明细',
            keepAlive: true,
            i18n: lang('好友推荐明细')
          }
        },
        {
          path: 'operateManage/rebateList/detail',
          name: '返利列表详情',
          component: RebateDetail,
          meta: {
            title: '返利列表详情',
            noCache: true,
            i18n: lang('返利列表详情')
          } // 如果你希望面包屑不记录该路由 在store的ADD_VISITED_VIEWS设置
        },
        {
          path: 'operateManage/messageBoard',
          name: '会员留言',
          component: MessageBoard,
          meta: {
            title: '会员留言',
            keepAlive: true,
            i18n: lang('会员留言')
          }
        },
        {
          path: 'operateManage/memberMessage',
          name: '会员反馈',
          component: MemberMessage,
          meta: {
            title: '会员反馈',
            keepAlive: true,
            i18n: lang('会员反馈')
          }
        },
        {
          path: 'marketActivity/activityRule',
          name: '活动规则',
          component: ActivityRule,
          meta: {
            title: '活动规则',
            keepAlive: true,
            i18n: lang('活动规则')
          }
        },
        {
          path: 'marketActivity/activityRule/form',
          name: '活动规则表单',
          component: ActivityRuleForm,
          meta: {
            title: '活动规则表单',
            noCache: true,
            i18n: lang('活动规则表单')
          }
        },
        {
          path: 'marketActivity/activityRule/waterForm',
          name: '活动规则返水表单',
          component: ActivityWaterRuleForm,
          meta: {
            title: '活动规则返水表单',
            noCache: true,
            i18n: lang('活动规则反水表单')
          }
        },
        {
          path: 'marketActivity/activityRule/callFriends',
          name: '活动规则返水表单',
          component: CallFriendsFrom,
          meta: {
            title: '呼朋唤友',
            noCache: true,
            i18n: lang('呼朋唤友')
          }
        },
        {
          path: 'marketActivity/recommendList/:loginName',
          name: '好友列表',
          component: RecommendList,
          meta: {
            title: '好友列表',
            noCache: true,
            i18n: lang('好友列表')
          }
        },
        {
          path: 'marketActivity/incomeList',
          name: '好友返利',
          component: IncomeList,
          meta: {
            title: '好友返利',
            noCache: true,
            i18n: lang('好友返利')
          }
        },
        // {
        //   path: 'marketActivity/incomeList',
        //   name: '发放记录',
        //   component: IncomeList,
        //   meta: {
        //     title : '发放记录',
        //     noCache: true,
        //   }
        // },
        {
          path: 'marketActivity/activityIntroduction',
          name: '活动介绍',
          component: ActivityIntroduction,
          meta: {
            title: '活动介绍',
            keepAlive: true,
            i18n: lang('活动介绍')
          }
        },
        {
          path: 'marketActivity/taskCenter',
          name: '任务中心',
          component: taskCenter,
          meta: {
            title: '任务中心',
            keepAlive: true,
            i18n: lang('任务中心')
          }
        },
        {
          path: 'marketActivity/taskCenter/form',
          name: '任务中心表单',
          component: taskCenterForm,
          meta: {
            title: '任务中心表单',
            keepAlive: true,
            i18n: lang('任务中心表单')
          }
        },
        {
          path: 'marketActivity/taskStatistics',
          name: '任务中心统计',
          component: () =>
            import('../pages/market_activity/task_statistics/List'),
          meta: {
            title: '任务中心统计',
            keepAlive: true,
            i18n: lang('任务中心统计')
          }
        },
        {
          path: 'marketActivity/taskStatistics/form',
          name: '任务中心统计表单',
          component: () =>
            import('../pages/market_activity/task_statistics/Form'),
          meta: {
            title: '任务中心统计表单',
            keepAlive: true,
            i18n: lang('任务中心统计表单')
          }
        },

        {
          path: 'marketActivity/activityIntroduction/form',
          name: '活动介绍表单',
          component: ActivityIntroductionForm,
          meta: {
            title: '活动介绍表单',
            i18n: lang('活动介绍表单')
          }
        },
        {
          path: 'marketActivity/activityCategory',
          name: '活动类别',
          component: ActivityCategory,
          meta: {
            title: '活动类别',
            keepAlive: true,
            i18n: lang('活动类别')
          }
        },
        {
          path: 'marketActivity/waterRebateList',
          name: '返水列表',
          component: WaterRebateList,
          meta: {
            title: '返水列表',
            keepAlive: true,
            i18n: lang('返水列表')
          }
        },
        {
          path: 'marketActivity/waterRebateList/detail',
          name: '返水明细',
          component: WaterRebateDetail,
          meta: {
            title: '返水明细',
            i18n: lang('返水明细')
          }
        },
        {
          path: 'operateAnalyze/checkSheet',
          name: '稽核报表',
          component: CheckSheet,
          meta: {
            title: '稽核报表',
            keepAlive: true,
            i18n: lang('稽核报表')
          }
        },
        {
          path: 'operateAnalyze/smslog',
          name: '短信记录',
          component: Smslog,
          meta: {
            title: '短信记录',
            i18n: lang('短信记录')
          }
        },
        {
          path: 'operateAnalyze/loseWinSheet',
          name: '输赢报表',
          component: LoseWinSheet,
          meta: {
            title: '输赢报表',
            keepAlive: true,
            i18n: lang('输赢报表')
          }
        },
        {
          path: 'operateAnalyze/dividendSheet',
          name: '红利报表',
          component: DividendSheet,
          meta: {
            title: '红利报表',
            keepAlive: true,
            i18n: lang('红利报表')
          }
        },
        {
          path: 'operateAnalyze/gameDataSheet',
          name: '游戏数据报表',
          component: GameDataSheet,
          meta: {
            title: '游戏数据报表',
            keepAlive: true,
            i18n: lang('游戏数据报表')
          }
        },
        {
          path: 'operateAnalyze/moneySheet',
          name: '资金报表',
          component: MoneySheet,
          meta: {
            title: '资金报表',
            keepAlive: true,
            i18n: lang('资金报表')
          }
        },
        {
          path: 'operateAnalyze/betRecord',
          name: '投注记录',
          component: BetRecord,
          meta: {
            title: '投注记录',
            keepAlive: true,
            i18n: lang('投注记录')
          }
        },
        {
          path: 'operateAnalyze/balanceRecord',
          name: '账变流水',
          component: BalanceRecord,
          meta: {
            title: '账变流水',
            keepAlive: true,
            i18n: lang('账变流水')
          }
        },
        {
          path: 'systemManage/systemSetting',
          name: '系统设置',
          component: SystemSetting,
          meta: {
            title: '系统设置',
            keepAlive: true,
            i18n: lang('系统设置')
          }
        },
        {
          path: 'systemManage/ProxySetting',
          name: '代理设置',
          component: ProxySetting,
          meta: {
            title: '代理设置',
            keepAlive: true,
            i18n: lang('代理设置')
          }
        },
        {
          path: 'systemManage/broadcastSwitchSetting',
          name: '通知播报设置',
          component: InfoSetting,
          meta: {
            title: '通知播报设置',
            keepAlive: true,
            i18n: lang('通知播报设置')
          }
        },
        {
          path: 'systemManage/ServiceSetting',
          name: '佣金设置',
          component: ServiceSetting,
          meta: {
            title: '佣金设置',
            keepAlive: true,
            i18n: lang('佣金设置')
          }
        },
        {
          path: 'systemManage/messageTemplate',
          name: '信息模版',
          component: MessageTemplate,
          meta: {
            title: '信息模版',
            keepAlive: true,
            i18n: lang('信息模块')
          }
        },
        {
          path: 'systemManage/roleAuth',
          name: '角色权限',
          component: RoleAuth,
          meta: {
            title: '角色权限',
            keepAlive: true,
            i18n: lang('角色权限')
          }
        },
        {
          path: 'systemManage/roleAuthAdd',
          name: '角色权限新增',
          component: RoleAuthAdd,
          meta: {
            title: '角色权限新增',
            i18n: lang('角色权限新增')
          }
        },
        {
          path: 'systemManage/roleManage',
          name: '用户管理',
          component: MemberManage,
          meta: {
            title: '用户管理',
            keepAlive: true,
            i18n: lang('用户管理')
          }
        },
        {
          path: 'systemManage/roleList',
          name: '权限列表',
          component: RoleList,
          meta: {
            title: '权限列表',
            i18n: lang('权限列表')
          }
        },
        {
          path: 'systemManage/logMonitor',
          name: '操作日志',
          component: OperationLog,
          meta: {
            title: '操作日志',
            keepAlive: true,
            i18n: lang('操作日志')
          }
        },
        {
          path: 'wageManage/depositLock',
          name: 'depositLock',
          component: WithdrawClock,
          meta: {
            title: '存款锁定',
            keepAlive: true,
            i18n: lang('存款锁定')
          }
        },
        {
          path: 'wageManage/depositLockDetail',
          name: 'withdrawClockDetail',
          component: WithdrawClockDetail,
          meta: {
            title: '存款锁定详情',
            keepAlive: true,
            i18n: lang('存款锁定详情')
          }
        },
        {
          path: 'dailyRetainSheet',
          name: 'dailyRetainSheet',
          component: DailyRetainSheet,
          meta: {
            title: '每日留存报表',
            keepAlive: true,
            i18n: lang('每日留存报表')
          }
        },
        {
          path: 'warningList',
          name: 'warningList',
          component: WarningList,
          meta: {
            title: '预警信息',
            keepAlive: true,
            i18n: lang('预警信息')
          }
        },
        {
          path: 'memberManage/mbrlabelList',
          name: 'memberTag',
          component: MemberTag,
          meta: {
            title: '会员标签',
            keepAlive: true,
            i18n: lang('会员标签')
          }
        },
        {
          path: 'callFriends/index',
          name: '呼朋唤友',
          component: CallFriends,
          meta: {
            title: '呼朋唤友',
            keepAlive: true,
            i18n: lang('呼朋唤友')
          }
        },
        {
          path: 'dailyRetainActiveSheet',
          name: 'retentionRateSheet',
          component: RetentionRateSheet,
          meta: {
            title: '会员留存率报表',
            keepAlive: true,
            i18n: lang('会员留存率报表')
          }
        },
        {
          path: 'operateAnalyze/mbrMoneySheet',
          name: 'mbrMoneySheet',
          component: MbrMoneySheet,
          meta: {
            title: '会员资金报表',
            keepAlive: true,
            i18n: lang('会员资金报表')
          }
        },
        {
          path: 'operateAnalyze/agentDailySheet',
          name: 'agentDailySheet',
          component: AgentDailySheet,
          meta: {
            title: '代理资金日期报表',
            keepAlive: true,
            i18n: lang('代理资金日期报表')
          }
        },
        {
          path: 'operateAnalyze/agentSheet',
          name: 'agentSheet',
          component: AgentSheet,
          meta: {
            title: '代理资金会员报表',
            keepAlive: true,
            i18n: lang('代理资金会员报表')
          }
        },
        {
          path: 'operateAnalyze/mbrlog',
          name: 'mbrlog',
          component: Mbrlog,
          meta: {
            title: '资金报表日志',
            keepAlive: true,
            i18n: lang('资金报表日志')
          }
        },
      ]
    },
    {
      path: '/*',
      component: NotFound
    }
  ],
  linkActiveClass: 'active',
  history: true
})
let keyValueObj = store.state.compKeyValue
router.beforeEach((to, from, next) => {
  if (keyValueObj[to.path]) {
    let queryKeys = Object.keys(to.query)
    if (to.path !== from.path && !queryKeys.includes('useQueryStoreCache')) {
      delete keyValueObj[to.path]
      store.commit('SET_COMP_KEYVALUE', to.path)
    }
  } else {
    store.commit('SET_COMP_KEYVALUE', to.path)
  }
  let token = window.localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      if (to.path !== '/login') {
        return next({
          path: '/login'
        })
      }
    } else {
      let indexActive
      //let d = store.getters.getTreeData
      let d = window.localStorage.getItem('treeData')
      /*这里暂不支持三级菜单   目前业务也用不到*/
      if (d) {
        d = JSON.parse(d)
        for (var i = 0; i < d.length; i++) {
          var g = d[i].children
          for (var k = 0; k < g.length; k++) {
            if (g[k].url == to.path) {
              indexActive = i + '-' + k
              break
            } else {
              var b = g[k].children
              for (var m = 0; m < b.length; m++) {
                if (b[m].url == to.path) {
                  indexActive = i + '-' + k + '-' + m
                  break
                }
              }
            }
          }
        }
      }
      if (indexActive) {
        store.commit('indexActive', indexActive)
      }
      // 重置pageno pagesize
      store.commit('resetPage', {
        pageSize: 10,
        pageNo: 1,
        pageSizeArr: [5, 10, 20, 50, 100, 200]
      })
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

// router.afterEach((to) => {
//   to.meta.keepAlive === false && (to.meta.keepAlive = true)
// })

export default router
