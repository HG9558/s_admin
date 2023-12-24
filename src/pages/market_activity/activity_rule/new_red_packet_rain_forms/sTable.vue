<template>
  <div>
    <el-form ref="form" :model="{ newRedPacketRainNumDtoList }">
      <el-table :data="newRedPacketRainNumDtoList">
        <el-table-column type="index" :label="$t('序号')" align="center"></el-table-column>
        <el-table-column :label="$t('上一整点存款')+ '/' + $t('上一整点有效投注')" align="center"  width="360">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="depositAmount" :rules="rules.isTwoInteger(scope.$index, scope.row.depositAmount, scope.row.validBet)" class="cur_today_amoutn">
              <span class="symbol">>=</span>
              <el-input class="center" type="number" v-model.number="scope.row.depositAmount" :placeholder="$t('请输入当日存款')"></el-input>
              <el-input class="center" type="number" v-model.number="scope.row.validBet" :placeholder="$t('请输入有效下注')"></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('每个整点红包次数')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="number" :rules="rules.isInteger(scope.$index, scope.row.count)">
              <el-input class="center" v-model.number="scope.row.count" :placeholder="$t('请输入红包次数')"></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column  :label="$t('最近3天连续登录')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-checkbox v-model="scope.row.isContinuous"></el-checkbox>
          </div>
        </el-table-column>
        <el-table-column align="center" width="200">
          <el-button slot="header" type="primary" class="rule-dtos_button" @click="handleAddRule">
            {{ $t('增加规则') }}
          </el-button>
          <div slot-scope="scope">
            <el-button v-if="scope.$index == 0" type="danger" :disabled="true" class="rule-dtos_button">
              &nbsp;&nbsp;--&nbsp;&nbsp;
            </el-button>
            <el-button v-else type="danger" class="rule-dtos_button" @click="handleDeleteRule(scope.$index)">
              {{ $t('删除') }}
            </el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-table-column class="text" align="center" v-if="validRedRuleBool">{{ $t('请输入有效红包领取规则信息') }}</el-table-column>
    </el-form>
    <div class="text">{{ $t('红包次数当日可用，不参与视为放弃') }}</div>
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals,
} from "../../../../config/utils";
export default {
  model: {
    prop: "newRedPacketRainNumDtoList",
    event: "change",
  },
  inject: ["rebatesNeDtoTemplate"],
  props: ["newRedPacketRainNumDtoList"],
  data() {
    return {
      rules: {
        isInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if ((item || item === 0 ) && checkNatureNumber(Number(item))) {
                callback();
              } else {
                callback(new Error(this.$t("请输入有效整数")));
              }
            },
            trigger: "blur",
          };
        },
        isTwoInteger: (index, depositAmount, validBet) => {
          return {
            validator: (rule, value, callback) => {
              const bool1 = depositAmount && checkNumberAndDecimals(depositAmount, 2) &&  depositAmount >= 0 || !depositAmount
              const bool2 = validBet && checkNumberAndDecimals(validBet, 2) && validBet >= 0 || !validBet
              if (bool1 && bool2) {
                callback();
              } else {
                callback(new Error(this.$t("请输入最多两位小数的有效值")));
              }
            },
            trigger: "blur",
          };
        },
      },
      validRedRuleBool: false,
    };
  },
  computed: {
    activityRuleDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.redPacketRainRuleDtos));
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate((valid) => {
        // ”-“ 代表没有条件，不会触发活动规则，且数据不会被保存；0代表没有存款和没有有效投注，如果会员值为0，会生效触发活动资格；
        let arr = []
        this.newRedPacketRainNumDtoList.map(item => {
          const { depositAmount, validBet} = item
          const bool3 = depositAmount || depositAmount === 0
          const bool4 = validBet || validBet === 0
          if (bool3 && bool4) arr.push(item)
        })
        if (valid && arr.length) {
          this.validRedRuleBool = false
          this.$emit("change", arr);
          callback(valid)
        } else {
          this.validRedRuleBool = true
        }
      });
    },
    handleDeleteRule(index) {
      this.newRedPacketRainNumDtoList.splice(index, 1);
    },
    handleAddRule() {
      let arr = [JSON.parse(this.rebatesNeDtoTemplate)]
      this.$emit("change", this.newRedPacketRainNumDtoList.concat(arr));
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-dtos-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  .cur_today_amoutn {
    /deep/ .el-form-item__content {
      .el-input {
        display: inline-block;
        width: 45%;
      }
      .el-form-item__error {
        padding-left: 85px;
      }
    }
  }
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
  /deep/ .el-input__inner::-webkit-outer-spin-button,
  /deep/ .el-input__inner::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /deep/ .el-input__inner[type='number'] {
    -moz-appearance: textfield;
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
.text {
  color: #f56c6c;
  margin-top: 15px;
}
</style>
