<template>
  <div>
    <h3>{{ $t('其他') }}</h3>
    <el-form-item
      :label="$t('赠送金额')"
      style="width: 30%"
    >
      <el-input v-model="donateAmount" type="number" :placeholder="$t('请输入赠送金额')" @change="inputChange"></el-input>
    </el-form-item>
    <el-form-item
      :label="$t('流水倍数')"
      style="width: 50%"
    >
      <el-input :placeholder="$t('请输入流水倍数')" type="number" v-model="multipleWater" style="width: 30%" @change="inputChange"></el-input>倍
      <span>*{{ $t('0倍代表不做稽核') }}</span>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "OrtherSend",
  props: ['data'],
  data() {
    return {
      donateAmount: '',
      multipleWater: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { donateAmount, multipleWater } = this.data || {}
      this.donateAmount = donateAmount
      this.multipleWater = multipleWater
    },
    inputChange() {
      this.$emit('changeData', {
        key: 'jOtherDto',
        data: { donateAmount: this.donateAmount, multipleWater: this.multipleWater }
      })
    }
  }
}
</script>

<style scoped>

</style>
