<template>
<!-- 活动规则： 余额返利： 活动规则功能页面 -->
  <el-form ref="form" :model="{ activityRuleDtos }">
    <el-table :data="activityRuleDtos" border>
      <el-table-column type="index" :label="$t('序号')" align="center;"></el-table-column>
      <el-table-column v-if="tmplCode==='AQ0000028'" :label="$t('发放对象')" align="center">{{ $t('上级') }}</el-table-column>
      <el-table-column v-if="tmplCode === 'AQ0000003'" :label="$t('存款方式')" width="180">
        <template slot-scope="scope">
          <el-select
            class="rule-dtos-item_select"
            v-model="scope.row.paymentType"
          >
            <el-option v-for="item in paymentTypeList" :key="item.id" :label="item.platfromName" :value="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('中心钱包最低余额')" v-if="isVipAddDiscount && !isMutilRuleScope">
        <div class="rule-dtos-item" slot-scope="scope">
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.amountMin(scope.$index)"
          >
            <el-input
              type="number"
              v-model.number="scope.row.amountMin"
              :placeholder="$t('请输入金额')"
            ></el-input>
          </el-form-item>
        </div>
      </el-table-column>
      <el-table-column :label="$t('余额范围')" width="200" v-if="tmplCode==='AQ0000030'">
        <div class="rule-dtos-item" slot-scope="scope">
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.amountMin(scope.$index)"
          >
            <el-input
              type="number"
              v-model.number="scope.row.amountMin"
              :placeholder="$t('请输入金额')"
            ></el-input>
          </el-form-item>
          &nbsp;~&nbsp;
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.amountMax(scope.$index)"
          >
            <el-input
              type="number"
              v-model.number="scope.row.amountMax"
              :placeholder="$t('请输入金额')"
            ></el-input>
          </el-form-item>
        </div>
      </el-table-column>
      <el-table-column :label="$t('存款范围')" width="200" v-else>
        <div class="rule-dtos-item" slot-scope="scope">
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.amountMin(scope.$index)"
          >
            <el-input
              type="number"
              v-model.number="scope.row.amountMin"
              :placeholder="$t('请输入金额')"
            ></el-input>
          </el-form-item>
          &nbsp;~&nbsp;
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.amountMax(scope.$index)"
          >
            <el-input
              type="number"
              v-model.number="scope.row.amountMax"
              :placeholder="$t('请输入金额')"
            ></el-input>
          </el-form-item>
        </div>
      </el-table-column>
      <el-table-column width="518" :label="$t('赠送金额')">
        <div class="rule-dtos-item" slot-scope="scope">
          <el-select
            class="rule-dtos-item_select"
            v-model="scope.row.donateType"
            @change="v=>clearPix(scope.row,v)"
          >
            <el-option :label="$t('比例赠送') + '%'" :value="0" v-if="tmplCode!=='AQ0000028'"></el-option>
            <el-option :label="$t('金额赠送') + '(' + $t('元') + ')'" :value="1" v-if="!isShowPresentMoney"></el-option>
          </el-select>
          <el-form-item
            prop="activityRuleDtos"
            :rules="rules.donateAmount(scope.$index)"
          >
            <el-input
              type="number"
              style="max-width: 145px;"
              v-model.number="scope.row.donateAmount"
              :placeholder="scope.row.donateType ? $t('请输入金额') : $t('请输入比例')"
            ></el-input>
          </el-form-item>
          <template v-if="scope.row.donateType === 0">
            <span class="rule-dtos-item_label">{{ $t('最高赠送') }}</span>
            <el-form-item
              prop="activityRuleDtos"
              :rules="rules.donateAmountMax(scope.$index)"
            >
              <el-input
                type="number"
                v-model.number="scope.row.donateAmountMax"
                :placeholder="$t('请输入金额')"
              ></el-input>
            </el-form-item>
          </template>
        </div>
      </el-table-column>
      <el-table-column width="220" :label="$t('流水倍数')" :render-header="renderHeader">
        <div class="rule-dtos-item" slot-scope="scope">
          <el-form-item prop="activityRuleDtos" :rules="rules.multipleWater(scope.$index)">
            <el-input
              type="number"
              v-model.number="scope.row.multipleWater"
              :placeholder="$t('请输入流水倍数')">
            </el-input>
          </el-form-item>
        </div>
      </el-table-column>
      <el-table-column align="center" width="200" v-if="!isVipAddDiscount && !isMutilRuleScope">
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
            type="danger"
            class="rule-dtos_button"
            v-if="activityRuleDtos.length > 1"
            @click="handleDeleteRule(scope.$index)"
          >
            {{ $t('删除') }}
          </el-button>
        </div>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals,
} from "../../../../config/utils";
import systemConfig from "../../../../config/config";

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  model: {
    prop: "activityRuleDtos",
    event: "change"
  },
  inject: ["getRuleScopeDtosTemplate", 'tmplCode'],
  props: ["activityRuleDtos", 'isVipAddDiscount', 'isShowPresentMoney', 'showRenderHeader', 'isMutilRuleScope'],// isMutilRuleScope 仅有首存送多配置用到
  data() {
    return {
      rules: {
        amountMin: index => {
          return {
            validator: (rule, value, callback) => {
              const { amountMin, amountMax } = this.activityRuleDtos[index];
              if (checkNumberAndTwoDecimal(amountMin) && amountMin >= 0) {
                if (checkNumberAndTwoDecimal(amountMax)) {
                  if (this.tmplCode === 'AQ0000003') return callback();
                  if (amountMin < amountMax) {
                    if (index > 0) {
                      // 如果不是第一条规则
                      const {
                        amountMax: lastAmountMax
                      } = this.activityRuleDtos[index - 1];
                      if (amountMin >= lastAmountMax) {
                        callback();
                      } else {
                        callback(
                          new Error(this.$t("最小值应该大于等于上一条规则的最大值"))
                        );
                      }
                    } else {
                      callback();
                    }
                  } else {
                    callback(new Error(this.$t("最小值应该小于最大值")));
                  }
                } else {
                  callback();
                }
              } else {
                callback(new Error(this.$t("大于等于0且允许2位小数")));
              }
            },
            trigger: "blur"
          };
        },
        amountMax: index => {
          return {
            validator: (rule, value, callback) => {
              const { amountMin, amountMax } = this.activityRuleDtos[index];
              if (checkNumberAndTwoDecimal(amountMax)) {
                if (checkNumberAndTwoDecimal(amountMin)) {
                  if (amountMin < amountMax) {
                    callback();
                  } else {
                    callback(new Error(this.$t("最大值应该大于最小值")));
                  }
                } else {
                  callback();
                }
              } else {
                callback(new Error(this.$t("大于等于0且允许2位小数")));
              }
            },
            trigger: "blur"
          };
        },
        donateAmount: index => {
          return {
            validator: (rule, value, callback) => {
              const { donateAmount } = this.activityRuleDtos[index];
              if (checkNumberAndTwoDecimal(donateAmount)) {
                callback();
              } else {
                callback(new Error(this.$t("大于等于0且允许2位小数")));
              }
            },
            trigger: "blur"
          };
        },
        donateAmountMax: index => {
          return {
            validator: (rule, value, callback) => {
              const { donateAmountMax } = this.activityRuleDtos[index];
              if (
                checkNumberAndTwoDecimal(donateAmountMax) &&
                donateAmountMax >= 0
              ) {
                callback();
              } else {
                callback(new Error(this.$t("大于等于0且允许2位小数")));
              }
            },
            trigger: "blur"
          };
        },
        multipleWater: index => {
          return {
            validator: (rule, value, callback) => {
              const { multipleWater } = this.activityRuleDtos[index];
              if (checkNatureNumber(multipleWater)) {
                callback();
              } else {
                callback(new Error(this.$t("流水倍数应为正整数")));
              }
            },
            trigger: "blur"
          };
        }
      },
      paymentTypeList: [
      ],
    };
  },
  computed: {
    activityRuleDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.activityRuleDtos));
      },
      set(value) {
        this.$emit("change", value);
      }
    }

  },
  created() {
    if (this.tmplCode === 'AQ0000003') {
      this.getPaymentTypeList()
    }
  },
  methods: {
    clearPix(row,v){
      if(v===1){
        row.donateAmountMax = null
      }
    },
    getPaymentTypeList() {
      this.$axios.get(systemConfig.urls.activityRule.getPaymentTypeList).then(({ data }) => {
        if (data) {
          this.paymentTypeList = data.data
          this.paymentTypeList.unshift({
            id: 0,
            platfromName: this.$t('全部'),
          })
          this.paymentTypeList.push({
            id: 100,
            platfromName: 'USDT',
          },{
            id: 101,
            platfromName: this.$t('银行卡转账'),
          })
        }
      })
    },
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    },
    handleDeleteRule(index) {
      const { activityRuleDtosObserver } = this;
      activityRuleDtosObserver.splice(index, 1);
      this.activityRuleDtosObserver = activityRuleDtosObserver;
    },
    handleAddRule() {
      const { activityRuleDtosObserver } = this;
      activityRuleDtosObserver.push(
        this.getRuleScopeDtosTemplate().activityRuleDtos[0]
      );
      this.activityRuleDtosObserver = activityRuleDtosObserver;
      if(this.tmplCode==='AQ0000028'){
        console.log(this.activityRuleDtosObserver)
        this.activityRuleDtosObserver.map(ws=>{
          ws.donateType = 1
        })
      }
    },
    // 余额返利：活动规则：流水倍数的el-tooltip提示
    renderHeader(h,{column}){
      return !this.showRenderHeader ?  h('span', column.label) : h(
        'div', [
          h('span', column.label),
          h('el-tooltip',
            { props: { placement: 'top', width: '250px', trigger: 'hover', content: '本金加彩金的流水倍数' }},
            [h('i', {
              class:'el-icon-warning',
              style:'color: #5a9cf8; margin-left: -9px; '
            })
          ])
        ]
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.rule-dtos-item {
  display: flex;
  align-items: center;
  padding: 50px 0;
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
</style>
