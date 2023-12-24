<template>
  <div>
    <h3>{{ $t('存就送') }}</h3>
    <CheckBoxRange :label="$t('流水范围')" :auditCats.sync="auditCats"></CheckBoxRange>
    <el-form-item
      :label="$t('计算规则')"
    >
      <el-radio-group v-model="scope" @change="updateData">
        <el-radio :label="0">{{ $t('规则共享') }}</el-radio>
        <el-radio :label="1">{{ $t('规则不共享') }}</el-radio>
      </el-radio-group>
      <span>（{{ $t('选择规则共享，则达到最高条件是可同时领取之前所有奖励') }}）</span>
    </el-form-item>
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
      <el-table :data="saveTableData" border>
        <el-table-column :label="$t('序号')" width="70px" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('存款范围')" width="220px">
          <template slot-scope="scope">
            <div>
              <el-input type="text" style="width: 43%" :placeholder="$t('请输入金额')" @change="updateData" v-model="saveTableData[scope.$index].amountMin"></el-input> ~
              <el-input type="text" style="width: 43%" :placeholder="$t('请输入金额')" @change="updateData" v-model="saveTableData[scope.$index].amountMax"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('赠送金额')">
          <template slot-scope="scope">
            <div>
              <el-select style="width: 30%" v-model="saveTableData[scope.$index].donateType" @change="updateData">
                <el-option :label="$t('赠送比例') + '%'" value="0"></el-option>
              </el-select>
              <el-input type="text" :placeholder="$t('请输入比例')" @change="updateData" style="width: 20%" v-model="saveTableData[scope.$index].donateAmount"></el-input>
              <span>{{ $t('最高赠送') }}</span>
              <el-input type="text" :placeholder="$t('请输入最高赠送')" @change="updateData" style="width: 20%" v-model="saveTableData[scope.$index].donateAmountMax"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('流水倍数')" width="130px">
          <template slot-scope="scope">
            <el-input type="number" :placeholder="$t('请输入流水倍数')" @change="updateData" v-model="saveTableData[scope.$index].multipleWater" style="width: 80%"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130px">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" style="padding: 5px 8px !important;" @click="handleAddRule">{{ $t('增加规则') }}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" style="padding: 5px 8px !important;" :disabled="saveTableData.length <= 1" @click="handleDelRule(scope.$index)">{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import CheckBoxRange from "./CheckBoxRange"

export default {
  name: "SaveSend",
  props: ['data'],
  components: { CheckBoxRange },
  data() {
    return {
      auditCats: [],
      scope: 0,
      saveTableData: [
        {

        }
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
      console.log('this.data =====', this.data)
      const { scope, auditCats, ruleScopeDtos } = this.data || {}
      this.scope = scope || 0
      this.auditCats = auditCats || []
      const dd = ruleScopeDtos ? ruleScopeDtos[0] : null
      if (dd) {
        const { activityRuleDtos, isBank, isMobile, isName } = dd
        this.saveTableData = activityRuleDtos
        if (isBank) this.limitList.push('isBank')
        if (isMobile) this.limitList.push('isMobile')
        if (isName) this.limitList.push('isName')
      }
    },
    handleAddRule() {
      this.saveTableData.push({})
    },
    handleDelRule(i) {
      this.saveTableData.splice(i, 1)
    },
    updateData() {
      const limitList = this.limitList
      this.$emit('changeData', {
        key: 'jDepositSentDto',
        data: {
          scope: this.scope,
          auditCats: this.auditCats,
          ruleScopeDtos: [
            {
              isBank: limitList.includes('isBank'),
              isName: limitList.includes('isName'),
              isMobile: limitList.includes('isMobile'),
              activityRuleDtos: this.saveTableData
            }
          ]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
