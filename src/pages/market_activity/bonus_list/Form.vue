<template>
  <el-dialog :visible="formVisible" :title="isAdd ? $t('新增记录') : isBatchAudit ? $t('批量审核') : $t('审核')" @close="handleClose">
    <div class="btnlist-box" v-if="isAdd">
      <el-button v-for="(btn, i) in btnList" :key="i" :type="formModel.subRuleTmplCode === btn.value ? 'primary' : ''" @click="handleBtnClick(btn)">{{ btn.label }}</el-button>
    </div>
    <el-form class="form-wrapper" label-position="right" label-width="120px" label-suffix=":" ref="form" :model="formModel" :rules="rules">
      <template v-if="!isBatchAudit">
        <el-form-item :label="$t('会员')" prop="loginName">
          <div style="display: flex;">
            <el-input v-model="formModel.loginName" style="width: 70%" :placeholder="$t('请输入会员，多个会员请用英文,逗号隔开')" :disabled="!isAdd"></el-input>
            <el-button v-if="isAdd" type="primary" style="margin-left: 20px;" :disabled="!formModel.loginName" @click="validateLoginName">{{ $t('查询会员') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('所属代理')" prop="agyAccount">
          <el-input v-model="formModel.agyAccount" :placeholder="$t('请输入所属代理')" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('活动等级')" prop="tierName" v-if="isAdd">
          <el-input v-model="formModel.tierName" :placeholder="$t('请输入活动等级')" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="bonusObj" :label="bonusObj.label" :prop="bonusObj.field">
          <el-input type="number" v-model.number="formModel[bonusObj.field]" :placeholder="`${$t('请输入')}${bonusObj.label}`" @input="getDiscountAudit()" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('赠送金额')" prop="bonusAmount">
          <el-input type="number" v-model.number="formModel.bonusAmount" :placeholder="$t('请输入赠送金额')" @change="handleGetAudit"  :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('流水倍数')" prop="discountAudit" v-if="isAdd">
          <el-input type="number" v-model.number="formModel.discountAudit" :placeholder="$t('请输入流水倍数')" @change="handleDiscountAudit" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('流水倍数')" v-else>
          <el-input type="number" v-model.number="formModel.discountAudit" :placeholder="$t('请输入流水倍数')" @change="handleDiscountAudit" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('流水金额')" prop="auditAmount" v-if="isAdd">
          <el-input type="number" v-model.number="formModel.auditAmount" :placeholder="$t('请输入流水金额')" @change="handleChangeAuditAmount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('流水金额')" v-else>
          <el-input type="number" v-model.number="formModel.auditAmount" :placeholder="$t('请输入流水金额')" @change="handleChangeAuditAmount"  :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('选择场馆')" prop="catId" v-if="isVipDiscount">
          <el-select v-model="formModel.catId" :placeholder="$t('请选择')">
            <el-option v-for="item in gameTypeList" :key="item.id" :label='item.label' :value='item.id'></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item :label="$t('状态')" prop="status" v-if="!isAdd">
        <el-radio-group v-model="formModel.status">
          <el-radio :label="1">{{ $t('通过') }}</el-radio>
          <el-radio :label="0">{{ $t('拒绝') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('备注')" prop="memo">
        <el-input type="textarea" rows="5" v-model="formModel.memo" :placeholder="$t('请输入备注')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit" :disabled="isSumbitint">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import systemConfig from "../../../config/config.js";
import {
  checkNumberAndDecimals
} from "../../../config/utils";

const checkNumberAndTwoDecimal = function (value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  props: [
    "formVisible",
    "info",
    "isBatchAudit",
    "activityId",
    "tmplCode",
    "isVipDiscount",
    "isSumbitint"
  ],
  data() {
    return {
      isCheck: false,
      isSumbiting: false,
      formModel: {
        loginName: null,
        agyAccount: null,
        tierName: null,
        depositedAmount: null,
        bonusAmount: null,
        discountAudit: null,
        auditAmount: null,
        status: null,
        memo: null,
        catId: null,
        subRuleTmplCode: 'AQ0000003'
      },
      gameTypeList: [
        { label: this.$t("体育"), id: 1 },
        { label: this.$t("真人"), id: 3 },
        { label: this.$t("电游"), id: 5 },
        { label: this.$t("棋牌"), id: 6 },
        { label: this.$t("捕鱼"), id: 8 },
        { label: this.$t("电竞"), id: 9 },
        { label: this.$t("彩票"), id: 12 },
      ],
      rules: {
        loginName: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(this.$t("请输入会员名")));
              } else if(value&&this.notFind===true){
                callback(new Error(`${this.notFindName} ${this.$t('用户不存在，无法保存')}`));
              }else{
                callback()
              }
            },
            trigger: "blur",
          }
        ],
        depositedAmount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            type: "number",
            min: 0,
            message: "应该大于或等于0",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数")));
              }
            },
            trigger: "blur",
          },
        ],
        bonusAmount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            type: "number",
            min: 0,
            message: "应该大于或等于0",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数")));
              }
            },
            trigger: "blur",
          },
        ],
        discountAudit: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            type: "number", //"integer",
            min: 0,
            message: "应该为大于等于0",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数")));
              }
            },
            trigger: "blur",
          },
        ],
        auditAmount: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          {
            type: "number",
            min: 0,
            message: "应该大于或等于0",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (checkNumberAndTwoDecimal(value)) {
                callback();
              } else {
                callback(new Error(this.$t("最多允许两位小数")));
              }
            },
            trigger: "blur",
          },
        ],
        status: [{ required: true, message: this.$t("请选择状态"), trigger: "change" }],
        catId: [{ required: true, message: this.$t("请选择场馆"), trigger: "change" }],
        depositedAmount: [{ required: true, message: this.$t("请输入存款金额"), trigger: "change" }],
      },
      btnList: [
        { label: this.$t('存就送'), value: 'AQ0000003' },
        { label: this.$t('投就送'), value: 'AQ0000012' },
        { label: this.$t('救援金'), value: 'AQ0000004' },
        { label: this.$t('其他'), value: 'AQ0000015' },
      ],
      loginNameTimer: null,
      amountTimer: null,
      isBonusEditable: false, // 用户可以自己设置赠送金额和流水要求
      notFind: '',
      notFindName: '',
      addUsers: [],
    };
  },
  computed: {
    isAdd() {
      return !this.info;
    },
    isLoginNameValid() {
      return !!this.formModel.agyAccount;
    },
    bonusObj() {
      // 用于计算优惠的字段
      switch (this.tmplCode) {
        case "AQ0000001":
        case "AQ0000003":
        case "AQ0000024":
          return {
            label: this.$t("存款金额"),
            field: "depositedAmount",
          };
        case "AQ0000004":
          return {
            label: this.$t("负盈利金额"),
            field: "validBet",
          };
        case "AQ0000012":
          return {
            label: this.$t("投注金额"),
            field: "validBet",
          };
        default:
          return null;
      }
    },
  },
  created() {
    if (!this.isBatchAudit && this.info) {
      this.initFormModel();
    }
  },
  methods: {
    handleBtnClick({ value }) {
      this.formModel.subRuleTmplCode = value
    },
    // 赠送金额: bonusAmount
    // 存款金额: depositedAmount
    // 流水倍数: discountAudit
    // 流水金额: auditAmount
    handleGetAudit(val) { // 赠送金额
      const { bonusAmount, discountAudit, auditAmount ,depositedAmount} = this.formModel;
      if(this.tmplCode==='AQ0000003'||this.tmplCode==='AQ0000024'||this.tmplCode==='AQ0000001'){
        const str = String(parseFloat(val) * parseFloat(discountAudit)+parseFloat(depositedAmount)*(parseFloat(discountAudit)-1))
        this.$set(this.formModel, "auditAmount", this.saveSomeSplot(str, 2));
        return
      }
      if (val === '0') {
        this.$set(this.formModel, "auditAmount", 0);
        return
      }
      if (val && (discountAudit || discountAudit === 0)) {
        const str = String(val * discountAudit);
        this.$set(this.formModel, "auditAmount", this.saveSomeSplot(str, 2));
        return
      }
      if (auditAmount && val && (!discountAudit && discountAudit !== 0)) {
          const str = String(auditAmount / val);
          this.$set(this.formModel, "discountAudit", this.saveSomeSplot(str, 2));
      }
    },
    handleDiscountAudit(val) { // 流水倍数
      const { bonusAmount, depositedAmount } = this.formModel;
      if(this.tmplCode==='AQ0000003'||this.tmplCode==='AQ0000024'||this.tmplCode==='AQ0000001'){
        if (val && (bonusAmount || bonusAmount === 0)&&(depositedAmount||depositedAmount===0)) {
          const str = String(bonusAmount*val + depositedAmount * (val-1));
          this.$set(this.formModel, "auditAmount", this.saveSomeSplot(str, 2));
        }
        return
      }
      if (val && (bonusAmount || bonusAmount === 0)) {
        const str = String(bonusAmount * val);
        this.$set(this.formModel, "auditAmount", this.saveSomeSplot(str, 2));
      }
    },
    handleChangeAuditAmount(val) { // 流水金额
      const { auditAmount, bonusAmount ,depositedAmount} = this.formModel;
      if(this.tmplCode==='AQ0000003'||this.tmplCode==='AQ0000024'||this.tmplCode==='AQ0000001'){
        if (val === '0') {
          this.$set(this.formModel, "discountAudit", 0);
        } else if(bonusAmount &&depositedAmount&& val){
          const str = String((val+ depositedAmount)/ (bonusAmount+depositedAmount));
          this.$set(this.formModel, "discountAudit", this.saveSomeSplot(str, 2));
        } else if (bonusAmount === 0&&depositedAmount===0) {
          this.$set(this.formModel, "auditAmount", 0);
        }
        return
      }
      if (val === '0') {
        this.$set(this.formModel, "discountAudit", 0);
      } else if(bonusAmount && val){
        const str = String(val / bonusAmount);
        this.$set(this.formModel, "discountAudit", this.saveSomeSplot(str, 2));
      } else if (bonusAmount === 0) {
        this.$set(this.formModel, "auditAmount", 0);
      }
    },
    saveSomeSplot(val) {
      // 保留两位小数
      const index = val.split("").findIndex((item) => item === ".");
      const value = index > 0 ? val.slice(0, index + 3) : val;
      return Number(value);
    },
    getDiscountAudit(immediate = false) {
      const req = () =>
        this.$axios.get(systemConfig.urls.bonusList.getDiscountAudit, {
          params: {
            ...this.formModel,
            activityId: this.activityId,
          },
        });

      if (immediate) {
        // 立即执行
        req().then((res) => {
          const { bonusAmount, discountAudit } = res.data;
          // 允许修改赠送金额和流水倍数的活动： 会员日 其他未绑定规则的活动
          const editableWhiteList = ["AQ0000014", "AQ0000015"];

          if (editableWhiteList.includes(this.tmplCode)) {
            this.isBonusEditable = true;
          }
          this.formModel.bonusAmount = bonusAmount;
          this.formModel.discountAudit = discountAudit;
        });
      } else {
        window.clearTimeout(this.amountTimer);
        const { field } = this.bonusObj;
        const amount = this.formModel[field];

        if (amount || amount === 0) {
          this.amountTimer = window.setTimeout(() => {
            if (this.isLoginNameValid) {
              this.isBonusEditable = false;
              req().then((res) => {
                if (amount === this.formModel[field]) {
                  // 如果查询参数跟现在input的值一致
                  const { bonusAmount, discountAudit } = res.data;
                  if (bonusAmount !== null && discountAudit !== null) {
                    this.formModel.bonusAmount = bonusAmount;
                    this.formModel.discountAudit = discountAudit;
                    this.handleGetAudit(bonusAmount)
                  } else {
                    this.formModel.bonusAmount = null;
                    this.formModel.discountAudit = null;
                    this.formModel.auditAmount = null;
                    this.isBonusEditable = true;
                  }
                }
              });
            } else {
              this.$message.error(this.$t("请先查询会员"));
            }
          }, 300);
        } else {
          this.formModel.bonusAmount = null;
          this.formModel.discountAudit = null;
          this.isBonusEditable = false;
        }
      }
    },
    validateLoginName() {
      this.notFind=false
      this.notFindName=''
      this.$refs.form.clearValidate()
      let nameArr = this.formModel.loginName.split(',')
      this.$axios
        .post(systemConfig.urls.bonusList.findMbrLevelAndAgyInfo, nameArr)
        .then((res) => {
          this.isCheck = true
          const { depositedAmount } = this.formModel;
          if (res.data.data) {
            this.addUsers = res.data.data
            // 数据库有该用户名
            let arr1 = [], arr2 = []
            this.addUsers.map(ws=>{
              arr1.push(ws.agyAccount)
              arr2.push(ws.tierName)
            })
            // 需要打开就计算一次赠送金额和流水倍数的活动
            const shouldCalcList = ["AQ0000013", "AQ0000014", "AQ0000015"];

            this.formModel.agyAccount = arr1.join(',')
            this.formModel.tierName = arr2.join(',')

            this.$message.success(this.$t("用户名校验成功"));
            if (depositedAmount) {
              this.getDiscountAudit();
            }
            if (shouldCalcList.includes(this.tmplCode)) {
              this.getDiscountAudit(true /* immediate */);
            }
            nameArr.map(ws=>{
              console.log(ws)
              let push = true
              res.data.data.map(w=>{
                console.log('=',w)
                if(w.loginName.toLowerCase()===ws.toLowerCase()){
                  push=false
                }
              })
              if(push===true){
                this.notFind=true
                this.notFindName=this.notFindName?(this.notFindName+','+ws):ws
                this.$refs.form.validateField('loginName')
              }
            })
          } else {
            this.$message.error(this.$t("不存在该用户名"));
            this.notFind=true
            this.notFindName=this.formModel.loginName
            this.$refs.form.validateField('loginName')
            this.formModel.agyAccount = null;
            this.formModel.tierName = null;
            if (depositedAmount) {
              this.formModel.bonusAmount = null;
              this.formModel.discountAudit = null;
            }
          }
        });
    },
    initFormModel() {
      const formModel = JSON.parse(JSON.stringify(this.info));
      const arr = ["depositedAmount", "bonusAmount"];
      for (const key of arr) {
        formModel[key] = Number(formModel[key].replace(/,/g, ""));
      }
      this.formModel = {
        ...formModel,
        status: null,
      };
    },
    handleSubmit() {
      if(!this.isCheck&&this.isAdd){
        this.$message.error(this.$t(this.$t('请先查询会员')))
        return false
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let arr = [],arr2 = []
          this.addUsers.map(ws=>{
            arr.push(this.formModel)
          })
          arr.map((ws,index)=>{
            let obj = Object.assign({},ws)
            obj.loginName=this.addUsers[index].loginName
            obj.agyAccount=this.addUsers[index].agyAccount
            obj.tierName=this.addUsers[index].tierName
            arr2.push(obj)
          })
          if(this.isAdd){
            this.$emit("submit", arr2);
          }else{
            this.$emit("submit", this.formModel);
          }
        }
      });
    },
    handleClose() {
      this.isCheck = false
      this.$emit("update:formVisible", false);
    },
  },
};
</script>
<style scoped lang="scss">
.btnlist-box {
  padding: 5px 10px 20px;
  text-align: center;
}
</style>
