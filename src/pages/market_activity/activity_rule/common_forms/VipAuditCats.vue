<template>
  <div> 
    <div class="flow-range-item" :key="item.catId" v-for="item in rangeGroup">
      <div class="flow-range-item_cat">
        <!-- 判断是否全选 是否全选点击 -->
        <el-checkbox
          :value="item.platforms.length === item.depots[layerIndex][item.catId].length"
          @change="handleCheckAll(item.catId)"
          >{{ item.catName }}</el-checkbox>
      </div >
        <el-checkbox-group
        v-model="item.depots[layerIndex][item.catId]"
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
  props: ["auditCats", 'layerIndex', 'rangeGroup'],
  data() {
    return {
    //   rangeGroup: this.formData.rangeGroup,
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
  methods: {
    handleCheckAll(catId) {
      const { auditCatsObserver } = this;
      const formItem = this.rangeGroup.find(item => item.catId === catId)
      const { depots, platforms} = formItem
      const isCheckedAll = platforms.length === depots[this.layerIndex][catId].length
      if (isCheckedAll) {
        depots[this.layerIndex][catId] = [];
      } else {
        depots[this.layerIndex][catId] = platforms.map(item => item.depotId)
      }
      this.handleDepotsChange(catId)
    },
    handleDepotsChange(catId) {
      const { auditCatsObserver } = this;
      const formItem = this.rangeGroup.find(item => item.catId === catId);
      const { depots, platforms } = formItem;
      const category = auditCatsObserver.find(item => item.catId === catId);
      const depotIdArr = depots[this.layerIndex][catId] || []
      let depotsInObject = depots[this.layerIndex][catId].map(item => {
          return {
              depotId: item
          }
      })
      if (category) {
        category.depots = depotsInObject
      } else {
        if (!depotsInObject.length) return
        auditCatsObserver.push({
          catId,
          depots: depotsInObject
        });
      }
      this.auditCatsObserver = auditCatsObserver
    }
  }
}
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
