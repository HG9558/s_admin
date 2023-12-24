<template>
  <div class="nav" :class="{ navShrink: isCollapse }">
    <el-row class="tac">
      <i class="nav-logo baoying-icon" v-if="isBaoying"></i>
      <i class="nav-logo" :style="{ backgroundImage: `url(${img})` }" v-else-if="img"></i>
      <el-col :span="24">
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="true" :default-active="indexActive" :collapse="isCollapse">
          <el-menu-item index="1" @click.native="jump('/main/managePandect', '1')" v-if="treeHaveManage">
            <!--  管理总览特殊处理 -->
            <i class="iconfont icon-managePandect"></i>
            <span slot="title">{{ $t('管理总览') }}</span>
          </el-menu-item>
          <el-submenu v-for="(each, one) in tree" :index="String(each.orderNum)" :key="each.name" :id="each.orderNum" v-show="each.name !== $t('管理总览')">
            <template slot="title">
              <i :class="each.icon"></i>
              <span>{{ each.name }}</span>
            </template>
            <span v-for="(child, two) in each.children" :key="child.name">
              <el-menu-item v-if="child.type === 1 && !child.delete" :index="'' + one + '-' + two" :key="child.name" :id="'' + one + '-' + two" @click.native="jump(child.url, '' + one + '-' + two)" :title="child.name" class="ellipsis">{{ child.name }}
              </el-menu-item>
              <el-submenu v-if="child.type === 0" :index="'' + one + '-' + two" :key="child.menuId" :id="'' + one + '-' + two">
                <template slot="title">
                  <i :class="child.icon"></i>
                  <span :title="child.name" class="ellipsis">{{ child.name }}</span>
                </template>
                <span v-if="child.type === 1 && !child.delete">
                  <el-menu-item v-for="(grandson, three) in child.children" :index="'' + one + '-' + two + '-' + three" :key="grandson.orderNum" :id="'' + one + '-' + two + '-' + three" @click.native="
                  jump(grandson.url, '' + one + '-' + two + '-' + three)" :title="grandson.name" class="ellipsis">
                    {{ grandson.name }}
                  </el-menu-item>
                </span>
                <span v-for="(grandson, three) in child.children" :key="grandson.name">
                  <el-menu-item v-if="grandson.type === 1 && !grandson.delete" :index="'' + one + '-' + two + '-' + three" :key="grandson.orderNum" :id="'' + one + '-' + two + '-' + three" @click.native="
                  jump(grandson.url, '' + one + '-' + two + '-' + three)" :title="grandson.name" class="ellipsis">
                    {{ grandson.name }}
                  </el-menu-item>
                </span>
              </el-submenu>
            </span>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import systemConfig from "../config/config.js";
import { mapGetters } from "vuex";

const icon = require('../assets/img/baoying-title-icon.png')

