<template>
  <div class="game-data-sheet">
    <!--查询条件-->
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            slot="date"
            ref="searchTime"
            :left="40"
            :selections="timeSelections"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
            :default-type-p="defaulttp"
          />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理等级') }}</label>
          <el-select v-model="agentType" :placeholder="$t('请选择')" clearable>
            <el-option
              v-for="item in commonIds"
              :key="item.value"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div>
      <!--导出按钮  其他一些展示内容-->
      <div class="row items-center" style="padding: 20px 0;justify-content: flex-end;">
        <el-button v-if="!permissions.export && isNowDowning" type="primary" :disabled="!totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{ $t('导出') }}
        </el-button>
        <el-button v-else-if="!permissions.export && !isNowDowning" type="primary" class="iconfont icon-export el-button-export" size="mini">{{ $t('导出中') }}...
        </el-button>
      </div>
      <div class="search-form">
        <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getMainPageList" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
          <!-- 表格插槽 -->
          <el-table-column :label="$t('净盈利')" slot="totalProfit" align="center">
            <template slot-scope="scope">
          <span :class="[scope.row.totalProfit > 0 ? 'green': (scope.row.totalProfit < 0 ? 'red' : '')]">
            {{toThousands(scope.row.totalProfit)}}
          </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('总盈亏')" slot="totalPayout" align="center">
            <template slot-scope="scope">
          <span :class="[scope.row.totalPayout > 0 ? 'green': (scope.row.totalPayout < 0 ? 'red' : '')]">
            {{toThousands(scope.row.totalPayout)}}
          </span>
            </template>
          </el-table-column>
        </TableCom>
      </div>
    </div>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'
  import queryStore from '../../mixins/queryStore'
  import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
  import { mapGetters } from 'vuex'
  import fileExport from "../../mixins/fileExport";
  import moment from "moment";
  import Mixin from '@/mixins/loadTime'


  export default {
    name: 'agentSheet',
    mixins: [fileExport,Mixin, queryStore(['startTime', 'endTime', 'agentType', 'agyAccount'])],
    components: {StartAndEndTimeSelector},
    data() {
      return {
        isNowDowning: true, //文件导出
        timeSelections: [
          {
            label: this.$t('今日'),
            value: 'today'
          },
          {
            label: this.$t('昨日'),
            value: 'yesterday'
          },
          {
            label: this.$t('本周'),
            value: 'currentWeek'
          },
          {
            label: this.$t('上周'),
            value: 'lastWeek'
          },
          {
            label: this.$t('本月'),
            value: 'currentMonth'
          }
        ],
        startTime: moment().format("YYYY-MM-DD")+ " 00:00:00",
        endTime: moment().format("YYYY-MM-DD")+ " 23:59:59",
        defaulttp: 'today',
        tableData: [],
        tableColumns: [
          {
            prop: "agyAccount",
            label: this.$t("代理账号"),
          },
          {
            prop: "parentAgent",
            label: this.$t("上级代理"),
          },
          {
            prop: "totalProfit",
            label: this.$t("净盈利"),
            slotName: "totalProfit"
          },
          {
            prop: "fundAdjust",
            label: this.$t("资金调整"),
          },
          {
            prop: "betNum",
            label: this.$t("投注人数"),
          },
          {
            prop: "activeNum",
            label: this.$t("有效活跃"),
          },
          {
            prop: "registerNum",
            label: this.$t("注册人数"),
          },
          {
            prop: "firstDepositNum",
            label: this.$t("首存人数"),
          },
          {
            prop: "totalDepositNum",
            label: this.$t("存款人数"),
          },
          {
            prop: "totalDepositBalance",
            label: this.$t("总存款"),
          },
          {
            prop: "totalDrawNum",
            label: this.$t("提款人数"),
          },
          {
            prop: "totalDrawAmount",
            label: this.$t("总提款"),
          },
          {
            prop: "totalBonusAmountOnline",
            label: this.$t("线上红利"),
          },
          {
            prop: "totalBonusAmountOffline",
            label: this.$t("线下红利"),
          },
          {
            prop: "totalBonusAmount",
            label: this.$t("总红利"),
          },
          {
            prop: "totalPayout",
            label: this.$t("总盈亏"),
            slotName: "totalPayout"
          },
          {
            prop: "totalTaskBonus",
            label: this.$t("总任务返利"),
          },
        ],
        pageSize: 10,
        currentPage: 1,
        totalCount: null,
        gridData: [],
        allTotal: {},
        agyAccount: '',
        agymembername: '',
        agentType: 1,
        agyMemberId: '',
        commonIds: [
          // {key: 0, value: '全选'},
          {key: 1, value: this.$t('总代')},
          {key: 2, value: this.$t('一级代理')},
          {key: 3, value: this.$t('二级代理')},
        ],
      }
    },
    computed: {
      permissions() {
        const { hasPermission } = this
        return {
          save: hasPermission('fund:onLine:depositStatisticByPay')
        }
      },
      ...mapGetters(['hasPermission'])
    },
    created() {
      this.search()
    },
    methods: {
      handleExport() {
        this.isNowDowning = false;
        const params = {
          startTime: `${this.startTime}`,
          endTime: `${this.endTime}`,
          agentType: `${this.agentType}`
        }
        this.$axios
          .get(systemConfig.urls.exportTagencyFundList,
            {params:params})
          .then((res) => {
            let isDownBool = res.data.code;
            if (isDownBool) {
              this.$message({
                type: "warning",
                message: isDownBool,
              });
              this.isNowDowning = true;
            } else {
              this.agentCheckFile('exportTagencyFundList',systemConfig.urls.tagencyCheckFile);
            }
          })
          .finally(() => {
            this.isNowDowning = true;
          });
      },
      filterTime (time) {
        if (!time) {
          return
        }
        if (!time.length===8) {
          return
        }
        let str1 = time.substr(0, 4)
        let str2 = time.substr(4, 2)
        let str3 = time.substr(6, 2)
        return str1 + '/' + str2 + '/' + str3
      },
      handleCurrentChange (val) {
        this.pageNo = val
      },
      toThousands (money) {
        return systemConfig.toThousands(money)
      },
      reset () {
        this.startTime = ''
        this.endTime = ''
        this.agentType = 1
        this.tableData=[]
        this.loading=false
        this.defaulttp = ''
        this.$refs.searchTime.defaultType = ''
      },
      search(){
        this.getCurrentRecodeTime()
        if(!this.startTime || !this.endTime){
          this.$message({
            type: 'warning',
            message: this.$t('请输入完整的时间段')
          })
          this.tableData=[];
          return
        }
        if (this.startTime && this.endTime) {
          if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
            this.$message({
              type: 'warning',
              message: this.$t('投注起始时间不能大于结束时间')
            })
            return
          }
        }
        if (!this.startTime) {
          this.startTime = ''
        }
        if (!this.endTime) {
          this.endTime = ''
        }
        this.loading=true;
        this.resetPageNo()
        this.showMainPage()
      },
      getMainPageList() {
        this.loading=true;
        let url = '?pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&startTime=' + (this.startTime) + '&endTime=' + (this.endTime)
        if(this.agentType){
          url += '&agentType=' + this.agentType
        }
        this.$axios.get(systemConfig.urls.tagencyFundList + url).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          this.tableData = []
          resp.data.page.list = resp.data.page.list.map(item => {
            item.totalDepositBalance = (item.totalDepositBalance || 0).toLocaleString()
            item.totalDrawAmount = (item.totalDrawAmount || 0).toLocaleString()
            item.totalBonusAmountOnline = (item.totalBonusAmountOnline || 0).toLocaleString()
            item.totalBonusAmountOffline = (item.totalBonusAmountOffline || 0).toLocaleString()
            item.totalBonusAmount = (item.totalBonusAmount || 0).toLocaleString()
            // item.totalPayout = (item.totalPayout || 0).toLocaleString()
            item.totalTaskBonus = (item.totalTaskBonus || 0).toLocaleString()
            item.fundAdjust = (item.fundAdjust || 0).toLocaleString()
            this.tableData.push(item)
          })
          this.currentPage = resp.data.page.currPage
          this.totalCount = resp.data.page.totalCount
          this.loading=false;
        }).catch(res=>{
          this.loading=false;
        })
      },
      showMainPage() {
        this.resetPageNo()
        this.loading = true
        this.getMainPageList()
      },
      resetPageNo() {
        this.pageNo = 1
      },
    },
  }
