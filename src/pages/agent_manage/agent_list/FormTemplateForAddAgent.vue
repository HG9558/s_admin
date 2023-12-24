<template>
	<div>
		<el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="form" :model="formModel" :rules="rules">
			<input type="text" style="width: 0; height: 0;border: none;padding: 0;">
      <input type="password" style="width: 0; height: 0;border: none;padding: 0;">
			<el-form-item :label="$t('用户名')" prop="agyAccount">
				<el-input :disabled="!isAdd" v-model="formModel.agyAccount" :placeholder="$t('请输入用户名')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('密码')" prop="agyPwd" v-if="isAdd">
				<el-input type="password" v-model="formModel.agyPwd" :placeholder="$t('请输入密码')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('上级代理')" prop="parentId" v-if="isAdd">
				<el-select :disabled="isAdd && !!parentId" v-model="formModel.parentId" :placeholder="$t('请选择上级代理')" filterable>
					<el-option v-for="item in agentList" :label="item.agyAccount" :value="item.id" :key="item.id">
						{{item.agyAccount}}
						<GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('真实姓名')" prop="realName">
				<el-input v-model="formModel.realName" :placeholder="$t('请输入真实姓名')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('手机号码')" prop="mobile">
				<el-input v-model="formModel.mobile" :placeholder="$t('请输入手机号码')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('备注')" prop="memo">
				<el-input type="textarea" :rows="5" v-model="formModel.memo" :placeholder="$t('请输入备注')"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import systemConfig from '../../../config/config'

export default {
	props: ['parentId', 'infoForEdit'],
	data(){
		return {
			formModel: {
				agyAccount: null,
				agyPwd: null,
				parentId: null,
				realName: null,
				mobile: null,
				memo: null,
				rebateRatio:null
			},
			agentList: [],
			rules: {
				agyAccount: [
					{required: true, message: this.$t('不能为空')},
					{pattern: /^[0-9a-zA-Z]{6,10}$/, message: this.$t('请输入6~10位数字、字母，或数字与字母组合'), trigger: 'blur'},
				],
				agyPwd: [
					{required: true, message: this.$t('不能为空')},
					{pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/, message: this.$t('请输入6-18位数字与字母的组合，不能是纯数字或字母'), trigger: 'blur'},
					{
						validator: (rule, value, callback) => {
							if(value === this.formModel.agyAccount){
								callback(new Error(this.$t('账号密码不能相同')))
							}else{
								callback()
							}
						}
					}
				],
				realName: systemConfig.rules.memberInfoRule.name,
				/* [
					systemConfig.rules.commonRule.realNameContainEnglishName[1]
					// {pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入正确的中文名称', trigger: 'blur'},
				], */
				mobile: [
					{pattern: /^1[34578]\d{9}$/, message: this.$t('请输入正确格式的11位手机号码'), trigger: 'blur'},
				],
				memo: [
					{required: true, message: this.$t('不能为空')},
					{type: 'string', max: 45, message: this.$t('备注最长不能超过45个字符')}
				],
				//rebateRatio:systemConfig.rules.rebateRatioReg
			}
		}
	},
	computed: {
		isAdd() {
			return !this.infoForEdit.id
		}
	},
	created(){
		if(this.isAdd && this.parentId){// 新增子代理
			this.formModel.parentId = this.parentId
		} else {// 编辑代理
			this.formModel = this.infoForEdit
		}
		this.getAgentList()
		// this.getDomainList()
	},
	methods:{
		handleSubmit(){
			this.$refs.form.validate(result => {
				if(result){
					const params = JSON.parse(JSON.stringify(this.formModel))
					params.parentId = params.parentId || 0
					this.$emit('submit', params)
				}
			})
		},
		// getDomainList() {
		// 	this.$axios.get('bkapi/agent/account/queryAllDomains')
		// 	.then(res => {
		// 		this.domainList = res.data.list
		// 	})
		// },
		getAgentList(){
			this.$axios.get('bkapi/agent/account/agentList', {
				params: {
					agyAccount: '',
					parentId: this.parentId ? null : 0
				}
			})
			.then(res => {
				this.agentList = res.data.data
			})
		}
	}
}
</script>

<style scoped>
.inline{
	display: inline-block;
	width: 450px;
}
.btns{
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding-top: 20px;
}
</style>


