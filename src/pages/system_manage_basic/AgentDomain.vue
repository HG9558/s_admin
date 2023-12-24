<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <el-form :inline="true" :model="q" class="demo-form-inline query" label-position="top">
      <el-form-item :label="$t('代理账号')">
        <el-input v-model="q.agyAccount" :placeholder="$t('代理账号')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('名称')">
        <el-input v-model="q.name" :placeholder="$t('名称')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('域名')">
        <el-input v-model="q.url" :placeholder="$t('域名')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('状态')">
        <el-select v-model="q.state" >
          <el-option :label="$t('审批中')" value="1"></el-option>
          <el-option :label="$t('绑定')" value="2"></el-option>
          <el-option :label="$t('解绑')" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn-serch">
        <el-button type="primary" @click="query">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click="reload">{{ $t('重置') }}</el-button>
      </el-form-item>
    </el-form>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button class="filter-item" @click="add" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-plus">{{ $t('新增') }}</el-button>
      <el-button v-show="showdels" class="filter-item" size="mini" type="primary" icon="el-icon-delete" @click="deleteagent">{{ $t('删除') }}</el-button>
      <!-- <el-button class="filter-item" size="mini" icon="el-icon-upload2" @click="handleDownload">导出</el-button> -->
    </el-row>
    <el-table max-height="480" type="flex" :data="tableData.list"  @select-all="showdelids" @select="showdelids" w-loading='loading' border fit highlight-current-row>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="60" :label="$t('序号')" :index="indexMethod"></el-table-column>
      <el-table-column prop="agyAccount"  :label="$t('代理账号')" width="150"></el-table-column>
      <el-table-column prop="name"  :label="$t('名称')" width="100"></el-table-column>
      <el-table-column prop="sum"  :label="$t('注册会员数')" width="100"></el-table-column>
      <el-table-column prop="url" :label="$t('域名')" ></el-table-column>
      <el-table-column prop="state" :label="$t('状态')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state == 1 ? 'warning' : scope.row.state == 2 ? 'danger':'success'" v-text="scope.row.state == 1 ? $t('审批中') : scope.row.state == 2 ? $t('绑定') : $t('解绑') ">
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bind" :label="$t('是否绑定')" width="100">
        <template slot-scope="scope">
          <el-switch v-model= "scope.row.bind" :disabled="scope.row.isDef === 0" active-color="#13ce66" inactive-color="#ff4949" @change="togglebind(scope.row)"
                     :inactive-value = '0' :active-value = '1'>
          </el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column prop="createTime" sortable label="创建时间"></el-table-column>-->
      <!--<el-table-column prop="modifyTime" sortable label="修改时间" ></el-table-column>-->
      <el-table-column :label="$t('操作')" width="250" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop.prevent="update(scope.row)">[{{ $t('编辑') }}]</el-button>
          <el-button type="text" size="small" @click.capture="deleteagent(scope.row)">[{{ $t('删除') }}]</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block"  style="text-align:right">
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr"
                      :page-size="listReq.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.totalCount">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="editeFormVisible">
      <el-form class="small-space" label-position="right" label-width="150px">
        <from-wrapper :width="600">
          <el-form-item :label="$t('代理账号')">
            <el-select v-model="agencyDomain.agencyId" :placeholder="$t('代理账号')">
              <el-option v-for="item in agyAccounts" :label='item.text' :key="item.value" :value='item.value'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('名称')" :rules="[{ required: true, message: $t('不能为空')}]">
            <el-input v-model="agencyDomain.name" :placeholder="$t('名称')" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('域名')">
            <el-input  :placeholder="$t('域名路径')" v-model="agencyDomain.url"><template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
        </from-wrapper>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editeFormVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveOrUpdate" >{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import FromWrapper from '../../components/FromWrapper.vue'
  import systemConfig from '../../config/config'
  export default {
    components: {FromWrapper},
    data () {
      return {
        q: {},
        tableData: {},
        selectids: [],
        showdels: false,
        dialogTitle: '',
        editeFormVisible: false,
        agencyDomain: {},
        agyAccounts: []
      }
    },
    created () {
      this.reload()
      this.getagyAccounts()
      this.getList()
    },
    computed: {
      loading () {
        return this.$store.state.searchLoading
      },
      listReq () {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      fullscreenLoading () {
        return this.$store.state.fullscreenLoading
      }
    },
    methods: {
      indexMethod (index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      handleDownload () {
        require([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [this.$t('代理账号'), this.$t('名称'), this.$t('注册会员数'), this.$t('域名'), this.$t('状态')]
          const filterVal = ['agyAccount', 'name', 'sum', 'url', 'state']
          const data = this.tableData.list.map(item => filterVal.map(i => item[i]))
          export_json_to_excel(tHeader, data, this.$t('代理域名'))
        })
      },
      getagyAccounts () {
        this.$axios.get(systemConfig.urls.systemAgencyQuery).then((res) => {
          res.data.list.map((item) => this.agyAccounts.push({text: item.agyAccount, value: item.id}))
        })
      },
      handleSizeChange (val) {
        this.listReq.pageSize = val
        this.listReq.pageNo = 1
        this.getList()
      },
      handleCurrentChange (val) {
        this.listReq.pageNo = val
        this.getList()
      },
      togglebind (row) {
        this.$axios.post(systemConfig.urls.systemAgencyUpdate, {bind: row.bind, id: row.id}).then((resp) => {
          this.$message({
            type: 'success',
            message: this.$t('成功')
          })
        })
      },
      showdelids (sel) {
        this.showdels = []
        if (sel.length > 0) {
          this.showdels = true
          sel.map((item) => {
            this.selectids.push(item.id)
          })
        } else {
          this.showdels = false
        }
      },
      deleteagent (row) {
        let ids = []
        if (row.id) {
          ids[0] = row.id
        } else {
          ids = this.selectids
        }
        this.$store.state.fullscreenLoading = true
        this.$axios.post(systemConfig.urls.systemAgencyDelete, {agencyIds: ids}).then((resp) => {
          this.$message({
            type: 'success',
            message: this.$t('成功')
          })
          this.getList()
        })
      },
      saveOrUpdate () {
        this.$store.state.fullscreenLoading = true
        this.$axios.post(this.agencyDomain.id ? systemConfig.urls.systemAgencyUpdate
          : systemConfig.urls.systemAgencySave, this.agencyDomain).then((resp) => {
            this.$message({
              type: 'success',
              message: this.$t('成功')
            })
            this.getList()
            this.editeFormVisible = false
          })
      },
      add () {
        this.dialogTitle = this.$t('新增代理域名')
        this.agencyDomain = {}
        this.editeFormVisible = true
        let bind = 2
        let state = 1
        this.agencyDomain = {bind, state}
      },
      update (row) {
        this.dialogTitle = this.$t('编辑代理域名')
        this.agencyDomain = row
        this.editeFormVisible = true
      },
      query () {
        this.listReq.pageNo = 1
        this.getList()
      },
      reload () {
        this.q = {}
      },
      getList () {
        let data = Object.assign({
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo
        }, this.q)
        this.$store.state.searchLoading = true
        this.$axios.get(systemConfig.urls.systemAgencyListPage, {
          params: data
        }).then((res) => {
          this.tableData = res.data.page
        })
      }
    }
  }
</script>
<style>
</style>
