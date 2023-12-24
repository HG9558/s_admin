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
  name: "mbrbonusList",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('订单号'), prop: 'orderNo' },
        { label: this.$t('活动名称'), prop: 'activityName' },
        { label: this.$t('活动类型'), prop: 'tmplName' },
        { label: this.$t('红利金额'), prop: 'bonusAmount' },
        { label: this.$t('申请时间'), prop: 'applicationTime' },
      ],
      searchList: [
        { type: 'text', prop: 'activityName', formItem: { label: this.$t('活动名称') }, attrs: { placeholder: this.$t('请输入') } },
        { type: 'time', prop: ['startTime', 'endTime'], formItem: { label: this.$t('申请时间') } }
      ]
    }
  },
  methods: {
    async getList() {
      const { startTime, endTime, ..._data } = this.searchForm
      if (+new Date(endTime) < +new Date(startTime)) {
        return this.$message.warning(this.$t('开始时间不能大于结束时间'))
      }
      const params = {
        _async_: true,
        accountId: this.accountId,
        ..._data,
        ...this.params
      }
      const url = this.transFormUrl(systemConfig.urls.windMbrbonusList, { startTime: [startTime, 'start'], endTime: [endTime] })
      this.loading = true
      const [res] = await this.$axios.get(url, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.page
        this.tableColumns = this.ifNotDoNotShow(this.tableColumns, this.tableData.list)
      }
    }
  }
}
</script>

<style scoped>

</style>
