<template>
  <TableCom
    :hasAddBtn="false"
    :hasRemoveBtn="false"
    :tableData="tableData"
    :totalCount="totalCount"
    :pageSize.sync="pageSize"
    :tableColumns="tableColumns"
    :currentPage.sync="currentPage"
    hasLayout="total, prev, pager, next, jumper"
    @reloadData="getTableData"
    :showLoadTime="true"
    :networkLoadTime="networkLoadTime"
    :dataSolveTime="dataSolveTime"
  >
  </TableCom>
</template>

<script>
import systemConfig from '../../config/config'
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  props: ['accountId'],
  data() {
    return {
      pageSize: 5,
      tableData: [],
      currentPage: 1,
      totalCount: null,
    }
  },
  computed: {
    tableColumns() {
      return [
        {
          prop: 'createTime',
          label: this.$t('调整日期'),
        },
        {
          prop: 'moduleName',
          label: this.$t('变更方式'),
          width: '120',
        },
        {
          prop: 'changedContent',
          label: this.$t('变更内容'),
        },
      ]
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.getCurrentRecodeTime()
      this.$axios.get(systemConfig.urls.memberLevel.accountAutoLog, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          accountId: this.accountId,
        },
      })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          const { list, totalCount  } = res.data.page

          this.tableData = list.map((item) => {
            const { afterChange } = JSON.parse(item.content)

            item.changedContent = afterChange
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
          this.totalCount = totalCount
        })
    },
  },
}
</script>
