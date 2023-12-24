<template>
  <div>
    <el-form ref="form" :model="{ bettingGiftRuleDtos }">
      <el-table :data="bettingGiftRuleDtos">
        <el-table-column
          type="index"
          :label="$t('序号')"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('有效投注范围')" width="400" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item
              prop="validBetMin"
              :rules="rules.validBetMin(scope.$index)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.validBetMin"
                :placeholder="$t('最低金额')"
              ></el-input>
            </el-form-item>
            &nbsp;~&nbsp;
            <el-form-item
              prop="validBetMax"
              :rules="rules.validBetMax(scope.$index)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.validBetMax"
                :placeholder="$t('最高金额')"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="200" :label="$t('赠送金额')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item
              prop="donateAmount"
              :rules="rules.isInteger(scope.$index, scope.row.donateAmount)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.donateAmount"
                :placeholder="$t('请输入赠送金额')"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="220" :label="$t('存款要求')" align="left">
          <div slot-scope="scope" class="saveRule">
            <el-form-item>
              <el-radio-group
                v-model="scope.row.depositAmountType"
                @change="saveOrder(scope.$index, scope.row.depositAmountType)"
                :placeholder="$t('请选择是否启用')"
              >
                <el-radio :label="0">{{ $t('不限制') }}</el-radio><br />
                <el-radio :label="1">{{ $t('最低要求') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="pd15"
              prop="depositMin"
              :rules="rules.isInteger(scope.$index, scope.row.depositMin)"
            >
              <el-input
                class="center"
                type="number"
                :disabled="!scope.row.depositAmountType"
                v-model.number="scope.row.depositMin"
                :placeholder="$t('存款金额')"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="200" :label="$t('流水倍数')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item
              prop="multipleWater"
              :rules="rules.isInteger(scope.$index, scope.row.multipleWater)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.multipleWater"
                :placeholder="$t('请输入流水倍数')"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column align="center" width="200">
          <el-button
            slot="header"
            type="primary"
            slot-scope="scope"
            class="rule-dtos_button"
            @click="handleAddRule"
          >
            {{ $t('增加规则') }}
          </el-button>
          <div slot-scope="scope">
            <el-button
              v-if="scope.$index == 0"
              type="danger"
              :disabled="true"
              class="rule-dtos_button"
            >
              &nbsp;&nbsp;--&nbsp;&nbsp;
            </el-button>
            <el-button
              v-else
              type="danger"
              class="rule-dtos_button"
              @click="handleDeleteRule(scope.$index)"
            >
              {{ $t('删除') }}
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-form>
    <el-dialog
      :title="$t('存款要求')"
      :visible.sync="setSaveDialogVisible"
      width="20%"
      center
    >
      <el-form ref="dialogForm" :model="form" :rules="diaRules">
        <el-form-item :label="$t('存款天数限制')">
          <el-radio-group
            v-model="form.depositDaysType"
          >
            <el-radio :label="0">{{ $t('不限制') }}</el-radio>
            <el-radio :label="1">{{ $t('连续') }}</el-radio>
            <el-radio :label="2">{{ $t('非连续') }}</el-radio>
          </el-radio-group>
          <div>
            <el-form-item prop="depositDays">
              <el-input
                class="center num"
                v-model.number="form.depositDays"
                :disabled="!form.depositDaysType"
                :placeholder="$t('请输入存款天数')"
              >
              </el-input
              >&nbsp;&nbsp;
              <span>*{{ $t('从活动开始日期开始统计') }}</span>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item :label="$t('存款金额限制')">
          <el-radio-group
            v-model="form.depositAmountType"
            :placeholder="$t('请选择是否审核')"
          >
            <el-radio :label="0">{{ $t('不限制') }}</el-radio>
            <el-radio :label="1">{{ $t('限制') }}</el-radio>
          </el-radio-group>
          <div>
            <el-form-item
              prop="depositMin"
              style="float:left"
              :rules="[
                { required: true, message: $t('最小存款金额不能为空') },
                {
                  type: 'integer',
                  min: 0,
                  max: form.depositMax,
                  message: $t('最小存款金额必须为有效整数值且小于最大存款金额'),
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                class="center num"
                :disabled="!form.depositAmountType"
                v-model.number="form.depositMin"
                :placeholder="$t('请输入最小存款金额')"
              ></el-input
              >&nbsp;--&nbsp;
            </el-form-item>
            <el-form-item
              prop="depositMax"
              style="float:left"
              :rules="[
                { required: true, message: $t('最大存款金额不能为空') },
                {
                  type: 'integer',
                  min: form.depositMin,
                  message: $t('最大存款金额必须为有效整数值且大于最小存款金额'),
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                class="center num"
                :disabled="!form.depositAmountType"
                v-model.number="form.depositMax"
                :placeholder="$t('请输入最大存款金额')"
                @input="form.depositMin = form.depositMin"
              ></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <span class="diafooter">
          <el-form-item>
            <el-button @click="setSaveDialogVisible = false">{{ $t('取消') }}</el-button>
            <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
          </el-form-item>
        </span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { checkNatureNumber } from "../../../../config/utils";
export default {
  model: {
    prop: "bettingGiftRuleDtos",
    event: "change"
  },
  inject: ["getRuleScopeDtosTemplate"],
  props: ["bettingGiftRuleDtos"],
  data() {
    return {
      diaRules: {
        depositDays: [
          { required: true, message: this.$t("存款天数不能为空") },
          {
            type: "integer",
            min: 0,
            message: this.$t("存款天数必须为有效整数值"),
            trigger: "blur"
          }
        ]
      },
      rules: {
        validBetMin: index => {
          return {
            validator: (rule, value, callback) => {
              const { validBetMin, validBetMax } = this.bettingGiftRuleDtos[
                index
              ];
              if (checkNatureNumber(validBetMin)) {
                if (checkNatureNumber(validBetMax)) {
                  if (validBetMin < validBetMax) {
                    if (index > 0) {
                      // 如果不是第一条规则
                      const {
                        validBetMax: beforeOnecBetMax
                      } = this.bettingGiftRuleDtos[index - 1];
                      if (validBetMin >= beforeOnecBetMax) {
                        callback();
                      } else {
                        callback(new Error(this.$t("应大于或等于上一规则的最大值")));
                      }
                    } else {
                      callback();
                    }
                  } else {
                    callback(new Error(this.$t("最小值应小于同规则最大值")));
                  }
                } else {
                  callback();
                }
              } else {
                callback(new Error(this.$t("投注金额应为有效整数值")));
              }
            },
            trigger: "blur"
          };
        },
        validBetMax: index => {
          return {
            validator: (rule, value, callback) => {
              const { validBetMin, validBetMax } = this.bettingGiftRuleDtos[
                index
              ];
              if (checkNatureNumber(validBetMax)) {
                if (checkNatureNumber(validBetMin)) {
                  if (validBetMin < validBetMax) {
                    callback();
                  } else {
                    callback(new Error(this.$t("最大值应大于同规则最小值")));
                  }
                } else {
                  callback();
                }
              } else {
                callback(new Error(this.$t("投注金额应为有效整数值")));
              }
            },
            trigger: "blur"
          };
        },
        isInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if (checkNatureNumber(item)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入有效整数")));
              }
            },
            trigger: "blur"
          };
        }
      },
      setSaveDialogVisible: false,
      curIndex: 0,
      form: {
        depositDaysType: "",
        depositDays: "",
        depositAmountType: "",
        depositMin: "",
        depositMax: ""
      },
      keyList: [
        "depositDaysType",
        "depositDays",
        "depositAmountType",
        "depositMin",
        "depositMax"
      ]
    };
  },
  computed: {
    activityRuleDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.bettingGiftRuleDtos));
      },
      set(value) {
        this.$emit("change", value);
      }
    }
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    },
    handleDeleteRule(index) {
      this.bettingGiftRuleDtos.splice(index, 1);
    },
    handleAddRule() {
      let arr =
        (this.bettingGiftRuleDtos.length &&
          JSON.parse(
            JSON.stringify(
              this.bettingGiftRuleDtos[this.bettingGiftRuleDtos.length - 1]
            )
          )) ||
        [];
      this.$emit("change", this.bettingGiftRuleDtos.concat(arr));
    },
    saveOrder(index, value) {
      if (!value) {
        this.bettingGiftRuleDtos[index].depositMin = 0;
      }
    },
    submit() {
      this.$refs["dialogForm"].validate(valid => {
        if (valid) {
          let arr = this.bettingGiftRuleDtos;
          this.keyList.map(key => {
            arr[this.curIndex][key] = this.form[key];
          });
          this.$emit("change", arr);
          this.setSaveDialogVisible = false;
        }
      });
    }
  },
  watch: {
    form: {
      handler(n, o) {
        if (!n.depositDaysType) {
          n.depositDays = 0;
        }
        if (!n.depositAmountType) {
          n.depositMin = n.depositMax = 0;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.rule-dtos-item {
  display: flex;
  align-items: center;
  padding: 40px 0;
  .el-form-item {
    margin-bottom: 0;
    flex: 1;
  }
  /deep/ .rule-dtos-item_select .el-input {
    width: 126px;
    margin-right: 10px;
  }
  .rule-dtos-item_label {
    white-space: nowrap;
    margin: 0 10px;
  }
}
.rule-dtos_button.rule-dtos_button {
  padding: 9px 15px !important;
}
.saveRule {
  box-sizing: border-box;
  padding-left: 15px;
  /deep/ .el-form-item {
    margin-bottom: 0px !important;
  }
}
.center {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
/deep/ .el-dialog {
  width: 30% !important;
  .el-form-item__error {
    width: 200px;
    line-height: 15px;
  }
  .diafooter {
    .el-form-item__content {
      text-align: center;
      padding-top: 20px;
    }
  }
}
.num {
  width: 200px !important;
}
.pd15 {
  padding-bottom: 15px;
}
</style>
