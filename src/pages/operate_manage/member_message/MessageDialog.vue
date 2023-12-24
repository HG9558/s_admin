<template>
  <el-form ref="form" :model="row" label-width="125px">
    <el-form-item :label="$t('会员名')">
      <!-- <el-input disabled v-model="row.loginName"></el-input> -->
      <div class="message-dialog-row">{{row.loginName}}</div>
    </el-form-item>
    <el-form-item :label="$t('真实姓名')">
      <!-- <el-input disabled v-model="row.realName"></el-input> -->
      <div class="message-dialog-row">{{row.realName}}</div>
    </el-form-item>
    <el-form-item :label="$t('会员等级')">
      <!-- <el-input disabled v-model="row.tierName"></el-input> -->
      <div class="message-dialog-row">{{row.tierName}}</div>
    </el-form-item>
    <el-form-item :label="$t('反馈时间')">
      <!-- <el-input disabled v-model="row.modifyTime"></el-input> -->
      <div class="message-dialog-row">{{row.modifyTime}}</div>
    </el-form-item>
    <el-form-item :label="$t('反馈类型')">
      <!-- <el-input disabled v-model="row.type"></el-input> -->
      <div class="message-dialog-row">{{getType(row.type)}}</div>
    </el-form-item>
    <el-form-item :label="$t('反馈内容')">
      <!-- <el-input disabled type="textarea" v-model="row.textContent"></el-input> -->
      <div class="message-dialog-row text-area">{{row.textContent}}</div>
    </el-form-item>
    <el-form-item :label="$t('双击查看大图')" v-if="row.imageUrl">
      <img :src="row.imageUrl" style="width: 100px;"  @dblclick="up(row.imageUrl)">
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    props: [
      'row', 'typeArr'
    ],  
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    created() {
    },
    beforeDestroy() {

    },
    methods: {
      up(img){
         window.open(img)
      },
      getType(type) {
        const i = this.typeArr.find(item => item.value === type)
        return i ? i.label : this.$t('全部消息')
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-input.is-disabled .el-input__inner,
  /deep/ .el-textarea .el-textarea__inner {
    background: #ffffff !important
  }
  .message-dialog-row {
    border: 1px solid #e5e7ec;
    text-indent: 1em;
    color: #c1c4cb;
    border-radius: 3px;
    height: 34px;
  }
  .text-area {
    padding: 8px;
    min-height: 34px;
    box-sizing: border-box;
    height: auto;
    word-break: break-all;
    line-height: 20px;
    max-height: 120px;
    overflow: auto;
  }
</style>
