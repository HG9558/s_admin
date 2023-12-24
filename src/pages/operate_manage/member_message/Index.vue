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
      <el-table-column
        :resizable="false"
        align="center"
        :label="$t('会员名')"
        slot="loginName"
      >
        <template slot-scope="scope">
          {{ scope.row.loginName }}
          <GlobalComponentTestLabel :id="scope.row.tagencyId"/>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('真实姓名')"
        slot="realName"
      >
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('会员等级')"
        slot="tierName"
      >
        <template slot-scope="scope">
          {{scope.row.tierName}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('反馈时间')"
        slot="modifyTime"
      >
        <template slot-scope="scope">
          {{ transferTimeByType(scope.row.modifyTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('反馈类型')"
        slot="type"
      >
        <template slot-scope="scope">
          {{handleChangeText(scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('反馈内容(点击查看)')"
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
        align="center"
        :label="$t('状态')"
        slot="status"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="hasPermission('member:message:send')"
            style="cursor: pointer;"
            :type="scope.row.isRevert ? 'success' : ''"
            @click.native="showMessageBoard(scope.row)"
          >{{ scope.row.status == 1 ? $t('待处理') : $t('已处理') }}
          </el-tag
          >
          <!--          {{ scope.row.status ? "待处理" : "已处理" }}-->
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog
      :title="$t('查看反馈内容')"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <MessageDialog :row="clickRow" :typeArr="searchCriteria.meta[4].options"></MessageDialog>
      <span slot="footer" class="dialog-footer">
    <el-button v-if="clickRow.status == 1" @click="sendMessage">{{ $t('标记为已处理') }}</el-button>
    <el-button type="primary" @click="dialogVisible = false">{{ $t('关闭') }}</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import systemConfig from "../../../config/config.js";
  import MessageDialog from "./MessageDialog";
  import AddMessage from "./AddMessage";
  import queryStore from "../../../mixins/queryStore";
  import {Loading} from "element-ui";
  import xss from "../../../config/xss";
  import {mapGetters} from "vuex";
  import {compressImage} from "../../../config/utils";
  import Mixin from '@/mixins/loadTime'

  export default {
    name: "messageBoard",
    mixins: [Mixin, queryStore(["searchCriteria.keys"])],
    components: {MessageDialog, AddMessage},
    data() {
      return {
        dialogVisible: false,
        clickRow: {},
        searchCriteria: {
          keys: {
            loginName: null,
            realName: null,
            actLevelId: null,
            type: null,
            status: null,
          },
          meta: [
            {
              type: "text",
              label: this.$t("会员名"),
              prop: "loginName"
            },
            {
              type: "text",
              label: this.$t("真实姓名"),
              prop: "realName"
            },
            {
              type: "select",
              label: this.$t("会员等级"),
              prop: "actLevelId",
              options: []
            },
            {
              type: "select",
              label: this.$t("状态"),
              prop: "status",
              options: [
                {
                  label: this.$t("全部"),
                  value: null
                },
                {
                  label: this.$t("待处理"),
                  value: 1
                },
                {
                  label: this.$t("已处理"),
                  value: 2
                }
              ]
            },
            {
              type: "select",
              label: this.$t("反馈类型"),
              curName: "curType",
              prop: "type",
              options: [
                {
                  label: this.$t("全部消息"),
                  value: null
                },
                {
                  label: this.$t("存款问题"),
                  value: 9
                },
                {
                  label: this.$t("提款问题"),
                  value: 1
                },
                {
                  label: this.$t("游戏问题"),
                  value: 2
                },
                {
                  label: this.$t("优惠问题"),
                  value: 3
                },
                {
                  label: this.$t("修改资料"),
                  value: 4
                },
                {
                  label: this.$t("流水问题"),
                  value: 5
                },
                {
                  label: this.$t("程序错误"),
                  value: 6
                },
                {
                  label: this.$t("产品建议"),
                  value: 7
                },
                {
                  label: this.$t("其他"),
                  value: 8
                },
              ]
            }
          ]
        },
        tableColumns: [
          {
            type: "index",
            label: this.$t("序号"),
            fixed: 'left'
          },
          {
            slotName: "loginName"
          },
          {
            slotName: "realName"
          },
          {
            slotName: "tierName"
          },
          {
            slotName: "modifyTime"
          },
          {
            slotName: "textContent"
          },

          {
            slotName: "status"
          },
          {
            slotName: "type"
          },
        ],
        tableData: [],
        pageSize: 10,
        currentPage: 1,
        totalCount: null,

        isAddMessageShow: false,
        oldMsgType: null,
        memberPerms: [],
        levels: []
      };
    },
    computed: {
      ...mapGetters(["hasPermission"]),
      useQueryStoreCache() {
        return this.$route.query.useQueryStoreCache === "yes";
      },
      isRevert() {
        const {isRevert} = this.$route.query;
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

      this.getTableData();
    },
    methods: {
      handleChangeText(type) {
        const typeArr = (this.searchCriteria.meta.find(item => item.curName === 'curType')).options
        const typeObj = typeArr.find(item => item.value === type)
        return typeObj ? typeObj.label : typeArr[0].label
      },
      getMemberPerms(time) {
        this.$axios
          .get(systemConfig.urls.memberLevel.list)
          .then((data) => {
            data.data.data.map((item) => {
              item.label = item.tierName
              item.value = item.id
            })
            this.searchCriteria.meta.map((item) => {
              if (item.prop == 'actLevelId') {
                item.options = [{
                  label: this.$t('全部'),
                  value:  null
                }, ...data.data.data]
              }
            })

          })
      },
      transferTimeByType(time) {
        return systemConfig.transferTimeByType(time, this.timeType);
      },
      sendMessage() {
        this.$axios
          .post(systemConfig.urls.memberMessage.sendMessage, {
            id: this.clickRow.id,
            status: 2
          })
          .then(res => {
            this.dialogVisible = false
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
      loadMoreMessage({msgType, source, isMessage}) {
        if (source === "scroll") {
          //滚动条触发
          this.messageInfo.pageSizes[isMessage] += 10;

          const {length: oldLength} = this.messageInfo.list

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
        const {infoId, messageId, pageSizes} = this.messageInfo
        const request = ({num, isMessage}) => ( // isMessage 1 加载更新的信息  0 加载更旧的信息
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
          pageSizes.map((num, isMessage) => request({num: num || 1, isMessage}))
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
      showMessageBoard(row) {
        // debugger
        this.clickRow = row
        this.dialogVisible = true;
      },
      getTableData() {
        this.getCurrentRecodeTime()
        const {msgType, textContent} = this.searchCriteria.keys;
        const instance = Loading.service({fullscreen: true});
        this.$axios
          .get(systemConfig.urls.memberMessage.list, {
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
