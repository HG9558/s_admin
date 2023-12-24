<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        type="date"
        ref="searchTime"
        slot="searchTime"
        :width="450"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.useStart"
        :endTime.sync="searchCriteria.keys.useEnd"
      />
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="permissions.add"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @add="jumpToForm()"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <!-- 表格插槽 -->
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" v-if="permissions.edit || permissions.see">
        <template slot-scope="scope">
          <span
            class="blue-color pointer"
            v-if="permissions.edit"
            @click="jumpToForm({id: scope.row.id})"
          >
            [{{ $t('编辑') }}]
          </span>
          <span
            class="blue-color pointer"
            v-if="permissions.see"
            @click="jumpToForm({id: scope.row.id, isSee: true})"
          >
            [{{ $t('查看') }}]
          </span>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import queryStore from '../../../mixins/queryStore'
import systemConfig from '../../../config/config.js'
import { mapGetters } from 'vuex'
import StartAndEndTimeSelector from '../../../components/StartAndEndTimeSelector'
import Mixin from '@/mixins/loadTime'
import { lang } from "@/i18n";

const languageList = [
  { value: "zh", label: lang("简体中文") },
  { value: "zh_tw", label: lang("繁体中文") },
  { value: "vi", label: lang("越南语") },
  { value: "ms", label: lang("马来语") },
  { value: "th", label: lang("泰语") },
  { value: "en_us", label: lang("英语") },
]

export default {
  name: 'activityIntroduction',
  components: {
    StartAndEndTimeSelector
  },
  mixins: [Mixin, queryStore(['searchCriteria.keys'])],
  data() {
    return {
      searchCriteria: {
        keys: {
          activityName: null,
          actCatIdList: [],
          useStateList: [],
          useStart: null,
          useEnd: null,
          isShow: null,
          rule: null,
          isOnline: null
        },
        meta: [
          {
            type: 'text',
            label: this.$t('活动名称'),
            prop: 'activityName'
          },
          {
            type: 'select',
            label: this.$t('活动类别'),
            prop: 'actCatIdList',
            multiple: true,
            options: []
          },
          {
            type: 'select',
            label: this.$t('状态'),
            prop: 'useStateList',
            multiple: true,
            options: [
              {
                label: this.$t('未开始'),
                value: 0
              },
              {
                label: this.$t('进行中'),
                value: 1
              },
              {
                label: this.$t('已失效'),
                value: 2
              },
            ]
          },
          {
            label: this.$t('活动时间'),
            slotName: 'searchTime',
            options: [
              {
                label: this.$t('一个月'),
                value: 'month'
              },
              {
                label: this.$t('上个月'),
                value: 'lastMonth'
              },
              {
                label: this.$t('近三月'),
                value: 'lastThreeMonths'
              },
            ]
          },
          {
            type: 'select',
            label: this.$t('前台展示'),
            prop: 'isShow',
            options: [
              {
                label: this.$t('全部'),
                value: null
              },
              {
                label: this.$t('是'),
                value: 1
              },
              {
                label: this.$t('否'),
                value: 0
              },
            ]
          },
          {
            type: 'text',
            label: this.$t('活动规则'),
            prop: 'rulename',
            max: 20
          },
          {
            type: 'select',
            label: this.$t('活动渠道'),
            prop: 'isOnline',
            options: [
              {
                label: this.$t('全部'),
                value: null
              },
              {
                label: this.$t('线上活动'),
                value: true
              },
              {
                label: this.$t('线下活动'),
                value: false
              },
            ]
          },
        ]
      },
      tableColumns: [
        {
          type: 'index',
          label: this.$t('序号')
        },
        {
          prop: 'otherLanguage',
          label: this.$t('语言')
        },
        {
          prop: 'activityName',
          label: this.$t('活动名称')
        },
        {
          prop: 'rulename',
          label: this.$t('活动规则')
        },
        {
          prop: 'catName',
          label: this.$t('活动类别')
        },
        {
          prop: 'avtivityTimeText',
          label: this.$t('活动时间')
        },
        {
          prop: 'useStateText',
          label: this.$t('状态')
        },
        {
          prop: 'isShowText',
          label: this.$t('前台是否展示')
        },
        {
          prop: 'sort',
          label: this.$t('前台排序号')
        },
        {
          label: this.$t('活动渠道'),
          render: (h, row) => h('span', `${row.isOnline ? this.$t('线上活动') : this.$t('线下活动')}`)
        },
        {
          prop: 'createTime',
          label: this.$t('创建时间')
        },
        {
          slotName: 'operation'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null
    }
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === 'yes'
    },
    activityCategories: {
      get() {
        return this.searchCriteria.meta.find(item => item.prop === 'actCatIdList').options
      },
      set(value) {
        this.searchCriteria.meta.find(item => item.prop === 'actCatIdList').options = value
      }
    },
    statusMapper() {
      const statusMapper = {}
      const { options } = this.searchCriteria.meta.find(item => item.prop === 'useStateList')
      for (const item of options) {
        statusMapper[item.value] = item.label
      }
      return statusMapper
    },
    permissions() {
      const { hasPermission } = this
      return {
        see: hasPermission('operate:activity:infoEx'),
        add: hasPermission('operate:activity:save'),
        edit: hasPermission('operate:activity:update'),
        audit: hasPermission('operate:activity:activityAudit')
      }
    },
    ...mapGetters(['hasPermission'])
  },
  mounted() {
    // if (!this.useQueryStoreCache) {

    // }
    this.getActivityCategories()
    this.getTableData()
  },
  methods: {
    // 活动介绍 -- 活动规则
    jumpToForm(query) {
      this.$router.push({
        path: '/main/marketActivity/activityIntroduction/form',
        query
      })
    },
    getActivityCategories() {
      this.$axios.get(systemConfig.urls.activityCategory.listAll)
      .then(res => {
        this.activityCategories = res.data.page.map(item => {
          return {
            ...item,
            label: item.catName,
            value: item.id
          }
        })
      })
    },
    getTableData(){
      this.getCurrentRecodeTime()
      const { actCatIdList, useStateList } = this.searchCriteria.keys
      this.$axios.get(systemConfig.urls.activityIntroduction.list, {
        params: {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          ...this.searchCriteria.keys,
          actCatIdList: actCatIdList.join(','),
          useStateList: useStateList.join(',')
        }
      })
      .then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        if(res){
          this.totalCount = res.data.data.totalCount
          this.tableData = res.data.data.list.map(item => {
            let { useStart, useEnd, language } = item
            let otherLanguage = language.map(v => {
              return languageList.find(t => t.value === v).label
            })
            item.otherLanguage = otherLanguage.join(',') || ''
            useStart = systemConfig.transferTimeByType(item.useStart, 'bj')
            useEnd = systemConfig.transferTimeByType(item.useEnd, 'bj')
            item.avtivityTimeText = useStart + '~' + useEnd
            item.useStateText = this.statusMapper[item.useState]
            item.isShowText = item.isShow === 1 ? this.$t('是') : this.$t('否')
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.activity-template {
  display: flex;
  margin-bottom: 150px;
  .activity-template-item {
    flex: 1;
    cursor: pointer;
    padding: 50px 0;
    text-align: center;
    border: 1px solid #eee;
    &:hover {
      border-color: #ccc;
    }
    &:not(:last-of-type) {
      margin-right: 20px;
    }
    .activity-template-item_title {
      color: #333;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
