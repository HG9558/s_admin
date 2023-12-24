<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <el-popover
        ref="tag"
        :data-to="tag.path"
        popper-class="tags-view-popper"
        class="tags-view-item"
        :class="isActiveClass(tag) ? 'active2' : ''"
        placement="bottom-start"
        width="130"
        trigger="hover"
        v-for="(tag, index) in Array.from(visitedViews)"
        :key="index"
      >
        <el-button
          class="tags-view-operate"
          type="text"
          size="mini"
          @click="handleClose(tag, index)"
          >{{ $t('关闭其他页') }}</el-button
        >
        <el-button
          class="tags-view-operate"
          type="text"
          size="mini"
          style="margin: 0;"
          @click="openNewPage(tag)"
          >{{ $t('新窗口打开') }}</el-button
        >
        <a
          class="tags-view-btn"
          href="javascript:;"
          @click="handleClick(tag, tag.path)"
          slot="reference"
        >
          <template v-if="tag.path=== '/main/managePandect'">
            {{ $t('管理总览') }}
          </template>
          <template v-else>{{ $t(tag.title) }}</template>
          <!-- <span class='el-icon-close' v-show="isActive(tag)" @click.prevent.stop='closeSelectedTag(tag)'></span> -->
          <span
            class="el-icon-close"
            v-show="tag.path !== '/main/managePandect'"
            @click.prevent.stop="closeSelectedTag(tag, index)"
          ></span>
        </a>
      </el-popover>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import { saveQueryStore } from "../mixins/queryStore";

export default {
  components: { ScrollPane },
  data() {
    return {
      top: 0,
      left: 0,
      selectedTag: {},
      arr: [],
      // 是否关闭其他窗口
      isLot: false
    };
  },
  mounted() {
    this.addViewTags();
  },
  computed: {
    visitedViews() {
      return this.$store.state.visitedViews;
    },
    len() {
      return this.visitedViews && this.visitedViews.length;
    }
  },
  watch: {
    $route: {
      // this.addViewTags()
      // this.moveToCurrentTag()
      handler() {
        this.addViewTags();
        this.moveToCurrentTag();
      },
      immediate: true
    },
    /**
     * 监听visitedViews数组变化
     * 当只有管理总览时 state.indexActive commit
     * 防止左侧菜单高亮为最后关闭的visitedViews
     */
    // len() {
    //   if (this.len === 1) {
    //     this.$store.commit("indexActive", '1');
    //   }
    // }
  },
  methods: {
    openNewPage(tag) {
      let str = "";
      let index = 0;
      for (let i in tag.query) {
        str += (index ? "&" : "?") + i + "=" + tag.query[i];
        index++;
      }
      saveQueryStore();
      window.open("#" + tag.path + str);
    },
    handleClose(tag, index) {
      this.isLot = !this.isLot;
      const visitedViews = JSON.parse(JSON.stringify(this.visitedViews));
      for (let item of visitedViews) {
        if (tag.path !== item.path) {
          this.closeSelectedTag(item, index);
        }
      }
    },
    handleClick(obj, path) {
      if (path === "/main/gameManage/gameList") {
        this.$router.push({
          path,
          query: {
            useQueryStoreCache: "yes",
            elcType: obj.query.elcType,
            catId: obj.query.catId
          }
        });
        return;
      }
      this.$router.push({
        path,
        query: {
          useQueryStoreCache: "yes"
        }
      });
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      if (route.path=== '/main/managePandect') {
        return false;
      } else {
        return (
          route.path === this.$route.path || route.name === this.$route.name
        );
      }
    },
    isActiveClass(route) {
      return route.path === this.$route.path || route.name === this.$route.name;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      // this.$set(route, 'title', route.meta.title)
      this.$store.dispatch("addVisitedViews", route);
    },
    moveToCurrentTag() {
      this.$nextTick(() => {
        const tags = this.$refs.tag;
        for (const tag of tags) {
          const el = tag.$el;
          if (el.getAttribute("data-to") === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view, index) {
      if (view.path=== '/main/managePandect') {
        return;
      }
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.path);
          } else {
            this.$router.push("/");
          }
        } else {
          // 顶部导航栏页面标签 ，打开过多情况下，使用【关闭其他页】功能后，顶部导航栏标签全部不可见，请修复
          if (this.isLot) {
            this.$refs.scrollPane.left = 0;
            this.isLot = !this.isLot;
          }
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-operate {
  display: block;
  width: 100%;
  text-align: left;
  text-indent: 12px;
  &:hover {
    background-color: #f5f7fa;
  }
}
.tags-view-container {
  position: absolute;
  left: 0;
  top: 46px;
  width: 100%;

  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    //box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      border-bottom: none;
      border-right: none;
      background: #fff;
      padding: 0 20px;
      font-size: 12px;
      // margin-left: 5px;
      margin-top: 5px;
      .tags-view-btn {
        color: #323232;
      }
      &:first-of-type {
        margin-left: 30px;
        border-top-left-radius: 4px;
      }
      &:last-of-type {
        border-right: 1px solid #d8dce5;
        border-top-right-radius: 4px;
      }
      &.active2 .tags-view-btn {
        // background-color: #42b983;
        color: #409eff;
        // border-color: #42b983;
        // &::before {
        //   content: '';
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      font-size: 16px;
      vertical-align: -3px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: 2px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
