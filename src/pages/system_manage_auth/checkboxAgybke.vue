<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedagyids" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="agent in agents" :label="agent.id" :key="agent.id" @change="sedAgent(agent.id)" >{{agent.value}}
        <div class="rowAbs">
          <el-checkbox v-model="agent.value" @change="handleCheckAllChange">{{agent.value}}</el-checkbox>
          <el-checkbox-group v-model="checkedagysedids" @change="handleCheckedagentsedsChange">
            <el-checkbox v-for="agentsed in agentseds" :label="agentsed.id" :key="agentsed.id" >{{agentsed.value}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-checkbox>
    </el-checkbox-group>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedagysedids" @change="handleCheckedagentsedsChange">
      <el-checkbox v-for="agentsed in agentseds" :label="agentsed.id" :key="agentsed.id" >{{agentsed.value}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        AgentOptions: [],
        checkAll: false,
        checkedagyids: [],
        isIndeterminate: true,
        AgentSedOptions: [],
        checkedagysedids: []
      }
    },
    created () {
      this.getgroups()
    },
    computed: {
      agents () {
        return this.AgentOptions
      },
      agentseds () {
        return this.AgentSedOptions
      }
    },
    watch: {
      checkedagyids () {
        this.$emit('getgroupids', this.checkedagyids)
      },
      checkedagysedids () {
        this.$emit('getgroupids', this.checkedagysedids)
      }
    },
    methods: {
      sedAgent (parentId) {
        this.AgentSedOptions = []
        this.$axios.get('bkapi/agent/account/findTopAccountAll', {params: {parentId}}).then((resp) => {
          if (resp.data.code === 0) {
            resp.data.accounts.map((value) => {
              this.AgentSedOptions.push({id: value.id, value: value.agyAccount})
              this.checkedagysedids.push(value.id)
            })
          }
        })
      },
      getgroups () {
        this.$axios.get('bkapi/agent/account/getAllParentAccount').then((resp) => {
          if (resp.data.code === 0) {
            resp.data.accounts.map((value) => {
              this.AgentOptions.push({id: value.id, value: value.agyAccount})
            })
          }
        })
      },
      handleCheckAllChange (val) {
        let ids = []
        this.AgentOptions.map((item) => {
          ids.push(item.id)
        })
        this.checkedagyids = val ? ids : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.agents.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.agents.length
      },
      handleCheckedAgentChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.agents.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.agents.length
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
