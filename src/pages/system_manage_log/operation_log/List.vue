<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="operationTime"
        :width="460"
        :selections="searchCriteria.meta[1].options"
        :startTime.sync="searchCriteria.keys.createStartTime"
        :endTime.sync="searchCriteria.keys.createEndTime"
        ref="searchTime"
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
    >
      <!-- 表格插槽 -->
      <el-table-column align="center" :label="$t('操作描述')" slot="content" min-width="300px">
        <template slot-scope="scope">
          {{scope.row.content.item + (scope.row.content.afterChange || '')}}
        </template>
      </el-table-column>
    </TableCom>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import systemConfig from '../../../config/config'
import queryStore from '../../../mixins/queryStore'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
export default {
  name: 'logMonitor',
  mixins: [queryStore(['searchCriteria.keys'])],
  components: {StartAndEndTimeSelector},
  data() {
    return {
      searchCriteria: {
        keys: {
          loginName: null,
          createStartTime: `${systemConfig.getCurrentWeek()[0]} 00:00:00`,
          createEndTime: `${systemConfig.getCurrentWeek()[1]} 23:59:59`,
          content: null,
          ip: null,
        },
        meta: [
          {
            type: 'text',
            label: this.$t('管理员账号'),
            prop: 'loginName'
          },
          {
            label: this.$t('操作时间'),
            slotName: 'operationTime',
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
              }
            ]
          },
          {
            type: 'text',
            label: this.$t('操作内容'),
            prop: 'content',
          },
          {
            type: 'text',
            label: this.$t('操作IP'),
            prop: 'ip'
          },
        ]
      },
      tableColumns: [
        {
          type: 'index',
          label: this.$t('序号')
        },
        {
          prop: 'loginName',
          label: this.$t('管理员'),
          width: '150px'
        },
        {
          prop: 'createTime',
          label: this.$t('操作时间'),
          width: '200px'
        },
        {
          prop: 'moduleName',
          label: this.$t('操作模快')
        },
        {
          prop: 'ip',
          label: this.$t('操作IP')
        },
        {
          slotName: 'content'
        },
        // {
        //   prop: 'grade',
        //   label: '终端设备'
        // }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isDialogForAddShow: false,
      isDialogForAuditAgentShow: false,
      parentIdForAdd: null,
      idForAudit: null,
      networkLoadTime: 'loading...',
      dataSolveTime: 'loading...',
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData(obj = {}){
      if (obj.type === 'resetAndSearch') {
        Object.assign(this.$data, this.$options.data())
      }
      const recodeTime = new Date().getTime()
      this.networkLoadTime = 'loading...'
      this.dataSolveTime = 'loading...'
      this.$axios.get(systemConfig.urls.operationLog.list, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys
        }
      })
      .then(res => {
        this.networkLoadTime = ((new Date().getTime() - recodeTime)/1000).toFixed(3) + 's'
        this.dataSolveTime = (res.headers['x-resp-time'].split('ms')[0]/1000).toFixed(3) + 's'
        if(res){
          const {list, totalCount} = res.data.page
          this.totalCount = totalCount
          this.tableData = list.map(item => {
            item.content = JSON.parse(item.content) || {}
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
        }
      })
      .catch(() => {
          this.networkLoadTime = this.$t('加载超时')
          this.dataSolveTime = this.$t('加载超时')
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.intTime {
  position: absolute;
  right: 39px;
  color: #e47470;
  padding-top: 20px;
}

</style>
