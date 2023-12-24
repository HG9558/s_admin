<template>
<div>
  <div v-show="visiable"  class="overlay2" :style="customStyle">
    <!-- <div class="overlay2" :style="customStyle"></div> -->
    <!-- <div class="safePass" v-show="flag">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><span>提示</span></div>
          <button v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
        </div>
        <div class="el-message-box__content"><div class="el-message-box__message"><p>您正在进行敏感操作,请验证安全密码</p></div>
        <div class="el-message-box__input">
          <div class="el-input">
            <input :type="hide?'password': ''" autocomplete="off" placeholder="" class="el-input__inner" @keyup.enter="commitSafepassword" v-model="safePassWord.securepwd">
            <span @click="isShowPass" class="iconfont" :class="hide?'icon-passhide':'icon-passshow'"></span>
          </div></div></div>
        <div class="el-message-box__btns">
          <button v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" class="el-button el-button--default el-button--small"><span>取消</span></button>
          <button @click="commitSafepassword" type="button" class="el-button el-button--default el-button--small el-button--primary "><span> 确定</span></button>
        </div>
      </div>
    </div> -->
    <div class="pass" v-show="passChangeObj.operationFlag === 'changeLogin'">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><span>{{ $t('提示') }}</span></div>
          <button  v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
        </div>
        <div class="el-message-box__content"><div class="el-message-box__message"><p>{{passChangeObj.operationTitle}}</p></div>
          <div class="el-message-box__input" style="">
            <div class="el-input" v-show="changePassFlag === 'fromHeader'">
              <input :type="hide1?'password': ''" autocomplete="off" :placeholder="$t('原密码')" class="el-input__inner" @keyup.enter="commitLoginpassword"  v-model="loginPassWord.password">
              <span @click="isShowPass1" class="iconfont" :class="hide1?'icon-passhide':'icon-passshow'"></span>
            </div>
            <div class="el-input" style="margin-top:10px">
              <input :type="hide2?'password': ''" autocomplete="off" :placeholder="$t('新密码')" class="el-input__inner" @keyup.enter="commitLoginpassword" v-model="loginPassWord.newPassword">
              <span @click="isShowPass2" class="iconfont" :class="hide2?'icon-passhide':'icon-passshow'"></span>
            </div>
            <div class="el-input" style="margin-top:10px">
              <input :type="hide3?'password': ''" autocomplete="off" :placeholder="$t('确认新密码')" class="el-input__inner" @keyup.enter="commitLoginpassword" v-model="conifrmNewPass">
              <span @click="isShowPass3" class="iconfont" :class="hide3?'icon-passhide':'icon-passshow'"></span>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns center">
          <button  v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" class="el-button el-button--default el-button--small"><span>{{ $t('取消') }}</span></button>
          <button @click="commitLoginpassword" type="button" class="el-button el-button--default el-button--small el-button--primary "><span> {{ $t('确定') }}</span></button>
        </div>
      </div>
    </div>

    <div class="pass" v-show="passChangeObj.operationFlag === 'changeSafe'">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><span>{{ $t('提示') }}</span></div>
          <button  v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
        </div>
        <div class="el-message-box__content"><div class="el-message-box__message"><p>{{passChangeObj.operationTitle}}</p></div>
          <div class="el-message-box__input">
            <!-- <div class="el-input">
              <input :type="hide1?'password': ''" autocomplete="off" placeholder="原密码" class="el-input__inner" @keyup.enter="modifySafepassword"  v-model="securePassword.secpassword">
              <span @click="isShowPass1" class="iconfont" :class="hide1?'icon-passhide':'icon-passshow'"></span>
            </div> -->
            <div class="el-input" style="margin-top:10px">
              <input :type="hide2?'password': ''" autocomplete="off" :placeholder="$t('新密码')" class="el-input__inner" @keyup.enter="modifySafepassword" v-model="securePassword.newPassword">
              <span @click="isShowPass2" class="iconfont" :class="hide2?'icon-passhide':'icon-passshow'"></span>
            </div>
            <div class="el-input" style="margin-top:10px">
              <input :type="hide3?'password': ''" autocomplete="off" :placeholder="$t('确认新密码')" class="el-input__inner" @keyup.enter="modifySafepassword" v-model="conifrmNewPass">
              <span @click="isShowPass3" class="iconfont" :class="hide3?'icon-passhide':'icon-passshow'"></span>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns center">
          <button v-show="passChangeObj.closeVisiable" @click="checkHide" type="button" class="el-button el-button--default el-button--small"><span>{{ $t('取消') }}</span></button>
          <button @click="modifySafepassword" type="button" class="el-button el-button--default el-button--small el-button--primary "><span> {{ $t('确定') }}</span></button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import systemConfig from '../config/config.js'
  import SafePasswordInput from "@/components/SafePasswordInput";
  // import bus from '@/config/EventBus'

  export default {
    // TODO 将密码过期也封装进来
    name:"passwordChange",
    props: {
      customStyle: {
        type: Object,
        default () {
          return {
            'background-color': 'rgba(0,0,0,0.5)'
          }
        }
      },
      operationFlag: {
        type: String,
        default: ''
      },
      closeVisiable: {
        type: Boolean,
        default: true
      },
      operationTitle: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        safePassword4Check: "",
        tmpValue4SafeCheck: {},
        flag: false,
        safePassWord: {securepwd: '', id: this.userId},
        loginPassWord: {password: '', newPassword: ''},
        securePassword: {securepwd: '', newPassword: ''},
        conifrmNewPass: '',
        hide: true,
        hide1: true,
        hide2: true,
        hide3: true,
        tempPass: ''
      }
    },
    computed: {
      userId () {
        return this.$store.state.user.userId
      },
      visiable () {
        return this.$store.state.changePassShow
      },
      passChangeObj () {
        return this.$store.state.passChangeObj
      },
      changePassFlag () {
        return this.$store.state.changePassFlag
      }
    },
    watch: {
      '$store.state.safePasswordCallbackPageEnd': function() {
        let page = this.$store.state.safePasswordCallbackPageEnd.split('_')[0];
        if(!this.$options.name || page !== this.$options.name){ return }

        this.safePassword4Check = this.securePassword.securepwd = this.$store.state.safePassword;
        if(this.tmpValue4SafeCheck.callback && typeof(this.tmpValue4SafeCheck.callback) === 'function'){
          this.tmpValue4SafeCheck.callback.apply(this,this.tmpValue4SafeCheck.args || [])
        }

        this.safePassword4Check="";
        this.tmpValue4SafeCheck={};
      },
    },
    methods: {
      checkHide () {
        this.$store.commit('changePasswordShow', false)
        this.safePassWord.securepwd = ''
        this.loginPassWord.password = ''
        this.loginPassWord.newPassword = ''
        this.securePassword.securepwd = ''
        this.securePassword.newPassword = ''
        this.conifrmNewPass = ''
        this.flag = true
      },
     // 安全密码验证
      // commitSafepassword () {
      //   if (!this.safePassWord.securepwd) {
      //     this.$message({
      //       type: 'warning',
      //       message: '安全密码不能为空'
      //     })
      //     return
      //   }
      //   this.$axios.post(systemConfig.urls.authPwd, this.safePassWord).then((res) => {
      //     this.$message({
      //       type: 'success',
      //       message: '安全密码验证通过'
      //     })
      //     this.flag = false
      //     this.tempPass = this.safePassWord.securepwd
      //     this.safePassWord.securepwd = ''
      //   })
      // },

      // 修改安全密码
      modifySafepassword () {
        if (!this.securePassword.newPassword || !this.conifrmNewPass) {
          this.$message({
            type: 'warning',
            message: this.$t('密码不能为空')
          })
          return
        }
        if (this.securePassword.newPassword !== this.conifrmNewPass) {
          this.$message({
            type: 'warning',
            message: this.$t('两次输入的密码不一样')
          })
          return
        }

        // 安全密码弹窗
        if(!this.safePassword4Check) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.modifySafepasswordRequest);
          this.$set(this.tmpValue4SafeCheck,"args", []);

          // this.$set(this.tmpValue4SafeCheck,"changeType", 1);
          // bus.$emit("fromHeaderMsg",true);
          // this.$store.commit("safePasswordShow", true);
          return;
        }

      },
      modifySafepasswordRequest(){
        // this.securePassword.securepwd = this.safePassword4Check;
        this.$axios.post(systemConfig.urls.modifySafePassword, {userId: this.passChangeObj.userId, ...this.securePassword},{headers: {securepwd: this.safePassword4Check}}).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('安全密码修改成功')
          })
          this.$store.state.resetPassShow = false
          this.checkHide()
          this.tempPass = ''
        })
      },
      // 修改登录密码
      commitLoginpassword () {
        if (this.changePassFlag === 'fromHeader') {
          if (!this.loginPassWord.password || !this.loginPassWord.newPassword || !this.conifrmNewPass) {
            this.$message({
              type: 'warning',
              message: this.$t('密码不能为空')
            })
            return
          }
        } else {
          if (!this.loginPassWord.newPassword || !this.conifrmNewPass) {
            this.$message({
              type: 'warning',
              message: this.$t('密码不能为空')
            })
            return
          }
        }
        if (this.loginPassWord.newPassword !== this.conifrmNewPass) {
          this.$message({
            type: 'warning',
            message: this.$t('两次输入的密码不一样')
          })
          return
        }

        // 安全密码弹窗
        if(!this.safePassword4Check) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.commitLoginpasswordRequest);
          this.$set(this.tmpValue4SafeCheck,"args", []);

          return;
        }
      },

      commitLoginpasswordRequest(){
        this.$axios.post(systemConfig.urls.modifyPassword, {userId: this.passChangeObj.userId, ...this.loginPassWord},{headers: {securepwd: this.safePassword4Check}}).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('登录密码修改成功')
          })

          this.$store.state.resetPassShow = false
          if (this.changePassFlag === 'fromHeader') {
            this.$router.replace('/login')
          }
          this.checkHide()
        })
        // .finally(()=>{
        //   this.safePassword4Check="";
        //   this.tmpValue4SafeCheck={}
        // })
      },

      isShowPass () {
        this.hide = !this.hide
      },
      isShowPass1 () {
        this.hide1 = !this.hide1
      },
      isShowPass2 () {
        this.hide2 = !this.hide2
      },
      isShowPass3 () {
        this.hide3 = !this.hide3
      }
    }
  }
</script>

<style>
.overlay2 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
