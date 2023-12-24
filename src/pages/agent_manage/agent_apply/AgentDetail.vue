<template>
  <div>
    <el-form class="form-wrapper" ref="add_form" label-position="top" :model="curRowData" :rules="rules">
      <div class="half left">
        <div class="self_message">
          <div class="message">{{ $t('个人信息') }}</div>
          <el-form-item :label="$t('真实姓名')">
            <el-input type="text" v-model="curRowData.realName" :placeholder="$t('请输入真实姓名')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item :label="$t('手机号')">
            <el-input type="number" v-model="curRowData.mobile" :placeholder="$t('请输入手机号')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
        </div>
        <div class="self_message">
          <div class="message">{{ $t('联系方式') }}</div>
          <el-form-item :label="$t('邮箱')">
            <el-input type="text" v-model="curRowData.email" :placeholder="$t('请输入邮箱')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item label="QQ">
            <el-input v-model="curRowData.qq" :placeholder="$t('请输入QQ')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item :label="$t('微信')">
            <el-input v-model="curRowData.weChat" :placeholder="$t('请输入微信')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item label="Skype">
            <el-input v-model="curRowData.skype" :placeholder="$t('请输入Skype')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item label="FlyGram">
            <el-input v-model="curRowData.flyGram" :placeholder="$t('请输入FlyGram')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item label="Telegram">
            <el-input v-model="curRowData.telegram" :placeholder="$t('请输入Telegram')" :disabled="curRowData.status === 0"></el-input>
          </el-form-item>
          <el-form-item :label="$t('注册时间')">
            {{curRowData.createTime}}
          </el-form-item>
          <el-form-item :label="$t('代理属性')">
            <!-- {{curRowData.attributes}} -->
            {{getAttributes(curRowData.attributes)}}
          </el-form-item>
        </div>
      </div>
      <div class="half right">
        <div class="self_message">
          <div class="message" style="height: 12px;"></div>
          <el-form-item :label="$t('上级代理')">
            <el-select v-model="curRowData.parentId" filterable :placeholder="$t('请选择上级代理')" @change="onChooseAgentOfAdd">
              <el-option v-for="(item, index) in superiorAgentList" :key="index" :label='item.agyAccount' :value='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('佣金契约')">
            <el-select v-model="curRowData.contractId" :placeholder="$t('请选择佣金契约')">
              <el-option v-for="(item, index) in contractList" :key="index" :label='item.value' :value='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('契约有效期')">
            <el-col :span="11">
              <el-date-picker type="datetime" :placeholder="$t('选择日期')" v-model="curRowData.contractStart" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime" :placeholder="$t('选择日期')" v-model="curRowData.contractEnd" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <div class="contrac_text">{{ $t('契约到期后该代理将使用系统默认契约') }}</div>
          <div v-if="curRowData.attributes === 0" prop="rebate">
            <label style="display:block;padding-bottom: 8px">{{ $t('上级返佣比例') }}：<i v-if="curAgentLevel !== null">({{ $t('你当前选择的上级代理为') }}{{ curAgentLevelText }})</i></label>
            <el-form-item :label="$t('总代理返佣')" prop="rebateratio">
              <el-input v-model.number="curRowData.rebateratio" type="number" :disabled="curAgentLevel === 0" :placeholder="$t('请输入总代理返佣比例')">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('一级代理返佣')" prop="firstagentratio">
              <el-input v-model.number="curRowData.firstagentratio" type="number" :disabled="curAgentLevel === 0 || curAgentLevel === 1" :placeholder="$t('请输入一级代理返佣比例')">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item :label="$t('审核')" prop="status" class="ridao w270" >
            <el-radio-group v-model="curRowData.status">
              <el-radio :label="1">{{ $t('审核通过') }}</el-radio>
              <el-radio :label="0">{{ $t('审核拒绝') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('备注')" class="w270">
            <el-input type="textarea" v-model="curRowData.memo"></el-input>
          </el-form-item>
          <el-form-item
                :label="$t('新注册会员组')"
                prop="defaultGroupId"
              >
                <el-select
                  v-model="curRowData.defaultGroupId"
                  filterable
                  :placeholder="$t('请选择会员组')"
                >
                  <el-option
                    v-for="(item, index) in groupList"
                    :key="index"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
          <el-form-item
            :label="$t('批量设置会员组')"
            prop="setGroupId"
          >
            <el-select
              v-model="curRowData.setGroupId"
              filterable
              :placeholder="$t('请选择会员组')"
            >
              <el-option
                v-for="(item, index) in groupList"
                :key="index"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('结算模式')">
            <div>
              <el-checkbox
                v-model="curRowData.serviceRateChecked"
                style="display: block"
              >
                {{ $t('服务费') }}
              </el-checkbox>
              <label>{{ $t('存款') }}</label>
              <el-input
                v-model.number="curRowData.depositServicerate"
                :min="0"
                style="width: 26%"
                type="number"
                class="moneyIpt"
              >
                <span slot="suffix">%</span>
              </el-input>
              <label style="margin-left: 10px">{{ $t('提款') }}</label>
              <el-input
                v-model.number="curRowData.withdrawServicerate"
                :min="0"
                style="width: 26%"
                type="number"
                class="moneyIpt"
              >
                <span slot="suffix">%</span>
              </el-input>
            </div>
            <div>
              <el-checkbox
                v-model="curRowData.platformRateChecked"
                style="display: block"
              >
                {{ $t('平台费') }}
              </el-checkbox>
              <label>{{ $t('额外费用') }}</label>
              <el-input
                v-model.number="curRowData.additionalServicerate"
                :min="0"
                style="width: 53%"
                type="number"
              >
                <span slot="suffix">%</span>
              </el-input>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleSubmitCancel">{{ $t('取消') }}</el-button>
      <el-button v-if="permissions.agentReview" type="primary" @click="handleSubmit">{{ $t('确定') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
import moment from "moment";
import { lang } from "@/i18n"
export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    var validRebate = (rule, value, callback) => {
      if (value < 0 || value > 100) {
        callback(new Error(this.$t('请输入小于或等于100的正数')));
      } else {
        callback();
      }
    };
    return {
      groupList: [],
      rules: {
        status: [
          { required: true, message: lang('请选择一个审核结果'), trigger: 'change' },
        ],
        defaultGroupId: [
          { required: true, message: lang('请选择一个会员组'), trigger: 'change' },
        ],
        rebateratio: [
          { required: true, message: lang("请输入总代理返佣比例"), trigger: "blur" },
          { validator: validRebate, trigger: "blur" },
        ],
        firstagentratio: [
          { required: true, message: lang("请输入一级代理返佣比例"), trigger: "blur" },
          { validator: validRebate, trigger: "blur" },
        ],
      },
      curRowData: {},
      contractList: [],
      options: [],
      superiorAgentList: [],
      initRowData: {
        realName: null,
        mobile: null,
        email: null,
        qq: null,
        weChat: null,
        skype: null,
        flyGram: null,
        telegram: null,
        createTime: null,
        attributes: null,
        id: null,
        contractId: null,
        contractStart: null,
        contractEnd: null,
        status: null,
        memo: null,
      },
      curAgentLevel: null,
      curStatusOff: false,
    };
  },
  created() {
    this.curRowData =
      JSON.stringify(this.rowData) === "{}"
        ? this.initRowData
        : JSON.parse(JSON.stringify(this.rowData));
    // const parentId = this.curRowData.parentId ? this.curRowData.parentId : 0;
    this.getAgentIsdList(this.curRowData);
    this.getAllContractList();
    this.getGroupList()
  },
  computed: {
    // agent:review:agentReview
    ...mapGetters(["hasPermission"]),
    curAgentLevelText() {
      const { curAgentLevel } = this
      return curAgentLevel === 0 ? this.$t('股东') : curAgentLevel === 1 ? this.$t('总代') : curAgentLevel === 2 ? this.$t('一级代理') : '-'
    },
    permissions() {
      const { hasPermission } = this;
      return {
        agentReview: hasPermission("agent:review:agentReview"),
      };
    },
  },
  methods: {
    onChooseAgentOfAdd(id) {
      const cur = this.superiorAgentList.find(item => item.id === id)
      this.curAgentLevel = cur.agentType
      switch (cur.agentType) {
        case 0:  // 股东
          this.curRowData.rebateratio = 0
          this.curRowData.firstagentratio = 0
          break;
        case 1: // 总代
          this.curRowData.rebateratio = null
          this.curRowData.firstagentratio = 0
          break;
        case 2: // 一级代理
          this.curRowData.rebateratio = null
          this.curRowData.firstagentratio = null
          break;
        // case 3: // 二级代理
        //   break;
      }
    },
    getGroupList(){
      this.$axios.get(systemConfig.urls.groupListAll,{params:{pageSize:999,pageNo:1}}).then(res=>{
        if(res.data.code===0){
          res.data.page.map(ws=>{
            this.groupList.push({label:ws.groupName,id:ws.id})
          })
        }
      })
    },
    getAttributes(attributes) {
      // 0 直线代理 1分线代理  2 推广员工 3招商员工
      return [this.$t("直线代理"), this.$t("分线代理"), this.$t("推广员工"), this.$t("招商员工")][attributes];
    },
    getAgentIsdList({ agyAccount, attributes }) {
      // 获取所有上级代理
      // const params = {
      //   agyAccount: agyAccount,
      // };
      // this.$axios
      //   .get(systemConfig.urls.agentApply.superiorAgentList)
      //   .then((res) => {
      //     this.setInitData("options", res.data.data, "agyAccount");
      //   });
      this.$axios
        .get(systemConfig.urls.agentApply.superiorAgentList)
        .then((res) => {
          this.superiorAgentList = res.data.data;
        });
    },
    getAllContractList() {
      // 所有契约列表
      this.$axios
        .get(systemConfig.urls.agentApply.allContractList)
        .then((res) => {
          this.setInitData("contractList", res.data.data, "contractName");
        });
    },
    setInitData(whichKey, data, val) {
      const arr = [];
      data.forEach((value) => {
        arr.push({ id: value.id, value: value[val] });
      });
      this[whichKey] = arr;
    },
    getFeeModelForm() {
      const {
        serviceRateChecked,
        platformRateChecked,
        depositServicerate,
        withdrawServicerate,
        additionalServicerate,
      } = this.curRowData
      const formData = {
        depositServicerate,
        withdrawServicerate,
        additionalServicerate,
      }
      if (!serviceRateChecked && platformRateChecked) {
        formData.feeModel = 1
      } else if (serviceRateChecked && !platformRateChecked) {
        formData.feeModel = 2
      } else if (serviceRateChecked && platformRateChecked) {
        formData.feeModel = 3
      } else {
        formData.feeModel = null
      }
      return formData
    },
    handleSubmit() {
      if (this.curRowData.status !== 0 && this.curRowData.status !== 1) {
        return this.$message.error(this.$t('请至少选择一个审核结果'))
      }
      this.$refs.add_form.validate((valid) => {
        if (valid) {
          const formData = this.getFeeModelForm()
          const params = {
            ...this.curRowData,
            ...formData,
            contractStart: moment(this.curRowData.contractStart).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            contractEnd: moment(this.curRowData.contractEnd).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          };
          if(this.curRowData.status===0){
            params.contractId?null:(params.contractId=1)
          }
          this.$axios
            .post(systemConfig.urls.agentApply.agentReview, params)
            .then((res) => {
              this.$emit("submit");
            });
        }
      });
    },
    handleSubmitCancel() {
      this.$emit("submit");
    }
  },
  watch : {
    'curRowData.status': {
      handler(val, o) {
        if (o && val) return
        this.curStatusOff = val ? false : true
        this.rules = val ? this.$options.data().rules : {}
        this.$refs.add_form.clearValidate()
      },
    }
  }
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  justify-content: flex-start;
  .half {
    width: 48%;
    .self_message {
      padding-left: 20px;
      .message {
        margin-left: -20px;
        font-weight: 800;
        margin-bottom: 15px;
      }
    }
  }
  .right {
    margin-left: 15px;
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
        width: 270px !important;
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
.moneyIpt /deep/.el-input__inner {
  padding-left: 3px;
  padding-right: 3px;
}
</style>
