<template>
  <div>
    <!-- 返利列表（本月） -->
    <TableSearchBar :current-page.sync="params.pageNo" :searchCriteria.sync="search" :loading="loading" @reloadData="handleSearch" />
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableLoading="loading"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :totalCount="totalCount"
      @reloadData="getTable"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    />
  </div>
</template>

<script>
import RebateMixins from "./RebateMixins";
import systemConfig from "../../../config/config";
import Mixin from '@/mixins/loadTime'

export default {
  name: "RebateCurrentMonth",
  mixins: [Mixin, RebateMixins],
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      search: {
        keys: {},
        meta: [
          { label: this.$t('会员组'), type: 'select', prop: 'groupId', options: [] },
          { label: this.$t('会员名'), type: 'text', prop: 'loginName' },
          { label: this.$t('代理会员级别'), type: 'select', prop: 'agyLevelId', options: [] },
        ]
      },
      loading: false,
      tableData: [],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('会员名'), prop: 'loginName' },
        { label: this.$t('会员组'), prop: 'groupName' },
        { label: this.$t('代理会员级别'), render: (h, row) => {
            const { agyLevelId } = row
            const { options } = this.search.meta[2]
            const obj = options.find(i => i.value === agyLevelId)
            return h('span', obj ? obj.label : '')
          } },
        { label: this.$t('当天实际有效输赢'), prop: 'validPayoutFromChild' },
        { label: this.$t('当月截至累计总有效输赢'), prop: 'validPayoutFromChildMonth' },
        { label: this.$t('统计时间'), prop: 'createTimeEx' },
      ],
      totalCount: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getMbrOptions(options => {
        this.search.meta.splice(2, 1, { ...this.search.meta[2], options })
      })
      this.getMbrGroup(options => {
        this.search.meta.splice(0, 1, { ...this.search.meta[0], options })
      })
      this.getTable()
    },
    handleSearch() {
      this.getTable()
    },
    async getTable() {
      this.getCurrentRecodeTime()
      const { keys } = this.search
      const params = {
        _async_: true,
        ...this.params,
        createTimeEnd: this.dealTime(new Date(), 'YYYY-MM-DD'),
        createTimeStart: `${this.dealTime(new Date(), 'YYYY-MM')}-01`,
        ...keys
      }
      this.loading = true
      const [res, , reaAllData] = await this.$axios.get(systemConfig.urls.getMbrRebateAgentDayList, params)
      this.getNetworkLoadAndDataSolveTime(reaAllData)
      this.loading = false
      if (res && res.code === 0) {
        const { list, totalCount } = res.page
        this.tableData = list
        this.totalCount = totalCount
      }
    }
  }
}
</script>

<style scoped>

</style>
