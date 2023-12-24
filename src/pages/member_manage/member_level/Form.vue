<template>
  <el-dialog :visible="formVisible" :title="isAdd ? $t('新增等级') : $t('编辑等级')" :close-on-click-modal="false" @close="handleClose">
    <el-form class="form-wrapper" label-position="right" label-width="auto" label-suffix=":" ref="form" :model="formModel" :rules="rules">
      <el-form-item :label="$t('等级名称')" prop="tierName">
        <el-input v-model="formModel.tierName" :placeholder="$t('请输入等级名称')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('前台说明')" prop="description">
        <el-input v-model="formModel.description" :placeholder="$t('此处文案将提示给会员，请注意条件的正确性例如:单周有效投注额累计达到10万及以上')"></el-input>
      </el-form-item>
      <template v-if="!isDefaultLevel">
        <el-form-item :label="$t('晋升本层级条件')" prop="promotionConditions">
          <div class="promotion-conditions-item">
            <span class="promotion-conditions-item_tip" s>
              <el-checkbox v-model="checkValidBet">{{ $t('累计有效投注') }}≥</el-checkbox>
            </span>
            <el-input v-model.number="formModel.validbetMin" style="margin-left: 20px" :placeholder="$t('请输入投注范围')"></el-input>
            <!--            &nbsp;-&nbsp;-->
            <!--            <el-input v-model.number="formModel.validbetMax" placeholder="请输入投注范围"></el-input>-->
          </div>
          <div class="promotion-conditions-item">
            <span class="promotion-conditions-item_tip">
              <el-checkbox v-model="checkDeposit">{{ $t('累计充值') }}≥</el-checkbox>
            </span>
            <el-input style="margin-left: 20px" v-model.number="formModel.depositMin" :placeholder="$t('请输入充值范围')"></el-input>
            <!--            &nbsp;-&nbsp;-->
            <!--            <el-input v-model.number="formModel.depositMax" placeholder="请输入充值范围"></el-input>-->
          </div>
          <div class="promotion-conditions-item">
            <span class="promotion-conditions-item_tip">{{ $t('满足条件') }}</span>
            <el-select v-model="formModel.conditions">
              <el-option :label="$t('满足以上全部条件晋升')" :value="0"></el-option>
              <el-option :label="$t('满足以上任意条件晋升')" :value="1"></el-option>
            </el-select>
          </div>

        </el-form-item>
        <el-form-item :label="$t('降至上一等级条件')" prop="downgradeBet">
          <div class="promotion-conditions-item">
            <span class="promotion-conditions-item_tip">{{ $t('期间累计投注小于') }}</span>
            <el-input v-model.number="formModel.downgradeBet" placeholder=""></el-input>
            <!--            &nbsp;-&nbsp;-->
            <!--            <el-input v-model.number="formModel.depositMax" placeholder="请输入充值范围"></el-input>-->
          </div>
        </el-form-item>
        <el-form-item :label="$t('恢复至下一等级条件')" prop="recoverBet">
          <div class="promotion-conditions-item">
            <span class="promotion-conditions-item_tip">{{ $t('期间累计投注') }}≥</span>
            <el-input v-model.number="formModel.recoverBet" placeholder=""></el-input>
          </div>
        </el-form-item>
        <el-form-item :label="$t('等级')" prop="accountLevel">
          <el-input v-model.number="formModel.accountLevel" :placeholder="$t('请输入等级')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('是否启用')" prop="available">
          <el-radio-group v-model="formModel.available">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0" :disabled="(formModel.accountCount||!hasPermission('member:mbractlevel:update'))?true:false">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item :label="$t('等级')" prop="zero">
          0
        </el-form-item>
      </template>
<!--      <div style=";padding-left: 10px;margin-bottom: 10px;font-size:16px;font-weight: bold;color: #666666">每日取款限额</div>-->

<!--        <el-form-item size='small' label="是否限制">-->
<!--          <el-switch v-model="formModel.feeAvailable" active-color="#13ce66" inactive-color="#ff4949" :inactive-value='0' :active-value='1' @change="setlimitNull"></el-switch>-->
<!--        </el-form-item>-->
<!--        <el-form-item size='small' label="每日允许取款次数" prop="withDrawalTimes" :rules="[{required: transferToBoolean(formModel.feeAvailable), message: '不能为空', trigger: 'blur'},{type: 'integer', min: 1, message: '请输入大于0的正整数'}]">-->
<!--          <el-input :disabled="!transferToBoolean(formModel.feeAvailable)" type="number" v-model.number="formModel.withDrawalTimes"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item size='small' label="每日取款限额" prop="withDrawalQuota" :rules="[{required: transferToBoolean(formModel.feeAvailable), message: '不能为空', trigger: 'blur'},{type: 'integer', min: 1, message: '请输入大于0的正整数'}]">-->
<!--          <el-input :disabled="!transferToBoolean(formModel.feeAvailable)" type="number" v-model.number="formModel.withDrawalQuota"></el-input>-->
<!--        </el-form-item>-->
    </el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { checkNumberAndDecimals } from "../../../config/utils";

