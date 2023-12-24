<template>
  <div class="activity-rule-form-wrapper">
    <h5 class="activity-rule-header">
      {{ $t("活动规则") }}
      <el-button class="activity-rule-header_btn" @click="$router.go(-1)">{{
        $t("返回")
      }}</el-button>
    </h5>
    <el-form
      ref="form"
      v-loading="!isFormLoadingCompleted"
      class="activity-rule-body"
      :model="formModel"
      label-width="auto"
      label-suffix=":"
      :rules="rules"
    >
      <!-- 公共表单 开始 -->
      <el-form-item
        class="activity-rule-inline-block"
        prop="ruleName"
        :label="$t('规则名称')"
      >
        <el-input
          v-model="formModel.ruleName"
          :placeholder="$t('请输入规则名称')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="activity-rule-inline-block"
        prop="actTmplId"
        :label="$t('规则类别')"
      >
        <el-select
          v-model="formModel.actTmplId"
          :placeholder="$t('请选择规则类别')"
          disabled
        >
          <el-option
            :key="item.id"
            :value="item.id"
            :label="item.tmplName"
            v-for="item in activityCategories"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="available" :label="$t('是否启用')">
        <el-radio-group
          v-model="formModel.available"
          :placeholder="$t('请选择是否启用')"
        >
          <el-radio :label="1">{{ $t("是") }}</el-radio>
          <el-radio :label="0">{{ $t("否") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="isAudit"
        :label="$t('是否审核')"
        v-if="tmplCode != 'AQ0000011'"
      >
        <el-radio-group
          v-model="formModel.isAudit"
          :placeholder="$t('请选择是否审核')"
        >
          <el-radio :label="1">{{ $t("是") }}</el-radio>
          <el-radio :label="0">{{ $t("否") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 公共表单 结束 -->
      <!-- rule表单 -->
      <component
        ref="childform"
        :is="ruleFormMeta.component"
        v-bind.sync="formModel"
        @update="update"
        v-if="isFormLoadingCompleted"
        @pCheckIsClick="pCheckIsClick"
        @getDate="getDate"
        :tmplCode="tmplCode"
        @dataChange="dataChange"
        :rebateDate="rebateDate"
        :formModel="formModel"
      />
    </el-form>
    <div class="activity-rule-footer">
      <el-button @click="$router.go(-1)">{{ $t("取消") }}</el-button>
      <el-button
        class="activity-rule-footer_save"
        type="primary"
        @click="handleSave"
        >{{ $t("保存") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import systemConfig from "../../../config/config.js";
import FirstDepositRuleForm from "./first_deposit_forms/Rule";
import FirstDepositRuleTemplate from "./first_deposit_forms/rule-template";

import FirstDepositRuleMutilForm from "./first_deposit_mutil_forms/Rule";
import FirstDepositRuleMurilTemplate from "./first_deposit_mutil_forms/rule-template";

import BalanceRebateRuleForm from "./balance_rebate/Rule";
import BalanceRebateTemplate from "./balance_rebate/rule-template";

import DepositSendRuleForm from "./deposit_send_forms/Rule";
import DepositSendRuleTemplate from "./deposit_send_forms/rule-template";
import WaterRebateRuleForm from "./water_rebate_forms/Rule";
import WaterRebateRuleTemplate from "./water_rebate_forms/rule-template";

import MemberRebateForms from "./member_rebate_forms/Rule";
import MemberRebateRuleTemplate from "./member_rebate_forms/rule-template";

import SaveSendForms from "./save_send_forms/Rule";
import SaveSendFormsRuleTemplate from "./save_send_forms/rule-template";
import RescueGoldForms from "./rescue_gold_forms/Rule";
import RescueGoldFormsRuleTemplate from "./rescue_gold_forms/rule-template";

import FirstRegisterForms from "./first_register_forms/Rule";
import FirstRegisterFormsRuleTemplate from "./first_register_forms/rule-template";

import OtherForms from "./other_forms/Rule";
import OtherFormsRuleTemplate from "./other_forms/rule-template";

import MemberDaysForms from "./member_days_forms/Rule";
import MemberDaysFormsRuleTemplate from "./member_days_forms/rule-template";

import UpgradeBonusForms from "./upgrade_bonus_forms/Rule";
import UpgradeBonusFormsRuleTemplate from "./upgrade_bonus_forms/rule-template";

import BirthdayBonusForms from "./birthday_bonus_forms/Rule";
import BirthdayBonusFormsRuleTemplate from "./birthday_bonus_forms/rule-template";

import DrawPrizeForms from "./drwa_prize/Rule";
import DrawPrizeFormsRuleTemplate from "./drwa_prize/rule-template";

import RedPacketRainForms from "./red_packet_rain_forms/Rule";
import RedPacketRainFormsRuleTemplate from "./red_packet_rain_forms/rule-template";

import MixingRulesForms from "./mixing_rules_forms/Rule";
import MixingRulesFormsRuleTemplate from "./mixing_rules_forms/rule-template";

import NationalAgentForms from "./national_agent_forms/Rule";
import NationalAgentFormsRuleTemplate from "./national_agent_forms/rule-template";

import promoCodeForms from "./promo_code_forms/Rule";
import promoCodeFormsRuleTemplate from "./promo_code_forms/rule-template";

import NewRedPacketRainForms from "./new_red_packet_rain_forms/Rule";
import NewRedPacketRainFormsRuleTemplate from "./new_red_packet_rain_forms/rule-template";

export default {
  components: {
    FirstDepositRuleForm, // 首存送
    BalanceRebateRuleForm,
    DepositSendRuleForm,
    WaterRebateRuleForm,
    MemberRebateForms,
    SaveSendForms, // 投就送
    RescueGoldForms, // 救援金
    FirstRegisterForms, // 注册送
    MemberDaysForms, // 会员日
    UpgradeBonusForms, //升级礼金
    BirthdayBonusForms, // 生日礼金
    OtherForms, // 其他
    DrawPrizeForms, //抽奖
    RedPacketRainForms, // 红包雨
    MixingRulesForms, // 混合规则
    NationalAgentForms, // 全民代理,
    promoCodeForms, // 优惠码
    NewRedPacketRainForms, // 新红包雨
    FirstDepositRuleMutilForm, // 首存送 - 多配置
    FirstDepositRuleMurilTemplate,
  },
  provide() {
    const instance = this;
    return {
      getRuleScopeDtosTemplate() {
        return JSON.parse(instance.ruleFormMeta.ruleScopeDtosTemplate);
      },
      getRebatesNeDtoTemplate() {
        return JSON.parse(instance.ruleFormMeta.rebatesNeDtoTemplate);
      },
      rebatesNeDtoTemplate: instance.ruleFormMeta.rebatesNeDtoTemplate,
      formData: instance.$data,
      tmplCode: instance.tmplCode,
    };
  },
  data() {
    const validTime = (rule, value, callback) => {
      const child = this.$refs.childform;
      if (!child.startTime || !child.endTime) {
        callback(new Error(this.$t("请填写活动时间")));
      } else {
        callback();
      }
    };
    const newValid = (rule, value, callback) => {
      let pass1 = true;
      let pass2 = true;
      let pass3 = true;
      let pass4 = true;
      const child = this.$refs.childform;
      if (
        child.scTableDataList[0].minCharge ||
        child.scTableDataList[0].minCharge === 0 ||
        child.scTableDataList[0].maxCharge ||
        child.scTableDataList[0].maxCharge === 0 ||
        child.scTableDataList[0].referrer ||
        child.scTableDataList[0].referrer === 0 ||
        child.scTableDataList[0].referee ||
        child.scTableDataList[0].referee === 0
      ) {
        for (let key in child.scTableDataList[0]) {
          if (
            !child.scTableDataList[0][key] &&
            child.scTableDataList[0][key] !== 0
          ) {
            pass1 = false;
          }
        }
      }
      child.vipTableDataList[0].bonusList.map((ws) => {
        if (ws.award || ws.award === 0) {
          child.vipTableDataList[0].bonusList.map((w) => {
            if (!w.award && w.award !== 0) {
              pass3 = false;
            }
          });
        }
      });
      child.topupTableDataList.map((ws) => {
        if (
          ws.num ||
          ws.num === 0 ||
          ws.minCharge ||
          ws.minCharge === 0 ||
          ws.award ||
          ws.award === 0 ||
          ws.multiple ||
          ws.multiple === 0
        ) {
          for (let key in ws) {
            if (!ws[key] && ws[key] !== 0) {
              pass4 = false;
            }
          }
        }
      });
      if (child.$refs.RebateTable.tableDataList[0]) {
        child.$refs.RebateTable.tableDataList[0].catDtoList.map((ws) => {
          if (
            ws.validBet ||
            ws.validBet === 0 ||
            ws.topRebate ||
            ws.topRebate === 0
          ) {
            child.$refs.RebateTable.tableDataList[0].catDtoList.map((w) => {
              if (
                (!w.validBet && w.validBet !== 0) ||
                (!w.topRebate && w.topRebate !== 0)
              ) {
                pass2 = false;
              }
            });
          }
        });
      }
      if (!pass1 || !pass2 || !pass3 || !pass4) {
        callback(new Error(this.$t("请填写完整的返利配置")));
      } else {
        return callback();
      }
    };
    return {
      isSub: true,
      formModel: {
        ruleName: null,
        actTmplId: null,
        available: 1,
        isAudit: 1,
        rule: null,
      },
      rules: {
        ruleName: {
          required: true,
          message: this.$t("请输入规则名称"),
          trigger: "blur",
        },
        setrule: { required: false, validator: newValid, trigger: "blur" },
        time: { required: true, validator: validTime, trigger: "blur" },
      },
      activityCategories: [],
      rangeGroup: [],
      catList: [],
      rebateDate: {},
    };
  },
  computed: {
    isOrNotGetGametype() {
      // 不用请求游戏数据
      return ["AQ0000021", "AQ0000023", "AQ0000032"].includes(this.tmplCode);
    },
    id() {
      return Number(this.$route.query.id);
    },
    actTmplId() {
      return Number(this.$route.query.actTmplId);
    },
    tmplName() {
      return this.$route.query.tmplName;
    },
    tmplCode() {
      return this.$route.query.tmplCode;
    },
    isFormLoadingCompleted() {
      const { formModel, rangeGroup } = this;
      return (
        (formModel.rule && rangeGroup.length) ||
        (formModel.rule && this.isOrNotGetGametype)
      );
    },
    ruleFormMeta() {
      switch (this.tmplCode) {
        case "AQ0000001": //首存送
        case "AQ0000028": //首存上级返利
          return {
            component: "FirstDepositRuleForm",
            ...FirstDepositRuleTemplate,
          };
        case "AQ0000030": // 余额返利
          return {
            component: "BalanceRebateRuleForm",
            ...BalanceRebateTemplate,
          };
        case "AQ0000018": //vip特权优惠
        case "AQ0000003": //存就送
          return {
            component: "DepositSendRuleForm",
            ...DepositSendRuleTemplate,
          };
        case "AQ0000005": //返水优惠
          return {
            component: "WaterRebateRuleForm",
            ...WaterRebateRuleTemplate,
          };
        case "AQ0000011": //好友推荐-返利
          return {
            component: "MemberRebateForms",
            ...MemberRebateRuleTemplate,
          };
        case "AQ0000012": //投就送
          return {
            component: "SaveSendForms",
            ...SaveSendFormsRuleTemplate,
          };
        case "AQ0000004": //救援金
          return {
            component: "RescueGoldForms",
            ...RescueGoldFormsRuleTemplate,
          };
        case "AQ0000013": //注册送
          return {
            component: "FirstRegisterForms",
            ...FirstRegisterFormsRuleTemplate,
          };
        case "AQ0000019": // 会员日  VIP红包
        case "AQ0000014": // 会员日
        case "AQ0000025": // app下载彩金
          return {
            component: "MemberDaysForms",
            ...MemberDaysFormsRuleTemplate,
          };
        case "AQ0000015": // 会员日
          return {
            component: "OtherForms",
            ...OtherFormsRuleTemplate,
          };
        case "AQ0000016": // 升级礼金
          return {
            component: "UpgradeBonusForms",
            ...UpgradeBonusFormsRuleTemplate,
          };
        case "AQ0000017": // 升级礼金
          return {
            component: "BirthdayBonusForms",
            ...BirthdayBonusFormsRuleTemplate,
          };
        case "AQ0000021": // 抽奖
          return {
            component: "DrawPrizeForms",
            ...DrawPrizeFormsRuleTemplate,
          };
        case "AQ0000022": // 红包雨
          return {
            component: "RedPacketRainForms",
            ...RedPacketRainFormsRuleTemplate,
          };
        case "AQ0000023": // 全民代理
          return {
            component: "NationalAgentForms",
            ...NationalAgentFormsRuleTemplate,
          };
        case "AQ0000024": // 混合规则
          return {
            component: "MixingRulesForms",
            ...MixingRulesFormsRuleTemplate,
          };
        case "AQ0000031": // 优惠码
          return {
            component: "promoCodeForms",
            ...promoCodeFormsRuleTemplate,
          };
        case "AQ0000032": // 新红包雨
          return {
            component: "NewRedPacketRainForms",
            ...NewRedPacketRainFormsRuleTemplate,
          };
        case "AQ0000033": // 首存送 - 多个配置版
          return {
            component: "FirstDepositRuleMutilForm",
            ...FirstDepositRuleMurilTemplate,
          };
      }
    },
  },
  created() {
    const { id } = this;
    if (id) {
      this.$axios
        .get(systemConfig.urls.activityRule.list + `/${id}`)
        .then((res) => {
          const formModel = res.data.data;
          formModel.rule = JSON.parse(formModel.rule);
          if (this.tmplCode === "AQ0000011") {
            //好友推荐--暂存初始数据
            this.rebateDate = formModel.rule;
          }
          if (this.tmplCode === "AQ0000022") {
            const { startTime, endTime } = formModel.rule;
            formModel.rule.startTime =
              moment().format("YYYY-MM-DD") + ` ${startTime}`;
            formModel.rule.endTime =
              moment().format("YYYY-MM-DD") + ` ${endTime}`;
          }
          if (["AQ0000032"].includes(this.tmplCode)) {
            const arr = ["adZero", "adOne", "adTwo"];
            arr.map((v, i) => {
              formModel.rule[v] = formModel.rule.adList[i];
            });
          }
          if (["AQ0000013"].includes(this.tmplCode)) {
            formModel.ipLimit = formModel.ipLimit || 0;
            formModel.deviceLimit = formModel.deviceLimit || 0;
          }
          this.formModel = formModel;
        });
    } else {
      // 注册送默认不审核
      if (["AQ0000013", "AQ0000014"].includes(this.tmplCode)) {
        this.formModel.isAudit = 0;
      }
      if (["AQ0000013"].includes(this.tmplCode)) {
        this.formModel.ipLimit = 0;
        this.formModel.deviceLimit = 0;
      }
      this.formModel.rule = JSON.parse(this.ruleFormMeta.ruleTemplate);
    }
    this.getActivityCategories().then(() => {
      this.formModel.actTmplId = this.actTmplId;
    });
    if (!this.isOrNotGetGametype) {
      this.findRangeGroup();
    }
    if (this.tmplCode === "AQ0000011") {
      this.formModel.available = 0;
    }
    if (this.tmplCode === "AQ0000028") {
      if (this.formModel.rule) {
        this.formModel.rule.ruleScopeDtos.map((ws) => {
          ws.activityRuleDtos.map((w) => {
            w.donateType = 1;
          });
        });
      }
    }
  },
  methods: {
    pCheckIsClick(data) {
      this.isSub = true;
      for (let i in data) {
        if (data[i] == 0) {
          this.isSub = false;
          return;
        }
      }
      // this.$emit('checkIsClick',obj)
    },
    getDate(obj) {
      this.$refs.form.validateField("setrule", (valid) => {});
      if (
        [
          "AQ0000012",
          "AQ0000004",
          "AQ0000021",
          "AQ0000022",
          "AQ0000023",
          "AQ0000024",
        ].includes(this.tmplCode)
      ) {
        this.formModel.rule = obj;
      } else {
        //好友返利
        this.setData(obj);
      }
    },
    setData({
      auditMultiple,
      auditType,
      levelDtoList,
      startTime,
      endTime,
      minVipLevel,
      maxVipLevel,
    }) {
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
      this.rebateDate["startTime"] = startTime;
      this.rebateDate["endTime"] = endTime;
      this.rebateDate["minVipLevel"] = minVipLevel;
      this.rebateDate["maxVipLevel"] = maxVipLevel;
      if (!bool) {
        this.rebateDate.levelDtoList.push(levelDtoList[0]);
      }
    },
    // 存就送设置活动规则时，同个存款范围 不允许同时设置全部和单项存款方式
    hasConflictOfRules11(rules) {
      let result = false;
      rules.forEach((rule) => {
        const amountScopeObj = {};
        rule.activityRuleDtos.forEach((item) => {
          const amountScope = item.amountMin + "-" + item.amountMax;
          if (amountScopeObj[amountScope]) {
            amountScopeObj[amountScope].push(item);
          } else {
            amountScopeObj[amountScope] = [item];
          }
        });
        Object.keys(amountScopeObj).forEach((key) => {
          const isHasAll = amountScopeObj[key].some(
            (item) => item.paymentType === 0
          );
          if (isHasAll && amountScopeObj[key].length > 1)
            return (result = true);
        });
      });
      return result;
    },
    // 存就送设置活动规则时，不允许同时设置全部和单项存款方式。
    hasConflictOfRules1(rules) {
      let result = false;
      rules.forEach((rule) => {
        const all = rule.activityRuleDtos.filter(
          (item) => item.paymentType === 0
        );
        const single = rule.activityRuleDtos.filter(
          (item) => item.paymentType !== 0
        );
        if (all.length > 0 && single.length > 0) return (result = true);
      });
      return result;
    },
    // 存就送设置活动规则时，同种存款方式不允许设置存款金额区间有重叠。
    hasConflictOfRules2(rules) {
      let result = false;
      rules.forEach((rule) => {
        const paymentTypeObj = {};
        rule.activityRuleDtos.forEach((item) => {
          const paymentType = item.paymentType;
          if (paymentTypeObj[paymentType]) {
            paymentTypeObj[paymentType].push(item);
          } else {
            paymentTypeObj[paymentType] = [item];
          }
        });
        Object.keys(paymentTypeObj).forEach((key) => {
          for (let j = 0; j < paymentTypeObj[key].length - 1; j++) {
            for (let i = 0; i < paymentTypeObj[key].length - 1 - j; i++) {
              const start = paymentTypeObj[key][i];
              const end = paymentTypeObj[key][i + 1];
              const maxArr = [start.amountMin, end.amountMin];
              const minArr = [start.amountMax, end.amountMax];
              if (Math.max.apply(null, maxArr) <= Math.min.apply(null, minArr))
                return (result = true);
            }
          }
        });
      });
      return result;
    },
    handleSave() {
      if (!this.isSub) {
        this.$message(this.$t("输入格式有问题"));
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const formModel = JSON.parse(JSON.stringify(this.formModel));
          const { auditCats } = formModel.rule;
          const { tmplCode } = this;
          const bool = this.tmplCode !== "AQ0000018";
          const isNotPrize = this.tmplCode !== "AQ0000021";
          if (auditCats && bool && isNotPrize) {
            // 筛选掉没有选中平台的分类
            formModel.rule.auditCats = auditCats.filter(
              (item) => item.depots.length
            );
            if (!formModel.rule.auditCats.length) {
              if (tmplCode != "AQ0000016" && tmplCode != "AQ0000017") {
                this.$message({
                  type: "warning",
                  message:
                    this.$t("请选择") +
                    (tmplCode == "AQ0000004"
                      ? this.$t("派彩")
                      : this.$t("流水")) +
                    this.$t("范围"),
                });
                return;
              }
            }
          }
          if (!bool) {
            let ruleScopeDtos = JSON.parse(
              JSON.stringify(formModel.rule.ruleScopeDtos)
            );
            ruleScopeDtos = ruleScopeDtos.filter(
              (item) => item.auditCats.length
            );
            if (!ruleScopeDtos.length) {
              this.$message.warning(this.$t("请选择流水范围"));
              return;
            }
            ruleScopeDtos.map((item) => {
              item.auditCats = item.auditCats.filter((i) => i.depots.length);
              // vip晋级优惠改版（所有vip活动规则默认为不共享即值1，去掉活动规则中的最大值），旧数据兼容处理
              item.formulaMode = 1; // 所有vip活动规则默认为不共享即值1
              if (item.activityRuleDtos.length) {
                const acrRd = item.activityRuleDtos[0];
                const {
                  amountMin,
                  donateType,
                  donateAmount,
                  multipleWater,
                  donateAmountMax,
                } = acrRd;
                item.activityRuleDtos = [
                  {
                    amountMin,
                    donateType,
                    donateAmount,
                    multipleWater,
                    donateAmountMax,
                  },
                ];
              }
            });

            formModel.rule = {
              scope: formModel.rule.scope,
              ruleScopeDtos: formModel.rule.scope
                ? ruleScopeDtos
                : [ruleScopeDtos[0]],
            };
          }
          if (!isNotPrize) {
          }
          switch (tmplCode) {
            case "AQ0000001": //首存送
            case "AQ0000033": //首存送-多配置
            case "AQ0000003": //存就送
            case "AQ0000030": //存就送
              {
                const { ruleScopeDtos } = formModel.rule;

                // 赠送金额为金额赠送时，不展示最高赠送设为null
                ruleScopeDtos.map((item) => {
                  item.activityRuleDtos.map((val) => {
                    if (val.donateType == 1 && !val.donateAmountMax) {
                      val.donateAmountMax = null;
                    }
                  });
                });
                // 筛选掉没配置规则的会员层级
                formModel.rule.ruleScopeDtos = ruleScopeDtos.filter((item) => {
                  // 如果配置了规则 amountMax必定大于0
                  return item.activityRuleDtos[0].amountMax;
                });
              }
              break;
            case "AQ0000011": //好友推荐
              {
                formModel.rule = this.rebateDate;
                formModel.rule.levelDtoList = formModel.rule.levelDtoList.map(
                  (item) => {
                    const catDtoList =
                      item.catDtoList ||
                      (item.depthDtoList
                        ? item.depthDtoList[0].catDtoList
                        : null);
                    delete item.depthDtoList;
                    return {
                      ...item,
                      catDtoList,
                    };
                  }
                );
                formModel.rule.levelDtoList = formModel.rule.levelDtoList.map(
                  (item) => {
                    const catDtoList =
                      item.catDtoList ||
                      (item.depthDtoList
                        ? item.depthDtoList[0].catDtoList
                        : null);
                    if (catDtoList) {
                      catDtoList.map((ws) => {
                        if (
                          (!ws.topRebate && ws.topRebate !== 0) ||
                          (!ws.validBet && ws.validBet !== 0)
                        ) {
                          if (item.catDtoList) delete item.catDtoList;
                          if (item.depthDtoList) delete item.depthDtoList;
                        }
                      });
                    }
                    if (item.rebateVipDtoList) {
                      item.rebateVipDtoList.map((ws) => {
                        if (!ws.award && ws.award !== 0) {
                          delete item.rebateVipDtoList;
                        }
                      });
                    }
                    if (item.rebateFirstChargeDto) {
                      let pass = true;
                      if (!Object.keys(item.rebateFirstChargeDto).length) {
                        delete item.rebateFirstChargeDto;
                      } else {
                        for (let k in item.rebateFirstChargeDto) {
                          if (
                            !item.rebateFirstChargeDto[k] &&
                            item.rebateFirstChargeDto[k] !== 0
                          ) {
                            pass = false;
                          }
                        }
                        if (!pass) {
                          delete item.rebateFirstChargeDto;
                        }
                      }
                    }
                    if (item.rebateChargeDtoList) {
                      item.rebateChargeDtoList.map((ws) => {
                        if (
                          (!ws.award && ws.award !== 0) ||
                          (!ws.minCharge && ws.minCharge !== 0) ||
                          (!ws.multiple && ws.multiple !== 0) ||
                          (!ws.num && ws.num !== 0)
                        ) {
                          delete item.rebateChargeDtoList;
                        }
                      });
                    }
                    return {
                      ...item,
                    };
                  }
                );
              }
              break;
            case "AQ0000014": // 会员日
              {
                // 把为空字符串类型的转换成null
                formModel.rule.ruleScopeDtos = formModel.rule.ruleScopeDtos.map(
                  (item) => {
                    Object.keys(item).forEach((key) => {
                      if (item[key] === "") {
                        item[key] = null;
                      }
                    });
                    return item;
                  }
                );
              }
              break;
            case "AQ0000016": // 升级礼金
              {
                // 把为空字符串类型的转换成null
                formModel.rule.ruleScopeDtos = formModel.rule.ruleScopeDtos.map(
                  (item) => {
                    Object.keys(item).forEach((key) => {
                      if (item[key] === "") {
                        item[key] = null;
                      }
                    });
                    return item;
                  }
                );
              }
              break;
            case "AQ0000017": // 生日礼金
              {
                // 把为空字符串类型的转换成null
                formModel.rule.ruleScopeDtos = formModel.rule.ruleScopeDtos.map(
                  (item) => {
                    Object.keys(item).forEach((key) => {
                      if (item[key] === "") {
                        item[key] = null;
                      }
                    });
                    return item;
                  }
                );
              }
              break;
            case "AQ0000021":
              {
                let bool = false,
                  depositBool = false,
                  prizeAreaDtoBool = false,
                  prizetypeBool = false,
                  actLevelIdsBool = false,
                  registerConditionBool = false;
                let num,
                  recodeIndex1,
                  recodeIndex2,
                  prizetypeIndex,
                  recodeV2,
                  recodeIndex3,
                  actLevelIdsIndex,
                  registerNumIndex,
                  registerDateIndex;
                formModel.rule.lotteryAreaDtos.map((item, index) => {
                  // 不属于新加，则不全选
                  item.isCheckAllApplyLevel = false;

                  // 抽奖区列表
                  const prizeAreaDto = item.prizeAreaDtos;
                  // 抽奖区列表 -- 每个抽奖区列表存在，即要填写。奖品类型为谢谢参与及实物奖品时，彩金金额及流水倍数为空
                  const prizearr = ["prizeType", "prizeName", "probability"];
                  const prizeOther = ["donateAmount", "multipleWater"];
                  prizeAreaDto.map((item) => {
                    if (prizetypeBool) return;
                    prizearr.map((v2) => {
                      if (prizetypeBool) return;
                      if (!item[v2] && item[v2] !== 0) {
                        prizetypeBool = true;
                        prizetypeIndex = index;
                        return;
                      } else {
                        prizeOther.map((v3) => {
                          if (prizetypeBool) return;
                          if (
                            item[v2] === 2 &&
                            v2 == "prizeType" &&
                            !item[v3] &&
                            item[v3] !== 0
                          ) {
                            prizetypeBool = true;
                            prizetypeIndex = index;
                          }
                        });
                      }
                    });
                  });
                  // 抽奖区列表 -- 每个中奖区的中奖概率之和需为100
                  num = 0;
                  prizeAreaDto.map((item) => {
                    num += item.probability || 0;
                  });
                  if (num !== 100) {
                    recodeIndex2 = index;
                    prizeAreaDtoBool = true;
                    return;
                  }
                  // 申请等级至少勾选一个
                  if (!item.actLevelIds.length) {
                    actLevelIdsBool = true;
                    actLevelIdsIndex = index;
                    return;
                  }
                  // 注册时间特殊处理， 如果选择不限制，则参数中不传registerDate，registerNum。 同时满足相关条件，代码逻辑
                  const { registerCondition, registerNum, registerDate } = item;
                  if (!registerCondition) {
                    // formModel.rule.lotteryAreaDtos[index] = _.omit(item, ["registerNum", "registerDate"]);
                    delete item["registerNum"];
                    delete item["registerDate"];
                  } else if (registerCondition === 1) {
                    // formModel.rule.lotteryAreaDtos[index] = _.omit(item, ["registerDate"]);
                    delete item["registerDate"];
                    if (!registerNum) {
                      registerConditionBool = true;
                      registerNumIndex = index;
                      registerDateIndex = null;
                      return;
                    }
                    // this.$message.warning("请输入注册时间天数");
                  } else if (registerCondition === 2) {
                    // formModel.rule.lotteryAreaDtos[index] = _.omit(item, ["registerNum"]);
                    delete item["registerNum"];
                    // debugger
                    if (registerDate) {
                      item.registerDate =
                        item.registerDate.slice(0, 10) + " 00:00:00";
                    } else {
                      registerConditionBool = true;
                      registerNumIndex = null;
                      registerDateIndex = index;
                      // this.$message.warning("请选择注册时间日期");
                      return;
                    }
                  }
                  // 抽奖次数赠送规则
                  // 勾选是否存在没有填写值的情况
                  const {
                    depositDtos,
                    cycle,
                    lotteryDepositDtoList,
                    domainsCondition,
                    isSelectedFirstLoginDay,
                    isSelectedFirstLogin,
                    isSelectedFirstBindBank,
                    numFirstLoginDay,
                    numFirstLogin,
                    numFirstBindBank,
                  } = item;
                  const arr = lotteryDepositDtoList;
                  let isSelectRule = false;
                  formModel.rule.lotteryAreaDtos[index].numFirstLoginDay =
                    numFirstLoginDay || 0;
                  formModel.rule.lotteryAreaDtos[index].numFirstLogin =
                    numFirstLogin || 0;
                  formModel.rule.lotteryAreaDtos[index].numFirstBindBank =
                    numFirstBindBank || 0;
                  depositDtos.forEach((v2) => {
                    const isSelected = arr.includes(v2.isCheckSign) ? 1 : 0;
                    if (isSelected) {
                      isSelectRule = true;
                    }
                  });
                  if (
                    (!isSelectRule && !domainsCondition && cycle !== 3) ||
                    (!isSelectedFirstLoginDay &&
                      !isSelectedFirstLogin &&
                      !isSelectedFirstBindBank &&
                      cycle === 3)
                  ) {
                    depositBool = true;
                    recodeIndex3 = index;
                  }
                  if (cycle === 3) {
                    if (isSelectedFirstLoginDay && !numFirstLoginDay) {
                      bool = true;
                      recodeIndex1 = index;
                      recodeV2 = 0;
                    }
                    if (isSelectedFirstLogin && !numFirstLogin) {
                      bool = true;
                      recodeIndex1 = index;
                      recodeV2 = 1;
                    }
                    if (isSelectedFirstBindBank && !numFirstBindBank) {
                      bool = true;
                      recodeIndex1 = index;
                      recodeV2 = 2;
                    }
                  } else {
                    let depositDtosArr = item.depositDtos;
                    depositDtosArr.map((v2, i2) => {
                      v2.isSelected = arr.includes(v2.isCheckSign) ? 1 : 0;
                      if (
                        !!v2.isSelected &&
                        (!v2.num || !v2.amountConditions)
                      ) {
                        bool = true;
                        recodeIndex1 = index;
                        recodeV2 = i2;
                        return;
                      }
                    });
                  }
                });
                // delete formModel.rule['isCheckAllApplyLevel']
                if (prizetypeBool) {
                  // 各抽奖区列表是否填写完整
                  this.$message.warning(
                    this.$t("请填写完整抽奖区") +
                      (prizetypeIndex + 1) +
                      this.$t("列表中填写项")
                  );
                  return;
                }
                // if (prizeAreaDtoBool) {
                //   // 各抽奖区列表总和校验
                //   this.$message.warning(
                //     this.$t("抽奖区") +
                //       (recodeIndex2 + 1) +
                //       this.$t("中奖概率总和不等于百分之百,请检查")
                //   );
                //   return;
                // }
                if (actLevelIdsBool) {
                  // 申请等级至少勾选一个
                  this.$message.warning(
                    this.$t("抽奖区") +
                      (actLevelIdsIndex + 1) +
                      this.$t("中至少勾选一个等级")
                  );
                  return;
                }
                if (registerConditionBool) {
                  // 注册时间特殊处理
                  // if (registerNumIndex || registerDateIndex) {
                  this.$message.warning(
                    this.$t("请填写或选择抽奖区") +
                      (registerNumIndex + 1) +
                      this.$t("中注册时间对应值")
                  );
                  // }
                  return;
                }
                if (bool) {
                  // 抽奖中抽奖次数赠送规则
                  this.$message.warning(
                    this.$t("抽奖区") +
                      (recodeIndex1 + 1) +
                      this.$t("中抽奖次数赠送规则第") +
                      (recodeV2 + 1) +
                      this.$t("行已勾选，但是未填写相应值，请填写")
                  );
                  return;
                }
                if (depositBool) {
                  // 抽奖次数校验
                  this.$message.warning(
                    this.$t("抽奖区") +
                      (recodeIndex3 + 1) +
                      this.$t("抽奖次数赠送规则至少勾选一项,请检查")
                  );
                  return;
                }
                // delete formModel.rule['isCheckAllApplyLevel']
              }
              break;
            case "AQ0000022":
              {
                const { startTime, endTime } = formModel.rule;
                const s = moment(startTime).format("HH:mm:ss");
                const e = moment(endTime).format("HH:mm:ss");
                const bool = this.compareTime(s, e);
                if (!startTime || !endTime) {
                  this.$message.warning(
                    this.$t("请选择红包雨当日开始和结束时间")
                  );
                  return;
                } else if (bool) {
                  this.$message.warning(
                    this.$t("红包雨当日开始时间不能大于结束时间")
                  );
                  return;
                }
                formModel.rule.startTime = s;
                formModel.rule.endTime = e;
              }
              break;
            case "AQ0000024":
              {
                formModel.rule.startTime = moment(
                  formModel.rule.startTime
                ).format("YYYY-MM-DD HH:mm:ss");
              }
              break;
            case "AQ0000032": {
              // 新红包雨
              const { adList, newRedPacketRainNumDtoList, validDates } =
                formModel.rule;
              validDates.sort((a, b) => a - b);
              const arr = ["adZero", "adOne", "adTwo"];
              arr.map((v, i) => {
                adList[i] = formModel.rule[v];
                delete formModel.rule[v];
              });
              // ”-“ 代表没有条件，不会触发活动规则，且数据不会被保存；0代表没有存款和没有有效投注，如果会员值为0，会生效触发活动资格；
              // let arr2 = []
              // newRedPacketRainNumDtoList.map(item => {
              //   const { depositAmount, validBet} = item
              //   const bool1 = depositAmount || depositAmount === 0
              //   const bool2 = validBet || validBet === 0
              //   if (bool1 && bool2) arr2.push(item)
              // })
              // if (!arr2.length) {
              //   this.$message.warning(this.$t('请输入有效红包领取规则信息'))
              //   return
              // }
              // formModel.rule.newRedPacketRainNumDtoList = arr2
            }
            case "AQ0000013":
              {
                // 注册送
                let { totalCount } = formModel.rule;
                if (!totalCount && totalCount !== 0) {
                  formModel.rule.totalCount = null;
                }
              }
              break;
          }
          if (tmplCode === "AQ0000003") {
            const result1 = this.hasConflictOfRules1(
              formModel.rule.ruleScopeDtos
            );
            if (result1) {
              return this.$message.warning(
                this.$t("不允许同时设置全部和单个存款方式，请检查！")
              );
            }
            const result2 = this.hasConflictOfRules2(
              formModel.rule.ruleScopeDtos
            );
            if (result2) {
              return this.$message.warning(
                this.$t("同个存款方式，不允许出现存款范围重叠，请检查！")
              );
            }
          }

          const loading = this.$loading({ fullscreen: true });
          this.$axios
            .post(
              this.id
                ? systemConfig.urls.activityRule.update
                : systemConfig.urls.activityRule.save,
              {
                ...formModel,
                rule: JSON.stringify(formModel.rule),
              }
            )
            .then(() => {
              this.$router.go(-1);
            })
            .finally(() => {
              loading.close();
            });
        }
      });
    },
    findRangeGroup() {
      this.$axios.get(systemConfig.urls.findGameTypes).then((res) => {
        const gameTypes = res.data.page;
        this.catList = gameTypes.map((item) => {
          return {
            id: item.id,
            catName: item.catName,
          };
        });
        const arr = gameTypes.map(({ id: catId }) => {
          return this.$axios
            .get(systemConfig.urls.activityRule.getPlatforms, {
              params: {
                catId,
              },
            })
            .then((res) => res.data.tDepots);
        });
        Promise.all(arr).then((res) => {
          this.rangeGroup = res
            .map((item, index) => {
              const { id: catId, catName } = gameTypes[index];
              return {
                catId,
                platforms: item || [],
                isCheckedAll: false,
                catName,
                depots: [],
              };
            })
            .filter((item) => item.platforms.length);
        });
      });
    },
    getActivityCategories() {
      return this.$axios
        .get(systemConfig.urls.activityRule.category)
        .then((res) => {
          this.activityCategories = res.data.page;
        });
    },
    compareTime(startTime, endTime) {
      const sT = startTime.split(":");
      const eT = endTime.split(":");
      return sT[0] * 60 + sT[1] * 60 + sT[2] > eT[0] * 60 + eT[1] * 60 + eT[2];
    },
    //- TODO
    dataChange(item) {
      this.$refs.form.validateField("setrule", (valid) => {});
      this.rebateDate.levelDtoList.some((r) => {
        const flag = r.level === item.level;
        if (flag) {
          this.$set(r, item.name, item.data);
        }
        return flag;
      });
    },
    update(k) {
      let d = Object.assign({}, this.formModel.rule);
      const bool = this.tmplCode === "AQ0000031";
      const bool2 = ["AQ0000014", "AQ0000019", "AQ0000025"].includes(
        this.tmplCode
      );
      if (bool) {
        // ruleScopeDto为对象，其他情况是数组
        for (let key in d.ruleScopeDto) {
          if (key == k) {
            let arr = [].concat([d.ruleScopeDto]);
            delete d.ruleScopeDtos;
            arr.map((ws) => delete ws[k]);
            d.ruleScopeDto = arr[0];
            this.$set(this.formModel, "rule", d);
          }
        }
      } else if (bool2) {
        const { layerIndex } = k;
        const ck = k.key;
        for (let key in d.ruleScopeDtos[0]) {
          if (key == ck) {
            let arr = [].concat(d.ruleScopeDtos);
            delete d.ruleScopeDtos;
            arr.map((v, i) => {
              if (i == layerIndex) {
                v[ck] = undefined;
              }
            });
            d.ruleScopeDtos = arr;
            this.$set(this.formModel, "rule", d);
          }
        }
      } else {
        for (let key in d.ruleScopeDtos[0]) {
          if (key == k) {
            let arr = [].concat(d.ruleScopeDtos);
            delete d.ruleScopeDtos;
            arr.map((ws) => delete ws[k]);
            d.ruleScopeDtos = arr;
            this.$set(this.formModel, "rule", d);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .activity-rule-inline-block {
  display: inline-block;
  & + .activity-rule-inline-block {
    margin-left: 40px;
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
