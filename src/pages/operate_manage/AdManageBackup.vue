<template>
  <div class="ad-manage" v-loading.fullscreen.lock="fullscreenLoading">
    <div>
      <div class="search">
        <div class="search-basic">
          <div class="search-basic-item width180">
            <label>{{ $t('标题') }}</label>
            <input type="text" v-model="title"/>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('展示客户端') }}</label>
            <el-select v-model="showValue" :placeholder="$t('请选择')" multiple @change="clientChange">
              <el-option
                v-for="item in showOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('广告类型') }}</label>
            <el-select v-model="typeValue" :placeholder="$t('请选择')" multiple>
              <el-option
                v-for="item in trueTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('状态') }}</label>
            <el-select v-model="statusValue" :placeholder="$t('请选择')" multiple>
              <el-option
                v-for="item in statusOptions"
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
              <label v-for="(i,index) in bts" class="xbutton" :style="{background: index ==btsSmId?'#3a8ee6':''}"
                     @click="handleCommand(i.ac,index)" :key="index">{{i.name}}</label>
            </div>
            <el-date-picker
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="startTime"
              type="datetime"
              @change="pickTime1"
              :placeholder="$t('选择日期时间')">
            </el-date-picker>
            <el-date-picker
              style="margin-left: 16px"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="endTime"
              type="datetime"
              @change="pickTime2"
              :placeholder="$t('选择日期时间')">
            </el-date-picker>
          </div>
        </div>
        <div class="div-search-btn" style="bottom: 40px">
          <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
          <el-button plain @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
        </div>
      </div>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button style="right:80px" class="iconfont icon-export el-button-delete" plain type="primary" size="mini"
                   v-show="multipleSelection.length>0"
                   @click.native="deleteArrAd">{{ $t('批量删除') }}
        </el-button>
        <el-button icon="el-icon-circle-plus-outline" plain type="primary" size="mini" @click="addAd">{{ $t('新增') }}
        </el-button>
      </el-row>
      <div class="search-form">
        <el-table max-height="480"
          :data="tableData"
          v-loading='loading'
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            :label="$t('序号')"
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :label="$t('全选')"
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column :label="$t('标题')">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row, 3)" type="text" size="small">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="advTypeText"
            :label="$t('广告类型')"
            width="300">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row, 3)" type="text" size="small">{{scope.row.advTypeText}} <span
                v-if="scope.row.advTypeChild !=0">
                 >
                {{scope.row.advTypeChild}}
              </span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="clientShowText"
            :label="$t('展示客户端')">
          </el-table-column>
          <el-table-column
            :label="$t('图片')">
            <template slot-scope="scope">
              <img :src="scope.row.clientShow === 0 ? scope.row.picPcPath : scope.row.picMbPath" width="50" height="50"
                   class="head_pic" @click="showImg(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="advTypeChildNum" :label="$t('排序')" width="100">
          </el-table-column>
          <el-table-column
            prop="useTimeText"
            width="280"
            :formatter="timeFilter2"
            :label="$t('有效期')">
          </el-table-column>
          <el-table-column
            prop="creater"
            :label="$t('创建人')">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="140"
            :formatter="timeFilter"
            :label="$t('创建时间')">
          </el-table-column>
          <el-table-column
            :label="$t('是否启用')"
            prop="available">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.available" active-color="#13ce66" inactive-color="#ff4949"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t($t(''操作''))" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="showDetail(scope.row, 2)">[{{ $t('编辑') }}]</el-button>
              <el-button type="text" size="small" @click.native="deleteOneAd(scope.row)">[{{ $t('删除') }}]</el-button>
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
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog @close="cancel" :title="dialogTitle" :visible.sync="dialogShow">
      <el-form class="small-space small-title" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('广告类型')">
              <el-select v-model="innerTypeValue"  :placeholder="$t('请选择')" @change="typeChange"
                         class="width100p">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('分类类型')" v-show="innerTypeValue==0">
              <el-select v-model="innerTypeValueChild"  :placeholder="$t('请选择')" @change="typeChange"
                         class="width100p">
                <el-option
                  v-for="item in typeOptionsChild"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('广告标题')">
              <el-input class="input"  type="text" v-model="adTitle"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('有效期')">
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker class="width100p"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  v-model="useStartTime"

                                  type="datetime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="center">~</el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker class="width100p"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  v-model="useEndTime"

                                  type="datetime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('显示客户端')">
              <el-checkbox v-model="pcCheckbox"  @change="pcCheckChange">{{ $t('PC端') }}</el-checkbox>
              <el-checkbox v-show="innerTypeValue===0"  v-model="moCheckbox"
                           @change="mobileCheckChange">{{ $t('移动端') }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="innerTypeValue!==1 && innerTypeValue!==2">
            <el-form-item :label="$t('排序号')">
              <el-input type="number" v-model.number="sortId" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="uploader blue width100p" :label="$t('PC端图片')">
              <input :style='pcStyleObject' type="text" class="filename" readonly="" v-model="inputPcName"
                     style="width: calc(100% - 100px);">
              <input type="button"  name="file" class="button" :value="$t('浏览')"
                     :style='disabledStyleObject'>
              <input ref="pc"  type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                     @change="getPcFile($event)"
                     :style='disabledStyleObject'>
              <span class="upload-span" v-show="picShow " @click="previewImgOpen(rowData.picPcPath)">{{ $t('查看已上传的图片') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="innerTypeValue===0">
            <el-form-item class="uploader blue width100p" :label="$t('移动端图片')">
              <input :style='mbStyleObject' type="text" class="filename" readonly="" v-model="inputMobileName"
                     style="width: calc(100% - 100px);">
              <input type="button"  name="file" class="button" :value="$t('浏览')"
                     :style='disabledStyleObject'>
              <input ref="pc"  type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                     @change="getMobileFile($event)"
                     :style='disabledStyleObject'>
              <span class="upload-span" v-show="mbShow" @click="previewImgOpen(rowData.picMbPath)">{{ $t('查看已上传的图片') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('图片跳转目标')">
              <el-radio v-model="radio"  label="0" @change="innerJump">{{ $t('站内(在当前页打开)') }}</el-radio>
              <el-radio v-model="radio"  label="1" @change="outJump">{{ $t('站外(在新窗口打开)') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" v-show="radio === '0'">
              <el-col :span="11">
                <el-select v-model="actTypeValue"  :placeholder="$t('请选择')" @change="getClassifyAct"
                           class="width100p">
                  <el-option
                    v-for="item in actTypeOptions"
                    :key="item.id"
                    :label="item.catName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2" style="height:20px"></el-col>
              <el-col :span="11">
                <el-select v-model="actValue"  :placeholder="$t('请选择')" class="width100p">
                  <el-option
                    v-for="item in actOptions"
                    :key="item.id"
                    :label='item.activityName'
                    :value='item.id'>
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="radio === '1'">
            <el-form-item label="">
              <el-input class="input" placeholder="eg:https://www.baidu.com"  type="text"
                        v-model="outUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button  @click.native="cancel">{{ $t('取消') }}</el-button>
        <el-button type="primary"  @click.native="submit($event)">{{ $t('确定') }}
        </el-button>
      </div>
    </el-dialog>
    <!--图片预览-->
    <Overlay v-show="centerDialogVisible" @click.native="centerDialogVisible = false"></Overlay>
    <div v-show="centerDialogVisible" class="preview-img">
      <p><i class="el-icon-error" @click="centerDialogVisible = false"></i></p>
      <img :src="picPathImg" style="height:100px">
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import systemConfig from '../../config/config.js'
  import Overlay from '../../components/Overlay.vue'
  export default {
    data () {
      return {
        btsSmId: 10,
        bts: [
          {
            name: this.$t('今天'),
            ac: 'today'
          },
          {
            name: this.$t('昨天'),
            ac: 'yesterday'
          },
          {
            name: this.$t('前天'),
            ac: 'beforeYesterday'
          },
          {
            name: this.$t('本周'),
            ac: 'currentWeek'
          },
          {
            name: this.$t('上周'),
            ac: 'previousWeek'
          },
        ],
        sortId: '',
        title: '',
        showValue: [],
        showOptions: [{
          label: 'PC',
          value: 0
        }, {
          label: 'H5',
          value: 1
        }],
        typeValue: [],
        typeValues: [],
        statusValues: [],
        innerTypeValue: 0,
        innerTypeValueChild: 1,
        trueTypeOptions: [],
        typeOptions: [{
          label: this.$t('轮播图'),
          value: 0
        }, {
          label: this.$t('左对联'),
          value: 1
        }, {
          label: this.$t('右对联'),
          value: 2
        }, {
          label: this.$t('弹窗'),
          value: 3
        }],
        typeOptionsChild: [{
          label: this.$t('首页'),
          value: 1
        }, {
          label: this.$t('真人'),
          value: 2
        }, {
          label: this.$t('电子'),
          value: 3
        }, {
          label: this.$t('体育'),
          value: 4
        }, {
          label: this.$t('彩票'),
          value: 5
        }, {
          label: this.$t('手机'),
          value: 6
        }],
        statusValue: [],
        statusOptions: [{
          label: this.$t('禁用'),
          value: 0
        }, {
          label: this.$t('启用'),
          value: 1
        }],
        showExtend: false,
        startTime: '',
        endTime: '',
        tableData: [],
        total: 0,
        adShow: false,
        rowData: {},
        multipleSelection: [],
        actOptions: [],
        actValue: '',
        actTypeOptions: [],
        actTypeValue: '',
        radio: '0',
        mobileShow: false,
        pcShow: false,
        useEndTime: '',
        isEdit: false,
        useStartTime: '',
        adTitle: '',
        actionTitle: '',
        pcCheckbox: false,
        moCheckbox: false,
        pcPreview: false,
        mobilePreview: false,
        centerDialogVisible: false,
        picPathImg: '',
        flag: '', // flag 1新增  2修改 3查看
        outUrl: '',
        filterArr: [{text: this.$t('禁用'), value: 0}, {text: this.$t('启用'), value: 1}],
        previewImgShow: false,
        uploadSrc: '',
        inputMobileName: '',
        inputPcName: '',
        pcFile: '',
        mobileFile: '',
        dialogTitle: '',
        dialogShow: false
      }
    },
    components: {
      Overlay
    },
    created() {
      this.getData()
      this.getClassify()
      this.trueTypeOptions = this.typeOptions
    },
    computed: {
      pcStyleObject() {
        return this.rowData && this.rowData.picPcPath ? {'padding-left': '150px'} : ''
      },
      mbStyleObject() {
        return this.rowData && this.rowData.picMbPath ? {'padding-left': '150px'} : ''
      },
      disabledStyleObject() {
        return this.isEdit ? {
          'background-color': ' #f5f7fa',
          'border-color': '#e4e7ed',
          'color': '#c0c4cc',
          'cursor': 'not-allowed'
        } : ''
      },
      picShow() {
        return this.rowData && this.rowData.picPcPath
      },
      mbShow() {
        return this.rowData && this.rowData.picMbPath
      },
      extendTitle() {
        if (this.showExtend) {
          return this.$t('收起')
        } else {
          return this.$t('更多')
        }
      },
      loading() {
        return this.$store.state.searchLoading
      },
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      fullscreenLoading() {
        return this.$store.state.fullscreenLoading
      },
      btnText() {
        if (this.flag === 1) {
          return this.$t('确定')
        } else {
          return this.$t('编辑')
        }
      },
      timeType: {
        get: function () {
          return this.$store.state.timeType
        },
        set: function () {
        }
      },
      buttonDisable() {
        return this.$store.state.buttonDisable
      }
    },
    methods: {
      pickTime1(val) {
        this.startTime = systemConfig.transferTimeByType(val, this.timeType)
      },
      pickTime2(val) {
        this.endTime = systemConfig.transferTimeByType(val, this.timeType)
      },
      clientChange(val) {
        if (val.length === 1 && val[0] === 1) {
          this.trueTypeOptions = [{label: this.$t('首页轮播图'), value: 0}]
        } else {
          this.trueTypeOptions = this.typeOptions
        }
      },
      previewImgOpen(src) {
        this.picPathImg = ''
        this.centerDialogVisible = true
        this.picPathImg = src
      },
      previewImgClose() {
        this.centerDialogVisible = false
        this.picPathImg = ''
      },
      handleSizeChange(val) {
        this.listReq.pageNo = 1
        this.listReq.pageSize = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.listReq.pageNo = val
        this.getData()
      },
      timeFilter(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        return systemConfig.transferTimeByType(date, this.timeType)
      },
      timeFilter2(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        let arr = date.split('~')
        if (arr.length === 2) {
          return systemConfig.transferTimeByType(arr[0], this.timeType) + '~' + systemConfig.transferTimeByType(arr[1], this.timeType)
        }
      },
      // 条件查询事件
      search() {
        if (this.startTime && this.endTime) {
          if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
            this.$message({
              type: 'warning',
              message: this.$t('申请时间不能大于结束时间')
            })
            return
          }
        }
        if (!this.startTime) {
          this.startTime = ''
        }
        if (!this.endTime) {
          this.endTime = ''
        }
        this.listReq.pageNo = 1
        this.getData()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      showImg(row) {
        this.centerDialogVisible = true
        this.picPathImg = (row.clientShow == 1 ? row.picMbPath : row.picPcPath)
      },
      // 弹框显示
      showDetail(rowData, flag) {
        if (flag === 3) {
          this.actionTitle = this.$t('广告详情')
          this.isEdit = true
        }
        if (flag === 2) {
          this.actionTitle = this.$t('编辑广告')
          this.isEdit = false
        }
        this.flag = flag
        this.$axios.get(systemConfig.urls.opradvInfo + rowData.id).then(res => {
          this.rowData = res.data.oprAdv
          this.adShow = true
          this.innerTypeValue = this.rowData.advType
          this.innerTypeValueChild = this.rowData.advTypeChild
          this.sortId = this.rowData.advTypeChildNum
          this.adTitle = this.rowData.title
          this.useStartTime = this.rowData.useStart
          this.useEndTime = this.rowData.useEnd
          if (this.rowData.clientShow == 0) {
            this.pcCheckbox = true
            this.pcShow = true
            this.pcPreview = true
          }
          if (this.rowData.clientShow == 1) {
            this.moCheckbox = true
            this.mobileShow = true
            this.mobilePreview = true
          }
          if (this.rowData.clientShow == 2) {
            this.moCheckbox = true
            this.pcCheckbox = true
            this.pcShow = true
            this.mobileShow = true
            this.pcPreview = true
            this.mobilePreview = true
          }
          this.actValue = this.rowData.activityId
          this.actTypeValue = this.rowData.actId
          if (this.actTypeValue) {
            this.getClassifyAct(this.actTypeValue)
          }
          this.outUrl = this.rowData.outStation
        })
      },
      showAdDetail() {
        this.flag = 2
        this.dialogTitle = this.$t('编辑广告')
        this.isEdit = false
      },
      more() {
        this.showExtend = !this.showExtend
      },
      reset() {
        this.title = ''
        this.showValue = []
        this.typeValue = []
        this.statusValue = []
        this.startTime = ''
        this.endTime = ''
      },
      filterTag(value, row) {
        return row.available === value
      },
      statusFilter(status) {
        if (status) {
          return this.$t('启用')
        } else {
          return this.$t('禁用')
        }
      },
      indexMethod(index) {
        return index + 1
      },
      handleCommand(command, index) {
        this.btsSmId = index
        switch (command) {
          case 'today':
            this.startTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '23:59:59', this.timeType)
            break
          case 'yesterday':
            this.startTime = systemConfig.transferTimeByType(systemConfig.getYesterday() + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getYesterday() + ' ' + '23:59:59', this.timeType)
            break
          case 'beforeYesterday':
            this.startTime = systemConfig.transferTimeByType(systemConfig.getBeforeYesterday() + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getBeforeYesterday() + ' ' + '23:59:59', this.timeType)
            break
          case 'currentWeek':
            this.startTime = systemConfig.transferTimeByType(systemConfig.getCurrentWeek()[0] + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getCurrentWeek()[1] + ' ' + '23:59:59', this.timeType)
            break
          case 'previousWeek':
            this.startTime = systemConfig.transferTimeByType(systemConfig.getPreviousWeek()[0] + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getPreviousWeek()[1] + ' ' + '23:59:59', this.timeType)
            break
          default:
            this.startTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '00:00:00', this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' ' + '23:59:59', this.timeType)
            break
        }
      },
      cancel() {
        this.dialogShow = false
        this.adReset()
        this.$store.state.buttonDisable = false
      },
      typeChange(value) {
        if (value === 0) {
          this.mobileShow = true
          this.pcShow = true
          this.pcCheckbox = true
          this.moCheckbox = true
        } else {
          this.mobileShow = false
          this.moCheckbox = false
          this.pcShow = true
          this.pcCheckbox = true
        }
      },
      pcCheckChange(val) {
        this.pcShow = !this.pcShow
      },
      mobileCheckChange(val) {
        this.mobileShow = !this.mobileShow
      },
      // 获取pc图片
      getPcFile(event) {
        if (event.target.files[0]) {
          let arr = event.target.files[0].name.split('.')
          if ('gif,jpeg,jpg,png,svg'.indexOf(arr[arr.length - 1]) > -1) {
            this.pcFile = event.target.files[0]
            this.inputPcName = event.target.files[0].name
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('上传图片格式错误，请重新上传')
            })
            this.pcFile = ''
            this.inputPcName = ''
          }
        }
      },
      // 获取mobile图片
      getMobileFile(event) {
        if (event.target.files[0]) {
          let arr = event.target.files[0].name.split('.')
          if ('gif,jpeg,jpg,png,svg'.indexOf(arr[arr.length - 1]) > -1) {
            this.mobileFile = event.target.files[0]
            this.inputMobileName = event.target.files[0].name
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('上传图片格式错误，请重新上传')
            })
            this.mobileFile = ''
            this.inputMobileName = ''
          }
        }
      },
      adReset() {
        this.innerTypeValue = ''
        this.adTitle = ''
        this.useStartTime = ''
        this.useEndTime = ''
        this.outUrl = ''
        this.actTypeValue = ''
        this.actValue = ''
        this.mobileShow = false
        this.pcShow = false
        this.pcCheckbox = false
        this.moCheckbox = false
        this.pcFile = ''
        this.mobileFile = ''
        if (this.$refs.pc) {
          this.$refs.pc.value = ''
        }
        if (this.$refs.mobile) {
          this.$refs.mobile.value = ''
        }
        this.isEdit = false
        this.inputPcName = ''
        this.inputMobileName = ''
      },
      toggle(row) {
        this.$axios.post(systemConfig.urls.availableAd, {id: row.id, available: row.available}).then(res => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        })
      },
      deleteArrAd() {
        let deleteArr = []
        for (let j = 0; j < this.multipleSelection.length; j++) {
          deleteArr.push(this.multipleSelection[j].id)
        }
        let deleteObj = {'ids': deleteArr}
        this.deleteAd(deleteObj)
      },
      deleteOneAd(row) {
        let deleteArr = []
        deleteArr.push(row.id)
        let deleteObj = {'ids': deleteArr}
        this.deleteAd(deleteObj)
      },
      deleteAd(deleteObj) {
        this.$store.state.fullscreenLoading = true
        this.$axios.post(systemConfig.urls.deleteAd, deleteObj).then((resp) => {
          this.getData()
        })
      },
      addAd() {
        this.dialogShow = true
        this.rowData = {}
        this.dialogTitle = this.$t('新增广告')
        this.flag = 2
        this.pcPreview = false
        this.mobilePreview = false
      },
      //  + '&useStart=' + this.startTime + '&useEnd=' + this.endTime
      getData() {
        this.tableData = []
        this.$store.state.searchLoading = true
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&title=' + this.title + '&clientShows=' + this.showValue + '&advTypes=' + this.typeValue + '&availables=' + this.statusValue
        if (this.startTime) {
          url += '&startTime=' + systemConfig.transferTimeByType(this.startTime, this.timeType)
        }
        if (this.endTime) {
          url += '&endTime=' + systemConfig.transferTimeByType(this.endTime, this.timeType)
        }
        this.$axios.get(systemConfig.urls.getAdList + url).then((resp) => {
          let data = resp.data.page.list
          for (let i = 0; i < data.length; i++) {
            data[i].useTimeText = systemConfig.transferTimeByType(data[i].useStart, this.timeType) + '~' + systemConfig.transferTimeByType(data[i].useEnd, this.timeType)
            switch (data[i].clientShow) {
              case 0:
                data[i].clientShowText = 'PC'
                break
              case 1:
                data[i].clientShowText = 'H5'
                break
              case 2:
                data[i].clientShowText = 'PC,H5'
                break
            }
            switch (data[i].advType) {
              case 0:
                data[i].advTypeText = this.$t('轮播图')
                break
              case 1:
                data[i].advTypeText = this.$t('左对联')
                break
              case 2:
                data[i].advTypeText = this.$t('右对联')
                break
              case 3:
                data[i].advTypeText = this.$t('弹窗')
                break
            }
            // 0：空值，1：首页，2：真人，3：电子，4：体育，5：彩票
            switch (data[i].advTypeChild) {
              case 1:
                data[i].advTypeChild = this.$t('首页')
                break
              case 2:
                data[i].advTypeChild = this.$t('真人')
                break
              case 3:
                data[i].advTypeChild = this.$t('电子')
                break
              case 4:
                data[i].advTypeChild = this.$t('体育')
                break
              case 5:
                data[i].advTypeChild = this.$t('彩票')
                break
              case 6:
                data[i].advTypeChild = this.$t('手机')
                break
            }
          }
          if (this.statusValue.length === 1 && this.statusValue[0] === 1) {
            this.filterArr = [{text: this.$t('启用'), value: 1}]
          } else if (this.statusValue.length === 1 && this.statusValue[0] === 0) {
            this.filterArr = [{text: this.$t('禁用'), value: 0}]
          } else {
            this.filterArr = [{text: this.$t('禁用'), value: 0}, {text: this.$t('启用'), value: 1}]
          }
          this.tableData = data
          this.total = resp.data.page.totalCount
        })
      },
      getClassify() {
        this.$axios.get(systemConfig.urls.getClassifyValid).then((resp) => {
          this.actTypeOptions = resp.data.page
        })
      },
      getClassifyAct(value) {
        let url = '?actCatId=' + value
        this.$axios.get(systemConfig.urls.getActivityListAll + url).then((resp) => {
          this.actOptions = resp.data.data
        })
      },
      submit(event) {
        event.preventDefault()
        if (this.innerTypeValue === '') {
          this.$message({
            type: 'warning',
            message: this.$t('广告类型不能为空')
          })
          return
        }
        if (!this.adTitle) {
          this.$message({
            type: 'warning',
            message: this.$t('广告标题不能为空')
          })
          return
        }
        if (!this.useStartTime) {
          this.$message({
            type: 'warning',
            message: this.$t('有效开始时间不能为空')
          })
          return
        }
        if (!this.useEndTime) {
          this.$message({
            type: 'warning',
            message: this.$t('有效结束不能为空')
          })
          return
        }
        if (new Date(this.useEndTime).getTime() < new Date(this.useStartTime).getTime()) {
          this.$message({
            type: 'warning',
            message: this.$t('结束时间不能小于开始时间不能为空')
          })
          return
        }
        if (this.pcCheckbox === false && this.moCheckbox === false) {
          this.$message({
            type: 'warning',
            message: this.$t('显示客户端不能为空')
          })
          return
        }
        if (this.pcCheckbox === true) {
          if (!this.rowData.picPcPath) {
            if (this.pcFile === '') {
              this.$message({
                type: 'warning',
                message: this.$t('请选择PC端图片')
              })
              return
            }
          }
        }
        if (this.moCheckbox === true) {
          if (!this.rowData.picMbPath) {
            if (this.mobileFile === '') {
              this.$message({
                type: 'warning',
                message: this.$t('请选择移动端图片')
              })
              return
            }
          }
        }
        if (this.radio === '0') {
          if (!this.actTypeValue) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择图片跳转目标')
            })
            return
          }
          if (!this.actValue) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择图片跳转目标')
            })
            return
          }
        } else {
          if (!this.outUrl) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择跳转链接')
            })
            return
          }
        }
        let formData = new FormData()
        if (this.pcFile) {
          formData.append('uploadPcFile', this.pcFile)
        }
        if (this.mobileFile) {
          formData.append('uploadMbFile', this.mobileFile)
        }
        var clientShow
        if (this.moCheckbox == true) {
          clientShow = 1
        }
        if (this.pcCheckbox == true) {
          clientShow = 0
        }
        if (this.pcCheckbox === true && this.moCheckbox === true) {
          clientShow = 2
        }
        let oprAdv = {
          'id': this.rowData.id || '',
          'advType': this.innerTypeValue,
          'advTypeChild': this.innerTypeValueChild,
          'advTypeChildNum': this.sortId,
          'title': this.adTitle,
          'useStart': this.useStartTime,
          'useEnd': this.useEndTime,
          'clientShow': clientShow,
          'picTarget': this.radio,
          'actId': this.actTypeValue,
          'activityId': this.actValue,
          'outStation': this.outUrl,
          'available': this.rowData.available || 1
        }
        formData.append('oprAdv', JSON.stringify(oprAdv))
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$store.state.fullscreenLoading = true
        this.$store.state.buttonDisable = true
        this.$axios.post(this.rowData.id ? systemConfig.urls.updateAd : systemConfig.urls.saveAd, formData, config).then((resp) => {
          if (this.rowData.id) {
            this.$message({
              type: 'success',
              message: this.$t('更新成功')
            })
          } else {
            this.$message({
              type: 'success',
              message: this.$t('保存成功')
            })
          }
          this.cancel()
          this.getData()
          this.reset()
          this.$store.state.buttonDisable = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .ad {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 15%;
    width: 600px;
    height: 500px;
    background: #FFF;
    z-index: 36;
    padding: 20px;
    .ad-header {
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      position: relative;
      .iconfont {
        position: absolute;
        right: 0;
      }
    }

    .ad-item {
      margin-bottom: 10px;
      label {
        width: 100px;
        display: inline-block;
        text-align: right;
      }
      .input {
        width: 300px;
        display: inline-block;
      }
      .el-checkbox-group {
        display: inline-block;
        width: 250px;
      }
      .ad-btn {
        text-align: center;
      }
    }
  }
  @media screen and (min-width: 1500px) and (max-width: 1670px) {
    .ad-manage {
      .div-search-btn {
        bottom: 2px!important;
      }
    }
  }
</style>
