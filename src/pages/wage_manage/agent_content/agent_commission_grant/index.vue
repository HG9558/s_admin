<template>
  <div class="member-withdraw">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[2].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom
    :hasAddBtn="false"
    :hasRemoveBtn="false"
    :tableBtns="[ { text: $t('导出'), event: 'export', icon: 'iconfont icon-export el-button-export', disabled: !permissions.export || !totalCount, loading: !isNowDowning } ]"
    :tableData="tableData"
    :totalCount="totalCount"
    :pageSize.sync="pageSize"
    :tableColumns="tableColumns"
    :currentPage.sync="currentPage"
    @export="handleExport"
    @add="setContract('add')"
    @reloadData="getTableData"
    class="table_data"
    :showLoadTime="true"
	  :networkLoadTime="networkLoadTime"
	  :dataSolveTime="dataSolveTime">
<!--      <div slot="slot-title" class="export-div">-->
<!--        <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">导出</el-button>-->
<!--        <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">导出中...</el-button>-->
<!--      </div>-->
      <!-- 表格插槽 -->
      <el-table-column :label="$t('订单号')" slot="orderNo" width="
      160" align="center">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('周期')" slot="cycle" width="170px" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.cycleStart + '/' + scope.row.cycleEnd}}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" slot="issuestatus" align="center">
        <template slot-scope="scope">
          {{[$t('已拒绝'), $t('已发放'), $t('待发放')][parseInt(scope.row.issuestatus)]}}
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog @close="closeDetail" :title="$t('订单详情')" :visible.sync="detailShow">
      <Detail v-if="detailShow" ref="add" @submit="handleSubmit" :rowData="rowData" :showSave="permissions.edit"/>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../../../config/config.js";
import StartAndEndTimeSelector from "../../../../components/StartAndEndTimeSelector";
import fileExport from "../../../../mixins/fileExport";
import queryStore from "../../../../mixins/queryStore";
import { mapGetters } from "vuex";
import Detail from "./detail";
import Mixin from '@/mixins/loadTime'


export default {
  name: "commissionCheck",
  mixins: [Mixin, fileExport, queryStore(["agyAccount", "reviewStatus", "startTime", "endTime"])],
  data() {
    return {
      isNowDowning: true,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          reviewStatus: null,
          username: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "issuestatus",
            options: [
              {
                label: this.$t("待发放"),
                value: 2,
              },
              {
                label: this.$t("已发放"),
                value: 1,
              },
              {
                label: this.$t("已拒绝"),
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
        // {
        //   prop: "",
        //   label: "周期",
        // },
        {
          slotName: "cycle", // 周期
        },
        {
          prop: "agyAccount",
          label: this.$t("代理账号"),
        },
         {
          prop: "activeNum",
          label: this.$t("契约活跃人数"),
        },
        {
          prop: "comsActiveNum",
          label: this.$t("活跃人数"),
        },
        {
          prop: "cycleBet",
          label: this.$t("周期投注额"),
          align: 'right'
        },
        {
          prop: "netwinlose",
          label: this.$t("净输赢"),
          align: 'right'
        },
        {
          prop: "writeOff",
          label: this.$t("净输赢冲销"),
          align: 'right'
        },
        {
          prop: "rate",
          label: this.$t("佣金比例"),
        },
        {
          label: this.$t("佣金调整"),
          align: 'right',
          render: (h, row) => h('span', row.adjustedAmount || 0)
        },
        {
          prop: "commission",
          label: this.$t("佣金发放额"),
          align: 'right'
        },
        {
          prop: "modifyTime",
          label: this.$t("更新日期"),
          width: 145,
        },
        {
          slotName: "issuestatus",
        },
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
    StartAndEndTimeSelector,
    Detail,
  },
  created() {
    this.getTableData();
  },
  mounted() {
    if (this.hasPermission("agent:commissionFreedList:export")) {
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
        edit: hasPermission("agent:commission:updateFreedStatus"),
        export: hasPermission("agent:commissionFreedList:export"),
      };
    },
  },
  watch: {},
  methods: {
    showDetail(row) {
      this.$axios
        .get(systemConfig.urls.newAggentList.commissionDetails, {
          params: {
            id: row.id,
          },
        })
        .then((res) => {
          if (res) {
            const data = res.data.data
            this.rowData = {...res.data.data,
              cycleStart: systemConfig.transferTimeByType(
                data.cycleStart.slice(0, 10),
                "bj"
              ),
              cycleEnd: systemConfig.transferTimeByType(
                data.cycleEnd.slice(0, 10),
                "bj"
              )
            }
            this.detailShow = true;
          }
        });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      const statuss = this.searchCriteria.keys.statuss;
      this.$axios
        .get(systemConfig.urls.newAggentList.commissionFreedList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
            statuss: statuss ? statuss.join(",") : null,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.modifyTime = systemConfig.transferTimeByType(
                item.modifyTime,
                "bj"
              );
              item.cycleStart = systemConfig.transferTimeByType(
                item.cycleStart.slice(0, 10),
                "bj"
              );
              item.cycleEnd = systemConfig.transferTimeByType(
                item.cycleEnd.slice(0, 10),
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
      const { res } = await this.$axios.GET(this.$urls.newAggentList.commissionFreedListExport, params)
      if (res) {
        await this.agentCheckFile('commissionFreedListModule')
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
  height: 40px;
  width: 100%;
}
</style>
