<template>
  <div>
    <el-form-item :label="label">
      <br />
      <div>
        <el-table border :data="table" align="center" :empty-text="$t('请增加规则')">
          <el-table-column :label="$t('累计实际有效输赢')">
            <template slot-scope="scope">
              <div class="w50-input">
                <el-input style="width: 40%" v-model.number="table[scope.$index].amountMin" type="number" @change="handleChange"></el-input> -
                <el-input style="width: 40%" v-model.number="table[scope.$index].amountMax" type="number" @change="handleChange"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('提成比例')">
            <template slot-scope="scope">
              <div class="w30-input">
                <el-input style="width: 90%" v-model.number="table[scope.$index].donateAmount" type="number" @change="handleChange"></el-input> %
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div style="text-align: center"><el-button type="danger" @click="handleDelete(scope)">{{ $t('删除') }}</el-button></div>
            </template>
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="handleAdd(scope)">{{ $t('增加规则') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "AddTable",
  props: {
    table: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleDelete(scope) {
      this.$emit('delete', scope)
    },
    handleAdd(scope) {
      this.$emit('add', scope)
    },
    handleChange() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .w50-input {
  width: 50%;
  margin: 0 auto;
}
/deep/ .w30-input {
  width: 45%;
  margin: 0 auto;
}
/deep/ .cell .el-button {
  width: 30%;
  padding: 5px !important;
}
/deep/ .el-table td, .el-table th {
  padding: 8px 0 !important;
}
</style>
