<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="registTime"
        :selections="searchCriteria.meta[3].options"
        :startTime.sync="searchCriteria.keys.createTimeFrom"
        :endTime.sync="searchCriteria.keys.createTimeTo"
      />
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="!!permissions.add"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @add="isAddDomianShow = true"
      @reloadData="getTableData"
    >
      <!-- 表格插槽 -->
      <el-table-column align="left" :label="$t('推广域名')" slot="domainUrl">
        <template slot-scope="scope">
          {{ scope.row.domainUrl }}
          <CopyButton :copyContent="scope.row.domainUrl"></CopyButton>
        </template>
      </el-table-column>
      <el-table-column align="left" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          <el-tag :type="statusMapper[scope.row.status].type">{{
            statusMapper[scope.row.status].label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="left" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 2 && permissions.edit">
            <el-button type="text" @click="handlePass(scope.row.id)"
              >[{{ $t('通过') }}]</el-button
            >
            <el-button
              type="text"
              @click="handleReject(scope.row.id, scope.row.agyAccount)"
              >[{{ $t('拒绝') }}]</el-button
            >
          </template>
        </template>
      </el-table-column>
    </TableCom>
    <!-- 新增域名 -->
    <el-dialog :title="$t('新增域名')" :visible.sync="isAddDomianShow" width="30%">
      <AddDomain ref="add" v-if="isAddDomianShow" @submit="handleSubmit" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDomianShow = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="$refs.add.handleSubmit()"
          >{{ $t('确定') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddDomain from "./AddDomain";
import systemConfig from "../../../config/config";
import CopyButton from "../../../components/CopyButton";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
export default {
  name: "agentDomain",
  components: { StartAndEndTimeSelector, CopyButton, AddDomain },
  data() {
    return {
      searchCriteria: {
        keys: {
          domainUrl: null,
          agyAccount: null,
          status: null,
          createTimeFrom: null,
          createTimeTo: null
        },
        meta: [
          {
            type: "text",
            label: this.$t("推广域名"),
            prop: "domainUrl"
          },
          {
            type: "text",
            label: this.$t("代理"),
            prop: "agyAccount"
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "status",
            options: [
              {
                label: this.$t("全选"),
                value: null
              },
              {
                label: this.$t("待处理"),
                value: 2
              },
              {
                label: this.$t("已通过"),
                value: 1
              },
              {
                label: this.$t("已拒绝"),
                value: 0
              }
            ]
          },
          {
            label: this.$t("申请时间"),
            slotName: "registTime",
            options: [
              {
                label: this.$t("本月"),
                value: "currentMonth"
              },
              {
                label: this.$t("上个月"),
                value: "lastMonth"
              },
              {
                label: this.$t("近三月"),
                value: "lastThreeMonths"
              }
            ]
          }
        ]
      },
      tableData: [],
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left"
        },
        {
          slotName: "domainUrl"
        },
        {
          prop: "clientTypeText",
          label: this.$t("域名类型")
        },
        {
          prop: "agyAccount",
          label: this.$t("所属代理")
        },
        {
          prop: "createTime",
          label: this.$t("申请时间"),
          width: "180px"
        },
        {
          slotName: "status"
        },
        {
          slotName: "operation"
        }
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isAddDomianShow: false,
      statusMapper: {
        null: {},
        0: {
          type: "error",
          label: this.$t("已拒绝")
        },
        1: {
          type: "success",
          label: this.$t("已通过")
        },
        2: {
          type: "warning",
          label: this.$t("待处理")
        }
      }
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("agent:domain:save"),
        edit: hasPermission("agent:domain:audit")
      };
    }
  },
  mounted() {
    this.getTableData();
    console.log("permissions.add", this.permissions.add);
  },
  methods: {
    handleSubmit(formModel) {
      this.$axios
        .post(systemConfig.urls.agentDomian.add, formModel)
        .then(() => {
          this.isAddDomianShow = false;
          this.getTableData();
        });
    },
    handleStatusChange(id, status) {
      this.$axios
        .post(systemConfig.urls.agentDomian.audit, {
          id,
          status
        })
        .then(() => {
          this.$message.success(this.$t("操作成功"));
          this.getTableData();
        });
    },
    handleReject(id, agyAccount) {
      this.$confirm(
        this.$t(`拒绝后，该域名及其二级域名不会添加到代理：{agyAccount}的推广链接，是否确定？`, { agyAccount }),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("确定"),
          cancelButtonText: this.$t("取消")
        }
      ).then(() => {
        this.handleStatusChange(id, 0);
      });
    },
    handlePass(id) {
      this.$confirm(this.$t(`请确定已将此推广域名解析到gf.nbl.aligatao.com？`), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消")
      }).then(() => {
        this.handleStatusChange(id, 1);
      });
    },
    getTableData() {
      this.$axios
        .get(systemConfig.urls.agentDomian.list, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys
          }
        })
        .then(res => {
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map(item => {
              item.clientTypeText = this.$t("PC代理");
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
              );
              return item;
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-list-breadcrumb {
  float: left;
  display: flex;
  align-items: center;
}
</style>
