<template>
  <el-dialog :title="`${$t('个人明细')}--${personalDetails.loginName}`" :visible="visible" @close="handleClose">
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :hasPagination="false"
      :tableData="personalDetails.tableData"
      :tableColumns="tableColumns"
    >
    
    </TableCom>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('关闭') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>

export default {
  props: ['visible', 'personalDetails'],
  data() {
    return {
      tableColumns: [
        {
          prop: 'catName',
          label: this.$t('游戏类型'),
          width: 100
        },
        {
          prop: 'depotName',
          label: this.$t('游戏平台')
        },
        {
          prop: 'validbet',
          label: this.$t('有效投注')
        },
        {
          prop: 'paidAmount',
          label: this.$t('已发放')
        },
        {
          prop: 'amount',
          label: this.$t('返水金额')
        },
        {
          prop: 'time',
          label: this.$t('最后更新时间')
        }
      ]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>