<template>
  <TableCom
    :table-loading="loading"
    :hasRemoveBtn="false"
    :hasAddBtn="false"
    :hasPagination="hasPagination"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </TableCom>
</template>

<script>
export default {
  name: "STableCom",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    hasPagination: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
