<template>
  <div>
    <!-- 渠道列表 -->
    <TableSearchBar
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
    ></TableSearchBar>
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :table-loading="loading"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="params.pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="params.pageNo"
      @reloadData="getTableData"
      :showLoadTime="true"
	    :networkLoadTime="networkLoadTime"
	    :dataSolveTime="dataSolveTime"

    >
      <el-button type="primary" v-if="hasPermission('agent:channelLog:exportExcel')" @click="handleExport" :loading="exportLoading">{{ $t('导出') }}</el-button>
    </TableCom>
    <el-dialog :title="$t('查看渠道统计数据')" :visible.sync="showDetail">
      <TableSearchBar
        style="width: 100%"
        :currentPage.sync="detail.pageNo"
        :searchCriteria="detail.searchCriteria"
        @reloadData="getDetailData"
      >
        <StartAndEndTimeSelector slot="updateTime" :selections="(detail.searchCriteria.meta.find(i => i.slotName === 'updateTime') || {}).options" :startTime.sync="detail.searchCriteria.keys.startTime" :endTime.sync="detail.searchCriteria.keys.endTime"></StartAndEndTimeSelector>
      </TableSearchBar>
      <TableCom
        :hasAddBtn="false"
        :hasRemoveBtn="false"
        :table-loading="detail.loading"
        :tableData="detail.tableData"
        :totalCount="detail.totalCount"
        :pageSize.sync="detail.pageSize"
        :tableColumns="detail.tableColumns"
        :currentPage.sync="detail.pageNo"
        @reloadData="getDetailData"

      >
      </TableCom>
      <div slot="footer">
        <el-button @click="showDetail = false">{{ $t('返回') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import fileExport from "../../../mixins/fileExport";
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import Mixin from '@/mixins/loadTime'

export default {
  name: "List",
  mixins: [ Mixin, fileExport ],
  components: { StartAndEndTimeSelector },
  data() {
    const countNum = (val1, val2) => (val1 || 0) + (val2 || 0)
    const dealData = (data, key1, key2) => {
      const { _detail } = data
      return _detail ? `${_detail[key1]}、${_detail[key2]}` : `0、0`
    }
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      searchCriteria: {
        keys: {
          masterNum: null,
          name: null,
          groupId: null,
          isOpen: null,
        },
        meta: [
          { type: 'text',  label: this.$t('渠道编号'),  prop: 'masterNum' },
          { type: 'text',  label: this.$t('渠道名称'),  prop: 'name' },
          { type: 'select',  label: this.$t('渠道分组'),  prop: 'groupId', options: [] },
          { type: 'select',  label: this.$t('状态'),  prop: 'isOpen', options: [{ label: this.$t('全部'), value: null }, { label: this.$t('启用'), value: true }, { label: this.$t('禁用'), value: false }] },
        ]
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 50 },
        { label: this.$t('渠道编号'), prop: 'masterNum' },
        { label: this.$t('渠道名称'), prop: 'name' },
        { label: this.$t('渠道附号'), prop: 'viceNum' },
        { label: this.$t('渠道分组'), render: (h, row) => {
          const { groupId } = row
          const obj = this.groupList.find(i => i.id === groupId)
          return h('span', obj.name)
        } },
        { label: this.$t('总下载量(主+副)'), render: (h, row) => h('span', countNum(row.registerTotal, row.viceRegisterTotal)) },
        { label: this.$t('总虚拟号注册量(主+副)'), render: (h, row) => h('span', countNum(row.registerVirtualTotal, row.viceRegisterVirtualTotal)), width: 100 },
        { label: this.$t('虚拟器注册(主+副)'), render: (h, row) => h('span', countNum(row.registerEmulatorTotal, row.viceRegisterEmulatorTotal)) },
        { label: this.$t('总充值量'), render: (h, row) => h('span', countNum(row.rechargeTotal, row.viceRechargeTotal)) },
        { label: this.$t('扣量比例'), render: (h, row) => h('span', `${row.deductRate}%`) },
        { label: this.$t('状态'), render: (h, row) => h('span', { class: row.isOpen ? 'green' : 'red' }, row.isOpen ? this.$t('启用') : this.$t('禁用')) },
        { label: this.$t('操作'), render: (h, row) => h('span', { class: 'blue-color pointer', on: { click: () => this.handleShowDetail(row) } }, this.$t('查看')) },
      ],
      tableData: [],
      groupList: [],
      currentItem: {},
      detail: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        loading: false,
        searchCriteria: {
          keys: {
            masterNum: null,
            startTime: null,
            endTime: null
          },
          meta: [
            { type: 'text', label: this.$t('渠道编号'), prop: 'masterNum' },
            { label: this.$t('更新时间'), slotName: 'updateTime', options: [
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
              ] }
          ]
        },
        tableColumns: [
          { label: this.$t('总下载量(主+副)'), render: (h, row) => h('span', `${row.registerTotal}、${row.viceRegisterTotal}`) },
          { label: this.$t('总虚拟号注册量(主+副)'), render: (h, row) => h('span', `${row.registerVirtualTotal}、${row.viceRegisterVirtualTotal}`) },
          { label: this.$t('总模拟器注册量(主+副)'), render: (h, row) => h('span', `${row.registerEmulatorTotal}、${row.viceRegisterEmulatorTotal}`) },
          { label: this.$t('总充值额度(主+副)'), render: (h, row) => h('span', `${row.rechargeTotal}、${row.viceRechargeTotal}`) },
          { label: this.$t('下载量(主+副)'), render: (h, row) => h('span', dealData(row, 'registerTotal', 'viceRegisterTotal')) },
          { label: this.$t('虚拟号注册量(主+副)'), render: (h, row) => h('span', dealData(row, 'registerVirtualTotal', 'viceRegisterVirtualTotal')) },
          { label: this.$t('模拟器注册量(主+副)'), render: (h, row) => h('span', dealData(row, 'registerEmulatorTotal', 'viceRegisterEmulatorTotal')) },
          { label: this.$t('充值量'), render: (h, row) => h('span',dealData(row, 'rechargeTotal', 'viceRechargeTotal')) },
        ],
        tableData: []
      },
      loading: false,
      exportLoading: false,
      showDetail: false,
      totalCount: 0,
    }
  },
  created() {
    this.initTime()
    this.getGroup()
    this.getTableData()
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    initTime() {
      const date = new Date(+new Date() - 1000 * 60 * 60 * 24)
      const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      this.detail.searchCriteria.keys.startTime = `${str} 00:00:00`
      this.detail.searchCriteria.keys.endTime = `${str} 23:59:59`
    },
    async getDetailData(obj) {
      if (obj && obj.type === 'resetAndSearch') {
        this.initTime()
        this.detail.searchCriteria.keys.masterNum = this.currentItem.masterNum
      }
      const { pageNo, pageSize, searchCriteria } = this.detail
      const { masterNum, startTime, endTime } = searchCriteria.keys
      const url = this.$urls.channel.channellogList
      let tableData = []
      const params = {
        pageNo,
        pageSize,
        masterNum
      }
      this.detail.loading = true
      const { res } = await this.$axios.GET(url, params)
      if (res) {
        const { totalCount, list } = res.page
        this.detail.totalCount = totalCount
        tableData = list
      }
      const { res: res2 } = await this.$axios.GET(url, { ...params, startTime, endTime })
      this.detail.loading = false
      if (res2) {
        const { list } = res2.page
        if (list.length) {
          tableData = tableData.map(i => {
            const { id } = i
            const obj = list.find(i => i.id === id)
            if (obj) i._detail = obj
            return i
          })
        }
      }
      this.detail.tableData = tableData
    },
    handleShowDetail(row) {
      this.currentItem = row
      this.showDetail = true
      this.detail.pageNo = 1
      this.detail.searchCriteria.keys.masterNum = row.masterNum
      this.getDetailData()
    },
    async getGroup() {
      const params = {
        pageNo: 1,
        pageSize: 9999
      }
      const { res } = await this.$axios.GET(this.$urls.channel.channelgroup, params)
      if (res) {
        let { list } = res.page
        list = list.map(i => ({ ...i, label: i.name, value: i.id }))
        this.groupList = list
        this.searchCriteria.meta.find(i => i.prop === 'groupId').options = list
      }
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      const params = {
        ...this.params,
        ...this.searchCriteria.keys
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.channel.channellogList, params)
      const {res,response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        const { totalCount, list } = res.page
        this.totalCount = totalCount
        this.tableData = list
      }
    },
    async handleExport() {
      const params = {
        ...this.params,
        ...this.searchCriteria.keys
      }
      this.exportLoading = true
      const { res } = await this.$axios.GET(this.$urls.channel.channelExport, params)
      if (res) {
        await this.agentCheckFile('agyChannelLogModule')
      }
      this.exportLoading = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>
