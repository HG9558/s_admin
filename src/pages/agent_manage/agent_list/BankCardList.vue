<template>
  <div class="body">
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :hasPagination="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
    >
      <!-- 表格插槽 -->
      <el-table-column align="left" :label="$t('状态')" slot="available">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.available" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row.id, $event)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="left" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <el-button @click="$emit('edit', scope.row)" type="text" size="small">[{{ $t('编辑') }}]</el-button>
          <el-button @click="handleRemove(scope.row.id)" type="text" size="small">[{{ $t('删除') }}]</el-button>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  data() {
    return {
      tableColumns: [
        {
          type: 'index',
          label: this.$t('序号')
        },
        {
          prop: 'realName',
          label: this.$t('开户姓名')
        },
        {
          prop: 'bankName',
          label: this.$t('银行名称')
        },
        {
          prop: 'city',
          label: this.$t('支行地址')
        },
        {
          prop: 'cardNo',
          label: this.$t('银行卡号')
        },
        {
          prop: 'createTime',
          label: this.$t('绑定日期')
        },
        {
          slotName: 'available'
        },
        {
          slotName: 'operation'
        }
      ],
    }
  },
  methods: {
    handleStatusChange(id, available){
      this.$axios.post('bkapi/agent/account/agyBankAvailable', {id, available})
    },
    handleRemove(id){
      this.$axios.get('bkapi/agent/account/agyBankDelete', {params: {id}})
      .then(res => {
        if(res){
          this.$emit('reloadData')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .table-operation-btns-wrapper{
  display: none;
}
</style>
