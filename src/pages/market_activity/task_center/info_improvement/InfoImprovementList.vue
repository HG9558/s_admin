<template>
  <div>
    <el-form-item
      :label="$t('完善项目') + ':' "
      prop="infoItems"
      :rules="infoItemsRules"
    >
      <el-checkbox-group v-model="infoItemsKeys" @change="handleInfoItemsKeysChange">
        <el-checkbox
          v-for="item in infoItems"
          :key="item.value"
          :label="item.value"
          :disabled="item.value === 'isName' && infoItemsKeys.includes('isBank')"
        >
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      :label="$t('奖励金额') + ':' "
      class="multipleWater"
      prop="bonusAmount"
      :rules="rules.checkNumberAndDecimals(tableData.rule.bonusAmount)"
    >
      <el-input
        type="number"
        v-model.number="tableData.rule.bonusAmount"
        :placeholder="$t('请输入奖励金额')"
      ></el-input>
    </el-form-item>
    <el-form-item
      :label="$t('流水倍数') + ':' "
      class="multipleWater"
      prop="multipleWater"
      :rules="rules.isInteger(tableData.rule.multipleWater)"
    >
      <el-input
        type="number"
        v-model.number="tableData.rule.multipleWater"
        :placeholder="$t('请输入倍数')"
      ></el-input>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
    <el-form-item
      :label="$t('存款需求') + ':' "
      class="multipleWater"
      prop="minAmount"
      :rules="rules.checkNumberAndDecimals(tableData.rule.minAmount, true)"
    >
      <el-input
        type="number"
        v-model.number="tableData.rule.minAmount"
        :placeholder="$t('请输入存款需求')"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>

export default {
  props: ["rowData", "temp", "rules"],
  data() {
    return {
      tableData: {
        rule: {},
      },
      infoItemsKeys: [],
      infoItems: [
        {
          label: this.$t('真实姓名'),
          value: 'isName',
        },
        {
          label: this.$t('手机号'),
          value: 'isMobile',
        },
        {
          label: this.$t('银行卡号'),
          value: 'isBank',
        },
      ],
      infoItemsRules: {
        required: true,
        validator: (rule, value, callback) => {
          if (this.infoItemsKeys.length) {
            callback()
          } else {
            callback(new Error(this.$t('请选择完善项目')))
          }
        },
        trigger: 'change',
      }
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
      this.infoItemsKeys = this.infoItems.reduce((infoItemsKeys, { value }) => {
        if (rowData.rule[value]) {
          infoItemsKeys.push(value)
        }
        return infoItemsKeys
      }, [])
      this.tableData = rowData;
    },
    handleInfoItemsKeysChange(infoItemsKeys) {
      if (infoItemsKeys.includes('isBank') && !infoItemsKeys.includes('isName')) {
        infoItemsKeys.push('isName')
      }
      this.infoItemsKeys = infoItemsKeys
      this.infoItems.forEach(({ value }) => {
        this.tableData.rule[value] = infoItemsKeys.includes(value)
      })
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
.multipleWater {
  /deep/ .el-input {
    width: 10% !important;
  }
}
</style>
