<template>
  <div class="sub-header">
      <span v-for="(item, index) in titleArr" :key="index">
        {{ item }}
      </span>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-duplicate-case */

  export default {
    data() {
      return {
        arr: ''
      }
    },
    computed: {
      titleArr() {
        let titleStr = this.$store.state.indexActive
        let arr = []
        switch (titleStr) {
          case '1':
            arr = [this.$t('管理总览')]
            break
          case '2-1':
            arr = [this.$t('流程管理'), this.$t('流程发起')]
            break
          case '2-2':
            arr = [this.$t('流程管理'), this.$t('我的申请')]
            break
          case '2-3':
            arr = [this.$t('流程管理'), this.$t('代办流程')]
            break
          case '2-4':
            arr = [this.$t('流程管理'), this.$t('代办事物')]
            break
          case '3-1':
            arr = [this.$t('会员管理'), this.$t('会员列表')]
            break
          case '3-1-1':
            arr = [this.$t('会员管理'), this.$t('会员列表'), this.$t('会员详情')]
            break
          case '3-2':
            arr = [this.$t('会员管理'), this.$t('会员组')]
            break
          case '3-3':
            arr = [this.$t('会员管理'), this.$t('在线会员')]
            break
          case '4-1':
            arr = [this.$t('代理管理'), this.$t('佣金方案')]
            break
          case '4-2':
            arr = [this.$t('代理管理'), this.$t('总代设置')]
            break
          case '4-3':
            arr = [this.$t('代理管理'), this.$t('代理设置')]
            break
          case '4-4':
            arr = [this.$t('代理管理'), this.$t('佣金结算')]
            break
          case '5-1':
            arr = [this.$t('资金管理'), this.$t('线上入款')]
            break
          case '5-2':
            arr = [this.$t('资金管理'), this.$t('公司入款')]
            break
          case '5-3':
            arr = [this.$t('资金管理'), this.$t('会员提款')]
            break
          case '5-4':
            arr = [this.$t('资金管理'), this.$t('代理提款')]
            break
          case '5-5':
            arr = [this.$t('资金管理'), this.$t('调整报表')]
            break
          case '5-6':
            arr = [this.$t('资金管理'), this.$t('转账报表')]
            break
          case '5-7':
            arr = [this.$t('资金管理'), this.$t('会员入款')]
            break
          case '6-1':
            arr = [this.$t('运营管理'), this.$t('线上支付')]
            break
          case '6-2':
            arr = [this.$t('运营管理'), this.$t('公司入款设置')]
            break
          case '6-3':
            arr = [this.$t('运营管理'), this.$t('出款管理')]
            break
          case '6-4':
            arr = [this.$t('运营管理'), this.$t('活动设置')]
            break
          case '6-5':
            arr = [this.$t('运营管理'), this.$t('红利列表')]
            break
          case '6-6':
            arr = [this.$t('运营管理'), this.$t('广告管理')]
            break
          case '6-7':
            arr = [this.$t('运营管理'), this.$t('公告通知')]
            break
          case '6-8':
            arr = [this.$t('运营管理'), this.$t('站内信')]
            break
          case '6-9':
            arr = [this.$t('运营管理'), this.$t('游戏列表')]
            break
          case '7-1':
            arr = [this.$t('经营分析'), this.$t('输赢报表')]
            break
          case '7-2':
            arr = [this.$t('经营分析'), this.$t('红利报表')]
            break
          case '7-3':
            arr = [this.$t('经营分析'), this.$t('游戏数据报表')]
            break
          case '7-4':
            arr = [this.$t('经营分析'), this.$t('经营报表')]
            break
          case '7-5':
            arr = [this.$t('经营分析'), this.$t('运营报表')]
            break
          case '7-6':
            arr = [this.$t('经营分析'), this.$t('活动报表')]
            break
          case '7-7':
            arr = [this.$t('经营分析'), this.$t('投注记录')]
            break
          case '7-8':
            arr = [this.$t('经营分析'), this.$t('财务费用')]
            break
          case '7-9':
            arr = [this.$t('经营分析'), this.$t('余额报表')]
            break
          case '7-10':
            arr = [this.$t('经营分析'), this.$t('账变流水')]
            break
          case '7-11':
            arr = [this.$t('经营分析'), this.$t('稽核报表')]
            break
          case '8-1-1':
            arr = [this.$t('系统管理'), this.$t('基本设置'), this.$t('系统管理')]
            break
          case '8-1-2':
            arr = [this.$t('系统管理'), this.$t('基本设置'), this.$t('域名管理')]
            break
          case '8-1-4':
            arr = [this.$t('系统管理'), this.$t('基本设置'), this.$t('信息模版')]
            break
          case '8-2-1':
            arr = [this.$t('系统管理'), this.$t('权限设置'), this.$t('角色权限')]
            break
          case '8-2-2':
            arr = [this.$t('系统管理'), this.$t('权限设置'), this.$t('用户管理')]
            break
          case '8-3-1':
            arr = [this.$t('系统管理'), this.$t('日志监控'), this.$t('日志监控')]
            break
          case '8-1-3':
            arr = [this.$t('系统管理'), this.$t('基本设置'), this.$t('信息模版')]
            break
          default:
            arr = []
            break
        }
        return arr
      }
    }
  }
</script>

<style lang="scss">
  .sub-header {
    height: 46px;
    line-height: 46px;
    z-index: 9;
    float: left;
    span:after {
      content: '>>';
    }

    :last-child {
      color: #fff;
    }
    :last-child:after {
      content: '';
    }

  }
</style>
