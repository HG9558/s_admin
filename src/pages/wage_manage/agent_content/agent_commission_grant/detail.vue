<template>
  <div>
    <el-form class="form-wrapper" ref="ruleForm" label-width="auto" :model="curRowData" :rules="ruleForm">
      <div class="half left">
        <div class="self_message">
          <el-form-item :label="$t('代理账号') + ':'" prop="agyAccount">
            {{curRowData.agyAccount}}
          </el-form-item>
          <el-form-item :label="$t('订单号') + ':'" prop="orderNo">
            {{curRowData.orderNo}}
          </el-form-item>
          <el-form-item :label="$t('周期') + ':'">
            {{curRowData.cycleStart +'/'+ curRowData.cycleEnd}}
          </el-form-item>
          <el-form-item :label="$t('活跃人数') + ':'" prop="activeNum">
            {{curRowData.activeNum}}
          </el-form-item>
          <el-form-item :label="$t('周期投注额') + ':'" prop="cycleBet">
            {{curRowData.cycleBet}}
          </el-form-item>
          <el-form-item :label="$t('净输赢') + ':'" prop="netwinlose">
            {{curRowData.netwinlose}}
          </el-form-item>
          <el-form-item :label="$t('净输赢冲销') + ':'">
            {{curRowData.writeOff}}
          </el-form-item>
          <el-form-item label="" prop="isClean">
            <el-checkbox class="self_check" v-model="curRowData.isClean">{{ $t('清除净输赢冲销') }}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('费用调整') + ':'" prop="adjustedAmount">
            <el-input type="text" v-model="curRowData.adjustedAmount" :placeholder="$t('请输入费用调整')" :disabled="initStatus !== 2"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="half right">
        <div class="self_message">
          <el-form-item :label="$t('佣金比例') + ':'" prop="rate">
            {{curRowData.rate}}
          </el-form-item>
          <el-form-item :label="$t('佣金发放额') + ':'" prop="commission">
            {{curRowData.commission}}
          </el-form-item>
          <el-form-item :label="$t('上级返佣') + ':'" class="w270">
            <el-table :data="curRowData.detailsDtos">
              <el-table-column prop="agyAccount" :label="$t('上级代理')" align="center" width="90">
              </el-table-column>
              <el-table-column prop="rate" :label="$t('返佣比例')" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.rate + '%'}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="commission" :label="$t('返佣金额')" align="center">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item :label="$t('审核') + ':'" prop="issuestatus">
            <el-radio-group v-model="curRowData.issuestatus" :disabled="initStatus !== 2">
              <el-radio :label="1">{{ $t('发放') }}</el-radio>
              <el-radio :label="0">{{ $t('拒绝') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('风控备注') + ':'" class="w270">
            <el-input :disabled="initStatus !== 2" type="textarea" v-model="curRowData.memo"></el-input>
          </el-form-item>
          <el-form-item :label="$t('财务备注') + ':'" class="w270">
            <el-input :disabled="initStatus !== 2" type="textarea" v-model="curRowData.financeMemo"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="dialog-footer">
      <el-button v-if="initStatus === 2&&showSave===true" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button @click="handleSubmitCancel">{{ $t('返回') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../../config/config";
import { checkNumberAndDecimals } from "../../../../config/utils";
import _ from "lodash";
export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
    showSave: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    var validateNum = (rule, value, callback) => {
      let val;
      if (value || value === "0") {
        val = Number(value);
      }
      if (checkNumberAndDecimals(val, 2)) {
        callback();
      } else {
        callback(new Error(this.$t("请输入最多两位小数的有效数值")));
      }
    };
    var checkIssuestatus = (rule, value, callback) => {
      console.log(
        value
      );
      if (![0, 1].includes(value)) {
        callback(new Error(this.$t("请选择审核状态")));
      } else {
        callback()
      }
    };
    var validateNum2 = (rule, value, callback) => {
      if(!value){
        callback();
      }
      let val;
      if (value || value === "0") {
        val = Number(value);
      }
      if (checkNumberAndDecimals(val, 2)) {
        callback();
      } else {
        callback(new Error(this.$t("请输入最多两位小数的有效数值")));
      }
    };
    return {
      curRowData: {},
      initStatus: null,
      statusShow: true,
      ruleForm: {
        adjustedAmount: [{ validator: validateNum2, trigger: "blur" }],
        issuestatus: [{ validator: checkIssuestatus, trigger: "blur" }],
      },
    };
  },
  created() {
    this.curRowData = _.cloneDeep(this.rowData);
    this.initStatus = this.curRowData.issuestatus;
  },
  methods: {
    getAgentIsdList({ agyAccount, attributes }) {
      this.$axios
        .get(systemConfig.urls.agentApply.superiorAgentList)
        .then((res) => {
          this.setInitData("options", res.data.data, "agyAccount");
        });
    },
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const {
            id,
            issuestatus,
            memo,
            financeMemo,
            isClean,
            adjustedAmount,
          } = this.curRowData;
          this.$axios
            .get(systemConfig.urls.newAggentList.updateFreedStatus, {
              params: {
                id,
                issuestatus,
                memo,
                financeMemo,
                isClean: isClean ? 1 : 0,
                adjustedAmount,
              },
            })
            .then((res) => {
              this.$emit("submit", true);
            });
        }
      });
    },
    handleSubmitCancel() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  justify-content: flex-start;
  .half {
    width: 50%;
    .self_message {
      // padding-left: 20px;
      .message {
        margin-left: -20px;
        font-weight: 800;
        margin-bottom: 15px;
      }
    }
  }
  .right {
    margin-left: 20px;
    .time {
      /deep/ .el-form-item__label {
        width: 80px !important;
        margin-left: -10px !important;
      }
    }
    .ridao {
      /deep/ .el-radio__label {
        font-size: 12px !important;
      }
    }
    .w270 {
      /deep/ .el-form-item__content {
        // width: 270px !important;
        font-weight: normal;
      }
    }
    .contrac_text {
      margin-left: 70px;
      color: #ec4e2e;
      margin-bottom: 18px;
      width: 270px;
    }
  }
}
.dialog-footer {
  display: block;
  text-align: center;
}
.self_message {
  /deep/ .el-form-item {
    .el-form-item__content {
      margin-left: 10px !important;
      .self_check {
        color: #ee6f43;
      }
    }
  }
}
/deep/ .el-dialog__body form {
  width: 100%;
}
</style>
