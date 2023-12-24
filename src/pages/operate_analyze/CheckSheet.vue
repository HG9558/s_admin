<template>
  <div class="lose-win-sheet" v-loading.fullscreen.lock="fullscreenLoading">
    <!--搜搜-->
    <div class="search" style="padding-bottom: 0">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item :label="$t('稽核类型')">
          <el-select v-model="SeachTypeValue" :placeholder="$t('请选择')">
            <el-option :label="$t('即时稽核')" :value="0"></el-option>
            <el-option :label="$t('历史稽核')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('会员名')" :rules="memberInfoRule.newAccountName">
          <el-input v-model="SeachMemberName" v-trim :placeholder="$t('请输入有效的会员名')" @keyup.enter.native="search()"></el-input>
        </el-form-item>
      </el-form>
      <div class="div-search-btn" style="position:absolute;top: 55%; transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div v-show="ifShow">
      <!--body-->
      <!--会员名 分组-->
      <el-row class="ma-top-20">
        <el-col :span="4">{{ $t('会员名') }}：{{SeachMemberNameTrue}}<GlobalComponentTestLabel :id="tagencyId" /></el-col>
        <el-col :span="4">{{groupName}}：{{ $t('取款放宽额度') }}{{groupNameForMoney || '?'}}{{ currencyText() }}</el-col>
      </el-row>
      <!--分割线-->
      <el-row class="ma-top-10">
        <el-col :span="24" style="border: 1px solid #e3e3e3"></el-col>
      </el-row>
      <!--表格-->
      <el-row class="ma-top-10 " :class="{'bor-1-333': !(SeachTypeValueSub && !tableDataLs.length)}">
        <!--即时稽核-->
        <div v-if="!SeachTypeValueSub">
          <!--标题-->
          <div class="bg-33 pad-20"><span>{{ $t('即时稽核') }}</span>
          </div>
          <!--存款-->
          <el-row class="ma-top-20 mar-left-20 ">
            <el-col :span="1.2">{{ $t('存款稽核') }}:</el-col>
            <el-col :span="1.2">{{ $t('总存款') }}:{{setThounds(depositTotal)}}{{ currencyText() }},&nbsp;</el-col>
            <el-col :span="1.2">{{ $t('已完成流水') }}{{ setThounds(currentDepositValidBet)}}{{ currencyText() }}&nbsp;</el-col>
            <el-col :span="1.2" v-show="tableDataJs.length !=0?true:false"
                    :class="depositSucceed?'color-green':'color-red'" style="font-weight: bold">&nbsp;&nbsp;&nbsp;{{depositSucceed?$t('通过'):$t('不通过')}}
            </el-col>
          </el-row>
          <!--即时稽核 独用-->
          <el-row class="ma-top-20 mar-left-20">
            <div class="flo-le">
              <el-button v-if="hasPermission('member:audit:update')" type="success" plain @click.native="getDataJsXg" :disabled="tableDataJs.length ==0?true:false">
                {{ $t('修改稽核') }}
              </el-button>
              <el-button type="text" v-if="ifXg" @click.native="submitXgLs">{{ $t('确定') }}</el-button>
              <el-button type="text" v-if="ifXg" @click.native="sorry">{{ $t('取消') }}</el-button>
              <!--<el-button type="success" plain icon="el-icon-question">清除稽核点</el-button>-->
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="$t('清除该会员当前所有未通过的流水稽核')">
                <el-button v-if="hasPermission('member:audit:clear')" slot="reference" icon="el-icon-question" type="success" plain @click.native="getDataJsSc"
                           :disabled="tableDataJs.length ==0?true:false">
                  {{ $t('清除稽核点') }}
                </el-button>
              </el-popover>
            </div>
            <div class="flo-ri">
              <el-popover
                placement="bottom"
                width="200"
                trigger="click">
                <div class="lastUpdate-tine" v-for="(i,index) in lastUpdateTime" :key="index">
                  <span>
                    {{i.platform.toLocaleUpperCase()}}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span>
                    {{i.maxTime}}
                  </span>
                </div>
                <el-button slot="reference" :disabled="!lastUpdateTime.length">{{ $t('查看投注记录最后更新时间') }}</el-button>
              </el-popover>
              <div class="time" v-show="ifTime">

              </div>
            </div>
          </el-row>
          <!-- 表格通用-->
          <el-table max-height="480"
            :data="tableDataJs"
            stripe
            border
            style="width: 100%;margin-top: 20px">
            <el-table-column
              prop="total"
              :label="$t('序号')"
              align="center"
              type="index" width="50" :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="time" align="center" :formatter="timeFilter"
              :label="$t('开始时间')">
            </el-table-column>

            <el-table-column
              prop="depositAmount"
              :label="$t('存款金额')"
              align='center'>
              <template slot-scope="scope">
                <slot>
                  <!--0 存款 1 优惠-->
                  <div v-if="!scope.row.auditType">
                    <s v-show="scope.row.discardAmount!==0"> {{scope.row.discardAmount}}</s>
                    {{ setThounds(scope.row.depositAmount)}}
                  </div>
                  <div v-else>-</div>
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              prop="discountAmount"
              :label="$t('优惠金额')"
              align='center'>
              <template slot-scope="scope">
                <slot>
                  <!--0 存款 1 优惠-->
                  <!-- <div v-if="scope.row.auditType"> -->
                  <div>
                    {{setThounds(scope.row.discountAmount)}}
                    <template v-if="scope.row.auditType">( {{setThounds(scope.row.depositAmount)}} x {{setThounds(scope.row.activityName)}})</template>
                  </div>
                  <!-- <div v-else>-</div> -->
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('好友返利')"
              prop="friendRebateAmount"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ setThounds(scope.row.friendRebateAmount)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="auditAmount"
              :label="$t('流水需求')"
              align='center'>
              <template slot-scope="scope">
                <slot>
                  <span v-if="!ifXg || scope.row.status===1"> {{scope.row.auditAmount}}</span>
                  <input v-else type="text" class="xg" :placeholder="scope.row.auditAmount"
                         @change="changeData($event,scope.row.id,scope.row.auditType)">
                  <div v-show="scope.row.auditType === 1">
                    ( {{scope.row.depotName}} {{scope.row.catName}})
                  </div>
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('转账给好友')"
              align='center'>
              <template slot-scope="scope">
                {{ setThounds(scope.row.reduceAuditAmount)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="validBet"
              :label="$t('有效投注')"
              align='center'>
              <template slot-scope="scope">
                {{ setThounds(scope.row.validBet)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="remainValidBet"
              :label="$t('溢出投注')"
              align='center'>
              <template slot-scope="scope">
                {{ setThounds(scope.row.remainValidBet)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="payOut"
              :label="$t('盈亏')"
              align='center'>
              <template slot-scope="scope">
                <slot>
                  <span v-if="parseInt(scope.row.payOut) > 0" class="color-green">{{setThounds(scope.row.payOut)}}</span>
                  <span v-else class="color-red">{{setThounds(scope.row.payOut)}}</span>
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              align="center"
              prop="passTime" :formatter="timeFilter"
              :label="$t('通过时间')">
            </el-table-column>
            <el-table-column
              prop="status"
              align="center"
              :formatter="twoNumber"
              :label="$t('稽核状态')">
              <template slot-scope="scope">
                <slot>
                  <!-- <div @click="listDetail(scope.row)"> -->
                  <div>
                    <!-- 如果 违规了 根据是否人工处理  如果人工处理带横线 只能看详情 如果没有 人工处理 不带横线  可以点进去操作
                      auditType0 存款 1 优惠  isDispose 是否已经人工处理 0否 1是  scope.row.isValid; 0无效，违规 1有效 没有
                    -->
                    <div v-show="scope.row.auditType === 1">
                      <div v-if="scope.row.isDispose">
                        <s>（{{ $t('违规') }}）</s>
                      </div>
                      <div v-else>
                        <span v-if="!scope.row.isValid">（{{ $t('违规') }}）</span>
                      </div>
                    </div>
                    <span v-if="scope.row.status ==0" class="color-red">
                     {{scope.row.newDataOne }}
                   </span>
                    <span v-else-if="scope.row.status ==1" class="color-green">
                     {{scope.row.newDataOne }}
                   </span>
                    <span v-else>
                     {{scope.row.newDataOne }}
                   </span>

                  </div>
                </slot>
              </template>
            </el-table-column>
          </el-table>
           <!-- 游戏平台 -->
          <TableGame :listReq="listReq" :bonusDetailDtos="tableDataJsGame" :ifXg="ifXg" @handleBonusDetailDtosDialogs="handleBonusDetailDtosDialogs"  @onChangeData="onChangeData"/>
        </div>
        <!--历史稽核-->
        <div v-else>
          <div v-if="!tableDataLs.length">
            无历史稽核
          </div>
          <div v-else>
            <div v-for="(i,index) in tableDataLs" :key="index">
              <!--时间-->
              <el-row class="ma-top-20 mar-left-20" v-if="SeachTypeValueSub">
                <el-col :span="24" style="margin-top: 20px"> {{index+1}}. {{i.startTime}} - {{i.endTime}}
                </el-col>
              </el-row>
              <!--存款-->
              <el-row class="ma-top-20  mar-left-20">
                <el-col :span="1.2">{{ $t('存款稽核') }}:&nbsp;</el-col>
                <el-col :span="1.2">{{ $t('总存款') }}:{{i.auditInfoDto.depositTotal}}{{ currencyText() }}&nbsp;</el-col>
                <el-col :span="1.2">{{ $t('已完成流水') }}{{i.auditInfoDto.currentDepositValidBet}}{{ currencyText() }}&nbsp;</el-col>
                <el-col :span="1.2" :class="i.auditInfoDto.depositSucceed?'color-green':'color-red'"
                        style="font-weight: bold">
                  &nbsp;&nbsp;&nbsp;{{i.auditInfoDto.depositSucceed?$t('通过'):$t('不通过') }}&nbsp;
                </el-col>
              </el-row>
              <!-- 表格通用-->
              <el-table max-height="480"
                :data="i.auditInfoDto.auditDetailDtos"
                stripe
                border
                class="ma-top-20"
                style="width: 100%">
                <el-table-column
                  prop="total"
                  align="center"
                  :label="$t('序号')"
                  type="index" width="50" :index="indexMethod"
                >
                </el-table-column>
                <el-table-column
                  prop="time" align="center" :formatter="timeFilter"
                  :label="$t('开始时间')">
                </el-table-column>
                <el-table-column
                  prop="depositAmount"
                  :label="$t('存款金额')"
                  align='center'>
                  <template slot-scope="scope">
                    <slot>
                      <!--0 存款 1 优惠-->
                      <div v-if="!scope.row.auditType">
                        <s v-show="scope.row.discardAmount!==0"> {{scope.row.discardAmount}}</s>
                        <!--<s> {{scope.row.discardAmount}}</s>-->
                        {{scope.row.depositAmount}}
                      </div>
                      <div v-else>-</div>
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="discountAmount"
                  :label="$t('优惠金额')"
                  align='center'>
                  <template slot-scope="scope">
                    <slot>
                      <!--0 存款 1 优惠-->
                      <!-- <div v-if="scope.row.auditType"> -->
                      <div>
                        {{scope.row.discountAmount}}
                        <template v-if="scope.row.auditType">( {{scope.row.depositAmount}} x {{scope.row.activityName}})</template>
                      </div>
                      <!-- <div v-else>-</div> -->
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="auditAmount"
                  :label="$t('流水需求')"
                  align='center'>
                  <template slot-scope="scope">
                    <slot>
                      <span v-if="!ifXg"> {{scope.row.auditAmount}}</span>
                      <input class="xg" v-else :placeholder="scope.row.auditAmount"
                             @change="changeData($event,scope.row.id,scope.row.auditType)">
                      <div v-show="scope.row.auditType === 1">
                        ( {{scope.row.depotName}} {{scope.row.catName}})
                      </div>
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="validBet"
                  :label="$t('有效投注')"
                  align='center'>
                </el-table-column>
                <el-table-column
                  prop="remainValidBet"
                  :label="$t('溢出投注')"
                  align='center'>
                </el-table-column>
                <el-table-column
                  prop="payOut"
                  :label="$t('盈亏')"
                  align='center'>
                  <template slot-scope="scope">
                    <slot>
                      <span v-if="parseInt(scope.row.payOut) >0" class="color-green">{{scope.row.payOut}}</span>
                      <span v-else class="color-red">{{scope.row.payOut}}</span>
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column
                  width="200"
                  align="center"
                  prop="passTime" :formatter="timeFilter"
                  :label="$t('通过时间')">
                </el-table-column>
                <el-table-column
                  prop="status"
                  align="center"
                  :formatter="twoNumber"
                  :label="$t('稽核状态')">
                  <template slot-scope="scope">
                    <slot>
                      <div v-show="scope.row.auditType === 1">
                        <div v-if="scope.row.isDispose">
                          <s>（{{ $t('违规') }}）</s>
                        </div>
                        <div v-else>
                          <span v-if="!scope.row.isValid">（{{ $t('违规') }}）</span>
                        </div>
                      </div>
                      <span v-if="scope.row.status ==0" class="color-red">
                       {{scope.row.newDataOne }}
                     </span>
                      <span v-else-if="scope.row.status ==1" class="color-green">
                       {{scope.row.newDataOne }}
                     </span>
                      <span v-else>
                       {{scope.row.newDataOne }}
                     </span>
                    </slot>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 游戏平台-->
              <TableGame v-if="i.auditInfoDto.bonusDetailDtos.length" :key="'tableGame' + index" :listReq="listReq" :bonusDetailDtos="i.auditInfoDto.bonusDetailDtos" :ifXg="ifXg" @handleBonusDetailDtosDialogs="handleBonusDetailDtosDialogs" @onChangeData="onChangeData"/>
            </div>
          </div>
        </div>
      </el-row>
      <!-- 出款订单 即时审核 -->
      <el-row class="ma-top-20 bor-1-333" v-if="withdrawAuditInfo">
        <!--标题-->
        <div class="bg-33 pad-20 color-red">
          <p style="display: inline-block;">{{ $t('出款订单') }}：{{withdrawAuditInfo.orderNo}}</p>
          <CopyButton v-if="withdrawAuditInfo.orderNo" :copy-content="withdrawAuditInfo.orderNo"/>
          <span style="margin-left:30px;">{{ $t('出款状态') }}：{{{2: $t('初审'), 3: $t('复审')}[withdrawAuditInfo.status]}}</span>
        </div>
        <el-row class="ma-top-20 mar-left-20 ">
          <el-col :span="1.2">{{ $t('即时稽核') }}</el-col>
        </el-row>
        <!-- 表格通用-->
        <el-table max-height="480"
          :data="withdrawAuditInfo.auditDetailDtos"
          stripe
          border
          style="width: 100%;margin-top: 20px">
          <el-table-column
            prop="total"
            :label="$t('序号')"
            align="center"
            type="index" width="50" :index="indexMethod"
          >
          </el-table-column>
          <el-table-column
            prop="time" align="center" :formatter="timeFilter"
            :label="$t('开始时间')">
          </el-table-column>
          <el-table-column
            prop="depositAmount"
            :label="$t('存款金额')"
            align='center'>
            <template slot-scope="scope">
              <slot>
                <!--0 存款 1 优惠-->
                <div v-if="!scope.row.auditType">
                  <s v-show="scope.row.discardAmount!==0"> {{scope.row.discardAmount}}</s>
                  {{scope.row.depositAmount}}
                </div>
                <div v-else>-</div>
              </slot>
            </template>
          </el-table-column>
          <el-table-column
            prop="discountAmount"
            :label="$t('优惠金额')"
            align='center'>
            <template slot-scope="scope">
              <slot>
                <!--0 存款 1 优惠-->
                <!-- <div v-if="scope.row.auditType"> -->
                <div>
                  {{scope.row.discountAmount}}
                  <template v-if="scope.row.auditType">( {{scope.row.depositAmount}} x {{scope.row.activityName}})</template>
                </div>
                <!-- <div v-else>-</div> -->
              </slot>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditAmount"
            :label="$t('流水需求')"
            align='center'>
            <template slot-scope="scope">
              <slot>
                <span v-if="!ifXg || scope.row.status===1"> {{scope.row.auditAmount}}</span>
                <input v-else type="text" class="xg" :placeholder="scope.row.auditAmount"
                      @change="changeData($event,scope.row.id,scope.row.auditType)">
                <div v-show="scope.row.auditType === 1">
                  ( {{scope.row.depotName}} {{scope.row.catName}})
                </div>
              </slot>
            </template>
          </el-table-column>
          <el-table-column
            prop="validBet"
            :label="$t('有效投注')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="remainValidBet"
            :label="$t('溢出投注')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="payOut"
            :label="$t('盈亏')"
            align='center'>
            <template slot-scope="scope">
              <slot>
                <span v-if="parseInt(scope.row.payOut) > 0" class="color-green">{{scope.row.payOut}}</span>
                <span v-else class="color-red">{{scope.row.payOut}}</span>
              </slot>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            align='center'
            prop="passTime" :formatter="timeFilter"
            :label="$t('通过时间')">
          </el-table-column>
          <el-table-column
            prop="status"
            align='center'
            :formatter="twoNumber"
            :label="$t('稽核状态')">
            <template slot-scope="scope">
              <slot>
                <!-- <div @click="listDetail(scope.row)"> -->
                  <div>
                  <div v-show="scope.row.auditType === 1">
                    <div v-if="scope.row.isDispose">
                      <s>（{{ $t('违规') }}）</s>
                    </div>
                    <div v-else>
                      <span v-if="!scope.row.isValid">（{{ $t('违规') }}）</span>
                    </div>
                  </div>
                  <span v-if="scope.row.status ==0" class="color-red">
                  {{ $t('不通过') }}
                </span>
                  <span v-else-if="scope.row.status ==1" class="color-green">
                  {{ $t('通过') }}
                </span>
                  <span v-else>
                  {{ $t('输光') }}
                </span>

                </div>
              </slot>
            </template>
          </el-table-column>
        </el-table>
        <TableGame :listReq="listReq" :bonusDetailDtos="withdrawAuditInfo.bonusDetailDtos" :ifXg="ifXg" @handleBonusDetailDtosDialogs="handleBonusDetailDtosDialogs"  @onChangeData="onChangeData"/>
      </el-row>

      <el-dialog title="游戏类型"
                 :visible.sync="centerDialogVisible"
                 width="30%"
                 center>
          <div v-for="{ name, list } in bonusDialogList">
            <div class="nameCl">{{ name }}</div>
            <div class="nameClTwoo">
              <span v-for="item in list"  class="nameClTwo">{{ item }}</span>
            </div>
          </div>
      </el-dialog>
      <!--body-->
      <!--分页-->
      <div class="pagination" v-show="SeachTypeValueSub && tableDataLs.length">
        <el-pagination
          background
          @size-change="handleSizePageChange"
          @current-change="handleNoPageChange"
          :current-page="pageNo"
          :page-sizes="sizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <div class="intTime">
        <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
        <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'
  import queryStore from '../../mixins/queryStore'
  import CopyButton from '../../components/CopyButton'
  import {mapGetters} from 'vuex'
  import Mixin from '@/mixins/loadTime'
  import site from '@/mixins/site'
  import _ from "lodash";

  import TableGame from './TableGame.vue'

  export default {
    name: 'checkSheet',
    mixins: [site, Mixin, queryStore(['SeachTypeValue', 'SeachMemberName'])],
    components:{ CopyButton, TableGame },
    data() {
      return {
        safePassword: "",
        tmpValue4SafeCheck: {},
        bonusResidueValidBet: 0,
        depositResidueValidBet: 0,
        ifClear: false,
        SeachMemberNameTrue: '',
        memberInfoRule: systemConfig.rules.memberInfoRule,
        ifSubmit: true,
        ifTime: false,
        newRow: '',
        ifXg: false,
        ifShow: false,
        groupNameForMoney: '',
        clickId: '',
        mero: '',
        nMoney: 0,
        sMoney: 0,
        addMoney: 0,
        totalCount: 0,
        pageNo: 1,
        pageSize: 10,
        sizes: [10, 20, 30, 40],
        tableDataGudong: [],
        tagencyId: null,
        groupName: this.$t('黄金组'),
        depositTotal: 0,
        two: 0,
        depositValidBet: 0,
        currentDepositValidBet: 0,
        transferTotal: 0,
        bonusAmount: 0,
        transferValidBet: 0,
        currentTransferValidBet: 0,
        depositSucceed: '',
        dbounsSucceed: '',
        tableDataJs: [], /*即时稽核*/
        tableDataJsGame: [], /*即时稽核-游戏平台*/
        tableDataLs: [], /*历史稽核*/
        tableDataYh: [], /*历史稽核--》优惠稽核表格*/
        radioSelect: 0,
        radioSelectNew: 0,
        simpleData: [], /*单条信息*/
        simpleDataTz: '', /* 投注*/
        simpleDataTwo: [], /*单条信息 第二个表格数据*/
        title: this.$t('违规投注详情'), /*弹出框标题*/
        dialogVisible: false,
        SeachTypeValue: 0, /*类型*/
        SeachTypeValueSub: 0,
        SeachMemberName: '', /*会员名*/
        lastUpdateTime: '',
        startTime: '',
        endTime: '',
        tableData: {},
        xgData: [],
        newIfShowWshich: {},
        withdrawAuditInfo: null,
        valueBool:false,
        centerDialogVisible: false,
        bonusDialogList: []
      }
    },
    created() {
    },
    computed: {
      ...mapGetters(['hasPermission']),
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      loading() {
        return this.$store.state.searchLoading
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
      mr() {
        return this.pageFlag === 'mainPage' ? 0 : 80
      }
    },
    watch: {
      '$store.state.safePasswordCallbackPageEnd': function() {
        let page = this.$store.state.safePasswordCallbackPageEnd.split('_')[0];
        if(!this.$options.name || page !== this.$options.name){ return }

        this.safePassword = this.$store.state.safePassword;
        if(this.tmpValue4SafeCheck.callback && typeof(this.tmpValue4SafeCheck.callback) === 'function'){
          this.tmpValue4SafeCheck.callback.apply(this,this.tmpValue4SafeCheck.args || [])
        }

        this.safePassword="";
        this.tmpValue4SafeCheck={};
      },

      addMoney(n, o) {
        if (n.length > 6) {
          this.$message({
            type: 'error',
            message: this.$t('不能大于6位数')
          })
          this.ifSubmit = false
        } else {
          this.ifSubmit = true
        }

      },
      sMoney(n, o) {
        if (n > this.nMoney) {
          this.$message({
            type: 'error',
            message: this.$t('不能大于本金或者现有额度')
          })
          this.ifSubmit = false
        } else {
          this.ifSubmit = true
        }
      },
    },
    methods: {
      setThounds(val) {
        const num = val ? val : 0
        return num.toLocaleString()
      },
      /*时间处理*/
      timeFilter(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }else if(date.length<=5){
          return date
        }
        return systemConfig.transferTimeByType(date, this.timeType)
      },
      /*表格序号*/
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },

      pickTime1(val) {
        this.startTime = systemConfig.transferTimeByType(val, this.timeType)
      },
      pickTime2(val) {
        this.endTime = systemConfig.transferTimeByType(val, this.timeType)
      },

      /*每页多少条*/
      handleSizePageChange(val) {
        this.pageSize = val
        this.search()
      },
      /*多少页*/
      handleNoPageChange(val) {
        this.pageNo = val
        this.search()
      },
      // 查询即时稽核-出款订单
      getWithdrawAudit(params) {
        this.$axios.get(systemConfig.urls.checckSheetCkJs, params)
        .then(res => {
          if (res.data.data) {
            const { bonusDetailDtos } = res.data.data
            if (bonusDetailDtos.length) {
              this.setTableStatus(bonusDetailDtos)
              this.setTableData(bonusDetailDtos)
            }
            this.withdrawAuditInfo = res.data.data
          }
        })
      },
      // 查询按钮事件
      search() {
        this.getCurrentRecodeTime()
        this.ifShow = false
        if (this.SeachMemberName == '') {
          this.$message({
            type: 'warning',
            message: this.$t('请输入会员名')
          })
          return
        }
        const { pattern, message } = this.memberInfoRule.newAccountName[1]
        if (!pattern.test(this.SeachMemberName)) {
          this.$message({
            type: 'error',
            message
          })
          return
        }
         /*数据初始化*/
        this.depositTotal = 0
        this.depositResidueValidBet = 0
        this.currentTransferValidBet = 0
        this.bonusResidueValidBet = 0
        this.transferTotal = 0
        this.bonusAmount = 0
        /*即时稽核*/
        this.tableDataJs = []
        this.tableDataJsGame = []
        /*出款订单-即时稽核*/
        this.withdrawAuditInfo = null
        /*历史稽核*/
        this.tableDataLs = []
        this.tableDataYh = []
        /*历史稽核--》优惠稽核表格*/
        this.ifClear = false
        /* 用户点了修改稽核 再次查询的时候初始化默认值*/
        this.ifXg = false
        this.SeachMemberNameTrue = this.SeachMemberName

        if (this.SeachTypeValue == 0) {
          this.SeachTypeValueSub = 0
          var obj = {
            params: {
              loginName: this.SeachMemberName
            }
          }
          // this.ifShow = true
          this.getMemArr()
          this.getDataJs(obj)
          this.getUpdateTime()
          this.getWithdrawAudit(obj)
        } else {
          this.SeachTypeValueSub = 1
          var obj = {
            params: {
              loginName: this.SeachMemberName,
              pageNo: this.pageNo,
              pageSize: this.pageSize
            }
          }
          // this.ifShow = true
          this.getMemArr()
          this.getDataLs(obj)
          /*历史稽核下的优惠稽核单独调api*/
          this.getDataLsYh(obj)
        }
      },
      // 重置查询条件
      reset() {
        this.SeachMemberName = ''
        this.SeachTypeValue = 0
      },
      /*即时稽核*/
      getDataJs(param) {
        var url = systemConfig.urls.checckSheetJs
        this.$store.state.searchLoading = true
        this.$axios.get(url, param).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          let data = resp.data.data
          this.ifShow = true
          if (data) {
            this.depositTotal = data.depositTotal
            // this.two = data.BigDecimal
            this.depositValidBet = data.depositValidBet
            this.currentDepositValidBet = data.currentDepositValidBet
            this.transferTotal = data.transferTotal
            this.bonusAmount = data.bonusAmount
            this.transferValidBet = data.transferValidBet
            this.currentTransferValidBet = data.currentTransferValidBet
            this.depositSucceed = data.depositSucceed
            this.dbounsSucceed = data.dbounsSucceed
            this.bonusResidueValidBet = data.bonusResidueValidBet
            this.depositResidueValidBet = data.depositResidueValidBet
            // 即时稽核数据处理
            let TableData =  _.cloneDeep(data.auditDetailDtos || [])
            let bonusDetailDtos =  _.cloneDeep(data.bonusDetailDtos || [])
            if (bonusDetailDtos.length) {
              this.setTableStatus(bonusDetailDtos)
              this.setTableData(bonusDetailDtos)
            }
            if (TableData.length > 0) {
              this.setTableStatus(TableData)
            }
            this.tableDataJs = TableData
            this.tableDataJsGame = bonusDetailDtos
          }
        })
      },
      setTableData (arr) {
        const obj = {
          1:  this.$t("体育"),
          3:  this.$t("真人"),
          5:  this.$t("电子"),
          6:  this.$t("棋牌"),
          8:  this.$t("捕鱼"),
          9:  this.$t("电竞"),
          12: this.$t("彩票"),
          49: this.$t("斗鸡")
        }
        arr.map((v, i) => {
          if ( v ) {
            const { depotNames } = v
            let arr = []
            depotNames.map(t => {
              if (!arr.includes(t.catId)) {
                arr.push(t.catId)
              }
            })
            if (arr.length === 7) { // 添加列表游戏平台名称
              v.bonusStr = this.$t("全部")
            } else {
              let str = obj[arr[0]]
              arr.map((s, si) => {
                if (si > 0)  str +=  '、' + obj[s]
              })
              v.bonusStr = str
            }
            let bonusDialogList = arr.map(id => {
              let list = []
              depotNames.map(({ depotName, catId}) => {
                if (catId === id) {
                  list.push(depotName)
                }
              })
              return {
                name: obj[id],
                list: list
              }
            })
            v.bonusDialogList = bonusDialogList
          }
        })
      },
      setTableStatus (arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].status == 0) {
            arr[i].newDataOne = this.$t('不通过')
          } else if (arr[i].status == 1) {
            arr[i].newDataOne = this.$t('通过')
          } else {
            arr[i].newDataOne = this.$t('输光')
          }
        }
      },
      /*历史稽核*/
      getDataLs(param) {
        var url = systemConfig.urls.checckSheetLs
        this.$store.state.searchLoading = true
        this.$axios.get(url, param).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          let data = resp.data.page
          this.totalCount = data.totalCount
          const list = _.cloneDeep(data.list)
          list.map(v => {
            if (v.auditInfoDto && v.auditInfoDto.bonusDetailDtos) {
              if ( v.auditInfoDto.bonusDetailDtos.length) {
                this.setTableStatus( v.auditInfoDto.bonusDetailDtos)
                this.setTableData( v.auditInfoDto.bonusDetailDtos)
              }
            }
          })
          this.tableDataLs = list
          if (this.tableDataLs != null) {
            this.ifShow = true
          }
        })
      },
      /*历史稽核----》优惠稽核*/
      getDataLsYh(param) {
        var url = systemConfig.urls.checckSheetLsYh
        this.$store.state.searchLoading = true
        this.$axios.get(url, param).then((resp) => {
          let TableData = resp.data.page
          if (TableData) {
            for (var i = 0; i < TableData.length; i++) {
              if (TableData[i].status == 0) {
                TableData[i].newDataOne = this.$t('不通过')
              } else if (TableData[i].status == 1) {
                TableData[i].newDataOne = this.$t('通过')
              } else {
                TableData[i].newDataOne = this.$t('输光')
              }
            }
          }
          this.tableDataYh = TableData
        })
      },
      /*根据会员名查会员组和金额*/
      getMemArr() {
        var obj = {
          params: {
            loginName: this.SeachMemberName,
          }
        }
        //this.$store.state.fullscreenLoading = true
        var url = systemConfig.urls.checckSheetMemberGroup
        this.$axios.get(url, obj).then((resp) => {
          let data = resp.data.data
          this.tagencyId = data.TagencyId
          this.groupName = data.GroupName
          this.groupNameForMoney = data.OverFee
        })
      },
      /*即时稽核---》修改稽核*/
      getDataJsXg() {
        if (this.ifClear) {
          this.$message({
            type: 'success',
            message: this.$t('已经清除稽核,暂不需要修改数据')
          })
          return
        }
        this.ifXg = true
      },

      safePasswordInputedAfter: function (safePassword) {
        this.safePassword=safePassword;
        if(this.tmpValue4SafeCheck.isClearAll){
          this.clearAllAudit();
        }else {
          this.submitXgLs();
        }
      },

      /*即时稽核---》修改稽核*/
      submitXgLs() {
        if(this.valueBool){
          this.$message({
            type:'warning',
            message:this.$t('修改的流水需求格式应为数字')
          })
          return
        }

        // 安全密码弹窗
        if(!this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.submitXgLs);
          this.$set(this.tmpValue4SafeCheck,"args", []);
          return;
        }

        let url = systemConfig.urls.checckSheetJsXg
        var obj = this.xgData
        //this.$store.state.fullscreenLoading = true
        this.$axios.post(url, obj,{headers: {securepwd: this.safePassword}}).then(resp => {
          let data = resp.data
          if (data.code == 0) {
            this.$message({
              type: 'success',
              message: this.$t('修改成功')
            })
            this.search()
            this.ifXg = false
            this.xgData = []
          }
        }).finally(()=>{
          this.safePassword="";
          this.tmpValue4SafeCheck={};
        })
      },
      /*即时稽核---》修改稽核*/
      sorry() {
        this.ifXg = false
      },
      changeData(e, id, type) {
        var val = e.target.value
         if(!val||isNaN(Number(val))){
           this.valueBool=true;
           return
         }else{
            this.valueBool=false;
         }
        this.xgData.push({
          id: id,
          auditType: type,
          auditAmount: val
        })
      },
      // 通用表格数据
      onChangeData ({ valueBool, changeData }) {
        this.valueBool = valueBool
        this.xgData.push(changeData)
      },
      /*即时稽核---》删除稽核*/
      getDataJsSc() {
        this.$confirm(this.$t('请确认要清除该玩家的稽核吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {

          // 安全密码弹窗
          if(!this.safePassword) {
            this.$store.commit("safePasswordShow", true);
            this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
            this.$set(this.tmpValue4SafeCheck,"callback", this.clearAllAudit);
            this.$set(this.tmpValue4SafeCheck,"args", []);
            return;
          }
        })

      },
      clearAllAudit(){
          let url = systemConfig.urls.checckSheetJsQc;
          var obj = {
            params: {
              loginName: this.SeachMemberName,
            },
            headers:{securepwd: this.safePassword}
          }
          //this.$store.state.fullscreenLoading = true
          this.$axios.get(url, obj).then((resp) => {
            let data = resp.data
            if (data.code == 0) {
              this.$message({
                type: 'success',
                message: this.$t('清除成功')
              })
              this.search()
              this.ifClear = true
            }
          }).finally(()=>{
          this.safePassword="";
          this.tmpValue4SafeCheck={};
        });
      },
      /*获取更新时间*/
      getUpdateTime() {
        var obj = {
          params: {
            loginName: this.SeachMemberName,
          }
        }
        //this.$store.state.fullscreenLoading = true
        this.$axios.get(systemConfig.urls.checckSheetJsTime, obj).then((res) => {
          this.lastUpdateTime = res.data.data || ''
        })
      },
      /*表格数据 % */
      twoNumber(row, column, cellValue) {
        return systemConfig.saveTwoNumber(cellValue) + '%'
      },
      handleBonusDetailDtosDialogs (bonusDialogList) {
        this.centerDialogVisible = true
        this.bonusDialogList = bonusDialogList
      }
    }
  }
