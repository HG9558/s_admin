<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>
<script>
  import List from './List'
  import Detail from './Detail'
  export default {
    name: 'agentList',
    components:{
      List, Detail
    },
    data() {
      return {
        
      }
    },
    computed: {
      componentName(){
        return this.$route.query.component || 'List'
      }
    },
  }
</script>
<style lang="scss">

</style>
