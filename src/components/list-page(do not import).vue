<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData"/>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @add="handleAdd"
      @remove="handleRemove"
      @reloadData="getTableData"
    >
      <!-- 表格插槽 -->
      <el-table-column fixed="right" align="left" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">[{{ $t('编辑') }}]</el-button>
          <el-button @click="handleRemove(scope.row.id)" type="text" size="small">[{{ $t('删除') }}]</el-button>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchCriteria: {
        keys: {
          depotId: null,
          gameName: null,
          gameNameEn: null,
          gameNameId: null
        },
        meta: [
          {
            type: 'select',
            label: this.$t('游戏平台'),
            prop: 'depotId',
            options: []
          },
          {
            type: 'text',
            label: this.$t('中文名称'),
            prop: 'gameName'
          },
        ]
      },
      tableColumns: [
        {
          type: 'index',
          label: this.$t('序号')
        },
        {
          type: 'selection'
        },
        {
          prop: 'depotName',
          label: this.$t('游戏平台')
        },
        {
          slotName: 'operation'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleAdd(){
      this.$router.push({
        path: '/gamelist/add',
        query: {
          catId: this.catId,
          gameLabel: this.$route.query.type
        }
      })
    },
    handleEdit(id){
      this.$router.push({
        path: '/gamelist/edit',
        query: {id}
      })
    },
    handleRemove(ids){
      this.$axios.post(this.$moduleUrl.gameList.gameSpcialDelete, {ids})
      .then(res => {
        if(res){
          this.getTableData()
        }
      })
    },
    getTableData(){
      this.$axios.get(this.$moduleUrl.gameList.gameSpecialList, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        if(res){
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list
        }
      })
    },
  }
}
</script>