</script>
<style lang="scss">

  .mar-left-20 {
    margin-left: 10px;
  }

  .ma--20 {
    margin-top: -20px;
  }

  .lastUpdate-tine {
    width: inherit;
    padding: 5px;
    text-align: center;
  }

  .flo-le {
    float: left;
    width: 60%;
  }

  .flo-ri {
    float: right;
    width: 30%;
    text-align: right;
    margin-right: 20px;
  }

  .time {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
    height: 180px;
    background: #f6f7f8;
    border-radius: 5px;
    z-index: 22222222;
  }

  .time div {
    width: 100%;
    display: inline-block;
    text-align: center;
    height: 40px;
    line-height: 40px;

  }

  .xg {
    width: 50px;
    background: #D6D6D6;
  }

  .but-cl {
    color: #257cb6;
  }

  .pad-20 {
    padding: 10px;
  }

  .bg-33 {
    background: #f6f7f8
  }

  .bor-1-333 {
    border: 1px solid #e3e3e3
  }

  .text {
    font-size: 14px;
  }

  .item2 {
    padding: 5px 0;
  }

  .box-card {
    width: 480px;
  }

  .ma-top-10 {
    margin-top: 10px;
  }

  .ma-top-20 {
    margin-top: 20px;
  }

  .set-block {
    display: block;
    float: right;
    width: 100%;
  }

  .special-fgf {
    width: 5px !important;
    line-height: 75px;
  }

  .mt20 {
    margin-top: 20px;
    cursor: pointer;
  }

  .double-row {
    background: rgb(246, 246, 246)
  }

  .pannel-tabs {
    border: 1px solid #ebeef5;
    border-bottom: none;
    background: rgb(246, 247, 248);
    .pannel {
      width: 132px;
      display: inline-block;
      text-align: center;
      line-height: 37px;
      border: 1px solid transparent;
      font-size: 14px;
      font-weight: bold;
    }
    .on {
      border-left-color: #ebeef5;
      border-right-color: #ebeef5;
      color: #158cdb;
      background: #fff;
    }
    &:first-child {
      border-left: none
    }
  }

  .table-tab {
    padding: 20px;
    border: 1px solid #ebeef5;
    border-top: none;
    .el-table__header th {
      background: #fff;
    }
    .el-table td {
      border-bottom: none
    }
    .el-table::before {
      height: 0
    }
    .el-table .cell {
      line-height: 34px;
    }
  }

  .color-red {
    color: red;
    cursor:pointer
  }

  .color-green {
    color: green;
  }

  .bg-fff {
    background: #fff;
  }

  .nameCl {
    color: #8dbdfa;
    font-weight: 800;
    padding-bottom: 10px;
  }
  .nameClTwo {
    color: #8dbdfa;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .nameClTwoo {
    padding-bottom: 10px;
  }
</style>
