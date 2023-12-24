<template>
	<div>
		<el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="form" :model="formMeta.data" :rules="formMeta.rules">
			<el-form-item
				:key="key"
				:prop="item.prop"
				:label="item.label"
				v-for="(item, key) in formMeta.formTemplateOptions"
			>
				<!-- 选择框 -->
				<el-select v-model="formMeta.data[item.prop]" :disabled="item.disabled" :placeholder="$t('请选择')" v-if="item.type === 'select'">
					<el-option :label="option.label" :value="option.value" v-for="(option, index) in item.options" :key="index"></el-option>
				</el-select>
				<!-- 文本框(string) -->
				<el-input v-model="formMeta.data[item.prop]" :disabled="item.disabled" :type="item.type" :placeholder="$t('请输入') + item.label" v-if="/^(text|password)$/.test(item.type)"></el-input>
				<!-- 文本框(number) -->
				<el-input v-model.number="formMeta.data[item.prop]" :disabled="item.disabled" :type="item.type" :placeholder="$t('请输入') + item.label" v-if="item.type === 'number'"></el-input>
				<!-- 多选组 -->
				<template  v-if="item.type === 'checkbox-group'">
					<el-checkbox :label="option.value" v-model="formMeta.data[option.value]" :true-label="1" :false-label="0" v-for="(option, index) in item.options" :key="index">{{option.label}}</el-checkbox>
				</template>
				<!-- 单选组 -->
				<el-radio-group v-model="formMeta.data[item.prop]" v-if="item.type === 'radio-group'">
					<el-radio :label="option.value" v-for="(option, index) in item.options" :key="index">{{option.label}}</el-radio>
				</el-radio-group>
				<!-- 文本域 -->
				<el-input v-model="formMeta.data[item.prop]" :type="item.type" :placeholder="$t('请输入') + item.label" :rows="5" v-if="item.type === 'textarea'"></el-input>
			</el-form-item>
			<div class="btns">
				<el-button type="danger" @click="handleReject">{{ $t('拒绝') }}</el-button>
				<el-button type="primary" @click="handleSubmit">{{ $t('通过') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
export default {
	props: ['id'],
	data(){
		return {
			formMeta: {
				data: {// 用于表单双向绑定及提交数据
					agyAccount: null,
					parentId: 0,
					grade: null,
					spreadCode: null,
					realName: null,
					mobile: null,
					memo: null
				},
				formTemplateOptions: [// 用于生成表单
					{
						disabled: true,
						label: this.$t('代理账号'),
						prop: 'agyAccount',
						type: 'text',
					},
					{
						disabled: true,
						label: this.$t('上级代理'),
						prop: 'parentId',
						type: 'select',
						options: []
					},
					{
						disabled: true,
						label: this.$t('等级'),
						prop: 'grade',
						type: 'text',
					},
					{
						label: this.$t('推广码'),
						prop: 'spreadCode',
						type: 'text',
					},
					{
						disabled: true,
						label: this.$t('真实姓名'),
						prop: 'realName',
						type: 'text',
					},
					{
						disabled: true,
						label: this.$t('手机号码'),
						prop: 'mobile',
						type: 'text',
					},
					{
						label: this.$t('备注'),
						prop: 'memo',
						type: 'textarea',
					},
				],
				rules: {
					agyAccount: [
						{required: true, message: this.$t('不能为空')},
					],
					grade: [
						{required: true, message: this.$t('不能为空')},
					],
					spreadCode: [
						{required: true, message: this.$t('不能为空')},
						{pattern: /[0-9a-zA-Z]+/, message: this.$t('请输入字母、数字或组合')},
					],
					memo: [
						{required: true, message: this.$t('不能为空')},
					],
					parentId: [
						{required: true, message: this.$t('请选择一个'), trigger: 'change'}				
					]
				}
			}
		}
	},
	created(){
		this.getAgentInfo()
		this.getAgentList()
	},
	methods:{
		getAgentInfo(){
			this.$axios.get('bkapi/agent/account/agyAccountAuditInfo',{params: {id: this.id}})
			.then(res => {
				if(res){
					this.formMeta.data = res.data.data
					this.formMeta.data.parentId = res.data.data.parentId || 0
				}
			})
		},
		getAgentList(){
			this.$axios.get('bkapi/agent/account/agentList', {params: {agyAccount: ''}})
			.then(res => {
				if(res){
					const optionList =  res.data.data.map(item => {
						return {
							label: item.agyAccount,
							value: item.id
						}
					})
					this.formMeta.formTemplateOptions[1].options = optionList
					!this.parentId && optionList.unshift({label: this.$t('无'), value: 0})
				}
			})
		},
		handleSubmit(){
			this.formMeta.data.status = 1
			this.$refs.form.validate(result => {
				if(result){
					this.$emit('submit', this.formMeta.data)
				}
			})
		},
		handleReject(){
			this.formMeta.data.status = 0
			this.$refs.form.validate(result => {
				if(result){
					this.$emit('submit', this.formMeta.data)
				}
			})
		},
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


