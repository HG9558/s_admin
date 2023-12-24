<template>
  <div class="transfer">
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="onReload"
      ref="searchCom"
    >
    </TableSearchBar>
    <TableCom
      v-loading="loading"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
      @add="onAdd"
    >
    </TableCom>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          agentName: null,
          userName: null,
        },
        meta: [
          {
            type: 'text',
            label: this.$t('会员名'),
            prop: 'username',
          },
          {
            type: "text",
            label: this.$t('星级'),
            prop: 'level',
          },
        ],
      },
      tableData: [
        {
          username: '233',
          username: '233',
          username: '233',
          username: '233',
        }
      ],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 50 },
        {
          prop: 'username',
          label: this.$t('会员名'),
        },
        {
          prop: "level",
          label: this.$t('会员星级'),
        },
        {
          prop: "level",
          label: this.$t('转出权限'),
        },
        {
          prop: 'level',
          label: this.$t('转入权限'),
        },
        {
          label: this.$t('操作'),
          render: (h, row) => h('div', [
            h('el-button', { props: { size: 'mini' }, on: { click: () => { this.onEdit(row) } } }, this.$t('修改')),
            h('el-button', { props: { size: 'mini' }, on: { click: () => { this.onDel(row) } } }, this.$t('删除')),
          ]),
        },
      ],
      loading: false,
    }
  },
  methods: {
    onDel(row) {
      console.log('onDel')
    },
    onEdit(row) { },
    onAdd() { },
    onReload({ type }) {
      this.getTableData()
    },
    getTableData() { },
  },
}
</script>

<style>
</style>