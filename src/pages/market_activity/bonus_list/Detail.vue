<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData">
      <div class="bonus-list-search_method" slot="searchMethod">
        <el-select style="margin-right: 10px;" v-model="searchMethod">
          <el-option :label="$t('会员')" value="member"></el-option>
          <el-option :label="$t('代理')" value="agent"></el-option>
        </el-select>
        <el-input v-model="searchCriteria.keys.searchContent" v-trim @keyup.enter.native="getTableData"></el-input>
        <el-select style="margin-left: 10px;" v-model="searchCriteria.keys.selectStatus" :placeholder="$t('请选择')" clearable>
          <el-option :label="$t('通过')" value="1"></el-option>
          <el-option :label="$t('拒绝')" value="0"></el-option>
          <el-option :label="$t('待审核')" value="2"></el-option>
        </el-select>
      </div>
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom ref="table" :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" :tableLoading="loading">
      <!-- 标题插槽 -->

      <!-- 按钮插槽(默认插槽) -->
      <div style="width: 100%;display: flex;justify-content: space-between">
        <div>
          <h5 class="bonus-list-title">
            <el-button icon="el-icon-back" @click="goBack" style="margin-right: 30px;">{{ $t('返回') }}</el-button>
            {{ $t('活动名称') }}：<span style=" margin-right: 30px;">{{activityName}}</span>
            {{ $t('状态') }}：<span style="color:red">{{useState==1?$t('进行中'):useState==2?$t('已失效'):$t('未开始')}}</span>
          </h5>
        </div>
        <div>
          <el-button type="primary" v-if="permissions.newAdd && useState!=2 && tmplCode && tmplCode !== 'AQ0000021'" @click="handleAudit(null)">{{ $t('新增记录') }}</el-button>
          <el-button type="primary" v-if="permissions.audit && useState!=2 " @click="handleBatchAudit">{{ $t('批量审核') }}</el-button>
          <el-button v-if="hasPermission('operate:activity:export')" :disabled="!totalCount" class="iconfont el-button-export" size="small" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导出')}}
          </el-button>
        </div>
      </div>
      <!-- 表格插槽 -->
      <el-table-column align="center" :label="$t('奖品名称')" slot="prizename" v-if="tmplCode === 'AQ0000021'">
        <template slot-scope="scope">
          {{getText(scope.row.prizetype, scope.row.prizename)}}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('充值金额')" slot="depositedAmount" v-if="tmplCode !== 'AQ0000021'">
        <template slot-scope="scope">
          {{scope.row.depositedAmount}}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('赠送金额')" slot="bonusAmount">
        <template slot-scope="scope">
          <span v-if="tmplCode === 'AQ0000021' && scope.row.prizetype === 1">
            <!-- 抽奖类型，且奖品名称为实物不展示 -->
            <!-- <span v-if="scope.row.prizetype === 1"> -->
            <!-- prizetype 1 实物 0 彩金 -->
            -
            <!-- </span> -->
            <!-- <span v-else>
              {{scope.row.bonusAmount}}
            </span> -->
          </span>
          <span v-else>{{scope.row.bonusAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column slot="subRuleTmplCode" :label="$t('规则名称')" align="center">
        <template slot-scope="scope">
          <span>{{ { AQ0000003: $t('存就送'), AQ0000012: $t('投就送'), AQ0000004: $t('救援金'), AQ0000015: $t('其他') }[scope.row.subRuleTmplCode] || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          <el-tag :type="{0: 'danger', 1: 'success', 2: 'warning'}[scope.row.status]">
            {{
              {
                0: $t('拒绝'),
                1: $t('通过'),
                2: $t('待审核')
              }[scope.row.status]
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('流水倍数')" slot="discountAudit">
        <template slot-scope="scope">
          <span v-if="tmplCode === 'AQ0000021' && scope.row.prizetype === 1">
            -
            <!-- <span v-if="scope.row.prizetype === 1">
              -
            </span>
            <span v-else>
              {{scope.row.discountAudit}}
            </span> -->
          </span>
          <span v-else>{{scope.row.discountAudit}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column align="left" label="申请人" slot="createUser">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.loginName === scope.row.createUser ? '本人' : scope.row.createUser}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" :label="$t('添加时备注')" slot="applicationMemo" >
        <template slot-scope="scope">
          <span>{{scope.row.applicationMemo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="125" align="center" :label="$t('审核时备注')" slot="memo" >
        <template slot-scope="scope">
          <div>{{scope.row.modifyAmountUser}}</div>
          <div>{{scope.row.modifyAmountTime}}</div>
          <div>{{scope.row.modifyAmountMemo}}</div>
          <div>{{scope.row.memo}}</div>
          <!--审核信息 -->
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" v-if="permissions.audit" width="150">
        <template slot-scope="scope">
          <span class="blue-color pointer" @click="handleAudit(scope.row)" v-if="permissions.audit && scope.row.status === 2&&useState!=2">
            [{{ $t('审核') }}]
          </span>
          <span class="blue-color pointer" @click="handleAdjust(scope.row)" v-if="permissions.adjust && scope.row.status === 2&&useState!=2">
            [{{ $t('金额调整') }}]
          </span>
        </template>
      </el-table-column>
    </TableCom>
    <AuditForm :tmplCode="tmplCode" :info="auditFormInfo" :isVipDiscount="isVipDiscount" :activityId="activityId" :isBatchAudit="isBatchAudit" :formVisible.sync="auditFormVisible" v-if="auditFormVisible" @submit="submitAudit" :isSumbitint="isSumbitint" />
    <AdjustForm :tmplCode="tmplCode" :info="adjustData" :formAdjustVisible.sync="adjustShow" v-if="adjustShow" @adjustSubmit="submitAdjust" />
  </div>
</template>

<script>
import AuditForm from "./Form";
import AdjustForm from "./Adjust";
import { mapGetters } from "vuex";
import queryStore from "../../../mixins/queryStore";
import systemConfig from "../../../config/config.js";

const { toThousands } = systemConfig;

export default {
  name: "bonusDetail",
  components: {
    AuditForm,
    AdjustForm,
  },
  mixins: [queryStore(["searchMethod", "searchCriteria.keys"])],
  data() {
    return {
      isExporting: false,
      recodeTime: '',
      isSumbitint: false,
      loading: false,
      safePassword: "",
      tmpValue4SafeCheck: {},
      searchMethod: "member",
      searchCriteria: {
        keys: {
          searchContent: null,
          selectStatus: null,
        },
        meta: [
          {
            label: this.$t("查询条件"),
            slotName: "searchMethod",
          },
        ],
      },
      tableNotIncludesColumns: [
        {
          type: "selection",
          selectable(row, index) {
            return row.status === 2;
          },
        },
        {
          prop: "loginName",
          label: this.$t("会员"),
          fixed: "left",
        },
        {
          prop: "agyAccount",
          label: this.$t("所属代理"),
          fixed: "left",
        },
        {
          slotName: "prizename", // 抽奖 - 赠送金额
        },
        // {
        //   prop: 'depositedAmount',
        //   label: '充值金额'
        // },
        {
          slotName: "depositedAmount", // 抽奖 - 赠送金额
        },
        // {
        //   prop: 'prizeName',
        //   label: '奖品名称'
        // },
        {
          slotName: "bonusAmount", // 除抽奖外 - 赠送金额
        },
        {
          slotName: 'subRuleTmplCode'
        },
        // {
        //   prop: 'bonusAmount',
        //   label: '赠送金额'
        // },
        // {
        //   prop: 'discountAudit',
        //   label: '流水倍数'
        // },
        {
          slotName: "donateAmount",
        },
        {
          slotName: "status",
        },
        {
          slotName: "multipleWater",
        },
        {
          slotName: "discountAudit", // 除抽奖外 - 流水倍数
        },
        {
          prop: "auditAmount",
          label: this.$t("流水金额"),
          align: 'right'
        },
        {
          prop: "applicationTime",
          label: this.$t("申请时间"),
          width: 150
        },
        {
          // 申请人
          prop: "createUser",
          label: this.$t("申请人"),
          formatter: (row, column, cellValue, index)=>{
            return cellValue?cellValue:this.$t("本人")
          }
        },
        {
          prop: "auditTime",
          label: this.$t("审核时间"),
          width: 150
        },
        {
          prop: "auditUser",
          label: this.$t("审核人"),
        },
        {
          prop: "1",
          label: "",
          width: 1
        },
        {
          slotName: "applicationMemo",
        },
        {
          slotName: "memo",
        },
        {
          slotName: "operation",
        },
        {
          label: this.$t('是否为黑名单'),
          prop: 'isBlack',
          render(h, row) {
            const { isBlack } = row
            return h('span', { class: isBlack === '是' ? 'red' : '' }, isBlack)
          }
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      auditFormInfo: {},
      isBatchAudit: false,
      auditFormVisible: false,
      enterStatus: null,
      adjustShow: false,
      adjustData: {},
    };
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    activityId() {
      return this.$route.query.activityId;
    },
    activityName() {
      return this.$route.query.activityName;
    },
    useState() {
      return this.$route.query.useState;
    },
    tmplCode() {
      return this.$route.query.tmplCode;
    },
    isVipDiscount() {
      // 是否是vip晋级活动
      return this.tmplCode === "AQ0000018";
    },
    multipleSelection() {
      return this.$refs.table.multipleSelection;
    },
    permissions() {
      const { hasPermission } = this;
      return {
        audit: hasPermission("operate:activity:activityAudit"),
        newAdd: hasPermission("operate:bonus:save"),
        adjust: hasPermission("operate:activity:ModifyAmount"),
      };
    },
    ...mapGetters(["hasPermission"]),
  },
  created() {
    const routeQuery = this.$route.query;
    const str = (this.enterStatus = routeQuery.status);
    const loginNameStr = (this.enterLoginName = routeQuery.loginName);
    this.$set(this.searchCriteria.keys, "selectStatus", str ? str : "");
    this.$set(
      this.searchCriteria.keys,
      "searchContent",
      loginNameStr ? loginNameStr : ""
    );
    const colums = JSON.parse(JSON.stringify(this.tableNotIncludesColumns));
    colums[3].label = this.$t("中心钱包余额");
    colums.splice(5, 0, {
      prop: "gmCatName",
      label: this.$t("选择场馆"),
    });
    this.tableColumns = this.isVipDiscount
      ? colums
      : this.tableNotIncludesColumns;
  },
  mounted() {
    // if (!this.useQueryStoreCache) {

    // }
    // 不加会出样式问题 巨坑
    this.$store.state.indexActive = "4-2-1";
    this.getTableData();
  },
  methods: {
    handleExport() {
      this.isExporting = true;
      const { activityId } = this;
      let params = {activityId}
      const { searchContent, selectStatus } = this.searchCriteria.keys;
      params.status = selectStatus;
      if (this.searchMethod === "member") {
        params.loginName = searchContent;
      } else {
        params.agyAccount = searchContent;
      }
      this.$axios
        .get(systemConfig.urls.bonusList.activityAuditListExport, {params})
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
          } else {
            this.recodeTime = systemConfig.getNowTime();
            this.checkExportFile();
          }
        });
    },
    checkExportFile() {
      this.$axios.get(systemConfig.urls.bonusList.checkBonusExportFile).then((res) => {
        const obj = res.data.data || {};
        const fileName = obj.fileName,
          downloadFileName = obj.downloadFileName;
        if (fileName) {
          const { baseURL } = res.config;
          // 下载文件
          let SToken = localStorage.getItem("SToken");
          window.open(
            baseURL +
              `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
          );
          this.isExporting = false;
        } else {
          // window.setTimeout(this.checkExportFile, 1000);
          let nowTime = systemConfig.getNowTime(); // 10 * 60 * 1000
            if (nowTime - this.recodeTime <= 600000) {
              //10分钟的时间间隔
              setTimeout(() => this.checkExportFile(), 5000);
            } else {
              this.$message({
                type: "warning",
                message: "导出时间超过10分钟",
              });
            }
        }
      });
    },
    getText(prizetype, prizename) {
      // 0 彩金 1 实物
      if (prizetype) return prizename;
      return [this.$t("彩金"), this.$t("实物")][prizetype];
    },
    submitAudit(formModel) {
      this.isSumbitint = true;
      const { isBatchAudit, auditFormInfo, activityName } = this;
      const { id, memo, status, tmplCode, catId } = formModel;
      const isVipDiscount =
        auditFormInfo && auditFormInfo.tmplCode === "AQ0000018";

      let url =
        formModel.status === 0
          ? systemConfig.urls.bonusList.auditRefuse
          : systemConfig.urls.bonusList.audit;

      if (auditFormInfo) {
        // 审核或批量审核
        // 安全密码弹窗
        if (formModel.status != 0 && !this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit(
            "safePasswordCallbackPageBegin",
            this.$options.name
          );
          this.$set(this.tmpValue4SafeCheck, "callback", this.submitAudit);
          this.$set(this.tmpValue4SafeCheck, "args", [formModel]);
          return;
        }
        const arr = isBatchAudit ? this.multipleSelection : [id];
        const obj = {
          memo,
          status,
          activityName,
          bonusAuditListDtos: arr.map((bonuseId) => {
            return {
              bonuseId,
              tmplCode: this.tableData.find((item) => item.id === bonuseId)
                .tmplCode,
            };
          }),
        };
        const params = isVipDiscount ? { ...obj, catId } : obj;
        this.$axios
          .post(url, params, {
            headers: { securepwd: this.safePassword || null },
          })
          .then(() => {
            this.auditFormVisible = false;
            this.$message.success(this.$t("审核成功"));
            this.getTableData();
          })
          .finally(() => {
            this.safePassword = "";
            this.tmpValue4SafeCheck = {};
          });
      } else {
        let arr = [].concat(formModel)
        arr.map(ws=>{
          ws.activityId = this.activityId
        })
        // 新增记录
        this.$axios
          .post(systemConfig.urls.bonusList.save, arr)
          .then(() => {
            this.auditFormVisible = false;
            this.$message.success(this.$t("操作成功"));
            this.getTableData();
          })
          .finally(() => {});
      }
    },
    submitAdjust(formModel) {
      if (formModel.status != 0 && !this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.submitAdjust);
        this.$set(this.tmpValue4SafeCheck, "args", [formModel]);
        return;
      }
      const {
        id,
        modifyAmountMemo,
        newBonusAmount,
        newAuditAmount,
      } = formModel;
      const params = {
        id,
        modifyAmountMemo,
        auditAmount: newAuditAmount,
        bonusAmount: newBonusAmount,
      };
      this.$axios
        .post(systemConfig.urls.bonusList.activityModifyAmount, params, {
          headers: { securepwd: this.safePassword || null },
        })
        .then(() => {
          this.adjustShow = false;
          this.$message.success(this.$t("编辑成功"));
          this.getTableData();
        })
        .finally(() => {
          this.safePassword = "";
        });
    },
    handleBatchAudit() {
      if (this.multipleSelection.length) {
        this.isBatchAudit = true;
        this.auditFormInfo = {};
        this.auditFormVisible = true;
      } else {
        this.$message.warning(this.$t("请至少选择一个选项"));
      }
    },
    handleAudit(info) {
      this.isBatchAudit = false;
      this.auditFormInfo = info;
      this.auditFormVisible = true;
    },
    handleAdjust(info) {
      this.adjustShow = true;
      this.adjustData = {
        ...info,
        newBonusAmount: null,
        newAuditAmount: null,
      };
    },
    getTableData() {
      this.isSumbitint = false;
      const param = {};
      const { activityId } = this;
      const { searchContent, selectStatus } = this.searchCriteria.keys;
      param.status = selectStatus;
      if (this.searchMethod === "member") {
        param.loginName = searchContent;
      } else {
        param.agyAccount = searchContent;
      }
      this.loading = true;
      this.$axios
        .get(systemConfig.urls.bonusList.auditList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            // ...this.searchCriteria.keys,
            activityId,
            ...param,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res) {
            this.totalCount = res.data.page.totalCount;
            this.tableData = res.data.page.list.map((item) => {
              const shouldToThousandsFileds = [
                "depositedAmount",
                "bonusAmount",
                'auditAmount',
              ];
              for (const field of shouldToThousandsFileds) {
                item[field] = toThousands(item[field]);
              }
              item.auditTime = systemConfig.transferTimeByType(
                item.auditTime,
                "bj"
              );
              item.applicationTime = systemConfig.transferTimeByType(
                item.applicationTime,
                "bj"
              );
              item.modifyAmountTime = systemConfig.transferTimeByType(
                item.modifyAmountTime,
                "bj"
              );
              /* if(this.useState==2&&item.status!=1){
              item['memo']="活动已失效，系统拒绝通过此红利申请"
            } */
              return item;
            });
          }
        });
    },
    goBack() {
      this.$router.push({
        path: "/main/marketActivity/bonusList",
        query: {
          status: this.enterStatus,
          loginName: this.enterLoginName,
        },
      });
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
};
</script>

<style lang="scss" scoped>
.bonus-list-search_method {
  display: flex;
}
.bonus-list-title {
  float: left;
  font-size: 14px;
  line-height: 30px;
}
</style>