</script>
<style lang="scss">
  .mt50 {
    margin-top: 50px;
  }

  @media screen and (max-width: 1460px) {
    .game-data-sheet {
      .width180 {
        width: 150px !important;
        input {
          width: 150px !important;
        }
      }
    }
  }

  .caijin {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    span {
      display: inline-block;
      width: 100px;
      text-align: center;
    }
  }
  .statistics {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .statistics-cell {
      position: relative;
      margin: 10px 10px 0 0;
      width: 187px;
      height: 58px;
      background: #f0f3f9;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background:#e6f0fa;
      }
      h3 {
        position: absolute;
        bottom:8px;
        left:10px;
      }
      .money {
        position:absolute;
        top:10px;
        left:10px;
        font-weight: bold;
        font-size: 16px;
      }
      .icon-wenhao {
        font-size:14px;
        cursor: pointer;
      }
      .icon-5, .icon-wallet, .icon-hongli, .icon-paicai, .icon-caijin, .icon-yinli, .el-icon-sold-out {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #b5b4c2;
        font-size: 24px;
      }
    }

  }
  .member-top {
    margin-top: 35px;
  }
  .tableToTop{
    position: absolute;
    right: 82px;
    top: 10px;
    font-size: 13px;
    cursor: pointer;
  }
  .staticAnalysis{
    position: relative;
    margin-top: 70px;
    .goback{
      width: 100px;
      position: absolute;
      right: 0;
      top: -37px;
      text-align: center;
      border: 1px solid black;
      height: 20px;
      line-height: 20px;
      border-radius: 5px;
      cursor: pointer;
    }
    .eachOne{
      margin-top: 10px;
      font-weight: bolder;
      .up{
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(220, 220, 220);
        line-height: 18px;
        height: 18px;
        margin-bottom: 10px;
        .l{
          float: left;
        }
        .r{
          float:right;
        }
      }
      ul{
        padding-left: 10px;
        margin-top: 15px;
        li{
          display: inline-block;
          min-width: 150px;
          height: 60px;
          background-color: #f2f3f8;
	        border-radius: 5px;
          margin:0 20px 10px 0;
          padding:5px;
          box-sizing: border-box;
          p{
            height: 25px;
            line-height: 25px;
            color: #999999;
            text-align: center;
          }
          .p2{
            color: #333333;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 65% !important;
}
</style>
