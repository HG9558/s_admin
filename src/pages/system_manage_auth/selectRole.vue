<template>
  <el-select v-model="roleName" :placeholder="$t('请选择角色')" @change="changerole(roleName)">
    <el-option :label="$t('全选')" value=""></el-option>
    <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleName"></el-option>
  </el-select>
</template>
<script>
  export default {
    data () {
      return {
        roleName: '',
        roles: [],
        roleSelected:this.roleSelectedLabel
      }
    },
    created () {
      this.getroles()
    },
    props:{roleSelectedLabel:String},
    watch:{
      roleSelectedLabel(){
          this.setRole()
      }
    },
    methods: {
      getroles () {
        this.$axios.get('/bkapi/sys/role/listAll').then((res) => {
          res.data.list.map((item) => {
            this.roles.push({roleName: item.roleName, roleId: item.roleId})
          })
        })
      },
      changerole (role) {
        this.$emit('getchrole', role)
      },
      setRole(){
        this.roleName =this.roleSelectedLabel
      }
    }
  }
</script>
<style>
</style>
