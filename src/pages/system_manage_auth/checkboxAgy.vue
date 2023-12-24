<template>
  <div @>
    <el-form-item :label="$t('总代理')">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
      <div style="margin: 1px 0;"></div>
      <el-checkbox-group v-model="checkedagyids">
        <el-checkbox v-for="agent in agents" :label="agent.id" :key="agent.id" >
          {{agent.value}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('代理')" v-model="treeCheckedIdList">
      <el-tree :data="agentTree" show-checkbox node-key="id" :default-checked-keys="treeCheckedIdList"  ref="tree"
               :props="defaultProps" @check="handleCheckedagentsedsChange"></el-tree>
    </el-form-item>
  </div>
</template>
<script>
  import bus from '../../config/EventBus'
  export default {
    components: {
      bus
    },
    data () {
      return {
        AgentOptions: [],
        checkAll: false,
        checkedagyids: [],
        isIndeterminate: true,
        AgentSedOptions: [],
        checkedagysedids: [],
        agentTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeCheckedIdList: [],
        userId: -1,
        treeCheckedIdListMapWatch: this.treeCheckedIdListMap,
        agentAccounts :[],
      }
    }
    ,
    props: {treeCheckedIdListMap: Array},
    created () {
      this.getgroups()
      this.getAgentTree()

    },
    mounted(){
      this.initCheckedNode()
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
      treeCheckedIdListMap(o, n){
        this.setCheckedKeys()
      },
      agentAccounts () {
        this.$emit('agentAccounts', {agentAccount :this.agentAccounts,checked:this.checkAll})
      }
    },
    methods: {
      getAgentTree(){
        this.$axios.get('bkapi/agent/account/selectAgentTree').then((resp) => {
          if (resp.data.code === 0) {
            this.agentTree = resp.data.agentTree
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
        this.$emit('agentAccounts', {agentAccount :this.agentAccounts,checked:this.checkAll})
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.agents.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.agents.length
      },
      handleCheckedagentsedsChange (currentNode,checkedNodes) {
        let checkedKeys =checkedNodes.checkedKeys
        //计算父节点和子节点
        let agentAccounts = []
        this.checkedagyids.forEach(e =>{
            agentAccounts.push({agyAccountId : e,agyAccountType:0,userId :this.$store.state.user.userId})
        })
        for(let x = 0;x< checkedKeys.length ;x++){
          for(let y = 0;y< this.checkedagyids.length ;y++){
              if(checkedKeys[x] == this.checkedagyids[y]){
                  break;
              }
              if( y == this.checkedagyids.length-1){
                  agentAccounts.push({agyAccountId : checkedKeys[x],agyAccountType:1,userId :this.$store.state.user.userId})
              }
          }
        }
        this.agentAccounts=agentAccounts
      },
      //初始化树
      initCheckedNode(){
        this.treeCheckedIdList = []
        this.checkedagyids = []
        for (let x=0; x < this.treeCheckedIdListMap.length; x++) {
          let value = this.treeCheckedIdListMap[x]
          if (value.agyAccountType == 0) {
            this.checkedagyids.push(value.agyAccountId)
          }
          this.treeCheckedIdList.push(parseInt(value.agyAccountId))
        }

      },
      //设置树
      setCheckedKeys(){
        this.$refs.tree.setCheckedKeys([])
        this.initCheckedNode()
        this.$refs.tree.setCheckedKeys(this.treeCheckedIdList)
      }
    }
  }
</script>
<style lang="scss">
  .el-checkbox-group {
    margin-left: 0;
    .el-checkbox + .el-checkbox {
      margin-left: 5px;
      margin-right: 10px;
    }
  }
</style>
