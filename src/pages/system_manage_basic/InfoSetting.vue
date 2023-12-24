<template>
  <div class="InfoSetting">
    <el-card>
      <el-form ref="form" :model="form" label-width="250px" label-position="left">
        <div class="left">
          <h3>{{ $t('存取款播报') }}</h3>
          <el-form-item :label="$t('新存款订单生成')">
            <el-switch v-model.number="form.isBroadcastNewDepositOrder" @change="enchargeChange" active-value="1" inactive-value="0" :disabled="hasPermission('')"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('新取款订单生成')">
            <el-switch v-model.number="form.isBroadcastNewWithdrawOrder"  @change="depositChange" active-value="1" inactive-value="0" :disabled="hasPermission('')"></el-switch>
          </el-form-item>
        </div>
        <div class="right">
          <h3>{{ $t('红利申请播报') }}</h3>
          <el-form-item :label="$t('新红利生成')">
            <el-switch v-model.number="form.isBroadcastNewBonus" @change="bonusChange" active-value="1" inactive-value="0" :disabled="hasPermission('')"></el-switch>
          </el-form-item>

          <el-form-item :label="$t('新会员注册成功')">
            <el-switch v-model.number="form.isBroadcastNewMember" @change="registerChange" active-value="1" inactive-value="0" :disabled="hasPermission('')"></el-switch>
          </el-form-item>

        </div>
      </el-form>
    </el-card>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import systemConfig from "../../config/config";
import Mixin from '@/mixins/loadTime'


export default {
  mixins: [Mixin],
  name: "InfoSetting",
  data(){
    return {
      form: {},
      rules: {
      }
    }
  },
  computed: {
    ...mapGetters(['hasPermission']),
  },
  methods: {
    enchargeChange(v){
      this.getCurrentRecodeTime()
      this.$axios.post(systemConfig.urls.updateBroadcastSwitchSetting,{key:'isBroadcastNewDepositOrder',status:Number(v)}).then(res=>{
        if(res.data.code===0){
          this.$message.success(this.$t('修改成功'))
          this.initData()
        }else {
          this.initData()
        }
      }).catch(()=>{
        this.initData()
      })
    },
    depositChange(v){
      this.getCurrentRecodeTime()
      this.$axios.post(systemConfig.urls.updateBroadcastSwitchSetting,{key:'isBroadcastNewWithdrawOrder',status:Number(v)}).then(res=>{
        if(res.data.code===0){
          this.$message.success(this.$t('修改成功'))
          this.initData()
        }else{
          this.initData()
        }
      }).catch(()=>{
        this.initData()
      })
    },
    bonusChange(v){
      this.getCurrentRecodeTime()
      this.$axios.post(systemConfig.urls.updateBroadcastSwitchSetting,{key:'isBroadcastNewBonus',status:Number(v)}).then(res=>{
        if(res.data.code===0){
          this.$message.success(this.$t('修改成功'))
          this.initData()
        }else{
          this.initData()
        }
      }).catch(()=>{
        this.initData()
      })
    },
    registerChange(v){
      this.getCurrentRecodeTime()
      this.$axios.post(systemConfig.urls.updateBroadcastSwitchSetting,{key:'isBroadcastNewMember',status:Number(v)}).then(res=>{
        if(res.data.code===0){
          this.$message.success(this.$t('修改成功'))
          this.initData()
        }else{
          this.initData()
        }
      }).catch(()=>{
        this.initData()
      })
    },
    initData(){
      this.$axios.get(systemConfig.urls.queryBroadcastSwitchSetting).then(res=>{
        this.getNetworkLoadAndDataSolveTime(res)
        if(res.data.code===0){
          res.data.data.map(ws=>{
            this.$set(this.form, ws.syskey, ws.sysvalue)
          })
        }
      })
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style scoped lang="scss">
.InfoSetting{
  h3{margin-bottom: 15px;}
  /deep/ .el-form{
    width: 700px;
    .left{float: left;width: 300px;}
    .right{float: right;width: 300px;}
  }
}
</style>
