<template>
  <div class="activity-rule-form-wrapper" v-loading="loading">
    <h5 class="activity-rule-header">
      {{ $t('代理契约') }}
      <el-button class="activity-rule-header_btn" @click="$router.go(-1)">{{ $t('返回') }}</el-button>
    </h5>
    <el-form ref="form" v-loading="isFormLoadingCompleted" class="activity-rule-body activity_border" :model="formModel" label-width="auto" label-suffix=":" :rules="rules">
      <!-- 公共表单 开始 -->
      <el-form-item prop="contractName" :label="$t('策略名称')" class="input_w200">
        <el-input v-model="formModel.contractName" :placeholder="$t('请输入策略名称')"></el-input>
      </el-form-item>
      <el-form-item prop="commissionCap" :label="$t('佣金上限')" class="input_w200 agent_input">
        <el-input v-model="formModel.commissionCap" :placeholder="$t('请输入佣金上限')"></el-input><span>%</span>
      </el-form-item>
      <el-form-item prop="validbetmax" :label="$t('活跃人数设置')" class="input_w200 input_err_prompt">
        <div class="ml60">
          {{ $t('周期内累计投注额') }}>=<el-input v-model="formModel.validbetmax" :placeholder="$t('请输入活跃人数设置')"></el-input>{{ currencyText() }}
        </div>
      </el-form-item>
      <!-- rule表单 -->
      <div class="form_bottom">
        <el-form-item :label="$t('佣金比例分级')" class="activity-rule-inline-block">
          <SaveTable ref="saveTable" :commissionCap="formModel.commissionCap" :curOperate="curOperate" :curOperateIsInfo="curOperateIsInfo" :contractDtos="formModel.rule" @change="getContractDtos" @newContractArr="getNewRule" :saveInitFormModelRule="saveInitFormModelRule" />
        </el-form-item>
        <!-- <el-form-item label="上级返佣比例" class="activity-rule-inline-block">
          <div class="right_agent_input agent_input">
            <el-form class="activity-rule-body" label-width="100px" label-suffix=":" :model="formModel" ref="agent_form" :rules="rules">
              <el-form-item prop="rebateratio" label="总代理">
                <el-input v-model="formModel.rebateratio" placeholder="请输入总代理比例"></el-input><span>%</span>
              </el-form-item>
              <el-form-item prop="firstagentratio" label="一级代理">
                <el-input v-model="formModel.firstagentratio" placeholder="请输入一级代理比例"></el-input><span>%</span>
              </el-form-item>
            </el-form>
          </div>
        </el-form-item> -->
      </div>
    </el-form>
    <div class="activity-rule-footer">
      <el-button v-if="!curOperateIsInfo" @click="$router.go(-1)">{{ $t('取消') }}</el-button>
      <el-button v-if="!curOperateIsInfo" class="activity-rule-footer_save" type="primary" @click="handleSave">{{ $t('保存') }}</el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { checkNumberAndDecimals } from "../../../config/utils";
