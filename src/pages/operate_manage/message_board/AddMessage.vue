<template>
  <!-- 会员留言之新建对话弹窗 -->
  <el-dialog class="add_message-dialog" :title="$t('新建对话')" :close-on-click-modal="false" :visible="visible" @close="handleClose">
    <el-form class="form-wrapper" label-position="right" label-width="200px" label-suffix=":" ref="form">
      <el-form-item :label="$t('对话类型')">
        <el-radio-group v-model="messageType">
          <el-radio :label="0">{{ $t('系统推送') }}</el-radio>
          <el-radio :label="1">{{ $t('私信') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('是否给会员进行推送')" v-if="!!messageType">
        <el-radio-group v-model="isPush">
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="messageType === 0" :label="$t('接收人群')">
        <el-radio-group v-model="receiverType">
          <el-radio :label="0">{{ $t('所有会员') }}</el-radio>
          <el-radio :label="1">{{ $t('按代理') }}</el-radio>
          <el-radio :label="2">{{ $t('按会员组') }}</el-radio>
        </el-radio-group>
        <!-- 选择代理 -->
        <div class="select-agent" v-show="messageType === 0 && receiverType === 1" >
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="select-all">{{ $t('全选') }}</el-checkbox>
          <el-checkbox-group v-model="formFields.agyList" @change="handleCheckedAgyListChange">
            <el-checkbox :label="item.id" v-for="item in allAgentList" :key="item.id">{{item.agyAccount}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 选择会员组 -->
        <el-checkbox-group v-show="messageType === 0 && receiverType === 2" v-model="formFields.groupList">
          <el-checkbox :label="item.id" v-for="item in allMemberGroupList" :key="item.id">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-else :label="$t('接收会员')">
        <el-radio-group v-model="personMessageType">
          <el-radio :label="0">{{ $t('所有会员') }}</el-radio>
          <el-radio :label="1">{{ $t('指定会员') }}</el-radio>
          <el-radio :label="2">{{ $t('会员组') }}</el-radio>
          <el-radio :label="3" v-show="!!isPush">{{ $t('所有设备') }}</el-radio>
        </el-radio-group>
        <!-- 指定会员 -->
        <el-input v-show="personMessageType === 1" v-model="formFields.loginNameList" v-trim :placeholder="$t('请输入会员名,多个会员之间以逗号分隔')"></el-input>
        <!-- 选择会员组 -->
        <el-checkbox-group v-show="messageType != 0 && personMessageType === 2" v-model="formFields.groupList">
          <el-checkbox :label="item.id" v-for="item in allMemberGroupList" :key="item.id">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('7天自动清除')" v-if="!!messageType">
       <el-radio-group v-model="isAutomaticDelete">
         <el-radio :label="1" :disabled="isPush === 1">{{ $t('是') }}</el-radio>
         <el-radio :label="0" :disabled="isPush === 1">{{ $t('否') }}</el-radio>
       </el-radio-group>
      </el-form-item>
      <!--安卓极光推送保存时间-->
      <el-form-item :label="$t('安卓极光推送保存时间')" v-if="!!isPush">
        <el-input type="number" min="0" max="240" v-model="timeToLive" :placeholder="$t('推送保存时间为0-240')" @input="valid_negative"></el-input>&nbsp;&nbsp;{{ $t('小时') }}
        <span>&nbsp;&nbsp;&nbsp;{{ $t('为0时则只给在线玩家进行推送') }}</span>
      </el-form-item>
      <!--对话内容保存时间-->
      <el-form-item :label="$t('对话内容删除时间')" v-if="!!isPush">
        <el-date-picker
          v-model="expirationTime"
          type="date"
          :placeholder="$t('非必填项')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('推送标题')" v-if="!!isPush">
        <el-input v-model="pushTitle" :placeholder="$t('推送标题最多为30个字')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('推送内容')" v-if="!!isPush">
        <el-input v-model="pushContent" :placeholder="$t('推送内容最多为40个字')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('对话内容')" class="my-editor">
        <TinyEditor v-model="formFields.textContent" :toolbar="curToolBar" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('取消') }}</el-button>
      <el-button @click="sendMessage" type="primary">{{ $t('发送') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import systemConfig from "../../../config/config";

import TinyEditor from "../../../components/TinyEditor";
import moment from "moment";

export default {
  components: { TinyEditor },
  props: ["visible", "filterAndCompressImage"],
  data() {
    return {
      timeToLive:"",
      expirationTime:"",
      messageType: 0,
      receiverType: 0,
      personMessageType: 1,
      isPush: 0,
      pushTitle: null,
      pushContent: null,
      formFields: {
        agyList: [],
        groupList: [],
        textContent: null,
        loginNameList: null,
      },
      allAgentList: [],
      allMemberGroupList: [],
      checkAll: false,
      isIndeterminate: false,
      isAutomaticDelete: 0,
    };
  },
  created() {
    this.getAllAgentList();
    this.getAllMemberGroupList();
  },
  methods: {
    valid_negative(v){
      if(v<0){
        this.timeToLive=0
      }
      if(v>240){
        this.timeToLive=240
      }
      if(String(v).indexOf(".")>-1){
        let i = String(v).indexOf(".")
        this.timeToLive = this.timeToLive.slice(0,i)
      }
    },
    sendMessage() {
      let formData = new FormData();
      const {
        messageType,
        receiverType,
        formFields,
        personMessageType,
        isPush,
        pushTitle,
        pushContent,
        timeToLive,
        expirationTime,
        isAutomaticDelete
      } = this;
      const { textContent } = formFields;
      if (isPush && timeToLive==="") {
        this.$message.warning(this.$t("请输入安卓极光推送保存时间"));
        return;
      }
      if (!textContent) {
        this.$message.warning(this.$t("请输入消息"));
        return;
      }
      if (messageType) {
        // 私信
        formData.append("isSign", 1);
        const { loginNameList, groupList } = formFields;
        let device = 0,
          bool;
        switch (personMessageType) {
          case 1:
            device = 2;
            if (loginNameList) {
              formData.append(
                "loginNameList",
                loginNameList.replace(/，/g, ",").split(",")
              );
            } else {
              this.$message.warning(this.$t("请输入会员名"));
              return;
            }
            break;
          case 2:
            device = 2;
            if (!groupList.length) {
              this.$message.warning(this.$t("请至少选择一个代理"));
              return;
            }
            formData.append("groupList", groupList);
            break;
          case 3:
            device = 1;
            break;
        }
        if (!!isPush) {
          bool = this.validText();
          if (bool) return;
          formData.append("isPush", isPush);
          formData.append("pushTitle", pushTitle);
          formData.append("pushContent", pushContent);
          formData.append("timeToLive", timeToLive);
          formData.append("expirationTime", moment(expirationTime).format("YYYY-MM-DD HH:mm:ss"));
        }
        formData.append("isAllDevice", device);
        formData.append("isAutomaticDelete", isAutomaticDelete);
      } else {
        // 系统推送
        formData.append("isSign", 2);
        const { agyList, groupList } = formFields;
        switch (receiverType) {
          case 1:
            if (!agyList.length) {
              this.$message.warning(this.$t("请至少选择一个代理"));
              return;
            }
            formData.append("agyList", agyList);
            break;
          case 2:
            if (!groupList.length) {
              this.$message.warning(this.$t("请至少选择一个代理"));
              return;
            }
            formData.append("groupList", groupList);
            break;
        }
      }
      formData.append("textContent", textContent);
      this.$emit("sendMessage", formData);
    },
    validText() {
      const { pushContent, pushTitle } = this;
      const bool = this.checkout(pushTitle, this.$t("推送标题"), 30);
      if (!bool) {
        return true;
      }
      const contentBool = this.checkout(pushContent, this.$t("推送内容"), 40);
      if (!contentBool) {
        return true;
      }
    },
    checkout(val, text, num) {
      if (!val) {
        this.$message.warning(`${this.$t('请输入')}${text}`);
        return false;
      }
      if (val.length > num) {
        this.$message.warning(
          `${text}${this.$t('长度不能超过')}${num}${this.$t('字')}`
        );
        return false;
      }
      // if (!systemConfig.rules.commonRule[chinese][1].pattern.test(val)) {
      //   this.$message.warning(
      //     `请在${text}中${systemConfig.rules.commonRule[chinese][1].message}`
      //   );
      //   return false;
      // }
      return true;
    },
    uploadImage(file) {
      const formData = new FormData();
      formData.append("uploadFile", file);
      return this.$axios
        .post(systemConfig.urls.uploadImage, formData)
        .then((res) => {
          return res.data.path;
        });
    },
    getAllMemberGroupList() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((res) => {
        this.allMemberGroupList = res.data.page;
      });
    },
    getAllAgentList() {
      this.$axios
        .get(systemConfig.urls.getAgentList, {
          params: {
            pageNo: 1,
            pageSize: 99999,
            orderBy: "createTime desc",
          },
        })
        .then((res) => {
          this.allAgentList = res.data.page.list;
        });
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleCheckAllChange(val) {
      let ids = []
      if (val) {
        this.allAgentList.map(item => {
          ids.push(item.id)
        })
      }
      this.$set(this.formFields, 'agyList', val ? ids : [])
      this.isIndeterminate = false;
    },
    handleCheckedAgyListChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allAgentList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allAgentList.length;
    }
  },
  computed: {
    curToolBar () {
      const { messageType, receiverType } = this
      if ( !messageType && receiverType === 1) return false
      if (messageType) return 'image | link'
      return 'image'
    }
  },
  watch: {
    messageType(val) {
      this.formFields = {
        agyList: [],
        groupList: [],
        textContent: null,
        loginNameList: null,
      };
      this.isPush = val;
    },
    isPush(val) {
      this.personMessageType = 0;
      if (val === 1) {
        this.isAutomaticDelete = 0
      }
    },
    personMessageType() {
      this.pushTitle = this.pushContent = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-editor.el-form-item--small {
  /deep/ .el-form-item__content {
    line-height: 24px;
  }
}
.form-wrapper {
  .select-agent {
    .select-all {
      float: left;
      margin-right: 30px;
    }
  }
  .el-checkbox-group .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
    &.last-of-type {
      margin-right: 0;
    }
  }
}
.w130 {
  /deep/ .el-form-item__label {
    width: 130px !important;
    margin-left: -30px;
  }
}
.w140 {
  /deep/ .el-form-item__label {
    width: 140px !important;
    margin-left: -40px;
  }
  /deep/ .el-form-item__content {
    margin-left: 100px;
  }
  /deep/ .el-input{
    width: 220px;
  }
  span{
    color: red;
  }
}

</style>
