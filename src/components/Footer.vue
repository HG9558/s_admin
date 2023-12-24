<template>
  <div class="footer"></div>
</template>

<script type="text/babel">
  import systemConfig from '../config/config.js'
  export default {
    computed: {
      siteTitle () {
        return this.$store.state.siteTitle
      }
    },
    created () {
      this.$axios.get(systemConfig.urls.getWebsiteTtile).then((resp) => {
        this.$store.commit('siteTitle', resp.data.data)
      }),
      this.$axios.get(systemConfig.urls.getinfo).then((resp) => {
        this.$store.commit('setUser', resp.data.user)
      })
    }
  }
</script>

<style lang="scss">
  .footer{
    height:36px;
    line-height: 36px;
    width:calc(100% - 210px);
    margin-left: 210px;
    padding-left: 20px;
    background: #e9ebee;
    position: fixed;
    z-index: 25;
    bottom: 0;
    transition: width 1s, margin-left 1s;
  }
</style>
