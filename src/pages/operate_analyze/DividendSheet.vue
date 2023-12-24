<template>
  <div class="dividend-sheet">
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <!-- <div class="search-basic-item width180" v-show="!mainPage">
          <label>客户端</label>
          <el-select v-model="deviceValue" placeholder="请选择" multiple>
            <el-option
              v-for="item in deviceOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <!-- </div>
        <div class="search-extend"> -->

        <!--发放时间 -->
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('发放时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :width="450" :left="80" :selections="timeSelections" :startTime.sync="startTime" :endTime.sync="endTime" type="date" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <el-select v-model="agentType" :placeholder="$t('请选择')" @change="checkData">
            <el-option v-for="item in commonIds" :key="item.value" :label="item.value" :value="item.key">
            </el-option>
            <el-option :key="2" :label="$t('正式代理')" :value="2" />
            <el-option :key="3" :label="$t('测试代理')" :value="3" />
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="agentType === 1">
          <label for=""></label>
          <input type="text" v-model="agyAccountStr" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员帐号') }}</label>
          <el-select v-model="memberType" :placeholder="$t('请选择')" @change="checkAgy">
            <el-option v-for="item in commonIds" :key="item.value" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="memberType===1">
          <label for=""></label>
          <input type="text" v-model="membername" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('会员组') }}</label>
          <el-select v-model="groupValue" :placeholder="$t('请选择')" multiple @change="checkData">
            <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('活动类型') }}</label>
          <el-select v-model="typeValue" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.tmplName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('活动名称') }}</label>
          <el-select v-model="activityName" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in activityOptions" :key="item.id" :label="item.activityName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('申请来源') }}</label>
          <el-select v-model="source" :placeholder="$t('请选择')" clearable>
            <el-option :label="$t('前台申请')" :value="0"></el-option>
            <el-option :label="$t('后台添加')" :value="1"></el-option>
            <el-option :label="$t('人工增加')" :value="2"></el-option>
            <el-option :label="$t('人工减少')" :value="3"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-show="!mainPage">
          <label>{{ $t('活动渠道') }}</label>
          <el-select v-model="isOnline" :placeholder="$t('请选择')" clearable>
            <el-option :label="$t('线上活动')" :value="true"></el-option>
            <el-option :label="$t('线下活动')" :value="false"></el-option>
          </el-select>
        </div>
      </div>
      <div class="div-search-btn" :style="extendObj">
        <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="row items-center" style="height: 50px">
      <Snapshots v-show="topAgyPage || vipPage" v-model="snapshots" displayKey="displayName" @change="showAgentPage(currentLayer, true)" />
      <!-- <div class="center-div" v-show="agyPage">代理:{{tempAgyRow.agent}}</div> -->
      <!-- <div class="center-div" v-show="vipPage">会员名:{{tempAccRow.userName}}</div> -->
      <div style="flex: 1; display: flex; justify-content: flex-end;">
        <!-- <el-button style="margin-right:160px" class="iconfont icon-back el-button-export"
                  v-show="!mainPage && !allAgyPage" @click="returnBtn">返回
        </el-button> -->
        <el-button v-if="!vipPage" style="margin-right:80px" class="iconfont icon-close el-button-export " v-show="!mainPage" @click="closeBtn">{{ $t('关闭') }}
        </el-button>
        <el-button v-else-if="hasPermission('analysis:bouns:export')" :disabled="!tableData.totalCount" style="margin-right:80px" class="iconfont el-button-export" v-show="!mainPage" size="small" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导 出')}}
        </el-button>
      </div>
    </div>
    <div class="search-form" v-show="mainPage">
      <!--:class="[JSON.stringify(tableData)!='{}'?'tableNow':'']" //el-table  -->
      <el-table :data="tableData.list" v-loading='isLoading' stripe border style="width: 100%;">
        <el-table-column :label="$t('日期')" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.startday===$t('小计') || scope.row.startday===$t('总计')">{{scope.row.startday}}</span>
            <el-button v-else @click="showAllAgyPage(scope.row.startday)" type="text" size="small">
              {{scope.row.startday}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="profitTimes" :label="$t('领取人数')" align='center'>
        </el-table-column>
        <el-table-column prop="profitCounts" :label="$t('红利数量')" align='center'>
        </el-table-column>
        <el-table-column prop="profits" :formatter="twoNumber" :label="$t('红利总额')" align='right'>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="allAgyPage">
      <el-table max-height="480" :data="tableData.list" v-loading='isLoading' stripe border style="width: 100%">
        <el-table-column :label="$t('日期')" prop="startday" align="center">
        </el-table-column>
        <el-table-column :label="$t('总代')" align="center">
          <template slot-scope="scope">
            <el-button @click="handleTopAgentClick(scope.row)" type="text" size="small">{{scope.row.topAgent}}</el-button>
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId" />
          </template>
        </el-table-column>
        <el-table-column prop="profitTimes" :label="$t('领取人数')" align='center'>
        </el-table-column>
        <el-table-column prop="profitCounts" :label="$t('红利数量')" align='center'>
        </el-table-column>
        <el-table-column prop="profits" :formatter="twoNumber" :label="$t('红利总额')" align='right'>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="topAgyPage">
      <el-table v-show="currentLevel > 1" stripe border show-summary :sum-text="$t('总计')" :data="viewTableData" style="margin-bottom: 20px;">
        <el-table-column :label="$t('视图')" align="center">
          <template slot-scope="{ $index, row}">
            <el-button v-if="$index === 0" type="text" size="small" @click="getAgentPageData">{{ $t('下级代理') }}</el-button>
            <el-button v-else type="text" size="small" @click="showMemberPage(row.agentId)">{{ $t('直属会员') }}</el-button>
          </template>
        </el-table-column>

        <el-table-column :label="$t('领取人数')" prop="profitTimes" align="center"></el-table-column>

        <el-table-column :label="$t('红利数量')" prop="profitCounts" align="center"></el-table-column>

        <el-table-column :label="$t('红利总额')" prop="profits" align="right"></el-table-column>
      </el-table>

      <h3 style="margin-bottom: 20px;">{{ isSubAgentShow ? $t('下级代理') : $t('直属会员') }}</h3>

      <el-table v-if="isSubAgentShow" max-height="480" :data="tableData.list" v-loading='isLoading' stripe border style="width: 100%">
        <el-table-column :label="$t('日期')" align="center" prop="startday" width="140">
        </el-table-column>
        <el-table-column :label="$t('代理')" align="center">
          <template slot-scope="scope">
            <el-button @click="handleAgentClick(scope.row)" type="text" size="small">{{scope.row.agent}}</el-button>
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId" />
          </template>
        </el-table-column>
        <el-table-column prop="profitTimes" :label="$t('领取人数')" align='center'>
        </el-table-column>
        <el-table-column prop="profitCounts" :label="$t('红利数量')" align='center'>
        </el-table-column>
        <el-table-column prop="profits" :formatter="twoNumber" :label="$t('红利总额')" align='right'>
        </el-table-column>
      </el-table>

      <el-table v-else max-height="480" :data="tableData.list" v-loading='isLoading' stripe border style="width: 100%">
        <el-table-column :label="$t('日期')" prop="startday" width="140" align="center">
        </el-table-column>
        <el-table-column width="140" :label="$t('会员名')" align="center">
          <template slot-scope="scope">
            <el-button @click="handleMbrClick(scope.row)" type="text" size="small">{{scope.row.userName}}</el-button>
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId" />
          </template>
        </el-table-column>
        <el-table-column prop="mbrGroup" align="center" :label="$t('会员组')">
        </el-table-column>
        <el-table-column prop="profitCounts" :label="$t('红利数量')" align='center'>
        </el-table-column>
        <el-table-column prop="profits" :formatter="twoNumber" :label="$t('红利总额')" align='right'>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-show="vipPage">
      <el-table max-height="480" :data="tableData.list" v-loading='isLoading' stripe border style="width: 100%; ">
        <el-table-column prop="userName" :label="$t('会员名')" align="center">
          <template slot-scope="scope">
            {{scope.row.userName}}
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId" />
          </template>
        </el-table-column>
        <el-table-column prop="mbrGroup" align="center" :label="$t('会员组')">
        </el-table-column>
        <el-table-column prop="topAgent" :label="$t('总代')" align="center">
        </el-table-column>
        <el-table-column prop="agent" :label="$t('代理')" align="center">
          <template slot-scope="scope">
            {{scope.row.agent}}
            <GlobalComponentTestLabel :id="scope.row.agentId" :parentId="scope.row.topAgentId" />
          </template>
        </el-table-column>
        <el-table-column prop="catName" :label="$t('活动类型')" align="center">
        </el-table-column>
        <el-table-column prop="activityName" :label="$t('活动名称')" align="center">
        </el-table-column>
        <el-table-column prop="orderNo" :label="$t('订单号')" align="center">
        </el-table-column>
        <el-table-column prop="applicationTime" :label="$t('申请时间')" align="center"></el-table-column>
        <el-table-column prop="modifyamountuser" :label="$t('操作人')" align="center"></el-table-column>
        <el-table-column prop="source" :label="$t('申请来源')" align="center">
          <template slot-scope="scope">
            {{[$t('前台申请'), $t('后台添加'), $t('人工增加'), $t('人工减少')][scope.row.source]}}
          </template>
        </el-table-column>
        <el-table-column prop="applicationMemo" :label="$t('添加时备注')" align='center'>
        </el-table-column>
        <el-table-column prop="bonusAmount" :label="$t('红利金额')" align='right'></el-table-column>
        <el-table-column prop="isOline" :label="$t('活动渠道')" align='center'>
          <template slot-scope="scope">
            <span>{{ scope.row.isOnline === true ? $t('线上活动') : scope.row.isOnline === false ? $t('线下活动') : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background @size-change="handleSizeMainPageChange" @current-change="handleCurrentMainPageChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../config/config.js";
import queryStore from "../../mixins/queryStore";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import { mapGetters } from "vuex";
const { toThousands } = systemConfig;
import Mixin from '@/mixins/loadTime'

export default {
  name: "dividendSheet",
  mixins: [
    Mixin,
    queryStore([
      "groupValue",
      "typeValue",
      "activityName",
      "agentType",
      "memberType",
      "startTime",
      "endTime",
      "membername",
      "agyAccountStr",
    ]),
  ],
  components: { StartAndEndTimeSelector },
  data() {
    return {
      accountName: "",
      tempTime: "",
      tempAccRow: {},
      tempTopAgyRow: {},
      tempAgyRow: {},
      groupValue: [],
      groupOptions: [],
      // startTime: systemConfig.getCurrentMonth()[0],
      // endTime: systemConfig.getCurrentMonth()[1],
      /* startTime: systemConfig.getToday() + ' ' + '00:00:00',
        endTime: systemConfig.getToday() + ' ' + '23:59:59', */
      startTime: "",
      endTime: "",
      tableData: {},
      otherTableDataList: [],
      mainPage: true,
      allAgyPage: false,
      topAgyPage: false,
      agyPage: false,
      vipPage: false,
      pageFlag: "mainPage",
      typeOptions: [],
      typeValue: [],
      activityOptions: [],
      activityName: [],
      deviceOptions: [
        { value: 1, name: "PC" },
        { value: 2, name: "H5" },
        { value: 3, name: "APP" },
      ],
      timeSelections: [
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
        {
          label: this.$t("本月"),
          value: "currentMonth",
        },
      ],
      /* listReq:{
          pageSize: 20,
          pageNo: 1,
        },
        oldTableList:[],
        enterNum:0, */
      agentType: "",
      isTest: "",
      agyAccountStr: "",
      commonIds: [
        { key: 0, value: this.$t("全选") },
        { key: 1, value: this.$t("精确查询") },
      ],
      memberType: "",
      membername: "",
      beforeToCurPage: "",
      isExporting: false,
      vipTmpUrl: "",
      snapshots: [],
      viewTableData: [],
      isLoading: false,
      isSubAgentShow: false,
      newAgentId: null,
      source: [],
      isOnline: '',
    };
  },
  created() {
    this.getMemberOptions();
    this.closeBtn();
    this.getActivityType();
    this.getActivityOptions();
    /* window.onscroll=()=>{
        this.$scrToBottom.scrollTo('listReq',this,'handleSizeMainPageChange')
      } */
  },
  computed: {
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [10, 100, 300, 500, 1000],
      };
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () {},
    },
    extendObj() {
      return !this.mainPage
        ? { bottom: "40px" }
        : { top: "60%", transform: "translateY(-50%)" };
    },
    currentLayer() {
      return this.snapshots.slice(-1)[0];
    },
    currentLevel() {
      // 当前在第几层
      return this.snapshots.length;
    },
    ...mapGetters(["hasPermission"]),
  },
  methods: {
    handleExport() {
      // if (this.tableData.totalCount > 10000) {
      //   this.$message.error("导出一次性不能超过一万条");
      //   return;
      // }
      this.isExporting = true;
      this.$axios
        .get(systemConfig.urls.findBonusExport + this.vipTmpUrl)
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
          } else {
            this.checkExportFile();
          }
        });
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      /* const instance = this.$loading({
          fullscreen: true,
          text: '文件生成中...'
        }) */
      this.$axios.get(systemConfig.urls.checkBonusExportFile).then((res) => {
        const obj = res.data.data || {};
        const fileName = obj.fileName,
          downloadFileName = obj.downloadFileName;
        if (fileName) {
          const { baseURL } = res.config;
          // 下载文件
          let SToken = localStorage.getItem("SToken");
          window.open(
            baseURL +
              `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
          );
          this.isExporting = false;
          /* instance.close() */
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },
    checkData(val) {
      this.memberType = this.membername = "";
      switch (this.agentType) {
        case 0: {
          //全选
          this.isTest = this.agyAccountStr = "";
          break;
        }
        case 1: {
          //精选
          this.isTest = "";
          break;
        }
        case 2: {
          //正式
          this.agyAccountStr = "";
          this.isTest = 0;
          break;
        }
        case 3: {
          //测试
          this.agyAccountStr = "";
          this.isTest = 1;
          break;
        }
      }
    },
    checkAgy(val) {
      this.isTest = this.agyAccountStr = this.agentType = "";
      this.groupValue = [];
      if (val === 0) {
        this.membername = "";
      }
    },
    handleSizeMainPageChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.getDataByPage();
    },
    handleCurrentMainPageChange(val) {
      this.listReq.pageNo = val;
      this.getDataByPage();
    },
    getDataByPage() {
      switch (this.pageFlag) {
        case "mainPage":
          this.getMainPageData();
          break;
        case "allAgyPage":
          this.getAllAgyPageData();
          break;
        case "topAgyPage":
          this.isSubAgentShow ? this.getAgentPageData() : this.getMemberData();
          break;
        case "agyPage":
          this.getMemberData();
          break;
        case "vipPage":
          this.getVipPageData();
          break;
      }
    },
    getActivityType() {
      this.$axios.get(systemConfig.urls.getActivityType).then((resp) => {
        let arr = resp.data.page;
        let index = arr.findIndex((val) => {
          return val.tmplCode == "AQ0000011";
        });
        index != -1 && arr.splice(index, 1);
        this.typeOptions = arr;
      });
    },
    getActivityOptions() {
      let url = "?pageSize=1000&pageNo=1";
      this.$axios
        .get(systemConfig.urls.activityIntroduction.list + url)
        .then((resp) => {
          this.activityOptions = resp.data.data.list;
        });
    },
    // 获取会员options
    getMemberOptions() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.groupOptions = resp.data.page;
      });
    },
    // 查询按钮事件
    async search() {
      this.getCurrentRecodeTime()
      this.snapshots = [];
      if (!this.startTime && !this.endTime) {
        this.tempTime = "";
      }
      if (
        (this.startTime && !this.endTime) ||
        (!this.startTime && this.endTime)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入完整的时间段"),
        });
        return;
      }
      if (
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          type: "warning",
          message: this.$t("投注起始时间不能大于结束时间"),
        });
        return;
      }
      if (!this.startTime) {
        this.startTime = "";
      }
      if (!this.endTime) {
        this.endTime = "";
      }
      this.listReq.pageNo = 1;
      if (this.agentType == 1 && !this.agyAccountStr) {
        this.$message({
          type: "warning",
          message: this.$t("请输入代理名称"),
        });
        return;
      }
      if (this.memberType == 1 && !this.membername) {
        this.$message({
          type: "warning",
          message: this.$t("请输入会员账号"),
        });
        return;
      }

      if (this.agentType === 1) {
        const isSubAgent = await this.getAgentType();

        if (isSubAgent) {
          return;
        }
      }

      if (this.memberType === 1) {
        const bannerList = await this.getBannerList("mbr", this.membername);

        this.snapshots = [
          ...bannerList,
          {
            userName: this.membername,
            displayName: `${this.$t('会员')}${this.membername}`,
          },
        ];
      }

      //修改时间参数

      if (
        this.pageFlag === "mainPage" &&
        !this.agentType &&
        this.agentType !== 0 &&
        !this.memberType &&
        this.memberType !== 0
      ) {
        this.getMainPageData();
      } else if (this.memberType || this.memberType === 0) {
        if (this.vipPage) {
          this.getShowVipPage();
          return;
        }
        this.showMemberDetailPage();
      } else {
        this.showAllAgyPage();
      }
    },
    getAgentType() {
      return this.$axios
        .get(
          systemConfig.urls.judgeTagency + "?agyAccount=" + this.agyAccountStr
        )
        .then(({ data }) => {
          // 先判断子代还是总代
          const { parentId } = data.info;

          if (parentId) {
            // 子代理
            this.getBannerList("agent", this.agyAccountStr).then(
              (bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    agent: this.agyAccountStr,
                    displayName: `${this.$t('代理')}${this.agyAccountStr}`,
                  },
                ];
                this.showAgentPage();
              }
            );
          }
          return !!parentId;
        })
        .catch((err) => {
          this.$message.error(err.data.msg);
          return false;
        });
    },
    getBannerList(searchType, searchName) {
      return this.$axios
        .get(
          searchType === "agent"
            ? systemConfig.urls.getAgentBanner
            : systemConfig.urls.getMbrBanner,
          {
            params: {
              [searchType === "agent" ? "agyAccount" : "loginName"]: searchName,
            },
          }
        )
        .then(({ data }) => {
          const bannerList = data.data.filter(
            ({ bannerType }) => bannerType === "agent"
          );

          return bannerList.map(({ bannerType, id, parentId, agyAccount }) => {
            const usernameKey =
              bannerType === "mbr"
                ? "userName"
                : parentId
                ? "agent"
                : "topAgent";

            return {
              agentId: id,
              [usernameKey]: agyAccount,
              displayName: `${
                bannerType === "mbr" ? this.$t("会员") : parentId ? this.$t("代理") : this.$t("总代")
              }${agyAccount}`,
            };
          });
        });
    },
    // 重置查询条件
    reset() {
      this.accountName = "";
      this.groupValue = [];
      this.startTime = "";
      this.endTime = "";
      this.typeValue = [];
      this.activityName = [];
      this.source = []
      this.memberType = this.membername = "";
      this.isTest = this.agyAccountStr = this.agentType = "";
      /* this.getChildAgent() */
      //下拉刷新还原
      /* this.tableData={}
        this.enterNum=0;
        this.listReq.pageSize=20;
        this.oldTableList=[]; */
    },
    getOtherData(api, params) {
      const parentAgentidList = params[1] || "";
      let url =
        "?pageSize=" +
          this.listReq.pageSize +
          "&pageNo=" +
          (params[4] || this.listReq.pageNo) +
          "&parentAgentid=" +
          parentAgentidList +
          "&agentId=" +
          (params[2] || "") +
          "&groupId=" +
          this.groupValue ||
        "" + "&userId=" + params[3] ||
        "" + "&userName=" + this.accountName ||
        "";
      url +=
        "&betStrTime=" +
        systemConfig.transferTimeByType(
          params[0] || this.startTime,
          this.timeType
        );
      url +=
        "&betEndTime=" +
        systemConfig.transferTimeByType(
          params[0] || this.endTime,
          this.timeType
        );
      this.$axios.get(api + url).then((resp) => {
        resp.data.page.list = resp.data.page.list.map((item) => {
          const arr = ["profits"];
          for (let key of arr) {
            item[key] = toThousands(item[key]);
          }
          return item;
        });
        this.otherTableDataList = resp.data.page.list;
      });
    },
    getData(api, params = []) {
      /* if(this.tableData.totalCount&&this.listReq.pageSize-20>=this.tableData.totalCount){//条数大于tableData.list总数，则停止
          return ;
        } */
      let url =
        "?pageSize=" + this.listReq.pageSize + "&pageNo=" + this.listReq.pageNo;
      if (this.pageFlag !== "mainPage") {
        url +=
          "&betStrTime=" +
          systemConfig.transferTimeByType(
            params[0] || this.startTime,
            this.timeType
          )+' 00:00:00';
        url +=
          "&betEndTime=" +
          systemConfig.transferTimeByType(
            params[0] || this.endTime,
            this.timeType
          )+' 23:59:59';
      }
      const parentAgentidList = params[1] || "";
      switch (this.pageFlag) {
        case "mainPage":
          url +=
            "&betStrTime=" + (this.startTime+' 00:00:00') + "&betEndTime=" + (this.endTime+' 23:59:59');
          break;
        case "allAgyPage":
          url +=
            "&groupIdList=" +
            this.groupValue +
            "&userName=" +
            this.accountName +
            "&activityIdList=" +
            this.activityName +
            "&catIdList=" +
            this.typeValue +
            "&agyAccountStr=" +
            (api.indexOf('findSubAgent')>-1?'':this.agyAccountStr) +
            "&isTest=" +
            this.isTest+
              "&source=" +
            this.source + `&isOnline=${this.isOnline}`;
          break;
        case "topAgyPage":
          if (this.isSubAgentShow) {
            console.log('0000000000000000000000000000000',this.currentLevel)
            url +=
              "&agyAccount=" +
              (this.currentLevel > 1
                ? this.currentLayer.agent
                : this.currentLayer.topAgent) +
              "&specifyAgyAccount=" +
              (api.indexOf('findSubAgent')>-1?'':this.agyAccountStr) +
              "&groupIdList=" +
              this.groupValue +
              "&userName=" +
              (this.accountName || "") +
              "&activityIdList=" +
              this.activityName +
              "&catIdList=" +
              this.typeValue+
              "&source=" +
            this.source + `&isOnline=${this.isOnline}`;
          } else {
            url +=
              "&agentId=" +
              (this.currentLayer.agentId || this.newAgentId || "") +
              "&groupIdList=" +
              this.groupValue +
              "&userName=" +
              this.accountName +
              "&activityIdList=" +
              this.activityName +
              "&catIdList=" +
              this.typeValue +
              "&source=" +
            this.source + `&isOnline=${this.isOnline}`;
          }
          break;
        case "vipPage":
          url +=
            "&loginName=" +
            this.membername +
            "&agentIdList=" +
            (params[2] || "") +
            "&groupIdList=" +
            this.groupValue +
            "&userId=" +
            (this.accountName + (params[3] ? params[3] : "") || "") +
            "&activityIdList=" +
            this.activityName +
            "&catIdList=" +
            this.typeValue +
            "&source=" +
            this.source + `&isOnline=${this.isOnline}`
          this.vipTmpUrl = url;
          break;
      }
      this.isLoading = true;
      this.$axios
        .get(api + url)
        .then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = ["profits", "bonusAmount"];
            for (let key of arr) {
              item[key] = toThousands(item[key]);
            }
            return item;
          });
          this.tableData = resp.data.page;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getMainPageData() {
      this.getData(systemConfig.urls.findBonusReportPage);
    },
    getAllAgyPageData() {
      this.getData(systemConfig.urls.findBonusGroupTopAgentReportPage, [
        this.tempTime,
      ]);
    },
    getAgentPageData() {
      this.isSubAgentShow = true;
      this.getData(systemConfig.urls.findSubAgent, [
        this.tempTime,
        this.tempTopAgyRow.topAgentId,
      ]);
    },
    getMemberData() {
      this.getData(systemConfig.urls.findBonusGroupUserTotal, [
        this.tempTime,
        this.tempTopAgyRow.topAgentId,
        this.tempAgyRow.agentId,
      ]);
    },
    getVipPageData() {
      this.getData(systemConfig.urls.findBonusPage, [
        this.tempTime,
        this.tempTopAgyRow.topAgentId,
        this.tempAgyRow.agentId,
        this.tempAccRow.userId,
      ]);
      // 获得汇总数据
      /* this.getOtherData(systemConfig.urls.findBonusGroupUserTotal, [this.tempTime, this.tempTopAgyRow.topAgentId, this.tempAgyRow.agentId, this.tempAccRow.userId, 1]) */
    },
    showMainPage(bool) {
      this.pageFlag = "mainPage";
      this.setWhichPageShow(bool);
      this.resetPagenation();
      this.getMainPageData();
    },
    showAllAgyPage(time, bool) {
      this.pageFlag = "allAgyPage";
      if (time) {
        this.tempTime = time;
        this.startTime = "";
        this.endTime = "";
      } else if (this.startTime && this.endTime) {
        this.tempTime = "";
      }
      this.setWhichPageShow(bool);
      this.resetPagenation();
      this.getAllAgyPageData();
    },
    handleTopAgentClick(row) {
      this.snapshots = [
        {
          ...row,
          displayName: `${this.$t('总代')}${row.topAgent}`,
        },
      ];
      this.showAgentPage(row, true);
    },
    handleAgentClick(row) {
      this.snapshots.push({
        ...row,
        displayName: `${this.$t('代理')}${row.agent}`,
      });
      this.showAgentPage(row, true);
    },
    showAgentPage(row, bool) {
      this.pageFlag = "topAgyPage";
      this.tempTopAgyRow = row ? row : this.tempTopAgyRow;
      this.setWhichPageShow(bool);
      this.resetPagenation();
      this.getAgentPageData();
      if (this.currentLevel > 1) {
        this.findSubordinateBonus();
      }
    },
    findSubordinateBonus() {
      const { agent } = this.currentLayer;

      this.viewTableData = [];
      this.$axios
        .get(systemConfig.urls.findSubordinateBonus, {
          params: {
            agyAccount: agent,
            betStrTime: systemConfig.transferTimeByType(
              this.tempTime || this.startTime,
              this.timeType
            )+' 00:00:00',
            betEndTime: systemConfig.transferTimeByType(
              this.tempTime|| this.endTime,
              this.timeType
            )+' 23:59:59',
            agyAccount:this.currentLevel > 1? this.currentLayer.agent: this.currentLayer.topAgent,
            groupIdList:this.groupValue,
            userName:this.accountName || "",
            activityIdList:this.activityName.length?this.activityName.join(','):'',
            catIdList:this.typeValue.length?this.typeValue.join(','):'',
            source:this.source,
            isOnline:this.isOnline,
          },
        })
        .then(({ data }) => {
          this.viewTableData = data.page;
        });
    },
    showMemberPage(id) {
      this.isSubAgentShow = false;
      this.newAgentId = id;
      this.tempAgyRow = this.currentLayer;
      this.setWhichPageShow(true);
      this.resetPagenation();
      this.getMemberData();
    },
    handleMbrClick(row) {
      this.snapshots.push({
        ...row,
        displayName: `${this.$t('会员')}${row.userName}`,
      });
      this.showMemberDetailPage(row, true);
    },
    showMemberDetailPage(row, bool) {
      this.pageFlag = "vipPage";
      this.tempAccRow = row ? row : this.tempAgyRow;
      this.setWhichPageShow(bool);
      this.resetPagenation();
      this.getVipPageData();
    },
    getShowVipPage(row, bool) {
      this.resetPagenation();
      this.getVipPageData();
    },
    setWhichPageShow(bool) {
      let arr = ["mainPage", "allAgyPage", "topAgyPage", "agyPage", "vipPage"];
      arr.map((item) => {
        //从哪来
        if (this[item] && this.pageFlag != "vipPage") {
          //纪录非第五层当前展示层的上一层级
          let index = arr.indexOf(item);
          if (bool) {
            index = index >= 2 ? index - 2 : 0;
          }
          this.beforeToCurPage = arr[index];
        } else if (this[item] && this.pageFlag == "vipPage") {
          //进入第五层
          this.beforeToCurPage = item;
        }
        //到哪去
        if (this.pageFlag == item) {
          this[item] = true;
        } else {
          this[item] = false;
        }
      });
    },
    closeBtn(clear, bool) {
      /* if(!clear){ */
      this.agentType = this.isTest = this.memberType = this.membername = this.agyAccountStr =
        "";
      /* } */
      this.snapshots = [];
      this.listReq.pageNo = 1;
      this.startTime = systemConfig.getCurrentMonth()[0];
      this.endTime = systemConfig.getCurrentMonth()[1];
      this.showMainPage(bool);
    },
    returnBtn() {
      this.listReq.pageNo = 1;
      switch (this.beforeToCurPage) {
        case "mainPage":
          this.closeBtn("clear", true);
          break;
        case "allAgyPage":
          this.showAllAgyPage("", true);
          break;
        case "topAgyPage":
          this.showAgentPage("", true);
          //this.pageFlag = 'allAgyPage'
          //this.topAgyPage = false
          //this.allAgyPage = true
          //this.getAllAgyPageData()
          break;
        case "agyPage":
          this.showMemberPage("", true);
          //this.pageFlag = 'topAgyPage'
          //this.agyPage = false
          //this.topAgyPage = true
          break;
        case "vipPage":
          this.showMemberDetailPage("", true);
          //this.pageFlag = 'agyPage'
          //this.vipPage = false
          //this.agyPage = true
          //this.getMemberData()
          break;
      }
    },
    resetPagenation() {
      this.listReq.pageNo = 1;
      //this.listReq.pageSize = 10
    },
    twoNumber(row, column, cellValue) {
      return systemConfig.saveTwoNumber(cellValue);
    },
    /* scrollToTop(){
        this.$scrToBottom.scrollToTop();

      } */
  },
  watch: {
    vipPage(val) {
      if (!val) {
        this.isExporting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tableToTop {
  position: absolute;
  right: 82px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
.tableNow {
  min-height: 620px;
}
.search {
  .div-search-btn {
    bottom: 12px !important;
  }
}
</style>

