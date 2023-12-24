<template>
  <div class="company-deposit" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input type="text" v-model="accountName"/>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('总代') }}</label>
          <el-select v-model="topAgyAccountValue" :placeholder="$t('请选择')" @change="getAgyAccount" multiple>
            <el-option
              v-for="item in topAgyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理') }}</label>
          <el-select v-model="agyAccountValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in agyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="groupValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('存款渠道') }}</label>
          <el-select v-model="depositValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in depositOptions"
              :key="item.id"
              :label="item.depositType"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="search-extend" v-show="showExtend">
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select v-model="statusValue" :placeholder="$t('请选择')" @change="selectStatusChange" multiple>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('客户端') }}</label>
          <el-select v-model="devSource" :placeholder="$t('请选择')" multiple>
            <el-option label="PC" value="0"></el-option>
            <el-option label="H5" value="3"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width200">
          <label>{{ $t('存款时间') }}</label>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="startTime"
            type="datetime"
            @change="pickTime1"
            :placeholder="$t('选择日期时间')">
          </el-date-picker>
        </div>
        <div class="search-basic-item width200">
          <label></label>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="endTime"
            type="datetime"
            @change="pickTime2"
            :placeholder="$t('选择日期时间')">
          </el-date-picker>
        </div>
        <div class="search-basic-item">
          <label></label>
          <el-dropdown @command="handleCommand">
            <el-button size="small">
              {{ $t('快选') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="today">{{ $t('今天') }}</el-dropdown-item>
              <el-dropdown-item command="yesterday">{{ $t('昨天') }}</el-dropdown-item>
              <el-dropdown-item command="beforeYesterday">{{ $t('前天') }}</el-dropdown-item>
              <el-dropdown-item command="currentWeek">{{ $t('本周') }}</el-dropdown-item>
              <el-dropdown-item command="previousWeek">{{ $t('上周') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
       <div class="div-search-btn">
            <el-button type="primary" @click.native="search()">{{ $t('查询') }}</el-button>
              <el-button type="danger" @click.native="reset()">{{ $t('重置') }}</el-button>
          </div>
          <div class="more-condition">
            <span @click="more">{{extendTitle}}{{ $t('查询') }}<i :class="[this.showExtend ? 'is-reverse': '']" class="icon-more el-select__caret el-input__icon el-icon-arrow-up"></i></span>
          </div> 
    </div>
    <div class="export-div">
      <div class="span-money">
        <span>{{ $t('今日存款') }}: </span><span>{{allTodayDeposit}}</span>
      </div>
      <!-- <el-button  class="iconfont icon-export el-button-export">导出报表</el-button> -->
    </div>
    <div class="search-form">
      <el-table max-height="480"
        :data="tableData"
        v-loading='loading'
        border
        style="width: 100%">
        <el-table-column
          :label="$t('序号')"
          type="index"
          :index="indexMethod">
        </el-table-column>
        <el-table-column  :label="$t('订单号')"  width="160">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNoText}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          :label="$t('会员名')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="groupName"
          :label="$t('会员组')">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="timeFilter"
          :label="$t('存款时间')"
          width="140">
        </el-table-column>
        <el-table-column
          prop="depositUser"
          :label="$t('存款人姓名')">
        </el-table-column>
        <el-table-column
          prop="depositAmount"
          :label="$t('存款金额')">
        </el-table-column>
        <el-table-column
          prop="depositPostscript"
          :label="$t('存款附言')">
        </el-table-column>
        <el-table-column
          prop="depositType"
          :label="$t('存款渠道')">
        </el-table-column>
        <el-table-column
          :label="$t('来源')">
          <template slot-scope="scope">
            {{returnStatus(scope.row.fundSource)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          :label="$t('存款IP')">
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('状态')"
          :filters="filterArr"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
             <el-tag
              :type="scope.row.status === 1 ? 'success' : (scope.row.status === 2 ? 'primary':'danger')"
              close-transition>{{statusTextFilter(scope.row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditUser"
          :label="$t('审核人')">
        </el-table-column>
        <el-table-column
          prop="auditTime"
          :formatter="timeFilter"
          :label="$t('审核时间')"
          width="160">
        </el-table-column>
        <el-table-column
          prop="memo"
          :label="$t('备注')">
          <template slot-scope="scope">{{spliceStr(scope.row.memo)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listReq.pageNo"
        :page-sizes="listReq.pageSizeArr"
        :page-size="listReq.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- <div class="detail" v-show="detailShow">
      <div class="detail-header">
        <span>审核详情</span><span class="header-close iconfont icon-close" @click="closeDetail()"></span>
      </div>
      <div class="detail-box">
        <div class="detail-item">
          <span class="right">订单号：</span><span id="onlineOrderNo" class="left">{{rowData.orderPrefix}}{{rowData.orderNo}}</span>
          <span class="clip iconfont icon-copy" data-clipboard-target="#onlineOrderNo"></span>
          <span class="copied" v-show="copied">copied</span>
        </div>
        <div class="detail-item">
          <span class="right">会员名：</span><span class="left">{{rowData.loginName}}({{rowData.groupName}})</span>
           <el-button style="position: absolute;top: -8px" type="text" size="small" @click.native="checkAllOrder(rowData.loginName)">[查看所有订单]</el-button>
        </div>
        <div class="detail-item">
          <span class="right">收款账号：</span><span class="left">{{rowData.depositType}}_{{rowData.realName}}</span>
        </div>
        <div class="detail-item">
          <span class="right">存款金额：</span><span class="left">{{rowData.depositAmount}}</span>
          <div style="position: absolute;top: 0;right: 200px"><span style="margin-right:20px">{{rowData.isPayment === true? '已支付': '未支付'}}</span><span>已支付{{rowData.depositCount}}次</span>
          </div>
        </div>
        <div class="detail-item">
          <span class="right">手续费：</span><span class="left">{{rowData.handlingCharge}}</span>
        </div>
        <div class="detail-item">
          <span class="right">优惠金额：</span><span class="left">{{rowData.discountAmount}}</span>
        </div>
        <div class="detail-item">
          <span class="right">实际到帐：</span><span class="left">{{rowData.actualArrival}}</span>
        </div>
        <div class="detail-item">
          <span class="right">审核状态 ：</span><span class="left">{{statusTextFilter(rowData.status)}}</span>
        </div>
        <div class="detail-item">
          <span class="right">备注：</span><el-input class="left" type="textarea" v-model="memo" :maxlength="400"></el-input>
        </div>
        <div class="btn" v-if="rowData.status === 2">
          <el-button type="primary" @click.native="changeStatus(1, rowData.id)">成功</el-button>
          <el-button type="danger" @click.native="changeStatus(0, rowData.id)">失败</el-button>
        </div>
        <div class="btn" v-else>
          <el-button type="primary" @click.native="changeMemo(rowData.id, 0)">修改备注</el-button>
        </div>
      </div>
    </div>
    <overlay v-show="detailShow"></overlay> -->
    <el-dialog @close="closeDetail"
        :title="$t('审核详情')"
        :visible.sync="detailShow">
      <el-form  label-position="right" label-width="120px" >
        <el-row >
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{rowData.orderPrefix}}{{rowData.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名称')" class="first-line"><span>{{rowData.loginName}}({{rowData.groupName}})</span>
            <span style="color:#409EFF;cursor:pointer" @click="checkAllOrder(rowData.loginName)">{{ $t('查看所有订单') }}>></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款帐号')" class="first-line"><span>{{rowData.depositType}}_{{rowData.realName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款金额')" class="first-line"><span>{{rowData.depositAmount}}</span>
            <span>{{rowData.depositCount > 1 ? $t('已支付')+rowData.depositCount+$t('次'): $t('首存')}}</span><span>{{rowData.isPayment === true? $t('已支付'): $t('未支付')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('手续费')" class="first-line"><span>{{rowData.handlingCharge}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('优惠金额')" class="first-line"><span>{{rowData.discountAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际到帐')" class="first-line"><span>{{rowData.actualArrival}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核状态')" class="first-line"><span>{{statusTextFilter(rowData.status)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><el-input class="left" type="textarea" v-model="memo" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn" v-if="rowData.status === 2">
                  <el-button type="primary" @click.native="changeStatus(1, rowData.id)">{{ $t('通过') }}</el-button>
                  <el-button type="danger" @click.native="changeStatus(0, rowData.id)">{{ $t('拒绝') }}</el-button>
                </div>
                <div class="btn" v-else>
                  <el-button type="primary" @click.native="changeMemo(rowData.id)">{{ $t('修改备注') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> 
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import systemConfig from '../../config/config.js'
import Clipboard from 'clipboard'
import bus from '../../config/EventBus'
const statusOptions = [{value: 2,text: this.$t('待处理')}, {value: 1,text: this.$t('通过')}, {value: 0,text: this.$t('拒绝')}]
export default {
  name: 'companyDeposit',
  data () {
    return {
      showExtend: false,
      allTodayDeposit: '',
      detailShow: false,
      copied: false,
      rowData: {},
      memo: '',
      accountName: '',
      topAgyAccountOptions: [],
      topAgyAccountValue: [],
      agyAccountOptions: [],
      agyAccountValue: [],
      trueAgyAccountOptions: [],
      startTime: '',
      endTime: '',
      groupOptions: [],
      groupValue: [],
      depositOptions: [],
      depositValue: '',
      statusOptions: statusOptions,
      filterArr: statusOptions,
      statusValue: [],
      tableData: [],
      total: 0,
      isym: true,
      devSource: []
    }
  },
  created () {
    this.getData()
    this.getMemberOptions()
    this.getOnlinePayOptions()
    this.getTodayDeposit()
    this.getAgyAccount([])
    this.getChildAgent()
  },
  mounted () {
    const clipboard = new Clipboard('.clip')
    let self = this
    clipboard.on('success', function (e) {
      self.copied = true
    })
  },
  computed: {
    extendTitle () {
      if (this.showExtend) {
        return this.$t('收起')
      } else {
        return this.$t('更多')
      }
    },
    loading () {
      return this.$store.state.searchLoading
    },
    listReq () {
      return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
    },
    fullscreenLoading () {
      return this.$store.state.fullscreenLoading
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType
      },
      set: function () {
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.isym = true
      this.getData()
    }
  },
  methods: {
    returnStatus (statusValue) {
      return systemConfig.returnStatus(statusValue)
    },
    spliceStr (str) {
      return systemConfig.spliceStr(str, 6)
    },
    pickTime1 (val) {
      this.startTime = systemConfig.transferTimeByType(val, this.timeType)
    },
    pickTime2 (val) {
      this.endTime = systemConfig.transferTimeByType(val, this.timeType)
    },
    timeFilter (row, column) {
      var date = row[column.property]
      if (date == null || date === '') {
        return ''
      }
      return systemConfig.transferTimeByType(date, this.timeType)
    },
    // 条件查询事件
    search () {
      if (this.startTime && this.endTime) {
        if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
          this.$message({
            type: 'warning',
            message: this.$t('存款起始时间不能大于结束时间')
          })
          return
        }
      }
      if (!this.startTime) {this.startTime = ''}
      if (!this.endTime) {this.endTime = ''}
      this.listReq.pageNo = 1
      this.getData()
    },
    // 重置查询条件
    reset () {
      this.statusValue = []
      this.accountName = ''
      this.topAgyAccountValue = []
      this.agyAccountValue = []
      this.agyAccountOptions = this.trueAgyAccountOptions
      this.startTime = ''
      this.endTime = ''
      this.groupValue = []
      this.depositValue = []
      this.devSource = []
    },
    // 更多查询toggle
    more () {
      this.showExtend = !(this.showExtend)
    },
    handleSizeChange (val) {
      this.listReq.pageNo = 1
      this.listReq.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.listReq.pageNo = val
      this.getData()
    },
    selectStatusChange (val) {
      this.statusValue = val
    },
    filterTag (value, row) {
      return row.status === value
    },
    handleCommand (command) {
      switch (command) {
        case 'today':
          this.startTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '23:59:59', this.timeType)
          break
        case 'yesterday':
          this.startTime = systemConfig.transferTimeByType(systemConfig.getYesterday() + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getYesterday() + ' ' + '23:59:59', this.timeType)
          break
        case 'beforeYesterday':
          this.startTime = systemConfig.transferTimeByType(systemConfig.getBeforeYesterday() + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getBeforeYesterday() + ' ' + '23:59:59', this.timeType)
          break
        case 'currentWeek':
          this.startTime = systemConfig.transferTimeByType(systemConfig.getCurrentWeek()[0] + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getCurrentWeek()[1] + ' ' + '23:59:59', this.timeType)
          break
        case 'previousWeek':
          this.startTime = systemConfig.transferTimeByType(systemConfig.getPreviousWeek()[0] + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getPreviousWeek()[1] + ' ' + '23:59:59', this.timeType)
          break
        default:
          this.startTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '00:00:00', this.timeType)
          this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '23:59:59', this.timeType)
          break
      }
    },
    // 打开弹框事件
    showDetail (rowData) {
      this.rowData = rowData
      let url = '/' + rowData.id
      this.$axios.get(systemConfig.urls.companyInfo + url).then((resp) => {
        this.detailShow = true
        this.rowData = resp.data.fundDeposit
        this.memo = this.rowData.memo
      })
    },
    // 关闭弹框事件
    closeDetail () {
      this.detailShow = false
    },
    indexMethod (index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
    },
    // 改变某条记录的状态
    changeStatus (status, id) {
      if (!this.memo) {
        this.$message({
          type: 'warning',
          message: this.$t('备注不能为空')
        })
        return
      }
      if (status === 0) {
        this.rowData.status = 0
      } else {
        this.rowData.status = 1
      }
      this.$axios.post(systemConfig.urls.updateStatus, {status: this.rowData.status, id: id}).then((resp) => {
        this.$message({
          type: 'success',
          message: this.$t('成功')
        })
        bus.$emit('updateCount', true)
        this.changeMemo(id, 1)

      })
    },
    // 改变某条记录的备注  flag :1 修改状态  0修改备注
    changeMemo (id, flag) {
      if (!this.memo) {
        this.$message({
          type: 'warning',
          message: this.$t('备注不能为空')
        })
        return
      }
      this.$store.state.fullscreenLaoding = true
      this.closeDetail()
      this.$axios.post(systemConfig.urls.updateMemo, {memo: this.memo, id: id}).then((resp) => {
        if (!flag) {
          this.$message({
            type: 'success',
            message: this.$t('成功')
          })
        }
        this.getData()
        this.memo = ''
      })
    },
    // 获取会员options
    getMemberOptions () {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.groupOptions = resp.data.page
      })
    },
    // 获取线上入款options
    getOnlinePayOptions () {
      this.$axios.get(systemConfig.urls.getDepositList).then((resp) => {
        this.depositOptions = resp.data.data
      })
    },
    checkAllOrder (accountName) {
      this.accountName = accountName
      this.detailShow = false
      this.getData()
    },
    // 获取表格数据  + '&createTimeFrom=' + this.startTime + '&createTimeTo=' + this.endTime
    getData () {
      this.$store.state.searchLoading = true
      if (this.$router.history.current.query.status && this.isym) {
        this.selectStatusChange(parseInt(this.$router.history.current.query.status))
        this.isym = false
      }
      let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&devSource=' + this.devSource + '&groupIds=' + this.groupValue + '&loginName=' + this.accountName + '&agyTopAccountIds=' + this.topAgyAccountValue + '&agyAccountIds=' + this.agyAccountValue + '&companyPayIds=' + this.depositValue + '&statuss=' + this.statusValue +'&orderBy=modifyTime Desc'
      if (this.startTime && this.timeType === 'md') {
        url += '&createTimeFrom=' + systemConfig.transferTimeByType(this.startTime, 'mdToBj')
      } else {
        url += '&createTimeFrom=' + this.startTime
      }
      if (this.endTime && this.timeType === 'md') {
        url += '&createTimeTo=' + systemConfig.transferTimeByType(this.endTime, 'mdToBj')
      } else {
        url += '&createTimeTo=' + this.endTime
      }
      this.$axios.get(systemConfig.urls.fundDepositCompanyList + url).then((resp) => {
        let data = resp.data.page.list
        for (let i = 0; i < data.length; i++) {
          data[i].orderNoText = data[i].orderPrefix + data[i].orderNo
        }
        this.tableData = data
        this.total = resp.data.page.totalCount
        if (this.statusValue) {
          this.filterArr = systemConfig.getStatusArr(this.statusValue)
        }
      })
    },
    statusTextFilter (status) {
      switch (status) {
        case 0:
          return this.$t('拒绝')
          break
        case 1:
          return this.$t('通过')
          break
        case 2:
          return this.$t('待处理')
          break
      }
    },
    // 获取今日存款
    getTodayDeposit () {
      this.$axios.get(systemConfig.urls.getFundDepositSumDepositAmount + '?make=1').then((resp) => {
        this.allTodayDeposit = systemConfig.toThousands(resp.data.sum)
      })
    },
    getChildAgent () {
      this.$axios.get(systemConfig.urls.getAllChildAgent).then((resp) => {
        this.agyAccountOptions = resp.data.accounts
        this.trueAgyAccountOptions = resp.data.accounts
      })
    },
    getAgyAccount (id) {
        if (id.length > 0) {
          this.agyAccountOptions = []
          this.q.agyAccountId = []
          for(let i = 0; i < id.length; i++){
            this.$axios.get(systemConfig.urls.getAgyAccount + '?parentId=' + id[i]).then((resp) => {
              let tempArr = resp.data.accounts
              if (this.agyAccountOptions.length > 0) {
                for (let k = 0; k < this.agyAccountOptions.length; k++) {
                  for (let j = 0; j < tempArr.length; j++) {
                    if (this.agyAccountOptions[k].id !== tempArr[j].id) {
                      this.agyAccountOptions = this.agyAccountOptions.concat(resp.data.accounts)
                    }
                  }
                }
              } else {
                this.agyAccountOptions = this.agyAccountOptions.concat(resp.data.accounts)
              }
            })
          }
        } else {
          this.agyAccountOptions = this.trueAgyAccountOptions
          this.$axios.get(systemConfig.urls.getAgyAccount + '?parentId=').then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts
          })
        }
      },
  }
}
</script>
