<template>
  <div>
    <div>
      <el-input type="number" :placeholder="$t('请输入内容')" v-model="input">
        <template slot="prepend">{{ $t('佣金比例') }}</template>
        <template slot="append">
          <el-button @click="allWrite">{{ $t('一键输入') }}</el-button>
        </template>
      </el-input>
    </div>
    <!--表格-->
    <el-table max-height="480"
      @selection-change="handleSelectionChange"
      :data="tableData"
      style="width: 100%"
      class="proxy">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        :label="$t('序号')">
      </el-table-column>
      <el-table-column
        prop="depotName"
        :label="$t('平台')">
      </el-table-column>
      <div v-for="(i,index) in headerLength" :key="index">
        <el-table-column
          prop="catName"
          :label="$t('游戏类型')">
          <template slot-scope="scope">
            <!--{{scope.row.detailsDtoList[index]}}-->
            {{renderType(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          :label="$t('佣金方式')"
        >
          <el-table-column
            prop='catName'
            :label=index.toString()
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.detailsDtoList[index]">
                <div v-if="!scope.row.detailsDtoList[index].isShow">
                  <span v-if="scope.row.detailsDtoList[index].ratio"
                        :class="scope.row.detailsDtoList[index].isError?'red':''">
                   {{scope.row.detailsDtoList[index].commissionType != null?scope.row.detailsDtoList[index].commissionType == 0?'M':'N':'' }}
                   {{renderValue(scope.row,index)}}
                   %
                  </span>
                  <span v-else>
                    -
                  </span>
                  <el-button v-show="!noEdit" @click="editThis(scope.row.detailsDtoList[index],index,scope.$index,1)">
                    {{ $t('编辑') }}
                  </el-button>
                </div>
                <div v-else>
                  <el-input type="number" @change="inputValue" :placeholder="renderValue(scope.row,index)"/>
                  <el-button @click="saveThis(scope.row.detailsDtoList[index],index,scope.$index)">{{ $t('保存') }}</el-button>
                  <el-button @click="editThis(scope.row.detailsDtoList[index],index,scope.$index,0)">{{ $t('取消') }}</el-button>
                </div>
              </div>

            </template>
          </el-table-column>
        </el-table-column>
      </div>
    </el-table>
    <!--条件-->
    <span class="block">
        *{{ $t('佣金基础条件') }}
     </span>
    <div class="inline-block">
      <el-checkbox :disabled="noClick" @change="boxPullDataOne" class="block wid-200" v-model="isDeposit">{{ $t('基础存款人数') }}/{{ $t('人') }}
      </el-checkbox>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="depositMin"
                :placeholder="$t('请输入内容')"></el-input>
      <span>-</span>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="depositMax"
                :placeholder="$t('请输入内容')"></el-input>
    </div>
    <div class="inline-block">
      <el-checkbox :disabled="noClick" @change="boxPullDataTwo" class="block wid-200" v-model="isBet">{{ $t('基础投注人数') }}/{{ $t('人') }}
      </el-checkbox>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="betMin"
                :placeholder="$t('请输入内容')"></el-input>
      <span>-</span>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="betMax"
                :placeholder="$t('请输入内容')"></el-input>
    </div>
    <div class="inline-block">
      <el-checkbox :disabled="noClick" @change="boxPullDataThree" class="block wid-200" v-model="isValidBet">{{ $t('基础有效投注额') }}/{{ currencyText() }}
      </el-checkbox>
      <el-input :disabled="noClick" size="mini" type="number" class="inline-block-200" @change="pullData"
                v-model="validBetMin"
                :placeholder="$t('请输入内容')"></el-input>
      <span>-</span>
      <el-input :disabled="noClick" size="mini" type="number" class="inline-block-200" @change="pullData"
                v-model="validBetMax"
                :placeholder="$t('请输入内容')"></el-input>
    </div>
    <div class="inline-block">
      <el-checkbox :disabled="noClick" @change="boxPullDataFour" class="block wid-200" v-model="isNetProfit">{{ $t('基础净盈利额') }} /{{ currencyText() }}
      </el-checkbox>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="netProfitMin"
                :placeholder="$t('请输入内容')"></el-input>
      <span>-</span>
      <el-input :disabled="noClick" size="mini" type="number" @change="pullData" class="inline-block-200"
                v-model="netProfitMax"
                :placeholder="$t('请输入内容')"></el-input>
    </div>
    <!-- <span class="block" v-show="parseInt(index) ==0">
        *自动进阶佣金阶段
     </span>
    <div class="inline-block" v-show="parseInt(index) ==0">
      <el-radio-group v-model="checkboxGroup">
        <el-radio label="启用"></el-radio>
        <el-radio label="禁用"></el-radio>
      </el-radio-group>
    </div> -->
  </div>
</template>

<script>
  import systemConfig from '../config/config'
  import site from '@/mixins/site'

  export default {
    mixins: [site],
    data() {
      return {
        isDeposit: false,
        depositMin: 0,
        depositMax: 1,
        isBet: false,
        betMin: 0,
        betMax: 1,
        isValidBet: false,
        validBetMin: 0,
        validBetMax: 1,
        isNetProfit: false,
        netProfitMin: 0,
        netProfitMax: 1,
        checkboxGroup: '',
        checked: true,
        input: '',
        multipleSelection: [],
        ipValue: '',
        needIndex: '',
        ruleNum: systemConfig.rules.manualRule.number,
        multipleSelectionrules: [],
        noClick: false,
        noEdit: false
      }
    },
    computed: {},
    props: ['or', 'headerLength', 'tableData', 'headerArr', 'allDataNeed', 'index', 'add', 'otherData', 'dataRulesMin', 'commissionSign' , 'netProfitRate'],
    created() {
    },
    watch: {
      input: function (newValue, oldValue) {
        if (0 <= newValue <= 100) {

        } else {
          this.$message({
            type: 'error',
            message: this.$t('1-100 合理的范围')
          })
        }

      },
      commissionSign: function (newValue, oldValue) {
        this.commissionSign = newValue
        switch (newValue) {
          case 1:
            this.noClick = false
            this.noEdit = false
            break
          case 2:
            this.noClick = true
            this.noEdit = false
            break
          case 3:
            this.noClick = true
            this.noEdit = true
            break
        }
      },
      netProfitRate:function (newValue, oldValue) {
        this.netProfitRate = newValue
      },
      index: function (newValue, oldValue) {
        this.index = newValue
      },
      dataRulesMin: function (newValue, oldValue) {
        this.dataRulesMin = newValue
      },
      headerLength: function (newValue, oldValue) {
        this.headerLength = newValue
      },
      tableData: function (newValue, oldValue) {
        this.tableData = newValue


      },
      headerArr: function (newValue, oldValue) {
        this.headerArr = newValue
      },
      allDataNeed: function (newValue, oldValue) {
        if (newValue) {
          if (newValue === []) {
            return
          }
          // debugger
          this.allDataNeed = newValue
          this.isDeposit = this.allDataNeed.isDeposit,
            this.depositMin = this.allDataNeed.depositMin,
            this.depositMax = this.allDataNeed.depositMax,
            this.isBet = this.allDataNeed.isBet,
            this.betMin = this.allDataNeed.betMin,
            this.betMax = this.allDataNeed.betMax,
            this.isValidBet = this.allDataNeed.isValidBet,
            this.validBetMin = this.allDataNeed.validBetMin,
            this.validBetMax = this.allDataNeed.validBetMax,
            this.isNetProfit = this.allDataNeed.isNetProfit,
            this.netProfitMin = this.allDataNeed.netProfitMin,
            this.netProfitMax = this.allDataNeed.netProfitMax
        }

      },
      add: function (newValue, oldValue) {
        this.add = newValue
      },
      otherData: function (newValue, oldValue) {
      }
    },
    methods: {
      allWrite() {
        if (this.input == '' || this.input >= 100 || 0 >= this.input) {
          this.$message({
            type: 'error',
            message: this.$t('请输入值，再1-100正确的范围内')
          })
          return
        }
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'error',
            message: this.$t('请先勾选你要保存的行数据')
          })
          return
        } else {
          this.multipleSelection.forEach((item, indexOne) => {
            item.detailsDtoList.forEach((sin, index) => {
              if (sin.min != null) {

                if(this.or)
                {
                  if (sin.min > this.input) {
                    this.$set(sin, 'isError', 1)
                  } else {
                    this.$set(sin, 'isError', 0)
                    this.$set(sin, 'ratio', this.input)
                  }
                  this.$set(sin, 'commissionType', this.headerArr[index].value)
                }else{
                  if (sin.min > this.input) {
                    this.$set(sin, 'isError', 0)
                    this.$set(sin, 'ratio', this.input)
                  } else {
                    this.$set(sin, 'isError', 1)
                  }
                  this.$set(sin, 'commissionType', this.headerArr[index].value)
                }


              } else {
                this.$set(sin, 'isError', 0)
                this.$set(sin, 'ratio', this.input)
                this.$set(sin, 'commissionType', this.headerArr[index].value)
              }
            })
          })

          this.saves()
        }

      },

      boxPullDataOne(data) {
        this.isDeposit = data
        this.multipleSelection = this.tableData
        this.saves()

      },
      boxPullDataTwo(data) {
        this.isBet = data
        this.multipleSelection = this.tableData
        this.saves()
      },
      boxPullDataThree(data) {
        this.isValidBet = data
        this.multipleSelection = this.tableData
        this.saves()
      },
      boxPullDataFour(data) {
        this.isNetProfit = data
        this.multipleSelection = this.tableData
        this.saves()
      },

      inputValue(data) {
        if (data <= 0 || data >= 100) {
          this.$message({
            type: 'error',
            message: this.$t('1-100 合理的范围')
          })
        }
        this.ipValue = parseInt(data)
      },

      pullData() {


        if (parseInt(this.depositMin) < 0 || parseInt(this.depositMax) < 0
          || parseInt(this.betMin) < 0 || parseInt(this.betMax) < 0
          || parseInt(this.validBetMin) < 0 || parseInt(this.validBetMax) < 0
          || parseInt(this.netProfitMin) < 0 || parseInt(this.netProfitMax) < 0) {
          this.$message({
            type: 'error',
            message: this.$t('不能为负数')
          })
          return
        }


        if (parseInt(this.depositMin) >= parseInt(this.depositMax)
          || parseInt(this.betMin) >= parseInt(this.betMax)
          || parseInt(this.validBetMin) >= parseInt(this.validBetMax)
          || parseInt(this.netProfitMin) >= parseInt(this.netProfitMax)) {
          this.$message({
            type: 'error',
            message: this.$t('后者必须大于前者')
          })
          return
        }


        if (this.index > 0) {
          if (parseInt(this.depositMin) <= parseInt(this.otherData.depositMax) ||
            parseInt(this.betMin) <= parseInt(this.otherData.betMax) ||
            parseInt(this.validBetMin) <= parseInt(this.otherData.validBetMax) ||
            parseInt(this.netProfitMin) <= parseInt(this.otherData.netProfitMax)) {
            this.$message({
              type: 'error',
              message: this.$t('这个条件的最小值大于前一阶段的最大值')
            })
            return
          }
        }
        this.multipleSelection = this.tableData
        this.saves()
      },

      editThis(data, thisIndex, index, value) {
        this.$set(this.tableData[index].detailsDtoList[thisIndex], 'isShow', value)
      },

      saveThis(data, thisIndex, index) {
        if (this.ipValue <= 0 || this.ipValue >= 100) {
          this.$message({
            type: 'error',
            message: this.$t('1-100 合理的范围')
          })
          return
        }

        if (this.dataRulesMin) {
          if (this.dataRulesMin.length > 0) {
            if (this.dataRulesMin[this.index].depotListDtos[index].detailsDtoList.length > 0) {
              debugger
               if(this.or)
               {
                 if (this.ipValue < this.dataRulesMin[this.index].depotListDtos[index].detailsDtoList[thisIndex].ratio) {
                   this.$set(this.tableData[index].detailsDtoList[thisIndex], 'isError', 1)
                   this.$message({
                     type: 'error',
                     message: this.$t('不能比规定的范围小')
                   })
                   return
                 }
               }else{
                 if (this.ipValue > this.dataRulesMin[this.index].depotListDtos[index].detailsDtoList[thisIndex].ratio) {
                   this.$set(this.tableData[index].detailsDtoList[thisIndex], 'isError', 0)
                   this.$message({
                     type: 'error',
                     message: this.$t('不能比规定的范围大')
                   })
                   return
                 }
               }
            }
          }
        }

        this.$set(this.tableData[index].detailsDtoList[thisIndex], 'isError', 0)
        this.$set(this.tableData[index].detailsDtoList[thisIndex], 'ratio', parseInt(this.ipValue))
        this.$set(this.tableData[index].detailsDtoList[thisIndex], 'commissionType', this.headerArr[thisIndex].value)
        this.$set(this.tableData[index].detailsDtoList[thisIndex], 'isShow', 0)
        this.multipleSelection = [this.tableData[index]]
        this.saves()
      },

      renderType(row, index) {
        if (row.detailsDtoList[index]) {
          return row.detailsDtoList[index].catName
        }
      },
      renderValue(row, index) {
        if (row.detailsDtoList[index]) {
          return row.detailsDtoList[index].ratio
        }
      },
      saves() {
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'error',
            message: this.$t('请先勾选你要保存的行数据')
          })
          return
        }

        let data = this.tableData
        data.forEach((item, index) => {
          if (item.detailsDtoList) {
            let sim = item.detailsDtoList
            sim.forEach((y) => {
              delete y['isShow']
              delete y['isError']
            })
          }
        })
        let dataN = {
          stage: this.index,
          depotListDtos: data,
          // isDeposit:this.isDeposit == true?1:0,
          isDeposit: this.isDeposit,
          depositMin: this.depositMin,
          depositMax: this.depositMax,
          // isBet:this.isBet == true?1:0,
          isBet: this.isBet,
          betMin: this.betMin,
          betMax: this.betMax,
          // isValidBet:this.isValidBet == true?1:0,
          isValidBet: this.isValidBet,
          validBetMin: this.validBetMin,
          validBetMax: this.validBetMax,
          // isNetProfit:this.isNetProfit == true? 1:0,
          isNetProfit: this.isNetProfit,
          netProfitMin: this.netProfitMin,
          netProfitMax: this.netProfitMax
        }
        this.$emit('getData', {list: dataN, index: this.index, add: this.add})
        this.ipValue = ''
      },
      // 渲染表头
      renderHeader(h, {column, $index}) {
        var that = this
        return h('div', [
            h('div',
              {
                class: 'block'
              },
              [
                h('input', {
                  attrs: {
                    type: 'radio',
                    name: column.label,
                    checked: 'checked',
                    value: 0
                  },
                  on: {
                    change: ($event) => {
                      that.$set(that.headerArr[$index], 'value', $event.target.value)
                    }
                  }
                }), {
                text: 'M:' + this.$t('有效投注额')
              }
              ]),
            h('div',
              {
                class: 'block'
              },
              [
                h('input', {
                  attrs: {
                    type: 'radio',
                    name: column.label,
                    value: 1
                  },
                  on: {
                    change: ($event) => {
                      that.$set(that.headerArr[$index], 'value', $event.target.value)
                    }
                  }
                }),
                {
                  text: 'N:' + this.$t('净盈利总额'),

                }
              ])
          ]
        )
      },
      //多选
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.multipleSelectionrules = []

        if (this.dataRulesMin) {
          if (this.dataRulesMin.length > 0) {
            let data = this.dataRulesMin[this.index].depotListDtos
            for (var i = 0; i < val.length; i++) {
              for (var b = 0; b < data.length; b++) {
                if (val[i].depotCode == data[b].depotCode) {
                  this.multipleSelectionrules.push(data[b])
                  let arrNew = val[i].detailsDtoList
                  let arrOld = data[b].detailsDtoList
                  if (arrNew.length > 0) {
                    for (var k = 0; k < arrNew.length; k++) {
                      if (arrOld[k]) {
                        if(this.netProfitRate < arrOld[k].ratio)
                        {
                          arrNew[k].min =  this.netProfitRate
                        }else{
                          arrNew[k].min =  arrOld[k].ratio
                        }
                      } else {
                        arrNew[k].min = 0
                      }
                    }
                  }
                }
              }
            }
          }
        }

      }
    }
  }
</script>

<style scoped>
  .red {
    color: red;
  }
</style>

