<!-- 代理总览报表 -->
<template>
  <!-- agentManage/agentMemberTotalView -->
  <div class="agent-master-list">
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible">
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :left="40"
            :selections="timeSelections"
            :startTime.sync="searchForm.startTime"
            :endTime.sync="searchForm.endTime"
          />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <input type="text" v-model="searchForm.agyAccount" v-trim />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('上级代理') }}</label>
          <input type="text" @change="changeParentAgyAccount($event)" v-model="searchForm.parentAgyAccount" v-trim />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('查询范围') }}</label>
          <el-select v-model="searchForm.isDirectlyAgy" :placeholder="$t('请选择')" clearable>
            <el-option v-for="item in fanweis" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="div-search-btn" style="top: 50%; transform: translateY(-50%)">
        <el-button type="primary" class="wid-80" @click="onSearch">
          {{ $t('查询') }}
        </el-button>
        <el-button type="danger" class="wid-80" @click="onReset">
          {{ $t('重置') }}
        </el-button>
      </div>
    </div>
    <div class="tools__btn">
      <el-button
        class="iconfont icon-export el-button-export export"
        @click="handleExport"
        :loading="isExporting"
        >{{ isExporting ? $t('导出中') : $t('导出当前表单') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="agyAccount" :label="$t('代理')" width="120">
      </el-table-column>
      <el-table-column prop="parentAgyAccount" :label="$t('上级代理')" width="120">
      </el-table-column>
      <el-table-column prop="totalNewMbrs" :label="$t('新增会员')"> </el-table-column>
      <el-table-column prop="totalDepositBalanceNum" :label="$t('存款人数')">
      </el-table-column>
      <el-table-column
        prop="totalDepositBalance"
        :label="$t('存款金额')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <!-- x -->
      <el-table-column
        prop="totalActualarrival"
        :label="$t('存款实际到账金额')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column prop="totalNewDeposits" :label="$t('首存人数')">
      </el-table-column>
      <el-table-column
        prop="totalNewDepositAmount"
        :label="$t('首存金额')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column prop="totalDrawAmountNum" :label="$t('提款人数')">
      </el-table-column>
      <el-table-column
        prop="totalDrawAmount"
        :label="$t('提款金额')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <!-- x -->
      <el-table-column
        prop="totalProfit"
        :label="$t('净盈利')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column prop="totalActiveMbrs" :label="$t('活跃人数')">
      </el-table-column>
      <el-table-column
        prop="totalBonusAmount"
        :label="$t('所有优惠')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column prop="totalBonusAmountNum" :label="$t('优惠人数')">
      </el-table-column>
      <el-table-column
        prop="totalValidBets"
        :label="$t('有效投注金额')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="totalPayout"
        :label="$t('总盈亏')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="cost"
        :label="$t('平台费')"
        width="100"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="serviceCost"
        :label="$t('服务费')"
        width="100"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="netwinlose"
        :label="$t('净输赢冲销')"
        width="120"
        :formatter="thousandsFormatter"
      >
      </el-table-column>
    </el-table>
    <div class="pagination" style="margin-bottom: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo"
        :page-sizes="pageSizeArr"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../../config/config.js"
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector"
import Mixin from '@/mixins/loadTime'
import moment from "moment"

export default {
  mixins: [Mixin],
  components: {
    StartAndEndTimeSelector,
  },
  data() {
    return {
      timeSelections: [
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
      searchForm: {
        pageNo: 1,
        pageSize: 10,
        startTime: moment().format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        agyAccount: '',
        parentAgyAccount: '',
      },
      pageSizeArr: [5, 10, 15, 20, 50, 100],
      isExporting: false,
      tableData: [],
      totalCount: 0,
      fanweis: [
        {label:this.$t('下一级代理'),value:1},
        {label:this.$t('所有层级代理'),value:0},
      ],
    }
  },
  created() {
    // this.getAgentMemberTotalView(true)
    this.onSearch()
  },
  methods: {
    thousandsFormatter(row, column, cellValue) {
      return this.toThousands(cellValue)
    },
    toThousands(money) {
      return systemConfig.toThousands(money);
    },
    handleExport() {
      this.isExporting = true
      this.$axios
        .get(systemConfig.urls.agentReport.comReportExport, {
          params: {
            module: 'cagencyMemberTotalList',
            ...this.searchForm,
          },
        })
        .then((res) => {
          let isDownBool = res.data.data
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false
          } else {
            this.checkExportFile()
          }
        })
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      this.$axios
        .get(systemConfig.urls.agentReport.checkFile, {
          params: {
            module: 'cagencyMemberTotalList',
          },
        })
        .then((res) => {
          const obj = res.data.data || {}
          const fileName = obj.fileName,
            downloadFileName = obj.downloadFileName
          if (fileName) {
            const { baseURL } = res.config
            // 下载文件
            let SToken = localStorage.getItem("SToken")
            window.open(
              baseURL +
              `/${systemConfig.urls.agentReport.downloadExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isExporting = false;
            /* instance.close() */
          } else {
            window.setTimeout(this.checkExportFile, 1000)
          }
        })
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.getAgentMemberTotalView()
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.getAgentMemberTotalView()
    },
    onReset() {
      this.searchForm.startTime = null
      this.searchForm.endTime = null
      this.searchForm.agyAccount = ''
      this.searchForm.parentAgyAccount = ''
      // this.searchForm = this.$options.data().searchForm
      // this.getAgentMemberTotalView(true)
    },
    onSearch() {
      this.searchForm.pageNo = 1
      this.getAgentMemberTotalView()
    },
    getAgentMemberTotalView() {
      const { startTime, endTime } = this.searchForm
      if (!startTime || !endTime) {
        return this.$message({
          message: this.$t('必须选择一个时间范围！'),
          type: 'warning',
        })
      }
      if (startTime.length <= 10) {
        this.searchForm.startTime += ' 00:00:00'
      }
      if (endTime.length <= 10) {
        this.searchForm.endTime += ' 23:59:59'
      }
      this.getCurrentRecodeTime()
      this.$axios.get('/bkapi/agent/comReport/agentMemberTotalView', {
        params: this.searchForm,
      }).then(res => {
        const { data } = res
        this.getNetworkLoadAndDataSolveTime(res)
        const { list, totalCount } = data.page
        this.tableData = list
        this.totalCount = totalCount
      })
    },
    changeParentAgyAccount(ev){
      if(ev.target.value){
        this.$set(this.searchForm,'isDirectlyAgy',1)
      }
    }
  },
  watch: {
    'searchForm.startTime' (n, o) {
      if(this.searchForm.parentAgyAccount){
        this.$set(this.searchForm,'isDirectlyAgy',1)
      }
    },
    'searchForm.endTime' (n, o) {
      if(this.searchForm.parentAgyAccount){
        this.$set(this.searchForm,'isDirectlyAgy',1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-table td {
  text-align: center;
}
.tools__btn {
  padding: 10px 0;
  overflow: hidden;
  .export {
    float: right;
    color: #fff;
    background-color: #469ad0 !important;
  }
}
@media screen and (max-width: 1460px) {
  .agent-master-list {
    .width180 {
      width: 150px !important;
      input {
        width: 150px !important;
      }
    }
  }
}
</style>
