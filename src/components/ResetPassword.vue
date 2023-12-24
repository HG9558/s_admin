<template>
  <div v-show="resetPassShow">
    <div class="overlay2"></div>
    <!-- <div class="safePass" v-show="flag">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><span>提示:登录密码过期</span></div>
        </div>
        <div class="el-message-box__content"><div class="el-message-box__message"><p>您正在进行登录密码修改，请验证安全密码</p></div>
        <div class="el-message-box__input" style="">
          <div class="el-input">
            <input :type="hide?'password': ''" autocomplete="off" placeholder="" class="el-input__inner" @keyup.enter="commitSafepassword" v-model="safePassWord.securepwd">
            <span @click="isShowPass" class="iconfont" :class="hide?'icon-passhide':'icon-passshow'"></span>
          </div></div></div>
        <div class="el-message-box__btns">
          <button @click="commitSafepassword" type="button" class="el-button el-button--default el-button--small el-button--primary "><span> 确定</span></button>
        </div>
      </div>
    </div> -->
    <div class="pass" v-show="flag">
      <div class="el-message-box">
        <div class="el-message-box__content">
          <div class="el-message-box__message"><p>{{ $t('请进行登录密码修改') }}</p></div>
          <div class="el-message-box__input" style="">
            <div class="el-input">
              <input :type="hide1?'password': ''" autocomplete="off" :placeholder="$t('原密码')" class="el-input__inner"
                     @keyup.enter="commitLoginpassword" v-model="loginPassWord.password">
              <span @click="isShowPass1" class="iconfont" :class="hide1?'icon-passhide':'icon-passshow'"></span>
            </div>
            <div class="el-input" style="margin-top:10px">
              <input :type="hide2?'password': ''" autocomplete="off" :placeholder="$t('新密码')" class="el-input__inner"
                     @keyup.enter="commitLoginpassword" v-model="loginPassWord.newPassword">
              <span @click="isShowPass2" class="iconfont" :class="hide2?'icon-passhide':'icon-passshow'"></span>
            </div>
            <div class="el-input" style="margin-top:10px">
              <input :type="hide3?'password': ''" autocomplete="off" :placeholder="$t('确认新密码')" class="el-input__inner"
                     @keyup.enter="commitLoginpassword" v-model="conifrmNewPass">
              <span @click="isShowPass3" class="iconfont" :class="hide3?'icon-passhide':'icon-passshow'"></span>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <button @click="commitLoginpassword" type="button"
                  class="el-button el-button--default el-button--small el-button--primary "><span> {{ $t('确定') }}</span></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import systemConfig from '../config/config.js'

  export default {
    name:"resetPassword",
    data() {
      return {
        safePassword4Check: "",
        tmpValue4SafeCheck: {},
        flag: true,
        safePassWord: {securepwd: '', id: this.userId},
        loginPassWord: {password: '', newPassword: ''},
        conifrmNewPass: '',
        hide: true,
        hide1: true,
        hide2: true,
        hide3: true
      }
    },
    computed: {
      resetPassShow() {
        return this.$store.state.resetPassShow
      },
      userId() {
        return this.$store.state.user.userId
      }
    },
    watch:{
      '$store.state.safePasswordCallbackPageEnd': function() {
        let page = this.$store.state.safePasswordCallbackPageEnd.split('_')[0];
        if(!this.$options.name || page !== this.$options.name){ return }

        this.safePassword4Check  = this.$store.state.safePassword;
        if(this.tmpValue4SafeCheck.callback && typeof(this.tmpValue4SafeCheck.callback) === 'function'){
          this.tmpValue4SafeCheck.callback.apply(this,this.tmpValue4SafeCheck.args || [])
        }
        
        this.safePassword4Check="";
        this.tmpValue4SafeCheck={};
      },
    },
    methods: {
      commitSafepassword() {
        if (!this.safePassWord.securepwd) {
          this.$message({
            type: 'warning',
            message: this.$t('安全密码不能为空')
          })
          return
        }
        this.$axios.post(systemConfig.urls.authPwd, this.safePassWord).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('安全密码验证通过')
          })
          this.flag = false
        })
      },
      commitLoginpassword() {
        if (!this.loginPassWord.password || !this.loginPassWord.newPassword || !this.conifrmNewPass) {
          this.$message({
            type: 'warning',
            message: this.$t('密码不能为空')
          })
          return
        }
        if (this.loginPassWord.newPassword !== this.conifrmNewPass) {
          this.$message({
            type: 'warning',
            message: this.$t('两次输入的密码不一样')
          })
          return
        }

debugger
        // 安全密码弹窗
        if(!this.safePassword4Check) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.commitLoginpassword);
          this.$set(this.tmpValue4SafeCheck,"args", []);
          return;
        }

        this.$axios.post(systemConfig.urls.modifyPassword, this.loginPassWord,{headers: {securepwd: this.safePassword4Check}}).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('登录密码修改成功')
          })
          this.$store.state.resetPassShow = false
          /*修改成功之后直接到首页  但是这里右上角用户名会已经获取失败 这里刷新页面实现逻辑重走ajax*/
          location.reload()
          // this.$router.replace('/login')
        })
      },
      isShowPass() {
        this.hide = !this.hide
      },
      isShowPass1() {
        this.hide1 = !this.hide1
      },
      isShowPass2() {
        this.hide2 = !this.hide2
      },
      isShowPass3() {
        this.hide3 = !this.hide3
      }
    }
  }
</script>
<style>
  .overlay2 {
    position: fixed;
    z-index: 100;
    background-color: rgba(255, 255, 255, 1);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>

