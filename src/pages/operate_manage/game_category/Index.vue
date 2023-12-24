<template>
  <div class="game-category">
    <!-- 游戏管理 - 彩票分类 -->
    <TableSearchBar :searchCriteria="searchCriteria" :currentPage="params.pageNo" @reloadData="getTableData"/>
    <STableCom
      hasPagination
      :loading="loading"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :totalCount="totalCount"
      @reloadData="getTableData"
    >
      <el-button type="primary" @click="handleAdd">{{ $t('添加') }}</el-button>
    </STableCom>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
  	</div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showForm"
    >
      <el-form ref="diaForm" :model="diaForm" label-width="120px" :rules="rules">
        <el-form-item :label="$t('平台')" prop="depotIds">
          <el-select v-model="diaForm.depotIds" @change="handleDiaSelect">
            <el-option v-for="(item, i) in searchCriteria.meta[0].options" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('分类')" prop="name">
          <el-input v-model="diaForm.name" :placeholder="$t('请输入分类')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('排序')" prop="sortId">
          <el-input v-model="diaForm.sortId" :placeholder="$t('请输入排序')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('彩种')" prop="gameIds">
          <el-checkbox-group v-model="diaForm.gameIds" class="game-list">
            <div v-for="(item, i) in gameList" :key="i" class="list-item">
              <el-checkbox :label="item.id">{{ item.gameName }}</el-checkbox>
              <el-input class="game-input" v-model="item.sortNum">
                <template slot="append">{{ $t('排序') }}</template>
              </el-input>
            </div>
          </el-checkbox-group>
          <div v-show="!gameList.length">{{ $t('请选择平台') }}~</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center">
        <el-button @click="handleSubmit" :loading="submitLoading" type="primary">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Mixin from '@/mixins/loadTime'
