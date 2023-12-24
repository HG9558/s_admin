<template>
  <div>
    <!-- 流水范围 -->
    <el-form-item :label="$t('流水范围')">
      <AuditCatsForm v-model="rule.auditCats" />
    </el-form-item>
    <el-form-item :label="$t('会员范围')">
      <el-radio-group v-model="rule.scope" @change="handleScopeChange">
        <el-radio :label="0">{{ $t('全部会员') }}</el-radio>
        <el-radio :label="1">{{ $t('层级会员') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 会员层级 -->
    <el-form-item :label="$t('会员层级')" v-if="rule.scope === 1">
      <MemberLevelTabs v-model="layerIndex" :memberLevelGroup="memberLevelGroup" />
    </el-form-item>
    <RuleScopeDtosForm :key="layerIndex" :scope="rule.scope" v-model="rule.ruleScopeDtos[layerIndex]" />
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
  props: ["rule"],
  data() {
    return {
      layerIndex: "0",
      memberLevelGroup: [],
      recodeData: [],
      recodeLevelData: [],
      recodNum: -1
    };
  },
  created() {
    this.getMemberLevel();
  },
  methods: {
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
        this.memberLevelGroup = res.data.data;
        this.handleScopeChange();
      });
    }
  }
};
</script>
