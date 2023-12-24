<template>
  <div>
    <el-form-item :label="$t('申请条件')" v-if="scope === 0">
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
    <!-- <el-form-item label="首存类型">
      <el-radio-group
        v-model="ruleScopeDtos.depositType"
        @change="handleConditionsChange"
      >
        <el-radio :label="0">常规</el-radio>
        <el-radio :label="1">每日首存</el-radio>
        <el-radio :label="2">每周首存</el-radio>
        <el-radio :label="3">限时首存</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <!-- <el-form-item
      :rules="saveTypeCheck"
      prop="rule.ruleScopeDtos.validDate"
      v-show="ruleScopeDtos.depositType == 0"
    >
      <el-form :model="ruleScopeDtos" :rules="typeCheck" ref="saveTypeCheckCur">
        <el-form-item class="firstSaveType" prop="validDate">
          完成首存
          <el-input
            type="number"
            v-model.number="ruleScopeDtos.validDate"
            @change="handleConditionsChange"
          ></el-input>
          天内可领取，过期不可领取
        </el-form-item>
      </el-form>
    </el-form-item> -->
    <!-- <el-form-item
      :rules="saveTypeCheck"
      prop="rule.ruleScopeDtos.validDate"
      v-show="ruleScopeDtos.depositType == 3"
    >
      <el-form :model="ruleScopeDtos" :rules="typeCheck" ref="saveTypeCheckCur">
        <el-form-item class="firstSaveType" prop="validDate">
          自注册日起
          <el-input
            type="number"
            v-model.number="ruleScopeDtos.day"
            @change="handleConditionsChange"
          ></el-input>
          天内可领取，过期不可领取 （例如设定7日，则若10日13:00:00注册，16日可领，从17日00:00:00开始不可领取）
        </el-form-item>
      </el-form>
    </el-form-item> -->
    <!-- 活动规则 -->
    <el-form-item
      :rules="activityRule"
      prop="rule.ruleScopeDtos.activityRuleDtos"
      :label="$t('活动规则')"
    >
      <ActivityRuleDtosForm
        class="casdcasdcas"
        ref="activityRuleDtos"
        :showRenderHeader="true"
        v-model="ruleScopeDtos.activityRuleDtos"
        :isShowPresentMoney="true"
      />
    </el-form-item>
  </div>
</template>

<script>
import ActivityRuleDtosForm from "../common_forms/ActivityRuleDtos";

export default {
  components: { ActivityRuleDtosForm },
  model: {
    prop: "ruleScopeDtos",
    event: "change"
  },
  props: ["ruleScopeDtos", "scope"],
  data() {
    var typeCheck = (rule, value, callback) => {
      if (!this.ruleScopeDtos.depositType) {
        if (!value && value !== 0) {
          return callback(new Error(this.$t("首存天数不能为空")));
        } else if (!Number.isInteger(value)) {
          callback(new Error(this.$t("请输入有效整数数值")));
        } else if (Number.isInteger(value) && value < 0) {
          callback(new Error(this.$t("常规首存有效期设置有误")));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
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
        },
         {
          label: this.$t('已验证邮箱'),
          value: 'isMail'
        },
        {
          label: "APP注册",
          value: "isApp"
        }
      ],

      activityRule: {
        validator: (rule, value, callback) => {
          this.$refs.activityRuleDtos.validate(valid => {
            if (valid) {
              callback();
            }
          });
        }
      },
      typeCheck: {
        validDate: [{ validator: typeCheck, trigger: "change" }]
      },
      saveTypeCheck: {
        validator: (rule, value, callback) => {
          this.$refs.saveTypeCheckCur.validate(valid => {
            if (valid) {
              callback();
            }
          });
        }
      }
    };
  },
  computed: {
    ruleScopeDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.ruleScopeDtos));
      },
      set(value) {
        this.$emit("change", value);
      }
    }
  },
  created() {
    this.initConditions();
  },
  methods: {
    handleConditionsChange() {
      const { conditions, conditionsGroup, ruleScopeDtosObserver } = this;
      for (const { value } of conditionsGroup) {
        ruleScopeDtosObserver[value] = conditions.includes(value);
      }
      // ruleScopeDtosObserver["validDate"] =
      //   !ruleScopeDtosObserver.depositType && ruleScopeDtosObserver.validDate
      //     ? ruleScopeDtosObserver.validDate
      //     : 0;
      // 触发set
      this.ruleScopeDtosObserver = ruleScopeDtosObserver;
    },
    initConditions() {
      // this.ruleScopeDtos.isMail = false;
      for (const item of this.conditionsGroup) {
        const { value } = item;
        if (this.ruleScopeDtos[value]) {
          this.conditions.push(value);
        }
      }
      this.handleConditionsChange();
    }
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
