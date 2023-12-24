<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        ref="searchTime"
        slot="searchTime"
        :width="450"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.waterStart"
        :endTime.sync="searchCriteria.keys.waterEnd"
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
      :table-btns="[{ event: 'export', text: $t('导出'), icon: 'iconfont icon-export el-button-export', loading: exportLoading, disabled: !this.tableData.length }]"
      @reloadData="getTableData"
      @export="handleExport"
      :tableLoading="loading"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <!-- 表格插槽 -->
      <el-table-column fixed="right" align="center" :label="$t('发放统计')" slot="bonusStatistics">
        <template slot-scope="scope">
          <!-- <el-tag type="warning" v-if="scope.row.noaudit">待审核{{scope.row.noaudit}}</el-tag>
          <el-tag type="success" v-if="scope.row.pass">通过{{scope.row.pass}}</el-tag>
          <el-tag type="danger" v-if="scope.row.reject">拒绝{{scope.row.reject}}</el-tag> -->
          <el-tag type="warning">{{ $t('待审核') }}{{scope.row.noaudit}}</el-tag>
          <el-tag type="success">{{ $t('通过') }}{{scope.row.pass}}</el-tag>
          <el-tag type="danger">{{ $t('拒绝') }}{{scope.row.reject}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" v-if="permissions.audit">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="permissions.audit"
            @click="jumpToDetail(scope.row)"
          >
            [{{ $t('优惠发放管理') }}]
          </el-button>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import queryStore from '../../../mixins/queryStore'
import systemConfig from '../../../config/config.js'
import fileExport from '../../../mixins/fileExport'
import { mapGetters } from 'vuex'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import Mixin from '@/mixins/loadTime'

const { toThousands } = systemConfig

export default {
  name: 'bonusList',
  components: {
    StartAndEndTimeSelector
  },
  mixins: [Mixin, queryStore(['searchCriteria.keys']), fileExport],
  data() {
    return {
      loading: false,
      searchCriteria: {
        keys: {
          activityName: null,
          actIds: [],
          loginName: null,
          status: null,
          useStart: null,
          useEnd: null,
          useStateList: [],
        },
        meta: [
          {
            type: 'text',
            label: this.$t('活动名称'),
            prop: 'activityName'
          },
          {
            type: 'select',
            label: this.$t('活动类别'),
            prop: 'actIds',
            options: [],
            multiple: true
          },
          {
            type: 'text',
            label: this.$t('会员名'),
            prop: 'loginName'
          },
          {
            width: '140px',
            type: 'select',
            label: this.$t('状态'),
            prop: 'status',
            options: [
              {
                label: this.$t('待审核'),
                value: 2
              },
              {
                label: this.$t('通过'),
                value: 1
              },
              {
                label: this.$t('拒绝'),
                value: 0
              }
            ],
            clearable: true
          },
          {
            label: this.$t('活动时间'),
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
            type: 'select',
            label: this.$t('活动状态'),
            prop: 'useStateList',
            options: [
              {
                label: this.$t('未开始'),
                value: 0
              },
              {
                label: this.$t('进行中'),
                value: 1
              },
              {
                label: this.$t('已失效'),
                value: 2
              },
            ],
            multiple: true
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
          prop: 'catName',
          label: this.$t('活动类别')
        },
        {
          prop: 'activityTime',
          label: this.$t('活动时间')
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
      totalCount: null,
      exportLoading: false,
      activityCategories: []
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
    permissions() {
      const { hasPermission } = this
      return {
        audit: hasPermission('operate:activity:activityAuditList')
      }
    },
    ...mapGetters(['hasPermission'])
  },
  created() {
    const routeQuery = this.$route.query
    const str = routeQuery.status || ''
    const loginName = routeQuery.loginName || ''
    this.$set(this.searchCriteria.keys, 'status', str ? Number(str) : '')
    this.$set(this.searchCriteria.keys, 'loginName', loginName)
  },
  mounted() {
    this.getTableData()
    this.getActivityCategories()
  },
  methods: {
    async handleExport() {
      const { actIds, useStateList, status, loginName } = this.searchCriteria.keys
      this.searchCriteria.keys['useStart']=this.searchCriteria.keys['waterStart']
      this.searchCriteria.keys['useEnd']=this.searchCriteria.keys['waterEnd']
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
        actIds: actIds && actIds.join(','),
        useStateList: useStateList && useStateList.join(','),
        loginName,
        status
      }
      this.exportLoading = true
      const { res } = await this.$axios.GET(this.$urls.bonusList.allActivityAuditListExport, params)
      if (res) {
        await this.agentCheckFile('allActivityAuditListExport', this.$urls.bonusList.checkFile)
      }
      this.exportLoading = false
    },
    jumpToDetail({ id: activityId, activityName, useState, tmplCode}) {
      const {loginName} = this.searchCriteria.keys
      this.$router.push({
        path: '/main/marketActivity/bonusList/detail',
        query: {
          activityId,
          activityName: activityName.replace(/%/g, '%25'),
          useState,
          tmplCode,
          ...this.queryStatus
        }
      })
    },
    getActivityCategories() {
      this.$axios.get(systemConfig.urls.activityCategory.listAll)
      .then(res => {
        this.searchCriteria.meta.find(item => item.prop === 'actIds').options = res.data.page.map(item => {
          return {
            label: item.catName,
            value: item.id
          }
        })
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      const { actIds, useStateList, status, loginName } = this.searchCriteria.keys
      this.searchCriteria.keys['useStart']=this.searchCriteria.keys['waterStart']
      this.searchCriteria.keys['useEnd']=this.searchCriteria.keys['waterEnd']
      this.loading = true
      this.$axios.get(systemConfig.urls.bonusList.list, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys,
          actIds: actIds && actIds.join(','),
          useStateList: useStateList && useStateList.join(','),
          loginName,
          status
        }
      })
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        this.loading = false
        if(res){
          const { loginName, status} = JSON.parse(JSON.stringify(this.searchCriteria.keys))
          this.queryStatus = {loginName, status: String(status)}
          this.totalCount = res.data.data.totalCount
          this.tableData = res.data.data.list.map(item => {
            item.useStart = systemConfig.transferTimeByType(item.useStart, 'bj')
            item.useEnd = systemConfig.transferTimeByType(item.useEnd, 'bj')
            item.activityTime = item.useStart && item.useEnd && `${item.useStart} ~ ${item.useEnd}`
            return item
          })
        }
      })
    },
  },
  watch : {
    '$route.query.status'(n, o) {
      this.$set(this.searchCriteria.keys, 'status', String(n) ? Number(n) : null)
    }
  }
}
</script>
