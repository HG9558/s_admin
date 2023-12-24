<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom"></TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"

    >
      <!-- 表格插槽 -->
      <el-table-column align="center" :label="$t('站内信')" slot="inMail" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input type="textarea" autosize v-model="modifyObj.value" v-if="modifyObj.column === 'inMail' && modifyObj.index === scope.$index" @click.native.stop></el-input>
          <el-button :disabled="!permissions.edit" @click.stop="handleEdit({index: scope.$index, column: 'inMail', value: scope.row.inMail})" :title="$t('点击修改')" type="text" size="small" v-else>{{scope.row.inMail}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('是否启用')" slot="state" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="2"
            :disabled="!permissions.status"
            @change="toggleState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog
      :title="$t('提示')"
      width="25%!important"
      :visible.sync="isConfirmShow"
      :close-on-click-modal="false"
      @close="modifyObj = {}"
      @click.native.stop
    >
      {{ $t('是否保存已编辑模板信息？') }}
      <span slot="footer">
				<el-button @click="isConfirmShow = false">{{ $t('取消') }}</el-button>
				<el-button type="primary" @click="handleSave">{{ $t('保存') }}</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from '../../config/config.js'
import queryStore from '../../mixins/queryStore'
import {mapGetters} from 'vuex'
import Mixin from '@/mixins/loadTime'

export default {
  name: 'messageTemplate',
  mixins: [Mixin, queryStore(['searchCriteria.keys'])],
  data() {
    return {
      searchCriteria: {
        keys: {
          msgTypes: [],
          states: []
        },
        meta: [
          {
            type: 'select',
            label: this.$t('信息类型'),
            prop: 'msgTypes',
            multiple: true,
            options: []
          },
          {
            type: 'select',
            label: this.$t('状态'),
            prop: 'states',
            multiple: true,
            options: [
              {
                label: this.$t('启用'),
                value: 1
              },
              {
                label: this.$t('禁用'),
                value: 2
              }
            ]
          },
        ]
      },
      tableColumns: [
        {
          label: this.$t('序号'),
          type: 'index',
          fixed: 'left'
        },
        {
          label: this.$t('信息类型'),
          prop: 'msgName',
          width: '180',
          fixed: 'left'
        },
        {
          slotName: 'inMail'
        },
        {
          slotName: 'email'
        },
        {
          slotName: 'phoneMail'
        },
        {
          slotName: 'state'
        },
        {
          prop: 'modifyTime',
          label: this.$t('最近更新日期'),
          width: '200',
          fixed: 'right'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      infoTypeList: [],
      isConfirmShow: false,
      modifyObj: {
        column: null,
        index: null,
        value: null
      }
    }
  },
  computed: {
    ...mapGetters(['hasPermission']),
    permissions() {
      const { hasPermission } = this
      return {
        edit: hasPermission('msgtemple:msgtemple:update'),
        status:hasPermission('msgtemple:msgtemple:available')
      }
    }
  },
  mounted() {
    this.getInfoTypes()
    this.getTableData()
    document.addEventListener('click', this.confirm)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.confirm)
  },
  methods: {
    toggleState(row) {
      this.$axios.post(systemConfig.urls.msgtempleUpdate, row).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('状态修改成功')
        })
      })
    },
    handleSave() {
      const {column, value, index} = this.modifyObj
      this.$axios.post(systemConfig.urls.msgtempleUpdate, {
        ...this.tableData[index],
        [column]: value
      })
      .then(res => {
        if (res) {
          this.$message.success(this.$t('修改成功'))
          this.isConfirmShow = false
          this.tableData[index][column] = value
          this.getTableData()
        }
      })
    },
    confirm() {
      const {column, value, index} = this.modifyObj
      if (column) {
        if (value !== this.tableData[index][column]) {
          if (value) {
            this.isConfirmShow = true
          } else {
            this.$message.error(this.$t('内容不能为空'))
          }
        } else {
          this.modifyObj = {}
        }
      }
    },
    handleEdit(modifyObj) {
      if (this.modifyObj.column) {
        this.confirm()
      } else {
        this.modifyObj = modifyObj
      }
    },
    getInfoTypes() {
      this.$axios.get(systemConfig.urls.msgtempleListAll)
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        this.searchCriteria.meta[0].options = this.infoTypeList = res.data.list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      const keys = JSON.parse(JSON.stringify(this.searchCriteria.keys))
      for (let i in keys) {
        if (Array.isArray(keys[i])) {
          keys[i] = keys[i].join(',')
        }
      }
      this.$axios.get(systemConfig.urls.msgtempleQueryByConditions, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...keys
        }
      })
      .then(res => {
        if(res){
          this.getNetworkLoadAndDataSolveTime(res)
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list.map(item => {
            item.modifyTime = systemConfig.transferTimeByType(item.modifyTime, 'bj')
            return item
          })
        }
      })
    },
  }
}
</script>
