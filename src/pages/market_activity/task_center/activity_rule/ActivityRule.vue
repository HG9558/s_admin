<template>
  <div>
    <el-form-item :label="$t('活动名称')" prop="contentRule" :rules="contentRule">
      <!-- <div style="width: 300px">
       <el-input type="textarea" v-model="tableData.rule.content" autosize></el-input>
      </div> -->
    <el-row>
      <el-checkbox-group v-model="tableData.rule.checkboxLanguage">
        <el-checkbox-button v-for="(item, index) in languageList" :label="item.value" :key="index">{{item.label}}</el-checkbox-button>
      </el-checkbox-group>
     </el-row>
     <el-row style="marginTop: 10px">
      <span v-for="item in languageContentList" :key="item">
        <el-input
        v-model="tableData.rule[item]"
        v-show="item === tableData.rule.checkboxLanguage[tableData.rule.checkboxLanguage.length - 1 ]"
        type="textarea"
        :rows="5"
        style="width: 400px;"
        :placeholder="$t('如有需要，可填写详细说明')"
      ></el-input>
      </span>
    </el-row>
    </el-form-item>
  </div>
</template>

<script>
import { lang } from "@/i18n";
export default {
  name: "ActivityRule",
  props: ["rowData", "rules", 'languageContentList'],
  data() {
    return {
      tableData: {
        rule: {},
      },
      languageList: [
        { value: "content", label: lang("简体中文"), },
        { value: "en_uscontent", label: lang("英语") },
        { value: "mscontent", label: lang("马来语") },
        { value: "vicontent", label: lang("越南语") },
        { value: "thcontent", label: lang("泰语") },
        { value: "zh_twcontent", label: lang("繁体中文") },
      ],
      contentRule: {
          validator: (rule, value, callback) => {
            const { languageContentList } = this
            const { checkboxLanguage } = this.tableData.rule
            if (!checkboxLanguage.length) {
              callback(this.$t('请选择相应规则说明语言'))
            } else {
              let bool = false
              checkboxLanguage.map(item => {
                const index = this.languageContentList.findIndex(v => v === item)
                if (!this.tableData.rule[languageContentList[index]]) {
                  bool = true
                }
              })
              if (bool) {
                callback(this.$t('请填写选择语言对应的文本'))
              } else {
                callback()
              }
            }
          },
          trigger: 'change',
        },
    }
  },
  watch: {
    tableData: {
      handler(n) {
        this.$emit("changeVal", n);
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let rowData = JSON.parse(JSON.stringify(this.rowData));
      const rule = JSON.parse(rowData.rule);
       // 规则说明语言用到
      let checkboxLanguage = []
          this.languageContentList.map(k => {
            if (rule[k]) {
              checkboxLanguage.push(k)
            }
          })
      rule.checkboxLanguage = checkboxLanguage

      rowData.rule = rule;
      this.tableData = rowData;
    },
  },
}
</script>

<style>
</style>
