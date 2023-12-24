<template>
  <div class="prize-line">
    <el-form ref="form" :model="{ lotteryAreaDtos }">
      <el-table :data="lotteryAreaDtos">
        <el-table-column type="index" :label="$t('序号')" align="center"></el-table-column>
        <el-table-column width="150" :label="$t('奖品类型')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="prizeType" :rules="rules.validType(scope.row.prizeType)">
              <el-select class="center" v-model.number="scope.row.prizeType" :placeholder="$t('请选择奖品类型')" @change="onChangePrizeType($event, scope)">
                <el-option :key="item.value" :value="item.value" :label="item.label" v-for="item in prizeTypeList">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="300" :label="$t('奖品名称')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="prizeName" :rules="rules.textlength(scope.$index, scope.row.prizeName)">
              <el-input class="center" v-model="scope.row.prizeName" :placeholder="$t('请输入奖品名称')"></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="200" :label="$t('彩金金额')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item prop="donateAmount" v-if="scope.row.prizeType === 2">
              <!-- <el-input class="center" type="number" v-model="scope.row.donateAmount" placeholder="请输入彩金金额" :disabled="!scope.row.prizeType"></el-input> -->
              <SdyInputType v-model="scope.row.donateAmount" :placeholder="$t('请输入彩金金额')" :inputValue="scope.row.donateAmount" :allowNull="true"></SdyInputType>
              <!-- <el-input v-else disabled></el-input> -->
            </el-form-item>
            <el-form-item v-else>
              <el-input disabled></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="200" :label="$t('流水倍数')" align="center">
          <div class="rule-dtos-item" slot-scope="scope">
            <el-form-item v-if="scope.row.prizeType === 2"  prop="multipleWater">
              <!-- <el-input class="center" type="number" v-model.number="scope.row.multipleWater" placeholder="请输入流水倍数"></el-input> -->
              <SdyInputType v-model="scope.row.multipleWater" :placeholder="$t('请输入流水倍数')" :inputValue="scope.row.multipleWater" :allowNull="true" type="zs"></SdyInputType>
            </el-form-item>
            <el-form-item v-else>
              <el-input disabled></el-input>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="220" :label="$t('抽奖份数')" align="center">
          <div slot-scope="scope" class="rule-dtos-item rule-dtos-probability">
            <el-form-item>
              <el-input class="center" type="number" v-model.number="scope.row.prizeNumber" placeholder="请输入抽奖份数" @input="onNumberOfDrawInput"></el-input>
              <!-- <SdyInputType v-model="scope.row.probability" :placeholder="$t('请输入抽奖份数')" :inputValue="scope.row.probability" :allowNull="true" type="zs"></SdyInputType><span class="span-probability">%</span> -->
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column width="220" :label="$t('中奖概率')" align="center">
          <div slot-scope="scope" class="rule-dtos-item rule-dtos-probability">
            <el-form-item prop="probability">
              <!-- <el-input class="center" type="number" v-model.number="scope.row.probability" placeholder="请输入中奖概率"></el-input> -->
              <!-- <SdyInputType v-model="scope.row.probability" :placeholder="$t('请输入中奖概率')" :inputValue="scope.row.probability" :allowNull="true" type="zs"></SdyInputType><span class="span-probability">%</span> -->
              <span>{{ scope.row.probability }}%</span>
            </el-form-item>
          </div>
        </el-table-column>
        <el-table-column align="center" width="200">
          <el-button slot="header" type="primary" class="rule-dtos_button" @click="handleAddRule">
            {{ $t('添加奖品') }}
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
  </div>
</template>

<script>
import {
  checkNatureNumber,
  checkNumberAndDecimals,
  getPercentValue,
} from "../../../../config/utils";
import SdyInputType from '../../../../components/SdyInputType'

export default {
  model: {
    prop: "lotteryAreaDtos",
    event: "change",
  },
  inject: ["rebatesNeDtoTemplate"],
  props: ["lotteryAreaDtos"],
  components: { SdyInputType },
  data() {
    return {
      rules: {
        isInteger: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              debugger
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
        validType: (item) => {
          return {
            validator: (rule, value, callback) => {
              if (!item && item !== 0) {
                callback(new Error(this.$t("请选择抽奖类型")));
              } else {
                callback();
              }
            },
            trigger: "blur",
          }
        },
        textlength: (index, item) => {
          return {
            validator: (rule, value, callback) => {
              if (!item) {
                callback(new Error(this.$t("请输入奖品名称")));
              } else if (item.length > 30) {
                callback(new Error("奖品名称不能超过30字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          };
        },
      },
      setSaveDialogVisible: false,
      curIndex: 0,
      form: {
        depositDaysType: "",
        depositDays: "",
        depositAmountType: "",
        depositMin: "",
        depositMax: "",
      },
      keyList: [
        "depositDaysType",
        "depositDays",
        "depositAmountType",
        "depositMin",
        "depositMax",
      ],
      prizeTypeList: [
        // 奖品类型
        {
          label: this.$t("谢谢参与"),
          value: 1,
        },
        {
          label: this.$t("彩金"),
          value: 2,
        },
        {
          label: this.$t("实物奖品"),
          value: 3,
        },
      ]
    };
  },
  computed: {
    activityRuleDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.lotteryAreaDtos));
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
  methods: {
    onNumberOfDrawInput(value) {
      const areaArr = this.lotteryAreaDtos
      // const prizeNumberArr = areaArr.filter(item => item.prizeNumber).map(item => item.prizeNumber)
      const prizeNumberArr = areaArr.filter(item => item.prizeNumber)
      const sum = prizeNumberArr.reduce((prev, item) => prev + item.prizeNumber, 0)
      this.lotteryAreaDtos.forEach((item, i) => {
        const probability = (item.prizeNumber || 0) / sum
        item.probability = (probability * 100).toFixed(2)
        // const probability = getPercentValue(prizeNumberArr, i, 2)
        // item.probability = probability
      })
    },
    onChangePrizeType(prizeType, scope) {
      const lotteryAreaDtos = this.activityRuleDtosObserver
      lotteryAreaDtos[scope.$index].donateAmount = null
      lotteryAreaDtos[scope.$index].multipleWater = null
      this.activityRuleDtosObserver = lotteryAreaDtos
    },
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    },
    handleDeleteRule(index) {
      this.lotteryAreaDtos.splice(index, 1);
      this.$emit("change", this.lotteryAreaDtos);
    },
    handleAddRule() {
      const { rebatesNeDtoTemplate } = this;
      const curlotteryAreaDtos = JSON.parse(rebatesNeDtoTemplate.prizeAreaDtos);
      this.$emit("change", this.lotteryAreaDtos.concat(curlotteryAreaDtos));
    },
    setSaveOrder(index) {
      this.setSaveDialogVisible = true;
      this.curIndex = index;
      this.keyList.map((key) => {
        this.form[key] = this.lotteryAreaDtos[index][key];
      });
    },
    saveOrder(index, value) {
      if (!value) {
        this.lotteryAreaDtos[index].depositMin = 0;
      }
    },
    submit() {
      this.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          let arr = this.lotteryAreaDtos;
          this.keyList.map((key) => {
            arr[this.curIndex][key] = this.form[key];
          });
          this.$emit("change", arr);
          this.setSaveDialogVisible = false;
        }
      });
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
      deep: true,
    },
  },
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
.rule-dtos-probability {
  position: relative;
  .span-probability {
    position: absolute;
    right: 10px;
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
.prize-line {
  padding: 10px 0;
  border-bottom: 1px dashed #dddfe5;
  margin: 15px;
  margin-left: -100px;
}
</style>
