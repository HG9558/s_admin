<template>
  <div>
    <div class="border">
      <h1>{{TitleHeade}}</h1>
      <span class="el-icon-error new-right" @click="back">
       </span>
    </div>
    <div class="border">
      <div class="new-center">
        <el-form ref="form" :inline="true" :model="form" :label-position="labelPosition" :rules="commonRule">
          <el-form-item :label="$t('角色名称')" prop="roleName" :rules="commonRule.notNull">
            <el-input v-model="form.roleName" style="width: 370px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="复制权限组:" class="wid-half">
            <el-select v-model="form.selectVal" placeholder="请选择角色" @change="getMenuId">
              <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName"
                         :value="item.roleId"></el-option>
            </el-select>
          </el-form-item> -->
          <!--<el-form-item label="显示名称：" prop="roleNickName" :rules="commonRule.notNull">-->
          <!--<el-input v-model="form.roleNickName"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('角色描述')" prop="remark" :rules="commonRule.notNull">
            <el-input v-model="form.remark" style="width: 370px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--<hr class="wid-70">-->
      <role @ePushData="saveData" :editId="editId"></role>
      <div class="new-submit">
        <el-button type="primary" @click="onSubmit">{{subTitle}}</el-button>
        <el-button @click="back">{{ $t('取消') }}</el-button>
      </div>
    </div>


  </div>
</template>

<script>
  //import Role from '../common/ForEditOrAddAccessSet'
  import Role from '../../components/treeForEditOrAddAccessSet'
  import systemConfig from '../../config/config'

  export default {
    name: "RoleAuthAdd",
    data() {
      return {
        editId: '',
        state: '',
        TitleHeade: this.$t('新增角色'),
        subTitle: this.$t('立即创建'),
        roles: [],
        roleData: '',
        labelPosition: 'right',
        form: {
          selectVal: '',
          roleName: '',
          roleNickName: '',
          remark: ''
        },
        cData: '',
        commonRule: systemConfig.rules.commonRule
      }
    },
    components: {
      Role
    },
    created() {
      // this.getTreesOperation()

      this.getRoles()

      /*判断新增还是编辑*/
      this.TitleHeade = this.$route.query.state ? this.$t('编辑角色') : this.$t('新增角色')
      this.subTitle = this.$route.query.state ? this.$t('保存') : this.$t('立即创建')

      this.editId = this.$route.query.id
      /*编辑页面传值给表单*/
      this.form.roleName = this.$route.query.roleName
      this.form.roleNickName = this.$route.query.roleNickName
      this.form.remark = this.$route.query.remark

    },
    methods: {
      saveData(val) {
        console.log(val)
        this.cData = val
      },
      getMenuId(val) {
        this.$axios.get(systemConfig.urls.getRoleMenu + '?roleId=' + val).then((resp) => {
          let arr = []
          resp.data.roleMenus.map((item) => {
            if (item.isTotalChecked) {
              arr.push(item.menuId)
            }
          })
          // resp.data.roleMenuAuth.map((item) => {
          //   if (item.isTotalChecked) {
          //     this.tempAllIds.push(item.menuId)
          //   }
          // })
          // this.$refs.tree.setCheckedKeys(arr)
        })
      },
      getRoles() {
        this.$axios.get(systemConfig.urls.sysRoleListAll).then((res) => {
          this.roles = res.data.list
        })
      },
      getTreesOperation() {
        this.$axios.get(systemConfig.urls.treeList).then((res) => {
          let arr = res.data.data
          this.roleData = arr
        })
      },
      onSubmit() {
        this.$refs.form.validate(valid=>{
          if(valid){
            var tempIdArr = [];
            var tempObjArr = [];
            //  old
            /* var a = this.cData
            /*解决线上bug --- 数据完整性*/
            /* var nArr = []
            for (var i = 0; i < a.length; i++) {
              if (a[i].isChecked) {
                nArr.push({
                  // isTotalChecked: true,
                  menuId: a[i].menuId ? a[i].menuId : a[i].id,
                  // roleId: neeData[i].roleId
                })
              }

            }*/

            //  new
            let nArr=this.cData;
            console.log(nArr)
            if (nArr.length == 0) {
              this.$message({
                type: 'warning',
                message: this.$t('请勾选模块权限')
              })
              return
            }
            let url = systemConfig.urls.saveRoleMenu
            let obj = {
              sysRole: {
                roleName: this.form.roleName,
                roleNickName: this.form.roleNickName,
                remark: this.form.remark,
                roleId: this.editId > 0 ? this.editId : ''
              },
              sysRoleMenuEntities: nArr
            }

            this.$axios.post(url, obj).then((res) => {
              if (this.editId > 0) {
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
              this.$router.go(-1)
            })

          }
        })

      },
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

  .wid-half {
    /* old */
    /* width: 40%;
    display: inline-block;
    margin-right: 20px; */

    /* new */
    display:block;
  }

  .new-submit {
    clear: both;
    width: 200px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    position: relative;
    top: 10px;
  }

  .wid-70 {
    width: 70%;
  }

  .new-right {
    font-size: 25px;
    margin-left: 90%;
  }

  .new-center {
    /* old */
    /* margin-top: 20px;
    width: 50%;
    margin-left: 25%; */

    /* new */
    width: 66%;
    margin:20px auto;
  }

  h1 {
    display: inline-block;
    margin-left: 20px !important;
    font-size: 25px;
    line-height: 40px;
    height: 40px;
  }

  .border {
    border: 1px solid #eee;
    text-align: left;
  }
</style>
