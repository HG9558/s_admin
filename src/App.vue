<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog :title="$t('预警通知')" :visible.sync="alarmVisible" width="30% !important">
      <div class="alarm-content">
        <!-- alarmStatus === 1：危险 -->
        <p v-show="curAlarm.alarmStatus === 1">
          {{ $t('站点') }} {{ curAlarm.siteName }} {{ $t('当前预购分为') }} {{ curAlarm.balanceTotal }}，{{
            $t('当前预警值为')
          }}
          {{ curAlarm.alarmvalue }} ，{{
            $t('预警状态为 危险，为避免由于预购分不足导致站点游戏无法进入，请及时补充预购分')
          }}。
        </p>
        <!-- alarmStatus === 2：终止 -->
        <p v-show="curAlarm.alarmStatus === 2">
          {{ $t('站点') }} {{ curAlarm.siteName }} {{ $t('当前预购分为') }} {{ curAlarm.balanceTotal }}，{{
            $t('预购分不足，已禁止该站点所有游戏进入，请及时补充预购分')
          }}。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="alarmVisible = false">{{ $t('知道了') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      alarmVisible: false,
      curAlarm: {},
    }
  },
  watch: {
    async '$store.state.token'(nVal) {
      const { res } = await this.$axios.GET(this.$urls.alarmInfo)
      if (res) {
        this.curAlarm = res.msg
        const { alarmStatus, available } = res.msg
        if (available && (alarmStatus === 1 || alarmStatus === 2)) {
          this.alarmVisible = true
        }
      }
    },
  },
};
</script>
<style lang="scss">
.alarm-content {
  line-height: 18px;
}
.adjust,
.mb-text-right {
  .el-form-item__label {
    text-align: right;
  }
}
.green {
  color: #008000bc;
}

.red {
  color: #f56c6c;
}
</style>
