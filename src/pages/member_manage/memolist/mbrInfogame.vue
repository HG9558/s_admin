<template>
  <div>
    <div class="balance-box">
      <span class="label-b">{{ $t('主账户余额') }}</span>
      <span>{{totalBalance || 0}}</span>
      <span class="refresh" @click="handleRefresh">{{ $t('刷新') }}</span>
    </div>
    <WindTable :table="{ data: tableData.list }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
  </div>
</template>

<script>
import WindTable from "./WindTable";
import systemConfig from "../../../config/config";
export default {
  name: "mbrInfogame",
  props: ['accountId'],
  components: {
    WindTable
  },
  data() {
    return {
      tableData: {
        list: [],
        totalCount: 0
      },
      params: {
        pageSize: 10,
        pageNo: 1
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 90 },
        { label: this.$t('游戏平台'), prop: 'platform' },
        { label: this.$t('余额'), render: (h, row, scope) => {
            return h('div', [
              h('span', { class: 'refresh', on: { click: () => this.handleRefreshRow(row, scope) } }, this.$t('刷新')),
              h('span', row.balance)
            ])
          }, width: 120 },
        { label: this.$t('游戏账号'), prop: 'player' },
      ],
      totalBalance: 0,
      loading: false
    }
  },
  created() {
    this.getTotalBalance()
    this.getList()
  },
  methods: {
    handleSize(val) {
      this.params.pagesize = val
      this.getList()
    },
    handlePage(val) {
      this.params.pageNo = val
      this.getList()
    },
    async handleRefreshRow({ platformId }, { $index }) {
      // windFlushBalance
      const params = {
        _async_: true,
        accountId: this.accountId,
        platformId
      }
      const replaceBalance = newVal => this.tableData.list.splice($index, 1, { ...this.tableData.list[$index], balance: newVal })
      replaceBalance('加载中...')
      const [res] = await this.$axios.get(systemConfig.urls.windFlushBalance, params)
      replaceBalance(0)
      if (res && res.code === 0) {
        replaceBalance(res.data)
      }
    },
    handleRefresh() {
      this.getTotalBalance()
    },
    async getList() {
      const params = {
        _async_: true,
        accountId: this.accountId,
        ...this.params
      }
      this.loading = true
      const [res] = await this.$axios.get(systemConfig.urls.windDepotBalance, params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.data
      }
    },
    async getTotalBalance() {
      const params = {
        _async_: true,
        accountId: this.accountId
      }
      this.totalBalance = this.$t('加载中') + '...'
      const [res] = await this.$axios.get(systemConfig.urls.windMbrInfogame, params)
      this.totalBalance = 0
      if (res && res.code === 0) {
        this.totalBalance = res.totalBalance
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.balance-box {
  margin: 15px 20px 30px;
  .label-b {
    display: inline-block;
    margin-right: 15px;
    font-size: 14px;
    font-weight: 600;
  }
}
.refresh, /deep/ .refresh {
  display: inline-block;
  margin: 0 5px;
  color: #3f99f7;
  cursor: pointer;
}
</style>
