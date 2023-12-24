<template>
  <div class="withdraw-clock-detail">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="date" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data">
      <!-- 表格插槽 -->
    </TableCom>
  </div>
</template>

<script>
import systemConfig from "../../config/config";
import {mapGetters} from "vuex";

export default {
  name: "WithdrawClockDetail",
  data(){
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
        },
        meta: [
          {
            label: this.$t("日期"),
            slotName: "date",
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
                label: this.$t("本月"),
                value: "currentMonth",
              },
              {
                label: this.$t("近三月"),
                value: "lastThreeMonths",
              },
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          prop: "loginName",
          label: this.$t("会员账号"),
        },
        {
          prop: "realName",
          label: this.$t("真实姓名"),
        },
        {
          prop: "tierName",
          label: this.$t("VIP等级"),
        },
        {
          prop: "lockUser",
          label: this.$t("锁定人员"),
        },
        {
          prop: "locktime",
          label: this.$t("锁定时间"),
          width: 150
        },
        {
          prop: "lockmemo",
          label: this.$t("锁定备注"),
        },
        {
          prop: "unlockuser",
          label: this.$t("解锁人员"),
        },
        {
          prop: "unlocktime",
          label: this.$t("解锁时间"),
          width: 150
        },
        {
          prop: "unlockmemo",
          label: this.$t("解锁原因"),
        },
      ],
      accountId: null,
    }
  },
  created() {
    console.log(this.$route)
    this.accountId = this.$route.query.accountId
    this.getTableData()
  },
  methods:{
    getTableData() {
      this.$axios
        .get(systemConfig.urls.depositLockLog, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            accountId: this.accountId,
            startTime:this.searchCriteria.keys.startTime?this.searchCriteria.keys.startTime:'',
            endTime:this.searchCriteria.keys.endTime?this.searchCriteria.keys.endTime:'',
          },
        })
        .then((res) => {
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              return item;
            });
          }
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.withdraw-clock-detail{
}
</style>
