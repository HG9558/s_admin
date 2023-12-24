<template>
  <div class="claassify-manage">
    <el-button type="text" size="small" @click.native="openClassifyTable">[{{ $t('分类管理') }}]</el-button>
    <div class="claassify-manage-table" v-show="classifyShow">
      <div class="table-header">$t('分类管理')<span class="iconfont icon-close" @click="close"></span></div>
      <div class="table-add">
        <label for="">{{ $t('分类名称') }}</label><input class="border" type="text" v-model="newClassify">
        <label for="">{{ $t('备注') }}</label><input class="border" type="text" v-model="newMemo">
        <el-button type="primary" size="small" @click.native="add">{{ $t('增加') }}</el-button>
      </div>
      <div class="table-edit" v-show="isEdit">
        <label for="">{{ $t('分类名称') }}</label><input class="border" type="text" v-model="editClassify">
        <label for="">{{ $t('备注') }}</label><input class="border" type="text" v-model="editMemo">
        <el-button type="primary" size="small" @click.native="updateName">{{ $t('保存') }}</el-button>
      </div>
      <div style="padding: 0px 20px 40px 20px;">
        <el-table max-height="480" :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column label-class-name="heightThe"
                          :label="$t('序号')"
                          type="index"
                          :index="indexMethod">
          </el-table-column>
          <el-table-column label-class-name="heightThe"
                          :label="$t('分类名称')"
                          prop="catName">
          </el-table-column>
          <el-table-column label-class-name="heightThe" :label="$t('是否启用')">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.available" active-color="#13ce66" inactive-color="#ff4949"
                        @change="updateAvailable(scope.row)"
                        :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label-class-name="heightThe" :label="$t('备注')" prop="catMemo"></el-table-column>
          <el-table-column label-class-name="heightThe" :label="$t('操作')" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="edit(scope.row)">[{{ $t('编辑') }}]</el-button>
              <el-button type="text" size="small" @click.native="deleteOne(scope.row)">[{{ $t('删除') }}]</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="margin-right: 10px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            popper-class="activity-classify-pagination"
            :current-page="listReq.pageNo"
            :page-sizes="listReq.pageSizeArr"
            :page-size="listReq.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- <div style="text-align: right;margin-top: 40px;padding-right: 20px;margin-bottom: 20px">
        <el-button type="primary" @click.native="classifyShow = false">关闭</el-button>
      </div> -->
    </div>
    <Overlay v-show="classifyShow"></Overlay>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'
  import Overlay from '../../components/Overlay.vue'

  export default {
    data() {
      return {
        tableData: [],
        total: 0,
        editClassify: '',
        editMemo: '',
        newClassify: '',
        newMemo: '',
        isEdit: false,
        eidtRow: {},
        classifyShow: false
      }
    },
    created() {
      this.getData()
    },
    components: {
      Overlay
    },
    computed: {
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      loading() {
        return this.$store.state.searchLoading
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      deleteOne(row) {
        let deleteData = {'id': row.id}
        this.$axios.post(systemConfig.urls.deleteClassify, deleteData).then((resp) => {
          this.getData()
        })
      },
      edit(row) {
        this.isEdit = true
        this.eidtRow = row
        this.editClassify = row.catName
        this.editMemo = row.catMemo
      },
      close() {
        this.classifyShow = false
      },
      openClassifyTable() {
        this.classifyShow = true
        this.getData()
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
      // 改状态  或者改名称和备注
      updateName() {
        if (!this.editClassify) {
          this.$notify({
            title: this.$t('温馨提示'),
            message: this.$t('活动分类不能为空'),
            position: 'top-right'
          })
          return
        }
        if (!this.editMemo) {
          this.$notify({
            title: this.$t('温馨提示'),
            message: this.$t('备注不能为空'),
            position: 'top-right'
          })
          return
        }
        let updateData = {'catMemo': this.editMemo, 'catName': this.editClassify, 'id': this.eidtRow.id}
        this.$axios.post(systemConfig.urls.changeClassify, updateData).then((resp) => {
          this.isEdit = false
          this.editClassify = ''
          this.editMemo = ''
          this.getData()
        })
      },
      updateAvailable(row) {
        let updateData = {'id': row.id, 'available': row.available}
        this.$axios.post(systemConfig.urls.changeClassify, updateData).then((resp) => {
          if (!this.editMemo) {
            this.$notify({
              title: this.$t('温馨提示'),
              message: this.$t('状态修改成功'),
              position: 'top-right'
            })
          }
        })
      },
      add() {
        if (!this.newClassify) {
          this.$notify({
            title: this.$t('温馨提示'),
            message: this.$t('活动分类不能为空'),
            position: 'top-right'
          })
          return
        }
        if (!this.newMemo) {
          this.$notify({
            title: this.$t('温馨提示'),
            message: this.$t('备注不能为空'),
            position: 'top-right'
          })
          return
        }
        let addData = {'available': 1, 'catMemo': this.newMemo, 'catName': this.newClassify}
        this.$axios.post(systemConfig.urls.addClassifyValid, addData).then((resp) => {
          this.newClassify = ''
          this.newMemo = ''
          this.getData()
        })
      },
      getActivityCategory() {
        this.$axios.get(systemConfig.urls.getActivityCategory).then((resp) => {
          this.$store.commit('categoryOptions', resp.data.page)
        })
      },
      getData() {
        this.$store.state.searchLoading = true
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo
        this.$axios.get(systemConfig.urls.getClassifyList + url).then((resp) => {
          this.tableData = resp.data.page.list
          this.total = resp.data.page.totalCount
          this.getActivityCategory()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .claassify-manage {
    display: inline-block
  }

  /*设置表头*/
  .heightThe {
    height: 28px;
    line-height: 28px !important;
    font-family: '微软雅黑';
    font-weight: bold;
    text-align: left;
    color: #333333;
    background: #f6f7f8;
    .el-table__column-filter-trigger {
      line-height: 28px;
    }
  }

  .claassify-manage-table {
    position: fixed;
    width: 600px;
    height: auto;
    background: #fff;
    /*padding:10px;*/
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3501;
    .table-header {
      color: white;
      padding: 0 10px;
      background-color: #447ed9;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      position: relative;
      .icon-close {
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
    .table-add, .table-edit {
      text-align: center;
      padding: 10px;
      background: #fff;
      input {
        width: 140px !important;
      }
      label {
        width: 60px !important;
      }
      button {
        margin-left: 10px;
      }
    }
  }

  .border {
    border: 1px solid rgb(211, 211, 211);
    line-height: 28px;
    border-radius: 4px;
    padding-left: 10px;
  }
</style>


