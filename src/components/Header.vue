<template>
  <div class="header">
    <div class="fl" :class="[isCollapse ? 'deg' : '']">
      <span class="iconfont icon-nav" @click="toggle"></span>
    </div>
    <el-select v-model="lang" size="mini" :placeholder="$t('请选择')" class="border-left fr" style="width: 95px" @change="handleLang">
      <el-option
        v-for="item in langArr"
        :key="item.locale"
        :label="item.name"
        :value="item.locale">
      </el-option>
    </el-select>
    <!-- <sub-header></sub-header> -->
    <el-dropdown class="border-left fr dropdown" style="height:46px;">
      <span class="el-dropdown-link color-fff">
        <span>{{ name }}</span>
        <i class="el-icon-arrow-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="modifyLoginPass"
          >{{ $t('修改登录密码') }}</el-dropdown-item
        >
        <el-dropdown-item @click.native="modifySafePass"
          >{{ $t('修改安全密码') }}</el-dropdown-item
        >
        <el-dropdown-item @click.native="logout">{{ $t('退出登录') }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="fr border-left">
      <span class="color-fff">{{ date | formatdate(timeType) }}</span>
    </div>
    <el-dropdown
      class="border-left fr"
      placement="bottom-start"
      @command="changeTime"
      style="height:46px; cursor:pointer;"
    >
      <span class="el-dropdown-link" style="color: #fff">
        {{ timeZone }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in timeOptions"
          :key="index"
          :command="item.value"
        >
          <span>{{ item.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div
      v-show="permissions.isBonusCount"
      @click="jump('红利申请')"
      class="fr border-left head-span"
    >
      <span>{{ $t('红利申请') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[3].counts) }]">{{ countArr.length && countArr[3].counts }}</span>
    </div>
    <div
      v-show="permissions.isWithdraw"
      @click="jump('会员提款复审')"
      class="fr border-left head-span"
    >
      <span>{{ $t('会员提款复审') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[2].counts) }]">{{ countArr.length && countArr[2].counts }}</span>
    </div>
    <div
      v-show="permissions.isWithdraw"
      @click="jump('会员提款初审')"
      class="fr border-left head-span"
    >
      <span>{{ $t('会员提款初审') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[1].counts) }]">{{ countArr.length && countArr[1].counts }}</span>
    </div>
    <div
      v-show="permissions.isDepositCount"
      @click="jump('会员入款')"
      class="fr border-left head-span"
    >
      <span>{{ $t('会员入款') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[0].counts) }]">{{ countArr.length && countArr[0].counts }}</span>
    </div>
    <div
      v-if="hasPermissionForMemberMessage"
      @click="
        $router.push({
          path: '/main/operateManage/messageBoard',
          query: { isRevert: 0, t: Date.now() }
        })
      "
      class="fr border-left head-span"
    >
      <span>{{ $t('会员留言') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[4] && countArr[4].counts) }]">{{
        (countArr.length && countArr[4] && countArr[4].counts) || 0
      }}</span>
    </div>
    <div
      v-show="permissions.isDepositCount"
      @click="jump('意见反馈')"
      class="fr border-left head-span"
    >
      <span>{{ $t('意见反馈') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[5].counts) }]">{{ countArr.length && countArr[5].counts }}</span>
    </div>
    <div
      v-show="permissions.isTransformSheet"
      @click="jump('户内转账待处理')"
      class="fr border-left head-span"
    >
      <span>{{ $t('户内转账待处理') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[6].counts) }]">{{ countArr.length && countArr[6].counts }}</span>
    </div>
    <div
      @click="jump('预警信息')"
      class="fr border-left head-span"
    >
      <span>{{ $t('预警信息') }}</span
      ><span :class="['amount', { 'un_amount': !(countArr.length && countArr[7].counts) }]">{{ countArr.length && countArr[7].counts }}</span>
    </div>

    <div @click="jump('新注册会员提示')" class="aaa  fr border-left head-span" >
      <span>{{ $t('新注册会员提示') }}</span>
      <span :class="['amount', { 'un_amount': !(countArr.length && countArr[8].counts) }]">{{ countArr.length && countArr[8].counts }}</span>
    </div>

    <tags-view></tags-view>
    <password-change
      :operationTitle="passChangeObj.operationTitle"
      :closeVisiable="passChangeObj.closeVisiable"
      :visiable="passChangeObj.visiable"
      :operationFlag="passChangeObj.operationFlag"
    ></password-change>
    <!-- 会员入款 -->
    <audio
      v-if="permissions.isDepositCount"
      style="width: 0;height: 0;"
      controls
      :src="soundPath('member-payment-one')"
      ref="memberPayment"
    ></audio>
    <!-- 提款初审 -->
    <audio
      v-if="permissions.isWithdraw"
      style="width: 0;height: 0;"
      controls
      :src="soundPath('withdraw-first-one')"
      ref="withdrawFirst"
    ></audio>
    <!-- 提款复审 -->
    <audio
      v-if="permissions.isWithdraw"
      style="width: 0;height: 0;"
      controls
      :src="'../../static/media/withdraw-review-one.mp3'"
      ref="withdrawReview"
    ></audio>
    <!-- 红利申请 -->
    <audio
      v-if="permissions.isBonusCount"
      style="width: 0;height: 0;"
      controls
      :src="soundPath('bonus-apply-one')"
      ref="bonusApply"
    ></audio>
    <!-- 会员留言 -->
    <audio
      v-if="hasPermissionForMemberMessage"
      style="width: 0;height: 0;"
      controls
      :src="'../../static/media/member-message-one.wav'"
      ref="memberMessage"
    ></audio>
     <!-- 意见反馈 -->
    <audio
      v-if="permissions.feedback"
      style="width: 0;height: 0;"
      controls
      :src="'../../static/media/feedback-one.wav'"
      ref="feedback"
    ></audio>
    <!-- 户内转账待处理 -->
    <audio
      v-if="permissions.isTransformSheet"
      style="width: 0;height: 0;"
      controls
      :src="'../../static/media/isTransformSheet-one.mp3'"
      ref="isTransformSheet"
    ></audio>
    <!-- 催单提醒 -->
    <audio
      style="width: 0;height: 0;"
      controls
      :src="soundPath('cui')"
      ref="isCui"
    ></audio>
    <!-- 新注册会员提示 -->
    <audio
      style="width: 0;height: 0;"
      controls
      :src="soundPath('newRegister')"
      ref="newRegister">
    </audio>
  </div>
