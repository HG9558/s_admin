<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedgroupids" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="group in groups" :label="group.id" :key="group.id" >{{group.value}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
  import bus from '../../config/EventBus'
  export default {
    data () {
      return {
        groupOptions: [],
        checkAll: false,
        checkedgroupids: [],
        isIndeterminate: true,
        CheckedGroupP : this.BeforeCheckedGroupP
      }
    },
    props: {BeforeCheckedGroupP: Array},
    created () {
      this.getgroups()
    },
    computed: {
      groups () {
        return this.groupOptions
      }
    },
    watch: {
      checkedgroupids () {
        this.$emit('getgroupids', this.checkedgroupids)
      },
      BeforeCheckedGroupP(){
        this.initCheckedGroup()
      }
    },
    methods: {
      getgroups () {
        this.$axios.get('bkapi/member/mbrgroup/findGroupAllNoAuth').then((resp) => {
          if (resp.data.code === 0) {
            resp.data.page.forEach((value) => {
              this.groupOptions.push({id: value.id, value: value.groupName})
            })
          }
        })
        this.checkedgroupids =this.CheckedGroupP
        bus.$emit('mbeGroupCheckedAll', this.checkAll)
      },
      handleCheckAllChange (val) {
        let ids = []
        this.groupOptions.map((item) => {
          ids.push(item.id)
        })
        bus.$emit('mbeGroupCheckedAll', this.checkAll)
        this.checkedgroupids = val ? ids : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount == this.groups.length
        bus.$emit('mbeGroupCheckedAll', this.checkAll)
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.groups.length
      },
      initCheckedGroup(){
        this.checkedgroupids =this.BeforeCheckedGroupP
        bus.$emit('mbeGroupCheckedAll', this.checkAll)
      }
    }
  }
</script>
<style lang="scss" >
  .el-checkbox-group{
    margin-left: 0;
    .el-checkbox+.el-checkbox {
      margin-left: 5px;
      margin-right: 10px;
    }
  }
</style>
