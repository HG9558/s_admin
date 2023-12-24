<template>
  <el-form-item :label="$t('会员组')">
    <el-radio v-model="isCheckAll" :label='true'>{{ $t('全选') }}</el-radio>
    <el-radio v-model="isCheckAll" :label='false'>{{ $t('自定义') }}</el-radio>
    <el-checkbox-group v-model="groupIds" @change="updateGroupIds" v-show="!isCheckAll">
      <el-checkbox v-for="item in memberGroupList" :key="item.id" :label="item.id">{{item.groupName}}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import systemConfig from '../../config/config.js'
export default {
  model: {
    prop: 'checkedGroup',
    event: 'change'
  },
  props: {
    checkedGroup: Array,
    isEdit: Boolean
  },
  data() {
    return {
      memberGroupList: [],
      isCheckAll: null,
      groupIds: []
    }
  },
  computed: {
    allGroupIds() {
      return this.memberGroupList.map(item => item.id)
    }
  },
  watch: {
    isCheckAll(value) {
      if (value) {
        this.updateGroupIds(this.allGroupIds)
      } else {
        this.updateGroupIds(this.groupIds)
      }
    },
    checkedGroup(value) {
      if (!this.isCheckAll) {
        this.groupIds = value
      }
    }
  },
  created() {
    this.getMemberGroup().then(() => {
      const {checkedGroup} = this
      if (this.isEdit) {// 编辑
        this.isCheckAll = false
        this.groupIds = checkedGroup || []
      } else {
        this.isCheckAll = true
      }
    })
  },
  methods: {
    updateGroupIds(checkedGroup) {
      this.$emit('change', checkedGroup)
    },
    getMemberGroup() {
      return this.$axios.get(systemConfig.urls.mbrGrouplist).then(res => {
        this.memberGroupList = res.data.page
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__content .el-checkbox-group .el-checkbox {
  margin-left: 0;
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
}
/deep/ .el-form-item__content {
  max-width: 900px;
}
</style>


