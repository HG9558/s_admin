<template>
  <div class="login" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="login-box clearfix">
      <div class="login-left">
        <p class="cn">{{ $t('运营后台管理系统') }}</p>
        <p class="en" v-show="$i18n.locale !== 'en_us'">
          Standard&nbsp;&nbsp;dashboard&nbsp;&nbsp;management&nbsp;&nbsp;system
        </p>
      </div>
      <div class="login-right">
        <div class="login-form">
          <div>
            <span class="iconfont icon-login"></span>
            <span class="icon-title">{{
              loginStep === 1 ? $t( "登录") : $t("安全验证")
            }}</span>
          </div>
          <div class="login-lang">
            <img :src="require(`@/assets/img/lang/${$i18n.locale}.png`)" alt="">
            <el-select v-model="$i18n.locale" size="mini" @change="handleLang">
              <el-option
                v-for="item in langArr"
                :key="item.locale"
                :label="item.name"
                :value="item.locale">
              </el-option>
            </el-select>
          </div>
        </div>
        <template v-if="loginStep === 1">
          <div class="input-box">
            <input v-model="username" v-trim type="text" :placeholder="$t('帐号')" />
          </div>
          <div class="input-box">
            <input
              v-model="password"
              v-trim
              @keyup.enter="authenticatorLogin"
              type="password"
              :placeholder="$t('密码')"
            />
          </div>
          <div
            class="login-commit"
            @click="authenticatorLogin"
            style="font-size: 16px!important;"
          >
            {{ isGoogleAvailable ?  $t("登录") : $t("下一步") }}
          </div>
        </template>
        <template v-else>
          <template v-if="verifyType === 1">
            <div class="input-box">
              <input
                v-model="captcha"
                v-trim
                @keyup.enter="login"
                type="text"
                :placeholder="$t('验证码')"
              />
            </div>
            <div
              class="login-commit"
              @click="login"
              style="font-size: 16px!important;"
            >
              {{ $t('登录') }}
            </div>
            <div
              class="login-commit"
              @click="loginStep--"
              style="font-size: 16px!important;background-color: #fff;border: 1px solid #447ed9;color: #447ed9;"
            >
              {{ $t('返回') }}
            </div>
          </template>
          <template v-if="verifyType === 2">
            <img
              :src="qrCode"
              style="display: block;margin: auto;"
            />
            <div class="qrcode-tips">
              {{ $t('请使用Google Authenticator扫描此码获取用户登录验证码') }}
            </div>
            <input
              class="qrcode-input"
              v-model="captcha"
              v-trim
              @keyup.enter="login"
              type="text"
              :placeholder="$t('请输入6位数字验证码')"
            />
            <div
              class="login-commit"
              @click="login"
              style="font-size: 14px!important;margin-top: 20px"
            >
              {{ $t('我已认证身份，立即登录') }}>>
            </div>
          </template>
        </template>
        <!--<div class="input-box">-->
        <!--<input v-model="captcha" @keyup.enter="authenticatorLogin" class="verify-code" type="text" placeholder="验证码" ref="verifyInput">-->
        <!--<img :src="imgSrc" alt="点击刷新" @click="refreshCode" class="verify-img" ref="verifyImg"/>-->
        <!--</div>-->
      </div>
    </div>
    <div class="login-footer">
      <div class="footer-left">
        <span>©&nbsp;2008-{{ new Date().getFullYear() }}&nbsp;&nbsp;</span
        ><span class="focus">{{ langName }}</span>
      </div>
      <div class="footer-right">
        <a href="#">{{ $t('帮助') }}</a><a href="#">{{ $t('文档下载') }}</a>
        <!-- <a href="#">联系我们： sdy.com</a> -->
      </div>
    </div>
  </div>
</template>

<script>
import systemConfig from "../config/config.js";
import { langArr, handleChangeLang } from '@/i18n'

