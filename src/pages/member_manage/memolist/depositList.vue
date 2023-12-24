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
  name: "depositList",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('订单号'), prop: 'orderNo' },
        { label: this.$t('充值方式'), render: (h, row) => {
            const obj = {
              0: this.$t('线上入款'),
              1: this.$t('公司入款'),
              2: this.$t('个人二维码'),
              3: this.$t('加密货币'),
              4: this.$t('代理充值')
            }
            return h('div', {}, obj[row.mark] || '')
          } },
        { label: this.$t('收款渠道'), prop: 'payType' },
        { label: this.$t('充值金额'), prop: 'depositAmount' },
        { label: this.$t('实际金额'), prop: 'actualArrival' },
        { label: this.$t('充值时间'), prop: 'createTime' },
        { label: this.$t('状态'), render(h, row) {
            const obj = {
              0: this.$t('失败'),
              1: this.$t('成功'),
              2: this.$t('待处理')
            }
            return h('div', {}, obj[row.status] || '')
          } },
        { label: this.$t('备注'), prop: 'memo' },
      ],
      searchList: [
        { type: 'select', prop: 'status', formItem: { label: this.$t('状态') }, attrs: { placeholder: this.$t('请输入') }, options: [ { label: this.$t('全部'), value: '' }, { label: this.$t('失败'), value: 0 }, { label: this.$t('成功'), value: 1 }, { label: this.$t('待处理'), value: 2 } ] },
        { type: 'text', prop: 'orderNo', formItem: { label: this.$t('订单号') }, attrs: { placeholder: this.$t('请输入') } },
        { type: 'time', prop: ['createTimeFrom', 'createTimeTo'], formItem: { label: this.$t('入款时间') } }
      ]
    }
  },
  methods: {
    async getList() {
      const { createTimeFrom, createTimeTo, ..._data } = this.searchForm
      if (+new Date(createTimeTo) < +new Date(createTimeFrom)) {
        return this.$message.warning(this.$t('开始时间不能大于结束时间'))
      }
      const params = {
        _async_: true,
        accountId: this.accountId,
        ..._data,
        ...this.params
      }
      const url = this.transFormUrl(systemConfig.urls.windDepositList, { createTimeFrom: [createTimeFrom, 'start'], createTimeTo: [createTimeTo] })
      this.loading = true
      const [res] = await this.$axios.get(url, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.depotList
      }
    }
  }
}
</script>

<style scoped>

</style>
