<template>
  <div>
    <div>
      <WindSearch :searchForm.sync="searchForm" :searchList="searchList" :loading="loading" @onSubmit="search" @onReset="onReset" />
      <WindTable :table="{ data: tableData.list }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page.sync="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
    </div>
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import WindMixins from "./WindMixins";

export default {
  name: "mbrbillList",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('订单号'), prop: 'orderNo' },
        { label: this.$t('转出平台'), render: (h, row) => {
            const { opType, depotId} = row
            const str = opType === 0 ? this.$t('主账户') : this.platform[depotId]
            return h('span', str)
          } },
        { label: this.$t('转入平台'), render: (h, row) => {
            const { opType, depotId} = row
            const str = opType === 1 ? this.$t('主账户') : this.platform[depotId]
            return h('span', str)
          } },
        { label: this.$t('转账金额'), prop: 'amount' },
        { label: this.$t('账户金额变动'), render(h, row) {
            const { beforeBalance, afterBalance } = row
            return h('span', `${beforeBalance}>>>${afterBalance}`)
          } },
        { label: this.$t('操作时间'), prop: 'modifyTime' },
        { label: this.$t('状态'), render(h, row) {
            const obj = {
              0: this.$t('冻结'),
              1: this.$t('通过'),
              2: this.$t('待处理')
            }
            return h('div', obj[row.status] || '')
          } },
      ],
      searchList: [
        { type: 'select', prop: 'statuss', formItem: { label: this.$t('状态') }, attrs: { placeholder: this.$t('请输入') }, options: [ { label: this.$t('全部'), value: '' }, { label: this.$t('冻结'), value: 0 }, { label: this.$t('通过'), value: 1 }, { label: this.$t('待处理'), value: 2 } ] },
        { type: 'text', prop: 'orderNo', formItem: { label: this.$t('订单号') }, attrs: { placeholder: this.$t('请输入') } },
        { type: 'time', prop: ['createTimeFrom', 'createTimeTo'], formItem: { label: this.$t('操作时间') } }
      ],
      platform: {}
    }
  },
  created() {
    this.getPlatform()
  },
  methods: {
    async getPlatform() {
      const params = {
        _async_: true,
        codetype: ''
      }
      const [res] = await this.$axios.get(systemConfig.urls.getPlatform, params)
      if (res && res.code === 0) {
        const obj = {}
        res.page.forEach(i => {
          const { id, value } = i
          obj[id] = value
        })
        this.platform = obj
      }
    },
    async getList() {
      const { createTimeFrom, createTimeTo, ..._data } = this.searchForm
      if (+new Date(createTimeTo) < +new Date(createTimeFrom)) {
        return this.$message.warning(this.$t('结束时间不能大于开始时间'))
      }
      const params = {
        _async_: true,
        accountId: this.accountId,
        ..._data,
        ...this.params
      }
      const url = this.transFormUrl(systemConfig.urls.windMbrbillList, { createTimeFrom: [createTimeFrom, 'start'], createTimeTo: [createTimeTo] })
      this.loading = true
      const [res] = await this.$axios.get(url, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.page
      }
    }
  }
}
</script>

<style scoped>

</style>
