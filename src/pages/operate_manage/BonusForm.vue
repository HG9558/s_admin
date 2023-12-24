<template>
	<el-dialog :visible="formVisible" :title="$t('新增红利')" :close-on-click-modal="false" @close="handleClose">
		<el-form class="form-wrapper" label-position="right" label-width="120px" label-suffix=":" ref="form" :model="formModel" :rules="rules">
			<el-form-item :label="$t('会员名')" prop="loginName">
				<el-input v-model="formModel.loginName" :placeholder="$t('请输入会员名')" @input="validateLoginName"></el-input>
			</el-form-item>
			<el-form-item :label="$t('优惠类型')" prop="actTmplId">
        <el-select v-model="formModel.actTmplId" :placeholder="$t('请选择优惠类型')" @change="formModel.activityId = null" :disabled="!isLoginNameValid">
          <el-option :label="item.tmplName" :value="item.id" v-for="item in categories" :key="item.id"></el-option>
        </el-select>
			</el-form-item>
			<el-form-item :label="$t('优惠名称')" prop="activityId">
        <el-select
					:placeholder="$t('请选择优惠名称')"
					v-model="formModel.activityId"
					@change="formModel.depositedAmount && getDiscountAudit()"
					:disabled="!isLoginNameValid || !formModel.actTmplId"
				>
          <el-option :label="item.activityName" :value="item.activityId" v-for="item in activities" :key="item.activityId"></el-option>
        </el-select>
			</el-form-item>
			<el-form-item :label="$t('存款金额')" prop="depositedAmount">
				<el-input
					type="number"
					:placeholder="$t('请输入存款金额')"
					:disabled="!isLoginNameValid || depositedAmountDisabled"
					v-model.number="formModel.depositedAmount"
					@input="getDiscountAudit"
				>
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('赠送金额')" prop="bonusAmount">
				<el-input
					type="number"
					:disabled="!isOutOfRange"
					:placeholder="$t('请输入赠送金额')"
					v-model.number="formModel.bonusAmount"
				>
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('稽核倍数')" prop="discountAudit">
				<el-input
					type="number"
					:disabled="!isOutOfRange"
					:placeholder="$t('请输入稽核倍数')"
					v-model.number="formModel.discountAudit"
				>
					<span style="margin-right: 10px;" slot="suffix">{{ $t('倍') }}</span>
				</el-input>
			</el-form-item>
		</el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
	</el-dialog>
</template>

<script>
import systemConfig from '../../config/config.js'

export default {
	props: ['formVisible', 'infoForEdit'],
	data(){
		return {
			formModel: {
        loginName: null,
        actTmplId: null,
        activityId: null,
        depositedAmount: null,
        bonusAmount: null,
        discountAudit: null
			},
			rules: {
				loginName: [
					{required: true, message: this.$t('不能为空'), trigger: 'blur'},
				],
				actTmplId: [
					{required: true, message: this.$t('请选择一个选项'), trigger: 'change'},
				],
				activityId: [
					{required: true, message: this.$t('请选择一个选项'), trigger: 'change'},
				],
				depositedAmount: [
					{required: true, message: this.$t(this.$t('不能为空')), trigger: 'blur'},
					{type: 'number', min: 0, message: this.$t(this.$t('应该大于或等于0')), trigger: 'blur'},
				],
				bonusAmount: [
					{required: true, message: this.$t('不能为空'), trigger: 'blur'},
					{type: 'number', min: 0, message: this.$t('应该大于或等于0'), trigger: 'blur'},
				],
				discountAudit: [
					{required: true, message: this.$t('不能为空'), trigger: 'blur'},
					{type: 'number', min: 0, message: this.$t('应该大于或等于0'), trigger: 'blur'},
				],
			},
			loginNameTimer: null,
			depositedAmountTimer: null,
			categories: [],
			isLoginNameValid: false,
			isOutOfRange: false// 超出计算范围 需自己设置赠送金额和流水要求
		}
	},
	computed: {
		activities() {
			const { actTmplId } = this.formModel
			if (actTmplId) {
				return this.categories.find(item => item.id === actTmplId).actActivities
			} else {
				return []
			}
		},
		depositedAmountDisabled() {
			const { loginName, actTmplId, activityId } = this.formModel
			return !(loginName && actTmplId && activityId)
		}
	},
	created() {
		this.getCategories()
	},
	methods:{
		validateLoginName() {
			window.clearTimeout(this.loginNameTimer)
			this.loginNameTimer = window.setTimeout(() => {
				this.isLoginNameValid = false
				this.$axios.get(systemConfig.urls.memberCheck, {
					params: this.formModel
				})
				.then(res => {
					const { depositedAmount } = this.formModel
					if (res.data.msg) {// 数据库有该用户名
						this.$message.success(this.$t('用户名校验成功'))
						this.isLoginNameValid = true
						if (depositedAmount) {
							this.getDiscountAudit()
						}
					} else {
						this.$message.error(this.$t('不存在该用户名'))
						if (depositedAmount) {
							this.formModel.bonusAmount = null
							this.formModel.discountAudit = null
						}
					}
				})
			}, 300)
		},
		getDiscountAudit() {
			window.clearTimeout(this.depositedAmountTimer)
			const { depositedAmount } = this.formModel
			if (depositedAmount || depositedAmount === 0) {
				this.depositedAmountTimer = window.setTimeout(() => {
					this.isOutOfRange = false
					this.$axios.get(systemConfig.urls.bonusListForm.getDiscountAudit, {
						params: this.formModel
					})
					.then(res => {
						if (depositedAmount === this.formModel.depositedAmount) {// 如果查询参数跟现在input的值一致
							const { bonusAmount, discountAudit } = res.data
							if (bonusAmount !== null && discountAudit !== null) {
								this.formModel.bonusAmount = bonusAmount
								this.formModel.discountAudit = discountAudit
							} else {
								this.formModel.bonusAmount = null
								this.formModel.discountAudit = null
								this.isOutOfRange = true
							}
						}
					})
				}, 300)
			} else {
				this.formModel.bonusAmount = null
				this.formModel.discountAudit = null
				this.isOutOfRange = false
			}
		},
		getCategories() {
			this.$axios.get(systemConfig.urls.bonusListForm.catsAndActs)
			.then(res => {
				this.categories = res.data.data
			})
		},
		handleSubmit(){
			this.$refs.form.validate(valid => {
				if(valid){
					this.$emit('formSubmit', this.formModel)
				}
			})
    },
    handleClose() {
      this.$emit('update:formVisible', false)
    }
	}
}
</script>