<template>
  <!-- 注册送 -->
  <div>
    <!-- 流水范围 -->
    <el-form-item :label="$t('流水范围')">
      <AuditCatsForm v-model="rule.auditCats" />
    </el-form-item>

    <el-form-item :label="$t('同IP领取次数')" prop="ipLimit" :rules="[{ required: true, message: $t('请选择同IP领取次数'), trigger: 'blur' }]">
      <el-radio-group v-model="formModel.ipLimit">
        <el-radio :label="2">{{ $t('2次') }}</el-radio>
        <el-radio :label="0">{{ $t('多次') }}</el-radio>
      </el-radio-group>
		</el-form-item>

    <el-form-item :label="$t('同设备领取次数')" prop="deviceLimit" :rules="[{ required: true, message: $t('请选择同设备领取次数'), trigger: 'blur' }]">
      <el-radio-group v-model="formModel.deviceLimit">
        <el-radio :label="2">{{ $t('2次') }}</el-radio>
        <el-radio :label="0">{{ $t('多次') }}</el-radio>
      </el-radio-group>
		</el-form-item>

    <el-form-item :label="$t('注册来源')" prop="registerSources" :rules="formRules.registerSources">
      <el-checkbox-group class="activity-rule-inline-block" v-model="registerSources">
        <el-checkbox :label="item.value" v-for="item in registerSourceGroup"
          :key="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('申请条件')">
      <el-checkbox-group class="activity-rule-inline-block" v-model="conditions">
        <el-checkbox :label="item.value" v-for="item in conditionsGroup" :key="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <!-- 传0不能领取, 不传为null, 不受限制, 默认为null -->
    <el-form-item :label="$t('领取次数')" prop="totalCount" :rules="formRules.totalCount">
      <el-input type="number" style="width: 10%" v-model.number="rule.totalCount"></el-input>
        <span>{{ $t('注')}} : {{ $t('总领取次数达到该设置的数量')}},{{ $t('系统自行关闭该活动')}}, {{ $t('新注册玩家无法再领取该活动优惠') }};</span>
    </el-form-item>

    <el-form-item :label="$t('赠送金额')" prop="donateAmount" :rules="formRules.donateAmount">
      <el-input type="number" style="width: 10%" v-model.number="rule.donateAmount"
        :placeholder="$t('请输入赠送金额')"></el-input>
    </el-form-item>
    <el-form-item :label="$t('流水倍数')" prop="multipleWater" :rules="formRules.multipleWater">
      <el-input type="number" style="width: 10%" v-model.number="rule.multipleWater"
        :placeholder="$t('请输入流水倍数')"></el-input>
      <span>{{ $t('倍') }} &nbsp; &nbsp; *{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
    <el-form-item :label="$t('领取期限')" prop="drawType" :rules="formRules.drawType">
      {{ $t('自注册成功起') }}
      <el-input type="number" style="width: 10%" v-model.number="rule.drawType" :placeholder="$t('请输入领取期限')"></el-input>
      {{ $t('天内可领') }}
      <span>&nbsp; &nbsp; *{{ $t('活动期间注册方可领取，0天代表不限制领取时限') }}</span>
    </el-form-item>
  </div>
</template>

<script>
import AuditCatsForm from "../common_forms/AuditCats";
import systemConfig from "@/config/config.js";

import {
  checkNatureNumber,
  checkNumberAndDecimals
} from "../../../../config/utils";

export default {
  components: { AuditCatsForm },
  props: ["rule", 'formModel'],
  data() {
    return {
      registerSourceGroup: [
        {
          label: 'app',
          value: 'appClient'
        },
        {
          label: 'PC',
          value: 'pcClient'
        },
        {
          label: 'wap',
          value: 'H5Client'
        },
        {
          label: this.$t('管理后台'),
          value: 'adminManage'
        },
        {
          label: this.$t('代理后台'),
          value: 'agentManage'
        },
        {
          label: this.$t('帮好友注册'),
          value: 'friendRegister'
        },
      ],
      conditionsGroup: [
        {
          label: this.$t('已实名'),
          value: 'isName'
        },
        {
          label: this.$t('已验证手机'),
          value: 'isMobile'
        },
        {
          label: this.$t('已验证银行卡'),
          value: 'isBank'
        },
        /* {
          label: '已验证邮箱',
          value: 'isMail'
        }, */
      ],
      formRules: {
        registerSources: {
          validator: (rule, value, callback) => {
            if (this.registerSources.length) {
              callback()
            } else {
              callback(new Error(this.$t('请选择注册来源')))
            }
          },
          trigger: 'change',
        },
        donateAmount: {
          validator: (rule, value, callback) => {
            const { donateAmount } = this.rule;
            if (checkNumberAndDecimals(donateAmount, 2) && donateAmount >= 0) {
              callback();
            } else {
              callback(new Error(this.$t("大于等于0且最多保留两位小数")));
            }
          },
          trigger: "blur",
        },
        totalCount: {
          validator: (rule, value, callback) => {
            const { totalCount } = this.rule;
            if (!totalCount) {
              callback();
            } else if (checkNatureNumber(totalCount)) {
              callback();
            } else {
              callback(new Error(this.$t("领取次数为空或非负整数")));
            }
          },
          trigger: "blur",
        },
        multipleWater: {
          validator: (rule, value, callback) => {
            const { multipleWater } = this.rule;
            if (checkNatureNumber(multipleWater)) {
              callback();
            } else {
              callback(new Error(this.$t("流水倍数应为非负整数")));
            }
          },
          trigger: "blur",
        },
        drawType: {
          validator: (rule, value, callback) => {
            const { drawType } = this.rule;
            if (checkNatureNumber(drawType)) {
              callback();
            } else {
              callback(new Error(this.$t("领取期限应为非负整数")));
            }
          },
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    conditions: {
      get() {
        return this.conditionsGroup.reduce((arr, { value }) => {
          if (this.rule[value]) {
            arr.push(value)
          }
          return arr
        }, [])
      },
      set(arr) {
        this.conditionsGroup.forEach(({ value }) => {
          this.rule[value] = arr.includes(value)
        })
      },
    },
    registerSources: {
      get() {
        return this.registerSourceGroup.reduce((arr, { value }) => {
          if (this.rule[value]) {
            arr.push(value)
          }
          return arr
        }, [])
      },
      set(arr) {
        this.registerSourceGroup.forEach(({ value }) => {
          this.rule[value] = arr.includes(value)
        })
      },
    },
  },
};
</script>
