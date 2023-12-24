<template>
  <div>
    <el-form class="small-space" label-position="right" label-width="150px">
      <from-wrapper>
        <el-form-item :label="$t('真实姓名')">
          <el-input  :disabled="onlyRead" v-model="mbrAccount.realName" :placeholder="$t('真实姓名')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('联系电话')">
          <el-input  :disabled="onlyRead" v-model="mbrAccount.mobile" :placeholder="$t('联系电话')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('邮箱')">
          <el-input  :disabled="onlyRead" v-model="mbrAccount.email" :placeholder="$t('邮箱')"></el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input  :disabled="onlyRead" type="number" v-model.number="mbrAccount.qq" placeholder="QQ"></el-input>
        </el-form-item>
        <el-form-item :label="$t('微信')">
          <el-input  :disabled="onlyRead" v-model="mbrAccount.weChat" :placeholder="$t('微信')"></el-input>
        </el-form-item>
      </from-wrapper>
    </el-form>
  </div>
</template>
<script>
  import FromWrapper from '../../components/FromWrapper.vue'
  export default {
    components: {FromWrapper},
    props: {
      onlyRead: '',
      id: ''
    },
    data () {
      return {
        mbrAccount: {}
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      getInfo () {
        this.$axios.get('/member/mbraccount/info/' + this.id).then((res) => {
          this.mbrAccount = res.data.mbrAccount
        })
      }
    }
  }
</script>
<style>
</style>
