<template>
  <div>
    <WindTable :table="{ data: tableData.list }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page.sync="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import WindMixins from "./WindMixins";

export default {
  name: "mbrLoginlist",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 70 },
        { label: this.$t('登录时间'), prop: 'loginTime' },
        { label: this.$t('登录IP'), prop: 'loginIp' },
        { label: this.$t('登录区域'), prop: 'loginArea' },
        { label: this.$t('登录网址'), prop: 'loginUrl' },
        { label: this.$t('在线时长'), prop: 'onlineTimeStr' },
        { label: this.$t('IP风险提示'), render(h, row) {
            const obj = {
              0: this.$t('低风险'),
              1: this.$t('高风险'),
              2: this.$t('中风险'),
              10: this.$t('未检测')
            }
            return h('div', obj[row.checkip])
          } },
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
      this.loading = true
      const [res] = await this.$axios.get(systemConfig.urls.windMbrLoginlist, params)
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
