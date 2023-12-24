<template>
<div>
  <div class="table-operation-btns-wrapper">
    <div v-if="$slots['slot-title']" class="table-operation-btns-title">
      <slot name="slot-title"></slot>
    </div>
    <div class="table-operation-btns" v-if="isHasBtn">
      <el-button type="primary" @click="$emit('add')" icon="el-icon-circle-plus-outline" v-if="hasAddBtn">{{ $t('新增') }}</el-button>
      <el-button type="danger" @click="$emit('remove', multipleSelection)" icon="el-icon-delete" v-if="hasRemoveBtn">{{ $t('批量删除') }}</el-button>
      <el-button type="primary" @click="$emit('import')" icon="el-icon-upload" v-if="hasImportBtn">{{ $t('导入') }}</el-button>
      <el-button @click="$emit(item.event)" v-bind="item" v-for="(item, i) in tableBtns" type="primary" :key="i" v-show="!item.disabled">{{item.text}}</el-button>
      <el-button type="primary" @click="$emit('export')" icon="el-icon-download" v-if="hasExportBtn">{{ $t('导出') }}</el-button>
      <el-button type="primary" @click="$emit('goBack')" icon="el-icon-back" v-if="goBack">{{ $t('返回') }}</el-button>
      <slot></slot>
    </div>
  </div>
  <div :class="{ marT10: !isHasBtn && !$slots['slot-title'] }"></div>
  <el-table v-loading="tableLoading" ref="table" v-bind="$attrs" v-on="$listeners" :data="tableData" @selection-change="handleSelectionChange" border @sort-change="obj => $emit('sort', obj)">
    <template v-for="(item, key) in tableColumns">
      <template v-if="item.render">
        <el-table-column v-bind="item" :align="item.align || 'center'" :key="key">
          <template slot-scope="scope">
            <ColumsCom :render-fn="item.render" :row="scope.row" :scope="scope" />
          </template>
        </el-table-column>
      </template>
      <template v-else-if="item.slotName">
        <slot :name="item.slotName"></slot>
      </template>
      <template v-else>
        <el-table-column :width="item.width" v-bind="item" :align="item.align || 'center'" :class-name="item.class" :index="item.index || indexWithPage" :key="key"></el-table-column>
      </template>
    </template>
  </el-table>
  <el-pagination background v-if="hasPagination" class="table-pagination" :total="totalCount" :page-size="pageSize" :current-page="currentPage" :layout="hasLayout" :page-sizes="[10, 20, 50, 100, 500, 1000]" @size-change="handleSizeChange" @current-change="handleCurrentChange">
  </el-pagination>

  <div class="intTime" v-show="showLoadTime">
    <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
    <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
  </div>

  <!-- :source="source"
            :enterNum="enterNum" -->
  <!-- <a @click="scrollToTop" class="tableToTop_de"  v-if='totalCount>=1&&source=="loseWinSheet"'>返回顶部</a> -->
  <!-- <div :oldTableList="oldTableList" style="display:none;"></div> -->
</div>
</template>

<script>
import { string } from 'postcss-selector-parser';

const ColumsCom = {
  props: {
    renderFn: Function,
    row: Object,
    scope: Object,
  },
  render(h) {
    return this.renderFn(h, this.row, this.scope)
  }
}
export default {
  props: {
    /* source:{
            type:String,
            default:'source',
        },
        oldTableList:{
            type:Array,
            default:()=>[]
        },
        enterNum:{
            type:Number,
            default:()=>0
        }, */
    tableBtns: {
      type: Array,
      default: () => []
    },
    hasLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    hasAddBtn: {
      type: Boolean,
      default: true
    },
    goBack: {
      type: Boolean,
      default: false
    },
    hasRemoveBtn: {
      type: Boolean,
      default: true
    },
    hasImportBtn: {
      type: Boolean,
      default: false
    },
    hasExportBtn: {
      type: Boolean,
      default: false
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    showLoadTime: {
      type: Boolean,
      default: false
    },
    networkLoadTime: {
      type: String,
      default: '',
    },
    dataSolveTime: {
      type: String,
      default: '',
    },
    tableColumns: Array,
    pageSize: Number,
    totalCount: Number,
    currentPage: Number,
  },
  components: {
    ColumsCom
  },
  computed: {
    isHasBtn() {
      return this.hasAddBtn || this.hasRemoveBtn || this.hasImportBtn || this.tableBtns.length || this.hasExportBtn || this.goBack || this.$slots.default
    }
  },
  data() {
    return {
      multipleSelection: [],
      /* enterNum:0, */
    };
  },
  mounted() {
    /*  window.onscroll=()=>{
            if(this.source=="loseWinSheet"){
                this.$scrToBottom.scrollTo('loseWinSheet',this,'handleSizeChange')
            }
        } */
  },
  methods: {
    indexWithPage(index) {
      const {
        pageSize,
        currentPage
      } = this;
      return index + pageSize * (currentPage - 1) + 1;
    },
    handleSizeChange(pageSize) {
      this.$emit("update:currentPage", 1);
      this.$emit("update:pageSize", pageSize);
      this.$emit("reloadData", pageSize);
    },
    handleCurrentChange(currentPage) {
      this.$emit("update:currentPage", currentPage);
      this.$emit("reloadData", currentPage);
    },
    handleSelectionChange(selections) {
      this.multipleSelection = selections.map(item => item.id);
    }
    /* scrollToTop(){
            this.$scrToBottom.scrollToTop();
        } */
  }
};
</script>

<style scoped>
.table-operation-btns-wrapper {
  position: relative;
  overflow: hidden;
}
.table-operation-btns-title {
  position: relative;
  padding: 20px 0 30px;
}
.table-operation-btns {
  flex: 1;
  display: flex;
  padding: 10px 0;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-end;
}

.table-pagination {
  /*float: right;*/
  text-align: right;
  margin-top: 20px;
}

.tableToTop_de {
  position: relative;
  float: right;
  bottom: -30px;
  /* right: -505px; */
  font-size: 13px;
  cursor: pointer;
}
::v-deep .el-table td {
  padding: 5px 1px !important;
}
.marT10 {
  padding-top: 10px;
}
</style>
