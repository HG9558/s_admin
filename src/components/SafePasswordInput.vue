<template>
  <div v-show="visiable"  class="overlay3" :style="customStyle">
    <!-- <div class="overlay3" :style="customStyle"></div> -->
    <div class="safePass">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><!----><span>{{ $t('提示') }}</span></div>
          <button  @click="checkHide" type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
        </div>
        <div class="el-message-box__content"><!----><div class="el-message-box__message"><p>{{ $t('您正在进行敏感操作,请验证安全密码') }}</p></div>
        <div class="el-message-box__input">
          <div class="el-input">
            <input v-focus="visiable" ref="pwdInput" :type="hide?'password': 'text'" autocomplete="off" placeholder="" class="el-input__inner" @keyup.enter="commitSafepassword" v-model="safePassWord">
            <span @click="isShowPass" class="iconfont" :class="hide?'icon-passhide':'icon-passshow'"></span>
          </div></div></div>
        <div class="el-message-box__btns">
          <button  @click="checkHide" type="button" class="el-button el-button--default el-button--small"><!----><!----><span>{{ $t('取消') }}</span></button>
          <button @click="commitSafepassword" type="button" class="el-button el-button--default el-button--small el-button--primary "><!----><!----><span> {{ $t('确定') }}</span></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import bus from '@/config/EventBus';
  export default {
    name:"SafePasswordInput",
    props: {
      customStyle: {
        type: Object,
        default () {
          return {
            'background-color': 'rgba(0,0,0,0.5)'
          }
        }
      }
    },
    data () {
      return {
        safePassWord: "",
        hide: true,
        // isFromHeader: false,
        // pageName: "",
      }
    },
    computed: {
      visiable () {
        return this.$store.state.safePasswordShow
      },
    },
    // watch: {
    //   visiable(){
    //     if(this.visiable){
    //       debugger
    //       this.$refs.pwdInput.focus();
    //     }
    //   }
    // },
    methods: {
      checkHide () {
        this.$store.commit('safePasswordShow', false)
      },
     // 安全密码输入
      commitSafepassword () {
        if (!this.safePassWord) {
          this.$message({
            type: 'error',
            customClass: 'topshow',
            message: this.$t('安全密码不能为空')
          })
          return
        }

        let page = this.$store.state.safePasswordCallbackPageBegin;
        if(!page){
          this.$message({
            type: 'warning',
            customClass: 'topshow',
            message: this.$t('未设置safePasswordCallbackPageBegin')
          })
          return
        }

        var timestamp =new Date().getTime();
        this.$store.commit("safePasswordShow", false);
        this.$store.commit("safePassword", this.safePassWord);
        this.$store.commit("safePasswordCallbackPageEnd", `${page}_${timestamp}`);
        this.safePassWord = '';
        this.hide=true;
      },

      isShowPass () {
        this.hide = !this.hide
      },
    }
  }
</script>

<style scoped>
.overlay3 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5000;
}
.topshow {
  z-index: 9999 !important;
}
</style>
