<template>
  <div>
    <el-form class="form-wrapper" ref="ruleForm" label-position="right" :model="curRowData" label-width="auto" :rules="ruleForm">
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
          <el-form-item :label="$t('净输赢冲销') + ':'" prop="writeOff">
            {{curRowData.writeOff}}
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
          <el-form-item :label="$t('上级返佣') + ':'" prop="writeOff" class="w270">
            <el-table :data="curRowData.detailsDtos">
              <el-table-column prop="agyAccount" :label="$t('上级代理')" align="center" width="80">
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
          <el-form-item :label="$t('审核') + ':'" class="ridao w270" prop="reviewStatus">
            <el-radio-group v-model="curRowData.reviewStatus">
              <el-radio :label="1">{{ $t('通过') }}</el-radio>
              <el-radio :label="0">{{ $t('不通过') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('风控备注') + ':'" class="w270">
            <el-input type="textarea" v-model="curRowData.memo"></el-input>
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
    var checkIssuestatus = (rule, value, callback) => {
      if (![0, 1].includes(value)) {
        callback(new Error(this.$t(this.$t("请选择审核状态"))));
        return;
      } else {
        callback()
        return;
      }
    };
    return {
      curRowData: {},
      initStatus: null,
      statusShow: true,
      ruleForm: {
        reviewStatus: [{ validator: checkIssuestatus, trigger: "blur" }],
      },
    };
  },
  created() {
    this.curRowData = _.cloneDeep(this.rowData);
    this.initStatus = this.curRowData.reviewStatus;
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
          const { id, reviewStatus, memo } = this.curRowData;
          this.$axios
            .get(systemConfig.urls.newAggentList.updateReviewStatus, {
              params: {
                id,
                reviewStatus,
                memo,
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
  .half {
    // width: 40%;
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
    margin-left: 40px;
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
        width: 240px !important;
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
</style>
