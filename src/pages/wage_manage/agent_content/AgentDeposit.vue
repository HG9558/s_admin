<template>
  <div class="member-withdraw">
   <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="searchTime" :selections="searchCriteria.meta[2].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
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
      <TimeEvery @getTime="setTimeRefresh" class="memberDespot" :style="{ marginRight: permissions.export ? '95px' : 0 }"></TimeEvery>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">{{ $t('导出中') }}...</el-button>
    </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('订单号')" slot="orderNo" align="center">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" slot="status" align="center">
        <template slot-scope="scope">
          {{[$t('失败'), $t('成功'), $t('待处理')][scope.row.status]}}
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog @close="closeDetail" :title="$t('线上支付审核')" :visible.sync="detailShow">
      <el-form label-position="right" label-width="120px" style="margin-left: 10px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{rowData.orderPrefix}}{{rowData.orderNo}}</span>
              <CopyButton :copy-content="(rowData.orderPrefix + rowData.orderNo+'')" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('代理账号')" class="first-line">
              <span>{{rowData.agyAccount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款通道')" class="first-line">
              <span>{{rowData.payType}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款人姓名')" class="first-line">
              <span>{{rowData.depositUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款附言')" class="first-line"><span>{{rowData.depositPostscript}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款金额')" class="first-line">
              <span>{{rowData.depositAmount}}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际到账')" class="first-line noborder">
              <span><el-input v-model="rowData.actualArrival"></el-input></span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line" v-if="rowData.status === 2">
              <el-input class="left" type="textarea" v-model="memo" :maxlength="400"></el-input>
            </el-form-item>
            <el-form-item :label="$t('备注')" class="first-line" v-else>
              <el-input class="left" type="textarea" v-model="memo" :maxlength="400" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn" v-if="rowData.status === 2&&permissions.edit">
                  <el-button type="primary" @click.native="changeStatus(1, rowData.id)">{{ $t('通过') }}</el-button>
                  <el-button type="danger" @click.native="changeStatus(0, rowData.id)">{{ $t('拒绝') }}</el-button>
                </div>
                <div class="btn" v-else>
                  <el-button type="primary" @click.native="changeMemo()">{{ $t('关闭') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
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
import site from '@/mixins/site'

export default {
  name: "agentDeposit",
  mixins: [
    Mixin,
    site,
    fileExport,
    queryStore([
      "agyAccount",
      "statuss",
      "startTime",
      "endTime",
    ]),
  ],
  data() {
    return {
      tmpValue4SafeCheck: {},
      memo: '',
      isNowDowning: true,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          statuss: null,
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
            multiple: true,
            label: this.$t("状态"),
            prop: "statuss",
            options: [
              {
                label: this.$t("待处理"),
                value: 2,
              },
              {
                label: this.$t("成功"),
                value: 1,
              },
              {
                label: this.$t("失败"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("入款时间"),
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
          prop: "agyAccount",
          label: this.$t("代理账号"),
        },
        {
          slotName: "orderNo", // 订单号
        },
        {
          prop: "depositAmount",
          width: 80,
          label: this.$t("存款金额"),
          align: 'right'
        },
        {
          prop: "actualArrival",
          width: 80,
          label: this.$t("实际金额"),
          align: 'right'
        },
        {
          prop: "payType",
          label: this.$t("收款渠道"),
        },
        {
          prop: "createTime",
          width: 150,
          label: this.$t("入款时间"),
        },
        // {
        //   slotName: "" // 入款时间
        // },
        {
          prop: "auditUser",
          label: this.$t("审核人"),
        },
        {
          prop: "memo",
          label: this.$t("备注"),
        },
        {
          prop: "auditTime",
          width: 150,
          label: this.$t("审核时间"),
        },
        {
          slotName: "status",
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      options: [
        {
          value: "5",
          label: "5s",
        },
        {
          value: "15",
          label: "15s",
        },
        {
          value: "30",
          label: "30s",
        },
        {
          value: "60",
          label: "60s",
        },
        {
          value: "90",
          label: this.$t("停止"),
        },
      ],
      deposit: {
        marginRight: "95px", //导出样式
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
    if (this.hasPermission("fund:deposit:exportExcel")) {
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
        edit: hasPermission("agent:onLine:update"),
        export: hasPermission("agent:onLine:export"),
      };
    },
  },
  watch: {
    "$store.state.safePasswordCallbackPageEnd": function () {
      let page = this.$store.state.safePasswordCallbackPageEnd.split("_")[0];
      if (!this.$options.name || page !== this.$options.name) {
        return;
      }

      this.safePassword = this.$store.state.safePassword;
      if (
        this.tmpValue4SafeCheck.callback &&
        typeof this.tmpValue4SafeCheck.callback === "function"
      ) {
        this.tmpValue4SafeCheck.callback.apply(
          this,
          this.tmpValue4SafeCheck.args || []
        );
      }

      this.safePassword = "";
      this.tmpValue4SafeCheck = {};
    },
  },
  methods: {
    showDetail(row) {
      this.rowData = row
      this.memo = row.memo;
      this.detailShow = true;
    },
    setTimeRefresh(val) {
      clearInterval(this.timeOut);
      switch (parseInt(val)) {
        case 5:
          this.TimeFor(5);
          break;
        case 15:
          this.TimeFor(15);
          break;
        case 30:
          this.TimeFor(30);
          break;
        case 60:
          this.TimeFor(60);
          break;
        case 0:
          this.TimeFor(0);
          break;
        case 1000:
          this.getTableData();
          break;
      }
    },
    TimeFor(time) {
      var that = this;
      if (time == 0) {
        return;
      }
      this.timeOut = setInterval(function () {
        console.log(time);
        // console.log((new Date()).getTime())
        that.getTableData();
      }, time * 1000);
    },
    getTableData() {
      this.getCurrentRecodeTime()
      const statuss = this.searchCriteria.keys.statuss
      this.$axios
        .get(systemConfig.urls.newAggentList.agentDeposit, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
            statuss: statuss ? statuss.join(',') : null
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
              );
              item.auditTime = systemConfig.transferTimeByType(
                item.auditTime,
                "bj"
              );
              item.depositAmount = (item.depositAmount || 0).toLocaleString()
              item.actualArrival = (item.actualArrival || 0).toLocaleString()
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
        statuss: statuss ? statuss.join(',') : null
      }
      this.isNowDowning = false
      const { res } = await this.$axios.GET(this.$urls.newAggentList.agentOnLineExport, params)
      if (res) {
        await this.agentCheckFile('agentOnLineModule')
      }
      this.isNowDowning = true
    },
    closeDetail() {
      this.rowData = {};
      this.memo = null;
      this.detailShow = false;
    },
    // 修改某条数据的状态 trueStatus走不同的接口
    changeStatus(status, id) {
      // 安全密码弹窗
      if (status == 1 && !this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.changeStatus);
        this.$set(this.tmpValue4SafeCheck, "args", [status, id]);
        return;
      }

      // 0是拒绝 1是通过 调用不同接口
      let url =
        status === 1
          ? systemConfig.urls.newAggentList.updateStatusd
          : systemConfig.urls.newAggentList.updateStatusRefuse;
      const params = {
        status: status, id: id, memo: this.memo, actualArrival: parseInt(this.rowData.actualArrival)
      }
      this.$axios
        .post(url, params, {
          headers: { securepwd: this.safePassword || null },
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("成功"),
          });
          this.getTableData();
          this.changeMemo();
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
    },
    changeMemo() {
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
  position: absolute;
  right: 0;
}
.noborder{
  /deep/ .el-form-item__content{
    border: 0!important;
    span:nth-child(1){
      width: 100%;
      display: block;
    }
  }
  /deep/ .el-input__inner{
    padding: 0 50px 0 11px!important;
    font: 12px "Times New Roman"!important;
  }
  span:nth-child(1){
    left: 0;
  }
}
</style>
