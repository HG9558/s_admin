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
				<el-select v-model="formMeta.data[item.prop]" @change="handleSelect(item.prop, $event)" :disabled="item.disabled" :placeholder="$t('请选择')" v-if="item.type === 'select'">
					<el-option :label="option.label" :value="option.value" v-for="(option, index) in item.options" :key="index"></el-option>
				</el-select>
				<!-- 文本框(string) -->
				<el-input v-model="formMeta.data[item.prop]" :disabled="item.disabled" :type="item.type" :placeholder="$t('请输入') + item.label" :rows="5" v-if="/^(text|password|textarea)$/.test(item.type)"></el-input>
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
			</el-form-item>
			<div class="btns">
				<el-button type="primary" @click="handleSubmit">{{ $t('确认') }}</el-button>
				<!-- <el-button type="danger" @click="$router.go(-1)">取消</el-button> -->
			</div>
		</el-form>
	</div>
</template>

<script>
export default {
	props: ['formData', 'visible', 'agyAccount'],
	data(){
		return {
			formMeta: {
				data: {// 用于表单双向绑定及提交数据
					agyAccount: null,
					bankCardId: null,
					bankName: null,
					province: null,
					city: null,
					address: null,
					realName: null,
					cardNo: null,
					available: 1,
				},
				formTemplateOptions: [// 用于生成表单
					{
						disabled: true,
						label: this.$t('代理账号'),
						prop: 'agyAccount',
						type: 'text',
					},
					{
						label: this.$t('开户银行'),
						prop: 'bankCardId',
						type: 'select',
						options: []
					},
					{
						label: this.$t('开户支行省份'),
						prop: 'province',
						type: 'select',
						options: []
					},
					{
						label: this.$t('开户支行市区'),
						prop: 'city',
						type: 'select',
						options: []
					},
					{
						label: this.$t('支行名称'),
						prop: 'address',
						type: 'text',
					},
					{
						label: this.$t('开户姓名'),
						prop: 'realName',
						type: 'text',
					},
					{
						label: this.$t('银行卡号'),
						prop: 'cardNo',
						type: 'text',
					},
					{
						label: this.$t('状态'),
						prop: 'available',
						type: 'radio-group',
						options: [
							{
								label: this.$t('开启'),
								value: 1
							},
							{
								label: this.$t('禁用'),
								value: 0
							},
						]
					},
				],
				rules: {
					agyAccount: [
						{required: true, message: this.$t('不能为空')}				
					],
					bankCardId: [
						{required: true, message: this.$t('请选择一个'), trigger: 'change'},
					],
					province: [
						{required: true, message: this.$t('请选择一个'), trigger: 'change'},
					],
					city: [
						{required: true, message: this.$t('请选择一个'), trigger: 'change'},
					],
					address: [
						{required: true, message: this.$t('不能为空'), trigger: 'blur'},		
						{pattern: /^[\u4e00-\u9fa5]+$/, message: this.$t('请输入正确的中文名称'), trigger: 'blur'}
					],
					realName: [
						{required: true, message: this.$t('不能为空')},
						{pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: this.$t('请输入正确的姓名'), trigger: 'blur'}
					],
					cardNo: [
						{required: true, message: this.$t('不能为空')},		
						{pattern: /^[^0]\d{15,18}$/, message: this.$t('请输入正确的银行卡号'), trigger: 'blur'}
					],
				}
			}
		}
	},
	computed: {

	},
	created(){
		if(this.formData){
			this.formMeta.data = this.formData
		}
		this.formMeta.data.agyAccount = this.agyAccount
		this.getBankList()
		this.getProvinceList()
	},
	methods:{
		handleSelect(prop, event){
			switch(prop){
				case 'province':
					this.getCityList(event)
					this.formMeta.data.city = null
					break
				case 'bankCardId':
					this.formMeta.data.bankName = this.formMeta.formTemplateOptions[1].options.find(item => item.value === event).label
					break
			}
		},
		getBankList(){
			this.$axios.post('bkapi/base/baseBank/list')
			.then(res => {
				this.formMeta.formTemplateOptions[1].options = res.data.banks.map(item => {
					return {
						label: item.bankName,
						value: item.id
					}
				})
			})
		},
		getProvinceList(){
			this.$axios.post('bkapi/base/baseArea/listProv')
			.then(res => {
				this.formMeta.formTemplateOptions[2].options = res.data.provs.map(item => {
					return {
						label: item.prov,
						value: item.prov
					}
				})
			})
		},
		getCityList(prov){
			this.$axios.post('bkapi/base/baseArea/listCity', {prov})
			.then(res => {
				this.formMeta.formTemplateOptions[3].options = res.data.citys.map(item => {
					return {
						label: item.city,
						value: item.city
					}
				})
			})
		},
		handleSubmit(){
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


