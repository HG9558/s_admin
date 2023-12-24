<template>
  <el-dialog :visible="formVisible" :title="$t('周期统计规则')" @close="handleClose">
    <el-form class="form-wrapper" label-position="top" label-suffix=":" ref="form"
             :model="formModel" :rules="rules">
      <el-form-item :label="$t('升级计算周期')" prop="statisticalRule">
        <el-radio-group style="margin-top: 10px;" v-model="formModel.statisticalRule" @change="valueChange">
          <el-radio label="0">{{ $t('自注册日起') }}</el-radio>
          <el-radio label="1">{{ $t('按自然日') }}</el-radio>
          <el-radio label="2">{{ $t('按自然周') }}</el-radio>
          <el-radio label="3">{{ $t('按自然月') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('降级计算周期')" prop="downgradePromotionDay">
        <div class="promotion-conditions-item">
          <span class="promotion-conditions-item_tip">{{ $t('最近') }}</span>
          <el-input v-model.number="formModel.downgradePromotionDay" :placeholder="$t('请输入整数')"></el-input>
          <span class="promotion-conditions-item_tip">{{ $t('天') }}</span>
          <!--            &nbsp;-&nbsp;-->
          <!--            <el-input v-model.number="formModel.depositMax" placeholder="请输入充值范围"></el-input>-->
        </div>
      </el-form-item>
      <el-form-item :label="$t('恢复计算周期')" prop="recoverPromotionDay">
        <div class="promotion-conditions-item">
          <span class="promotion-conditions-item_tip">{{ $t('降级后') }}</span>
          <el-input v-model.number="formModel.recoverPromotionDay" :placeholder="$t('请输入整数')"></el-input>
          <span class="promotion-conditions-item_tip">{{ $t('天') }}</span>
          <!--            &nbsp;-&nbsp;-->
          <!--            <el-input v-model.number="formModel.depositMax" placeholder="请输入充值范围"></el-input>-->
        </div>
      </el-form-item>
      <el-form-item :label="$t('前台说明')" prop="description">
        <el-input v-model="formModel.description" :placeholder="$t('请填写周期统计规则前台说明')"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px;"></div>
    <p style="color:red;font-size:14px;padding-left:20px;">{{reminder}}</p>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit" v-if="isSaveLimit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>

  export default {
    props: ['formVisible', 'statisticalRuleFormModel', 'isSaveLimit'],
    data() {
      return {
        formModel: {
          statisticalRule: null,
          description: null,
        },
        rules: {
          statisticalRule: {required: true, message: this.$t('请选择统计周期'), trigger: 'change'},
          description: [
            {required: true, message: this.$t('请填写前台说明'), trigger: 'blur'},
            {max: 255, message: this.$t('前台说明最长为255个字符'), trigger: 'blur'}
          ],
          downgradePromotionDay: [
            {required: true,type: "number", min: 1, message: this.$t("请输入正整数"), trigger: "blur"}
          ],
          recoverPromotionDay: [
            {required: true,type: "number", min: 1, message: this.$t("请输入正整数"), trigger: "blur"}
          ],
        },
        reminder: '',//注释提示语
      }
    },
    created() {
      this.formModel = this.statisticalRuleFormModel
      this.formModel.downgradePromotionDay?(this.formModel.downgradePromotionDay=Number(this.formModel.downgradePromotionDay)):null
      this.formModel.recoverPromotionDay?(this.formModel.recoverPromotionDay=Number(this.formModel.recoverPromotionDay)):null
    },
    methods: {
      handleSubmit() {
        console.log(this.formModel)
        this.ignorePromotionConditionsRule = false
        this.$refs.form.validate(valid => {
          if (valid) {
            const {statisticalRule, description,downgradePromotionDay,recoverPromotionDay} = this.formModel
            this.$emit('submit', {
              value: statisticalRule,
              description,
              downgradePromotionDay:downgradePromotionDay,
              recoverPromotionDay:recoverPromotionDay,
            })
          }
        })
      },
      handleClose() {
        this.$emit('update:formVisible', false)
      },
      reminderText(val) {
        switch (val) {
          case 0 : {
            this.reminder = this.$t("注：每隔2小时，统计更新会员注册日至今晋升条件，符合条件的会员，晋级立即生效");
            break;
          }
            ;
          case 1 : {
            this.reminder = this.$t("注：每隔2小时，统计更新会员今日的晋升条件，符合条件的会员，晋级立即生效")
            break;
          }
            ;
          case 2 : {
            this.reminder = this.$t("注：每隔2小时，统计更新会员本周的晋升条件，符合条件的会员，晋级立即生效")
            break;
          }
            ;
          case 3 : {
            this.reminder = this.$t("注：每隔2小时，统计更新会员本月的晋升条件，符合条件的会员，晋级立即生效")
            break;
          }
            ;
        }
      },
      valueChange(val) {
        this.reminderText(val);
      }
    }
  }
</script>

<style scoped lang="scss">
  .memberLevel {
    .el-radio {
      // min-width: 94px;
    }
  }

  .form-wrapper {
    .promotion-conditions-item {
      display: flex;
      margin-bottom: 10px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .promotion-conditions-item_tip {
        min-width: 100px;
      }
    }
  }
</style>

