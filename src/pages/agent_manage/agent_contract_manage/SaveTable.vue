<template>
  <div class="prize-line">
    <el-form :model="{contractArr}" class="el_form" ref="saveForm">
      <el-table :data="contractArr" :key="Math.random()">
        <el-table-column :label="$t('佣金比例')">
          <div slot-scope="scope" class="rule-dtos-item rule-dtos-probability">
            <el-form-item class="el_item_position" prop="commissionRate" :rules="[{validator:(rule, value, callback)=>{v_commissionRate(rule, value, callback,scope.$index)},trigger: 'blur'}]">
              <SdyInputType v-model="scope.row.commissionRate" :placeholder="$t('请输入佣金比例')" :inputValue="scope.row.commissionRate" :allowNull="true"></SdyInputType>
              <span class="span_rigth">%</span>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('净输赢金额')">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item class="el_item_position" prop="netprofitAmount" :rules="[{validator:(rule, value, callback)=>{v_netprofitAmount(rule, value, callback,scope.$index)},trigger: 'blur'}]">
              <span>>=</span>
              <SdyInputType v-model="scope.row.netprofitAmount" style="width: 50% !important" :placeholder="$t('净输赢金额')" :inputValue="scope.row.netprofitAmount" :allowNull="true" />
              <span class="span_rigth">{{ currencyText() }}</span>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('活跃人数')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item class="el_item_position" prop="activenumber" :rules="[{validator:(rule, value, callback)=>{v_activenumber(rule, value, callback,scope.$index)},trigger: 'blur'}]">
              <span>>=</span>
              <SdyInputType v-model="scope.row.activenumber" style="width: 50% !important" :placeholder="$t('请输入活跃人数')" :inputValue="scope.row.activenumber" :allowNull="true" type="zs" />
              <span class="span_rigth">{{ $t('人') }}</span>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('有效投注额')" align="center" width="200">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item class="el_item_position" prop="validBet" :rules="[{validator:(rule, value, callback)=>{v_validBet(rule, value, callback,scope.$index)},trigger: 'blur'}]">
              <span class="span_left">>=</span>
              <SdyInputType v-model="scope.row.validBet" :placeholder="$t('请输入有效投注额')" :inputValue="scope.row.validBet" :allowNull="true" />
              <span class="span_rigth">{{ currencyText() }}</span>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('操作')" align="center" width="120" v-if="!curOperateIsInfo">
          <div slot-scope="scope" class="rule-dtos-item">
            <el-button type="danger" class="rule-dtos_button" @click="handleDeleteRule(scope.$index)">
              {{ $t('删除') }}
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="form_operate" v-if="!curOperateIsInfo">
      <el-button slot="header" type="primary" class="rule-dtos_button" @click="resetAddRule">
        {{ $t('重置') }}
      </el-button>
      <el-button slot="header" type="primary" class="rule-dtos_button" @click="handleAddRule">
        +{{ $t('添加') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals,
} from "../../../config/utils";
import SdyInputType from "../../../components/SdyInputType";
import _ from "lodash";
import site from '@/mixins/site'

export default {
  // model: {
  //   prop: "contractDtos",
  //   event: "change",
  // },
  mixins: [site],
  props: ["contractDtos", "saveInitFormModelRule", "curOperate", "curOperateIsInfo", "commissionCap"],
  components: { SdyInputType },
  data() {
    return {
      v_commissionRate: (rule, value, callback,index)=> {
        if (!this.contractArr[index].commissionRate) {
          callback(new Error(this.$t('请输入佣金比例')));
        } else if (isNaN(this.contractArr[index].commissionRate)) {
          callback(new Error(this.$t('佣金比例只能为数字')));
        } else if(this.contractArr[index].commissionRate>this.commissionCap){
          callback(new Error(this.$t('佣金比例分级的分级佣金最大值不能超过佣金上限')))
        } else {
          callback();
        }
      },
      v_netprofitAmount: (rule, value, callback,index)=>{
        if (!this.contractArr[index].netprofitAmount) {
          callback(new Error(this.$t('请输入净输赢金额')));
        } else if (isNaN(this.contractArr[index].netprofitAmount)) {
          callback(new Error(this.$t('净输赢金额只能为数字')));
        } else {
          callback();
        }
      },
      v_activenumber: (rule, value, callback,index)=>{
        const { activenumber } = this.contractArr[index]
        if (!activenumber && activenumber !== 0) {
          callback(new Error(this.$t('请输入活跃人数')));
        } else if (isNaN(activenumber)) {
          callback(new Error(this.$t('活跃人数只能为数字')));
        } else {
          callback();
        }
      },
      v_validBet: (rule, value, callback,index)=>{
        const { validBet } = this.contractArr[index]
        if (!validBet && validBet !== 0) {
          callback(new Error(this.$t('请输入有效投注额')));
        } else if (isNaN(validBet)) {
          callback(new Error(this.$t('有效投注额只能为数字')));
        } else {
          callback();
        }
      },
      rules: {
        isInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              debugger;
              if (checkNatureNumber(item)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入有效整数")));
              }
            },
            trigger: "blur",
          };
        },
        isTwoInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if (checkNumberAndDecimals(item, 2)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入最多两位小数的有效数值")));
              }
            },
            trigger: "blur",
          };
        },
      },
      emptyCommissionRateItem: {
        commissionRate: null,
        netprofitAmount: null,
        activenumber: null,
        validBet: null,
      },
      contractArr: [],
    };
  },
  methods: {
    handleDeleteRule(index) {
      this.contractArr.splice(index, 1);
    },
    handleAddRule() {
      this.contractArr.push(
        JSON.parse(JSON.stringify(this.emptyCommissionRateItem))
      );
    },
    resetAddRule() {
      debugger
      if (this.curOperate) {
        this.$emit("change", this.saveInitFormModelRule)
        return
      }
      this.contractArr = JSON.parse(this.saveInitFormModelRule)
    },
  },
  watch: {
    contractDtos: {
      handler(n, o) {
        const arr = n
          ? typeof n === "string"
            ? JSON.parse(n)
            : n
          : _.cloneDeep([this.emptyCommissionRateItem]);
        this.contractArr = _.cloneDeep(arr);
      },
      deep: true,
      immediate: true,
    },
    contractArr: {
      handler(n, o) {
        this.$emit("newContractArr", JSON.stringify(n));
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-dtos-item {
  // display: flex;
  // align-items: center;
  padding: 10px 0;
  .el-form-item {
    margin-bottom: 0;
    // flex: 1;
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
/deep/ .el-table__row td {
  vertical-align: top !important;
}
.rule-dtos_button.rule-dtos_button {
  padding: 9px 15px !important;
}
.center {
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.el_item_position {
  /deep/ .el-form-item__content {
    min-height: 46px;
    position: relative;
    span,
    div {
      position: relative;
    }
    .span_rigth {
      right: -5px;
    }
    .el-input {
      left: 5px;
      width: 70% !important;
    }
  }
}
.prize-line {
  margin-left: -80px;
  width: 820px;
  .form_operate {
    margin-top: 20px;
  }
}
</style>
