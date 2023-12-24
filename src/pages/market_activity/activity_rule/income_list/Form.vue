<template>
  <el-dialog :visible="formVisible" :title="data.loginName"  :close-on-click-modal="false" @close="handleClose">
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="pageNo"
      :tableLoading="loading"
      @reloadData="getList"
      hasLayout="total, prev, pager, next, jumper"
    >
        <el-table-column fixed="right" align="center" :label="$t('操作')" slot="status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">{{ $t('已发放') }}</el-tag>
            <el-tag type="danger" v-else>{{ $t('失败') }}</el-tag>
          </template>
        </el-table-column>
    </TableCom>
    <div class="total-text" style="transform: translateY(-22px)">
      {{ $t('累计发放') }}：
      <span style="color: red;">{{this.total}}</span>
    </div>
  </el-dialog>
</template>

<script>
import systemConfig from '@/config/config'

export default {
  name: 'IncomeForm',
  props: ['formVisible', 'data'],
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      loading: false,
      totalCount: 0,
      tableColumns: [
        { label: this.$t('统计时间'), prop: 'createTime' },
        { label: this.$t('发放时间'), prop: 'giveOutTime' },
        { label: this.$t('发放金额'), prop: 'actualReward' },
        { label: this.$t('类型'), render: (h, row, scope) => h('span', this.getTypeName(row.type)) },
        { slotName: 'status'  }
      ],
      total: null,
    }
  },
  created() {
    this.getList()
    this.getTotal()
  },
  methods: {
    getList() {
      this.loading = true
      const { pageNo, pageSize } = this
      this.$axios.get(systemConfig.urls.getIncomeDetailList, {
        params: {
          loginName: this.data.loginName,
          pageNo,
          pageSize,
        }
      }).then(res => {
        if (res) {
          this.totalCount = res.data.page.totalCount
          this.pageNo = res.data.page.currPage
          const list = res.data.page.list
          list.map(item => {
            item.actualReward = this.toThousands(item.actualReward)
          })
          this.tableData = res.data.page.list
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toThousands(money) {
      if (money === 0) return 0
      return systemConfig.toThousands(money);
    },
    getTotal() {
      this.$axios.get(systemConfig.urls.getIncomeTotal, {
        params: {
          loginName: this.data.loginName,
        }
      }).then(({ data }) => {
        if (data.msg === 'success') {
          this.total = data.total
        }
      })
    },
    handleClose() {
      this.$emit('update:formVisible', false)
    },
    getTypeName(type) {
      switch(type) {
        case 3:
          return this.$t('首充收益')
        case 4:
          return this.$t('有效投注收益')
        case 5:
          return this.$t('好友VIP等级收益')
        case 6:
          return this.$t('好友充值收益')
        default:
          return ''
      }
    },
  }
}
</script>

<style>
.total-text {
  width: 300px;
  display: inline-block;
}
</style>
