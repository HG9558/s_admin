<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData">
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
      <h3 class="rebate-detail-title" slot="slot-title">{{ $t('返利列表详情') }}</h3>
      <el-button @click="$router.go(-1)">{{ $t('返回') }}</el-button>
      <!-- 表格插槽 -->
      <el-table-column align="left" :label="$t('会员名')" slot="loginName">
        <template slot-scope="scope">
          {{scope.row.loginName}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
<!--      <el-table-column align="left" label="输赢" slot="totalResult">-->
<!--        <template slot-scope="scope">-->
<!--          {{scope.row.totalResult}}-->
<!--        </template>-->
<!--      </el-table-column>-->


      <el-table-column align="left" :label="$t('有效投注额')" slot="validBet">
        <el-table-column :label="item.catName" v-for="item in gameTypeList" :key="item.id">
          <template slot-scope="scope">
            {{scope.row[String(item.id)] || 0}}
          </template>
        </el-table-column>
      </el-table-column>



      <!-- <el-table-column fixed="right" align="left" label="操作" slot="operation">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">[编辑]</el-button>
          <el-button @click="handleRemove(scope.row.id)" type="text" size="small">[删除]</el-button>
        </template>
      </el-table-column> -->
    </TableCom>
  </div>
</template>

<script>
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import systemConfig from '../../../config/config.js'
export default {
  components: {StartAndEndTimeSelector},
  data() {
    return {
      searchCriteria: {
        keys: {
          loginName: null,
          groupId: null,
          referrer: null,
          status: null,
          financialCode: null,
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
            type: 'text',
            label: this.$t('会员名'),
            prop: 'loginName'
          },
          {
            type: 'select',
            label: this.$t('会员组'),
            prop: 'groupId',
            options: []
          },
          {
            type: 'text',
            label: this.$t('推荐人'),
            prop: 'referrer'
          },
          // {
          //   type: 'text',
          //   label: '输赢',
          //   prop: 'totalResult'
          // },
          {
            type: 'select',
            label: this.$t('状态'),
            prop: 'status',
            options: [
              {
                label: this.$t('全部'),
                value: null
              },
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
          },
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
            if (/^小计|总计$/.test(financialCode)) {
              return financialCode
            } else {
              return this.pageSize * (this.currentPage - 1) + index + 1
            }
          },
          label: this.$t('序号')
        },
        {
          prop: 'groupName',
          label: this.$t('会员组')
        },
        {
          slotName: 'loginName',
        },
        {
          prop: 'referrer',
          label: this.$t('推荐人')
        },
        // {
        //   prop: 'totalResult',
        //   label: '输赢'
        // },
        {
          slotName: 'validBet'
        },
        {
          prop: 'startday',
          label: this.$t('统计区间(GMT-8)')
        },
        {
          prop: 'depth',
          label: this.$t('会员层级')
        },
        {
          prop: 'contributeAmount',
          label: this.$t('贡献返利')
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      gameTypeList: []
    }
  },
  computed: {
    statusMapper() {
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
    this.$store.state.indexActive = '4-2-1'
    const query = this.$route.query
    for (var i in query) {// 将纯数字的字符串转化为Number类型
      this.searchCriteria.keys[i] = /^\d$/.test(query[i]) ? Number(query[i]) : query[i]
    }
    if(!this.$store.state.sanGongFlg){
        this.tableColumns.push({
            prop: 'totalResult',
            label: this.$t('输赢')
        })
    }
    this.getGameTypes()
    this.getGroupList().then(() => {
      this.getTableData()
    })
  },
  methods: {
    getGameTypes() {
      this.$axios.get(systemConfig.urls.findGameTypes)
      .then(res => {
        this.gameTypeList = res.data.page
      })
    },
    getGroupList() {
      return this.$axios.get(systemConfig.urls.mbrGrouplist).then(res => {
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
      this.$axios.get(systemConfig.urls.getRebateDetail, {
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
            if (/^小计|总计$/.test(item.referrer)) {
              item.financialCode = item.referrer
              item.referrer = item.null
            }
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            item.rebateCatList && item.rebateCatList.forEach(temp => {
              const game = this.gameTypeList.find(game => game.id === temp.catId)
              if (game) {
                item[temp.catId] = temp.validBet
              }
            })
            return item
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.rebate-detail-title {
  float: left;
  color: #333;
  margin-left: 10px;
  font-weight: bold;
  font-size: 16px;
}
</style>

