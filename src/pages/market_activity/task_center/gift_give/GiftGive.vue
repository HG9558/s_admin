<template>
  <div>
    <el-form-item :label="$t('奖励设置') + ':'">
      <div style="width: 300px">
        <el-table :data="tableData.rule.rules" border style="width: 100%">
          <el-table-column prop="level" :label="$t('会员等级')" align="center"> </el-table-column>
          <el-table-column prop="gift" :label="$t('奖励物品')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.gift"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ActivityRule",
  props: ["rowData", "rules"],
  data() {
    return {
      tableData: {
        rule: {},
      },
    }
  },
  watch: {
    tableData: {
      handler(n) {
        this.$emit("changeVal", n);
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let rowData = JSON.parse(JSON.stringify(this.rowData));
      const rule = JSON.parse(rowData.rule);

      rowData.rule = rule;
      this.tableData = rowData;
    },
  },
}
</script>

<style>
</style>