<template>
  <div class="ali-popover" @hide="closePopover" :style =" {left: clientX + 'px',top: clientY + 'px'}">
    <div class="content">
      <template v-if="depositType === 5">
        <p class="bank-p">{{ $t('单笔最低限额') }}</p>
        <input type="text" class="bank-input max-input" maxlength="10" v-model.number="bankData.minAmout" />
      </template>
      <template v-else>
        <p class="bank-p">{{ $t('每日最大存款限额') }}</p>
        <input type="text" class="bank-input max-input" v-model.number="bankData.dayMaxAmout">
        <p class="bank-p">{{ $t('单笔限额') }}</p>
        <input type="text" class="bank-input" v-model.number="bankData.minAmout"><span class="bank-span">~</span><input type="text" class="bank-input" v-model.number="bankData.maxAmout">
      </template>
      <div class="bank-button">
      </div>
    </div>
    <div class="change-btn">
      <el-button size="mini" @click="closePopover('close')">{{ $t('取消') }}</el-button>
      <el-button type="primary" size="mini" @click="updateBankDetail">{{ $t('确认修改') }}</el-button>
    </div>
  </div>
</template>
<script>
import systemConfig from '../config/config.js'
  export default {
    props: {
      bankData: {
        dayMaxAmout: '',
        minAmout: '',
        maxAmout: ''
      },
      depositType: Number,
      contentType: Number,
      clientX: Number,
      clientY: Number,
    },
    methods: {
      closePopover (flag) {
        this.$emit('hide',flag)
      },
      updateBankDetail (className, index) {
        if (this.depositType === 5) {
          if (!(/(^[1-9]\d*$)/.test(this.bankData.minAmout))) {
            this.$message({
              type: 'warning',
              message: this.$t('请输入正确的金额')
            })
            return
          }
        } else {
          if (!(/(^[1-9]\d*$)/.test(this.bankData.dayMaxAmout))) {
            this.$message({
              type: 'warning',
              message: this.$t('请输入正确的金额')
            })
            return
          }
          if (!(/(^[1-9]\d*$)/.test(this.bankData.minAmout))) {
            this.$message({
              type: 'warning',
              message: this.$t('请输入正确的金额')
            })
            return
          }
          if (!(/(^[1-9]\d*$)/.test(this.bankData.maxAmout))) {
            this.$message({
              type: 'warning',
              message: this.$t('请输入正确的金额')
            })
            return
          }
          if (this.bankData.minAmout > this.bankData.maxAmout) {
            this.$message({
              type: 'warning',
              message: this.$t('单笔金额最小值不能大于最大值')
            })
            return
          }
          if (this.bankData.maxAmout > this.bankData.dayMaxAmout) {
            this.$message({
              type: 'warning',
              message: this.$t('单笔金额最大值不能大于每日最大存款')
            })
            return
          }
        }
        // quotaType  限额类型 1银行卡转账 2自动入款平台 3线上支付 4 普通扫码支付 5 加密货币支付
        this.bankData.quotaType = this.depositType
        this.$axios.post(systemConfig.urls.updateQuota, this.bankData).then((res) => {
          if (res.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: this.$t('金额修改成功')
            })
            this.closePopover('update')
          }
        })
      }
    }
  }
</script>
