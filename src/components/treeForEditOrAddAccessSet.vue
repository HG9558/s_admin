<template>
  <div class="new-change" @click="pushData">
    <div style="min-height: 450px">
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        accordion
        node-key="id"
        :default-checked-keys="alreadyHaveLimit"
        :default-expanded-keys="expandIds"
        :props="defaultProps"
        @check="handleNodeClick"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import systemConfig from "../config/config";

export default {
  name: "ForEditOrAddAccessSet",
  data() {
    return {
      treeList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      alreadyHaveLimit: [],
      expandIds: [],
      parentChild: {},
    };
  },
  /*父组件传值给子组件*/
  props: ["dataList", "editId"],
  created() {
    this.init();
  },
  updated() {
    this.pushData();
  },
  methods: {
    getTreeData(obj) {
      this.menuListFor(obj);
    },
    /* 勾选集合 */
    handleNodeClick(data, obj) {
      const { label, id } = data;
      const { checkedKeys } = obj;
      if (label === this.$t("全部部门")) {
        const parentChilds = this.parentChild[id];
        if (parentChilds) {
          const idChedked = checkedKeys.includes(id);
          parentChilds.map((i) => {
            const _id = i.id;
            if (idChedked && !checkedKeys.includes(_id)) {
              checkedKeys.push(_id);
            }
            if (!idChedked && checkedKeys.includes(_id)) {
              const index = checkedKeys.indexOf(_id);
              if (index > -1) {
                checkedKeys.splice(index, 1);
              }
            }
          });
          this.alreadyHaveLimit = checkedKeys;
          this.$refs.tree.setCheckedKeys(this.alreadyHaveLimit);
        }
      } else {
        let isDeal = false;
        for (let key in this.parentChild) {
          const parentChilds = this.parentChild[key];
          const parentChildsIds = parentChilds.map((i) => i.id);
          if (parentChildsIds.includes(id)) {
            isDeal = true;
          }
          if (isDeal) {
            const obj = parentChilds.find((i) => i.label === this.$t("全部部门"));
            const isChecked = checkedKeys.includes(id);

            if (obj) {
              const { id: _id } = obj;
              const index = checkedKeys.indexOf(_id);
              if (index > -1 && !isChecked) {
                checkedKeys.splice(index, 1);
                this.alreadyHaveLimit = checkedKeys;
                this.$refs.tree.setCheckedKeys(this.alreadyHaveLimit);
              }
            }
            break;
          }
        }
      }
      this.pushData();
    },
    /*初始化*/
    init() {
      this.getMenu();
    },

    /*给父子间把值传过去*/
    pushData() {
      let selectArr = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      if (selectArr.length > 0) {
        selectArr = selectArr.map((val) => {
          return { menuId: val };
        });
      }
      this.$emit("ePushData", selectArr);
    },

    /*获取菜单栏数据*/
    getMenu() {
      this.$axios.get(systemConfig.urls.getTreeNewMenu).then((res) => {
        let arr = res.data.data;
        this.$axios
          .get(systemConfig.urls.getCurRoleLimit, {
            params: {
              roleId: this.editId,
            },
          })
          .then((res) => {
            this.alreadyHaveLimit = res.data.roleMenuAuth;
            // 特殊处理全部部门
            const dealPart = (item, parentId, parent) => {
              const { children, label, id } = item;
              if (label === this.$t("全部部门") && parentId) {
                this.parentChild[id] = parent.children;
              }
              if (children && children.length) {
                item.children = children.map((i) => dealPart(i, id, item));
              }
              return item;
            };
            this.treeList = arr.map((i) => dealPart(i));
          });
      });
    },
  },
  watch: {
    treeList: {
      handler(n, o) {
        if (n.length > 0) {
          this.expandIds.push(n[0].id);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
.ma-left-30 {
  margin-left: 45px;
}

.newThree {
  clear: both;
  width: 27%;
  display: inline-block;
}

.newnew {
  border: 1px solid #e3e3e3;
  float: left;
  /*display: inline-block;*/
  width: 18%;
  text-align: center;
  height: 40px;
  vertical-align: middle;
  line-height: 40px;
  background: #eee;
}

.newnew-s {
  border: 1px solid #e3e3e3;
  float: left;
  /*display: inline-block;*/
  width: 18%;
  text-align: left;
  height: 1000px;
  overflow: auto;
  vertical-align: middle;
  line-height: 40px;
}

.wid-40 {
  width: 24%;
}

.new-cen-body {
  margin-top: 5px;
}

.border-0 {
  border: 0 !important;
}

h6 {
  /*background: #eee;*/
  width: 80px;
  height: 30px;
  font-size: 14px;
  /*line-height: 30px;*/
}

.el-checkbox + .el-checkbox {
  margin-left: 0px !important;
  display: block;
  margin-top: 5px !important;
}

.new-check {
  margin-left: 40px;
}

.new-every {
  text-align: left;
  margin-left: 10px;
}

.new-bor-1-eee {
  border: 1px solid #eee;
}

.he-40 {
  height: 40px;
  line-height: 40px;
}

.new-change {
  width: 70%;
  margin: 0 auto;
}

.new-body {
  /*border: 1px solid #eee;*/
  /*height: auto;*/
  width: 12%;
  min-width: 120px;
  text-align: center;
  /*display: inline-block;*/
  display: block;
  float: left;
}

.te-c {
  text-align: center;
}
</style>
