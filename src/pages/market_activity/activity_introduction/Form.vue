<template>
  <!-- 市场活动： 活动介绍 -->
    <div class="activity-introduction-form-wrapper">
      <h5 class="activity-introduction-header">
        {{ $t('活动介绍') }}-{{ id ? (isSee ? $t('查看') : $t('编辑')) : $t("新增") }}
        <el-button class="activity-introduction-header_btn" @click="$router.go(-1)">{{ $t('返回') }}
        </el-button>
      </h5>
      <el-form ref="form" class="activity-introduction-body" :model="formModel" label-width="auto" label-suffix=":" :rules="rules">
        <el-form-item class="activity-introduction-inline-block" prop="activityName" :label="$t('活动名称')">
          <el-input :disabled="isSee" v-model="formModel.activityName" :placeholder="$t('请输入活动名称')"></el-input>
        </el-form-item>
        <el-form-item class="activity-introduction-inline-block" prop="activityTime" :label="$t('活动时间')">
          <StartAndEndTimeSelector type="date" :selections="[]" :startTime.sync="formModel.useStart" :endTime.sync="formModel.useEnd" :disabled="isSee"/>
        </el-form-item>
        <el-form-item :label="$t('活动渠道')" prop="isOnline">
          <el-radio-group v-model="formModel.isOnline">
            <el-radio :label="true">{{ $t('线上活动') }}</el-radio>
            <el-radio :label="false">{{ $t('线下活动') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item class="activity-introduction-inline-block" prop="isShow" :label="$t('前端展示')">
          <el-radio-group v-model="formModel.isShow"  :disabled="isSee">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="activity-introduction-inline-block" prop="isBindingRule" :label="$t('绑定规则')">
          <el-radio-group v-model="formModel.isBindingRule"  :disabled="isSee">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
          <span v-if="!formModel.isBindingRule" class="note">{{ $t('注: 如绑定为否，玩家端不会出现领取按钮；') }}</span>
          <el-select style="margin-left: 20px;" v-model="formModel.ruleId" filterable v-if="formModel.isBindingRule"  :disabled="isSee">
            <el-option v-for="(item,index) in activityRules" :key="index" :label="item.ruleName" :value="item.id" :disabled="!item.isSelect">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="actIds" :label="$t('分类展示')">
          <el-checkbox-group v-model="formModel.actIds">
            <el-checkbox :key="item.id" :label="item.id" v-for="item in activityCategories"  :disabled="isSee">
              {{ item.catName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('活动标签')" prop="labelId">
          <el-select v-model="formModel.labelId" :placeholder="$t('请选择活动标签')"  :disabled="isSee">
            <el-option v-for="(item,index) in labelList" :label="item.labelName" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sort" :label="$t('排序号')">
          <el-input :disabled="isSee" type="number" style="width: 10%;" v-model.number="formModel.sort" :placeholder="$t('请输入排序号')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('语种类型')" prop="langType" :rules="langType">
          <el-checkbox-group v-model="checkboxLanguage">
            <el-checkbox-button v-for="(item, index) in languageList" :label="item.value" :key="index">{{item.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-row v-for="(k, i) in languagesArr" :key="k">
          <el-form-item :label="$t('支持终端')" v-show="showCurrentLanguage(k)" prop="enablePcOrWap" :rules="enablePcOrWap" :style="{maxHeight: (activityLanguages[i].enableTerminal.length <= 1) || (uploadPcFile[i] && !uploadMbFile[i]) || (!uploadPcFile[i] && uploadMbFile[i]) ? '186px' : '288px'}">
            <el-checkbox-group v-model="activityLanguages[i].enableTerminal"  :disabled="isSee">
              <div :key="item.prop" class="activity-introduction-terminal" v-for="(item) in terminals">
                <el-checkbox class="activity-introduction-inline-block" :label="item.label">{{ item.name }}
                </el-checkbox>
                <el-upload action="" :limit="1" list-type="picture" :auto-upload="false" :on-exceed="handleExceed"
                  :file-list="activityLanguages[i][item.field] ? [{ name: item.name, url: activityLanguages[i][item.field] }] : []" :on-change="handleImageChange(item.prop, item.logoUrl, i)"
                  :on-remove="remove(i, item.prop, item.field)" class="activity-introduction-inline-block"
                  v-show="activityLanguages[i] && activityLanguages[i].enableTerminal.includes(item.label)" :disabled="isSee">
                  <el-button size="small" type="primary"  :disabled="isSee">
                    {{ $t('上传') }}{{ item.name }}{{ $t('图片') }}
                  </el-button>
                  <div v-show="sizeShowList[i]" slot="tip" class="el-upload__tip" style="color:red">
                    {{ $t('上传图片不能超过1M') }}
                  </div>
                </el-upload>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="content" :rules="content" :label="$t('pc端介绍')" v-show="activityLanguages[i] && activityLanguages[i].enableTerminal.includes('enablePc') &&  showCurrentLanguage(k)">
            <div class="activity-introduction-editor-wrapper w980">
              <TinyEditor :disabled="isSee" v-model="activityLanguages[i].content" />
            </div>
          </el-form-item>
          <el-form-item prop="mbContent" :rules="mbContent" :label="$t('移动端介绍')" v-show="activityLanguages[i] && activityLanguages[i].enableTerminal.includes('enableMb') &&  showCurrentLanguage(k)">
            <div class="activity-introduction-editor-wrapper w980">
              <TinyEditor :disabled="isSee" v-model="activityLanguages[i].mbContent" />
            </div>
          </el-form-item>
        </el-row>
        <el-form-item :label="$t('移动悬浮窗icon')">
          <el-upload action="" :limit="1" list-type="picture" :auto-upload="false" :on-exceed="handleExceed"
            :file-list="iconList" :on-change="handleIconChange(0)"
            :on-remove="iconRemove" class="activity-introduction-inline-block"
            :disabled="isSee">
            <el-button size="small" type="primary"  :disabled="isSee">
              {{ $t('上传') }}{{ $t('图片') }}
            </el-button>
            <div v-show="iconShow" slot="tip" class="el-upload__tip" style="color:red">
              {{ $t('上传图片不能超过3M') }}
            </div>
          </el-upload>
          <div style="color: #f56c6c;">{{ $t('支持上传GIF图，点击则跳转至活动详情页') }};</div>
        </el-form-item>
        <el-form-item :label="$t('PC悬浮窗icon')">
          <el-upload action="" :limit="1" list-type="picture" :auto-upload="false" :on-exceed="handleExceed"
            :file-list="iconPcList" :on-change="handleIconChange(1)"
            :on-remove="iconPcRemove" class="activity-introduction-inline-block"
            :disabled="isSee">
            <el-button size="small" type="primary"  :disabled="isSee">
              {{ $t('上传') }}{{ $t('图片') }}
            </el-button>
            <div v-show="iconPcShow" slot="tip" class="el-upload__tip" style="color:red">
              {{ $t('上传图片不能超过3M') }}
            </div>
          </el-upload>
          <div style="color: #f56c6c;">{{ $t('支持上传GIF图，点击则跳转至活动详情页') }};</div>
        </el-form-item>
      </el-form>
      <div class="activity-introduction-footer" v-show="!isSee">
        <el-button @click="$router.go(-1)">{{ $t('取消') }}</el-button>
        <el-button class="activity-introduction-footer_save" type="primary" @click="handleSave">{{ $t('保存') }}
        </el-button>
      </div>
    </div>
  </template>

  <script>
  import systemConfig from "../../../config/config.js";
  import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";

  import TinyEditor from "../../../components/TinyEditor";
  import moment from "moment";
  import { Form } from "element-ui";

  import { lang } from "@/i18n";


  export default {
    components: {
      StartAndEndTimeSelector,
      TinyEditor,
    },
    data() {
      return {
        labelList: [],
        formModel: {
          activityName: null,
          activityTime: true,
          useStart: null,
          useEnd: null,
          isOnline: true,
          isShow: 1,
          isBindingRule: 1,
          ruleId: null,
          actIds: [],
          sort: null,
          content: null,
          labelId: 0,
          lang: 0,
        },
        rules: {
          activityName: {
            required: true,
            message: this.$t("请输入活动名称"),
            trigger: "blur",
          },
          isOnline: {
            required: true,
            message: this.$t('请选择活动渠道'),
            trigger: 'blur'
          },
          activityTime: [
            { required: true },
            {
              validator: (rule, value, callback) => {
                const { useStart, useEnd } = this.formModel;
                if (useStart && useEnd) {
                  if (useStart <= useEnd) {
                    callback();
                  } else {
                    callback(new Error(this.$t("活动开始时间应该在结束时间之前")));
                  }
                } else {
                  callback(new Error(this.$t("请选择活动时间")));
                }
              },
              trigger: "blur",
            },
          ],
          isBindingRule: [
            { required: true },
            {
              validator: (rule, value, callback) => {
                const { isBindingRule, ruleId } = this.formModel;
                if (isBindingRule) {
                  if (ruleId) {
                    callback();
                  } else {
                    callback(new Error(this.$t("请选择规则")));
                  }
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          actIds: {
            required: true,
            message: this.$t("请至少选择一个分类展示"),
            trigger: "change",
          },
          labelId: {
            required: true,
            message: this.$t("请至少选择一个活动标签"),
            trigger: "change",
          },
          sort: [
            { required: true, message: this.$t("请填写排序号"), trigger: "blur" },
            { type: "integer", min: 1, message: this.$t("请输入正整数"), trigger: "blur" },
          ],
        },
        enablePcOrWap: [
          {
            validator: (rule, value, callback) => {
              const { activityLanguages, checkboxLanguage, uploadPcFile, uploadMbFile, languagesArr } = this;
              let bool = false
              checkboxLanguage.map(k => {
                const i = languagesArr.findIndex(v => v === k)
                const enableTerminal = activityLanguages[i].enableTerminal
                const pcBool = !!enableTerminal.find(v => v === 'enablePc')
                const wapBool = !!enableTerminal.find(v => v === 'enableMb')
                const bool2 = pcBool && !uploadPcFile[i]
                const bool3 = wapBool && !uploadMbFile[i]
                if ( !enableTerminal.length || bool2 || bool3 ) { bool = true }
              })
              if (bool) callback(new Error(this.$t("选中语种类型的支持终端至少勾选一个并上传对应图片")));
              else callback()
            },
          },
        ],
        content: [
          {
            validator: (rule, value, callback) => {
              const { activityLanguages, checkboxLanguage, languagesArr } = this;
              let bool = false
              checkboxLanguage.map(k => {
                const i = languagesArr.findIndex(v => v === k)
                const { content,  enableTerminal } = activityLanguages[i]
                if ( enableTerminal.includes('enablePc') && !content ) bool = true
              })
              if (bool) {
                callback(new Error(this.$t("请填写选中语种类型的活动介绍")))
              } else {
                callback()
              }
            },
          },
        ],
        mbContent: [
          {
            validator: (rule, value, callback) => {
              const { activityLanguages, checkboxLanguage, languagesArr } = this;
              let bool = false
              checkboxLanguage.map(k => {
                const i = languagesArr.findIndex(v => v === k)
                const { mbContent,  enableTerminal } = activityLanguages[i]
                if ( enableTerminal.includes('enableMb') && !mbContent ) { bool = true }
              })
              if (bool) {
                callback(new Error(this.$t("请填写选中语种类型的活动介绍")))
              } else {
                callback()
              }
            },
          },
        ],
        langType: {
          validator: (rule, value, callback) => {
            const { checkboxLanguage } = this
              if (!checkboxLanguage.length) {
                callback(this.$t('请选择语种类型'))
              } else {
                callback()
              }
          },
          trigger: 'change',
        },
        terminals: [
          {
            fileList: [],
            name: this.$t("PC端"),
            label: "enablePc", // 是否开启的字段
            field: "pcLogoUrl", // 保存后后端返回的图片url字段
            prop: "uploadPcFile", // 保存时二进制图片对应的参数字段
            remoteFileName: 'pcRemoteFileName',
            logoUrl: 'pcLogoUrl'
          },
          {
            fileList: [],
            name: this.$t("移动端"),
            label: "enableMb",
            field: "mbLogoUrl",
            prop: "uploadMbFile",
            sizeShow: null,
            remoteFileName: 'mbRemoteFileName',
            logoUrl: 'mbLogoUrl'
          }
        ],
        sizeShowList: [false, false, false, false, false, false],
        uploadPcFile: [],
        uploadMbFile: [],
        activityRules: [],
        activityCategories: [],
        activityLang: {
          activityId: null,
          language: '',
          enableTerminal: [],
          enablePc: '',
          enableMb: '',
          pcLogoUrl: '',
          pcRemoteFileName: null,
          mbLogoUrl: '',
          mbRemoteFileName: null,
          content: '',
          mbContent: '',
        },
        activityLanguages: [],
        languageList: [
          { value: "zh", label: lang("简体中文"), },
          { value: "zh_tw", label: lang("繁体中文") },
          { value: "vi", label: lang("越南文") },
          { value: "ms", label: lang("马来文") },
          { value: "th", label: lang("泰文") },
          { value: "en_us", label: lang("英文") },
        ],
        checkboxLanguage: ['zh'],
        languagesArr: ['zh', 'zh_tw', 'vi', 'ms', 'th', 'en_us'],
        uploadSizeBoolList: [false, false, false, false, false, false],
        iconList: [],
        iconPcList: [],
        iconShow: false,
        iconPcShow: false,
        hangUrl: '',
        mbHangUrl: '',
      };
    },
    computed: {
      id () {
        return Number(this.$route.query.id);
      },
      isSee () {
        return !!this.$route.query.isSee
      },
    },
    created() {
      this.setActivityLanguages()
      this.getActivityRulesLabels();
      const { id } = this;
      if (id) {
        this.$axios
          .get(systemConfig.urls.activityIntroduction.info + `/${id}`)
          .then((res) => {
            const formModel = res.data.data;
            formModel.activityTime = 1;
            formModel.isOnline = formModel.isOnline === null ? true : formModel.isOnline;
            formModel.actIds = formModel.actIds || [];
            formModel.useEnd = moment(formModel.useEnd)
              .subtract(1, "day")
              .format("YYYY-MM-DD");
            formModel.isBindingRule = formModel.ruleId ? 1 : 0;
            formModel.useStart = formModel.useStart.slice(0, -2);
            // 设置语言选择
            const activityLanguages = formModel.activityLanguages
            let cheLan = []
            activityLanguages.map(v => {
              const { language, enablePc, enableMb, pcLogoUrl, mbLogoUrl } = v
              language && cheLan.push(language)
              // 设置activityLanguages
              const cI = this.languagesArr.findIndex(item => item === language)
              v.enableTerminal = []
              enablePc && v.enableTerminal.push('enablePc')
              enablePc && this.$set(this.uploadPcFile, cI, pcLogoUrl)// 设置图片校验处理
              enableMb && v.enableTerminal.push('enableMb')
              enableMb && this.$set(this.uploadMbFile, cI, mbLogoUrl)
              this.$set(this.activityLanguages, cI, v)
            })
            this.checkboxLanguage = cheLan
            // 设置图片
            const arr = [];
            this.hangUrl = formModel.hangUrl
            this.mbHangUrl = formModel.mbHangUrl
            this.iconList = this.mbHangUrl ? [{name: '', url: this.mbHangUrl }] : []
            this.iconPcList = this.hangUrl ?  [{name: '', url: this.hangUrl }] : []

            this.terminals.forEach(({ label, prop, field, name }, index) => {
              const imgSrc = formModel[field];
              if (imgSrc) {
                // formModel.enableTerminal.push(label);
                this.terminals[index].fileList = [
                  {
                    name: name + this.$t("图片"),
                    url: imgSrc,
                  },
                ];
                arr.push(
                  new Promise((resolve, reject) => {
                    const img = document.createElement("img");
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    img.crossOrigin = "Anonymous";
                    img.src = imgSrc;
                    img.onload = () => {
                      const { width, height } = img;
                      canvas.width = width;
                      canvas.height = height;
                      context.clearRect(0, 0, width, height);
                      context.drawImage(img, 0, 0, width, height);
                      canvas.toBlob((blob) => {
                        // this[prop] = blob;
                        resolve();
                      }, "image/jpeg");
                    };
                    img.onerror = () => {
                      reject();
                    };
                  })
                );
              }
            });
            Promise.all(arr).finally(() => {
              this.formModel = formModel;
              this.$nextTick(() => {
                this.$refs.form.clearValidate();
              });
            });
          });
      }
      this.getActivityRules();
      this.getActivityCategories();
    },
    methods: {
      handleSave() {
        // 判断图片大小范围
        let bool = false, bi
        this.uploadSizeBoolList.map((v, i) => {
          if (v) {
            bool = true
            bi = i
          }
        })
        if (bool) {
          this.$message.error(`${this.languageList[bi].label}下上传图片大小不可超过1M`)
          return;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            const formData = new FormData();
            const formModel = JSON.parse(JSON.stringify(this.formModel));
            const { terminals, activityLanguages, checkboxLanguage } = this;
            const { isBindingRule, ruleId } = formModel;
            // 绑定规则
            formModel.ruleId = isBindingRule ? ruleId : null;
            const activityCurLang = JSON.parse(JSON.stringify(activityLanguages))
            // 设置语言对应的： 终端/图片/id/
            activityCurLang.map((lv, i) => {
              for (const { label, prop, logoUrl } of terminals) {
                const num = Number(lv.enableTerminal.length && lv.enableTerminal.includes(label))
                lv[label] = num
                lv[logoUrl] = (num && (this[prop][i] || lv[logoUrl])) || ''
                lv.activityId = this.id || null
              }
              delete lv.enableTerminal
            })
            const iArr = []

            //设置语言对应的：language
            checkboxLanguage.map(v => {
              const curIndex = this.languagesArr.findIndex(lan => lan === v)
              curIndex >= 0 && iArr.push(curIndex)
              curIndex >= 0 ? activityCurLang[curIndex].language = v : ''
            })
            let paramsActivityCurLang = []
            activityCurLang.map((v, i) => {
              if (iArr.includes(i)) {
                paramsActivityCurLang.push(v)
              }
            })
            formModel.activityLanguages = paramsActivityCurLang
            formModel.hangUrl = this.hangUrl
            formModel.mbHangUrl = this.mbHangUrl
            formModel.useEnd =
              moment(formModel.useEnd).add(1, "day").format("YYYY-MM-DD") +
              " 00:00:00";
            delete formModel.activityTime;
            delete formModel.isBindingRule;
            formData.append("activity", JSON.stringify(formModel));
            const loading = this.$loading({ fullscreen: true });
            this.$axios
              .post(
                this.id
                  ? systemConfig.urls.activityIntroduction.update
                  : systemConfig.urls.activityIntroduction.save,
                formData
              )
              .then(() => {
                this.$router.go(-1);
              })
              .finally(() => {
                loading.close();
              });
          }
        });
      },
      handleExceed() {
        this.$message.warning(this.$t("超出图片个数限制"));
      },
      handleImageChange(prop, logoUrl, languageIndex) {
        return (file, fileList) => {
          const isLt1M = file.size / 1024 / 1024 <= 1;
          if (!isLt1M) {
            this.$message.error("图片大小不可超过1M");
            this.sizeShowList[languageIndex] = true;
            this.uploadSizeBoolList[languageIndex] = true;
          } else {
            this.sizeShowList[languageIndex]  = false;
            this.uploadSizeBoolList[languageIndex] = false;
          }
          // 转化url
          const formData = new FormData()
          formData.append('uploadFile', file.raw)
          this.$axios.post(systemConfig.urls.uploadImage, formData)
          .then(({ data }) => {
            this[prop][languageIndex] = data.path
            this.$set(this.activityLanguages[languageIndex], logoUrl, data.path)
          })
          this.$refs.form.validateField("enableTerminal");
        };
      },
      remove(languageIndex, uploadFile, field) {
        return () => {
          this.sizeShowList[languageIndex]  = false;
          this[uploadFile][languageIndex] = ''
          // this.activityLanguages[i][field] = ''
          this.$set(this.activityLanguages[languageIndex], field, '')
          this.handleTriggerValidate()
        };
      },
      handleIconChange(isPc) {
        const bool = !!isPc
        return ({ raw }) => {
          if (/^image/.test(raw.type)) {
            const formData = new FormData()
            formData.append('uploadFile', raw)
            this.$axios.post(systemConfig.urls.uploadImage, formData)
              .then(({ data }) => {
                if (bool) {
                  this.hangUrl = data.path
                  return
                }
                this.mbHangUrl = data.path
              })
          } else {
            this.$message.error(this.$t('文件格式错误，只支持图片！'))
          }
        }
        
      },
      iconRemove() {
        this.iconShow = false
        this.mbHangUrl = ''
        this.iconList = []
      },
      iconPcRemove () {
        this.iconPcShow = false
        this.hangUrl = ''
        this.iconPcList = []
      },
      getActivityRules() {
        return this.$axios
          .get(systemConfig.urls.activityRule.listAll)
          .then((res) => {
            this.activityRules = res.data.data
            // res.data.data.map(ws=>{
            //   if(ws.activityId){
            //     this.activityRules.push(ws)
            //   }
            // })
          });
      },
      getActivityRulesLabels() {
        this.$axios
          .get(systemConfig.urls.activityRule.oprActLabelList)
          .then((res) => {
            this.labelList = [
              {
                labelName: this.$t("无"),
                id: 0,
              },
              ...res.data.data,
            ];
          });
      },
      getActivityCategories() {
        return this.$axios
          .get(systemConfig.urls.activityCategory.listAll)
          .then((res) => {
            this.activityCategories = res.data.page;
          });
      },
      showCurrentLanguage (k) {
        return k === this.checkboxLanguage[this.checkboxLanguage.length - 1 ]
      },
      setActivityLanguages () {
        let nArr = []
        this.languagesArr.map(() => {
          nArr.push(JSON.parse(JSON.stringify(this.activityLang)))
        })
        this.activityLanguages = nArr
      },
      setUrl(prop) {
        return this[prop][i]
      },
      handleTriggerValidate() {// 手动刷新选中语种下支持终端及相关内容，并不影响其他内容
        this.$refs.form.validate(() => {})
        const arr = ['activityName', 'activityTime', 'isOnline', 'isShow', 'isBindingRule', 'actIds', 'labelId', 'sort', 'langType']
        arr.map(v => {
          this.$refs.form.clearValidate(v);
        })
      }
    },
    watch: {
      activityLanguages: {
        handler(n, o) {
          this.handleTriggerValidate()
        },
        deep: true
      },
      checkboxLanguage: {
        handler(n, o) {
          this.handleTriggerValidate()
        },
        deep: true
      },
    }
  };
  </script>

  <style lang="scss" scoped>
  .activity-introduction-editor-wrapper {
    width: 939px;
  }

  /deep/ .activity-introduction-inline-block {
    display: inline-block;
    vertical-align: top;

    & + .activity-introduction-inline-block {
      margin-left: 40px;
    }
  }

  .activity-introduction-form-wrapper {
    padding: 40px;
  }

  .activity-introduction-header {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    .activity-introduction-header_btn {
      float: right;
    }
  }

  .activity-introduction-body {
    padding: 30px;
    border: 1px solid #eee;
    .w980 {
      width: 980px;
    }
  }

  .activity-introduction-footer {
    display: flex;
    margin-top: 20px;
    justify-content: center;

    .activity-introduction-footer_save {
      margin-left: 30px;
    }
  }

  .activity-introduction-terminal {
    margin-bottom: 20px;
    max-height: 134px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .note {
    color: red;
    position: relative;
    left: 11px;
  }
  ::v-deep .el-upload-list__item {
    transition: none !important;
  }
  </style>
