<template>
  <div>
    <el-table v-bind="table" v-loading="loading" border>
      <el-table-column v-for="(item, i) in columns" :key="i" align="center" v-bind="item">
        <template slot-scope="scope">
          <template v-if="item.render">
            <tableColumnCom :render="item.render" :row="scope.row" :scope="scope"></tableColumnCom>
          </template>
          <div v-else>{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="page" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
const tableColumnCom = {
  props: {
    render: {
      type: Function,
      default: () => {}
    },
    row: Object,
    scope: Object
  },
  render(h) {
    return this.render(h, this.row, this.scope)
  }
}
export default {
  name: "WindTable",
  components: {
    tableColumnCom
  },
  props: {
    page: Number,
    size: Number,
    total: Number,
    table: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size', val)
    },
    handleCurrentChange(val) {
      this.$emit('page', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
/deep/ .el-table td {
  padding: 10px 0 !important;
}
/deep/ .el-loading-mask {
  z-index: 1;
}
</style>
