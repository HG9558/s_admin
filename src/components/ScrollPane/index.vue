<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="styleObj">
      <slot></slot>
    </div>
    <span class="iconfont icon-label-left pointer" v-show="leftShow" @click="moveLeft"></span>
    <span class="iconfont icon-label-right pointer" v-show="rightShow" @click="moveRight"></span>
  </div>
</template>

<script>
const padding = 30 // tag's padding
export default {
  name: 'scrollPane',
  data () {
    return {
      left: 0,
      markup: 1,
      maxleftWidth: 0, // 点击左右按钮  left的最大值
    }
  },
  computed: {
    styleObj () {
      return {left: this.left + 'px',transition: 'left 1s'}
    },
    leftShow() {
      return this.left < 0
    },
    rightShow() {
      return this.maxleftWidth > 0 && Math.abs(this.left) < this.maxleftWidth
    }
  },
  mounted () {
    this.calcMaxleftWidth()
  },
  updated() {
    this.calcMaxleftWidth()
  },
  methods: {
    calcMaxleftWidth() {
      const wrapper = this.$refs.scrollWrapper
      if (wrapper) {
        this.maxleftWidth = wrapper.offsetWidth > wrapper.parentNode.offsetWidth ? wrapper.offsetWidth - wrapper.parentNode.offsetWidth : 0
      }
    },
    moveLeft () {
      this.left += 200
      if (this.left >= 0) {
        this.left = 0
      }
    },
    moveRight () {
      this.left -= 200
      if (this.left < -this.maxleftWidth) {
        this.left = -this.maxleftWidth - 10
      }
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        } else {
          this.left = 0
        }
      }
    },
    moveToTarget($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth
      //$containerWidth比实际少17是滚动条的值
      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
    height: 36px;
    line-height: 36px;
  }
  .icon-label-left, .icon-label-right {
    position:absolute;
    top: 0;
    height: 36px;
    line-height: 40px;
    z-index: 10;
    font-size: 14px;
    text-align: center;
    width: 22px;
    color: #909399;
    background: #fff;
    // background: #e0e0e0;
  }
  .icon-label-left {
    left: 0
  }
  .icon-label-right {
    right: 0
  }
}
</style>
