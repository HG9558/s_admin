<template>
  <div>
    <!-- 活动规则 -->
    <el-form-item
      :rules="activityRule"
      prop="ruleDtos"
      :label="$t('活动规则')"
    >
      <SaveTable
        ref="activityRuleDtos"
        v-model="rule"
        :rule="rule"
      />
    </el-form-item>
  </div>
</template>

<script>
import SaveTable from "./SaveTable.vue";

export default {
  components: { SaveTable },
  props: ["rule"],
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
