<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="applyTime"
        :selections="searchCriteria.meta[4].options"
        :startTime.sync="searchCriteria.keys.createTimeFrom"
        :endTime.sync="searchCriteria.keys.createTimeTo"
      />
    </TableSearchBar>
    <!-- 今日提款 -->
    <h4 class="sumWithdraw">{{ $t('今日提款') }}：{{sumWithdraw}}</h4>
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
    >
      <!-- 表格插槽 -->
      <el-table-column align="left" fixed="left" :label="$t('订单号')" slot="orderNo">
        <template slot-scope="scope">
          <el-button @click="handleAudit(scope.row.id)" type="text" size="small" :title="$t('审核')">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" :label="$t('账户名')" slot="agyAccount">
        <template slot-scope="scope">
          <el-button @click="goToAgentDetail(scope.row.accountId, scope.row.agyAccount)" type="text" size="small">{{scope.row.agyAccount}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          {{{0: $t('拒绝'), 1: $t('通过'), 2: $t('初审'), 3: $t('复审')}[scope.row.status]}}
        </template>
      </el-table-column>
    </TableCom>
    <Audit :id="idForAudit" :isAuditShow.sync="isAuditShow" @checkList="handleCheckList" v-if="isAuditShow"/>
  </div>
</template>

<script>
import systemConfig from '../../../config/config'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import Audit from './Audit'
export default {
  components: {StartAndEndTimeSelector, Audit},
  data() {
    return {
      searchCriteria: {
        keys: {
          orderNo: null,
          auditUser: null,
          agyAccount: null,
          status: null,
          createTimeFrom: null,
          createTimeTo: null
        },
        meta: [
          {
            type: 'text',
            label: this.$t('订单号'),
            prop: 'orderNo'
          },
          {
            type: 'text',
            label: this.$t('审核人'),
            prop: 'auditUser'
          },
          {
            type: 'text',
            label: this.$t('代理'),
            prop: 'agyAccount'
          },
          {
            type: 'select',
            label: this.$t('状态'),
            prop: 'status',
            options: [
              {
                label: this.$t('拒绝'),
                value: 0
              },
              {
                label: this.$t('通过'),
                value: 1
              },
              {
                label: this.$t('初审'),
                value: 2
              },
              {
                label: this.$t('复审'),
                value: 3
              }
            ]
          },
          {
            label: this.$t('申请时间'),
            slotName: 'applyTime',
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
                label: this.$t('上周'),
                value: 'lastWeek'
              },
            ]
          }
        ]
      },
      tableColumns: [
        {
          slotName: 'orderNo',
        },
        {
          slotName: 'agyAccount',
        },
        {
          prop: 'drawingAmount',
          label: this.$t('提款金额')
        },
        {
          prop: 'handlingCharge',
          label: this.$t('手续费')
        },
        {
          prop: 'actualArrival',
          label: this.$t('实际出款')
        },
        {
          prop: 'createTime',
          label: this.$t('申请时间'),
          width: '180px'
        },
        {
          prop: 'ip',
          label: '申请IP'
        },
        {
          slotName: 'status',
        },
        {
          prop: 'auditUser',
          label: this.$t('审核人')
        },
        {
          prop: 'auditTime',
          label: this.$t('审核时间'),
          width: '180px'
        },
        {
          prop: 'passUser',
          label: this.$t('出款人')
        },
        {
          prop: 'passTime',
          label: this.$t('出款时间'),
          width: '180px'
        },
        {
          prop: 'memo',
          label: this.$t('备注')
        },
        // {
        //   slotName: 'operation'
        // }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      sumWithdraw: null,
      idForAudit: null,
      isAuditShow: false
    }
  },
  mounted() {
    this.getTableData()
    this.getSumWithdraw()
  },
  methods: {
    handleCheckList(agyAccount){
      this.searchCriteria.keys.agyAccount = agyAccount
      this.getTableData()
    },
    handleAudit(id){
      this.idForAudit = id
      this.isAuditShow = true
    },
    goToAgentDetail(id, agyAccount){
      this.$router.push({
        path: '/main/agentManage/agentList',
        query: {id, agyAccount, component: 'Detail'}
      })
    },
    getSumWithdraw(){
      this.$axios.get('bkapi/agent/withdraw/sumWithdraw')
      .then(res => {
        this.sumWithdraw = res.data.data
      })
    },
    getTableData(){
      this.$axios.get('bkapi/agent/withdraw/withdrawList', {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        if(res){
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list.map(item => {
            item.passTime = systemConfig.transferTimeByType(item.passTime, 'bj')
            item.auditTime = systemConfig.transferTimeByType(item.auditTime, 'bj')
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sumWithdraw{
  color: #666;
  font-size: 14px;
  position: relative;
  top: 22px;
}
</style>

