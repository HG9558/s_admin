<!--  代理管理- 代理域名-->
<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="createTime" :left="40" :selections="searchCriteria.meta[3].options" :startTime.sync="searchCriteria.keys.createTimeFrom" :endTime.sync="searchCriteria.keys.createTimeTo" />
      <StartAndEndTimeSelector slot="expireDate" :left="100" :selections="searchCriteria.meta[5].options" :startTime.sync="searchCriteria.keys.expireDateStart" :endTime.sync="searchCriteria.keys.expireDateEnd" />
    </TableSearchBar>
    <TableCom :hasAddBtn="!!permissions.add"
              :hasRemoveBtn="!!permissions.delete"
              :tableData="tableData" :totalCount="totalCount"
              :pageSize.sync="pageSize"
              :tableColumns="tableColumns"
              :currentPage.sync="currentPage"
              @add="isAddDomianShow = true"
              @remove="deleteSelection"
              @reloadData="getTableData"
              v-loading="loading"
              :showLoadTime="true"
              :networkLoadTime="networkLoadTime"
              :dataSolveTime="dataSolveTime">
      <!-- 全局组件 表格组件 -->
      <div class="table-operation-btns-wrapper-self" v-if="permissions.export">
        <div class="table-operation-btns">
          <el-button type="primary" :disabled="!totalCount" :loading="!isNowDowning" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{isNowDowning?$t('导出'):$t('导出中') + '...'}}
          </el-button>
        </div>
      </div>
      <!-- 表格插槽 -->
      <el-table-column align="center" :label="$t('推广域名')" slot="domainUrl">
        <template slot-scope="scope">
          {{ scope.row.domainUrl }}
          <CopyButton :copyContent="scope.row.domainUrl"></CopyButton>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('域名状态')" slot="expireStatusStr">
        <template slot-scope="scope">
          {{ scope.row.expireStatusStr }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('状态')" slot="available">
        <template slot-scope="scope">
          <!-- <el-tooltip :content="'Switch value: ' + value" placement="top"> -->
            <el-switch :disabled="!permissions.edit" v-model="scope.row.available" @change="handleAvailableChange(scope.row)" :active-value="1" :inactive-value="0"></el-switch>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
    </TableCom>
    <!-- 新增域名 -->
    <el-dialog :title="$t('新增域名')" :visible.sync="isAddDomianShow" width="30%">
      <AddDomain ref="add" v-if="isAddDomianShow" @submit="handleSubmit" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddDomianShow = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="$refs.add.handleSubmit()">{{ $t('确定') }}</el-button>
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
import Mixin from '@/mixins/loadTime'


export default {
  mixins: [Mixin],
  name: "agentDomain",
  components: { StartAndEndTimeSelector, CopyButton, AddDomain },
  data() {
    return {
      loading: false,
      searchCriteria: {
        keys: {
          domainUrl: null,
          agyAccount: null,
          status: null,
          createTimeFrom: null,
          createTimeTo: null,
          expireDateStart: null,
          expireDateEnd: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("推广域名"),
            prop: "domainUrl",
          },
          {
            type: "text",
            label: this.$t("所属代理"),
            prop: "agyAccount",
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "available",
            options: [
              {
                label: this.$t("锁定"),
                value: 0,
              },
              {
                label: this.$t("启用"),
                value: 1,
              },
            ],
          },
          {
            label: this.$t("时间"),
            slotName: "createTime",
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
            ],
          },
          {
            type: "select",
            label: this.$t("域名状态"),
            prop: "expireStatusStr",
            options: [
              {
                label: this.$t("到期"),
                value: this.$t('到期'),
              },
              {
                label: this.$t("未到期"),
                value: this.$t('未到期'),
              },
            ],
          },
          {
            label: this.$t("到期时间"),
            slotName: "expireDate",
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
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          type: "selection",
        },
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          slotName: "domainUrl",
        },
        {
          prop: "clientTypeText",
          label: this.$t("域名类型"),
        },
        {
          prop: "agyAccount",
          label: this.$t("所属代理"),
        },
        {
          prop: "expireDate",
          label: this.$t("到期时间"),
          width: "180px",
        },
        {
          prop: "createTime",
          label: this.$t("创建时间"),
          width: "180px",
        },
        {
          slotName: "expireStatusStr",
        },
        {
          slotName: "available",
        },
        {
          slotName: "operation",
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isAddDomianShow: false,
      statusMapper: {
        null: {},
        0: {
          type: "error",
          label: this.$t("已拒绝"),
        },
        1: {
          type: "success",
          label: this.$t("已通过"),
        },
        2: {
          type: "warning",
          label: this.$t("待处理"),
        },
      },
      isNowDowning: true, //文件导出
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("agent:domain:save"),
        edit: hasPermission("agent:domain:available"),
        delete: hasPermission("agent:domain:delete"),
        export: hasPermission("agent:domain:export"),
      };
    },
  },
  mounted() {
    this.getTableData();
    console.log("permissions.add", this.permissions.add);
  },
  methods: {
    handleExport(){
      this.isNowDowning = false;
      this.$axios
        .get(systemConfig.urls.agentDomian.agentDomainExport)
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isNowDowning = true;
          } else {
            this.checkExportFile();
          }
        }).finally(() => {
        this.isNowDowning = true;
      });
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      /* const instance = this.$loading({
          fullscreen: true,
          text: '文件生成中...'
        }) */
      this.$axios.get(systemConfig.urls.agentApply.agyAccountReviewExportCheck,{
        params: {
          module: "agentDomainExcel"
        }
      }).then((res) => {
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
          this.isNowDowning = true;
          /* instance.close() */
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },
    handleAvailableChange({id, available}) {
      const params = {
        id,
        available
      }
      this.$axios.post(systemConfig.urls.agentDomian.editStatus, params)
        .then(res => {
          this.getTableData()
        })
    },
    deleteSelection(selectIds) {
      const params = {
        ids: selectIds,
      };
      this.$axios
        .post(systemConfig.urls.agentDomian.delete, params)
        .then(() => {
          this.getTableData();
        });
    },
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
          status,
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
          cancelButtonText: this.$t("取消"),
        }
      ).then(() => {
        this.handleStatusChange(id, 0);
      });
    },
    handlePass(id) {
      this.$confirm(this.$t(`请确定已将此推广域名解析到gf.nbl.aligatao.com？`), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
      }).then(() => {
        this.handleStatusChange(id, 1);
      });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.loading = true;
      this.$axios
        .get(systemConfig.urls.agentDomian.list, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.loading = false;
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.clientTypeText = this.$t("PC代理");
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
              );
              return item;
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-list-breadcrumb {
  float: left;
  display: flex;
  align-items: center;
}
.table-operation-btns-wrapper-self {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  .table-operation-btns {
    padding: 0;
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-end;
  }
}
/deep/ .table-operation-btns {
  .el-button {
    width: 120px;
    margin-left: 15px;
  }
}
</style>
