<template>
  <div class="company-deposit-setting" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('用户名') }}</label>
          <el-input v-model="q.username" v-trim @keyup.enter.native="search()"></el-input>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('用户角色') }}</label>
          <el-select v-model="q.roleName" multiple>
            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select v-model="q.status" multiple>
            <el-option :label="$t('启用')" value="1"></el-option>
            <el-option :label="$t('禁用')" value="0"></el-option>
          </el-select>
        </div>
        <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
          <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
          <el-button type="danger" class="wid-80" @click.native="reset()">{{ $t('重置') }}</el-button>
        </div>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button
        type="primary"
        icon="el-icon-download"
        :loading="isNowDowning"
        @click="handleExport"
      >{{isNowDowning?$t('导出中') + '...':$t('导出')}}</el-button>
      <el-button v-if="hasPermission('agent:account:save')" icon="el-icon-circle-plus-outline" style="width: 100px;" type="primary" size="mini" @click="add(true)">{{ $t('批量新增') }}</el-button>
      <el-button v-if="hasPermission('sys:user:save')" icon="el-icon-circle-plus-outline" style="width: 100px;" type="primary" size="mini" @click="add(false)">{{ $t('新增') }}</el-button>
    </el-row>

    <el-table max-height="480" type="flex" :data="tableData.list" @sort-change="sortevt"
              v-loading="loading" border fit highlight-current-row>
      <el-table-column type="index" width="60" :label="$t('序号')" :index="indexMethod" align="center"></el-table-column>
      <el-table-column prop="username" :label="$t('用户名')" align="center"></el-table-column>
      <el-table-column prop="roleName" :label="$t('用户角色')" align="center"></el-table-column>
      <el-table-column prop="realName" :label="$t('真实姓名')" align="center"></el-table-column>
      <el-table-column prop="expireTime" width="150" :label="$t('到期时间')" align="center"></el-table-column>
      <el-table-column prop="email" :label="$t('邮箱')" align="center"></el-table-column>
      <el-table-column prop="mobile" :label="$t('手机号')" align="center"></el-table-column>
      <el-table-column prop="createTime" width="150" :label="$t('创建时间')" align="center"></el-table-column>
      <el-table-column prop="lastLoginTime" width="150" :label="$t('最后登录时间')" align="center"></el-table-column>
      <el-table-column prop="status" :label="$t('是否启用')" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="toggleStatus(scope.row)"
                     :disabled="!hasPermission('sys:user:available')"
                     :inactive-value='0' :active-value='1'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" min-width="250" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="editData(scope.row)">[数据权限]</el-button> -->
          <span v-if="hasPermission('sys:user:update')" class="blue-color pointer" @click="edit(scope.row)">[{{ $t('编辑') }}]</span>
          <span v-if="hasPermission('sys:user:delete')" class="blue-color pointer" @click="deleteRole(scope.row)">[{{ $t('删除') }}]</span>
          <!--<router-link :to="{ path: '/main/systemManage/logControl'}">[日志]</router-link>-->
          <span v-if="hasPermission('sys:user:modifypwd')" class="blue-color pointer" @click="modifyLoginPass(scope.row.userId)">[{{ $t('修改登录密码') }}]</span>
          <span v-if="hasPermission('sys:user:modifysecurepwd')" class="blue-color pointer" @click="modifySafePass(scope.row.userId)">[{{ $t('修改安全密码') }}]</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     background
                     :current-page="listReq.pageNo"
                     :page-sizes="listReq.pageSizeArr"
                     :page-size="listReq.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.totalCount">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisiable" @close="roleFormCancel('roleForm')">
      <el-form class="small-space" label-position="right" label-width="150px"
               ref="roleForm" :model="roleAuthObj" :rules="commonRule">
        <el-form-item :label="$t('用户名')" prop="username" :rules="isAddMore ? memberInfoRule.accountNameMore : memberInfoRule.accountName" v-if="operateFlag === 1">
          <el-input :type="isAddMore ? 'textarea' : 'text'" v-model="roleAuthObj.username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="password" :rules="memberInfoRule.password" v-if="operateFlag === 1 && isAdd">
          <el-input type="password" v-model="roleAuthObj.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('到期时间')"   v-if="operateFlag === 1">
          <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="roleAuthObj.expireTime"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('角色')" prop="roleId" :rules="commonRule.changeNotNull" v-if="operateFlag === 1">
          <el-select v-model="roleAuthObj.roleId">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label="$t('真实姓名')" prop="realName" :rules="[{ required: true, message: $t('不能为空')}]" v-if="operateFlag === 1">
          <el-input v-model="roleAuthObj.realName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('安全密码')" prop="securepwd" :rules="commonRule.notNull" v-if="operateFlag === 1 && isAdd">
          <el-input type="password" v-model="roleAuthObj.securepwd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('邮箱')" prop="email" :rules="memberInfoRule.email" v-if="operateFlag === 1">
          <el-input v-model="roleAuthObj.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('手机号')" prop="mobile" :rules="memberInfoRule.mobileNoNeed" v-if="operateFlag === 1">
          <el-input v-model="roleAuthObj.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('分机号')" prop="telExtNo" :rules="memberInfoRule.telExtNo" v-if="operateFlag === 1">
          <el-input v-model="roleAuthObj.telExtNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('状态')" prop="status" :rules="commonRule.changeNotNull" v-if="operateFlag === 1">
          <el-select v-model="roleAuthObj.status">
            <el-option
              v-for="item in authStatus"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="会员组" prop="checkedGroupIds">
          <el-checkbox v-model="groupCheckAll" @change="handleGroupCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="roleAuthObj.checkedGroupIds" @change="handleGroupCheckedChange">
            <el-checkbox v-for="group in groupOptions" :label="group.id" :key="group.id">{{group.groupName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="总代理">
          <el-checkbox v-model="topAgyCheckAll" @change="handleTopAgyCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="roleAuthObj.checkedTopAgyIds" @change="handleTopAgyCheckChange">
            <el-checkbox v-for="agent in topAgyAccountOptions" :label="agent.id" :key="agent.id">
              {{agent.agyAccount}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="代理" v-model="roleAuthObj.treeCheckedIdList">
          <el-tree :data="agentTree" :accordion="true" :default-expand-all="false" show-checkbox node-key="id"
                   :default-checked-keys="roleAuthObj.treeCheckedIdList" ref="tree"
                   :props="defaultProps" @check-change="handleCheckedAgentChange"></el-tree>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormCancel('roleForm')">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveOrUpdate">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import systemConfig from '../../config/config'
  import queryStore from '../../mixins/queryStore'
  import { mapGetters } from 'vuex'
  import Mixin from '@/mixins/loadTime'


  export default {
    name: 'roleManage',
    mixins: [Mixin, queryStore(['q'])],
    data() {
      return {
        q: {status: [], roleName: [], username: ''},
        roles: [],
        roleAuthObj: {
          expireTime: '',
          checkedGroupIds: [],
          checkedTopAgyIds: [],
          treeCheckedIdList: [],
          mbrGroups: [],
          roleIdList: [],
          status: 1,
          roleId: '',
          userMbrGroupAuth: 1,
          userAgyAccountAuth: 1
        },
        operateFlag: 1, // 1  edit 2 数据权限
        dialogVisiable: false,
        dialogTitle: '',
        authStatus: [{id: 0, value: this.$t('禁用')}, {id: 1, value: this.$t('启用')}],
        groupCheckAll: false,
        topAgyCheckAll: false,
        isAddMore: false,
        groupOptions: [],
        tableData: {},
        commonRule: systemConfig.rules.commonRule,
        memberInfoRule: systemConfig.rules.memberInfoRule,
        agentTree: [],
        topAgyAccountOptions: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        isAdd: false,
        postData: [],
        isNowDowning: false,
        safePassword: "",
        tmpValue4SafeCheck: {},
      }
    },
    created() {
      this.getRoles()
      this.getData()
      this.getGroups()
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
      }
    },
    methods: {
      handleExport() {
        this.postData = []
        Object.keys(this.q).forEach(key => {
          if (this.q[key].length > 0) {
            if (Array.isArray(this.q[key])) {
              this.postData[key + 'List'] = this.q[key].join(',')
            } else {
              this.postData[key] = this.q[key]
            }
          } else {
            this.postData[key] = ''
            this.postData[key + 'List'] = ''
          }
        })
        let data = Object.assign({
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo
        }, this.postData)
        this.isNowDowning = true
        this.$axios
          .get(systemConfig.urls.exportUserList,{params:data})
          .then((res) => {
            let isDownBool = res.data.data;
            if (isDownBool) {
              this.$message({
                type: "warning",
                message: isDownBool,
              });
              this.isNowDowning = false
            } else {
              this.checkExportFile();
            }
          });
      },
      checkExportFile() {
        // 查看导出文件是否可下载
        this.$axios.get(systemConfig.urls.checkFileUserList,{params:{module:'EXPORT_USER_LIST_REPORT'}}).then((res) => {
          let obj = res.data.data || {};
          let fileName = obj.fileName,
            downloadFileName = obj.downloadFileName;
          if (fileName) {
            const { baseURL } = res.config;
            // 下载文件
            let SToken = localStorage.getItem("SToken");
            window.open(
              baseURL +
              `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isNowDowning = false
          } else {
            window.setTimeout(this.checkExportFile, 1000);
          }
        });
      },
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      modifyLoginPass(userId) {
        this.$store.commit('passChangeObj', {
          userId,
          operationTitle: this.$t('请进行登录密码修改'),
          operationFlag: 'changeLogin',
          closeVisiable: true,
          visiable: true
        })
        this.$store.commit('changePasswordShow', true)
        this.$store.commit('changePassFlag', 'fromButton')
      },
      modifySafePass(userId) {
        this.$store.commit('passChangeObj', {
          userId,
          operationTitle: this.$t('请进行安全密码修改'),
          operationFlag: 'changeSafe',
          closeVisiable: true,
          visiable: true
        })
        this.$store.commit('changePasswordShow', true)
      },
      // 表格状态删选
      filterTag(value, row) {
        return row.status === value
      },
      sortevt(orders) {
        if (orders.order === 'ascending') {
          this.q.orderBy = orders.prop + ' asc'
        } else {
          this.q.orderBy = orders.prop + ' desc'
        }
        this.getData()
      },
      timeFilter(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        return systemConfig.transferTimeByType(date, this.timeType)
      },
      handleSizeChange(val) {
        this.listReq.pageNo = 1
        this.listReq.pageSize = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.listReq.pageNo = val
        this.getData()
      },
      search() {
        this.getCurrentRecodeTime()
        this.listReq.pageNo = 1
        this.getData()
      },
      reset() {
        this.postData = []
        this.q = {status: [], roleName: [], username: ''}
      },
      // 增加
      add(isAddMore = false) {
        this.operateFlag = 1
        this.isAdd = true
        this.isAddMore = isAddMore
        if (isAddMore) {
          this.dialogTitle = this.$t('批量新增用户')
        } else {
          this.dialogTitle = this.$t('新增用户')
        }
        this.getAgentTree()
        this.getAgyAccount('')
        this.roleAuthObj.expireTime = systemConfig.getNextYear()[1]
        this.dialogVisiable = true
      },
      // 数据权限
      editData(row) {
        this.operateFlag = 2
        this.isAdd = false
        this.dialogVisiable = true
        this.dialogTitle = this.$t('数据权限设置')
        this.getAgentTree()
        this.getAgyAccount('')
        this.getDetail(row.userId)
      },
      // 编辑
      edit(row) {
        this.operateFlag = 1
        this.isAdd = false
        this.dialogVisiable = true
        this.dialogTitle = this.$t('编辑用户')
        this.getAgentTree()
        this.getAgyAccount('')
        this.getDetail(row.userId)
      },
      getDetail(id) {
        this.$axios.get('/bkapi/sys/user/info/' + id).then((resp) => {
          this.roleAuthObj = Object.assign(resp.data.user, {
            checkedGroupIds: [],
            checkedTopAgyIds: [],
            treeCheckedIdList: [],
            userMbrGroupAuth: 1,
            userAgyAccountAuth: 1
          })
          console.log(this.roleAuthObj)
          if (this.roleAuthObj.mbrGroups.length > 0) {
            this.roleAuthObj.mbrGroups.map((value) => {
              this.roleAuthObj.checkedGroupIds.push(value.mbrGroupId)
            })
          }
          let agyArr = []
          for (let j = 0; j < this.roleAuthObj.agyAccounts.length; j++) {
            // 获取次代
            if (this.roleAuthObj.agyAccounts[j].agyAccountType === 1) {
              agyArr.push(this.roleAuthObj.agyAccounts[j].agyAccountId)
            } else {
              this.roleAuthObj.checkedTopAgyIds.push(this.roleAuthObj.agyAccounts[j].agyAccountId)
            }
          }
          this.agySetTree(this.roleAuthObj.checkedTopAgyIds)
          let nodes = this.$refs.tree.getCheckedKeys()
          let newArr = nodes.concat(agyArr)
          this.$refs.tree.setCheckedKeys(newArr)
          this.groupCheckAll = this.roleAuthObj.checkedGroupIds.length === this.groupOptions.length
          this.topAgyCheckAll = this.roleAuthObj.checkedTopAgyIds.length === this.topAgyAccountOptions.length
        })
      },
      deleteRole(row) {
        this.$store.state.fullsceenLoading = true
        // 安全密码弹窗
        if (!this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck, "callback", this.deleteRole);
          this.$set(this.tmpValue4SafeCheck, "args", [row]);
          return;
        }
        this.$axios.post('/bkapi/sys/user/delete', {userId: row.userId},{ headers: { securepwd: this.safePassword } }).then((resp) => {
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          this.getData()
        })
      },
      getRoles() {
        this.$axios.get('/bkapi/sys/role/listAll').then((res) => {
          if (res.data.code === 0) {
            res.data.list.map((item) => {
              this.roles.push({roleName: item.roleName, roleId: item.roleId})
            })
          }
        })
      },
      toggleStatus(row) {
        this.$axios.post('/bkapi/sys/user/updateEnable', {
          userId: row.userId,
          status: row.status,
          roleId: row.roleId
        }).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('状态更新成功')
          })
        })
      },
      getAgyAccount(id) {
        this.$axios.get(systemConfig.urls.getAgyAccount + '?parentId=' + id).then((resp) => {
          if (!id) {
            this.topAgyAccountOptions = resp.data.accounts
          } else {
            this.agyAccountOptions = resp.data.accounts
          }
        })
      },
      // handleGroupCheckAllChange(val) {
      //   // 需要重新构造一个ids对比
      //   let ids = []
      //   this.groupOptions.map((item) => {
      //     ids.push(item.id)
      //   })
      //   this.roleAuthObj.checkedGroupIds = val ? ids : [];
      // },
      // handleGroupCheckedChange(val) {
      //   let checkedCount = this.roleAuthObj.checkedGroupIds.length;
      //   this.groupCheckAll = checkedCount === this.groupOptions.length;
      // },
      handleTopAgyCheckAllChange(val) {
        let ids = []
        this.groupOptions.map((item) => {
          ids.push(item.id)
        })
        this.roleAuthObj.checkedGroupIds = val ? ids : [];
      },
      // 总代的全选事件
      handleTopAgyCheckAllChange(val) {
        let ids = []
        this.topAgyAccountOptions.map((value) => {
          ids.push(value.id)
        })
        this.roleAuthObj.checkedTopAgyIds = val ? ids : [];
        this.agySetTree(this.roleAuthObj.checkedTopAgyIds)
      },
      // handleTopAgyCheckChange(val) {
      //   let checkedCount = this.roleAuthObj.checkedTopAgyIds.length;
      //   this.topAgyCheckAll = checkedCount === this.topAgyAccountOptions.length;
      //   this.agySetTree(this.roleAuthObj.checkedTopAgyIds)
      // },
      // 总代设置代理树事件
      agySetTree(ids) {
        let nodes = this.$refs.tree.getCheckedNodes()
        if (nodes.length > 0) {
          for (let j = 0; j < nodes.length; j++) {
            nodes[j].disabled = false
          }
          this.$refs.tree.setCheckedNodes([])
        }
        // 通过key设置disabled
        if (ids.length > 0) {
          let tempArr = []
          for (let i = 0; i < ids.length; i++) {
            tempArr.push(ids[i])
          }
          this.$refs.tree.setCheckedKeys(tempArr)
        }
        let nodes2 = this.$refs.tree.getCheckedNodes()
        if (nodes2.length > 0) {
          for (let k = 0; k < nodes2.length; k++) {
            nodes2[k].disabled = true
          }
        }
      },
      // 代理树的事件
      // handleCheckedAgentChange(value) {
      //   this.roleAuthObj.treeCheckedIdList = this.$refs.tree.getCheckedNodes()
      // },
      getAgentTree() {
        this.$axios.get('bkapi/agent/account/selectAgentTree').then((resp) => {
          this.agentTree = resp.data.agentTree
        })
      },
      getData() {
        this.$store.state.searchLoading = true
        this.postData = []
        Object.keys(this.q).forEach(key => {
          if (this.q[key].length > 0) {
            if (Array.isArray(this.q[key])) {
              this.postData[key + 'List'] = this.q[key].join(',')
            } else {
              this.postData[key] = this.q[key]
            }
          } else {
            this.postData[key] = ''
            this.postData[key + 'List'] = ''
          }
        })
        let data = Object.assign({
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo
        }, this.postData)
        this.$axios.get('/bkapi/sys/user/queryConditions', {
          params: data
        }).then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = res.data.page
        })
      },
      getGroups() {
        this.$axios.get('bkapi/member/mbrgroup/findGroupAllNoAuth').then((resp) => {
          this.groupOptions = resp.data.page
        })
      },
      roleFormCancel(formName) {
        this.dialogVisiable = false
        this.roleAuthObj = {
          expireTime: systemConfig.getNextYear()[1],
          checkedGroupIds: [],
          checkedTopAgyIds: [],
          treeCheckedIdList: [],
          mbrGroups: [],
          roleIdList: [],
          status: 1
        }
        this.resetForm(formName)
        this.topAgyCheckAll = false
        this.groupCheckAll = false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      saveOrUpdate() {
        this.$refs.roleForm.validate(valid => {
              if (valid) {
                if (!this.roleAuthObj.expireTime) {
                  this.$message({
                    type: 'warning',
                    message: this.$t('请选择过期时间')
                  })
                  return
                }
                let tempArr = []
                this.$store.state.fullsceenLoading = true
                // for (let p = 0; p < this.roleAuthObj.treeCheckedIdList.length; p++) {
                //   if (this.roleAuthObj.treeCheckedIdList[p].disabled === false) {
                //     tempArr.push({
                //       'agyAccountId': this.roleAuthObj.treeCheckedIdList[p].id,
                //       'agyAccountType': 1,
                //       'disabled': false
                //     })
                //   }
                // }
                // if (this.roleAuthObj.checkedTopAgyIds.length > 0) {
                //   for (let k = 0; k < this.roleAuthObj.checkedTopAgyIds.length; k++) {
                //     tempArr.push({
                //       'agyAccountId': this.roleAuthObj.checkedTopAgyIds[k],
                //       'agyAccountType': 0,
                //       'disabled': true
                //     })
                //   }
                // }
                // this.roleAuthObj.agyAccounts = tempArr
                this.roleAuthObj.mbrGroups = []
                this.roleAuthObj.checkedGroupIds.map((value) => {
                  this.roleAuthObj.mbrGroups.push({mbrGroupId: value})
                })
                if (this.groupCheckAll) {
                  this.roleAuthObj.userMbrGroupAuth = 1
                } else {
                  this.roleAuthObj.userMbrGroupAuth = 2
                }
                if (this.topAgyCheckAll) {
                  this.roleAuthObj.userAgyAccountAuth = 1
                } else {
                  this.roleAuthObj.userAgyAccountAuth = 2
                }
                this.roleAuthObj.roleIdList = []
                this.roleAuthObj.roleIdList.push(this.roleAuthObj.roleId)
                systemConfig.filterArr(this.roleAuthObj.roleIdList)
                this.$axios.post(this.roleAuthObj.userId ? '/bkapi/sys/user/update' : '/bkapi/sys/user/save', this.roleAuthObj).then((res) => {
                  if (this.roleAuthObj.userId) {
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
                  this.getData()
                  this.roleFormCancel('roleForm')
                  this.groupCheckAll = false
                  this.topAgyCheckAll = false
                })
              }
            })
        // if (this.roleAuthObj.treeCheckedIdList.length > 0) {
        //   if (this.roleAuthObj.checkedGroupIds.length > 0) {
        //     this.$refs.roleForm.validate(valid => {
        //       if (valid) {
        //         if (!this.roleAuthObj.expireTime) {
        //           this.$message({
        //             type: 'warning',
        //             message: '请选择过期时间'
        //           })
        //           return
        //         }
        //         let tempArr = []
        //         this.$store.state.fullsceenLoading = true
        //         // for (let p = 0; p < this.roleAuthObj.treeCheckedIdList.length; p++) {
        //         //   if (this.roleAuthObj.treeCheckedIdList[p].disabled === false) {
        //         //     tempArr.push({
        //         //       'agyAccountId': this.roleAuthObj.treeCheckedIdList[p].id,
        //         //       'agyAccountType': 1,
        //         //       'disabled': false
        //         //     })
        //         //   }
        //         // }
        //         // if (this.roleAuthObj.checkedTopAgyIds.length > 0) {
        //         //   for (let k = 0; k < this.roleAuthObj.checkedTopAgyIds.length; k++) {
        //         //     tempArr.push({
        //         //       'agyAccountId': this.roleAuthObj.checkedTopAgyIds[k],
        //         //       'agyAccountType': 0,
        //         //       'disabled': true
        //         //     })
        //         //   }
        //         // }
        //         // this.roleAuthObj.agyAccounts = tempArr
        //         this.roleAuthObj.mbrGroups = []
        //         this.roleAuthObj.checkedGroupIds.map((value) => {
        //           this.roleAuthObj.mbrGroups.push({mbrGroupId: value})
        //         })
        //         if (this.groupCheckAll) {
        //           this.roleAuthObj.userMbrGroupAuth = 1
        //         } else {
        //           this.roleAuthObj.userMbrGroupAuth = 2
        //         }
        //         // if (this.topAgyCheckAll) {
        //         //   this.roleAuthObj.userAgyAccountAuth = 1
        //         // } else {
        //         //   this.roleAuthObj.userAgyAccountAuth = 2
        //         // }
        //         this.roleAuthObj.roleIdList = []
        //         this.roleAuthObj.roleIdList.push(this.roleAuthObj.roleId)
        //         systemConfig.filterArr(this.roleAuthObj.roleIdList)
        //         this.$axios.post(this.roleAuthObj.userId ? '/bkapi/sys/user/update' : '/bkapi/sys/user/save', this.roleAuthObj).then((res) => {
        //           if (this.roleAuthObj.userId) {
        //             this.$message({
        //               type: 'success',
        //               message: '更新成功'
        //             })
        //           } else {
        //             this.$message({
        //               type: 'success',
        //               message: '保存成功'
        //             })
        //           }
        //           this.getData()
        //           this.roleFormCancel('roleForm')
        //           this.groupCheckAll = false
        //           this.topAgyCheckAll = false
        //         })
        //       }
        //     })
        //   } else {
        //     this.$message({
        //       type: 'warning',
        //       message: '请至少选择一个会员组'
        //     })
        //   }
        // } else {
        //   this.$message({
        //     type: 'warning',
        //     message: '至少选择一个代理'
        //   })
        // }
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
<style>

</style>
