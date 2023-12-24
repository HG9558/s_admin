<template>
  <div class="member-withdraw">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[2].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @add="setContract('add')" @reloadData="getTableData" class="table_data"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div" style="height: 50px;">
        <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
        <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">{{ $t('导出中') }}...</el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('订单号')" slot="orderNo" width="
      200" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button> -->
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
       <el-table-column :label="$t('返佣代理')" slot="subAgyaccount" align="center">
        <template slot-scope="scope">
          {{scope.row.type ? scope.row.subAgyaccount : '-'}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('佣金类型')" slot="type" align="center">
        <template slot-scope="scope">
          {{scope.row.type ? $t('下级代理') : $t('会员返佣')}}
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../../config/config.js";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import fileExport from "../../../mixins/fileExport";
import queryStore from "../../../mixins/queryStore";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  name: "commissionCheck",
  mixins: [fileExport,Mixin, queryStore(["agyAccount", "reviewStatus", "startTime", "endTime"])],
  data() {
    return {
      isNowDowning: true,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          agyAccount: null,
          type: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "select",
            label: this.$t("佣金类型"),
            prop: "type",
            options: [
              {
                label: this.$t("下级代理"),
                value: 1,
              },
              {
                label: this.$t("会员返佣"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("更新时间"),
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
              {
                label: this.$t("本月"),
                value: "currentMonth",
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
          slotName: "orderNo", // 订单号
        },
        {
          prop: "agyAccount",
          label: this.$t("代理账号"),
        },
        {
          prop: "commission",
          label: this.$t("到账金额"),
          align: 'right'
        },
        {
          slotName: "subAgyaccount", //返佣代理
        },
        {
          slotName: "type", //佣金类型
        },
        {
          prop: "passTime",
          label: this.$t("到账时间"),
          formatter: function(row, column, cellValue, index){
            return cellValue.split(".")[0]
          }
        }
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      deposit: {
        marginRight: "75px", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      detailShow: false,
      rowData: {},
    };
  },
  components: {
    StartAndEndTimeSelector,
  },
  created() {
    this.getTableData();
  },
  mounted() {
    if (this.hasPermission("agent:commissionReport:export")) {
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
        export: hasPermission("agent:commissionReport:export"),
      };
    },
  },
  watch: {},
  methods: {
    getTableData() {
      this.getCurrentRecodeTime()
      const statuss = this.searchCriteria.keys.statuss;
      this.$axios
        .get(systemConfig.urls.newAggentList.commissionReport, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
            statuss: statuss ? statuss.join(",") : null,
          },
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.modifyTime = systemConfig.transferTimeByType(
                item.modifyTime,
                "bj"
              );
              return item;
            });
          }
        });
    },
    async handleExport() {
      const statuss = this.searchCriteria.keys.statuss
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
        statuss: statuss ? statuss.join(",") : null,
      }
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList.commissionReportExport, params)
      if (res) {
        await this.agentCheckFile('commissionReportModule')
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
