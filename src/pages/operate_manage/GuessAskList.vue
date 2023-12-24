<template>
  <div>
    <TableCom
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :tableColumns="tableColumns"
      :pageSize.sync="params.pageSize"
      :currentPage.sync="params.pageNo"
      :tableLoading="loading"
      @reloadData="getList"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <el-button type="primary" @click="handleAdd">{{ $t('新增') }}</el-button>
    </TableCom>
    <el-dialog
      :title="`${addForm.id ? $t('编辑') : $t('新增')}`"
      :visible.sync="showAdd"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="160px"
        :rules="addFormRules"
      >
        <el-form-item :label="$t('前台排序号')" prop="orderNo">
          <el-input
            type="number"
            :placeholder="$t('请输入前台排序号')"
            v-model.number="addForm.orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('提问标题')" prop="question">
          <el-input
            :placeholder="$t('6-50个字')"
            v-model="addForm.question"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('提问回答')" prop="answer">
          <el-input
            type="textarea"
            :placeholder="$t('6-200个字')"
            v-model="addForm.answer"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('是否启用')" prop="isOpen">
          <el-radio-group v-model="addForm.isOpen">
            <el-radio :label="true">{{ $t('是') }}</el-radio>
            <el-radio :label="false">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center">
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleAddSubmit"
          >{{ $t('保存') }}</el-button
        >
        <el-button @click="showAdd = false">{{ $t('取消') }}</el-button>
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
      tableData: [],
      totalCount: 0,
      tableColumns: [
        {
          label: this.$t("序号"),
          width: 70,
          render: (h, row, scope) => h("span", scope.$index + 1),
        },
        { label: this.$t("提问标题"), width: 180, prop: "question" },
        { label: this.$t("提问回答"), prop: "answer" },
        { label: this.$t("更新时间"), width: 150, prop: "updatetime" },
        {
          label: this.$t("是否启用"),
          width: 120,
          render: (h, row) =>
            h("el-switch", {
              attrs: { value: row.isOpen },
              on: { change: () => this.handleStatusChange(row) },
            }),
        },
        {
          label: this.$t("操作"),
          width: 150,
          render: (h, row) =>
            h("div", [
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.handleUpdate(row) },
                },
                this.$t("编辑")
              ),
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.handleDelete(row) },
                },
                this.$t("删除")
              ),
            ]),
        },
      ],
      params: {
        pageNo: 1,
        pageSize: 10,
      },
      addForm: {
        isOpen: true,
      },
      loading: false,
      showAdd: false,
      submitLoading: false,
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    addFormRules() {
      const Ovalidator = (rule, value, callback) => {
        const len = value.toString().length;
        if (len > 5) return callback(this.$t("请输入5位以内数值"));
        callback();
      };
      const Qvalidator = (rule, value, callback) => {
        const len = value.length;
        if (len < 6 || len > 50) return callback(this.$t("6-50个字"));
        callback();
      };
      const Avalidator = (rule, value, callback) => {
        const len = value.length;
        if (len < 6 || len > 200) return callback(this.$t("6-200个字"));
        callback();
      };
      return {
        orderNo: [
          { required: true, message: this.$t("请输入前台排序号"), trigger: "blur" },
          { validator: Ovalidator, trigger: "blur" },
        ],
        question: [
          { required: true, message: this.$t("请输入提问标题"), trigger: "blur" },
          { validator: Qvalidator, trigger: "blur" },
        ],
        answer: [
          { required: true, message: this.$t("请输入提问回答"), trigger: "blur" },
          { validator: Avalidator, trigger: "blur" },
        ],
        isOpen: [
          { required: true, message: this.$t("请选择是否启用"), trigger: "blur" },
        ],
      };
    },
  },
  methods: {
    async handleStatusChange(row) {
      const { isOpen } = row;
      const { res } = await this.$axios.POST(this.$urls.guessAsk.update, {
        ...row,
        isOpen: !isOpen,
      });
      if (res) {
        this.$message.success(this.$t("操作成功"));
        this.getList();
      }
    },
    handleAddSubmit() {
      const submit = async () => {
        const body = {
          ...this.addForm,
        };
        const url = this.$urls.guessAsk[body.id ? "update" : "save"];
        this.submitLoading = true;
        const { res } = await this.$axios.POST(url, body);
        this.submitLoading = false;
        if (res) {
          this.$message.success(this.$t("操作成功"));
          this.showAdd = false;
          this.getList();
        }
      };
      this.$refs.addForm.validate((isOk) => isOk && submit());
    },
    handleUpdate(row) {
      this.showAdd = true;
      this.addForm = row;
    },
    handleAdd() {
      this.addForm = {
        orderNo: null,
        question: null,
        answer: null,
        isOpen: true,
      };
      this.$refs.addForm && this.$refs.addForm.clearValidate();
      this.showAdd = true;
    },
    handleDelete(row) {
      const submit = async () => {
        const { id } = row;
        const { pageNo } = this.params;
        const { res } = await this.$axios.POST(this.$urls.guessAsk.delete, {
          id,
        });
        if (res) {
          this.$message.success(this.$t("删除成功"));
          if (this.tableData.length <= 1 && pageNo > 1) {
            this.params.pageNo--;
          }
          this.getList();
        }
      };
      this.$confirm(this.$t("是否删除") + " ?", this.$t("删除"), {
        type: "warning",
        center: true,
      }).then(() => submit());
    },
    async getList() {
      this.getCurrentRecodeTime()
      this.loading = true;
      const obj = await this.$axios.GET(
        this.$urls.guessAsk.list,
        this.params
      );
      const { res, response } = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false;
      if (res) {
        const { list, totalCount, totalPage } = res.page;
        this.tableData = list;
        this.totalCount = totalCount;
      }
    },
  },
};
</script>
