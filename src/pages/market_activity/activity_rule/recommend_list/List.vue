<template>
  <div class="recommend-list-sheet activity-sheet">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('会员账号') }}</label>
          <el-input v-model="q.loginName" v-trim size="small" class="he-32"></el-input>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="q.groupId" :placeholder="$t('请选择')" size="small">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('收益统计时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="140" :startTime.sync="q.startTime" :endTime.sync="q.endTime" :selections="selections" />
        </div>
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('首存时间') }}</label>
          </div>
          <StartAndEndTimeSelector :left="110" ref="scTime" :startTime.sync="q.firstChargeStartTime" :endTime.sync="q.firstChargeEndTime" :selections="selections" />
        </div>
      </div>
      <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" size="small" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" size="small" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="pageNo"
      :tableLoading="loading"
      @reloadData="getList"
    />
  </div>
</template>

<script>
import systemConfig from '@/config/config'
import queryStore from '@/mixins/queryStore'
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector"

export default {
  name: 'RecommendList',
  mixins: [queryStore(['q'])],
  components: {
    StartAndEndTimeSelector,
  },
  data() {
    return {
      q: {
        startTime: null,
        endTime: null,
        groupId: null,
        loginName: null,
        firstChargeStartTime: null,
        firstChargeEndTime: null,
      },
      list: [],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      pageSizeArr: [5, 10, 20, 50, 100, 200],
      totalCount: 0,
      selections: [
        { label: this.$t('今日'), value: 'today' },
        { label: this.$t('昨日'), value: 'yesterday' },
        { label: this.$t('本周'), value: 'currentWeek' },
        { label: this.$t('本月'), value: 'currentMonth' },
      ],
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1) },
        { label: this.$t('会员账号'), prop: 'subLoginName' },
        { label: this.$t('会员组'), prop: 'groupName' },
        { label: this.$t('VIP等级'), render: (h, row, scope) => h('span', 'VIP' + scope.row.accountLevel) },
        { label: this.$t('首存时间'), prop: 'firstChargeTime' },
        { label: this.$t('首存金额'), prop: 'firstCharge' },
        { label: this.$t('累计存款'), prop: 'totalDeposit' },
        { label: this.$t('有效投注'), prop: 'validBet' },
      ],
      loading: false,
    }
  },
  created() {
    this.q.loginName = this.$route.params.loginName
    this.fnGroup()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$axios.get(systemConfig.urls.getRecommendList, {
        params: {
          ...this.q,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        if (res) {
          this.totalCount = res.data.page.totalCount
          this.pageNo = res.data.page.currPage
          this.tableData = res.data.page.list
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fnGroup() {
      this.list = []
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        resp.data.page.forEach((value) => {
          this.list.push({id: value.id, value: value.groupName})
        })
      })
    },
    reset() {
      this.q = {
        startTime: null,
        endTime: null,
        groupId: null,
        loginName: '',
        firstChargeStartTime: null,
        firstChargeEndTime: null,
      }
    },
    search() {
      this.pageNo = 1
      this.getList()
    },
  }
}
</script>
