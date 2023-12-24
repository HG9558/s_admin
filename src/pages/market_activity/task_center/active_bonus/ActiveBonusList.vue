<template>
  <div>
    <el-form-item
      :label="$t('流水倍数') + ':' "
      prop="multipleWater"
      :rules="rules.isInteger(tableData.rule.multipleWater)"
    >
      <el-input-number
        v-model="tableData.rule.multipleWater"
        :controls="false"
        :placeholder="$t('请输入倍数')"
      ></el-input-number>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
    <el-form-item :label="$t('申请条件')">
      <el-checkbox-group
        class="activity-rule-inline-block"
        v-model="conditions"
        @change="handleConditionsChange"
      >
        <el-checkbox
          :label="item.value"
          v-for="item in conditionsGroup"
          :key="item.value"
        >{{ item.label }}
        </el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>

    <el-form-item :label="$t('周期结束后循环') + ':' ">
      <el-radio-group v-model="tableData.rule.cycle">
        <el-radio :label="1">{{ $t('是') }}</el-radio>
        <el-radio :label="0">{{ $t('否') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('连续签到另送') + ':' ">
      <el-radio-group v-model="tableData.rule.extraBonus">
        <el-radio :label="1">{{ $t('是') }}</el-radio>
        <el-radio :label="0">{{ $t('否') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('奖励规则') + ':' ">
      <span>*{{ $t('当日未领取视为自动放弃，任务中断，可从第一天再次开始领取') }}</span>
      <div style="clear: both">
        <el-button
          type="primary"
          style="margin-top: 10px;"
          :disabled="tableData.rule.filesDtos.length >5"
          @click="handleAdd(1)"
        >
          {{ $t('添加档位') }}
        </el-button>
        <el-button
          type="danger"
          style="margin-top: 10px;"
          :disabled="tableData.rule.filesDtos.length < 2"
          @click="handleDelete(1)"
        >
          {{ $t('删除档位') }}
        </el-button>
      </div>
      <div class="d_up">
        <el-table border class="selfTable" :key="index" v-for="(item,index) in tableData.rule.filesDtos"
                  :data="item"
                  style="width: 200px;float: left" :style="index == 0?'width: 240px':'width:140px'">
          <el-table-column
            v-if="index == 0"
            :label="$t('奖励档位')"
            prop="day"
            align="center"
            class="fa"
            width="110"
          >
          </el-table-column>

          <el-table-column
            :label="(index+ 1).toString()"
            align="center"
          >
            <template slot-scope="scope">
              <el-input :id="'dang'+ scope.$index + index" @blur="inputTest" v-model="item[scope.$index].bonusAmount" :placeholder="$t('请输入内容')"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--------------------------------上下表格-->
      <div class="d_down" style="clear: both">
        <el-table border class="selfTable" :key="index" v-for="(item,index) in tableData.rule.dayDtoList" :data="item"
                  style="width: 200px;float: left" :style="index == 0?'width: 240px':'width:140px'">
          <el-table-column
            v-if="index == 0"
            :label="$t('连续领取天数')"
            prop="day"
            align="center"
            class="fa"
            width="110">
          </el-table-column>

          <el-table-column
            :label="$t('奖励金额')"
            align="center">
            <template slot-scope="scope">
              <el-input :id="'jiang'+scope.$index + index" @blur="inputTest" v-model="item[scope.$index].bonusAmount" :placeholder="$t('请输入奖励金额')"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="clear: both">
        <el-button
          type="primary"
          style="margin-top: 10px;"
          :disabled="tableData.rule.dayDtoList.length > 100"
          @click="handleAdd(0)"
        >
          {{ $t('添加天数') }}
        </el-button>
        <el-button
          type="danger"
          style="margin-top: 10px;"
          :disabled="isDeleteDisabled"
          @click="handleDelete(0)"
        >
          {{ $t('删除天数') }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item
      :label="$t('规则说明') + ':' "
      prop="memoRule" :rules="memoRule"
    >
     <el-row>
      <el-checkbox-group v-model="tableData.rule.checkboxLanguage">
        <el-checkbox-button v-for="(item, index) in languageList" :label="item.value" :key="index">{{item.label}}</el-checkbox-button>
      </el-checkbox-group>
     </el-row>
     <el-row style="marginTop: 10px">
      <span v-for="item in languageValList" :key="item">
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
    <el-form-item
      :label="$t('宣传语') + ':' "
      prop="memoRule"
    >
        <el-input
        v-model="tableData.rule.adContent"
        type="textarea"
        :rows="5"
        style="width: 400px;"
        :placeholder="$t('不填,则前台不展示') + '...'"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script>
  import {
    checkNumberAndDecimals
  } from "../../../../config/utils";
  import { lang } from "@/i18n";

  export default {
    props: ["rowData", "temp", "rules", 'languageValList'],
    data() {
      return {
        conditions: [],
        sameArr:[],
        sameObj:{},
        conditionsGroup: [
          {
            label: this.$t("已实名"),
            value: "isName"
          },
          {
            label: this.$t("已验证手机"),
            value: "isMobile"
          },
          {
            label: this.$t("已验证银行卡"),
            value: "isBank"
          },
          {
            label: this.$t('已验证邮箱'),
            value: 'isMail'
          },
          // {
          //   label: "APP注册",
          //   value: "isApp"
          // }
        ],
        tableData: {},
        applyConditionsRules: {
          validator: (rule, value, callback) => {
            const {applyConditions} = this.tableData.rule

            if (applyConditions.length) {
              const res = applyConditions.every(item => {
                const val = this.tableData.rule[item]
                return val >= 0 && checkNumberAndDecimals(val, 2)
              })

              if (res) {
                callback()
              } else {
                callback(this.$t('最多两位小数的有效数值'))
              }
            } else {
              callback(new Error(this.$t('至少选择一项条件')))
            }
          },
          trigger: 'change',
        },
        memoRule: {
          validator: (rule, value, callback) => {
            const { languageValList } = this
            const { checkboxLanguage } = this.tableData.rule
            if (!checkboxLanguage.length) {
              callback(this.$t('请选择相应规则说明语言'))
            } else {
              let bool = false
              checkboxLanguage.map(item => {
                const index = this.languageValList.findIndex(v => v === item)
                if (!this.tableData.rule[languageValList[index]]) {
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
        applyConditions: [],
        languageList: [
          { value: "memo", label: lang("简体中文"), },
          { value: "en_usmemo", label: lang("英语") },
          { value: "msmemo", label: lang("马来语") },
          { value: "vimemo", label: lang("越南语") },
          { value: "thmemo", label: lang("泰语") },
          { value: "zh_twmemo", label: lang("繁体中文") },
        ],
      };
    },
    created() {
      this.initData();
    },
    mounted() {
      // 不加会出样式问题 巨坑
      this.$store.state.indexActive = "4-16";
    },
    computed: {
      isDeleteDisabled () {
        return this.tableData.rule.dayDtoList[0].length < (this.tableData.rule.extraBonus ? 3 :2)
      }
    },
    methods: {
      pareArr(itemNew){
         let arr = this.sameArr
         if(arr.length>0){
           arr.map(item => {
              if (item.id == itemNew.id)
              {
                item.value  = itemNew.value
              }
              return item
           })
         }else{
           this.sameArr.push(itemNew)
         }
      },
      intRandom(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
      },

      isInteger(obj) {
        return Math.floor(obj) === obj
      },
      inputTest(event) {
        let id = event.target.id
        let dom = document.querySelector('#'+ id)
        // dom.style.border="1px solid red";
        let val = event.target.value
        if(val == '')
        {
          return;
        }
        if (val < 0) {
          dom.style.border="1px solid red";
          this.$message(this.$t('不能为负数'));
          // this.pareArr({
          //   id:id,
          //   value :0
          // })
          this.sameObj[id] = 0
          this.$emit('checkIsClick',this.sameObj)
          return;
        }
        if (!(val >= 0 && checkNumberAndDecimals(val, 2))) {
          dom.style.border="1px solid red";
          this.$message(this.$t('最多两位小数的有效数值'));
          // this.pareArr({
          //   id:id,
          //   value :0
          // })
          this.sameObj[id] =0
          this.$emit('checkIsClick',this.sameObj)
          return
        }
        dom.style.border="0";
        this.sameObj[id] =1
        this.$emit('checkIsClick',this.sameObj)
        // this.pareArr({
        //   id:id,
        //   value :1
        // })
      },
      inputDay(val) {
        // if (this.isInteger(val)) {
        //   this.$message('请输入正整数');
        // }
      },
      initConditions() {
        // this.rule.isMail = false;
        for (const item of this.conditionsGroup) {
          const {value} = item;
          if (this.tableData.rule[value]) {
            this.conditions.push(value);
          }
        }
        this.handleConditionsChange();
      },
      handleConditionsChange() {
        const {conditions, conditionsGroup} = this;
        for (const {value} of conditionsGroup) {
          // debugger
          this.tableData.rule[value] = conditions.includes(value);
        }
      },
      initData() {
        const rowData = JSON.parse(JSON.stringify(this.rowData));
        // debugger

        rowData.rule = JSON.parse(rowData.rule);
        /*判断是否编辑 拿到后台数据还是走模板数据*/
        if (!rowData.rule) {
          rowData.rule = this.temp;
        }else{
          /*这里开始做数据处理 上下表格*/
          const { extraBonus } = rowData.rule
          rowData.rule.dayDtoList = []
          let t = []
          rowData.rule.filesDtos.map((item, index) => {
            if (extraBonus && item.extraBonusList) {
              let bonusDetail = item.extraBonusList[0]
              bonusDetail.day = this.$t('连续签到另送')
              item.dayDtoList.push(item.extraBonusList[0])
            }
            rowData.rule.dayDtoList.push(item.dayDtoList)
            t.push([
              {
                day: this.$t('当日存款不小于'),
                bonusAmount: item.depositAmount,
              },
              {
                day: this.$t('当日投注不小于'),
                bonusAmount: item.validBet,
              }
            ])
          })
          rowData.rule.filesDtos = t

          // 规则说明语言用到
          let checkboxLanguage = []
          this.languageValList.map(k => {
            if (rowData.rule[k]) {
              checkboxLanguage.push(k)
            }
          })
          rowData.rule.checkboxLanguage = checkboxLanguage
        }
        this.tableData = rowData;
        this.initConditions()
      },
      handleTableDataChange(value) {
        const sendData = JSON.parse(JSON.stringify(value));
        const arr = ['depositAmount', 'validBet']

        arr.forEach(item => {
          if (!this.applyConditions.includes(item)) {
            if (sendData.rule) {
              sendData.rule[item] = null
            }
          }
        })
        this.$emit("changeVal", sendData);
      },
      handleAdd(x, bool) {
        const {length} = this.tableData.rule.dayDtoList[0]
        if (x) {
          if (this.tableData.rule.dayDtoList.length > 4) {
            return
          }
          let arr = []
          for (let i = 1; i <= length; i++) {
            arr.push({
              day: i,
              bonusAmount: null,
            })
          }
          this.tableData.rule.dayDtoList.push(
            arr
          )
          this.tableData.rule.filesDtos.push(
            [
              {
                day: this.$t('当日存款不小于'),
                bonusAmount: null,
              },
              {
                day: this.$t('当日投注不小于'),
                bonusAmount: null,
              }
            ],
          )
        } else {
          const arr = this.tableData.rule.dayDtoList
          const isHaveContinueSignSendBool = arr[0].find(item => item.day.length > 3 && this.$t(item.day) === this.$t('连续签到另送'))
          arr.map((item, i) => {
            if (isHaveContinueSignSendBool) {
              const v = { day: item.length,  bonusAmount: null}
              item.splice(item.length - 1, 0, v)
              return
            }
            item.push({
              day: bool ? this.$t('连续签到另送') : item.length + 1,
              bonusAmount: null,
            })
          })
        }
      },
      handleDelete(x) {
        if (x) {
          this.tableData.rule.filesDtos.pop()
          this.tableData.rule.dayDtoList.pop()
        } else {
          const { extraBonus } = this.tableData.rule
          this.tableData.rule.dayDtoList.map(item => {
            if (!extraBonus) {
              item.length > 1 && item.pop()
              return
            }
            const bool = item.find(v => v.day.length > 3 && this.$t(v.day) === this.$t('连续签到另送'))
            if (bool) {
              const length = item.length
              item.splice(length - 2, 1)
            }
          })
        }
      },
    },
    watch: {
      tableData: {
        handler(value) {
          this.handleTableDataChange(value)
        },
        deep: true,
        immediate: true
      },
      'tableData.rule.extraBonus': {
        handler(v) {
          const dayDtoListOne = this.tableData.rule.dayDtoList[0]
          const bool = dayDtoListOne.find(item => item.day.length > 3 && this.$t(item.day) === this.$t('连续签到另送'))
          if (v && !bool) {
            this.handleAdd(0, v)
            return
          }
          if (!v && bool) {
            this.handleDelete(0)
          }
        },
      },
      sameObj(newV,oldV){
        this.$emit('checkIsClick',value)
      },
    }
  };
</script>

<style lang="scss" scoped>
  .bonus-input {
    width: 100%;

    /deep/ .el-input__inner {
      text-align: center;
    }
  }

  .selfTable {
    .mt10 {
      margin-top: 10px !important;
    }
  }
</style>
