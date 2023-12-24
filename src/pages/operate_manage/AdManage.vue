<template>
  <div class="ad-manage">
    <div>
      <div class="search">
        <div class="search-basic clearfix" style="overflow: visible;">
          <div class="search-basic-item width180">
            <label>{{ $t('标题') }}</label>
            <input type="text" v-model="title" v-trim @keyup.enter="search()" />
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
                v-for="item in typeOptions"
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
          <div class="search-basic-item width180">
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
          <div class="search-basic-item width400" style="width:420px !important">
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
        <div class="div-search-btn" style="bottom: 30px">
          <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
          <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
        </div>
      </div>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button v-if="hasPermission('operate:opradv:delete')" style="right:80px" class="iconfont icon-export el-button-delete" plain type="primary" size="mini"
                   v-show="multipleSelection.length>0"
                   @click.native="deleteArrAd">{{ $t('批量删除') }}
        </el-button>
        <el-button v-if="hasPermission('operate:opradv:save')" icon="el-icon-circle-plus-outline" type="primary" size="mini" style="width: 100px;" @click="addAd">{{ $t('新增') }}
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
            align="center"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            v-if="hasPermission('operate:opradv:delete')"
            :label="$t('全选')"
            align="center"
            type="selection">
          </el-table-column>
          <el-table-column :label="$t('标题')" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('语言类型')" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small">{{ getLanguageText(scope.row.language) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="advTypeText"
            width="150"
            align="center"
            :label="$t('广告类型')">
            <template slot-scope="scope">
              <el-button type="text" size="small">{{scope.row.advTypeText}}
                <span v-if="scope.row.advTypeChild !==0">{{'>' + scope.row.advTypeChildText}}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="clientShowText"
            align="center"
            :label="$t('展示终端')">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('图片')">
            <template slot-scope="scope">
              <img :src="scope.row.imageList[0].pcPath ? scope.row.imageList[0].pcPath: scope.row.imageList[0].mbPath"
                   width="50" height="50"
                   class="head_pic" @click="showImg(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="advTypeChildNum" align="center" :label="$t('排序')" width="100">
          </el-table-column>
          <el-table-column
            prop="useTimeText"
            align="center"
            width="380"
            :formatter="timeFilter2"
            :label="$t('有效期')">
          </el-table-column>
          <el-table-column
            prop="creater"
            align="center"
            :label="$t('创建人')">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            width="180"
            :formatter="timeFilter"
            :label="$t('创建时间')">
          </el-table-column>
          <el-table-column
            :label="$t('是否启用')"
            align="center"
            prop="available">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.available" :disabled="!hasPermission('operate:opradv:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" min-width="100" align="center">
            <template slot-scope="scope">
              <span v-if="hasPermission('operate:opradv:update')" class="blue-color pointer" @click="showDetail(scope.row)">[{{ $t('编辑') }}]</span>
              <span v-if="hasPermission('operate:opradv:delete')" class="blue-color pointer" @click="deleteOneAd(scope.row)" v-show="scope.row.available === 0">[{{ $t('删除') }}]</span>
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

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog class="adManage-dialog" @close="cancel" :title="dialogTitle" :visible.sync="dialogShow">
      <el-form class="small-space" label-position="right" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('广告类型')">
              <el-select v-model="rowData.advType" :placeholder="$t('请选择')" @change="typeChange"
                         class="width100p">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disable">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('分类类型')" v-show="rowData.advType==0">
              <el-select v-model="rowData.advTypeChild" :placeholder="$t('请选择')"
                         class="width100p">
                <el-option
                  v-for="item in typeOptionsChild"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disable">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('语言类型')">
              <el-select v-model="rowData.language"
                         :placeholder="$t('请选择')"
                         class="width100p">
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
            <el-form-item :label="$t('广告标题')">
              <el-input class="input" type="text" v-model="rowData.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('有效期')">
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker class="width100p"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  v-model="rowData.useStart"
                                  type="datetime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="center">~</el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-date-picker class="width100p"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  v-model="rowData.useEnd"
                                  type="datetime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="rowData.advType!==1 && rowData.advType!==2">
            <el-form-item :label="$t('排序号')">
              <el-input type="number" v-model.number="rowData.advTypeChildNum"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item :label="$t('显示客户端')">
              <el-checkbox v-model="pcCheckbox" @change="pcCheckChange">{{ $t('PC端') }}</el-checkbox>
              <el-checkbox v-show="[0, 3, 4].includes(rowData.advType)" v-model="mbCheckbox" @change="mobileCheckChange">{{ $t('移动端') }}
              </el-checkbox>
            </el-form-item>
          </el-col>


          <div v-for="(item, index) in rowData.imageList" :key="index">
            <el-col class="loop-div" :span="24" v-show="pcPathShow">
              <div v-show="rowData.advType===1 || rowData.advType===2"><i v-show="index===2" class="el-icon-circle-plus"
                                                                          @click="addLoop(index)"></i><i
                v-show="index > 2" class="el-icon-remove" @click="deleteLoop(index)"></i></div>
              <el-form-item class="uploader blue width100p" :label="$t('PC端图片')">
                <input :class="[item.pcPath ? 'pl150': '']" type="text" class="filename" readonly=""
                       v-model="imgStr.pcPath"
                       style="width: calc(100% - 100px);">
                <input type="button" name="file" class="button" :value="$t('浏览')">
                <input ref="pc" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                       @change="getPcPath($event, index)">
                <span v-show="item.pcPath" class="upload-span" @click="previewImgOpen(item.pcPath)">{{ $t('查看已上传的图片') }}</span>
                <!-- 轮播图 -->
                <span class="img-type-tips" v-show="[0].includes(rowData.advType) && rowData.advTypeChild === 1">{{ $t('建议图片尺寸 1920*500px ，支持格式png/jpg/gif') }}</span>
                <span class="img-type-tips" v-show="[0].includes(rowData.advType) && rowData.advTypeChild !== 1">{{ $t('建议图片尺寸 1920*300px ，支持格式png/jpg/gif') }}</span>
                <!-- 左右对联 -->
                <span class="img-type-tips" v-show="[1, 2].includes(rowData.advType)">{{ $t('建议图片尺寸 120*100px ，支持格式png/jpg/gif') }}</span>
                <!-- 弹窗 -->
                <span class="img-type-tips" v-show="[3].includes(rowData.advType)">{{ $t('建议图片尺寸 （宽×高）：600×(140~400)px ,支持格式png/jpg/gif') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="mobilePathShow">
              <el-form-item class="uploader blue width100p" :label="$t('移动端图片')">
                <input :class="[item.mbPath ? 'pl150': '']" type="text" class="filename" readonly=""
                       v-model="imgStr.mbPath"
                       style="width: calc(100% - 100px);">
                <input type="button" name="file" class="button" :value="$t('浏览')">
                <input ref="pc" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                       @change="getMbPath($event, index)">
                <span v-show="item.mbPath" class="upload-span" @click="previewImgOpen(item.mbPath)">{{ $t('查看已上传的图片') }}</span>
                <!-- 轮播图 左右对联 -->
                <span class="img-type-tips" v-show="[0, 1, 2].includes(rowData.advType)">{{ $t('建议图片尺寸 708*300px ，支持格式png/jpg/gif') }}</span>
                <!-- 弹窗 -->
                <span class="img-type-tips" v-show="[3].includes(rowData.advType)">{{ $t('建议图片尺寸（宽×高）：310×(75~375)px ,支持格式png/jpg/gif') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('图片跳转目标')" size="mini">
                <el-radio v-model="item.picTarget" :label='0'>{{ $t('站内(在当前页打开)') }}</el-radio>
                <el-radio v-model="item.picTarget" :label='1'>{{ $t('站外(在新窗口打开)') }}</el-radio>
                <el-radio v-model="item.picTarget" :label='2'>{{ $t('不跳转') }}</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" v-show="item.picTarget === 0">
                <el-col :span="11">
                  <el-select v-model="item.actId" :placeholder="$t('请选择')" @change="getClassifyAct(item.actId, index + 1)"
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
                  <el-select v-model="item.activityId" :placeholder="$t('请选择')" class="width100p">
                    <el-option
                      v-for="item in actOptions[index]"
                      :key="item.id"
                      :label='item.activityName'
                      :value='item.id'>
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-show="item.picTarget === 1">
              <el-form-item>
                <el-input class="input" placeholder="eg:https://www.baidu.com" type="text"
                          v-model="item.outStation"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="cancel">{{ $t('取消') }}</el-button>
        <el-button type="primary" :disabled="buttonDisabled" @click.native="submit($event)">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!--图片预览-->
    <Overlay v-show="picPreviewShow" @click.native="picPreviewShow = false"></Overlay>
    <div v-show="picPreviewShow" class="preview-img">
      <p><i class="el-icon-error" @click="picPreviewShow = false"></i></p>
      <img :src="picPathImg">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import systemConfig from '../../config/config.js'
  import Overlay from '../../components/Overlay.vue'
  import queryStore from '../../mixins/queryStore'
  import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
  import {mapGetters} from 'vuex'
  import { lang } from "@/i18n";
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
    name: 'adManage',
    mixins: [Mixin, queryStore(['title', 'showValue', 'typeValue', 'statusValue', 'startTime', 'endTime'])],
    data() {
      return {
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
        typeOptions: [{
          label: this.$t('轮播图'),
          value: 0
        }, {
          label: this.$t('左对联'),
          value: 1,
          disable:true
        }, {
          label: this.$t('右对联'),
          value: 2,
          disable:true
        }, {
          label: this.$t('弹窗'),
          value: 3,
          // disable:true
        }, {
          label: this.$t('优惠banner'),
          value: 4,
          // disable:true
        }],
        trueTypeOptions: [],
        typeOptionsChild: [{
          label: this.$t('首页'),
          value: 1
        }, {
          label: this.$t('真人'),
          value: 2,
          // disable:true
        }, {
          label: this.$t('电子'),
          value: 3
        }, {
          label: this.$t('体育'),
          value: 4,
          // disable:true
        }, {
          label: this.$t('彩票'),
          value: 5
        }/* , {
          label: '手机',
          value: 6,
          disable:true
        } */ , {
          label: this.$t('棋牌'),
          value: 7,
        },{
          label: this.$t('游戏'),
          value: 8,
        },{
          label: this.$t('我的'),
          value: 9,
        }],
        statusValue: [],
        statusOptions: [{
          label: this.$t('禁用'),
          value: 0
        }, {
          label: this.$t('启用'),
          value: 1
        }],
        startTime: '',
        endTime: '',
        tableData: [],
        total: 0,
        rowData: {
          title: '',
          clientShow: '',
          advType: '',
          useStart: '',
          useEnd: '',
          available: 1,
          language: 'zh',
          imageList: [{
            actId: '',
            activityId: '',
            advId: '',
            mbPath: '',
            outStation: '',
            pcPath: '',
            picTarget: 0,
          }],
        },
        multipleSelection: [],
        actOptions: [], // 图片跳转目标 最多三张
        actTypeOptions: [], // 图片跳转目标
        picPreviewShow: false,
        pcFile: '',
        mobileFile: '',
        dialogTitle: '',
        dialogShow: false,
        pcCheckbox: false,
        pcPathShow: false,
        mbCheckbox: false,
        mobilePathShow: false,
        imgStr: {pcPath: '', mbPath: ''},
        picPathImg: '',
        lanList: languageList,
        language: '',
        dialogLanguage: 'zh',
      }
    },
    components: {
      Overlay,
      StartAndEndTimeSelector
    },
    created() {
      this.getData()
      this.getClassify()
      this.trueTypeOptions = this.typeOptions
    },
    computed: {
      ...mapGetters(['hasPermission']),
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
      timeType: {
        get: function () {
          return this.$store.state.timeType
        },
        set: function () {
        }
      },
      buttonDisabled() {
        return this.$store.state.buttonDisabled
      },
      lanListS () {
        let arr = JSON.parse(JSON.stringify(languageList))
        arr.unshift({ value: '', label: lang("全部")})
        return arr
      },
    },
    methods: {
      addLoop(index) {
        let length = this.rowData.imageList.length
        if (length === 5) {
          this.$message({
            type: 'warning',
            message: this.$t('最多添加5条对联')
          })
          return
        }
        this.imgPathList.push({pcPath: '', mbPath: ''})
        let newObj = {
          actId: '',
          activityId: '',
          advId: '',
          mbPath: '',
          outStation: '',
          pcPath: '',
          picTarget: 0,
        }
        this.rowData.imageList.push(newObj)
      },
      deleteLoop(index) {
        this.rowData.imageList.splice(index, 1)
      },
      clientChange(val) {
        if (val.length === 1 && val[0] === 1) {
          this.trueTypeOptions = [{label: this.$t('首页轮播图'), value: 0}]
        } else {
          this.trueTypeOptions = this.typeOptions
        }
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
        this.getCurrentRecodeTime()
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
        this.picPreviewShow = true
        this.picPathImg = row.imageList[0].pcPath ? row.imageList[0].pcPath: row.imageList[0].mbPath
      },
      previewImgOpen(src) {
        this.picPreviewShow = true
        this.picPathImg = src
      },
      // 弹框显示
      showDetail(rowData) {
        this.dialogTitle = this.$t('编辑广告')
        // this.reset()
        this.imgPathList = [{pcPath: '', mbPath: ''}]
        this.$axios.get(systemConfig.urls.opradvInfo + rowData.id).then(res => {
          this.rowData = res.data.oprAdv
          this.rowData.imageList.map((item) => {
            this.imgPathList.push({pcPath: '', mbPath: ''})
            if (!item.outStation) {
              this.getClassifyAct(item.actId)
            }
          })
          setTimeout(() => {
            this.dialogShow = true
          }, 500) // 保证上面的异步操作完成
          if (this.rowData.clientShow === 0) {
            this.pcPathShow = true
            this.pcCheckbox = true
            this.mobilePathShow = false
            this.mbCheckbox = false
          } else if (this.rowData.clientShow === 1) {
            this.pcPathShow = false
            this.pcCheckbox = false
            this.mobilePathShow = true
            this.mbCheckbox = true
          } else {
            this.pcPathShow = true
            this.pcCheckbox = true
            this.mobilePathShow = true
            this.mbCheckbox = true
          }
        })
      },
      reset(bool = true) {
        this.title = ''
        this.showValue = []
        this.statusValue = []
        this.startTime = ''
        this.endTime = ''
        this.imgPathList = [{pcPath: '', mbPath: ''}]
        this.actOptions = []
        this.typeValue = []
        this.rowData = {
          available: 1,
          title: '',
          clientShow: '',
          advType: '',
          advTypeChild: '',
          useStart: '',
          useEnd: '',
          language: 'zh',
          imageList: [{
            actId: '',
            activityId: '',
            advId: '',
            mbPath: '',
            outStation: '',
            pcPath: '',
            picTarget: 0,
          }],
        }
        if (!bool) return
        this.search()
      },
      indexMethod(index) {
        return index + 1
      },
      cancel() {
        this.dialogShow = false
        this.reset(false)
        this.$store.state.buttonDisabled = false
      },
      typeChange(value) {
        // 清空数据

        // 清除file的value 避免切换类型 再选同一张图片触发不了原声的onchange回调
        var imgFileElementList = this.$refs.pc
        for (let i = 0;i< imgFileElementList.length; i++) {
          imgFileElementList[i].value = ''
        }
        this.imgPathList = [{pcPath: '', mbPath: ''}]
        this.rowData.title = ''
        this.rowData.useStart = ''
        this.rowData.useEnd = ''
        this.rowData.advTypeChild = ''
        this.rowData.imageList = [{
          actId: '',
          activityId: '',
          advId: this.rowData.id || '',
          mbPath: '',
          outStation: '',
          pcPath: '',
          picTarget: 0,
        }]
        if ([0, 3].includes(value)) {
          this.pcPathShow = true
          this.pcCheckbox = true
          this.mobilePathShow = true
          this.mbCheckbox = true
        } else {
          this.pcPathShow = true
          this.pcCheckbox = true
          this.mobilePathShow = false
          this.mbCheckbox = false
        }
        if (value === 1 || value === 2) {
          // 至少三个
          this.addLoop()
          this.addLoop()
        }
      },
      // 如果是左右对联不允许反选 如果是轮播和弹窗必须选择一个
      pcCheckChange(val) {
        if (this.rowData.advType !== '') {
          if (this.rowData.advType === 1 || this.rowData.advType === 2) {
            this.$message({
              type: 'warning',
              message: this.$t('至少选择一个终端')
            })
            this.pcCheckbox = !this.pcCheckbox
          } else {
            if (!this.mbCheckbox) {
              this.$message({
                type: 'warning',
                message: this.$t('至少选择一个终端')
              })
              this.pcCheckbox = !this.pcCheckbox
            } else {
              // 隐藏PC图片选择 重置pcpath
              this.pcPathShow = !this.pcPathShow
              this.rowData.imageList.forEach((item) => {
                item.pcPath = ''
              })
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('请选择广告类型')
          })
          this.pcCheckbox = !this.pcCheckbox
        }
      },
      mobileCheckChange(val) {
        if (this.rowData.advType !== '') {
          if (this.rowData.advType === 1 || this.rowData.advType === 2) {
            this.$message({
              type: 'warning',
              message: this.$t('对联不允许反选')
            })
            this.mbCheckbox = !this.mbCheckbox
          } else {
            if (!this.pcCheckbox) {
              this.$message({
                type: 'warning',
                message: this.$t('pc端、移动端必须选择一个')
              })
              this.mbCheckbox = !this.mbCheckbox
            } else {
              if (!this.pcCheckbox) {
                this.$message({
                  type: 'warning',
                  message: this.$t('pc端、移动端必须选择一个')
                })
                this.mbCheckbox = !this.mbCheckbox
              } else {
                // 隐藏移动图片选择 重置mbpath
                this.mobilePathShow = !this.mobilePathShow
                this.rowData.imageList.forEach((item) => {
                  item.mbPath = ''
                })
              }
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('请选择广告类型')
          })
          this.mbCheckbox = !this.mbCheckbox
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
              this.rowData.imageList[index].pcPath = res.data.path
            })
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('上传图片格式错误，请重新上传')
            })
          }
        }
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
              this.rowData.imageList[index].mbPath = res.data.path
            })
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('上传图片格式错误，请重新上传')
            })
          }
        }
      },

      toggle(row) {
        this.rowData = row
        this.$axios.post(systemConfig.urls.availableAd, row).then(res => {
          if (res.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: this.$t('状态修改成功')
            })
          }
        }).catch(err => {
          if (this.rowData.available === 0) {
            this.rowData.available = 1
          } else {
            this.rowData.available = 0
          }
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
        this.$axios.post(systemConfig.urls.deleteAd, deleteObj).then((resp) => {
          this.getData()
        })
      },
      addAd() {
        this.reset()
        this.dialogTitle = this.$t('新增广告')
        this.dialogShow = true
      },
      getData() {
        this.tableData = []
        this.$store.state.searchLoading = true
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&title=' + this.title + '&clientShows=' + this.showValue + '&advTypes=' + this.typeValue + '&availables=' + this.statusValue +  "&language=" +
        this.language;
        if (this.startTime) {
          url += '&startTime=' + systemConfig.transferTimeByType(this.startTime, this.timeType)
        }
        if (this.endTime) {
          url += '&endTime=' + systemConfig.transferTimeByType(this.endTime, this.timeType)
        }
        this.$axios.get(systemConfig.urls.getAdList + url).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
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
              case 4:
                data[i].advTypeText = this.$t('优惠banner')
                break
            }
            // 0：空值，1：首页，2：真人，3：电子，4：体育，5：彩票
            switch (data[i].advTypeChild) {
              case 1:
                data[i].advTypeChildText = this.$t('首页')
                break
              case 2:
                data[i].advTypeChildText = this.$t('真人')
                break
              case 3:
                data[i].advTypeChildText = this.$t('电子')
                break
              case 4:
                data[i].advTypeChildText = this.$t('体育')
                break
              case 5:
                data[i].advTypeChildText = this.$t('彩票')
                break
              case 6:
                data[i].advTypeChildText = this.$t('手机')
                break
              case 7:
                data[i].advTypeChildText = this.$t('棋牌')
                break
              case 8:
                data[i].advTypeChildText = this.$t('游戏')
                break
              case 9:
                data[i].advTypeChildText = this.$t('我的')
                break
            }
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
      getClassifyAct(value, index) {
        // index===1 代表第一个在改变
        let url = '?actCatIdList=' + (value === null ? '' : value)
        this.$axios.get(systemConfig.urls.getActivityListAll + url).then((resp) => {
          if (index) {
            if (this.actOptions.length === 0) {
              this.actOptions.push(resp.data.data)
            } else {
              this.actOptions.splice(index - 1, 0, resp.data.data)
              this.rowData.imageList[index - 1].activityId = ''
            }
          } else {
            this.actOptions.push(resp.data.data)
          }
        })
      },
      submit(event) {
        event.preventDefault()
        if (this.rowData.advType === '') {
          this.$message({
            type: 'warning',
            message: this.$t('广告类型不能为空')
          })
          return
        }
        if (this.rowData.advType === 0) {
          if (this.rowData.advTypeChild === '') {
            this.$message({
              type: 'warning',
              message: this.$t('分类类型不能为空')
            })
            return
          }
        }
        if (!this.rowData.title) {
          this.$message({
            type: 'warning',
            message: this.$t('广告标题不能为空')
          })
          return
        }
        if (!this.rowData.useStart) {
          this.$message({
            type: 'warning',
            message: this.$t('有效开始时间不能为空')
          })
          return
        }
        if (!this.rowData.useEnd) {
          this.$message({
            type: 'warning',
            message: this.$t('有效结束时间不能为空')
          })
          return
        }
        if (new Date(this.rowData.useEnd).getTime() < new Date(this.rowData.useStart).getTime()) {
          this.$message({
            type: 'warning',
            message: this.$t('结束时间不能小于开始时间不能为空')
          })
          return
        }
        if (this.rowData.advType === 0 || this.rowData.advType === 3) {
          if (!(/(^[1-9]\d*$)/.test(this.rowData.advTypeChildNum))) {
            this.$message({
              type: 'warning',
              message: this.$t('排序号不能为空且要大于0')
            })
            return
          }
        }
        for (let i = 0; i < this.rowData.imageList.length; i++) {
          /*
            '0 轮播图', '1 左对联', '2 右对联', '3 弹窗'
            目前只有轮播图有移动端图片
          */
          const advType = this.rowData.advType
          const {mbPath, pcPath} = this.rowData.imageList[i]
          if(this.pcCheckbox && pcPath === ''){
            this.$message({
              type: 'warning',
              message: this.$t('请选择pc端图片')
            })
            return
          }
          if(this.mbCheckbox){
            if([0, 3].includes(advType) && mbPath === ''){
              this.$message({
                type: 'warning',
                message: this.$t('请选择移动端图片')
              })
              return
            }
          }
          // if (this.rowData.advType === 1) {
          //   if (this.rowData.imageList[i].mbPath === '') {
          //     this.$message({
          //       type: 'warning',
          //       message: '请选择移动端图片'
          //     })
          //     return
          //   }
          // }
          // if (this.rowData.imageList[i].pcPath === '') {
          //   if (this.rowData.imageList[i].mbPath === '') {
          //     this.$message({
          //       type: 'warning',
          //       message: '请选择pc端图片'
          //     })
          //     return
          //   }
          // }
          // if (this.rowData.imageList[i].picTarget === 0) {
          //   if (!this.rowData.imageList[i].actId) {
          //     this.$message({
          //       type: 'warning',
          //       message: '请选择图片完整跳转目标'
          //     })
          //     return
          //   }
          //   if (!this.rowData.imageList[i].activityId) {
          //     this.$message({
          //       type: 'warning',
          //       message: '请选择图片完整跳转目标'
          //     })
          //     return
          //   }
          // } else {
          //   if (!this.rowData.imageList[i].outStation) {
          //     this.$message({
          //       type: 'warning',
          //       message: '请选择跳转链接'
          //     })
          //     return
          //   }
          // }
        }
        if (this.mbCheckbox == true) {
          this.rowData.clientShow = 1
        }
        if (this.pcCheckbox == true) {
          this.rowData.clientShow = 0
        }
        if (this.pcCheckbox === true && this.mbCheckbox === true) {
          this.rowData.clientShow = 2
        }
        this.$store.state.buttonDisabled = true
        setTimeout(() => {
          this.$store.state.buttonDisabled = false
        }, 5000)
        this.$axios.post(this.rowData.id ? systemConfig.urls.updateAd : systemConfig.urls.saveAd, this.rowData).then((resp) => {
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
          this.$store.state.buttonDisabled = false
        })
      },
      getLanguageText(flag) {
        const obj = languageList.find(item => item.value === flag)
        return (obj && obj.label) || ''
      }
    }
  }
</script>

<style lang="scss">
  .adManage-dialog {
    .el-form {
      border: 0;
    }
    .el-radio {
      margin-left: 0;
      margin-right: 5px;
    }
  }
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
        bottom: 2px !important;
      }
    }
  }

  .pl150 {
    padding-left: 150px !important;
  }

  .loop-div {
    position: relative;
    i {
      position: absolute;
      right: -42px;
      font-size: 22px;
      top: 12px;
      color: #409EFF;
      cursor: pointer;
    }
  }
</style>
