<!--  帐变流水 -->
<template>
  <div class="member-withdraw">
   <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[1].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom
    :hasAddBtn="false"
    :hasRemoveBtn="false"
    :tableData="tableData"
    :totalCount="totalCount"
    :pageSize.sync="pageSize"
    :tableColumns="tableColumns"
    :currentPage.sync="currentPage"
    @add="setContract('add')"
    @reloadData="getTableData"
    class="table_data"
    :showLoadTime="true"
    :networkLoadTime="networkLoadTime"
    :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div" style="height: 50px;">
      <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">{{ $t('导出中') }}...</el-button>
    </div>
      <!-- 表格插槽 -->
      <!-- <el-table-column label="订单号" slot="orderNo">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column> -->
    </TableCom>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../../config/config.js";
import TimeEvery from "../../../components/TimeEvery";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import fileExport from "../../../mixins/fileExport";
import queryStore from "../../../mixins/queryStore";
import { mapGetters } from "vuex";
import CopyButton from "../../../components/CopyButton";
import Mixin from '@/mixins/loadTime'


export default {
  name: "agentDeposit",
  mixins: [
    Mixin,
    fileExport,
    queryStore([
      "agyAccount",
      "startTime",
      "endTime",
    ]),
  ],
  data() {
    return {
      memo: '',
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
          },
          {
            label: this.$t("账变时间"),
            slotName: "searchTime",
            options: [
              {
                label: this.$t("今日"),
                value: "today",
              },
              {
                label: this.$t("昨日"),
                value: "yesterday",
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
      tableData: [],
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          prop: "agyAccount",
          label: this.$t("代理账号"),
        },
        {
          prop: "codeName",
          label: this.$t("账变类型"),
        },
        // {
        //   slotName: "codeName", // 张变类型
        // },
        {
          prop: "amount",
          label: this.$t("账变金额"),
          align: 'right'
        },
        {
          prop: "balance",
          label: this.$t("佣金钱包金额"),
          align: 'right'
        },
        {
          prop: "rechargeWallet",
          label: this.$t("代充钱包余额"),
          align: 'right'
        },
        {
          prop: "payoffWallet",
          label: this.$t("彩金钱包余额"),
          align: 'right'
        },
        {
          prop: "orderTime",
          label: this.$t("账变时间"),
        }
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      deposit: {
        marginRight: "0", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      detailShow: false,
      rowData: {},
    };
  },
  components: {
    TimeEvery,
    StartAndEndTimeSelector,
    CopyButton
  },
  created() {
    this.getTableData();
  },
  mounted() {
    if (this.hasPermission("agent:repotAgentChange:export")) {
      this.deposit = {
        "margin-right": "75px",
      };
    }
  },
  computed: {
    loading() {
      return this.$store.state.searchLoading;
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
        export: hasPermission("agent:repotAgentChange:export"),
      };
    },
  },
  watch: {

  },
  methods: {
    showDetail(row) {
      this.rowData = row
      this.memo = row.memo;
      this.detailShow = true;
    },
    getTableData() {
      this.getCurrentRecodeTime()
      const statuss = this.searchCriteria.keys.statuss
      this.$axios
        .get(systemConfig.urls.newAggentList.agentAccountChange, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.orderTime = systemConfig.transferTimeByType(
                item.orderTime,
                "bj",
                item.balance = (item.balance || 0).toLocaleString(),
                item.amount = (item.amount || 0).toLocaleString(),
                item.rechargeWallet = (item.rechargeWallet || 0).toLocaleString(),
                item.payoffWallet = (item.payoffWallet || 0).toLocaleString(),
              );
              return item;
            });
          }
        });
    },
    async handleExport() {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
      }
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList.agentAccountChangeExport, params)
      if (res) {
        await this.agentCheckFile('accountChangeReportModule')
      }
      this.isNowDowning = true
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
</style>
