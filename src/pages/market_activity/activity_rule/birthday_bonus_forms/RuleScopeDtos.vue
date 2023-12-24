<template>
  <div>
    <el-table border class="selfTable"
              :data="ruleScopeDtos"
    >
      <el-table-column
        :label="$t('会员星级')"
        prop="actLevelId"
        align="center"
        class="fa"

      >
        <template slot-scope="scope">
          {{vipName(scope.row.actLevelId)}}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('当日最低投注')"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :id="'validbetMin'+scope.$index" @blur="inputTest"
                    v-model="ruleScopeDtos[scope.$index].validbetMin" :placeholder="$t('请输入当日最低投注')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('当日最低存款')"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :id="'depositMin'+scope.$index" @blur="inputTest"
                    v-model="ruleScopeDtos[scope.$index].depositMin" :placeholder="$t('请输入当日最低存款')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('赠送金额')"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :id="'donateAmount'+scope.$index" @blur="inputTest"
                    v-model="ruleScopeDtos[scope.$index].donateAmount" :placeholder="$t('请输入赠送金额')"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('流水倍数')"
        align="center"
      >
        <template slot-scope="scope">
          <el-input :id="'multipleWater'+scope.$index" @blur="inputTestInt"
                    v-model="ruleScopeDtos[scope.$index].multipleWater" :placeholder="$t('请输入流水倍数')"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    checkNatureNumber,
    checkNumberAndDecimals
  } from "../../../../config/utils"

  const checkNumberAndTwoDecimal = function (value) {
    return checkNumberAndDecimals(value, 2);
  }

  export default {
    props: ["ruleScopeDtos",'memvips'],
    data() {
      return {
        rules: {
          depositMin: [
            {
              validator: (rule, value, callback) => {
                const {depositMin} = this.ruleScopeDtos
                if (checkNumberAndTwoDecimal(depositMin) && depositMin >= 0) {
                  callback()
                } else {
                  callback(this.$t('大于等于0且允许2位小数'))
                }
              },

              trigger: 'blur',
            },
          ],
          validBetMin: [
            {
              validator: (rule, value, callback) => {
                const {validBetMin} = this.ruleScopeDtos
                if (checkNumberAndTwoDecimal(validBetMin) && validBetMin >= 0) {
                  callback()
                } else {
                  callback(this.$t('大于等于0且允许2位小数'))
                }

              },
              trigger: 'blur',
            },
          ],
          donateAmount: [
            {
              validator: (rule, value, callback) => {
                const {donateAmount} = this.ruleScopeDtos
                if (checkNumberAndTwoDecimal(donateAmount) && donateAmount > 0) {
                  callback()
                } else {
                  callback(this.$t('大于0且允许2位小数'))
                }
              },
              trigger: 'blur',
            },
          ],
          multipleWater: [
            {
              validator: (rule, value, callback) => {
                const {multipleWater} = this.ruleScopeDtos
                if (checkNatureNumber(multipleWater)) {
                  callback()
                } else {
                  callback(this.$t('应为非负整数'))
                }
              },
              trigger: 'blur',
            },
          ],
        },
        sameObj:{}
      };
    },
    methods:{
      vipName( id){
        // debugger
        let name
        const item = this.memvips.map(item=> {
          if (item.id == id)
          {
            name = item.tierName
          }
        })
        return  name
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
          this.sameObj[id] =0
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
      inputTestInt(event) {
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
          this.sameObj[id] =0
          this.$emit('checkIsClick',this.sameObj)
          return;
        }
        if (!checkNatureNumber(val - 0)) {
          dom.style.border="1px solid red";
          this.$message('不能为小数');
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
      }
    },
    computed: {

    },
  };
</script>

<style scoped lang="scss">
  .firstSaveType {
    /deep/ .el-input {
      width: 10%;
    }
  }

  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
</style>
