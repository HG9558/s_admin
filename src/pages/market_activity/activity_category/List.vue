<template>
  <div>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :hasPagination="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <el-button v-if="hasPermission('operate:activitycat:save')" type="primary" size="small" @click="handleAdd">{{ $t('新增分类') }}</el-button>
      <el-table-column fixed="right" align="center" :label="$t('是否启用')" slot="available">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            :disabled="!hasPermission('operate:activitycat:updateAvailable')"
            v-model="scope.row.available"
            @change="handleAvailableChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('前端是否启展示')" slot="disable">
        <template slot-scope="scope">
          {{[$t('否'), $t('是')][scope.row.disable]}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('operate:activitycat:update')" @click="handleEdit(scope.row)" type="text" size="small">[{{ $t('编辑') }}]</el-button>
          <el-button v-if="!scope.row.available && hasPermission('operate:activitycat:delete')" @click="handleDelete(scope.row.id)" type="text" size="small">[{{ $t('删除') }}]</el-button>
        </template>
      </el-table-column>
    </TableCom>
    <Form
      ref="form"
      v-if="formVisible"
      :infoForEdit="infoForEdit"
      :formVisible.sync="formVisible"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import systemConfig from '../../../config/config'
import Form from './Form'
import { mapGetters } from 'vuex'
import Mixin from '@/mixins/loadTime'


export default {
  mixins: [Mixin],
  name: 'activityCategory',
  components: {
    Form
  },
  data() {
    return {
      tableColumns: [
        {
          prop: 'sort',
          label: this.$t('前台排序号'),
          width: '100'
        },
        {
          prop: 'catName',
          label: this.$t('分类名称')
        },
        {
          prop: 'createTime',
          label: this.$t('创建时间')
        },
        {
          slotName: 'available'
        },
        {
          slotName: 'disable'
        },
        {
          slotName: 'operation'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      formVisible: false,
      infoForEdit: null,
    }
  },
  computed: {
    ...mapGetters(['hasPermission'])
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleAvailableChange(data) {
      this.$axios.post(systemConfig.urls.activityCategory.available, data)
      .finally(() => {
        this.getTableData()
      })
    },
    handleDelete(id) {
      this.$axios.post(systemConfig.urls.activityCategory.delete, {id})
      .then(() => {
        this.getTableData()
      })
    },
    handleSubmit(formModel) {
      if (formModel.id) {// 编辑
        this.$axios.post(systemConfig.urls.activityCategory.update, formModel)
        .then(() => {
          this.formVisible = false
          this.getTableData()
        })
      } else {// 新增
        this.$axios.post(systemConfig.urls.activityCategory.save, formModel)
        .then(() => {
          this.formVisible = false
          this.getTableData()
        })
      }
    },
    handleEdit(row) {
      this.infoForEdit = row
      this.formVisible = true
    },
    handleAdd() {
      this.infoForEdit = null
      this.formVisible = true
    },
    getTableData(){
      this.getCurrentRecodeTime()
      this.$axios.get(systemConfig.urls.activityCategory.list)
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        if(res){
          this.tableData = res.data.data.map(item => {
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.member-promotion-condition {
  text-align: center;
  white-space: pre-wrap;
}
</style>
