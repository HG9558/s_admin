<template>
  <div>
    <el-dialog :visible.sync="showpup"  @close="close">
      <el-form label-position="right" label-width="180px">
          <el-form-item :label="$t('强制显示网站服务条款')">
            <el-radio v-model="radio" :label="1">{{ $t('是') }}</el-radio>
            <el-radio v-model="radio" :label="0">{{ $t('否') }}</el-radio>
            <el-button type="text" disabled>({{ $t('勾选是，则新用户注册时将先看到网站详细服务条款，必须同意后才可继续注册；') }})</el-button>
          </el-form-item>
        <p>{{ $t('网站服务条款') }}：</p>
        <el-input  type="textarea" v-model="memo"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveTerms">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import systemConfig from '../../config/config'
  export default {
    data () {
      return {
        termServise: {},
        showpup: this.showTermservise,
        radio: 1,
        memo: ''
      }
    },
    props: {
      showTermservise: {
        type: Boolean,
        default: false
      },
      flag: {
        type: Boolean,
        default: true // true 会员条款 false 代理条款
      }
    },
    mounted () {
      this.getWebTerms()
    },
    methods: {
      async getWebTerms () {
        this.$axios.get(systemConfig.urls.queryWebTerms).then(res => {
          this.termServise = res.data.data
          if (this.flag) {
            this.radio = this.termServise.memberDisplayTermsOfWebsite
            this.memo = this.termServise.memberServiceTermsOfWebsite
          } else {
            this.radio = this.termServise.agentDisplayTermsOfWebsite
            this.memo = this.termServise.agentServiceTermsOfWebsite
          }
        })
      },
      close () {
        // https://www.jianshu.com/p/6b062af8cf01 深入理解vue 修饰符sync
        this.$emit('update:showTermservise', false)
      },
      saveTerms () {
        this.$axios.post(systemConfig.urls.modifyWebTerms, this.termServise).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('修改成功')
          })
          this.close()
        })
      }
    },
    computed: {
      showTermservise () {
        this.showpup = this.showTermservise
      },
      flag () {
        // 解决双向绑定导致修改过就一直存在问题
        if (this.flag) {
          this.termServise.memberServiceTermsOfWebsite = this.memo
        } else {
          this.termServise.agentServiceTermsOfWebsite = this.memo
        }
      }
    }
  }
</script>
<style>
</style>
