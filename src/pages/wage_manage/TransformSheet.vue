<template>
  <div class="transform-sheet" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search" :class="searchClass">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('转账单号') }}</label>
          <input type="text" v-model="orderNoText" v-trim @keyup.enter="search(true)" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input type="text" v-model="memberAccount" v-trim @keyup.enter="search(true)" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('真实姓名') }}</label>
          <input type="text" v-model="realName" v-trim @keyup.enter="search(true)" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('转出账户') }}</label>
          <el-select size="small" v-model="transferOut" :placeholder="$t('请选择')">
            <el-option
              style="color: green"
              :label="$t('主账户')"
              value="main"
              key="main"
              v-show="transferIn !== 'main'"
            ></el-option>
            <el-option
              v-for="(item, index) in platformOptions"
              :key="index"
              :label="item.depotName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('转入账户') }}</label>
          <el-select size="small" v-model="transferIn" :placeholder="$t('请选择')">
            <el-option
              style="color: green"
              :label="$t('主账户')"
              value="main"
              key="main"
              v-show="transferOut !== 'main'"
            ></el-option>
            <el-option
              v-for="(item, index) in platformOptions"
              :key="index"
              :label="item.depotName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select
            size="small"
            v-model="statusValue"
            :placeholder="$t('请选择')"
            @change="selectStatusChange"
            multiple
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理') }}</label>
          <el-select
            size="small"
            v-model="agyAccountValue"
            :placeholder="$t('请选择')"
            multiple
            filterable
            clearable
          >
            <el-option
              v-for="item in agyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id"
            >
              {{ item.agyAccount
              }}<GlobalComponentTestLabel
                :id="item.id"
                :parentId="item.parentId"
              />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('客户端') }}</label>
          <el-select
            size="small"
            v-model="transferSourceList"
            :placeholder="$t('请选择')"
            multiple
          >
            <el-option label="PC" value="0"></el-option>
            <el-option label="H5" value="3"></el-option>
            <el-option :label="$t('后台')" value="2"></el-option>
          </el-select>
        </div>
        <!--申请时间-->
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('申请时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            ref="searchTime"
            :width="480"
            :left="100"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
          />
        </div>
      </div>
    </div>
    <el-row
      style="background-color: #f6f7f8;padding: 10px 20px 20px;margin-top: -14px"
      class="border-new-lrb"
    >
      <el-col :span="12" class="tect-le color-blue" style="cursor:pointer">
        <span @click="more"
          >{{ extendTitle }}{{ $t('查询') }}<i
            :class="[
              this.showExtend ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            ]"
            class="icon-more el-select__caret el-input__icon "
          ></i
        ></span>
      </el-col>
      <el-col :span="12" class="tect-ri">
        <el-button
          type="primary"
          @click.native="search(true)"
          size="small"
          class="wid-80"
          >{{ $t('查询') }}</el-button
        >
        <el-button type="danger" @click.native="reset()" size="small" class="wid-80"
          >{{ $t('重置') }}</el-button
        >
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg" justify="end">
      <el-button
        v-if="hasPermission('fund:billReport:save')"
        icon="el-icon-circle-plus-outline"
        type="primary"
        size="mini"
        style="width: 100px; height: 28px;"
        @click="add"
        >{{ $t('新增') }}</el-button
      >
    </el-row>
    <div class="search-form">
      <el-table
        max-height="480"
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column
          label-class-name="heightThe"
          :label="$t('序号')"
          type="index"
          align="center"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('转账单号')"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              @click="showDetail(scope.row)"
              type="text"
              size="small"
              >{{ scope.row.orderNoText }}</el-button
            >
            <CopyButton :copy-content="scope.row.orderNoText" />
          </template>
        </el-table-column>
        <!-- <el-table-column label-class-name="heightThe"
                         prop="topAgyAccount"
                         label="总代">
        </el-table-column> -->
        <el-table-column label-class-name="heightThe" :label="$t('会员名')" align="center">
          <template slot-scope="scope">
            <el-button
              @click="goMemberDetail(scope.row)"
              type="text"
              size="small"
              >{{ scope.row.loginName }}</el-button
            >
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="realName"
          align="center"
          :label="$t('真实姓名')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="agyAccount"
          align="center"
          :label="$t('上级代理')"
          width="140"
        >
          <template slot-scope="scope">
            {{ scope.row.agyAccount }}
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="beforeBalance"
          :label="$t('主账户余额')"
          align="right"
        >
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('转出账户')" align="center">
          <template slot-scope="scope">
            {{ scope.row.opType ? scope.row.depotName : $t('主账户') }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('转入账户')" align="center">
          <template slot-scope="scope">
            {{ scope.row.opType ? $t('主账户') : scope.row.depotName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label-class-name="heightThe"
                         prop="depotName"
                         label="游戏平台">
        </el-table-column> -->
        <!-- <el-table-column label-class-name="heightThe"
                         prop="transferTypeText"
                         label="转账类型">
        </el-table-column> -->
        <el-table-column
          label-class-name="heightThe"
          prop="amount"
          align="right"
          :label="$t('转账金额')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="afterBalance"
          align="right"
          :label="$t('转后主账户余额')"
        >
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('状态')" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.status === 1
                  ? 'success'
                  : scope.row.status === 2
                  ? 'danger'
                  : 'primary'
              "
              close-transition
              >{{ scope.row.statusText }}
            </el-tag>
            <div
              v-if="
                scope.row.statusText === $t('待处理') &&
                  hasPermission('fund:billReport:add')
              "
            >
              <div>
                <el-button
                  @click="refreshStatus(scope.row)"
                  type="text"
                  size="small"
                  >{{ $t('刷新') }}</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="createTime"
          :formatter="timeFilter"
          width="150"
          align="center"
          :label="$t('申请时间')"
        >
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('客户端')" align="center">
          <template slot-scope="scope">
            {{ returnStatus(scope.row.transferSource) }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="memo" :label="$t('备注')" align="center">
          <template slot-scope="scope">{{
            spliceStr(scope.row.memo)
          }}</template>
        </el-table-column>
        <el-table-column :label="$t('操作时间')" prop="operatingTime" width="150" align="center"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="username" align="center"></el-table-column>
        <el-table-column :label="$t('操作')" align="center">
          <template slot-scope="scope">
            <span class="blue-color pointer" v-if="scope.row.status === 0 && hasPermission('fund:audit:depotUpdate')" @click="handleEdit(scope.row)">{{ $t('编辑') }}</span>
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
    <el-dialog @close="closeDetail" :title="$t('转账详情')" :visible.sync="detailShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('转账单号') + ':'" class="first-line">
              <span>{{ rowData.orderNo }}</span>
              <CopyButton
                style="float: right"
                :copy-content="rowData.orderNo"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名') + ':'" class="first-line"
              ><span>{{ rowData.loginName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('真实姓名') + ':'" class="first-line"
              ><span>{{ rowData.realName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转前主账户余额') + ':'" class="first-line"
              ><span>{{ rowData.beforeBalance }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转出平台') + ':'" class="first-line"
              ><span>{{ rowData.opType ? rowData.depotName : $t('主账户') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转入平台') + ':'" class="first-line"
              ><span>{{ rowData.opType ? $t('主账户') : rowData.depotName }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="转账类型 :" class="first-line"><span>{{rowData.opTypeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="operateText + ' :'" class="first-line"><span>{{rowData.depotName}}</span>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item :label="$t('转帐金额') + ':'" class="first-line"
              ><span>{{ rowData.amount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转后主账户余额') + ':'" class="first-line"
              ><span>{{ rowData.afterBalance }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="余额信息 :" class="first-line"><span>转前:{{rowData.beforeBalance}}     转后:{{rowData.afterBalance}}</span>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item :label="$t('状态') + ':'" class="first-line"
              ><span>{{ statusTextFilter(rowData.status) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注') + ':'" class="first-line"
              ><span>{{ rowData.memo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog @close="closeNew" :title="$t('新增转账')" :visible.sync="addNew">
      <el-form
        label-position="right"
        label-width="160px"
        style="margin-left: 20px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('会员名') + ':'">
              <el-input
                size="small"
                style="width:calc(100% - 120px)"
                v-model="postData.loginName"
              />
              <el-button
                size="mini"
                type="primary"
                @click="checkAmount"
                style="margin-left: 10px"
                plain
                >{{ $t('查询余额') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转出平台') + ':'">
              <el-select
                style="width:calc(100% - 120px)"
                v-model="outDepotId"
                :placeholder="$t('请选择')"
                size="small"
              >
                <el-option
                  style="color: green"
                  :label="$t('主账户')"
                  value="main"
                  key="main"
                  v-if="inDepotId !== 'main'"
                ></el-option>
                <el-option
                  :disabled="item.availableWh === 2"
                  v-for="(item,index) in platformOptions"
                  :key="index"
                  :label="item.depotName"
                  :value="item.id"
                >
                  {{ item.depotName }}
                  <span
                    style="float: right;color: #ff8800;margin-right: 10px;"
                    v-if="item.availableWh === 2"
                    >{{ $t('维护中') }}！</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转入平台') + ':'">
              <el-select
                style="width:calc(100% - 120px)"
                v-model="inDepotId"
                :placeholder="$t('请选择')"
                size="small"
              >
                <el-option
                  style="color: green"
                  :label="$t('主账户')"
                  value="main"
                  key="main"
                  v-if="outDepotId !== 'main'"
                ></el-option>
                <el-option
                  :disabled="item.availableWh === 2"
                  v-for="(item,index) in platformOptions"
                  :key="index"
                  :label="item.depotName"
                  :value="item.id"
                >
                  {{ item.depotName }}
                  <span
                    style="float: right;color: #ff8800;margin-right: 10px;"
                    v-if="item.availableWh === 2"
                    >{{ $t('维护中') }}！</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('主账号余额') + ':'">
              <el-input
                size="small"
                type="text"
                disabled
                v-model="postData.mainAmount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('平台余额') + ':'">
              <el-input
                size="small"
                type="text"
                disabled
                v-model="postData.depotAmount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账金额') + ':'">
              <el-input size="small" v-model.number="postData.amount" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注') + ':'">
              <el-input size="small" v-model="postData.memo" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closeNew" size="small">{{ $t('取消') }}</el-button>
        <el-button
          v-if="hasPermission('fund:billReport:save')"
          type="primary"
          size="small"
          @click.native="transferSubmit()"
          >{{ $t('确定') }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('编辑')"
      :visible.sync="showEdit"
    >
      <el-form ref="editForm" label-width="100px" :model="actEdit" :rules="{ status: [ { required: true, validator: (rule, value, callback) => value ? callback() : callback($t('请选择状态')), trigger: 'change' } ] }">
        <el-form-item :label="$t('会员名') + '：'">
          <el-input v-model="actEdit.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转出平台') + '：'">
          <el-input v-model="actEdit.outPlat" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转入平台') + '：'">
          <el-input v-model="actEdit.inPlat" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('转账金额') + '：'">
          <el-input v-model="actEdit.amount" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('状态修改') + '：'" prop="status">
          <el-radio-group v-model.number="actEdit.status">
            <el-radio :label="1">{{ $t('成功') }}</el-radio>
            <el-radio :label="2">{{ $t('失败') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="'*' + $t('注意') + '：'" class="tips-text">
          <span>
            {{ $t('请跟三方平台确认这笔订单是否成功，或失败') }}<br>
            {{ $t('如三方平台确认这笔订单成功，修改状态为成功，修改为成功后会员该笔订单的钱入账成功，无法再变更状态。')}}<br>
            {{ $t('如三方平台确认这笔订单失败，修改状态为失败，修改为失败后系统会自动帮会员补齐这笔钱，禁止手动添加。')}}
          </span>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="actEdit.isSure" :label="1">{{ $t('我已清楚修改状态后果，确认修改状态') }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center">
        <el-button @click="showEdit = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="edigLoading">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import systemConfig from '../../config/config.js'
import queryStore from '../../mixins/queryStore'
import Clipboard from 'clipboard'
import CopyButton from '../../components/CopyButton'
import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
import { mapGetters } from 'vuex'
import { checkNatureNumber } from '../../config/utils'
import { lang } from "@/i18n"
import Mixin from '@/mixins/loadTime'


const statusOptions = [{value: 0, text: lang('待处理')}, {value: 1, text: lang('通过')}, {value: 2, text: lang('失败')}]
const reg = /[a-zA-Z\d]{6,10}$/
export default {
  name: 'transformSheet',
  mixins: [Mixin, queryStore(['orderNoText', 'memberAccount', 'realName', 'transferOut', 'transferIn', 'statusValue', 'agyAccountValue', 'transferSourceList', 'startTime', 'endTime'])],
  components: {StartAndEndTimeSelector, CopyButton},
  data() {
    return {
      inDepotId: null,
      outDepotId: null,
      orderNoText: '',
      realName: '',
      transferIn: null,
      transferOut: null,
      extendTitle: this.$t('更多'),
      searchClass: 'searchNew',
      showExtend: false,
      detailShow: false,
      memberAccount: '',
      topAgyAccountOptions: [],
      topAgyAccountValue: [],
      agyAccountOptions: [],
      rowData: {},
      agyAccountValue: [],
      startTime: systemConfig.getCurrentWeek()[0] + " 00:00:00",
      endTime: systemConfig.getCurrentWeek()[1] + " 23:59:59",
      platformOptions: [],
      trueAgyAccountOptions: [],
      platformValue: [],
      transformOptions: [{
        value: 1,
        label: this.$t('转入')
      }, {
        value: 0,
        label: this.$t('转出')
      }],
      transformValue: [],
      statusValue: [],
      filterArr: statusOptions,
      statusOptions: statusOptions,
      tableData: [],
      total: 0,
      isym: true,
      transferSourceList: [],
      actEdit: {
        status: null
      },
      addNew: false,
      showEdit: false,
      edigLoading: false,
      postData: {accountId: null, opType: 0, depotId: '', loginName: '', mainAmount: '', depotAmount: '', amount: '', memo: ''},
    }
  },
  methods: {
    handleEditSubmit() {
      this.$refs.editForm.validate(isOk => {
        if (isOk) {
          if (!this.actEdit.isSure) return this.$message.warning(this.$t('请勾选“我已清楚修改状态后果，确认修改状态”'))
          this.editSubmit()
        }
      })
    },
    async editSubmit() {
      const { status, id } = this.actEdit
      const data = {
        id,
        status
      }
      this.editLoading = true
      const { res } = await this.$axios.POST(this.$urls.updateManageStatus, data)
      this.edigLoading = false
      if (res) {
        this.$message.success(this.$t('订单状态修改成功'))
        this.showEdit = false
        this.search()
      }
    },
    handleEdit(row) {
      const obj = JSON.parse(JSON.stringify(row))
      const { opType, depotName } = obj
      obj.outPlat = opType ? depotName : this.$t('主账户')
      obj.inPlat = opType ? this.$t('主账户') : depotName
      this.actEdit = obj
      this.showEdit = true
    },
    add() {
      this.addNew = true
      this.$axios.get(systemConfig.urls.createOrderNumber).then((res) => {
        this.postData.orderNo = res.data.data
      })
    },
    closeNew() {
      this.addNew = false
      this.postData = {opType: 0, depotId: '', loginName: '', mainAmount: '', depotAmount: '', amount: '', memo: ''}
    },
    checkAmount() {
      if (this.transferTypeForAdd) {
        this.postData.depotId =  this.transferTypeForAdd.depotId
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('转出和转入平台中必须有一个是主账户')
        })
        return
      }
      if (!this.postData.depotId) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择平台')
        })
        return
      }
      if (!this.postData.loginName) {
        this.$message({
          type: 'warning',
          message: this.$t('请输入会员名')
        })
        return
      }
      if (!reg.test(this.postData.loginName)) {
        this.$message({
          type: 'warning',
          message: this.$t('会员名由数字、字母组合,6~10位')
        })
        return
      }
      let url = '?loginName=' + this.postData.loginName + '&depotId=' + this.postData.depotId
      this.$axios.get(systemConfig.urls.queryDepotOrAccountBalance + url).then((res) => {
        this.postData.accountId = res.data.info.id
        this.postData.mainAmount = res.data.info.balance
        this.postData.depotAmount = res.data.info.depotBeforeBalance
      })
    },
    transferSubmit() {
      if (this.transferTypeForAdd) {
        this.postData.opType = this.transferTypeForAdd.type
        this.postData.depotId =  this.transferTypeForAdd.depotId
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('转出和转入平台中必须有一个是主账户')
        })
        return
      }
      if (!this.postData.depotId) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择平台')
        })
        return
      }
      if (!this.postData.loginName) {
        this.$message({
          type: 'warning',
          message: this.$t('请输入会员名')
        })
        return
      }
      if (!reg.test(this.postData.loginName)) {
        this.$message({
          type: 'warning',
          message: this.$('会员名由数字、字母组合,6~10位')
        })
        return
      }
      if (!checkNatureNumber(this.postData.amount)) {
        this.$message({
          type: 'warning',
          message: this.$t('请输入转账金额应为正整数')
        })
        return
      }
      if (this.postData.opType === 0) {
        if (this.postData.mainAmount < this.postData.amount) {
          this.$message({
            type: 'warning',
            message: this.$t('转账金额不能大于主账户余额')
          })
          return
        }
      } else {
        if (this.postData.depotAmount < this.postData.amount) {
          this.$message({
            type: 'warning',
            message: this.$t('转账金额不能大于平台余额')
          })
          return
        }
      }
      this.$axios.post(systemConfig.urls.reportSave, this.postData).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('操作成功')
        })
        this.closeNew()
        this.getData()
      })
    },
    returnStatus(statusValue) {
      return systemConfig.returnStatus(statusValue)
    },
    spliceStr(str) {
      return systemConfig.spliceStr(str, 6)
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
    refreshStatus(row) {
      this.$axios.get(systemConfig.urls.fundrefreshStatus + '?orderNo=' + row.orderNo).then((resp) => {
        if(resp.data.code===604){
          this.$alert(this.$('该平台不支持刷新，请反馈技术更改订单状态为失败，手动补回该笔金额'), this.$t('温馨提示'), {
            customClass:'message_box_alert',
            center: true,
            showClose: false,
            confirmButtonText: this.$t('知道了'),
          });
        }
        if(resp.data.code===0){
          this.$alert(this.$t('点击刷新后无需手动补单，系统会自动补回，如点击后还是待处理状态，则需要反馈给技术部门'), this.$t('温馨提示'), {
            customClass:'message_box_alert',
            center: true,
            showClose: false,
            confirmButtonText: this.$t('知道了'),
            callback: () => {
              if (resp.data.state != null && (resp.data.state == 1 || resp.data.state == 2)) {
                this.$message({
                  type: 'success',
                  message: this.$t('处理成功')
                })
                this.getData()
              } else if (resp.data.state != null && resp.data.state == 0) {
                this.$message({
                  type: 'warning',
                  message: this.$t('处理中，请稍后再试')
                })
              }
            }
          });
        }
      })
    },
    timeFilter(row, column) {
      var date = row[column.property]
      if (date == null || date === '') {
        return ''
      }
      return systemConfig.transferTimeByType(date, this.timeType)
    },
    selectStatusChange(val) {
      this.statusValue = []
      this.statusValue = val
    },
    // 表格状态删选
    filterTag(value, row) {
      return row.status === value
    },
    // 条件重置事件
    reset() {
      this.transferIn = null
      this.transferOut = null
      this.orderNo = ''
      this.realName = ''
      this.memberAccount = ''
      this.orderNoText = ''
      this.topAgyAccountValue = []
      this.agyAccountValue = []
      this.agyAccountOptions = this.trueAgyAccountOptions
      this.startTime = ''
      this.endTime = ''
      this.platformValue = []
      this.transformValue = []
      this.statusValue = []
      this.detailShow = false
      this.transferSourceList = []
    },
    goMemberDetail(row) {
      this.detailShow = false
      this.$router.push({path: '/main/memberManage/memberList', query: {loginName: row.loginName}})
    },
    // 更多查询toggle
    more() {
      if (this.searchClass == 'searchNewTwo') {
        this.searchClass = 'searchNew'
        this.extendTitle = this.$t('更多')
        this.showExtend = false
      } else {
        this.searchClass = 'searchNewTwo'
        this.extendTitle = this.$t('收起')
        this.showExtend = true
      }
    },
    // 获取总代 次代数据
    getChildAgent() {
      this.$axios.get(systemConfig.urls.getAllChildAgentIncludeDisable).then((resp) => {
        this.agyAccountOptions = resp.data.accounts
        this.trueAgyAccountOptions = resp.data.accounts
      })
    },
    getAgyAccount(id) {
      if (id.length > 0) {
        this.agyAccountOptions = []
        Promise.all(
          id.map((i) => (
            this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable, {
              params: {
                parentId: i,
              },
            })
          ))
        )
          .then((res) => {
            this.agyAccountOptions = res.reduce((prev, curr) => {
              prev.push(...curr.data.accounts)
              return prev
            }, [])
          })
      } else {
        this.agyAccountOptions = this.trueAgyAccountOptions
        this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable + '?parentId=').then((resp) => {
          this.topAgyAccountOptions = resp.data.accounts
        })
      }
    },
    // 条件查询事件
    search(bool) {// bool 是否是条件查询按钮或者查询条件的enter回车键查询
      this.getCurrentRecodeTime()
      if (this.transferTypeForSearch) {
        this.platformValue = [this.transferTypeForSearch.depotId]
        this.transformValue = [this.transferTypeForSearch.type]
      } else {
        this.platformValue = []
        this.transformValue = []
      }
      if (this.startTime && this.endTime) {
        if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
          this.$message({
            type: 'warning',
            message: this.$t('申请起始时间不能大于结束时间')
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
      if (bool) {
        this.$set(this.listReq, 'pageNo', 1)
      }
      this.getData()
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
    },
    statusTextFilter(status) {
      switch (status) {
        case 0:
          return this.$t('待处理')
        case 1:
          return this.$t('通过')
        case 2:
          return this.$t('失败')
      }
    },
    // 关闭弹出框
    closeDetail() {
      this.detailShow = false
    },
    // 打开弹出框
    showDetail(rowData) {
      this.rowData = rowData
      let url = '/' + rowData.id
      this.$axios.get(systemConfig.urls.fundReportInfo + url).then((resp) => {
        this.detailShow = true
        this.rowData = resp.data.info
        if (this.rowData.opType === 0) {
          this.rowData.opTypeText = this.$t('转出')
        }
        if (this.rowData.opType === 1) {
          this.rowData.opTypeText = this.$t('转入')
        }
      })
    },
    // 获取表格数据 isym 判断是当前界面还是其他界面导航过来  + '&createTimeFrom=' + this.startTime + '&createTimeTo=' + this.endTime
    getData(init) {
      this.$store.state.searchLoading = true
      if (this.$router.history.current.query.loginName && this.isym) {
        this.memberAccount = this.$router.history.current.query.loginName
        this.isym = false
      }
      if(init&&this.$route.query&&this.$route.query.statusValue){
        this.statusValue.push(parseInt(this.$route.query.statusValue))

      }
      let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&orderNo=' + this.orderNoText + '&realName=' + this.realName + '&transferSourceList=' + this.transferSourceList + '&tagencyIds=' + this.topAgyAccountValue + '&cagencyIds=' + this.agyAccountValue + '&loginName=' + this.memberAccount + '&opTypes=' + this.transformValue + '&statuss=' + this.statusValue + '&depotIds=' + this.platformValue
      if (this.startTime && this.timeType === 'md') {
        url += '&createTimeFrom=' + systemConfig.transferTimeByType(this.startTime, 'mdToBj')
      } else {
        url += '&createTimeFrom=' + this.startTime
      }
      if (this.endTime && this.timeType === 'md') {
        url += '&createTimeTo=' + systemConfig.transferTimeByType(this.endTime, 'mdToBj')
      } else {
        url += '&createTimeTo=' + this.endTime
      }
      this.$axios.get(systemConfig.urls.fundReportBillList + url).then((resp) => {
        let data = resp.data.page.list
        this.getNetworkLoadAndDataSolveTime(resp)
        for (let i = 0; i < data.length; i++) {
          data[i].orderNoText = data[i].orderNo
          switch (data[i].status) {
            case 0:
              data[i].statusText = this.$t('待处理')
              break
            case 1:
              data[i].statusText = this.$t('通过')
              break
            case 2:
              data[i].statusText = this.$t('失败')
              break
          }
          switch (data[i].opType) {
            case 0:
              data[i].transferTypeText = this.$t('转出')
              break
            case 1:
              data[i].transferTypeText = this.$t('转入')
              break
          }
        }
        if (this.statusValue.length === 1 && this.statusValue[0] === 2) {
          this.filterArr = [{text: this.$t('失败'), value: 2}]
        } else if (this.statusValue.length === 1 && this.statusValue[0] === 1) {
          this.filterArr = [{text: this.$t('通过'), value: 1}]
        } else if (this.statusValue.length === 1 && this.statusValue[0] === 0) {
          this.filterArr = [{text: this.$t('待处理'), value: 0}]
        } else if (this.statusValue.length === 2 && this.statusValue.indexOf(2) > -1 && this.statusValue.indexOf(1) > -1) {
          this.filterArr = [{text: this.$t('失败'), value: 2}, {text: this.$t('通过'), value: 1}]
        } else if (this.statusValue.length === 2 && this.statusValue.indexOf(2) > -1 && this.statusValue.indexOf(0) > -1) {
          this.filterArr = [{text: this.$t('失败'), value: 2}, {text: this.$t('待处理'), value: 0}]
        } else if (this.statusValue.length === 2 && this.statusValue.indexOf(1) > -1 && this.statusValue.indexOf(0) > -1) {
          this.filterArr = [{text: this.$t('通过'), value: 1}, {text: this.$t('待处理'), value: 0}]
        } else {
          this.filterArr = [{text: this.$t('失败'), value: 2}, {text: this.$t('通过'), value: 1}, {text: this.$t('待处理'), value: 0}]
        }
        data.map((item) => {
            item.amount = (item.amount || 0).toLocaleString()
            item.afterBalance = (item.afterBalance || 0).toLocaleString()
            item.beforeBalance = (item.beforeBalance || 0).toLocaleString()
        });
        this.tableData = data
        this.total = resp.data.page.totalCount
      })
    },
    // 获取游戏平台
    getAllPlatform() {
      this.$axios.get(systemConfig.urls.getAllPlatform).then((resp) => {
        this.platformOptions = resp.data.tGmDepots
      })
    }
  },
  created() {
    this.getData(true)
    this.getAllPlatform()
    this.getAgyAccount([])
    this.getChildAgent()
  },
  mounted() {
    new Clipboard('.clip')
  },
  computed: {
    ...mapGetters(['hasPermission']),
    transferTypeForSearch() {
      const {transferIn, transferOut} = this
      if (transferIn) {
        if (transferIn === 'main') {
          return {type: 1, depotId: transferOut}
        } else {
          return {type: 0, depotId: transferIn}
        }
      } else if (transferOut) {
        if (transferOut === 'main') {
          return {type: 0, depotId: transferIn}
        } else {
          return {type: 1, depotId: transferOut}
        }
      }
    },
    transferTypeForAdd() {
      const {inDepotId, outDepotId} = this
      if (inDepotId === 'main') {
        return {type: 1, depotId: outDepotId}
      } else if (outDepotId === 'main') {
        return {type: 0, depotId: inDepotId}
      }
    },
    // extendTitle () {
    //   if (this.showExtend) {
    //     return '收起'
    //   } else {
    //     return '更多'
    //   }
    // },
    changeLabel() {
      return this.postData.opType === 0 ? this.$t('资金转出平台') : this.$t('资金转入平台')
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
    timeType: {
      get: function () {
        return this.$store.state.timeType
      },
      set: function () {
      }
    },
    operateText() {
      if (this.rowData.opTypeText === this.$t('转入')) {
        return this.$t('资金转入平台')
      } else {
        return this.$t('资金转出平台')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .message_box_alert .el-message-box__header{
    background: #409EFF;
    padding-top: 15px;
  }
  .message_box_alert{
    border: 0!important;
  }
  .message_box_alert .el-message-box__title{
    color: #fff;
  }
  .tips-text {
    color: red;
    label {
      color: red;
    }
  }
}

</style>
