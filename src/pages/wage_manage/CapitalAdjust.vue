<template>
<!-- 资金调整 -->
  <div class="member-withdraw">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="updateTime" :selections="searchCriteria.meta[2].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
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
    :dataSolveTime="dataSolveTime"
>
      <div slot="slot-title" class="export-div">
        <el-button class="memberDespot" icon="el-icon-circle-plus-outline" type="primary" size="mini" v-if="permissions.add" @click="manualAdjust">{{ $t('人工调整') }}</el-button>
        <el-button class="iconfont icon-export el-button-export exportList" v-if="isNowDowning&&permissions.export" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
        <el-button class="iconfont icon-export el-button-export exportList" v-if="!isNowDowning&&permissions.export">{{ $t('导出中') }}...</el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('订单号')" slot="orderNo" align="center" :width="150">
        <template slot-scope="scope">
          <!-- <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button> -->
          {{scope.row.orderNo}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('钱包类型')" slot="walletType" align="center">
        <template slot-scope="scope">
          {{[$t('佣金钱包'), $t('代充钱包'), $t('彩金钱包')][scope.row.walletType]}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('调整类别')" slot="financialCode" align="center">
        <template slot-scope="scope">
          {{['GA'].includes(scope.row.financialCode) ? $t('人工增加') : $t('人工减少')}}
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog @close="closeDetail" title="资金调整" :visible.sync="manualShow">
      <el-form label-position="top" style="margin-left: 10px" :model="postData" :rules="rules" ref="financialAdjust">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('调整类别')" prop="financialCode">
              <el-radio v-model="postData.financialCode" label='GA'>{{ $t('人工增加') }}</el-radio>
              <el-radio v-model="postData.financialCode" label='GM'>{{ $t('人工减少') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('钱包类型')" prop="walletType">
              <el-radio v-model="postData.walletType" :label='0'>{{ $t('佣金钱包') }}</el-radio>
              <el-radio v-model="postData.walletType" :label='1'>{{ $t('代充钱包') }}</el-radio>
              <el-radio v-model="postData.walletType" :label='2'>{{ $t('彩金钱包') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('代理账号')" class="first-line" prop="agyAccount">
              <el-input class="left" v-model="postData.agyAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('调整金额')" class="first-line" prop="amount">
              <el-input class="left" oninput="value=value.replace(/[^\d^\.]/g,'')" v-model.trim="postData.amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('备注')" class="first-line">
              <el-input class="left" type="textarea" v-model="postData.memo" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn">
                  <el-button type="" @click.native="closeDetail">{{ $t('取消') }}</el-button>
                  <el-button type="primary" @click.native="manualSubmit">{{ $t('通过') }}</el-button>
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
import systemConfig from "../../config/config.js";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import fileExport from "../../mixins/fileExport";
import queryStore from "../../mixins/queryStore";
import { mapGetters } from "vuex";
import CopyButton from "../../components/CopyButton";
import {
  checkNumberAndDecimals,
} from "../../config/utils";
const checkNumberAndTwoDecimal = function (value) {
  return checkNumberAndDecimals(value, 2);
};
import Mixin from '@/mixins/loadTime'
import moment from "moment"

export default {
  name: "agentDeposit",
  mixins: [Mixin, fileExport, queryStore(["agyAccount", "statuss", "startTime", "endTime"])],
  data() {
    return {
      tmpValue4SafeCheck: {},
      memo: "",
      isNowDowning: true,
      searchCriteria: {
        keys: {
          startTime: moment().format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD"),
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
            // multiple: true,
            label: this.$t("钱包类型"),
            prop: "walletType",
            options: [
              {
                label: this.$t("佣金钱包"),
                value: 0,
              },
              {
                label: this.$t("代充钱包"),
                value: 1,
              },
              {
                label: this.$t("彩金钱包"),
                value: 2,
              },
            ],
          },
          {
            label: this.$t("更新时间"),
            slotName: "updateTime",
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
          prop: "beforeBalance",
          label: this.$t("原账户余额"),
          align: 'right'
        },
        {
          slotName: "walletType", // 钱包类型
        },
        {
          prop: "amount",
          label: this.$t("调整金额"),
          align: 'right'
        },
        {
          prop: "afterBalance",
          label: this.$t("现账户余额"),
          align: 'right'
        },
        // {
        //   prop: "financialCode",
        //   label: "调整类别",
        // },
        {
          prop: "memo",
          label: this.$t("备注"),
        },
        {
          slotName: "financialCode" //调整类别
        },
        {
          prop: "createTime",
          label: this.$t("调整时间"),
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
        marginRight: "0", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      manualShow: false,
      rowData: {},
      postData: {
        financialCode: "",
        walletType: "",
        agyAccount: "",
        amount: "",
        memo: "",
      },
      rules: {
        financialCode: [
          { required: true, message: this.$t("请选择调整类别"), trigger: "blur" },
        ],
        walletType: [
          { required: true, message: this.$t("请选择钱包类型"), trigger: "change" },
        ],
        agyAccount: [
          {
            // type: "date",
            required: true,
            message: this.$t("请输入代理账号"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (/^[a-zA-Z0-9]{6,20}$/.test(value)) {
                callback();
              } else {
                callback(new Error(this.$t("输入{num}位数字、字母或数字与字母组合", { num: '6~20' })));
              }
            },
            trigger: "blur",
          },
        ],
        amount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数的数字")));
              }
            },
            trigger: "blur",
          },
        ],
      },
      safePassword: "",
    };
  },
  components: {
    StartAndEndTimeSelector,
    CopyButton,
  },
  created() {
    this.getTableData();
  },
  mounted() {
    if (this.hasPermission("agent:audit:export")) {
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
        add: hasPermission("agent:audit:add"),
        export: hasPermission("agent:audit:export"),
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
    manualAdjust() {
      this.manualShow = true;
    },
    // d z
    getTableData() {
      this.getCurrentRecodeTime()
      const statuss = this.searchCriteria.keys.statuss;
      this.$axios
        .get(systemConfig.urls.newAggentList.auditList, {
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
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
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
      const { res } = await this.$axios.GET(this.$urls.newAggentList.agentAuditExport, params)
      if (res) {
        await this.agentCheckFile('agentAuditModule')
      }
      this.isNowDowning = true
    },
    closeDetail() {
      this.rowData = {};
      this.memo = null;
      this.manualShow = false;
      this.postData = this.$options.data().postData;
    },
    manualSubmit() {
      this.$refs.financialAdjust.validate((valid) => {
        if (valid) {
          // 安全密码弹窗
      if (!this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.manualSubmit);
        this.$set(this.tmpValue4SafeCheck, "args", []);
        return;
      }

      // 0是拒绝 1是通过 调用不同接口
      let url =
        this.postData.financialCode === 'GA'
          ? systemConfig.urls.newAggentList.auditAdd
          : systemConfig.urls.newAggentList.auditReduce;
      // this.postData.ids = this.unique(this.postData.ids)
      this.$axios
        .post(url, this.postData, {
          headers: { securepwd: this.safePassword || null },
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("成功"),
          });
          this.getTableData();
          this.closeDetail();
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
        } else {
          return false;
        }
      });
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
.memberDespot {
  position: absolute;
  right: 90px;
  top: 13px;
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
  height: 5px;
  top: -20px;
}
</style>
