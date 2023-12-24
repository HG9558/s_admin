<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData">
      <div class="water-rebate-search_method" slot="searchMethod">
        <el-select style="margin-right: 10px;" v-model="searchMethod">
          <el-option :label="$t('会员')" value="member"></el-option>
          <el-option :label="$t('代理')" value="agent"></el-option>
        </el-select>
        <el-input v-model="searchCriteria.keys.searchContent" v-trim @keyup.enter.native="getTableData" ></el-input>
        <el-select style="margin-left: 10px;" v-model="searchCriteria.keys.selectStatus" :placeholder="$t('请选择')">
          <el-option :label="$t('通过')" value="1"></el-option>
          <el-option :label="$t('拒绝')" value="0"></el-option>
          <el-option :label="$t('待审核')" value="2"></el-option>
        </el-select>
      </div>
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      ref="table"
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
    >
      <el-button icon="el-icon-back" @click="$router.go(-1)" style="float: left;margin-right: 0px">{{ $t('返回') }}</el-button>
      <!-- 按钮插槽(默认插槽) -->
      <el-button type="primary" v-if="permissions.audit" @click="handleBatchAudit">{{ $t('批量审核') }}</el-button>
      <!-- 表格插槽 -->
      <el-table-column align="right" fixed="left" slot="betAndRebate">
        <template slot="header" slot-scope="scope">
          {{ $t('总有效投注') }}/<br />{{ $t('总返水金额') }}
        </template>
        <template slot-scope="scope">
          {{scope.row.totalValidbet}}
          <div class="water-rebate-totalAmount">{{scope.row.totalAmount}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" :label="$t('会员')" slot="loginName">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="showPersonalDetails(scope.row)"
          >
            {{scope.row.loginName}}
          </el-button>
        </template>
      </el-table-column>
      <template slot="gameTypes">
        <el-table-column align="right" fixed="left" :label="item.catName" v-for="item in gameTypes" :key="item.id">
          <template slot-scope="scope">
            {{getStatisticsByCat(item.id, scope.row.statisticsByCat).validbet}}
            <div class="water-rebate-totalAmount">{{getStatisticsByCat(item.id, scope.row.statisticsByCat).amount}}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" :label="$t('状态')" slot="status">
        <template slot-scope="scope">
          <el-tag
            :type="{0: 'danger', 1: 'success', 2: 'warning'}[scope.row.status]"
          >
            {{
              {
                0: $t('拒绝'),
                1: $t('通过'),
                2: $t('待审核')
              }[scope.row.status]
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" v-if="permissions.audit">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleAudit(scope.row)"
            v-if="permissions.audit && scope.row.status === 2"
          >
            [{{ $t('审核') }}]
          </el-button>
        </template>
      </el-table-column>
    </TableCom>
    <AuditForm
      :info="auditFormInfo"
      :isBatchAudit="isBatchAudit"
      :formVisible.sync="auditFormVisible"
      v-if="auditFormVisible"
      @submit="submitAudit"
    />
    <PersonalDetails
      :personalDetails="personalDetails"
      :visible.sync="personalDetailsVisible"
    />
  </div>
</template>

<script>
import AuditForm from './Form'
import PersonalDetails from './PersonalDetails'
import { mapGetters } from 'vuex'
import queryStore from '../../../mixins/queryStore'
import systemConfig from '../../../config/config.js'

const { toThousands } = systemConfig

export default {
  components: {
    AuditForm,
    PersonalDetails
  },
  mixins: [queryStore(['searchMethod', 'searchContent', 'searchCriteria.keys'])],
  data() {
    return {
      searchMethod: 'member',
      searchCriteria: {
        keys: {
          searchContent: null,
          selectStatus:null,
        },
        meta: [
          {
            label: this.$t('查询条件'),
            slotName: 'searchMethod'
          }
        ]
      },
      tableColumns: [
        {
          type: 'selection',
          selectable(row, index) {
            return row.status === 2
          }
        },
        {
          prop: 'agyAccount',
          label: this.$t('所属代理'),
          fixed: 'left'
        },
        {
          slotName: 'loginName',
        },
        {
          prop: 'auditTime',
          label: this.$t('审核时间')
        },
        {
          slotName: 'betAndRebate'
        },
        {
          slotName: 'gameTypes',
        },
        {
          slotName: 'status'
        },
        {
          prop: 'auditUser',
          label: this.$t('审核人')
        },
        {
          prop: 'memo',
          label: this.$t('备注')
        },
        {
          slotName: 'operation'
        },
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      gameTypes: [],
      auditFormInfo: {},
      isBatchAudit: false,
      auditFormVisible: false,
      personalDetails: {
        loginName: null,
        tableData: []
      },
      personalDetailsVisible: false
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
    waterdateid() {
      return this.$route.query.waterdateid
    },
    activityName() {
      return this.$route.query.activityName
    },
    multipleSelection() {
      return this.$refs.table.multipleSelection
    },
    permissions() {
      const { hasPermission } = this
      return {
        audit: hasPermission('operate:activity:waterAudit')
      }
    },
    ...mapGetters(['hasPermission'])
  },
  mounted() {
    // if (!this.useQueryStoreCache) {

    // }
    // 不加会出样式问题 巨坑
    this.$store.state.indexActive = '4-2-1'
    this.getGameTypes()
    this.getTableData()
  },
  methods: {
    showPersonalDetails({ loginName, status, statisticsByDepot }) {
      this.personalDetails.loginName = loginName
      this.personalDetails.tableData = JSON.parse(JSON.stringify(statisticsByDepot)).map(item => {
        const shouldToThousandsFileds = ['amount', 'validbet']
        for (const field of shouldToThousandsFileds) {
          item[field] = toThousands(item[field])
        }
        item.paidAmount = status === 1 ? item.amount : '0.00'
        item.time = systemConfig.transferTimeByType(item.time, 'bj')
        return item
      })
      this.personalDetailsVisible = true
    },
    submitAudit({ id, memo, status, tmplCode }) {
      const { isBatchAudit } = this
      const arr = isBatchAudit ? this.multipleSelection : [id]
      this.$axios.post(systemConfig.urls.waterRebateList.audit, {
        memo,
        status,
        activityName: this.activityName,
        bonusAuditListDtos: arr.map(bonuseId => {
          return {
            bonuseId,
            tmplCode: this.tableData.find(item => item.id === bonuseId).tmplCode
          }
        })
      })
      .then(() => {
        this.auditFormVisible = false
        this.$message.success(this.$t('审核成功'))
        this.getTableData()
      })
    },
    handleBatchAudit() {
      if (this.multipleSelection.length) {
        this.isBatchAudit = true
        this.auditFormInfo = {}
        this.auditFormVisible = true
      } else {
        this.$message.warning(this.$t('请至少选择一个选项'))
      }
    },
    handleAudit(info) {
      this.isBatchAudit = false
      this.auditFormInfo = info
      this.auditFormVisible = true
    },
    getStatisticsByCat(catId, statisticsByCat) {
      if (statisticsByCat) {
        const temp = statisticsByCat.find(item => item.catId === catId)
        return temp || {}
      } else {
        return {}
      }
    },
    getGameTypes() {
      this.$axios.get(systemConfig.urls.findGameTypes)
      .then(res => {
        this.gameTypes = res.data.page
      })
    },
    getTableData(){
      const param = {}
      const { searchContent,selectStatus} = this.searchCriteria.keys
      console.log("TCL: getTableData -> this.searchCriteria.keys", this.searchCriteria.keys)
      param.status=selectStatus
      if (this.searchMethod === 'member') {
        param.loginName = searchContent
      } else {
        param.agyAccount = searchContent
      }
      this.$axios.get(systemConfig.urls.waterRebateList.auditList, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          // ...this.searchCriteria.keys,
          waterdateid: this.waterdateid,
          ...param
        }
      })
      .then(res => {
        if(res){
          this.totalCount = res.data.page.totalCount
          this.tableData = res.data.page.list.map(item => {
            const shouldToThousandsFileds = ['totalAmount', 'totalValidbet']
            for (const field of shouldToThousandsFileds) {
              item[field] = toThousands(item[field])
            }
            item.auditTime = systemConfig.transferTimeByType(item.auditTime, 'bj')
            return item
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.water-rebate-search_method {
  display: flex;
}
.water-rebate-totalAmount {
  color: #3399FF;
}
</style>