export default {
  data() {
    return {
      str: "8-3-1",
      tree: [],
      each: [],
      child: [],
      sysSetObj: {},
      titleIcon: icon,
    };
  },
  mounted() {
    this.getPermission().then(() => {
      this.initeMenuTree();
      this.getImgSrc();
    });
  },
  watch: {
    tree(n, o) {
      this.$store.commit("treeData", n);
    }
  },
  computed: {
    indexActive() {
      return this.$store.state.indexActive;
    },
    isCollapse() {
      return this.$store.state.isCollapse;
    },
    img() {
      return this.$store.state.logoPath;
    },
    isBaoying() {
      return location.origin.includes('gbet388.com')
    },
    ...mapGetters(["hasPermission"]),
    includeManage() {
      this.hasPermission("menu:totalview:view");
    },
    treeHaveManage() {
      if (!this.tree.length) return false;
      if (this.tree[0].navPerms === "menu:totalview:view") {
        return true;
      }
      return false;
    }
  },
  methods: {
    getPermission() {
      return this.$axios.get("bkapi/sys/menu/nav").then((res) => {
        if (res) {
          const bool = this.$route.path === "/main";
          if (bool) {
            const treeIsHaveManagePandect = res.data.permissions.includes(
              "menu:totalview:view"
            );
            if (treeIsHaveManagePandect) {
              this.jump("/main/managePandect", "1",);
            } else {
              this.jump("/main/welcomePage", "-1",);
            }
          }
          this.$store.commit("setPermissions", res.data.permissions);
        }
      })
    },
    initeMenuTree() {
      this.$axios.get("bkapi/sys/menu/saasopsTree").then((resp) => {
        let menuList = JSON.parse(JSON.stringify(resp.data.menuList));
        let arr = this.checkOutTree(menuList);
        this.tree = arr.filter(
          (item) =>
            item.children.length > 0 || item.navPerms === "menu:totalview:view"
        );
        window.localStorage.setItem("treeData", JSON.stringify(this.tree));
      });
    },
    checkOutTree(menuList) {
      menuList.map((val, index) => {
        if (!val.type && val.children.length) {
          this.checkOutTree(val.children);
        } else if (
          val.type == 1 ||
          (!val.type && val.navPerms === "menu:totalview:view")
        ) {
          // type 为0 ，navPerms 为menu:totalview:view -- 管理总览的特殊处理
          if (!val.navPerms) {
            menuList[index]["delete"] = true;
          } else {
            let arr = val.navPerms.split(","),
              bool = false;
            arr.map((item) => {
              if (this.hasPermission(item)) {
                bool = true;
              }
            });
            if (!bool) {
              menuList[index]["delete"] = true;
            }
          }
        }
      });

      // debugger
      menuList = menuList.filter((item) => item["delete"] != 1);
      return menuList;
    },
    getImgSrc() {
      this.$axios.get(systemConfig.urls.queryStationSet).then((res) => {
        this.sysSetObj = res.data.data;
        this.$store.commit("logoPath", this.sysSetObj.logoPath);
        this.changeFavicon(this.isBaoying ? this.titleIcon : this.sysSetObj.titlePath)
      });
    },
    changeFavicon(src) {
      var link = document.createElement("link");
      var oldLink = document.getElementById("dynamic-favicon");
      link.id = "dynamic-favicon";
      link.rel = "shortcut icon";
      link.href = src;
      if (oldLink) {
        document.getElementsByTagName("head")[0].removeChild(oldLink);
      }
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    jump(route, indexActive) {
      // this.$router.push(route)
      if (route === "/main/gameManage/gameList") {
        this.$router.push({ path: route, query: { elcType: 1, catId: 1 } });
        return;
      }
      if (route === "main/agentManage/materialsManage") {
        route = "/main/agentManage/materialsManage"
      }
      this.$router.push({ path: route });
      this.$store.commit("indexActive", indexActive);
    },
  },
};
</script>

<style lang="scss">
.nav {
  height: 100%;
  width: 210px;
  position: absolute;
  background: #2b303e;
  padding-bottom: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  z-index: 9;
  transition: width 1s;
  .tac {
    background: #2b303e;
    .nav-logo {
      display: block;
      transition: width 1s;
      width: 210px;
      height: 60px;
      background: no-repeat center center;
      background-size: 80%;
    }
    .baoying-icon {
      background-image: url('../assets/img/baoying-header-icon.png');
    }
    .el-menu {
      background: none;
      border: none;
      .is-active {
        color: #447ed9;
      }
      li {
        color: #989dac;
      }
    }
    .ellipsis {
      display: block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      color: #989dac;
      span {
        color: #989dac;
        font-size: 14px;
      }
    }
    // .el-submenu__title {
    //   width: 90px;
    // }
    .el-menu-vertical-demo > li {
      padding-left: 14px !important;
      > .el-submenu__title {
        padding: 0 !important;
      }
    }
    .el-submenu__title:hover {
      background: none;
      border: none;
      .iconfont,
      span {
        color: #447ed9;
      }
    }
    .el-menu-item:hover,
    .el-menu-item:focus {
      background: #232633;
      color: #447ed9;
    }
    .iconfont {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      color: #878d99;
    }
  }
}

/*针对小界面*/
@media screen and (min-height: 500px) {
  .nav {
    position: fixed;
    left: 0;
    overflow: visible;
  }
}

.navShrink {
  width: 48px !important;
  .tac {
    .nav-logo {
      width: 48px !important;
    }
  }
  .el-menu-vertical-demo {
    .el-submenu ul {
      background: #fff;
      li:hover {
        background: #e6f0fa;
      }
    }
  }
}

.el-tooltip {
  padding: 0 14px !important;
}
</style>
