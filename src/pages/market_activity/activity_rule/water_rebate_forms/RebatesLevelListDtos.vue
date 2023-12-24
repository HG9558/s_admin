<template>
  <el-form
    ref="form"
    :model="{ rebatesLevelListDtos }"
    :class="[changeClass ? 'mWith' : '']"
  >
    <el-table :data="new Array(tableMaxRow).fill({})" border>
      <el-table-column
        align="center"
        v-for="(range, index) in rangeGroup"
        :key="range.catId"
      >
        <div
          :class="[
            'init-form',
            changeClass
              ? 'activity-rebate-form-item'
              : 'init-activity-rebate-form-item'
          ]"
          slot="header"
          slot-scope="scope"
        >
          <div
            :class="[
              'activity-rebate-platform',
              changeClass ? 'changeSpan' : ''
            ]"
          >
            {{ range.catName }}
          </div>
          <div class="context">
            <el-input
              v-show="leftClickBool"
              :class="[
                'activity-rebate-input',
                changeClass ? 'changeInput' : ''
              ]"
              v-model="range.columnDonateRatio"
              @input="handleHeaderDonateRatioChange($event, range.catId, index)"
              @blur="$nextTick(() => $refs.form.clearValidate())"
            >
            </el-input>
            <div class="percentAb">&nbsp;%</div>
          </div>
        </div>
        <el-form-item
          slot-scope="scope"
          prop="rebatesLevelListDtos"
          :class="[
            'init-form',
            changeClass
              ? 'activity-rebate-form-item'
              : 'init-activity-rebate-form-item'
          ]"
          v-if="range.platforms[scope.$index]"
          :rules="
            rules.donateRatio(
              range.catId,
              range.platforms[scope.$index].depotId
            )
          "
        >
          <div
            :class="[
              'activity-rebate-platform', 
              changeClass ? 'changeSpan' : '' 
            ]"
          >
            {{ range.platforms[scope.$index].depotName }}
          </div>
          <div class="context">
            <el-input
              type="number"
              :class="[
                'activity-rebate-input',
                changeClass ? 'changeInput' : ''
              ]"
              v-model.number="range.platforms[scope.$index].donateRatio"
              @input="
                toFixed(
                  range.platforms[scope.$index].donateRatio,
                  scope.$index,
                  index
                )
              "
            >
            </el-input>
            <div class="percentAb">&nbsp;%</div>
          </div>
        </el-form-item>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { checkNumberAndDecimals } from "../../../../config/utils";

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  model: {
    prop: "rebatesLevelListDtos",
    event: "change"
  },
  inject: ["formData"],
  props: ["rebatesLevelListDtos"],
  data() {
    return {
      rangeGroup: [],
      leftClickBool: true,
      rules: {
        donateRatio: (catId, depotId) => {
          return {
            validator: (rule, value, callback) => {
              const { donateRatio } = this.rebatesLevelListDtos.find(
                item => item.catId === catId && item.depotId === depotId
              );
              if (donateRatio) {
                if (checkNumberAndTwoDecimal(donateRatio)) {
                  callback();
                } else {
                  callback(new Error("大于等于0且允许2位小数"));
                }
              } else {
                callback();
              }
            },
            trigger: "blur"
          };
        }
      },
      timeOut: null,
      screenWidth:
        document.documentElement.clientWidth || document.body.clientWidth,
      timer: false,
      changeClass: true
    };
  },
  created() {
    this.initRangeGroup();
  },
  mounted() {
    /* const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    this.testClientWidth(); */
  },
  computed: {
    tableMaxRow() {
      // 根据每个分类平台数量求出最大行数
      const depotsLengthGroup = this.rangeGroup.map(
        item => item.platforms.length
      );
      return depotsLengthGroup.sort((a, b) => a - b).slice(-1)[0];
    },
    rebatesLevelListDtosObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.rebatesLevelListDtos));
      },
      set(value) {
        this.$emit("change", value);
      }
    },
    getRangeGroup() {
      return this.formData.rangeGroup;
    }
  },
  methods: {
    testClientWidth() {
      if (this.screenWidth < 1900) {
        this.changeClass = true;
      } else {
        this.changeClass = false;
      }
    },
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    },
    handleHeaderDonateRatioChange(value, catId, index) {
      if (this.timeOut) {
        window.clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        if (!value) return;
        if (value > 0) {
          value = this.rangeGroup[index].columnDonateRatio =
            Math.floor(value * 100) / 100;
        } else if (value < 0) {
          value = this.rangeGroup[index].columnDonateRatio = 0;
        }
        const range = this.rangeGroup.find(item => item.catId === catId);
        const donateRatio = value ? Number(value) : value;
        for (const platform of range.platforms) {
          platform.donateRatio = donateRatio;
        }
      }, 500);
    },
    toFixed(value, $index, index) {
      let mathNum = Math.floor(value * 100) / 100;
      let num = mathNum < 0 ? 0 : mathNum;
      this.rangeGroup[index].platforms[$index].donateRatio = num;
      this.changeCdRatio(index);
    },
    changeCdRatio(index) {
      let bool = true;
      let platformsArr = this.rangeGroup[index].platforms;
      platformsArr.map((item, i) => {
        if (
          i > 0 &&
          platformsArr[i].donateRatio != platformsArr[i - 1].donateRatio
        ) {
          bool = false;
        }
      });
      this.rangeGroup[index].columnDonateRatio = bool
        ? this.rangeGroup[index].platforms[0].donateRatio
        : null;
    },
    initRangeGroup() {
      const { rebatesLevelListDtosObserver } = this;
      const rangeGroup = JSON.parse(JSON.stringify(this.getRangeGroup));
      /* for (const range of rangeGroup) { */
      rangeGroup.map((range, index) => {
        let recodeRatio = null;
        range.columnDonateRatio = null;
        let isSame = true;
        range.platforms.forEach((platform, index) => {
          const { catId } = range;
          const { depotId } = platform;
          const temp = rebatesLevelListDtosObserver.find(item => {
            return item.catId === catId && item.depotId === depotId;
          });
          range.platforms[index] = {
            catId,
            depotId,
            depotName: platform.depotName,
            donateRatio: temp ? temp.donateRatio : null
          };
        });
      });
      this.rangeGroup = rangeGroup;
      this.rangeGroup.map((val, index) => {
        this.changeCdRatio(index);
      });
    }
  },
  watch: {
    rangeGroup: {
      handler(value) {
        const rangeGroup = JSON.parse(JSON.stringify(value));
        if (!rangeGroup.length) {
          return;
        }
        const rebatesLevelListDtos = [];
        for (const range of rangeGroup) {
          for (const platform of range.platforms) {
            delete platform.depotName;
            rebatesLevelListDtos.push(platform);
          }
        }
        this.rebatesLevelListDtosObserver = rebatesLevelListDtos;
      },
      deep: true
    },
    getRangeGroup: {
      handler(n) {
        this.initRangeGroup();
      },
      deep: true,
      immediate: true
    },
    "formData.agyIndex": {
      //表头input值重新渲染
      handler(n, o) {
        this.leftClickBool = false;
        setTimeout(() => {
          this.leftClickBool = true;
        }, 0.001);
      },
      immediate: true,
      deep: true
    },
    screenWidth(val) {
      console.log("TCL: screenWidth -> val", val);
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
          that.testClientWidth();
        }, 400);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mWith {
  margin-left: -80px;
}
.init-form {
  margin: 0;
  width: 100%;
  align-items: center;
  position: relative;
  .activity-rebate-platform {
    width: 100px;
    text-align: left;
    text-indent: 20px;
  }
  /deep/ .el-form-item__error {
    right: 0;
    text-align: right;
  }
}
.init-activity-rebate-form-item {
  display: flex;
  padding: 14px 0;
  align-items: center;
  position: relative;
  .context {
    height: 40px;
    position: relative;
    flex: 1;
    padding: 0;
    .percentAb {
      position: absolute;
      right: 4px;
      z-index: 5;
      top: 0;
    }
  }
  /deep/ .el-form-item__content {
    display: flex;
  }
}

.activity-rebate-form-item {
  padding: 5px 0;
  align-items: center;
  position: relative;
  div {
    line-height: 20px !important;
  }
  .context {
    display: block;
    position: relative;
    padding-left: 10px;
    .activity-rebate-input {
      position: relative;
      flex: 1;
      padding: 0;
      display: inline-block;
      width: 100%;
    }
    .percentAb {
      position: absolute;
      height: 32px;
      line-height: 32px !important;
      right: 4%;
      top: 0;
      z-index: 5;
    }
  }
  .changeSpan {
    width: 100%;
    text-indent: 5px;
  }
  .changeInput {
    flex: none;
  }
  /deep/ .el-form-item__content {
    width: 100%;
    div {
      line-height: 30px !important;
    }
    .changeSpan {
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
}
</style>
