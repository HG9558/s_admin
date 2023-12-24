<template>
  <div>
    <el-form-item :label="$t('存款要求')" prop="depositMin" :rules="rules.depositMin">
      <el-radio-group v-model="ruleScopeDtos.depositAmountType" @change="change1r">
        <el-radio :label="0" style="margin: 6px 0;">{{ $t('不限制') }}</el-radio>

        <br />

        <el-checkbox :label="1" v-model="checked1" @change="change1">
          {{ $t('当日存款不低于') }}
          <el-input-number
            v-model="ruleScopeDtos.depositMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款金额')"
            :disabled="!ruleScopeDtos.depositAmountType || !checked1"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox :label="2" v-model="checked2" @change="change1">
          {{ $t('上月存款不低于') }}
          <el-input-number
            v-model="ruleScopeDtos.lastDepositMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款金额')"
            :disabled="!ruleScopeDtos.depositAmountType || !checked2"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox v-model="checked3" style="margin-top: 10px;margin-left: 0;" @change="change1">
          {{ $t('上月存款次数不低于') }}
          <el-input-number
            v-model="ruleScopeDtos.lastDepositMinTimes"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入存款次数')"
            :disabled="!ruleScopeDtos.depositAmountType || !checked3"
          ></el-input-number>
          {{ $t('次') }}
        </el-checkbox>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('投注要求')" prop="validBetMin" :rules="rules.validBetMin">
      <el-radio-group v-model="ruleScopeDtos.validBetType" @change="change2r">
        <el-radio :label="0" style="margin: 6px 0;">{{ $t('不限制') }}</el-radio>

        <br />

        <el-checkbox :label="1" v-model="checked4" @change="change2">
          {{ $t('当日投注不低于') }}
          <el-input-number
            v-model="ruleScopeDtos.validBetMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入投注要求')"
            :disabled="!ruleScopeDtos.validBetType || checked4"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
        <el-checkbox :label="1" v-model="checked5" @change="change2">
          {{ $t('上月投注不低于') }}
          <el-input-number
            v-model="ruleScopeDtos.lastValidBetMin"
            :controls="false"
            style="width: 50%"
            :placeholder="$t('请输入投注要求')"
            :disabled="!ruleScopeDtos.validBetType || !checked5"
          ></el-input-number>
          {{ currencyText() }}
        </el-checkbox>
      </el-radio-group>
    </el-form-item>

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
    </el-form-item>
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils"
import site from '@/mixins/site'

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
}

export default {
  mixins: [site],
  props: {
    ruleScopeDtos:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      rules: {
        depositMin: [
          {
            validator: (rule, value, callback) => {
              const { depositAmountType, depositMin, lastDepositMin,lastDepositMinTimes} = this.ruleScopeDtos
              if (depositAmountType) {
                let valid1 = this.checked1&&(checkNumberAndTwoDecimal(depositMin) && depositMin >= 0)
                let valid2 = this.checked2&&(checkNumberAndTwoDecimal(lastDepositMin) && lastDepositMin >= 0)
                let valid3 = this.checked3&&(checkNumberAndTwoDecimal(lastDepositMinTimes) && lastDepositMinTimes >= 0)
                let v1 = checkNumberAndTwoDecimal(depositMin) && depositMin >= 0
                let v2 = checkNumberAndTwoDecimal(lastDepositMin) && lastDepositMin >= 0
                let v3 = checkNumberAndTwoDecimal(lastDepositMinTimes) && lastDepositMinTimes >= 0
                if(valid1&&valid2&&valid3||valid1&&valid2&&(!this.checked3)&&!v3||valid1&&valid3&&(!this.checked2)&&!v2||valid2&&valid3&&(!this.checked1)&&!v1||valid1&&(!this.checked2&&!this.checked3)&&!v2&&!v3||valid2&&(!this.checked1&&!this.checked3)&&!v1&&!v3||valid3&&(!this.checked1&&!this.checked2)&&!v1&&!v2){
                  callback()
                }else{
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
              const { validBetType, validBetMin,lastValidBetMin } = this.ruleScopeDtos

              if (validBetType) {
                let valid4 = this.checked4&&(checkNumberAndTwoDecimal(validBetMin) && validBetMin >= 0)
                let valid5 = this.checked5&&(checkNumberAndTwoDecimal(lastValidBetMin) && lastValidBetMin >= 0)
                let v4 = checkNumberAndTwoDecimal(lastValidBetMin) && lastValidBetMin >= 0
                let v5 = checkNumberAndTwoDecimal(lastValidBetMin) && lastValidBetMin >= 0
                if(valid4&&valid5||valid4&&!this.checked5&&!v5||valid5&&!this.checked4&&!v5){
                  callback()
                }else {
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
  methods: {
    change1(v){
      const bool = this.checked1||this.checked2||this.checked3
      this.ruleScopeDtos.depositAmountType = bool ? 1 : 0
      if(!this.checked1){
        this.$emit('update','depositMin')
      }
      if(!this.checked2){
        this.$emit('update','lastDepositMin')
      }
      if(!this.checked3){
        this.$emit('update','lastDepositMinTimes')
      }
    },
    change1r(v){
      if(!v){
        this.checked1 = false
        this.checked2 = false
        this.checked3 = false
        this.$emit('update','depositMin')
        this.$emit('update','lastDepositMin')
        this.$emit('update','lastCishuMin')
      }
    },
    change2(v){
      const bool = this.checked4 || this.checked5
      this.ruleScopeDtos.validBetType = bool ? 1 : 0
      if(!this.checked4){
        this.$emit('update','validBetMin')
      }
      if(!this.checked5){
        this.$emit('update','lastValidBetMin')
      }
    },
    change2r(v){
      if(!v){
        this.checked4 = false
        this.checked5 = false
        this.$emit('update','validBetMin')
        this.$emit('update','lastValidBetMin')
      }
    },
  },
  mounted() {
    this.$nextTick(()=>{
      if(this.ruleScopeDtos){
        const {ruleScopeDtos} = this
        // debugger
        if((ruleScopeDtos.depositMin||ruleScopeDtos.depositMin==0)&&ruleScopeDtos.depositAmountType!==0){
          this.checked1 = true
        }
        if((ruleScopeDtos.lastDepositMin||ruleScopeDtos.lastDepositMin==0)&&ruleScopeDtos.depositAmountType!==0){
          this.checked2 = true
        }
        if((ruleScopeDtos.lastDepositMinTimes||ruleScopeDtos.lastDepositMinTimes==0)&&ruleScopeDtos.depositAmountType!==0){
          this.checked3 = true
        }
        if((ruleScopeDtos.validBetMin||ruleScopeDtos.validBetMin==0)&&ruleScopeDtos.validBetType!==0){
          this.checked4 = true
        }
        if((ruleScopeDtos.lastValidBetMin||ruleScopeDtos.lastValidBetMin==0)&&ruleScopeDtos.validBetType!==0){
          this.checked5 = true
        }
      }
    })
  }
};
</script>

<style scoped lang="scss">
.firstSaveType {
  /deep/ .el-input {
    width: 10%;
  }
}
</style>
