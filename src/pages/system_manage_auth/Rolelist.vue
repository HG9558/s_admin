<template>
  <div class="role-list">
    <div class="role-content">
      <div class="left">
        <div class="head">
          <span>{{ $t('权限列表') }}</span>
          <span class="num">{{ roleList.length }}{{ $t('项') }}</span>
        </div>
        <div>
          <div class="input">
            <el-input :placeholder="$t('请输入权限名称')" v-model="checkRoleName" style="width: 90%;">
              <i slot="prefix" class="el-icon-search search-i" @click="handleCheckRoleName"></i>
            </el-input>
          </div>
          <el-tree :default-checked-keys="checkedPart" :data="roleList" :props="defaultProps" ref="roleTree" accordion check-on-click-node node-key="id" :filter-node-method="handleCheckRoleName" @node-click="handleNodeClick">
          </el-tree>
        </div>
      </div>
      <div class="middle"><span>-</span></div>
      <div class="right">
        <div class="head">
          <span>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
            {{ $t('关联角色') }}
          </span>
          <span class="num">{{ actRoleList.length }}{{ $t('个') }}</span>
        </div>
        <div>
          <div class="input">
            <el-select v-model="roleName" multiple :placeholder="$t('请输入角色名称')" filterable clearable style="width: 75%;">
              <el-option
                v-for="item in roleNameList"
                :disabled="item.disabled"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
            <el-button type="primary" @click="handleLine" :loading="lineLoading">{{ $t('关联') }}</el-button>
          </div>
          <ul class="role-box">
            <el-checkbox-group v-model="roles" @change="handleRolesChange">
              <li v-for="(item, i) in actRoleList" :key="i" class="role-i">
                <el-checkbox :label="item.roleId">{{ item.roleName }}</el-checkbox>
                <i class="el-icon-error" @click="delConfirm([item.roleId])"></i>
              </li>
            </el-checkbox-group>
          </ul>
          <div class="cancel-box" v-show="actRoleList.length">
            <el-button type="danger" class="cancel-btn" @click="handleCancelLine">{{ $t('取消关联') }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "Rolelist",
  data() {
    return {
      roleList: [],
      roleName: [],
      roleNameList: [],
      actRoleList: [],
      roles: [],
      checkRoleName: '',
      isIndeterminate: false,
      checkAll: false,
      lineLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      actTree: {},
      selectArr: [],
      actSelect: '',
      checkedPart: [],
    }
  },
  created() {
    this.init()
  },
  watch: {
    checkRoleName(val) {
      this.$refs.roleTree.filter(val)
    }
  },
  methods: {
    init() {
      this.getRoleList()
      this.getRoleNameList()
    },
    handleNodeClick(data) {
      this.selectArr = this.$refs.roleTree.getCheckedKeys().concat(this.$refs.roleTree.getHalfCheckedKeys())
      this.$refs.roleTree.setCheckedKeys([])
      this.roleName = []
      this.actTree = data
      if(data.type===6||data.type===7){
        this.$axios.get(this.$urls.getSysRoleByRoleMenuExten,{params:{menuId:data.id,type:data.type}}).then(res=>{
          if(res.data.code===0){
            this.actRoleList = res.data.data
            this.roleNameList = this.roleNameList.map(i => {
              const { roleName } = i
              const obj = res.data.data.find(_i => _i.roleName === roleName)
              i.disabled = !!obj
              return i
            })
          }
        })
        return false
      }
      this.$nextTick(() => {
        this.queryRoleIdsByMenuId()
      })
    },
    handleCheckRoleName(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    delConfirm(roleIds) {
      this.$confirm(this.$t('确定进行该操作吗？取消关联后无法恢复'), this.$t('操作确认'), { center: true }).then(() => this.delRole(roleIds))
    },
    handleCancelLine() {
      const roleIds = this.roles
      if (roleIds.length === 0) return this.$message.error(this.$t('请选择关联角色'))
      this.delConfirm(roleIds)
    },
    async delRole(roleIds) {
      const data = {
        menuIds: [this.actTree.id],
        sysRoleMenuEntitys: roleIds.map(roleId => ({ roleId }))
      }
      if(this.actTree.type===6||this.actTree.type===7){
        let arrp = []
        for(let i=0;i<roleIds.length;i++){
          arrp.push({menuId:this.actTree.id,type:this.actTree.type,roleId:roleIds[i]})
        }
        this.$axios.POST(this.$urls.deleteByRoleId, arrp).then(res=>{
          if (res.res.code===0) {
            this.$message.success(this.$t('操作成功'))
            if(this.actTree.type===6||this.actTree.type===7){
              this.$axios.get(this.$urls.getSysRoleByRoleMenuExten,{params:{menuId:this.actTree.id,type:this.actTree.type}}).then(res=>{
                      if(res.data.code===0){
                  this.actRoleList = res.data.data
                  this.roleNameList = this.roleNameList.map(i => {
                    const { roleName } = i
                    const obj = res.data.data.find(_i => _i.roleName === roleName)
                    i.disabled = !!obj
                    return i
                  })
                }
              })
            }
          }
        })
      }else{
        this.$axios.POST(this.$urls.deleteMenuForManyRole, data).then(res=>{
          if (res.res.code===0) {
            this.$message.success(this.$t('操作成功'))
            this.queryRoleIdsByMenuId()
          }
        })
      }
    },
    async handleLine() {
      const { id } = this.actTree
      if(id||id===0){
        const data = {
          menuIds: [...this.selectArr],
          sysRoleMenuEntitys: [...this.roleName.map(roleId => ({ roleId }))]
        }
        this.lineLoading = true
        if(this.actTree.type===6||this.actTree.type===7){
          this.$axios.POST(this.$urls.saveAndUpdateByRoleId, {
            menuId: id,     //菜单ID
            roleIds: [].concat(this.roleName),    //角色ID
            type: this.actTree.type    //类型

          }).then(res=>{
            this.lineLoading = false
            if(res.res.code===0){
              this.$message.success(this.$t('关联成功'))
                if(this.actTree.type===6||this.actTree.type===7){
                  this.$axios.get(this.$urls.getSysRoleByRoleMenuExten,{params:{menuId:this.actTree.id,type:this.actTree.type}}).then(res=>{
                              if(res.data.code===0){
                      this.actRoleList = res.data.data
                      this.roleNameList = this.roleNameList.map(i => {
                        const { roleName } = i
                        const obj = res.data.data.find(_i => _i.roleName === roleName)
                        i.disabled = !!obj
                        return i
                      })
                    }
                  })
                }
            }
          })
        }else{
          this.$axios.POST(this.$urls.saveMenuForManyRole, data).then(res=>{
            this.lineLoading = false
            if(res.res.code===0){
              this.queryRoleIdsByMenuId()
            }
          })
        }
      } else {
        this.$message.error(this.$t('请选择权限'))
      }
    },
    async getRoleNameList() {
      const { res } = await this.$axios.GET(this.$urls.roleSelect)
      if (res) {
        this.roleNameList = res.list
      }
    },
    handleCheckAllChange(val) {
      this.roles = val ? this.actRoleList.map(i => i.roleId) : []
      this.isIndeterminate = false
    },
    handleRolesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.actRoleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.actRoleList.length
    },
    async queryRoleIdsByMenuId() {
      const params = {
        menuId: this.actTree.id
      }
      this.$axios.GET(this.$urls.queryRoleIdsByMenuId, params).then(res=>{
        if (res) {
          const { msg } = res.res
          this.actRoleList = msg
          this.roleNameList = this.roleNameList.map(i => {
            const { roleName } = i
            const obj = msg.find(_i => _i.roleName === roleName)
            i.disabled = !!obj
            return i
          })
        }
      })
    },
    async getRoleList() {
      this.getCurrentRecodeTime()
      const obj = await this.$axios.GET(this.$urls.getTreeNewMenu)
      const { res, response } = obj
      this.getNetworkLoadAndDataSolveTime(response)
      if (res) {
        this.roleList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list {
  .role-content {
    display: flex;
    padding: 20px;
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 14px !important;
      background: #eee;
      line-height: 40px;
      padding: 0 20px;
      .num {
        color: #888;
        font-size: 12px;
      }
    }
    .input {
      padding: 10px 20px;
      text-align: center;
    }
    .search-i {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 18px;
      cursor: pointer;
    }
    .left {
      flex: 3;
      border: 1px solid #eee;
    }
    .middle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      span {
        width: 30px;
        line-height: 30px;
        text-align: center;
        display: inline-block;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
    }
    .right {
      flex: 3;
      border: 1px solid #eee;
    }
  }
  .role-box {
    .role-i {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      border-top: solid #eee 1px;
      .el-icon-error {
        cursor: pointer;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #f56c6c;
      }
    }
  }
  .cancel-box {
    padding: 30px 0;
    text-align: center;
  }
  .cancel-btn {
    width: 50%;
  }
}
/deep/ {
  .el-submenu__icon-arrow {
    right: 20px;
  }
  .el-menu {
    border-right: none;
  }
  .el-submenu__title {
    font-size: 14px !important;
  }
  .is-current > .el-tree-node__content {
    background-color: #409EFF;
    color: #fff;
  }
  .el-tree-node__content {
    margin-left: 0;
  }
}
</style>
