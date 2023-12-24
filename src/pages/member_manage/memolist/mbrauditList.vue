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
  name: "mbrauditList",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('订单号'), prop: 'orderNo' },
        { label: this.$t('调整类型'), prop: 'causeName' },
        { label: this.$t('调整方式'), render(h, row) {
            const { adjustType, financialCode } = row
            const opt1 = [
              {
                label: this.$t('优惠添加'),
                value: 0
              }, {
                label: this.$t('额度补回'),
                value: 1
              }, {
                label: this.$t('入款冲销'),
                value: 2
              }, {
                label: this.$t('其他'),
                value: 3
              }, {
                label: this.$t('代理充值'),
                value: 4
              }
            ]
            const opt2 = [
              {
                label: this.$t('风控扣款'),
                value: 0,
              }, {
                label: this.$t('优惠冲销'),
                value: 1,
              }, {
                label: this.$t('额度冲销'),
                value: 2
              }, {
                label: this.$t('入款冲销'),
                value: 3
              }, {
                label: this.$t('其他'),
                value: 4
              }
            ]
            const arr = financialCode === 'AA' ? opt1 : opt2
            const obj = arr.find(i => i.value === adjustType)
            const text = obj ? obj.label : ''
            return h('div', text)
          } },
        { label: this.$t('调整金额'), prop: 'amount' },
        { label: this.$t('申请人'), prop: 'auditUser' },
        { label: this.$t('申请时间'), prop: 'createTime' },
      ],
      searchList: [
        { type: 'select', prop: 'financialCodes', formItem: { label: this.$t('调整类型') }, attrs: { placeholder: this.$t('请输入') }, options: [ { label: this.$t('全部'), value: '' }, { label: this.$t('人工增加'), value: 'AA' }, { label: this.$t('人工减少'), value: 'AM' } ] },
        { type: 'time', prop: ['createTimeFrom', 'createTimeTo'], formItem: { label: this.$t('提交时间时间') } }
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
      const url = this.transFormUrl(systemConfig.urls.windMbrauditList, { createTimeFrom: [createTimeFrom, 'start'], createTimeTo: [createTimeTo] })
      this.loading = true
      const [res] = await this.$axios.get(url, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.data
      }
    }
  }
}
</script>

<style scoped>

</style>
