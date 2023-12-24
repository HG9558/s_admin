<template>
  <div>
    <!-- 活动规则之优惠码 -->
    <el-form-item :label="$t('参与等级')" prop="minVipLv" :rules="levelRule">
      <el-select v-model="ruleScopeDto.minVipLv">
        <el-option
          v-for="level in memberLevelGroup"
          :key="level.tierName"
          :label="level.tierName"
          :value="level.accountLevel"
        ></el-option>
      </el-select>
      ~
      <el-select v-model="ruleScopeDto.maxVipLv">
        <el-option
          v-for="level in memberLevelGroup"
          :key="level.tierName"
          :label="level.tierName"
          :value="level.accountLevel"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('存款要求')"
      prop="depositMin"
      :rules="rules.depositMin"
    >
      <el-radio-group
        v-model="ruleScopeDto.depositAmountFlag"
        @change="change1r"
      >
        <el-radio :label="0" style="margin: 6px 0;">{{
          $t("不限制")
        }}</el-radio>
        <br />
        <el-checkbox :label="1" v-model="checked1" @change="change1">
          {{ $t("当日存款不低于") }}
          <el-input-number
            v-model="ruleScopeDto.depositMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款金额')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            :class="[
              {
                isBlack:
                  (checkNumberAndTwoDecimal(ruleScopeDto.depositMin) &&
                    ruleScopeDto.depositMin >= 0 &&
                    checked1) ||
                  !checked1
              }
            ]"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox :label="2" v-model="checked2" @change="change1">
          {{ $t("上月存款不低于") }}
          <el-input-number
            v-model="ruleScopeDto.lastDepositMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款金额')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            :class="[
              {
                isBlack:
                  (checkNumberAndTwoDecimal(ruleScopeDto.lastDepositMin) &&
                    ruleScopeDto.lastDepositMin >= 0 &&
                    checked2) ||
                  !checked2
              }
            ]"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox
          :label="4"
          v-model="checked3"
          style="margin-top: 10px;margin-left: 0;"
          @change="change1"
        >
          {{ $t("上月存款次数不低于") }}
          <el-input-number
            v-model="ruleScopeDto.lastDepositMinTimes"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款次数')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            :class="[
              {
                isBlack:
                  (checkNumberAndTwoDecimal(
                    ruleScopeDto.lastDepositMinTimes
                  ) &&
                    ruleScopeDto.lastDepositMinTimes >= 0 &&
                    checked3) ||
                  !checked3
              }
            ]"
          ></el-input-number>
          {{ $t("次") }}
        </el-checkbox>
        <br />
        <el-checkbox
          :label="8"
          v-model="checked6"
          style="margin-top: 10px;margin-left: 0;"
          @change="change1"
        >
          <span style="float: left; margin-top: 6px; margin-right: 5px;">
            {{ $t("存款时间") }}</span
          >
          <!-- <StartAndEndTimeSelector ref="searchTime" :selections="[]" :startTime.sync="ruleScopeDto.depositStartTime" :endTime.sync="ruleScopeDto.depositEndTime" style="float: left; margin: 0 10px"/> -->
          <el-date-picker
            v-model="ruleScopeDto.depositStartTime"
            type="datetime"
            :placeholder="$t('选择日期时间')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <el-date-picker
            v-model="ruleScopeDto.depositEndTime"
            type="datetime"
            :placeholder="$t('选择日期时间')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          {{ $t("存款金额") }}
          <el-input-number
            v-model="ruleScopeDto.depositAmount"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款金额')"
            :disabled="ruleScopeDto.depositAmountFlag === 0"
            :class="[
              {
                isBlack:
                  (checkNumberAndTwoDecimal(ruleScopeDto.depositAmount) &&
                    ruleScopeDto.depositAmount > 0 &&
                    checked6) ||
                  !checked6
              }
            ]"
          ></el-input-number>
        </el-checkbox>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('投注要求')"
      prop="validBetMin"
      :rules="rules.validBetMin"
    >
      <el-radio-group v-model="ruleScopeDto.validBetFlag" @change="change2r">
        <el-radio :label="0" style="margin: 6px 0;">{{
          $t("不限制")
        }}</el-radio>
        <br />
        <el-checkbox :label="1" v-model="checked4" @change="change2">
          {{ $t("当日投注不低于") }}
          <el-input-number
            v-model="ruleScopeDto.validBetMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入投注要求')"
            :disabled="ruleScopeDto.validBetFlag === 0"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox :label="1" v-model="checked5" @change="change2">
          {{ $t("上月投注不低于") }}
          <el-input-number
            v-model="ruleScopeDto.lastValidBetMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入投注要求')"
            :disabled="ruleScopeDto.validBetFlag === 0"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      :label="$t('赠送金额')"
      prop="donateAmountList"
      :rules="rules.donateAmountList"
    >
      <span
        v-for="(item, index) in ruleScopeDto.donateAmountList"
        :key="index"
        class="donate_amount"
      >
        <el-input-number
          v-model="ruleScopeDto.donateAmountList[index]"
          :controls="false"
          style="width: 10%; margin-top: 3px;"
          :class="[
            {
              isBlack: checkNatureNumber(ruleScopeDto.donateAmountList[index])
            }
          ]"
          :placeholder="$t('请输入赠送金额')"
        ></el-input-number>
        <i
          class="el-icon-close"
          v-show="!!index"
          @click="ruleScopeDto.donateAmountList.splice(index, 1)"
        ></i>
      </span>
      <el-button
        icon="el-icon-plus"
        @click="ruleScopeDto.donateAmountList.push(20)"
      ></el-button>
    </el-form-item>

    <el-form-item
      :label="$t('流水倍数')"
      prop="multipleWater"
      :rules="rules.multipleWater"
    >
      <el-input-number
        v-model="ruleScopeDto.multipleWater"
        :controls="false"
        style="width: 10%"
        :placeholder="$t('请输入流水倍数')"
      ></el-input-number>
    </el-form-item>

    <el-form-item
      :label="$t('兑换次数')"
      prop="exchangeTimes"
      :rules="rules.exchangeTimes"
    >
      <el-input-number
        v-model="ruleScopeDto.exchangeTimes"
        :controls="false"
        style="width: 10%"
        :placeholder="$t('请输入兑换次数')"
      ></el-input-number>
    </el-form-item>
  </div>
