<template>
  <div>
    <el-form-item
      :label="$t('赠送金额')"
      prop="donateAmount"
      :rules="formRules.donateAmount"
    >
      <el-input
        type="number"
        style="width: 10%"
        v-model.number="rule.donateAmount"
        :placeholder="$t('请输入赠送金额')"
      ></el-input>
    </el-form-item>
    <el-form-item
      :label="$t('流水倍数')"
      prop="multipleWater"
      :rules="formRules.multipleWater"
    >
      <el-input
        type="number"
        style="width: 10%"
        v-model.number="rule.multipleWater"
        :placeholder="$t('请输入流水倍数')"
      ></el-input>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils";

export default {
  props: ["rule"],
  data() {
    return {
      formRules: {
        donateAmount: {
          validator: (rule, value, callback) => {
            const { donateAmount } = this.rule;
            if (checkNumberAndDecimals(donateAmount, 2) && donateAmount >= 0) {
              callback();
            } else {
              callback(new Error(this.$t("大于等于0且最多保留两位小数")));
            }
          },
          trigger: "blur",
        },
        multipleWater: {
          validator: (rule, value, callback) => {
            const { multipleWater } = this.rule;
            if (checkNatureNumber(multipleWater)) {
              callback();
            } else {
              callback(new Error(this.$t("流水倍数应为非负整数")));
            }
          },
          trigger: "blur",
        },
      },
    };
  },
};
</script>
