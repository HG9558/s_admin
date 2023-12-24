<template>
  <div class="member-withdraw">
    <!-- 平台费报表 -->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="handleSearch" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[1].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <div v-if="isNextAgent">
      <div class="bread-box">
        <el-breadcrumb separator=">" style="display: inline-block">
          <el-breadcrumb-item v-for="(item, i) in breadList" :key="i"><span class="blue-color pointer" @click="handleBreadClick(item)">{{ item.agyAccount }}</span></el-breadcrumb-item>
        </el-breadcrumb>
        <el-button style="float: right" @click="handleBreadClick({ agyAccount: $t('') })">{{ $t('返回') }}</el-button>
      </div>
      <TableCom
        :hasAddBtn="false"
        :hasRemoveBtn="false"
        :hasPagination="false"
        :table-loading="reportView.loading"
        :tableData="reportView.tableData" 
        :tableColumns="reportView.column"
      ></TableCom>
    </div>
    <div v-else>
      <TableCom
    :hasAddBtn="false"
    :table-loading="loading"
    :hasRemoveBtn="false"
    :tableData="tableData"
    :totalCount="totalCount"
    :pageSize.sync="pageSize"
    :tableColumns="tableColumns"
    :currentPage.sync="currentPage"
    @reloadData="getTableData"
    class="table_data"
    :showLoadTime="true"
    :networkLoadTime="networkLoadTime"
    :dataSolveTime="dataSolveTime"
    :cell-style="{'text-align': 'center'}"
