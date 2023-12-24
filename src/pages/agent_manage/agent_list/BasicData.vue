<template>
  <div>
		<el-form :inline="true" class="form-wrapper" label-position="right" label-suffix=":" ref="form" :model="formMeta.data" :rules="formMeta.rules">
			<el-form-item
				:key="key"
				:prop="item.prop"
				:label="item.label"
				v-for="(item, key) in formMeta.formTemplateOptions"
			>
				<el-input v-model="formMeta.data[item.prop]" :disabled="item.disabled" :type="item.type" :placeholder="$t('请输入') + item.label" v-if="item.enableEdit && isEditPattern"></el-input>
				<span :title="formMeta.data[item.prop]" v-else>
					{{
						item.prop === 'available' ? 
						formMeta.data[item.prop] === 1 ? $t('启用') : $t('禁用') :
						formMeta.data[item.prop] === null ? (item.prop === 'agyTopAccount' ? $t('无') : $t('未填写')) : formMeta.data[item.prop]
					}}
					<GlobalComponentTestLabel :id="formMeta.data.id" :parentId="formMeta.data.parentId" v-if="item.prop === 'agyAccount' || (formMeta.data.agyTopAccount && item.prop === 'agyTopAccount')"/>
				</span>
				<a href="javascript:;" class="balance-detail-btn el-icon-question" @click="isNetProfitBalanceShow = true" v-if="item.prop === 'netProfitBalance'"></a>
			</el-form-item>
		</el-form>
		<el-dialog
			:title="$t('历史净盈利额')"
			:visible.sync="isNetProfitBalanceShow"
			width="30%"
		>
			<el-table max-height="480" :data="netProfitBalanceList" border>
				<el-table-column align="left" prop="agyAccount"	:label="$t('来源')"></el-table-column>
				<el-table-column align="left" prop="amount"	:label="$t('贡献额度')"></el-table-column>
				<el-table-column fixed="right" align="left" :label="$t('操作')">
					<template slot-scope="scope">
						<el-button @click="agyNetProfitReset(scope.row.id)" type="text" size="small">[{{ $t('清零') }}]</el-button>
					</template>
      	</el-table-column>
			</el-table>
			<span slot="footer">
				<el-button @click="isNetProfitBalanceShow = false">{{ $t('关闭') }}</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import systemConfig from '../../../config/config'
export default {
  props: ['isEditPattern', 'id', 'dataNeed'],
  data(){
    return {
			tempFormData: null,
			isNetProfitBalanceShow: false,
			netProfitBalanceList: [],
			formMeta: {
				data: {// 用于表单双向绑定及提交数据
					agyAccount: null,
					balance: null,
					spreadCode: null,
					netProfitBalance: null,
					qq: null,
					grade: null,
					mobile: null,
					available: null,
					realName: null,
					email: null,
					registerUrl: null,
					agyTopAccount: null,
					weChat: null,
					createTime: null,
				},
				formTemplateOptions: [// 用于生成表单
					{
						label: this.$t('代理账号'),
						prop: 'agyAccount',
					},
					{
						label: this.$t('佣金余额'),
						prop: 'balance',
					},
					{
						label: this.$t('代理域名'),
						prop: 'domainUrl',
					},
					{
						label: this.$t('推广码'),
						prop: 'spreadCode',
					},
					{
						label: this.$t('历史净盈利额'),
						prop: 'netProfitBalance',
					},
					{
						label: 'QQ',
						prop: 'qq',
						enableEdit: true
					},
					{
						label: this.$t('等级'),
						prop: 'grade',
					},
					{
						label: this.$t('电话'),
						prop: 'mobile',
						enableEdit: true
					},
					{
						label: this.$t('状态'),
						prop: 'available',
					},
					{
						label: this.$t('真实姓名'),
						prop: 'realName',
						enableEdit: true
					},
					{
						label: 'Email',
						prop: 'email',
						enableEdit: true
					},
					{
						label: this.$t('注册网址'),
						prop: 'registerUrl',
					},
					{
						label: this.$t('上级代理'),
						prop: 'agyTopAccount',
					},
					{
						label: this.$t('微信'),
						prop: 'weChat',
						enableEdit: true
					},
					{
						label: this.$t('注册时间'),
						prop: 'createTime',
					},
				],
				rules: {
					qq: systemConfig.rules.memberInfoRule.qq[1],
					mobile: {pattern: /^1[34578]\d{9}$/, message: '请输入正确格式的11位手机号码', trigger: 'blur'},
					realName: {pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: this.$t('请输入正确的中文名称'), trigger: 'blur'},
					email: systemConfig.rules.memberInfoRule.email,
					weChat: systemConfig.rules.memberInfoRule.wechat,
				}
			}
    }
  },
  watch: {
    isEditPattern(value){
      if(value){
        this.tempFormData = JSON.parse(JSON.stringify(this.formMeta.data))
      }
		},
    dataNeed(newValue,oldValue){
      this.formMeta.data = newValue
    },
		isNetProfitBalanceShow(value){
			if(value){
				this.getNetProfitBalanceList()
			}
		}
  },
  methods: {
		agyNetProfitReset(id){// 历史净盈利额清零
			this.$axios.get('bkapi/agent/account/agyNetProfitReset', {params: {id}})
			.then(res => {
				if(res){
					this.getNetProfitBalanceList()
					this.$emit('refresh')
				}
			})
		},
		getNetProfitBalanceList(){
			this.$axios.get('bkapi/agent/account/agyNetProfitList', {params: {id: this.id}})
			.then(res => {
				this.netProfitBalanceList = res.data.data
			})
		},
		handleCancel(){
			this.$refs.form.clearValidate()
			this.formMeta.data = this.tempFormData
      this.$emit('update:isEditPattern', false)
		},
		handleEditSave(){
			this.$refs.form.validate(result => {
				if(result){
					this.$axios.post('bkapi/agent/account/agyAccountUpdate', this.formMeta.data)
					.then(res => {
						if(res){
              this.$emit('update:isEditPattern', false)
						}
					})
				}
			})
		},
    // getAgentInfo(){
		// 	this.$axios.get('bkapi/agent/account/agyAccountInfo', {params: {id: this.id}})
		// 	.then(res => {
		// 		if(res){
		// 			this.formMeta.data = res.data.data
		// 		}
		// 	})
		// },
  }
}
</script>

<style lang="scss" scoped>
.balance-detail-btn{
	color: #666;
	font-size: 14px;
	position: absolute;
	right: 20px;
	top: 16px;
}
.form-wrapper{
	border: 1px solid lightgray;
	padding: 0;
	.el-form-item{
		width: calc(100% / 3 - 2px);
		margin: 0;
		border-right: 1px solid lightgray;
		&:nth-child(3n){
			border-right: 0
		}
		&:nth-child(4),&:nth-child(5),&:nth-child(6),&:nth-child(10),&:nth-child(11),&:nth-child(12){
			background-color: #f6f6f6;
		}
	}
	.el-input{
		line-height: 30px;
		height: 30px;
		width: 86%;
	}
	/deep/ .el-form-item__label{
		width: 35%;
		line-height: 46px;
		text-align: center;
		padding: 0;
	}
	/deep/ .el-form-item__content{
		box-sizing: border-box;
		width: 65%;
		line-height: 46px;
		.el-form-item__error{
			top: -8px;
		}
	}
}
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


