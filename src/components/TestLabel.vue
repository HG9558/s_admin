<template>
  <i class="jocelyn_text_label" v-if="id === 4 || parentId === 4">{{ $t('测试') }}</i>
</template>

<script>
export default {
  props: ['id', 'parentId']
}
</script>

<style lang="scss" scoped>
.jocelyn_text_label {// :
  color: #FF9800;
  margin-left: 10px;
}
</style>

