<template>
  <div class="dailyRetainSheet">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData();clearDefault();" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="date" ref="date" :left="105" :selections="searchCriteria.meta[1].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" defaultTypeP="last31Days"/>
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div">
        <el-button class="iconfont icon-export el-button-export export" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导出当前表单')}}
          </el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('留存数')" slot="liucunshu" align="center">
          <el-table-column v-for="(item,index) in monthday" :key="index" :label="item.toString()" align="center" width="50">
            <template slot-scope="scope">
              {{(scope.row.retentionRateResultDtoList&&scope.row.retentionRateResultDtoList.length&&scope.row.retentionRateResultDtoList[index])?scope.row.retentionRateResultDtoList[index].num:null}}
            </template>
          </el-table-column>
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
  name: "WithdrawClock",
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
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: moment().subtract(30, "day").format("YYYY-MM-DD")+ " 00:00:00",
          endTime: moment().format("YYYY-MM-DD")+ " 23:59:59",
          userName: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "userName",
          },
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
        ],
      },
      tableData: [],
      tableColumns: [
        {
          prop: "time",
          label: this.$t("首存日期"),
        },
        {
          prop: "firstChargeTimeNum",
          label: this.$t("首存人数"),
        },
        {
          slotName: "liucunshu"
        }
      ],
      monthday: [],
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
    for(let i=0;i<31;i++){
      this.monthday.push(i+1)
    }
    this.getTableData()
  },
  methods:{
    clearDefault(){
      this.$refs.date.defaultType = null
    },
    handleExport() {
      let url = systemConfig.urls.exportRetentionRateReport
      this.isExporting = true;
      this.$axios
        .get(url, {
          params: {
            userName:this.searchCriteria.keys.userName,
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
        .get(systemConfig.urls.agentExportCheckFile, {
          params: {
            module: 'exportRetentionRateReport',
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
      let params = Object.assign({},this.searchCriteria.keys)
      let url = systemConfig.urls.retentionRateReport

      this.$axios
        .get(url, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
          },
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = []
          if (res) {
            const {list, totalCount, currPage} = res.data.data;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            list.map(item => {
              item.retentionRateResultDtoList ? null : (item.retentionRateResultDtoList = [])
              this.tableData.push(item)
            });
          }
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.dailyRetainSheet{
  .blue{color: #3a8ee6;}
  .blue:hover{cursor: pointer;}
  .export-div{display: flex;justify-content: flex-end;}
  .width100{width: 130px!important;}
  ::v-deep .first-line .el-form-item__content{border: 0;}
}
</style>
