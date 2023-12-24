<template>
    <!-- 活动分类 -- 新增分类 -->
	<el-dialog :visible="formVisible" :title="isAdd ? $t('新增分类') : $t('编辑分类')" :close-on-click-modal="false" @close="handleClose">
		<el-form class="form-wrapper" label-position="right" label-width="auto" label-suffix=":" ref="form" :model="formModel" :rules="rules">
			<el-form-item :label="$t('分类名称')" prop="catName">
				<el-input v-model="formModel.catName" :placeholder="$t('请输入分类名称')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('前台排序号')" prop="sort">
				<el-input type="number" v-model.number="formModel.sort" :placeholder="$t('请输入排序号')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('是否启用')" prop="available">
        <el-radio-group v-model="formModel.available">
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('前端是否启展示')" prop="disable">
        <el-radio-group v-model="formModel.disable">
          <el-radio label="1">{{ $t('是') }}</el-radio>
          <el-radio label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
			</el-form-item>
      <el-form-item :label="$t('分类名称')" prop="otherLanguage" :rules="otherLanguageRule" >
        <div class="language_class">
            <div class="line">
                <div class="left">语种</div>
                <div class="right">分类名称</div>
            </div>
            <div class="line cnjsdk" v-for="(item, index) in languageList" :key="item.language">
                <div class="left"><span v-show="[0, 1].includes(index)" class="icon">*</span>{{ item.language }}</div>
                <div class="right">
                    <el-input class="text_input borderNone" type="text" v-model="item.value" @input="changeLanguage(item.key, item.value)"/>
                </div>
            </div>
        </div>
		  </el-form-item>
		</el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
	</el-dialog>
</template>

<script>
// import { Divider } from 'element-ui'
import { lang } from "@/i18n";

export default {
	props: ['formVisible', 'infoForEdit'],
	data(){
		return {
			formModel: {
        catName: null,
        sort: null,
				available: 1,
				disable: "1"
			},
			rules: {
				catName: [
					{required: true, message: this.$t('不能为空'), trigger: 'blur'},
				],
				sort: [
					{required: true, message: this.$t('不能为空'), trigger: 'blur'},
					{type: 'integer', min: 1, max: 99, message: this.$t('排序号应为小于100的正整数'), trigger: 'blur'},
				],
				available: [
					{required: true, message: this.$t('请选择是否启用')},
				],
				disable: [
					{required: true, message: this.$t('请选择前端是否启展示')},
				],
      },
      otherLanguageRule: {
          validator: (rule, value, callback) => {
            const { zh, en_us } = this.otherLanguage
            if (!zh || !en_us) {
              callback(this.$t('注: 分类名称中的简体中文及英文均为必填项'))
            } else {
              callback()
            }
          },
          trigger: 'change',
        },
        languageList: [
            { key: 'zh', language: lang('简体中文'), value: ''},
            { key: 'en_us', language: lang('英语'), value: ''},
            { key: 'ms', language: lang('马来语'), value: ''},
            { key: 'zh_tw', language: lang('繁体中文'), value: ''},
            { key: 'vi', language: lang('越南语'), value: ''},
            { key: 'th', language: lang('泰语'), value: ''},
        ],
        otherLanguage: {
            zh: "",
            vi: "",
            ms: "",
            en_us: "",
            zh_tw: "",
            th: ""
        },
		}
	},
	computed: {
		isAdd() {
			return !this.formModel.id
		}
  },
  created() {
    if (this.infoForEdit) {
      this.initFormModel()
    }
  },
	methods:{
    initFormModel() {
      debugger
      const formModel = JSON.parse(JSON.stringify(this.infoForEdit))
      // 解析json字符串
      const otherLanguage = JSON.parse(formModel.otherLanguage)  || this.otherLanguage
      this.otherLanguage = otherLanguage
      // 设置languageList
      const languageKeys = Object.keys(otherLanguage || {})
      languageKeys.map((k, i) => {
        const cI = this.languageList.findIndex(it => it.key === k)
        this.$set(this.languageList[cI], 'value', otherLanguage[k])
      })
      this.formModel = formModel || {}
    },
		handleSubmit(){
			this.$refs.form.validate(valid => {
				if(valid){
          this.formModel.otherLanguage = JSON.stringify(this.otherLanguage)
					this.$emit('submit', this.formModel)
				}
			})
    },
    handleClose() {
      this.$emit('update:formVisible', false)
    },
    changeLanguage (k, v) {
        this.$set(this.otherLanguage, k, v)
    }
	},
    watch: {
        languageList: {
            handler(n, o) {
            },
            immediate: true,
            deep: true,
        }
    }
}
</script>

<style lang="scss" scoped>
    .language_class {
        border: 1px solid #dddfe5;
        .line {
            div {
                border: 1px solid #dddfe5;
                text-align: center;
                box-sizing: border-box;
                &.left {
                    float: left;
                    width: 50%;
                    .icon {
                        color: red;
                        margin-top: 5px;
                    }
                }
                &.right {
                    float: right;
                    width: 50%;
                    .text_input {
                        border: none !important;
                    }
                    .text_input /deep/ .el-input__inner {
                      border: none;
                    }

                }
            }
        }
    }
</style>></style>
