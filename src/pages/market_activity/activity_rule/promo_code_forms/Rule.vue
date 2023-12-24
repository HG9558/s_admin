<template>
  <div>
    <!-- 流水范围 -->
    <el-form-item :label="$t('流水范围')">
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
    <RuleScopeDtosForm
      v-bind.sync="ruleScopeDto"
      @update="emit"
    />
  </div>
</template>

<script>
import AuditCatsForm from "../common_forms/AuditCats";
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import RuleScopeDtosForm from "./RuleScopeDtos";

export default {
  components: { AuditCatsForm, MemberLevelTabs, RuleScopeDtosForm },
  inject: ["getRuleScopeDtosTemplate"],
  props: ["rule", "tmplCode"],
  computed: {
    ruleScopeDto() {
      return { ruleScopeDto: this.rule.ruleScopeDto };
    }
  },
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
        /* {
          label: '已验证邮箱',
          value: 'isMail'
        }, */
        // {
        //   label: "APP注册",
        //   value: "isApp"
        // }
      ],
      memberLevelGroup: [],
      recodeData: [],
      recodeLevelData: [],
      recodNum: -1,
      rules: {
        validDates: {
          validator: (rule, value, callback) => {
            if (this.rule.validDates.length) {
              callback();
            } else {
              callback(this.$t("请选择会员日"));
            }
          },
          trigger: "change"
        }
      }
    };
  },
  created() {
    this.initConditions();
  },
  methods: {
    handleMemDayTypeChange() {
      this.rule.validDates = [];
      this.$nextTick(() => {
        this.$refs.memDayType.resetField();
      });
    },
    handleConditionsChange() {
      const { conditions, conditionsGroup } = this;
      for (const { value } of conditionsGroup) {
        this.rule[value] = conditions.includes(value);
      }
    },
    initConditions() {
      this.rule.isMail = false;
      for (const item of this.conditionsGroup) {
        const { value } = item;
        if (this.rule[value]) {
          this.conditions.push(value);
        }
      }
      this.handleConditionsChange();
    },
    emit(data) {
      console.log(2, data);
      this.$emit("update", data);
    }
  }
};
</script>
