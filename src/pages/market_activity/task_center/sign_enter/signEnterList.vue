<template>
  <div>
    <el-form-item :label="$t('奖励规则') + ':' ">
      <el-table border class="selfTable" :data="[tableData]" style="width: 80%">
        <el-table-column
          :label="$t('连续签到天数')"
          prop="label"
          min-width="150px"
          align="center"
          class="fa"
        >
          <template slot-scope="scope">
            <el-form-item class="mt10">
              <div style="line-height:30px;">{{ $t('奖励金额') }}</div>
            </el-form-item>
            <!-- <el-form-item>
              <div style="line-height:30px;">大礼包日期</div>
            </el-form-item> -->
          </template>
        </el-table-column>
        <el-table-column
          :label="item.day"
          min-width="150px"
          v-for="(item, index) in tableData.rule.signinDtos"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <el-form-item
              class="mt10"
              prop="amount"
              :rules="
                rules.checkNumberAndDecimals(
                  tableData.rule.signinDtos[index].amount
                )
              "
            >
              <el-input
                class="rebate-input"
                v-model="tableData.rule.signinDtos[index].amount"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-checkbox
                v-model="tableData.rule.signinDtos[index].oen"
              ></el-checkbox>
            </el-form-item> -->
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- <el-form-item>
      *大礼包日期勾选后，用户会看到这一天有大额奖励的图标
    </el-form-item> -->
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
export default {
  props: ["rowData", "temp", "rules"],
  data() {
    return {
      tableData: {}
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
      rowData.rule = JSON.parse(rowData.rule);
      if (!rowData.rule) {
        rowData.rule = this.temp;
      } else {
        rowData.rule.signinDtos.map(val => {
          val.oen = Boolean(val.oen);
        });
      }
      this.tableData = rowData;
    }
  },
  watch: {
    tableData: {
      handler(n, o) {
        let sendData = JSON.parse(JSON.stringify(n));
        if (sendData.rule) {
          sendData.rule.signinDtos.map(val => {
            val.oen = Number(val.oen);
          });
        }
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
    margin: 15px 0 26px !important;
  }
}
.multipleWater {
  /deep/ .el-input {
    width: 10% !important;
  }
}
</style>
