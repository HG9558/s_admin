<template>
  <div>
    <h3>{{ $t('投就送') }}</h3>
    <CheckBoxRange :label="$t('投注范围')" :auditCats.sync="auditCats"></CheckBoxRange>
    <el-form-item
      :label="$t('申请条件')"
    >
      <el-checkbox-group
        v-model="limitList"
        @change="updateData"
      >
        <el-checkbox label="isName">{{ $t('已实名') }}</el-checkbox>
        <el-checkbox label="isMobile">{{ $t('已验证手机') }}</el-checkbox>
        <el-checkbox label="isBank">{{ $t('已验证银行卡') }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      :label="$t('活动规则')"
    >
      <el-table :data="betTableData" border>
        <el-table-column :label="$t('序号')" width="70px" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('有效投注范围')">
          <template slot-scope="scope">
            <div>
              <el-input type="text" style="width: 43%" @change="updateData" v-model="betTableData[scope.$index].validBetMin" :placeholder="$t('最低金额')"></el-input> ~
              <el-input type="text" style="width: 43%" @change="updateData" v-model="betTableData[scope.$index].validBetMax" :placeholder="$t('最高金额')"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('赠送金额')" align="center">
          <template slot-scope="scope">
            <div>
              <el-input type="text" :placeholder="$t('请输入赠送金额')" @change="updateData" v-model="betTableData[scope.$index].donateAmount" style="width: 85%"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('存款要求')" align="center">
          <template slot-scope="scope">
            <div>
              <el-radio-group v-model="betTableData[scope.$index].depositAmountType" style="padding: 5px 0" @change="updateData">
                <el-radio :label="0">{{ $t('不限制') }}</el-radio>
                <el-radio :label="1">{{ $t('最低要求') }}</el-radio>
              </el-radio-group>
              <el-input type="text" :placeholder="$t('请输入赠送金额')" @change="updateData" :disabled="betTableData[scope.$index].depositAmountType === 0" v-model="betTableData[scope.$index].donateAmount" style="width: 85%"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('流水倍数')" width="170px">
          <template slot-scope="scope">
            <el-input type="number" :placeholder="$t('请输入流水倍数')" @change="updateData" style="width: 80%" v-model="betTableData[scope.$index].multipleWater"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130px">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" style="padding: 5px 8px !important;" @click="handleAddRule">{{ $t('增加规则') }}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" style="padding: 5px 8px !important;" :disabled="betTableData.length <= 1" @click="handleDelRule(scope.$index)">{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import CheckBoxRange from "./CheckBoxRange"

export default {
  name: "BetSend",
  props: ['data'],
  components: {
    CheckBoxRange
  },
  data() {
    return {
      auditCats: [],
      betTableData: [
        {}
      ],
      limitList: []
    }
  },
  watch: {
    auditCats() {
      this.updateData()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { isBank, isName, isMobile, auditCats, bettingGiftRuleDtos } = this.data || {}
      this.auditCats = auditCats || []
      this.betTableData = bettingGiftRuleDtos || [{}]
      if (isBank) this.limitList.push('isBank')
      if (isName) this.limitList.push('isName')
      if (isMobile) this.limitList.push('isMobile')
    },
    handleAddRule() {
      this.betTableData.push({})
    },
    handleDelRule(i) {
      this.betTableData.splice(i, 1)
    },
    updateData() {
      const limitList = this.limitList
      this.$emit('changeData', {
        key: 'bettingGiftDto',
        data: {
          isBank: limitList.includes('isBank'),
          isName: limitList.includes('isName'),
          isMobile: limitList.includes('isMobile'),
          auditCats: this.auditCats,
          bettingGiftRuleDtos: this.betTableData
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
