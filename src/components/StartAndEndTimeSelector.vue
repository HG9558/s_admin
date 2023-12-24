<template>
  <div style="position: relative;" :style="{ width: width + 'px' }">
    <ul class="quick-select-options" :style="{ left: left + 'px' }">
      <li :class="{ active: item.value === activeType }" v-for="(item, index) in selections" :key="index" @click="handleTimeQuickSelect(item.value, item.label)">
        {{ item.label }}
      </li>
    </ul>
    <el-date-picker class="date-first" v-model="startTimeObserver" :disabled="disabled" :value-format="valueFormat" :type="type" :placeholder="$t('开始时间')" @focus="oldTime = startTime" @blur="oldTime !== startTime && $refs.endTime.focus()">
    </el-date-picker>
    <el-date-picker class="date-second" ref="endTime" :disabled="disabled"  v-model="endTimeObserver" :value-format="valueFormat" :type="type" :placeholder="$t('结束时间')">
    </el-date-picker>
  </div>
</template>

<script>
/**
 * 实例：
 * selections: [
 *  label: '本月',
 *  value: 'currentMonth'
 * ]
 */
import systemConfig from "../config/config";
import moment from "moment";
export default {
  props: {
    type: {
      type: String,
      default: "datetime",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selections: {
      type: Array,
      default() {
        return [
          {
            label: this.$t("今日"),
            value: "today",
          },
          {
            label: this.$t("昨日"),
            value: "yesterday",
          },
          {
            label: this.$t("前日"),
            value: "beforeYesterday",
          },
          {
            label: this.$t("本周"),
            value: "currentWeek",
          },
          {
            label: this.$t("上周"),
            value: "lastWeek",
          }
        ];
      },
    },
    labelBool: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Number
    },
    width: {
      type: Number
    },
    startTime: String,
    endTime: String,
    defaultTypeP: '',
  },
  data() {
    return {
      oldTime: null,
      defaultType: '',
    };
  },
  computed: {
    timeRangeMapper() {
      const mapper = {};
      this.selections.map((item) => {
        let createTimeFrom, createTimeTo;
        switch (item.value) {
          case "halfHour":
            var [from, to] = systemConfig.getSubCurNowTime(0.5);
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "oneHour":
            var [from, to] = systemConfig.getSubCurNowTime(1);
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "sixHour":
            var [from, to] = systemConfig.getSubCurNowTime(6);
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "today":
            createTimeFrom = createTimeTo = systemConfig.getToday();
            break;
          case "yesterday":
            createTimeFrom = createTimeTo = systemConfig.getYesterday();
            break;
          case "beforeYesterday":
            createTimeFrom = createTimeTo = systemConfig.getBeforeYesterday();
            break;
          case "currentWeek":
            var [from, to] = systemConfig.getCurrentWeek();
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "lastWeek":
            var [from, to] = systemConfig.getPreviousWeek();
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "month":
            var [from, to] = systemConfig.getPreviousMonth();
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "currentMonth":
            var [from, to] = systemConfig.getCurrentMonth();
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "lastMonth":
            var [from, to] = systemConfig.getLastMonth();
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "lastThreeMonths":
            var [from] = systemConfig.getPreviousThreeMonth();
            var to = systemConfig.getCurrentMonth()[1];
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "halfYear":
            var [from] = systemConfig.getPreviousSixMonth();
            var to = systemConfig.getCurrentMonth()[1];
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "year":
            var [from] = systemConfig.getPreviousYear();
            var to = systemConfig.getCurrentMonth()[1];
            createTimeFrom = from;
            createTimeTo = to;
            break;
          case "lastSevenDays":
            createTimeFrom = moment().subtract(6, "day").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
          case "lastThirtyDays":
            createTimeFrom = moment().subtract(29, "day").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
          case "last31Days":
            createTimeFrom = moment().subtract(30, "day").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
          case "lastOneYears":
            createTimeFrom = moment().subtract(1, "year").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
          case "lastTenYears":
            createTimeFrom = moment().subtract(10, "year").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
        }
        if (item.bool) {
          mapper[item.value] = {
            createTimeFrom: createTimeFrom,
            createTimeTo: createTimeTo,
          };
        } else {
          mapper[item.value] = {
            createTimeFrom:
              this.type === "datetime"
                ? createTimeFrom + " 00:00:00"
                : createTimeFrom,
            createTimeTo:
              this.type === "datetime"
                ? createTimeTo + " 23:59:59"
                : createTimeTo,
          };
        }
      });
      return mapper;
    },
    activeType() {
      if(this.defaultType){
        return this.defaultType
      }
      const { timeRangeMapper, startTime, endTime } = this;
      for (let i in timeRangeMapper) {
        const { createTimeFrom, createTimeTo } = timeRangeMapper[i];
        if (startTime == createTimeFrom && endTime == createTimeTo) {
          return i;
        }
      }
    },
    valueFormat() {
      switch (this.type) {
        case "date":
          return "yyyy-MM-dd";
        default:
          return "yyyy-MM-dd HH:mm:ss";
      }
    },
    startTimeObserver: {
      get() {
        return this.startTime;
      },
      set(value) {
         if (this.labelBool) {
        this.$emit("update:label", value + ' ~ ' + this.endTimeObserver );
      }
        this.$emit("update:startTime", value);
      },
    },
    endTimeObserver: {
      get() {
        return this.endTime;
      },
      set(value) {
        if (this.labelBool) {
        this.$emit("update:label", this.startTimeObserver + ' ~ ' + this.endTimeObserver);
      }
        this.$emit("update:endTime", value);
      },
    },
  },
  methods: {
    handleTimeQuickSelect(command, label) {
      this.defaultType = ''
      let hourList = ["halfHour", "oneHour", "sixHour"];
      let vList = [0.5, 1, 6];
      let index = hourList.indexOf(command);
      if (index != -1) {
        this.timeRangeMapper[command] = {
          createTimeFrom: systemConfig.getSubCurNowTime(vList[index])[0],
          createTimeTo: systemConfig.getSubCurNowTime(vList[index])[1],
        };
      }
      this.$emit(
        "update:startTime",
        this.timeRangeMapper[command].createTimeFrom
      );
      this.$emit("update:endTime", this.timeRangeMapper[command].createTimeTo);
      if (this.labelBool) {
        this.$emit("update:label", label);
      }
    },
  },
  mounted(){
    this.defaultType = this.defaultTypeP
  }
};
</script>

<style lang="scss" scoped>
.quick-select-options {
  position: absolute;
  top: -23px;
  left: 90px;
  display: flex;
  li {
    margin-right: 10px;
    color: #fff;
    background-color: #dcdcdc;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 2px;
    white-space: nowrap;
    cursor: pointer;
    &.active {
      background-color: #409eff;
    }
    &:hover {
      background-color: #409eff;
    }
  }
}
$dateW: 200px;
.date-first {
  width: $dateW;
  margin-right: 5px;
}
.date-second {
  width: $dateW;
}
/deep/ {
  .el-input__inner {
    width: $dateW;
    padding-left: 30px !important;
  }
}
</style>
