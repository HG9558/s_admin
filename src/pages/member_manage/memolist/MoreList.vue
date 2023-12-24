<template>
  <div>
    <WindTable :table="{ data: tableData.list }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
  </div>
</template>

<script>
import WindTable from "./WindTable";
import systemConfig from "../../../config/config";
export default {
  name: "MoreList",
  props: ['accountId'],
  components: {
    WindTable
  },
  data() {
    return {
      tableData: {
        list: [],
        totalCount: 0
      },
      params: {
        pageSize: 10,
        pageNo: 1
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('备注时间'), prop:'memoTime' },
        { label: this.$t('备注内容'), prop:'memo' },
        { label: this.$t('操作人'), prop:'markName' }
      ],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSize(val) {
      this.params.pageSize = val
      this.getList()
    },
    handlePage(val) {
      this.params.pageNo = val
      this.getList()
    },
    async getList() {
      const params = {
        _async_: true,
        accountId: this.accountId,
        ...this.params
      }
      this.loading = true
      const [res] = await this.$axios.get(systemConfig.urls.windMemolist, params)
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
