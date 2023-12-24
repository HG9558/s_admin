<template>
  <div>
    <el-form-item
      :label="$t('领取间隔') + ':' "
      prop="time"
      :rules="timeRule"
    >
      <el-input-number
        v-model="tableData.rule.time"
        :controls="false"
        :placeholder="$t('请输入领取间隔')"
      ></el-input-number>
      {{ $t('分钟') }}
    </el-form-item>

    <el-form-item
      :label="$t('奖励金额') + ':' "
      prop="bonusAmount"
      :rules="rules.checkNumberAndDecimals(tableData.rule.bonusAmount)"
    >
      <el-input-number
        v-model="tableData.rule.bonusAmount"
        :controls="false"
        :placeholder="$t('请输入奖励金额')"
      ></el-input-number>
      {{ currencyText() }}
    </el-form-item>

    <el-form-item
      :label="$t('流水倍数') + ':' "
      prop="multipleWater"
      :rules="rules.isInteger(tableData.rule.multipleWater)"
    >
      <el-input-number
        v-model="tableData.rule.multipleWater"
        :controls="false"
        :placeholder="$t('请输入倍数')"
      ></el-input-number>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
  </div>
</template>

<script>
import systemConfig from "../../../../config/config";
import site from '@/mixins/site'

export default {
  mixins: [site],
  props: ["rowData", "temp", "rules"],
  data() {
    return {
      tableData: {
        rule: {},
      },
      timeRule: {
        validator: (rule, value, callback) => {
          const { time } = this.tableData.rule
          if (Number.isInteger(time) && time > 0) {
            callback();
          } else {
            callback(new Error(this.$t("请输入正整数")));
          }
        },
        trigger: "blur"
      },
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    // 不加会出样式问题 巨坑
    this.$store.state.indexActive = "4-16";
  },
  methods: {
    initData() {
      let rowData = JSON.parse(JSON.stringify(this.rowData));
      const rule = JSON.parse(rowData.rule)

      rowData.rule = rule;
      if (!rule) {
        rowData.rule = this.temp;
      }
      this.tableData = rowData;
    },
  },
  watch: {
    tableData: {
      handler(n, o) {
        let sendData = JSON.parse(JSON.stringify(n));
        this.$emit("changeVal", sendData);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.rebate-input {
  width: 88%;
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.rebate-tips {
  display: flex;
  line-height: 26px;
  .title {
    width: 110px;
    color: #333;
    text-align: right;
  }
  .content > li {
    display: flex;
  }
}
.selfTable {
  .mt10 {
    margin-top: 10px !important;
  }
}
</style>
