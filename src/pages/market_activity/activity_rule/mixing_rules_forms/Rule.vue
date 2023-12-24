<template>
  <div>
    <el-form-item
      :label="$t('活动名称')"
      :rules="rules.activityLinked"
    >
      <el-checkbox-group
        v-model="activityLinked"
        @change="handleCheckBox"
      >
        <el-checkbox v-for="(item, i) in activityLinkedList" :disabled="activityLinked.length >= 3 && !activityLinked.includes(item.value)" :label="item.value" :key="i">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      :label="$t('领取顺序')"
      :rules="{ required: true, message: $t('请选择领取顺序') }"
    >
      <el-radio-group v-model="ruleData.applyType">
        <el-radio :label="0">{{ $t('按顺序领取') }}</el-radio>
        <el-radio :label="1">{{ $t('满足条件领取') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      :label="$t('起始时间')"
      :rules="{ required: true, message: $t('请选择起始时间') }"
    >
      <el-date-picker
        :placeholder="$t('起始时间')"
        v-model="ruleData.startTime"
      ></el-date-picker>
    </el-form-item>
<!--    <el-form-item-->
<!--      label="会员范围"-->
<!--    >-->
<!--      <el-radio-group v-model="accountType">-->
<!--        <el-radio :label="0">全部会员</el-radio>-->
<!--        <el-radio :label="1">会员层级</el-radio>-->
<!--      </el-radio-group>-->
<!--    </el-form-item>-->
    <component :is="item.component" v-for="(item, i) in comList" :key="i" @changeData="handleChangeData" :data="item.data"></component>
  </div>
</template>

<script>
import BetSend from "./BetSend";
import SaveSend from "./SaveSend";
import OrtherSend from "./OrtherSend";
import HelpMoney from "./HelpMoney";

const comObj = {
  AQ0000003: 'SaveSend',
  AQ0000012: 'BetSend',
  AQ0000004: 'HelpMoney',
  AQ0000015: 'OrtherSend',
}

const keysObj = {
  AQ0000003: 'jDepositSentDto',
  AQ0000012: 'bettingGiftDto',
  AQ0000004: 'actRescueRuleDto',
  AQ0000015: 'jOtherDto',
}

export default {
  name: "Rule",
  props: ["rule"],
  components: {
    BetSend,
    SaveSend,
    OrtherSend,
    HelpMoney
  },
  data() {
    return {
      activityLinkedList: [
        { label: this.$t('存就送'), value: 'AQ0000003' },
        { label: this.$t('投就送'), value: 'AQ0000012' },
        { label: this.$t('救援金'), value: 'AQ0000004' },
        { label: this.$t('其他'), value: 'AQ0000015' },
      ],
      activityLinked: [],
      accountType: 0,
      rules: {
        activityLinked: {
          required: true,
          validator: (rule, value, callback) => {
            console.log('val =====000', value)
            callback('888')
          },
          trigger: "change",
        }
      },
      comList: [],
      ruleData: {
        startTime: '',
        applyType: 0,
        activityLinkedList: {}
      }
    }
  },
  created() {
    this.init()
  },
  watch: {
    ruleData() {
      this.$emit('getDate', this.ruleData)
    }
  },
  methods: {
    init() {
      const { activityLinkedList } = this.rule
      this.ruleData = this.rule
      if (activityLinkedList) {
        const arr = []
        for (let key in activityLinkedList) {
          arr.push({ key, val: activityLinkedList[key] })
        }
        arr.sort(i => i.val).map(i => {
          if (this.activityLinked.length < 3) {
            this.activityLinked.push(i.key)
          }
        })
        this.handleCheckBox(this.activityLinked)
      }
    },
    handleCheckBox(checked) {
      this.comList = checked.map(i => ({ component: comObj[i], data: this.ruleData[keysObj[i]] }))
      const activityLinkedList = {}
      checked.forEach((i, index) => {
        activityLinkedList[i] = index + 1
      })
      this.ruleData.activityLinkedList = activityLinkedList
      if (!checked.includes('AQ0000015') && this.ruleData.jOtherDto) { delete this.ruleData.jOtherDto }
      if (!checked.includes('AQ0000003') && this.ruleData.jDepositSentDto) { delete this.ruleData.jDepositSentDto }
      if (!checked.includes('AQ0000012') && this.ruleData.bettingGiftDto) { delete this.ruleData.bettingGiftDto }
      if (!checked.includes('AQ0000004') && this.ruleData.actRescueRuleDto) { delete this.ruleData.actRescueRuleDto }
    },
    handleChangeData({ key, data }) {
      this.ruleData[key] = data
    },
  }
}
</script>

<style scoped>

</style>
