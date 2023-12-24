<template>
  <div>
    <!-- 流水范围 -->
    <el-form-item :label="$t('派彩范围')">
      <AuditCatsForm v-model="rule.auditCats" />
    </el-form-item>
    <el-form-item :label="$t('申请条件')">
      <el-checkbox-group
        class="activity-rule-inline-block"
        v-model="conditions"
        @change="handleConditionsChange"
      >
        <el-checkbox
          :label="item.value"
          v-for="item in conditionsGroup"
          :key="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <!-- <el-form-item label="统计周期" class="inline">
      <el-radio-group v-model.number="rule.drawType">
        <el-radio :label="0">昨日</el-radio>
        <el-radio :label="1">上周</el-radio>
        <el-radio :label="2">上月</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <RuleScopeDtosForm v-model="rule" :ruleScopeDtos="rule" />
  </div>
</template>

<script>
import AuditCatsForm from "../common_forms/AuditCats";
import RuleScopeDtosForm from "./RuleScopeDtos";

export default {
  components: { AuditCatsForm, RuleScopeDtosForm },
  props: ["rule"],
  data() {
    return {
      conditions: [],
      conditionsGroup: [
        {
          label: this.$t("已实名"),
          value: "isName"
        },
        {
          label: this.$t("已验证手机"),
          value: "isMobile"
        },
        {
          label: this.$t("已验证银行卡"),
          value: "isBank"
        }
      ]
    };
  },
  created() {
    this.initConditions();
  },
  computed: {
    ruleScopeDtosObserver() {
      let obj = JSON.parse(JSON.stringify(this.rule));
      //obj.drawType = obj.drawType || 0;
      return JSON.parse(JSON.stringify(this.rule));
    }
  },
  methods: {
    handleConditionsChange() {
      const { conditions, conditionsGroup, ruleScopeDtosObserver } = this;
      for (const { value } of conditionsGroup) {
        ruleScopeDtosObserver[value] = conditions.includes(value);
      }
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    initConditions() {
      for (const item of this.conditionsGroup) {
        const { value } = item;
        if (this.rule[value]) {
          this.conditions.push(value);
        }
      }
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
</style>
