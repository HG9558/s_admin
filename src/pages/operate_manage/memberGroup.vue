<template>
      <el-select v-model="groupId" :placeholder="$t('会员组')" @change="fngroupIdUpdate(groupId)">
        <el-option v-for="item in listgroup" :key="item.value" :label='item.value' :value='item.id'></el-option>
      </el-select>
</template>
<script>
    export default {
      data () {
        return {
          groupId: '',
          listgroup: []
        }
      },
      created () {
        this.getlistgroup()
      },
      methods: {
        getlistgroup () {
          this.$axios.get('bkapi/member/mbrgroup/listAll').then((resp) => {
            resp.data.page.forEach((value) => {
              this.listgroup.push({id: value.id, value: value.groupName})
            })
          })
        },
        fngroupIdUpdate (groupId) {
          this.$emit('getchgroupid', groupId)
        }
      }
    }
</script>
<style>
</style>
