<template>
    <div class="overlay" :class="[message === 'chooseMore' ? 'choose-more' : '']"></div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['message']
  }
</script>

<style lang="scss">
.overlay{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
  z-index: 3500;
}
.choose-more{
  z-index: 37;
  opacity: 0.1;
}
</style>
