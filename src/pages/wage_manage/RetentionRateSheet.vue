<template>
  <div class="retentionRateSheet">
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="onReload"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="date"
        ref="date"
        :left="105"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.startTime"
        :endTime.sync="searchCriteria.keys.endTime"
        defaultTypeP="last31Days"
      />
    </TableSearchBar>
    <TableCom
      v-loading="loading"
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
      :dataSolveTime="dataSolveTime"
    >
      <div slot="slot-title" class="export-div">
        <el-button
          class="iconfont icon-export el-button-export export"
          @click="handleExport"
          :loading="isExporting"
          >{{ isExporting ? $t('导出中') : $t('导出当前表单') }}
        </el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('距离首存天数/活跃情况')" slot="liucunshu" align="center">
        <el-table-column
          v-for="(item, index) in monthday"
          :key="index"
          :label="item.toString()"
          align="center"
          width="50"
        >
          <template slot-scope="scope">
            {{
              scope.row.stateList &&
              scope.row.stateList.length &&
              scope.row.stateList[index]
                ? scope.row.stateList[index].state
                : null
            }}
          </template>
        </el-table-column>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import systemConfig from "../../config/config.js";
import moment from "moment";
import Mixin from '@/mixins/loadTime'


export default {
  mixins: [Mixin],
  data() {
    return {
      isExporting: false,
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: moment().subtract(30, "day").format("YYYY-MM-DD") + " 00:00:00",
          endTime: moment().format("YYYY-MM-DD") + " 23:59:59",
          agentName: null,
          userName: null,
          rule: null,
        },
        meta: [
          {
            label: this.$t("首存日期"),
            slotName: "date",
            options: [
              {
                label: this.$t("近7日"),
                value: "lastSevenDays",
              },
              {
                label: this.$t("近31日"),
                value: "last31Days",
              },
            ],
          },
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agentName",
          },
          {
            type: "text",
            label: this.$t("会员名"),
            prop: "userName",
          },
          {
            type: "select",
            label: this.$t("留存规则"),
            prop: "rule",
            options: [
              {
                label: this.$t("全部"),
                value: null,
              },
              {
                label: this.$t("存款规则"),
                value: 1,
              },
              {
                label: this.$t("投注规则"),
                value: 2,
              },
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          prop: "userName",
          label: this.$t("会员账户"),
        },
        {
          prop: "firstChargeDate",
          label: this.$t("首存日期"),
          width: '100',
        },
        {
          slotName: "liucunshu"
        }
      ],
      monthday: [],
      loading: false,
    }
  },
  created() {
    for (let i = 1; i <= 31; i++) {
      this.monthday.push(i)
    }
    this.getTableData()
  },
  methods: {
    onReload({ type }) {
      if (type === 'resetAndSearch') {
        this.searchCriteria.keys.startTime = moment().subtract(30, "day").format("YYYY-MM-DD") + " 00:00:00"
        this.searchCriteria.keys.endTime = moment().format("YYYY-MM-DD") + " 23:59:59"
      }
      this.getTableData()
    },
    handleExport() {
      let url = systemConfig.urls.retentionRate.exportReport
      this.isExporting = true;
      this.$axios
        .get(url, {
          params: {
            agentName: this.searchCriteria.keys.agentName,
            userName: this.searchCriteria.keys.userName,
            rule: this.searchCriteria.keys.rule,
            startTime: this.searchCriteria.keys.startTime,
            endTime: this.searchCriteria.keys.endTime,
          },
        })
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
          } else {
            this.checkExportFile();
          }
        });
    },
    checkExportFile() {

      // 查看导出文件是否可下载

      this.$axios
        .get(systemConfig.urls.retentionRate.checkFile, {
          params: {
            module: 'exportRetentionRateDailyActiveReport',
          },
        })
        .then((res) => {
          const obj = res.data.data || {};
          const fileName = obj.fileName,
            downloadFileName = obj.downloadFileName;
          if (fileName) {
            const { baseURL } = res.config;
            // 下载文件
            let SToken = localStorage.getItem("SToken");
            window.open(
              baseURL +
              `/${systemConfig.urls.agentReport.downloadExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isExporting = false;
            /* instance.close() */
          } else {
            window.setTimeout(this.checkExportFile, 1000);
          }
        });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.loading = true
      let params = Object.assign({}, this.searchCriteria.keys)
      let url = systemConfig.urls.retentionRate.getList
      this.$axios
        .get(url, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          const { data } = res
          if (data) {
            const { list, totalCount } = data.data;
            this.totalCount = totalCount;
            this.tableData = list.map(item => {
              !item.stateList && (item.stateList = [])
              return item
            });
          }
        }).finally(() => {
          this.loading = false
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.retentionRateSheet {
  .blue {
    color: #3a8ee6;
  }
  .blue:hover {
    cursor: pointer;
  }
  .export-div {
    display: flex;
    justify-content: flex-end;
  }
  .width100 {
    width: 130px !important;
  }
  ::v-deep .first-line .el-form-item__content {
    border: 0;
  }
}
</style>
