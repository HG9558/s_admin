<template>
  <div>
    <!-- 返利列表（历史） -->
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
import TableCom from "../../../components/TableCom";
import systemConfig from "../../../config/config";
import Mixin from '@/mixins/loadTime'

export default {
  name: "RebateHistory",
  mixins: [Mixin, RebateMixins],
  components: {
    TableCom
  },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      search: {
        keys: {
          createTimeEnd: +new Date() - 1000 * 60 * 60 * 24
        },
        meta: [
          { label: this.$t('时间'), type: 'date-pick', prop: 'createTimeEnd' },
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
            const { options } = this.search.meta[3]
            const obj = options.find(i => i.value === agyLevelId)
            return h('span', obj ? obj.label : '')
          } },
        { label: this.$t('当天实际有效输赢'), prop: 'validPayoutFromChild' },
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
        this.search.meta.splice(3, 1, { ...this.search.meta[3], options })
      })
      this.getMbrGroup(options => {
        this.search.meta.splice(1, 1, { ...this.search.meta[1], options })
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
        ...keys
      }
      if (params.createTimeEnd) {
        params.createTimeEnd = this.dealTime(params.createTimeEnd, 'YYYY-MM-DD')
        params.createTimeStart = params.createTimeEnd
      }
      this.loading = true
      const [res, ,reaAllData] = await this.$axios.get(systemConfig.urls.getMbrRebateAgentDayList, params)
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
