<template>
	<el-dialog
		:title="$t('审核')"
		:visible.sync="isDialogShow"
		width="50%"
		top="8vh"
	>
		<el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="form" :model="formMeta.data" :rules="formMeta.rules">
			<el-form-item
				:key="key"
				:prop="item.prop"
				:label="item.label"
				v-for="(item, key) in formMeta.formTemplateOptions"
			>
				<!-- 提款信息 -->
				<ul class="withdrawInfo" v-if="item.label === $t('提款信息')">
					<li>
						<span class="label">{{ $t('开户姓名') }}</span>
						<span class="value">{{formMeta.data.agyBankcard.realName}}</span>
					</li>
					<li>
						<span class="label">{{ $t('开户账号') }}</span>
						<span class="value">{{formMeta.data.agyBankcard.cardNo}}</span>
					</li>
					<li>
						<span class="label">{{ $t('收款银行') }}</span>
						<span class="value">{{formMeta.data.agyBankcard.bankName}}</span>
					</li>
					<li>
						<span class="label">{{ $t('开户支行') }}</span>
						<span class="value">{{formMeta.data.agyBankcard.address}}</span>
					</li>
				</ul>
				<!-- 状态 -->
				<span v-else-if="item.prop === 'status'">{{{0: $t('拒绝'), 1: $t('通过'), 2: $t('初审'), 3: $t('复审')}[formMeta.data.status]}}</span>
				<!-- 所属代理 -->
				<span v-else-if="item.prop === 'agyAccount'">
					{{formMeta.data.agyAccount}}
					<el-button @click="checkList(formMeta.data.agyAccount)" type="text" size="small">{{ $t('查看所有订单') }}</el-button>
				</span>
				<!-- 文本框(string) -->
				<el-input v-model="formMeta.data[item.prop]" :disabled="true" :type="item.type" :placeholder="$t('请输入') + item.label" :rows="5" v-else></el-input>
			</el-form-item>
			<div class="btns" v-if="/^2|3$/.test(formMeta.data.status)">
				<el-button type="primary" @click="handleSubmit(formMeta.data.status === 2 ? 3 : 1)">{{ $t('通过') }}</el-button>
				<el-button type="danger" @click="handleSubmit(0)">{{ $t('拒绝') }}</el-button>
			</div>
		</el-form>
	</el-dialog>
</template>

<script>
export default {
	props: ['id', 'isAuditShow'],
	data(){
		return {
			isDialogShow: true,
			formMeta: {
				data: {// 用于表单双向绑定及提交数据
					orderNo: null,
					agyAccount: null,
					agyBankcard: {},
					drawingAmount: null,
					handlingCharge: null,
					actualArrival: null,
					withdrawCount: null,
					status: null,
					memo: null,
				},
				formTemplateOptions: [// 用于生成表单
					{
						label: this.$t('订单号'),
						prop: 'orderNo',
						type: 'text',
					},
					{
						label: this.$t('所属代理'),
						prop: 'agyAccount',
						type: 'text',
					},
					{
						label: this.$t('提款信息'),
					},
					{
						label: this.$t('提款金额'),
						prop: 'drawingAmount',
						type: 'text',
					},
					{
						label: this.$t('转账手续费'),
						prop: 'handlingCharge',
						type: 'text',
					},
					{
						label: this.$t('实际出款'),
						prop: 'actualArrival',
						type: 'text',
					},
					{
						label: this.$t('提款次数'),
						prop: 'withdrawCount',
						type: 'text',
					},
					{
						label: this.$t('当前状态'),
						prop: 'status',
						type: 'text',
					},
					{
						label: this.$t('备注'),
						prop: 'memo',
						type: 'textarea',
					}
				],
				rules: {
					
				}
			}
		}
	},
	watch: {
		isDialogShow(value){
			this.$emit('update:isAuditShow', value)
		}
	},
	created(){
		this.getFormData()
	},
	methods:{
		checkList(agyAccount){
			this.$emit('update:isAuditShow', false)
			this.$emit('checkList', agyAccount)
		},
		getFormData(){
			this.$axios.get('bkapi/agent/withdraw/withdrawInfo', {
				params: {
					id: this.id
				}
			})
			.then(res => {
				this.formMeta.data = res.data.data
			})
		},
		handleSubmit(status){
			const urls = {
				2: 'bkapi/agent/withdraw/withdrawFirstTrial',// 初审
				3: 'bkapi/agent/withdraw/withdrawRecheck',// 复审
			}
			this.$refs.form.validate(result => {
				if(result){
					this.$axios.get(urls[this.formMeta.data.status], {
						params: {
							id: this.formMeta.data.id,
							status
						}
					})
					.then(res => {
						if(res){
							this.$emit('update:isAuditShow', false)
						}
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.withdrawInfo{
	border: 1px solid #666;
	li{
		overflow: hidden;
	}
	span{
		border: 1px solid #666;
		box-sizing: border-box;
		text-align: center;
	}
	.label{
		float: left;
		width: 40%;
	}
	.value{
		width: 60%;
		float: right;
		min-height: 34px;
	}
}
.title{
	font-size: 20px;
	font-weight: bold;
	margin: 30px 0;
	text-indent: 10px;
	border-bottom: 1px solid #eee;
	padding-bottom: 10px;
}
.form-wrapper{
	width: 94%;
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


