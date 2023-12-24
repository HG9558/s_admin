<template>
  <div class="MbrMoneySheet">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="date" ref="date" :width="460" :left="40" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" defaultTypeP="today"/>
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div">
        <el-button class="iconfont icon-export el-button-export export" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导出')}}</el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('净盈利')" slot="totalProfit" align="center">
        <template slot-scope="scope">
          <span :class="[scope.row.totalProfit > 0 ? 'green': (scope.row.totalProfit < 0 ? 'red' : '')]">
            {{toThousands(scope.row.totalProfit)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('总盈亏')" slot="totalPayout" align="center">
        <template slot-scope="scope">
          <span :class="[scope.row.totalPayout > 0 ? 'green': (scope.row.totalPayout < 0 ? 'red' : '')]">
            {{toThousands(scope.row.totalPayout)}}
          </span>
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
  name: "MbrMoneySheet",
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
          startTime: moment().format("YYYY-MM-DD")+ " 00:00:00",
          endTime: moment().format("YYYY-MM-DD")+ " 23:59:59",
          loginName: null,
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
          {
            type: "text",
            label: this.$t("会员账号"),
            prop: "loginName",
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          prop: "loginName",
          label: this.$t("会员账号"),
        },
        {
          prop: "agyAccount",
          label: this.$t("上级代理"),
        },
        {
          prop: "totalProfit",
          label: this.$t("净盈利"),
          slotName: "totalProfit"
        },
        {
          prop: "totalValidBet",
          label: this.$t("投注额"),
        },
        {
          prop: "fundAdjust",
          label: this.$t("资金调整"),
        },
        {
          prop: "registerTime",
          label: this.$t("注册时间"),
        },
        {
          prop: "depositTime",
          label: this.$t("首存时间"),
        },
        {
          prop: "totalDepositBalance",
          label: this.$t("总存款"),
        },
        {
          prop: "totalDrawAmount",
          label: this.$t("总提款"),
        },
        {
          prop: "totalBonusAmountOnline",
          label: this.$t("线上红利"),
        },
        {
          prop: "totalBonusAmountOffline",
          label: this.$t("线下红利"),
        },
        {
          prop: "totalBonusAmount",
          label: this.$t("总红利"),
        },
        {
          prop: "totalPayout",
          label: this.$t("总盈亏"),
          slotName: "totalPayout"
        },
        {
          prop: "totalTaskBonus",
          label: this.$t("总任务返利"),
        },
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
    for(let i=0;i<30;i++){
      this.monthday.push(i+1)
    }
    this.getTableData()
  },
  methods:{
    toThousands (money) {
      return systemConfig.toThousands(money)
    },
    clearDefault(){
      this.searchCriteria.keys.startTime = moment().format("YYYY-MM-DD")+ " 00:00:00"
      this.searchCriteria.keys.endTime = moment().format("YYYY-MM-DD")+ " 23:59:59"
      this.$refs.date.defaultType = 'today'
    },
    handleExport() {
      let url = systemConfig.urls.mbrFundReportExport
      this.isExporting = true;
      this.$axios
        .get(url, {
          params: {
            loginName:this.searchCriteria.keys.loginName,
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
        .get(systemConfig.urls.mbrFundReportCheck, {
          params: {
            module: 'mbrExportList',
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
        this.clearDefault()
      }
      let params = Object.assign({},this.searchCriteria.keys)
      let url = systemConfig.urls.mbrFundReport

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
            const {list, totalCount, currPage} = res.data.page;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            list.map(item => {
              this.tableData.push(item)
            });
          }
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.MbrMoneySheet{
  .blue{color: #3a8ee6;}
  .blue:hover{cursor: pointer;}
  .export-div{display: flex;justify-content: flex-end;}
  .width100{width: 130px!important;}
  ::v-deep .first-line .el-form-item__content{border: 0;}
  .exportd{right: 93px;}
}
</style>
