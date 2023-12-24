<template>
  <div>
    <TableSearchBar :current-page.sync="params.pageNo" :searchCriteria.sync="search" :loading="loading" @reloadData="getTable" />
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <el-button type="text" @click="$emit('goList')">{{ $t('返利列表') }}</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, i) in breadList" :key="i">
          <el-button type="text" v-if="i < breadList.length - 1" @click="handleBread(i)">{{item.loginName}}</el-button>
          <span v-else class="bread-text">{{item.loginName}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableLoading="loading"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :totalCount="totalCount"
      @sort="handleTableSort"
      @reloadData="getTable"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    />
  </div>
</template>

<script>
import RebateMixins from "./RebateMixins";
import TableCom from "../../../components/TableCom";
import systemConfig from "../../../config/config";
import Mixin from '@/mixins/loadTime'


export default {
  name: "RebateChild",
  mixins: [Mixin, RebateMixins],
  components:{
    TableCom
  },
  props: {
    data: Object
  },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1,
        orderBy: ''
      },
      search: {
        keys: {},
        meta: [
          { label: this.$t('会员组'), type: 'select', prop: 'groupId', options: [] },
          { label: this.$t('会员名'), type: 'text', prop: 'loginName' },
          { label: this.$t('代理会员级别'), type: 'select', prop: 'agyLevelId', options: [] },
        ]
      },
      breadList: [],
      tableData: [],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('会员名'), prop: 'loginName', render: (h, row) => {
          const len = this.breadList.length
          const bool = len < 6
          return h(bool ? 'el-button' : 'span', { attrs: { type: 'text' }, on: { click: () => {
            bool && this.handlGoChild(row)
          } } }, row.loginName)
        } },
        { label: this.$t('会员组'), prop: 'groupName', width: 100 },
        { label: this.$t('代理会员级别'), width: 110, render: (h, row) => {
            const { agyLevelId } = row
            const { options } = this.search.meta[2]
            const obj = options.find(i => i.value === agyLevelId)
            return h('span', obj ? obj.label : '')
          } },
        { label: this.$t('下级人数'), prop: 'childNum' },
        { label: this.$t('会员身份'), render(h, row) {
          const { agyflag } = row
          const obj = { 0: this.$t('普通会员'), 1: this.$t('代理会员') }
          return h('span', obj[agyflag])
        } },
        { label: this.$t('累积实际有效输赢'), prop: 'validPayoutFromChild', sortable: 'custom' },
        { label: this.$t('提成比例'), render: (h, row) => h('span', `${row.commissionRatioSub ? `${row.commissionRatioSub}%` : 0}`) },
        { label: this.$t('佣金初算'), prop: 'rebateFromChild' },
        { label: this.$t('下级实得佣金合计'), prop: 'rebateChildTotal' },
        { label: this.$t('自身实得佣金'), prop: 'rebateFromChildActual' },
        { label: this.$t('奖金'), prop: 'bonusAmountExfromChildTotal', sortable: 'custom' },
        { label: this.$t('自身有效输赢'), prop: 'validPayoutForSelf', sortable: 'custom' },
        { label: this.$t('自身有效输赢提成比例'), render: (h, row) => h('span', `${row.commissionRatio ? `${row.commissionRatio}%` : 0}`) },
        { label: this.$t('自身佣金'), prop: 'rebate' },
        { label: this.$t('实发总额'), prop: 'rebateTotal' },
      ],
      loading: false,
      totalCount: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getMbrOptions(options => {
        this.search.meta.splice(2, 1, { ...this.search.meta[2], options })
      })
      this.getMbrGroup(options => {
        this.search.meta.splice(0, 1, { ...this.search.meta[0], options })
      })
      this.getTable()
      this.breadList.push(this.data)
    },
    handleBread(i) {
      const arr = this.breadList.slice(0, i + 1)
      this.breadList = arr
      this.getTable()
    },
    handlGoChild(row) {
      this.breadList.push(row)
      this.getTable()
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
    async getTable() {
      this.getCurrentRecodeTime()
      const { keys } = this.search
      const { orderBy, ..._params } = this.params
      const { accountId } = this.breadList[this.breadList.length - 1] || this.data
      const params = {
        _async_: true,
        parentId: accountId,
        createTime: this.dealTime(this.data.createTime, 'YYYY-MM-DD'),
        ..._params,
        ...keys
      }
      this.loading = true
      const [res, , resAllData] = await this.$axios.get(`${systemConfig.urls.getChildBonusList}?orderBy=${orderBy}`, params)
      this.getNetworkLoadAndDataSolveTime(resAllData)
      this.loading = false
      if (res && res.code === 0) {
        const { totalCount, list } = res.page
        this.totalCount = totalCount
        this.tableData = list
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-box {
  margin: 20px 0;
}
.bread-text {
  display: inline-block;
  padding: 9px;
}
/deep/ .table-operation-btns-wrapper {
  padding: 0;
}
</style>
