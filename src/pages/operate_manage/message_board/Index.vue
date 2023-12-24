<template>
  <div>
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      @reloadData="getTableData"
      ref="searchCom"
    >
    </TableSearchBar>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"


    >
      <el-button
        v-if="hasPermission('member:message:newSend')"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="isAddMessageShow = true"
        >{{ $t('新建对话') }}</el-button
      >
      <!-- 表格插槽 -->
      <el-table-column
        :resizable="false"
        width="200"
        align="center"
        :label="$t('会员名')"
        slot="loginName"
      >
        <template slot-scope="scope">
          {{ scope.row.loginName }}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="permissions.realName"
        :resizable="false"
        width="200"
        align="center"
        :label="$t('姓名')"
        slot="realName"
      >
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="center"
        fixed="right"
        :label="$t('内容')"
        slot="textContent"
      >
        <template slot-scope="scope">
          <pre
            @click="showMessageBoard(scope.row)"
            :class="{
              'table-message-item': true,
              'is-revert': !!scope.row.isRevert
            }"
            >{{ scope.row.textContent }}</pre
          >
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        width="100"
        fixed="right"
        align="center"
        :label="$t('状态')"
        slot="isRevert"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="hasPermission('member:message:send')"
            style="cursor: pointer;"
            :type="scope.row.isRevert ? 'success' : ''"
            @click.native="showMessageBoard(scope.row)"
            >{{ scope.row.isRevert ? $t("已回复") : $t("待处理") }}</el-tag
          >
          <el-tag
            v-else
            style="cursor: pointer;"
            :type="scope.row.isRevert ? 'success' : ''"
            >{{ scope.row.isRevert ? $t("已回复") : $t("待处理") }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" align="left" label="操作" slot="operation">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small">[编辑]</el-button>
          <el-button @click="handleRemove(scope.row.id)" type="text" size="small">[删除]</el-button>
        </template>
      </el-table-column> -->
    </TableCom>
    <MessageDialog
      ref="messageDialog"
      :msgType="oldMsgType"
      :messageId="messageInfo.messageId"
      :messageList="messageInfo.list"
      :isUploading="messageInfo.isUploading"
      :filterAndCompressImage="filterAndCompressImage"
      :isMessageBoardShow.sync="messageInfo.isMessageBoardShow"
      :sendBool="messageInfo.sendBool"
      @sendMessage="sendMessage"
      @uploadImage="uploadImage"
      @loadMoreMessage="loadMoreMessage"
      v-if="messageInfo.isMessageBoardShow"
    />
    <AddMessage
      v-if="isAddMessageShow"
      :visible.sync="isAddMessageShow"
      :filterAndCompressImage="filterAndCompressImage"
      @sendMessage="sendMessage"
    />
  </div>
</template>

<script>
import systemConfig from "../../../config/config.js";
import MessageDialog from "./MessageDialog";
import AddMessage from "./AddMessage";
import queryStore from "../../../mixins/queryStore";
import { Loading } from "element-ui";
import xss from "../../../config/xss";
import { mapGetters } from "vuex";
import { compressImage } from "../../../config/utils";
import Mixin from '@/mixins/loadTime'

export default {
  name: "messageBoard",
  mixins: [Mixin, queryStore(["searchCriteria.keys"])],
  components: { MessageDialog, AddMessage },
  data() {
    return {
      searchCriteria: {
        keys: {
          loginName: null,
          groupId: null,
          isRevert: null,
          msgType: 0,
          textContent: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("会员名"),
            prop: "loginName"
          },
          {
            type: "text",
            label: this.$t("留言内容"),
            prop: "textContent"
          },
          {
            type: "select",
            label: this.$t("会员组"),
            prop: "groupId",
            options: []
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "isRevert",
            options: [
              {
                label: this.$t("全部"),
                value: null
              },
              {
                label: this.$t("待处理"),
                value: 0
              },
              {
                label: this.$t("已回复"),
                value: 1
              }
            ]
          },
          {
            type: "select",
            label: this.$t("消息类型"),
            prop: "msgType",
            options: [
              {
                label: this.$t("全部消息"),
                value: 0
              },
              {
                label: this.$t("人工消息"),
                value: 1
              },
              {
                label: this.$t("系统消息"),
                value: 2
              }
            ]
          }
        ]
      },
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          resizable: false
        },
        {
          prop: "groupName",
          label: this.$t("会员组"),
          width: "200",
          resizable: false
        },
        {
          slotName: "loginName"
        },
        {
          slotName: "realName"
        },
        {
          label: this.$t('最近更新时间'),
          prop: 'time',
          width: 180
        },
        {
          slotName: "textContent"
        },
        {
          slotName: "isRevert"
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      messageInfo: {
        isUploading: false,
        isMessageBoardShow: false,
        messageId: null,
        list: [],
        pageSizes: [],
        sendBool: false,
        infoId: false,
      },
      isAddMessageShow: false,
      oldMsgType: null,
      memberPerms: [],
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    isRevert() {
      const { isRevert } = this.$route.query;
      if (isRevert === undefined || isRevert === null) {
        return null;
      } else {
        return Number(isRevert);
      }
    },
    timeType() {
      return this.$store.state.timeType;
    },
    permissions() {
      return {
        realName: !!this.memberPerms.find(item => item.columnName === 'realName'),
      }
    }
  },
  watch: {
    "$route.query.t"(value) {
      this.$nextTick(() => {
        this.getTableData();
      });
    },
    isRevert(value) {
      this.searchCriteria.keys.isRevert = value;
    }
  },
  created() {
    if (!this.useQueryStoreCache) {
      this.searchCriteria.keys.isRevert = this.isRevert;
    }
    this.getMemberPerms();
    this.getGroupList();
    this.getTableData();
  },
  methods: {
    getMemberPerms(time) {
      this.$axios
        .get(systemConfig.urls.memberListInitAuthGet, {
          params: {
            typeId: 4,
          },
        })
        .then(({ data: { items } }) => {
          this.memberPerms = items || []
        })
    },
    transferTimeByType(time) {
      return systemConfig.transferTimeByType(time, this.timeType);
    },
    sendMessage(formData) {
      this.messageInfo.sendBool = true;
      this.$axios
        .post(systemConfig.urls.messageBoard.sendMessage, formData)
        .then(res => {
          if (formData.get("messageId")) {
            this.$refs.messageDialog.clearMessage();
            this.getMessageInfo().then(() => {
              this.$refs.messageDialog.showLatestMessage();
            });
          } else {
            this.isAddMessageShow = false;
            this.$message.success(this.$t("发送成功"));
          }
          this.getTableData();
        })
        .catch(err => {
          this.$set(this.messageInfo, "sendBool", false);
        });
    },
    filterAndCompressImage(file, callback) {
      if (/jpeg|png/.test(file.type)) {
        compressImage(file, callback);
      } else {
        this.$message.error(this.$t("只能是jpg或者png格式的图片"));
      }
    },
    uploadImage(file) {
      const formData = new FormData();
      formData.append("isSign", 1);
      formData.append("uploadMessageFile", file);
      formData.append("messageId", this.messageInfo.messageId);
      this.messageInfo.isUploading = true;
      this.$axios
        .post(systemConfig.urls.messageBoard.sendMessage, formData)
        .then(res => {
          this.messageInfo.isUploading = false;
          if (res) {
            this.getTableData();
            this.getMessageInfo().then(() => {
              this.$refs.messageDialog.showLatestMessage();
            });
          }
        })
        .catch(err => {
          this.messageInfo.isUploading = false;
        });
    },
    loadMoreMessage({ msgType, source, isMessage }) {
      if (source === "scroll") {
        //滚动条触发
        this.messageInfo.pageSizes[isMessage] += 10;

        const { length: oldLength } = this.messageInfo.list

        this.getMessageInfo()
          .then(() => {
            if (this.messageInfo.list.length === oldLength) {
              this.$message.warning(this.$t("没有更多消息了"));
              this.messageInfo.pageSizes[isMessage] -= 10
            }
          })
      } else if (this.oldMsgType !== msgType) {
        //点击人工、全部、系统触发
        this.oldMsgType = msgType;
        this.messageInfo.pageSize = 10;
        this.getMessageInfo(msgType);
      }
    },
    getMessageInfo(msgType = this.oldMsgType) {
      const { infoId, messageId, pageSizes } = this.messageInfo
      const request = ({ num, isMessage }) => ( // isMessage 1 加载更新的信息  0 加载更旧的信息
        this.$axios
          .get(systemConfig.urls.messageBoard.getMessageInfo, {
            params: {
              num,
              infoId,
              msgType,
              messageId,
              isMessage,
            }
          })
      )

      this.messageInfo.sendBool = true;
      return Promise.all(
        pageSizes.map((num, isMessage) => request({ num: num || 1, isMessage }))
      )
        .then(([upper, lower]) => {
          const msglist = [
            ...upper.data.data.list.reverse(),
            ...lower.data.data.list,
          ].filter((item, index, srcArr) => srcArr.findIndex(i => i.id === item.id) === index)

          this.messageInfo.list = msglist
            .map(item => {
              return {
                ...item,
                isAdmin: item.isSign,
                username: item.createUser,
                textContent: xss.process(item.textContent),
                time: this.transferTimeByType(item.createTime).replace(
                  /-/g,
                  "/"
                )
              };
            })
          this.messageInfo.sendBool = false;
        })
        .catch(err => {
          this.$set(this.messageInfo, "sendBool", false);
        });
    },
    showMessageBoard({ id, infoId }) {
      this.messageInfo.messageId = id;
      this.messageInfo.infoId = infoId;
      this.messageInfo.pageSizes = [10, 0];
      this.getMessageInfo().then(() => {
        this.messageInfo.isMessageBoardShow = true;
      });
    },
    getGroupList() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then(res => {
        this.searchCriteria.meta[2].options = [
          {
            label: this.$t("全部"),
            value: null
          },
          ...res.data.page.map(item => {
            return {
              label: item.groupName,
              value: item.id
            };
          })
        ];
      });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      const { msgType, textContent } = this.searchCriteria.keys;
      const instance = Loading.service({ fullscreen: true });
      this.$axios
        .get(systemConfig.urls.messageBoard.list, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys
          }
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          instance.close();
          if (res) {
            this.oldMsgType = msgType;
            this.totalCount = res.data.page.totalCount;
            this.tableData = res.data.page.list;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-message-item {
  overflow: hidden;
  text-overflow: ellipsis;
}
.is-revert {
  color: #bbb;
}
</style>
