<template>
 <el-popover
    v-model="isShow"
    popper-class="copy-button-wrapper"
    placement="bottom"
    trigger="click"
    :content="$t('已复制')"
  >
    <a
      slot="reference"
      href="javascript:;"
      class="clip iconfont icon-copy copy-button"
      :data-clipboard-text="copyContent"
      @mouseleave="isShow = false"
    >
    </a>
  </el-popover>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  props: {
    copyContent: {
      type: String,
      required: true,
      default:'',
    },
  },
  data() {
    return {
      isShow: false
    }
  },
  created() {
    this.$nextTick(() => {
      new Clipboard('.clip')
    })
  },
}
</script>

<style lang="scss">
.copy-button-wrapper {
  color: #fff;
  padding: 6px 4px;
  text-align: center;
  background-color: #000;
  .popper__arrow.popper__arrow {
    &::after {
      border-bottom-color: #000;
    }
  }
}
.copy-button {
  color: #666;
  margin-left: 6px;
}
</style>