</template>

<script>
import { checkNatureNumber, checkNumberAndDecimals } from "@/config/utils";
import site from "@/mixins/site";
import systemConfig from "@/config/config.js";

import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector";

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  mixins: [site],
  props: {
    ruleScopeDto: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: { StartAndEndTimeSelector },
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
      levelRule: {
        required: true,
        validator: (rule, value, callback) => {
          const { minVipLv, maxVipLv } = this.ruleScopeDto;
          if (
            (!minVipLv && minVipLv !== 0) ||
            minVipLv === undefined ||
            (!maxVipLv && maxVipLv !== 0) ||
            maxVipLv === undefined
          ) {
            callback(new Error(this.$t("请选择起止参与等级")));
          } else {
            if (maxVipLv < minVipLv) {
              callback(new Error(this.$t("结束等级不能小于开始等级")));
            } else {
              callback();
            }
          }
        },
        trigger: ["blur", "change"]
      },
      rules: {
        depositMin: [
          {
            validator: (rule, value, callback) => {
              let {
                depositAmountFlag,
                depositMin,
                lastDepositMin,
                lastDepositMinTimes,
                depositStartTime,
                depositEndTime,
                depositAmount
              } = this.ruleScopeDto;
              if (depositAmountFlag) {
                const v1 =
                  checkNumberAndTwoDecimal(depositMin) && depositMin >= 0;
                const v2 =
                  checkNumberAndTwoDecimal(lastDepositMin) &&
                  lastDepositMin >= 0;
                const v3 =
                  checkNumberAndTwoDecimal(lastDepositMinTimes) &&
                  lastDepositMinTimes >= 0;
                const v4_a =
                  depositEndTime &&
                  depositStartTime &&
                 new Date(depositEndTime).getTime() >= new Date(depositStartTime).getTime();
                const v4_b =
                  checkNumberAndTwoDecimal(depositAmount) && depositAmount > 0;
                const bool1 = this.checked1 ? v1 : true;
                const bool2 = this.checked2 ? v2 : true;
                const bool3 = this.checked3 ? v3 : true;
                const bool4_a = this.checked6 ? v4_a : true;
                const bool4_b = this.checked6 ? v4_b : true;
                if (!(bool1 && bool2 && bool3)) {
                  callback(this.$t("大于等于0且允许2位小数"));
                  return;
                }
                if (!bool4_a) {
                  callback(this.$t("请选择有效范围存款时间"));
                  return;
                }
                if (!bool4_b) {
                  callback(this.$t("请输入有效存款金额"));
                  return;
                }
                callback();
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        validBetMin: [
          {
            validator: (rule, value, callback) => {
              const {
                validBetFlag,
                validBetMin,
                lastValidBetMin
              } = this.ruleScopeDto;

              if (validBetFlag) {
                let valid4 =
                  this.checked4 &&
                  checkNumberAndTwoDecimal(validBetMin) && validBetMin >= 0;
                let valid5 =
                  this.checked5 &&
                  checkNumberAndTwoDecimal(lastValidBetMin) &&
                    lastValidBetMin >= 0;
                let v4 =
                  checkNumberAndTwoDecimal(lastValidBetMin) &&
                  lastValidBetMin >= 0;
                let v5 =
                  checkNumberAndTwoDecimal(lastValidBetMin) &&
                  lastValidBetMin >= 0;
                if (
                  (valid4 && valid5) ||
                  (valid4 && !this.checked5 && !v5) ||
                  (valid5 && !this.checked4 && !v5)
                ) {
                  callback();
                } else {
                  callback(this.$t("大于等于0且允许2位小数"));
                }
                // if (checkNumberAndTwoDecimal(validBetMin) && validBetMin >= 0) {
                //   callback()
                // } else {
                //   callback('大于等于0且允许2位小数')
                // }
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        donateAmount: [
          {
            validator: (rule, value, callback) => {
              const { donateAmount } = this.ruleScopeDto;
              if (checkNumberAndTwoDecimal(donateAmount) && donateAmount > 0) {
                callback();
              } else {
                callback(this.$t("大于0且允许2位小数"));
              }
            },
            trigger: "blur"
          }
        ],
        multipleWater: [
          {
            validator: (rule, value, callback) => {
              const { multipleWater } = this.ruleScopeDto;
              if (checkNatureNumber(multipleWater)) {
                callback();
              } else {
                callback(this.$t("应为非负整数"));
              }
            },
            trigger: "blur"
          }
        ],
        exchangeTimes: [
          {
            validator: (rule, value, callback) => {
              const { exchangeTimes } = this.ruleScopeDto;

              if (checkNatureNumber(exchangeTimes)) {
                callback();
              } else {
                callback(this.$t("应为非负整数"));
              }
            },
            trigger: "blur"
          }
        ],
        donateAmountList: [
          {
            validator: (rule, value, callback) => {
              const { donateAmountList } = this.ruleScopeDto;
              let bool = false;
              donateAmountList.map((item, index) => {
                if (!checkNatureNumber(item)) {
                  bool = true;
                }
              });
              if (bool) {
                callback(this.$t("标红区域应为非负整数"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      checkNatureNumber,
      checkNumberAndTwoDecimal,
      memberLevelGroup: []
    };
  },
  methods: {
    change1() {
      const obj = {
        checked1: 1,
        checked2: 2,
        checked3: 4,
        checked6: 8
      };
      const newArr = Object.keys(obj).map(key => {
        return this[key] ? obj[key] : 0;
      });
      this.ruleScopeDto.depositAmountFlag = newArr.reduce(
        (pre, cur) => pre + cur
      );
      if (!this.checked1) {
        this.$emit("update", "depositMin");
      }
      if (!this.checked2) {
        this.$emit("update", "lastDepositMin");
      }
      if (!this.checked3) {
        this.$emit("update", "lastDepositMinTimes");
      }
      if (!this.checked6) {
        this.$emit("update", "depositAmount");
        this.$emit("update", "depositStartTime");
        this.$emit("update", "depositEndTime");
      }
    },
    change1r(v) {
      if (v === 0) {
        this.ruleScopeDto.depositAmountFlag = 0;
        this.checked1 = false;
        this.checked2 = false;
        this.checked3 = false;
        this.checked6 = false;
        this.$emit("update", "depositMin");
        this.$emit("update", "lastDepositMin");
        this.$emit("update", "lastDepositMinTimes");
        this.$emit("update", "depositAmount");
        this.$emit("update", "depositStartTime");
        this.$emit("update", "depositEndTime");
      }
    },
    change2() {
      const obj = {
        checked4: 1,
        checked5: 2
      };
      const newArr = Object.keys(obj).map(key => {
        return this[key] ? obj[key] : 0;
      });
      this.ruleScopeDto.validBetFlag = newArr.reduce((pre, cur) => pre + cur);

      if (!this.checked4) {
        this.$emit("update", "validBetMin");
      }
      if (!this.checked5) {
        this.$emit("update", "lastValidBetMin");
      }
    },
    change2r(v) {
      if (v === 0) {
        this.ruleScopeDto.validBetFlag = 0;
        this.checked4 = false;
        this.checked5 = false;
        this.$emit("update", "validBetMin");
        this.$emit("update", "lastValidBetMin");
      }
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        let arr = [];
        // debugger
        res.data.data.map(item => {
          if (item.tierName != "VIP0") {
            arr.push(item);
          }
        });
        this.memberLevelGroup = arr;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.ruleScopeDto) {
        const { ruleScopeDto } = this;
        const {
          depositAmountFlag,
          validBetFlag,
        } = ruleScopeDto;
        // 1, 2, 4, 8 depositAmountFlag后端规则，勾选数值累计之和
        this.checked1 = [1, 3, 5, 7, 9, 11, 13, 15].includes(depositAmountFlag)
        this.checked2 = [2, 3, 6, 7, 10, 11, 14, 15].includes(depositAmountFlag)
        this.checked3 = [4, 5, 6, 7, 12, 14, 13, 15].includes(depositAmountFlag)
        this.checked6 = [8, 9, 10, 12, 11, 13, 14, 15].includes(depositAmountFlag)

        this.checked4 = [1, 3].includes(validBetFlag)
        this.checked5 = [2, 3].includes(validBetFlag)
      }
    }),
      this.getMemberLevel();
  }
};
</script>

<style scoped lang="scss">
.firstSaveType {
  /deep/ .el-input {
    width: 10%;
  }
}
.donate_amount {
  position: relative;
  i {
    position: absolute;
    top: -5px;
    right: 5px;
    cursor: pointer;
    color: red;
  }
}
.isBlack {
  /deep/ .el-input {
    input {
      border-color: #dddfe5;
    }
  }
}
</style>
