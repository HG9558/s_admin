<template>
  <div class="manage-pandect">
    <div class="gonggao">
      <div>
        <div v-show="unRead > 0" class="unRead pointer" @click="showNotice">{{unRead}}</div>
        <div class="left-voice pointer" @click="showNotice"><span class="iconfont icon-voice"></span><span class="notice2">{{ $t('系统通知') }} : </span></div>
        <marquee direction="left" onmouseover="this.stop();" onmouseout="this.start();">
          <span style="color:rgb(102, 102, 102); font-size: 13px;" v-for="(item, index) in voiceData" :key="index">{{item.noticeContent}}&nbsp;&nbsp;&nbsp;&nbsp;{{filterTime(item.createTime)}}</span>
        </marquee>
      </div>
      <el-button type="text" class="more" @click="showNotice">{{ $t('更多公告') }}</el-button>
    </div>
    <div class="collect">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="collect-item">
            <span>{{ $t('我的收藏') }} :&nbsp;&nbsp;</span>
            <el-button v-show="originLabelList.length > 0" type="primary" plain v-for="(item, index) in originLabelList" :key="index" @click="jumpPath(item.url)">{{item.name}}
            </el-button>
            <span v-show="originLabelList.length === 0">{{ $t('暂无收藏标签') }}</span>
            <el-button style="margin-left: 5px" border @click="showLabel" icon="el-icon-edit">{{ $t('编辑') }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="collect-item">
            <span>{{ $t('最近访问') }} :&nbsp;&nbsp;</span>
            <el-button type="primary" plain v-for="(item, index) in visitViews" :key="index" @click="jumpPath(item.path)">{{ $t(item.title) }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="day-title">
      <span>{{ $t('数据总览') }}({{curlabel}})</span>
      <span class="select-date">
        <StartAndEndTimeSelector type="date" ref="searchTime" :selections="timeSelections" :startTime.sync="startTime" :endTime.sync="endTime" :label.sync="curlabel" :labelBool="true" />
      </span>
      <el-button class="search-button" type="primary" @click="getCurData">{{ $t('查询') }}</el-button>
    </div>
    <div class="today-data">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[0] && todayData[0].count || 0}}</span>
            <span class="data-title">{{ $t('活跃会员') }}</span>
            <span class="iconfont icon-active data-icon"></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[1] && todayData[1].count || 0}}</span>
            <span class="data-title">{{ $t('新增会员') }}</span>
            <span class="iconfont icon-register data-icon"></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[2] && todayData[2].count || 0}}</span>
            <span class="data-title">{{ $t('登录会员') }}</span>
            <span class="iconfont icon-memberManage data-icon"></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[3] && todayData[3].count || 0}}</span>
            <span class="data-title">{{ $t('存款会员') }}</span>
            <span class="iconfont icon-2 data-icon"></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[4] && todayData[4].count || 0}}</span>
            <span class="data-title">{{ $t('总存款') }}</span>
            <span class="iconfont icon-5 data-icon"></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-box">
            <span class="data-amount">{{todayData[5] && todayData[5].count || 0}}</span>
            <span class="data-title">{{ $t('总提款') }}</span>
            <span class="iconfont icon-wallet data-icon"></span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="day-title">
      <span>{{ $t('图表数据总览') }}({{curlabel}})</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="pd20" v-loading="loading">
          <div class="day-title">
            <span>{{ $t('存取款') }}</span>
          </div>
          <div id="money"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="pd20" v-loading="loading">
          <div class="day-title">
            <span>{{ $t('新会员转换') }}</span>
          </div>
          <div id="member"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:10px">
      <el-col :span="12">
        <div class="pd20" v-loading="loading">
          <div class="day-title">
            <span>{{ $t('投注与派彩') }}</span>
          </div>
          <div id="payout"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="pd20" v-loading="loading">
          <div class="day-title">
            <span>{{ $t('活跃会员') }}</span>
          </div>
          <div id="active"></div>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="my">
      <el-button :class="[hightLight==index?'hightLight': '','here']" v-for="(item,index) in datType" :key="index" @click="getData(index,item.type)">&nbsp;{{item.lable}}&nbsp;
      </el-button>
    </div> -->
    <el-table max-height="480" type="flex" :data="sevenDayData" border fit highlight-current-row v-loading="loading" style="margin-top:20px">
      <el-table-column prop="startday" :label="$t('日期')" align="center"></el-table-column>
      <el-table-column prop="deposits" :label="$t('总存款')" align="center"></el-table-column>
      <el-table-column prop="depositCount" :label="$t('总存款人数')" align="center"></el-table-column>
      <el-table-column prop="depositOrderCount" :label="$t('总存款笔数')" align="center"></el-table-column>
      <el-table-column prop="withdraws" :label="$t('总取款')" align="center"></el-table-column>
      <el-table-column prop="withdrawCount" :label="$t('总取款人数')" align="center"></el-table-column>
      <el-table-column prop="withdrawOrderCount" :label="$t('总提款笔数')" align="center"></el-table-column>
      <el-table-column prop="newMbrs" :label="$t('新增会员')" align="center"></el-table-column>
      <el-table-column prop="newDeposits" :label="$t('新会员存款人数')" align="center"></el-table-column>
      <el-table-column prop="newDepositAmount" :label="$t('新会员存款金额')" align="center"></el-table-column>
      <el-table-column prop="newDepositOrderCount" :label="$t('新会员存款笔数')" align="center"></el-table-column>
      <el-table-column prop="newWithdrawCount" :label="$t('新会员提款人数')" align="center"></el-table-column>
      <el-table-column prop="newWithdrawAmount" :label="$t('新会员提款金额')" align="center"></el-table-column>
      <el-table-column prop="newWithdrawOrderCount" :label="$t('新会员提款笔数')" align="center"></el-table-column>
      <el-table-column prop="payouts" :label="$t('总派彩')" align="center"></el-table-column>
      <el-table-column prop="validBets" :label="$t('总有效投注')" align="center"></el-table-column>
      <el-table-column prop="activeMbrs" :label="$t('活跃会员')" align="center"></el-table-column>
      <el-table-column prop="totalMbrs" :label="$t('总会员')" align="center"></el-table-column>
    </el-table>
    <el-dialog :title="$t('系统公告')" :visible.sync="systemNoticeShow" width="70%" @close="closenotice">
      <el-row class="second-header" style="">
        <el-col :span="2" class="pointer" style="line-height: 40px" @click.native="memoTabClick('read')" :class="[flag1? 'active': '']">{{ $t('已读') }}
        </el-col>
        <el-col :span="2" class="pointer" style="line-height: 40px" @click.native="memoTabClick('unRead')" :class="[flag2? 'active': '']">{{ $t('未读') }}
        </el-col>
        <span v-show="unRead > 0" class="unRead2">{{unRead}}</span>
      </el-row>
      <!-- <div class="sys-notice" v-for="(item, index) in noticeData.list" :key="index">
        <span class="detail-time">{{filterTime(item.createTime)}}</span><span class="iconfont icon-downnotice"></span>
        <span class="detail-content">{{item.noticeContent}}</span>
      </div> -->
      <div class="sys-notice" v-for="(item, index) in noticeData.list" :key="index" :class="index === noticeData.list.length-1? 'notice-b': ''">
        <p class="p-time">{{filterTime(item.createTime)}}</p>
        <!-- <span v-show="item.noticeContent.length > 100" class="iconfont icon-downnotice pointer" @click="showMore"></span> -->
        <p class="p-content">{{item.noticeContent}}</p>
      </div>
      <div class="pagination">
        <el-pagination @size-change="handleNoticeSizeChange" @current-change="handleNoticeCurrentChange" :current-page="noticePageNo" :page-sizes="[5, 10]" :page-size="noticePageSize" layout="total, sizes, prev, pager, next, jumper" :total="noticeData.totalCount">
        </el-pagination>
      </div>
      <div style="height: 20px;"></div>
    </el-dialog>
    <el-dialog :title="$t('编辑标签')" :visible.sync="labelShow" width="70%" @close="closeLabel">
      <p style="margin-left: 30px">({{ $t('提示') }}：{{ $t('最多选取5个标签') }})</p>
      <el-checkbox-group style="margin-top: 10px" v-if="allLabelList.length > 0" v-model="checkedLabelList" :max="5">
        <el-checkbox class="new-wid-150" style="margin: 0 0 10px 30px" border v-for="(label, index) in allLabelList" :label="label.menuId" :key="index">{{label.name}}
        </el-checkbox>
      </el-checkbox-group>
      <p style="margin-left: 30px" v-else>{{ $t('标签列表加载中') }}...</p>
      <div class="div-submit-btn">
        <el-button @click="closeLabel">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveLabel">{{ $t('确定') }}</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script type="text/babel">
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
import systemConfig from "../config/config.js";
// 日期组件
import StartAndEndTimeSelector from "../components/StartAndEndTimeSelector";
import moment from "moment";
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
// 引入报表类型
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
export default {
  components: {
    StartAndEndTimeSelector,
  },
  data() {
    return {
      voiceData: [{ noticeContent: this.$t('暂无系统通知') }],
      charts1: "",
      charts2: "",
      charts3: "",
      charts4: "",
      sevenDayData: [],
      todayData: [],
      systemNoticeShow: false,
      flag: "read",
      flag1: true,
      flag2: false,
      noticePageNo: 1,
      noticePageSize: 5,
      noticeData: {},
      unRead: 0,
      labelShow: false,
      checkedLabelList: [],
      originLabelList: [],
      allLabelList: [],
      // datType: [
      //   { lable: "日", type: 1 },
      //   { lable: "月", type: 2 },
      // ],
      hightLight: 0,
      timeSelections: [
        {
          label: this.$t("近7日"),
          value: "lastSevenDays",
        },
        {
          label: this.$t("近30日"),
          value: "lastThirtyDays",
        },
        {
          label: this.$t("近1年"),
          value: "lastOneYears",
        },
        {
          label: this.$t("近10年"),
          value: "lastTenYears",
        },
      ],
      startTime: moment().subtract(6, "day").format("YYYY-MM-DD"),
      endTime: moment().format("YYYY-MM-DD"),
      curlabel: this.$t("近7日"),
    };
  },
  created() {
    this.getData();
    this.getNotice();
    this.getCollect();
    this.getToday();
  },
  mounted() {
    this.$nextTick(function () {
      this.drawPie("money", "member", "payout", "active");
    });
  },
  updated() {
    if (!this.charts1) {
      this.charts1 = echarts.init(document.getElementById("money"));
    }
    if (!this.charts2) {
      this.charts2 = echarts.init(document.getElementById("member"));
    }
    if (!this.charts3) {
      this.charts3 = echarts.init(document.getElementById("payout"));
    }
    if (!this.charts4) {
      this.charts4 = echarts.init(document.getElementById("active"));
    }
    this.charts1.setOption(this.option1);
    this.charts2.setOption(this.option2);
    this.charts3.setOption(this.option3);
    this.charts4.setOption(this.option4);
  },
  methods: {
    showMore() {},
    getToday() {
      const params = this.toggleData(this.startTime, this.endTime);
      this.$axios
        .get(systemConfig.urls.findHomePageCounEx, { params })
        .then((res) => {
          this.todayData = res.data.data;
        });
    },
    toggleData(startTime, endTime) {
      return {
        startTime: startTime,
        endTime: moment(endTime).add(1, "day").format("YYYY-MM-DD"),
      };
    },
    saveLabel() {
      this.$axios
        .post(systemConfig.urls.baseMenuAdd, { menuIds: this.checkedLabelList })
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("标签编辑成功"),
          });
          this.closeLabel();
          this.getCollect();
        });
    },
    closeLabel() {
      this.labelShow = false;
      this.checkedLabelList = [];
    },
    showLabel() {
      this.labelShow = true;
      // 获取label菜单
      this.originLabelList.map((item) => {
        this.checkedLabelList.push(item.menuId);
      });
      this.$axios.get(systemConfig.urls.baseMenuList).then((res) => {
        this.allLabelList = res.data.data;
      });
    },
    jumpPath(path) {
      this.$router.push({ path: path });
    },
    handleNoticeSizeChange(val) {
      this.noticePageNo = 1;
      this.noticePageSize = val;
      if (this.flag === "read") {
        // 获取已读
        this.getNoticeDetail(true);
      } else {
        // 获取未读
        this.getNoticeDetail(false);
      }
    },
    handleNoticeCurrentChange(val) {
      this.noticePageNo = val;
      if (this.flag === "read") {
        // 获取已读
        this.getNoticeDetail(true);
      } else {
        // 获取未读
        this.getNoticeDetail(false);
      }
    },
    memoTabClick(flag) {
      this.flag = flag;
      if (this.flag === "read") {
        this.flag1 = true;
        this.flag2 = false;
        // 获取已读
        this.getNoticeDetail(true);
      } else {
        this.flag1 = false;
        this.flag2 = true;
        // 获取未读
        this.getNoticeDetail(false);
      }
      this.resetPage();
    },
    resetPage() {
      this.noticePageNo = 1;
      this.noticePageSize = 5;
    },
    closenotice() {
      this.systemNoticeShow = false;
      this.flag === "read";
    },
    showNotice() {
      this.systemNoticeShow = true;
      // 获取已读公告
      this.getNoticeDetail(true);
    },
    filterTime(str) {
      if (!str) {
        return "";
      }
      return str.slice(0, str.length - 2);
    },
    drawPie(id1, id2, id3, id4) {
      this.charts1 = echarts.init(document.getElementById(id1));
      this.charts1.setOption(this.option1);
      this.charts2 = echarts.init(document.getElementById(id2));
      this.charts2.setOption(this.option2);
      this.charts3 = echarts.init(document.getElementById(id3));
      this.charts3.setOption(this.option3);
      this.charts4 = echarts.init(document.getElementById(id4));
      this.charts4.setOption(this.option4);
    },
    getData() {
      // this.hightLight = index || 0;
      const type =
        this.curlabel === this.$t("近1年") ? 2 : this.curlabel === this.$t("近10年" )? 3 : 1;
      let params = {
        type: type,
        ...this.toggleData(this.startTime, this.endTime),
      };
      this.$store.state.searchLoading = true;
      this.$axios
        .get(systemConfig.urls.mamberReportEx, { params })
        .then((res) => {
          this.$store.state.searchLoading = false;
          this.sevenDayData = res.data.page;
        });
    },
    getNotice() {
      this.$axios.get(systemConfig.urls.baseNoticeList).then((res) => {
        if (res.data.page.length > 0) {
          this.voiceData = res.data.page;
          this.voiceData.forEach((item) => {
            if (!item.isRead) {
              this.unRead++;
            }
            item += "--";
          });
        }
      });
    },
    getNoticeDetail(flag) {
      let url =
        "?pageNo=" +
        this.noticePageNo +
        "&pageSize=" +
        this.noticePageSize +
        "&isRead=" +
        flag;
      this.$axios.get(systemConfig.urls.baseNoticePage + url).then((res) => {
        this.noticeData = res.data.page;
        if (this.flag === "unRead") {
          let ids = [];
          this.noticeData.list.map((item) => {
            ids.push(item.id);
          });
          this.unRead -= ids.length;
          this.$axios
            .post(systemConfig.urls.baseNoticeChangeStatus, { ids: ids })
            .then((res) => {
              // 发送未读的id
            });
        }
      });
    },
    getCollect() {
      this.$axios.get(systemConfig.urls.baseMenuCollectList).then((res) => {
        this.originLabelList = res.data.data;
      });
    },
    getCurData() {
      if (
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
      ) {
        this.$message({
          type: "warning",
          message: this.$t("起始时间不能大于结束时间"),
        });
        return;
      }
      this.getData();
      this.getToday();
    },
  },
  computed: {
    visitViews() {
      let visitArr = JSON.parse(window.localStorage.getItem("visitedViews"));
      if (visitArr) {
        let len = visitArr.length;
        if (len > 4) {
          visitArr = visitArr.slice(len - 4, len);
        }
        return visitArr;
      } else {
        return [];
      }
    },
    loading() {
      return this.$store.state.searchLoading;
    },
    dayData() {
      let arr = [];
      this.sevenDayData.map((item) => {
        let tempArr = item.startday.split("-");
        let tempStr;
        if (tempArr[2]) {
          tempStr = tempArr[1] + "/" + tempArr[2];
        } else if (tempArr[1]) {
          tempStr = tempArr[0] + "/" + tempArr[1];
        } else {
          tempStr = tempArr[0];
        }
        arr.push(tempStr);
      });
      return arr.reverse();
    },
    /* 总存款*/
    sheetData1() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.deposits);
      });
      return arr.reverse();
    },
    /* 总提款 */
    sheetData2() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.withdraws);
      });
      return arr.reverse();
    },
    /* 新增会员 */
    sheetData3() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.newMbrs);
      });
      return arr.reverse();
    },
    /* 新增会员并存款 */
    sheetData4() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.newDeposits);
      });
      return arr.reverse();
    },
    /** 投注 */
    sheetData5() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.validBets);
      });
      return arr.reverse();
    },
    /** 派彩 */
    sheetData6() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.payouts);
      });
      return arr.reverse();
    },
    /** 活跃会员 */
    sheetData7() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.activeMbrs);
      });
      return arr.reverse();
    },
    /** 所有会员 */
    sheetData8() {
      let arr = [];
      this.sevenDayData.map((item) => {
        arr.push(item.totalMbrs);
      });
      return arr.reverse();
    },
    option1() {
      let that = this;
      let option = {
        color: ["#3aa1ff", "#4ecb73"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: [this.$t("存款"), this.$t("取款")],
          bottom: 0,
        },
        xAxis: [
          {
            type: "category",
            data: that.dayData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: this.$t("存款"),
            type: "bar",
            data: that.sheetData1,
            barGap: "0",
          },
          {
            name: this.$t("取款"),
            type: "bar",
            data: that.sheetData2,
            barGap: "0",
          },
        ],
      };
      return option;
    },
    option2() {
      let that = this;
      var option = {
        color: ["#3aa1ff", "#4ecb73"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: [this.$t("注册会员"), this.$t("首充会员")],
          bottom: 0,
        },
        xAxis: [
          {
            type: "category",
            data: that.dayData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: this.$t("注册会员"),
            type: "line",
            symbol: "circle",
            symbolSize: 14,
            data: that.sheetData3,
          },
          {
            name: this.$t("首充会员"),
            type: "line",
            symbol: "circle",
            symbolSize: 14,
            data: that.sheetData4,
          },
        ],
      };
      return option;
    },
    option3() {
      let that = this;
      var option = {
        color: ["#3aa1ff", "#4ecb73"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [this.$t("投注"), this.$t("派彩")],
          bottom: 0,
        },
        xAxis: [
          {
            type: "value",
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            data: that.dayData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        series: [
          {
            name: this.$t("投注"),
            type: "bar",
            data: that.sheetData5,
            barGap: "0",
          },
          {
            name: this.$t("派彩"),
            type: "bar",
            data: that.sheetData6,
            barGap: "0",
          },
        ],
      };
      return option;
    },
    option4() {
      let that = this;
      var option = {
        color: ["#3aa1ff", "#4ecb73"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [this.$t("全部"), this.$t("活跃")],
          bottom: 0,
        },
        xAxis: [
          {
            type: "category",
            data: that.dayData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: this.$t("全部"),
            areaStyle: { normal: { color: "#3aa1ff" } },
            type: "line",
            data: that.sheetData8,
            symbol: "circle",
            symbolSize: 14,
          },
          {
            name: this.$t("活跃"),
            areaStyle: { normal: { color: "#4ecb73" } },
            type: "line",
            data: that.sheetData7,
            symbol: "circle",
            symbolSize: 14,
          },
        ],
      };
      return option;
    },
  },
  watch: {
    // curlabel() {
    //   this.curlabelBool = false
    //   this.getCurData()
    // },
    // startTime() {
    //   const bool = this.curlabel === '实时日期'
    //   if (!bool) return
    //   this.getCurData()
    // },
    // endTime() {
    //   const bool = this.curlabel === '实时日期'
    //   if (!bool) return
    //   this.getCurData()
    // }
  },
};
</script>

