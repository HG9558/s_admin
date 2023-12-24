<template>
  <div>
    <el-dialog
      :title="titletype == 0 ? $t('人工增加') : $t('人工减少')"
      :visible.sync="showbill"
      @close="cancel('adjustTypeFrom')"
      :showAdjust="showAdjust"
    >
      <el-form
        style="margin-left: 10px"
        class="small-space form-content adjust"
        ref="adjustTypeFrom"
        label-position="right"
        :model="mbrBillDetail"
        label-width="auto"
        :rules="manualRule"
      >
        <div v-if="titletype && !isManualOperation">
          <el-form-item :label="$t('调整类型')">
            <el-button size="small" disabled>{{ $t('人工减少') }}</el-button>
          </el-form-item>
        </div>
        <el-form-item :label="$t('会员名')">
          <el-input
            size="small"
            v-model="inputName"
            disabled
            :placeholder="$t('会员名')"
          ></el-input>
          <span v-if="!isManualOperation">{{ $t('共') }}{{ selectids.length }}{{ $t('人') }}</span>
        </el-form-item>
        <el-form-item
          class="amount-item"
          :label="$t('调整金额')"
          prop="amount"
          :rules="manualRule.moneyAmount"
        >
          <el-input
            style="width: 80%"
            size="small"
            type="number"
            v-model.number="mbrBillDetail.amount"
            class="input"
          ></el-input>
          <span v-if="titletype" style="width: 20%">
            <el-popover
              ref="adjustbal"
              placement="right"
              width="200"
              trigger="hover"
              :content="$t('调整金额必需小于等于账户余额')"
            ></el-popover>
            <el-button
              type="text"
              v-popover:adjustbal
              @click="mbrBillDetail.amount = bal && parseInt(bal)"
              >{{ $t('余额') }}：{{ bal }}</el-button
            >
          </span>
        </el-form-item>
        <div v-if="!titletype && !isManualOperation" style="margin-top: 15px">
          <el-form-item :label="$t('存款类型')">
            <el-row>
              <el-col :span="10">
                <el-form-item
                  prop="depositType"
                  :rules="commonRule.changeNotNull"
                >
                  <el-select size="small" v-model="mbrBillDetail.depositType">
                    <el-option :label="$t('人工存款') " :value="1"></el-option>
                    <!--<el-option  label='优惠活动 ' :value='2'></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  v-if="mbrBillDetail.depositType == 2"
                  prop="activityId"
                  :rules="commonRule.changeNotNull"
                >
                  <el-select size="small" v-model="mbrBillDetail.activityId">
                    <el-option
                      v-for="item in activityList"
                      :key="item.activityName"
                      :label="item.activityName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item :label="$t('调整方式')">
          <el-col :span="10" style="margin-left:5px;" v-if="!titletype">
            <el-form-item>
              <el-select
                size="small"
                v-model="mbrBillDetail.auditAddType"
                style="width:100%"
                @change="handleChangeAudit"
              >
                <el-option
                  v-for="item in handleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left:5px;" v-else>
            <el-form-item>
              <el-select
                size="small"
                v-model="mbrBillDetail.reduceType"
                style="width:100%"
                @change="changeReduceType"
              >
                <el-option
                  v-for="item in handleReducs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('活动类型')" v-if="mbrBillDetail.auditAddType===0||mbrBillDetail.reduceType===1">
          <el-col :span="10" style="margin-left:5px;">
            <el-form-item>
              <el-select
                size="small"
                v-model="mbrBillDetail.acType"
                style="width:100%"
                @change="changeRewardType"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label='item.tmplName'
                  :value='item.id'
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('活动名称')" v-if="mbrBillDetail.auditAddType===0||mbrBillDetail.reduceType===1">
          <el-col :span="10" style="margin-left:5px;">
            <el-form-item>
              <el-select
                size="small"
                v-model="mbrBillDetail.activityId"
                style="width:100%"
                @change='$forceUpdate()'
              >
                <el-option
                  v-for="item in activityOptions"
                  :key="item.id"
                  :label='item.activityName'
                  :value='item.id'
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('是否计入会员数据')" :rules="[{required:true,message: $t('请选择'),trigger:'blur'}]" prop="isCalculateProfit">
          <el-row>
            <el-col :span="14">
              <el-radio
                size="small"
                v-model="mbrBillDetail.isCalculateProfit"
                :label="true"
                >{{ $t('是') }}</el-radio
              >
              <el-radio
                size="small"
                v-model="mbrBillDetail.isCalculateProfit"
                :label="false"
                >{{ $t('否') }}</el-radio
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('是否参与账目核对')+ '：'" prop="isCalculateCheck" :rules="[{ required: true, message: $t('请选择是否参与账目核对'), trigger: 'blur' }]">
          <el-radio :disabled="isCalculateDisabled" v-model="mbrBillDetail.isCalculateCheck" :label='false'>{{ $t('否') }}</el-radio>
          <el-radio :disabled="isCalculateDisabled" v-model="mbrBillDetail.isCalculateCheck" :label='true'>{{ $t('是') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('稽核')">
          <el-row v-if="!titletype">
            <el-col :span="14">
              <el-radio
                size="small"
                v-model="mbrBillDetail.auditType"
                :label="0"
                >{{ $t('免稽核') }}</el-radio
              >
              <el-radio
                size="small"
                v-model="mbrBillDetail.auditType"
                :label="1"
                >{{ $t('稽核') }}</el-radio
              >
            </el-col>
            <el-col :span="10" v-if="mbrBillDetail.auditType === 1">
              <el-form-item prop="auditMultiple" :rules="multipleWaterRules">
                <el-input
                  size="small"
                  type="number"
                  v-model="mbrBillDetail.auditMultiple"
                >
                  <template slot="append">{{ $t('倍') }}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-popover
            ref="clearjii"
            placement="right"
            width="200"
            trigger="hover"
            :content="$t('勾选后将清除该会员当前所有未通过的流水稽核')"
          ></el-popover>
          <el-checkbox
            v-if="titletype"
            v-model.number="mbrBillDetail.isClear"
            :true-label="1"
            v-popover:clearjii
          >
            {{ $t('清除稽核点') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="memo" :rules="manualRule.memo">
          <el-input type="textarea" v-model="mbrBillDetail.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('adjustTypeFrom')"
          >{{ $t('取消') }}</el-button
        >
        <el-button size="small" type="primary" @click="savebill"
          >{{ $t('确定') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import systemConfig from "../../config/config.js";
import {
    checkNumberAndDecimals
  } from "@/config/utils";
  const checkNumberAndTwoDecimal = function (value) {
    return checkNumberAndDecimals(value, 2);
};
export default {
  name:"typeAdjust",
  data() {
    return {
      safePassword: "",
      tmpValue4SafeCheck:{},
      showbill: this.showAdjust,
      mbrBillDetail: {
        financialCode: "AA",
        auditType: 0,
        depositType: 1,
        amount: null,
        adjustType: "",
        auditAddType: "",
        reduceType: "",
        isCalculateCheck: true,
      },
      // bal: 0,
      activityList: [],
      manualRule: systemConfig.rules.manualRule,
      commonRule: systemConfig.rules.commonRule,
      typeOptions: [],
      activityOptions: [],
      activityOptions0: [],
      multipleWaterRules: {
        validator: (rule, value, callback) => {
          const { auditMultiple, auditAddType} = this.mbrBillDetail
          if (!auditAddType) {
            if (checkNumberAndDecimals(auditMultiple)  && auditMultiple >= 1) {
              callback();
            } else {
              callback(new Error(this.$t("只允许填写大于0的正整数")));
            }
            return
          }
          if (checkNumberAndTwoDecimal(auditMultiple)  && auditMultiple >= 0) {
            callback();
          } else {
            callback(new Error(this.$t("只允许填写大于0，且最多2位小数")));
          }
        },
        trigger: "blur",
      },
    };
  },
  computed: {
    handleOptions() {
     return [
        {
          label: this.$t("优惠添加"),
          value: 0
        },
        {
          label: this.$t("额度补回"),
          value: 1
        },
        /* {
            label:'入款冲销',
            value:2,
          }, */
        {
          label: this.$t("其他"),
          value: 3
        }
      ]
    },
    handleReducs() {
      return [
        {
          label: this.$t("风控扣款"),
          value: 0
        },
        {
          label: this.$t("优惠冲销"),
          value: 1
        },
        {
          label: this.$t("额度冲销"),
          value: 2
        },
        {
          label: this.$t("入款冲销"),
          value: 3
        },
        {
          label: this.$t("其他"),
          value: 4
        }
      ]
    },
    inputName() {
      return this.selectNames.join();
    },
    isCalculateDisabled () {
      return (!this.titletype && !this.mbrBillDetail.auditAddType) || (this.titletype && this.mbrBillDetail.reduceType === 1 )
    },
  },
  props: {
    selectids: {
      type: Array,
      default: []
    },
    selectNames: {
      type: Array,
      default: []
    },
    titletype: "",
    showAdjust: {
      type: Boolean,
      default: false
    },
    viewId: {
      type: String,
      default: ""
    },
    isManualOperation: {
      type: Boolean,
      default: false
    },
    bal: {
      type: Number | String,
      default: 0
    }
  },
  created() {
    if (this.titletype) {
      //人工减少
      this.mbrBillDetail.adjustType = 1;
      this.mbrBillDetail.auditAddType = "";
      this.mbrBillDetail.depositType = "";
      this.$set(this.mbrBillDetail, "reduceType", 0);
    } else {
      this.mbrBillDetail.adjustType = 0;
      this.mbrBillDetail.depositType = 1;
      this.$set(this.mbrBillDetail, "auditAddType", 0);
      this.mbrBillDetail.reduceType = "";
    }
    this.getActivityType()
    this.getActivityOptions()
  },
  mounted() {
    if (this.titletype === 0) {
      this.mbrBillDetail.financialCode = "AA";
    } else {
      this.mbrBillDetail.financialCode = "AM";
      // this.getWallet()
    }
    // this.getactivityList()
  },
  methods: {
    cancel(formName) {
      this.$emit("update:showAdjust", false);
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    getactivityList() {
      this.$axios.get(systemConfig.urls.activityListAll).then(res => {
        this.activityList = res.data.data;
      });
    },
    // getWallet() {
    //   this.$axios.get(systemConfig.urls.userInfo + this.viewId).then(resp => {
    //     this.bal = resp.data.mbr.balance
    //   })
    // },

    savebill() {
      this.mbrBillDetail.ids = this.selectids;
      this.mbrBillDetail.adjustType = this.titletype;
      this.$refs.adjustTypeFrom.validate(valid => {
        if (valid) {
          if (this.mbrBillDetail.adjustType === 1) {
            if (this.mbrBillDetail.amount > this.bal) {
              this.$message({
                type: "warning",
                message: this.$t("调整金额必需小于等于账户余额")
              });
              return;
            }
          }

          // 安全密码弹窗
          if(!this.safePassword) {
            this.$store.commit("safePasswordShow", true);
            this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
            this.$set(this.tmpValue4SafeCheck,"callback", this.savebill);
            this.$set(this.tmpValue4SafeCheck,"args", []);
            return;
          }

          // this.$emit('update:showAdjust', false)
          this.$store.state.fullscreenLoading = true;
          const url =
            this.titletype === 0
              ? systemConfig.urls.auditAdd
              : systemConfig.urls.auditRuduce;
          // this.$axios.post(url, this.mbrBillDetail).then(res => {
          this.$axios.post(url, this.mbrBillDetail,{headers: {securepwd: this.safePassword}}).then(res => {
            this.$message({
              type: "success",
              message: this.$t("成功")
            });
            this.cancel("adjustTypeFrom");
          }).finally(() => {
            this.safePassword="";
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("请填写正确的信息")
          });
        }
      });
    },
    getActivityType() {
      this.$axios.get(systemConfig.urls.getActivityType).then((resp) => {
        let arr = resp.data.page;
        let index = arr.findIndex((val) => {
          return val.tmplCode == "AQ0000011";
        });
        index != -1 && arr.splice(index, 1);
        this.typeOptions = arr;
        console.log(this.typeOptions)
      });
    },
    getActivityOptions() {
      let url = "?pageSize=1000&pageNo=1";
      this.$axios
        .get(systemConfig.urls.activityIntroduction.list + url)
        .then((resp) => {
          this.activityOptions0 = resp.data.data.list;
          this.activityOptions = resp.data.data.list;
        });
    },
    changeRewardType(v){
        this.mbrBillDetail.activityId = null
        this.activityOptions = []
        this.activityOptions0.map(ws=>{
          if(ws.actTmplId===v){
            this.activityOptions.push(ws)
          }
        })
      },
    handleChangeAudit(val) {
      if (val !== 0) {
        this.clearType()
      }
    },
    changeReduceType(val) {
      if (val !== 1) {
        this.clearType()
      }
    },
    clearType() {
      this.mbrBillDetail.acType = this.mbrBillDetail.activityId = ''
    }
  },
  watch: {
    '$store.state.safePasswordCallbackPageEnd': function() {
      let page = this.$store.state.safePasswordCallbackPageEnd.split('_')[0];
      if(!this.$options.name || page !== this.$options.name){ return }

      this.safePassword = this.$store.state.safePassword;
      if(this.tmpValue4SafeCheck.callback && typeof(this.tmpValue4SafeCheck.callback) === 'function'){
        this.tmpValue4SafeCheck.callback.apply(this,this.tmpValue4SafeCheck.args || [])
      }

      this.safePassword="";
      this.tmpValue4SafeCheck={};
    },

    showAdjust() {
      this.showbill = this.showAdjust;
    },
    isCalculateDisabled (n, o) {
      if (n) this.$set(this.mbrBillDetail, 'isCalculateCheck', true)
    }
  }
};
</script>
<style lang="scss">
form .el-form-item {
  margin-bottom: 10px;
}
</style>
