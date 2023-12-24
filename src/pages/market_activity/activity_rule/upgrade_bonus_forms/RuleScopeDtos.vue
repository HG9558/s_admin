<template>
  <div>


    <el-form-item :label="$t('赠送金额')" prop="donateAmount" :rules="rules.donateAmount">
      <el-input-number
        v-model="ruleScopeDtos.donateAmount"
        :controls="false"
        style="width: 10%"
        :placeholder="$t('请输入赠送金额')"
      ></el-input-number>
    </el-form-item>

    <el-form-item :label="$t('流水倍数')" prop="multipleWater" :rules="rules.multipleWater">
      <el-input-number
        v-model="ruleScopeDtos.multipleWater"
        :controls="false"
        style="width: 10%"
        :placeholder="$t('请输入流水倍数')"
      ></el-input-number>
      <span>
        * {{ $t('0倍代表不做稽核') }}
      </span>
    </el-form-item>
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils"

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
}

export default {
  props: ["ruleScopeDtos"],
  data() {
    return {
      rules: {
        depositMin: [
          {
            validator: (rule, value, callback) => {
              const { depositAmountType, depositMin } = this.ruleScopeDtos

              if (depositAmountType) {
                if (checkNumberAndTwoDecimal(depositMin) && depositMin >= 0) {
                  callback()
                } else {
                  callback(this.$t('大于等于0且允许2位小数'))
                }
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        validBetMin: [
          {
            validator: (rule, value, callback) => {
              const { validBetType, validBetMin } = this.ruleScopeDtos

              if (validBetType) {
                if (checkNumberAndTwoDecimal(validBetMin) && validBetMin >= 0) {
                  callback()
                } else {
                  callback(this.$t('大于等于0且允许2位小数'))
                }
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        donateAmount: [
          {
            validator: (rule, value, callback) => {
              const { donateAmount } = this.ruleScopeDtos

              if (checkNumberAndTwoDecimal(donateAmount) && donateAmount >= 0) {
                callback()
              } else {
                callback(this.$t('大于等于0且允许2位小数'))
              }
            },
            trigger: 'blur',
          },
        ],
        multipleWater: [
          {
            validator: (rule, value, callback) => {
              const { multipleWater } = this.ruleScopeDtos

              if (checkNatureNumber(multipleWater)) {
                callback()
              } else {
                callback(this.$t('应为非负整数'))
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
</script>

<style scoped lang="scss">
.firstSaveType {
  /deep/ .el-input {
    width: 10%;
  }
}
</style>
