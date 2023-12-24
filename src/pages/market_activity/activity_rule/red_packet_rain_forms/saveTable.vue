<template>
  <div>
    <el-form ref="form" :model="{ redPacketRainRuleDtos }">
      <el-table :data="redPacketRainRuleDtos">
        <el-table-column type="index" :label="$t('序号')" align="center"></el-table-column>
        <el-table-column :label="$t('当日存款')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="minAmount" :rules="rules.isTwoInteger(scope.$index, scope.row.minAmount)" class="cur_today_amoutn">
              <span class="symbol">>=</span>
              <el-input class="center" v-model="scope.row.minAmount" :placeholder="$t('请输入当日存款')"></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column :label="$t('红包次数')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="number" :rules="rules.isInteger(scope.$index, scope.row.number)">
              <el-input class="center" v-model="scope.row.number" :placeholder="$t('请输入红包次数')"></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column  :label="$t('最近3天连续登录')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-checkbox v-model="scope.row.isAward"></el-checkbox>
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
    prop: "redPacketRainRuleDtos",
    event: "change",
  },
  inject: ["rebatesNeDtoTemplate"],
  props: ["redPacketRainRuleDtos"],
  data() {
    return {
      rules: {
        isInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if (checkNatureNumber(Number(item))) {
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
        callback(valid);
      });
    },
    handleDeleteRule(index) {
      this.redPacketRainRuleDtos.splice(index, 1);
    },
    handleAddRule() {
      let arr = [JSON.parse(this.rebatesNeDtoTemplate)]
      this.$emit("change", this.redPacketRainRuleDtos.concat(arr));
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
        width: 85%;
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
