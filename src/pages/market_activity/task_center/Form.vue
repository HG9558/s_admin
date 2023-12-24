<template>
  <!-- 市场活动之任务中心 -->
  <div class="mtl20">
    <el-form
      v-loading="isLoading"
      :model="rowData"
      ref="formRule"
      label-width="auto"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-form-item :label="$t('任务类型') + ':' " prop="financialCodeName">
        <span>{{ rowData.financialCodeName }}</span>
      </el-form-item>
      <el-form-item :label="$t('任务名称') + ':' " prop="taskName" :rules="rules.taskName">
        <el-input
          v-if="whichComponent.enableEditTaskName"
          v-model="rowData.taskName"
          style="width: 20%"
          :placeholder="$t('请输入任务名称')"
        >
        </el-input>
        <span v-else>{{ rowData.taskName }}</span>
      </el-form-item>
      <component
        :is="whichComponent.componetName"
        :rowData="rowData"
        :temp="whichComponent.template"
        @changeVal="update"
        @checkIsClick="checkIsClick"
        :rules="rules"
        :languageValList="languageValList"
        :languageContentList="languageContentList"
      ></component>
      <el-form-item style="text-align: center">
        <el-button @click="cancleForm">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitForm(rowData.id)">{{ $t('保存') }} </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import systemConfig from "../../../config/config";

import signDown from "./sign_enter/signEnterList.vue";
import limitTime from "./limit_time/limitTimeList";
import TaskUpgrade from "./task_upgrade/TaskUpgradeList";
import InfoImprovement from "./info_improvement/InfoImprovementList";
import TimingBonus from "./timing_bonus/TimingBonusList";
import ActiveBonus from "./active_bonus/ActiveBonusList";
import ActivityRule from "./activity_rule/ActivityRule";
import GiftGive from "./gift_give/GiftGive";

import signTemplage from "./sign_enter/template";
import { taskUpgradeTemplate } from "./task_upgrade/template";
import { infoImprovementTemplate } from "./info_improvement/template";
import { timingBonusTemplate } from "./timing_bonus/template";
import { activeBonusTemplate } from "./active_bonus/template";

import {
  checkNatureNumber,
  checkNumberAndDecimals,
} from "../../../config/utils";

