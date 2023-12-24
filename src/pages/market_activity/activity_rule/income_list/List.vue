<template>
  <div class="income-list-sheet activity-sheet">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('会员账号') }}</label>
          <el-input v-model="q.loginName" v-trim size="small" class="he-32"></el-input>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="q.groupId" :placeholder="$t('请选择')" size="small">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('收益统计时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="140" :startTime.sync="q.startTime" :endTime.sync="q.endTime" :selections="selections" />
        </div>
      </div>
      <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" size="small" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" size="small" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="pageNo"
      :tableLoading="loading"
      @reloadData="getList"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <!-- 表格插槽 -->
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">[{{ $t('发放记录') }}]</el-button>
        </template>
      </el-table-column>
    </TableCom>
    <Form
      ref="form"
      v-if="formVisible"
      :formVisible.sync="formVisible"
      :data="data"
    />
  </div>
</template>

<script>
import systemConfig from '@/config/config'
import queryStore from '@/mixins/queryStore'
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector"
import Form from './Form'
import Mixin from '@/mixins/loadTime'


export default {
  name: 'IncomeList',
  mixins: [Mixin, queryStore(['q'])],
  components: {
    StartAndEndTimeSelector,
    Form,
  },
  data() {
    return {
      q: {
        startTime: null,
        endTime: null,
        groupId: null,
        loginName: null,
      },
      formVisible: false,
      data: null,
      list: [],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      pageSizeArr: [5, 10, 20, 50, 100, 200],
      totalCount: 0,
      selections: [
        { label: this.$t('今日'), value: 'today' },
        { label: this.$t('昨日'), value: 'yesterday' },
        { label: this.$t('本周'), value: 'currentWeek' },
        { label: this.$t('本月'), value: 'currentMonth' },
      ],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('会员账号'), render: (h, row) =>  h('span', {
          class: 'el-button--text el-button',
          on: {
            click: () => this.onClick(row)
          },
        },
          row.loginName
        )},
        { label: this.$t('会员组'), prop: 'groupName' },
        { label: this.$t('邀请好友'), prop: 'inviteNum' },
        { label: this.$t('首存收益'), prop: 'firstChargeReward' },
        { label: this.$t('有效投注收益'), prop: 'validBetReward' },
        { label: this.$t('好友VIP等级收益'), prop: 'vipUpgradeReward' },
        { label: this.$t('好友充值收益'), prop: 'chargeReward' },
        { label: this.$t('自身返利'), prop: 'selfReward' },
        { label: this.$t('好友返利'), prop: 'friendReward' },
        { label: this.$t('实际返利'), prop: 'actualReward' },
        { slotName: 'operation' }
      ],
      loading: false,
    }
  },
  created() {
    this.fnGroup()
    this.getList()
  },
  methods: {
    toThousands(money) {
      if (money === 0) return 0
      return systemConfig.toThousands(money);
    },
    getList() {
      this.getCurrentRecodeTime()
      this.loading = true
      this.$axios.get(systemConfig.urls.getIncomeList, {
        params: {
          ...this.q,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        this.getNetworkLoadAndDataSolveTime(res)
        if (res) {
          this.totalCount = res.data.page.totalCount
          this.pageNo = res.data.page.currPage
          const data = res.data.page.list
          data.map(item => {
            item.firstChargeReward = this.toThousands(item.firstChargeReward)
            item.validBetReward = this.toThousands(item.validBetReward)
            item.chargeReward = this.toThousands(item.chargeReward)
            item.selfReward = this.toThousands(item.selfReward)
            item.friendReward = this.toThousands(item.friendReward)
            item.actualReward = this.toThousands(item.actualReward)
          })
          this.tableData = data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fnGroup() {
      this.list = []
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        resp.data.page.forEach((value) => {
          this.list.push({id: value.id, value: value.groupName})
        })
      })
    },
    reset() {
      this.q = {
        startTime: null,
        endTime: null,
        groupId: null,
        loginName: '',
      }
      this.search()
    },
    search() {
      this.pageNo = 1
      this.getList()
    },
    handleClick(row) {
      this.data = row
      this.formVisible = true
    },
    onClick(row) {
      this.$router.push(`/main/marketActivity/recommendList/${row.loginName}`)
    },
  }
}
</script>
