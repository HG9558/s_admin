<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        ref="statisticsTime"
        slot="statisticsTime"
        :width="470"
        :left="100"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.waterStart"
        :endTime.sync="searchCriteria.keys.waterEnd"
      />
      <StartAndEndTimeSelector
        ref="createTime"
        slot="createTime"
        :left="105"
        :selections="searchCriteria.meta[1].options"
        :startTime.sync="searchCriteria.keys.applicationTimeStart"
        :endTime.sync="searchCriteria.keys.applicationTimeEnd"
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
      <el-table-column fixed="right" align="center" :label="$t('发放统计')" slot="bonusStatistics">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.statisticsPending">{{ $t('待审核') }}{{scope.row.statisticsPending}}</el-tag>
          <el-tag type="success" v-if="scope.row.statisticsApproved">{{ $t('通过') }}{{scope.row.statisticsApproved}}</el-tag>
          <el-tag type="danger" v-if="scope.row.statisticsRejection">{{ $t('拒绝') }}{{scope.row.statisticsRejection}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" v-if="permissions.auditList">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="permissions.auditList"
            @click="jumpToDetail(scope.row)"
          >
            [{{ $t('查看') }}]
          </el-button>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import queryStore from '../../../mixins/queryStore'
import systemConfig from '../../../config/config.js'
import { mapGetters } from 'vuex'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

const { toThousands } = systemConfig

export default {
  name: 'waterRebateList',
  components: {
    StartAndEndTimeSelector
  },
  mixins: [site, Mixin, queryStore(['searchCriteria.keys'])],
  data() {
    return {
      searchCriteria: {
        keys: {
          waterStart: null,
          waterEnd: null,
          applicationTimeStart: null,
          applicationTimeEnd: null
        },
        meta: [
          {
            label: this.$t('统计范围'),
            slotName: 'statisticsTime',
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
            label: this.$t('生成时间'),
            slotName: 'createTime',
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
        ]
      },
      tableColumns: [
        {
          type: 'index',
          label: this.$t('序号')
        },
        {
          prop: 'activityName',
          label: this.$t('活动名称')
        },
        {
          prop: 'totalBonus',
          // label: '发放总额(元)',
          label: this.$t('发放总额') + '(' + this.currencyText() + ')',
          align: 'right'
        },
        {
          prop: 'totalBonusAudit',
          // label: '实际发放(元)',
          label: this.$t('实际发放') + '(' + this.currencyText() + ')',
          align: 'right'
        },
        {
          prop: 'statisticsTime',
          label: this.$t('统计范围'),
          width: '370'
        },
        {
          prop: 'applicationTime',
          label: this.$t('生成时间')
        },
        {
          slotName: 'bonusStatistics'
        },
        {
          slotName: 'operation'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
    permissions() {
      const { hasPermission } = this
      return {
        auditList: hasPermission('operate:activity:waterAuditListIssue')
      }
    },
    ...mapGetters(['hasPermission'])
  },
  mounted() {
    // if (!this.useQueryStoreCache) {

    // }
    this.getTableData()
  },
  methods: {
    jumpToDetail({ id, activityName}) {
      this.$router.push({
        path: '/main/marketActivity/waterRebateList/detail',
        query: {
          waterdateid: id,
          activityName: activityName.replace(/%/g, '%25')
        }
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      this.$axios.get(systemConfig.urls.waterRebateList.list, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        if(res){
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list.map(item => {
            const { waterStart, waterEnd, applicationTime } = item
            const shouldToThousandsFileds = ['totalBonus', 'totalBonusAudit']
            for (const field of shouldToThousandsFileds) {
              item[field] = toThousands(item[field])
            }
            item.waterStart = systemConfig.transferTimeByType(waterStart, 'bj')
            item.waterEnd = systemConfig.transferTimeByType(waterEnd, 'bj')
            item.applicationTime = systemConfig.transferTimeByType(applicationTime, 'bj')
            item.statisticsTime = item.waterStart && item.waterEnd && `${item.waterStart} ~ ${item.waterEnd}`
            return item
          })
        }
      })
    },
  }
}
</script>
