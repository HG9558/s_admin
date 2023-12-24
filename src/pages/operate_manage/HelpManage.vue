<template>
  <div>
    <div>
      <el-button
        v-for="(item, i) in btnList"
        :key="i"
        :type="actBtnIndex === i ? 'primary' : ''"
        @click="handleBtnClick(i)"
        >{{ item.label }}</el-button
      >
    </div>
    <TableCom
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :tableColumns="tableColumns"
      :pageSize.sync="listParams.pageSize"
      :currentPage.sync="listParams.pageNo"
      :tableBtns="[
        {
          event: 'addbtn',
          text: addText,
          type: 'primary',
          disabled: !hasPermission('operate:oprhelp:save'),
        },
      ]"
      :tableLoading="loading"
      @addbtn="handleAdd"
      @reloadData="getList"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"

    ></TableCom>
    <el-dialog
      :title="addForm.id ? $t('编辑') : addText"
      :visible.sync="isShowAdd"
      destroy-on-close
    >
      <div>
        <el-form
          :model="addForm"
          :rules="formRules"
          ref="addForm"
          aria-label="right"
          label-width="150px"
        >
          <template v-if="actBtnIndex === 0">
            <el-form-item :label="$t('分类名称')" prop="helpCategoryName">
              <el-input
                :placeholder="$t('请输入分类名称')"
                v-model="addForm.helpCategoryName"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('前台排序号')" prop="outRangId">
              <el-input
                :placeholder="$t('请输入前台排序号')"
                type="number"
                v-model.number="addForm.outRangId"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('图标')" prop="picPath" class="uploader">
              <input
                type="text"
                class="filename"
                v-model="picPathStr"
                style="width: calc(100% - 100px)"
              />
              <input type="button" name="file" class="button" :value="$t('浏览')" />
              <input
                ref="pc"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                @change="getPcPath($event)"
              />
              <span
                v-show="addForm.picPath && !picPathStr"
                class="upload-span"
                @click="previewImgOpen"
                >{{ $t('查看已上传的图片') }}</span
              >
              <span class="img-type-tips"
                >{{ $t('建议图片尺寸 28*28px ，支持格式png/jpg') }}</span
              >
            </el-form-item>
            <el-form-item :label="$t('是否启用')" prop="available">
              <el-radio-group v-model.number="addForm.available">
                <el-radio :label="1">{{ $t('是') }}</el-radio>
                <el-radio :label="0">{{ $t('否') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="actBtnIndex === 1">
            <el-form-item :label="$t('所属分类')" prop="helpCategoryId">
              <el-select
                :placeholder="$t('请选择所属分类')"
                v-model="addForm.helpCategoryId"
              >
                <el-option
                  v-for="(item, i) in categoryList"
                  :key="i"
                  :label="item.helpCategoryName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('标题名称')" prop="titleName">
              <el-input
                :placeholder="$t('请输入标题名称')"
                v-model="addForm.titleName"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="actBtnIndex === 2">
            <el-form-item :label="$t('所属分类')" prop="helpCategoryId">
              <el-select
                :placeholder="$t('请选择所属分类')"
                v-model="addForm.helpCategoryId"
                @change="handleCategoryChange"
              >
                <el-option
                  v-for="(item, i) in categoryList"
                  :key="i"
                  :label="item.helpCategoryName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('标题名称')" prop="helpTitleId">
              <el-select
                :placeholder="$t('请选择标题名称')"
                v-model="addForm.helpTitleId"
              >
                <el-option
                  v-for="(item, i) in contentTitleList"
                  :key="i"
                  :label="item.titleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('内容标题')" prop="contentTitle">
              <el-input
                :placeholder="$t('请输入内容标题')"
                v-model="addForm.contentTitle"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('帮助内容')" prop="helpContent">
              <el-input
                type="textarea"
                :placeholder="$t('帮助内容')"
                v-model="addForm.helpContent"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="center">
        <el-button @click="isShowAdd = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >{{ $t('保存') }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="picPreviewShow" class="center transparent">
      <img
        :src="addForm.picPath"
        alt=""
        style="max-width: 100%; min-width: 80px"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "helpManage",
  data() {
    return {
      btnList: [{ label: this.$t("分类") }, { label: this.$t("标题") }, { label: this.$t("内容") }],
      tableColumnsSort: [
        {
          label: this.$t("序号"),
          width: 70,
          render: (h, row, scope) => h("span", scope.$index + 1),
        },
        { label: this.$t("分类名称"), prop: "helpCategoryName" },
        {
          label: this.$t("图标"),
          width: 150,
          render: (h, row) =>
            h("img", { attrs: { src: row.picPath, width: "100px" } }),
        },
        { label: this.$t("创建时间"), width: 200, prop: "createTime" },
        {
          label: this.$t("是否启用"),
          width: 200,
          render: (h, row) =>
            h("el-switch", {
              on: {
                change: (val) => {
                  this.handleEnableCategory(row);
                },
              },
              attrs: {
                value: row.available,
                activeValue: 1,
                inactiveValue: 0,
                disabled: !this.hasPermission("operate:oprhelp:enableCategory"),
              },
            }),
        },
        {
          label: this.$t("操作"),
          width: 200,
          render: (h, row) =>
            h("span", [
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.handleEdit(row) },
                },
                this.$t("编辑")
              ),
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.delItem(row) },
                },
                this.$t("删除")
              ),
            ]),
        },
      ],
      tableColumnsTitle: [
        {
          label: this.$t("所属分类"),
          render: (h, row) => {
            const { helpCategoryId } = row;
            const obj =
              this.categoryList.find((i) => i.id === helpCategoryId) || {};
            return h("span", obj.helpCategoryName);
          },
        },
        { label: this.$t("标题"), prop: "titleName" },
        { label: this.$t("创建时间"), width: 200, prop: "createTime" },
        {
          label: this.$t("操作"),
          width: 200,
          render: (h, row) =>
            h("span", [
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.handleEdit(row) },
                },
                this.$t("编辑")
              ),
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.delItem(row) },
                },
                this.$t("删除")
              ),
            ]),
        },
      ],
      tableColumnsContent: [
        {
          label: this.$t("所属分类"),
          render: (h, row) => {
            const { helpCategoryId } = row;
            const obj =
              this.categoryList.find((i) => i.id === helpCategoryId) || {};
            return h("span", obj.helpCategoryName);
          },
        },
        {
          label: this.$t("标题"),
          render: (h, row) => {
            const { helpTitleId } = row;
            const obj = this.titleList.find((i) => i.id === helpTitleId) || {};
            return h("span", obj.titleName);
          },
        },
        { label: this.$t("内容标题"), prop: "contentTitle" },
        { label: this.$t("创建时间"), width: 200, prop: "createTime" },
        {
          label: this.$t("操作"),
          width: 200,
          render: (h, row) =>
            h("span", [
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.handleEdit(row) },
                },
                this.$t("编辑")
              ),
              h(
                "span",
                {
                  class: "blue-color pointer",
                  on: { click: () => this.delItem(row) },
                },
                this.$t("删除")
              ),
            ]),
        },
      ],
      listParams: {
        pageNo: 1,
        pageSize: 10,
      },
      addForm: {
        available: 1,
      },
      tableData: [],
      categoryList: [],
      titleList: [],
      contentTitleList: [],
      actEditItem: {},
      totalCount: 0,
      actBtnIndex: 0,
      submitLoading: false,
      isShowAdd: false,
      loading: false,
      picPreviewShow: false,
      picPathStr: "",
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    addText() {
      const obj = [this.$t("新增分类"), this.$t("新增标题"), this.$t("新增内容")];
      return obj[this.actBtnIndex];
    },
    tableColumns() {
      const obj = [
        "tableColumnsSort",
        "tableColumnsTitle",
        "tableColumnsContent",
      ];
      return this[obj[this.actBtnIndex]];
    },
    formRules() {
      const rules = {
        0: {
          helpCategoryName: [
            {
              required: true,
              validator: (rule, val, cb) => (val ? cb() : cb(this.$t("请输入分类名称"))),
              triger: "blur",
            },
          ],
          outRangId: [
            {
              required: true,
              validator: (rule, val, cb) =>
                val ? cb() : cb(this.$t("请输入前台排序号")),
              triger: "blur",
            },
          ],
          available: [
            {
              required: true,
              validator: (rule, val, cb) =>
                val === 1 || val === 0 ? cb() : cb(this.$t("请选择是否启用")),
              triger: "change",
            },
          ],
        },
        1: {
          helpCategoryId: [
            {
              required: true,
              validator: (rule, val, cb) =>
                typeof val === "number" ? cb() : cb(this.$t("请选择所属分类")),
              triger: "change",
            },
          ],
          titleName: [
            {
              required: true,
              validator: (val, rule, cb) => (val ? cb() : cb(this.$t("请输入标题名称"))),
              triger: "blur",
            },
          ],
        },
        2: {
          helpCategoryId: [
            {
              required: true,
              validator: (rule, val, cb) =>
                typeof val === "number" ? cb() : cb(this.$t("请选择所属分类")),
              triger: "change",
            },
          ],
          helpTitleId: [
            {
              required: true,
              validator: (rule, val, cb) =>
                typeof val === "number" ? cb() : cb(this.$t("请选择标题名称")),
              triger: "change",
            },
          ],
          contentTitle: [
            {
              required: true,
              validator: (rule, val, cb) => (val ? cb() : cb(this.$t("请输入标题名称"))),
              triger: "blur",
            },
          ],
          helpContent: [
            {
              required: true,
              validator: (rule, val, cb) => (val ? cb() : cb(this.$t("请输入内容"))),
              triger: "blur",
            },
          ],
        },
      }[this.actBtnIndex];
      console.log("rules ====", rules);
      return rules;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getList();
    },
    // 获取pc图片
    getPcPath(event) {
      if (event.target.files[0]) {
        let arr = event.target.files[0].name.split(".");
        if ("gif,jpeg,jpg,png,svg".indexOf(arr[arr.length - 1]) > -1) {
          let pcFile = event.target.files[0];
          let formData = new FormData();
          formData.append("uploadFile", pcFile);
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          this.picPathStr = this.$t("上传中");
          this.$axios
            .post(this.$urls.uploadImage, formData, config)
            .then((res) => {
              this.picPathStr = "";
              this.addForm.picPath = res.data.path;
            });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("上传图片格式错误，请重新上传"),
          });
        }
      }
    },
    previewImgOpen() {
      this.picPreviewShow = true;
    },
    handleCategoryChange() {
      const { helpCategoryId } = this.addForm;
      this.getFindTitle({ helpCategoryId });
    },
    handleSubmit() {
      this.$refs["addForm"].validate((isOk) => {
        if (isOk) {
          this.Submit();
        }
      });
    },
    handleEdit(item) {
      if (!this.hasPermission("operate:oprhelp:update")) {
        return this.$message.warning(this.$t("暂无权限"));
      }
      const actIndex = this.actBtnIndex;
      const editInitForm = {
        0: {
          available: item.available,
          outRangId: item.outRangId,
          picPath: item.picPath,
          helpCategoryName: item.helpCategoryName,
        },
        1: {
          titleName: item.titleName,
          helpCategoryId: item.helpCategoryId,
        },
        2: {
          helpCategoryId: item.helpCategoryId,
          helpTitleId: item.helpTitleId,
          contentTitle: item.contentTitle,
          helpContent: item.helpContent,
        },
      };
      this.addForm = { id: item.id, ...editInitForm[actIndex] };
      this.isShowAdd = true;
    },
    async handleEnableCategory(item) {
      const { id, available } = item;
      const data = { id, available: available === 1 ? 0 : 1 };
      this.$store.state.fullscreenLoading = true;
      const { res } = await this.$axios.POST(
        this.$urls.helpCenter.enableCategory,
        data
      );
      if (res) {
        this.getList();
      }
    },
    async delItem(item) {
      const permission = [
        "operate:oprhelp:deleteCategory",
        "operate:oprhelp:deleteTitle",
        "operate:oprhelp:deleteContent",
      ];
      const actIndex = this.actBtnIndex;
      if (!this.hasPermission(permission[actIndex])) {
        return this.$message.warning(this.$t("暂无权限"));
      }
      const { id } = item;
      const url = ["deleteCategory", "deleteTitle", "deleteContent"][actIndex];
      const { res } = await this.$axios.POST(this.$urls.helpCenter[url], {
        id,
      });
      if (res) {
        this.$message.success(this.$t("刪除成功"));
        this.getList();
      }
    },
    async Submit() {
      const data = { ...this.addForm };
      const isEdit = !!data.id;
      const addUrls = ["saveHelpCategory", "saveHelpTitle", "saveHelpContent"];
      const editUrls = [
        "updateHelpCategory",
        "updateHelpTitle",
        "updateHelpContent",
      ];
      const url = isEdit
        ? editUrls[this.actBtnIndex]
        : addUrls[this.actBtnIndex];
      this.submitLoading = true;
      const { res } = await this.$axios.POST(this.$urls.helpCenter[url], data);
      this.submitLoading = false;
      if (res) {
        this.isShowAdd = false;
        this.getList();
      }
    },
    handleAdd() {
      const addInitForm = {
        0: {
          available: 1,
          outRangId: "",
          helpCategoryName: "",
        },
        1: {
          titleName: "",
          helpCategoryId: "",
        },
        2: {
          helpCategoryId: "",
          helpTitleId: "",
          contentTitle: "",
          helpContent: "",
        },
      };
      this.addForm = addInitForm[this.actBtnIndex] || {};
      this.isShowAdd = true;
    },
    async getFindTitle(params) {
      const { res } = await this.$axios.GET(
        this.$urls.helpCenter.findTitle,
        params || {}
      );
      if (res) {
        const { list } = res;
        if (params) {
          this.contentTitleList = list;
        } else {
          this.titleList = list;
        }
      }
    },
    async getFindCategory() {
      const { res } = await this.$axios.GET(this.$urls.helpCenter.findCategory);
      if (res) {
        this.categoryList = res.list;
      }
    },
    async getList() {
      this.getCurrentRecodeTime()
      const url = ["helpCategoryList", "helpTitleList", "helpContentList"][
        this.actBtnIndex
      ];
      this.loading = true;
      const obj = await this.$axios.GET(
        this.$urls.helpCenter[url],
        this.listParams
      );
      const { res, response } = obj
      this.getNetworkLoadAndDataSolveTime(response)
      this.loading = false;
      if (res) {
        const { totalCount, list } = res.page;
        this.tableData = list;
        this.totalCount = totalCount;
      }
    },
    handleBtnClick(i) {
      this.tableData = [];
      this.actBtnIndex = i;
      this.listParams = {
        pageNo: 1,
        pageSize: 10,
      };
      if (i === 1 || i === 2) {
        this.getFindCategory();
      }
      if (i === 2) this.getFindTitle();
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .transparent {
  .el-dialog {
    background: transparent;
  }
}
</style>
