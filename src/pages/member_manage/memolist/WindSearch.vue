<template>
  <div class="wind-search">
    <el-form :label-position="labelPosition" label-width="80px" :model="searchForm" :inline="true" size="small">
      <el-form-item v-for="(item, i) in searchList" :key="i" v-bind="item.formItem || {}">
        <template v-if="item.type === 'text'">
          <el-input v-model="searchForm[item.prop]" v-bind="item.attrs || {}"></el-input>
        </template>
        <template v-if="item.type === 'select'">
          <el-select v-model="searchForm[item.prop]" v-bind="item.attrs || {}">
            <el-option v-for="(option, _i) in item.options" :key="_i" v-bind="option"></el-option>
          </el-select>
        </template>
        <template v-if="item.type === 'time'">
          <div style="display: flex">
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="searchForm[item.prop[0]]" style="width: 100%;"></el-date-picker>&nbsp;-&nbsp;
            <el-date-picker type="date" :placeholder="$t('选择日期')" v-model="searchForm[item.prop[1]]" style="width: 100%;"></el-date-picker>
          </div>
        </template>
      </el-form-item>
      <el-form-item style="margin-top: 30px;">
        <el-button type="primary" @click="onSubmit" :loading="loading">{{ $t('查询') }}</el-button>
        <el-button plain @click="onReset">{{ $t('重置') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "WindSearch",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'top'
    },
    searchForm: {
      type: Object,
      default: () => ({})
    },
    searchList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit')
    },
    onReset() {
      this.$emit('onReset')
    }
  }
}
</script>

<style lang="scss" scoped>
.check-box {
  float: right;
}
</style>
