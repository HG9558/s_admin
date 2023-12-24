<template>
  <div>
    <!-- 活动规则 -->
    <el-form-item :label="$t('活动规则')">
      <div class="red_rule">
        <span class="left">{{ $t('红包雨当日开始和结束时间') }}:</span>
        <span class="right">
          <el-time-picker v-model="rule.startTime" :placeholder="$t('开始时间')">
          </el-time-picker>
          <el-time-picker v-model="rule.endTime" :placeholder="$t('结束时间')">
          </el-time-picker>
        </span>
      </div>
      <!-- <div class="red_rule">
        <span class="left">红包随机金额设置:</span>
        <span class="right">
          <SdyInputType class="w130" v-model="randomAmount" :placeholder="$t('请输入正整数')" :inputValue="randomAmount" :allowNull="false"></SdyInputType>
          <el-button type="primary" @click="handleAdd(randomAmount)">添加</el-button>
        </span>
        <div v-if="rule.randomAmount.length" class="mt10">
          <el-tag :key="index" v-for="(num, index) in rule.randomAmount" closable :disable-transitions="false" @close="handleDelete(index)">
            {{num}}
          </el-tag>
        </div>
      </div>
      <div class="red_rule">
        <span class="left">红包金额流水倍数:</span>
        <span class="right">
          <SdyInputType class="w130" v-model="rule.multipleWater" placeholder="请输入流水倍数" :inputValue="rule.multipleWater" :allowNull="false"></SdyInputType>
          <span class="text">设置0时，不计算稽核，可直接体现</span>
        </span>
      </div> -->
    </el-form-item>
    <el-form-item label="" :rules="redPacketRule.validDates(rule.validDates)" prop="validDates" class="pl75">
      <div class="red_rule">
        <span class="left">{{ $t('每周举办日') }}:</span>
        <span class="right">
          <el-checkbox-group v-model="rule.validDates">
            <el-checkbox :label="item.value" v-for="(item, index) in dateWeek" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </span>
      </div>
    </el-form-item>
    <el-form-item label="" :rules="redPacketRule.randomAmount(rule.randomAmount)" prop="randomAmount"  class="pl120">
      <div class="red_rule">
        <span class="left">{{ $t('红包随机金额设置') }}:</span>
        <span class="right">
          <SdyInputType class="w130" v-model="randomAmount" :placeholder="$t('请输入正整数')" :inputValue="randomAmount" :allowNull="true"></SdyInputType>
          <el-button type="primary" @click="handleAdd(randomAmount)">{{ $t('添加') }}</el-button>
        </span>
        <div v-if="rule.randomAmount.length" class="mt10">
          <el-tag :key="index" v-for="(num, index) in rule.randomAmount" closable :disable-transitions="false" @close="handleDelete(index)">
            {{num}}
          </el-tag>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="" :rules="redPacketRule.multipleWater(rule.multipleWater)" prop="multipleWater"  class="pl120">
      <div class="red_rule">
        <span class="left">{{ $t('红包金额流水倍数') }}:</span>
        <span class="right">
          <SdyInputType class="w130" v-model="rule.multipleWater" :placeholder="$t('请输入流水倍数')" :inputValue="rule.multipleWater" :allowNull="true"></SdyInputType>
          <span class="text">{{ $t('设置0时，不计算稽核，可直接提现') }}</span>
        </span>
      </div>
    </el-form-item>
    <el-form-item label="" :rules="activityRule" prop="bettingGiftRuleDtos">
      <ActivityRuleDtosForm ref="activityRuleDtos" v-model="rule.redPacketRainRuleDtos" :redPacketRainRuleDtos="rule.redPacketRainRuleDtos" />
    </el-form-item>
  </div>
</template>

<script>
import ActivityRuleDtosForm from "./saveTable";
import SdyInputType from "../../../../components/SdyInputType";

export default {
  components: { ActivityRuleDtosForm, SdyInputType },
  props: ["rule"],
  data() {
    return {
      dateWeek: [
        { label: this.$t("星期一"), value: 1 },
        { label: this.$t("星期二"), value: 2 },
        { label: this.$t("星期三"), value: 3 },
        { label: this.$t("星期四"), value: 4 },
        { label: this.$t("星期五"), value: 5 },
        { label: this.$t("星期六"), value: 6 },
        { label: this.$t("星期日"), value: 7 },
      ],
      randomAmount: null,
      redPacketRule: {
        validDates: (item) => {
          return {
            validator: (rule, val, callback) => {
              if (item.length) {
                callback();
              } else {
                callback(new Error(this.$t("请选择每周举办日")));
              }
            },
          };
        },
        randomAmount: (item) => {
          return {
            validator: (rule, val, callback) => {
              if (item.length) {
                callback();
              } else {
                callback(new Error(this.$t("请设置红包随机金额")));
              }
            },
          };
        },
        multipleWater: (item) => {
          return {
            validator: (rule, val, callback) => {
              if (item || item === 0) {
                callback();
              } else {
                callback(new Error(this.$t("请输入红包金额流水倍数")));
              }
            },
          };
        },
      },
      activityRule: {
        validator: (rule, value, callback) => {
          this.$refs.activityRuleDtos.validate((valid) => {
            if (valid) {
              callback();
            }
          });
        },
      },
    };
  },
  created() {},
  computed: {
    ruleScopeDtosObserver() {
      let obj = JSON.parse(JSON.stringify(this.rule));
      return JSON.parse(JSON.stringify(this.rule));
    },
  },
  methods: {
    validate(callback) {
      this.$refs.activityRuleDtos.validate((valid) => {
        callback(valid);
      });
    },
    handleAdd(num) {
      this.changeRandomAmout(num, true);
    },
    handleDelete(index) {
      this.changeRandomAmout(index, false);
    },
    changeRandomAmout(num, add) {
      // bool(add) - add or delete
      this.randomAmount = null;
      const curRule = JSON.parse(JSON.stringify(this.rule));
      const randomAmountList = JSON.parse(
        JSON.stringify(this.rule.randomAmount)
      );
      add ? randomAmountList.push(num) : randomAmountList.splice(num, 1);
      curRule.randomAmount = randomAmountList;
      this.$emit("getDate", curRule);
    },
  },
};
</script>

<style lang="scss" scoped>
.inline {
  display: inline-block;
  //float: left;
}
.num {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
}
.pl120 {
  /deep/ .el-form-item__error {
    padding-left: 120px !important;
  }
}
.pl75 {
  /deep/ .el-form-item__error {
    padding-left: 75px !important;
  }
}
.red_rule {
  span {
    font-size: 14px !important;
    color: #606266;
  }
  .right {
    /deep/ .el-checkbox-group {
      display: inline-block;
    }
    /deep/ .el-input {
      width: 125px;
      margin-right: 10px;
    }
    .text {
      color: #f56c6c;
    }
  }
  .mt10 {
    padding-left: 20px;
    /deep/ .el-tag {
      margin-right: 10px;
    }
  }
  
}
</style>
