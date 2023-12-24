<template>
  <div class="manage-box">
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
      <el-table-column align="center" :label="$t('推广链接')" width="200" slot="channelPromotionUrl">
        <template slot-scope="scope">
          {{ scope.row.channelPromotionUrl }}
          <CopyButton :copyContent="scope.row.channelPromotionUrl"></CopyButton>
        </template>
      </el-table-column>
      <el-button type="primary" @click="handleAdd">{{ $t('新增渠道') }}</el-button>
    </TableCom>
    <el-dialog :title="title" :visible.sync="showManage">
      <el-form ref="formData" label-width="120px" :model="formData" :rules="formDataRules">
        <el-form-item :label="$t('渠道编号')" prop="masterNum">
          <el-input class="input-w" v-model="formData.masterNum"></el-input>
          <span>({{ $t('唯一性：不能与其他渠道重复') }})</span>
        </el-form-item>
        <el-form-item :label="$t('渠道附号')" prop="viceNum">
          <el-input class="input-w" v-model="formData.viceNum"></el-input>
          <span>({{ $t('唯一性：不能与其他渠道重复') }})</span>
        </el-form-item>
        <el-form-item :label="$t('渠道名称')" prop="name">
          <el-input class="input-w" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('渠道分组')" prop="groupId">
          <el-select v-model="formData.groupId" placeholder="请选择" class="input-w">
            <el-option v-for="(item, i) in groupList" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('扣量比例')" prop="deductRate">
          <el-input class="input-w" v-model="formData.deductRate">
            <span slot="suffix">%</span>
          </el-input>
          <span>({{ $t('扣量比例0%~100%，不能输入小数') }})</span>
        </el-form-item>
        <el-form-item :label="$t('渠道描述')" prop="remark">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('状态')" prop="isOpen">
          <el-switch v-model="formData.isOpen" :active-text="$t('启用')" :inactive-text="$t('禁用')" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('保存') }}</el-button>
        <el-button @click="showManage = false">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('删除渠道')" :visible.sync="showDel" width="350px !important">
      <div class="center">{{ $t('是否确定删除？') }}</div>
      <div slot="footer">
        <el-button type="primary" @click="handleDelSubmit" :loading="submitLoading">{{ $t('删除') }}</el-button>
        <el-button @click="showDel = false">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import CopyButton from "../../../components/CopyButton"
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "Manage",
  components: { StartAndEndTimeSelector, CopyButton },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNo: 1
      },
      searchCriteria: {
        keys: {
          masterNum: null,
          name: null,
          groupId: null,
          isOpen: null,
          startTime: null,
          endTime: null
        },
        meta: [
          { type: 'text',  label: this.$t('渠道编号'),  prop: 'masterNum' },
          { type: 'text',  label: this.$t('渠道名称'),  prop: 'name' },
          { type: 'select',  label: this.$t('渠道分组'),  prop: 'groupId', options: [] },
          { type: 'select',  label: this.$t('状态'),  prop: 'isOpen', options: [{ label: this.$t('全部'), value: null }, { label: this.$t('启用'), value: true }, { label: this.$t('禁用'), value: false }] },
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
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 50 },
        { label: this.$t('渠道编号'), prop: 'masterNum' },
        { label: this.$t('渠道名称'), prop: 'name' },
        { label: this.$t('渠道附号'), prop: 'viceNum' },
        { label: this.$t('渠道分组'), render: (h, row) => {
          const { groupId } = row
          const obj = this.groupList.find(i => i.id === groupId)
          return h('span', obj.name)
        } },
        { label: this.$t('扣量比例'), prop: 'deductRate' },
        // { label: '推广链接', prop: 'channelPromotionUrl', width: 180 },
        { slotName: 'channelPromotionUrl' },
        { label: this.$t('状态'), render: (h, row) => h('span', { class: row.isOpen ? 'green' : 'red' }, row.isOpen ? this.$t('启用') : this.$t('禁用')) },
        { label: this.$t('操作时间'), prop: 'updateTime' },
        { label: this.$t('操作人'), prop: 'udapyeBy' },
        { label: this.$t('操作'), render: (h, row) => h('span', [
          h('span', { class: 'blue-color pointer', on: { click: () => this.handleEdit(row) } }, this.$t('编辑')),
          h('span', { class: 'blue-color pointer', on: { click: () => this.handleDel(row) } }, this.$t('删除'))
        ]) },
      ],
      tableData: [],
      groupList: [],
      formData: {},
      title: '',
      delId: null,
      loading: false,
      submitLoading: false,
      showManage: false,
      showDel: false,
      totalCount: 0,
    }
  },
  created() {
    this.getGroup()
    this.getTableData()
  },
  computed: {
    formDataRules() {
      const validateDeductRate = (rule, value, callback) => {
        const num = value * 1
        if (/[^0-9]/g.test(value) || (num < 0 || num > 100)) return callback('请输入0-100的整数')
        callback()
      }
      return {
        masterNum: [{ required: true, message: this.$t('请输入渠道编号'), trigger: 'blur' }],
        viceNum: [{ required: true, message: this.$t('请输入渠道附号'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入渠道名称'), trigger: 'blur' }],
        groupId: [{ required: true, message: this.$t('请选择渠道分组'), trigger: 'blur' }],
        deductRate: [
          { required: true, message: this.$t('请输入扣量比例'), trigger: 'blur' },
          { validator: validateDeductRate, trigger: 'blur' }
        ],
        remark: [{ required: true, message: this.$t('请输入渠道描述'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleDel(row) {
      this.delId = row.id
      this.showDel = true
    },
    async handleDelSubmit() {
      this.submitLoading = true
      const { res } = await this.$axios.POST(this.$urls.channel.channelDel, { id: this.delId })
      this.submitLoading = false
      if (res) {
        this.showDel = false
        this.$message.success(this.$t('删除成功'))
        this.getTableData()
      }
    },
    handleEdit(row) {
      this.title = this.$t('编辑渠道')
      this.formData = JSON.parse(JSON.stringify(row))
      this.showManage = true
    },
    async getGroup() {
      const params = {
        pageNo: 1,
        pageSize: 9999
      }
      const { res } = await this.$axios.GET(this.$urls.channel.channelgroup, params)
      if (res) {
        let { list } = res.page
        list = list.map(i => ({ ...i, label: i.name, value: i.id }))
        this.groupList = list
        this.searchCriteria.meta.find(i => i.prop === 'groupId').options = list
      }
    },
    handleSubmit() {
      const submit = async () => {
        const data = {
          ...this.formData
        }
        this.submitLoading = true
        const { res } = await this.$axios.POST(this.$urls.channel[data.id ? 'channelUpdate' : 'channelSave'], data)
        this.submitLoading = false
        if (res) {
          this.showManage = false
          this.$message.success(this.$t('操作成功'))
          this.getTableData()
        }
      }
      this.$refs.formData.validate(isOk => isOk && submit())
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      const params = {
        ...this.params,
        ...this.searchCriteria.keys
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.channel.channelList, params)
      const {res,response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        const { totalCount, list } = res.page
        this.totalCount = totalCount
        this.tableData = list
      }
    },
    handleAdd() {
      this.title = this.$t('新增渠道')
      this.formData = { isOpen: true }
      this.showManage = true
    }
  }
}
</script>

<style scoped lang="scss">
.manage-box {
  .input-w {
    width: 60%
  }
}
</style>
