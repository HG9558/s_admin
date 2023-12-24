<template>
  <div>
    <el-dialog
      :title="$t('生成优惠码')"
      :visible.sync="showCreatePromo"
      @close="$emit('update:showCreatePromo', false)"
    >
      <el-form
        ref="promo_dialog"
        label-width="150px"
        :model="promoForms"
        :rules="promoRules"
      >
        <el-form-item :label="$t('活动规则')" prop="activityId">
          <el-select
            v-model="promoForms.activityId"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in activityDonateCreateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('赠送金额')" prop="amount">
          <el-select
            v-model="promoForms.amount"
            :placeholder="$t('请选择赠送金额')"
          >
            <el-option
              v-for="item in amountArr"
              :key="item.label"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('生成个数')">
          <el-input
            type="number"
            v-model.number="promoForms.num"
            :placeholder="$t('请输入生成个数')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('指定会员')">
          <el-input
            type="text"
            v-model="promoForms.bingLoginNames"
            :placeholder="$t(`多个会员请用英文,逗号隔开`)"
            onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('有效时间')" prop="promoTime">
          <el-date-picker
            v-model="promoForms.startTime"
            type="datetime"
            :placeholder="$t('选择日期时间')"
          ></el-date-picker>
          <el-date-picker
            v-model="promoForms.endTime"
            type="datetime"
            :placeholder="$t('选择日期时间')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('优惠备注')">
          <el-input type="textarea" v-model="promoForms.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:showCreatePromo', false)">{{
          $t("取消")
        }}</el-button>
        <el-button type="primary" @click="submitCreatPromo">{{ $t("确定") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { lang } from "@/i18n";
import systemConfig from "@/config/config.js";
import moment from "moment";
export default {
  data() {
    return {
      promoForms: {
        activityId: null,
        amount: null,
        num: null,
        bingLoginNames: null,
        startTime: null,
        endTime: null,
        memo: null,
      },
      promoRules: {
        activityId: [
          { required: true, message: lang("请选择活动规则"), trigger: "blur" },
        ],
        amount: [
          { required: true, message: lang("请选择赠送金额"), trigger: "blur" },
        ],
        promoTime: [
          {
            validator: (rule, value, callback) => {
              const { startTime, endTime } = this.promoForms;
              if (!startTime || !endTime) {
                callback(this.$t("请选择对应时间"));
                return;
              }
              if (startTime.getTime() > endTime.getTime()) {
                callback(this.$t("请选择有效范围内时间"));
                return;
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    showCreatePromo: {
      type: Boolean,
      default: false,
    },
    activityDonateCreateList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    amountArr () {
      const data = this.activityDonateCreateList.find(item => item.value === this.promoForms.activityId)
      return data && data.donateAmountList
    },
  },
  methods: {
    submitCreatPromo () {
      const { startTime } = this.promoForms
      this.$refs.promo_dialog.validate(valid => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          const { startTime, endTime } = this.promoForms
          const { bingLoginNames } = this.promoForms
          const newBingLoginNames = bingLoginNames && bingLoginNames.length ? bingLoginNames.split(',') : []
          const params = {
            ...this.promoForms,
            bingLoginNames: newBingLoginNames,
            startTime: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
            endTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss")
          }
          this.$axios
            .post(systemConfig.urls.generatePromoCode, params)
            .then(() => {
              this.$message({
                type: "success",
                message: this.$t("新建成功"),
              });
              this.$emit("update:showCreatePromo", false);
              this.$emit("updateTable");
            });
        }
      })
    },
  },
};
</script>
