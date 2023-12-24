<template>
  <div class="member-withdraw">
   <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[3].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @add="setContract('add')" @reloadData="getTableData" class="table_data" :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div" style="height: 50px;">
      <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">{{ $t('导出中') }}...</el-button>
    </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('属性')" slot="financialCode" align="center">
        <template slot-scope="scope">
          {{scope.row.financialCode === 'ADZ' ? $t('代理代充') : $t('代理上分')}}
        </template>
      </el-table-column>
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
    fileExport,
    queryStore([
      "agyAccount",
      "loginName",
      "startTime",
      "endTime",
    ]),
    Mixin,
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
          loginName: null,
          financialCode: null
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "text",
            label: this.$t("充值会员账号"),
            prop: "loginName",
          },
          {
            type: "select",
            multiple: true,
            label: this.$t("属性"),
            prop: "financialCode",
            options: [
              {
                label: this.$t("代理代充"),
                value: "ADZ",
              },
              {
                label: this.$t("代理上分"),
                value: "ASF",
              },
            ],
          },
          {
            label: this.$t("代充时间"),
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
      // 代充记录 - 充值金额 - 未处理
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          prop: "orderNo",
          label: this.$t("订单号"),
        },
        {
          prop: "agyAccount",
          label: this.$t("代理账号"),
        },
        {
          prop: "loginName",
          label: this.$t("充值会员"),
        },
        {
          prop: "amount",
          label: this.$t("充值金额"),
        },
        // {
        //   prop: "financialCode",
        //   label: "属性",
        // },
        {
          prop: "orderTime",
          label: this.$t("充值时间"),
        },
        {
          slotName: "financialCode"
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
    if (this.hasPermission("agent:upperScoreRecord:export")) {
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
        export: hasPermission("agent:upperScoreRecord:export"),
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
      this.$axios
        .get(systemConfig.urls.newAggentList.upperScoreRecord, {
          params: {
           ...this.searchCriteria.keys,
           financialCode: this.searchCriteria.keys.financialCode?this.searchCriteria.keys.financialCode.join(','):"",
           pageNo: this.currentPage,
           pageSize: this.pageSize
          },
        })
        .then((res) => {
          if (res) {
            this.getNetworkLoadAndDataSolveTime(res)
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.orderTime = systemConfig.transferTimeByType(
                item.orderTime,
                "bj"
              );
              return item;
            });
          }
        });
    },
    async handleExport() {
      const params = {
        ...this.searchCriteria.keys,
        financialCode: this.searchCriteria.keys.financialCode ? this.searchCriteria.keys.financialCode.join(',') : "",
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList.upperScoreRecordExport, params)
      if (res) {
        await this.agentCheckFile('upperScoreRecordModule')
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
