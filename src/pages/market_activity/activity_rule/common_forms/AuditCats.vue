<template>
  <div>
    <div class="flow-range-item" :key="item.catId" v-for="item in rangeGroup">
      <div class="flow-range-item_cat">
        <el-checkbox
          :value="item.isCheckedAll"
          @change="handleCheckAll(item.catId)"
          >{{ item.catName }}</el-checkbox
        >
      </div>
      <el-checkbox-group
        v-model="item.depots"
        @change="handleDepotsChange(item.catId)"
      >
        <el-checkbox
          :key="platform.depotId"
          :label="platform.depotId"
          v-for="platform in item.platforms"
        >
          {{ platform.depotName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import systemConfig from "../../../../config/config.js";

export default {
  model: {
    prop: "auditCats",
    event: "change"
  },
  inject: ["formData"],
  props: ["auditCats"],
  data() {
    return {
      rangeGroup: this.formData.rangeGroup
    };
  },
  computed: {
    auditCatsObserver: {
      get() {
        return JSON.parse(JSON.stringify(this.auditCats));
      },
      set(value) {
        this.$emit("change", value);
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    handleCheckAll(catId) {
      const formItem = this.rangeGroup.find(item => item.catId === catId);
      const { isCheckedAll, platforms } = formItem;
      if (isCheckedAll) {
        formItem.depots = [];
      } else {
        formItem.depots = platforms.map(item => item.depotId);
      }
      this.handleDepotsChange(catId);
    },
    handleDepotsChange(catId) {
      const { auditCatsObserver } = this;
      const formItem = this.rangeGroup.find(item => item.catId === catId);
      const { depots, platforms } = formItem;
      const category = auditCatsObserver.find(item => item.catId === catId);
      const depotsInObject = depots.map(depotId => {
        return {
          depotId
        };
      });
      if (category) {
        category.depots = depotsInObject;
      } else {
        auditCatsObserver.push({
          catId,
          depots: depotsInObject
        });
      }
      // 触发set函数
      this.auditCatsObserver = auditCatsObserver;
      // 判断是否全选
      formItem.isCheckedAll = platforms.length <= depots.length;
    },
    init() {
      /* console.log("this.rangeGroup", this.rangeGroup);
      console.log("this.auditCats", this.auditCats); */
      this.rangeGroup.forEach(range => {
        const { catId } = range;
        const cat = this.auditCats.find(item => item.catId === catId);
        if (!cat) {
          return;
        }
        const depots = cat.depots.map(item => item.depotId);
        const arr = [];
        range.platforms.map(platCat => {
          if (depots.includes(platCat.depotId)) {
            arr.push(platCat.depotId);
          }
        });
        range.depots = arr || [];
        this.handleDepotsChange(catId);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.flow-range-item {
  margin-bottom: 10px;
  .flow-range-item_cat .el-checkbox {
    color: #333;
    font-weight: bold;
  }
  .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}

</style>
