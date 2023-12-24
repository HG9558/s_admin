<template>
  <div class="priz-line">
    <!-- 抽奖区 -->
    <el-tabs v-model="activeName" closable @tab-remove="handleRemoveTab" class="lottery-tab" type="card">
      <el-tab-pane :label="$t('抽奖区') + (index + 1)" :name="String(index)" v-for="(item, index) in rule.lotteryAreaDtos" :key="index">
        <!-- <RuleScopeDtosForm v-model="rule" :ruleScopeDtos="rule"/> -->
        <!-- 抽奖列表 -->
        <el-form-item :rules="activityRule" prop="prizeAreaDtos">
          <ActivityRuleDtosForm ref="prizeAreaDtos" v-model="item.prizeAreaDtos" :lotteryAreaDtos="item.prizeAreaDtos"/>
        </el-form-item>
        <!-- 申请信息验证 -->
        <el-form-item :label="$t('申请信息验证')">
          <el-checkbox-group class="activity-rule-inline-block" v-model="conditions" @change="handleConditionsChange(index)">
            <el-checkbox :label="item.value" v-for="item in conditionsGroup" :key="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 申请等级 -->
        <el-form-item :label="$t('申请等级')">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-right: 10px">{{ $t('全选') }}</el-checkbox>
          <el-checkbox-group class="activity-rule-inline-block" v-model="item.actLevelIds" @change="handleCheckedCitiesChange">
            <el-checkbox :label="item.id" v-for="item in actLevelIdsList" :key="item.id">{{ item.tierName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 注册来源 -->
        <el-form-item :label="$t('注册来源')">
          <el-input v-model="item.domains" type="textarea" :rows="3" style="width: 80%;" :placeholder="$t('例如abcd.com,ab.efg.com多个域名用英文逗号隔开，不填写则不限制')"></el-input>
        </el-form-item>
        <!-- 注册时间 -->
        <el-form-item :label="$t('注册时间')">
          <el-radio-group v-model="item.registerCondition">
            <el-radio :label="0">{{ $t('不限制') }}</el-radio>
            <el-radio :label="1">
              <!-- <el-input-number v-if="item.registerCondition === 1" v-model="item.registerNum" :controls="false" placeholder="请输入正整数"></el-input-number> -->
              <SdyInputType class="w130" v-if="item.registerCondition === 1" v-model="item.registerNum" :placeholder="$t('请输入正整数')" :inputValue="item.registerNum" type="zsmin" :min="1" :allowNull="true"></SdyInputType>
              <el-input-number v-else :placeholder="$t('请输入正整数')" :controls="false" disabled></el-input-number>
              {{ $t('天内注册') }}
            </el-radio>
            <el-radio :label="2">
              <el-date-picker v-if="item.registerCondition === 2" v-model="item.registerDate" type="date" :placeholder="$t('请选择日期')" value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-date-picker v-else type="date" :placeholder="$t('请选择日期')" disabled>
              </el-date-picker>
              <span style="maginLeft: 10px">{{ $t('之后注册') }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 抽奖次数统计周期 -->
        <el-form-item :label="$t('抽奖次数统计周期')" class="prize-count">
          <el-radio-group v-model="item.cycle" @change="changeCycle">
            <el-radio :label="0">{{ $t('当日') }}</el-radio>
            <el-radio :label="1">{{ $t('当周') }}</el-radio>
            <el-radio :label="3">{{ $t('活动期间') }}</el-radio>
          </el-radio-group>
          <span style="marginLeft: 25px">* {{ $t('赠送规则统计区间及抽奖次数有效期均按自然日或自然周计算') }}</span>
        </el-form-item>
        <!-- 抽奖次数赠送规则 -->
        <el-form-item v-if="activeCycle===3||item.cycle===3" class="prize-box" :label="$t('抽奖次数赠送规则')">
<!--          <el-checkbox-group @change="handleCheckedLotteryChange">-->
            <el-checkbox class="lottey-check-box" :label="$t('每天首次登录')" v-model="item.isSelectedFirstLoginDay">
              <span class="el-check-input handle-click">
                {{ $t('每天首次登录赠送') }}
                <SdyInputType class="w130" v-model="item.numFirstLoginDay" :placeholder="$t('请输入正整数')" :inputValue="item.numFirstLoginDay" type="zs" :allowNull="true" :disabled="!item.isSelectedFirstLoginDay"></SdyInputType>
                {{ $t('次') }}
              </span>
            </el-checkbox>
            <el-checkbox class="lottey-check-box" :label="$t('用户首次下载APP并注册登录')" v-model="item.isSelectedFirstLogin">
              <span class="el-check-input handle-click">
                {{ $t('用户首次下载APP并注册登录赠送') }}
                <SdyInputType class="w130" v-model="item.numFirstLogin" :placeholder="$t('请输入正整数')" :inputValue="item.numFirstLogin" type="zs" :allowNull="true" :disabled="!item.isSelectedFirstLogin"></SdyInputType>
                {{ $t('次') }}
              </span>
            </el-checkbox>
            <el-checkbox class="lottey-check-box" :label="$t('用户首次绑定银行卡')" v-model="item.isSelectedFirstBindBank">
              <span class="el-check-input handle-click">
                {{ $t('用户首次绑定银行卡赠送') }}
                <SdyInputType class="w130" v-model="item.numFirstBindBank" :placeholder="$t('请输入正整数')" :inputValue="item.numFirstBindBank" type="zs" :allowNull="true" :disabled="!item.isSelectedFirstBindBank"></SdyInputType>
                {{ $t('次') }}
              </span>
            </el-checkbox>
<!--          </el-checkbox-group>-->
        </el-form-item>
        <el-form-item v-else :label="$t('抽奖次数赠送规则')" class="prize-count">
          <el-checkbox class="lottey-check-box" v-model="item.domainsCondition">
            {{ $t('从域名') }}
            <el-input class="w400" :disabled="!item.domainsCondition" v-model="item.registerDomains" :placeholder="$t('例如abcd.com,ab.efg.com多个域名用英文逗号隔开')"></el-input>
            {{ $t('注册，赠送') }}
            <!-- <el-input v-model="item.num" placeholder="请填写正整数"></el-input> -->
            <SdyInputType class="w130" v-model="item.num" :placeholder="$t('请输入正整数')" :disabled="!item.domainsCondition" :inputValue="item.num" type="zs" :allowNull="true"></SdyInputType>
            {{ $t('次') }}
          </el-checkbox>
          <br>
          <el-checkbox-group class="activity-rule-inline-block" v-model="lotteryDepositDtoList" @change="handleDepositDtos">
            <div v-for="(childItem, childIndex) in item.depositDtos" :key="childItem.isCheckSign">
              <el-checkbox class="lottey-check-box" v-if="!childItem.sign" :label="childItem.isCheckSign">
                <span class="el-check-input">
                  {{ $t('期间累计充值不少于') }}
                  <SdyInputType class="w130" v-model="childItem.amountConditions" :placeholder="$t('请输入正整数')" :inputValue="childItem.amountConditions" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('元') }}，{{ $t('赠送') }}
                  <SdyInputType class="w130" v-model="childItem.num" :placeholder="$t('请输入正整数')" :inputValue="childItem.num" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('次') }}
                </span>
              </el-checkbox>
              <span  v-if="!childItem.sign"  class="handle-click">
                <span v-if="!childItem.isNewAdd" class="add-rule" @click="handleAddRule(childItem.sign, childIndex)">+{{ $t('添加累计充值规则') }}</span>
                <span v-else class="delete-rule" @click="deleteHandleRule(childIndex)">x{{ $t('删除') }}</span>
              </span>
              <el-checkbox class="lottey-check-box" v-if="childItem.sign === 1" :label="childItem.isCheckSign">
                <span class="el-check-input">
                  {{ $t('期间首次单笔充值不少于') }}
                  <!-- <el-input v-model="childItem.amountConditions" placeholder="请填写正整数"></el-input> -->
                  <SdyInputType class="w130" v-model="childItem.amountConditions" :placeholder="$t('请输入正整数')" :inputValue="childItem.amountConditions" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('元') }}，{{ $t('赠送') }}
                  <!-- <el-input v-model="childItem.num" placeholder="请填写正整数"></el-input> -->
                  <SdyInputType class="w130" v-model="childItem.num" :placeholder="$t('请输入正整数')" :inputValue="childItem.num" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('次') }}
                </span>
              </el-checkbox>
              <span v-if="childItem.sign === 1"  class="handle-click">
                <span v-if="!childItem.isNewAdd" class="add-rule" @click="handleAddRule(childItem.sign, childIndex)">+{{ $t('添加首次单笔充值规则') }}</span>
                <span v-else class="delete-rule" @click="deleteHandleRule(childIndex)">x{{ $t('删除') }}</span>
              </span>
              <el-checkbox class="lottey-check-box" v-if="childItem.sign === 2" :label="childItem.isCheckSign">
                <span class="el-check-input handle-click">
                  {{ $t('期间有效投注不少于') }}
                  <!-- <el-input v-model="childItem.amountConditions" placeholder="请填写正整数"></el-input> -->
                  <SdyInputType class="w130" v-model="childItem.amountConditions" :placeholder="$t('请输入正整数')" :inputValue="childItem.amountConditions" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('元') }}，{{ $t('赠送') }}
                  <!-- <el-input v-model="childItem.num" placeholder="请填写正整数"></el-input> -->
                  <SdyInputType class="w130" v-model="childItem.num" :placeholder="$t('请输入正整数')" :inputValue="childItem.num" type="zs" :allowNull="true" :disabled="!item.lotteryDepositDtoList.includes(childItem.isCheckSign)"></SdyInputType>
                  {{ $t('次') }}
                </span>
              </el-checkbox>
              <span v-if="childItem.sign === 2" class="handle-click">
                <span v-if="!childItem.isNewAdd" class="add-rule" @click="handleAddRule(childItem.sign, childIndex)">+{{ $t('添加有效投注规则') }}</span>
                <span v-else class="delete-rule" @click="deleteHandleRule(childIndex)">x{{ $t('删除') }}</span>
              </span>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <el-button class="handle-addlottery-area" type="primary" @click="handleAddLotteryArea">{{ $t('添加抽奖区') }}</el-button>
  </div>
