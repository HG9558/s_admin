<!-- 活动规则之存就送 -->
<template>
  <div>
    <!-- 流水范围 非VIP晋级优惠-->
    <el-form-item :label="$t('流水范围')" v-if="tmplCode !== 'AQ0000018'">
      <AuditCatsForm v-model="rule.auditCats" />
    </el-form-item>
    <el-form-item :label="$t('会员范围')">
      <el-radio-group v-model="rule.scope" @change="handleScopeChange">
        <el-radio :label="0">{{ $t('全部会员') }}</el-radio>
        <el-radio :label="1">{{ $t('会员层级') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- <el-form-item label="统计周期" class="inline">
      <el-radio-group v-model.number="rule.drawType">
        <el-radio :label="0">{{ $t('昨日') }}</el-radio>
        <el-radio :label="1">{{ $t('上周') }}</el-radio>
        <el-radio :label="2">{{ $t('上月') }}</el-radio>
        <el-radio :label="3">{{ $t('本月') }}</el-radio>
        <el-radio :label="4">{{ $t('不限制') }}</el-radio>
      </el-radio-group>
    </el-form-item> -->

    <!-- 会员层级 -->
    <el-form-item :label="$t('会员层级')" v-if="rule.scope === 1">
      <MemberLevelTabs
        v-model="layerIndex"
        :memberLevelGroup="memberLevelGroup"
      />
    </el-form-item>
    <!-- 流水范围 VIP晋级优惠-->
    <el-form-item :label="$t('流水范围')" v-if="tmplCode === 'AQ0000018'">
      <VipAuditCatsForm v-model="rule.ruleScopeDtos[layerIndex].auditCats" :layerIndex="layerIndex" :rangeGroup="rangeGroup"/>
    </el-form-item>
    <RuleScopeDtosForm
      :key="layerIndex"
      :scope="rule.scope"
      :tmplCode="tmplCode"
      v-model="rule.ruleScopeDtos[layerIndex]"
    />
  </div>
</template>

<script>
import AuditCatsForm from "../common_forms/AuditCats";
import VipAuditCatsForm from "../common_forms/VipAuditCats";
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import RuleScopeDtosForm from "./RuleScopeDtos";
import systemConfig from "../../../../config/config.js";

export default {
  components: { AuditCatsForm, VipAuditCatsForm, MemberLevelTabs, RuleScopeDtosForm },
  inject: ["getRuleScopeDtosTemplate", 'formData'],
  props: ["rule", "tmplCode"],
  data() {
    return {
      layerIndex: "0",
      memberLevelGroup: [],
      recodeData: [],
      recodeLevelData: [],
      recodNum: -1,
      rangeGroup: []
    };
  },
  created() {
    this.getMemberLevel();
  },
  mounted() {
  },
  methods: {
    handleScopeChange() {
      this.recodNum++;
      const { scope } = this.rule
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
            ...ruleScopeDtos,
            auditCats: ruleScopeDtos.auditCats ? ruleScopeDtos.auditCats : []
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
      if (this.tmplCode === 'AQ0000018') {
        this.setRangeGroup()
      }
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        let arr = res.data.data
        const newArr = arr.filter(item => item.available === 1)
        if (!newArr[0].accountLevel&&this.tmplCode!=='AQ0000003') {
          newArr.splice(0, 1)
          // newArr.map((item,i) => {
          //   item.id = i + 1
          // })
        }
        this.memberLevelGroup = newArr
        this.handleScopeChange()
      });
    },
    setRangeGroup () {
      let arr = this.memberLevelGroup.map(level => [])
      const arr1 = {
        1: [], 3: [], 5: [], 6: [], 8: [], 9: [], 12: [], 49: [], 58: []
      }
      this.memberLevelGroup.map(level => {
        arr[level.id -2] = arr1
        let actArr = JSON.parse(JSON.stringify(arr1))
        this.rule.ruleScopeDtos.map((ruleDto,ruleIndex) => {
          if (level.id === ruleDto.actLevelId || (!this.rule.scope && !ruleIndex)) {
            ruleDto.auditCats.map((item, auditIndex) => {
              actArr[item.catId] = !item.depots.length ? [] : item.depots.map(i => i.depotId)
            })
            arr[level.id - 2] = actArr
          }
        })
      })
      const rangeGroup= JSON.parse(JSON.stringify(this.formData.rangeGroup))
      rangeGroup.map(range => {
        range.depots = arr
      })
      this.rangeGroup = rangeGroup
    }
  }
};
</script>
