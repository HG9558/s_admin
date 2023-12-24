<template>
  <div>
    <el-form ref="form" :model="{ ruleDtos }" class="formNow">
      <el-table :data="ruleDtos">
        <el-table-column
          type="index"
          :label="$t('序号')"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('负盈利范围')" width="400" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item
              prop="payoutMin"
              :rules="rules.payoutMin(scope.$index)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.payoutMin"
                :placeholder="$t('最低金额')"
              ></el-input>
            </el-form-item>
            &nbsp;~&nbsp;
            <el-form-item
              prop="payoutMax"
              :rules="rules.payoutMax(scope.$index)"
            >
              <el-input
                class="center"
                type="number"
                v-model.number="scope.row.payoutMax"
                :placeholder="$t('最高金额')"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="300" :label="$t('赠送金额')" align="center">
          <div slot-scope="scope" class="saveRule error">
            <el-form-item
              class="pr"
              prop="donateAmount"
              :rules="
                rules.checkNumberAndDecimals(
                  scope.$index,
                  scope.row.donateAmount
                )
              "
            >
              <span>{{ $t('赠送比例') }}：</span>
              <el-input
                class="center gold"
                type="number"
                v-model.number="scope.row.donateAmount"
              ></el-input>
              <span class="pbr">&nbsp;%</span>
            </el-form-item>
            <el-form-item
              class="pr min"
              prop="donateAmountMax"
              :rules="rules.isInteger(scope.$index, scope.row.donateAmountMax)"
            >
              <span>{{ $t('最高赠送') }}：</span>
              <el-input
                class="center gold"
                type="number"
                v-model.number="scope.row.donateAmountMax"
              ></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="220" :label="$t('存款要求')" align="center">
          <div slot-scope="scope" class="saveRule">
            <el-form-item>
              <el-radio-group
                class="pt13"
                v-model="scope.row.depositAmountType"
                @change="saveOrder(scope.$index, scope.row.depositAmountType)"
                :placeholder="$t('请选择是否启用')"
              >
                <el-radio :label="0">{{ $t('不限制') }}</el-radio>
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
        <el-table-column width="200" :label="$t('流水倍数')" align="center" :render-header="renderHeader">
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
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils";
export default {
  model: {
    prop: "ruleDtos",
    event: "change"
  },
  inject: ["getRuleScopeDtosTemplate"],
  props: ["ruleDtos"],
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
        payoutMin: index => {
          return {
            validator: (rule, value, callback) => {
              const { payoutMin, payoutMax } = this.ruleDtos[index];
              if (checkNatureNumber(payoutMin)) {
                if (checkNatureNumber(payoutMax)) {
                  if (payoutMin < payoutMax) {
                    if (index > 0) {
                      // 如果不是第一条规则
                      const { payoutMax: beforeOnecBetMax } = this.ruleDtos[
                        index - 1
                      ];
                      if (payoutMin >= beforeOnecBetMax) {
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
        payoutMax: index => {
          return {
            validator: (rule, value, callback) => {
              const { payoutMin, payoutMax } = this.ruleDtos[index];
              if (checkNatureNumber(payoutMax)) {
                if (checkNatureNumber(payoutMin)) {
                  if (payoutMin < payoutMax) {
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
              if (checkNatureNumber(item) && item >= 0) {
                callback();
              } else {
                callback(new Error(this.$t("请输入有效整数")));
              }
            },
            trigger: "blur"
          };
        },
        checkNumberAndDecimals: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if (checkNumberAndDecimals(item, 2) && item >= 0) {
                callback();
              } else {
                callback(new Error(this.$t("请输入最多两位小数的有效数值")));
              }
            },
            trigger: "blur"
          };
        }
      },
      curIndex: 0
    };
  },
  computed: {
    activityRuleDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.ruleDtos));
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
      this.ruleDtos.splice(index, 1);
    },
    handleAddRule() {
      let arr =
        (this.ruleDtos.length &&
          JSON.parse(
            JSON.stringify(this.ruleDtos[this.ruleDtos.length - 1])
          )) ||
        [];
      this.$emit("change", this.ruleDtos.concat(arr));
    },
    saveOrder(index, value) {
      if (!value) {
        this.ruleDtos[index].depositMin = 0;
      }
    },
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
  padding: 20px 0;
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
  padding-left: 10px;
  /deep/ .el-form-item {
    margin-bottom: 0px !important;
    .el-form-item__content {
      margin-bottom: 17px;
    }
  }
  .min {
    /deep/ .el-form-item__content {
      margin-bottom: 5px;
    }
  }
  .pr {
    position: relative;
    .pbr {
      position: absolute;
      right: 39px;
    }
  }
  .pt13 {
    position: relative;
    top: 13px;
  }
}
.error {
  /deep/ .el-form-item__error {
    margin-left: 99px;
  }
}
.center {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.gold {
  width: 50% !important;
}
.num {
  width: 200px !important;
}
.pd15 {
  padding-bottom: 15px;
}
.formNow {
  margin: 40px 0 0 -240px;
  /deep/ .el-table__row {
    .is-center {
      padding: 0 !important;
      .cell {
        overflow: visible;
      }
    }
  }
}
</style>