const checkNumberAndTwoDecimal = function (value) {
  return checkNumberAndDecimals(value, 2);
};

import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
export default {
  props: ["formVisible", "infoForEdit"],
  data() {
    return {
      formModel: {
        tierName: null,
        description: null,
        promotionConditions: 1,
        depositMin: null,
        // depositMax: null,
        validbetMin: null,
        // validbetMax: null,
        downgradeBet: null,
        conditions: 0,
        essentialConditions: [],
        isName: 0,
        isMobile: 0,
        isBank: 0,
        isMail: 0,
        accountLevel: null,
        available: 1,
      },
      rules: {
        tierName: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { max: 10, message: this.$t("等级名称最长为10个字符"), trigger: "blur" },
        ],
        description: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { max: 255, message: this.$t("前台说明最长为255个字符"), trigger: "blur" },
        ],
        promotionConditions: [
          // 晋升条件
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.ignorePromotionConditionsRule) {
                // 忽略晋升条件的校验规则
                callback();
                return;
              }
              const { checkDeposit, checkValidBet } = this;
              const {
                depositMin,
                depositMax,
                validbetMin,
                validbetMax,
              } = this.formModel;
              if (checkDeposit || checkValidBet) {
                checkValidBet &&
                  validateMinAndMax(validbetMin, validbetMax, this.$t("投注"));
                checkDeposit &&
                  validateMinAndMax(depositMin, depositMax, this.$t("充值"));
                callback();
              } else {
                callback(new Error(this.$t("累计投注和累计充值至少勾选一个")));
              }
              function validateMinAndMax(min, max, typeText) {
                if (checkNumberAndTwoDecimal(min) && min >= 0) {
                  if (checkNumberAndTwoDecimal(max) && max > 0) {
                    return true;
                  } else {
                    callback(
                      new Error(`${typeText} ${this.$t('范围最大值必须大于0且允许两位小数')}`)
                    );
                  }
                } else {
                  callback(
                    new Error(
                      `${typeText} ${this.$t('范围最小值必须大于等于0且允许两位小数')}`
                    )
                  );
                }
              }
            },
            trigger: "blur",
          },
        ],
        accountLevel: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { min: 1, type: "integer", message: this.$t("请输入正整数"), trigger: "blur" },
        ],
        available: [{ required: true, message: this.$t("请选择是否启用") }],
        recoverBet: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { type: 'number', min:0,message: this.$t("只允许输入最多10位数字字符"), trigger: "blur" },
        ],
        downgradeBet: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { type: 'number', min:0,message: this.$t("只允许输入最多10位数字字符"), trigger: "blur" },
        ]
      },
      essentialConditionsOptions: [
        {
          label: this.$t("已实名"),
          value: "isName",
        },
        {
          label: this.$t("已验证手机"),
          value: "isMobile",
        },
        {
          label: this.$t("已验证银行卡"),
          value: "isBank",
        },
        {
          label: this.$t("已验证邮箱"),
          value: "isMail",
        },
      ],
      checkValidBet: true,
      checkDeposit: true,
      ignorePromotionConditionsRule: true,
      setlimitNullFlag: true,
    };
  },
  computed: {
    isAdd() {
      return !this.formModel.id;
    },
    isDefaultLevel() {
      return this.infoForEdit && this.infoForEdit.id === 1;
    },
    ...mapGetters(["hasPermission"]),
  },
  created() {
    if (this.infoForEdit) {
      this.initFormModel();
    }
  },
  methods: {
    transferToBoolean(val) {
      return systemConfig.transferToBoolean(val);
    },
    setlimitNull() {
        this.setlimitNullFlag = !this.setlimitNullFlag
      },
    initFormModel() {
      const formModel = JSON.parse(JSON.stringify(this.infoForEdit));
      const { promoteSign } = formModel;
      formModel.promotionConditions = 1;
      formModel.essentialConditions = [];
      this.checkValidBet = /^0|2$/.test(promoteSign);
      this.checkDeposit = /^1|2$/.test(promoteSign);
      /* for (const i of this.essentialConditionsOptions) {
        const { value } = i
        if (formModel[value]) {
          formModel.essentialConditions.push(value)
        }
      } */
      this.formModel = formModel;
    },
    handleSubmit() {
      this.ignorePromotionConditionsRule = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formModel));
          const { checkValidBet, checkDeposit } = this;
          // promoteSign 0 累计投注 1 累计充值 2 全部
          params.promoteSign = checkValidBet
            ? checkDeposit
              ? 2
              : 0
            : checkDeposit
            ? 1
            : null;
          for (const i of this.essentialConditionsOptions) {
            const { value } = i;
            //params[value] = Number(params.essentialConditions.indexOf(value) > -1)
            params[value] = 0;
          }
          delete params.promotionConditions;
          delete params.essentialConditions;
          this.$emit("submit", params);
        }
      });
    },
    handleClose() {
      this.$emit("update:formVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  .promotion-conditions-item {
    display: flex;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .promotion-conditions-item_tip {
      min-width: 125px;
    }
  }
}
</style>
