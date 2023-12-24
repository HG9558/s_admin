<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
      ref="searchCom"
    >
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"

    >
      <el-button type="primary" @click="handleActBlack" v-if="permissions.blacklist">{{ $t('活动黑名单') }}</el-button>
      <el-button type="primary" @click="activityDialogVisible = true" class="el-icon-circle-plus-outline" v-if="permissions.add">{{ $t('新增') }}</el-button>
      <!-- 表格插槽 -->
      <el-table-column fixed="right" align="center" :label="$t('状态')" slot="available">
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            :disabled="!permissions.available"
            v-model="scope.row.available"
            @change="handleAvailableChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <span
            class="blue-color pointer"
            v-if="permissions.edit"
            @click="
              jumpToForm({
                id: scope.row.id,
                actTmplId: scope.row.actTmplId,
                tmplName: scope.row.tmplName,
                tmplCode: scope.row.tmplCode
              })
            "
          >
            [{{ $t('编辑') }}]
          </span>
          <span
            class="blue-color pointer"
            v-if="permissions.delete && scope.row.available !== 1"
            @click="handleDelete(scope.row.id)"
          >
            [{{ $t('删除') }}]
          </span>
          <span
            class="blue-color pointer"
            v-if="permissions.rebate && scope.row.tmplCode == 'AQ0000005'"
            @click="
              rebateDialogVisible({
                id: scope.row.id,
                isSelfHelp: scope.row.isSelfHelp,
                isLimit: scope.row.isLimit,
                isSelfHelpShow: scope.row.isSelfHelpShow,
                minAmount: scope.row.minAmount ? scope.row.minAmount : 0
              })
            "
          >
            [{{ $t('自助返水') }}]
          </span>
          <span
            class="blue-color pointer"
            v-if="
              permissions.blacklist && isShowBlack(scope.row.tmplCode)"
            @click="getBlackTableData({ tmplCode: scope.row.tmplCode })"
          >
            [{{ $t('添加黑名单') }}]
          </span>
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog :title="$t('选择活动模板')" :visible.sync="activityDialogVisible">
      <ul class="activity-template">
        <li
          class="activity-template-item"
          v-for="item in activityCategories.slice(1)"
          :key="item.id"
          @click="
            jumpToForm({
              actTmplId: item.id,
              tmplName: item.tmplName,
              tmplCode: item.tmplCode
            })
          "
        >
          <h6 class="activity-template-item_title">{{ item.tmplName }}</h6>
          <p>{{ item.tmplNameTag }}</p>
        </li>
      </ul>
    </el-dialog>
    <el-dialog
      :title="$t('自助返水限制设置')"
      class="selfRebate"
      :visible.sync="showRebateDialogVisible"
      width="20%"
      center
    >
      <el-form
        :model="rebateDialogList"
        status-icon
        ref="rebateDialogList"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('洗码开启状态')" prop="isSelfHelp">
          <el-radio-group v-model="rebateDialogList.isSelfHelp">
            <el-radio :label="1">{{ $t('开启') }}</el-radio>
            <el-radio :label="0">{{ $t('关闭') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('自助申请状态')" prop="isSelfHelp">
          <el-radio-group v-model="rebateDialogList.isSelfHelpShow">
            <el-radio :label="1">{{ $t('开启') }}</el-radio>
            <el-radio :label="0">{{ $t('关闭') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('洗码申请限制')" prop="isLimit">
          <el-radio-group v-model="rebateDialogList.isLimit">
            <el-radio :label="0">{{ $t('不限额') }}</el-radio>
            <el-radio :label="1">{{ $t('限额') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('最低申请金额')"
          prop="minAmount"
          :rules="[
            { required: true, message: $t('不能为空') },
            { type: 'number', message: $t('金额必须为正整数值') }
          ]"
        >
          <el-input v-model.number="rebateDialogList.minAmount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('rebateDialogList')"
            >{{ $t('提交') }}</el-button
          >
          <el-button @click="resetForm()">{{ $t('取消') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="curTmplCode=='AQ0000019'? $t('VIP红包发放黑名单'):$t('市场活动发放黑名单')"
      :visible.sync="rebateBlackDialogVisible"
    >
      <el-form
        :model="blackDialogList"
        status-icon
        ref="rebateDialogList"
        label-width="100px"
        class="blackDialog"
      >
        <el-form-item label="" prop="loginName" class="add">
          <el-input
            v-model="blackDialogList.loginName"
            :placeholder="$t('请输入会员账号')"
          ></el-input>
          <el-button
            type="primary"
            @click="addActBlacklist"
            v-if="permissions.addOrDelectBlack"
            >{{ $t('新增') }}</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <TableCom
            :hasAddBtn="false"
            :hasRemoveBtn="false"
            :tableData="blackTableData"
            :totalCount="blackTableCount"
            :pageSize.sync="pageSize"
            :tableColumns="blackTableColumns"
            :currentPage.sync="currentPage"
            @reloadData="getBlackTable"
          >
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('操作')"
              slot="operation"
              v-if="permissions.addOrDelectBlack"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteBlack({ id: scope.row.id })"
                >
                  [{{ $t('删除') }}]
                </el-button>
              </template>
            </el-table-column>
          </TableCom>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="backListTitle[curTmplCode] || $t('市场活动发放黑名单')" :visible.sync="showActBlackList">
      <div class="center">
        <el-button v-for="(item, i) in blackListBtn" :key="i" :type="actBlackIndex === i ? 'primary' : ''" @click="handleBlackList(i)">{{item.text}}</el-button>
      </div>
      <div style="margin: 20px 0 10px;text-align: center" v-if="permissions.addOrDelectBlack">
        <el-input type="text" :placeholder="$t('请输入账号') + ','  + $t('多个账号使用') + ',' + $t('隔开') " v-model="actBlackList.loginName" style="width: 200px;"></el-input>
        <el-button type="primary" size="small" :loading="saveBlackLoading" @click="handleBlackListByNames">{{ $t('搜索') }}</el-button>
        <el-button type="primary" size="small" :loading="saveBlackLoading2" @click="handleSaveBlackList">{{ $t('新增') }}</el-button>
        <el-button type="primary" size="small" :loading="saveBlackLoading3" @click="handleDeleteAll">{{ $t('一键删除') }}</el-button>
      </div>
      <div class="black-list">
        <TableCom
          :hasAddBtn="false"
          :hasRemoveBtn="false"
          :tableLoading="blackListLoading"
          :tableColumns="backListColumns"
          :tableData="blackListData"
          :totalCount="blackListCount"
          :pageSize.sync="actBlackList.pageSize"
          :currentPage.sync="actBlackList.pageNo"
          @reloadData="getBlackList"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" slot="selection" align="center"> </el-table-column>
          <el-table-column slot="createTime" align="center" :label="!actBlackIndex ? $t('会员名称') : $t('代理名称')">
            <template slot-scope="scope">
              {{ scope.row.loginName }}
            </template>  
          </el-table-column>
        </TableCom>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import queryStore from "../../../mixins/queryStore";
import systemConfig from "../../../config/config.js";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'


export default {
  name: "activityRule",
  mixins: [Mixin, queryStore(["searchCriteria.keys"])],
  data() {
    return {
      searchCriteria: {
        keys: {
          ruleName: null,
          actTmplId: null,
          available: null
        },
        meta: [
          {
            type: "text",
            label: this.$t("规则名称"),
            prop: "ruleName"
          },
          {
            type: "select",
            label: this.$t("活动分类"),
            prop: "actTmplId",
            options: []
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "available",
            options: [
              {
                label: this.$t("全部"),
                value: null
              },
              {
                label: this.$t("启用"),
                value: 1
              },
              {
                label: this.$t("禁用"),
                value: 0
              }
            ]
          }
        ]
      },
      tableColumns: [
        { slotName: 'selection' },
        {
          type: "index",
          label: this.$t("序号")
        },
        {
          prop: "ruleName",
          label: this.$t("规则名称")
        },
        {
          prop: "tmplName",
          label: this.$t("活动分类")
        },
        {
          prop: "time",
          label: this.$t("创建时间")
        },
        {
          slotName: "available"
        },
        {
          slotName: "operation"
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      activityDialogVisible: false,
      showActBlackList: false,
      showRebateDialogVisible: false,
      rebateBlackDialogVisible: false,
      currentRebateId: "",
      rebateDialogList: {
        isSelfHelp: "",
        isLimit: "",
        isSelfHelpShow: "",
        minAmount: 0
      },
      blackDialogList: {
        loginName: "", //会员名
        tmplCode: "", //活动分类
        id: "" //黑名单ID
      },
      blackTableData: {},
      blackTableColumns: [
        {
          prop: "loginName",
          label: this.$t("会员名称"),
          align: "center"
        },
        {
          prop: "createTime",
          label: this.$t("添加时间"),
          align: "center"
        },
        {
          slotName: "operation"
        }
      ],
      backListColumns: [
        { slotName: 'selection' },
        { slotName: 'createTime' },
        { label: this.$t('添加时间'), prop: 'createTime' },
        { label: this.$t('操作'), render: (h, row) => {
          return this.permissions.addOrDelectBlack ? h('span', { class: 'pointer blue-color', on: { click: () => this.handleDelBlackList(row) } }, `[${this.$t('删除')}]`) : null
        } },
      ],
      blackListData: [],
      blackListBtn: [
        { text: this.$t('会员'), val: 0 },
        { text: this.$t('代理'), val: 1 }
      ],
      actBlackList: {
        loginName: '',
        pageSize: 10,
        pageNo: 1
      },
      blackListCount: 0,
      actBlackIndex: 0,
      blackListLoading: false,
      saveBlackLoading: false,
      saveBlackLoading2: false,
      saveBlackLoading3: false,
      backListTitle: {
        AQ0000019: this.$t('VIP红包发放黑名单'),
        AQALL: this.$t('活动黑名单')
      },
      curTmplCode: "",
      blackTableCount: 0,
      selectIds: [],
    };
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    activityCategories: {
      get() {
        return this.searchCriteria.meta.find(item => item.prop === "actTmplId")
          .options;
      },
      set(value) {
        this.searchCriteria.meta.find(
          item => item.prop === "actTmplId"
        ).options = value;
      }
    },
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("operate:activity:saveRule"),
        edit: hasPermission("operate:activity:updateRule"),
        available: hasPermission("operate:activity:availableRule"),
        delete: hasPermission("operate:activity:deleteDisableRule"),
        rebate: hasPermission("operate:activity:setSelfHelp"),
        getBlack: hasPermission("operate:activity:getActBlacklist"),
        blacklist: hasPermission('operate:activity:queryActBlacklist') || hasPermission("operate:activity:updateActBlacklist"),
        addOrDelectBlack: hasPermission("operate:activity:updateActBlacklist")
      };
    },
    ...mapGetters(["hasPermission"])
  },
  mounted() {
    this.getActivityCategories();
    this.getTableData();
  },
  methods: {
    isShowBlack(tmplCode) {
      return [
        'AQ0000001', //首存送
        'AQ0000003', //存就送
        'AQ0000004', //救援金
        'AQ0000005', //返水优惠
        'AQ0000011', //好友推荐-返利
        'AQ0000012', //投就送
        'AQ0000013', //注册送
        'AQ0000014', // 会员日
        'AQ0000015', // 会员日
        'AQ0000016', // 升级礼金
        'AQ0000017', // 升级礼金
        'AQ0000018', //vip特权优惠
        'AQ0000019', // 会员日  VIP红包
        'AQ0000022', // 红包雨
        'AQ0000023', // 全民代理
        'AQ0000024', // 混合规则
        'AQ0000025', // app下载彩金
        'AQ0000027',
        'AQ0000028', //首存上级返利
        'AQ0000030', // 余额返利
        'AQ0000031', // 优惠码
        'AQ0000032', // 新红包雨
        'AQ0000033', // 首存送 - 多个配置版
      ].includes(tmplCode)
    },
    handleActBlack() {
      this.showActBlackList = true
      this.curTmplCode = 'AQALL'
      this.getBlackList()
    },
    async handleDelBlackList({ id }) {
      const data = {
        id,
        tmplCode: this.curTmplCode
      }
      this.blackListLoading = true
      const { res } = await this.$axios.POST(this.$urls.activityRule.deleteActBlacklist, data)
      if (res) {
        this.$message.success(this.$t('删除成功'))
        await this.getBlackList()
      }
      this.blackListLoading = false
    },
    // 会员账号黑名单
    async handleSaveBlackList() {
      const { loginName } = this.actBlackList
      if (!loginName) {
        return this.$message.warning(this.$t('请输入账号'))
      }
      const data = {
        loginNames: loginName.split(','),
        isAgent: this.actBlackIndex,
        tmplCode: this.curTmplCode
      }
      this.saveBlackLoading2 = true
      const { res } = await this.$axios.POST(this.$urls.activityRule.batchSaveActBlacklist, data)
      this.saveBlackLoading2 = false
      if (res) {
        this.$message.success(this.$t('新增成功'))
        this.setPage()
        this.getBlackList()
      }
    },
    setPage() {
      this.$set(this.actBlackList, 'pageNo', 1)
      this.$set(this.actBlackList, 'pageSize', 10)
    },
    // 搜索会员/代理名称
    async getBlackList($event, url =  this.$urls.activityRule.getActBlacklist, loginNames = false) {
      let { pageNo, pageSize } = this.actBlackList
      if(loginNames) {
        pageNo = 1
      }
      const tmplCode = this.curTmplCode
      let params = {
        pageNo,
        pageSize,
        tmplCode,
        isAgent: this.actBlackIndex,
        allCode: tmplCode === 'AQALL' ? 1 : 0
      }
      if (loginNames) params.loginNames = loginNames
      this.blackListLoading = true
      const axiosMethods = loginNames ? 'POST' : 'GET'
      const { res } = await this.$axios[axiosMethods](url, params)
      this.blackListLoading = false
      if (res) {
        const { list, totalCount } = res.data
        this.blackListCount = totalCount
        this.blackListData = list
      }
    },
    handleBlackList(i) {
      this.actBlackIndex = i
      this.actBlackList.pageNo = 1
      this.actBlackList.loginName = ''
      this.getBlackList()
    },
    handleBlackListByNames() {
      const url = this.$urls.activityRule.getActBlacklistByName
      const { loginName } = this.actBlackList
      const loginNames = loginName ? loginName.split(',') : []
      if (!loginNames.length) {
        this.$message.error(this.$t('请输入需要查询的账号'))
        return
      }
      this.getBlackList(null, url, loginNames)
    },
    //返水优惠--自助返水
    rebateDialogVisible(obj) {
      this.showRebateDialogVisible = true;
      Object.assign(this.rebateDialogList, obj);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.activityRule.setRebateLimit, {
              ...this.rebateDialogList
            })
            .then(res => {
              this.showRebateDialogVisible = false;
              this.pageNo = 1;
              this.pageSize = 10;
              this.getTableData();
            });
        } else {
          thie.$message(this.$t("请输入正确限制金额金额"));
          return false;
        }
      });
    },
    resetForm() {
      this.showRebateDialogVisible = false;
      (this.pageSize = 10), (this.currentPage = 1), this.getTableData();
    },
    //返水优惠-黑名单
    addActBlacklist() {
      this.$axios
        .post(systemConfig.urls.activityRule.saveActBlacklist, {
          loginName: this.blackDialogList.loginName,
          tmplCode: this.curTmplCode
        })
        .then(res => {
          this.$message({
            type: "success",
            message: this.$t("添加成功")
          });
          this.currentPage = 1;
          this.pageSize = 10;
          this.blackDialogList.loginName = "";
          this.getBlackTable();
        });
    },
    getBlackTableData({ tmplCode }) {
      this.curTmplCode = tmplCode
      this.showActBlackList = true
      this.actBlackList.loginName = ''
      this.actBlackIndex = 0
      // this.currentPage = 1;
      // this.pageSize = 10;
      // this.getBlackTable();
      this.getBlackList()
    },
    getBlackTable() {
      this.$axios
        .get(systemConfig.urls.activityRule.getActBlacklist, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            tmplCode: this.curTmplCode,
            isAgent: 0
          }
        })
        .then(res => {
          this.rebateBlackDialogVisible = true;
          this.blackDialogList.loginName = "";
          this.blackTableData = res.data.data.list;
          this.blackTableCount = res.data.data.totalCount;
        });
    },
    deleteBlack({ id }) {
      this.$axios
        .post(systemConfig.urls.activityRule.deleteActBlacklist, {
          id
        })
        .then(res => {
          this.$message({
            type: "success",
            message: this.$t("删除成功")
          });
          this.currentPage = 1;
          this.pageSize = 10;
          this.getBlackTable();
        });
    },
    jumpToForm(query) {
      let url;
      if (query.tmplCode == "AQ0000005") {
        url = "/main/marketActivity/activityRule/waterForm";
      } else if (query.tmplCode == "AQ0000027") {
        url = "/main/marketActivity/activityRule/callFriends";
      } else {
        url = "/main/marketActivity/activityRule/form";
      }
      this.$router.push({
        path: url,
        query
      });
      this.activityDialogVisible = false;
    },
    handleDelete(id) {
      this.$axios
        .get(systemConfig.urls.activityRule.delete, {
          params: {
            id
          }
        })
        .then(() => {
          this.$message.success(this.$t("删除成功"));
          this.getTableData();
        });
    },
    handleAvailableChange({ id, available }) {
      this.$axios
        .post(systemConfig.urls.activityRule.available, {
          id,
          available
        })
        .finally(() => {
          this.getTableData();
        });
    },
    getActivityCategories() {
      this.$axios.get(systemConfig.urls.activityRule.category).then(res => {
        this.activityCategories = [
          {
            label: this.$t("全部"),
            value: null
          },
          ...res.data.page.map(item => {
            return {
              ...item,
              label: item.tmplName,
              value: item.id
            };
          })
        ];
      });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.activityRule.list, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys
          }
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            this.totalCount = res.data.data.totalCount;
            this.tableData = res.data.data.list.map(item => {
              item.time = systemConfig.transferTimeByType(item.time, "bj");
              return item;
            });
          }
        });
    },
    handleSelectionChange(arr) {
      let selectIds = []
      selectIds = arr.map(v => v.id)
      this.selectIds = selectIds
    },
    // 删除已在黑名单中的账号
    handleDeleteAll () {
      if (!this.selectIds.length) {
        this.$message.error(this.$t('请勾选需要删除的数据'))
        return
      }
      const params = {
        ids: this.selectIds,
      }
      this.saveBlackLoading3 = true
      this.$axios.post(systemConfig.urls.activityRule.batchDeleteActBlacklist, params)
      .then((res) => {
        if (res.data.code !== 0) return
        this.$message.success(this.$t('删除成功'))
        this.setPage()
        this.getBlackList()
      })
      .finally(() => {
        this.saveBlackLoading3 = false
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.activity-template {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 80px;
  .activity-template-item {
    //flex: 1;
    width: 20%;
    cursor: pointer;
    padding: 50px 0;
    text-align: center;
    border: 1px solid #eee;
    box-sizing: border-box;
    &:hover {
      border-color: #ccc;
    }
    /* &:not(:last-of-type) { */
    margin: 0 0 20px 20px;
    /* } */
    .activity-template-item_title {
      color: #333;
      font-size: 14px;
      line-height: 32px;
    }
    p {
      line-height: 15px;
    }
  }
}
.selfRebate {
  /deep/ .el-dialog {
    width: 25% !important;
  }
}
.blackDialog {
  .add {
    /deep/ .el-input {
      width: 30%;
      margin-right: 15px;
      display: inline;
      .el-input__inner {
        width: 30%;
      }
    }
  }

  /deep/ .el-button {
    display: inline;
  }
  /deep/ .el-form-item__content {
    margin-left: 0px !important;
  }
}
/deep/ .black-list {
  .table-operation-btns-wrapper {
    padding: 0
  }
}
</style>
