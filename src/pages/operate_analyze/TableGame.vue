<template>
  <el-table max-height="480" :data="bonusDetailDtos" stripe border style="width: 100%;margin-top: 20px"
    key="tableDataJsGame">
    <el-table-column prop="total" :label="$t('序号')" align="center" type="index" width="50" :index="indexMethod">
    </el-table-column>
    <el-table-column prop="time" align="center" :label="$t('开始时间')">
    </el-table-column>
    <el-table-column :label="$t('游戏平台')" align='center' type="text">
      <template slot-scope="scope">
        <slot>
          <span class="color-blue cursor: pointer" @click="handleBonusDetailDtosDialogs(scope.row.bonusDialogList)">{{ scope.row.bonusStr
          }}</span>
        </slot>
      </template>
    </el-table-column>
    <el-table-column prop="depositAmount" :label="$t('优惠金额')" align='center'>
    </el-table-column>
    <el-table-column prop="auditAmount" :label="$t('流水要求')" align='center'>
      <template slot-scope="scope">
        <slot>
          <span v-if="!ifXg || scope.row.status === 1"> {{ scope.row.auditAmount }}</span>
          <input v-else type="text" class="xg" :placeholder="scope.row.auditAmount"
            @change="changeData($event, scope.row.id, scope.row.auditType)">
          <div v-show="scope.row.auditType === 1">
            ( {{ scope.row.depotName }} {{ scope.row.catName }})
          </div>
        </slot>
      </template>
    </el-table-column>
    <el-table-column prop="validBet" :label="$t('有效投注')" align='center'>
    </el-table-column>
    <el-table-column prop="payOut" :label="$t('盈亏')" align='center'>
      <template slot-scope="scope">
        <slot>
          <span v-if="parseInt(scope.row.payOut) > 0" class="color-green">{{ scope.row.payOut }}</span>
          <span v-else class="color-red">{{ scope.row.payOut }}</span>
        </slot>
      </template>
    </el-table-column>
    <el-table-column width="200" align="center" prop="passTime" :formatter="timeFilter" :label="$t('通过时间')">
    </el-table-column>
    <el-table-column prop="status" align="center" :formatter="twoNumber" :label="$t('稽核状态')">
      <template slot-scope="scope">
        <slot>
          <div v-show="scope.row.auditType === 1">
            <div v-if="scope.row.isDispose">
              <s>（{{ $t('违规') }}）</s>
            </div>
            <div v-else>
              <span v-if="!scope.row.isValid">（{{ $t('违规') }}）</span>
            </div>
          </div>
          <span v-if="scope.row.status == 0" class="color-red">
            {{ scope.row.newDataOne }}
          </span>
          <span v-else-if="scope.row.status == 1" class="color-green">
            {{ scope.row.newDataOne }}
          </span>
          <span v-else>{{ scope.row.newDataOne }} </span>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import systemConfig from '../../config/config.js'
export default ({
  props: ['bonusDetailDtos', 'listReq', 'ifXg'],
  computed: {
    timeType: {
      get: function () {
        return this.$store.state.timeType
      },
      set: function () {
      }
    },
  },
  methods: {
    /*表格序号*/
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
    },
    /*时间处理*/
    timeFilter(row, column) {
      var date = row[column.property]
      if (date == null || date === '') {
        return ''
      } else if (date.length <= 5) {
        return date
      }
      return systemConfig.transferTimeByType(date, this.timeType)
    },
    /*表格数据 % */
    twoNumber(row, column, cellValue) {
      return systemConfig.saveTwoNumber(cellValue) + '%'
    },
    handleBonusDetailDtosDialogs(row) {
      this.$emit('handleBonusDetailDtosDialogs', row)
    },
    changeData(e, id, type) {
      var val = e.target.value
      let valueBool
      if(!val||isNaN(Number(val))){
        valueBool=true;
        return
      }else{
         valueBool=false;
      }
      const obj = {
        valueBool,
        changeData: {
          id: id,
          auditType: type,
          auditAmount: val
        }
      }
      this.$emit('onChangeData', obj)
    },
  }
})
</script>