<template>
  <div>
    <h3>{{ $t('救援金') }}</h3>
    <CheckBoxRange :label="$t('派彩范围')" :auditCats.sync="auditCats"></CheckBoxRange>
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
      :label="$t('活动规则（*负盈利范围为前日指定游戏的负盈利）')"
      label-width="360px"
    >
    </el-form-item>
    <el-table :data="helpTableData" border>
      <el-table-column :label="$t('序号')" width="70px" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('负盈利范围')">
        <template slot-scope="scope">
          <div>
            <el-input type="text" style="width: 43%" :placeholder="$t('最低金额')" @change="updateData" v-model="helpTableData[scope.$index].payoutMin"></el-input> ~
            <el-input type="text" style="width: 43%" :placeholder="$t('最高金额')" @change="updateData" v-model="helpTableData[scope.$index].payoutMax"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('赠送金额')" align="center">
        <template slot-scope="scope">
          <div>
            {{ $t('赠送比例') }}: <el-input type="text" style="width: 50%" @change="updateData" v-model="helpTableData[scope.$index].donateAmount">
            <template slot="append">%</template>
          </el-input>
            <p>
              {{ $t('最高赠送') }}: <el-input type="text" style="width: 50%" @change="updateData" v-model="helpTableData[scope.$index].donateAmountMax"></el-input>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('存款要求')" align="center">
        <template slot-scope="scope">
          <div>
            <el-radio-group v-model="helpTableData[scope.$index].depositAmountType" @change="updateData" style="padding: 5px 0">
              <el-radio :label="0">{{ $t('不限制') }}</el-radio>
              <el-radio :label="1">{{ $t('最低要求') }}</el-radio>
            </el-radio-group>
            <el-input type="text" :placeholder="$t('请输入赠送金额')" @change="updateData" :disabled="helpTableData[scope.$index].depositAmountType === 0" style="width: 85%" v-model="helpTableData[scope.$index].donateAmount"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('流水倍数')" width="170px">
        <template slot-scope="scope">
          <el-input type="number" :placeholder="$t('请输入流水倍数')" @change="updateData" v-model="helpTableData[scope.$index].multipleWater" style="width: 80%"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="130px">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" style="padding: 5px 8px !important;" @click="handleAddRule">{{ $t('增加规则') }}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="danger" style="padding: 5px 8px !important;" :disabled="helpTableData.length <= 1" @click="handleDelRule(scope.$index)">{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CheckBoxRange from "./CheckBoxRange"

export default {
  name: "HelpMoney",
  props: ['data'],
  components: { CheckBoxRange },
  data() {
    return {
      auditCats: [],
      helpTableData: [
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
      const { ruleDtos, isBank, isName, isMobile, auditCats } = this.data || {}
      this.auditCats = auditCats || []
      this.helpTableData = ruleDtos || [{}]
      if (isBank) this.limitList.push('isBank')
      if (isName) this.limitList.push('isName')
      if (isMobile) this.limitList.push('isMobile')
    },
    handleAddRule() {
      this.helpTableData.push({})
    },
    handleDelRule(i) {
      this.helpTableData.splice(i, 1)
    },
    updateData() {
      const limitList = this.limitList
      this.$emit('changeData', {
        key: 'actRescueRuleDto',
        data: {
          isBank: limitList.includes('isBank'),
          isName: limitList.includes('isName'),
          isMobile: limitList.includes('isMobile'),
          auditCats: this.auditCats,
          ruleDtos: this.helpTableData
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
