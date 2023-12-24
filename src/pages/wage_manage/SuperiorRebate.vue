<template>
<!-- 上级返佣报表 -->
  <div class="transfer">
    <TableSearchBar
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      @reloadData="onReload"
      ref="searchCom"
    >
    </TableSearchBar>
    <TableCom
      v-loading="loading"
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :tableData="tableData.list"
      :totalCount="tableData.totalCount"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      @reloadData="getTableData"
      :showLoadTime="true"
	    :networkLoadTime="networkLoadTime"
	    :dataSolveTime="dataSolveTime"

    >
      <div slot="slot-title" class="export-div">
        <el-button
          class="iconfont icon-export el-button-export exportList"
          v-if="isNowDowning && permissions.export"
          @click="handleExport"
        >
          {{ $t('导出') }}
        </el-button>
        <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning && permissions.export">
          {{ $t('导出中') }}...
        </el-button>
      </div>
    </TableCom>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fileExport from "@/mixins/fileExport";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin, fileExport],
  data() {
    const agentTypeList = [{ agentName: this.$t('股东'), agentType: 0 }, { agentName: this.$t('总代'), agentType: 1 }, { agentName: this.$t('一级代理'), agentType: 2 }, { agentName: this.$t('二级代理'), agentType: 3 }]
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
      },
      searchCriteria: {
        keys: {
          reviewStatus: null,
        },
        meta: [
          { label: this.$t('代理账号'), type: 'text', prop: 'agyAccount' },
          { label: this.$t('状态'), type: 'select', prop: 'reviewStatus', options: [{ label: this.$t('全部'), value: null }, { label: this.$t('不通过'), value: 0 }, { label: this.$t('通过'), value: 1 }, { label: this.$t('待处理'), value: 2 }] },
          { label: this.$t('更新时间'), type: 'StartEndTime', prop: 'time', keys: { startTime: 'startTime', endTime: 'endTime' } },
        ],
      },
      loading: false,
      exportLoading: false,
      tableData: {
        totalCount: 0,
        list: []
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('订单号'), prop: 'orderNo' },
        {
          label: this.$t('周期'), prop: 'cycleStart', render: (h, row) => {
            return h('span', row.cycleStart + this.$t('至') + row.cycleEnd)
          }, width: '155'
        },
        { label: this.$t('代理账号'), prop: 'agyAccount' },
        {
          label: this.$t('代理等级'), render: (h, row) => {
            const { agentType } = row
            const item = agentTypeList.find(item => item.agentType === agentType)
            return h('span', item.agentName)
          }
        },
        { label: this.$t('下级代理账号'), prop: 'subAgyaccount' },
        { label: this.$t('下级代理净输赢'), prop: 'subCommission' },
        {
          label: this.$t('返佣比例'), prop: 'rate', render: (h, row) => {
            return h('span', row.rate + '%')
          }
        },
        { label: this.$t('返佣发放额'), prop: 'commission' },
        { label: this.$t('状态'), prop: 'reviewStatusStr' },
        { label: this.$t('更新日期'), prop: 'modifyTime', width: '90' },
      ],
      isNowDowning: true,
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        export: hasPermission("agent:commissionAllSubList:export"),
      }
    },
  },
  created() {
    this.getTableData()
  },
  methods: {
    async handleExport() {
      const { keys } = this.searchCriteria
      const params = {
        ...keys,
        ...this.params
      }
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList.superiorRebateExport, params)
      this.isNowDowning = true
      if (res) {
        await this.agentCheckFile('commissionAllSubModule')
      }
    },
    onDel(row) {
      console.log('onDel')
    },
    onEdit(row) { },
    onReload({ type }) {
      this.getTableData()
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      const { keys } = this.searchCriteria
      const params = {
        ...keys,
        ...this.params
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.newAggentList.superiorRebateList, params)
      const {res,response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        this.tableData.list = res.page.list
        this.tableData.totalCount = res.page.totalCount
      }
    },
  },
}
</script>

<style>
</style>
