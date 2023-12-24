<template>
  <div>
    <WindSearch :searchForm.sync="searchForm" :searchList="searchList" :loading="loading" @onSubmit="search" @onReset="onReset" />
    <WindTable :table="{ data: tableData.list }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page.sync="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import WindMixins from "./WindMixins";
// const options = [
//   { label: this.$t('全部'), value: '' },
//   { label: this.$t('拒绝'), value: 0 },
//   { label: this.$t('通过'), value: 1 },
//   { label: this.$t('待处理'), value: 2 },
//   // { label: '出款中', value: 3 },
//   // { label: '自动出款人工审核', value: 4 },
//   // { label: '自动出款中', value: 5 },
//   // { label: '初审待定', value: 6 }
// ]
export default {
  name: "mbrwithdrawList",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('订单号'), prop: 'orderNo' },
        { label: this.$t('提款银行'), render: (h, row) => h('span', row.methodType === 0 ? row.bankName : '--') },
        { label: this.$t('分行信息'), render: (h, row) => h('span', row.methodType === 0 ? row.address : '--') },
        { label: this.$t('提款类型'), render: (h, row) => h('span', row.methodType === 0 ? this.$t('银行卡') : this.$t('加密货币钱包')) },
        { label: this.$t('提款金额'), prop: 'drawingAmount' },
        { label: this.$t('提款时间'), prop: 'createTime' },
        { label: this.$t('状态'), render(h, row) {
           const obj = {
             0: this.$t('拒绝'),
             1: this.$t('通过'),
             2: this.$t('待处理'),
             3: this.$t('出款中'),
             4: this.$t('自动出款人工审核'),
             5: this.$t('自动出款中'),
             6: this.$t('初审待定')
           }
           return h('div', {}, obj[row.status] || '')
          } },
        { label: this.$t('备注'), prop: 'memo' },
      ],
      searchList: [
        { type: 'select', prop: 'statuss', formItem: { label: this.$t('状态') }, attrs: { placeholder: this.$t('请输入') }, options: [
            { label: this.$t('全部'), value: '' },
            { label: this.$t('拒绝'), value: 0 },
            { label: this.$t('通过'), value: 1 },
            { label: this.$t('待处理'), value: 2 },
            // { label: '出款中', value: 3 },
            // { label: '自动出款人工审核', value: 4 },
            // { label: '自动出款中', value: 5 },
            // { label: '初审待定', value: 6 }
          ]
        },
        { type: 'text', prop: 'orderNo', formItem: { label: this.$t('订单号') }, attrs: { placeholder: this.$t('请输入') } },
        { type: 'time', prop: ['createTimeFrom', 'createTimeTo'], formItem: { label: this.$t('入款时间') } }
      ]
    }
  },
  methods: {
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
      const url = this.transFormUrl(systemConfig.urls.windMbrwithdrawList, { createTimeFrom: [createTimeFrom, 'start'], createTimeTo: [createTimeTo] })
      this.loading = true
      const [res] = await this.$axios.get(url, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.withdraw
      }
    }
  }
}
</script>

<style scoped>

</style>