>
      <div slot="slot-title" class="export-div" style="height: 50px;">
        <el-button class="iconfont icon-export el-button-export exportList" type="primary" v-if="permissions.export" :loading="!isNowDowning" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
      </div>
    </TableCom>
    </div>
    <el-dialog @close="closeDetail" :title="$t('场馆平台费明细')" :visible.sync="detailShow" class="table_row_detail">
      <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :table-loading="detailLoading" :tableData="dialogTableData" :tableColumns="dialogTableColumns" class="table_data" :hasPagination="false" />
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import systemConfig from "../../../config/config";
import fileExport from "../../../mixins/fileExport";
import queryStore from "../../../mixins/queryStore";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  name: "commissionCheck",
  mixins: [Mixin, fileExport, queryStore(["agyAccount", "startTime", "endTime"])],
  data() {
    return {
      isNowDowning: true,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          agyAccount: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
            style: { width: '180px' }
          },
          {
            label: this.$t("时间间隔"),
            slotName: "searchTime",
            options: [
              {
                label: this.$t("本月"),
                value: "currentMonth",
              },
              {
                label: this.$t("上月"),
                value: "lastMonth",
              },
              {
                label: this.$t("本周"),
                value: "currentWeek",
              },
              {
                label: this.$t("上周"),
                value: "lastWeek",
              },
            ],
          },
        ],
      },
      breadList: [],
      tableData: [],
      tableColumns: [
        {
          prop: "index",
          label: this.$t("序号"),
          width: "60",
        },
        {
          label: this.$t("代理账号"),
          render: (h, row) => h('span', { class: 'blue-color pointer',on: { click: () => this.handleCheckNext(row) } }, row.agyAccount)
        },
        {
          prop: "departmentName",
          label: this.$t("部门"),
          align: 'right'
        },
        {
          prop: "payout",
          label: this.$t("输赢"),
          align: 'right'
        },
        {
          prop: "validbet",
          label: this.$t("流水"),
          align: 'right'
        },
        {
          prop: "cost",
          label: this.$t("平台费"),
          align: 'right',
          render: (h, row) => h('span', row.cost || 0)
        },
        {
          prop: "memo",
          label: this.$t("代理备注"),
          align: 'right'
        },
        {
          label: this.$t('操作'),
          render: (h, row) => h('span', { class: 'blue-color pointer',on: { click: () => this.handleCheckNext(row) } }, row.agyAccount ? this.$t('查看明细') : '')
        }
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      deposit: {
        marginRight: "0", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      reportView: {
        loading: false,
        column: [
          // { label: this.$t('视图'), prop: 'view', width: 150, render: (h, row) => {
          //   const { view, _type } = row
          //   const isAll = _type === 3
          //   const isAgent = this.isAgent
          //   return h(isAll ? 'span' : 'el-button', { attrs: { type: !isAll ? 'text' : '' }, class: isAll ? '' : _type === 1 ? isAgent ? '' : 'grey' : isAgent ? 'grey' : '' , on: { click: () => this.handleChangeView(row) } }, view)
          // } },
          { label: this.$t('场馆'), render: (h, row) => h('span', row.depotname || '-'), align: 'center' },
          { label: this.$t('输赢'), render: (h, row) => h('span', row.payout || 0), align: 'center' },
          { label: this.$t('输赢费率')+ "(%)", render: (h, row) => h('span', row.rate || 0), align: 'center' },
          { label: this.$t('流水'), render: (h, row) => h('span', row.validbet || 0), align: 'center' },
          { label: this.$t('流水费率') + "(%)", render: (h, row) => h('span', row.waterrate || 0), align: 'center' },
          { label: this.$t('代理额外费率') + "(%)", render: (h, row) => h('span', row.extraRate || 0), align: 'center' },  
          { label: this.$t('平台费'), render: (h, row) => h('span', row.cost || 0), align: 'center' },
        ],
        tableData: [],
      },
      detailShow: false,
      loading: false,
      detailLoading: false,
      isNextAgent: false,
      isAgent: true,
      curentItem: {},
      dialogTableData: [],
      dialogTableColumns: [
        {
          prop: "depotname",
          label: this.$t("场馆"),
        },
        {
          prop: "payout",
          label: this.$t("输赢"),
          align: 'right'
        },
        {
          prop: "rate",
          label: this.$t("平台输赢费率") + "(%)",
        },
        {
          prop: "validbet",
          label: this.$t("流水"),
          align: 'right'
        },
        {
          prop: "waterrate",
          label: this.$t("平台流水费率(%)"),
        },
        {
          prop: "cost",
          label: this.$t("平台费"),
          align: 'right'
        },
        {
          prop: "extrarate",
          label: this.$t("额外费率"),
          align: 'right'
        }
      ],
    };
  },
  components: {
    StartAndEndTimeSelector,
  },
  created() {
    this.initDate()
    this.getTableData()
  },
  mounted() {
    if (this.hasPermission("agent:commissionDepotCost:export")) {
      this.deposit = {
        "margin-right": "75px",
      };
    }
  },
  computed: {
    tableParams() {
      const { agyAccount, startTime, endTime } = this.searchCriteria.keys
      return {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        startTime,
        endTime,
        // topAgyAccount: this.isNextAgent ? null : topAgyAccount,
        // agyAccount: this.curentItem.agyAccount || null
        agyAccount: this.isNextAgent ? this.curentItem.agyAccount : agyAccount,
      }
    },
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () {},
    },
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("agent:domain:save"),
        edit: hasPermission("agent:domain:audit"),
        export: hasPermission("agent:commissionDepotCost:export"),
      };
    },
  },
  watch: {},
  methods: {
    initDate() {
      const date = new Date()
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.searchCriteria.keys.startTime = `${dateStr} 00:00:00`
      this.searchCriteria.keys.endTime = `${dateStr} 23:59:59`
    },
    handleBreadClick(item) {
      // const { agyAccount } = item
      this.curentItem = item
      // this.isAgent = true
      // if (agyAccount === this.$t('总代列表')) {
      //   this.isNextAgent = false
      //   this.breadList = []
      //   this.getTableData()
      // } else {
      //   let index
      //   this.breadList.find((i, _index) =>{
      //     if (i.agyAccount === agyAccount) {
      //       index = _index
      //       return true
      //     }
      //   })
      //   this.breadList = this.breadList.slice(0, index + 1)
      //   this.findCostLostReportView()
      //   this.getTableData()
      // }
      this.isNextAgent = false
      this.breadList = []
      this.getTableData()
    },
    handleChangeView(row) {
      const { _type } = row
      if (_type !== 3) {
        const isAgent = _type === 2
        if (isAgent !== this.isAgent) {
          this.isAgent = isAgent
          this.getTableData()
        }
      }
    },
    handleCheckNext(row) {
      this.isAgent = false
      const { agyAccount, loginName } = row
      if (agyAccount) {
        const breadList = this.breadList
        this.curentItem = row
        this.isNextAgent = true
        if (!breadList.length) {
          this.breadList = [{ agyAccount: this.$t('总代列表') }]
        }
        this.breadList.push({ agyAccount })
        this.getTableData()
        // this.findCostLostReportView()
      } else {
        this.showDetail(loginName)
      }
    },
    async findCostLostReportView() {
      const { startTime, endTime } = this.searchCriteria.keys
      const {  agyAccount } = this.curentItem
      this.reportView.loading = true
      const { res } = await this.$axios.GET(this.$urls.newAggentList.findCostLostReportView, { agyAccount, startTime, endTime })
      this.reportView.loading = false
      if (res) {
        const { directAccount, allSubordinates, subordinateAgent } = res.page
        directAccount.view = this.$t('直属会员')
        directAccount._type = 1
        subordinateAgent.view = this.$t('下级代理')
        subordinateAgent._type = 2
        allSubordinates.view = this.$t('总计')
        allSubordinates._type = 3
        // this.reportView.tableData = [ directAccount, subordinateAgent, allSubordinates ]
        this.reportView.tableData = [ directAccount, allSubordinates ]
      }
    },
    async showDetail(loginName) {
      const { startTime, endTime } = this.searchCriteria.keys
      this.detailShow = true
      this.detailLoading = true
      const { res } = await this.$axios.GET(this.$urls.newAggentList.depotCostDetail, {
        loginName,
        startTime,
        endTime
      })
      this.detailLoading = false
      if (res) {
        this.dialogTableData = res.page
        item.validbet =  (item.validbet || 0).toLocaleString()
        item.payout =  (item.payout || 0).toLocaleString()
      }
    },
    handleSearch() {
      this.isNextAgent = false
      this.isAgent = true
      this.breadList = []
      this.curentItem = {}
      this.getTableData()
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      // const isMember = !this.isAgent
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.newAggentList[this.isNextAgent ? 'depotCostDetail' : 'depotCostList'], this.tableParams)
      const { res, response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        if (this.isNextAgent) {
          this.$set(this.reportView, 'tableData', res.page)
          return
        }
        let { list, totalCount } = res.page
        this.totalCount = totalCount
        if (list.length) {
          const totalData = list.find(i => i.agyAccount === '总计' || i.loginName === '总计') || {}
          list = list.filter(i => i.agyAccount !== '总计' && i.loginName !== '总计')
          if (list.length) {
            const curPage = {
              cost: 0,
              payout: 0,
              validbet: 0
            }
            list = list.map((item, index) => {
              item.index = index + 1
              curPage.cost += item.cost
              curPage.payout += item.payout
              curPage.validbet += item.validbet
              item.payout =  (item.payout || 0).toLocaleString()
              item.validbet =  (item.validbet || 0).toLocaleString()
              item.cost =  (item.cost || 0).toLocaleString()
              item.validbet =  (item.validbet || 0).toLocaleString()
              item.payout =  (item.payout || 0).toLocaleString()
              return item
            })
            curPage.cost = this.toThousands(curPage.cost.toFixed(2) * 1)
            curPage.payout = this.toThousands(curPage.payout.toFixed(2) * 1)
            curPage.validbet = this.toThousands(curPage.validbet.toFixed(2) * 1)
            list.push({
              ...curPage,
              index: this.$t("小计")
            })
            list.push({
              index: this.$t("总计"),
              cost: this.toThousands(totalData.cost || 0),
              payout: this.toThousands(totalData.payout || 0),
              validbet: this.toThousands(totalData.validbet || 0)
            })
          }
          
        }
        let obj = this.tableColumns[1]
        obj = this.isNextAgent ? { ...obj, label: this.$t('直属会员') } : { ...obj, label: this.$t('代理账号') }
        this.tableColumns.splice(1, 1, obj)
        this.tableData = list
      }
    },
    async handleExport() {
      // const isMember = this.isNextAgent && !this.isAgent
      const isMember = false
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList[isMember ? 'accountDepotCostExport' : 'agentDepotCostExport'], this.tableParams)
      if (res) {
        await this.agentCheckFile(isMember ? 'accountDepotCostModule' : 'agentDepotCostModule')
      }
      this.isNowDowning = true
    },
    closeDetail() {
      this.rowData = {};
      this.detailShow = false;
    },
    handleSubmit(bool) {
      if (bool) {
        this.getTableData();
      }
      this.closeDetail();
    },
    toThousands(money) {
      if (money === 0) return 0
      return systemConfig.toThousands(money);
    },
  },
};
</script>
<style scoped lang="scss">
.exportList {
  height: 28px;
  line-height: 15px;
  margin-top: 1px;
}
.toggle_to_new_page {
  cursor: pointer;
  color: #409eff;
}
.first-line {
  /deep/ .el-popover__reference-wrapper {
    left: auto;
    right: 0;
  }
}
.export-div {
  position: absolute;
  right: 0;
}
.table_row_detail {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }
}
.bread-box {
  padding: 10px 0;
  line-height: 30px;
}
/deep/ .grey {
  color: #c0c4cc;
}
</style>
