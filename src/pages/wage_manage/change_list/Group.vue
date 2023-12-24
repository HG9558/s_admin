<template>
  <div>
    <!-- 渠道分组 -->
    <TableSearchBar
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
    >
      <StartAndEndTimeSelector slot="operateTime" :selections="(searchCriteria.meta.find(i => i.slotName === 'operateTime') || {}).options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime"></StartAndEndTimeSelector>
    </TableSearchBar>
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :table-loading="loading"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="params.pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="params.pageNo"
      @reloadData="getTableData"
      :showLoadTime="true"
	    :networkLoadTime="networkLoadTime"
	    :dataSolveTime="dataSolveTime"
    >
      <el-button type="primary" @click="handleAdd">{{ $t('新增分组') }}</el-button>
    </TableCom>
    <el-dialog :title="title" :visible.sync="showGroup">
      <el-form ref="formData" label-width="120px" :model="formData">
        <el-form-item :label="$t('分组名称')" prop="name" :rules="[{ required: true, message: $t('请输入分组名称'), trigger: 'blur' }]">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('保存') }}</el-button>
        <el-button @click="showGroup = false">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('删除分组')" :visible.sync="showDel" width="350px !important">
      <div class="center">{{ $t('是否确定删除？') }}</div>
      <div slot="footer">
        <el-button type="primary" @click="handleDelSubmit" :loading="submitLoading">{{ $t('删除') }}</el-button>
        <el-button @click="showDel = false">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Mixin from '@/mixins/loadTime'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'

export default {
  mixins: [Mixin],
  name: "Group",
  components: { StartAndEndTimeSelector },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      searchCriteria: {
        keys: {
          name: null,
          startTime: null,
          endTime: null
        },
        meta: [
          { type: 'text',  label: this.$t('分组名称'),  prop: 'name' },
          { slotName: 'operateTime',  label: this.$t('操作时间'), options: [
              {
                label: this.$t("今日"),
                value: "today",
              },
              {
                label: this.$t("昨日"),
                value: "yesterday",
              },
              {
                label: this.$t("本周"),
                value: "currentWeek",
              },
              {
                label: this.$t("上周"),
                value: "lastWeek",
              },
            ] },
        ]
      },
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 80 },
        { label: this.$t('分组名称'), prop: 'name' },
        { label: this.$t('操作时间'), prop: 'updateTime' },
        { label: this.$t('操作人'), prop: 'udapyeBy' },
        { label: this.$t('操作'), render: (h, row) => h('span', [
            h('span', { class: 'blue-color pointer', on: { click: () => this.handleEdit(row) } }, this.$t('编辑')),
            h('span', { class: 'blue-color pointer', on: { click: () => this.handleDel(row) } }, this.$t('删除'))
          ]) },
      ],
      formData: {
        name: null
      },
      delId: null,
      tableData: [],
      loading: false,
      submitLoading: false,
      showGroup: false,
      showDel: false,
      totalCount: 0,
      title: ''
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.getCurrentRecodeTime()
      const params = {
        ...this.params,
        ...this.searchCriteria.keys
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.channel.channelgroup, params)
      const {res,response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        const { totalCount, list } = res.page
        this.totalCount = totalCount
        this.tableData = list
      }
    },
    handleDel(row) {
      this.showDel = true
      this.delId = row.id
    },
    async handleDelSubmit() {
      this.submitLoading = true
      const { res } = await this.$axios.POST(this.$urls.channel.channelgroupDel, { id: this.delId })
      this.submitLoading = false
      if (res) {
        this.delId = null
        this.showDel = false
        this.$message.success(this.$t('删除成功'))
        this.getTableData()
      }
    },
    handleEdit(row) {
      this.title = this.$t('编辑分组')
      this.formData = { id: row.id, name: row.name }
      this.showGroup = true
    },
    handleSubmit() {
      const submit = async () => {
        const data = {
          ...this.formData
        }
        this.submitLoading = true
        const { res } = await this.$axios.POST(this.$urls.channel[data.id ? 'channelgroupUpdate' : 'channelgroupSave'], data)
        this.submitLoading = false
        if (res) {
          this.showGroup = false
          this.$message.success(this.$t('操作成功'))
          this.getTableData()
        }
      }
      this.$refs.formData.validate(isOk => isOk && submit())
    },
    handleAdd() {
      this.title = this.$t('新增分组')
      this.formData = { name: null }
      this.showGroup = true
    }
  }
}
</script>

<style scoped lang="scss">

</style>
