<template>
  <div>
    <!-- 流水倍数 -->
    <el-form-item
      ref="multipleWater"
      :label="$t('流水倍数')"
      :rules="multipleWaterRule"
      prop="rule.rebatesNeDto.levelDtoList"
    >
      <el-input
        type="number"
        style="width: 180px;"
        v-model.number="rebatesNeDto.levelDtoList[layerIndex].multipleWater"
        @input="checkValue(rebatesNeDto.levelDtoList[layerIndex].multipleWater)"
      >
      </el-input
      >&nbsp;&nbsp;{{ $t('倍') }}
    </el-form-item>
    <el-form-item
      :label="$t('返水设置')"
      :rules="activityRule"
      prop="rule.rebatesNeDto.levelDtoList"
    >
      <RebatesLevelListDtosForm
        :key="layerIndex"
        ref="activityRule"
        v-model="rebatesNeDto.levelDtoList[layerIndex].rebatesLevelListDtos"
        :rebatesLevelListDtos="
          rebatesNeDto.levelDtoList[layerIndex].rebatesLevelListDtos
        "
      />
    </el-form-item>
  </div>
</template>

<script>
import RebatesLevelListDtosForm from "./RebatesLevelListDtos";
import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils";

const checkNumberAndTwoDecimal = function(value) {
  return checkNumberAndDecimals(value, 2);
};

export default {
  components: { RebatesLevelListDtosForm },
  model: {
    prop: "rebatesNeDto",
    event: "change"
  },
  props: ["rebatesNeDto", "layerIndex", "memberLevelGroup"],
  data() {
    return {
      activityRule: {
        validator: (rule, value, callback) => {
          // 确保校验了流水倍数
          const { multipleWater } = this.$refs;
          multipleWater && multipleWater.validate();
          this.$refs.activityRule.validate(valid => {
            if (valid) {
              const flag = this.rebatesNeDto.levelDtoList.every(level => {
                return level.rebatesLevelListDtos.every(
                  item => item.donateRatio == 0
                );
              });
              if (flag) {
                callback(new Error(this.$t("返水至少设置一个平台")));
              } else {
                callback();
              }
            }
          });
        }
      },
      multipleWaterRule: {
        validator: (rule, value, callback) => {
          if (
            checkNatureNumber(
              this.rebatesNeDto.levelDtoList[this.layerIndex].multipleWater
            )
          ) {
            callback();
          } else {
            callback(new Error(this.$t("流水倍数应为0或正整数")));
          }
        }
      }
    };
  },
  computed: {
    rebatesNeDtoObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.rebatesNeDto));
      },
      set(value) {
        this.$emit("change", value);
      }
    }
  },
  created() {
    this.setMul();
  },
  methods: {
    setMul() {
      let num = this.rebatesNeDto.levelDtoList[this.layerIndex].multipleWater;
      this.checkValue(num);
    },
    checkValue(value) {
      if (this.timeOut) {
        window.clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        if (value > 0) {
          this.rebatesNeDto.levelDtoList[
            this.layerIndex
          ].multipleWater = Math.floor(value);
        } else if (value < 0 || value === 0) {
          this.rebatesNeDto.levelDtoList[this.layerIndex].multipleWater = 0;
        } else if (!value) {
          //setTimeout(() => {
          this.rebatesNeDto.levelDtoList[this.layerIndex].multipleWater = 0;
          //}, 1000);
        }
      }, 1000);
    }
  },
  watch: {
    layerIndex(n) {
      this.setMul();
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-rule-amount {
  width: 200px;
  margin-left: 10px;
  margin-right: 20px;
}
</style>
