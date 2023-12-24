<template>
  <div class="Mbrlog">
    <h3 style="margin: 5px 0 15px 0;">{{ $t('数据更新日志') }}</h3>
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector type="date" slot="date" ref="date" :left="40" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" defaultTypeP="currentWeek"/>
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
      <!-- 表格插槽 -->
      <el-table-column :label="$t('时间')" slot="timeStr" align="center">
      </el-table-column>
      <el-table-column :label="$t('变更项目')" slot="timeItemStr" align="center">
      </el-table-column>
      <el-table-column :label="$t('变更内容')" slot="beforeChange" align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.beforeChange"></div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('变更后')" slot="afterChange" align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.afterChange"></div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('详情')" slot="platform" align="center">
        <template slot-scope="scope">

          <div>
            <div v-show="scope.row.platformName">{{ $t('游戏场馆') }}： {{scope.row.platformName}}</div>
            <div v-show="scope.row.timeStr">{{ $t('日期') }}： {{(scope.row.timeStr).slice(0, 10)}}</div>
            <div v-show="scope.row.userName">{{ $t('会员账号') }}： {{scope.row.userName}}</div>
            <div v-show="scope.row.type">{{  $t('变更项目') }}： {{handleSoveType(scope.row)}}</div>
            <div v-if="[1,2].includes(scope.row.type)">
              <div>{{ $t('变更前金额') }}： {{toThousands(scope.row.beforeBalance)}}</div>
              <div>{{ $t('变更后金额') }}： {{toThousands(scope.row.afterBalance, '-')}}</div>
            </div>
            <div v-else>
              <div>{{ $t('变更前有效下注') }}： {{toThousands(scope.row.beforeBalance)}}</div>
              <div>{{ $t('变更后有效下注') }}： {{toThousands(scope.row.afterBalance, '-')}}</div>
              <div>{{ $t('变更前总盈亏') }}： {{toThousands(scope.row.beforeBalance1) }}</div>
              <div>{{ $t('变更后总盈亏') }}： {{toThousands(scope.row.afterBalance1, '-')}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import systemConfig from "../../config/config.js";
import moment from "moment";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "Mbrlog",
  data(){
    const number = (rule, value, callback) => {
      if (value&&(!Number.isInteger(value)||value<0)) {
        callback(new Error(this.$t('请输入正整数')));
      } else {
        callback();
      }
    };
    return {
      isExporting: false,
      pageSize: 100,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: systemConfig.getCurrentWeek()[0],
          endTime: systemConfig.getCurrentWeek()[1],
        },
        meta: [
          {
            label: this.$t("时间"),
            slotName: "date",
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
              {
                label: this.$t("本月"),
                value: "currentMonth",
              },
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [

        {
          prop: "timeStr",
          label: this.$t("时间"),
        },
        {
          prop: "timeItemStr",
          label: this.$t("变更项目"),
        },
        {
          prop: "beforeChange",
          label: this.$t("变更内容"),
          slotName: 'beforeChange',
        },
        {
          prop: "afterChange",
          label: this.$t("变更后"),
          slotName: 'afterChange',
        },
        {
          prop: "platform",
          label: this.$t("详情"),
          slotName: 'platform'
        },
      ],
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("member:mbrdepositlock:depositlock"),
      };
    },
  },
  created() {
    this.getTableData()
  },
  methods:{
    toThousands (money, s) {
      if (money === 0) return money
      if (!money && money !== 0 && s) return s
      return s ?( systemConfig.toThousands(money) || s) : systemConfig.toThousands(money)
    },
    clearDefault(){
    },
    handleExport() {
      let url = systemConfig.urls.exportAgentDateList
      this.isExporting = true;
      this.$axios
        .get(url, {
          params: {
            startTime:this.searchCriteria.keys.startTime,
            endTime:this.searchCriteria.keys.endTime,
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
        .get(systemConfig.urls.moneySheetCheckFile, {
          params: {
            module: 'exportAgentList',
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
    getTableData(type) {
      this.getCurrentRecodeTime()
      if(type&&type.type==='resetAndSearch'){
        this.$refs.date.defaultType = null
        this.tableData = []
        return;
      }
      if (!this.searchCriteria.keys.startTime && !this.searchCriteria.keys.endTime
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入时间")
        });
        return;
      }
      if (
        (this.searchCriteria.keys.startTime && !this.searchCriteria.keys.endTime) ||
        (!this.searchCriteria.keys.startTime && this.searchCriteria.keys.endTime)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入完整的时间段")
        });
        return;
      }
      if (this.searchCriteria.keys.startTime && this.searchCriteria.keys.endTime) {
        if (
          new Date(this.searchCriteria.keys.startTime).getTime() > new Date(this.searchCriteria.keys.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("起始时间不能大于结束时间")
          });
          return;
        }
      }
      if (!this.searchCriteria.keys.startTime) {
        this.searchCriteria.keys.startTime = "";
      }
      if (!this.searchCriteria.keys.endTime) {
        this.searchCriteria.keys.endTime = "";
      }
      let params = Object.assign({},this.searchCriteria.keys)
      // let url = systemConfig.urls.mbrlog
      let url = systemConfig.urls.rptBetRcdDayLogList

      this.$axios
        .post(url, {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = []
          if (res) {
            const {list, totalCount, currPage} = res.data.page;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            list.map(item => {
              this.tableData.push(item)
            });
          }
        });
    },
    handleSoveType (row) {
      return [this.$t('资金调整'), this.$t('会员提款'), this.$t('总盈亏')][row.type - 1]
    },
  }
}
</script>

<style lang="scss" scoped>
.Mbrlog{
  .blue{color: #3a8ee6;}
  .blue:hover{cursor: pointer;}
  .export-div{display: flex;justify-content: flex-end;}
  .width100{width: 130px!important;}
  ::v-deep .first-line .el-form-item__content{border: 0;}
  .exportd{right: 93px;}
}
// .el-table .cell {
//   white-space: pre-wrap;
// }
</style>
