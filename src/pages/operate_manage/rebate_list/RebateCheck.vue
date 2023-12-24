<template>
  <div>
    <template v-if="!showChild">
      <TableSearchBar :current-page.sync="params.pageNo" :searchCriteria.sync="search" :loading="loading" @reloadData="handleSearch" />
      <TableCom
        :hasAddBtn="false"
        :hasRemoveBtn="false"
        :tableLoading="loading"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :pageSize.sync="params.pageSize"
        :currentPage.sync="params.pageNo"
        :totalCount="totalCount"
        :tableBtns="[ { type: 'primary', text: $t('批量审核'), event: 'allAudit' }, { text: $t('导出'), icon: 'iconfont icon-export el-button-export', event: 'handleExport', loading: exportLoading } ]"
        @handleExport="handleExport"
        @allAudit="handleAllAudit"
        @reloadData="getTable"
        @sort="handleTableSort"
        :showLoadTime="true"
        :networkLoadTime="networkLoadTime"
        :dataSolveTime="dataSolveTime"
      />
    </template>
    <template v-else>
      <RebateChild @goList="showChild = false" :data="childItem" :createTime="search.keys.createTime" />
    </template>
    <RebateDialog :title="$t('审核')" :is-show.sync="isBonusAudit" @btnClick="handleComfirn" :loading="auditLoading">
      <div class="center audit-box">
        <p><span class="audit-label">{{ $t('会员名称') }}：</span><span class="audit-val">{{activeItem.loginName}}</span></p>
        <p><span class="audit-label">{{ $t('自身实得佣金') }}：</span><span class="audit-val">{{activeItem.rebateFromChildActual}}</span></p>
        <p><span class="audit-label">{{ $t('自身返利') }}：</span><span class="audit-val">{{activeItem.rebate}}</span></p>
        <p><span class="audit-label">{{ $t('奖金') }}：</span><span class="audit-val">{{activeItem.bonusAmountExfromChildTotal}}</span></p>
        <p><span class="audit-label">{{ $t('实发总额') }}：</span><span class="audit-val">{{activeItem.rebateTotal}}</span></p>
      </div>
    </RebateDialog>
    <RebateDialog :title="$t('批量审核')" :is-show.sync="isAllAudit" @btnClick="handleAllComfirn" :loading="auditLoading">
      <div class="center all-audit">
        <span>{{ $t('批量审核所有待审核佣金') }}?</span>
      </div>
    </RebateDialog>
    <el-dialog :visible.sync="showEdit" :title="$t('编辑')">
      <div class="edit-box">
        <el-form ref="editform" :model="editForm" label-width="110px" :inline="true">
          <el-row v-for="(item, i) in editColumn" :key="i">
            <el-col :span="12"><el-form-item :label="item.label1"><el-input :value="editItem[item.key1]" disabled></el-input></el-form-item></el-col>
            <el-col :span="12"><el-form-item :label="item.label2"><el-input :value="editItem[item.key2]" disabled></el-input></el-form-item></el-col>
          </el-row>
          <el-form-item :label="$t('备注')">
            <el-input v-model="editForm.memo" type="textarea" style="width: 450px" :rows="5" :placeholder="$t('请输入内容')"></el-input>
          </el-form-item>
        </el-form>
        <div class="center">
          <el-button type="primary" @click="handleEditMemo" :loading="editLoading">{{ $t('确定') }}</el-button>
          <el-button @click="showEdit = false">{{ $t('取消') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableSearchBar from "../../../components/TableSearchBar";
import TableCom from "../../../components/TableCom";
import RebateDialog from "./RebateDialog";
import RebateMixins from "./RebateMixins";
import RebateChild from "./RebateChild";
import systemConfig from "../../../config/config";
import Mixin from '@/mixins/loadTime'


export default {
  name: "RebateCheck",
  mixins: [Mixin, RebateMixins],
  components: {
    TableSearchBar,
    TableCom,
    RebateChild,
    RebateDialog
  },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      search: {
        keys: {
          createTime: ''
        },
        meta: [
          { label: this.$t('统计时间'), type: 'date-pick', prop: 'createTime', pickerType: 'month' },
          { label: this.$t('会员组'), type: 'select', prop: 'groupId', options: [] },
          { label: this.$t('会员名'), type: 'text', prop: 'loginName' },
          { label: this.$t('状态'), type: 'select', prop: 'status', options: [ { label: this.$t('全部'), value: '' }, { label: this.$t('失败'), value: '0' }, { label: this.$t('成功'), value: '1' }, { label: this.$t('待审核'), value: '2' } ] },
          { label: this.$t('代理会员级别'), type: 'select', prop: 'agyLevelId', options: [] },
        ]
      },
      tableData: [],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('会员名'), prop: 'loginName', render: (h, row) => {
            return h('span', { class: 'blue-color pointer', attrs: { type: 'text' }, on: { click: () => {
              this.handlGoChildNum(row)
            } } }, row.loginName)
          }  },
        { label: this.$t('会员组'), prop: 'groupName', width: 100 },
        { label: this.$t('代理会员级别'), prop: 'tierName', width: 110 },
        { label: this.$t('下级人数'), prop: 'childNum' },
        { label: this.$t('累积实际有效输赢'), prop: 'validPayoutFromChild', sortable: 'custom', align: 'right' },
        { label: this.$t('提成比例'), render: (h, row) => h('span', `${row.commissionRatioSub ? `${row.commissionRatioSub}%` : 0}`) },
        { label: this.$t('佣金初算'), prop: 'rebateFromChild', align: 'right' },
        { label: this.$t('下级实得佣金合计'), prop: 'rebateChildTotal', align: 'right' },
        { label: this.$t('自身实得佣金'), prop: 'rebateFromChildActual', align: 'right' },
        { label: this.$t('奖金'), prop: 'bonusAmountExfromChildTotal', sortable: 'custom', align: 'right' },
        { label: this.$t('自身有效输赢'), prop: 'validPayoutForSelf', sortable: 'custom', align: 'right' },
        { label: this.$t('自身有效输赢提成比例'), render: (h, row) => h('span', `${row.commissionRatio ? `${row.commissionRatio}%` : 0}`) },
        { label: this.$t('自身返利'), prop: 'rebate', align: 'right' },
        { label: this.$t('实发总额'), prop: 'rebateTotal', align: 'right' },
        { label: this.$t('成为全民代理的时间'), prop: 'agyTime', width: 155 },
        { label: this.$t('统计时间'), prop: 'createTimeEx' },
        { label: this.$t('发放时间'), prop: 'auditTime', width: 155 },
        { label: this.$t('状态'), prop: 'status', render(h, row) {
            const { status } = row
            const obj = { 0: this.$t('失败'), 1: this.$t('成功'), 2: this.$t('待审核') }
            const classObj = { 0: 'status-fail', 1: 'status-success' }
            const className = classObj[status] || ''
            return h('span', { class: className }, obj[status])
          }, fixed: 'right' },
        { label: this.$t('备注'), prop: 'memo', fixed: 'right' },
        { label: this.$t('操作'), render: (h, row) => {
            return h('div', [
              h('span', { class: 'opt-check', on: { click: () => {
                const { status } = row
                if (status !== 2) {
                  return this.$message.warning(this.$t('仅可审核待处理状态的返利'))
                }
                this.isBonusAudit = true
                this.activeItem = row
              } } }, this.$t('审核')),
              h('span', { class: 'opt-edit', on: { click: () => {
                this.showEdit = true
                const statusObj = { 0: this.$t('失败'), 1: this.$t('成功'), 2: this.$t('审核中') }
                const { status, memo } = row
                const obj = {
                  ...row,
                  status: statusObj[status]
                }
                this.editForm.memo = memo
                this.editItem = obj
              } } }, this.$t('编辑'))
            ])
          }, width: 150, fixed: 'right' },
      ],
      editColumn: [
        { label1: this.$t('会员名称'), label2: this.$t('会员组'), key1: 'loginName', key2: 'groupName' },
        { label1: this.$t('下级人数'), label2: this.$t('代理会员级别'), key1: 'childNum', key2: 'groupName' },
        { label1: this.$t('提成比例'), label2: this.$t('累计实际有效输赢'), key1: 'commissionRatioSub', key2: 'validPayoutFromChild' },
        { label1: this.$t('下级实得佣金合计'), label2: this.$t('佣金初算'), key1: 'rebateChildTotal', key2: 'rebateFromChild' },
        { label1: this.$t('奖金'), label2: this.$t('自身实得佣金'), key1: 'bonusAmountExfromChildTotal', key2: 'rebateFromChildActual' },
        { label1: this.$t('自身有效输赢提成比例'), label2: this.$t('自身有效输赢'), key1: 'commissionRatio', key2: 'validPayoutForSelf' },
        { label1: this.$t('实发总额'), label2: this.$t('自身佣金'), key1: 'rebateTotal', key2: 'rebate' },
        { label1: this.$t('发放时间'), label2: this.$t('状态'), key1: 'auditTime', key2: 'status' },
      ],
      editForm: {
        memo: ''
      },
      loading: false,
      totalCount: 0,
      isBonusAudit: false,
      auditLoading: false,
      isAllAudit: false,
      exportLoading: false,
      editLoading: false,
      showEdit: false,
      showChild: false,
      safePassword: '',
      activeItem: {},
      editItem: {},
      childItem: {},
      tmpValue4SafeCheck: {}
    }
  },
  created() {
    this.init()
  },
  watch: {
    "$store.state.safePasswordCallbackPageEnd": function () {
      let page = this.$store.state.safePasswordCallbackPageEnd.split("_")[0]
      if (!this.$options.name || page !== this.$options.name) {
        return
      }
      this.safePassword = this.$store.state.safePassword
      if (
        this.tmpValue4SafeCheck.callback &&
        typeof this.tmpValue4SafeCheck.callback === "function"
      ) {
        this.tmpValue4SafeCheck.callback.apply(this, this.tmpValue4SafeCheck.args)
      }
      this.safePassword = ""
      this.tmpValue4SafeCheck = {}
    }
  },
  methods: {
    init() {
      this.getMbrOptions(options => {
        this.search.meta.splice(4, 1, { ...this.search.meta[4], options })
      })
      this.getMbrGroup(options => {
        this.search.meta.splice(1, 1, { ...this.search.meta[1], options })
      })
      this.search.keys.createTime = this.lastMonth()
      this.getTable()
    },
    lastMonth(date) {
      const dd = date ? new Date(date) : new Date()
      let month = dd.getMonth()  // 上一个月
      month = month < 1 ? 12 : month > 9 ? month : `0${month}`
      const str = `${dd.getFullYear()}-${month}`
      return str
    },
    handleTableSort(obj) {
      const { order, prop } = obj
      const orderObj = {
        ascending: 'asc',
        descending: 'desc'
      }
      this.params.orderBy = order ? `${prop} ${orderObj[order]}` : ``
      this.getTable()
    },
    handlGoChildNum(row) {
      this.showChild = true
      this.childItem = row
    },
    async handleEditMemo() {
      const { id } = this.editItem
      const { memo } = this.editForm
      const data = {
        _async_: true,
        id,
        memo
      }
      this.editLoading = true
      const [res] = await this.$axios.post(systemConfig.urls.bonusAuditEdit, data)
      this.editLoading = false
      if (res && res.code === 0) {
        this.showEdit = false
        this.getTable()
      }
    },
    async handleExport() {
      const { keys } = this.search
      const params = {
        _async_: true,
        ...this.params,
        ...keys
      }
      if (params.createTime) {
        params.createTime = this.lastMonth(params.createTime)
      }
      this.exportLoading = true
      const [res] = await this.$axios.get(systemConfig.urls.exportBonusAudit, params)
      this.exportLoading = false
      if (res && res.code === 0) {
        this.checkExportFile()
      }
    },
    async checkExportFile() {
      this.exportLoading = true
      const [res, err, response] = await this.$axios.get(systemConfig.urls.exportRebate, { _async_: true })
      if (res) {
        const obj = res.data || {}
        const { fileName, downloadFileName } = obj
        if (fileName) {
          this.exportLoading = false
          const { baseURL } = response.config
          // 下载文件
          const SToken = localStorage.getItem("SToken")
          window.open(
            baseURL +
            `/${systemConfig.urls.agentReport.downloadExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
          );
        } else {
          window.setTimeout(this.checkExportFile, 1000)
        }
      } else {
        this.exportLoading = false
      }
    },
    handleAllAudit() {
      this.isAllAudit = true
    },
    async handleAllComfirn(type) {
      if (!this.safePassword) {
        this.$store.commit("safePasswordShow", true)
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name)
        this.$set(this.tmpValue4SafeCheck, "callback", this.handleAllComfirn)
        this.$set(this.tmpValue4SafeCheck, "args", [type])
        return
      }
      const status = type === 'agree' ? 1 : 0
      const { keys } = this.search
      const data = {
        _async_: true,
        status,
        createTime: ''
      }
      if (keys.createTime) {
        data.createTime = this.lastMonth(keys.createTime)
      }
      this.auditLoading = true
      await this.$axios.post(systemConfig.urls.bonusAuditBatch, data, {
        headers: { securepwd: this.safePassword || null }
      })
      this.auditLoading = false
      this.isAllAudit = false
      this.getTable()
    },
    async handleComfirn(type) {
      const { id } = this.activeItem
      const status = type === 'agree' ? 1 : 0
      const data = {
        _async_: true,
        status,
        id
      }
      this.auditLoading = true
      const [res] = await this.$axios.post(systemConfig.urls.bonusAudit, data)
      this.auditLoading = false
      if (res && res.code === 0) {
        this.isBonusAudit = false
        this.getTable()
      }
    },
    handleSearch() {
      this.getTable()
    },
    async getTable() {
      this.getCurrentRecodeTime()
      const { keys } = this.search
      const params = {
        _async_: true,
        ...this.params,
        ...keys
      }
      if (params.createTime) {
        params.createTime = this.lastMonth(params.createTime)
      }
      this.loading = true
      const [res, ,reaAllData] = await this.$axios.get(systemConfig.urls.qryBonusList, params)
      this.getNetworkLoadAndDataSolveTime(reaAllData)
      this.loading = false
      if (res && res.code === 0) {
        const { list, totalCount } = res.page
        this.totalCount = totalCount
        this.tableData = list
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/{
  .status-fail {
    color: red;
  }
  .status-success {
    color: lawngreen;
  }
  .opt-check {
    display: inline-block;
    margin-right: 8px;
    color: #409EFF;
    cursor: pointer;
  }
  .opt-edit {
    cursor: pointer;
    color: #409EFF;
  }
}
.audit-box {
  > p{
    line-height: 32px;
  }
  .audit-label {
    display: inline-block;
    width: 90px;
    text-align: left;
  }
  .audit-val {
    display: inline-block;
    width: 70px;
    text-align: left;
  }
}
.all-audit {
  padding: 15px 0;
}
.edit-box {
  margin: 0 auto;
}
</style>
