<template>
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="registTime" :left="110" :selections="searchCriteria.meta[3].options" :startTime.sync="searchCriteria.keys.createTimeFrom" :endTime.sync="searchCriteria.keys.createTimeTo" />
    </TableSearchBar>
    
    <!-- 全局组件 表格组件 -->
    <div class="table-operation-btns-wrapper-self" v-if="permissions.export">
      <div class="table-operation-btns">
        <el-button v-if="isNowDowning" :disabled="!totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{ $t('导出') }}
        </el-button>
        <el-button v-else-if="!isNowDowning" class="iconfont icon-export el-button-export" size="mini">{{ $t('导出中') }}...
        </el-button>
      </div>
    </div>

    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage"
      @add="setAgyAccount('add')"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime">
      <!-- 表格插槽 -->
      <el-table-column align="center" :label="$t('代理账号')" slot="agyAccount">
        <template slot-scope="scope">
          <div style="color: #3f99f7;cursor: pointer;" @click="setAgyAccount('edit', scope.row)">{{scope.row.agyAccount}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          {{[$t('审核拒绝'), '', $t('待审核')][scope.row.status]}}
        </template>
      </el-table-column>
    </TableCom>
    <!-- 新增域名 -->
    <el-dialog :title="$t('代理详情')" :visible.sync="isAgyAccountShow" width="60% !important">
      <AgentDetail ref="add" v-if="isAgyAccountShow" @submit="handleSubmit" :rowData="rowData"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import AgentDetail from './AgentDetail'
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "agentDomain",
  components: { StartAndEndTimeSelector, AgentDetail },
  data() {
    return {
      searchCriteria: {
        keys: {
          agyAccount: null,
          mobile: null,
          status: null,
          createTimeFrom: null,
          createTimeTo: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "text",
            label: this.$t("手机号"),
            prop: "mobile",
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "status",
            options: [
              {
                label: this.$t("待审核"),
                value: 2,
              },
              {
                label: this.$t("审核拒绝"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("注册时间"),
            slotName: "registTime",
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
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          slotName: "agyAccount", // 代理账号
        },
        {
          prop: "mobile",
          label: this.$t("手机号"),
        },
        {
          prop: "realName",
          label: this.$t("姓名"),
        },
        {
          prop: "memo",
          label: this.$t("备注"),
        },
        {
          slotName: "status",
        },
        {
          prop: "createTime",
          label: this.$t("注册时间"),
          sortable: true
        },
        {
          prop: "reviewTime",
          label: this.$t("审核时间"),
          sortable: true
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isAgyAccountShow: false,
      rowData: {},
      isNowDowning: true, //文件导出
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("agent:domain:save"),
        edit: hasPermission("agent:domain:audit"),
        export: hasPermission("agent:review:export"),
      };
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleExport(){
      this.isNowDowning = false;
      this.$axios
        .get(systemConfig.urls.agentApply.agyAccountReviewExport)
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
          module: "agyAccountReviewExport"
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
    handleSubmit() {
      this.isAgyAccountShow = false
      this.getTableData();
    },
    setAgyAccount(whichOperate, rowData) {
      this.isAgyAccountShow = true
      this.rowData = whichOperate === 'add' ? {} : rowData
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.agentApply.agyAccountReviewList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
          },
        })
        .then((res) => {
          if (res) {
            this.getNetworkLoadAndDataSolveTime(res)
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
              );
              item.reviewTime = systemConfig.transferTimeByType(
                item.reviewTime,
                "bj"
              );
              return item;
            });
          }
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
  padding: 20px 0 0;
  margin-bottom: -20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  .table-operation-btns {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
