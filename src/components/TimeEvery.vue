<template>
  <div class="big">
    <el-button v-if="btn.label" v-bind="btn" @click="$emit(btn.event)">{{ btn.label }}</el-button>
    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="clickTime" style="margin-right: 10px">{{ $t('自动刷新') }}</el-button>
    <el-select style="width: 110px;padding: 1px" size="mini" v-model="value" :placeholder="$t('选择时间')" @change="timeChange">
      <el-option
        v-for="item in data"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "TimeEvery",
    data() {
      return {
        value: '',
        options: [
        // {
        //   value: '5',
        //   label: '5s'
        // },
        {
          value: '15',
          label: '15s'
        }, {
          value: '30',
          label: '30s'
        }, {
          value: '60',
          label: '60s'
        }, {
          value: '0',
          label: this.$t('停止')
        }],
      }
    },
    created() {

    },
    props: {
      btn: {
        type: Object,
        default: () => ({})
      },
      data: {  // 必须提供字段
        required: false,
        default: function () {
          return [
          //   {
          //   value: '5',
          //   label: '5s'
          // },
          {
            value: '15',
            label: '15s'
          }, {
            value: '30',
            label: '30s'
          }, {
            value: '60',
            label: '60s'
          }, {
            value: '90',
            label: this.$t('停止')
          }]
        }
      }
    },
    watch: {},
    methods: {
      timeChange(val) {
        this.$emit('getTime', val)
      },
      clickTime() {
        this.$emit('getTime', 1000)
      }
    },
  }
</script>

<style scoped>
  .big {
    height: 50px;
    line-height: 50px;
    text-align: right;
    /*border-radius: 10px*/
    width: auto;
  }
</style>
