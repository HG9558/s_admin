<template>
  <div class="company-deposit-setting role-auth" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('角色名称') }}</label>
          <el-input v-model="formParamObj.roleName" v-trim @keyup.enter.native="search()" ></el-input>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select v-model="formParamObj.isEnable" multiple>
            <el-option :label="$t('启用')" value="1"></el-option>
            <el-option :label="$t('禁用')" value="0"></el-option>
          </el-select>
        </div>
        <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
          <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
          <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
        </div>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button v-if="hasPermission('sys:role:save')" icon="el-icon-circle-plus-outline" style="width: 100px;" type="primary" size="mini" @click="addNew">{{ $t('新增') }}
      </el-button>
    </el-row>
    <el-table max-height="480" type="flex" :data="tableData" @sort-change="sortevt"
              v-loading='loading' border fit highlight-current-row>
      <el-table-column type="index" width="60" :label="$t('序号')" :index="indexMethod" align="center"></el-table-column>
      <el-table-column prop="roleName" :label="$t('角色名称')" width="100" align="center"></el-table-column>
      <!-- <el-table-column prop="roleNickName" label="显示名称" width="100"></el-table-column> -->
      <el-table-column prop="remark" :label="$t('角色描述')" align="center"></el-table-column>
      <el-table-column prop="userNum" :label="$t('用户数')" width="100" align="center">
        <template slot-scope="scope">
          <span @click="handleLineUser(scope.row)" class="blue-color pointer">{{ scope.row.userNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isEnable" :label="$t('状态')" width="100" align="center"
                       :filters="[{ text: $t('禁用'), value: 0 }, { text: $t('启用'), value: 1 }]" :filter-method="filterTag"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable === 1 ? 'primary' : 'warning'">{{statusFilter(scope.row.isEnable)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" :label="$t('创建人')" width="100" align="center"></el-table-column>
      <el-table-column prop="createTime" :label="$t('创建时间')" width="180" align="center"></el-table-column>
      <el-table-column prop="isEnable" :label="$t('是否启用')" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable"
                     @change="togglestatu(scope.row)"
                     :disabled="!hasPermission('sys:role:available')"
                     :inactive-value='0' :active-value='1'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="230" align="center">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small" @click="update(scope.row)">[编辑]</el-button>-->
          <span v-if="hasPermission('sys:role:modify')" class="blue-color pointer" @click="updateNew(scope.row)">[{{ $t('编辑') }}]</span>
          <span v-if="hasPermission('sys:role:delete')" class="blue-color pointer" @click="deleteDeposite(scope.row)">[{{ $t('删除') }}]</span>
          <span v-if="hasPermission('sys:user:update')" class="blue-color pointer" @click="handleLineUser(scope.row)">[{{ $t('关联用户') }}]</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination @size-change="handleSizeChange"
                     background
                     @current-change="handleCurrentChange"
                     :current-page="listReq.pageNo"
                     :page-sizes="listReq.pageSizeArr"
                     :page-size="listReq.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
  	</div>


    <el-dialog :title="dialogTitle" :visible.sync="editeFormVisible" @close="menuCancel('menuForm')">
      <el-form class="small-space form-content" label-position="right" label-width="150px" ref="menuForm"
               :rules="commonRule" :model="roleAuthObj">
        <!-- <el-form-item label="快捷复制参数" v-if="pageFlag===1">
          <el-select v-model="selectVal" placeholder="请选择角色" @change="getMenuId">
            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('角色名称')" prop="roleName" :rules="commonRule.notNull">
          <el-input v-model="roleAuthObj.roleName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('显示名称')" prop="roleNickName" :rules="commonRule.notNull">
          <el-input v-model="roleAuthObj.roleNickName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('角色描述')" prop="remark" :rules="commonRule.notNull">
          <el-input v-model="roleAuthObj.remark"></el-input>
        </el-form-item>

      </el-form>
      <div style="margin: 0 50px;border: 1px solid #dcdfe6">
        <el-row>
          <el-col :span="8" class="brb">{{ $t('模块') }}</el-col>
          <el-col :span="16" class="bb">{{ $t('权限') }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="br" ref="colLeft" :style='leftHeightObj'>
            <el-tree
              :data="treeData"
              show-checkbox
              node-key="id"
              ref="tree"
              @node-click="nodeClick"
              @check="checkClick"
              :default-checked-keys='defaultCheck'
              :accordion='true'
              @check-change="checkChange"
              @node-expand="delayChangeHeight"
              @node-collapse="delayChangeHeight"
              :default-expand-all='false'
              :expand-on-click-node='false'
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-col>
          <el-col :span="16" ref="colRight">
            <div v-if="operations.children&&operations.children.length>0">
              <div v-if="operations.level === 3">
                <!--<el-checkbox class="ml30" @change="handleCheckAllChange(operations.id)">全选</el-checkbox>-->
                <p class="one-level">{{operations.label}}
                  <el-checkbox v-model="checkAll" class="ml30" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
                </p>
                <div v-for="(item, index) in operations.children" :key="index">
                  <p class="second-level">{{item.label}}</p>
                  <div v-for="(secondItem, index) in item.children" :key="index">
                    <p class="third-level">{{secondItem.label}}</p>
                    <div v-if="secondItem.children&&secondItem.children.length>0">
                      <el-checkbox-group class="level" v-model="checkedOperations"
                                         @change="handleCheckedOperationsChange">
                        <el-checkbox v-for="(thirdItem,index) in secondItem.children" :key="index"
                                     :label="thirdItem.id">{{thirdItem.label}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <div v-else class="ml30">({{ $t('点击模块获取权限') }})</div>
                  </div>
                </div>
              </div>
              <div v-if="operations.level === 2">
                <!--{{operations.label}}<el-checkbox class="ml30"  @change="handleCheckAllChange(operations.id)">全选</el-checkbox>-->
                <p class="second-level">{{operations.label}}
                  <el-checkbox v-model="checkAll" class="ml30" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
                </p>
                <div v-for="(item, index) in operations.children" :key="index">
                  <!--<el-checkbox v-if="item.children&&item.children.length>0" @change="handleCheckAllChange" class="ml30">全选</el-checkbox>-->
                  <p class="third-level">{{item.label}}</p>
                  <div v-if="item.children&&item.children.length>0">
                    <el-checkbox-group class="level" v-model="checkedOperations"
                                       @change="handleCheckedOperationsChange">
                      <el-checkbox v-for="(secondItem,index) in item.children" :key="index" :label="secondItem.id">
                        {{secondItem.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-else class="ml30">({{ $t('点击模块获取权限') }})</div>
                </div>
              </div>
              <div v-if="operations.level === 1">
                <!--<el-checkbox  v-model="checkAll" @change="handleCheckAllChange" class="ml30">全选</el-checkbox>-->
                <p class="third-level">{{operations.label}}
                  <el-checkbox v-model="checkAll" class="ml30" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
                </p>
                <el-checkbox-group class="level" v-model="checkedOperations" @change="handleCheckedOperationsChange">
                  <el-checkbox v-for="(item,index) in operations.children" :key="index" :label="item.id">
                    {{item.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div v-else class="ml30">({{ $t('点击模块获取权限') }})</div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuCancel('menuForm')">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveOrUpdate">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`${actRow.roleName}${$t('关联用户')}`" :visible.sync="isShowLineUser">
      <el-form label-position="right" label-width="120px" ref="lineUserForm" :model="lineUserForm">
        <el-form-item :label="$t('用户名')">
          <el-input :placeholder="$t('请输入用户名')" v-model="addRoleName" style="width: 60%" clearable></el-input>
          <el-button type="primary" @click="handleRoleAdd" :loading="addRoleLoading">{{ $t('增加') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('用户列表')">
          <div class="role-list">
            <div class="role-item" v-for="(item, i) in roleList" :key="i">{{ item.username }} <i class="el-icon-error pointer role-del" @click="delConfirmMsg(item)"></i></div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowLineUser = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="handleSaveRole" :loading="saveRoleLoading">{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

//
<script type="text/babel">

  import systemConfig from '../../config/config'
  import queryStore from '../../mixins/queryStore'
  import { mapGetters } from 'vuex'
  import Mixin from '@/mixins/loadTime'


  export default {
    name: 'roleAuth',
    mixins: [Mixin, queryStore(['formParamObj'])],
    components: { systemConfig},
    data() {
      return {
        postData: {},
        formParamObj: {
          isEnable: [],
          roleName: ''
        },
        tableData: [],
        dialogTitle: '',
        editeFormVisible: false,
        roleAuthObj: {},
        lineUserForm: {},
        roles: [],
        treeData: [],
        operations: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        actRow: {},
        commonRule: systemConfig.rules.commonRule,
        selectVal: '',
        addRoleName: '',
        total: 0,
        pageFlag: 1, // 1新增   2编辑
        tempId: '', // 快捷复制的时候  使用temp记住原id
        oprCheckAll: false,
        checkAll: false,
        isShowLineUser: false,
        checkedOperations: [],
        changeHeight: false,
        addRoleLoading: false,
        saveRoleLoading: false,
        leftHeight: 0,
        allIds: [], // 所有id
        length: 0,
        defaultCheck: [],
        tempAllIds: [],
        tempCheckOperValue: [],
        checkIds: [],
        tempNodeArr: [],
        roleList: [],
        allCheckIds: [], // 用来做减法的
        safePassword: "",
        tmpValue4SafeCheck: {},
      }
    },
    created() {
      this.getList()
      this.getTreesOperation()
    },
    computed: {
      ...mapGetters(['hasPermission']),
      loading() {
        return this.$store.state.searchLoading
      },
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      fullscreenLoading() {
        return this.$store.state.fullscreenLoading
      },
      leftHeightObj() {
        return this.changeHeight ? {'height': this.leftHeight + 'px'} : ''
      }
    },
    methods: {
      async handleSaveRole() {
        const data = {
          usernameList: this.roleList.map(i => i.username),
          roleId: this.actRow.roleId
        }
        this.saveRoleLoading = true
        const { res } = await this.$axios.POST(this.$urls.setManySysUserRole, data)
        this.saveRoleLoading = false
        if (res) {
          this.isShowLineUser = false
          this.getList()
        }
      },
      delConfirmMsg(item) {
        this.$confirm(this.$t('确定要删除吗？'), this.$t('确认操作'), { center: true }).then(() => this.handleRoleDel(item))
      },
      async handleRoleDel(item) {
        const { userId, username } = item
        const delRole = username => {
          let i
          this.roleList.find((_i, index) => {
            if (_i.username === username) {
              i = index
              return true
            }
          })
          if (i !== undefined) {
            this.roleList.splice(i, 1)
          }
        }
        if (!userId) {
          return delRole(username)
        }
        const data = {
          userId,
          roleId: this.actRow.roleId
        }
        const { res } = await this.$axios.POST(this.$urls.deleteByUserId, data)
        if (res) {
          delRole(username)
          this.getList()
        }
      },
      async handleRoleAdd() {
        const username = this.addRoleName
        const params = { username }
        this.addRoleLoading = true
        const { res } = await this.$axios.GET(this.$urls.checkSysUser, params)
        this.addRoleLoading = false
        if (res) {
          const obj = this.roleList.find(i => i.username === username)
          if (!obj) {
            this.roleList.push({ username })
          }
        }
      },
      handleLineUser(row) {
        this.actRow = row
        this.isShowLineUser = true
        this.roleList = []
        this.sysUserQueryConditions()
      },
      async sysUserQueryConditions() {
        const params = {
          pageNo: 1,
          pageSize: 999,
          roleNameList: this.actRow.roleId
        }
        const { res } = await this.$axios.GET(this.$urls.sysUserQueryConditions, params)
        if (res) {
          this.roleList = res.page.list
        }
      },
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      addNew() {
        this.$router.push(
          {
            path: 'roleAuthAdd',
            query: {
              state: 0,
              id: 0
            }
          }
        )
      },
      updateNew(row) {
        this.$router.push(
          {
            path: 'roleAuthAdd',
            query: {
              state: 1,
              id: row.roleId,
              roleName: row.roleName,
              roleNickName: row.roleName,
              remark: row.remark,
            }
          }
        )
      },
      sortevt(orders) {
        if (orders.order === 'ascending') {
          this.formParamObj.orderBy = orders.prop + ' asc'
        } else {
          this.formParamObj.orderBy = orders.prop + ' desc'
        }
        this.getList()
      },
      filterTag(value, row) {
        return row.isEnable === value
      },
      statusFilter(status) {
        if (status) {
          return this.$t('启用')
        } else {
          return this.$t('禁用')
        }
      },
      togglestatu(row) {
        this.roleAuthObj = row
        this.$axios.post(systemConfig.urls.sysRoleUpdateEnable, this.roleAuthObj).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('状态修改成功')
          })
        })
      },
      getRoles() {
        this.$axios.get(systemConfig.urls.sysRoleListAll).then((res) => {
          this.roles = res.data.list
        })
      },
      getTrees() {
        this.$axios.get(systemConfig.urls.sysMenuTreeList).then((res) => {
          this.treeData = res.data.tree
          this.editeFormVisible = true
        })
      },
      getTreesOperation() {
        this.$axios.get(systemConfig.urls.treeList).then((res) => {
          let arr = res.data.data
          for (let i = 0; i < arr.length; i++) {
            this.getAllCheckedIds(arr[i])
          }
        })
      },
      getAllCheckedIds(obj) {
        if (obj.children && obj.children.length > 0) {
          for (let i = 0; i < obj.children.length; i++) {
            // 到了操作权限那一层
            if (obj.children[i].children.length === 0) {
              this.tempNodeArr.push(obj.children[i].id)
            }
            this.getAllCheckedIds(obj.children[i])
          }
          this.allCheckIds.push({id: obj.id, checked: this.tempNodeArr})
          this.tempNodeArr = []
        }
        return this.allCheckIds
      },
      search() {
        this.getCurrentRecodeTime()
        this.listReq.pageNo = 1
        this.getList()
      },
      reset() {
        this.postData = {}
        this.formParamObj = {isEnable: [], roleName: ''}
      },
      deleteDeposite(row) {
        // 安全密码弹窗
        if (!this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck, "callback", this.deleteDeposite);
          this.$set(this.tmpValue4SafeCheck, "args", [row]);
          return;
        }
        this.$axios.post(systemConfig.urls.sysRoleDelete, {roleIds: [row.roleId]},{ headers: { securepwd: this.safePassword } }).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          this.getList()
        })
      },
      handleSizeChange(val) {
        this.listReq.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listReq.pageNo = val
        this.getList()
      },
      handleDownload() {
        require([], () => {
          const {export_json_to_excel} = require('vendor/Export2Excel')
          const tHeader = [this.$t('角色名称'), this.$t('显示名称'), this.$t('角色描述'), this.$t('用户数'), this.$t('状态'), this.$t('创建人'), this.$t('创建时间')]
          const filterVal = ['role_name', 'role_nickName', 'remark', 'userNum', 'isEnable', 'createUser', 'create_time']
          const data = this.tableData.list.map(item => filterVal.map(i => item[i]))
          export_json_to_excel(tHeader, data, this.$t('角色权限'))
        })
      },
      add() {
        this.pageFlag = 1
        this.getRoles()
        this.getTrees()
        this.roleAuthObj = {}
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
        this.dialogTitle = this.$t('新增角色')
      },
      update(row) {
        this.pageFlag = 2
        this.dialogTitle = this.$t('编辑角色')
        this.roleAuthObj.roleName = row.roleName
        this.roleAuthObj.roleNickName = row.roleNickName
        this.roleAuthObj.remark = row.remark
        this.roleAuthObj.roleId = row.roleId
        this.getRoles()
        this.getTrees()
        this.getMenuId(row.roleId)
        this.editeFormVisible = true
      },
      menuCancel(formName) {
        this.editeFormVisible = false
        this.selectVal = ''
        this.resetForm(formName)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.$refs.tree.setCheckedKeys([])
        this.tempAllIds = []
        this.roleAuthObj = {}
        this.tempCheckOperValue = []
        this.operations = []
        this.allIds = []
        this.checkIds = []
      },
      saveOrUpdate() {
        this.$refs.menuForm.validate(valid => {
          if (valid) {
            let tempArr = []
            tempArr = this.$refs.tree.getCheckedKeys()
            if (tempArr.length === 0) {
              this.$message({
                type: 'warning',
                message: this.$t('请勾选模块权限')
              })
              return
            } else {
              // 筛选权限
              let checkTree = this.$refs.tree.getCheckedKeys()
              let allArr = []
              let trueArr = []
              for (let k = 0; k < this.allCheckIds.length; k++) {
                for (let l = 0; l < checkTree.length; l++) {
                  if (checkTree[l] === this.allCheckIds[k].id) {
                    allArr = allArr.concat(this.allCheckIds[k].checked)
                  }
                }
              }
              // 使用allArr   && tempallIds 找出相同的
              for (let f = 0; f < allArr.length; f++) {
                for (let g = 0; g < this.tempAllIds.length; g++) {
                  if (this.tempAllIds[g] === allArr[f]) {
                    trueArr.push(allArr[f])
                  }
                }
              }
              let url = systemConfig.urls.saveRoleMenu
              let arr1 = []
              let arr2 = []
              let arr3 = this.$refs.tree.getCheckedKeys().concat(trueArr)
              let obj = {}
              if (this.roleAuthObj.roleId) {
                arr3.map((item) => {
                  arr1.push({'isTotalChecked': true, 'menuId': item, 'roleId': this.roleAuthObj.roleId})
                })
                this.$refs.tree.getHalfCheckedKeys().map((item) => {
                  arr2.push({'isTotalChecked': false, 'menuId': item, 'roleId': this.roleAuthObj.roleId})
                })
                this.roleAuthObj.sysRoleMenuEntities = [].concat(arr1).concat(arr2)
              } else {
                arr3.map((item) => {
                  arr1.push({'isTotalChecked': true, 'menuId': item})
                })
                this.$refs.tree.getHalfCheckedKeys().map((item) => {
                  arr2.push({'isTotalChecked': false, 'menuId': item})
                })
              }
              obj.sysRoleMenuEntities = [].concat(arr1).concat(arr2)
              obj.sysRole = this.roleAuthObj
              this.$store.state.fullscreenLoading = true
              this.$axios.post(url, obj).then((res) => {
                if (this.roleAuthObj.roleId) {
                  this.$message({
                    type: 'success',
                    message: this.$t('更新成功')
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: this.$t('保存成功')
                  })
                }
                this.editeFormVisible = false
                this.roleAuthObj = {}
                this.selectVal = ''
                this.getList()
              })
            }
          }
        })
      },
      getMenuId(val) {
        this.$axios.get(systemConfig.urls.getRoleMenu + '?roleId=' + val).then((resp) => {
          let arr = []
          resp.data.roleMenus.map((item) => {
            if (item.isTotalChecked) {
              arr.push(item.menuId)
            }
          })
          resp.data.roleMenuAuth.map((item) => {
            if (item.isTotalChecked) {
              this.tempAllIds.push(item.menuId)
            }
          })
          this.$refs.tree.setCheckedKeys(arr)
        })
      },
      getList() {
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&isEnableList=' + this.formParamObj.isEnable + '&roleName=' + this.formParamObj.roleName
        this.$store.state.searchLoading = true
        this.$axios.get(systemConfig.urls.sysRoleQueryConditions + url).then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = res.data.page.list
          this.total = res.data.page.totalCount
        })
      },
      checkChange(v1, v2) {
      },
      deleteChoice(arr1, arr2) {
        //   应该先找出相同的
        let same = []
        for (let j = 0; j < arr1.length; j++) {
          for (let i = 0; i < arr2.length; i++) {
            if (arr1[j] === arr2[i]) {
              same.push(arr1[j]) // 按照第一个数组的index重新获取值
              //arr1.splice(j, 1) 删掉后的index会乱  不能完全删干净
            }
          }
        }
        for (let j = 0; j < arr1.length; j++) {
          for (let i = 0; i < same.length; i++) {
            if (arr1[j] === same[i]) {
              arr1.splice(j, 1)
            }
          }
        }

      },
      activeMenu() {
        let menuIds = []
        let arr = this.$refs.tree.getCheckedKeys()
        for (let i = 0; i < this.checkIds.length; i++) {
          if (this.tempAllIds.length > 0) {
            for (let j = 0; j < this.tempAllIds.length; j++) {
              if (this.checkIds[i].checked.indexOf(this.tempAllIds[j]) > -1) {
                menuIds.push(this.checkIds[i].id)
                //this.trueCheckIds.push({id:this.checkIds[i].id})
              }
            }
            this.$refs.tree.setCheckedKeys(menuIds.concat(arr))
          } else {
            this.$refs.tree.setCheckedKeys(arr)
          }
        }
      },
      handleCheckAllChange(value) {
        let arr = [].concat(this.allIds)
        this.checkedOperations = value ? arr : []
        if (value) {
          this.tempAllIds = this.tempAllIds.concat(this.allIds)
          this.tempAllIds = this.unique(this.tempAllIds)
          this.tempCheckOperValue = this.tempCheckOperValue.concat(this.allIds)
        } else {
          this.tempAllIds = this.unique(this.tempAllIds)
          this.deleteChoice(this.tempAllIds, this.allIds)
          this.tempCheckOperValue = []
        }
        this.activeMenu()
      },
      handleCheckedOperationsChange(value) {
        value = this.unique(value)
        if (this.tempCheckOperValue.length > value.length) {
          // 反选
          let diff = []
          for (var i = 0; i < this.tempCheckOperValue.length; i++) {
            if (value.indexOf(this.tempCheckOperValue[i]) === -1) {
              diff.push(this.tempCheckOperValue[i]);
            }
          }
          this.deleteChoice(this.tempAllIds, diff)
        }
        this.tempCheckOperValue = value
        this.tempAllIds = this.tempAllIds.concat(value)
        this.tempCheckOperValue = this.unique(this.tempCheckOperValue)
        this.tempAllIds = this.unique(this.tempAllIds)
        this.activeMenu()
        let checkCount = value.length
        if (this.tempCheckOperValue.length > 0) {
          this.checkAll = checkCount === this.allIds.length
        }
      },
      checkClick(v1, v2) {
        this.getCheckIds(v1)
      },
      nodeClick(v1, v2, v3, v4) {
        this.allIds = []
        this.getCheckIds(v1)
        this.checkIds.splice(this.checkIds.length - 1, 1)
        this.checkIds = this.uniqueChecked(this.checkIds)
        if (this.roleAuthObj.roleId) {
          this.$axios.get(systemConfig.urls.getMenuSaveAuth + '?menuId=' + v1.id + '&roleId=' + this.roleAuthObj.roleId).then(resp => {
            this.getAuthId(resp)
            let tempId = resp.data.roleSaved
            tempId.map((item) => {
              this.tempCheckOperValue.push(item.menuId)
            })

            this.handleCheckedOperationsChange(this.tempCheckOperValue)
          })
        } else {
          this.$axios.get(systemConfig.urls.getTreeOperation + '?menuId=' + v1.id).then(resp => {
            this.getAuthId(resp)
          })
        }
      },
      getAuthId(resp) {
        this.operations = resp.data.Permissons
        this.delayChangeHeight()
        this.allIds = this.getIds(this.operations)
        this.tempCheckOperValue = []
        for (let i = 0; i < this.allIds.length; i++) {
          for (let j = 0; j < this.tempAllIds.length; j++) {
            if (this.tempAllIds[j] === this.allIds[i]) {
              this.tempCheckOperValue.push(this.tempAllIds[j])
            }
          }
        }
        this.checkedOperations = this.tempCheckOperValue
        let checkCount = this.checkedOperations.length
        this.checkAll = checkCount === this.allIds.length
      },
      getCheckIds(v1) {
        let ids = []
        this.$axios.get(systemConfig.urls.getTreeOperation + '?menuId=' + v1.id).then(resp => {
          let obj = resp.data.Permissons
          this.checkIds = this.getCheckedIds(obj)
          if (this.checkIds.length > 1) {
            this.checkIds.splice(this.checkIds.length - 1, 1)
          }
          this.checkIds = this.uniqueChecked(this.checkIds)
        })
      },
      getCheckedIds(obj) {
        if (obj.children && obj.children.length > 0) {
          for (let i = 0; i < obj.children.length; i++) {
            // 到了操作权限那一层
            if (obj.children[i].children.length === 0) {
              this.tempNodeArr.push(obj.children[i].id)
            }
            this.getCheckedIds(obj.children[i])
          }
          this.checkIds.push({id: obj.id, checked: this.tempNodeArr})
          this.tempNodeArr = []
        }
        return this.checkIds
      },
      uniqueChecked(array) {
        // 对象数组
        var arr = []
        for (var i = 0, len = array.length; i < len; i++) {
          arr.push(array[i].id)
        }
        arr = this.unique(arr)
        var b = []
        for (var i = 0, len = array.length; i < len; i++) {
          for (var j = 0, len = arr.length; j < len; j++) {
            if (array[i].id === arr[j]) {
              b.push(array[i])
            }
          }
        }
        return b
      },
      unique(array) {
        // 数组
        var arr = []
        for (var i = 0, len = array.length; i < len; i++) {
          var current = array[i]
          if (arr.indexOf(current) === -1) {
            arr.push(current)
          }
        }
        return arr
      },
      getIds(obj) {
        if (obj.children && obj.children.length > 0) {
          for (var i = 0; i < obj.children.length; i++) {
            if (obj.children[i].children.length === 0) {
              this.allIds.push(obj.children[i].id)
            }
            this.getIds(obj.children[i])
          }
        }
        return this.allIds
      },
      delayChangeHeight() {
        this.changeHeight = false
        setTimeout(() => {
          // 判断右边的高度 高于左边就重新赋值
          let leftH = this.$refs.colLeft.$el.clientHeight
          let rightH = this.$refs.colRight.$el.clientHeight
          this.changeHeight = true
          if (leftH < rightH) {
            this.leftHeight = rightH
          } else {
            this.leftHeight = leftH
          }
        }, 300)
      }
    },
    watch: {
      "$store.state.safePasswordCallbackPageEnd": function () {
        let page = this.$store.state.safePasswordCallbackPageEnd.split("_")[0];
        if (!this.$options.name || page !== this.$options.name) {
          return;
        }

        this.safePassword = this.$store.state.safePassword;
        if (
          this.tmpValue4SafeCheck.callback &&
          typeof this.tmpValue4SafeCheck.callback === "function"
        ) {
          this.tmpValue4SafeCheck.callback.apply(
            this,
            this.tmpValue4SafeCheck.args || []
          );
        }

        this.safePassword = "";
        this.tmpValue4SafeCheck = {};
      },
    },
  }
</script>
<style lang="scss">
  .brb {
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    text-align: center;
  }

  .br {
    border-right: 1px solid #dcdfe6;
    height: 100%;
    padding-bottom: 20px;
  }

  .bl {
    border-left: 1px solid #dcdfe6;
  }

  .bb {
    border-bottom: 1px solid #dcdfe6;
    text-align: center;
  }

  .el-tree-node__content {
    display: block !important;
    margin-left: 25px;
  }

  .one-level {
    font-size: 20px;
    font-weight: bold;
  }

  .second-level {
    font-size: 18px;
    margin-left: 10px;
  }

  .third-level {
    font-size: 16px;
    margin-left: 20px;
  }

  .level {
    .el-checkbox:first-child {
      margin-left: 30px;
    }
  }

  .ml30 {
    margin-left: 30px
  }
  .role-auth {
    .role-list {
      display: flex;
      flex-wrap: wrap;
      .role-item {
        position: relative;
        margin: 5px;
        padding: 5px 28px;
        border: 1px solid #13ce66;
        border-radius: 5px;
      }
      .role-del {
        position: absolute;
        right: 0px;
        top: 5px;
        color: #f56c6c;
      }
    }
  }
</style>