<style lang="scss">
.manage-pandect {
  width: 100%;
  padding: 10px 20px 0 20px;
  min-width: 1000px;
  .gonggao {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
    background: #ecf5ff;
    border-radius: 4px;
    .left-voice {
      z-index: 2;
      left: 20px;
      line-height: 40px;
      .icon-voice {
        font-size: 20px;
        margin-right: 4px;
        color: #666666;
      }
      .notice2 {
        font-size: 13px;
        vertical-align: top;
        color: #666666;
      }
    }
    marquee {
      // position: absolute;
      cursor: pointer;
      z-index: 1;
      width: 800px;
      span {
        margin-right: 40px;
      }
    }
    .more {
      z-index: 2;
    }
  }
  .collect {
    margin-top: 10px;
    .collect-item {
      border: 1px solid rgb(224, 224, 224);
      border-radius: 4px;
      height: 50px;
      line-height: 50px;
      text-align: left;
      padding-left: 20px;
      .el-button {
        padding: 6px 6px;
      }
      @media screen and (min-width: 1440px) {
        .el-button {
          padding: 6px 10px;
        }
      }
      @media screen and (min-width: 1600px) {
        .el-button {
          padding: 6px 16px;
        }
      }
    }
  }
  .day-title {
    line-height: 40px;
    height: 40px;
    border-bottom: 1px solid rgb(224, 224, 224);
    margin-top: 10px;
    padding-bottom: 10px;
    > span {
      font-size: 16px;
      font-weight: bold;
      // display: inline-block;
      float: left;
    }
    .select-date {
      width: 780px;
      margin-left: 15px;
      .quick-select-options {
        top: 13px;
        left: 425px;
      }
      /deep/ .el-input {
        left: 250px;
      }
    }
    .search-button {
      margin-top: 5px;
    }
  }
  .today-data {
    padding: 10px 0;
    .data-box:hover {
      background: #e6f0fa;
    }
    .data-box {
      position: relative;
      height: 58px;
      background: #f0f3f9;
      .data-amount {
        position: absolute;
        font-size: 13px;
        font-weight: bold;
        left: 10px;
        top: 10px;
        color: rgb(51, 51, 51);
      }
      .data-icon {
        position: absolute;
        right: 20px;
        transform: translateY(-50%);
        top: 50%;
        font-size: 26px;
        color: #b5b4c2;
      }
      .data-title {
        position: absolute;
        font-size: 13px;
        left: 10px;
        bottom: 10px;
        color: rgb(102, 102, 102);
      }
    }
  }

  #money,
  #member,
  #payout,
  #active {
    height: 390px;
    &:first-child {
      margin: 0 auto;
    }
  }
  .my {
    margin-top: 15px;
    text-align: right;
    .hightLight {
      background-color: rgb(58, 161, 255);
      color: white;
    }
  }
}

