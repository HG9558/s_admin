<template>
  <el-select v-model="id" :placeholder="$t('会员组')" @change="fnidUpdate(id)">
    <el-option v-for="item in options" :key="item.value" :label='item.value' :value='item.id'></el-option>
  </el-select>
</template>
<script>
  export default {
    data () {
      return {
        id: '',
        options: []
      }
    },
    props: {
      soure: ''
    },
    created () {
      switch (this.soure) {
        case 'tagnet': this.getAgentt()
          break
        case 'mgroup': this.getlistgroup()
          break
        case 'commissions': this.getcommissions()
          break
        default: break
      }
    },
    methods: {
      getAgentt () {
        this.$axios.get('/bkapi/agent/account/findTopAccountAll?parentId=0').then((resp) => {
          resp.data.accounts.forEach((value) => {
            this.options.push({id: value.id, value: value.agyAccount})
          })
        })
      },
      getlistgroup () {
        this.$axios.get('member/mbrgroup/listAll').then((resp) => {
          resp.data.page.forEach((value) => {
            this.options.push({id: value.id, value: value.groupName})
          })
        })
      },
      getcommissions () {
        this.$axios.get('member/mbrgroup/listAll').then((resp) => {
          resp.data.page.forEach((value) => {
            this.listgroup.push({id: value.id, value: value.groupName})
          })
        })
      },
      fnidUpdate (id) {
        this.$emit('getid', id)
      }
    }
  }
</script>
<style>
</style>
