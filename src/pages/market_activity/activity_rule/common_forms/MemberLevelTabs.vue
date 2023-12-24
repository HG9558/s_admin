<template>
  <el-tabs class="activity-rule-tabs" v-model="layerIndexObserver" type="card">
    <el-tab-pane
      :key="item.id"
      :name="String(index)"
      :label="item.tierName"
      v-for="(item, index) in memberLevelGroup"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  model: {
    prop: 'layerIndex',
    event: 'change'
  },
  props: ['layerIndex', 'memberLevelGroup'],
  computed: {
    layerIndexObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.layerIndex))
      },
      set(value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-rule-tabs /deep/ .el-tabs__item{
  height: 24px;
  line-height: 24px;
}
</style>


