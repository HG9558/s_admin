<template>
  <div>
    <TableSearchBar
      :loading="loading"
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      @reloadData="handleGetTableData"
      ref="searchCom"
    >
      <StartAndEndTimeSelector
        ref="createTime"
        slot="createTime"
        :width="480"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.startTime"
        :endTime.sync="searchCriteria.keys.endTime"
      />
      <el-select slot="platformId" v-model="searchCriteria.keys.platformId">
        <el-option v-for="item in smsPlatformList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
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
    <TableCom
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :tableLoading="loading"
      :tableColumns="tableColumns"
      :tableData="tableData"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :totalCount="totalCount"
      @reloadData="handleGetTableData"
      :zsAndsb="zsAndsb"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
    </TableCom>
  </div>
</template>
<script>
import { lang } from "@/i18n"
const moduleOptions = [
  { label: lang('全部'), value: null },
  { label: lang('注册'), value: 1 },
  { label: lang('登录'), value: 2 },
  { label: lang('找回密码'), value: 3 },
  { label: lang('绑定银行卡'), value: 4 },
  { label: lang('绑定手机号'), value: 5 },
  { label: lang('好友转账'), value: 6 },
  { label: lang('邮箱注册'), value: 7 },
]
const typeOptions = [
  { label: lang('全部'), value: null },
  { label: lang('短信'), value: 1 },
  { label: lang('邮箱'), value: 2 },
]

const statusOptions = [
  { label: lang('全部'), value: null },
  { label: lang('成功'), value: true },
  { label: lang('失败'), value: false },
]

import Mixin from '@/mixins/loadTime'
import { mapGetters } from "vuex";
import systemConfig from "@/config/config";

export default {
  mixins: [Mixin],
  data() {
    return {
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          module: null,
          type: null,
          isSuccess: null,
          platformId : null,
        },
        meta: [
          { label: this.$t("创建时间"), slotName: "createTime" },
          { label: this.$t('模块'), type: 'select', prop: 'module', options: moduleOptions },
          { label: this.$t('接收方式'), type: 'text', prop: 'mobile' },
          { label: this.$t('验证码类型'), type: 'select', prop: 'type', options: typeOptions },
          // { label: this.$t('运营商'), type: 'select', prop: 'platformId', options: [] },
          {
            label: this.$t('运营商'),
            slotName: 'platformId'
          },
          { label: this.$t('状态'), type: 'select', prop: 'isSuccess', options: statusOptions },
        ],
      },
      loading: false,
      params: {
        pageNo: 1,
        pageSize: 10
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 80 },
        { label: this.$t('接收方式'), prop: 'mobile' },
        { label: this.$t('验证码'), prop: 'content' },
        { label: this.$t('状态'), render: (h, row) => {
          const { isSuccess } = row
          return h('span', isSuccess ? this.$t('成功') : this.$t('失败'))
        } },
        { label: this.$t('模块'), render: (h, row) => {
          const { module } = row
          const options = [
            { label: this.$t('原有的错误记录数据'), value: -1 },
            { label: this.$t('其他模块'), value: 0 },
            ...moduleOptions
          ]
          const obj = options.find(i => i.value === module) || {}
          return h('span', obj.label)
        } },
        { label: this.$t('创建时间'), prop: 'createTime' },
      ],
      tableData: [],
      totalCount: 0,
      zsAndsb: Boolean,
      smsPlatformList: [],
      isNowDowning: true,
    };
  },
  computed: {
    permissions() {
      const { hasPermission } = this;
      return {
        export: hasPermission("analysis:smslog:reportSmsLog"),
      };
    },
    ...mapGetters(["hasPermission"])
  },
  created() {
    this.initDate()
    this.handleGetTableData()
  },
  methods: {
    initDate() {
      this.getPlatformList()
      const date = new Date()
      const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.searchCriteria.keys.startTime = `${str} 00:00:00`
      this.searchCriteria.keys.endTime = `${str} 23:59:59`
    },
    async handleGetTableData() {
      this.getCurrentRecodeTime()
      const { keys } = this.searchCriteria
      const params = {
        ...this.params,
        ...keys
      }
      this.loading = true
      const data = await this.$axios.POST(this.$urls.smslog, params)
      const {response, res} = data
      this.loading = false
      this.getNetworkLoadAndDataSolveTime(response)
      if (res) {
        const { list, totalCount } = res.page
        this.tableData = list
        this.totalCount = totalCount
      }
    },
    async getPlatformList() {
      const res = await this.$axios.post(this.$urls.smsPlatformList)
      const { code, data} = res.data
      if (!code) {
        this.smsPlatformList = [
          {
            label: this.$t("全部"),
            value: null
          },
          ...data.map(item => {
            return {
              ...item,
              label: item.platformName,
              value: item.platformId
            };
          })
        ];
      }
    },
    handleExport(){
      this.isNowDowning = false;
      const { keys } = this.searchCriteria
      const params = {
        ...this.params,
        ...keys
      }
      this.$axios
        .post(this.$urls.smsReportSmsLog, params)
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
      this.$axios.get(this.$urls.smsCheckFile,{
        params: {
          module: "smslogFileExport"
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
  },
};
</script>

<style lang="scss" scoped>
.table-operation-btns-wrapper-self {
  position: relative;
  overflow: hidden;
  padding: 20px 0 0;
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
