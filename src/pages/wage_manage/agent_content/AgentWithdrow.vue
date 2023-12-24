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
  @reloadData="getTableData"
  class="table_data"
  :showLoadTime="true"
	:networkLoadTime="networkLoadTime"
	:dataSolveTime="dataSolveTime">
    <div slot="slot-title" class="export-div" style="height: 50px;">
      <TimeEvery @getTime="setTimeRefresh" class="memberDespot" :style="{ marginRight: '95px' }"></TimeEvery>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="hasPermission('agent:accWithdraw:export')&&isNowDowning" :disabled="!totalCount" @click="handleExport">{{ $t('导出') }}</el-button>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="hasPermission('agent:accWithdraw:export')&&!isNowDowning">{{ $t('导出中') }}...</el-button>
    </div>
    <!-- 表格插槽 -->
    <el-table-column :label="$t('订单号')" slot="orderNo" align="center">
      <template slot-scope="scope">
        <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button>
      </template>
    </el-table-column>
    <el-table-column :label="$t('状态')" slot="status" align="center">
      <template slot-scope="scope">
        {{[$t('拒绝'), $t('通过'), $t('初审'), $t('复审')][scope.row.status]}}
      </template>
    </el-table-column>
  </TableCom>
  <el-dialog @close="closeDetail" :title="getTitle(rowData.status).title" :visible.sync="detailShow">
      <el-form label-position="right" label-width="auto">
        <el-row>
          <el-col :span="24" v-show="rowData.orderPrefix">
            <el-form-item :label="$t('订单号') + ':'" class="first-line"><span>{{rowData.orderPrefix}}{{rowData.orderNo}}</span>
              <CopyButton style="float: right;" :copy-content="rowData.orderPrefix + rowData.orderNo+''" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" v-if="rowData.orderId">
            <el-form-item label="事件订单号 :" class="first-line"><span>{{rowData.orderId}}</span>
              <CopyButton style="float: right;" :copy-content="rowData.orderId" />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24">
            <el-form-item label="会员名称 :" class="first-line"><span>{{rowData.loginName}}({{rowData.groupName}})</span>
              <span class="toggle_to_new_page" @click="checkAllOrder(rowData.loginName)">查看所有订单>></span>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item :label="$t('代理账号') + ':'" class="first-line"><span>{{rowData.agyAccount}}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item label="代理关系 :" class="first-line">
              <span>{{ rowData.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col> -->
          <template v-if="rowData.methodType === 1">
            <el-col :span="24">
              <el-form-item :label="$t('出款钱包') + ':'" class="first-line"><span>{{rowData.walletName}}</span></el-form-item>
            </el-col>
            <el-col :span="24" v-if="rowData.status !== 2">
              <el-form-item :label="$t('USDT原始订单号') + ' :'" class="first-line"><span class="toggle_to_new_page" @click="toggleTo(rowData.hash)">{{rowData.hash}}</span></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('出款方式') + ':'" class="first-line"><span>{{rowData.currencyCode}}-{{rowData.currencyProtocol}}</span></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('会员收款钱包地址') + ':'" class="first-line"><span>{{rowData.walletAddress}}</span></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('参考汇率') + ':'" class="first-line"><span>1{{rowData.currencyCode}} = {{rowData.exchangeRate}}{{ currencySymbol() }}</span></el-form-item>
            </el-col>
          </template>

          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户姓名') + ':'" class="first-line"><span id="realName">{{bankData.mbrBankcard.realName}}</span>
              <span class="copied" v-show="copied1">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=1" class="clip iconfont icon-copy" data-clipboard-target="#realName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户帐号') + ':'" class="first-line"><span id="cardNo">{{bankData.mbrBankcard.cardNo}}</span>
              <span class="copied" v-show="copied2">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=2" class="clip iconfont icon-copy" data-clipboard-target="#cardNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('收款银行') + ':'" class="first-line"><span id="bankName">{{bankData.mbrBankcard.bankName}}</span>
              <span class="copied" v-show="copied3">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=3" class="clip iconfont icon-copy" data-clipboard-target="#bankName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户支行') + ':'" class="first-line"><span id="address">{{bankData.mbrBankcard.address}}</span>
              <span class="copied" v-show="copied4">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=4" class="clip iconfont icon-copy" data-clipboard-target="#address"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('提款金额') + ':'" class="first-line">
              <span>{{bankData.drawingAmount}}</span>
              <span>
                <template v-if="bankData.status !== 0">
                  {{bankData.withdrawCount > 1? translate(bankData.withdrawCount) : $t('首提')}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </template>
                <!-- CNY -->
                {{ currencySymbol() }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('提款手续费') + ':'" class="first-line">
              <span>{{bankData.handlingCharge}}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际出款') + ':'" class="first-line">
              <span>{{bankData.actualArrival}}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="rowData.methodType === 1" :span="24">
            <el-form-item :label="$t('实际到账') + ':'" class="first-line">
              <span>{{bankData.actualArrivalCr}}</span>
              <span>{{rowData.currencyCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="checkResultIsShow">
            <el-form-item :label="getTitle(rowData.status).checkResult">
              <div>
                <el-radio v-model="trueStatus" :label="1">{{ $t('通过') }}</el-radio>
                <el-radio v-model="trueStatus" :label="0">{{ $t('拒绝') }}</el-radio>
              </div>
            </el-form-item>
          </el-col>
<!--          <el-col v-if="!checkResultIsShow" :span="24">-->
<!--            <el-form-item label="添加稽核 :" class="add-check">-->
<!--              <span>本金</span>-->
<!--              <el-input v-model="depositAmount" @keyup.native="inputUp('depositAmount')"></el-input>元，-->
<!--              <span>需要流水</span>-->
<!--              <el-input v-model="auditAmount" @keyup.native="inputUp('auditAmount')"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item :label="$t('审核备注') + ':'" class="first-line">
              <el-input class="left" :disabled="rowData.status === 1 || rowData.status === 0" type="textarea" v-model="memo" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="!checkResultIsShow&&rowData.status === 2">
            <el-form-item :label="$t('站内信') + ':'">
              <el-select size="small" v-model="inMailType" :placeholder="$t('请选择')" filterable clearable>
                <el-option v-for="item in inMailTypeList" :key="item.value" :label="item.label" :value="item.value">
                  {{item.label}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.status !== 2">
            <el-form-item :label="$t('出款备注') + ':'" class="first-line">
              <el-input class="left" :disabled="rowData.status === 1 || rowData.status === 0" type="textarea" v-model="rowData.memoWithdraw" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn" v-if="rowData.status === 2 || rowData.status === 3">
                  <el-button type="primary" v-if="rowData.status === 2&&permissions.edit1||rowData.status === 3&&permissions.edit2" @click.native="changeStatus(rowData.status, trueStatus ? rowData.status : 0, rowData.id)">{{ $t('确定') }}</el-button>
                  <el-button @click.native="closeDetail">{{ $t('取消') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
</div>
</template>

<script>
import systemConfig from "../../../config/config.js";
import TimeEvery from "../../../components/TimeEvery";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import fileExport from "../../../mixins/fileExport";
import queryStore from "../../../mixins/queryStore";
import {
  mapGetters
} from "vuex";
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
      trueStatus: 1,
      safePassword: "",
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
        meta: [{
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "select",
            multiple: true,
            label: this.$t("状态"),
            prop: "statuss",
            options: [{
                value: 2,
                label: this.$t("初审")
              },
              {
                value: 1,
                label: this.$t("通过")
              },
              {
                value: 0,
                label: this.$t("拒绝")
              },
              {
                value: 3,
                label: this.$t("复审")
              },
            ],
          },
          {
            label: this.$t("入款时间"),
            slotName: "searchTime",
            options: [{
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
      tableColumns: [{
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
          prop: "drawingAmount",
          label: this.$t("提款金额"),
          align: 'right'
        },
        {
          prop: "handlingCharge",
          label: this.$t("手续费"),
          align: 'right'
        },
        {
          prop: "actualArrival",
          label: this.$t("实际金额"),
          align: 'right'
        },
        {
          prop: "actualArrivalCr",
          label: this.$t("USDT金额"),
          align: 'right'
        },
        // {
        //   prop: "payType",
        //   label: "收款渠道",
        // },
        {
          prop: "createTime",
          label: this.$t("申请时间"),
        },
        {
          prop: "auditUser",
          label: this.$t("审核人"),
        },
        {
          slotName: "status",
        },
        {
          prop: "auditTime",
          label: this.$t("审核时间"),
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      options: [{
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
      detailShow: false,
      rowData: {},
      bankData: {},
      copied1: false,
      copied2: false,
      copied3: false,
      copied4: false,
      depositAmount: null,
      auditAmount: null,
      inMailType: null,
      inMailTypeList: [
        {
          label: this.$t("流水不足"),
          value: 1,
        },
        {
          label: this.$t("违规下注"),
          value: 2,
        },
        {
          label: this.$t("优惠套利"),
          value: 3,
        },
        {
          label: this.$t("注单审核"),
          value: 4,
        },
      ],
      curOrderId: "",
      methodType: "",
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
    if (this.hasPermission("agent:accWithdraw:export")) {
      this.deposit = {
        "margin-right": "75px",
      };
    }
  },
  computed: {
    checkResultIsShow() {
      return this.rowData.status === 2 || this.rowData.status === 3;
    },
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
      const {
        hasPermission
      } = this;
      return {
        edit1: hasPermission("agent:accWithdraw:update"),
        edit2: hasPermission("agent:accWithdraw:FinialUpdate"),
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
    translate(num) {
      let str
      switch (num) {
        case 2: {
          str = this.$t('第2次')
          break
        }
        case 3: {
          str = this.$t('第3次')
          break
        }
        default: {
          str = this.$t('第{num}次', { num })
        }
      }
      return str
    },
    getTitle(status) {
      switch (status) {
        case 2: {
          return {
            title: this.$t("客服审核"),
            checkResult: this.$t("初审结果"),
          };
          break;
        }
        case 3: {
          return {
            title: this.$t("财务审核"),
            checkResult: this.$t("复审结果"),
          };
          break;
        }
        default: {
          return {
            title: this.$t("审核详情"),
            checkResult: this.$t("审核结果"),
          };
        }
      }
    },
    isZero(val) {
      return val === 0;
    },
    isNotZero(val) {
      return val !== 0;
    },
    showDetail(rowData) {
      this.rowData = rowData
      this.$axios.get(systemConfig.urls.newAggentList.accInfo + '/' + rowData.id).then((res)=> {
        this.detailShow = true;
        this.bankData = res.data.accWithdraw;
        this.copied1 = false;
        this.copied2 = false;
        this.copied3 = false;
        this.copied4 = false;
        this.bankData = res.data.accWithdraw;
        this.memo = this.rowData.memo;
        // if (this.bankData.mbrBankcard) {
        //   this.findNewAgentByloginName(rowData.loginName).then(
        //     (agentBreadcrumb) => {
        //       this.$set(this.rowData, "agentBreadcrumb", agentBreadcrumb);
        //     }
        //   );
        // }
      })
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
        .get(systemConfig.urls.newAggentList.agentWithdraw, {
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
            const {
              list,
              totalCount
            } = res.data.page;
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
              item.drawingAmount =  (item.drawingAmount || 0).toLocaleString()
              item.actualArrival =  (item.actualArrival || 0).toLocaleString()
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
      const { res } = await this.$axios.GET(this.$urls.newAggentList.accWithdrawExport, params)
      if (res) {
        await this.agentCheckFile('accWithdrawModule')
      }
      this.isNowDowning = true
    },
    closeDetail() {
      if(!this.detailShow) return // detailShow为false关闭时，会自动再次出发弹窗关闭时间
      this.detailShow = false;
      this.depositAmount = this.auditAmount = null;
      this.trueStatus = 1;
      this.getTableData();
      this.rowData = {};
      this.memo = null;
    },
    // 修改某条数据的状态 trueStatus走不同的接口
    changeStatus(status, trueStatus, id) {
      if (trueStatus != 0 && !this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.changeStatus);
        this.$set(this.tmpValue4SafeCheck, "args", [status, trueStatus, id]);
        return;
      }

      let isRefuse = trueStatus === 0;
      let url = "";
      if (status === 3) {
        url = isRefuse
          ? systemConfig.urls.newAggentList.memberUpdateFinialStatusRefuse
          : systemConfig.urls.newAggentList.memberUpdateFinialStatus;
      } else {
        url = isRefuse
          ? systemConfig.urls.newAggentList.memberUpdateStatusRefuse
          : systemConfig.urls.newAggentList.memberUpdateStatus;
      }
      // 通过都传1  其余传0
      if (trueStatus === 0) {
        // trueStatus = 0
        const bool = this.compareData(this.depositAmount, this.auditAmount);
        if (!bool) {
          this.$message.warning(
            this.$t("添加稽核的本金和流水需要同时填写或者同时不填写")
          );
          return;
        }
      } else {
        trueStatus = 1;
      }
      const obj = {
        status: trueStatus,
        id: id,
        memo: this.memo,
        memoWithdraw: this.rowData.memoWithdraw,
      };
      let params = trueStatus
        ? obj
        : {
            ...obj,
            depositAmount: this.depositAmount,
            auditAmount: this.auditAmount,
          };
      if (status === 2 && trueStatus === 0) {
        // 风控初审聚聚出款-给会员发送不同站内信泪别
        params = {
          ...params,
          inMailType: this.inMailType,
        };
      }
      this.$store.state.fullscreenLoading = true;
      this.$axios
        .post(url, params, {
          headers: { securepwd: this.safePassword || null },
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("状态修改成功"),
          });
          // bus.$emit("updateCount", true);
          this.closeDetail();
          /* this.getTodayWithdraw() */
          // this.getData();
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
    },
    compareData(a, b) {
      const bool1 = !!a && !!b;
      const bool2 = !a && !b;
      const bool3 =
        bool2 &&
        ((this.isZero(a) && this.isZero(b)) ||
          (this.isNotZero(a) && this.isNotZero(b)));
      const bool4 = (!!a && this.isZero(b)) || (!!b && this.isZero(a));
      return bool1 || bool3 || bool4;
    },
    changeMemo() {
      this.closeDetail();
    },
  },
  /*组件销毁的时候清除定时器*/
  destroyed: function () {
    clearInterval(this.timeOut);
  },
};
</script>

<style lang="scss" scoped>
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
