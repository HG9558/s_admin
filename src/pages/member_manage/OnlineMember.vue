<template>
  <div class="company-deposit-setting">
      <div class="search">
      <div style="display: flex; justify-content: space-between">
        <div class="search-basic ui-fix">
          <div class="search-basic-item width180">
            <label>{{ $t('会员名') }}</label>
            <el-input v-model="q.loginName" v-trim size="small" class="he-32" @keyup.enter.native="query()"></el-input>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('所属总代') }}</label>
            <el-select size="small" v-model="q.tagencyId" @change="getAgyAccount(q.tagencyId)" :placeholder="$t('请选择')" multiple filterable clearable>
              <el-option v-for="item in topAgyAccountOptions" :key="item.value" :label='item.agyAccount'
                         :value='item.id'>{{item.agyAccount}}<GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" /></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('所属代理') }}</label>
            <el-select size="small" v-model="q.cagencyId" :placeholder="$t('请选择')" multiple filterable clearable>
              <el-option v-for="item in agyAccountOptions" :key="item.value" :label='item.agyAccount'
                         :value='item.id'>{{item.agyAccount}}<GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" /></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('会员组') }}</label>
            <el-select size="small" v-model="q.groupId" :placeholder="$t('请选择')" multiple>
              <el-option v-for="item in list" :label='item.value' :key="item.id" :value='item.id'></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('客户端') }}</label>
            <el-select size="small" v-model="q.loginSource" :placeholder="$t('请选择')" multiple>
              <el-option label="PC" value="0"></el-option>
              <el-option label="H5" value="3"></el-option>
            </el-select>
          </div>
          <div class="search-basic-item">
            <label>{{ $t('时间') }}</label>
            <StartAndEndTimeSelector
              type="date"
              ref="searchTime"
              :left="40"
              :startTime.sync="q.startTime"
              :endTime.sync="q.endTime"
              :defaultTypeP="defaulttypep"
            />
          </div>
        </div>
        <div style="padding-bottom: 12px;display: flex; align-items: flex-end;">
          <el-button type="primary" @click.native="query()" size="small">{{ $t('查询') }}</el-button>
          <el-button type="danger" @click.native="reload()" size="small">{{ $t('重置') }}</el-button>
        </div>
      </div>

    </div>
    <!-- <div class="export-div">
      <div class="el-button-div">
        <el-button class="iconfont icon-export el-button-export ">导出报表</el-button>
      </div>
    </div> -->
    <div style="height: 10px"></div>
    <el-table max-height="480" type="flex" :data="tableData.list" @sort-change="sortevt" v-loading='loading' border>
      <el-table-column label-class-name="heightThe" type="index" width="45px" :label="$t('序号')" :index="indexMethod" align="center"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="loginName" :label="$t('会员名')" align="center" width="100">
        <template slot-scope="scope">
          <router-link :to="{ path: '/main/memberManage/memberDetail',query:{id:scope.row.id,loginName:scope.row.loginName} }" tag="a">
            {{scope.row.loginName}}
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label-class-name="heightThe" prop="groupName" :label="$t('会员组')" align="center" width="100"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="agyAccount" :label="$t('所属代理')" align="center" width="100">
        <template slot-scope="scope">
          {{scope.row.agyAccount}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column label-class-name="heightThe" prop="totalBalance" :label="$t('总余额')" align="center" width="50"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="loginTime" width="150" :formatter="timeFilter" :label="$t('本次登录时间')" align="center">
        <template slot-scope="scope" v-if="scope.row.loginTime">
          {{scope.row.loginTime.slice(0,scope.row.loginTime.length-3)}}
        </template>
      </el-table-column>
      <el-table-column label-class-name="heightThe" prop="loginIp" width="120" :label="$t('本次登录IP')" align="center"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="loginArea" :label="$t('本次区域')" align="center" width="100"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="loginUrl" width="140" :label="$t('本次登入线路')" align="center"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="selectOnlineTimeStr" :label="$t('在线时长')" align="center" width="120"></el-table-column>
      <el-table-column label-class-name="heightThe" prop="onlineTimeStr" :label="$t('累计在线时长')" align="center" width="120"></el-table-column>
      <el-table-column label-class-name="heightThe" :label="$t('操作')" align="center" width="150">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: space-around">
            <span class="blue-color pointer" @click="fnlogLoginAccountNameInit(scope.row.loginName)">{{ $t('记录') }}</span>
            <span class="blue-color pointer" v-if="hasPermission('member:mbraccount:kickLine')"  @click="fnkickLine(scope.row.id)">{{ $t('踢线') }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listReq.pageNo"
                     :page-sizes="listReq.pageSizeArr"
                     :page-size="listReq.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.totalCount">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog class="wd100-set" :title="$t('会员登录信息')" :visible.sync="loginrecordShow">
      <el-table max-height="480" type="flex" :data="logintablelist" border fit highlight-current-row>
        <el-table-column label-class-name="heightThe" type="index" width="60" :label="$t('序号')" align="center"
                         :index="indexMethod"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginName" align="center" :label="$t('会员名')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginTime" align="center" :foamatter="timeFilter" sortable
                         :label="$t('登陆时间')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginIp" align="center" :label="$t('登陆IP')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginArea" align="center" :label="$t('登录区域')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginUrl" align="center" :label="$t('登录网址')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="onlineTimeStr" align="center" sortable :label="$t('在线时长')"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleLoginSizeChange"
          @current-change="handleLoginCurrentChange"
          :current-page="dialogListReq.pageNo"
          :page-sizes="dialogListReq.pageSizeArr"
          :page-size="dialogListReq.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logRecordTotal">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import systemConfig from '../../config/config'
  import queryStore from '../../mixins/queryStore'
  import {mapGetters} from 'vuex'
  import _ from 'lodash'
  import Mixin from '@/mixins/loadTime'

  export default {
    name: 'onlineMember',
    mixins: [queryStore(['q']), Mixin],
    data() {
      return {
        accountName: '',
        list: [],
        loginrecordShow: false,
        tableData: {},
        q: {tagencyId: [], cagencyId: [], groupId: [], loginSource: [],startTime:systemConfig.getToday(),endTime:systemConfig.getToday()},
        listTagent: [],
        logintablelist: [],
        topAgyAccountOptions: [],
        agyAccountOptions: [],
        trueAgyAccountOptions: [],
        listCagent: [],
        logRecordTotal: 0,
        accountId: '',
        postData: [],
        dialogListReq: {},
        defaulttypep: 'today'
      }
    },
    created() {
      this.dialogListReq = _.cloneDeep(this.listReq)
      this.fnGroup()
      this.getAgyAccount([])
      this.getChildAgent()
      this.getList()

    },
    mounted() {

    },
    computed: {
      ...mapGetters(['hasPermission']),
      loading() {
        return this.$store.state.searchLoading
      },
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      sortevt(orders) {
        if (orders.order === 'ascending') {
          this.q.orderBy = orders.prop + ' asc'
        } else {
          this.q.orderBy = orders.prop + ' desc'
        }
        this.getList()
      },
      fnGroup() {
        this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
          resp.data.page.forEach((value) => {
            this.list.push({id: value.id, value: value.groupName})
          })
        })
      },
      getChildAgent() {
        this.$axios.get(systemConfig.urls.getAllChildAgentIncludeDisable).then((resp) => {
          this.agyAccountOptions = resp.data.accounts
          this.trueAgyAccountOptions = resp.data.accounts
        })
      },
      getAgyAccount(id) {
        if (id.length > 0) {
          this.agyAccountOptions = []
          this.q.cagencyId = []
          Promise.all(
            id.map((i) => (
              this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable, {
                params: {
                  parentId: i,
                },
              })
            ))
          )
            .then((res) => {
              this.agyAccountOptions = res.reduce((prev, curr) => {
                prev.push(...curr.data.accounts)
                return prev
              }, [])
            })
        } else {
          this.agyAccountOptions = this.trueAgyAccountOptions
          this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable + '?parentId=').then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts
          })
        }
      },
      loginTimekeys(command) {
        switch (command) {
          case 'today':
            this.$data.q.loginTime = systemConfig.getToday() + ' ' + '00:00:00'
            this.$data.q.loginTimeEnd = systemConfig.getToday() + ' ' + '23:59:59'
            break
          case 'yesterday':
            this.q.loginTime = systemConfig.getYesterday() + ' ' + '00:00:00'
            this.q.loginTimeEnd = systemConfig.getYesterday() + ' ' + '23:59:59'
            break
          case 'beforeYesterday':
            this.q.loginTime = systemConfig.getBeforeYesterday() + ' ' + '00:00:00'
            this.q.loginTimeEnd = systemConfig.getBeforeYesterday() + ' ' + '23:59:59'
            break
          case 'currentWeek':
            this.q.loginTime = systemConfig.getCurrentWeek()[0] + ' ' + '00:00:00'
            this.q.loginTimeEnd = systemConfig.getCurrentWeek()[1] + ' ' + '23:59:59'
            break
          case 'previousWeek':
            this.q.loginTime = systemConfig.getPreviousWeek()[0] + ' ' + '00:00:00'
            this.q.loginTimeEnd = systemConfig.getPreviousWeek()[1] + ' ' + '23:59:59'
            break
          default:
            this.q.loginTime = systemConfig.getToday() + ' ' + '00:00:00'
            this.q.loginTimeEnd = systemConfig.getToday() + ' ' + '23:59:59'
            break
        }
        this.getList()
      },
      handleSizeChange(val) {
        this.listReq.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listReq.pageNo = val
        this.getList()
      },
      fnkickLine(id) {
        this.$axios.post('bkapi/member/mbraccount/kickLine', {id: id}).then((res) => {
          this.getList()
        })
      },
      timeFilter(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        return systemConfig.transferTimeByType(date, this.timeType)
      },
      handleLoginSizeChange(val) {
        this.dialogListReq.pageNo = 1
        this.dialogListReq.pageSize = val
        this.fnlogLoginAccountName(this.accountName)
      },
      handleLoginCurrentChange(val, id) {
        this.dialogListReq.pageNo = val
        this.fnlogLoginAccountName(this.accountName)
      },
      fnlogLoginAccount(id) {
        this.loginrecordShow = true
        this.accountId = id
        let query = '?pageSize=' + this.$store.state.listReq.pageSize + '&pageNo=' + this.$store.state.listReq.pageNo
        this.$axios.get(systemConfig.urls.logLoginRecord + query).then((res) => {
          this.logintablelist = res.data.page.list
          this.logRecordTotal = res.data.page.totalCount
        })
      },
      fnlogLoginAccountNameInit(name) {
        this.dialogListReq.pageNo = 1
        this.dialogListReq.pageSize = 10
        this.accountName = name
        this.fnlogLoginAccountName(name)
      },

      fnlogLoginAccountName(name) {
        this.loginrecordShow = true
        let query = '?pageSize=' + this.dialogListReq.pageSize + '&pageNo=' + this.dialogListReq.pageNo + '&loginName=' + name
        this.$axios.get(systemConfig.urls.logLoginRecord + query).then((res) => {
          this.logintablelist = res.data.page.list
          this.logRecordTotal = res.data.page.totalCount
        })
      },
      query() {
        this.getList()
      },
      reload() {
        this.q = {tagencyId: [], cagencyId: [], groupId: [], loginSource: [],startTime: '',endTime: ''}
        this.$refs.searchTime.defaultType = ''
        this.defaulttypep = ''
      },
      getList() {
        this.$store.state.searchLoading = true
        this.postData = []
        this.getCurrentRecodeTime()
        Object.keys(this.q).forEach(key => {
          if (this.q[key].length > 0) {
            if (Array.isArray(this.q[key])) {
              this.postData[key + 'List'] = this.q[key].join(',')
            } else {
              this.postData[key] = this.q[key]
              if(key==='startTime'){
                this.postData.startTime += ' 00:00:00'
              }
              if(key==='endTime'){
                this.postData.endTime += ' 23:59:59'
              }
            }
          } else {
            this.postData[key] = ''
          }
        })
        let data = Object.assign({
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo
        }, this.postData)
        this.$axios.get('bkapi/member/mbraccount/listOnline', {
          params: data
        }).then((res) => {
          this.tableData = res.data.page
          this.getNetworkLoadAndDataSolveTime(res)
        })
      }
    }
  }
</script>
<style scoped lang="scss">
/deep/ {
  .el-table__body {
    min-width: 100%;
  }
  .el-table__header {
    width: 100% !important;
  }
}
</style>
