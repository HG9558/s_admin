<template>
  <div>
    <el-tabs :value="String(catId)" @tab-click="handleClick">
      <el-tab-pane :label="item.catName" :name="String(item.id)" v-for="item in gameTypeList" :key="item.id"></el-tab-pane>
    </el-tabs>
    <div class="bet-record">
      <div class="search">
        <div class="search-basic">
          <div class="search-basic-item width200">
            <label>{{ $t('游戏平台') }}</label>
            <el-select v-model="depotId" :placeholder="$t('请选择')" multiple>
              <el-option
                v-for="item in depotIds"
                :key="item.depotId"
                :label="item.depotName"
                :value="item.depotId">
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180" v-show="elcType===2">
            <label>{{ $t('中文名称') }}</label>
            <input type="text" v-model="gameName"/>
          </div>
          <div class="search-basic-item width180" v-show="elcType===2">
            <label>{{ $t('英文名称') }}</label>
            <input type="text" v-model="gameNameEn"/>
          </div>
          <div class="search-basic-item width180" v-show="elcType===2">
            <label>{{ $t('游戏ID') }}</label>
            <input type="text" v-model="gameId"/>
          </div>
        </div>
        <div class="div-search-btn" style="top: 58%; transform: translateY(-50%);">
          <el-button type="primary" @click.native="search()">{{ $t('查询') }}</el-button>
          <el-button type="danger" @click.native="reset()">{{ $t('重置') }}</el-button>
        </div>
      </div>
      <div class="export-div">
        <div class="el-button-div">
          <!-- <el-button class="iconfont icon-export el-button-export">导出报表</el-button> -->
        </div>
      </div>
    </div>
    <div class="search-form">
      <div v-show="elcType === 1">
        <el-table max-height="480"
          :data="tableData.list"
          v-loading='loading'
          border
          style="width: 100%">
          <el-table-column
            :label="$t('序号')"
            type="index"
            align="center"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :label="$t('游戏平台')"
            align="center"
            prop="depotName">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('PC版平台Logo')">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                v-if="scope.row.logoPc"
                trigger="hover">
                <img :src="scope.row.logoPc" width="80" height="50"
                     class="head_pic"/>
                <img :src="scope.row.logoPc" slot="reference" width="50" height="50"
                     class="head_pic"/>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('H5版平台Logo')">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                v-if="scope.row.logoMb"
                trigger="hover">
                <img :src="scope.row.logoMb" width="50" height="50"
                     class="head_pic"/>
                <img :src="scope.row.logoMb" slot="reference" width="50" height="50"
                     class="head_pic"/>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('APP版平台Logo')">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                v-if="scope.row.logoApp"
                trigger="hover">
                <img :src="scope.row.logoApp" width="50" height="50"
                     class="head_pic"/>
                <img :src="scope.row.logoApp" slot="reference" width="50" height="50"
                     class="head_pic"/>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('游戏款数')"
            align="center"
            prop="gameCount">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native="showElcType(scope.row)">{{scope.row.gameCount}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('PC是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enablePc === 1 ? true: false" v-model="scope.row.enableDepotPc"
                         :disabled="!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableDepotPc"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('H5是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enableMb === 1 ? true: false" v-model="scope.row.enableDepotMb"
                         :disabled="!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableDepotMb"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('APP是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enableApp === 1 ? true: false" v-model="scope.row.enableDepotApp"
                         :disabled="(scope.row.enableApp===0?true: false)||!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableDepotApp"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('预览是否启用')">
            <template slot-scope="scope">
              <!-- <el-switch v-if="scope.row.enableApp === 1 ? true: false" v-model="scope.row.enableDepotApp"
                         :disabled="(scope.row.enableApp===0?true: false)||!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch> -->
              <el-switch v-model="scope.row.isPreview" @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('平台输赢费率')">
            <template slot-scope="scope">
              {{(scope.row.rate || 0) + '%'}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="strWaterrate"
            :label="$t('平台流水费率')">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('操作')" v-if="hasPermission('operate:tgmcat:updateOrExport')">
            <template slot-scope="scope">
              <span class="blue-color pointer" @click="showDetail(scope.row)">[{{ $t('编辑') }}]</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="elcType === 2">
        <el-table max-height="480"
          :data="tableData.list"
          v-loading='loading'
          border
          style="width: 100%">
          <el-table-column
            :label="$t('序号')"
            align="center"
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            :label="$t('游戏平台')"
            align="center"
            prop="depotName">
          </el-table-column>
          <el-table-column
            :label="$t('游戏分类')"
            align="center"
            prop="catName">
          </el-table-column>
          <el-table-column
            :label="$t('游戏子分类')"
            align="center"
            prop="subCatName">
          </el-table-column>
          <el-table-column
            :label="$t('中文名称')"
            align="center"
            prop="gameName">
          </el-table-column>
          <el-table-column
            :label="$t('英文名称')"
            align="center"
            prop="gameNameEn">
          </el-table-column>
          <el-table-column
            :label="$t('桌号')"
            align="center"
            prop="tableCode">
          </el-table-column>
          <el-table-column
            :label="$t('游戏ID')"
            align="center"
            prop="id">
          </el-table-column>
          <el-table-column
            :label="$t('排序')"
            align="center"
            prop="popularityGame">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('游戏图片')">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                v-if="scope.row.logo"
                trigger="hover">
                <img :src="scope.row.logo" width="100" height="100"
                     class="head_pic"/>
                <img :src="scope.row.logo" slot="reference" width="50" height="50"
                     class="head_pic"/>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('PC是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enablePc === 1 ? true: false" v-model="scope.row.enableGmaePc"
                         :disabled="!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableGmaePc"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('H5是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enableMb === 1 ? true: false" v-model="scope.row.enableGmaeMb"
                         @change="toggle(scope.row)"
                         :disabled="!hasPermission('operate:tgmcat:available')"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableGmaeMb"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('APP是否启用')">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.enableApp === 1 ? true: false" v-model="scope.row.enableGmaeApp"
                         :disabled="(scope.row.enableApp===0?true: false)||!hasPermission('operate:tgmcat:available')"
                         @change="toggle(scope.row)"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
              <el-switch v-else disabled v-model="scope.row.enableGmaeApp"
                         :inactive-value='0' :active-value='1'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="strWaterrate"
            :label="$t('平台流水费率')">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('操作')" v-if="hasPermission('operate:tgmcat:updateOrExport')">
            <template slot-scope="scope">
              <span class="blue-color pointer" @click="showDetail(scope.row)">[{{ $t('编辑') }}]</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        :total="tableData.totalCount">
      </el-pagination>
    </div>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>

    <!--图片预览-->
    <Overlay v-show="centerDialogVisible" @click.native="centerDialogVisible = false"></Overlay>
    <div v-show="centerDialogVisible" class="preview-img">
      <p><i class="el-icon-error" @click="centerDialogVisible = false"></i></p>
      <img :src="picPathImg">
    </div>
    <!--编辑弹出框-->
    <el-dialog @close="closeDetail" :title="$t('编辑') + rowData.depotName + $t('游戏平台')"
               :visible.sync="editShow">
      <el-form label-position="right" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('游戏分类')" class="first-line">
              <span>{{rowData.catName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('游戏平台')" class="first-line">
              <el-input v-model="rowData.depotName" :placeholder="$t('请输入游戏平台')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="!isElectron">
            <el-form-item :label="$t('标题')" class="first-line">
              <span>{{rowData.titleTag}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="!isElectron">
            <el-form-item :label="$t('描述')" class="first-line">
              <span>{{rowData.gameTag}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="JSON.stringify(rowData) !=='{}'">
            <el-form-item :label="$t('平台输赢费率')" class="sort mr0">
              <SdyInputType v-model="rowData.rate" :placeholder="$t('请输入平台输赢费率')" :inputValue="rowData.rate" :allowNull="true"></SdyInputType>
              <span>% &nbsp;&nbsp;{{ $t('精确到小数点后两位') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="JSON.stringify(rowData) !=='{}'">
            <el-form-item :label="$t('平台流水费率')" class="sort mr0">
              <SdyInputType v-model="rowData.waterrate" :placeholder="$t('请输入平台流水费率')" :inputValue="rowData.waterrate" :allowNull="true"></SdyInputType>
              <span>% &nbsp;&nbsp;{{ $t('精确到小数点后两位') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('排序')" class="sort">
              <el-input  type="number" v-model.number="rowData.sortIdDepot"></el-input>
              <span>{{ $t('* 0代表排序到最后') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')">
              <el-input class="left" type="textarea" v-model="rowData.memoDepot" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn">
                  <el-button @click.native="closeDetail">{{ $t('取消') }}</el-button>
                  <el-button type="primary" @click.native="saveEdit">{{ $t('确定') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog @close="closeDetail" :title="$t('编辑') + catName + $t('游戏')"
               :visible.sync="elcTypeShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('游戏名称')" class="first-line">
              <span>{{rowData.gameName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('英文名称')" class="first-line">
              <span>{{rowData.gameNameEn}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('平台流水费率')" class="sort mr0">
              <el-input v-model="rowData.waterrate" :placeholder="$t('请输入平台流水费率')"></el-input>
              <span>{{ $t('单位：%，精确到小数点后两位') }}</span>
            </el-form-item>
            <!-- <el-form-item label="平台输赢费率" class="first-line">
              <span>{{rowData.rate}}</span>
            </el-form-item> -->
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('排序')" class="sort">
              <el-input class="left" type="number" v-model.number="rowData.popularityGame"></el-input>
              <span>{{ $t('* 0代表排序到最后') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')">
              <el-input class="left" type="textarea" v-model="rowData.memoGmae" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn">
                  <el-button @click.native="closeDetail">{{ $t('取消') }}</el-button>
                  <el-button type="primary" @click.native="saveEdit">{{ $t('确定') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import systemConfig from '../../config/config'
  import Overlay from '../../components/Overlay.vue'
  import queryStore from '../../mixins/queryStore'
  import { mapGetters } from 'vuex'
  import SdyInputType from '../../components/SdyInputType'
  import Mixin from '@/mixins/loadTime'

  export default {
    name: 'gameList',
    mixins: [Mixin, queryStore(['gameTypeList', 'depotId', 'catId', 'elcType'])],
    data() {
      return {
        gameTypeList: [],
        // activeName: 'first',
        tableData: {},
        title: '',
        depotIds: [],
        depotId: [],
        picPathImg: '',
        centerDialogVisible: false,
        editShow: false,
        rowData: {},
        // elcType: 1,
        elcTypeShow: false,
        gameName: '',
        gameNameEn: '',
        gameId: '',
        pc: false,
        mb: false,
        app: false,
        listReq:{
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      }
    },
    components: {
      Overlay, SdyInputType
    },
    computed: {
      useQueryStoreCache() {
        return this.$route.query.useQueryStoreCache === 'yes'
      },
      catId: {
        get() {
          return this.$route.query.catId
        },
        set(catId) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              catId
            }
          })
        }
      },
      catName() {
        const type = this.gameTypeList.find(item => item.id === this.catId)
        return type ? type.catName : ''
      },
      isElectron() {
        return this.catName === this.$t('电子')
      },
      elcType: {
        get() {
          return Number(this.$route.query.elcType)
        },
        set(elcType) {
          this.$router.replace({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              elcType
            }
          })
        }
      },
      loading() {
        JSON.stringify()
        return this.$store.state.searchLoading
      },
      ...mapGetters(['hasPermission'])
      // pc () {
      //   return this.rowData.enableGmaePc === 1
      // },
      // mb () {
      //   return this.rowData.enableGmaeMb === 1
      // },
      // app () {
      //   return this.rowData.enableGmaeApp === 1
      // }
    },
    watch: {
      // catId(value) {
      //   if (value === undefined) {
      //     this.getGameTypes()
      //   }
      // },
      elcType(newValue, oldValue) {
        if (newValue === 1 && oldValue === 2) {
          this.depotId = []
          this.getData()
        }
      }
    },
    created() {
      if (this.useQueryStoreCache) {
        this.getDepotIds()
        this.getData()
      } else {
        this.getGameTypes()
      }
    },
    methods: {
      getGameTypes() {
        this.$axios.get(systemConfig.urls.findGameTypes)
        .then(res => {
          this.gameTypeList = res.data.page
          this.catId=-1
          this.handleClick({name: res.data.page[0].id})
        })
      },
      pcChange(val) {
        this.pc = val
      },
      mbChange(val) {
        this.mb = val
      },
      appChange(val) {
        this.app = val
      },
      showElcType(row) {
        //this.tableData = {}
        this.$store.state.searchLoading = true
        // this.elcType = 2
        this.$router.push({path: this.$route.fullPath, query: {...this.$route.query, elcType: 2}})
        this.depotId = []
        this.depotId.push(row.depotId)
        this.resetPage()
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&depotIds=' + row.depotId + '&catId=' + this.catId
        this.$axios.get(systemConfig.urls.findGameList + url).then((resp) => {
          this.tableData = resp.data.page
        })
        .catch(err=>{
          this.tableData = {}
        })
      },
      saveEdit() {
        if (this.elcType === 1) {
          if ((!this.rowData.sortIdDepot&&this.rowData.sortIdDepot!==0)||this.rowData.sortIdDepot<0) {
            this.$message({
              type: 'warning',
              message: this.$t('排序不能为空且要大于等于0')
            })
            return
          }
          if (!this.rowData.memoDepot) {
            this.$message({
              type: 'warning',
              message: this.$t('备注不能为空')
            })
            return
          }
        } else {
          if ((!this.rowData.popularityGame&&this.rowData.popularityGame!==0) || this.rowData.popularityGame  < 0) {
            this.$message({
              type: 'warning',
              message: this.$t('排序不能为空且要大于等于0')
            })
            return
          }
          if (!this.rowData.memoGmae) {
            this.$message({
              type: 'warning',
              message: this.$t('备注不能为空')
            })
            return
          }

          if (this.pc) {
            this.rowData.enableGmaePc = 1
          } else {
            this.rowData.enableGmaePc = 0
          }
          if (this.mb) {
            this.rowData.enableGmaeMb = 1
          } else {
            this.rowData.enableGmaeMb = 0
          }
          if (this.app) {
            this.rowData.enableGmaeApp = 1
          } else {
            this.rowData.enableGmaeApp = 0
          }
        }
        let url = ''
        if (this.elcType === 1) {
          url = systemConfig.urls.tgmgameListUpdate
        } else {
          url = systemConfig.urls.findGameListUpdate
        }
        //this.rowData.popularityGame = this.rowData.clickNum
        this.$axios.post(url, this.rowData).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
          this.closeDetail()
          this.getData()
        })
      },
      closeDetail() {
        this.editShow = false
        this.elcTypeShow = false
        this.rowData = {}
      },
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      handleSizeChange(val) {
        this.listReq.pageNo = 1
        this.listReq.pageSize = val
        this.getData()
      },
      handleCurrentChange(val) {
        if(!val) return
        this.listReq.pageNo = val
        this.getData()
      },
      showDetail(row) {
        console.log('row ====', row)
        this.rowData = Object.assign({}, row)
        if (this.elcType === 1) {
          this.editShow = true
        } else {
          this.elcTypeShow = true
          this.pc = row.enableGmaePc === 1
          this.mb = row.enableGmaeMb === 1
          this.app = row.enableGmaeApp === 1
        }
      },
      showImg(flag) {
        switch (flag) {
          case 1:
            this.picPathImg = this.rowData.picUrl
            break
          case 2:
            this.picPathImg = this.rowData.logoPc
            break
          case 3:
            this.picPathImg = this.rowData.mbPicUrl
            break
          case 4:
            this.picPathImg = this.rowData.logoMb
            break
          case 5:
            this.picPathImg = this.rowData.appPicUrl
            break
          case 6:
            this.picPathImg = this.rowData.logoApp
            break
          case 7:
            this.picPathImg = this.rowData.logo
        }
        if (this.picPathImg) {
          this.centerDialogVisible = true
        }
      },
      toggle(row) {
        let url = ''
        if (this.elcType === 1) {
          url = systemConfig.urls.tgmgameListUpdate
        } else {
          url = systemConfig.urls.findGameListUpdate
        }
        this.$axios.post(url, row).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
        })
      },
      handleClick(tab, event) {
        this.reset(1)
        this.$router.replace({
          path: '/main/gameManage/gameList',
          query: {
            elcType: 1,
            catId: Number(tab.name)
          }
        })
        this.getDepotIds()
        this.getData()
      },
      search() {
        this.getCurrentRecodeTime()
        this.listReq.pageNo=1
        this.getData()
      },
      reset(init) {
        this.title = ''
        this.gameName = ''
        this.gameNameEn = ''
        this.gameId = ''
        this.depotId = []
        this.resetPage()
        if(!init)this.search()
      },
      resetPage() {
        this.listReq.pageNo=1
        this.listReq.pageSize=10
      },
      getDepotIds() {
        this.$axios.get(systemConfig.urls.findPlatforms, {params: {catId: this.catId}}).then((res) => {
          this.depotIds = res.data.page
        })
      },
      getData() {
        this.$store.state.searchLoading = true
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo
        let api = systemConfig.urls.tgmgameList
        // if (this.activeName === 'second') {
          if (this.elcType === 2) {
            api = systemConfig.urls.findGameList
            url += '&depotIds=' + this.depotId.join(',') + '&gameName=' + this.gameName + '&gameNameEn=' + this.gameNameEn + '&id=' + this.gameId + '&catId=' + this.catId
          } else {
            url += '&depotIds=' + this.depotId.join(',') + '&catId=' + this.catId
          }
        // } else {
        //   url += '&titleTag=' + this.title + '&catId=' + this.catId
        // }
        this.$axios.get(api + url).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          this.tableData = resp.data.page
        })
        .catch(err=>{
          this.tableData={}
        })
      }
    }
  }
</script>

<style lang="scss">
  .checkImg {
    color: #409EFF;
    cursor: pointer;
  }
  .sort{
    /deep/ .el-input {
      width: 50%;
      margin-right: 24px;
    }
  }
  .mr0 {
    /deep/ .el-input {
      margin-right: 0px;
    }
  }
</style>
