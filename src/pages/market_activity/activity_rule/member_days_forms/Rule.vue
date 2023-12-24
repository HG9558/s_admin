<template>
  <div>
    <!-- 流水范围 -->
    <el-form-item :label="$t('流水范围')">
      <AuditCatsForm v-model="rule.auditCats" />
    </el-form-item>
    <el-form-item :label="$t('申请条件')">
      <el-checkbox-group
        class="activity-rule-inline-block"
        v-model="conditions"
        @change="handleConditionsChange"
      >
        <el-checkbox
          :label="item.value"
          v-for="item in conditionsGroup"
          :key="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('会员日')" ref="memDayType" prop="validDates" :rules="rules.validDates" v-if="tmplCode !== 'AQ0000025'">
      <el-select v-model="rule.memDayType" @change="handleMemDayTypeChange">
        <el-option :label="$t('每周')" :value="0"></el-option>
        <el-option :label="$t('每月')" :value="1"></el-option>
        <el-option :label="$t('每月两次')" :value="2"></el-option>
      </el-select>

      <el-select
        v-model="rule.validDates"
        multiple
        :multiple-limit="rule.memDayType===2?2:0"
        clearable
        filterable
        style="width: 500px;"
      >
        <el-option
          v-for="item in rule.memDayType ? 31 : 7"
          :key="item"
          :value="item"
          :label="
            rule.memDayType
              ? `${item}${$t('日')}`
              :`${[$t('周一'), $t('周二'), $t('周三'), $t('周四'), $t('周五'), $t('周六'), $t('周日')][item - 1]}`
          "
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('会员范围')">
      <el-radio-group v-model="rule.scope" @change="handleScopeChange">
        <el-radio :label="0">{{ $t('全部会员') }}</el-radio>
        <el-radio :label="1">{{ $t('会员层级') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 会员层级 -->
    <el-form-item :label="$t('会员层级')" v-if="rule.scope === 1">
      <MemberLevelTabs
        v-model="layerIndex"
        :memberLevelGroup="memberLevelGroup"
      />
    </el-form-item>
    <RuleScopeDtosForm
      :key="layerIndex"
      v-bind.sync="ruleScopeDtos"
      @update="emit"
    />
  </div>
</template>

<script>
import AuditCatsForm from "../common_forms/AuditCats";
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import RuleScopeDtosForm from "./RuleScopeDtos";
import systemConfig from "../../../../config/config.js";

export default {
  components: { AuditCatsForm, MemberLevelTabs, RuleScopeDtosForm },
  inject: ["getRuleScopeDtosTemplate"],
  props: ["rule", "tmplCode"],
  computed:{
      ruleScopeDtos(){
        console.log("🚀 ~ file: Rule.vue:87 ~ ruleScopeDtos ~ ruleScopeDtos:this.rule.ruleScopeDtos[this.layerIndex]:", this.rule.ruleScopeDtos[this.layerIndex])
        console.log("🚀 ~ file: Rule.vue:87 ~ ruleScopeDtos ~ ruleScopeDtos:this.rule.ruleScopeDtos:", this.rule.ruleScopeDtos)
        return {
          ruleScopeDtos:this.rule.ruleScopeDtos[this.layerIndex]
        }}
  },
  data() {
    return {
      layerIndex: "0",
      conditions: [],
      conditionsGroup: [
        {
          label: this.$t("已实名"),
          value: "isName"
        },
        {
          label: this.$t("已验证手机"),
          value: "isMobile"
        },
        {
          label: this.$t("已验证银行卡"),
          value: "isBank"
        },
        /* {
          label: '已验证邮箱',
          value: 'isMail'
        }, */
        // {
        //   label: "APP注册",
        //   value: "isApp"
        // }
      ],
      memberLevelGroup: [],
      recodeData: [],
      recodeLevelData: [],
      recodNum: -1,
      rules: {
        validDates: {
          validator: (rule, value, callback) => {
            if (this.rule.validDates.length) {
              callback()
            } else {
              callback(this.$t('请选择会员日'))
            }
          },
          trigger: 'change',
        },
      },
    };
  },
  created() {
    this.initConditions()
    this.getMemberLevel();
  },
  methods: {
    handleMemDayTypeChange() {
      this.rule.validDates = []
      this.$nextTick(() => {
        this.$refs.memDayType.resetField()
      })
    },
    handleConditionsChange() {
      const { conditions, conditionsGroup } = this;
      for (const { value } of conditionsGroup) {
        this.rule[value] = conditions.includes(value);
      }
    },
    initConditions() {
      this.rule.isMail = false;
      for (const item of this.conditionsGroup) {
        const { value } = item;
        if (this.rule[value]) {
          this.conditions.push(value);
        }
      }
      this.handleConditionsChange();
    },
    handleScopeChange() {
      this.recodNum++;
      const { scope } = this.rule;
      if (scope) {
        if (this.recodNum > 0) {
          //会员范围变更时-->保留历史值并设置当前值
          this.recodeData = JSON.parse(JSON.stringify(this.rule.ruleScopeDtos));
          this.rule.ruleScopeDtos = this.recodeLevelData.length
            ? this.recodeLevelData
            : [this.getRuleScopeDtosTemplate()];
        }
        this.rule.ruleScopeDtos = this.memberLevelGroup.map(level => {
          this.rule.ruleScopeDtos.find(
              item => item.actLevelId === level.id
            )
          const ruleScopeDtos =
            this.rule.ruleScopeDtos.find(
              item => item.actLevelId === level.id
            ) || this.getRuleScopeDtosTemplate();
          return {
            actLevelId: level.id,
            ...ruleScopeDtos
          };
        });
      } else {
        this.layerIndex = "0";
        if (this.recodNum > 0) {
          //会员范围变更时-->保留历史值并设置当前值
          this.recodeLevelData = JSON.parse(
            JSON.stringify(this.rule.ruleScopeDtos)
          );
          this.rule.ruleScopeDtos = this.recodeData.length
            ? this.recodeData
            : [this.getRuleScopeDtosTemplate()];
        }
      }
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        let arr =[]
        // debugger
        res.data.data.map(item => {
          if (item.tierName != 'VIP0') {
            arr.push(item)
          }
        })
        this.memberLevelGroup = arr;
        this.handleScopeChange();
      });
    },
    emit(key){
      const data = {
        key,
        layerIndex: this.layerIndex
      }
      this.$emit('update',data)
    }
  }
};
</script>