export default {
  data() {
    return {
      isSub: true,
      rowData: {},
      whichComponent: {},
      pamasObj: {},
      isLoading: false,
      rules: {
        taskName: [
          { required: true, message: this.$t("不能为空"), trigger: "blur" },
          { max: 10, message: this.$t("最长不超过10个字符"), trigger: "blur" },
        ],
        checkNumberAndDecimals: (item, musthave) => {
          return {
            validator: (rule, value, callback) => {
              if (musthave && !item) {
                callback();
              } else if (!item) {
                callback(new Error(this.$t("最多两位小数的有效数值")));
              } else if (checkNumberAndDecimals(item, 2) && item >= 0) {
                callback();
              } else {
                callback(new Error(this.$t("最多两位小数的有效数值")));
              }
            },
            trigger: "blur",
          };
        },
        isInteger: (item) => {
          return {
            validator: (rule, value, callback) => {
              if (checkNatureNumber(item) && item >= 0) {
                callback();
              } else {
                callback(new Error(this.$t("请输入有效整数")));
              }
            },
            trigger: "blur",
          };
        },
      },
      languageValList: ['memo', 'en_usmemo', 'msmemo', 'vimemo', 'thmemo', 'zh_twmemo'],
      languageContentList: ['content', 'en_uscontent', 'mscontent', 'vicontent', 'thcontent', 'zh_twcontent']
    };
  },
  computed: {
    id() {
      return Number(this.$route.query.id);
    },
    financialCode() {
      return this.$route.query.financialCode;
    },
  },
  created() {
    this.getRowData();
  },
  methods: {
    checkIsClick(data) {
      this.isSub = true;
      for (let i in data) {
        console.log(data[i] == 0);
        if (data[i] == 0) {
          this.isSub = false;
          return;
        }
      }
    },
    getRowData() {
      this.isLoading = true;
      this.$axios
        .get(systemConfig.urls.activityRule.taskCenterConfigInfo, {
          params: {
            id: this.id,
          },
        })
        .then(({ data }) => {
          this.rowData = data.data;
          this.whichComponent = this.getWhichComponent();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getWhichComponent() {
      switch (this.rowData.financialCode) {
        case "QD":
          return {
            componetName: signDown,
            template: JSON.parse(signTemplage.signEnterTemplate),
          };
          break;
        case "XS":
          return {
            componetName: limitTime,
          };
          break;
        case "SJ":
          return {
            componetName: TaskUpgrade,
            enableEditTaskName: true,
            template: JSON.parse(taskUpgradeTemplate),
          };
          break;
        case "ZL":
          return {
            componetName: InfoImprovement,
            enableEditTaskName: true,
            template: JSON.parse(infoImprovementTemplate),
          };
          break;
        case "DS":
          return {
            componetName: TimingBonus,
            template: JSON.parse(timingBonusTemplate),
          };
          break;
        case "HR":// 上上签到
          return {
            componetName: ActiveBonus,
            enableEditTaskName: true,
            template: JSON.parse(activeBonusTemplate),
          };
          break;
        case "HDGZ":// 活动规则与详情
          return {
            componetName: ActivityRule,
          };
          break;
        case "HLZS":
          return {
            componetName: GiftGive,
          };
          break;
        default:
          return {};
          break;
      }
    },
    update(val) {
      this.pamasObj = val;
    },
    cancleForm() {
      this.$router.go(-1);
    },
    submitForm(id) {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          let params = {};
          const { pamasObj } = this;
          switch (this.rowData.financialCode) {
            case "QD":
              params = {
                id: id,
                rule: JSON.stringify(pamasObj.rule),
              };
              break;
            case "XS":
              params = {
                id: id,
                rule: pamasObj ? JSON.stringify(pamasObj) : pamasObj,
              };
              break;
            case "SJ":
              params = {
                ...pamasObj,
                taskName: this.rowData.taskName,
                rule: JSON.stringify({
                  ...pamasObj.rule,
                  starDtos: pamasObj.rule.starDtos.filter(
                    ({ accountLevel }) => accountLevel !== 0
                  ),
                }),
              };
              break;
            case "ZL":
              const { minAmount } = pamasObj.rule
              if (!minAmount && minAmount !== 0) {
                delete pamasObj.rule.minAmount
              }
              params = {
                id: id,
                rule: JSON.stringify(pamasObj.rule),
              };
              break;
            case "DS":
              params = {
                id: id,
                rule: JSON.stringify(pamasObj.rule),
              };
              break;
            case "HR": // 上上签到
              /*这里针对活动奖励做数据处理*/
              let NewObj = JSON.parse(JSON.stringify(pamasObj));
              const d_list = NewObj.rule.filesDtos.map((item, index) => {
                let obj = {};
                item.map((itemTwo, indexTwo) => {
                  obj.num = index + 1;
                  if (indexTwo == 0) {
                    obj.depositAmount = itemTwo.bonusAmount;
                  } else {
                    obj.validBet = itemTwo.bonusAmount;
                  }
                });
                return obj;
              });
              const { extraBonus } = NewObj.rule
              d_list.map((item, index) => {
                const dayDtoListItem = pamasObj.rule.dayDtoList[index]
                let arr = extraBonus ? dayDtoListItem.splice(dayDtoListItem.length - 1, 1) : []
                if (arr.length) arr = [{ bonusAmount: arr[0].bonusAmount }]
                item.extraBonusList = arr
                item.dayDtoList = dayDtoListItem;
              });
              // console.log(d_list)
              NewObj.rule.filesDtos = d_list;
              if (NewObj.rule.dayDtoList) {
                delete NewObj.rule.dayDtoList;
              }
              // 删除自添加checkboxLanguage文本标识List
              const checkboxLanguage = NewObj.rule.checkboxLanguage
              this.languageValList.map(k => {
                if (!checkboxLanguage.includes(k)) {
                  NewObj.rule[k] = null
                }
              })

              delete NewObj.rule.checkboxLanguage
              console.log("🚀 ~ file: Form.vue:309 ~ this.$refs.formRule.validate ~ NewObj.rule", NewObj.rule)
              params = {
                ...NewObj,
                taskName: this.rowData.taskName,
                rule: JSON.stringify(NewObj.rule),
              };
              console.log(params);
              break;
            case "HDGZ":// 活动规则与详情
              // 删除自添加checkboxLanguage文本标识List
              let checkboxLanguageList = pamasObj.rule.checkboxLanguage
              this.languageContentList.map(k => {
                if (!checkboxLanguageList.includes(k)) {
                  pamasObj.rule[k] = null
                }
              })

              delete pamasObj.rule.checkboxLanguage
              // console.log("🚀 ~ file: Form.vue:323 ~ this.$refs.formRule.validate ~ pamasObj.rule", pamasObj.rule)

              params = {
                id: id,
                rule: JSON.stringify(pamasObj.rule),
              };
              break;
            case "HLZS":
              params = {
                id: id,
                rule: JSON.stringify(pamasObj.rule),
              };
              break;
            default:
              break;
          }
          if (!this.isSub) {
            this.$message(this.$t("最多两位小数的有效数值"));
            return;
          }
          this.$axios
            .post(this.$systemConfig.urls.activityRule.signEnterExit, params)
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("编辑成功"),
              });
              this.cancleForm();
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.mr20 {
  width: 80% !important;
  text-align: right;

  .mr20 {
  }
}
</style>
