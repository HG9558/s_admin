<template>
  <div class="wind-detail">
    <div class="search">
      <div class="wind-label wind-top">
        <span>{{ $t('会员风控信息') }}</span>
        <el-button type="primary" @click="$router.push('/main/memberManage/windList')">{{ $t('返回') }}</el-button>
      </div>
      <div class="detail-box">
        <div v-for="(item, i) in textList" :key="i" class="text-item wind-label">
          <i class="el-icon-edit-outline mark-icon" v-if="item.type === 'mark' && hasPermission('member:wind:newmemo')" @click="showEditMore = true"></i>
          <span class="label-width">{{item.label}}: </span>
          <span class="detail-val">{{mbrInfo[item.val] ||item.defaultVal || '--'}}</span>
          <span v-if="item.type === 'mark' && hasPermission('member:wind:memolist')" class="wind-mark" @click="showMore = true">{{ $t('更多') }}</span>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="item.label" :name="item.name" v-for="(item, i) in tabList" :key="i">
          <template v-if="item.name === 'depositList' && isRender.includes(item.name)">
            <depositList :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrwithdrawList' && isRender.includes(item.name)">
            <mbrwithdrawList :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrbillList' && isRender.includes(item.name)">
            <mbrbillList :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrbonusList' && isRender.includes(item.name)">
            <mbrbonusList :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrauditList' && isRender.includes(item.name)">
            <mbrauditList :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrLoginlist' && isRender.includes(item.name)">
            <mbrLoginlist :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrfinalBetDetailsAll' && isRender.includes(item.name)">
            <mbrfinalBetDetailsAll :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrInfogame' && isRender.includes(item.name)">
            <mbrInfogame :accountId="accountId" />
          </template>
          <template v-if="item.name === 'mbrdeviceiP' && isRender.includes(item.name)">
            <mbrdeviceiP :accountId="accountId" />
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="$t('备注记录')" :visible.sync="showMore">
      <MoreList :accountId="accountId" v-if="showMore" />
    </el-dialog>
    <el-dialog :title="$t('新增备注')" :visible.sync="showEditMore" @open="handleEditOpen">
      <div>
        <el-form ref="editForm" :model="editForm" label-width="auto">
          <el-form-item :label="$t('操作人')">
            <el-input :value="accountName" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('操作时间')">
            <el-input :value="editForm.memoTime" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('备注内容')">
            <el-input type="textarea" :row="4" v-model="editForm.memo"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditMore = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="handleEditMemo" :loading="editLoading">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../config/config";
import MoreList from "./memolist/MoreList";
import depositList from "./memolist/depositList";
import mbrwithdrawList from "./memolist/mbrwithdrawList";
import mbrbillList from "./memolist/mbrbillList";
import mbrbonusList from "./memolist/mbrbonusList";
import mbrauditList from "./memolist/mbrauditList";
import mbrLoginlist from "./memolist/mbrLoginlist";
import mbrfinalBetDetailsAll from "./memolist/mbrfinalBetDetailsAll";
import mbrInfogame from "./memolist/mbrInfogame";
import mbrdeviceiP from "./memolist/mbrdeviceiP";
import {mapGetters} from "vuex";
import {setTime} from '@/config/setTime'