export default {
  mixins: [Mixin],
  data() {
    return {
      searchCriteria: {
        keys: {
          gamelogoid: null,
          name: null,
          gameName: null
        },
        meta: [
          {
            type: 'select',
            label: this.$t('平台'),
            prop: 'gamelogoid',
            options: []
          },
          {
            type: 'text',
            label: this.$t('分类'),
            prop: 'name'
          },
          {
            type: 'text',
            label: this.$t('彩种'),
            prop: 'gameName'
          },
        ]
      },
      params: {
        pageNo: 1,
        pageSize: 10
      },
      loading: false,
      submitLoading: false,
      showForm: false,
      tableData: [],
      totalCount: 0,
      tableColumns: [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 80 },
        { label: this.$t('平台'), render: (h, row) => {
          const { gamelogoid } = row
          const { options } = this.searchCriteria.meta.find(i => i.prop === 'gamelogoid')
          const obj = options.find(i => i.value === gamelogoid) || {}
          return h('span', obj.label)
        } },
        { label: this.$t('分类'), prop: 'name' },
        { label: this.$t('排序'), prop: 'sortId' },
        { label: this.$t('彩种'), prop: 'gameName' },
        { label: this.$t('操作'), render: (h, row) => h('div', [
          h('span', { class: 'blue-color pointer', on: { click: () => this.handleEdit(row) } }, this.$t('编辑')),
          h('span', { class: 'blue-color pointer', on: { click: () => this.handleDelete(row) } }, this.$t('删除'))
        ]) },
      ],
      gameType: {},
      diaForm: {
        depotIds: null,
        sortId: null,
        name: null,
        gameIds: []
      },
      gameList: []
    }
  },
  created() {
    this.initData()
    this.getTableData()
  },
  computed: {
    rules() {
      const GValidate = (rule, val, cb) => {
        const { gameIds } = this.diaForm
        if (!gameIds.length) return cb(this.$t('请选择彩种'))
        cb()
      }
      return {
        depotIds: [{ required: true, message: this.$t('请选择平台'), trigger: 'change' }],
        name: [{ required: true, message: this.$t('请输入分类'), trigger: 'blur' }],
        sortId: [{ required: true, message: this.$t('请输入分类'), trigger: 'blur' }],
        gameIds: [{ required: true, validator: GValidate, trigger: 'change' }]
      }
    },
    dialogTitle() {
      return this.$t('添加')
    },
  },
  methods: {
    handleEdit(row) {
      const { id, name, sortId, gamelogoid, isTGmCatId, gameCategoryRelations } = row
      this.diaForm = {
        depotIds: gamelogoid,
        sortId,
        name,
        id,
        gameIds: gameCategoryRelations.map(i => i.gameid),
        isTGmCatId,
        gameCategoryRelations
      }
      this.handleDiaSelect()
      this.showForm = true
    },
    handleDelete(row) {
      const submit = async () => {
        const { id, isTGmCatId } = row
        const { res } = await this.$axios.POST(this.$urls.gameCategory.delete, { id, isTGmCatId })
        if (res) {
          this.$message.success(this.$t('删除成功'))
          this.getTableData()
        }
      }
      this.$confirm(this.$t('确定删除？'), this.$t('删除'), { center: true }).then(() => submit())
    },
    handleSubmit() {
      const submit = async () => {
        const { depotIds: gamelogoid, name, sortId, gameIds, id, isTGmCatId } = this.diaForm
        const data = {
          gamelogoid,
          name,
          sortId,
          gameCategoryRelations: gameIds.map(i => {
            const obj = this.gameList.find(_i => _i.id === +i) || {}
            return { gameid: i, gamecategoryid: gamelogoid, sortId: +(obj.sortNum || 0) }
          }),
        }
        if (id) {
          data.id = id
          data.isTGmCatId = isTGmCatId
        }
        this.submitLoading = true
        const { res } = await this.$axios.POST(this.$urls.gameCategory[id ? 'update' : 'save'], data)
        this.submitLoading = false
        if (res) {
          this.showForm = false
          this.$message.success(this.$t('成功'))
          this.getTableData()
        }
      }
      this.$refs.diaForm.validate(isOk => isOk && submit())
    },
    handleDiaSelect() {
      this.getGameList()
    },
    async getGameList() {
      const { depotIds, id, gameCategoryRelations } = this.diaForm
      const { id: catId } = this.gameType
      const params = {
        pageNo: 1,
        pageSize: 2000,
        depotIds,
        catId
      }
      const { res } = await this.$axios.GET(this.$urls.findGameHasSubcatList, params)
      if (res) {
        let { list } = res.page
        if (id) {
          list = list.map(i => {
            const obj = gameCategoryRelations.find(_i => _i.gameid === i.id)
            return { ...i, sortNum: obj ? obj.sortId : null }
          })
        }
        this.gameList = list
      }
    },
    handleAdd() {
      this.diaForm.depotIds = null
      this.diaForm.sortId = null
      this.diaForm.id = null
      this.diaForm.name = null
      this.diaForm.gameIds = []
      this.gameList = []
      this.showForm = true
      this.$nextTick(() => {
        this.$refs.diaForm.resetFields()
        this.$refs.diaForm.clearValidate()
      })
    },
    async initData() {
      await this.getGameTypes()
      this.getDepotIds()
    },
    async getGameTypes() {
      const { res } = await this.$axios.GET(this.$urls.findGameTypes)
      if (res) {
        const { page } = res
        // this.gameType = page.find(i => i.catName === this.$t('彩票')) || {}
        this.gameType = page.find(i => i.id === 12) || {}
      }
    },
    async getDepotIds() {
      const { id: catId } = this.gameType
      console.log('this.gameType:', this.gameType)
      const { res } = await this.$axios.GET(this.$urls.findPlatforms, { catId })
      if (res) {
        const { page } = res
        this.searchCriteria.meta.find(i => i.prop === 'gamelogoid').options = page.map(i => ({ ...i, label: i.depotName, value: i.depotId }))
      }
    },
    async getTableData() {
      this.getCurrentRecodeTime()
      const { keys } = this.searchCriteria
      const params = {
        ...keys,
        ...this.params
      }
      this.loading = true
      const obj = await this.$axios.GET(this.$urls.gameCategory.list, params)
      const {res, response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false
      if (res) {
        const { page: { list, totalCount } } = res
        this.tableData = list
        this.totalCount = totalCount
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.game-category {
  .game-list {
    display: flex;
    flex-wrap: wrap;
    .game-group {
      width: 100%;
    }
    .game-input {
      width: 35%;
      /deep/ .el-input__inner {
        height: 22px;
        line-height: 22px;
        padding: 0 5px;
      }
    }
    .list-item {
      width: 48%;
      padding-left: 1%;
    }
  }
}
</style>
