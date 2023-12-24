<template>
  <el-dialog :visible="formAdjustVisible" :title="$t('调整赠送金额')" @close="handleAdjustClose">
    <el-form class="form-wrapper" label-position="right" label-width="120px" label-suffix=":" ref="adjust_form" :model="formModel" :rules="rules">
      <template>
        <el-form-item :label="$t('会员')" prop="loginName">
          <div style="display: flex;">
            <el-input v-model="formModel.loginName" :placeholder="$t('请输入会员')" disabled></el-input>
          </div>
        </el-form-item>
        <el-form-item :label="$t('所属代理')" prop="agyAccount">
          <el-input v-model="formModel.agyAccount" :placeholder="$t('请输入所属代理')" disabled></el-input>
        </el-form-item>
        <!-- tmplCode = AQ0000021 抽奖 -->
        <el-form-item v-if="tmplCode === 'AQ0000021'" :label="$t('赠送金额')" prop="depositedAmount">   
          <el-input  v-model="formModel.depositedAmount" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item v-else :label="$t('赠送金额')" prop="bonusAmount">
          <el-input  v-model="formModel.bonusAmount" placeholder="" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('调整后赠送金额')" prop="newBonusAmount">
          <el-input v-model="formModel.newBonusAmount" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('流水金额')" prop="auditAmount">
          <el-input type="number" v-model.number="formModel.auditAmount" :placeholder="$t('请输入流水金额')" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('调整后流水金额')" prop="newAuditAmount">
          <el-input v-model="formModel.newAuditAmount" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="modifyAmountMemo">
          <el-input type="textarea" rows="5" v-model="formModel.modifyAmountMemo" :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="adjustSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleAdjustClose">{{ $t('取消') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import _ from "lodash"
import {
  checkNumberAndDecimals,
} from "../../../config/utils";

const checkNumberAndTwoDecimal = function (value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  props: [
    "formAdjustVisible",
    "info",
    "tmplCode"
  ],
  data() {
    return {
      rules: {
        newBonusAmount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          // {
          //   type: "number",
          //   min: 0,
          //   message: "请输入数值",
          //   trigger: "blur",
          // },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数的数字")));
              }
            },
            trigger: "blur",
          },
        ],
        newAuditAmount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          // {
          //   type: "number", //"integer",
          //   min: 0,
          //   message: "应该为大于等于0",
          //   trigger: "blur",
          // },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数的数字")));
              }
            },
            trigger: "blur",
          },
        ],
      },
      formModel: {}
    };
  },
  mounted() {
    this.formModel = _.cloneDeep(this.info)
  },
  methods: {
    adjustSubmit() {
      this.$refs.adjust_form.validate((valid) => {
        if (valid) {
          this.$emit("adjustSubmit", this.formModel);
        }
      });
    },
    handleAdjustClose() {
      this.$emit("update:formAdjustVisible", false);
    },
  }
};
</script>
