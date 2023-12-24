<template>
  <div class="new-rebate">
    <div class="top-btn">
      <el-button v-for="(item, i) in tabBtn" :type="activeIndex === i ? 'primary' : ''" :key="i" size="small" @click="handleTab(i)">{{item.text}}</el-button>
    </div>
    <div class="table-box">
      <RebateCheck v-if="activeIndex === 0" />
      <RebateHistory v-if="activeIndex === 1" />
      <RebateCurrentMonth v-if="activeIndex === 2" />
    </div>
  </div>
</template>

<script>
import TableSearchBar from "../../../components/TableSearchBar";
import RebateCheck from "./RebateCheck";
import RebateHistory from "./RebateHistory";
import RebateCurrentMonth from "./RebateCurrentMonth";
export default {
  name: "newIndex",
  components: {
    TableSearchBar,
    RebateCheck,
    RebateHistory,
    RebateCurrentMonth
  },
  data() {
    return {
      tabBtn: [
        { text: this.$t(this.$t('审核')), val: 1 },
        { text: this.$t(this.$t('历史')), val: 2 },
        { text: this.$t(this.$t('本月')), val: 3 },
      ],
      activeIndex: 0,
    }
  },
  methods: {
    handleTab(i) {
      this.activeIndex = i
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  margin-top: 20px;
}
</style>
