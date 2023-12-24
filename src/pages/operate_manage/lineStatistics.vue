<template>
  <div class="game-data-sheet">
    <!--查询条件-->
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :left="40"
            :selections="timeSelections"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
          />
        </div>
      </div>
      <div class="div-search-btn" style="top: 58%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" class="wid-80"
          >{{ $t('查询') }}</el-button
        >
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div v-loading="loading" style="min-height:570px;">
      <div class="staticAnalysis">
        <div
          class="eachOne"
          v-for="(item, index) in statisticalData"
          :key="index"
        >
          <p class="up">
            <span class="l"
              ><i :class="['icon', item.icon]"></i><i>{{ item.name }}</i></span
            >
            <span class="r"
              >{{ $t('合计') }}：{{ item.sucRateSum }}%--{{ item.totalNumSum }}{{ $t('笔') }}</span
            >
          </p>
          <ul>
            <li v-for="(inItem, inIndex) in item.list" :key="inIndex">
              <p>{{ inItem.payname }}</p>
              <p class="p2">
                <span class="l f12">{{ inItem.totalNum }}{{ $t('笔') }}</span>
                <span class="r f12">{{ inItem.sucRate }}%</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="intTime">
        <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
        <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import systemConfig from "../../config/config.js";
import queryStore from "../../mixins/queryStore";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import Mixin from '@/mixins/loadTime'

export default {
  name: "moneySheet",
  mixins: [Mixin, queryStore(["startTime", "endTime"])],
  components: { StartAndEndTimeSelector },
  data() {
    return {
      timeSelections: [
        /* {
              label:'30分',
              value:'halfHour',
              bool:true
          },
          {
              label:'1小时',
              value:'oneHour',
              bool:true
          },
          {
              label:'6小时',
              value:'sixHour',
              bool:true
          }, */
        {
          label: this.$t("今日"),
          value: "today"
        },
        {
          label: this.$t("昨日"),
          value: "yesterday"
        },
        {
          label: this.$t("本周"),
          value: "currentWeek"
        },
        {
          label: this.$t("上周"),
          value: "lastWeek"
        },
        {
          label: this.$t("本月"),
          value: "currentMonth"
        }
      ],
      startTime: "",
      endTime: "",
      listReqInner: {
        pageSize: 15,
        pageNo: 1,
        pageSizeArr: [5, 10, 15, 20, 50, 100]
      },
      statisticalData: {},
      loading: false
    };
  },
  created() {
    this.initTime();
  },
  methods: {
    initTime() {
      /* this.endTime = systemConfig.getSubCurNowTime(0.5)[1];
      this.startTime = systemConfig.getSubCurNowTime(0.5)[0]; */
      this.startTime = systemConfig.getToday();
      this.endTime = systemConfig.getToday();
      this.search();
    },
    search() {
      this.getCurrentRecodeTime()
      //统计分析页
      this.statisticalData = {};
      if (
        (this.startTime && !this.endTime) ||
        (!this.startTime && this.endTime)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入完整的时间段")
        });
        return;
      }
      if (!this.startTime && !this.endTime) {
        this.statisticalData = {};
        this.$message({
          type: "warning",
          message: this.$t("请选择查询时间")
        });
        return;
      }
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("起始时间不能大于结束时间")
          });
          return;
        }
      }
      if (!this.startTime) {
        this.startTime = "";
      }
      if (!this.endTime) {
        this.endTime = "";
      }
      let params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59"
      };
      this.getStatistData(params);
      return;
    },
    getStatistData(params) {
      this.loading = true;
      this.$axios
        .get(systemConfig.urls.lineSummary, { params })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          let arr = res.data.page;
          arr.map(val => {
            switch (val.type) {
              case "1": {
                //支付宝
                val["icon"] = "alipay_icon";
                val["name"] = this.$t("支付宝");
                break;
              }
              case "2": {
                //微信
                val["icon"] = "wechat_icon";
                val["name"] = this.$t("微信");
                break;
              }
              case "3": {
                //网银支付
                val["icon"] = "internetBank_icon";
                val["name"] = this.$t("网银支付");
                break;
              }
              case "4": {
                //极速支付
                val["icon"] = "fast_icon";
                val["name"] = this.$t("极速支付");
                break;
              }
              case "5": {
                //其他支付
                val["icon"] = "other_icon";
                val["name"] = this.$t("其他支付");
                break;
              }
              case "6": {
                //其他支付
                val["icon"] = "crPay_icon";
                val["name"] = this.$t("加密货币");
                break;
              }
              // case "15": {
              //   //极速存取款
              //   val["icon"] = "other_icon";
              //   val["name"] = "极速存取款";
              //   break;
              // }
            }
          });
          this.loading = false;
          this.statisticalData = arr;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    reset() {
      this.initTime();
      this.statisticalData = {};
      this.loading = false;
    }
  },
  watch: {
    accountId(val) {
      if (val === 0) {
        this.membername = "";
      }
    }
  }
};
</script>
<style lang="scss">
.pd30 {
  padding: 30px;
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
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  .statistics-cell {
    position: relative;
    flex: 1;
    margin-right: 20px;
    height: 58px;
    background: #f0f3f9;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      background: #e6f0fa;
    }
    h3 {
      position: absolute;
      bottom: 8px;
      left: 10px;
    }
    .money {
      position: absolute;
      top: 10px;
      left: 10px;
      font-weight: bold;
      font-size: 16px;
    }
    .icon-wenhao {
      font-size: 14px;
      cursor: pointer;
    }
    .icon-5,
    .icon-wallet,
    .icon-hongli,
    .icon-paicai,
    .icon-caijin,
    .icon-yinli,
    .el-icon-sold-out {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #b5b4c2;
      font-size: 24px;
    }
  }
}
.tableToTop {
  position: absolute;
  right: 82px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
.staticAnalysis {
  position: relative;
  margin-top: 20px;
  .goback {
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
  .eachOne {
    margin-top: 10px;
    font-weight: bolder;
    .up {
      padding-bottom: 10px;
      border-bottom: 1px solid rgb(220, 220, 220);
      line-height: 18px;
      height: 18px;
      margin-bottom: 10px;
    }
    .f12 {
      font-size: 12px;
    }
    .l {
      float: left;
    }
    .r {
      float: right;
    }
    ul {
      padding-left: 10px;
      margin-top: 15px;
      li {
        display: inline-block;
        min-width: 150px;
        height: 60px;
        background-color: #f2f3f8;
        border-radius: 5px;
        margin: 0 20px 10px 0;
        padding: 5px;
        box-sizing: border-box;
        p {
          height: 25px;
          line-height: 25px;
          color: #999999;
          text-align: center;
        }
        .p2 {
          color: #333333;
          box-sizing: border-box;
          padding-left: 15px;
          padding-right: 15px;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