export default {
  name: "Memolist",
  components: {
    depositList,
    mbrwithdrawList,
    mbrbillList,
    mbrbonusList,
    mbrauditList,
    mbrLoginlist,
    mbrfinalBetDetailsAll,
    MoreList,
    mbrInfogame,
    mbrdeviceiP
  },
  data() {
    const textLabelW = '80px'
    return {
      textList: [
        { label: this.$t('会员账户'), val: 'loginName', textLabelW },
        { label: this.$t('上级代理'), val: 'agyAccount', textLabelW },
        { label: this.$t('代理备注'), val: 'agyMemo', textLabelW },
        { label: this.$t('会员组'), val: 'groupName', textLabelW },
        { label: this.$t('真实姓名'), val: 'realName', textLabelW },
        { label: this.$t('注册时间'), val: 'registerTime', textLabelW },
        { label: this.$t('最后登录时间'), val: 'loginTime' },
        { label: this.$t('总存款'), val: 'totalDeposit', textLabelW, defaultVal: 0 },
        { label: this.$t('总提款'), val: 'totalWithdrawal', textLabelW, defaultVal: 0 },
        { label: this.$t('红利总额'), val: 'totalProfit', textLabelW, defaultVal: 0 },
        { label: this.$t('总输赢'), val: 'totalPayout', textLabelW, defaultVal: 0 },
        { label: this.$t('备注'), val: 'memo', type: 'mark' },
      ],
      activeName: 'mbrInfogame',
      tabList: [
        { label: this.$t('余额'), name: 'mbrInfogame', permission: 'member:wind:balance' },
        { label: this.$t('存款'), name: 'depositList', permission: 'member:wind:deposit' },
        { label: this.$t('提款'), name: 'mbrwithdrawList', permission: 'member:wind:withdraw' },
        { label: this.$t('设备IP'), name: 'mbrdeviceiP', permission: 'member:wind:deviceiP' },
        { label: this.$t('户内转账'), name: 'mbrbillList', permission: 'member:wind:billList' },
        { label: this.$t('投注记录'), name: 'mbrfinalBetDetailsAll', permission: 'member:wind:beta' },
        { label: this.$t('红利优惠'), name: 'mbrbonusList', permission: 'member:wind:bonus' },
        { label: this.$t('资金调整'), name: 'mbrauditList', permission: 'member:wind:audit' },
        { label: this.$t('登录历史'), name: 'mbrLoginlist', permission: 'member:wind:loginlog' }
      ],
      mbrInfo: {},
      editForm: {
        memoTime: '',
        memo: ''
      },
      accountId: null,
      showMore: false,
      showEditMore: false,
      editLoading: false,
      isRender: ['mbrInfogame']
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['hasPermission']),
    accountName() {
      if (this.$store.state.user) {
        return this.$store.state.user.username;
      } else {
        return "???";
      }
    }
  },
  methods: {
    setPermission() {
      this.tabList = this.tabList.filter(i => this.hasPermission(i.permission))
      this.isRender = [ this.tabList[0].name ]
    },
    init() {
      this.accountId = this.$route.query.accountId
      this.setPermission()
      this.getInfo()
    },
    async handleEditMemo() {
      let { memoTime, memo } = this.editForm
      const { accountId } = this.$route.query
      const params = {
        memoTime,
        memo,
        oprUserName: this.accountName,
        accountId
      }
      this.editLoading = true
      const [res] = await this.$axios.post(`${systemConfig.urls.windMbrNewMemo}`, { _async_: true, ...params })
      this.editLoading = false
      if (res && res.code === 0) {
        this.$message.success(this.$t('修改成功'))
        this.showEditMore = false
        this.getInfo()
      }
    },
    handleEditOpen() {
      const dd = new Date()
      const zeroFn = val => val > 9 ? val : `0${val}`
      const timeStr = `${dd.getFullYear()}-${zeroFn(dd.getMonth() + 1)}-${zeroFn(dd.getDate())} ${zeroFn(dd.getHours())}:${zeroFn(dd.getMinutes())}:${zeroFn(dd.getSeconds())}`
      this.editForm.memoTime = timeStr
      // this.editForm.memo = this.mbrInfo.memo
    },
    async getInfo() {
      const { accountId } = this.$route.query
      const params = {
        _async_: true,
        accountId
      }
      const [res] = await this.$axios.get(systemConfig.urls.windMbrInfoByAcc, params)
      if (res && res.code === 0) {
        const { registerTime, loginTime } = res.mbr
        this.mbrInfo = {
          ...res.mbr,
          registerTime: setTime(registerTime),
          loginTime: setTime(loginTime)
        }
      }
    },
    handleTabClick({ name }) {
      if (!this.isRender.includes(name)) {
        this.isRender = [ name ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wind-detail {
  .wind-label {
    font-weight: bold;
    color: #555;
    font-size: 14px !important;
  }
  .wind-top {
    display: flex;
    justify-content: space-between;
  }
  .detail-box {
    display: flex;
    flex-wrap: wrap;
    padding: 0 12px;
    .label-width {
      display: inline-block;
      cursor: auto;
    }
    .text-item {
      min-width: 160px;
      margin-right: 20px;
      line-height: 35px;
    }
    .detail-val {
      display: inline-block;
      margin-left: 5px;
      font-weight: normal;
      cursor: auto;
    }
    .mark-icon {
      font-size: 18px;
      color: #FFD034;
      cursor: pointer;
    }
    .wind-mark {
      display: inline-block;
      margin-left: 18px;
      font-weight: normal;
      color: #3a8ee6;
    }
  }
  .table-box {
    margin-top: 30px;
  }
}
</style>
