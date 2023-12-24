<template>
  <div class="game-data-sheet">
    <!--查询条件-->
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width180">
          <label>{{ $t('会员帐号') }}</label>
          <el-select
            v-model="accountId"
            :placeholder="$t('请选择')"
            @change="checkAgy"
          >
            <el-option
              v-for="item in commonIds"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="accountId === 1">
          <label></label>
          <input type="text" v-model="memberName" v-trim />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <el-select
            v-model="agyId"
            :placeholder="$t('请选择')"
            @change="checkAccount"
          >
            <el-option
              v-for="item in commonIds"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
            <el-option :key="2" :label="$t('正式代理')" :value="2" />
            <el-option :key="3" :label="$t('测试代理')" :value="3" />
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="agyId === 1">
          <label for=""></label>
          <input type="text" v-model="agyAccount" v-trim @keyup.enter="getData" />
        </div>

        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('领取时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :selections="timeSelections"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
          />
        </div>
      </div>
      <div class="div-search-btn" style="top: 55%;transform: translateY(-50%)">
        <el-button type="primary" @click.stop="getData" class="wid-80"
          >{{ $t('查询') }}</el-button
        >
        <el-button type="danger" @click="reset" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <TableCom
      v-if="!recodeShow"
      :tableLoading="loading"
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :hasPagination="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <el-table-column
        align="center"
        :label="$t('总参与人数')"
        fixed="right"
        slot="participate"
      >
        <template slot-scope="scope">
          --
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$t('总领取人数')"
        slot="receiveNum"
      >
        <template slot-scope="scope">
          {{ scope.row.financialcode == "XS" ? "--" : scope.row.receiveNum }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        fixed="right"
        :label="$t('总派发金额')"
        slot="bonusAmount"
      >
        <template slot-scope="scope">
          {{ scope.row.financialcode == "XS" ? "--" : toThousands(scope.row.bonusAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        fixed="right"
        :label="$t('总充值金额')"
        slot="recharge"
      >
        <template slot-scope="scope">
          --
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        :label="$t('总新增用户')"
        slot="addUser"
      >
        <template slot-scope="scope">
          --
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('操作')"
        slot="operation"
        v-if="permissions.cashStatistic"
      >
        <template slot-scope="scope">
          <span
            class="blue-color pointer"
            @click.stop="getTableData(scope.row.configId, true)"
            v-if="scope.row.financialcode !== 'XS'"
          >
            {{ $t('领取记录') }}
          </span>
        </template>
      </el-table-column>
    </TableCom>
    <TableCom
      v-show="recodeShow"
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :goBack="true"
      :tableLoading="loading"
      :hasPagination="true"
      :tableData="cashRecodeData"
      :tableColumns="cashRecodeColumns"
      :pageSize.sync="pageSize"
      :currentPage.sync="pageNo"
      :totalCount="totalCount"
      :tableBtns="[{ text: $t('导出'), event: 'export', type: 'primary', style: 'width: 100px;', class: 'iconfont icon-export', loading: exportLoading }]"
      @export="handleExport"
      @goBack="goBack"
      @reloadData="getTableData(recodeId, true)"
    >
      <el-table-column align="center" :label="$t('序号')" slot="index" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('会员名')" slot="loginName">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.stop="handleLogin(scope.row)"
          >
            {{ scope.row.loginName }}
          </el-button>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>
<script>
import systemConfig from "../../../config/config.js";
import queryStore from "../../../mixins/queryStore";
import fileExport from "../../../mixins/fileExport";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  name: "moneySheet",
  mixins: [
    Mixin,
    queryStore([
      "startTime",
      "endTime",
      "agyId",
      "agyAccount",
      "accountId",
      "memberName",
      "recodeFid"
    ]),
    fileExport
  ],
  components: { StartAndEndTimeSelector },
  data() {
    return {
      loading: false,

      agyAccount: "",
      memberName: "",
      agyId: "",
      recodeFid: "",
      accountId: 0,
      commonIds: [
        { key: 0, value: this.$t("全选") },
        { key: 1, value: this.$t("精确查询") }
      ],
      timeSelections: [
        {
          label: this.$t("今日"),
          value: "today"
        },
        {
          label: this.$t("昨日"),
          value: "yesterday"
        },
        {
          label: this.$t("本周"),
          value: "currentWeek"
        },
        {
          label: this.$t("上周"),
          value: "lastWeek"
        },
        {
          label: this.$t("本月"),
          value: "currentMonth"
        }
      ],
      startTime: "",
      endTime: "",
      tableData: [],
      tableColumns: [
        {
          prop: "taskName",
          label: this.$t("任务名称"),
          align: "center"
        },
        {
          prop: "number",
          label: this.$t("总点击量"),
          align: "center"
        },
        {
          slotName: "participate"
        },
        {
          slotName: "receiveNum"
        },
        {
          slotName: "bonusAmount"
        },
        {
          slotName: "recharge"
        },
        {
          slotName: "addUser"
        },
        {
          slotName: "operation"
        }
      ],
      cashRecodeData: [],
      cashRecodeColumns: [
        { slotName: "index" },
        {
          prop: "taskName",
          label: this.$t("任务类型")
        },
        {
          slotName: "loginName"
        },
        {
          prop: "agyAccount",
          label: this.$t("上级代理")
        },
        {
          prop: "bonusAmount",
          label: this.$t("领取金额"),
          align: 'right'
        },
        {
          prop: "time",
          label: this.$t("领取时间")
        }
      ],
      reqParams: {},
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      exportLoading: false,
      recodeShow: false,
      recodeStartTime: null,
      recodeEndTime: null,
      isRecodeForm: false
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    permissions() {
      const { hasPermission } = this;
      return {
        boounsStatistic: hasPermission("task:account:bounsList"),
        cashStatistic: hasPermission("task:account:bounsdetail"), //领取纪录查看权限
        memberList: hasPermission("member:mbraccount:list")
      };
    },
    ...mapGetters(["hasPermission"])
  },
  methods: {
    toThousands(money) {
      if (money === 0) return 0
      return systemConfig.toThousands(money);
    },
    async handleExport() {
      this.exportLoading = true
      const { res } = await this.$axios.GET(this.$urls.taskCenterStatistic.exportBounsStatistical, this.reqParams)
      if (res) {
        await this.exportCheckFile('bounsStatisticalList', this.$urls.taskCenterStatistic.checkFile)
      }
      this.exportLoading = false
    },
    checkAgy(val) {
      this.agyId = "";
      this.agyAccount = "";
    },
    checkAccount(val) {
      this.memberName = "";
      this.accountId = "";
    },
    getData() {
      this.getCurrentRecodeTime()
      if (!this.recodeShow) {
        this.getTableData();
      } else {
        this.getTableData(this.recodeId, true);
      }
    },
    getTableData(configId, isRecodeForm) {
      this.getCurrentRecodeTime()
      this.recodeId = configId;
      this.recodeShow = isRecodeForm || false;
      if (
        (this.startTime && !this.endTime) ||
        (!this.startTime && this.endTime)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入完整的时间段")
        });
        return;
      }
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("起始时间不能大于结束时间")
          });
          return;
        }
      }
      if (this.agyId == 1 && !this.agyAccount) {
        this.$message({
          type: "warning",
          message: this.$t("请输入代理名称")
        });
        return;
      }
      if (this.accountId == 1 && !this.memberName) {
        this.$message({
          type: "warning",
          message: this.$t("请输入会员账号")
        });
        return;
      }
      if (this.agyId !== 1) {
        this.agyAccount = "";
      }
      this.loading = true;
      switch (this.agyId) {
        case 0:
          this.isCagency = "";
          break;
        case 2:
          this.isCagency = 1;
          break;
        case 3:
          this.isCagency = 0;
          break;
      }

      let url = isRecodeForm
        ? this.$systemConfig.urls.taskCenterStatistic.getRecodeList
        : this.$systemConfig.urls.taskCenterStatistic.bonunsStatistic;
      let commonsParams = {
        startTime: this.startTime ? this.startTime + " 00:00:00" : "",
        endTime: this.endTime ? this.endTime + " 23:59:59" : "",
        loginName: this.memberName,
        agyAccount: this.agyAccount,
        isCagency: this.isCagency
      };
      let recodeParams = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        configId: configId
      };
      if (!this.recodeShow) {
        this.recodeCommonsParams = JSON.parse(
          JSON.stringify({
            ...commonsParams,
            accountId: this.accountId,
            memberName: this.memberName,
            agyId: this.agyId
          })
        );
      }
      let params = isRecodeForm
        ? { ...commonsParams, ...recodeParams }
        : commonsParams;
      this.reqParams = params
      this.$axios
        .get(url, { params })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.loading = false;
          if (isRecodeForm) {
            let data = res.data.page;
            this.cashRecodeData = data.list.map(item => {
              item.bonusAmount = this.toThousands(item.bonusAmount)
              item.time = systemConfig.transferTimeByType(item.time, "bj");
              return item;
            });
            this.totalCount = data.totalCount;
          } else {
            this.tableData = res.data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pageNo = 1;
      this.getTableData(this.recodeId, true);
    },
    handleCurrentChange(val) {
      this.getTableData(this.recodeId, true);
    },
    reset() {
      Object.assign(this.$data, this.$options.data());
      this.pageNo = 1
      this.getData()
    },
    goBack() {
      for (let key in this.recodeCommonsParams) {
        this[key] = this.recodeCommonsParams[key];
      }
      this.recodeShow = false;
      this.getData();
    },
    handleLogin({ loginName, accountId }) {
      /* if (!this.permissions.memberList) {
        this.$message({
          type: "warning",
          message: "当前无会员列表查看权限"
        });
        return;
      } else { */
      this.$router.push({
        path: "/main/memberManage/memberDetail",
        query: {
          loginName: loginName,
          id: accountId
        }
      });
      /* } */
    }
  },
  watch: {
    accountId(val) {
      if (val === 0) {
        this.memberName = "";
      }
    },
    pageSize(n) {
      this.pageNo = 1;
    }
  }
};
</script>
<style lang="scss">
.mt50 {
  margin-top: 50px;
}

