<template>
  <div class="member-warning">
    <TableSearchBar
      :currentPage.sync="params.pageNo"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="selectTime"
        :left="40"
        :selections="searchCriteria.meta[0].options"
        :startTime.sync="searchCriteria.keys.startTime"
        :endTime.sync="searchCriteria.keys.endTime"
      />
    </TableSearchBar>
    <el-radio-group v-model="type" class="radio-box" @change="handleTypeChange">
      <el-radio-button :label="i" v-for="(item, i) in typeList" :key="i">{{
        item
      }}</el-radio-button>
    </el-radio-group>
    <transition name="el-fade-in">
      <!-- 全局组件 表格组件 -->
      <TableCom
        v-show="type !== 3"
        :hasRemoveBtn="false"
        :hasAddBtn="false"
        :tableData="tableData"
        :totalCount="totalCount"
        :pageSize.sync="params.pageSize"
        :currentPage.sync="params.pageNo"
        :tableColumns="tableColumns"
        :tableLoading="loading"
        @reloadData="getTableData"
        :showLoadTime="true"
        :networkLoadTime="networkLoadTime"
        :dataSolveTime="dataSolveTime"
      >
      </TableCom>
    </transition>
    <transition name="el-fade-in">
      <!-- 全局组件 表格组件 -->
      <TableCom
        v-show="type === 3"
        :hasPagination="false"
        :hasRemoveBtn="false"
        :hasAddBtn="false"
        :tableData="condition.list"
        :tableColumns="conditionColumns"
        :tableLoading="condition.loading"
        :showLoadTime="true"
        :networkLoadTime="networkLoadTime"
        :dataSolveTime="dataSolveTime"
      >
      </TableCom>
    </transition>
    <el-dialog
      :title="$t('预警处理')"
      :visible.sync="showWarning"
      width="400px!important"
      @closed="handleWarningClosed"
    >
      <div class="warning-tips">
        {{ $t('您确定已知晓预警信息并已做好相关处理工作吗？') }}
      </div>
      <el-form ref="warnform" :model="warningForm" label-width="auto">
        <el-form-item
          :label="$t('备注')"
          prop="memo"
          :rules="[{ required: true, message: $t('请输入备注'), trigger: 'blur' }]"
        >
          <el-input
            type="textarea"
            :placeholder="$t('备注')"
            v-model="warningForm.memo"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleDeal" :loading="formLoading"
          >{{ $t('确定') }}</el-button
        >
        <el-button type="primary" @click="showWarning = false">{{ $t('取消') }}</el-button>
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
          startTime: null,
          endTime: null,
        },
        meta: [
          {
            label: this.$t("时间"),
            slotName: "selectTime",
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
            ],
          },
        ],
      },
      params: {
        pageNo: 1,
        pageSize: 10,
      },
      type: 0,
      tableData: [],
      totalCount: 0,
      loading: false,
      showWarning: false,
      currentRow: {},
      warningForm: {
        memo: "",
      },
      formLoading: false,
      condition: {
        list: [],
        loading: false,
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  computed: {
    conditionColumns() {
      return [
          {
            label: this.$t("序号"),
            render: (h, row, scope) => h("span", scope.$index + 1),
            width: 60,
          },
          {
            label: this.$t("预警名称"),
            render: (h, row) => h("span", this.typeTransfer[row.type]),
            width: 150,
          },
          { label: this.$t("预警内容"), prop: "content" },
          {
            label: this.$t("状态"),
            render: (h, row) =>
              h("el-switch", {
                attrs: {
                  "active-value": 1,
                  "inactive-value": 0,
                  value: row.status,
                },
                on: { change: () => this.handleStatusChange(row) },
              }),
            width: 150,
          },
        ]
    },
    tableColumns() {
      return [
        {
          label: this.$t("序号"),
          render: (h, row, scope) => h("span", scope.$index + 1),
          width: 60,
        },
        { label: this.$t("预警时间"), width: 150, prop: "createTime" },
        { label: this.$t("预警会员账号"), prop: "loginName" },
        {
          label: this.$t("预警条件"),
          width: 250,
          render: (h, row) =>
            h("div", [h("div", row.exContent), h("div", row.content)]),
        },
        {
          label: this.$t("状态"),
          render: (h, row) =>
            row.status === 1
              ? h("span", this.$t("已处理"))
              : h(
                  "el-button",
                  {
                    attrs: { size: "mini", type: "primary" },
                    on: { click: () => this.handleDealWarning(row) },
                  },
                  this.$t("待处理")
                ),
        },
        { label: this.$t("处理时间"), width: 150, prop: "dealTime" },
        { label: this.$t("处理人账号"), prop: "dealUser" },
        { label: this.$t("备注"), prop: "memo" },
      ]
    },
    typeList() {
      return [this.$t("全部"), this.$t("待处理"), this.$t("已处理"), this.$t("预警条件")]
    },
    typeTransfer() {
      return {
        1: this.$t("持续盈利"),
        2: this.$t("盈利比例高"),
        3: this.$t("盈利金额大"),
        4: this.$t("优惠比例"),
        5: this.$t("同IP投注"),
        6: this.$t("同设备投注"),
      };
    }
  },
  methods: {
    async handleStatusChange({ id, status }) {
      const { res } = await this.$axios.GET(
        this.$urls.mbrwarning.switchCondition,
        { id, status: status === 0 ? 1 : 0 }
      );
      if (res) {
        this.$message.success(this.$t("操作成功"));
        this.getConditionList();
      }
    },
    handleWarningClosed() {
      this.warningForm.memo = "";
      this.$refs.warnform.clearValidate();
    },
    handleDeal() {
      const submit = async () => {
        const body = {
          id: this.currentRow.id,
          memo: this.warningForm.memo,
        };
        this.formLoading = true;
        const { res } = await this.$axios.POST(
          this.$urls.mbrwarning.dealWith,
          body
        );
        this.formLoading = false;
        if (res) {
          this.$message.success(this.$t("操作成功"));
          this.showWarning = false;
          this.getTableData();
        }
      };
      this.$refs.warnform.validate((isOk) => isOk && submit());
    },
    handleDealWarning(row) {
      this.currentRow = row;
      this.showWarning = true;
    },
    handleTypeChange() {
      if (this.type !== 3) {
        this.getTableData();
      } else {
        this.getConditionList();
      }
    },
    async getConditionList() {
      this.condition.loading = true;
      this.getCurrentRecodeTime()
      const { res, response } = await this.$axios.GET(
        this.$urls.mbrwarning.conditionList
      );
      this.condition.loading = false;
      if (res) {
        const { data } = res;
        this.condition.list = data;
        this.getNetworkLoadAndDataSolveTime(response)
      }
    },
    async getTableData() {
      const type = this.type;
      const { keys } = this.searchCriteria;
      const params = {
        ...keys,
        ...this.params,
      };
      if (type === 1 || type === 2) {
        params.status = type === 1 ? 0 : 1;
      }
      this.loading = true;
      this.getCurrentRecodeTime()
      const {res, response } = await this.$axios.GET(this.$urls.mbrwarning.list, params);
      this.loading = false;
      this.getNetworkLoadAndDataSolveTime(response)
      if (res) {
        const {
          data: { list, totalCount },
        } = res;
        this.tableData = list;
        this.totalCount = totalCount;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.member-warning {
  .radio-box {
    margin: 15px auto 5px;
  }
  .warning-tips {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
