<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="handleSearch"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="registTime"
        :selections="searchCriteria.meta[4].options"
        :startTime.sync="searchCriteria.keys.createTimeFrom"
        :endTime.sync="searchCriteria.keys.createTimeTo"
      />
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      ref="table"
      :key="currentLevel"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      :hasAddBtn="hasPermission('agent:account:agentSave') && currentSubTypeIsAgent"
      @add="handleAddAgent(currentLayer.id)"
      @reloadData="getTableData"
      @sort-change="handleSortChange"
    >
      <!-- 具名插槽 title -->
      <Snapshots
        v-model="snapshots"
        slot="slot-title"
        displayKey="displayName"
        @change="initTableData"
      >
        <template v-if="currentLevel > 1" class="el-breadcrumb__inner" slot="after">
          -->
          {{
            currentLayer.bannerType === 'mbr'
              ? '下级好友'
              : currentSubTypeIsAgent
                  ? '下级代理'
                  : '直属会员'
          }}
        </template>
      </Snapshots>
      <!-- 表格插槽 -->
      <el-table-column align="left" label="用户名" slot="agyAccount">
        <template slot-scope="scope">
          {{ currentSubTypeIsAgent ? scope.row.agyAccount : scope.row.loginName }}
          <GlobalComponentTestLabel
            :id="currentSubTypeIsAgent ? scope.row.id : scope.row.tagencyId"
            :parentId="scope.row.parentId"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentSubTypeIsAgent"
        align="left"
        label="下级代理"
        slot="subAgent"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row, { bannerType: 'agent', subType: 'agent' })"
            type="text"
            size="small"
            v-if="scope.row.directAgentCount"
            >{{ scope.row.directAgentCount }}</el-button
          >
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentSubTypeIsAgent && currentLevel > 1"
        align="left"
        label="直属会员"
        slot="subMember"
      >
        <template slot-scope="scope">
          <el-button
            v-if="hasPermission('member:mbraccount:list') && scope.row.accountNum"
            type="text"
            size="small"
            @click="handleClick(scope.row, { bannerType: 'agent', subType: 'mbr' })"
          >
            {{ scope.row.accountNum }}
          </el-button>

          <span v-else>{{ scope.row.accountNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!currentSubTypeIsAgent"
        align="left"
        label="下级好友"
        slot="subFriends"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row, { bannerType: 'mbr', subType: 'mbr' })"
            type="text"
            size="small"
            v-if="scope.row.promotionNum"
            >{{ scope.row.promotionNum }}</el-button
          >
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        :label="currentSubTypeIsAgent ? '推广域名' : '推广链接'"
        slot="domainUrl"
        v-if="currentLevel > 1"
      >
        <template slot-scope="scope">
          <!-- 代理推广域名 -->
          <template v-if="currentSubTypeIsAgent">
            <el-button
              @click="showPromotionLinks(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.promotionLinksCounts"
            >
              {{ scope.row.promotionLinksCounts }}
            </el-button>
            <span v-else>0</span>
          </template>

          <!-- 会员推广链接 -->
          <template v-else>
            <el-button
              @click="showPromotionLinks(scope.row)"
              type="text"
              size="small"
            >
              1
            </el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="left" label="状态" width="80" slot="available">
        <template slot-scope="scope">
          <el-switch
            v-if="currentSubTypeIsAgent"
            v-model="scope.row.available"
            :disabled="!hasPermission('agent:account:available')"
            @change="handleAvailableChange(scope.row.id, $event)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
          <template v-else>{{ ['禁用', '启用', '余额冻结'][scope.row.available] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="180"
        label="注册时间"
        slot="createTime"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        :prop="currentSubTypeIsAgent ? 'createTime' : 'registerTime'"
      >
        <template slot-scope="scope">
          {{ currentSubTypeIsAgent ? scope.row.createTime : scope.row.registerTime }}
        </template>
      </el-table-column>
      <el-table-column width="230" fixed="right" align="left" label="操作" slot="operation">
        <template slot-scope="scope">
          <template v-if="currentSubTypeIsAgent">
            <el-button
              v-if="
                hasPermission('agent:account:agentSave') && scope.row.available === 1
              "
              @click="handleAddAgent(scope.row.id)"
              type="text"
              size="small"
              >[新增子代理]</el-button
            >
            <el-button
              v-if="hasPermission('agent:account:addmbr') && scope.row.grade > 0"
              @click="handleAddMember(scope.row)"
              type="text"
              size="small"
              >[新增会员]</el-button
            >
            <el-button
              v-if="hasPermission('agent:account:update')"
              @click="handleEditAgent(scope.row)"
              type="text"
              size="small"
              >[编辑]</el-button
            >
            <el-button
              v-if="enableDelete(scope.row)"
              @click="handleDeleteAgent(scope.row.id)"
              type="text"
              size="small"
              >[删除]</el-button
            >
            <el-button
              v-if="
                hasPermission('agent:account:password') &&
                  scope.row.available === 1
              "
              @click="handleReset('login', scope.row)"
              type="text"
              size="small"
              >[重置密码]</el-button
            >
            <el-button
              v-if="
                hasPermission('agent:account:updateAgyMerGroup') &&
                  scope.row.available === 1 &&
                  scope.row.parentId !== 0
              "
              @click="handleLinkMember(scope.row)"
              type="text"
              size="small"
              >[关联会员组]</el-button
            >
          </template>

          <el-button
            v-else
            type="text"
            size="small"
            @click="$router.push({
              path: '/main/memberManage/memberDetail',
              query:
                {
                  id:scope.row.id,
                  loginName:scope.row.loginName
                }
            })"
          >
            [编辑]
          </el-button>
        </template>
      </el-table-column>
    </TableCom>
    <!-- 新增代理/子代理 -->
    <el-dialog
      :title="
        infoForEditAgent.id
          ? `编辑${parentIdForAdd ? '子' : '总'}代理`
          : `新增${parentIdForAdd ? '子' : '总'}代理`
      "
      :visible.sync="isAddAgentShow"
      width="30%"
    >
      <AddTemplate
        ref="add"
        v-if="isAddAgentShow"
        :parentId="parentIdForAdd"
        :infoForEdit="infoForEditAgent"
        @submit="handleAgentSubmit"
      >
      </AddTemplate>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddAgentShow = false">取 消</el-button>
        <el-button
          v-if="
            (hasPermission('agent:account:agentSave') && curOprationNum == 1) ||
              (hasPermission('agent:account:update') && curOprationNum == 2)
          "
          type="primary"
          @click="$refs.add.handleSubmit()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="isResetPasswordShow"
      width="25%!important"
    >
      <el-form
        ref="form"
        :model="resetPasswordForm"
        label-position="top"
        label-width="80px"
        :rules="resetPasswordForm.rules"
      >
        <el-form-item
          prop="password"
          :label="`请输入新的${resetForWho === 'login' ? '登陆' : '提款'}密码`"
        >
          <el-input
            v-model="resetPasswordForm.password"
            type="password"
            placeholder="密码为6~18位数字字母组合"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isResetPasswordShow = false">取 消</el-button>
        <el-button type="primary" @click="resetPasswordSubmit">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 推广链接 -->
    <PromotionLinks
      :isAgent="currentSubTypeIsAgent"
      :promotionLinks="promotionLinks"
      :promotionAccount="promotionAccount"
      :visible.sync="promotionLinksVisible"
      :promotionPageSize="promotionPageSize"
      :promotionCurrentPage.sync="promotionCurrentPage"
      :hasDeleteLimit="hasPermission('agent:domain:delete')"
      @pageChange="getPromotionLinks"
      @delete="handleDeletePromotionLink"
    />
    <!-- 新增会员 -->
    <el-dialog
      title="新增会员"
      :visible.sync="isAddMemberShow"
      @close="mbrAddCancel"
    >
      <el-form
        class="small-space form-content"
        label-position="right"
        :model="mbrAccount"
        :rules="memberInfoRule"
        style="margin-left: 20px"
        ref="mbrAddAccount"
        label-width="100px"
      >
        <input
          type="text"
          style="width: 0; height: 0;border: none;padding: 0;"
        />
        <input
          type="password"
          style="width: 0; height: 0;border: none;padding: 0;"
        />
        <el-form-item
          label="会员名"
          prop="loginName"
          :rules="memberInfoRule.accountName"
          size="small"
        >
          <el-input v-model="mbrAccount.loginName"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="loginPwd"
          :rules="memberInfoRule.password"
          size="small"
        >
          <el-input
            v-model="mbrAccount.loginPwd"
            :type="isPasswordShow ? 'text' : 'password'"
          ></el-input>
          <span
            @click="isPasswordShow = !isPasswordShow"
            class="iconfont"
            :class="isPasswordShow ? 'icon-passshow' : 'icon-passhide'"
          ></span>
        </el-form-item>
        <el-form-item
          label="三公返利比例"
          prop="rebateRatio"
          v-if="sanGongFlag"
        >
          <el-input
            v-model="mbrAccount.rebateRatio"
            placeholder="请输入三公返利比例"
          ></el-input>
          <span class="percentage">&nbsp;&nbsp;%</span>
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="realName"
          :rules="memberInfoRule.nameNoNeed"
          size="small"
        >
          <el-input v-model="mbrAccount.realName"></el-input>
        </el-form-item>
        <el-form-item
          label="上级代理"
          prop="cagencyId"
          :rules="commonRule.changeNotNull"
          size="small"
        >
          <el-input v-model="mbrAccount.agyAccount" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="memo"
          :rules="commonRule.notNull"
          size="small"
        >
          <el-input v-model="mbrAccount.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mbrAddCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="saveMbrAccount" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 关联会员组 -->
    <el-dialog
      id="linkDialog"
      title="关联会员组"
      :visible.sync="isLinkMemberShow"
      width="25%!important"
    >
      <div id="linkMember">请选择代理下会员注册默认关联的会员组</div>
      <div class="selectLinkMember">
        <el-radio-group v-model="groupId">
          <el-radio :label="item.id" v-for="(item, i) in memberList" :key="i">{{
            item.groupName
          }}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button @click="isLinkMemberShow = false">取消</el-button>
        <el-button type="primary" @click="updateAgyMerGroup">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PromotionLinks from "./PromotionLinks";
import systemConfig from "../../../config/config";
import AddTemplate from "./FormTemplateForAddAgent";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";

const TopAgent = {
  id: 0,
  subType: 'agent',
  bannerType: 'agent',
  displayName: '总代',
}

export default {
  components: { AddTemplate, StartAndEndTimeSelector, PromotionLinks },
  data() {
    return {
      searchCriteria: {
        keys: {
          searchType: null,
          agyAccount: null,
          realName: null,
          available: null,
          createTimeFrom: null,
          createTimeTo: null
        },
        meta: [
          {
            type: "select",
            label: "用户类型",
            prop: "searchType",
            clearable: true,
            options: [
              {
                label: '代理',
                value: 'agent',
              },
              {
                label: '会员',
                value: 'mbr',
              },
            ],
          },
          {
            type: "text",
            label: "用户名",
            prop: "agyAccount"
          },
          {
            type: "text",
            label: "真实姓名",
            prop: "realName"
          },
          {
            type: "select",
            label: "状态",
            prop: "available",
            options: [
              {
                label: "全选",
                value: null
              },
              {
                label: "启用",
                value: 1
              },
              {
                label: "禁用",
                value: 0
              }
            ]
          },
          {
            label: "创建时间",
            slotName: "registTime",
            options: [
              {
                label: "本月",
                value: "currentMonth"
              },
              {
                label: "上个月",
                value: "lastMonth"
              },
              {
                label: "近三月",
                value: "lastThreeMonths"
              }
            ]
          }
        ]
      },
      tableData: [],
      sortOrder: null,
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isAddAgentShow: false,
      infoForEditAgent: {},
      parentIdForAdd: null,
      snapshots: [
        TopAgent,
      ],
      promotionLinks: null,
      promotionAccount: null,
      promotionPageSize: 3,
      promotionCurrentPage: 1,
      promotionAccountId: null,
      promotionLinksVisible: false,
      isResetPasswordShow: false,
      resetForWho: null,
      resetPasswordForm: {
        id: null,
        agyAccount: null,
        password: null,
        rules: {
          password: [
            { required: true, message: "不能为空" },
            {
              pattern: /^[0-9A-Za-z]{6,10}$/,
              message: "请输入6~10位数字、字母，或数字与字母组合",
              trigger: "blur"
            },
            {
              validator: (rule, value, callback) => {
                if (value === this.resetPasswordForm.agyAccount) {
                  callback(new Error("账号密码不能相同"));
                } else {
                  callback();
                }
              }
            }
          ]
        }
      },
      isAddMemberShow: false,
      isPasswordShow: false,
      hasBasePromotionLink: false,
      commonRule: systemConfig.rules.commonRule,
      memberInfoRule: systemConfig.rules.memberInfoRule,
      rebateRatioReg: systemConfig.rules.rebateRatioReg,
      mbrAccount: {
        loginName: null,
        loginPwd: null,
        realName: null,
        cagencyId: "",
        memo: null,
        rebateRatio: "0.00"
      },
      //关联会员组
      curMemberId: "", //当前所选择会员id
      isLinkMemberShow: false, //关联会员组配置
      groupId: "", //会员组ID
      memberList: "", //会员组列表
      curOprationNum: 0
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    tableColumns() {
      const { currentSubTypeIsAgent } = this
      const spreadCodeColumn = (() => {
        // 匿名函数自调用 控制是否显示推广码
        if (this.currentLevel > 1) {
          return [
            {
              align: 'left',
              label: "推广码",
              prop: currentSubTypeIsAgent ? 'spreadCode' : 'domainCode',
            }
          ];
        } else {
          return [];
        }
      })();
      return [
        {
          type: "index",
          label: "序号",
          fixed: "left"
        },
        {
          slotName: "agyAccount"
        },
        ...spreadCodeColumn,
        {
          prop: "realName",
          label: "真实姓名",
          width: "100"
        },
        {
          width: "200",
          prop: "mobile",
          label: "手机号码",
          slotName: currentSubTypeIsAgent ? '' : 'mobile' // 控制表格列显示
        },
        {
          slotName: "subAgent"
        },
        {
          slotName: "subMember"
        },
        {
          slotName: "subFriends"
        },
        {
          slotName: "domainUrl"
        },
        {
          slotName: "available"
        },
        {
          slotName: "createTime"
        },
        {
          prop: "loginTime",
          label: "最后登录时间",
          slotName: currentSubTypeIsAgent ? 'loginTime' : '' // 控制表格列显示
        },
        {
          prop: "groupName",
          label: "会员组",
          slotName: currentSubTypeIsAgent ? 'groupName' : '' // 控制表格列显示
        },
        {
          prop: "category",
          label: "类别",
          width: "150",
          slotName: currentSubTypeIsAgent ? '' : 'category' // 控制表格列显示
        },
        {
          prop: "memo",
          label: "备注",
          slotName: currentSubTypeIsAgent ? '' : 'memo' // 控制表格列显示
        },
        {
          slotName: "operation"
        }
      ];
    },
    currentLayer() {
      return this.snapshots.slice(-1)[0];
    },
    currentLevel() {
      // 当前在第几层
      return this.snapshots.length;
    },
    currentSubTypeIsAgent() {
      return this.currentLayer.subType === 'agent'
    },
    sanGongFlag() {
      return this.$store.getters.getSanGongFlag("sanGongFlg");
    }
  },
  created() {
    this.getPromotionSet();
    this.memberInfoRule = {
      ...this.memberInfoRule,
      rebateRatio: this.rebateRatioReg
    };
  },
  methods: {
    handleSortChange({ order }) {
      const orderMapper = {
        ascending: "asc",
        descending: "desc"
      };
      this.sortOrder = orderMapper[order];
      this.getTableData();
    },
    enableDelete(row) {
      if (this.hasPermission("agent:account:delete") && row.available === 0) {
        // 没有下级代理和直属会员才能删除
        return !row.directAgentCount && !row.accountNum
      } else {
        return false;
      }
    },
    handleDeleteAgent(id) {
      this.$axios
        .get("bkapi/agent/account/agyAccountDelete", {
          params: {
            id
          }
        })
        .then(() => {
          this.getTableData();
        });
    },
    EditAgentSubmit(params) {
      this.$axios
        .post("bkapi/agent/account/agyAccountUpdate", params)
        .then(() => {
          this.isAddAgentShow = false;
          this.$message.success("修改成功");
          this.getTableData();
        });
    },
    handleAgentSubmit(params) {
      if (params.id) {
        // 编辑
        this.EditAgentSubmit(params);
      } else {
        this.addAgentSubmit(params);
      }
    },
    handleEditAgent(agentInfo) {
      this.parentIdForAdd = 0;
      this.infoForEditAgent = JSON.parse(JSON.stringify(agentInfo));
      this.isAddAgentShow = true;
      this.curOprationNum = 2;
    },
    handleDeletePromotionLink(id) {
      this.$axios.post("bkapi/agent/domain/delete/" + id).then(() => {
        this.getTableData();
        this.getPromotionLinks();
      });
    },
    getPromotionLinks() {
      const { currentSubTypeIsAgent } = this

      this.$axios
        .get(
          currentSubTypeIsAgent
            ? 'bkapi/agent/account/findDomainsById'
            : 'bkapi/member/mbraccount/getPromotionUrl'
          ,
          {
            params: {
              id: this.promotionAccountId,
              pageSize: this.promotionPageSize,
              pageNo: this.promotionCurrentPage,
            },
          },
        )
        .then(({ data }) => {
          if (currentSubTypeIsAgent) {
            this.promotionLinks = data
          } else {
            this.promotionLinks = {
              base: data.data,
              unbase: {
                list: [],
                currPage: 1,
              },
            }
          }
        });
    },
    getPromotionSet() {
      return this.$axios
        .get(systemConfig.urls.queryPromotionSet)
        .then(res => {
          // 如果设置了通用域名 则可以查看推广链接
          this.hasBasePromotionLink = !!res.data.agent.siteUrlId;
          this.$refs.table.$refs.table.sort("createTime", "descending");
        })
        .catch(() => {
          this.$refs.table.$refs.table.sort("createTime", "descending");
        });
    },
    saveMbrAccount() {
      this.$refs.mbrAddAccount.validate(valid => {
        if (valid) {
          this.$axios
            .get(systemConfig.urls.memberCheck, {
              params: { loginName: this.mbrAccount.loginName }
            })
            .then(res => {
              if (res.data.msg) {
                this.$message({
                  type: "warning",
                  message: "用户名已存在"
                });
              } else {
                this.$axios
                  .post(systemConfig.urls.memberSave, this.mbrAccount)
                  .then(res => {
                    this.isAddMemberShow = false;
                    this.$message({
                      type: "success",
                      message: "新增会员成功"
                    });
                    this.mbrAccount = { cagencyId: "" };
                    this.getTableData()
                  });
              }
            });
        }
      });
    },
    mbrAddCancel() {
      this.$refs.mbrAddAccount.resetFields();
      this.isAddMemberShow = false;
    },
    handleAddMember({ agyAccount, id }) {
      this.mbrAccount.agyAccount = agyAccount;
      this.mbrAccount.cagencyId = id;
      this.isAddMemberShow = true;
    },
    resetPasswordSubmit() {
      const { resetForWho } = this;
      const urls = {
        login: "bkapi/agent/account/agyAccountPassword",
        draw: "bkapi/agent/account/agyAccountFundPassword"
      };
      this.$refs.form.validate(result => {
        if (result) {
          this.$axios
            .post(urls[resetForWho], {
              id: this.resetPasswordForm.id,
              agyPwd: this.resetPasswordForm.password,
              securePwd: this.resetPasswordForm.password
            })
            .then(res => {
              if (res) {
                this.isResetPasswordShow = false;
                this.$message.success("修改成功");
              }
            });
        }
      });
    },
    handleReset(resetForWho, { id, agyAccount }) {
      this.resetForWho = resetForWho;
      this.resetPasswordForm.id = id;
      this.resetPasswordForm.agyAccount = agyAccount;
      this.isResetPasswordShow = true;
    },
    skipToMemberList(agyAccount) {
      this.$router.push({
        path: "/main/memberManage/memberList",
        query: { agyAccount }
      });
    },
    showPromotionLinks({ id, agyAccount, loginName }) {
      const { currentSubTypeIsAgent } = this

      this.promotionLinks = null;
      this.promotionAccountId = id;
      this.promotionAccount = currentSubTypeIsAgent ? agyAccount : loginName;
      this.promotionLinksVisible = true;
      this.getPromotionLinks();
    },
    calcDisplayName({ bannerType, parentId, loginName, agyAccount }) {
      return `
        ${
          bannerType === 'mbr'
            ? '会员'
            : parentId
                ? '代理'
                : '总代'
        }${
          bannerType === 'mbr' ? loginName : agyAccount
        }
      `
    },
    handleClick({ id, agyAccount, parentId, loginName }, { bannerType, subType }) {
      this.snapshots.push({
        id,
        subType,
        loginName,
        agyAccount,
        bannerType,
        displayName: this.calcDisplayName({
          bannerType,
          parentId,
          loginName,
          agyAccount,
        }),
      });
      this.initTableData()
    },
    initTableData() {
      this.tableData = [];
      this.currentPage = 1;
      // 清除搜索条件
      this.searchCriteria.keys.realName = null;
      this.searchCriteria.keys.agyAccount = null;
      this.getTableData();
    },
    addAgentSubmit(params) {
      this.$axios.post("bkapi/agent/account/save", params).then(res => {
        if (res) {
          this.isAddAgentShow = false;
          this.getTableData();
        }
      });
    },
    handleAvailableChange(id, available) {
      this.$axios
        .post("bkapi/agent/account/agyAccountAvailable", { id, available })
        .then(() => {
          this.$message.success("修改成功");
        })
        .catch(() => {
          this.tableData.find(item => item.id === id).available = available
            ? 0
            : 1;
        });
    },
    handleAddAgent(parentId = 0) {
      this.infoForEditAgent = {};
      this.parentIdForAdd = parentId;
      this.isAddAgentShow = true;
      this.curOprationNum = 1;
    },
    handleSearch() {
      const { searchType, agyAccount: searchName } = this.searchCriteria.keys

      if (searchName) {
        if (searchType) {
          this.$axios
            .get(
              searchType === 'agent'
                ? systemConfig.urls.getAgentBanner
                : systemConfig.urls.getMbrBanner
              ,
              {
                params: {
                  [searchType === 'agent' ? 'agyAccount' : 'loginName']: searchName,
                },
              },
            )
            .then(({ data }) => {
              this.snapshots = [
                TopAgent,
                ...data.data.map(({ bannerType, id, parentId, agyAccount }, index, arr) => {
                  const item = {
                    id,
                    parentId,
                    bannerType,
                    subType: index === arr.length - 1 ? searchType : 'agent',
                    loginName: agyAccount, // 会员名也在agyAccount返回
                    agyAccount: agyAccount,
                  }

                  item.displayName = this.calcDisplayName(item)
                  return item
                })
              ]
              this.getTableData()
            })
        } else {
          this.$message.error('请选择用户类型')
        }
      } else {
        this.getTableData()
      }
    },
    getTableData() {
      const { currentSubTypeIsAgent } = this
      const { bannerType, loginName, agyAccount } = this.currentLayer

      if (currentSubTypeIsAgent) {
        this.$axios
          .get(systemConfig.urls.getAgentList, {
            params: {
              ...this.searchCriteria.keys,
              pageSize: this.pageSize,
              pageNo: this.currentPage,
              parentId: this.currentLayer.id,
              orderBy: this.sortOrder ? "createTime " + this.sortOrder : ""
            }
          })
          .then(res => {
            if (res) {
              const { list, totalCount } = res.data.page;
              this.totalCount = totalCount;
              this.tableData = list.map(item => {
                const { domainUrl } = item;
                const unbaseLinkCounts = domainUrl
                  ? domainUrl.split(",").length
                  : 0;
                item.promotionLinksCounts = this.hasBasePromotionLink
                  ? unbaseLinkCounts + 1
                  : unbaseLinkCounts;
                item.createTime = systemConfig.transferTimeByType(
                  item.createTime,
                  "bj"
                );
                return item;
              });
            }
          });
      } else {
        const {
          realName,
          available,
          createTimeFrom,
          createTimeTo,
          agyAccount: loginNameList,
        } = this.searchCriteria.keys

        this.$axios.get(systemConfig.urls.mbrAccountTablelist, {
          params: {
            realName,
            loginNameList,
            isAgentQry: 1,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            availableList: available,
            registerTime: createTimeFrom,
            registerTimeEnd: createTimeTo,
            orderBy: this.sortOrder ? `${currentSubTypeIsAgent ? 'createTime' : 'registerTime'} ` + this.sortOrder : '',
            agyAccount: bannerType === 'agent' ? agyAccount : undefined, // 根据代理查找直属会员
            supLoginName: bannerType === 'mbr' ? loginName : undefined, // 根据会员查找下级好友
          },
        })
          .then(({ data }) => {
            this.totalCount = data.page.totalCount
            this.tableData = data.page.list.map(item => {
              item.registerTime = systemConfig.transferTimeByType(
                  item.registerTime,
                  "bj"
                );
              item.loginTime = systemConfig.transferTimeByType(
                  item.loginTime,
                  "bj"
                );
              return item;
            })
          })
      }
    },
    //获取需要关联会员组列表
    handleLinkMember({ id, groupId }) {
      this.curMemberId = id;
      this.groupId = groupId;
      this.$axios.get(systemConfig.urls.getMemberList).then(res => {
        this.memberList = res.data.page;
        this.isLinkMemberShow = true;
        if (!groupId) {
          this.groupId = this.memberList[0].id;
        }
      });
    },
    //关联会员组
    updateAgyMerGroup() {
      let params = {
        id: this.curMemberId,
        groupId: this.groupId
      };
      this.$axios
        .post(systemConfig.urls.updateAgyMerGroup, params)
        .then(res => {
          this.isLinkMemberShow = false;
          this.$message.success("关联会员组成功");
          this.getTableData();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#linkDialog {
  span.el-dialog__header {
    text-align: center;
  }
  .el-dialog__headerbtn {
    display: none;
  }
  #linkMember {
    font-size: 14px !important;
    font-weight: bold;
    min-height: 30px;
    line-height: 30px;
    margin: -20px 0 10px 0;
  }
  .selectLinkMember {
    font-size: 14px !important;
    padding-left: 15px;
    .el-radio-group {
      label {
        display: inline-block;
        min-width: 30%;
        margin: 5px 0;
      }
    }
  }
}
.percentage {
  position: absolute;
  right: 18px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
