<template>
  <el-dialog :visible.sync="show" :title="title" @close="$emit('update:isShow', false)">
    <div class="content-box">
      <slot />
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="handleClick('agree')" :loading="loading">{{ $t('通过') }}</el-button>
      <el-button type="danger" @click="handleClick('refuse')" :loading="loading">{{ $t('拒绝') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RebateDialog",
  props: {
    title: String,
    isShow: Boolean,
    loading: {
      type: Boolean,
      dafault: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  created() {
    this.show = this.isShow
  },
  watch: {
    isShow() {
      this.show = this.isShow
    }
  },
  methods: {
    handleClick(type) {
      this.$emit('btnClick', type)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/{
  .content-box {
    padding: 0 15px 20px;
  }
}
</style>
