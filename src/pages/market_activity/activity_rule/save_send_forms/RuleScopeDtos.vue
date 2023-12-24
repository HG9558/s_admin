<template>
  <div>
    <!-- 活动规则 -->
    <el-form-item :rules="activityRule" prop="bettingGiftRuleDtos" :label="$t('活动规则')">
      <ActivityRuleDtosForm ref="activityRuleDtos" v-model="ruleScopeDtos.bettingGiftRuleDtos" />
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
          this.$refs.activityRuleDtos.validate((valid) => {
            if (valid) {
              callback();
            }
          });
        },
      },
    };
  },
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

