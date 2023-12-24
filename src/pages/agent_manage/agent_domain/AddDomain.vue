<template>
  <el-form class="form-wrapper" label-position="top" label-suffix=":" ref="form" :model="formModel" :rules="rules">
    <el-form-item prop="agyAccount" :label="$t('代理账号')">
      <el-select filterable :placeholder="$t('请输入代理账号')" v-model="formModel.agyAccount" style="width: 300px">
        <el-option :label="item.agyAccount" :value="item.agyAccount" v-for="item in agentList" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="type" :label="$t('域名类型')">
      <el-radio-group v-model="formModel.type" @change="handleRadioChange">
        <el-radio :label="2">{{ $t('子域名') }}</el-radio>
        <el-radio :label="1">{{ $t('主域名') }}</el-radio>
      </el-radio-group>
      <el-button type="primary" :disabled="!formModel.domainUrlList" :loading="isDowning" class="iconfont icon-export el-button-export" size="mini" @click="handleExportDomain" style="float: right;">{{!isDowning? $t('导出'):$t('导出中') + '...'}}
      </el-button>
    </el-form-item>
    <el-form-item prop="domainUrlList" :label="$t('域名选择')" class="main_domain">
      <el-checkbox-group v-model="formModel.domainUrlList">
        <el-checkbox :label="item" v-for="(item, index) in checkList" :key="index"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item prop="expireDate" :label="$t('到期时间')" class="main_domain">
      <el-date-picker v-model="formModel.expireDate" type="datetime" :placeholder="$t('选择日期时间')" value-format="yyyy-MM-dd HH:mm:ss">

      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
import systemConfig from "../../../config/config";
import fileExport from "../../../mixins/fileExport";
export default {
  mixins: [fileExport],
  data() {
    return {
      isDowning: false,
      formModel: {
        agyAccount: null,
        type: 2,
        domainUrlList: [],
      },
      agentList: [],
      checkList: [],
      domainList: [],
      domainSubList: [],
      rules: {
        agyAccount: {
          required: true,
          message: this.$t("请选择代理账号"),
          trigger: "change",
        },
        type: {
          required: true,
          message: this.$t("请选择域名类型"),
          trigger: "change",
        },
        domainUrlList: {
          required: true,
          validator: (rule, value, callback) => {
            if (value.length > 0) {
              callback();
            } else {
              callback(new Error(this.$t("请选择域名")));
            }
          },
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getSubAgentList();
    this.getAllDomainList();
    this.getDomainSubList()
  },
  methods: {
    async handleExportDomain(){
      this.isDowning = true

      const { res } = await this.$axios.GET(this.$urls.agentDomian.exportDomainList)
      if (res) {
        await this.exportCheckFile('EXPORT_DOMAIN_LIST', this.$urls.agentDomian.checkFile)
      }
      this.isDowning = false
    },
    handleRadioChange(val) {
      const obj = { 1: 'domainList', 2: 'domainSubList' }
      this.checkList = this[obj[val]] || []
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("submit", {
            ...this.formModel,
            // domainUrl: this.formModel.domainUrl.replace(/，/g, ","),
          });
        }
      });
    },
    getSubAgentList() {
      // 获取所有子代理
      this.$axios.get(systemConfig.urls.getAllChildAgent).then((res) => {
        this.agentList = res.data.accounts;
      });
    },
    async getDomainSubList() {
      const { res } = await this.$axios.GET(this.$urls.agentDomian.domainSubList)
      if (res) {
        const { data } = res
        this.domainSubList = data
        this.checkList = data
      }
    },
    getAllDomainList() {
      // 获取所有子代理
      this.$axios.get(systemConfig.urls.agentDomian.domainList).then((res) => {
        this.domainList = res.data.data
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main_domain {
  /deep/ .el-form-item__content {
    .el-checkbox-group {
      max-height: 150px !important;
      min-height: 100px !important;
      overflow-y: scroll;
      background-color: #f2f2f2 !important;
      padding: 20px 0;
      .el-checkbox {
        width: 40%;
        margin-left: 30px !important;
      }
    }
  }
}
</style>
