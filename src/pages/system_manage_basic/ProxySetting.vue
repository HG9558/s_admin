<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane :label="$t('代理注册')" v-if="hasPermission('setting:agent:info')">
        <!--<h1>$t('站点设置')</h1>-->
        <el-form :model="obj1" ref="sysSetObj" label-width="280px" class="demo-ruleForm" style="width: 800px;margin: 0 auto">
            <el-form-item :label="$t('代理注册审核')">
              <el-radio-group v-model="obj1.agentRgister">
                <el-radio  :label="1">{{ $t('启用') }}</el-radio>
                <el-radio  :label="0">{{ $t('禁用') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--<el-form-item  label="代理后台注册下线">-->
              <!--<el-radio-group v-model="obj1.agentSysRgister">-->
                <!--<el-radio  :label="1">启用</el-radio>-->
                <!--<el-radio  :label="0">禁用</el-radio>-->
              <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <el-form-item  :label="$t('代理后台新增会员')">
              <el-radio-group v-model="obj1.agentAddAccount">
                <el-radio  :label="1">{{ $t('启用') }}</el-radio>
                <el-radio  :label="0">{{ $t('禁用') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item  :label="$t('代理后台新增子代理')">
              <el-radio-group v-model="obj1.agentAddSub">
                <el-radio  :label="1">{{ $t('启用') }}</el-radio>
                <el-radio  :label="0">{{ $t('禁用') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:agent:register')" class="save-btn" type="primary" @click="savesOne">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="代理佣金" v-if="hasPermission('setting:agent:info2')">
        <el-form :model="obj2" ref="sysEmailSetObj" label-width="150px" class="demo-ruleForm" :rules="rules">
            <el-form-item label="净盈利费率" prop="netProfitRate">
              <el-input style="width:100px;" v-model.number="obj2.netProfitRate"></el-input> &nbsp; %
            </el-form-item>
            <el-form-item label="自动进阶佣金比">
              <el-radio-group v-model="obj2.isBeginner">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="佣金统计周期">
              <el-radio-group v-model="obj2.commissionPeriod">
                <el-radio  :label="5">每日/期</el-radio>
                <el-radio  :label="1">7日/期</el-radio>
                <el-radio  :label="2">10日/期</el-radio>
                <el-radio  :label="3">15日/期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="佣金生成时间" prop="commissionDay">
              <span>单期统计完成后，第</span>
              <el-input :maxlength="1" style="width:54px;" v-model.number="obj2.commissionDay"></el-input>
              <span>天</span>
            </el-form-item>
            <el-form-item label="自动结算负盈利">
              <el-radio-group v-model="obj2.commissionClose">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button v-if="hasPermission('setting:agent:commission')" class="save-btn" type="primary" @click="savesTwo">保存</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script type="text/babel">

  import systemConfig from '../../config/config.js'
  import Overlay from '../../components/Overlay.vue'
  import {mapGetters} from 'vuex'
  import Mixin from '@/mixins/loadTime'

  export default {
    mixins: [Mixin],
    name: 'ProxySetting',
    components: {Overlay},
    data() {
      return {
        obj1:{
          agentRgister:0,
          agentSysRgister:0,
          agentAddAccount:0,
          agentAddSub:0,
        },
        obj2:{
          // commissionPeriod:1,
          commissionDay:1,
          commissionStartTime:'',
          commissionEndTime:'',
          commissionClose:'',
          netProfitRate: 0,
          isBeginner: 0,
        },
        rules: {
          netProfitRate: [
            {type: 'number', min: 0, max: 100, message: this.$t('不能小于0或大于100')}
          ],
          commissionDay: [
            {type: 'integer', min: 1, max: 7, message: this.$t('请输入小于8的正整数')}
          ]
        }
      }
    },
    created() {
        this.getData()
    },
    computed: {
      ...mapGetters(['hasPermission']),
      timeType: {
        get: function () {
          return this.$store.state.timeType
        },
        set: function () {
        }
      },
    },
    methods: {
      getData() {
        this.getCurrentRecodeTime()
        this.$axios.get(systemConfig.urls.getSetProxy).then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          let data = res.data.data
          this.obj1.agentRgister = data.agentRgister
          this.obj1.agentSysRgister = data.agentSysRgister
          this.obj1.agentAddAccount = data.agentAddAccount
          this.obj1.agentAddSub = data.agentAddSub

          this.obj2.commissionPeriod = data.commissionPeriod
          this.obj2.commissionDay = data.commissionDay
          this.obj2.commissionStartTime =  data.commissionStartTime
          this.obj2.commissionEndTime = data.commissionEndTime
          this.obj2.commissionClose = data.commissionClose
          this.obj2.netProfitRate = data.netProfitRate
          this.obj2.isBeginner = data.isBeginner
        })
      },
      savesOne(){
        this.$axios.post(systemConfig.urls.setProxyOne, this.obj1).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('修改成功')
          })
        })
      },
      savesTwo(){
        this.$refs.sysEmailSetObj.validate(valid => {
          if(valid){
            this.$axios.post(systemConfig.urls.setProxyTwo, this.obj2).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('修改成功')
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .RegTab {
    border: solid 1px #e0e0e0;
    border-bottom: none;
    color: #333;
    .rowd {
      height: 100px;
    }
    .el-row {
      .rowd {
        height: 100px;
        line-height: 100px;
      }
      div {
        display: block;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .el-col {
        border-bottom: solid 1px #e0e0e0;
      }
    }
    .el-button--primary {
      margin-left: 40%;
      margin-top: 30px;
    }
  }

</style>
