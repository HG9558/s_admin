<template>
  <div>
    <!-- 好友推荐 -->
    <!-- <el-form-item :label="$t('活动时间')" prop="time" :rules="activityTimeRule"> -->
    <el-form-item :label="$t('活动时间')" prop="time">
      <StartAndEndTimeSelector
        ref="scTime"
        :startTime.sync="startTime"
        :endTime.sync="endTime"
      />
    </el-form-item>
    <el-form-item :label="$t('参与等级')" prop="minVipLevel" :rules="levelRule">
      <el-select v-model="minVipLevel">
        <el-option
          v-for="level in memberLevelGroup"
          :key="level.tierName"
          :label="level.tierName"
          :value="level.accountLevel"
        ></el-option>
      </el-select>
      ~
      <el-select v-model="maxVipLevel">
        <el-option
          v-for="level in memberLevelGroup"
          :key="level.tierName"
          :label="level.tierName"
          :value="level.accountLevel"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      :label="$t('流水倍数')"
      prop="auditMultiple"
      :rules="auditMultipleRule"
    >
      <el-input
        style="width: 10%"
        v-model.number="auditMultiple"
        :placeholder="$t('请输入流水倍数')"
        :readonly="auditType === 0"
      ></el-input>
      <span>{{ $t("倍") }}</span>
    </el-form-item>
    <el-form-item :label="$t('是否稽核')">
      <el-radio-group v-model="auditType">
        <el-radio :label="0">{{ $t("免稽核") }}</el-radio>
        <el-radio :label="1">{{ $t("稽核") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 会员层级 -->
    <el-form-item :label="$t('返利配置')" prop="setrule">
      <MemberLevelTabs
        v-model="layerIndex"
        :memberLevelGroup="memberLevelGroup"
      />
      <el-table
        border
        class="sdy-table selfTable m-b-10"
        :data="scTableDataList"
      >
        <el-table-column :label="$t('用户首存') + '(' + $t('元') + ')'">
          <div class="no-wrap">
            <input
              class="sdy-table-input"
              v-model="scTableDataList[0].minCharge"
              v-integer-only
            />
            <span class="p-5">-</span>
            <input
              class="sdy-table-input"
              v-model="scTableDataList[0].maxCharge"
              v-integer-only
            />
          </div>
        </el-table-column>
        <el-table-column :label="$t('推荐人返利') + '(%)'">
          <input
            class="sdy-table-input"
            maxlength="4"
            v-model="scTableDataList[0].referrer"
            v-number-only
          />
        </el-table-column>
        <el-table-column :label="$t('被推荐人返利') + '(%)'">
          <input
            class="sdy-table-input"
            maxlength="4"
            v-model="scTableDataList[0].referee"
            v-number-only
          />
        </el-table-column>
      </el-table>
      <RebateTable
        ref="RebateTable"
        :layerIndex="layerIndex"
        :boolEnter="boolEnter"
        @getData="getData"
        :addMore="false"
      />
      <el-table
        border
        class="sdy-table selfTable m-b-10 m-t-10"
        :data="vipTableDataList"
        :key="layerIndex"
      >
        <el-table-column :label="$t('好友达到VIP等级')">
          <span>{{ $t("推荐人奖励") }}</span>
        </el-table-column>
        <el-table-column
          v-for="(bonus, idx) in vipTableDataList[0].bonusList"
          :key="idx"
          :label="`VIP${bonus.level}`"
        >
          <input
            class="sdy-table-input"
            v-model="vipTableDataList[0].bonusList[idx].award"
            maxlength="7"
            v-integer-only
          />
        </el-table-column>
      </el-table>

      <el-table border class="sdy-table selfTable" :data="topupTableDataList">
        <el-table-column :label="$t('序号')">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('邀请好友区间')">
          <template slot-scope="scope">
            <div class="column-wrapper">
              <template
                v-if="
                  scope.$index == topupTableDataList.length - 1 &&
                  !scope.row.isEnableMax
                "
              >
                <input class="sdy-table-input" :disabled="true" />
              </template>
              <template v-else>
                <input
                  class="sdy-table-input"
                  v-model="scope.row.minNum"
                  v-integer-only
                  @input="change1(scope.row, scope.$index)"
                  @blur="handleBlur(scope.row, scope.$index, 'minNum')"
                  :disabled="scope.row.firstDisabled"
                />
              </template>
              <span>~</span>
              <template v-if="scope.$index == topupTableDataList.length - 1">
                <input
                  class="sdy-table-input"
                  v-model="scope.row.text"
                  :disabled="!scope.row.isEnableMax"
                  :readonly="true"
                />
              </template>
              <template v-else>
                <input
                  class="sdy-table-input"
                  v-model="scope.row.maxNum"
                  :disabled="scope.row.secondDisabled"
                  @blur="handleBlur(scope.row, scope.$index, 'maxNum')"
                  @input="change2(scope.row, scope.$index)"
                  v-integer-only
                />
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('累计充值')">
          <template slot-scope="scope">
            <input
              class="sdy-table-input"
              v-model="scope.row.minCharge"
              v-integer-only
              :disabled="
                scope.$index == topupTableDataList.length - 1 &&
                !scope.row.isEnableMax
              "
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('奖励金额')">
          <template slot-scope="scope">
            <input
              class="sdy-table-input"
              v-model="scope.row.award"
              v-integer-only
              :disabled="
                scope.$index == topupTableDataList.length - 1 &&
                !scope.row.isEnableMax
              "
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('流水倍数')">
          <template slot-scope="scope">
            <input
              class="sdy-table-input"
              v-model="scope.row.multiple"
              v-integer-only
              :disabled="
                scope.$index == topupTableDataList.length - 1 &&
                !scope.row.isEnableMax
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ $index }">
            <template v-if="$index < topupTableDataList.length - 1">
              <el-button type="danger" @click="handleDelete($index)">{{
                $t("删除")
              }}</el-button>
            </template>
            <template v-else>
              <el-button
                type="danger"
                @click="topupTableDataList[$index].isEnableMax = true"
                >{{ $t("启用") }}</el-button
              >
              <el-button
                type="primary"
                @click="topupTableDataList[$index].isEnableMax = false"
                >{{ $t("禁用") }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="add_rule" @click="addRuleItem">{{ $t("添加更多规则") }}</div>
    </el-form-item>
    <el-form-item>
      <p>{{ $t("提示") }}:</p>
      <p>1，{{ $t("系统默认对返利百分比为0的项目，不计算会员返利所得；") }}</p>
      <p>
        2，{{
          $t(
            "每次编辑保存后，第2日00:00展示于会员前台[个人中心]，第2日下午14：00pm系统拉取前一日(00:00:00~23:59:59)已结算订单的有效投注额，计算该组会员的推荐人返利所得，并生成[返利列表]。"
          )
        }}
      </p>
    </el-form-item>
  </div>
</template>

<script>
import dayjs from "dayjs";
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import RebateTable from "./rule_rebate_table";
import systemConfig from "../../../../config/config.js";
import { checkNatureNumber } from "../../../../config/utils";
import StartAndEndTimeSelector from "@/components/StartAndEndTimeSelectorTwo";

export default {
  props: ["rule", "rebateDate"],
  components: { MemberLevelTabs, RebateTable, StartAndEndTimeSelector },
  directives: {
    integerOnly: {
      bind(el) {
        el.handler = () => {
          el.value = el.value.replace(/[^\d]/g, "");
        };
        el.addEventListener("input", el.handler);
      },
      unbind(el) {
        el.removeEventListener("input", el.handler);
      },
    },
    numberOnly: {
      bind(el) {
        el.handler = () => {
          el.value = el.value.replace(/[^\-?\d.]/g, "");
        };
        el.addEventListener("input", el.handler);
      },
      unbind(el) {
        el.removeEventListener("input", el.handler);
      },
    },
  },
  inject: ["getRuleScopeDtosTemplate"],
  data() {
    return {
      auditMultiple: 0,
      layerIndex: "0",
      boolEnter: false,
      memberLevelGroup: [],
      saveData: {},
      startTime: "",
      endTime: "",
      minVipLevel: null,
      maxVipLevel: null,
      auditType: 0,
      minDeposit: "",
      maxDeposit: "",

      activityTimeRule: {
        validator: (rule, value, callback) => {
          const { time } = this;
          if (time) {
            callback();
          } else {
            callback(new Error(this.$t("请选择活动的起止时间")));
          }
        },
        trigger: "blur",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < dayjs().subtract(1, "day").valueOf();
        },
        shortcuts: [
          {
            text: this.$t("最近一周"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("最近一个月"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("最近三个月"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      levelRule: {
        required: true,
        validator: (rule, value, callback) => {
          const { minVipLevel, maxVipLevel } = this;
          if (
            (!minVipLevel && minVipLevel !== 0) ||
            minVipLevel === undefined ||
            (!maxVipLevel && maxVipLevel !== 0) ||
            maxVipLevel === undefined
          ) {
            callback(new Error(this.$t("请选择起止参与等级")));
          } else {
            if (maxVipLevel < minVipLevel) {
              callback(new Error(this.$t("结束等级不能小于开始等级")));
            } else {
              callback();
            }
          }
        },
        trigger: ["blur", "change"],
      },
      auditMultipleRule: {
        validator: (rule, value, callback) => {
          const { auditMultiple } = this;

          if (checkNatureNumber(auditMultiple)) {
            callback();
          } else {
            callback(new Error(this.$t("流水倍数应为非负整数")));
          }
        },
        trigger: "blur",
      },
      scTableDataList: [
        {
          minCharge: null,
          maxCharge: null,
          referrer: null,
          referee: null,
        },
      ],
      vipTableDataList: [
        {
          bonusList: [
            {
              level: 1,
              award: null,
            },
            {
              level: 2,
              award: null,
            },
            {
              level: 3,
              award: null,
            },
            {
              level: 4,
              award: null,
            },
            {
              level: 5,
              award: null,
            },
            {
              level: 6,
              award: null,
            },
            {
              level: 7,
              award: null,
            },
            {
              level: 8,
              award: null,
            },
            {
              level: 9,
              award: null,
            },
            {
              level: 10,
              award: null,
            },
          ],
        },
      ],
      topupTableDataList: [
        {
          maxNum: null,
          minNum: null,
          firstDisabled: false,
          secondDisabled: true,
          // num: null,
          minCharge: null,
          award: null,
          multiple: null,
        },
        {
          minNum: null,
          maxNum: null,
          text: this.$t("无限大"),
          minCharge: null,
          award: null,
          multiple: null,
          firstDisabled: true,
          secondDisabled: true,
          isEnableMax: true,
        },
      ],
      isInit: false,
      s: [],
    };
  },
  computed: {
    commAttr() {
      return (
        this.startTime +
        this.endTime +
        this.auditMultiple +
        this.minVipLevel +
        this.maxVipLevel +
        this.auditType
      );
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.auditMultiple = this.rule.auditMultiple;
      this.startTime = this.rule.startTime;
      this.endTime = this.rule.endTime;
      this.minVipLevel = this.rule.minVipLevel;
      this.maxVipLevel = this.rule.maxVipLevel;
      this.auditType = this.rule.auditType || 0;
      this.saveData = this.rule;
      let isHave = this.rule.levelDtoList ? this.rule.levelDtoList[0] : "";
      this.layerIndex = isHave ? isHave.level : "0";
      this.getMemberLevel();
      this.initTableData();
    },
    initTableData() {
      let levelDto = null;
      const tempData = JSON.parse(
        JSON.stringify(this.getRuleScopeDtosTemplate())
      );
      if (
        this.rebateDate.levelDtoList &&
        this.rebateDate.levelDtoList.find(
          (item) => item.level === this.layerIndex
        )
      ) {
        levelDto = this.rebateDate.levelDtoList.find(
          (item) => item.level === this.layerIndex
        );
      } else {
        levelDto = tempData.levelDtoList[0];
      }
      levelDto = JSON.parse(JSON.stringify(levelDto));
      if (levelDto.rebateFirstChargeDto) {
        this.scTableDataList[0] = levelDto.rebateFirstChargeDto;
        this.scTableDataList = this.scTableDataList.concat([]);
      } else {
        this.scTableDataList = [
          {
            ...tempData.levelDtoList[0].rebateFirstChargeDto,
          },
        ];
      }
      if (levelDto.rebateVipDtoList) {
        this.vipTableDataList[0].bonusList = levelDto.rebateVipDtoList;
        this.vipTableDataList = this.vipTableDataList.concat([]);
      } else {
        this.vipTableDataList = [
          {
            bonusList: [...tempData.levelDtoList[0].rebateVipDtoList],
          },
        ];
      }
      // if (levelDto.rebateChargeDtoList) this.topupTableDataList = levelDto.rebateChargeDtoList
      // else this.topupTableDataList = tempData.levelDtoList[0].rebateChargeDtoList
      this.isInit = true;
      setTimeout(() => {
        this.isInit = false;
      }, 500);
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then((res) => {
        this.memberLevelGroup = res.data.data;
      });
    },
    getData(val) {
      val["auditMultiple"] = this.auditMultiple;
      val["startTime"] = this.startTime;
      val["endTime"] = this.endTime;
      val["minVipLevel"] = this.minVipLevel;
      val["maxVipLevel"] = this.maxVipLevel;
      val["auditType"] = this.auditType;
      const value = JSON.parse(JSON.stringify(val));
      if (value.levelDtoList) {
        value.levelDtoList = [
          {
            level: value.levelDtoList[0].level,
            depthDtoList: value.levelDtoList[0].depthDtoList,
          },
        ];
      }
      this.$emit("getDate", value);
      this.saveData = val;
    },
    handleDelete(index) {
      this.topupTableDataList.splice(index, 1);
    },
    addRuleItem() {
      this.topupTableDataList.splice(this.topupTableDataList.length - 1, 0, {
        maxNum: null,
        minNum: null,
        firstDisabled: false,
        secondDisabled: true,
        minCharge: null,
        award: null,
        multiple: null,
      });
      this.topupTableDataList[this.topupTableDataList.length - 1].minNum = "";
    },
    change1(row, index) {
      if (row.minNum > 0) row.secondDisabled = false;
    },
    change2(row, index) {
      if (row.maxNum > 0) {
        this.topupTableDataList[index + 1].firstDisabled &&
          (this.topupTableDataList[index + 1].firstDisabled = false);
      }
    },
    handleBlur(row, index, type) {
      if (index === 0 && row.minNum && !row.maxNum) return;
      const surplusList = this.topupTableDataList
        .slice(index + 1)
        .map((item) => {
          return [item.minNum, item.maxNum];
        })
        .flat()
        .filter((_) => {
          return !isNaN(_) && _;
        });
      if (type === "minNum") {
        if (+row.minNum > +row.maxNum) {
          row.maxNum = null;
          this.topupTableDataList.slice(index + 1).forEach((item) => {
            item.maxNum = null;
            item.minNum = null;
            item.firstDisabled = true;
            item.secondDisabled = true;
          });
        }
        if (
          index !== 0 &&
          +row.minNum < +this.topupTableDataList[index - 1].maxNum
        )
          row.minNum = "";
      } else {
        if (!surplusList.length && +row.maxNum < +row.minNum) {
          row.maxNum = "";
        } else if (surplusList.length) {
          const first = surplusList[0];
          if (+row.maxNum > +first) {
            this.topupTableDataList.slice(index + 1).forEach((item) => {
              item.maxNum = null;
              item.minNum = null;
              item.firstDisabled = true;
              item.secondDisabled = true;
            });
          }
        }
      }
    },
  },
  watch: {
    layerIndex(val, old) {
      if (val != old) {
        this.initTableData();
      }
    },
    commAttr(val) {
      this.getData(this.saveData);
    },
    scTableDataList: {
      handler(val) {
        if (!this.isInit) {
          this.$emit("dataChange", {
            name: "rebateFirstChargeDto",
            level: this.layerIndex,
            data: {
              ...val[0],
            },
          });
        }
      },
      deep: true,
    },
    vipTableDataList: {
      handler(val) {
        if (!this.isInit) {
          this.$emit("dataChange", {
            name: "rebateVipDtoList",
            level: this.layerIndex,
            data: [...val[0].bonusList],
          });
        }
      },
      deep: true,
    },
    topupTableDataList: {
      handler(val) {
        if (!this.isInit) {
          this.$emit("dataChange", {
            name: "rebateChargeDtoList",
            level: this.layerIndex,
            data: val,
          });
        }
      },
      deep: true,
    },
    auditType: {
      handler(val) {
        if (!val) {
          this.auditMultiple = 0;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.sdy-table {
  /deep/ td .cell {
    text-align: center;
  }
}
.sdy-table-input {
  line-height: 32px;
  border: 1px solid rgb(220, 223, 230);
  width: 80%;
  box-sizing: border-box;
  text-align: center;
}

.column-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    padding: 0 10px;
  }
}
.no-wrap {
  display: flex;
  align-items: center;
}
.p-5 {
  margin: 0 5px;
}

.add_rule {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ebeef5;
  border-top: none;
  text-align: center;
  cursor: pointer;
  color: #409eff;
}
</style>
