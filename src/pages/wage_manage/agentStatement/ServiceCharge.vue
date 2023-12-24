<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="params.pageNo" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="timeSelect" :width="450" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" /> &nbsp;&nbsp;&nbsp;&nbsp;
      
    </TableSearchBar>
    <TableCom
      v-show="!isMember"
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :table-loading="loading"
      :tableData="tableData"
      :totalCount="totalCount"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      @reloadData="getTableData"
      :showLoadTime="true"
        :networkLoadTime="networkLoadTime"
        :dataSolveTime="dataSolveTime"
    >
      <el-button v-if="hasPermission('agent:commission:servicechargExport')" type="primary" :loading="exportLoading" @click="handleExport">{{ $t('导出') }}</el-button>
    </TableCom>
    <div v-show="isMember">
      <div class="member-top">
        <div>
          <span>{{ $t('总代列表') }}</span> > <span>{{ currentRow.agyAccount }}</span>
        </div>
        <div>
          <el-button v-if="hasPermission('agent:commission:servicechargExport')" type="primary" :loading="exportLoading" @click="handleExport">{{ $t('导出') }}</el-button>
          <el-button @click="isMember = false">{{ $t('返回') }}</el-button>
        </div>
      </div>
      <TableCom
        :hasRemoveBtn="false"
        :hasAddBtn="false"
        :table-loading="loading"
        :tableData="member.tableData"
        :totalCount="member.totalCount"
        :tableColumns="member.tableColumns"
        :pageSize.sync="member.pageSize"
        :currentPage.sync="member.pageNo"
        @reloadData="getMemberData"
        :showLoadTime="true"
        :networkLoadTime="networkLoadTime"
        :dataSolveTime="dataSolveTime"

      >
      </TableCom>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector"
import fileExport from "../../../mixins/fileExport"
import Mixin from '@/mixins/loadTime'

