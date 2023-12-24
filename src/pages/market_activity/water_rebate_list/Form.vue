<template>
	<el-dialog :visible="formVisible" :title="isBatchAudit? $t('批量审核') : $t('审核')" @close="handleClose">
		<el-form class="form-wrapper" label-position="right" label-width="120px" label-suffix=":" ref="form" :model="formModel" :rules="rules">
			<template v-if="!isBatchAudit">
				<el-form-item :label="$t('会员')" prop="loginName">
					<el-input v-model="formModel.loginName" :placeholder="$t('请输入会员')" disabled></el-input>
				</el-form-item>
				<el-form-item :label="$t('所属代理')" prop="agyAccount">
					<el-input v-model="formModel.agyAccount" :placeholder="$t('请输入所属代理')" disabled></el-input>
				</el-form-item>
				<el-form-item :label="$t('活动等级')" prop="tierName">
					<el-input v-model="formModel.tierName" :placeholder="$t('请输入活动等级')" disabled></el-input>
				</el-form-item>
				<el-form-item :label="$t('总返水')" prop="totalAmount">
					<el-input v-model="formModel.totalAmount" :placeholder="$t('请输入总返水')" disabled></el-input>
				</el-form-item>
			</template>
			<el-form-item :label="$t('状态')" prop="status">
        <el-radio-group v-model="formModel.status">
          <el-radio :label="1">{{ $t('通过') }}</el-radio>
          <el-radio :label="0">{{ $t('拒绝') }}</el-radio>
        </el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('备注')" prop="memo">
				<el-input type="textarea" rows="5" v-model="formModel.memo" :placeholder="$t('请输入备注')"></el-input>
			</el-form-item>
		</el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
	</el-dialog>
</template>

<script>
export default {
	props: ['formVisible', 'info', 'isBatchAudit'],
	data(){
		return {
			formModel: {
        loginName: null,
        agyAccount: null,
        tmplName: null,
        totalAmount: null,
        status: null,
        memo: null
			},
			rules: {
				status: [
					{required: true, message: this.$t('请选择状态'), trigger: 'change'},
				]
      }
		}
	},
  created() {
		if (!this.isBatchAudit) {
			this.initFormModel()
		}
  },
	methods:{
    initFormModel() {
      const formModel = JSON.parse(JSON.stringify(this.info))
      this.formModel = {
				...formModel,
				status: null
			}
    },
		handleSubmit(){
			this.$refs.form.validate(valid => {
				if(valid){
					this.$emit('submit', this.formModel)
				}
			})
    },
    handleClose() {
      this.$emit('update:formVisible', false)
    }
	}
}
</script>