.pd20 {
  padding: 10px 20px;
  margin-top: 10px;
  border: 1px solid rgb(224, 224, 224);
}

.second-header {
  height: 40px;
  font-size: 14px;
  font-weight: bold;
  color: rgb(75, 79, 86);
  background: rgb(246, 247, 248);
  border: 1px solid rgb(224, 224, 224);
  border-bottom: none;
  text-align: center;
  box-sizing: none;
  position: relative;
  .active {
    color: rgb(68, 126, 217);
    background: #fff;
    border-bottom: none;
  }
}

.unRead {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  padding: 2px 5px;
  position: absolute;
  z-index: 3;
  left: 20px;
}

.unRead2 {
  padding: 0px 5px;
  top: 4px;
  line-height: 16px;
  z-index: 3;
  position: absolute;
  left: 120px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
}

.sys-notice {
  position: relative;
  border: 1px solid rgb(224, 224, 224);
  border-bottom: none;
  padding: 10px 0;
  .p-time {
    color: #999;
    margin-left: 10px;
  }
  .p-content {
    margin: 0 10px;
    word-break: break-all;
    color: #4b4f56;
    font-size: 14px;
    /* overflow: hidden; */
    /* white-space: nowrap; */
    /* text-overflow: ellipsis;*/
  }
  .icon-downnotice {
    top: 10px;
    right: 10px;
    font-size: 24px;
    position: absolute;
    transform: rotateZ(-90deg);
  }
}

.notice-b {
  border-bottom: 1px solid rgb(224, 224, 224);
}

.is-reverse {
  transform: rotateZ(0);
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.new-wid-150 {
  // width: 130px !important;
}
</style>
