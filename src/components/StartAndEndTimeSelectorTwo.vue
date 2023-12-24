<template>
  <div style="position: relative;" :style="{ width: width + 'px' }">
    <ul class="quick-select-options" :style="{ left: left + 'px' }">
      <li :class="{active: item.value === activeType}" v-for="(item, index) in selections" :key="index" @click="handleTimeQuickSelect(item.value)">{{item.label}}</li>
    </ul>
    <el-date-picker class="date-first" v-model="startTimeObserver" :value-format="valueFormat" :type="type" :placeholder="$t('开始时间')" @focus="oldTime = startTime" @blur="oldTime !== startTime && $refs.endTime.focus()">
    </el-date-picker>
    <el-date-picker class="date-second" ref="endTime" v-model="endTimeObserver" :value-format="valueFormat" :type="type" :placeholder="$t('结束时间')">
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
import systemConfig from '../config/config'
import moment from "moment";

export default {
  props: {
    type: {
      type: String,
      default: 'datetime'
    },
    selections: {
      type: Array,
      default() {
        return [
          {
            label: this.$t('今日'),
            value: 'today'
          },
          {
            label: this.$t('昨日'),
            value: 'yesterday'
          },
          {
            label: this.$t('前日'),
            value: 'beforeYesterday'
          },
          {
            label: this.$t('本周'),
            value: 'currentWeek'
          },
          {
            label: this.$t('上周'),
            value: 'lastWeek'
          },
        ]
      }
    },
    left: {
      type: Number
    },
    width: {
      type: Number
    },
    startTime: String,
    endTime: String
  },
  data() {
    return {
      oldTime: null
    }
  },
  computed: {
    timeRangeMapper() {
      const mapper = {}
      this.selections.map(item => {
        let createTimeFrom, createTimeTo
        switch(item.value){
          case 'today':
            createTimeFrom = createTimeTo = systemConfig.getToday()
            break
          case 'yesterday':
            createTimeFrom = createTimeTo = systemConfig.getYesterday()
            break
          case 'beforeYesterday':
            createTimeFrom = createTimeTo = systemConfig.getBeforeYesterday()
            break
          case 'currentWeek':
            var [from, to] = systemConfig.getCurrentWeek()
            createTimeFrom = from
            createTimeTo = to
            break
          case 'lastWeek':
            var [from, to] = systemConfig.getPreviousWeek()
            createTimeFrom = from
            createTimeTo = to
            break
          case 'month':
            var [from, to] = systemConfig.getPreviousMonth()
            createTimeFrom = from
            createTimeTo = to
            break
          case 'currentMonth':
            var [from, to] = systemConfig.getCurrentMonth()
            createTimeFrom = from
            createTimeTo = to
            break
          case 'lastMonth':
            var [from, to] = systemConfig.getLastMonth()
            createTimeFrom = from
            createTimeTo = to
            break
          case 'lastThreeMonths':
            var [from] = systemConfig.getPreviousThreeMonth()
            var to = systemConfig.getCurrentMonth()[1]
            createTimeFrom = from
            createTimeTo = to
            break
          case 'halfYear':
            var [from] = systemConfig.getPreviousSixMonth()
            var to = systemConfig.getCurrentMonth()[1]
            createTimeFrom = from
            createTimeTo = to
            break
          case 'year':
            var [from] = systemConfig.getPreviousYear()
            var to = systemConfig.getCurrentMonth()[1]
            createTimeFrom = from
            createTimeTo = to
            break
          case "lastSevenDays":
            createTimeFrom = moment().subtract(6, "day").format("YYYY-MM-DD");
            createTimeTo = moment().format("YYYY-MM-DD");
            break;
        }
        mapper[item.value] = {
          createTimeFrom: this.type === 'datetime' ? createTimeFrom + ' 00:00:00' : createTimeFrom,
          createTimeTo: this.type === 'datetime' ? createTimeTo + ' 23:59:59' : createTimeTo
        }
      })
      return mapper
    },
    activeType() {
      const {timeRangeMapper, startTime, endTime} = this
      for (let i in timeRangeMapper) {
        const {createTimeFrom, createTimeTo} = timeRangeMapper[i]
        if (startTime == createTimeFrom && endTime == createTimeTo) {
          return i
        }
      }
    },
    valueFormat() {
      switch(this.type) {
        case 'date':
          return 'yyyy-MM-dd'
        default:
          return 'yyyy-MM-dd HH:mm:ss'
      }
    },
    startTimeObserver: {
      get(){
        return this.startTime
      },
      set(value){
        this.$emit('update:startTime', value)
      }
    },
    endTimeObserver: {
      get(){
        return this.endTime
      },
      set(value){
        this.$emit('update:endTime', value)
      }
    },
  },
  methods: {
    handleTimeQuickSelect(command){
      this.$emit('update:startTime', this.timeRangeMapper[command].createTimeFrom)
      this.$emit('update:endTime', this.timeRangeMapper[command].createTimeTo)
    },
  }
}
</script>

<style lang="scss" scoped>
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
.quick-select-options {
  position: absolute;
  top: -23px;
  left: 82px;
  li {
    float: left;
    margin-right: 10px;
    color: #fff;
    background-color: #dcdcdc;
    line-height: 18px;
    padding: 0 4px;
    border-radius: 2px;
    cursor: pointer;
    &.active {
      background-color: #3a8ee6;
    }
    &:hover {
      background-color: #3a8ee6;
    }
  }
}
</style>

