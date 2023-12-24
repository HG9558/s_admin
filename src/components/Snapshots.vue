<template>
  <el-breadcrumb
    class="snapshots-wrapper"
    separator-class="el-icon-arrow-right"
  >
    <el-breadcrumb-item
      v-for="(item, index) in snapshots"
      :key="item[displayKey]"
    >
      <!-- 最后一个不能点 -->
      <template v-if="index === snapshots.length - 1">{{ item[displayKey] }}</template>

      <el-button
        v-else
        type="text"
        size="small"
        @click="handleClick(index)"
      >
        {{ item[displayKey] }}
      </el-button>
    </el-breadcrumb-item>
    <!-- 插槽 -->
    <slot name="after"></slot>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Snapshots',

  model: {
    prop: 'snapshots',
    event: 'change',
  },

  props: {
    snapshots: {
      type: Array,
      required: true,
    },
    displayKey: {
      type: String,
      required: true,
    },
  },

  computed: {
    snapshotsObserver: {
      get() {
        return this.snapshots
      },

      set(value) {
        this.$emit('change', value)
      },
    }
  },

  methods: {
    handleClick(index) {
      this.snapshotsObserver = this.snapshotsObserver.slice(0, index + 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.snapshots-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #606266;
}
/deep/ .el-breadcrumb__item:last-child{
  padding: 11px 5px;
}
</style>
