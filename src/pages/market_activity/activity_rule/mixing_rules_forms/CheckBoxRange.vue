<template>
  <div>
    <el-form-item
      :label="label"
    >
      <div v-for="(item, i) in rangeGroup" :key="i" class="check-font">
        <el-checkbox v-model="item.isCheckedAll" :indeterminate="item.isIndeterminate" @change="handleCheckAllChange(item, i)" style="font-weight: bold">{{item.catName}}</el-checkbox>
        <el-checkbox-group v-model="item.depots" @change="handleCheckedCitiesChange(item, i)">
          <el-checkbox v-for="(plat, _i) in item.platforms" :label="plat.depotId" :key="_i">{{plat.depotName}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "CheckBoxRange",
  props: ['label', 'auditCats'],
  inject: ['formData'],
  data() {
    return {
      rangeGroup: JSON.parse(JSON.stringify(this.formData.rangeGroup)),
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.auditCats.map(i => {
        const { catId, depots } = i
        const arr = depots ? depots.map(i => i.depotId) : []
        let inx
        const obj = this.rangeGroup.find((i, index) => {
          inx = index
          return i.catId === catId
        })
        if (obj) {
          obj.depots = arr
          this.rangeGroup.splice(inx, 1, obj)
          this.handleCheckedCitiesChange(obj, inx)
        }
      })
    },
    updateProp() {
      const arr = this.rangeGroup.filter(i => i.isCheckedAll || i.isIndeterminate).map(i => {
        const { catId, depots } = i
        return { catId, depots: depots.map(i => ({ depotId: i })) }
      })
      this.$emit('update:auditCats', arr)
    },
    handleCheckAllChange(item, i) {
      const { isCheckedAll, platforms } = item
      const depots = isCheckedAll ? platforms.map(i => i.depotId) : []
      const isIndeterminate = false
      this.rangeGroup.splice(i, 1, { ...item, depots, isIndeterminate })
      this.updateProp()
    },
    handleCheckedCitiesChange(item, i) {
      const { platforms, depots } = this.rangeGroup[i]
      const len = depots.length
      const platLen = platforms.length
      const isIndeterminate = len > 0 && len < platLen
      this.rangeGroup.splice(i, 1, { ...item, isIndeterminate, isCheckedAll: len === platLen })
      this.updateProp()
    }
  }
}
</script>

<style lang="scss" scoped>
.check-font {
  font-size: 12px;
}
</style>
