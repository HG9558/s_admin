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
      <el-table-column align="left" :label="$t('会员名')" slot="loginName">
        <template slot-scope="scope">
          {{scope.row.loginName}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column align="left" :label="$t('来源好友')" slot="count">
        <template slot-scope="scope">
          <el-button style="padding: 0!important;" @click="goToDetail(scope.row.loginName, scope.row.createTime,scope.row.auditId)" type="text" size="small" v-if="scope.row.count">{{scope.row.count}}</el-button>
          <template v-else>
            {{scope.row.count}}
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="left" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          {{statusMapper[scope.row.status]}}
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import queryStore from '../../../mixins/queryStore'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import systemConfig from '../../../config/config.js'
import Mixin from '@/mixins/loadTime'


export default {
  name: 'rebateList',
  mixins: [Mixin, queryStore(['searchCriteria.keys'])],
  components: {StartAndEndTimeSelector},
  data() {
    return {
      searchCriteria: {
        keys: {
          groupId: null,
          loginName: null,
          /* status: 1, */
          financialCode: 'FA',
          startTime: null,
          endTime: null,
        },
        meta: [
          {
            label: this.$t('发放时间'),
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
          },
          {
            slotName: 'loginName'
          },
          {
            type: 'select',
            label: this.$t('会员组'),
            prop: 'groupId',
            options: []
          },
          {
            type: 'text',
            label: this.$t('会员名'),
            prop: 'loginName'
          },
          /* {
            type: 'select',
            label: '状态',
            prop: 'status',
            options: [
              {
                label: '全部',
                value: null
              },
              {
                label: '通过',
                value: 1
              },
              {
                label: '待处理',
                value: 2
              },
              {
                label: '拒绝',
                value: 0
              }
            ]
          }, */
          {
            type: 'select',
            label: this.$t('返利类型'),
            prop: 'financialCode',
            options: [
              {
                label: this.$t('全部'),
                value: null
              },
              {
                label: this.$t('好友返利'),
                value: 'FA'
              },
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
          },
          label: this.$t('序号')
        },
        {
          prop: 'loginName',
          label: this.$t('会员名')
        },
        {
          prop: 'groupName',
          label: this.$t('会员组')
        },
        {
          prop: 'rebateType',
          label: this.$t('返利类型')
        },
        {
          prop: 'rebateAmount',
          label: this.$t('返利金额')
        },
        {
          prop: 'startday',
          label: this.$t('统计区间') + '(GMT-8)'
        },
        {
          slotName: 'count'
        },
        {
          prop: 'createTime',
          label: this.$t('发放时间')
        },
        {
          slotName: 'status'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      statusOptions:[
        {
          label: this.$t('通过'),
          value: 1
        },
        {
          label: this.$t('待处理'),
          value: 2
        },
        {
          label: this.$t('拒绝'),
          value: 0
        }
      ]
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
    statusMapper() {
      const mapper = {}
      this.statusOptions.forEach(item => {
        if (item.value !== null) {
          mapper[item.value] = item.label
        }
      })
      return mapper
    },
    financialCodeMapper() {
      const mapper = {}
      this.searchCriteria.meta[4].options.forEach(item => {
        if (item.value !== null) {
          mapper[item.value] = item.label
        }
      })
      return mapper
    }
  },
  mounted() {
    if (!this.useQueryStoreCache) {
      this.$refs.searchTime.handleTimeQuickSelect('today')
    }
    this.getGroupList()
    this.getTableData()
  },
  methods: {
    goToDetail(loginName, createTime, auditId) {
      const date = createTime.slice(0, 10)
      this.$router.push({
        path: '/main/operateManage/rebateList/detail',
        query: {
          status: this.searchCriteria.keys.status,
          groupId: null,
          loginName: null,
          referrer: loginName,
          startTime: date + ' 00:00:00',
          endTime: date + ' 23:59:59',
          auditId: auditId
        }
      })
    },
    getGroupList() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then(res => {
        this.searchCriteria.meta[2].options = [
          {
            label: this.$t('全部'),
            value: null
          },
          ...res.data.page.map(item => {
            return {
              label: item.groupName,
              value: item.id
            }
          })
        ]
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      this.$axios.get(systemConfig.urls.getRebateList, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        if(res){
          this.totalCount = res.data.data.totalCount
          this.tableData = res.data.data.list.map(item => {
            item.rebateType = this.financialCodeMapper[item.financialCode]
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
        }
      })
    },
  }
}
</script>
