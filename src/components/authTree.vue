<template>
  <el-tree
    :data="treeData"
    show-checkbox
    node-key="id"
    :default-checked-keys="checkedData"
    :expand-on-click-node="false"
    @node-click="handleCheckChange"
    @check="checkChange"
    ref="tree2">
  </el-tree>
</template>

<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    props: ['treeData', 'checkedData'],
    watch: {

      treeData(newValue, oldValue) {
      },
      checkedData(newValue, oldValue) {
        this.checkedData = newValue
      }
    },
    methods: {
      checkChange(node, data) {
      },
      handleCheckChange(data, checked, indeterminate) {
        this.$emit('getChildTreeData', data)
        // checked.checked = true
      },

    }
  };
</script>
