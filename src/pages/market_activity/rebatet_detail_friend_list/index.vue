<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
      ref="searchFriendList"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        ref="searchTime"
        slot="searchTime"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.waterStart"
        :endTime.sync="searchCriteria.keys.waterEnd"
      />
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      :table-btns="[
        {
          event: 'export',
          text: $t('导出'),
          icon: 'iconfont icon-export el-button-export',
          loading: exportLoading,
          disabled: !this.tableData.length,
        },
      ]"
      @reloadData="getTableData"
      @export="handleExport"
      :tableLoading="loading"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
    </TableCom>
  </div>
</template>

<script>
import queryStore from "../../../mixins/queryStore";
import systemConfig from "../../../config/config.js";
import fileExport from "../../../mixins/fileExport";
import { mapGetters } from "vuex";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import Mixin from '@/mixins/loadTime'


export default {
  name: "bonusList",
  components: {
    StartAndEndTimeSelector,
  },
  mixins: [Mixin, queryStore(["searchCriteria.keys"]), fileExport],
  data() {
    return {
      loading: false,
      searchCriteria: {
        keys: {
          loginName: null,
          subLoginName: null,
          eventTimeStart: null,
          eventTimeEnd: null,
          incomeTimeStart: null,
          incomeTimeEnd: null,
          type: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("会员账号"),
            prop: "loginName",
          },

          {
            type: "text",
            label: this.$t("好友账号"),
            prop: "subLoginName",
          },

          {
            attrs: {
              width: 460
            },
            label: this.$t("统计时间"),
            type: "StartEndTime",
            keys: { startTime: "eventTimeStart", endTime: "eventTimeEnd" },
            pop: "eventTime",
          },

          {
            attrs: {
              width: 460
            },
            label: this.$t("发放时间"),
            type: "StartEndTime",
            keys: { startTime: "incomeTimeStart", endTime: "incomeTimeEnd" },
            pop: "createTime",
          },
          {
            width: "140px",
            type: "select",
            label: this.$t("发放类型"),
            prop: "type",
            options: [
              {
                label: this.$t("全选"),
                value: null,
              },
              {
                label: this.$t("好友首存返利"),
                value: 1,
              },
              {
                label: this.$t("首存自身返利"),
                value: 7,
              },
              {
                label: this.$t("流水返利"),
                value: 4,
              },
              {
                label: this.$t("好友VIP返利"),
                value: 5,
              },
              {
                label: this.$t("好友充值返利"),
                value: 6,
              },
            ],
            clearable: true,
          },
          // {
          //   type: "select",
          //   label: "状态",
          //   prop: "useStateList",
          //   options: [
          //     {
          //       label: "全选",
          //       value: null,
          //     },
          //     {
          //       label: "已发放",
          //       value: 0,
          //     },
          //     {
          //       label: "未发放",
          //       value: 1,
          //     },
          //   ],
          //   multiple: true,
          // },
        ],
      },
      tableColumns: [
        // {
        //   type: 'index',
        //   label: '序号'
        // },
        {
          prop: "loginName",
          label: this.$t("会员账号"),
        },
        {
          prop: "subLoginName",
          label: this.$t("好友账号"),
        },
        {
          prop: "incomeTime",
          label: this.$t("统计时间"), // 统计某天收益
        },
        {
          prop: "createTime",
          label: this.$t("发放时间"), // 返利实际发放时间
        },
        {
          prop: "reward",
          label: this.$t("发放金额"),
        },
        {
          prop: "typeStr",
          label: this.$t("发放类型"),
        },
        {
          slotName: "bonusStatistics",
        },
      ],
      tableData: [],
      pageSize: 50,
      currentPage: 1,
      totalCount: null,
      exportLoading: false,
      activityCategories: [],
    };
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    permissions() {
      const { hasPermission } = this;
      return {
        audit: hasPermission("operate:activity:activityAuditList"),
      };
    },
    ...mapGetters(["hasPermission"]),
  },
  created() {
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.getCurrentRecodeTime()
      this.loading = true;
      this.$axios
        .get(systemConfig.urls.getrebateDetailFriendList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
          },
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.loading = false;
          if (res && res.data.code === 0) {
            const { totalCount, list } = res.data.page
            this.totalCount = totalCount
            this.tableData = list
          }
        });
    },

    async handleExport() {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
      };
      this.exportLoading = true;
      const { res } = await this.$axios.GET(
        this.$urls.getexportRebateDetailFriendList,
        params
      );
      if (res) {
        await this.agentCheckFile(
          "export_rebatefriend_list",
          this.$urls.getcheckFile
        );
      }
      this.exportLoading = false;
    },
  },
  watch: {
  },
};
</script>
