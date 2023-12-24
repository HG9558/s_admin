<template>
  <div>
    <el-form-item :label="$t('展示活动') + ':' ">
      <el-table
        :data="showTabelData"
        style="width: 45%"
        border
        v-loading="tableLoading"
        class="selfTable"
      >
        <el-table-column
          prop="activityName"
          :label="$t('活动名称')"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('活动时间')"
          width="400"
          align="center"
          prop="avtivityTimeText"
        >
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" class="iconSpan">
          <template slot-scope="scope">
            <span
              :class="[
                scope.$index == 0 ? '' : 'highlight',
                'icon',
                'el-icon-upload2'
              ]"
              @click="up(scope.$index)"
            ></span>
            <span
              :class="[
                scope.$index + 1 == showTabelData.length ? '' : 'highlight',
                'icon',
                'el-icon-download'
              ]"
              @click="down(scope.$index)"
            ></span>
            <span
              class="icon el-icon-close highlight"
              @click="deleteN(scope.$index)"
            ></span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div
        :class="['addActivity', showTabelData.length ? 'showCenter' : '']"
        @click="addActivity"
      > -->
      <div :class="['addActivity', 'showCenter']" @click="addActivity">
        +{{ $t('添加活动') }}
      </div>
    </el-form-item>
    <el-dialog
      :title="$t('添加活动')"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
      class="dialogAct"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-show="!!tableData.length"
        :class="['selfTable', tableData.length > 15 ? 'dialogTable' : '']"
      >
        <el-table-column :label="$t('选择')" width="100" align="center">
          <template slot-scope="scope">
            <el-checkbox-group v-model="selectIdList">
              <el-checkbox
                :label="scope.row.id"
                @change="selectStatus(scope.row)"
              ></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column
          prop="activityName"
          :label="$t('活动名称')"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('活动时间')"
          align="center"
          prop="avtivityTimeText"
        >
        </el-table-column>
      </el-table>
      <!-- <el-form-item class="page" v-show="!!tableData.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </el-form-item> -->
      <span slot="footer" class="dialog-footer" v-show="!!tableData.length">
        <el-button @click="closeDialog">{{ $t('关闭') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["rowData"],
  data() {
    return {
      centerDialogVisible: false,
      tableData: [],
      tableLoading: false,
      pageSize: 10000,
      currentPage: 1,
      totalCount: null,
      showActiveList: [],
      selectIdList: [],
      showTabelData: [],
      sentToFaRule: [],
      firstEneter: true
    };
  },
  computed: {},
  created() {},
  mounted() {
    // 不加会出样式问题 巨坑
    this.$store.state.indexActive = "4-16";
    this.initData();
  },
  methods: {
    initData(bool) {
      this.tableLoading = true;
      this.$axios
        .get(this.$systemConfig.urls.activityIntroduction.list, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            actCatIdList: null,
            useStateList: 1,
            isShow: 1
          }
        })
        .then(res => {
          if (res) {
            this.totalCount = res.data.data.totalCount;
            let arr = res.data.data.list.map(item => {
              let { useStart, useEnd } = item;
              useStart = this.$systemConfig.saveYmd(item.useStart, "bj");
              useEnd = this.$systemConfig.saveYmd(item.useEnd, "bj");
              item.avtivityTimeText = useStart + "~" + useEnd;
              return item;
            });
            this.tableData = arr;
            this.getShowTableData();
            if (!this.firstEneter) this.tableLoading = false;
          }
        });
    },
    getShowTableData() {
      if (!this.firstEneter) return;
      this.showTabelData = [];
      let arr = JSON.parse(this.rowData.rule) || [];
      if (arr.length) {
        arr.map(val => {
          this.tableData.map(item => {
            if (val.activityId == item.id) {
              this.showTabelData.push(item);
            }
          });
        });
      }
      this.tableLoading = false;
      this.firstEneter = false;
    },
    addActivity() {
      if (this.tableLoading) return;
      this.centerDialogVisible = true;
      this.selectIdList = [];
      this.showActiveList = [];
      this.tableData.map(val => {
        this.showTabelData.map(item => {
          if (val.id == item.id) {
            this.selectIdList.push(val.id);
            this.showActiveList.push(val);
          }
        });
      });
    },
    up(index) {
      if (index) {
        let o = JSON.parse(JSON.stringify(this.showTabelData[index - 1]));
        this.$set(
          this.showTabelData,
          index - 1,
          JSON.parse(JSON.stringify(this.showTabelData[index]))
        );
        this.$set(this.showTabelData, index, o);
      }
    },
    down(index) {
      if (index != this.showTabelData.length - 1) {
        let o = JSON.parse(JSON.stringify(this.showTabelData[index + 1]));
        this.$set(
          this.showTabelData,
          index + 1,
          JSON.parse(JSON.stringify(this.showTabelData[index]))
        );
        this.$set(this.showTabelData, index, o);
      }
    },
    deleteN(index) {
      this.showTabelData.splice(index, 1);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.initData(true);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData(true);
    },
    selectStatus(row) {
      if (this.selectIdList.includes(row.id)) {
        this.showActiveList.push(row);
      } else {
        let splitIndex = null;
        this.showActiveList.map((val, index) => {
          if (val.id == row.id) {
            splitIndex = index;
          }
        });
        /* (splitIndex || splitIndex === 0) &&
          this.showActiveList.splice(splitIndex, 1); */
        parseFloat(splitIndex).toString() !== "NaN" &&
          this.showActiveList.splice(splitIndex, 1);
      }
    },
    submit() {
      this.showTabelData = JSON.parse(JSON.stringify(this.showActiveList));
      this.closeDialog();
    },
    closeDialog() {
      this.centerDialogVisible = false;
    },
    getToFaRule() {
      this.sentToFaRule = [];
      this.showTabelData.map((val, index) => {
        this.sentToFaRule.push({ activityId: val.id, sort: index + 1 });
      });
      this.$emit(
        "changeVal",
        this.sentToFaRule.length ? this.sentToFaRule : null
      );
    }
  },
  watch: {
    showTabelData: {
      handler(n, o) {
        this.getToFaRule(n);
      },
      immediate: true,
      deep: true
    },
    centerDialogVisible(n) {
      if (!n) {
        //this.pageSize = 15;
        this.currentPage = 1;
        this.initData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialogAct {
  /deep/ .el-dialog__body {
    padding-bottom: 0;
  }
}
.addActivity {
  width: 45%;
  color: rgb(24, 144, 255);
  cursor: pointer;
}
.showCenter {
  margin-top: 15px;
  text-align: center;
}
.page {
  /deep/ .el-form-item__content {
    margin-top: 15px;
    text-align: right;
  }
}
.selfTable {
  /deep/ .cell {
    line-height: 30px !important;
    span {
      font-size: 17px !important;
      cursor: pointer;
    }
    .highlight {
      color: rgb(24, 144, 255);
    }
  }
  /deep/ .el-checkbox__label {
    display: none;
  }
}
.dialogTable {
  min-height: 408px;
  /deep/ .el-table__body-wrapper {
    height: 555px !important;
    overflow-y: scroll;
  }
}
</style>
