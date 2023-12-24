<template>
  <div>
    <component :is="componentName"></component>
  </div>
</template>
<script>
  import List from './List'
  import Audit from './Audit'
  export default {
    name: 'agentWithdrawal',
    components:{
      List, Audit
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
