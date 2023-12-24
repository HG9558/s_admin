<template>
  <!-- 比率统计 -->
  <!-- 上级返佣报表 -->
  <div class="transfer">
    <TableSearchBar
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      :dateLeft="40"
      :dateWidth="420"
      ref="searchCom"
      @reloadData="onReload"
      @selectChange="onSelectChange"
    >
    </TableSearchBar>
    <TableCom
      v-loading="loading"
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :hasPagination="false"
      :tableData="tableData.list"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :totalCount="totalCount"
      :loading="isExporting"
      :tableBtns="[ { text: $t('导出'), event: 'export', icon: 'iconfont icon-export el-button-export',disabled: !hasPermission('setting:deposit:depositStatisticRateExport') } ]"
      @export="handleExport"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
      :span-method="arraySpanMethod"
      :row-style="rowStyleSet"
    >
    </TableCom>


  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'
import systemConfig from "@/config/config.js";

export default {
  mixins: [Mixin],
  data() {
    const channelTypeList = [{ label: this.$t('线上入款'), value: 0 }, { label: this.$t('公司入款'), value: 1 }, { label: this.$t('加密货币'), value: 3 }]
    return {
      params: {
        pageNo: 1,
        pageSize: 2000,
      },
      searchCriteria: {
        keys: {},
        meta: [
          { label: this.$t('时间'), type: 'StartEndTime', prop: 'time', keys: { startTime: 'startTime', endTime: 'endTime' } },
          { label: this.$t('会员组'), type: 'select', prop: 'groupIds', options: [], multiple: true },
          { label: this.$t('入款方式'), type: 'select', prop: 'channelType', options: channelTypeList },
          { label: this.$t('类型'), type: 'select', prop: 'subChannelType', options: [] },
          { label: this.$t('收款通道'), type: 'text', prop: 'channelName' },
        ],
      },
      loading: false,
      exportLoading: false,
      tableData: {
        totalCount: 0,
        list: []
      },
      tableColumns: [
        // { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('入款方式'), prop: 'channelTypeName' },
        { label: this.$t('类型'), prop: 'subChannelTypeName' },
        { label: this.$t('收款通道'), prop: 'channelName' },
        { label: this.$t('总结成功交易'), prop: 'successTotalCount' },
        { label: this.$t('5分钟内上分'), prop: 'timeOneCount' },
        { label: this.$t('比率'), prop: 'timeOneRate' },
        { label: this.$t('5-10分钟内'), prop: 'timeTwoCount' },
        { label: this.$t('比率'), prop: 'timeTwoRate' },
        { label: this.$t('超时10分钟'), prop: 'timeThreeCount' },
        { label: this.$t('比率'), prop: 'timeThreeRate' },
      ],
      isNowDowning: true,
      onlineDeposit: [],
      companyDeposit: [],
      cryptDeposit: [],
      channelTypeList,
      totalCount: null,
      isExporting: false,
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        export: hasPermission("setting:deposit:depositStatisticRateExport"),
      }
    },
  },
  created() {
    this.getmbrGrouplist()
    this.getTableData()
  },
  methods: {
    onSelectChange(channelType, prop) {
      if (prop === 'channelType') {
        this.getDepositTypeList({ channelType })
      }
    },
    async getmbrGrouplist() {
      const { res } = await this.$axios.GET(this.$urls.mbrGrouplist)
      this.searchCriteria.meta[1].options = res.page.map(item => ({ label: item.groupName, value: item.id }))
    },
    async getDepositTypeList(params) {
      const { res } = await this.$axios.GET(this.$urls.getDepositType, params)
      this.searchCriteria.meta[3].options = res.page.map(item => ({ label: item.subChannelTypeName, value: item.subChannelType }))
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const onlineRowIndex = this.onlineDeposit.length - 1
      const companyRowIndex = this.onlineDeposit.length + this.companyDeposit.length - 1
      const cryptRowIndex = this.onlineDeposit.length + this.companyDeposit.length + this.cryptDeposit.length - 1
      const totalRowIndex = this.tableData.list.length - 1
      if (rowIndex === onlineRowIndex || rowIndex === companyRowIndex || rowIndex === cryptRowIndex || rowIndex === totalRowIndex) {
        if (columnIndex === 0) {
          return [1, 3]
        } else if (columnIndex === 1 || columnIndex === 2) {
          return [0, 0]
        }
      }
    },
    rowStyleSet({ row }) {
      const arr = [this.$t('线上入款汇总'), this.$t('公司入款汇总'), this.$t('加密货币汇总'), this.$t('总计')]
      if (arr.includes(row.channelTypeName)) {
        return {
          backgroundColor: '#e8f0f9',
          border: '1px solid #e8f0f9'
        }
      }
      return {}
    },
    onReload({ type }) {
      this.getTableData()
    },
    // 计算一些需要汇总的比率
    rateCalc(type) {
      const { successTotalCount, timeOneCount, timeTwoCount, timeThreeCount, timeFourCount } = type
      type['timeOneRate'] = successTotalCount ? parseInt((timeOneCount / successTotalCount) * 100) : 0
      type['timeTwoRate'] = successTotalCount ? parseInt((timeTwoCount / successTotalCount) * 100) : 0
      type['timeThreeRate'] = successTotalCount ? parseInt((timeThreeCount / successTotalCount) * 100) : 0
      type['timeFourRate'] = successTotalCount ? parseInt((timeFourCount / successTotalCount) * 100) : 0
    },
    resetArr() {
      this.onlineDeposit = []
      this.companyDeposit = []
      this.cryptDeposit = []
    },
    async getTableData() {
      this.resetArr()
      this.getCurrentRecodeTime()
      const { keys } = this.searchCriteria
      const params = {
        ...keys,
        ...this.params,
        groupIds: keys.groupIds && keys.groupIds.length ? keys.groupIds.join(',') : ''
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.depositStatisticRate, params)
      const { res, response } = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        res.page.forEach(item => {
          const i = this.channelTypeList.find(item2 => item2.value === item.channelType)
          item.channelTypeName = i ? i.label : '-'
        })
        // 线上入款
        const onlineDeposit = res.page.filter(item => item.channelType === 0)
        // 公司入款
        const companyDeposit = res.page.filter(item => item.channelType === 1)
        // 加密货币
        const cryptDeposit = res.page.filter(item => item.channelType === 3)
        if (onlineDeposit.length) {
          const onlineSum = {}
          for (const key in onlineDeposit[0]) {
            onlineSum[key] = onlineDeposit.reduce((prev, item) => {
              return prev + item[key]
            }, 0)
          }
          onlineSum.channelTypeName = this.$t('线上入款汇总')
          this.rateCalc(onlineSum)
          onlineDeposit.push(onlineSum)
          this.onlineDeposit = onlineDeposit
        }
        if (companyDeposit.length) {
          const companySum = {}
          for (const key in companyDeposit[0]) {
            companySum[key] = companyDeposit.reduce((prev, item) => {
              return prev + item[key]
            }, 0)
          }
          companySum.channelTypeName = this.$t('公司入款汇总')
          this.rateCalc(companySum)
          companyDeposit.push(companySum)
          this.companyDeposit = companyDeposit
        }
        if (cryptDeposit.length) {
          const cryptSum = {}
          for (const key in cryptDeposit[0]) {
            cryptSum[key] = cryptDeposit.reduce((prev, item) => {
              return prev + item[key]
            }, 0)
          }
          cryptSum.channelTypeName = this.$t('加密货币汇总')
          this.rateCalc(cryptSum)
          cryptDeposit.push(cryptSum)
          this.cryptDeposit = cryptDeposit
        }
        const nArr = JSON.parse(JSON.stringify(onlineDeposit.concat(companyDeposit).concat(cryptDeposit)))
        nArr.map(item => {
          item.successTotalAmount = (item.successTotalAmount || 0).toLocaleString();
        })
        this.tableData.list = nArr
        if (res.page.length) {
          const totalSum = {}
          for (const key in res.page[0]) {
            totalSum[key] = res.page.reduce((prev, item) => {
              return prev + item[key]
            }, 0)
          }
          totalSum.channelTypeName = this.$t('总计')
          this.rateCalc(totalSum)
          totalSum.successTotalAmount = (totalSum.successTotalAmount || 0).toLocaleString()
          this.tableData.list.push(totalSum)
        }
        this.tableData.totalCount = 0
      }
    },
    //导出
    handleExport() {
      this.isExporting = true;
      const req =  this.getParams()
      this.$axios
        .get(systemConfig.urls.depositStatisticRateExport, {
          params: {
            module: 'depositStatisticRateModule',
            ...req,
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
      .get(systemConfig.urls.depositCheckFile, {
        params: {
          module: 'depositStatisticRateModule',
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
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      })
    },
    getParams () {
    this.resetArr()
      this.getCurrentRecodeTime()
      const { keys } = this.searchCriteria
      const params = {
        ...keys,
        ...this.params,
        groupIds: keys.groupIds && keys.groupIds.length ? keys.groupIds.join(',') : ''
      }
      return params
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  td[colspan='3'] div {
    // font-size: 14px !important;
    font-weight: 600;
  }
}
</style>
