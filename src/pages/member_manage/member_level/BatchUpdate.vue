<template>
	<el-dialog :visible="formVisible" :label="$t('批量调级')" :close-on-click-modal="false" @close="handleClose">
		<el-form class="form-wrapper" label-position="right" label-width="120px" label-suffix=":" ref="form" :model="formModel" :rules="rules">
			<el-form-item v-if="lockedSelections.length > 0" :label="$t('更新方式')">
        <p style="color: #E6A23C;">*{{ $t('会员') }}{{lockedSelections.map(item => item.loginName).join(',')}}{{ $t('等级已锁定') }}</p>
        <el-radio-group v-model="formModel.forceUpdate">
          <el-radio :label="1">{{ $t('强制更新等级') }}</el-radio>
          <el-radio :label="0">{{ $t('仅更新未锁定会员') }}</el-radio>
        </el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('调整至')" prop="newLevelId">
        <el-select v-model="formModel.newLevelId" clearable>
          <el-option
            :key="item.id"
            :value="item.id"
            :label="item.tierName"
            :disabled="!item.available"
            v-for="item in memberLevelList"
          >
          </el-option>
        </el-select>
			</el-form-item>

      <el-form-item :label="$t('备注')">
        <el-input
          v-model="formModel.memo"
          :rows="5"
          type="textarea"
        ></el-input>
			</el-form-item>
		</el-form>
    <template slot="footer">
      <el-button size="small" type="primary" @click="handleSubmit">{{ $t('保存') }}</el-button>
      <el-button size="small" @click="handleClose">{{ $t('取消') }}</el-button>
    </template>
	</el-dialog>
</template>

<script>
import systemConfig from '../../../config/config'

export default {
	props: ['formVisible', 'memberLevelList', 'selections'],
	data(){
		return {
			formModel: {
        forceUpdate: 0,
        newLevelId: null,
        memo: null,
			},
			rules: {
        newLevelId: { required: true, message: this.$t('请选择等级'), trigger: 'change' },
      },
		}
	},
	computed: {
    lockedSelections() { // 被锁定星级了的会员
      return this.selections.filter(item => item.isActivityLock === 1)
    },
  },
	methods:{
		handleSubmit(){
			this.$refs.form.validate(valid => {
				if(valid){
					this.$emit('submit', {
            ...this.formModel,
            accountIds: this.selections.map(item => item.id)
          })
				}
			})
    },
    handleClose() {
      this.$emit('update:formVisible', false)
    }
	}
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  .member-level-old_level_ids {
    .el-checkbox {
      margin-left: 0;
      margin-right: 30px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .member-level-account_ids {
    /deep/ .el-select__tags {
      width: 150% !important;
      max-width: 270px !important;
    }
    /deep/ .el-input {
      width: 150%;
    }
  }
  /deep/ .el-select__tags span {
    white-space: normal;
    overflow-x: visible;
  }
}
</style>
