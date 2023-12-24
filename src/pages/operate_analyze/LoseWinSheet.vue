<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar v-loading="isLoading" :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="handleSearch" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector type="date" :left="40" ref="searchTime" slot="searchTime" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" :default-type-p="defaultTypeP"/>
      <StartAndEndTimeSelector type="date" :width="455" :left="105" ref="depositTime" slot="depositTime" :selections="searchCriteria.meta[1].options" :startTime.sync="searchCriteria.keys.depositTimeStart" :endTime.sync="searchCriteria.keys.depositTimeEnd" />
      <el-select slot="searchRange" v-model="searchCriteria.keys.searchRange" :placeholder="$t('选择查询范围')" clearable>
        <el-option :label="$t('代理')" value="isAgent"></el-option>
        <el-option :label="$t('会员')" value="onlyMember"></el-option>
        <el-option :label="$t('代理会员')" value="agyflag"></el-option>
      </el-select>
      <el-input slot="username" clearable @keyup.native.enter="handleSearch" v-model="searchCriteria.keys.username" v-trim :placeholder="
          searchCriteria.keys.searchRange === null
            ? $t('请输入代理或会员账号')
            : (searchCriteria.keys.searchRange === 'isAgent' ? $t('请输入代理账号') : $t('请输入会员账号'))
        ">
      </el-input>
      <p class="lose-win-tips">{{ $t('更新时间') }}：{{ lastUpdateDate }}</p>
      <p class="lose-win-tips">
        {{ $t('报表日期') }}：{{ searchCriteria.keys.startTime }} ~
        {{ searchCriteria.keys.endTime }}
      </p>
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <div v-if="!showAll" style="line-height:50px;text-align:center;color:#909399;">
      {{ showText }}
    </div>
    <div v-else>
      <!-- 面包屑 -->
      <div class="layer-bread" slot="">
        <el-breadcrumb separator-class="el-icon-arrow-right" v-show="currentBreadcrumb.upper.username" class="lose-win-breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            <el-button type="text" size="small" @click="handleClick(item.upper, index)" v-if="
                  breadcrumbs.length > 1 && index !== breadcrumbs.length - 1
                ">
              {{ item.upper.levelDisplayName  }}{{ item.upper.username
              }}{{ item.upper.isOnlyMember ? $t('详情') : "" }}
            </el-button>
            <template v-else>{{ item.upper.levelDisplayName }}{{ item.upper.username
              }}{{ item.upper.isOnlyMember ? $t('详情') : "" }}</template>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <span v-show="!currentBreadcrumb.upper.isOnlyMember" class="member-count">{{ $t('下线有效投注会员') }}：{{ summary.total }}{{ $t('人') }}</span>
      </div>