</template>

<script>
// import RuleScopeDtosForm from "./RuleScopeDtos";
import ActivityRuleDtosForm from "./saveTable";
import systemConfig from "../../../../config/config.js";
import MemberLevelTabs from "../common_forms/MemberLevelTabs";
import SdyInputType from '../../../../components/SdyInputType'
export default {
  components: { ActivityRuleDtosForm, MemberLevelTabs, SdyInputType },
  props: {
    rule: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  inject: ["rebatesNeDtoTemplate"],
  data() {
    return {
      activeCycle: 3,
      selfnum: null,
      activeName: "0",
      conditions: [],
      conditionsGroup: [
        {
          label: this.$t("已实名"),
          value: "isName",
        },
        {
          label: this.$t("已验证手机"),
          value: "isMobile",
        },
        {
          label: this.$t("已验证银行卡"),
          value: "isBank",
        },
        {
          label: this.$t("已验证邮箱"),
          value: "isMail",
        },
      ],
      isIndeterminate: true,
      checkAll: false,
      actLevelIds: [],
      allActLevelIds: [],
      actLevelIdsList: [],
      lotteryDepositDto: [
        // 抽奖次数赠送规则
        {
          sign: null, // 0累计充值 1首次单笔充值 2有效投注
          amountConditions: null, // 0累计充值 期间累计充值不少于  1期间首次单笔充值不少于  2期间有效投注不少于
          num: null, // 赠送次数
        },
      ],
      lotteryDepositDtoList: [],
      activityRule: {
        validator: (rule, value, callback) => {
          this.$refs.prizeAreaDtos[this.activeName].validate(valid => {
            if (valid) {
              callback()
            }
          })
        }
      }
    };
  },
  created() {
    this.initConditions();
    this.getMemberLevel();
  },
  computed: {
    ruleScopeDtosObserver() {
      return JSON.parse(JSON.stringify(this.rule));
    },
    curDepositDtos() {
      return this.rule.lotteryAreaDtos[Number(this.activeName)].depositDtos
    },
    curLotteryAreaDtos() {
      return this.rule.lotteryAreaDtos[Number(this.activeName)]
    }
  },
  mounted() {
    this.handleClick();
    this.activeCycle = this.rule.lotteryAreaDtos[0].cycle;
  },
  methods: {
    changeCycle(v){
      this.activeCycle = v
    },
    setLotteryDepositDtoList() {
      this.lotteryDepositDtoList = this.curLotteryAreaDtos.lotteryDepositDtoList
      return this.lotteryDepositDtoList
    },
    handleClick() {
      // this.lotteryDepositDtoList = this.curDepositDtos.map((item) =>item.isCheckSign);
      const curLotteryDepositDtoList = this.setLotteryDepositDtoList()
      this.handleDepositDtos(curLotteryDepositDtoList)
    },
    handleConditionsChange() {
      const { conditions, conditionsGroup, ruleScopeDtosObserver } = this;
      for (const { value } of conditionsGroup) {
        ruleScopeDtosObserver.lotteryAreaDtos[this.activeName][
          value
        ] = conditions.includes(value);
      }
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    initConditions() {
      this.conditions = []
      for (const item of this.conditionsGroup) {
        const { value } = item;
        if (this.curLotteryAreaDtos[value]) {
          this.conditions.push(value);
        }
      }
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then((res) => {
        this.actLevelIdsList = res.data.data;
        this.allActLevelIds = this.actLevelIdsList.map((item) => item.id);
        if (this.curLotteryAreaDtos.isCheckAllApplyLevel) {
          this.handleCheckAllChange(true);
        }
      });
    },
    handleCheckAllChange(val) {
      const { ruleScopeDtosObserver } = this;
      ruleScopeDtosObserver.lotteryAreaDtos[
        Number(this.activeName)
      ].actLevelIds = val ? this.allActLevelIds : [];
      this.isIndeterminate = false;
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    handleCheckedCitiesChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.allActLevelIds.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.actLevelIdsList.length;
    },
    handleDepositDtos(val) {
      const { ruleScopeDtosObserver } = this
      ruleScopeDtosObserver.lotteryAreaDtos[this.activeName].lotteryDepositDtoList = val
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    handleAddRule(sign, index) {
      const { rebatesNeDtoTemplate, ruleScopeDtosObserver } = this
      const curaddDepositDtos = JSON.parse(rebatesNeDtoTemplate.addDepositDtos)
      let newDepositDtoItem = curaddDepositDtos.find(item => item.sign === sign)
      let addIndex = index
      const currentDepositDtos = ruleScopeDtosObserver.lotteryAreaDtos[Number(this.activeName)].depositDtos
      currentDepositDtos.map(item => {
        if (item.sign === sign) {
          addIndex++
        }
      })
      const isCheckSignList = this.curDepositDtos.map(item => item.isCheckSign) // 取标记最大值
      newDepositDtoItem.isCheckSign = _.max(isCheckSignList) + 1
      currentDepositDtos.splice(addIndex, 0, newDepositDtoItem)
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    deleteHandleRule(index) {
      const { ruleScopeDtosObserver } = this
      ruleScopeDtosObserver.lotteryAreaDtos[Number(this.activeName)].depositDtos.splice(index, 1)
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
    },
    handleAddLotteryArea() {
      const { rebatesNeDtoTemplate, ruleScopeDtosObserver } = this
      if(ruleScopeDtosObserver.lotteryAreaDtos.length > 9) {
        this.$message.warning(this.$t('抽奖区最多添加10个'))
        return
      }
      const curlotteryAreaDtos = JSON.parse(rebatesNeDtoTemplate.addLotteryAreaDtos)
      curlotteryAreaDtos.prizeArea = this.rule.lotteryAreaDtos.length + 1
      ruleScopeDtosObserver.lotteryAreaDtos.push(curlotteryAreaDtos)
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
      // this.lotteryDepositDtoList = []
      this.$nextTick(() => {
        this.activeName = ruleScopeDtosObserver.lotteryAreaDtos.length - 1 + ''
        this.handleCheckAllChange(true) // 新加抽奖区，则申请等级全选（默认全选）
      })
    },
    handleRemoveTab(targetName) {
      const { ruleScopeDtosObserver } = this
      if (ruleScopeDtosObserver.lotteryAreaDtos.length === 1) {
        this.$message.warning(this.$t('至少保留一个抽奖区'))
        return
      }
      ruleScopeDtosObserver.lotteryAreaDtos.splice(Number(targetName), 1)
      // 触发set
      this.$emit("getDate", ruleScopeDtosObserver);
      this.activeCycle = this.rule.lotteryAreaDtos[targetName].cycle
      const activeName = this.activeName
      this.$nextTick(() => {
        this.activeName = activeName === targetName ? '0' : activeName
      })
    }
  },
  watch: {
    activeName (n, o) {
      this.initConditions()
      this.setLotteryDepositDtoList()
    }
  }
};
</script>

<style lang="scss" scoped>
.priz-line {
  margin: 10px 0;
  padding: 15px 25px;
  border-top: 1px solid #797979;
  position: relative;
  /deep/ .el-tabs__item {
    font-size: 14px !important;
  }
  .handle-addlottery-area {
    position: absolute;
    top: 12px;
    right: 20px;
  }
}
.inline {
  display: inline-block;
  //float: left;
}
.num {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
}
.lottey-check-box {
  margin-bottom: 5px;
  /deep/ .el-input {
    margin: 0 5px !important;
    width: 150px !important;
  }
  .w300 {
    width: 300px;
  }
  .w400 {
  width: 400px !important;
}
}
.delete-rule {
  color: #f80303;
}
.add-rule {
  color: #589ef8;
}
.el-check-input {
  display: inline-block;
  width: 580px;
}
.handle-click{
  cursor: pointer;
}
.w130 {
  width: 130px;
}

.prize-count {
    overflow: visible !important;
    /deep/ .el-form-item__label {
      width: 130px !important;
      margin-left: -30px !important;
    }

}
.lottery-tab {
  /deep/ .el-tabs__content {
    overflow: visible !important;
  }
}
.prize-box{
  /deep/ .el-form-item__label {
    width: 130px !important;
    margin-left: -30px !important;
  }
  /deep/ .el-checkbox + .el-checkbox{
    margin-left: 0;
  }
}
</style>