import systemConfig from "../../../config/config.js";
import SaveTable from "./SaveTable";
import site from '@/mixins/site'
export default {
  mixins: [site],
  components: {
    SaveTable,
  },
  mixins: [site],
  data() {
    var isTwoInteger = (rule, value, callback) => {
      if(rule.field==='commissionCap'){
        if(value>100){
          callback(new Error(this.$t("佣金上限不能大于100%")));
        }
      }
      if (checkNumberAndDecimals(value, 2)) {
        callback();
      } else {
        callback(new Error(this.$t("请输入最多两位小数的有效数值")));
      }
    };
    var isNotNull = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback(new Error(this.$t("请输入策略名称")));
      } else {
        callback();
      }
    };
    return {
      formModel: {},
      isFormLoadingCompleted: false,
      selfDifineFormModel: {
        contractName: null,
        commissionCap: null,
        validbetmax: null,
        rule: [
          {
            commissionRate: null,
            netprofitAmount: null,
            activenumber: null,
            validBet: null,
          },
        ],
        // rebateratio: null,
        // firstagentratio: null,
      },
      saveInitFormModelRule: [],
      rules: {
        contractName: [{ validator: isNotNull, trigger: "blur" }],
        commissionCap: [{ validator: isTwoInteger, trigger: "blur" }],
        validbetmax: [{ validator: isTwoInteger, trigger: "blur" }],
        // rebateratio: [{ validator: isTwoInteger, trigger: "blur" }],
        // firstagentratio: [{ validator: isTwoInteger, trigger: "blur" }],
      },
      loading: false,
      saveRule: ''
    };
  },
  computed: {
    curOperate() {
      // add 新增， info 查看, edit 修改
      return this.$route.query.curOperate === "add";
    },
    curOperateIsInfo() {
      return this.$route.query.curOperate === "info";
    },
  },
  created() {
    this.initSet(
      this.curOperate
        ? this.selfDifineFormModel
        : JSON.parse(this.$route.query.rowData)
    );
  },
  methods: {
    initSet(data) {
      this.saveInitFormModelRule = _.cloneDeep(data).rule;
      this.formModel = _.cloneDeep(data);
    },
    getContractDtos(val) {
      this.$nextTick(()=> {
        this.$set(this.formModel, "rule", val);
      })
    },
    setData({ auditMultiple, auditType, levelDtoList }) {
      let bool = false;
      if (this.rebateDate.levelDtoList) {
        this.rebateDate.levelDtoList.map((item, index) => {
          if (item.level == levelDtoList[0].level) {
            item.depthDtoList = levelDtoList[0].depthDtoList;
            bool = true;
          }
        });
      } else {
        this.rebateDate["levelDtoList"] = levelDtoList;
        bool = true;
      }
      this.rebateDate["auditMultiple"] = auditMultiple;
      this.rebateDate["auditType"] = auditType;
      if (!bool) {
        this.rebateDate.levelDtoList.push(levelDtoList[0]);
      }
    },
    getNewRule(rule) {
      this.saveRule = rule
    },
    handleSave() {
      this.$refs.saveTable.$refs.saveForm.validate((valid) => {
        if(valid==false){
          return false
        }else{
          this.$refs.form.validate((valid) => {
            if (valid) {
              // this.$refs.agent_form.validate((agent_valid) => {
              //   if (agent_valid) {}
              // });
              this.loading = true;
              this.$axios
                .post(
                      this.curOperate
                        ? systemConfig.urls.agentContract.add
                        : systemConfig.urls.agentContract.update,
                      {
                        ...this.formModel,
                        rule: this.saveRule ? this.saveRule : this.formModel.rule
                      }
                    )
                    .then(() => {
                      this.loading = false;
                      this.$router.go(-1);
                    })
                    .finally(() => {
                      this.loading = false;
                });
            }
          });
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.form_bottom {
  position: relative;
}
/deep/ .activity-rule-inline-block {
  display: inline-block;
  position: relative;
  top: 0;
  & + .activity-rule-inline-block {
    margin-left: 40px;
  }
}
.right {
  position: absolute;
  left: 920px;
}
.right_agent_input {
  margin-left: -80px;
  /deep/ .el-input {
    width: 180px !important;
  }
}
.agent_input {
  position: relative;
  span {
    position: absolute;
    right: -22px;
  }
}
.activity-rule-form-wrapper {
  padding: 40px;
}
.activity-rule-header {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .activity-rule-header_btn {
    float: right;
  }
}
.activity-rule-body {
  .input_w200 {
    .ml60 {
      display: block;
      position: relative;
      margin: 40px 0 10px;
      left: -80px;
      width: 600px;
      font-size: 14px;
      color: rgb(96, 98, 102);
      /deep/ .el-input {
        margin: 0 10px;
        width: 200px !important;
      }
    }
    /deep/ .el-form-item__content {
      width: 220px !important;
    }
  }
  .input_err_prompt {
    /deep/ .el-form-item__error {
      left: 40px !important;
      top: 90%;
    }
  }
}
.activity_border {
  padding: 30px;
  border: 1px solid #eee;
}
.activity-rule-footer {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  .activity-rule-footer_save {
    margin-left: 30px;
  }
}
</style>
