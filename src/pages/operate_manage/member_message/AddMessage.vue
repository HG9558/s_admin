<template>
  <el-dialog class="add_message-dialog" :title="$t('新建对话')" :close-on-click-modal="false" :visible="visible" @close="handleClose">
    <el-form class="form-wrapper" label-position="right" label-width="100px" label-suffix=":" ref="form">
			<el-form-item
				:label="$t('对话类型')"
			>
				<el-radio-group v-model="messageType">
					<el-radio :label="0">{{ $t('系统推送') }}</el-radio>
					<el-radio :label="1">{{ $t('私信') }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
        v-if="messageType === 0"
				:label="$t('接收人群')"
			>
				<el-radio-group v-model="receiverType">
					<el-radio :label="0">{{ $t('所有会员') }}</el-radio>
					<el-radio :label="1">{{ $t('按代理') }}</el-radio>
					<el-radio :label="2">{{ $t('按会员组') }}</el-radio>
				</el-radio-group>
        <!-- 选择代理 -->
        <el-checkbox-group v-show="messageType === 0 && receiverType === 1" v-model="formFields.agyList">
          <el-checkbox :label="item.id" v-for="item in allAgentList" :key="item.id">{{item.agyAccount}}</el-checkbox>
        </el-checkbox-group>
        <!-- 选择会员组 -->
        <el-checkbox-group v-show="messageType === 0 && receiverType === 2" v-model="formFields.groupList">
          <el-checkbox :label="item.id" v-for="item in allMemberGroupList" :key="item.id">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
			</el-form-item>
			<el-form-item
        v-else
				:label="$t('接收会员')"
			>
        <el-radio-group v-model="personMessageType">
          <el-radio :label="0">{{ $t('所有会员') }}</el-radio>
				  <el-radio :label="1">{{ $t('指定会员') }}</el-radio>
				  <el-radio :label="2">{{ $t('会员组') }}</el-radio>
        </el-radio-group>
        <!-- 指定会员 -->
        <el-input v-show="personMessageType === 1" v-model="formFields.loginNameList" v-trim :placeholder="$t('请输入会员名,多个会员之间以逗号分隔')"></el-input>
        <!-- 选择会员组 -->
        <el-checkbox-group v-show="messageType != 0 && personMessageType === 2" v-model="formFields.groupList">
          <el-checkbox :label="item.id" v-for="item in allMemberGroupList" :key="item.id">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
			<el-form-item
				:label="$t('对话内容')"
        class="my-editor"
			>

        <TinyEditor v-model="formFields.textContent" :toolbar="'image'"/>

			</el-form-item>
		</el-form>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('取消') }}</el-button>
      <el-button @click="sendMessage" type="primary">{{ $t('发送') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import systemConfig from '../../../config/config'

import TinyEditor from '../../../components/TinyEditor'

export default {
  components: {  TinyEditor },
  props: ['visible', 'filterAndCompressImage'],
  data() {
    return {
      messageType: 0,
      receiverType: 0,
      personMessageType:1,
      formFields: {
        agyList: [],
        groupList: [],
        textContent: null,
        loginNameList: null,
      },
      allAgentList: [],
      allMemberGroupList: []
    }
  },
  created() {
    this.getAllAgentList()
    this.getAllMemberGroupList()
  },
  methods: {
    sendMessage() {
      const formData = new FormData()
      const { messageType, receiverType, formFields ,personMessageType } = this
      const { textContent } = formFields
      if (!textContent) {
        this.$message.warning(this.$t('请输入消息'))
        return
      }
      if (messageType) {
        // 私信
        formData.append('isSign', 1)
        const { loginNameList, groupList } = formFields
        switch(personMessageType) {
          case 1:
            if (loginNameList) {
              formData.append('loginNameList', loginNameList.replace(/，/g, ',').split(','))
            } else {
              this.$message.warning(this.$t('请输入会员名'))
              return
            }
            break
          case 2:
            if (!groupList.length) {
              this.$message.warning(this.$t('请至少选择一个代理'))
              return
            }
            formData.append('groupList', groupList)
            break
        }
      } else {
        // 系统推送
        formData.append('isSign', 2)
        const { agyList, groupList } = formFields
        switch(receiverType) {
          case 1:
            if (!agyList.length) {
              this.$message.warning(this.$t('请至少选择一个代理'))
              return
            }
            formData.append('agyList', agyList)
            break
          case 2:
            if (!groupList.length) {
              this.$message.warning(this.$t('请至少选择一个代理'))
              return
            }
            formData.append('groupList', groupList)
            break
        }
      }
      formData.append('textContent', textContent)
      this.$emit('sendMessage', formData)
    },
    uploadImage(file) {
      const formData = new FormData()
      formData.append('uploadFile', file)
      return this.$axios.post(systemConfig.urls.uploadImage, formData)
      .then(res => {
        return res.data.path
      })
    },
    getAllMemberGroupList() {
      this.$axios.get(systemConfig.urls.mbrGrouplist)
      .then(res => {
        this.allMemberGroupList = res.data.page
      })
    },
    getAllAgentList() {
      this.$axios.get(systemConfig.urls.getAgentList, {
        params: {
          pageNo: 1,
          pageSize: 99999,
          orderBy: 'createTime desc'
        }
      })
      .then(res => {
        this.allAgentList = res.data.page.list
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  },
  watch:{
    messageType(val){
      this.formFields= {
        agyList: [],
        groupList: [],
        textContent: null,
        loginNameList: null,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-editor.el-form-item--small {
  /deep/ .el-form-item__content {
    line-height: 24px;
  }
}
.form-wrapper {
  .el-checkbox-group .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
    &.last-of-type {
      margin-right: 0;
    }
  }
}
</style>
