<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="searchTime"
        ref="searchTime"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.startTime"
        :endTime.sync="searchCriteria.keys.endTime"
      />
    </TableSearchBar>
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
      <el-table-column :label="$t('状态')" align="center" slot="auditStatus">
        <template slot-scope="scope">
          <span>{{ transAuditStatus(scope.row.auditStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="payAutomatic === 0" :label="$t('操作')" align="center" slot="operation">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onOpenAuditDialog(scope.row)">{{ scope.row.auditStatus !== 2 ? $t('查看') : $t('审核') }}</el-button>
        </template>
      </el-table-column>
    </TableCom>


    <el-dialog
      :title="curAuditStatus !== 2 ? $t('查看') : $t('审核')"
      :visible.sync="dialogVisible"
      width="20%">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item :label="$t('转款会员')">
          <el-input v-model="form.transLoginName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转款金额')">
          <el-input v-model="form.transAmount" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转前余额')">
          <el-input v-model="form.transBeforeBalance" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转后余额')">
          <el-input v-model="form.transAfterBalance" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('收款会员')">
          <el-input v-model="form.receiptLoginName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('收款金额')">
          <el-input v-model="form.transAmount" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('收前余额')">
          <el-input v-model="form.receiptBeforeBalance" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('收后余额')">
          <el-input v-model="form.receiptAfterBalance" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转帐时间')">
          <el-input v-model="form.createTime" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('审核')">
          <el-select v-model="selectAuditStatus" :disabled="curAuditStatus !== 2">
            <el-option :label="$t('通过')" :value="1"></el-option>
            <el-option :label="$t('拒绝')" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span v-show="curAuditStatus === 2" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onConfirmAudit">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import _ from "lodash"
import queryStore from '../../../mixins/queryStore'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import systemConfig from '../../../config/config.js'
import Mixin from '@/mixins/loadTime'

const { toThousands } = systemConfig

export default {
  name: 'friendTransfer',
  mixins: [Mixin, queryStore(['searchCriteria.keys'])],
  components: {StartAndEndTimeSelector},
  data() {
    return {
      searchCriteria: {
        keys: {
          loginName: null,
          type: null,
          startTime: null,
          endTime: null,
        },
        meta: [
          {
            type: 'text',
            label: this.$t('会员名'),
            prop: 'loginName'
          },
          {
            type: 'select',
            label: this.$t('转账类型'),
            prop: 'type',
            options: [
              {
                label: this.$t('全选'),
                value: null
              },
              {
                label: this.$t('收款'),
                value: 1
              },
              {
                label: this.$t('转款'),
                value: 2
              }
            ]
          },
          {
            label: this.$t('转帐时间'),
            slotName: 'searchTime',
            options: [
              {
                label: this.$t('今日'),
                value: 'today'
              },
              {
                label: this.$t('昨日'),
                value: 'yesterday'
              },
              {
                label: this.$t('前日'),
                value: 'beforeYesterday'
              },
              {
                label: this.$t('本周'),
                value: 'currentWeek'
              },
              {
                label: this.$t('本月'),
                value: 'currentMonth'
              }
            ]
          }
        ]
      },
      tableColumns: [
        {
          type: 'index',
          index: index => {
            const {financialCode} = this.tableData[index]
            if ([this.$t('小计'),this.$t('总计')].includes(financialCode)) {
              return financialCode
            } else {
              return this.pageSize * (this.currentPage - 1) + index + 1
            }
            // if (/^小计|总计$/.test(financialCode)) {
            //   return financialCode
            // } else {
            //   return this.pageSize * (this.currentPage - 1) + index + 1
            // }
          },
          label: this.$t('序号')
        },
        {
          prop: 'transLoginName',
          label: this.$t('转款会员')
        },
        {
          prop: 'transAmount',
          label: this.$t('转款金额'),
          align: 'right',
          class: 'text-color-red'
        },
        {
          prop: 'transBeforeBalance',
          label: this.$t('转前余额'),
          align: 'right'
        },
        {
          prop: 'transAfterBalance',
          label: this.$t('转后余额'),
          align: 'right'
        },
        {
          prop: 'receiptLoginName',
          label: this.$t('收款会员')
        },
        {
          prop: 'transAmount',
          label: this.$t('收款金额'),
          align: 'right',
          class: 'text-color-green'
        },
        {
          prop: 'receiptBeforeBalance',
          label: this.$t('收前余额'),
          align: 'right'
        },
        {
          prop: 'receiptAfterBalance',
          label: this.$t('收后余额'),
          align: 'right'
        },
        {
          prop: 'createTime',
          label: this.$t('转帐时间'),
          width: '90',
        },
        {
          slotName: 'auditStatus',
        },
        {
          slotName: 'operation',
        },
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      dialogVisible: false,
      form: {},
      selectAuditStatus: 1,
      curAuditStatus: null,
      // 1.自动审核 0.手动审核
      payAutomatic: 1,
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
  },
  mounted() {
    if (!this.useQueryStoreCache) {
      this.$refs.searchTime.handleTimeQuickSelect('today')
    }
    this.getTableData()
  },
  activated() {
    this.friendSet()
  },
  methods: {
    onConfirmAudit() {
      const { id } = this.form
      this.$axios.post(systemConfig.urls.friendTransfer.audit, { id, auditStatus: this.selectAuditStatus }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success(this.$t('操作成功'))
          this.dialogVisible = false
          this.getTableData()
        }
      })
    },
    onOpenAuditDialog(row) {
      this.dialogVisible = true
      this.form = row
      this.curAuditStatus = row.auditStatus
      if (row.auditStatus !== 2) {
        this.selectAuditStatus = row.auditStatus
      } else {
        this.selectAuditStatus = 1
      }
    },
    transAuditStatus(val) {
      let s = ''
      if (val === 1) {
        s = this.$t('通过')
      } else if (val === 0) {
        s = this.$t('拒绝')
      } else if (val === 2) {
        s = this.$t('待审核')
      } else {
        s = '-'
      }
      return s
    },
    friendSet() {
      this.$axios.get(systemConfig.urls.systemFriToggleSet).then(({ data }) => {
        const d = data.data
        this.payAutomatic = d.payAutomatic
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      this.$axios.get(systemConfig.urls.friendTransfer.list, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        if(res){
          this.getNetworkLoadAndDataSolveTime(res)
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list.map(item => {
            item.transAmount = toThousands(item.transAmount)
            item.transBeforeBalance = toThousands(item.transBeforeBalance)
            item.transAfterBalance = toThousands(item.transAfterBalance)
            item.receiptBeforeBalance = toThousands(item.receiptBeforeBalance)
            item.receiptAfterBalance = toThousands(item.receiptAfterBalance)
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
/deep/ .el-table__body {
  .text-color-red {
    .cell {
      color: red;
    }
  }
  .text-color-green {
    .cell {
      color: green;
    }
  }
}
</style>
