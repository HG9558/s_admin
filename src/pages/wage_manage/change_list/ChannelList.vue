<template>
  <div class="channel-list">
    <div class="type-select">
      <el-radio-group v-model="renderCom">
        <el-radio-button label="List">{{ $t('渠道列表') }}</el-radio-button>
        <el-radio-button label="Manage">{{ $t('渠道管理') }}</el-radio-button>
      </el-radio-group>
    </div>
    <component :is="renderCom"></component>
  </div>
</template>

<script>
import List from './List'
import Manage from './Manage'
export default {
  name: "ChannelList",
  components: {
    List,
    Manage
  },
  data() {
    return {
      renderCom: 'List',
    }
  }
}
</script>

<style scoped lang="scss">
.channel-list {
  .type-select {
    margin-bottom: 15px;
  }
}
</style>
