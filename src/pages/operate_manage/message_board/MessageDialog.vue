<template>
  <el-dialog
    class="message-dialog"
    :title="$t('会员留言')"
    :visible="isMessageBoardShow"
    @close="handleClose"
  >
    <div class="topButton">
      <span>
        <el-button
          type="primary"
          v-for="(item, i) in memberArr"
          :key="i"
          :class="[item.val === msgType ? 'select' : '']"
          @click="getMemberWord(item.val)"
          >{{ item.name }}</el-button
        >
      </span>
    </div>
    <ul class="content-box" ref="contentBox">
      <li
        :class="{ 'message-item': true, 'is-admin': item.isAdmin }"
        v-for="(item, index) in messageList"
        :key="index"
      >
        <i class="avatar"></i>
        <span class="message-time-user" v-if="item.isAdmin">{{
          item.time + " " + item.username
        }}</span>
        <span class="message-time-user" v-else>{{
          item.username + " " + item.time
        }}</span>
        <div :class="{ 'message-content': true, 'is-image': item.imageUrl }">
          <img
            class="message-content_image"
            :src="item.imageUrl"
            :alt="$t('图片')"
            v-if="item.imageUrl"
            @click="previewImage(item.imageUrl)"
          />
          <pre
            class="message-text ql-editor"
            v-else
            v-html="item.textContent"
          ></pre>
        </div>
        <i class="is-read " v-if="item.isAdmin && item.isRead">{{ $t('已读') }}</i
        ><!-- el-icon-check -->
        <i class="is-read " v-else-if="item.isAdmin && !item.isRead">{{ $t('未读') }}</i>
      </li>
    </ul>
    <div class="operation-bar">
      <el-upload
        class="operation-bar-item"
        action=""
        :show-file-list="false"
        :http-request="uploadImage"
      >
        <i class="upload-img-btn el-icon-picture-outline"></i>
        <div v-show="isUploading" class="upload-img-tip" slot="tip">
          <i class="el-icon-loading"></i>{{ $t('正在上传图片') }}......
        </div>
      </el-upload>
    </div>
    <div
      class="user-input-wrapper"
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="handleDrop"
    >
      <el-input
        :disabled="!hasPermission('member:message:send')"
        rows="6"
        resize="none"
        type="textarea"
        maxlength="200"
        class="user-input"
        v-model="inputMessage"
        :placeholder="$t('请输入要发送的信息') + '......'"
        @paste.native.stop="handlePaste"
        @keyup.native.enter.exact="sendMessage"
      >
      </el-input>
      <span class="word-number">{{
        inputMessage ? 200 - inputMessage.length : 200
      }}</span>
    </div>
    <template slot="footer">
      <el-button @click="handleClose">{{ $t('取消') }}</el-button>
      <el-button
        v-if="hasPermission('member:message:send')"
        @click="sendMessage"
        :disabled="curSendBool"
        type="primary"
        >{{ $t('发送') }}</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: [
    "messageId",
    "isUploading",
    "isMessageBoardShow",
    "filterAndCompressImage",
    "messageList",
    "sendBool",
    "msgType"
  ],
  data() {
    return {
      inputMessage: null,
      scrollTop: null,
      list: [
        {
          isAdmin: false,
          username: "adqad",
          time: "2018/12/12 22:30:11",
          textContent: this.$t("今日张正直")
        },
        {
          isAdmin: true,
          username: "admin",
          time: "2018/12/12 22:30:11",
          textContent: this.$t("今日张正直")
        }
      ],
      curSendBool: false,
      //获取人工、全部、系统留言信息获取
      memberArr: [
        { name: this.$t("全部消息"), val: 0 },
        { name: this.$t("人工消息"), val: 1 },
        { name: this.$t("系统消息"), val: 2 }
      ],
      curClass: 1,
      timeId: ""
    };
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  created() {
    this.$nextTick(() => {
      this.showLatestMessage();
      setTimeout(() => {
        this.$refs.contentBox.addEventListener("scroll", this.showMoreMessage);
      }, 100)
    });
  },
  beforeDestroy() {
    this.$refs.contentBox.removeEventListener("scroll", this.showMoreMessage);
  },
  methods: {
    handleDrop(e) {
      const [file] = e.dataTransfer.files;
      this.uploadImage({ file });
    },
    handlePaste(e) {
      const [file] = e.clipboardData.files;
      if (/png|jpeg/.test(file.type)) {
        this.uploadImage({ file });
      }
    },
    previewImage(url) {
      window.open(url);
    },
    clearMessage() {
      this.inputMessage = null;
    },
    showLatestMessage() {
      this.$nextTick(() => {
        this.$refs.contentBox.scrollTo({ top: 999999 });
      });
    },
    showMoreMessage(e) {
      if (e.target.scrollTop < this.scrollTop) {
        // 向上滚动时
        if (e.target.scrollTop < 5) {
          if (this.timeId) {
            clearTimeout(this.timeId);
          }
          this.timeId = setTimeout(() => {
            this.$emit("loadMoreMessage", { source: "scroll", isMessage: 0 });
          }, 500);
          e.target.scrollTop = 10;
        }
      } else {
        // 向下滚动时
        if (e.target.scrollTop > (e.target.scrollHeight - e.target.offsetHeight - 5)) {
          if (this.timeId) {
            clearTimeout(this.timeId);
          }
          this.timeId = setTimeout(() => {
            this.$emit("loadMoreMessage", { source: "scroll", isMessage: 1 });
          }, 500);
          e.target.scrollTop = e.target.scrollHeight - e.target.offsetHeight - 10;
        }
      }
      this.scrollTop = e.target.scrollTop;
    },
    sendMessage() {
      const { inputMessage } = this;
      this.curSendBool = this.inputMessage ? true : false;
      if (inputMessage && inputMessage.replace(/\s/g, "")) {
        const formData = new FormData();
        formData.append("isSign", 1);
        formData.append("textContent", inputMessage);
        formData.append("messageId", this.messageId);
        formData.append("isAutomaticDelete", 0);
        this.$emit("sendMessage", formData);
      }
    },
    uploadImage({ file }) {
      this.filterAndCompressImage(file, res => {
        this.$emit("uploadImage", res);
      });
    },
    handleClose() {
      this.$emit("update:isMessageBoardShow", false);
    },
    //人工、全部、系统留言信息获取
    getMemberWord(msgType) {
      this.$emit("loadMoreMessage", { msgType });
    }
  },
  watch: {
    sendBool(val) {
      this.curSendBool = val;
    }
  }
};
</script>

