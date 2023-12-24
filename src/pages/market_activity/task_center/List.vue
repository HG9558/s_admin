<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabsArr"
        :key="index"
        :label="item.label"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <!-- 全局组件 表格组件 -->
    <TableCom
      v-show="activeName == 'first'"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :hasPagination="false"
      :pageSize="10"
      :currentPage="1"
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableLoading="tableLoading"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"

    >
      <!-- 表格插槽 -->
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('状态')"
        slot="available"
      >
        <template slot-scope="scope">
          <el-switch
            :disabled="!permissions.status"
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.available"
            @change="handleAvailableChange(scope.row, scope.$index)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('操作')"
        slot="operation"
      >
        <template slot-scope="scope">
          <span
            class="blue-color pointer"
            @click="handleEdit(scope.row)"
            v-if="permissions.edit"
          >
            [{{ $t('编辑') }}]
          </span>
          <span
            class="blue-color pointer"
            @click="getBlackTableData(scope.row)"
            v-if="
              permissions.addBlack ||
              permissions.deleteBlack ||
              permissions.blackSelect">
            [{{ $t('黑名单') }}]
          </span>
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog
      :title="$t('温馨提示')"
      :visible.sync="reminderDialog"
      width="20%"
      class="dialog">
      <span>{{ $t('开启任务需先完成编辑') }}!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reminderDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="openExit">{{ $t('开始编辑') }}</el-button>
      </span>
    </el-dialog>
    <!-- 黑名单 -->
    <el-dialog :title="$t('编辑黑名单')" :visible.sync="rebateBlackDialogVisible">
      <el-form
        :model="blackDialogList"
        status-icon
        ref="rebateDialogList"
        label-width="100px"
        class="blackDialog">

        <el-form-item class="center">
          <el-button v-for="(item, i) in blackListBtn" :key="i" :type="actBlackIndex === i ? 'primary' : ''" @click="handleBlackList(i)">{{item.text}}</el-button>
        </el-form-item>

        <div v-if="permissions.addBlack || permissions.blackSelect" class="zonClass">
          <el-input type="text" :placeholder="$t('请输入账号') + ','  + $t('多个账号使用') + ',' + $t('隔开') " v-model="blackDialogList.loginName" style="width: 200px;"></el-input>
          <el-button type="primary" :loading="saveBlackLoading" @click="handleBlackListByNames">{{ $t('搜索') }}</el-button>
          <el-button type="primary" :loading="saveBlackLoading2" @click="addTaskBlackList">{{ $t('新增') }}</el-button>
          <el-button type="primary" :loading="saveBlackLoading3" @click="handleDeleteAll">{{ $t('一键删除') }}</el-button>
        </div>
        <el-form-item label="">
          <TableCom
            :hasAddBtn="false"
            :hasRemoveBtn="false"
            :tableData="blackTableData"
            :totalCount="blackTableCount"
            :pageSize.sync="blackPageSize"
            :tableColumns="blackTableColumns"
            :currentPage.sync="blackCurrentPage"
            @reloadData="getBlackTable"
            @selection-change="handleSelectionChange">
           
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('操作')"
              slot="operation"
              v-if="permissions.deleteBlack"
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
            <el-table-column type="selection" slot="selection" align="center"> </el-table-column>
            <el-table-column slot="createTime" align="center" :label="!actBlackIndex ? $t('会员名称') : $t('代理名称')">
            <template slot-scope="scope">
              {{ scope.row.loginName }}
            </template>  
          </el-table-column>
          </TableCom>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  data() {
    return {
      activeName: "first",
      tabsArr: [
        { name: "first", label: this.$t("任务配置") }
        //{ name: "second", label: "配置管理" }
      ],
      tableData: [],
      tableLoading: false,
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          align: "center"
        },
        {
          prop: "taskName",
          label: this.$t("任务名称"),
          align: "center"
        },
        {
          prop: "financialCodeName",
          label: this.$t("任务类型"),
          align: "center"
        },
        {
          prop: "modifyTime",
          label: this.$t("更新时间"),
          align: "center"
        },
        {
          slotName: "available"
        },
        {
          slotName: "operation"
        }
      ],
      reminderDialog: false,
      recodeCurRow: null,
      rebateBlackDialogVisible: false,
      //黑名单
      blackDialogList: {
        loginName: "", //会员名
        tmplCode: "", //活动分类
        id: "" //黑名单ID
      },
      curRowId: null,
      blackTableData: [],
      blackTableColumns: [
        { slotName: 'selection' },
        // { slotName: 'selection' },
        { slotName: 'createTime' },
        // {
        //   prop: "loginName",
        //   label: this.$t("会员名称"),
        //   align: "center"
        // },
        {
          prop: "createTime",
          label: this.$t("添加时间"),
          align: "center"
        },
        {
          slotName: "operation"
        }
      ],
      blackTableCount: 0,
      blackPageSize: 10,
      blackCurrentPage: 1,
      blackListBtn: [
        { text: this.$t('会员'), val: 0 },
        { text: this.$t('代理'), val: 1 }
      ],
      blackListLoading: false,
      saveBlackLoading: false,
      saveBlackLoading2: false,
      saveBlackLoading3: false,
      actBlackIndex: 0,
      selectIds: [],
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    permissions() {
      const { hasPermission } = this;
      return {
        status: hasPermission("task:account:updateAvailable"),
        edit: hasPermission("task:account:updateTask"),
        blackSelect: hasPermission("task:account:blacklist"),
        addBlack: hasPermission("task:account:addBlacklist"),
        deleteBlack: hasPermission("task:account:deleteBlacklist"),
        addOrDelectBlack: hasPermission("operate:activity:updateActBlacklist")
      };
    },
    ...mapGetters(["hasPermission"])
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.tableLoading = true;
      this.$axios.get(systemConfig.urls.activityRule.taskCenter).then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        if (res) {
          this.tableData = res.data.data.map(item => {
            item.modifyTime = systemConfig.transferTimeByType(
              item.modifyTime,
              "bj"
            );
            return item;
          });
          this.tableLoading = false;
        }
        /*  this.tableData = res.data.data; */
      });
    },
    handleAvailableChange(row, index) {
      let { rule, financialCode, id, available } = row;
      //XS-->限时活动  QD-->签到有礼
      if (!rule) {
        this.tableData[index].available = 0;
        switch (financialCode) {
          case "QD":
          case "XS":
          case "SJ":
            this.reminderDialog = true;
            break;
        }
        this.recodeCurRow = row;
      } else {
        let params = { id: id, available: available };
        this.$axios
          .get(this.$systemConfig.urls.activityRule.changeStatus, { params })
          .then(res => {
            this.$message({
              type: "success",
              message: this.$t("状态修改成功")
            });
          });
      }
    },
    openExit() {
      this.handleEdit(this.recodeCurRow);
      this.reminderDialog = false;
    },
    handleEdit({ id }) {
      this.$router.push({
        path: "/main/marketActivity/taskCenter/form",
        query: { id },
      });
    },
    //返水优惠-黑名单
    addTaskBlackList() {
      const { loginName } = this.blackDialogList
      if (!loginName) {
        return this.$message.warning(this.$t('请输入账号'))
      }
      const params = {
        loginNames: loginName.split(','),
        configId: this.curRowId,
        isAgent: this.actBlackIndex
      }
      this.$axios
        .post(systemConfig.urls.activityRule.batchAddTaskBlackList, params)
        .then(res => {
          this.$message({
            type: "success",
            message: this.$t("添加成功")
          });
          this.blackCurrentPage = 1;
          this.blackPageSize = 10;
          this.getBlackTable();
        });
    },
    getBlackTableData({ id }) {
      this.curRowId = id;
      this.blackCurrentPage = 1;
      this.blackPageSize = 10;
      this.blackDialogList.loginName = ''
      this.actBlackIndex = 0
      // this.getBlackTable();
      this.getBlackTable()
    },
    handleBlackListByNames() {
      const url = this.$urls.activityRule.taskBlackListByName
      const { loginName } = this.blackDialogList
      const loginNames = loginName ? loginName.split(',') : []
      if (!loginNames.length) {
        this.$message.error(this.$t('请输入需要查询的账号'))
        return
      }
      this.getBlackTable(url, loginNames)
    },
    getBlackTable(url =  systemConfig.urls.activityRule.getTaskBlacklist, loginNames = false) {
      const params = {
        pageSize: this.blackPageSize,
        pageNo: this.blackCurrentPage,
        id: this.curRowId,
        isAgent: this.actBlackIndex
      }
      if (loginNames) params.loginNames = loginNames
      const axiosMethods = loginNames ? 'post' : 'get'
      this.$axios[axiosMethods](url,  loginNames ? params : { params })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.rebateBlackDialogVisible = true;
          this.blackDialogList.loginName = "";
          this.blackTableData = res.data.page.list;
          this.blackTableCount = res.data.page.totalCount;
        });
    },
    deleteBlack({ id }) {
      this.$axios
        .get(systemConfig.urls.activityRule.deleteTaskBlacklist, {
          params: { id }
        })
        .then(res => {
          this.$message({
            type: "success",
            message: this.$t("删除成功")
          });
          this.blackCurrentPage = 1;
          this.blackPageSize = 10;
          this.getBlackTable();
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
      this.saveBlackLoading3 = true
      const params = {
        ids: this.selectIds
      }
      this.$axios.post(systemConfig.urls.activityRule.batchDeletTaskBlackList, params)
      .then(() => {
        this.$message.success(this.$t('删除成功'))
        this.getBlackTable()
      })
      .finally(() => {
        this.saveBlackLoading3 = false
      })
    },
    handleBlackList(i) {
      this.actBlackIndex = i
      this.blackDialogList.loginName = ''
      this.getBlackTable()
    },
  }
};
</script>

<style lang="scss" scope>
.dialog {
  /deep/ .el-dialog {
    width: 20% !important;
    .el-dialog__body {
      font-size: 15px !important;
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}

.dlin.el-input.el-input--small {
  width: 200px;
}

.blackDialog {
  .add {
    /deep/ .el-input {
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

.el-form-item.add.el-form-item--feedback.el-form-item--small {
  text-align: center;
}


.zonClass {
  margin-left: 95px;
  text-align: center
}

</style>