export default {
  name: "ServiceCharge",
  components: { StartAndEndTimeSelector },
  mixins: [Mixin, fileExport],
  data() {
    return {
      params: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      totalCount: 0,
      loading: false,
      exportLoading: false,
      tableColumns: [
        { label: this.$t('序号'), prop: '_index', width: 70 },
        { label: this.$t('代理账号'), render: (h, row) => h('span', { class: 'blue-color pointer', on: { click: () => this.handleAgentClick(row) } }, row.agyAccount) },
        { label: this.$t('部门'), prop: 'departmentName' },
        { label: this.$t('存款'), prop: 'depositAmount'},
        { label: this.$t('提款'), prop: 'withdrawAmount'},
        { label: this.$t('存提和'), prop: 'sumDepositAndWithdrawal'},
        { label: this.$t('服务费'), prop: 'cost'},
        { label: this.$t('备注'), prop: 'memo' },
      ],
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          agyAccount: null,
          departmentName: null,
          memo: null
        },
        meta: [
          {
            label: this.$t('时间间隔'),
            slotName: 'timeSelect',
            options: [
              {
                label: this.$t("今日"),
                value: "today",
              },
              {
                label: this.$t("昨日"),
                value: "yesterday",
              },
              {
                label: this.$t("本周"),
                value: "currentWeek",
              },
              {
                label: this.$t("上周"),
                value: "lastWeek",
              },
              {
                label: this.$t('本月'),
                value: 'currentMonth'
              }
            ],
          },
          {
            label: this.$t('代理账号'),
            type: "text",
            prop: "agyAccount",
          },
          {
            label: this.$t('部门'),
            type: "select",
            prop: "departmentName",
            clearable: true,
            options: []
          },
          {
            type: "text",
            label: this.$t("备注"),
            prop: "memo",
          }
        ],
      },
      currentRow: {},
      isMember: false,
      member: {
        tableData: [],
        totalCount: 0,
        tableColumns: [
          { label: this.$t('会员'), prop: 'agyAccount' },
          { label: this.$t('存款'), prop: 'depositAmount'},
          { label: this.$t('提款'), prop: 'withdrawAmount'},
          { label: this.$t('存提和'), prop: 'sumDepositAndWithdrawal'},
          { label: this.$t('服务费'), prop: 'cost'},
        ],
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  created() {
    this.initDate()
    this.getAllDepartmentList()
    this.getTableData()
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    getParams() {
      return {
        ...this.params,
        ...this.searchCriteria.keys
      }
    }
  },
  methods: {
    initDate() {
      const date = new Date()
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.searchCriteria.keys.startTime = `${dateStr} 00:00:00`
      this.searchCriteria.keys.endTime = `${dateStr} 23:59:59`
    },
    handleAgentClick(row) {
      this.currentRow = row
      this.isMember = true
      this.member.pageNo = 1
      this.member.pageSize = 10
      this.getMemberData()
    },
    async handleExport() {
      const isMember = this.isMember
      let params = {
        ...this.getParams
      }
      if (isMember) {
        const { pageNo, pageSize } = this.member
        const { agyAccount } = this.currentRow
        params = {
          ...params,
          agyAccount,
          pageNo,
          pageSize
        }
      }
      this.exportLoading = true
      const { res } = await this.$axios.GET(this.$urls.newAggentList[isMember ? 'serviceChargAccountCostExport' : 'serviceChargAgentCostExport'], params)
      if (res) {
        await this.agentCheckFile(isMember ? 'serviceChargAccountCostModule' : 'serviceChargAgentCostModule')
      }
      this.exportLoading = false
    },
    async getMemberData() {
      this.getCurrentRecodeTime()
      const { pageNo, pageSize } = this.member
      const { agyAccount } = this.currentRow
      const params = {
        ...this.getParams,
        agyAccount,
        pageNo,
        pageSize
      }
      this.loading = true
      const { res } = await this.$axios.GET(this.$urls.newAggentList.findServiceChargAccount, params)
      this.loading = false
      if (res) {
        const { list, totalCount } = res.page
        this.member.tableData = this.dealList(list).map(i => ({ ...i, agyAccount: i.agyAccount || i._index }))
        this.member.totalCount = totalCount
      }
    },
    dealList(list) {
      const pageCount = {
        _index: this.$t('小计'),
        depositAmount: 0,
        sumDepositAndWithdrawal: 0,
        withdrawAmount: 0,
        cost: 0
      }
      const _list = list.filter(i => i.agyAccount !== this.$t('总计') && i.loginName !== this.$t('总计')).map((i, index) => {
        pageCount.depositAmount += i.depositAmount
        pageCount.sumDepositAndWithdrawal += i.sumDepositAndWithdrawal
        pageCount.withdrawAmount += i.withdrawAmount
        pageCount.cost += i.cost
        return { ...i, _index: index + 1 }
      })
      const total = list.filter(i => i.agyAccount === this.$t('总计') || i.loginName === this.$t('总计')).map(i => ({ ...i, agyAccount: '', _index: this.$t('总计') }))
      const arr = [..._list, pageCount, ...total ]
      arr.map(item => { 
        item.depositAmount = (item.depositAmount || 0).toLocaleString()
        item.withdrawAmount = (item.withdrawAmount || 0).toLocaleString()
        item.sumDepositAndWithdrawal = (item.sumDepositAndWithdrawal || 0).toLocaleString()
      });
      return arr
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      if (this.isMember) {
        this.isMember = false
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.newAggentList.findServiceChargAgent, this.getParams)
      const { res,response } = obj
      this.getNetworkLoadAndDataSolveTime(response)
      // this.totalCount = totalCount;
     
      this.loading = false
      if (res) {
        const { list, totalCount } = res.page
        this.tableData = this.dealList(list)
        this.totalCount = totalCount
      }
    },
    async getAllDepartmentList() {
      const { res } = await this.$axios.GET(this.$urls.newAggentList.alldDepartmentList)
      if (res) {
        const obj = this.searchCriteria.meta.find(i => i.prop === 'departmentName')
        if (obj) obj.options = res.data.map(i => ({ ...i, label: i.departmentName, value: i.departmentName }))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member-top {
  display: flex;
  justify-content: space-between;
  line-height: 35px;
  padding-top: 10px;
}
</style>