<style lang="scss" scoped>
$avatar-width: 40px;
$triangle-width: 6px;
$message-content-mg: 10px;
$message-bgc_user: #eee;
$message-bgc_admin: #409eff;
@mixin triangle($width: 10px, $direction: top, $color: #000) {
  border: $width solid transparent;
  @if ($direction == top) {
    // 上三角
    border-bottom-color: $color;
  }
  @if ($direction == bottom) {
    // 下三角
    border-top-color: $color;
  }
  @if ($direction == left) {
    // 左三角
    border-right-color: $color;
  }
  @if ($direction == right) {
    // 右三角
    border-left-color: $color;
  }
}
.message-dialog {
  /deep/ .el-dialog__header {
    background-color: $message-bgc_admin;
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    padding-top: 20px;
  }
  .content-box {
    height: 400px;
    padding: 30px 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .user-input /deep/ .el-textarea__inner {
    border-radius: 0;
    &:focus {
      border-color: #c0c4cc;
    }
  }
  .topButton {
    position: absolute;
    top: 4px;
    left: 90px;
    font-size: 14px !important;
    .el-button {
      background-color: rgb(54, 54, 54);
      color: white;
    }
    .el-button:hover {
      background-color: rgb(161, 161, 161);
    }
    .select {
      background-color: rgb(161, 161, 161);
    }
  }
}
.message-item {
  display: flex;
  position: relative;
  padding-bottom: 30px;
  .is-read {
    align-self: flex-end;
    font-style: normal;
  }
  .avatar {
    width: $avatar-width;
    height: $avatar-width;
    border-radius: 50%;
    margin: 2px;
    background: url("../../../assets/img/user@2x.png") no-repeat center center;
    background-size: 100%;
  }
  .message-time-user {
    position: absolute;
    left: $avatar-width + $message-content-mg + 4px;
    top: -18px;
    color: #999;
  }
  &.is-admin {
    flex-direction: row-reverse;
    .avatar {
      background-image: url("../../../assets/img/admin@2x.png");
    }
    .message-time-user {
      left: auto;
      right: $avatar-width + $message-content-mg + 4px;
    }
    .message-text {
      color: #fff;
      background-color: $message-bgc_admin;
    }
    .message-content:after {
      left: auto;
      right: -$triangle-width * 2;
      @include triangle($triangle-width, right, $message-bgc_admin);
    }
  }
}
.message-content {
  position: relative;
  margin: 0 $message-content-mg;
  .message-content_image {
    max-width: 228px;
    max-height: 128px;
  }
  .message-text {
    display: block;
    overflow: hidden;
    border-radius: 4px;
    background-color: $message-bgc_user;
    min-height: auto;
    max-width: 450px;
    padding: 12px 16px;
    line-height: 18px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  &:after {
    content: "";
    position: absolute;
    top: $avatar-width / 2 - $triangle-width;
    left: -$triangle-width * 2;
    @include triangle($triangle-width, left, $message-bgc_user);
  }
  &.is-image:after {
    display: none;
  }
}
$operation-bar-height: 30px;
.operation-bar {
  position: relative;
  height: $operation-bar-height;
  background-color: #eee;
  .upload-img-tip {
    position: absolute;
    top: -30px;
  }
  .operation-bar-item {
    float: left;
    color: #999;
    margin-left: 20px;
    line-height: $operation-bar-height;
    cursor: pointer;
  }
  .upload-img-btn {
    font-size: 20px !important;
    display: inline-block;
    vertical-align: middle;
  }
}

.user-input-wrapper {
  position: relative;
  .word-number {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #999;
  }
}
</style>
