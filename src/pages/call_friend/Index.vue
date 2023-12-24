<template>
  <div class="call-friends">
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible">
        <div class="search-basic-item width180">
          <label>{{ $t('会员账号') }}</label>
          <input type="text" v-model="searchForm.loginName" v-trim />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="searchForm.groupId" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in memberGroup"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('收益统计时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :left="145"
            :selections="timeSelections"
            :startTime.sync="searchForm.startTime"
            :endTime.sync="searchForm.endTime"
          />
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
    <div v-show="panel === 'parent'" class="tools__btn">
      <el-button
        class="iconfont icon-export el-button-export export"
        @click="handleExport"
        :loading="isExporting"
        >{{ isExporting ? $t('导出中') : $t('导出当前表单') }}
      </el-button>
    </div>

    <div v-show="panel === 'parent'">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column :label="$t('会员账号')" width="120">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="querySubList(scope.row)"
            >
              {{ scope.row.loginName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" :label="$t('会员组')" width="120">
        </el-table-column>
        <el-table-column prop="num" :label="$t('下级代理')"> </el-table-column>
        <el-table-column prop="betNum" :label="$t('注单数量')"> </el-table-column>
        <el-table-column prop="rewardNum" :label="$t('中奖注单')"> </el-table-column>
        <el-table-column prop="amount" :label="$t('中奖金额')"> </el-table-column>
        <el-table-column prop="reward" :label="$t('赢额返佣')"> </el-table-column>
        <el-table-column prop="deposit" :label="$t('存款')"> </el-table-column>
        <el-table-column prop="withdrawal" :label="$t('提款')"> </el-table-column>
        <el-table-column prop="discount" :label="$t('总优惠')"> </el-table-column>
        <el-table-column prop="fundAdjust" :label="$t('资金调整')"> </el-table-column>
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button
              style="width: 120px"
              type="primary"
              plain
              @click="onGetRecord(scope.row)"
            >
              {{ $t('发放记录') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="margin-bottom: 20px">
        <el-pagination
          background
          @size-change="handleSizeChange($event, 'parent')"
          @current-change="handleCurrentChange($event, 'parent')"
          :current-page="searchForm.pageNo"
          :page-sizes="pageSizeArr"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <div v-show="panel === 'sub'" class="member-detail">
      <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item @click.native="onBackToParent">
            <span style="cursor: pointer">{{ $t('呼朋唤友列表') }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in breadList"
            :key="index"
            @click.native="onClickBread(item)"
          >
            <span style="cursor: pointer">{{ item }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="onBackToParent">{{ $t('返回') }}</el-button>
      </div>
      <el-table :data="subTableData" style="width: 100%">
        <el-table-column :label="$t('会员账号')" width="120">
          <template slot-scope="scope">
            <span
              style="color: #409eff; cursor: pointer"
              @click="querySubList(scope.row)"
              >{{ scope.row.loginName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="num" :label="$t('下级代理')"> </el-table-column>
        <el-table-column prop="groupName" :label="$t('会员组')"> </el-table-column>
        <el-table-column prop="vipName" :label="$t('VIP等级')"> </el-table-column>
        <el-table-column prop="betNum" :label="$t('注单数量')"> </el-table-column>
        <el-table-column prop="rewardNum" :label="$t('中奖注单')"> </el-table-column>
        <el-table-column prop="amount" :label="$t('中奖金额')"> </el-table-column>
        <el-table-column prop="reward" :label="$t('返佣金额')"> </el-table-column>
        <el-table-column prop="deposit" :label="$t('存款')"> </el-table-column>
        <el-table-column prop="withdrawal" :label="$t('提款')"> </el-table-column>
        <el-table-column prop="discount" :label="$t('总优惠')"> </el-table-column>
        <el-table-column prop="fundAdjust" :label="$t('资金调整')"> </el-table-column>
      </el-table>
      <div class="pagination" style="margin-bottom: 20px">
        <el-pagination
          background
          @size-change="handleSizeChange($event, 'sub')"
          @current-change="handleCurrentChange($event, 'sub')"
          :current-page="subSearchForm.pageNo"
          :page-sizes="pageSizeArr"
          :page-size="subSearchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog
      @close="onCloseDialog"
      :title="$t('会员详情')"
      :visible.sync="provideRecordVisible"
    >
      <el-table :data="recordTableData" style="width: 100%">
        <el-table-column prop="createTime" :label="$t('统计时间')" width="145">
        </el-table-column>
        <el-table-column prop="giveOutTime" :label="$t('发放时间')" width="145">
        </el-table-column>
        <el-table-column prop="reward" :label="$t('发放金额')"> </el-table-column>
        <el-table-column prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            <span>{{
              scope.row.status === 0
                ? $t('失败')
                : scope.row.status === 1
                ? $t('成功')
                : '-'
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="margin-bottom: 20px">
        <div style="float: left; margin-top: 10px">
          {{ $t('累计发放') }}：<i style="color: red">{{ sumRecord }}</i>
        </div>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="recordForm.pageNo"
          :page-sizes="pageSizeArr"
          :page-size="recordForm.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="recordTotalCount"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../config/config.js";
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  components: {
    StartAndEndTimeSelector,
  },
  data() {
    return {
      memberGroup: [],
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
        startTime: '',
        endTime: '',
        loginName: '',
        groupId: '',
      },
      subSearchForm: {
        pageNo: 1,
        pageSize: 10,
        loginName: '',
      },
      pageSizeArr: [5, 10, 15, 20, 50, 100],
      isExporting: false,
      tableData: [],
      totalCount: 0,
      subTableData: [],
      provideRecordVisible: false,
      recordForm: {
        pageNo: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        loginName: '',
      },
      recordTableData: [],
      recordTotalCount: 0,
      sumRecord: null,
      panel: 'parent',
      breadList: [],
    }
  },
  watch: {
    panel(newVal) {
      if (newVal === 'parent') {
        this.breadList = []
      }
    },
  },
  created() {
    this.getMemberGroupList()
    this.getCallFriendsList()
  },
  methods: {
    onBackToParent() {
      this.panel = 'parent'
      this.searchForm.pageNo = 1
      this.subSearchForm.pageNo = 1
      this.getCallFriendsList()
    },
    onClickBread(name) {
      const i = this.breadList.findIndex(item => item === name)
      this.breadList = this.breadList.slice(0, i + 1);
      this.subSearchForm.loginName = name;
      this.getSubCallFriendsList();
    },
    querySubList(row) {
      this.panel = 'sub';
      const { loginName } = row;
      this.breadList.push(loginName)
      this.subSearchForm.pageNo = 1;
      this.subSearchForm.loginName = loginName;
      this.getSubCallFriendsList();
    },
    async getSubCallFriendsList() {
      const loading = this.$loading();
      const { startTime, endTime } = this.searchForm;
      // groupId,
      const params = {
        startTime,
        endTime,
        ...this.subSearchForm,
      }
      try {
        const { data } = await this.$axios.get(systemConfig.urls.callFriends.subList, { params });
        const { list, totalCount } = data.page;
        this.subTableData = list;
        this.totalCount = totalCount;
      } finally {
        loading.close();
      }
    },
    onCloseDialog() { },
    onGetRecord(row) {
      const { loginName } = row
      const { startTime, endTime } = this.searchForm
      this.recordForm.loginName = loginName
      this.recordForm.startTime = startTime
      this.recordForm.endTime = endTime
      this.getRecord()
      this.getSumRecord()
      this.provideRecordVisible = true
    },
    async getSumRecord() {
      const { loginName, startTime, endTime } = this.recordForm
      const params = {}
      params.loginName = loginName
      params.startTime = startTime
      params.endTime = endTime
      const { data } = await this.$axios.get(systemConfig.urls.callFriends.sum, { params })
      this.sumRecord = data.total
    },
    async getRecord() {
      const { data } = await this.$axios.get(systemConfig.urls.callFriends.record, { params: this.recordForm })
      const { list, totalCount } = data.page;
      this.recordTableData = list;
      this.recordTotalCount = totalCount;
    },
    thousandsFormatter(row, column, cellValue) {
      return this.toThousands(cellValue);
    },
    toThousands(money) {
      return systemConfig.toThousands(money);
    },
    //导出
    handleExport() {
      this.isExporting = true;
      this.$axios
        .get(systemConfig.urls.callFriends.reportExport, {
          params: {
            module: 'huPengHuYou',
            ...this.searchForm,
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
        })
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      this.$axios
        .get(systemConfig.urls.callFriends.checkFile, {
          params: {
            module: 'huPengHuYou',
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
              `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isExporting = false;
            /* instance.close() */
          } else {
            window.setTimeout(this.checkExportFile, 1000);
          }
        })
    },
    handleCurrentChange(val, type) {
      if (type === 'parent') {
        this.searchForm.pageNo = val;
        this.getCallFriendsList();
      } else if (type === 'record') {
        this.recordForm.pageNo = val;
        this.getRecord();
      } else if (type === 'sub') {
        this.subSearchForm.pageNo = val;
        this.getSubCallFriendsList();
      }
    },
    handleSizeChange(val, type) {
      if (type === 'parent') {
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = val;
        this.getCallFriendsList();
      } else if (type === 'record') {
        this.recordForm.pageNo = 1;
        this.recordForm.pageSize = val;
        this.getRecord();
      } else if (type === 'sub') {
        this.subSearchForm.pageNo = 1;
        this.subSearchForm.pageSize = val;
        this.getSubCallFriendsList();
      }
    },
    onReset() {
      this.panel = 'parent';
      this.searchForm = this.$options.data().searchForm;
      this.getCallFriendsList();
    },
    onSearch() {
      this.getCurrentRecodeTime()
      this.panel = 'parent';
      this.getCallFriendsList();
    },
    async getMemberGroupList() {
      const { data } = await this.$axios.get(systemConfig.urls.mbrGrouplist, { params: this.searchForm })
      this.memberGroup = data.page
    },
    async getCallFriendsList() {
      const loading = this.$loading();
      const { startTime, endTime } = this.searchForm;
      if (startTime && startTime.length <= 10) {
        this.searchForm.startTime += ' 00:00:00';
      }
      if (endTime && endTime.length <= 10) {
        this.searchForm.endTime += ' 23:59:59';
      }
      try {
        const obj = await this.$axios.get(systemConfig.urls.callFriends.list, { params: this.searchForm })
        const { data } = obj
        this.getNetworkLoadAndDataSolveTime(obj)
        const { list, totalCount } = data.page;
        this.tableData = list;
        this.totalCount = totalCount;
      } finally {
        loading.close();
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
.member-detail {
  .bread {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
