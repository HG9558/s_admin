<template>
  <div class="game-data-sheet">
    <div class="search" style="padding: 20px 20px 15px;">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('游戏平台') }}</label>
          <el-select v-model="platformValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.key"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('游戏分类') }}</label>
          <el-select v-model="depotValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in depotOptions"
              :key="item.id"
              :label="item.catName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>

        <!--投注时间 -->
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('投注时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :selections="timeSelections"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
            :default-type-p="defaultTypeP"
          />
        </div>
      </div>
      <div class="div-search-btn" :style="extendObj">
        <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div v-if="JSON.stringify(tableData)=='{}'" style="line-height:50px;text-align:center;color:#909399;">
      {{ $t('您尚未选择查询条件') }}
    </div>
    <div v-else>
    <div class="row items-center" style="height: 50px!important;">
      <Snapshots
        v-model="snapshots"
        displayKey="displayName"
        @change="handleSnapshotsChange"
      />
      <div v-show="vipPage && vipPageFlag2" style="margin-left: 12px;">
        {{ $t('游戏平台') }}:{{tempPlatformRow.platform}}
        {{ $t('游戏分类') }}:{{tempPlatformRow.gameCategory}}
      </div>
      <div style="flex: 1;"></div>
      <!-- <el-button style="margin-right:160px" class="iconfont icon-back el-button-export"
                 v-show="!mainPage && !timeSearchPage" @click="returnBtn">返回
      </el-button> -->
      <el-button class="iconfont icon-close el-button-export " v-show="!mainPage"
                 @click="closeBtn">{{ $t('关闭') }}
      </el-button>
      <!-- <el-button class="iconfont icon-export el-button-export">导出</el-button> -->
    </div>
    <div class="search-form" v-show="mainPage">
      <el-table
        :data="tableData.list"
        v-loading='loadingBool'
        border
        style="width: 100%">
        <el-table-column :label="$t('日期')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.startday===$t('小计') || scope.row.startday===$t('总计')">{{scope.row.startday}}</span>
            <el-button v-else @click="showTimeSearchPage(scope.row)" type="text" size="small">{{scope.row.startday}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align='center'
          prop="times"
          :label="$t('总投注人数')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="betTotal"
          :formatter="twoNumber"
          :label="$t('总投注额')">
        </el-table-column>
        <el-table-column
        align='center'
          prop="validBetTotal"
          :formatter="twoNumber"
          :label="$t('总有效投注额')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="payoutTotal"
          :formatter="twoNumber"
          :label="$t('总盈亏')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="winRate"
          :formatter="twoNumber2"
          :label="$t('盈利率')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="jackpotBetTotal"
          :formatter="twoNumber"
          :label="$t('奖池投注')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="jackpotPayoutTotal"
          :formatter="twoNumber"
          :label="$t('奖池派彩')">
        </el-table-column>
        <el-table-column
          align='center'
          prop="jackpotWinTotal"
          :formatter="twoNumber"
          :label="$t('奖池盈利')">
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="timeSearchPage">
      <el-table
        v-loading='loadingBool'
        :data="tableData.list"
        border
        style="width:100%">
        <el-table-column :label="$t('日期')" prop="startday" align="center">
        </el-table-column>
        <el-table-column align='center' :label="$t('总代数量')">
          <template slot-scope="scope">
            <el-button @click="showAllTopAgyPage(scope.row)" type="text" size="small">{{scope.row.topAgentTimes}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('投注单量')" prop="userCounts">
        </el-table-column>
        <el-table-column align='center' :label="$t('总投注人数')">
          <template slot-scope="scope">
            <el-button @click="showVipPageFromTimeSearch(scope.row)" type="text" size="small">{{scope.row.times}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('总投注额')" prop="betTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('总有效投注额')" prop="validBetTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('总盈亏')" prop="payoutTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池投注')" prop="jackpotBetTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池派彩')" prop="jackpotPayoutTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池盈利')" prop="jackpotWinTotal">
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="allTopAgyPage">
      <el-table
        :data="tableData.list"
        v-loading='loadingBool'
        border
        style="width:100%">
        <el-table-column :label="$t('总代')" prop="topAgent" align="center">
          <template slot-scope="scope">
            {{scope.row.topAgent}}
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId"/>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('代理数量')">
          <template slot-scope="scope">
            <el-button @click="handleTopAgentClick(scope.row)" type="text" size="small">{{scope.row.agentTimes}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('投注人数')" prop="times">
        </el-table-column>
        <el-table-column align='center' :label="$t('总投注额')" prop="betTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('总有效投注额')" prop="validBetTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('总盈亏')" prop="payoutTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池投注')" prop="jackpotBetTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池派彩')" prop="jackpotPayoutTotal">
        </el-table-column>
        <el-table-column align='center' :label="$t('奖池盈利')" prop="jackpotWinTotal">
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="agyPage">
      <el-table
        :data="tableData.list"
        v-loading='loadingBool'
        border
        style="width:100%">
        <el-table-column :label="$t('代理')" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleAgentClick(scope.row, false)"
            >
              {{ scope.row.agent }}
            </el-button>
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('下级代理')" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.subCount"
              @click="handleAgentClick(scope.row, true)"
            >
              {{ scope.row.subCount || 0 }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('投注人数')" prop="times" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总投注额')" prop="betTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总有效投注额')" prop="validBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总盈亏')" prop="payoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池投注')" prop="jackpotBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池派彩')" prop="jackpotPayoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池盈利')" prop="jackpotWinTotal" align='center'>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="summarizePage">
      <!-- 视图 -->
      <el-table
        stripe
        border
        :data="viewTableData"
        style="margin-bottom: 20px;"
      >
        <el-table-column :label="$t('视图')" align="center">
          <template slot-scope="{ $index }">
            <el-button
              type="text"
              size="small"
              :disabled="(currentLayer.isSign - 1) === $index"
              @click="handleViewChange($index + 1)"
            >
              {{ [$t('下级代理'), $t('直属会员'), $t('所有下级')][$index] }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('总投注人数')" prop="times" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总投注额')" prop="betTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总有效投注额')" prop="validBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总盈亏')" prop="payoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池投注')" prop="jackpotBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池派彩')" prop="jackpotPayoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池盈利')" prop="jackpotWinTotal" align='center'>
        </el-table-column>
      </el-table>

      <h3>{{ [$t('下级代理'), $t('直属会员'), $t('所有下级')][currentLayer.isSign - 1] }}</h3>
      <el-table
        :data="tableData.list"
        v-loading='loadingBool'
        border
        style="width:100%;margin-top:50px">
        <el-table-column :label="$t('游戏平台')" prop="platform" align="center">
        </el-table-column>
        <el-table-column :label="$t('游戏分类')" prop="gameCategory" align="center">
        </el-table-column>
        <el-table-column :label="currentLayer.isSign === 1 ? $t('投注代理数') : $t('投注人数')" prop="times" align='center'>
          <template slot-scope="scope">
            <el-button @click="handleAgentDetailClick(scope.row)" type="text" size="small">{{scope.row.times}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('总投注额')" prop="betTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总有效投注额')" prop="validBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总盈亏')" prop="payoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池投注')" prop="jackpotBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池派彩')" prop="jackpotPayoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池盈利')" prop="jackpotWinTotal" align='center'>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="vipPage">
      <el-table
        v-show="vipPageFlag3"
        :data="innerTableData.list"
        border
        style="width:100%">
        <el-table-column :label="$t('总投注人数')" prop="times" width='140' align='center'>
        </el-table-column>
        <el-table-column :label="$t('总投注额')" prop="betTotal" width='140' align='center'>
        </el-table-column>
        <el-table-column :label="$t('总有效投注额')" prop="validBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总盈亏')" prop="payoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池投注')" prop="jackpotBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池派彩')" prop="jackpotPayoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池盈利')" prop="jackpotWinTotal" align='center'>
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData.list"
        v-loading='loadingBool'
        border
        style="width:100%;">
        <el-table-column :label="$t('用户名')" prop="userName" align="center">
          <template slot-scope="scope">
            <el-button @click="jumpToBetRecord(scope.row)" type="text" size="small">{{scope.row.userName}}</el-button>
            <GlobalComponentTestLabel :id="scope.row.tagencyId"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('总投注额')" prop="betTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总有效投注额')" prop="validBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('总盈亏')" prop="payoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('盈利率')" prop="winRate" :formatter="twoNumber2" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池投注')" prop="jackpotBetTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池派彩')" prop="jackpotPayoutTotal" align='center'>
        </el-table-column>
        <el-table-column :label="$t('奖池盈利')" prop="jackpotWinTotal" align='center'>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination"><!-- maintain 分页 -->
      <el-pagination
        background
        @size-change="handleSizeMainPageChange"
        @current-change="handleCurrentMainPageChange"
        :current-page="listReq.pageNo"
        :page-sizes="listReq.pageSizeArr"
        :page-size="listReq.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount">
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
  import systemConfig from '../../config/config.js'
  import queryStore from '../../mixins/queryStore'
  import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
  import moment from "moment";
  const {toThousands} = systemConfig
  import Mixin from '@/mixins/loadTime'
  import { lang } from "@/i18n"


  export default {
    name: 'gameDataSheet',
    mixins: [Mixin, queryStore(['platformValue', 'depotValue', 'gameName', 'startTime', 'endTime'])],
    components: {StartAndEndTimeSelector},
    data() {
      return {
        timeSelections: [
          {
            label: lang('今日'),
            value: 'today'
          },
          {
            label: lang('昨日'),
            value: 'yesterday'
          },
          {
            label: lang('本周'),
            value: 'currentWeek'
          },
          {
            label: lang('上周'),
            value: 'lastWeek'
          },
          {
            label: lang('本月'),
            value: 'currentMonth'
          }
        ],
        depotValue: [],
        depotOptions: [],
        platformValue: [],
        platformOptions: [],
        tempStartTime: '',
        tempEndTime: '',
        tempPlatformRow: {},
        gameName: '',
        // startTime: systemConfig.getCurrentMonth()[0],
        // endTime: systemConfig.getCurrentMonth()[1],
        /* startTime: systemConfig.getToday() + ' ' + '00:00:00',
        endTime: systemConfig.getToday() + ' ' + '23:59:59', */
        startTime: moment().format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        defaultTypeP: 'today',
        innerTableData: {},
        tableData: {},
        mainPage: true,
        timeSearchPage: false,
        allTopAgyPage: false,
        agyPage: false,
        summarizePage: false,
        allAgyPage: false,
        vipPage: false,
        vipPageFlag1: false, // 是否存在总代  代理
        vipPageFlag2: false, // 是否存在平台  分类
        vipPageFlag3: false, // 是否存在中间的总结部分
        pageFlag: 'mainPage',
        previousPageFlag: '',
        /* listReq:{
          pageSize: 20,
          pageNo: 1,
        }, */
        oldTableList:[],//上一次主页展示数据
        enterNum:0,
        loadingBool:false,//下拉加载图标展示
        saveStartTime:'',//保存当前开始时间
        saveEndTime:'',
        snapshots: [],
        viewTableData: [],
      }
    },
    created() {
      this.getPlatformOption()
      this.getDepotOption()
      // this.toRequestData()
     /*  window.onscroll=()=>{
        this.$scrToBottom.scrollTo('listReq',this,'handleSizeMainPageChange')
      } */
      this.search()
    },
    computed: {
      /* listReq() {
        return this.$store.state.listReq
      }, */
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [10, 100, 300, 500, 1000]
        }
      },
      listReqInner() {
        return this.$store.state.listReqInner
      },
      timeType: {
        get: function () {
          return this.$store.state.timeType
        },
        set: function () {
        }
      },
      extendObj() {
        return !this.mainPage ? {'bottom': '40px'} : {'top': '55%', 'transform': 'translateY(-50%)'}
      },
      currentLayer() {
        return this.snapshots.slice(-1)[0] || {}
      },
      currentLevel() {
        // 当前在第几层
        return this.snapshots.length
      },
    },
    methods: {
      handleSnapshotsChange() {
        this.pageFlag = this.currentLevel > 1 ? 'summarizePage' : 'agyPage'
        this.returnBtn()
      },
      // param: innerTableFlag,tableFlag  只请求一次对应的数据
      handleInnerSizeChange(val) {
        this.listReqInner.pageNo = 1
        this.listReqInner.pageSize = val
        this.toRequestData(true, false)
      },
      handleInnerCurrentChange(val) {
        this.listReqInner.pageNo = val
        this.toRequestData(true, false)
      },
      handleSizeMainPageChange(val) {
        this.listReq.pageNo = 1
        this.listReq.pageSize = val
        this.toRequestData(false, true)
      },
      handleCurrentMainPageChange(val) {
        this.listReq.pageNo = val
        this.toRequestData(false, true)
      },
      reset(val) {//val仅用于按钮点击触发
        /* 重置还原初始值 */
        Object.assign(this.$data,this.$options.data());
        this.startTime = ''
        this.endTime = ''
        this.defaultTypeP = ''
        this.$refs.searchTime.defaultType = ''
        //获取初始化中的值
        this.getPlatformOption()
        this.getDepotOption()
        /* this.startTime = ''
        this.endTime = ''
        this.platformValue = []
        this.depotValue = []
        this.gameName = ''
        this.mainPage=true
        this.platformValue=[]
        this.depotValue=[]
        this.gameName=''; */
        //下拉刷新还原
        /* this.tableData={}
        this.enterNum=0;
        this.listReq.pageSize=20;
        this.oldTableList=[]; */
      },
      search(val) {
        this.getCurrentRecodeTime()
        this.snapshots = []
        this.tableData={};
        if ((this.startTime && !this.endTime) || (!this.startTime && this.endTime)) {
          this.$message({
            type: 'warning',
            message: this.$t('请输入完整的时间段')
          })
          return
        }
        if(!this.startTime && !this.endTime){
          this.tableData={};
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
        if (this.pageFlag === 'mainPage') {
          this.showMainPage()
        } else {
          this.showTimeSearchPage()
        }
      },
      closeBtn() {
        this.listReq.pageNo = 1
        this.listReqInner.pageNo = 1
        this.platformValue = []
        this.depotValue = []
        this.snapshots = []
        /* this.startTime = systemConfig.getCurrentMonth()[0]
        this.endTime = systemConfig.getCurrentMonth()[1] */
        this.startTime=this.saveStartTime;
        this.endTime=this.saveEndTime;
        this.showMainPage()
      },
      returnBtn() {
        this.listReq.pageNo = 1
        this.listReqInner.pageNo = 1
        switch (this.pageFlag) {
          case 'allTopAgyPage':
            this.showTimeSearchPage()
            break
          case 'agyPage':
            this.snapshots = this.snapshots.slice(0, 1)
            this.vipPage = false
            this.agyPage = false
            this.summarizePage = false
            this.showAllTopAgyPage()
            break
          case 'summarizePage':
            this.vipPage = false
            this.summarizePage = false
            this.showAgyPage()
            break
          case 'vipPage':
            if (this.vipPageFlag1) this.showSummarizePage()
            if (this.vipPageFlag2 || !this.vipPageFlag3) this.showTimeSearchPage()
            break
        }
      },
      getData(api, params) {
        /* if(this.tableData.totalCount&&this.listReq.pageSize-20>=this.tableData.totalCount){//条数大于tableData.list总数，则停止
          return ;
        } */
        /* this.$store.state.searchLoading = true */
        const { currentLayer, currentLevel } = this
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo

        if (this.pageFlag !== 'mainPage') {
          url += '&betStrTime=' + systemConfig.transferTimeByType(params[0] || this.startTime, this.timeType)
          url += '&betEndTime=' + systemConfig.transferTimeByType(params[1] || this.endTime, this.timeType)
        }

        console.log(this.pageFlag,api)
        switch (this.pageFlag) {
          case 'mainPage':
            url += ('&betStrTime=' + (this.startTime + ' 00:00:00') + '&betEndTime=' + (this.endTime + ' 23:59:59'))
            break
          case 'timeSearchPage':
            url += ('&platformList=' + this.platformValue + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'allTopAgyPage':
            url += ('&platformList=' + this.platformValue + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'allAgyPage':
            url += ('&platformList=' + this.platformValue + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'agyPage':
            url += ('&topAgentId=' + (currentLevel > 1 ? currentLayer.agentId : currentLayer.topAgentId) + '&platformList=' + this.platformValue + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'summarizePage':
            // isSign 1 代理 2 会员 3 所有下级
            url += ('&platformList=' + this.platformValue + ('&topAgentId=' + currentLayer.agentId) + ('&isSign=' + currentLayer.isSign) + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'vipPage':
            const isSign = (currentLayer.isSign || 4)

            url += ('&platformList=' + (params[2] || this.platformValue) + '&catIdList=' + (params[3] || this.depotValue) + '&gamecode=' + this.gameName + '&topAgentId=' + (currentLayer.agentId || '') + '&isSign=' + isSign)
            break
        }
        this.tableData = []
        this.loadingBool = true
        this.$axios.get(api + url).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          resp.data.page.list = resp.data.page.list.map(item => {
            const arr = ['betTotal', 'payoutTotal', 'validBetTotal', 'jackpotBetTotal', 'jackpotPayoutTotal', 'jackpotWinTotal']
            for (let key of arr) {
              item[key] = toThousands(item[key])
            }
            return item
          })
          this.loadingBool = false
          this.tableData = resp.data.page
        }).catch(err=>{
          this.loadingBool = false
        })
      },
      getInnerData(api, params) {
        const { currentLayer } = this
        let url = '?pageSize=' + this.listReqInner.pageSize + '&pageNo=' + this.listReqInner.pageNo
        url += '&betStrTime=' + systemConfig.transferTimeByType(params[0] || this.startTime, this.timeType)
        url += '&betEndTime=' + systemConfig.transferTimeByType(params[1] || this.endTime, this.timeType)

        switch (this.pageFlag) {
          case 'timeSearchPage':
            url += ('&platformList=' + this.platformValue + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'summarizePage':
            url += ('&platformList=' + this.platformValue + ('&topAgentId=' + params[2] || '') + ('&agentId=' + params[3] || '') + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName)
            break
          case 'vipPage':
            if (this.vipPageFlag1) {
              url += ('&platformList=' + this.platformValue + ('&topAgentId=' + currentLayer.agentId || '') + '&catIdList=' + this.depotValue + '&gamecode=' + this.gameName + '&isSign=' + this.currentLayer.isSign)
            } else {
              url += ('&platformList=' + (params[2] || this.platformValue) + '&topAgentId=' + '' + '&agentId=' + '' + '&catIdList=' + (params[3] || this.depotValue) + '&gamecode=' + this.gameName)
            }
            break
        }
        this.$axios.get(api + url).then((resp) => {
          resp.data.page.list = resp.data.page.list.map(item => {
            const arr = ['betTotal', 'payoutTotal', 'validBetTotal', 'jackpotBetTotal', 'jackpotPayoutTotal', 'jackpotWinTotal']
            for (let key of arr) {
              item[key] = toThousands(item[key])
            }
            return item
          })
          this.innerTableData = resp.data.page
        })
      },
      showMainPage() {
        this.pageFlag = 'mainPage'
        this.mainPage = true
        this.timeSearchPage = false
        this.allAgyPage = false
        this.agyPage = false
        this.summarizePage = false
        this.allTopAgyPage = false
        this.vipPage = false
        this.resetPagenation()
        this.toRequestData()
      },
      showTimeSearchPage(row) {
        this.saveStartTime=this.startTime;
        this.saveEndTime=this.endTime;
        this.pageFlag = 'timeSearchPage'
        this.btsSmId = 10
        if (row) {
          this.searchWithTime(row)
        } else {
          this.tempStartTime = this.startTime
          this.tempEndTime = this.endTime
        }
        this.mainPage = false
        this.timeSearchPage = true
        this.allAgyPage = false
        this.agyPage = false
        this.summarizePage = false
        this.allTopAgyPage = false
        this.vipPage = false
        this.resetPagenation()
        this.resetInnerPagenation()
        this.toRequestData()
        this.getBetAllAmount()
      },
      showAllTopAgyPage(row) {
        this.pageFlag = 'allTopAgyPage'
        this.previousPageFlag = 'timeSearchPage'
        this.timeSearchPage = false
        this.allTopAgyPage = true
        this.resetPagenation()
        this.toRequestData()
      },
      handleTopAgentClick(row) {
        this.snapshots = [
          {
            ...row,
            displayName: `${this.$t('总代')}${ row.topAgent }`,
          },
        ]
        this.showAgyPage()
      },
      handleAgentClick(row, showSubAgent) {
        this.snapshots.push({
          ...row,
          isSign: 1,
          displayName: `${this.$t('代理')}${ row.agent }`,
        })
        if (showSubAgent) { // 是否查看下级代理
          this.showAgyPage()
        } else {
          this.showSummarizePage()
        }
      },
      showAgyPage() {
        this.pageFlag = 'agyPage'
        this.previousPageFlag = 'allTopAgyPage'
        this.agyPage = true
        this.summarizePage = false
        this.allTopAgyPage = false
        this.resetPagenation()
        this.toRequestData()
      },
      getViewData() {
        const {
          currentLayer,
          platformValue,
          depotValue,
          gameName,
        } = this
        this.viewTableData = []
        this.$axios
          .get(systemConfig.urls.findBetDayBetAgent, {
            params: {
              topAgentId: currentLayer.agentId,
              platformList: platformValue.join(','),
              catIdList: depotValue.join(','),
              gamecode: gameName,
              betStrTime: systemConfig.transferTimeByType(this.tempStartTime || this.startTime, this.timeType),
              betEndTime: systemConfig.transferTimeByType(this.tempEndTime || this.endTime, this.timeType),
            },
          })
          .then(({ data }) => {
            this.viewTableData = ['subordinateAgent', 'directAccount', 'allSubordinates']
              .map(key => data.data[key])
              .map(item => {
                const arr = ['betTotal', 'payoutTotal', 'validBetTotal', 'jackpotBetTotal', 'jackpotPayoutTotal', 'jackpotWinTotal']

                for (let key of arr) {
                  item[key] = toThousands(item[key])
                }
                return item
              })
          })
      },
      handleViewChange(isSign) {
        const { snapshots } = this

        snapshots[snapshots.length - 1].isSign = isSign
        this.resetPagenation()
        this.toRequestData(false, true)
      },
      showSummarizePage() {
        this.agyPage = false
        this.summarizePage = true
        this.pageFlag = 'summarizePage'
        this.previousPageFlag = 'agyPage'
        this.resetPagenation()
        this.toRequestData(true, true)
      },
      showVipPageFromTimeSearch(row) {
        this.pageFlag = 'vipPage'
        this.previousPageFlag = 'timeSearchPage'
        if (row) {
          this.searchWithTime(row)
        } else {
          this.tempStartTime = this.startTime
          this.tempEndTime = this.endTime
        }
        this.timeSearchPage = false
        this.vipPage = true
        this.vipPageFlag1 = false
        this.vipPageFlag2 = false
        this.vipPageFlag3 = false
        this.resetPagenation()
        this.getVipPageData()
      },
      handleAgentDetailClick(row) {
        if (this.currentLayer.isSign === 1) {
          const { platformId, gameCategoryId } = row

          this.platformValue = [platformId]
          this.depotValue = [gameCategoryId]
          this.showAgyPage()
        } else {
          this.showVipPageFromSummarizePage(row)
        }
      },
      showVipPageFromSummarizePage(row) {
        this.previousPageFlag = 'summarizePage'
        this.pageFlag = 'vipPage'
        this.tempPlatformRow = row
        this.vipPage = true
        this.summarizePage = false
        this.vipPageFlag1 = true
        this.vipPageFlag2 = true
        this.vipPageFlag3 = true
        this.resetPagenation()
        this.getVipPageData()
      },
      toRequestData(innerTableFlag, tableFlag) {
        const { currentLayer } = this

        switch (this.pageFlag) {
          case 'mainPage':
            this.getData(systemConfig.urls.findRptBetTotalPage)
            break
          case 'timeSearchPage':
            this.getData(systemConfig.urls.findRptBetTotalList, [this.tempStartTime, this.tempEndTime])
            break
          case 'allTopAgyPage':
            this.getData(systemConfig.urls.findBetDayGroupTopAgentPage, [this.tempStartTime, this.tempEndTime])
            break
          case 'agyPage':
            this.getData(systemConfig.urls.findBetDayGroupAgentPage, [this.tempStartTime, this.tempEndTime, this.currentLayer.topAgentId])
            break
          case 'summarizePage':
            innerTableFlag && this.getViewData()
            tableFlag && this.getData(systemConfig.urls.findBetDayGroupGameTypePage, [this.tempStartTime, this.tempEndTime, currentLayer.topAgentId, currentLayer.agentId])
            break
          case 'vipPage' :
            this.getData(systemConfig.urls.findBetDayGroupUserPage, [this.tempStartTime, this.tempEndTime])
            break
        }
      },
      getBetAllAmount() {
        let tempAmount = 0
        if(this.tableData.list)
        for (let i = 0; i < this.tableData.list.length; i++) {
          tempAmount += this.tableData.list[i].times
        }
        return tempAmount
      },
      getVipPageData() {
        const { currentLayer } = this

        // timesearch---总投注人数来
        if (!this.vipPageFlag3) {
          this.getData(systemConfig.urls.findBetDayGroupUserPage, [this.tempStartTime, this.tempEndTime])
        }
        // timesearch---投注人数
        if (this.vipPageFlag2 && !this.vipPageFlag1) {
          this.getData(systemConfig.urls.findBetDayGroupUserPage, [this.tempStartTime, this.tempEndTime, this.tempPlatformRow.platformId, this.tempPlatformRow.gameCategoryId])
          this.getInnerData(systemConfig.urls.findBetDayTotal, [this.tempStartTime, this.tempEndTime, this.tempPlatformRow.platformId, this.tempPlatformRow.gameCategoryId])
        }
        // 从timesearch----summarize--
        if (this.vipPageFlag1) {
          this.getData(systemConfig.urls.findBetDayGroupUserPage, [this.tempStartTime, this.tempEndTime, this.tempPlatformRow.platformId, this.tempPlatformRow.gameCategoryId, currentLayer.topAgentId, currentLayer.agentId])
          this.getInnerData(systemConfig.urls.findBetDayTotal, [this.tempStartTime, this.tempEndTime, currentLayer.topAgentId, currentLayer.agentId])
        }
      },
      // 获取分类
      getPlatformOption() {
        this.$axios.get(systemConfig.urls.getTopSort).then(resp => {
          this.depotOptions = resp.data.tGmCats
        })
      },
      // 获取平台
      getDepotOption() {
        this.$axios.get(systemConfig.urls.getPlatform + '?codetype=').then((resp) => {
          this.platformOptions = resp.data.page
        })
      },
      // 传递搜索条件  time
      searchWithTime(row) {
        if (row) {
          this.tempStartTime = row.startday
          this.tempEndTime = row.startday
          this.startTime=this.endTime=row.startday;
        } else {
          this.tempStartTime = ''
          this.tempEndTime = ''
        }
      },
      resetPagenation() {//设置请求列表页数与条数
        this.listReq.pageNo = 1
        //this.listReq.pageSize = 10
      },
      resetInnerPagenation() {
        this.listReqInner.pageNo = 1
        this.listReqInner.pageSize = 10
      },
      jumpToBetRecord(row) {
        console.log("TCL: jumpToBetRecord -> row", row)
        const { tempStartTime, tempEndTime } = this
        this.$router.push({
          path: '/main/operateAnalyze/betRecord?memberName',
          query: {
            memberName: row.userName,
            startTime: tempStartTime && tempStartTime + ' 00:00:00',
            endTime: tempEndTime && tempEndTime + ' 23:59:59',
            platform:this.tempPlatformRow.platformId,
            gameCategory:this.tempPlatformRow.gameCategoryId
          }
        })
      },
      twoNumber(row, column, cellValue) {
        if (cellValue === 0) {
          return 0
        }
        return systemConfig.saveTwoNumber(cellValue)
      },
      twoNumber2(row, column, cellValue) {
        // if (cellValue === 0) {
        //   return 0
        // }
        return systemConfig.saveTwoNumber(cellValue) + '%'
      },
      /* scrollToTop(){
        this.$scrToBottom.scrollToTop();
      } */
    }
  }
</script>
<style lang="scss">
  .mt50 {
    margin-top: 50px;
  }
  .tableToTop{
    position: absolute;
    right: 82px;
    top: 10px;
    font-size: 13px;
    cursor: pointer;
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
</style>
