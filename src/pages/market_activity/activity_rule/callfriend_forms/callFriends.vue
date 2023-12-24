<template>
  <div class="activity-rule-form-wrapper">
    <h5 class="activity-rule-header">
      {{ $t('活动规则') }}
      <el-button class="activity-rule-header_btn" @click="$router.go(-1)">
        {{ $t('返回') }}
      </el-button>
    </h5>
    <el-form
      ref="form"
      class="activity-rule-body"
      :model="formModel"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item
        class="activity-rule-inline-block"
        prop="ruleName"
        :label="$t('规则名称')"
      >
        <el-input
          v-model="formModel.ruleName"
          :placeholder="$t('请输入规则名称')"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="activity-rule-inline-block"
        prop="actTmplId"
        :label="$t('规则类别')"
      >
        <el-select
          v-model="formModel.actTmplId"
          :placeholder="$t('请选择规则类别')"
          disabled
        >
          <el-option
            :key="item.id"
            :value="item.id"
            :label="item.tmplName"
            v-for="item in activityCategories"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="available" :label="$t('是否启用')">
        <el-radio-group
          v-model="formModel.available"
          :placeholder="$t('请选择是否启用')"
        >
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </el-form-item>
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
      <el-form-item :label="$t('返佣配置')" prop="time">
        <el-table :data="optionsData" style="width: 100%">
          <el-table-column :label="$t('层级')" prop="level" align="center">
          </el-table-column>
          <el-table-column :label="$t('注单赢额返佣') + '(%)'" prop="rate" align="center">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.rate"
                type="number"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('返佣上限')" prop="maxReward" align="center">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.maxReward"
                type="number"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header">
              <el-button
                type="primary"
                size="mini"
                align="center"
                @click="onAddRules"
              >
                {{ $t('增加规则') }}
              </el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.level !== 1"
                type="danger"
                size="mini"
                align="center"
                @click="ondelRules(scope.row.level)"
              >
                {{ $t('删除') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="activity-rule-footer">
      <el-button @click="$router.go(-1)">{{ $t('取消') }}</el-button>
      <el-button
        class="activity-rule-footer_save"
        type="primary"
        @click="handleSave"
      >
        {{ $t('保存') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../../../config/config.js";

export default {
  data() {
    return {
      formModel: {
        ruleName: null,
        actTmplId: null,
        available: 1,
        // isAudit: 1,
        // rule: null,
      },
      memberLevelGroup: [],
      activityCategories: [],
      startTime: '',
      endTime: '',
      minVipLevel: null,
      maxVipLevel: null,
      optionsData: [
        {
          level: 1,
          rate: null,
          maxReward: null,
        },
      ],
      levelRule: {
        validator: (rule, value, callback) => {
          const { minVipLevel, maxVipLevel } = this
          if (minVipLevel === '' || maxVipLevel === '') {
            callback(new Error(this.$t('请选择起止参与等级')))
          } else {
            if (maxVipLevel < minVipLevel) {
              callback(new Error(this.$t('结束等级不能小于开始等级')))
            } else {
              callback()
            }
          }
        },
        trigger: ['blur', 'change'],
      },
    }
  },
  computed: {
    id() {
      return Number(this.$route.query.id);
    },
    actTmplId() {
      return Number(this.$route.query.actTmplId);
    },
    tmplName() {
      return this.$route.query.tmplName;
    },
    tmplCode() {
      return this.$route.query.tmplCode;
    },
  },
  created() {
    if (this.id) {
      this.$axios
        .get(systemConfig.urls.activityRule.list + `/${this.id}`)
        .then(({ data }) => {
          const formModel = data.data;
          const { startTime, endTime, minVipLevel, maxVipLevel, huPengLevelRewardDtoList } = JSON.parse(formModel.rule);
          this.startTime = startTime
          this.endTime = endTime
          this.minVipLevel = minVipLevel
          this.maxVipLevel = maxVipLevel
          this.optionsData = huPengLevelRewardDtoList
          this.formModel = formModel;
          // console.log('optionsData：', this.optionsData)
          // console.log('formModel', this.formModel)
        });
    }
    this.getActivityCategories().then(() => {
      this.formModel.actTmplId = this.actTmplId;
    });
    this.getMemberLevel();
  },
  methods: {
    ondelRules(level) {
      const i = this.optionsData.findIndex(item => item.level === level)
      if (i) {
        this.optionsData.splice(i, 1)
      }
    },
    onAddRules() {
      const level = this.optionsData[this.optionsData.length - 1].level
      this.optionsData.push({ level: level + 1, rate: null, maxReward: null })
    },
    handleSave() {
      // console.log('optionsData:', this.optionsData)
      const bool = this.optionsData.some(item => {
        if (item.rate === null || item.maxReward === null) return true
      })
      if (bool) return this.$message.warning('返佣配置项中某些层级的数据为空，请检查！')
      const { startTime, endTime, minVipLevel, maxVipLevel } = this
      const rule = {
        startTime,
        endTime,
        minVipLevel,
        maxVipLevel,
        huPengLevelRewardDtoList: this.optionsData,
      }
      // console.log('rule:', rule)
      // console.log('ruleJSON:', JSON.stringify(rule))
      const loading = this.$loading({ fullscreen: true });
      this.$axios
        .post(
          this.id
            ? systemConfig.urls.activityRule.update
            : systemConfig.urls.activityRule.save,
          {
            ...this.formModel,
            rule: JSON.stringify(rule),
          }
        )
        .then(() => {
          this.$router.go(-1);
        })
        .finally(() => {
          loading.close();
        });
    },
    getMemberLevel() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        this.memberLevelGroup = res.data.data;
      });
    },
    getActivityCategories() {
      return this.$axios
        .get(systemConfig.urls.activityRule.category)
        .then((res) => {
          this.activityCategories = res.data.page;
        });
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .activity-rule-inline-block {
  display: inline-block;
  & + .activity-rule-inline-block {
    margin-left: 40px;
  }
}
.activity-rule-form-wrapper {
  padding: 40px;
}
.activity-rule-header {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .activity-rule-header_btn {
    float: right;
  }
}
.activity-rule-body {
  padding: 30px;
  border: 1px solid #eee;
}
.activity-rule-footer {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  .activity-rule-footer_save {
    margin-left: 30px;
  }
}
</style>