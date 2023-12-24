<template>
  <div>
    <el-form-item :label="$t('结算周期')" v-if="rule.period !== false">
      <el-radio-group v-model="rule.period">
        <el-radio :label="0">{{ $t('日结') }}</el-radio>
        <el-radio :label="1">{{ $t('周结') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 会员层级 -->
    <el-form-item :label="$t('会员层级')">
      <MemberLevelTabs
        v-model="layerIndex"
        :memberLevelGroup="memberLevelGroup"
      />
    </el-form-item>
    <RebatesNeDtoForm
      ref="RebatesNeDtoForm"
      :layerIndex="layerIndex"
      :memberLevelGroup="memberLevelGroup"
      v-model="rule.rebatesNeDto"
      :rebatesNeDto="rule.rebatesNeDto"
      v-if="memberLevelGroup.length"
    />
  </div>
</template>

<script>
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import RebatesNeDtoForm from "./RebatesNeDto";
import systemConfig from "../../../../config/config.js";

export default {
  components: { MemberLevelTabs, RebatesNeDtoForm },
  /* inject: ['getRebatesNeDtoTemplate'], */
  props: ["rule", "layIndex", "memberLevelGroup"],
  data() {
    return {
      layerIndex: "0"
    };
  },
  created() {},
  methods: {},
  watch: {
    layerIndex(n, o) {
      if (n != "0") {
        this.$emit("getDate", n);
      }
    },
    layIndex(n, o) {
      if (n == 0) {
        this.layerIndex = "0";
      }
    }
  }
};
</script>
