<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      :meta="isPromp ? metaCur : metaRecode"
      @reloadData="getTableData"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        type="datetime"
        ref="searchTime"
        slot="searchTime"
        :width="450"
        :startTime.sync="searchCriteria.keys.startTime"
        :endTime.sync="searchCriteria.keys.endTime"
      />
      <template v-slot:endBtn>
        <el-button
          v-show="isPromp && permissions.creatPromo"
          type="primary"
          size="small"
          @click="showCreatePromo = true"
          >{{ $t('生成优惠码') }}</el-button
        >
      </template>
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="isPromp ? tableColumns : tableColumnsRecode"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <!-- 表格插槽 -->
      <el-table-column width="200" align="center" :label="$t('有效时间')" slot="effStartTime">
        <template slot-scope="scope">
          <span class="blue-color pointer">
            <div>{{ scope.row.effStartTime }}</div>
            <div>{{ scope.row.effEndTime }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation">
        <template slot-scope="scope">
          <span class="blue-color pointer">
            <span
              style="cursor: pointer"
              :data-clipboard-text="scope.row.promoCode"
              class="copyBtn"
              @click="setClipboard()"
              >{{ $t('复制') }}</span
            >
          </span>
        </template>
      </el-table-column>
    </TableCom>
    <creat-promo
      v-if="showCreatePromo"
      :showCreatePromo.sync="showCreatePromo"
      :activityDonateCreateList="activityDonateCreateList"
      @updateTable="getTableData()"
    ></creat-promo>
  </div>
</template>

  <script>
import queryStore from "@/mixins/queryStore";
import systemConfig from "@/config/config.js";
import { mapGetters } from "vuex";
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelector";
import CreatPromo from "./creatPromo.vue";
import Mixin from "@/mixins/loadTime";
import Clipboard from "clipboard";
import { lang } from "@/i18n";

export default {
  name: "activityIntroduction",
  components: {
    StartAndEndTimeSelector,
    CreatPromo,
  },
  mixins: [Mixin, queryStore(["searchCriteria.keys"])],
  data() {
    return {
      searchCriteria: {
        keys: {
          promoCode: null,
          loginName: null,
          activityId: null,
          amount: null,
          startTime: null,
          endTime: null,
        },
      },
      meta: [
        {
          type: "text",
          label: lang("优惠码"),
          prop: "promoCode",
        },
        {
          type: "text",
          label: lang("会员名"),
          prop: "loginName",
        },
        {
          type: "select",
          label: lang("活动规则"),
          prop: "activityId",
          options: [],
        },
        {
          type: "select",
          label: lang("赠送金额"),
          prop: "amount",
          options: [],
        },
      ],
      tableColumns: [
        {
          type: "index",
          label: lang("序号"),
        },
        {
          prop: "promoCode",
          label: lang("优惠码"),
        },
        {
          prop: "bindLoginName",
          label: lang("会员名"),
        },
        // {
        //   prop: "createTime",
        //   label: lang("时间"),
        // },
        {
          slotName: 'effStartTime'
        },
        {
          prop: "statusText",
          label: lang("状态"),
        },
        {
          prop: "ruleName",
          label: lang("活动规则"),
        },
        {
          prop: "amount",
          label: lang("赠送金额"),
        },
        {
          prop: "memo",
          label: lang("备注"),
        },
        {
          slotName: "operation",
        },
      ],
      tableColumnsRecode: [
        {
          type: "index",
          label: lang("序号"),
        },
        {
          prop: "promoCode",
          label: lang("优惠码"),
        },
        {
          prop: "loginName",
          label: lang("会员名"),
        },
        {
          prop: "gotTime",
          label: lang("领取时间"),
        },
        {
          prop: "bindLoginNameNum",
          label: lang("绑定人数"),
        },
        {
          prop: "ruleName",
          label: lang("活动规则"),
        },
        {
          prop: "amount",
          label: lang("赠送金额"),
        },
        // {
        //   prop: "effStartTime",
        //   label: lang("有效时间"),
        // },
        {
          slotName: 'effStartTime'
        },
        {
          prop: "memo",
          label: lang("备注"),
        },
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isPromp: true,
      amountArr: [],
      showCreatePromo: false,
      activityDonateList: [],
      activityDonateCreateList: [],
      promoShow: true,
    };
  },
  computed: {
    permissions() {
      const { hasPermission } = this;
      return {
        creatPromo: hasPermission("operate:promocode:generatePromoCode"),
      };
    },
    metaCur () {
      return this.meta.concat({
        label: lang("创建时间"),
        slotName: "searchTime",
      })
    },
    metaRecode () {
      return this.meta.concat({
        label: lang("领取时间"),
        slotName: "searchTime",
      })
    },
    ...mapGetters(["hasPermission"]),
  },
  mounted() {
    this.getPromoCodeActivity();
    this.getPromoCodeAllActivity();
    // this.getTableData();
  },
  methods: {
    getActivityCategories() {
      this.$axios.get(systemConfig.urls.activityRule.category).then((res) => {
        this.activityCategories = [
          {
            label: this.$t("全部"),
            value: null,
          },
          ...res.data.page.map((item) => {
            return {
              label: item.tmplName,
              value: item.id,
            };
          }),
        ];
      });
    },
    setClipboard() {
      let clipboard = new Clipboard(".copyBtn");
      let self = this;
      clipboard.on("success", () => {
        self.$message({
          type: "success",
          message: "已复制成功",
        });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        console.log("🚀 error ~ file: index.vue:243 ~ clipboard.on ~ e", e);
        clipboard.destroy();
      });
    },
    getPromoCodeActivity() {
      this.$axios.get(systemConfig.urls.getPromoCodeActivity).then((res) => {
        const data = res.data.msg
        if (data && data.length > 0) {
          this.activityDonateCreateList = data.map(item => {
            const donateAmountList = this.toggleToRuleOptions(item.donateAmountList)
            return {
              label: item.activityName,
              value: item.id,
              donateAmountList,
            }
          })
        }
      });
    },
    getPromoCodeAllActivity() {
      this.$axios
        .get(systemConfig.urls.getPromoCodeAllActivity)
        .then((res) => {
          const data = res.data.msg
          if (data && data.length > 0) {
            this.activityDonateList = data.map(item => {
              const donateAmountList = this.toggleToRuleOptions(item.donateAmountList)
              return {
                label: item.activityName,
                value: item.id,
                donateAmountList,
              }
            })
            this.$set(this.meta[2], 'options', this.activityDonateList)
          }
        });
    },
    toggleToRuleOptions(arr) {
      return arr.map(item => {
        return {
          label: item,
          value: item
        }
      })
    },
    getTableData() {
      this.getCurrentRecodeTime();
      this.isPromp = this.$route.path === '/main/marketActivity/promoCode'
      this.$axios
        .get(
          this.isPromp
            ? systemConfig.urls.promoCodeList
            : systemConfig.urls.promoCodeRecordList,
          {
            params: {
              pageSize: this.pageSize,
              pageNo: this.currentPage,
              ...this.searchCriteria.keys,
            },
          }
        )
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          const data = res.data.msg
          const { totalCount, list } = data
          this.totalCount = totalCount
          this.tableData = list.map(item => {
            const { bindLoginName } = item
            return {
              ...item,
              statusText: ['', '未开始', '进行中', '已失效'][item.status]
            }
          })
        });
    },
  },
  watch: {
    $route: {
      handler(n, o) {
        // 两个列表区别较小，公用同一个，做列表差异区分
        const routeArr = [
          "/main/marketActivity/promoCode",
          "/main/marketActivity/promoCodeRecode",
        ];
        this.tableData = []
        const saveActivityDonateList = JSON.parse(JSON.stringify(this.activityDonateList))
        const saveActivityDonateCreateList = JSON.parse(JSON.stringify(this.activityDonateCreateList))
        Object.assign(this.$data, this.$options.data());
        this.activityDonateList = saveActivityDonateList
        this.activityDonateCreateList = saveActivityDonateCreateList
        this.$set(this.meta[2], 'options', this.activityDonateList)
        this.getTableData();
      },
      deep: true,
      immediate: true,
    },
    'searchCriteria.keys.activityId': {
      handler(n, o) {
        if (n === o) return
        const curAmountList = this.activityDonateList.find(item => item.value === n)
        this.$set(this.meta[3], 'options', curAmountList.donateAmountList)
      },
    },
  },
};
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
