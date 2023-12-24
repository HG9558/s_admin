<template>
  <div>
    <!-- 活动规则 -->
    <el-form-item
      :rules="activityRule"
      prop="ruleDtos"
      :label="$t('活动规则 (*负盈利范围为前日指定游戏的负盈利)')"
      label-width="343px"
    >
      <ActivityRuleDtosForm
        ref="activityRuleDtos"
        v-model="ruleScopeDtos.ruleDtos"
      />
    </el-form-item>
  </div>
</template>

<script>
import ActivityRuleDtosForm from "./saveTable";

export default {
  components: { ActivityRuleDtosForm },
  props: ["ruleScopeDtos"],
  data() {
    return {
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
