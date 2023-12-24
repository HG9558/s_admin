<template>
  <div>
    <el-form-item :label="$t('申请条件')" v-if="scope === 0">
      <el-checkbox-group class="activity-rule-inline-block" v-model="conditions" @change="handleConditionsChange">
        <el-checkbox :label="item.value" v-for="item in conditionsGroup" :key="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :rules="drawNumberRules" prop="rule.ruleScopeDtos.drawType" :label="$t('可领取次数')">
      <el-select v-model="ruleScopeDtos.drawType">
        <el-option :label="$t('每日')" :value="0"></el-option>
        <el-option :label="$t('每周')" :value="1"></el-option>
        <el-option :label="$t('每月')" :value="4"></el-option>
        <el-option :label="$t('近七日')" :value="2"></el-option>
        <el-option :label="$t('自定义')" :value="3"></el-option>
      </el-select>
      <el-input
        type="number"
        :placeholder="$t('请输入次数')"
        class="activity-rule-amount"
        v-model.number="ruleScopeDtos.drawNumber"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('计算规则')" v-if="!isVipAddDiscount">
      <el-radio-group v-model="ruleScopeDtos.formulaMode" @change="handleConditionsChange">
        <el-radio :label="0">{{ $t('规则共享') }}</el-radio>
        <el-radio :label="1">{{ $t('规则不共享') }}</el-radio>
        （{{ $t('选择规则共享，则达到最高条件时可同时领取之前所有奖励') }}）
      </el-radio-group>
    </el-form-item>
    <!-- 活动规则 -->
    <el-form-item :rules="activityRule" prop="rule.ruleScopeDtos.activityRuleDtos" :label="$t('活动规则')">
      <ActivityRuleDtosForm ref="activityRuleDtos" v-model="ruleScopeDtos.activityRuleDtos" :isVipAddDiscount="isVipAddDiscount"/>
    </el-form-item>
  </div>
</template>

<script>
import ActivityRuleDtosForm from '../common_forms/ActivityRuleDtos'

export default {
  components: { ActivityRuleDtosForm },
  model: {
    prop: 'ruleScopeDtos',
    event: 'change'
  },
  props: ['ruleScopeDtos', 'scope', 'tmplCode'],
  data() {
    return {
      conditions: [],
      conditionsGroup: [
        {
          label: this.$t('已实名'),
          value: 'isName'
        },
        {
          label: this.$t('已验证手机'),
          value: 'isMobile'
        },
        {
          label: this.$t('已验证银行卡'),
          value: 'isBank'
        },
        /* {
          label: '已验证邮箱',
          value: 'isMail'
        }, */
      ],
      drawNumberRules: {
        validator: (rule, value, callback) => {
          const { drawType, drawNumber } = this.ruleScopeDtos
          if (Number.isInteger(drawNumber) && drawNumber >= 0) {
            callback()
          } else {
            callback(new Error(this.$t('可领取次数应为0或正整数')))
          }
        }
      },
      activityRule: {
        validator: (rule, value, callback) => {
          this.$refs.activityRuleDtos.validate(valid => {
            if (valid) {
              callback()
            }
          })
        }
      }
    }
  },
  computed: {
    ruleScopeDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.ruleScopeDtos))
      },
      set(value) {
        this.$emit('change', value)
      }
    },
    isVipAddDiscount () {
      return this.tmplCode === 'AQ0000018' //vip晋级优惠
    }
  },
  created() {
    this.initConditions()
  },
  methods: {
    handleConditionsChange() {
      const { conditions, conditionsGroup, ruleScopeDtosObserver } = this
      for (const { value } of conditionsGroup) {
        ruleScopeDtosObserver[value] = conditions.includes(value)
      }
      this.setSco(ruleScopeDtosObserver)
    },
    initConditions() {
      this.ruleScopeDtos.isMail=false;
      for (const item of this.conditionsGroup) {
        const { value } = item
        if (this.ruleScopeDtos[value]) {
          this.conditions.push(value)
        }
      }
      // vip晋级优惠，则默认设置为规则不共享
      if(this.isVipAddDiscount) this.setRuleScope()
    },
    setRuleScope() {
      const { ruleScopeDtosObserver } = this
      ruleScopeDtosObserver.formulaMode = 1
      this.setSco(ruleScopeDtosObserver)
    },
    setSco (ruleScopeDtosObserver) {
      // 触发set
      this.ruleScopeDtosObserver = ruleScopeDtosObserver
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-rule-amount {
  width: 200px;
  margin-left: 10px;
  margin-right: 20px;
}
</style>


