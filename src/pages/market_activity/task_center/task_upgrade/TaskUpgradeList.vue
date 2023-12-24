<template>
  <div>
    <el-form-item :label="$t('奖励规则') + ':' ">
      <div style="color: #F56C6C;">tips: {{ $t('5星会员可同时领取1、2、3、4、5级共五个奖励') }}</div>
      <el-table border class="selfTable" :data="[tableData]" style="width: 80%">
        <el-table-column
          :label="$t('等级名称')"
          prop="label"
          min-width="150px"
          align="center"
          class="fa"
        >
          <template slot-scope="scope">
            <el-form-item class="mt10">
              <div style="line-height:30px;">{{ $t('奖励金额') }}</div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          :label="memberLevelList[index].tierName"
          min-width="150px"
          v-for="(item, index) in tableData.rule.starDtos"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <el-form-item
              v-if="item.accountLevel === 0"
              class="mt10"
            >
              --
            </el-form-item>
            <el-form-item
              v-else
              class="mt10"
              prop="amount"
              :rules="
                rules.checkNumberAndDecimals(
                  tableData.rule.starDtos[index].amount
                )
              "
            >
              <el-input
                type="number"
                class="rebate-input"
                v-model.number="tableData.rule.starDtos[index].amount"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item
      :label="$t('流水倍数') + ':' "
      class="multipleWater"
      prop="multipleWater"
      :rules="rules.isInteger(tableData.rule.multipleWater)"
    >
      <el-input
        type="number"
        v-model.number="tableData.rule.multipleWater"
        :placeholder="$t('请输入倍数')"
      ></el-input>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
  </div>
</template>

<script>


import systemConfig from "../../../../config/config";

export default {
  props: ["rowData", "temp", "rules"],
  data() {
    return {
      tableData: {
        rule: {
          starDtos: [],
        },
      },
      memberLevelList: [],
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    // 不加会出样式问题 巨坑
    this.$store.state.indexActive = "4-16";
  },
  methods: {
    initData() {
      let rowData = JSON.parse(JSON.stringify(this.rowData));
      const rule = JSON.parse(rowData.rule)

      rowData.rule = rule;
      this
        .getMemberLevelList()
        .then(() => {
          const starDtosTmp = this.memberLevelList.map(({ id, accountLevel }) => ({
            amount: null,
            accountLevel,
            accountLevelId: id,
          }))

          if (!rule) {
            rowData.rule = {
              ...this.temp,
              starDtos: starDtosTmp,
            };
          } else {
            rowData.rule.starDtos = starDtosTmp.map((({ id, accountLevel }) => {
              const starDtoItem = rowData.rule.starDtos.find((item) => item.accountLevel === accountLevel)

              if (starDtoItem) {
                return starDtoItem
              }
              return {
                amount: null,
                accountLevel,
                accountLevelId: id,
              }
            }))
          }
          this.tableData = rowData;
        })
    },
    getMemberLevelList() {
      return this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        this.memberLevelList = res.data.data
      });
    },
  },
  watch: {
    tableData: {
      handler(n, o) {
        let sendData = JSON.parse(JSON.stringify(n));
        this.$emit("changeVal", sendData);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.rebate-input {
  width: 88%;
  /deep/ .el-input__inner {
    text-align: center;
  }
}
.rebate-tips {
  display: flex;
  line-height: 26px;
  .title {
    width: 110px;
    color: #333;
    text-align: right;
  }
  .content > li {
    display: flex;
  }
}
.selfTable {
  .mt10 {
    margin-top: 10px !important;
  }
}
.multipleWater {
  /deep/ .el-input {
    width: 10% !important;
  }
}
</style>
