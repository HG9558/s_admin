<template>
  <div class="main" :class="{ shrink: isCollapse }" ref="main">
    <my-nav></my-nav>
    <my-header></my-header>
    <div
      class="mainPages"
      :style="{ padding: pad + 'px' }"
      :include="cachedViews"
    >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="keyValue"></router-view>
      </keep-alive>
      <router-view ref="routerView" v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <my-footer></my-footer>
    <reset-pass></reset-pass>
    <safe-pass></safe-pass>
  </div>
</template>

<script type="text/ecmascript-6">
import MyNav from '../components/Nav.vue'
import MyHeader from '../components/Header.vue'
import MyFooter from '../components/Footer.vue'
import resetPass from '../components/ResetPassword'
import safePass from '../components/SafePasswordInput'
export default {
  components: {
    MyNav,
    MyHeader,
    MyFooter,
    resetPass,
    safePass
  },
  data() {
    return {
      routerViewKey: null,
    }
  },
  watch: {
    '$route.path'(value) {
      let {$children} = this;
      let _children = $children.filter(child => child.$options.name);
      // vueComponent 容器
      let obj = {};
      _children.map(child => {
        if (!obj[child.$options.name]) {
          obj[child.$options.name] = [child]
        } else {
          obj[child.$options.name].push(child);
        }
      })
      // 销毁旧的keepAlive子组件
      for (let k in obj) {
        if (obj[k].length && obj[k].length > 1) {
          obj[k].sort((vueComp1, vueComp2) => vueComp1.$vnode.key - vueComp2.$vnode.key)
                .forEach((child, i) => {
                  if (!i) child.$destroy();
                })
        }
      }
    }
  },
  /* created() {
    this.$axios.get('bkapi/sys/menu/nav')
    .then(res => {
      if (res) {
        this.$store.commit('setPermissions', res.data.permissions)
      }
    })
  }, */
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
    cachedViews () {
      return this.$store.state.cachedViews
    },
    pad () {
      return 15
      /* if (this.$store.state.indexActive) {
        return this.$store.state.indexActive !== '1' && this.$store.state.indexActive !== 's'? 30: 0
      } else {
        return 0
      } */
    },
    keyValue() {
      return this.$store.state.compKeyValue[this.$route.path];
    }
  }
}
</script>

<style lang="scss">
@import "../../static/css/style";
.main {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  .mainPages {
    margin: 78px 0 100px 210px;
    transition: width 1s, margin-left 1s;
    display: inline-block;
    width: calc(100% - 240px);
  }
  @media screen and (max-width: 1366px) {
    .mainPages {
      margin-left: 210px;
      width: calc(100% - 210px);
    }
    .header,
    .footer {
      width: calc(100% - 210px);
      margin-left: 210px;
    }
  }
  //  @media screen and (max-width: 1300px){
  //    .el-table__body-wrapper{
  //     overflow: auto;
  //   }
  //  }
  // @media screen and (min-width: 1301px){
  //   .el-table__body-wrapper{
  //     overflow: hidden;
  //   }
  // }
}
.shrink {
  .mainPages {
    margin-left: 48px;
    width: calc(100% - 88px);
  }
  .header,
  .footer {
    width: calc(100% - 48px);
    margin-left: 48px;
  }
}
@media screen and (max-width: 1366px) {
  .ui-fix {
    .width180 {
      width: 160px !important;
      input {
        width: 150px !important;
      }
    }
  }

  .ui-fix {
    .width220 {
      width: 200px !important;
      input {
        width: 180px !important;
      }
    }
  }
}
@media screen and (max-width: 1440px) {
  .ui-fix {
    .width180 {
      width: 160px !important;
      input {
        width: 160px !important;
      }
    }
  }
}
@media screen and (min-width: 1660px) {
  .ui-fix2 {
    .width180 {
      width: 120px !important;
      input {
        width: 120px !important;
      }
    }
  }
}
@media screen and (min-width: 1660px) and (max-width: 1830px) {
  .ui-fix2 {
    .div-search-btn {
      bottom: 2px !important;
    }
  }
}
@media screen and (min-width: 1699px) and (max-width: 1870px) {
  .ui-fix3 {
    .div-search-btn {
      bottom: 2px !important;
    }
  }
}
</style>
