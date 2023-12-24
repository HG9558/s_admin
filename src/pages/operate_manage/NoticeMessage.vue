<template>
  <div class="notice-message" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width160">
          <label>{{ $t('公告标题') }}</label>
          <input type="text" v-model="noticeName" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width160">
          <label>{{ $t('显示方式') }}</label>
          <el-select v-model="showValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in showOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width160">
          <label>{{ $t('状态') }}</label>
          <el-select v-model="statusValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
         <!-- 公告管理 -- 公告通知 -->
         <div class="search-basic-item width160">
          <label>{{ $t('语言类型') }}</label>
          <el-select v-model="language" :placeholder="$t('请选择')">
            <el-option
              v-for="item in lanListS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--最后创建时间-->
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('创建时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            ref="searchTime"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
          />
        </div>
      </div>
      <div class="div-search-btn" style="top: 58%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" class="wid-80"
          >{{ $t('查询') }}</el-button
        >
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button
        v-if="hasPermission('operate:oprnotice:save')"
        icon="el-icon-circle-plus-outline"
        type="primary"
        size="mini"
        style="width: 100px;"
        @click="addNotice"
        >{{ $t('新增') }}
      </el-button>
      <el-button
        style="right:80px;width: 100px"
        class="iconfont icon-export el-button-delete"
        type="primary"
        size="mini"
        v-if="
          hasPermission('operate:oprnotice:delete') &&
            tableData.some(item => item.available === 0)
        "
        @click.native="deleteArrNotice"
        >{{ $t('批量删除') }}
      </el-button>
    </el-row>

    <div class="search-form">
      <el-table
        max-height="480"
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="
            hasPermission('operate:oprnotice:delete') &&
              tableData.some(item => item.available === 0)
          "
          :label="$t('全选')"
          align="center"
          type="selection"
          :selectable="tellSelectable"
          width="40"
        >
        </el-table-column>
        <el-table-column :label="$t('序号')" type="index" align="center" :index="indexMethod">
        </el-table-column>
        <el-table-column align="center" :label="$t('语言类型')" width="160">
          <template slot-scope="scope">
            {{ getLanguageText(scope.row.language) }}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('标题')" width="160">
          <template slot-scope="scope">
            <!-- <el-button @click="showDetail(scope.row, 2)" type="text" size="small">{{scope.row.noticeTitle}}</el-button> -->
            {{ scope.row.noticeTitle }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('内容')" width="210">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.noticeContent"
              placement="right-start"
            >
              <span>{{ spliceStr(scope.row.noticeContent) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="showTypeText" :label="$t('显示方式')">
        </el-table-column>
        <el-table-column
          prop="startTime"
          align="center"
          :formatter="timeFilter"
          width="150"
          :label="$t('开始时间')"
        >
        </el-table-column>
        <!-- <el-table-column prop="available" label="状态" :filters="filterArr"
                         :filter-method="filterTag" filter-placement="bottom-end" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.available === 1 ? 'primary' : 'warning'">{{statusFilter(scope.row.available)}}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="endTime"
          width="150"
          align="center"
          :formatter="timeFilter"
          :label="$t('到期时间')"
        >
        </el-table-column>
        <el-table-column align="center" prop="createUser" :label="$t('创建人')"> </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          :formatter="timeFilter"
          width="140"
          :label="$t('创建时间')"
        >
        </el-table-column>
        <el-table-column align="center" prop="updateUser" :label="$t('更新人')"> </el-table-column>
        <el-table-column
          prop="updateTime"
          width="140"
          align="center"
          :formatter="timeFilter"
          :label="$t('更新时间')"
        >
        </el-table-column>
        <el-table-column align="center" :label="$t('是否启用')" prop="available">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              :disabled="!hasPermission('operate:oprnotice:available')"
              @change="toggle(scope.row)"
              :inactive-value="0"
              :active-value="1"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" align="center" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('operate:oprnotice:update')"
              class="blue-color pointer"
              @click="showDetail(scope.row, 1)"
              >[{{ $t('编辑') }}]</span>
            <span
              class="blue-color pointer"
              @click="deleteOneNotice(scope.row)"
              v-if="
                hasPermission('operate:oprnotice:delete') &&
                  !scope.row.available
              "
              >[{{ $t('删除') }}]</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listReq.pageNo"
        :page-sizes="listReq.pageSizeArr"
        :page-size="listReq.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog
      @close="cancel"
      :title="noticeTitle"
      :visible.sync="addNoticeShow"
    >
      <el-form label-position="right" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('开始时间')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="createFrom"
                type="datetime"
                :disabled="isDisabled"
                :placeholder="$t('选择开始时间')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('结束时间')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="createEnd"
                type="datetime"
                :disabled="isDisabled"
                :placeholder="$t('选择结束时间')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
           <!-- 公告管理 -- 公告通知弹窗 -->
          <el-col :span="24">
            <el-form-item :label="$t('语言类型')">
              <el-select v-model="dialogLanguage" :placeholder="$t('请选择')">
                <el-option
                  v-for="item in lanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('公告标题')">
              <el-input
                v-model="addTitle"
                :disabled="isDisabled"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('显示方式')">
              <el-checkbox v-model="checked1" :disabled="isDisabled"
                >{{ $t('公告(跑马灯)') }}</el-checkbox
              >
              <el-checkbox v-model="checked2" :disabled="isDisabled"
                >{{ $t('广播(弹窗)') }}</el-checkbox
              >
            </el-form-item>
          </el-col>
          <div v-for="(item, index) in currentData.imageList" :key="index">
            <el-col class="loop-div" :span="24" v-if="checked2">
              <el-form-item class="uploader blue width100p" :label="$t('PC端图片')">
                <input :class="[item.pcPath ? 'pl150': '']" type="text" class="filename" readonly=""
                       v-model="imgStr.pcPath"
                       style="width: calc(100% - 100px);">
                <input type="button" name="file" class="button" :value="$t('浏览')">
                <input ref="pc" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                       @change="getPcPath($event, index)">
                <span v-show="item.pcPath" class="upload-span" @click="previewImgOpen(item.pcPath)">{{ $t('查看已上传的图片') }}</span>
                <span class="img-type-tips">{{ $t('建议图片尺寸（宽×高）：474*218px ,支持格式png/jpg/gif') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="checked2">
              <el-form-item class="uploader blue width100p" :label="$t('移动端图片')">
                <input :class="[item.mbPath ? 'pl150': '']" type="text" class="filename" readonly=""
                       v-model="imgStr.mbPath"
                       style="width: calc(100% - 100px);">
                <input type="button" name="file" class="button" :value="$t('浏览')">
                <input ref="pc" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                       @change="getMbPath($event, index)">
                <span v-show="item.mbPath" class="upload-span" @click="previewImgOpen(item.mbPath)">{{ $t('查看已上传的图片') }}</span>
                <span class="img-type-tips">{{ $t('建议图片尺寸（宽×高）：295*100px ，支持格式png/jpg/gif') }}</span>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item :label="$t('公告内容')">
              <el-input
                type="textarea"
                v-model="addContent"
                :disabled="isDisabled"
                :maxlength="168"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="text-align: center" label-width="0">
              <el-button
                type="primary"
                v-show="flag === 1"
                @click.native="addNoticeData($event)"
                >{{ $t('确定') }}</el-button
              >
              <el-button
                type="primary"
                v-show="flag === 2"
                @click.native="editData"
                >{{ $t('编辑') }}</el-button
              >
              <el-button type="primary" @click.native="cancel">{{ $t('取消') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--图片预览-->
    <Overlay v-show="picPreviewShow" @click.native="picPreviewShow = false"></Overlay>
    <div v-show="picPreviewShow" class="preview-img">
      <p><i class="el-icon-error" @click="picPreviewShow = false"></i></p>
      <img :src="picPathImg">
    </div>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../config/config.js";
import Overlay from "../../components/Overlay.vue";
import { mapGetters } from "vuex";
import queryStore from "../../mixins/queryStore";
import { lang } from "@/i18n";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";

import Mixin from '@/mixins/loadTime'

const languageList = [
  { value: "zh", label: lang("简体中文") },
  { value: "zh_tw", label: lang("繁体中文") },
  { value: "vi", label: lang("越南语") },
  { value: "ms", label: lang("马来语") },
  { value: "th", label: lang("泰语") },
  { value: "en_us", label: lang("英语") },
]

export default {
  name: "noticeMessage",
  mixins: [
    Mixin,
    queryStore([
      "noticeName",
      "showValue",
      "statusValue",
      "startTime",
      "endTime"
    ])
  ],
  data() {
    return {
      noticeName: "",
      showValue: [],
      showOptions: [
        { value: "0", label: this.$t("公告") },
        { value: "1", label: this.$t("广播") }
      ],
      statusValue: [],
      statusOptions: [
        { value: "0", label: this.$t("禁用") },
        { value: "1", label: this.$t("启用") }
      ],
      lanList: languageList,
      language: '',
      multipleSelection: [],
      showExtend: false,
      startTime: "",
      endTime: "",
      tableData: [],
      total: 0,
      noticeTitle: "",
      createFrom: "",
      createEnd: "",
      addTitle: "",
      addShowType: "",
      addContent: "",
      addNoticeShow: false,
      flag: "", // 1代表新增  2代表编辑
      rowData: "",
      isDisabled: false,
      checked1: false,
      checked2: false,
      pcPathShow: false,
      mobilePathShow: false,
      picPreviewShow: false,
      imgStr: {pcPath: '', mbPath: ''},
      picPathImg: '',
      currentData: {
        imageList: [{
          mbPath: '',
          pcPath: '',
        }],
      },
      filterArr: [
        { text: this.$t("禁用"), value: 0 },
        { text: this.$t("启用"), value: 1 }
      ],
      dialogLanguage: 'zh',
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    lanListS () {
      let arr = JSON.parse(JSON.stringify(languageList))
      arr.unshift({ value: '', label: lang("全部")})
      return arr
    },
    extendTitle() {
      if (this.showExtend) {
        return this.$t("收起");
      } else {
        return this.$t("更多");
      }
    },
    loading() {
      return this.$store.state.searchLoading;
    },
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [5, 10, 20, 50, 100, 200]
      };
    },
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    timeType: {
      get: function() {
        return this.$store.state.timeType;
      },
      set: function() {}
    }
  },
  created() {
    this.getData();
  },
  components: {
    Overlay,
    StartAndEndTimeSelector
  },
  methods: {
    previewImgOpen(src) {
      this.picPreviewShow = true
      this.picPathImg = src
    },
    // 获取mobile图片
    getMbPath(event, index) {
      if (event.target.files[0]) {
        let arr = event.target.files[0].name.split('.')
        if ('gif,jpeg,jpg,png,svg'.indexOf(arr[arr.length - 1]) > -1) {
          let mbFile = event.target.files[0]
          let formData = new FormData()
          formData.append('uploadFile', mbFile)
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.imgStr.mbPath = this.$t('上传中')
          this.$axios.post(systemConfig.urls.uploadImage, formData, config).then((res) => {
            //  this.imgStr.mbPath = res.data.path
            this.imgStr.mbPath = ''
            this.currentData.imageList[index].mbPath = res.data.path
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('上传图片格式错误，请重新上传')
          })
        }
      }
    },
    // 获取pc图片
    getPcPath(event, index) {
      if (event.target.files[0]) {
        let arr = event.target.files[0].name.split('.')
        if ('gif,jpeg,jpg,png,svg'.indexOf(arr[arr.length - 1]) > -1) {
          let pcFile = event.target.files[0]
          let formData = new FormData()
          formData.append('uploadFile', pcFile)
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          this.imgStr.pcPath = this.$t('上传中')
          this.$axios.post(systemConfig.urls.uploadImage, formData, config).then((res) => {
            // this.imgStr.pcPath = res.data.path
            this.imgStr.pcPath = ''
            this.currentData.imageList[index].pcPath = res.data.path
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('上传图片格式错误，请重新上传')
          })
        }
      }
    },
    tellSelectable(row, index) {
      return !row.available;
    },
    spliceStr(str) {
      return systemConfig.spliceStr(str, 10);
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    more() {
      this.showExtend = !this.showExtend;
    },
    handleSizeChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.getData();
    },
    toggle(row) {
      let changeData = {
        id: row.id,
        available: row.available
      };
      this.$axios
        .post(systemConfig.urls.changeNoticeAvailable, changeData)
        .then(resp => {
          this.$message({
            type: "success",
            message: this.$t("成功")
          });
        })
        .catch(() => {
          this.tableData.find(
            item => item.id === row.id
          ).available = row.available ? 0 : 1;
        });
    },
    filterTag(value, row) {
      return row.available === value;
    },
    statusFilter(status) {
      if (status) {
        return this.$t("启用");
      } else {
        return this.$t("禁用");
      }
    },
    editData(row) {
      console.log('row ====', row)
      this.noticeTitle = this.$t("编辑公告");
      this.flag = 1;
      this.isDisabled = false;
    },
    showDetail(row, flag) {
      this.checked1 = false;
      this.checked2 = false;
      this.flag = flag;
      if (flag === 1) {
        this.noticeTitle = this.$t("编辑公告");
        this.isDisabled = false;
      } else if (flag === 2) {
        this.noticeTitle = this.$t("公告详情");
        this.isDisabled = true;
      }
      this.$axios.get(systemConfig.urls.oprnoticeInfo + row.id).then(resp => {
        const { oprNotice } = resp.data
        const { mbPath, pcPath, noticeTitle, noticeContent, startTime, endTime, showType, language } = oprNotice
        this.rowData = oprNotice;
        this.dialogLanguage = language
        this.addNoticeShow = true;
        this.addTitle = noticeTitle;
        this.addContent = noticeContent;
        this.createFrom = startTime;
        this.createEnd = endTime;
        this.currentData.imageList.splice(0, 1, { mbPath, pcPath })
        if (showType === "0") {
          this.checked1 = true;
        }
        if (showType === "1") {
          this.checked2 = true;
        }
        if (showType === "2") {
          this.checked2 = true;
          this.checked1 = true;
        }
      });
    },
    deleteOneNotice(row) {
      let ids = [];
      ids.push(row.id);
      this.deletenotice(ids);
    },
    deleteArrNotice() {
      let ids = [];
      for (let j = 0; j < this.multipleSelection.length; j++) {
        ids.push(this.multipleSelection[j].id);
      }
      if (ids.length) {
        this.deletenotice(ids);
      } else {
        this.$message.warning(this.$t("至少选择一项"));
      }
    },
    deletenotice(ids) {
      let deleteData = { ids: ids };
      this.$store.state.fullscreenLoading = true;
      this.$axios
        .post(systemConfig.urls.deleteNotice, deleteData)
        .then(resp => {
          this.$message({
            type: "success",
            message: this.$t("成功")
          });
          this.getData();
        });
    },
    reset() {
      this.noticeName = "";
      this.showValue = [];
      this.statusValue = [];
      this.startTime = "";
      this.endTime = "";
      this.language = '';
      this.search()
    },
    search() {
      this.getCurrentRecodeTime()
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("创建起始时间不能大于结束时间")
          });
          return;
        }
      }
      if (!this.startTime) {
        this.startTime = "";
      }
      if (!this.endTime) {
        this.endTime = "";
      }
      this.listReq.pageNo = 1;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addNotice() {
      this.rowData = "";
      this.checked1 = false;
      this.checked2 = false;
      this.isDisabled = false;
      this.addNoticeShow = true;
      this.noticeTitle = this.$t("新增公告");
      this.flag = 1;
    },
    addNoticeData() {
      if (!this.createFrom) {
        this.$message({
          type: "warning",
          message: this.$t("开始时间不能为空")
        });
        return;
      }
      if (!this.createEnd) {
        this.$message({
          type: "warning",
          message: this.$t("结束时间不能为空")
        });
        return;
      }
      if (new Date(this.createEnd) < new Date(this.createFrom)) {
        this.$message({
          type: "warning",
          message: this.$t("结束时间不能小于开始时间")
        });
        return;
      }
      if (!this.addTitle.trim()) {
        this.$message({
          type: "warning",
          message: this.$t("公告标题不能为空")
        });
        return;
      }
      if (!this.addContent) {
        this.$message({
          type: "warning",
          message: this.$t("公告内容不能为空")
        });
        return;
      }
      if (this.checked1 === false && this.checked2 === false) {
        this.$message({
          type: "warning",
          message: this.$t("显示方式不能为空")
        });
        return;
      }
      var showType = "";
      if (this.checked1 === true) {
        showType = "0";
      }
      if (this.checked2 === true) {
        showType = "1";
      }
      if (this.checked1 === true && this.checked2 === true) {
        showType = "2";
      }
      const { mbPath, pcPath } = this.currentData.imageList[0]
      // if (this.checked2) {
      //   if (!pcPath) return this.$message.warning('请上传pc端图片')
      //   if (!mbPath) return this.$message.warning('请上传移动端图片')
      // }
      let changeData = {
        id: this.rowData.id || "",
        noticeTitle: this.addTitle,
        noticeContent: this.addContent,
        startTime: this.createFrom,
        endTime: this.createEnd,
        showType: showType,
        language: this.dialogLanguage,
      };
      if (this.checked2) {
        changeData.mbPath = mbPath
        changeData.pcPath = pcPath
      }
      this.$store.state.fullscreenLoading = true;
      this.$axios
        .post(
          this.rowData.id
            ? systemConfig.urls.updateNotice
            : systemConfig.urls.saveNotice,
          changeData
        )
        .then(resp => {
          this.$message({
            type: "success",
            message: this.$t("成功")
          });
          this.cancel();
          this.getData();
          this.reset();
        });
    },
    cancel() {
      this.addNoticeShow = false;
      this.addReset();
    },
    addReset() {
      this.addTitle = "";
      this.addContent = "";
      this.createFrom = "";
      this.createEnd = "";
      this.dialogLanguage = 'zh';
      this.currentData.imageList.splice(0, 1, { mbPath: '', pcPath: '' })
    },
    timeFilter(row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    getData() {
      this.$store.state.searchLoading = true;
      let showValues = this.showValue;
      if (this.showValue.length === 2) {
        showValues = 2;
      } else {
        showValues = this.showValue.join(",");
      }
      let url =
        "?pageSize=" +
        this.listReq.pageSize +
        "&pageNo=" +
        this.listReq.pageNo +
        "&noticeTitle=" +
        this.noticeName +
        "&showTypes=" +
        showValues +
        "&availables=" +
        this.statusValue +
        "&language=" +
        this.language;
      if (this.startTime && this.timeType === "md") {
        url +=
          "&createStart=" +
          systemConfig.transferTimeByType(this.startTime, "mdToBj");
      } else {
        url += "&createStart=" + this.startTime;
      }
      if (this.endTime && this.timeType === "md") {
        url +=
          "&createEnd=" +
          systemConfig.transferTimeByType(this.endTime, "mdToBj");
      } else {
        url += "&createEnd=" + this.endTime;
      }
      this.$axios.get(systemConfig.urls.getNoticeList + url).then(resp => {
        this.getNetworkLoadAndDataSolveTime(resp)
        this.total = resp.data.page.totalCount;
        let arrData = resp.data.page.list;
        for (let i = 0; i < arrData.length; i++) {
          switch (arrData[i].showType) {
            case "0":
              arrData[i].showTypeText = this.$t("公告");
              break;
            case "1":
              arrData[i].showTypeText = this.$t("广播");
              break;
            case "2":
              arrData[i].showTypeText = this.$t("公告") + "," + this.$t("广播");
              break;
          }
        }
        this.tableData = arrData;
        if (this.statusValue.length === 1 && this.statusValue[0] === "1") {
          this.filterArr = [{ text: this.$t("启用"), value: 1 }];
        } else if (
          this.statusValue.length === 1 &&
          this.statusValue[0] === "0"
        ) {
          this.filterArr = [{ text: this.$t("禁用"), value: 0 }];
        } else {
          this.filterArr = [
            { text: this.$t("禁用"), value: 0 },
            { text: this.$t("启用"), value: 1 }
          ];
        }
      });
    },
    getLanguageText(flag) {
      const obj = languageList.find(item => item.value === flag)
      return (obj && obj.label) || ''
    }
  }
};
</script>

<style lang="scss">
.notice {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 15%;
  width: 600px;
  height: 400px;
  background: #fff;
  z-index: 36;
  padding: 20px;
  .notice-header {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    position: relative;
    .iconfont {
      position: absolute;
      right: 0;
    }
  }
  .notice-btn {
    text-align: center;
  }
  .notice-item {
    overflow: hidden;
    margin-bottom: 10px;
    margin-left: 100px;
    .el-input,
    .el-checkbox-group {
      width: 250px;
    }
    .el-checkbox-group {
      display: inline-block;
    }
    .el-textarea {
      width: 300px;
      textarea {
        height: 80px;
      }
    }
    label {
      width: 80px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
@media screen and (max-width: 1460px) {
  .notice-message {
    .width160 {
      width: 140px !important;
      input {
        width: 140px !important;
      }
    }
  }
}
</style>
