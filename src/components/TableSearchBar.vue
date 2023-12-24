<template>
  <el-form class="search-bar-wrapper" :inline="true" label-position="top" ref="form">
    <div class="table-search-form">
      <el-form-item v-for="(item, key) in searchCriteria.meta || meta" :key="key" :prop="item.prop" :label="item.label">
        <!-- 单选组 -->
        <el-radio-group v-model="searchCriteria.keys[item.prop]" v-if="item.type === 'radio-group'">
          <el-radio :label="option.value" v-for="(option, index) in item.options" :key="index">{{option.label}}</el-radio>
        </el-radio-group>
        <!-- 选择框 -->
        <el-select v-model="searchCriteria.keys[item.prop]" :placeholder="$t('请选择') + item.label" v-if="item.type === 'select'" :multiple="item.multiple" clearable @change="$emit('selectChange', $event, item.prop)">
          <el-option :label="option.label" :value="option.value" v-for="(option, index) in item.options" :key="index"></el-option>
        </el-select>
        <!-- 文本框(string) -->
        <el-input v-model="searchCriteria.keys[item.prop]" v-trim :type="item.type" :placeholder="$t('请输入') + item.label" @keyup.native.enter="search" v-if="item.type === 'text'" :maxlength="item.max" :style="item.style || {}"></el-input>
        <el-date-picker
          v-if="item.type === 'date-pick'"
          v-model="searchCriteria.keys[item.prop]"
          :type="item.pickerType || 'date'"
          :placeholder="$t('选择日期')">
        </el-date-picker>
        <StartAndEndTimeSelector
          v-if="item.type === 'StartEndTime'"
          :defDateRange="defDateRange"
          ref="searchTime"
          v-bind="item.attrs"
          :startTime.sync="searchCriteria.keys[item.keys.startTime]"
          :endTime.sync="searchCriteria.keys[item.keys.endTime]"
          :width="dateWidth"
          :left="dateLeft"
        />
        <slot :name="item.slotName" v-if="item.slotName"></slot>
      </el-form-item>
      <slot></slot>
    </div>
    <div class="table-search-btns">
      <slot name="btn"></slot>
      <el-button type="primary" @click="search('search')" size="small" :loading="loading">{{ $t('查询') }}</el-button>
      <el-button type="danger" style="margin-left: 12px" @click="handleReset" size="small">{{ $t('重置') }}</el-button>
      <slot name="endBtn"></slot>
    </div>
  </el-form>
</template>

<script>
import StartAndEndTimeSelector from './StartAndEndTimeSelector'
export default {
  props: {
    searchCriteria: {
      type: Object,
      required: true,
    },
    meta: {
      type: Array,
      default: () => ([])
    },
    currentPage: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false
    },
    defDateRange: {
      type: Object,
      default: () => null,
    },
    dateLeft: {
      type: Number
    },
    dateWidth: {
      type: Number,
    },
  },
  methods: {
    search(type = "search") {
      this.$emit("update:currentPage", 1);
      this.$emit("reloadData", { type });
    },
    handleReset() {
      const { keys } = this.searchCriteria;
      for (let i in keys) {
        if (Array.isArray(keys[i])) {
          keys[i] = [];
        } else {
          keys[i] = null;
        }
      }
      this.search("resetAndSearch");
    },
  },
  watch: {
    meta: {
      handler(n, o) {
      },
      deep: true,
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 10px;
}
.search-bar-wrapper {
  display: flex;
  background-color: #f6f7f8;
  border: 1px solid #e6ebf5;
  /deep/ .el-form-item__label {
    font-size: 12px;
  }
  .table-search-form {
    flex: 7.5;
    overflow: hidden;
    padding: 20px;
  }
  .table-search-btns {
    padding: 20px 10px 30px 0;
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .el-button:last-of-type {
      margin-right: 10px;
    }
  }
}
</style>

