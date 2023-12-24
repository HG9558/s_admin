<template>
  <el-form class="bank-list-form" :model="validateData" ref="form" :rules="rules">
    <el-table
      border
      :data="tableDataList"
    >
      <el-table-column :label="$t('银行名称')" width="200px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-bankId`">
            <el-select v-model="scope.row.bankId" :placeholder="$t('请选择银行')" :disabled="bankList.length < 1" @change="bankChange(scope.$index, scope.row.bankId)">
              <el-option v-for="item in bankList" :label='item.label' :key="item.value" :value='item.value'></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('姓名')" width="180px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-realName`">
            <el-input v-model="scope.row.realName" :placeholder="$t('请输入姓名')"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('每日限额')" width="120px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-dayMaxAmout`">
            <el-input v-model.number="scope.row.dayMaxAmout"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('单笔限额')" width="415px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-minAmout`" class="single-amount-input">
            <el-input v-model.number="scope.row.minAmout" :placeholder="$t('请输入最小值')"></el-input>
          </el-form-item> ~
          <el-form-item :prop="`row${scope.$index}-maxAmout`" class="single-amount-input">
            <el-input v-model.number="scope.row.maxAmout" :placeholder="$t('请输入最大值')"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('固定金额')" width="140px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-fixedAmount`">
            <el-input v-model="scope.row.fixedAmount" :placeholder="$t('请用,隔开')"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('卡号')" width="220px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-bankAccount`">
            <el-input v-model="scope.row.bankAccount" :placeholder="$t('请输入卡号')"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('开户支行')" width="180px">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-bankBranch`" v-if="!scope.row.bsbShowBn">
            <el-input v-model="scope.row.bankBranch" :placeholder="$t('请输入开户支行')"></el-input>

          </el-form-item>
          <span v-else></span>
        </template>
      </el-table-column>

      <!--  BSB码 -->
       <el-table-column :label="$t('BSB码')">
        <template slot-scope="scope">
          <el-form-item :prop="`row${scope.$index}-bankBranch`"  v-if="scope.row.bsbShowBn">
            <el-input v-model="scope.row.bankBranch" :placeholder="$t('请输入BSB码')"></el-input>
          </el-form-item>
          <span v-else></span>
        </template>
      </el-table-column>
      <!--  BSB码 -->
    </el-table>
    <div class="btns">
      <a href="javascript:;" @click="addBankCard" >+</a>
      <a href="javascript:;" v-for="index in tableDataList.length" :key="index" v-show="tableDataList.length > 1" @click="removeBankCard(index)">-</a>
    </div>
  </el-form>
</template>