export default {
  data() {
    return {
      qrCode: null,
      username: "",
      password: "",
      verifyType: null,
      loginStep: 1,
      captcha: "",
      isGoogleAvailable: false,
      imgSrc: "//" + location.host + "/bkapi/sys/captcha.jpg",
      languageShow: false,
      langArr,
      langue: ""
    };
  },
  mounted() {
    this.getSitePre().then(() => {
      this.getGoogleAvailable();
      this.getLanguage();
      this.getEgSanGongFlg();
    });
  },
  created() {
    clearInterval(this.timeout);
    for (var i = 0; i < 9999; i++) {
      clearInterval(i);
    }
  },
  computed: {
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    timeout() {
      return this.$store.state.timeout;
    },
    langName() {
      const locale = this.$i18n.locale
      const lang = langArr.find(i => i.locale === locale) || {}
      return lang.name
    }
  },
  methods: {
    handleLang() {
      handleChangeLang(this.$i18n.locale, true)
    },
    getLanguage() {
      this.$axios.get(systemConfig.urls.getLanguage).then(res => {
        this.languageShow = res.data.isI18n;
        this.langue = res.data.language;
      });
    },
    getEgSanGongFlg() {
      this.$axios.get(systemConfig.urls.getEgSanGongFlg).then(res => {
        this.$store.dispatch("addSanGongFlag", res.data.egSanGongFlg);
      });
    },
    login() {
      const { username, password, captcha } = this;
      this.$axios
        .post(systemConfig.urls.login, {
          username,
          password,
          captcha
        })
        .then(res => {
          this.goHome(res.data.token);
        });
    },
    goHome(token) {
      this.$store.commit('ADD_TOKEN', token)
      // window.localStorage.setItem("token", token);
      this.$router.replace("/main");
    },
    getGoogleAvailable() {
      this.$axios.get(systemConfig.urls.googleAvailable).then(res => {
        this.isGoogleAvailable = res.data.data;
      });
    },
    getSitePre() {
      let url;
      if (location.hostname == "localhost" || location.hostname == "0.0.0.0" || location.hostname.indexOf('192.168') > -1) {
        url = "?url=" + "admin.wsdy.net"; // test
        // url = '?url=' + 'admin.presdy.net'  //pre
        // url = "?url=" + "admin.gosdy.net";

      } else {
        url = "?url=" + location.hostname;
      }
      return this.$axios.get(systemConfig.urls.getSiteCode + url).then(resp => {
        window.localStorage.setItem("SToken", resp.data.SToken);
        window.localStorage.setItem("currency", resp.data.currencyType || 'CNY');
      });
    },
    authenticatorLogin() {
      // if (this.username === '' || this.password === '' || this.captcha === '') {
      if (this.username === "" || this.password === "") {
        this.$message({
          type: "warning",
          message: this.$t("请填写完整正确的信息")
        });
      } else {
        let loginData = {
          username: this.username,
          password: this.password
        };
        this.$store.state.fullscreenLoading = true;
        this.$axios
          .post(systemConfig.urls.authenticatorLogin, loginData)
          .then(resp => {
            const { token, verify, qrCode } = resp.data;
            // this.verifyType = 2
            // this.loginStep++
            // this.qrCode = 'https://www.google.com/chart?chs=200x200&chld=M%7C0&cht=qr&chl=otpauth://totp/evaz@ybh%3Fsecret%3DAHIFMT7QMMQSW2BA'
            if (verify) {
              // 0 登录成功 1 验证码 2 扫描二维码获取验证码
              if (verify === 2) {
                this.qrCode = "data:image/png;base64," + qrCode;
              }
              this.verifyType = verify;
              this.loginStep++;
            } else {
              this.goHome(token);
            }
          });
      }
    }
    // refreshCode() {
    //   this.$refs.verifyImg.src = this.imgSrc + '?t=' + Math.random()
    // }
  }
};
</script>
<style lang="scss">
.qrcode-tips {
  width: 56%;
  margin: auto;
  line-height: 20px;
  text-align: center;
  margin-top: 10px;
}

.qrcode-input {
  display: block;
  border: 1px solid #3b5998;
  border-radius: 4px;
  width: 100%;
  line-height: 46px;
  text-align: center;
  margin-top: 10px;
}

.login {
  background: #3b5998;
  width: 100%;
  height: calc(100% - 64px);
  position: fixed;

  .login-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 64px;
    background: rgb(233, 235, 238);

    .footer-left,
    .footer-right {
      position: absolute;
      line-height: 64px;
      font-size: 14px;
    }

    .footer-left {
      left: 12.5%;

      .focus {
        color: rgb(59, 89, 152);
      }
    }

    .footer-right {
      right: 12.5%;

      a {
        color: rgb(59, 89, 152);
        margin-left: 50px;
      }
    }
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 1200px;
  }

  .login-left,
  .login-right {
    position: relative;
  }

  .login-left {
    text-align: center;
    float: left;
    width: 500px;
    height: 520px;
  }
  .login-form {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .login-lang {
      position: relative;
      top: -40px;
      right: -40px;
      width: 95px;
      text-align: center;
      img {
        width: 50px;
        margin-bottom: 5px;
      }
    }
  }
  .login-right {
    background: #fff;
    float: right;
    width: 380px;
    height: 430px;
    padding: 60px;
    position: relative;

    .languageSelect {
      position: absolute;
      top: -35px;
      right: 0;
      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        width: 100px;
        text-align: center;
        font-weight: bold;
        background-color: rgb(52, 76, 125);
        color: rgb(68, 126, 217);
        float: left;
      }
      .curSelect {
        color: white;
        background-color: rgb(63, 180, 249);
      }
      span:hover {
        color: white;
        cursor: pointer;
        background-color: rgb(63, 180, 249);
      }
    }

    .input-box {
      position: relative;

      input {
        width: calc(100% - 12px);
        height: 50px;
        padding-left: 12px;
        border-bottom: 1px solid #d9d9d9;
        font-size: 18px;
        margin-top: 27px;
      }

      input:focus,
      input:hover {
        border-bottom-color: #3b5998;
        transition: border-bottom-color 1s;
      }

      .icon-warning {
        color: red;
        position: absolute;
        margin-top: 5px;
        font-size: 30px;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }

      .verify-code {
        width: 35%;
      }

      .verify-img {
        position: absolute;
        cursor: pointer;
        bottom: 0;
        left: 50%;
      }
    }

    .login-commit {
      background: #409eff;
      color: #fff;
      height: 56px;
      line-height: 56px;
      width: 100%;
      text-align: center;
      font-size: 18px;
      margin-top: 40px;
      cursor: pointer;
    }

    .notice-p {
      width: calc(100% - 12px);
      padding-left: 12px;
    }
  }

  .cn,
  .en {
    position: absolute;
    width: 100%;
    color: #fff;
  }

  .cn {
    top: 40%;
    font-size: 46px;
  }

  .en {
    top: 55%;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
  }

  .icon-login,
  .icon-title {
    color: #3b5998;
  }

  .icon-login {
    font-size: 40px;
  }

  .icon-title {
    font-size: 32px;
    margin-left: 10px;
  }

  /*宽度小于1000  上下排列*/
  @media screen and (max-width: 1200px) {
    .login-box {
      min-width: 0;
      width: 100%;
    }
    .login-left {
      width: 100%;
      height: 100px;
    }
    .login-right {
      transform: translateX(-50%);
      left: 50%;
      float: left;
      padding: 20px;
    }
    .cn {
      top: 15%;
      font-size: 32px;
    }
    .en {
      display: none;
    }
  }
  .center {
    text-align: center;
  }
}
</style>