<!--      <div class="export-div">-->
<!--        <el-button v-if="permissions.export && isNowDowning" type="primary" :disabled="!totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport0">导出-->
<!--        </el-button>-->
<!--        <el-button v-else-if="permissions.export && !isNowDowning" type="primary" class="iconfont icon-export el-button-export" size="mini">导出中...-->
<!--        </el-button>-->
<!--      </div>-->
      <!-- 上方的表格 -->
      <TableCom align="center" :stripe="true" :hasAddBtn="false" :show-summary="true" :hasRemoveBtn="false" :hasPagination="false" :tableData="upperTableData" :summary-method="summaryMethod('upper')" :tableColumns="upperTableColumns" @sort-change="handleSortChange($event, 'upper')">
        <div slot="slot-title">
          <h3 class="layer-bread">{{ $t('自身及下级输赢总数据') }}</h3>
        </div>
      </TableCom>
      <TableCom align="center" v-if="isMbr" :stripe="true" :hasAddBtn="false" :show-summary="true" :hasRemoveBtn="false" :hasPagination="false" :tableData="selfTableData" :summary-method="summaryMethod('mbr')" :tableColumns="upperTableColumns" @sort-change="handleSortChange($event, 'upper')">
        <div slot="slot-title">
          <h3 class="layer-bread">{{ $t('自身输赢数据') }}</h3>
        </div>
      </TableCom>
      <!-- 视图表格 -->
      <TableCom v-show="currentLayerIsSubAgent && !isMbr" align="center" :stripe="true" :hasAddBtn="false" :hasRemoveBtn="false" :hasPagination="false" :tableData="viewTableData" :tableColumns="viewTableColumns" @sort-change="handleSortChange($event, 'upper')">
        <h3 class="layer-bread" slot="slot-title">
          {{ $t('视图切换') }}
        </h3>
        <el-table-column slot="view" fixed="left" :label="$t('视图')" align="center">
          <template slot-scope="{ $index }">
            <el-button v-if="$index === 0" type="text" size="small" :disabled="isSubAgentShow" @click="handleViewChange(true)">
              {{ $t('下级代理') }}
            </el-button>
            <el-button v-else-if="$index === 1" type="text" size="small" :disabled="!isSubAgentShow" @click="handleViewChange(false)">
              {{ $t('直属会员') }}
            </el-button>
            <template v-else>{{ $t('总计') }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('注单数')" slot="quantity">
          <template slot-scope="scope">
            {{scope.row.quantity || 0}}
          </template>
        </el-table-column>
      </TableCom>
      <TableCom v-show="isMbr" align="center" :stripe="true" :hasAddBtn="false" :hasRemoveBtn="false" :hasPagination="false" :tableData="mbrView" :tableColumns="mbrTableColumns" @sort-change="handleSortChange($event, 'upper')">
        <h3 class="layer-bread" slot="slot-title">
          {{ $t('视图切换') }}
        </h3>
      </TableCom>
      <!-- 下方的表格 -->
      <TableCom v-show="!currentBreadcrumb.upper.isOnlyMember || isMbr" align="center" :stripe="true" :hasAddBtn="false" :show-summary="!currentLayerIsSubAgent" :hasRemoveBtn="false" :tableData="[...memberTableData, ...lowerTableData]" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="lowerTableColumns" :summary-method="summaryMethod('lower')" :currentPage.sync="currentPage" @reloadData="getLowerTableData" @sort-change="handleSortChange($event, 'lower')" :hasLayout="bottomTotal" :hasPagination="true" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
        <h3 class="layer-bread" v-show="lowerTableLengthTotal" slot="slot-title">
          <span class="lower-table-count">
            {{
              currentBreadcrumb.upper.level === 'account' ? isNextAgy ? $t('代理会员') : $t('会员') : currentBreadcrumb.lower.levelDisplayName
            }}{{
              ((currentBreadcrumb.upper.level !== 'account' && currentBreadcrumb.lower.level !== 'account') || currentBreadcrumb.lower.isOnlyMember)
                ? `${$t('数量')}: ${lowerTableLengthTotal}`
                : ''
              }}
          </span>
          <el-button size="small" v-if="permissions.export" :disabled="!totalCount" @click="handleExportDate" :loading="isExportingDate">
            {{ isExportingDate ? $t('导出中') : $t('按日导出') }}
          </el-button>
          <el-button size="small" v-if="permissions.export" :disabled="!totalCount" @click="handleExport" :loading="isExporting">
            {{ isExporting ? $t('导出中') : $t('导 出') }}
          </el-button>
        </h3>
        <el-table-column fixed="left" align="center" :label="$t('账号')" slot="username">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.total === 0" type="text" size="small" @click="handleClick(scope.row)">{{ scope.row.username }}</el-button>
          </template>
        </el-table-column>
      </TableCom>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../config/config.js";
import queryStore from "../../mixins/queryStore";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
const { toThousands } = systemConfig;
import Mixin from '@/mixins/loadTime'


export default {

  name: "loseWinSheet",
  components: {
    StartAndEndTimeSelector,
  },
  mixins: [Mixin, queryStore(["searchCriteria.keys", "breadcrumbs"])],
  data() {
    return {
      isNowDowning: true, //文件导出
      platformOptions: [],
      bottomTotal: "total, sizes, prev, pager, next, jumper",
      /* bottomTableSource:'loseWinSheet', */
      searchCriteria: {
        keys: {
          startTime: moment().format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD"),
          depositTimeStart: null,
          depositTimeEnd: null,
          searchRange: null,
          username: null,
          agyAccount: null,
          loginName: null,
          departmentid: null,
          catCodes: [],
          depotCodes: [],
        },
        meta: [
          {
            label: this.$t("时间"),
            slotName: "searchTime",
            options: [
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
              {
                label: this.$t("本月"),
                value: "currentMonth",
              },
            ],
          },
          {
            label: this.$t("首存时间"),
            slotName: "depositTime",
            options: [
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
              {
                label: this.$t("本月"),
                value: "currentMonth",
              },
            ],
          },
          {
            label: this.$t("查询范围"),
            slotName: "searchRange",
          },
          {
            label: this.$t("账号"),
            slotName: "username",
          },
          {
            type: "select",
            multiple: true,
            label: this.$t("游戏类型"),
            prop: "catCodes",
            options: [],
          },
          {
            type: "select",
            multiple: true,
            label: this.$t("游戏平台"),
            prop: "depotCodes",
            options: [],
          },
          {
            type: "select",
            label: this.$t("部门"),
            prop: "departmentid",
            options: [],
          },
        ],
      },
      upperTableColumns: [
        {
          prop: "username",
          label: this.$t("账号"),
        },
        {
          prop: "levelDisplayName",
          label: this.$t("级别"),
        },
        {
          prop: "total",
          label: this.$t("投注人数"),
        },
        {
          prop: "quantity",
          label: this.$t("注单数"),
          sortable: "custom",
        },
        {
          prop: "betTotal",
          label: this.$t("投注金额"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "validbetTotal",
          label: this.$t("有效投注"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "payoutTotal",
          label: this.$t("玩家输赢"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "categoryTotal",
          label: this.$t("类别"),
        },
        {
          prop: "profitRatio",
          label: this.$t("盈利比"),
        },
      ],
      lowerTableColumns: [
        {
          slotName: "username",
        },
        {
          prop: "levelDisplayName",
          label: this.$t("级别"),
        },
        {
          label: this.$t("部门"),
          render: (h, row) => {
            const { departmentid } = row
            const obj = this.departList.find(i => i.value === departmentid) || {}
            return h('span', obj.label)
          }
        },
        {
          prop: "total",
          label: this.$t("投注人数"),
        },
        {
          prop: "quantity",
          label: this.$t("注单数"),
          sortable: "custom"
        },
        {
          prop: "betTotal",
          label: this.$t("投注金额"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "validbetTotal",
          label: this.$t("有效投注"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "payoutTotal",
          label: this.$t("输赢"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "profitRatio",
          label: this.$t("盈利比"),
        },
      ],
      viewTableColumns: [
        {
          slotName: "view",
        },
        {
          prop: "total",
          label: this.$t("投注人数"),
        },
        // {
        //   align: "right",
        //   prop: "quantity",
        //   label: "注单数",
        //   sortable: "custom",
        // },
        {
          prop: "betTotal",
          label: this.$t("投注金额"),
          sortable: "custom",
          align: 'right'
        },
        {
          slotName: "quantity",
        },
        {
          prop: "validbetTotal",
          label: this.$t("有效投注"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "payoutTotal",
          label: this.$t("输赢"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "profitRatio",
          label: this.$t("盈利比"),
        },
      ],
      lastUpdateDate: null,
      upperTableData: [],
      selfTableData: [],
      lowerTableData: [],
      memberTableData: [],
      summary: {},
      memberSummary: {},
      mbrSummary: {},
      pageSize: 20,
      currentPage: 1,
      totalCount: null,
      shouldToThousandProps: ["betTotal", "payoutTotal", "validbetTotal"],
      breadcrumbs: [],
      selectBool: false,
      enterNum: 0,
      orderBy: {
        upper: null,
        lower: null,
      },
      isExporting: false,
      isExportingDate: false,
      isLoading: false,
      isSubAgentShow: true,
      isNextAgy: true,
      viewMode: 0,
      gameTypeList: [],
      viewTableData: [],
      mbrTableColumns: [
        {
          label: this.$t("视图"),
          fixed: 'left',
          render: (h, row) => {
            const { viewName, type } = row
            const isAll = type === 'all'
            return h(isAll ? 'span' : 'el-button', { attrs: { type: 'text', disabled: type !== 'account' ? this.isNextAgy : !this.isNextAgy }, on: {
                click: () => {
                  if (isAll) return
                  this.handleViewMbrChange(type)
                }
              } }, viewName)
          }
        },
        {
          prop: "total",
          label: this.$t("投注人数"),
        },
        {
          prop: "betTotal",
          label: this.$t("投注金额"),
          sortable: "custom",
          align: 'right'
        },
        {
          label: this.$t('注单数'),
          render(h, row) {
            return h('span', row.quantity || 0)
          }
        },
        {
          prop: "validbetTotal",
          label: this.$t("有效投注"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "payoutTotal",
          label: this.$t("输赢"),
          sortable: "custom",
          align: 'right'
        },
        {
          prop: "profitRatio",
          label: this.$t("盈利比"),
        },
      ],
      mbrView: [],
      departList: [],
      defaultTypeP: 'today'
    };
  },
  computed: {
    isSearch() {
      const { startTime, endTime, depositTimeStart, depositTimeEnd } = this.searchCriteria.keys
      return (startTime && endTime) || (depositTimeStart && depositTimeEnd)
    },
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    isMbr() {
      const { level } = this.currentBreadcrumb.upper
      return level === 'account' || level === 'agentMbr'
    },
    currentBreadcrumb() {
      console.log(
        "this.breadcrumbs.slice(-1)[0]",
        this.breadcrumbs.slice(-1)[0]
      );
      return this.breadcrumbs.slice(-1)[0] || { upper: {}, lower: {} };
    },
    currentLayerIsSubAgent() {
      const bool = this.isMbr ? true : this.currentBreadcrumb.upper.level > 0
      return bool
    },
    lowerTableLengthTotal() {
      return this.lowerTableData.length + this.memberTableData.length;
    },
    levelDisplayNameMapper() {
      return (level) => {
        switch (level) {
          case null:
            return this.$t("股东");
          case "0":
            return this.$t("总代");
          case "account":
            return this.$t("会员");
          case "agentMbr":
            return this.$t("代理会员")
          default:
            return this.$t("代理");
        }
      };
    },
    showText() {
      return this.isSearch ? '' : this.$t('您尚未选择查询条件')
    },
    showAll() {
      return this.isSearch && this.selectBool
    },
    permissions() {
      const { hasPermission } = this;
      return {
        export: hasPermission("analysis:betDetails:exportMbrWinLoseInfo"),
      };
    },
    searchParams() {
      const { keys } = this.searchCriteria;
      const { searchRange } = keys;
      console.log(
        keys.depotCodes,
        Object.prototype.toString.call(keys.depotCodes)
      );
      return {
        ...keys,
        searchRange: ['isAgent', 'agyflag'].includes(searchRange) ? null : searchRange,
        agyflag: searchRange === 'agyflag' ? 1 : null,
        depotCodes: keys.depotCodes.join(","),
        catCodes: keys.catCodes.join(","),
      };
    },
    ...mapGetters(["hasPermission"]),
  },
  watch: {
    currentBreadcrumb() {
      const { lower } = this.currentBreadcrumb
      if (lower) {
        if (lower.level === 'account') {
          this.lowerTableColumns.splice(3, 0, { label: this.$t('首存时间'), prop: 'depositTime', width: 150 })
        } else {
          this.lowerTableColumns = this.lowerTableColumns.filter(i => i.prop !== 'depositTime')
        }
      }
    },
    'searchCriteria.keys.catCodes'(newValue,oldValue){
      console.log(newValue,oldValue)
      if(newValue!==oldValue){
        let catCodes = null
        console.log(this.searchCriteria.keys.catCodes)
        this.searchCriteria.keys.catCodes.length===0?null:(this.searchCriteria.keys.catCodes.length===this.searchCriteria.meta[4].options.length?null:(catCodes=this.searchCriteria.keys.catCodes.join(',')))
        this.getGamePlatform(catCodes)
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.useQueryStoreCache) {
      this.getTableData(); //初始化数据，获取上下表格内容
    } else {
      this.getTableData('handleSearch'); //默认查询数据
    }
    this.getLastUpdate(); //获取更新日期
  },
  methods: {
    handleExport0() {
      this.isNowDowning = false;
      const params = {
        ...this.searchParams,
      }
      let url = ''
      this.searchParams.searchRange==='onlyMember'?(url=systemConfig.urls.loseWinSheet.exportAccountWinLostReport):(url=systemConfig.urls.loseWinSheet.exportWinLostReport)
      this.$axios
        .get(url,
          {params:params})
        .then((res) => {
          let isDownBool = res.data.code;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isNowDowning = true;
          } else {
            this.checkExportFile();
          }
        })
        .finally(() => {
          this.isNowDowning = true;
        });
    },
    init() {
      this.getGamePlatform(); // 获取游戏平台
      this.getGameTypes(); // 获取游戏分类
      this.getDepartment(); // 获取部门
      if (this.$route.params.source == "moneySheet") {
        let obj = this.$route.params;
        this.searchCriteria.keys.startTime = obj.startTime;
        this.searchCriteria.keys.endTime = obj.endTime;
        this.getTableData("handleSearch");
      }
    },
    async getDepartment() {
      const { res } = await this.$axios.GET(this.$urls.newAggentList.alldDepartmentList)
      if (res) {
        this.departList = res.data.map(i => ({ ...i, label: i.departmentName, value: i.id }))
        this.searchCriteria.meta.find(i => i.prop === 'departmentid').options = this.departList
      }
    },
    getGamePlatform(catCodes) {
      let url = catCodes?`&catCode=${catCodes}`:''
      this.$axios
        .get(systemConfig.urls.getPlatform + "?codetype="+url)
        .then((res) => {
          this.platformOptions = res.data.page;
          this.searchCriteria.meta.find(
            ({ prop }) => prop === "depotCodes"
          ).options = res.data.page.map(({ key, value }) => ({
            label: value,
            value: key,
          }));
        });
    },
    async getFindWinLostReportMbrView() {
      const params = {
        ...this.searchParams
      }
      const { res } = await this.$axios.GET(systemConfig.urls.loseWinSheet.findWinLostReportMbrView, params)
      if (res) {
        const { allSubordinates, directAccount, subordinateAgent } = res.page
        const obj = { agyAccount: subordinateAgent, account: directAccount, all: allSubordinates }
        const arr = [
          { viewName: this.$t('下级代理会员'), type: 'agyAccount' },
          { viewName: this.$t('直属会员'), type: 'account' },
          { viewName: this.$t('总计'), type: 'all' },
        ]
        this.mbrView = arr.map(i => this.processItem({ ...i, ...obj[i.type] }))
      }
    },
    async getMbrLowTable() {
      const parrams = {
        ...this.searchParams,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        orderBy: this.orderBy.lower,
        isSign: this.isNextAgy ? 1 : 2
      }
      const { res } = await this.$axios.GET(systemConfig.urls.loseWinSheet.listLevel, parrams)
      if (res) {
        const { list, totalCount } = res.page
        this.lowerTableData = []
        this.memberTableData = this.processTableData(list)
        this.totalCount = totalCount
      }
    },
    getGameTypes() {
      this.$axios.get(systemConfig.urls.findGameTypeEx).then((res) => {
        this.searchCriteria.meta.find(
          ({ prop }) => prop === "catCodes"
        ).options = res.data.page.map(({ catCode, catName }) => ({
          label: catName,
          value: catCode,
        }));
      });
    },
    checkExportFile(type) {
      let module = ''
      type?(module='mbrWinLoseDailyDetail'):(module='mbrWinLoseDetail')
      // 查看导出文件是否可下载
      this.$axios.get(systemConfig.urls.loseWinSheet.checkFile,{params:{module:module}}).then((res) => {
        const obj = res.data.data || {};
        const fileName = obj.fileName,
          downloadFileName = obj.downloadFileName;
        if (fileName) {
          const { baseURL } = res.config;
          // 下载文件
          let SToken = localStorage.getItem("SToken");
          window.open(
            baseURL +
              `/${systemConfig.urls.loseWinSheet.downloadExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}&language=${localStorage.getItem('lang')}`
          );
          this.isExporting = false;
          this.isExportingDate = false;
        } else {
          window.setTimeout(this.checkExportFile(type), 1000);
        }
      });
    },
    handleExport() {
      this.isExporting = true;
      this.$axios
        .get(systemConfig.urls.loseWinSheet.export, {
          params: {
            ...this.searchParams,
            orderBy: this.orderBy.lower,
            exportType: 0
          },
        })
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
          } else {
            this.checkExportFile();
          }
        });
    },
    handleExportDate() {
      this.isExportingDate = true;
      this.$axios
        .get(systemConfig.urls.loseWinSheet.export, {
          params: {
            ...this.searchParams,
            orderBy: this.orderBy.lower,
            exportType: 1
          },
        })
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
          } else {
            this.checkExportFile(1);
          }
        });
    },
    handleSortChange({ prop, order }, whichTable) {
      this.orderBy[whichTable] = order
        ? `${prop} ${{ ascending: "asc", descending: "desc" }[order]}`
        : null;
      switch (whichTable) {
        case "upper":
          this.getUpperTableData();
          break;
        case "lower":
          this.getLowerTableData();
          break;
      }
    },
    getTypeByUsername(flag) {
      return this.$axios
        .get(systemConfig.urls.loseWinSheet.getTypeByUsername, {
          params: { ...this.searchParams, ...flag },
        })
        .then(({ data }) => data.data);
    },
    getMemberTableData() {
      // 获取单个会员的信息
      const { level } = this.currentBreadcrumb.upper;
      const { isOnlyMember } = this.currentBreadcrumb.lower;
      if (!isOnlyMember && level === "account") {
        return this.$axios
          .get(systemConfig.urls.loseWinSheet.loginName, {
            params: this.searchParams,
          })
          .then((res) => {
            this.memberTableData = this.processTableData(
              [res.data.page],
              true /* isOnlyMember */
            );
          });
      }
      return Promise.resolve();
    },
    initQuery() {
      const { level, username } = this.currentBreadcrumb.upper;
      // 点击面包屑时切换username
      // this.searchCriteria.keys.username = level === null ? null : username
      this.currentPage = 1;
      if (this.isMbr) {
        this.searchCriteria.keys.agyAccount = null;
        this.searchCriteria.keys.loginName = username;
      } else {
        this.searchCriteria.keys.loginName = null;
        this.searchCriteria.keys.agyAccount = level === null ? null : username;
      }
    },
    handleClick(params, index) {
      const { breadcrumbs } = this;

      if (index === undefined) {
        // 新增
        breadcrumbs.push({
          upper: params,
          lower: {
            level: null,
            username: null,
          },
        });
      } else {
        this.breadcrumbs = breadcrumbs.slice(0, index + 1);
        const length = this.breadcrumbs.length - 1;
        if (this.breadcrumbs[length].upper.levelDisplayName !== this.$t("会员")) {
          this.isSubAgentShow = true;
        }
      }
      this.initQuery();
      this.getTableData();
    },
    summaryMethod(whichTable) {
      return (param) => {
        const sums = [];
        const { columns, data } = param;
        const { upper } = this.currentBreadcrumb;
        // 上方的表格是否为会员
        const upperIsOnlyMember = upper.isOnlyMember && whichTable === "upper";
        const shouldSumProps = [
          "betTotal",
          "payoutTotal",
          "validbetTotal",
          "total",
          "profitRatio",
          "quantity",
        ];
        let summary = upperIsOnlyMember ? this.memberSummary : this.summary;
        if (whichTable === 'mbr') {
          summary = this.mbrSummary
        }
        columns.forEach((column, index) => {
          const { property } = column;
          if (index === 0) {
            sums[index] = this.$t("总计");
          } else {
            sums[index] = shouldSumProps.includes(property)
              ? summary[property]
              : "-";
          }
        });
        return sums;
      };
    },
    async getSummarFn() {
      const { res } = await this.$axios.GET(systemConfig.urls.loseWinSheet.sumByLoginName, this.searchParams)
      if (res) {
        this.mbrSummary = this.processItem(res.page)
      }
    },
    getSummaries() {
      const { shouldToThousandProps } = this;
      const { level, isOnlyMember } = this.currentBreadcrumb.upper;
      if (isOnlyMember && level === "account") {
        // 获取会员详情总计
        return this.$axios
          .get(systemConfig.urls.loseWinSheet.sum, {
          // .get(systemConfig.urls.loseWinSheet.sumByLoginName, {
            params: this.searchParams,
          })
          .then((res) => {
            this.memberSummary = this.processItem(res.data.page);
          });
      } else {
        return this.$axios
          .get(systemConfig.urls.loseWinSheet.sum, {
            params: this.searchParams,
          })
          .then((res) => {
            this.summary = this.processItem(res.data.page);
          });
      }
    },
    getLowerTableData() {
      if (this.isMbr) {
        return this.getMbrLowTable()
      }
      const lowerIsOnlyMember = this.currentBreadcrumb.lower.isOnlyMember;
      const upperIsOnlyMember = this.currentBreadcrumb.upper.isOnlyMember;
      const currentLayerIsAgent =
        this.currentBreadcrumb.upper.level !== "account";

      if (upperIsOnlyMember) {
        return Promise.resolve();
      }
      return this.$axios
        .get(
          lowerIsOnlyMember
            ? systemConfig.urls.loseWinSheet.loginNameList
            : currentLayerIsAgent && this.isSubAgentShow
            ? // 获取下级代理
              systemConfig.urls.loseWinSheet.findWinLostReportViewAgent
            : // 获取下级会员
              systemConfig.urls.loseWinSheet.listLevel,
          {
            params: {
              ...this.searchParams,
              pageSize: this.pageSize,
              pageNo: this.currentPage,
              orderBy: this.orderBy.lower,
            },
          }
        )
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.totalCount = res.data.page.totalCount;
          this.lowerTableData = this.processTableData(
            res.data.page.list,
            lowerIsOnlyMember
          );
        });
    },
    async getSelftTableData() {
      const { username, loginName, agyflag } = this.searchParams
      const params = {
        ...this.searchParams,
        agyflag: username !== loginName ? null : agyflag,
        orderBy: this.orderBy.upper
      }
      const { res } = await this.$axios.GET(systemConfig.urls.loseWinSheet.account, params)
      if (res) {
        this.selfTableData = res.page.map(i => this.processItem(i))
      }
    },
    getUpperTableData() {
      const {
        upper: { isOnlyMember },
      } = this.currentBreadcrumb;
      return this.$axios
        .get(
          // isOnlyMember
          //   ? systemConfig.urls.loseWinSheet.account :
            systemConfig.urls.loseWinSheet.reportList,
          {
            params: {
              ...this.searchParams,
              orderBy: this.orderBy.upper,
            },
          }
        )
        .then((res) => {
          this.upperTableData = this.processTableData(
            res.data.data
          );
        });
    },
    processItem(item) {
      // item.payoutTotal = -item.payoutTotal
      const profitRatio = item.validbetTotal
        ? (item.payoutTotal / item.validbetTotal) * 100
        : 0;
      item.profitRatio = !profitRatio ? "--" : profitRatio.toFixed(2) + "%";
      for (let key of this.shouldToThousandProps) {
        item[key] = item[key] === "--" ? item[key] : toThousands(item[key]);
      }
      return item;
    },
    processTableData(data, isOnlyMember) {
      return data.map((item) => {
        const processedItem = this.processItem(item);
        processedItem.isOnlyMember = isOnlyMember;
        processedItem.levelDisplayName = this.levelDisplayNameMapper(
          processedItem.level
        );
        return processedItem;
      });
    },
    getLastUpdate() {
      this.$axios
        .get(systemConfig.urls.loseWinSheet.getLastUpdate)
        .then((res) => {
          this.lastUpdateDate = res.data.data.betLastDate;
          /* console.log("TCL: getLastUpdate -> this.lastUpdateDate", res.data.data.betLastDate) */
        });
    },
    getBannerList(usernameType, searchName) {
      const isAgent = usernameType > 1;

      return this.$axios
        .get(
          isAgent
            ? systemConfig.urls.getAgentBanner
            : systemConfig.urls.getMbrBanner,
          {
            params: {
              [isAgent ? "agyAccount" : "loginName"]: searchName,
            },
          }
        )
        .then(({ data }) => {
          // 被搜索的用户的等级
          const { levelDisplayNameMapper } = this;
          // usernameType 1为会员 2为代理 3为总代 undefined不存在该账号
          const searchLevel =
            usernameType && ["account", "1", "0"][usernameType - 1];

          if (data.data.length || searchLevel === "0") {
            return [
              {
                upper: {
                  level: null,
                  levelDisplayName: this.$t("股东"),
                },
                lower: {},
              },
              ...data.data.map(({ bannerType, id, parentId, agyAccount }) => {
                const level =
                  bannerType === "agent" ? (parentId ? "1" : "0") : "account";
                return {
                  upper: {
                    level,
                    username: agyAccount,
                    levelDisplayName: levelDisplayNameMapper(level),
                  },
                  lower: {},
                };
              }),
              {
                upper: {
                  level: searchLevel,
                  username: searchName,
                  levelDisplayName: levelDisplayNameMapper(searchLevel),
                },
                lower: {},
              },
            ];
          } else {
            return [
              {
                upper: {},
                lower: {},
              },
            ];
          }
        });
    },
    async handleSearch({ type }) {
      //this.pageSize=20;
      if (type === "resetAndSearch") {
        //重置
        /* this.breadcrumbs = [] */
        /* this.initSearchTime() */
        this.isSubAgentShow = true;
        this.selectBool = false;
        this.$refs.searchTime.defaultType = ''
        this.defaultTypeP = ''
        return;
      } else {
        let usernameType; // 1为会员 2为代理 3为总代 0不存在当前会员或代理
        const { username, searchRange } = this.searchCriteria.keys;
        if (username && !searchRange) {
          this.$message.warning(this.$t("请选择查询范围"));
          return;
        }
        const isOnlyMember = searchRange === "onlyMember";
        const isQueryUsernameChanged =
          username !== this.currentBreadcrumb.upper.username;
        const isUpperOnlyMemberChanged =
          !!this.currentBreadcrumb.upper.isOnlyMember !== isOnlyMember;

        // 如果切换了搜索条件
        if (isQueryUsernameChanged || isUpperOnlyMemberChanged) {
          this.breadcrumbs = this.breadcrumbs.slice(0, 1);
          const { searchRange } = this.searchCriteria.keys
          // 根据username获取usernameType
          const flag = { flag: isOnlyMember || searchRange === 'agyflag' ? 1 : 0 }; // 查询账号是否存在， 会员账号1 代理账号0
          username &&
            (await this.getTypeByUsername(flag).then(
              (type) => (usernameType = type)
            ));
          if (username) {
            if (
              usernameType === 0 ||
              (isOnlyMember && usernameType > 1) ||
              (!isOnlyMember && searchRange !== 'agyflag' && usernameType === 1)
            ) {
              this.$message.error(this.$t("您搜索的用户不存在"));
              return;
            }
            // const usernameType = searchRange === 'onlyMember' ? 1 : 2// 1 会员 2代理 0空
            const bannerList = await this.getBannerList(usernameType, username);
            this.breadcrumbs = bannerList;
          } else {
            // 仅查询会员且用户名为空
            this.breadcrumbs = [
              {
                upper: {},
                lower: {
                  isOnlyMember: true,
                },
              },
            ];
          }
          this.initQuery();
        }
        if (this.breadcrumbs.length) {
          if (isOnlyMember) {
            // 如果是仅查询会员   username为空 则查询站点下所有会员 不为空则直接跳到会员详情
            this.breadcrumbs[
              this.breadcrumbs.length - 1
            ].upper.isOnlyMember = !!username;
            this.breadcrumbs[
              this.breadcrumbs.length - 1
            ].lower.isOnlyMember = true;
          } else {
            this.breadcrumbs[
              this.breadcrumbs.length - 1
            ].upper.isOnlyMember = false;
            this.breadcrumbs[
              this.breadcrumbs.length - 1
            ].lower.isOnlyMember = false;
          }
        }
      }
      this.getTableData("handleSearch");
    },
    initSearchTime() {
      this.$refs.searchTime.handleTimeQuickSelect("currentMonth");
    },
    handleViewMbrChange(type) {
      this.isNextAgy = type !== 'account'
      this.getMbrLowTable()
    },
    handleViewChange(isSubAgentShow) {
      this.isSubAgentShow = isSubAgentShow;
      this.getTableData();
    },
    findWinLostReportView() {
      if (this.currentLayerIsSubAgent) {
        return this.$axios
          .get(systemConfig.urls.loseWinSheet.findWinLostReportView, {
            params: {
              ...this.searchParams,
              orderBy: this.orderBy.upper,
            },
          })
          .then(({ data }) => {
            const viewTableData = [
              "subordinateAgent",
              "directAccount",
              "allSubordinates",
            ]
              .map((key) => data.page[key])
              .map((item) => this.processItem(item));

            this.viewTableData = viewTableData;
          });
      }
      return Promise.resolve();
    },
    getTableData(source) {
      this.getCurrentRecodeTime()
      // 初始化数据
      this.upperTableData = [];
      this.lowerTableData = [];
      this.memberTableData = [];
      //this.pageSize=20;
      this.enterNum = 0;
      this.summary = {};
      this.memberSummary = {};
      if (source == "handleSearch") {
        if (!this.isSearch) {
          this.$message({
            type: "warning",
            message: this.$t("请输入完整的时间段"),
          });
          return;
        }
      }
      this.isLoading = true;
      const promises = this.isMbr ? [
        this.getUpperTableData(),
        this.getFindWinLostReportMbrView(),
        this.getSelftTableData(),
        this.getLowerTableData(),
      ] : [
        this.getUpperTableData(),
        this.getLowerTableData(),
        this.findWinLostReportView(),
      ]
      Promise.all(promises)
        .then(() => {
          if (source == "handleSearch") {
            this.selectBool = true;
          }
          // 获取数据后更新面包屑
          const [newUpper] = this.upperTableData;
          const [newLower] = this.lowerTableData;
          const { upper, lower } = this.currentBreadcrumb;
          // debugger
          this.breadcrumbs.splice(-1, 1, {
            upper: { ...newUpper, isOnlyMember: upper.isOnlyMember },
            lower: { ...newLower, isOnlyMember: lower.isOnlyMember },
          });
          // 获取总计  getSummarFn
          const arr = this.isMbr ? [
            this.getSummaries(),
            this.getSummarFn(),
            this.getMbrLowTable()
          ] : [this.getSummaries(), this.getMemberTableData()]
          Promise.all(arr).then(
            () => {
              this.isLoading = false;
            }
          );
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-button {
  user-select: text;
}
.lose-win-tips {
  line-height: 22px;
  font-size: 14px;
  color: #03a9f4;
}
.layer-bread {
  display: flex;
  width: 100%;
  font-size: 16px !important;
  align-items: center;
  .lose-win-breadcrumb {
    font-size: 16px !important;
    line-height: 34px;
    .el-button--small {
      /deep/ span {
        font-size: 16px;
      }
    }
  }
  .member-count {
    flex: 1;
    text-align: right;
  }
  .lower-table-count {
    flex: 1;
    text-align: left;
  }
}
</style>