<script>
import systemConfig from '../../config/config.js'
export default {
  props: ['tableData', 'payId','alipayFlgAuth', 'amountType'],
  data(){
    return {
      bankList: [],
      tableDataList: [
        {
          bankId: null,
          realName: null,
          dayMaxAmout: null,
          minAmout: null,
          maxAmout: null,
          bankAccount: null,
          fixedAmount: null,
          bankBranch: null,
          bsbShowBn: false,
        }
      ],
      bsbShowList: [ { bsbShowBn: false } ],
    }
  },
  computed: {
    addShow () {
      return this.alipayFlgAuth !== '1'
    },
    validateData(){
      const data = {}
      this.tableDataList.forEach((item, index) => {
        for(let i in item){
          data[`row${index}-${i}`] = item[i]
        }
      })
      return data
    },
    rules(){
      const rules = {}
      for (let i = 0; i < this.tableDataList.length; i++) {
        rules[`row${i}-bankId`] = systemConfig.rules.commonRule.shouldSelect
        rules[`row${i}-realName`] = systemConfig.rules.commonRule.realNameContainEnglishName
        rules[`row${i}-dayMaxAmout`] = [
          {pattern: /^[1-9]\d*$/, message: this.$t('请输入正整数')},
          {required: true, message: this.$t('此处不能为空'),trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (value < this.tableDataList[i].maxAmout) {
                callback(new Error(this.$t('单日限额不小于单笔最大现额')))
              } else{
                callback()
              }
            }
          }
        ]
        rules[`row${i}-bsbCode`] = [
          {pattern: /^[0-9]\d*$/, message: '请输入正整数'},
          {required: true, message: '此处不能为空',trigger: 'blur'},
        ]
        rules[`row${i}-minAmout`] = [
          {pattern: /^[1-9]\d*$/, message: this.$t('请输入正整数')},
          {required: this.amountType !== 1, message: this.$t('此处不能为空'),trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (value > this.tableDataList[i].maxAmout) {
                callback(new Error(this.$t('不能大于单笔最大限额')))
              } else{
                callback()
              }
            }
          },
          {
            validator: (rule, value, callback) => {
              if (value > this.tableDataList[i].dayMaxAmout) {
                callback(new Error(this.$t('不能大于每日最大限额')))
              } else{
                callback()
              }
            }
          }
        ]
        rules[`row${i}-maxAmout`] = [
          {pattern: /^[1-9]\d*$/, message: this.$t('请输入正整数')},
          {required: this.amountType !== 1, message: this.$t('此处不能为空'),trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              this.$refs.form.validateField(`row${i}-minAmout`)
              if (value < this.tableDataList[i].minAmout) {
                callback(new Error(this.$t('不能小于单笔最小限额')))
              } else{
                callback()
              }
            }
          },
          {
            validator: (rule, value, callback) => {
              if (value > this.tableDataList[i].dayMaxAmout) {
                callback(new Error(this.$t('不能大于每日最大限额')))
              } else{
                callback()
              }
            }
          }
        ]
        rules[`row${i}-fixedAmount`] = [
          {
            validator: (rule, value, callback) => {
              if (this.amountType === 1 && !value) return callback(this.$t('此处不能为空'))
              if (value) {
                const arr = value.split(',')
                for(let item of arr) {
                  if (/[^0-9\.,]/g.test(item)) {
                    return callback(this.$t('请输入数字'))
                  }
                }
              }
              callback()
            }
          }
        ]
        rules[`row${i}-bankAccount`] = systemConfig.rules.bankAddRule.account
        rules[`row${i}-bankBranch`] = [
          {
            validator: (rule, value, callback) => {
              if (!this.tableDataList[i].bsbShowBn) {
                callback()
                return
              }
              const data = this.tableDataList[i].bankBranch
              const reg = /^\d{0,9}$/
              if(!data) {
                callback(new Error('请输入BSB码'))
              }else if (!reg.test(data)) {
                callback(new Error('请输入正确的BSB码'))
              } else{
                callback()
              }
            }
          },
        ]
      }
      return rules
    }
  },
  watch: {
    tableData: {
      deep: true,
      immediate: true,
      handler(value){
        if (value) {
          const data = JSON.parse(JSON.stringify(value))
          data && data.map(item => {
            item.bsbShowBn = item.areaCode === 'AUD' && item.bankName !== 'PAYID'
            return data
          })
          this.tableDataList = data
        }
      }
    },
    payId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.getBankList()
        }
      }
    }
  },
  methods: {
    validate(callback){
      this.$refs.form.validate(valid => {
        if(valid){
          callback(this.tableDataList.map(item => {
            const bankName = this.bankList.find(bank => bank.value === item.bankId).label
            item.bankName = bankName
            return item
          }))
        }else{
          callback(false)
        }
      })
    },
    removeBankCard(index){
      this.tableDataList.splice(index - 1, 1)
    },
    addBankCard(){
      const newCard = {}
      Object.keys(this.tableDataList[0]).forEach(item => {
        newCard[item] = null
      })
      this.tableDataList.push(newCard)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    getBankList(){
      this.$axios.get(systemConfig.urls.autoIncomeBankList, {params: {payId: this.payId}})
      .then(res => {
        this.bankList = res.data.data.map(item => {
          const bankName = item.bankName.replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "").replace(/\s+/g, "")
          return {
            label: bankName,
            value: item.id,
            areaCode: item.areaCode
          }
        })
        this.tableDataList.forEach(item => {// 如果bankList中不存在bank.value === item.bankId，则需要用户重新选择
          if (!this.bankList.find(bank => bank.value === item.bankId)) {
            item.bankId = null
          }
        })
      })
    },
    bankChange(index, id) {
      const currentBank = this.bankList.find(item => item.value === id)
      const bool = currentBank && currentBank.areaCode === 'AUD' && currentBank.label !== 'PAYID'
      this.$set(this.tableDataList[index], 'bsbShowBn', bool)
      this.$set(this.tableDataList[index], 'bankBranch', null)
    }
  }
}
</script>

<style lang="scss" scoped>
.bank-list-form {
  position: relative;
  margin-top: 20px;
  width: 100%;
  .el-form-item{
    margin: 14px 0;
    /deep/ .el-form-item__error{
      top: 94%;
    }
  }
  /deep/ .el-table__row {
    height: 84px;
  }
  /deep/ .el-table .cell {
    overflow: visible;
  }
  .single-amount-input{
    display: inline-block;
    width: 45%;
  }
  .btns {
    position: absolute;
    right: -21px;
    top: 8px;
    a {
      display: block;
      color: #b5b4c2;
      font-weight: bold;
      font-size: 16px;
      border: 1px solid #b5b4c2;
      border-radius: 4px;
      width: 16px;
      height: 16px;
      line-height: 14px;
      text-align: center;
      margin-bottom: 50px;
      &:first-child {
        margin-bottom: 34px;
      }
    }
  }
}
</style>


