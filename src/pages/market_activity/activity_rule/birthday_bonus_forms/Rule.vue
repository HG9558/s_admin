<template>
  <div>
    <!-- 流水范围 -->

    <el-form-item :label="$t('申请条件')">
      <el-checkbox-group
        class="activity-rule-inline-block"
        v-model="conditions"
        @change="handleConditionsChange"
      >
        <el-checkbox
          :label="item.value"
          v-for="item in conditionsGroup"
          :key="item.value"
        >{{ item.label }}
        </el-checkbox
        >
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('领取限制')">
      {{ $t('会员自注册日起') }}
      <el-input-number
        v-model="rule.day"
        :controls="false"
        style="width: 20%"
        :placeholder="$t('请输入天数')"
      ></el-input-number>
      {{ $t('天内过生日，将不能领取首次生日礼金') }}
    </el-form-item>
    <RuleScopeDtosForm
      :key="layerIndex"
      :ruleScopeDtos="rule.ruleScopeDtos"
      :memvips="memvips"
      @checkIsClick="checkIsClick"
    />
  </div>
</template>

<script>
  import AuditCatsForm from "../common_forms/AuditCats";
  import MemberLevelTabs from "../common_forms/MemberLevelTabs";
  import RuleScopeDtosForm from "./RuleScopeDtos";
  import systemConfig from "../../../../config/config.js";

  export default {
    components: {AuditCatsForm, MemberLevelTabs, RuleScopeDtosForm},
    inject: ["getRuleScopeDtosTemplate"],
    props: ["rule"],
    data() {
      return {
        memvips: null,
        layerIndex: "0",
        conditions: [],
        conditionsGroup: [
          {
            label: this.$t("已实名"),
            value: "isName"
          },
          {
            label: this.$t("已验证手机"),
            value: "isMobile"
          },
          {
            label: this.$t("已验证银行卡"),
            value: "isBank"
          },
          {
            label: this.$t('已验证邮箱'),
            value: 'isMail'
          },
          // {
          //   label: "APP注册",
          //   value: "isApp"
          // }
        ],
        memberLevelGroup: [],
        recodeData: [],
        recodeLevelData: [],
        recodNum: -1,
        rules: {
          validDates: {
            validator: (rule, value, callback) => {
              if (this.rule.validDates.length) {
                callback()
              } else {
                callback(this.$t('请选择会员日'))
              }
            },
            trigger: 'change',
          },
        },
      };
    },
    created() {
      this.initConditions()
      this.getMemberLevel();
      console.log(this.rule)
    },
    methods: {
      checkIsClick(obj){
        console.log(obj)
        this.$emit('pCheckIsClick',obj)
      },
      handleMemDayTypeChange() {
        this.rule.validDates = []
        this.$nextTick(() => {
          this.$refs.memDayType.resetField()
        })
      },
      handleConditionsChange() {
        const {conditions, conditionsGroup} = this;
        for (const {value} of conditionsGroup) {
          this.rule[value] = conditions.includes(value);
        }
      },
      initConditions() {
        // this.rule.isMail = false;
        for (const item of this.conditionsGroup) {
          const {value} = item;
          if (this.rule[value]) {
            this.conditions.push(value);
          }
        }
        this.handleConditionsChange();
      },
      handleScopeChange() {
        this.recodNum++;
        if (this.recodNum > 0) {
          //会员范围变更时-->保留历史值并设置当前值
          this.recodeData = JSON.parse(JSON.stringify(this.rule.ruleScopeDtos));
          this.rule.ruleScopeDtos = this.recodeLevelData.length
            ? this.recodeLevelData
            : [this.getRuleScopeDtosTemplate()];
        }
        this.rule.ruleScopeDtos = this.memberLevelGroup.map(level => {
          this.rule.ruleScopeDtos.find(
            item => item.actLevelId === level.id
          )
          const ruleScopeDtos =
            this.rule.ruleScopeDtos.find(
              item => item.actLevelId === level.id
            ) || this.getRuleScopeDtosTemplate();
          return {
            actLevelId: level.id,
            ...ruleScopeDtos
          };
        });
      },
      getMemberLevel() {
        this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
          let arr = []
          // debugger
          res.data.data.map((item, index) => {
            if (item.tierName != 'VIP0') {
              // debugger
              arr.push({
                actLevelId: item.id,
                // tierName: item.tierName,
                validbetMin: '',
                depositMin: '',
                donateAmount: '',
                multipleWater: ''
              })
            }
          })
          // this.$set(this.rule.ruleScopeDtos,this.layerIndex,arr)

          this.memvips = res.data.data
          if (this.rule.ruleScopeDtos.length != 0) {
            return
          }
          this.rule.ruleScopeDtos = arr
          // console.log(this.rule.ruleScopeDtos)
          // this.memberLevelGroup = arr;
          // this.handleScopeChange();
        });
      }
    }
  };
</script>