</template>

<script type="text/babel">
import subHeader from "./SubHeader.vue";
import systemConfig from "../config/config.js";
import bus from "../config/EventBus";
import TagsView from "./tagsView.vue";
import PasswordChange from "./PasswordChange";
import { langArr, handleChangeLang } from '@/i18n'
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      count_transformSheet: 0,
      amount1: 10,
      amount2: 100,
      amount3: 1000,
      amount4: 6,
      amount5: 10000,
      countArr: [],
      oldCountArr: [],
      date: Date.now(),
      time: "",
      time2: "",
      /* isWithdrawFirstCount: true,
      isDepositCount: true,
      isBonusCount: true,
      isWithdrawReviewCount: true, */
      soundsQueue: Promise.resolve(),
      cuiHTML: '',
      lang: '',
      langArr
    };
  },
  created() {
    this.$nextTick(() => {
      this.getCount();
    });
    /* this.getDropdownShow(); */
  },
  mounted() {
    // 定时器，用于每秒刷新页面
    var _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function() {
      _this.date = Date.now(); //修改数据date
    }, 1000);
    this.timer2 = setInterval(function() {
      _this.getCount(); // 15秒一次
    }, 15000);
    bus.$on("updateCount", function(isUpdate) {
      if (isUpdate) {
        _this.getCount();
      }
    });
    this.lang = this.$i18n.locale
  },
  beforeDestory() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
    }
    if (this.timeout) {
      clearInterval(this.timeout); // 在Vue实例销毁前，清除定时器
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    timeZone() {
      const labelMap = {
        'bj': this.$t("北京时间"),
        'md': this.$t("美东时间"),
        'yn': this.$t("越南时间"),
      }
      return labelMap[this.$store.state.timeType]
    },
    timeOptions() {
      const timeIndex = {
        'bj': 0,
        'md': 1,
        'yn': 2,
      }
      const timeArr = [
        {
          label: this.$t("北京时间"),
          value: "bj"
        },
        {
          label: this.$t("美东时间"),
          value: "md"
        },
        {
          label: this.$t("越南时间"),
          value: "yn"
        },
      ]
      const item = timeArr[timeIndex[this.$store.state.timeType]]
      timeArr.splice(timeIndex[this.$store.state.timeType], 1)
      timeArr.unshift(item)
      return timeArr
    },
    hasPermissionForMemberMessage() {
      return this.hasPermission("member:message:list");
    },
    permissions() {
      const { hasPermission } = this;
      return {
        isBonusCount: hasPermission("operate:bonus:list"),
        isDepositCount: hasPermission("fund:onLine:list"),
        isWithdraw: hasPermission("fund:accWithdraw:list"),
        feedback: hasPermission("member:message:opinionlist"),
        isTransformSheet:hasPermission("fund:billReport:list"),
      };
    },
    passChangeObj() {
      return this.$store.state.passChangeObj;
    },
    isCollapse() {
      return this.$store.state.isCollapse;
    },
    name() {
      if (this.$store.state.user) {
        return this.$store.state.user.username;
      } else {
        return "???";
      }
    },
    timeType: {
      get: function() {
        return this.$store.state.timeType;
      },
      set: function() {}
    },
    allAmount() {
      let value = 0;
      if (this.countArr.length > 0) {
        for (let i = 0; i < this.countArr.length; i++) {
          value += this.countArr[i].counts;
        }
        if (value > 99) {
          return "99+";
        }
      }
      return value;
    },
    timeout: {
      set(val) {
        this.$store.state.timeout = val;
      },
      get() {
        return this.$store.state.timeout;
      }
    }
  },
  methods: {
    soundPath(name) {
      const path = '../../static/media/'
      const lang = localStorage.getItem('lang')
      const obj = {
        en_us: '-en_us'
      }
      return path + name + (obj[lang] || '') + '.mp3'
    },
    handleLang() {
      handleChangeLang(this.lang, true)
    },
    getDropdownShow() {
      this.$axios.get(systemConfig.urls.dropdownShow).then(res => {
        this.isBonusCount = res.data.data.isBonusCount;
        this.isDepositCount = res.data.data.isDepositCount;
        this.isWithdrawFirstCount = res.data.data.isWithdrawFirstCount;
        this.isWithdrawReviewCount = res.data.data.isWithdrawReviewCount;
      });
    },
    logout() {
      this.$axios.post(systemConfig.urls.logout).then(resp => {
        window.localStorage.removeItem("token");
        if (this.timer) {
          clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
        }
        if (this.timeout) {
          clearInterval(this.timeout); // 在Vue实例销毁前，清除定时器
        }
        for (var i = 0; i < 9999; i++) {
          clearInterval(i);
        }
        const lang = localStorage.getItem('lang')
        window.localStorage.clear();
        localStorage.setItem('lang', lang)
        this.$router.push({ path: "/login" });
        // localStorage.removeItem('SToken')
        //localStorage.removeItem('visitedViews')
        /*退出之后我要清除所有的vuex保留的信息*/
        //location.reload()
      });
    },
    hasNewId(newValue, oldValue = {}, registerBool) {
      if (registerBool) return false
      // 返回Boolean值
      if (newValue.counts) {
        if (oldValue.counts) {
          const newIdsArr = (newValue.ids || "").split(",");
          const oldIdsArr = (oldValue.ids || "").split(",");
          for (let i = 0; i < newIdsArr.length; i++) {
            if (oldIdsArr.indexOf(newIdsArr[i]) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    registerChangeCount () {// 新会员注册
      const { countArr, oldCountArr } = this
      const cItem = countArr.find(t => t.quickName === '新会员注册')
      const oldItem = oldCountArr.find(t => t.quickName === '新会员注册') || { counts: 0 }
      if (cItem && cItem.counts > oldItem.counts && cItem.open ) {
        return true
      }
      return false
    },
    makeSounds() {
      const { oldCountArr, countArr, hasNewId } = this;
      //催单
      countArr.map(ws=>{
        oldCountArr.map(w=>{
          if(ws.quickName==='催单信息'&&w.quickName==='催单信息'){
            let arr1 = ws.ids
            let arr2 = w.ids
            let arr3 =[], arr4 = []
            if(!arr1)return false;
            if(!arr2&&arr1){
              arr1 = arr1.toString().replace('[','').replace(']','').split('},')
              arr1.map(w1=>{
                if(w1[w1.length-1]!=='}'){
                  w1 = w1+'}'
                  arr3.push(JSON.parse(w1))
                }else{
                  arr3.push(JSON.parse(w1))
                }
              })
              arr4 = []
            }else{
              arr1 = arr1.toString().replace('[','').replace(']','').split('},')
              arr2 = arr2.toString().replace('[','').replace(']','').split('},')
              arr1.map(w1=>{
                if(w1[w1.length-1]!=='}'){
                  w1 = w1+'}'
                  arr3.push(JSON.parse(w1))
                }else{
                  arr3.push(JSON.parse(w1))
                }
              })
              arr2.map(w2=>{
                if(w2[w2.length-1]!=='}'){
                  w2 = w2+'}'
                  arr4.push(JSON.parse(w2))
                }else{
                  arr4.push(JSON.parse(w2))
                }
              })
            }
            if(arr3.length&&arr4.length||arr3.length&&!arr4.length){

              arr3.map(w3=>{
                let has = false,id0 = w3.id
                arr4.map(w4=>{
                  if(w4.id===w3.id){
                    has = true
                  }
                })
                if(!has){
                  this.$notify.closeAll()
                  // 您有新的催单信息：SDY001  支付宝提现  1000.11元。请及时处理
                  arr3.map(w0=>{
                    if(w0.id===id0){
                      this.cuiHTML= this.$t(`您有新的催单信息：{loginName} 提现 {amount} 元，请及时处理。'`, { loginName: w0.loginName, amount: w0.amount })
                    }
                  })
                  this.$notify({
                    title: '',
                    dangerouslyUseHTMLString: true,
                    duration: 5000,
                    // offset: 80,
                    customClass: 'cuiNotify',
                    onClose:()=>{
                      let arrDom = document.getElementsByClassName('goCui')
                      Array.from(arrDom).map(wa=>{
                        wa.removeEventListener('click',()=>{})
                      })
                    },
                    message: `<div><p class="info">${this.cuiHTML}</p><button class="goCui">${this.$t('查看')}</button></div>`
                  });
                  setTimeout(()=>{
                    this.$refs.isCui.play()
                    let arrDom = document.getElementsByClassName('goCui')
                    Array.from(arrDom).map(wa=>{
                      wa.addEventListener('click', ()=>{
                        this.$notify.closeAll()
                        this.$router.push('/main/wageManage/memberWithdraw')
                      },true)
                    })
                  },10)
                }
              })
            }
          }
        })
      })
      if (countArr.length) {
        const arr = [
          {
            hasPermission: this.permissions.isDepositCount,
            refName: "memberPayment",
            time: 7000
          },
          {
            hasPermission: this.permissions.isWithdraw,
            refName: "withdrawFirst",
            time: 7000
          },
          {
            hasPermission: this.permissions.isWithdraw,
            refName: "withdrawReview",
            time: 7000
          },
          {
            hasPermission: this.permissions.isBonusCount,
            refName: "bonusApply",
            time: 7000
          },
          {
            hasPermission: this.hasPermissionForMemberMessage,
            refName: "memberMessage",
            time: 7000
          },
          {
            hasPermission: this.permissions.feedback,
            refName: "feedback",
            time: 7000
          },
          {
            hasPermission: this.permissions.isTransformSheet,
            refName: "isTransformSheet",
            time: 7000
          },
          {
            hasPermission: true,
            refName: "newRegister",
            time: 7000
          },
        ];
        // 依次播放提示
        arr.forEach((item, index) => {
          if (item.hasPermission) {
              const registerBool = item.refName === 'newRegister'
              let isRegisterBool // 会员注册单独校验
              if (registerBool) {
                isRegisterBool = this.registerChangeCount()
              }
             if (hasNewId(countArr[index], oldCountArr[index], registerBool) || isRegisterBool) {
               if(/[会员提款初审|会员入款|优惠申请]/.test(countArr[index].quickName)){
                 if(countArr[index].open){
                   this.soundsQueue = this.soundsQueue.then(() => {
                     return new Promise(resolve => {
                       setTimeout(
                         () => {
                           this.$refs[item.refName].play();
                           resolve();
                         },item.time
                       );
                     });
                   });
                 }
               }else{
                 this.soundsQueue = this.soundsQueue.then(() => {
                   return new Promise(resolve => {
                     setTimeout(
                       () => {
                         this.$refs[item.refName].play();
                         resolve();
                       },item.time
                     );
                   });
                 });
               }
            }
          }
        });
      }
    },
    getCount() {
      this.$axios.get(systemConfig.urls.getCount).then(resp => {
        // resp.data.page.map(item => {
        //   if (item.quickName === "新会员注册") {
        //     item.counts = 1
        //     item.ids = '12978'
        //   }
        // })
        this.oldCountArr = JSON.parse(JSON.stringify(this.countArr));
        this.countArr = resp.data.page;
        this.makeSounds();
      });
    },
    toggle() {
      let toggleFlag = this.isCollapse;
      this.$store.commit("isCollapse", !toggleFlag);
    },
    changeTime(value) {
      // switch (value) {
      //   case "bj":
      //     this.timeZone = this.$t("北京时间");
      //     break;
      //   case "md":
      //     this.timeZone = this.$t("美东时间");
      //     break;
      //   case "yn":
      //     this.timeZone = this.$t("越南时间");
      //     break;
      // }
      if (value === 'yn') {
        this.$store.commit("timeType", value);
        this.$store.commit("timeZone", -1);
      } else {
        this.$store.commit("timeType", value);
        this.$store.commit("timeZone", 0);
      }
      window.location.reload()
    },
    jump(type) {
      switch (type) {
        case "会员入款":
          this.$router.push({
            path: "/main/wageManage/vipPay",
            query: {
              status: 2,
              t: +new Date()
            }
          });
          break;
        case "会员提款初审":
          this.$router.push({
            path: "/main/wageManage/vipPay"
          });
          this.$router.push({
            path: "/main/wageManage/memberWithdraw",
            query: {
              status: 2,
              t: +new Date()
            }
          });
          break;
        case "会员提款复审":
          this.$router.push({
            path: "/main/wageManage/vipPay"
          });
          this.$router.push({
            path: "/main/wageManage/memberWithdraw",
            query: {
              status: 3,
              t: +new Date()
            }
          });
          break;
        case "红利申请":
          this.$router.push({
            path: "/main/marketActivity/bonusList",
            query: {
              status: 2,
              t: +new Date()
            }
          });
          break;
        case "意见反馈":
          this.$router.push({
            path: "/main/operateManage/memberMessage",
            query: {
              status: 2,
              t: +new Date()
            }
          });
          break;
        case "户内转账待处理":
          this.$router.push({
            path: "/main/wageManage/transformSheet",
            query: {
              statusValue: 0,
            }
          });
          break;
        case "预警信息":
          this.$router.push({
            path: "/main/warningList",
            query: {
              statusValue: 0,
            }
          });
          break;
        case "新注册会员提示":
          this.$axios.GET(systemConfig.urls.resetNewMemberCount).then(() => {
            this.$set(this.countArr[8], 'counts', 0)
            this.$router.push({
              path: "/main/memberManage/memberList",  
              query: {
                statusValue: 0,
              }
            });
          })
          break;
      }
    },
    modifyLoginPass() {
      this.$store.commit("passChangeObj", {
        operationTitle: this.$t("请进行登录密码修改"),
        operationFlag: "changeLogin",
        closeVisiable: true,
        visiable: true
      });
      this.$store.commit("changePasswordShow", true);
      this.$store.commit("changePassFlag", "fromHeader");
    },
    modifySafePass() {
      this.$store.commit("passChangeObj", {
        operationTitle: this.$t("请进行安全密码修改"),
        operationFlag: "changeSafe",
        closeVisiable: true,
        visiable: true
      });
      this.$store.commit("changePasswordShow", true);
    }
  },
  components: {
    subHeader,
    TagsView,
    PasswordChange
  }
};
</script>

<style lang="scss">
.header {
  height: 46px;
  line-height: 46px;
  width: calc(100% - 210px);
  margin-left: 210px;
  background: #409EFF;
  position: fixed;
  z-index: 2006;
  top: 0;
  transition: width 1s, margin-left 1s;
}

.icon-nav {
  height: 46px;
  line-height: 46px;
  color: #fff;
  padding: 0 18px;
  font-size: 20px;
  cursor: pointer;
}

.deg {
  transition: transform 1s;
  transform: rotate(-90deg);
}

.fr {
  float: right;
}

.color-fff {
  color: #fff;
}

.border-left {
  padding: 0 5px;
}

.dropdown {
  width: 100px;
  text-align: center;
  cursor: pointer;
}

.icon-book {
  color: #fff;
  font-size: 24px;
}

.el-badge__content.is-fixed {
  right: 26px !important;
  top: 16px !important;
  padding: 0 5px;
  height: 18px;
  line-height: 18px;
}

.amount {
  padding: 0 10px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  text-align: center;
  border: none !important;
  margin-left: 4px;
}

.un_amount {
  background-color: #377e22;
}

.icon-computer {
  font-size: 24px;
  color: #fff;
}

.el-badge__content {
  border: none !important;
}
.head-span {
  height: 46px;
  color: #fff;
  cursor: pointer;
}
.cuiNotify{
  padding-bottom: 0;
  border: 0;
  button{width: 330px;height: 30px;border:0;border-top: 1px solid #ddd;position: relative;left: -26px;
  padding-bottom: 0;padding-top: 0;color: #3f99f7;}
  button:hover{cursor: pointer;}
  p.info{margin: 20px;}
  .el-notification__group{width: 100%;position: relative;}
  .el-notification__closeBtn{top: 0;right: 0;}
}
</style>
