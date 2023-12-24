<template>
  <div>
    <!-- 活动规则 - 新红包雨-->
    <el-form ref="form"
             :model="rule">
      <el-form-item :label="$t('单场次活动持续时间') + ':'"
                    prop="endMinute"
                    :rules="rulesForm.endMinute">
        <div class="red_rule">
          <el-input type="number"
                    v-model.number="rule.endMinute"
                    :placeholder="$t('结束时间')"></el-input>

          <span class="right">{{ $t("分钟")}}</span>
          <span class="right culr">{{ $t("注") }}:{{ $t("时间单位-分,例5,表示正点~正点5分为红包雨时间；")}}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('举办日') + ':'"
                    prop="validDates"
                    :rules="rulesForm.validDates(rule.validDates)">
        <el-checkbox-group v-model="rule.validDates">
          <el-checkbox :label="item.value"
                       v-for="(item, index) in dateWeek"
                       :key="index">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item :label="$t('单场次红包总个数') + ':'"
                    prop="totalNum"
                    :rules="rulesForm.totalNum">
        <div class="red_rule">
          <el-input class="infds"
                    type="number"
                    v-model.number="rule.totalNum"
                    :placeholder="$t('请输入红包个数')"
                    small></el-input>
          <span class="right culr">
            {{ $t("注") }}:{{ $t("如选择（当日每小时）则红包个数是每小时的发放个数；") }}
          </span>
        </div>
      </el-form-item>

      <el-form-item :label="$t('单场次红包总金额') + ':'"
                    prop="totalAmount"
                    :rules="rulesForm.totalAmount">
        <div class="red_rule">
          <el-input class="infds"
                    type="number"
                    v-model.number="rule.totalAmount"
                    :placeholder="$t('请输入红包金额')"
                    small></el-input>
          <p class="right culr">
            {{ $t("注") }}:{{  $t("如选择（当日每小时）则红包金额是每小时的发放金额；") }}
          </p>
        </div>
      </el-form-item>

      <el-form-item :label="$t('单个红包随机金额') + ':'"
                    prop="minOrMaxAmount"
                    class="pl120"
                    :rules="rulesForm.minOrMaxAmount">
        <div class="red_rule">
          <el-input class="infds"
                    type="number"
                    v-model.number="rule.minAmount"
                    :placeholder="$t('请输入红包金额')"
                    small></el-input>
          <span class="mr10">~</span>
          <el-input class="infds"
                    type="number"
                    v-model.number="rule.maxAmount"
                    :placeholder="$t('请输入红包金额')"
                    small></el-input>
          <span class="right culr">
            {{ $t("注") }}:
            {{ $t('最小值 < 红包总额/红包个数；最大值>（红包总额/红包个数）* 2.5；最大值 < 红包金额')}};
          </span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('红包金额流水倍数') + ':'"
                    prop="multipleWater"
                    class="pl120"
                    :rules="rulesForm.multipleWater">
        <div class="red_rule">
          <el-input class="infds"
                    v-model.number="rule.multipleWater"
                    :placeholder="$t('请输入流水倍数')"
                    small></el-input>
          <span class="right culr">
            {{ $t("设置0时，不计算稽核，可直接提现") }}
          </span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('广告语') + 1 + ':'"
                    prop="adZero"
                    :rules="rulesForm.adZero">
        <div class="red_rule wi">
          <el-input v-model="rule.adZero"
                    :placeholder="$t('请输入内容')"
                    small></el-input>
        </div>
      </el-form-item>
      <el-form-item :label="$t('广告语') + 2 + ':'"
                    prop="adOne"
                    :rules="rulesForm.adOne">
        <div class="red_rule wi">
          <el-input v-model="rule.adOne"
                    :placeholder="$t('请输入内容')"></el-input>
        </div>
      </el-form-item>
      <el-form-item :label="$t('广告语') + 3 + ':'"
                    prop="adTwo"
                    :rules="rulesForm.adTwo">
        <div class="red_rule wi">
          <el-input v-model="rule.adTwo"
                    :placeholder="$t('请输入内容')"
                    small></el-input>
        </div>
      </el-form-item>
      <el-form-item :label="$t('实名绑卡验证')">
        <el-radio-group v-model="rule.isName">
          <el-radio :label="true">{{ $t("是") }}</el-radio>
          <el-radio :label="false">{{ $t("否") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :rules="activityRule"
        prop="newRedPacketRainNumDtoList">
        <sTable ref="activityRuleDtos"
          v-model="rule.newRedPacketRainNumDtoList"
          :newRedPacketRainNumDtoList="rule.newRedPacketRainNumDtoList"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sTable from './sTable.vue'

export default {
  model: {
    prop: "auditCats",
    event: "change"
  },
  props: ["rule"],
  components: { sTable },
  data () {
    return {
      dateWeek: [
        { label: this.$t("星期一"), value: 1 },
        { label: this.$t("星期二"), value: 2 },
        { label: this.$t("星期三"), value: 3 },
        { label: this.$t("星期四"), value: 4 },
        { label: this.$t("星期五"), value: 5 },
        { label: this.$t("星期六"), value: 6 },
        { label: this.$t("星期日"), value: 7 }
      ],
      rulesForm: {
        endMinute: {
          validator: (rule, value, callback) => {
            const { endMinute } = this.rule;
            if (endMinute > 59 || endMinute < 0 || !endMinute) {
              callback(new Error(this.$t("请输入合理分钟数值")));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        validDates: item => {
          return {
            validator: (rule, value, callback) => {
              if (!item.length) {
                callback(new Error(this.$t("请选择每周举办日")));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        },
        totalNum: {
          validator: (rule, value, callback) => {
            const { totalNum } = this.rule;
            if (totalNum <= 0 || !totalNum) {
              callback(new Error(this.$t("红包个数为正整数")));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        totalAmount: {
          validator: (rule, value, callback) => {
            const { totalAmount } = this.rule;
            if (totalAmount <= 0 || !totalAmount) {
              callback(new Error(this.$t("红包金额为有效数值")));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        minOrMaxAmount: {
          validator: (rule, value, callback) => {
            const { minAmount, maxAmount, totalAmount, totalNum } = this.rule;
            const bool1 = (!minAmount && minAmount !== 0) || !maxAmount;
            const bool2 = minAmount < 0 || maxAmount < 0;
            const bool3 = minAmount >= totalAmount / totalNum;
            const bool4 = maxAmount <= (totalAmount / totalNum) * 2.5;
            const bool5 = maxAmount >= totalAmount;
            if (bool1 || bool2 || bool3 || bool4 || bool5) {
              callback(new Error(this.$t("请按照公式算法输入合理的值")));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        multipleWater: {
          validator: (rule, value, callback) => {
            const { multipleWater } = this.rule;
            if (multipleWater < 0 || (!multipleWater && multipleWater !== 0)) {
              callback(new Error(this.$t("请输入有效范围流水倍数")));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        adZero: {
          validator: (rule, value, callback) => {
            const { adZero } = this.rule;
            if (!adZero) {
              callback(new Error(this.$t("请输入广告语") + 1));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        adOne: {
          validator: (rule, value, callback) => {
            const { adOne } = this.rule;
            if (!adOne) {
              callback(new Error(this.$t("请输入广告语") + 2));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        adTwo: {
          validator: (rule, value, callback) => {
            const { adTwo } = this.rule;
            if (!adTwo) {
              callback(new Error(this.$t("请输入广告语") + 3));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      },
      redPacketRule: {

        randomAmount: item => {
          return {
            validator: (rule, val, callback) => {
              if (item.length) {
                callback();
              } else {
                callback(new Error(this.$t("请设置红包随机金额")));
              }
            }
          };
        },
        multipleWater: item => {
          return {
            validator: (rule, val, callback) => {
              if (item || item === 0) {
                callback();
              } else {
                callback(new Error(this.$t("请输入红包金额流水倍数")));
              }
            }
          };
        }
      },
      activityRule: {
        validator: (rule, value, callback) => {
          this.$refs.activityRuleDtos.validate(valid => {
            if (valid) {
              callback();
            }
          });
        }
      }
    };
  },
  computed: {
    ruleScopeDtosObserver () {
      let obj = JSON.parse(JSON.stringify(this.rule));
      return JSON.parse(JSON.stringify(this.rule));
    }
  },
  methods: {
    validate (callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    }
  }
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
    &.mr10 {
      margin-right: 10px;
    }
  }

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

  .culr {
    color: #f56c6c;
    font-size: 12px;
    display: inline-block;
  }

  .mt10 {
    padding-left: 20px;

    /deep/ .el-tag {
      margin-right: 10px;
    }
  }

  /deep/ .el-input__inner::-webkit-outer-spin-button,
  /deep/ .el-input__inner::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /deep/ .el-input__inner[type='number'] {
    -moz-appearance: textfield;
  }
}

.wi {
  /deep/ .el-input {
    width: 500px;
    margin-right: 10px;
  }
}

.gInput {
  display: block;

  /deep/ input {
    width: 100px;
  }
}
.infds.el-input.el-input--small {
  width: 117px;
}

span.gInput.tity {
  padding-bottom: 14px;
}
.right.el-input.el-input--small {
  width: 500px;
  // display: inline-block;
}

span.advertisement {
  display: inline-block;
  padding-bottom: 10px;
}
</style>
