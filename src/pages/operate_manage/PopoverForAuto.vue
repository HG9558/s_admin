<template>
  <div class="ali-popover evaz-popover" :style =" {left: clientX + 'px',top: clientY + 'px'}">
    <div class="content">
      <el-form class="bank-list-form" :model="validateData" ref="form" :rules="rules">
        <el-table max-height="480" border :data="tableDataList">
          <el-table-column label="" width="35px">
            <template slot-scope="scope">
              <el-checkbox :disabled="scope.row.isShow && isShowLeftOne" v-model="scope.row.isShow" :true-label="1"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="$t('银行卡')" width="180px">
            <template slot-scope="scope">
              <div class="ct" v-if="scope">
                <div>{{scope.row.bankName}}</div>
                <div>{{scope.row.realName}}</div>
                <div><span :class="[scope.row.depositAmount >= scope.row.dayMaxAmout? 'red': 'green']">{{scope.row.depositAmount}}</span>/<span :class="[scope.row.depositAmount >= scope.row.dayMaxAmout? 'red': '']">{{scope.row.dayMaxAmoutText}}</span></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单日最大限额')" width="190px">
            <template slot-scope="scope">
              <el-form-item :prop="`row${scope.$index}-dayMaxAmout`">
                <el-input v-model.number="scope.row.dayMaxAmout"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单笔限额')" width="289px">
            <template slot-scope="scope">
              <el-form-item :prop="`row${scope.$index}-minAmout`" class="single-amount-input">
                <el-input v-model.number="scope.row.minAmout" :placeholder="$t('请输入最小值')"></el-input>
              </el-form-item> ~
              <el-form-item :prop="`row${scope.$index}-maxAmout`" class="single-amount-input">
                <el-input v-model.number="scope.row.maxAmout" :placeholder="$t('请输入最大值')"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="change-btn">
      <el-button size="mini" @click="closePopover">{{ $t('取消') }}</el-button>
      <el-button type="primary" size="mini" @click="submit">{{ $t('确认修改') }}</el-button>
    </div>
  </div>
</template>
<script>
import systemConfig from '../../config/config.js'
export default {
  props: ['visible', 'deposits', 'clientX', 'clientY'],
  data(){
    return {
      tableDataList: []
    }
  },
  computed: {
    isShowLeftOne(){// isShow值为1的银行卡是否只剩一个了
      let num = 0
      this.tableDataList.forEach(item => {
        if(item.isShow){
          num++
        }
      })
      return num <= 1
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
        rules[`row${i}-minAmout`] = [
          {pattern: /^[1-9]\d*$/, message: this.$t('请输入正整数')},
          {required: true, message: this.$t('此处不能为空'),trigger: 'blur'},
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
          {required: true, message: this.$t('此处不能为空'),trigger: 'blur'},
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
      }
      return rules
    }
  },
  created(){
    this.tableDataList = this.deposits.map(item => {
      // 用于渲染银行卡的dayMaxAmout
      return {
        ...item,
        dayMaxAmoutText: item.dayMaxAmout
      }
    })
  },
  methods: {
    closePopover () {
      //this.$emit('update:visible',false)
      this.$emit('hide')
    },
    submit () {
      this.$refs.form.validate(valid => {
        if(valid){
          const arr = this.tableDataList.map(item => {
            return {
              id: item.id,
              quotaType: 2,
              minAmout: item.minAmout,
              maxAmout: item.maxAmout,
              dayMaxAmout: item.dayMaxAmout,
              isShow: item.isShow
            }
          })
          this.$axios.post(systemConfig.urls.updateQuotaBatch, arr).then((res) => {
            if (res.data.msg === 'success') {
              this.$message({
                type: 'success',
                message: this.$t('修改成功')
              })
              this.closePopover()
              this.$emit('submit')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.evaz-popover{
  width: auto;
  .bank-list-form{
    margin-bottom: 10px;
    .single-amount-input{
      display: inline-block;
      width: 45%;
    }
  }
}
</style>