@media screen and (max-width: 1460px) {
  .game-data-sheet {
    .width180 {
      width: 150px !important;
      input {
        width: 150px !important;
      }
    }
  }
}

.caijin {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
  }
}
.statistics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  .statistics-cell {
    position: relative;
    flex: 1;
    margin-right: 20px;
    height: 58px;
    background: #f0f3f9;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      background: #e6f0fa;
    }
    h3 {
      position: absolute;
      bottom: 8px;
      left: 10px;
    }
    .money {
      position: absolute;
      top: 10px;
      left: 10px;
      font-weight: bold;
      font-size: 16px;
    }
    .icon-wenhao {
      font-size: 14px;
      cursor: pointer;
    }
    .icon-5,
    .icon-wallet,
    .icon-hongli,
    .icon-paicai,
    .icon-caijin,
    .icon-yinli,
    .el-icon-sold-out {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #b5b4c2;
      font-size: 24px;
    }
  }
}
.tableToTop {
  position: absolute;
  right: 82px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
.staticAnalysis {
  position: relative;
  margin-top: 70px;
  .goback {
    width: 100px;
    position: absolute;
    right: 0;
    top: -37px;
    text-align: center;
    border: 1px solid black;
    height: 20px;
    line-height: 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  .eachOne {
    margin-top: 10px;
    font-weight: bolder;
    .up {
      padding-bottom: 10px;
      border-bottom: 1px solid rgb(220, 220, 220);
      line-height: 18px;
      height: 18px;
      margin-bottom: 10px;
      .l {
        float: left;
      }
      .r {
        float: right;
      }
    }
    ul {
      padding-left: 10px;
      margin-top: 15px;
      li {
        display: inline-block;
        min-width: 150px;
        height: 60px;
        background-color: #f2f3f8;
        border-radius: 5px;
        margin: 0 20px 10px 0;
        padding: 5px;
        box-sizing: border-box;
        p {
          height: 25px;
          line-height: 25px;
          color: #999999;
          text-align: center;
        }
        .p2 {
          color: #333333;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
