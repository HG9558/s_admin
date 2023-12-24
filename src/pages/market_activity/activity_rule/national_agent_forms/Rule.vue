<template>
  <div>
    <el-form-item :label="$t('活动规则')">
      <div class="btn-box">
        <el-button :type="activeItem.id !== item.id ? '' : 'primary'" :plain="activeItem.id !== item.id" v-for="(item, i) in levelList" :key="i" @click="handleBtnClick(item, i)">{{item.tierName}}</el-button>
      </div>
      <div v-if="activeItem.id">
        <el-form ref="national_agent">
          <el-form-item :label="$t('级别名称')">
            <el-input :value="activeItem.tierName" disabled style="width: 10%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('奖金百分比')">
            <el-input
              v-model.number="levelList[activeIndex].bonusPercent"
              type="number"
              style="width: 10%"
              @change="handleChange"
            ></el-input> %
          </el-form-item>
          <AddTable :label="$t('自身有效输赢提成比例')" :table.sync="levelList[activeIndex].mbrRebateAgentRuleSelfDtos" @add="handleSelfAdd" @delete="handleSelfDel" @change="handleChange" />
          <AddTable :label="$t('下级代理会员佣金比例')" :table.sync="levelList[activeIndex].mbrRebateAgentRuleSubDtos" @add="handleNextAdd" @delete="hanleNextDel" @change="handleChange" />
        </el-form>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import systemConfig from "../../../../config/config";
import AddTable from "./AddTable";

export default {
  name: "Rule",
  props: ["rule"],
  components: {
    AddTable
  },
  data() {
    return {
      levelList: [],
      activeItem: {},
      activeIndex: 0
    }
  },
  created() {
    this.getLevelList()
  },
  methods: {
    hanleNextDel(scope) {
      const { $index } = scope
      this.levelList[this.activeIndex].mbrRebateAgentRuleSubDtos.splice($index, 1)
    },
    handleSelfDel(scope) {
      const { $index } = scope
      this.levelList[this.activeIndex].mbrRebateAgentRuleSelfDtos.splice($index, 1)
    },
    handleNextAdd() {
      this.levelList[this.activeIndex].mbrRebateAgentRuleSubDtos.push({})
    },
    handleSelfAdd() {
      this.levelList[this.activeIndex].mbrRebateAgentRuleSelfDtos.push({})
    },
    handleBtnClick(item, i) {
      this.activeItem = item
      this.activeIndex = i
    },
    handleChange() {
      const ruleScopeDtos = this.levelList.map(i => {
        const { id: agyLevelId, bonusPercent, mbrRebateAgentRuleSelfDtos, mbrRebateAgentRuleSubDtos } = i
        return {
          agyLevelId,
          bonusPercent,
          mbrRebateAgentRuleSelfDtos,
          mbrRebateAgentRuleSubDtos
        }
      })
      this.$emit('getDate', { ruleScopeDtos })
    },
    async getLevelList() {
      const [res] = await this.$axios.get(systemConfig.urls.mbrAccountLevellist, { _async_: true })
      if (res && res.code === 0) {
        this.levelList = res.data.map(i => {
          const { ruleScopeDtos } = this.rule
          const { id } = i
          let rule = {
            agyLevelId: id,
            bonusPercent: null,
            mbrRebateAgentRuleSelfDtos: [],
            mbrRebateAgentRuleSubDtos: []
          }
          if (ruleScopeDtos) {
            const obj = ruleScopeDtos.find(_i => _i.agyLevelId === id)
            if (obj) {
              rule = obj
            }
          }
          return { ...i, ...rule }
        })
        this.handleBtnClick(this.levelList[0], 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  padding-bottom: 10px;
}
</style>
