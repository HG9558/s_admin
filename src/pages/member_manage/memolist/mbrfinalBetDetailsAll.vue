<template>
  <div>
    <WindSearch :searchForm.sync="searchForm" :searchList="searchList" :loading="loading" @onSubmit="search" @onReset="onReset" />
    <WindTable :table="{ data: tableData.list.slice(0, -2) }" :loading="loading" :columns="tableColumns" :size.sync="params.pageSize" :page.sync="params.pageNo" :total="tableData.totalCount" @size="handleSize" @page="handlePage" />
  </div>
</template>

<script>
import systemConfig from "../../../config/config";
import WindMixins from "./WindMixins";

export default {
  name: "mbrfinalBetDetailsAll",
  props: ['accountId'],
  mixins: [WindMixins],
  data() {
    return {
      tableColumns: [
        { label: this.$t('序号'), render(h, row, scope) {
            return h('span', scope.$index + 1)
          } },
        { label: this.$t('注单号'), prop: 'id', width: 150 },
        { label: this.$t('游戏平台'), render(h, row) {
            const { platform, gameType } = row
            return h('span', `${platform}${gameType}`)
          } },
        { label: this.$t('投注金额'), prop: 'bet' },
        { label: this.$t('有效投注'), prop: 'validBet' },
        { label: this.$t('输赢'), prop: 'result' },
        { label: this.$t('赔率'), prop: 'odds', width: 130 },
        { label: this.$t('投注时间'), prop: 'betTime', width: 140 },
        { label: this.$t('投注详情'), prop: 'betType' },
        { label: this.$t('开奖结果'), prop: 'resultOpen' },
        { label: this.$t('结算状态'), prop: 'status' },
      ],
      searchList: [
        { type: 'select', prop: 'platform', formItem: { label: this.$t('游戏平台') }, attrs: { placeholder: this.$t('请输入') }, options: [] },
        { type: 'text', prop: 'betid', formItem: { label: this.$t('注单号') }, attrs: { placeholder: this.$t('请输入') } },
        { type: 'time', prop: ['betStrTime', 'betEndTime'], formItem: { label: this.$t('下注时间') } }
      ],
      searchForm: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      options: []
    }
  },
  created() {
    this.setRegisterTime()
    this.getOptions()
  },
  methods: {
    setRegisterTime() {
      const [from] = systemConfig.getPreviousThreeMonth()
      const to = systemConfig.getCurrentMonth()[1]
      this.searchForm.betStrTime = from
      this.searchForm.betEndTime = to
    },
    async getList() {
      const { betStrTime, betEndTime, ..._data } = this.searchForm
      const { loginName } = this.$route.query
      if (+new Date(betEndTime) < +new Date(betStrTime)) {
        return this.$message.warning(this.$t('开始时间不能大于结束时间'))
      }
      let params = {
        _async_: true,
        accountId: this.accountId,
        loginName,
        ...this.params
      }
      if (_data.betid) {
        params.betid = _data.betid
      } else {
        params = {
          ...params,
          ..._data,
        }
      }
      this.loading = true
      const [res] = await this.$axios.get(this.transFormUrl(systemConfig.urls.windMbrfinalBetDetailsAll, { betStrTime: [betStrTime, 'start'], betEndTime: [betEndTime] }), params)
      this.loading = false
      if (res && res.code === 0) {
        this.tableData = res.page
      }
    },
    async getOptions() {
      const params = {
        _async_: true,
        codetype: ''
      }
      const [res] = await this.$axios.get(systemConfig.urls.getPlatform, params)
      if (res && res.code === 0) {
        const options = res.page.map(i => ({ ...i, label: i.value, value: i.id }))
        options.unshift({ label: this.$t('全部'), value: '' })
        this.searchList.splice(0, 1, { ...this.searchList[0], options })
      }
    }
  }
}
</script>

<style scoped>

</style>
