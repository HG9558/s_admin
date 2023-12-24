<template>
<!-- 会员管理 - 风控信息 -->
  <div class="wind-box">
    <div class="search" style="display: flex;justify-content: space-between">
      <div class="search-basic">
        <div class="search-basic-item width180" v-for="(item, i) in queryList" :key="i">
          <label>{{item.label}}</label>
          <input type="text" v-model="q[item.prop]" v-trim @keyup.enter="search()" :placeholder="$t('请输入')" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="q.groupIdList" multiple>
            <el-option v-for="item in listgroup" :key="item.value" :label='item.groupName' :value='item.id'></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('注册时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="110" :startTime.sync="q.registerTime" :endTime.sync="q.registerTimeEnd" :selections="selections" />
        </div>
      </div>
      <div style="width: 200px;text-align: right;display: flex;align-items: flex-end;padding-bottom: 12px;">
        <el-button type="primary" @click.native="search()" :loading="loading" size="small">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reload()" size="small">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table max-height="550px" v-loading='loading' :data="tableData.list" border>
        <el-table-column align="center" v-for="(item, i) in clomns" :key="i" v-bind="item">
          <template slot-scope="scope">
            <div v-if="item.prop === 'loginName'">
              <span class="color-blue" @click="handleAccount(scope.row)">{{scope.row[item.prop]}}</span>
            </div>
            <span v-else-if="item.prop === 'id'">{{scope.$index + 1}}</span>
            <div v-else-if="item.prop === 'available'">
              {{{0: $t('禁用'), 1: $t('启用'), 2: $t('余额冻结')}[scope.row[item.prop]] || ''}}
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pagination">
        <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="params.pageNo" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount">
        </el-pagination>
      </div>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../config/config"
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector"
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  name: "MemberWind",
  components: {
    StartAndEndTimeSelector
  },
  mixins: [Mixin],
  data() {
    return {
      q: {
        groupIdList: [],
        loginName: '',
        agyAccount: '',
        realName: '',
        registerIp: '',
        loginIp: '',
        registerTime: '',
        registerTimeEnd: ''
      },
      params: {
        pageSize: 10,
        pageNo: 1
      },
      queryList: [
        { label: this.$t('会员账号'), prop: 'loginName' },
        { label: this.$t('上级代理账号'), prop: 'agyAccount' },
        { label: this.$t('真实姓名'), prop: 'realName' },
        // { label: '注册设备', prop: 'registerSource' },
        { label: this.$t('注册IP'), prop: 'registerIp' },
        { label: this.$t('登录IP'), prop: 'loginIp' }
      ],
      listgroup: [],
      selections: [
        { label: this.$t('本月'), value: 'currentMonth' },
        { label: this.$t('上个月'), value: 'lastMonth' },
        { label: this.$t('近三个月'), value: 'lastThreeMonths' }
      ],
      tableData: {
        totalCount: 0,
        list: []
      },
      loading: false,
      clomns: [
        { label: this.$t('序号'), prop: 'id', width: 70 },
        { label: this.$t('会员账户'), prop: 'loginName' },
        { label: this.$t('上级代理'), prop: 'agyAccount' },
        { label: this.$t('代理备注'), prop: 'agyMemo' },
        { label: this.$t('真实姓名'), prop: 'realName' },
        { label: this.$t('会员组'), prop: 'groupName' },
        { label: this.$t('注册时间'), prop: 'registerTime', width: 160 },
        { label: this.$t('最后登录时间'), prop: 'loginTime', width: 160 },
        { label: this.$t('状态'), prop: 'available' },
      ]
    }
  },
  created() {
    this.init()
    this.getTableList()
  },
  computed: {
    ...mapGetters(['hasPermission'])
  },
  methods: {
    handleAccount(item) {
      if (!this.hasPermission('member:wind:memoInfo')) {
        return this.$message.warning(this.$t('无权访问'))
      }
      const { id: accountId, loginName } = item
      this.$router.push({
        path: '/main/memberManage/memolist',
        query: {
          accountId,
          loginName
        }
      })
    },
    setRegisterTime() {
      const [from] = systemConfig.getPreviousThreeMonth()
      const to = systemConfig.getCurrentMonth()[1]
      this.q.registerTime = `${from} 00:00:00`
      this.q.registerTimeEnd = `${to} 23:59:59`
    },
    handleCurrentChange(val) {
      this.params.pageNo = val
      this.getTableList()
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableList()
    },
    search() {
      this.params.pageNo = 1
      this.getTableList()
    },
    reload() {
      const q = {}
      for (let key in this.q) {
        const val = this.q[key]
        if (typeof val === 'string') {
          q[key] = ''
        }
        if (Array.isArray(val)) {
          q[key] = []
        }
      }
      this.q = q
    },
    async getTableList() {
      const { groupIdList, ...q } = this.q
      this.getCurrentRecodeTime()
      const params = {
        _async_: true,
        groupIdList: groupIdList.join(),
        ...q,
        ...this.params
      }
      this.loading = true
      const [res, ,response] = await this.$axios.get(systemConfig.urls.windMbrList, params)
      this.loading = false
      this.getNetworkLoadAndDataSolveTime(response)
      if (res && res.code === 0) {
        this.tableData = res.page
      }
    },
    getGroup() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((res) => {
        this.listgroup = res.data.page
      })
    },
    init() {
      this.getGroup()
      this.setRegisterTime()
      // this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  margin-top: 30px;
}
.color-blue {
  color: #409EFF;
  cursor: pointer;
}
.search-basic-item {
  margin-top: 6px;
  input::placeholder {
    color: #ccc;
  }
}
/deep/ .el-table td {
  padding: 10px 0 !important;
}
</style>
