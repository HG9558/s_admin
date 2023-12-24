<template>
	<div>
		<el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="form" :model="formMeta.data" :rules="formMeta.rules">
			<el-form-item
				:key="key"
				:prop="item.prop"
				:label="item.label"
				v-for="(item, key) in formMeta.formTemplateOptions"
				:class="{inline: /^(text|select|number)$/.test(item.type)}"
			>
				<!-- 选择框 -->
				<el-select v-model="formMeta.data[item.prop]" :disabled="item.disabled" :placeholder="$t('请选择')" v-if="item.type === 'select'">
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
				<el-button type="danger" @click="$router.go(-1)">{{ $t('取消') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
export default {
	props: ['formData'],
	data(){
		return {
			formMeta: {
				data: {// 用于表单双向绑定及提交数据
					depotId: null,
					gameName: null,
				},
				formTemplateOptions: [// 用于生成表单
					{
						label: this.$t('游戏平台'),
						prop: 'depotId',
						type: 'select',
						options: []
					},
					{
						label: this.$t('游戏名称'),
						prop: 'gameName',
						type: 'text',
					},
				],
				rules: {
					depotId: [
						{required: true, message: this.$t('请选择一个'), trigger: 'change'},
					],
					gameName: [
						{required: true, message: this.$t('请选择一个')}				
					]
				}
			}
		}
	},
	created(){
		const {formData} = this
		if(formData){
			this.formMeta.data = formData
		}
	},
	methods:{
		handleSubmit(){
			this.$refs.form.validate(result => {
				if(result){
					this.$emit('submit', this.formMeta.data)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
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


