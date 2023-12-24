<template>
  <div class="member-withdraw"
       v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search"
         :class="searchClass">
      <div class="search-basic clearfix"
           style="overflow: visible">
        <div class="search-basic-item width180">
          <label>{{ $t('订单号') }}</label>
          <input type="text" v-model="orderNo" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input
            type="text"
            v-model="accountName"
            v-trim
            @keyup.enter="search()"
          />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('收款姓名') }}</label>
          <input
            type="text"
            v-model="getheringName"
            v-trim
            @keyup.enter="search()"
          />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('审核人') }}</label>
          <input type="text" v-model="auditer" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('总代') }}</label>
          <el-select
            size="small"
            v-model="topAgyAccountValue"
            :placeholder="$t('请选择')"
            @change="getAgyAccount"
            multiple
            filterable
            clearable
          >
            <el-option
              v-for="item in topAgyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id"
            >
              {{ item.agyAccount }}
              <GlobalComponentTestLabel :id="item.id"
                                        :parentId="item.parentId" />
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
              {{ item.agyAccount }}
              <GlobalComponentTestLabel :id="item.id"
                                        :parentId="item.parentId" />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select
            size="small"
            v-model="groupValue"
            :placeholder="$t('请选择')"
            multiple
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.groupName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('锁定状态') }}</label>
          <el-select
            size="small"
            v-model="lockStatus"
            :placeholder="$t('请选择')"
            clearable
          >
            <el-option
              v-for="item in lockStatusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
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
            @change="statusSelectChange"
            multiple
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('客户端') }}</label>
          <el-select
            size="small"
            v-model="withdrawSourceList"
            :placeholder="$t('请选择')"
            multiple
          >
            <el-option label="PC" value="0"></el-option>
            <el-option label="H5" value="3"></el-option>
          </el-select>
        </div>
        <!--最后申请时间-->
        <div class="search-basic-item mr0">
          <div style="height: 20px">
            <label>{{ $t('申请时间') }}</label>
          </div>
          <StartAndEndTimeSelector type="datetime"
                                   ref="searchTime0"
                                   :width="480"
                                   :left="100"
                                   :startTime.sync="startTime"
                                   :endTime.sync="endTime"
                                   :defaultTypeP="defaulttypep" />
        </div>
        <!-- 提款类型 -->
        <div class="search-basic-item width180">
          <label>{{ $t('提款类型') }}</label>
          <el-select
            size="small"
            v-model="methodType"
            :placeholder="$t('请选择')"
            clearable
            @change="handleMethodType"
          >
            <el-option :label="currencyType()" :value="0"></el-option>
            <el-option :label="$t('加密货币')" :value="1"></el-option>
            <el-option :label="$t('支付宝')" :value="2"></el-option>
            <el-option :label="$t('其他钱包')" :value="3"></el-option>
            <el-option :label="$t('极速提款')" :value="4"></el-option>
            <el-option :label="$t('数字人民币')" :value="5"></el-option>
            <el-option :label="$t('人工提款')" :value="6"></el-option>
            <el-option :label="$t('电子钱包')" :value="7"></el-option>
          </el-select>
        </div>
        <!-- 协议类型 -->
        <div class="search-basic-item width180">
          <label>{{ $t('协议类型') }}</label>
          <el-select
            size="small"
            v-model="currencyProtocol"
            :placeholder="$t('请选择')"
            clearable
            :disabled="!methodType" >
            <el-option :label="$t('以太坊') + '(ERC20)'" value="ERC20"></el-option>
            <el-option :label="$t('波场') + '(TRC20)'" value="TRC20"></el-option>
          </el-select>
        </div>
        <!--出款时间-->
        <div class="search-basic-item mr0">
          <div style="height: 20px">
            <label>{{ $t('出款时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime"
                                   :width="480"
                                   :left="100"
                                   :startTime.sync="startPassTime"
                                   :endTime.sync="endPassTime" />
        </div>
        <!--免审订单-->
        <div class="search-basic-item width180">
          <label>{{ $t('免审订单') }}</label>
          <el-select
            size="small"
            v-model="isExempt"
            :placeholder="$t('请选择')"
            clearable
          >
            <el-option :label="$t('全部')" :value="false"></el-option>
            <el-option :label="$t('免审订单')" :value="true"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('提款金额') }}</label>
          </div>
          <el-input v-model.number="minDrawingAmount"
                    v-trim
                    type="text"
                    style="width: 48%"
                    @keyup.enter.native="search()"></el-input>
          -
          <el-input v-model.number="maxDrawingAmount"
                    v-trim
                    type="text"
                    style="width: 48%"
                    @keyup.enter.native="search()"></el-input>
        </div>
      </div>
    </div>
    <el-row style="
        background-color: #f6f7f8;
        padding: 10px 20px 25px;
        margin-top: -14px;
      "
      class="border-new-lrb"
    >
      <el-col :span="12" class="tect-le color-blue" style="cursor: pointer">
        <span @click="more"
          >{{ extendTitle }}{{ $t('查询') }}<i
            :class="[
              this.showExtend ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
            ]"
             class="icon-more el-select__caret el-input__icon"></i></span>
      </el-col>
      <el-col :span="12" class="tect-ri">
        <el-button
          type="primary"
          @click.native="search()"
          size="small"
          class="wid-80"
          >{{ $t('查询') }}</el-button
        >
        <el-button
          type="danger"
          @click.native="reset()"
          size="small"
          class="wid-80"
          >{{ $t('重置') }}</el-button
        >
      </el-col>
    </el-row>
    <div class="export-div"
         style="height: 80px">
      <div class="statistic">
        <div>
          <span class="s"
            >{{ $t('今日取款') }}:{{
              staticData.todayWithdraw ? staticData.todayWithdraw : '0'
            }}</span
          >
          <span class="s"
            >{{ $t('提款金额合计') }}:{{
              staticData.drawingAmount ? staticData.drawingAmount : '0'
            }}</span
          >
        </div>
        <div>
          <span class="s"
            >{{ $t('手续费合计') }}:{{
              staticData.handlingCharge ? staticData.handlingCharge : '0'
            }}</span
          >
          <span class="s"
            >{{ $t('实际金额合计') }}:{{
              staticData.actualArrival ? staticData.actualArrival : '0'
            }}</span
          >
        </div>
      </div>
      <!-- <div class="span-money">
        <span style="font-weight: bold;color: #666666">今日提款: </span><span
        style="font-weight: bold;color: #666666;font-size: 14px">{{allTodayWithdraw}}</span>
      </div> -->
      <el-button class="floatbtn floatbtn2" :class="!hasPermission('fund:accWithdraw:manual')?'noAcc':''" type="primary" @click="alertSet">{{ $t('催单设置') }}</el-button>
      <el-button class="floatbtn" type="primary" v-if="hasPermission('fund:accWithdraw:manual')" @click="manulWithdraw">{{ $t('人工提款') }}</el-button>
      <TimeEvery
        @getTime="setTimeRefresh"
        style="margin-right: 93px"
      ></TimeEvery>
      <el-button
        class="iconfont icon-export el-button-export exportList"
        v-if="hasPermission('fund:accWithdraw:exportExcel') && isNowDowning"
        :disabled="!total"
        @click="handleExport"
        >{{ $t('导出') }}</el-button
      >
      <el-button
        class="iconfont icon-export el-button-export exportList"
        v-if="hasPermission('fund:accWithdraw:exportExcel') && !isNowDowning"
        >{{ $t('导出中') }}...</el-button
      >
      <!--<TimeEvery :data="options"></TimeEvery>-->
      <!-- <el-button class="iconfont icon-export el-button-export">导出报表</el-button> -->
    </div>
    <div class="search-form">
      <el-table
        max-height="545"
        :data="tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column
          label-class-name="heightThe"
          :label="$t('序号')"
          type="index"
          :index="indexMethod"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('订单号')"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-show="scope.row.orderNoText"
                       @click="jugeShowDetail(scope.row)"
                       type="text"
                       size="small">{{ scope.row.orderNoText }}</el-button>
            <CopyButton v-show="scope.row.orderNoText"
                        :copy-content="scope.row.orderNoText + ''" />
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="loginName"
          :label="$t('会员名')"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span class="tect-le color-blue"
                  style="cursor: pointer"
                  @click="goDetail(scope.row)">{{ scope.row.loginName }}</span>
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="groupName"
          :label="$t('会员组')"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="tierName"
          :label="$t('VIP等级')"
          align="center"
        ></el-table-column>
        <el-table-column
          label-class-name="heightThe"
          width="120"
          prop="agyAccount"
          :label="$t('上级代理')"
          align="center"
        ></el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="methodType"
          :label="$t('提款类型')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{
              { 0: currencyType(), 
                1: $t('加密货币'), 
                2: $t('支付宝'),  
                3: $t('其他钱包') , 
                4: $t('极速提款'), 
                5: $t('数字人民币'), 
                6: $t('人工提款'),
                7: $t('电子钱包')
              }[scope.row.methodType]
            }}
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="drawingAmount"
          :label="$t('提款金额')"
          align="right"
        >
          <template slot-scope="scope">
            {{ setThounds(scope.row.drawingAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="actualArrival"
          :label="$t('实际金额')"
          align="right"
        >
        <template slot-scope="scope">
            {{ setThounds(scope.row.actualArrival) }}
          </template>
      </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="actualArrivalCr"
          :label="$t('USDT金额')"
          align="right"
        >
        <template slot-scope="scope">
            {{ setThounds(scope.row.actualArrivalCr) }}
          </template>
      </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="createTime"
          width="150"
          align="center"
          :formatter="timeFilter"
          :label="$t('申请时间')"
        >
        </el-table-column>
        <!--<el-table-column label-class-name="heightThe"
          prop="ip"
          label="申请IP">
        </el-table-column> -->
        <el-table-column
          label-class-name="heightThe"
          :label="$t('出款方式')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-show="scope.row.type != '-1'">{{
              typeTextFilter(scope.row.type)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="statusText"
          align="center"
          :label="$t('状态')"
          width="80"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-show="scope.row.status != '-1'"
                    :type="
                scope.row.status === 1
                  ? 'success'
                  : scope.row.status === 2
                  ? 'primary'
                  : scope.row.status === 3
                  ? 'warning'
                  : scope.row.status === 6
                  ? 'info'
                  : scope.row.status === 8
                  ? 'primary'
                  : scope.row.status === 9
                  ? 'info'
                  : 'danger'
              "
                    close-transition>{{ statusTextFilter(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('锁定状态')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <!--            {{ scope.row.lockStatus ? '锁定' : '未锁定' }}-->
            <el-switch v-model="scope.row.lockStatus"
                       @change="mclock(scope.row)"
                       :active-value="1"
                       :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('锁定人')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.lockOperator }}
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="auditUser"
          :label="$t('审核人')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="currencyProtocol"
          :label="$t('协议类型')"
          width="105"
          align="center"
        >
          <!-- <template slot-scope="scope">
            {{ solveText(scope.row.currencyProtocol) }}
          </template>  -->
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="handlingCharge"
          :label="$t('手续费')"
          width="80"
          align="right"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('来源')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            {{ returnStatus(scope.row.withdrawSource) }}
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('预计到账')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="!/[1|0|7]/.test(scope.row.status)&&!scope.row.cuiCount">{{conbain(scope.row.createTime)}}</span>
            <span v-else-if="/[1|0|7|9]/.test(scope.row.status)" class="gray">{{ $t('催单') }}</span>
            <span v-else-if="!/[1|0|7]/.test(scope.row.status)&&scope.row.cuiCount" class="red">{{ $t('催单') }}</span>
            <span v-else class="blue">{{ $t('催单') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="auditTime"
          width="140"
          align="center"
          :formatter="timeFilter"
          :label="$t('审核时间')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="passUser"
          :label="$t('出款人')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="passTime"
          width="140"
          align="center"
          :formatter="timeFilter"
          :label="$t('出款时间')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="exemptUser"
          width="140"
          align="center"
          :label="$t('免审人')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="exemptTime"
          width="140"
          align="center"
          :formatter="timeFilter"
          :label="$t('免审时间')"
        >
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('初审备注')"
          align="center"
        >
          <template slot-scope="scope">{{
            spliceStr(scope.row.memo)
          }}</template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('复审备注')"
          align="center"
        >
          <template slot-scope="scope">{{
            spliceStr(scope.row.memoWithdraw)
          }}</template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          :label="$t('免审备注')"
          align="center"
        >
          <template slot-scope="scope">{{
            spliceStr(scope.row.exemptMemo)
          }}</template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="changeMemo"
          :label="$t('变更备注')"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listReq.pageNo"
                     :page-sizes="listReq.pageSizeArr"
                     :page-size="listReq.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog @close="closeDetail"
               :title="getTitle(rowData.status).title"
               :visible.sync="detailShow">
      <el-form label-position="right"
               label-width="170px">
        <el-row>
          <el-col :span="24" v-show="rowData.orderPrefix">
            <el-form-item :label="$t('订单号') + ':'" class="first-line"
              ><span>{{ rowData.orderPrefix }}{{ rowData.orderNo }}</span>
              <CopyButton
                style="float: right"
                :copy-content="rowData.orderPrefix + rowData.orderNo + ''"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.orderId">
            <el-form-item :label="$t('事件订单号') + ':'" class="first-line"
              ><span>{{ rowData.orderId }}</span>
              <CopyButton
                style="float: right"
                :copy-content="rowData.orderId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名称') + ':'" class="first-line"
              ><span>{{ rowData.loginName }}({{ rowData.groupName }})</span>
              <span
                class="toggle_to_new_page"
                @click="checkAllOrder(rowData.loginName)"
                >{{ $t('查看所有订单') }}>></span
              >
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('代理关系') + ':'" class="first-line">
              <span>{{ rowData.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <template v-if="rowData.methodType === 1">
            <el-col :span="24">
              <el-form-item :label="$t('出款钱包') + ':'" class="first-line"
                ><span>{{ rowData.walletName }}</span></el-form-item
              >
            </el-col>
            <el-col :span="24" v-if="rowData.status !== 2">
              <el-form-item :label="'USDT' + $t('原始订单号') + ':'" class="first-line"
                ><span class="toggle_to_new_page" @click="toggleTo(rowData)">{{
                  rowData.hash
                }}</span></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('出款方式') + ':'" class="first-line"
                ><span
                  >{{ rowData.currencyCode }}-{{
                    rowData.currencyProtocol
                  }}</span></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('会员收款钱包地址') + ':'" class="first-line"
                ><span>{{ rowData.walletAddress }}</span></el-form-item
              >
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('参考汇率') + ':'" class="first-line"
                ><span
                  >1{{ rowData.currencyCode }} =
                  {{ rowData.exchangeRate }} {{ currencySymbol() }}</span
                ></el-form-item
              >
            </el-col>
          </template>

          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户姓名') + ':'" class="first-line"
              ><span id="realName">{{ bankData.mbrBankcard.realName }}</span>
              <span class="copied" v-show="copied1">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 1"
                class="clip iconfont icon-copy"
                data-clipboard-target="#realName"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户帐号') + ':'" class="first-line"
              ><span id="cardNo">{{ bankData.mbrBankcard.cardNo }}</span>
              <span class="copied" v-show="copied2">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 2"
                class="clip iconfont icon-copy"
                data-clipboard-target="#cardNo"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('收款银行') + ':'" class="first-line"
              ><span id="bankName">{{ bankData.mbrBankcard.bankName }}</span>
              <span class="copied" v-show="copied3">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 3"
                class="clip iconfont icon-copy"
                data-clipboard-target="#bankName"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard">
            <el-form-item :label="$t('开户支行') + ':'" class="first-line"
              ><span id="address">{{ bankData.mbrBankcard.address }}</span>
              <span class="copied" v-show="copied4">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 4"
                class="clip iconfont icon-copy"
                data-clipboard-target="#address"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('提款金额') + ':'" class="first-line">
              <span>{{ bankData.drawingAmount }}</span>
              <span>
                <template v-if="bankData.status !== 0">
                  {{
                    bankData.withdrawCount > 1
                      ? translate(bankData.withdrawCount)
                      : $t('首提')
                  }}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </template>
                <!-- CNY -->
                {{ currencySymbol() }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('提款手续费') + ':'" class="first-line">
              <span>{{ bankData.handlingCharge }}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际出款') + ':'" class="first-line">
              <span>{{ bankData.actualArrival }}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="rowData.methodType === 1" :span="24">
            <el-form-item :label="$t('实际到账') + ':'" class="first-line">
              <span>{{ bankData.actualArrivalCr }}</span>
              <span>{{ rowData.currencyCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24"
                  v-if="checkResultIsShow">
            <el-form-item :label="getTitle(rowData.status).checkResult">
              <div>
                <el-radio v-model="trueStatus" :label="1" :disabled="tansferDate() - new Date(rowData.createTime).getTime() < 60000">{{ $t('通过') }}</el-radio>
                <el-radio v-model="trueStatus" :label="0">{{ $t('拒绝') }}</el-radio>
                <el-radio v-model="trueStatus" :label="6" v-if="rowData.status === 2">{{ $t('初审待定') }}</el-radio>
                <el-radio v-model="trueStatus" :label="8" v-if="rowData.status === 2">{{ $t('会员出款待定') }}</el-radio>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-if="!trueStatus && checkResultIsShow" :span="24">
            <el-form-item :label="$t('添加稽核') + ':'" class="add-check">
              <span>{{ $t('本金') }}</span>
              <el-input
                v-model="depositAmount"
                @keyup.native="inputUp('depositAmount')"
              ></el-input
              >{{ currencyText() }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>{{ $t('需要流水') }}</span>
                <el-input
                  v-model="auditAmount"
                  @keyup.native="inputUp('auditAmount')"
                ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核备注') + ':'" class="first-line">
              <el-input
                class="left"
                :disabled="rowData.status === 1 || rowData.status === 0 || !!rowData.relatedOrderno"
                type="textarea"
                v-model="memo"
                :maxlength="400"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="rowData.status === 2 && !trueStatus">
            <el-form-item :label="$t('站内信') + ':'">
              <el-select
                size="small"
                v-model="inMailType"
                :placeholder="$t('请选择')"
                filterable
                clearable
              >
                <el-option
                  v-for="item in inMailTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.status !== 2">
            <el-form-item :label="$t('出款备注') + ':'" class="first-line">
              <el-input
                class="left"
                :disabled="rowData.status === 1 || rowData.status === 0"
                type="textarea"
                v-model="rowData.memoWithdraw"
                :maxlength="400"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.isExempt&&rowData.status === 1">
            <el-form-item :label="$t('免审备注') + ':'" class="first-line">
              <el-input
                class="left"
                type="textarea"
                v-model="rowData.exemptMemo"
                :maxlength="400"
                :disabled="!!rowData0.exemptMemo"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label=""
                          style="margin-bottom: 0">
              <div class="div-submit-btn">
                <!-- <div class="btn" v-if="(rowData.status === 2&&hasPermission('fund:accWithdraw:update')) || (rowData.status === 3&&hasPermission('fund:accWithdraw:FinialUpdate'))">
                  <el-button type="primary" @click.native="changeStatus(rowData.status,rowData.status, rowData.id)">通过
                  </el-button>
                  <el-button type="danger" @click.native="changeStatus(rowData.status,0, rowData.id)">拒绝</el-button>
                </div> -->
                <el-button
                    v-if="bankData.status === 1 && bankData.isExempt && !rowData0.exemptMemo"
                    type="primary"
                    @click="lastPass"
                    :loading="submitLoading">
                    {{ $t('保存') }}
                </el-button>

                <el-button
                  v-if="bankData.canChangeStatus === 1 && hasPermission('fund:accWithdraw:SucToFail')"
                  type="danger"
                  @click="handleConfirm"
                  :loading="submitLoading"
                  >{{ $t('变更为失败') }}</el-button
                >
                <div
                  class="btn"
                  v-if="
                    ((rowData.status === 2 || rowData.status === 6 || rowData.status === 8) &&
                      hasPermission('fund:accWithdraw:update')) ||
                    (rowData.status === 3 &&
                      hasPermission('fund:accWithdraw:FinialUpdate')) 
                  ">
                  <!-- && hasPermission('fund:accWithdraw:resend') && bankData.resendFlag" -->
                  <el-button v-if="rowData.status === 3 && rowData.type === 1 && hasPermission('fund:accWithdraw:resend') && bankData.resendFlag"  @click="resendAccOrder(rowData, trueStatus)" type="primary"> {{ $t('重新请求') }}</el-button>
                  <el-button type="primary"
                             @click.native="
                      changeStatus(
                        rowData.status,
                        trueStatus ? ([6, 8].includes(trueStatus) ? trueStatus : 1) : 0,
                        rowData.id
                      )
                    ">{{ $t('提交') }}
                  </el-button>
                  <div class="moneyDescription"
                       v-if="
                      rowData.status === 3 &&
                      hasPermission('fund:accWithdraw:FinialUpdate')
                    ">
                    <span class="moneyDe">
                      <p>
                        {{ $t('*注意： 请跟三方平台确认这笔订单是否成功或失败。') }}
                      </p>
                      <p>{{ $t('如三方平台确认这比订单成功，审核通过。') }}</p>
                      <p>
                        {{ $t('审核通过后会员该笔订单的钱将被扣除，出款状态变为成功。') }}
                      </p>
                      <p>
                        {{ $t('如三方平台确认这比订单失败，审核拒绝，审核拒绝后会员该笔订单的钱退还给会员账户，') }}
                        <br />
                        {{ $t('出款状态变为失败，无法再变更状态。') }}
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="$t('订单变更')"
      :visible.sync="orderChangeDialogInfo.orderChangeShow"
      width="30% !important"
      @close="orderChangeClose"
    >
      <div>
        <label style="vertical-align: top">{{ $t('变更备注') }}</label>
        <el-input
          style="width: 80%"
          type="textarea"
          :rows="4"
          :placeholder="$t('备注信息')"
          v-model="orderChangeDialogInfo.textarea"
        >
        </el-input>
      </div>
      <div style="color: red; margin: 10px 0 0 50px">
        {{ $t('变更为失败状态后无法撤回') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderChangeDialogInfo.orderChangeShow = false"
          >{{ $t('取 消') }}</el-button
        >
        <el-button type="primary" @click="orderChangeConfirm">{{ $t('确 定') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      @close="closeManul"
      :title="$t('人工提款')"
      :visible.sync="manulWithdrawVisible"
    >
      <el-form label-position="right" label-width="170px" ref="manulForm" :model="manulForm" :rules="manulDetailRules">
        <el-row>
          <el-col :span="24" style="display: flex;align-items: center;">
            <el-form-item :label="$t('订单号') + ':'" class="first-line noborder">
              <el-input v-model="manulForm.relatedOrderno"></el-input>
            </el-form-item>
            <el-button type="primary" @click="connect" style="margin-bottom: 20px;margin-left: 20px;">{{ $t('关联') }}</el-button>
          </el-col>
          <el-col :span="24" v-if="connected">
            <el-form-item :label="$t('会员名称') + ':'" class="first-line"
            ><span>{{ manulForm.loginName }}({{ manulForm.groupName }})</span>
              <span
                class="toggle_to_new_page"
                @click="checkAllOrder(manulForm.loginName)"
              >{{ $t('查看所有订单') }}>></span
              >
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="connected">
            <el-form-item :label="$t('代理关系') + ':'" class="first-line">
              <span>{{ manulForm.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <template v-if="manulForm.methodType === 1 && connected">
            <el-col :span="24">
              <el-form-item :label="$t('出款钱包') + ':'" class="first-line"
              ><span>{{ manulForm.walletName }}</span></el-form-item
              >
            </el-col>
            <el-col :span="24" v-if="manulForm.status !== 2">
              <el-form-item :label="$t('USDT原始订单号') + ':'" class="first-line"
              ><span class="toggle_to_new_page" @click="toggleTo(manulForm)">{{
                  manulForm.hash
                }}</span></el-form-item
              >
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('出款方式') + ':'" class="first-line"
              ><span
              >{{ manulForm.currencyCode }}-{{
                  manulForm.currencyProtocol
                }}</span
              ></el-form-item
              >
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('会员收款钱包地址') + ':'" class="first-line"
              ><span>{{ manulForm.walletAddress }}</span></el-form-item
              >
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('参考汇率') + ':'" class="first-line"
              ><span
              >1{{ manulForm.currencyCode }} =
                  {{ manulForm.exchangeRate }}{{ currencySymbol() }}</span
              ></el-form-item
              >
            </el-col>
          </template>

          <el-col :span="24" v-if="bankData.mbrBankcard&&connected">
            <el-form-item :label="$t('开户姓名') + ':'" class="first-line"
            ><span id="realName2">{{ bankData.mbrBankcard.realName }}</span>
              <span class="copied" v-show="copied1">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 1"
                class="clip iconfont icon-copy"
                data-clipboard-target="#realName2"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard&&connected">
            <el-form-item :label="$t('开户帐号') + ':'" class="first-line"
            ><span id="cardNo2">{{ bankData.mbrBankcard.cardNo }}</span>
              <span class="copied" v-show="copied2">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 2"
                class="clip iconfont icon-copy"
                data-clipboard-target="#cardNo"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard&&connected">
            <el-form-item :label="$t('收款银行') + ':'" class="first-line"
            ><span id="bankName2">{{ bankData.mbrBankcard.bankName }}</span>
              <span class="copied" v-show="copied3">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 3"
                class="clip iconfont icon-copy"
                data-clipboard-target="#bankName"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="bankData.mbrBankcard&&connected">
            <el-form-item :label="$t('开户支行') + ':'" class="first-line"
            ><span id="address2">{{ bankData.mbrBankcard.address }}</span>
              <span class="copied" v-show="copied4">{{ $t('已复制') }}</span>
              <span
                style="cursor: pointer"
                @click="copyFlag = 4"
                class="clip iconfont icon-copy"
                data-clipboard-target="#address"
              ></span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="connected">
            <el-form-item :label="$t('提款金额') + ':'" class="first-line">
              <span>{{ bankData.drawingAmount }}</span>
              <span>
                <template v-if="bankData.status !== 0">
                  {{
                    bankData.withdrawCount > 1
                      ? $t('第') + bankData.withdrawCount + $t('次')
                      : $t('首提')
                  }}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </template>
                <!-- CNY -->
                {{ currencySymbol() }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="connected">
            <el-form-item :label="$t('提款手续费') + ':'" class="first-line">
              <span>{{ bankData.handlingCharge }}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="connected">
            <el-form-item :label="$t('实际出款') + ':'" class="first-line">
              <el-input v-model="bankData.actualArrival"></el-input>
              <!-- <span>{{ bankData.actualArrival }}</span> -->
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="connected">
            <el-form-item label="" style="margin-bottom: 0">
              <div class="div-submit-btn" style="position: relative;left: -60px;">
                <el-button @click="closeManul">{{ $t('取消') }}</el-button>
                <el-button type="primary" @click="addManul">{{ $t('确定') }}</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../config/config.js";
import Clipboard from "clipboard";
import CopyButton from "../../components/CopyButton";
import bus from "../../config/EventBus";
import TimeEvery from "../../components/TimeEvery";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import queryStore from "../../mixins/queryStore";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { lang } from "@/i18n";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

const statusOptions = [
  { value: 2, text: lang("初审") },
  { value: 1, text: lang("通过") },
  { value: 0, text: lang("拒绝") },
  { value: 7, text: lang("失败") },
  { value: 3, text: lang("复审") },
  { value: 6, text: lang("初审待定") },
  { value: 8, text: lang("会员出款待定") },
  { value: 9, text: lang("会员取消") },
];
export default {
  name: "memberWithdraw",
  mixins: [
    site,
    Mixin,
    queryStore([
      "accountName",
      "getheringName",
      "auditer",
      "topAgyAccountValue",
      "agyAccountValue",
      "groupValue",
      "statusValue",
      "withdrawSourceList",
      "startTime",
      "endTime",
    ]),
  ],
  data () {
    return {
      trueStatus: 1,
      safePassword: "",
      tmpValue4SafeCheck: {},
      extendTitle: this.$t("更多"),
      searchClass: "searchNew",
      options: [
        {
          value: "115",
          label: "115s",
        },
        {
          value: "15",
          label: "15s",
        },
      ],
      showExtend: false,
      allTodayWithdraw: "",
      detailShow: false,
      copied1: false,
      copied2: false,
      copied3: false,
      copied4: false,
      copyFlag: 0,
      rowData: {},
      rowData0: {},
      bankData: {},
      memo: "",
      auditTitle: "",
      accountName: "",
      topAgyAccountOptions: [],
      topAgyAccountValue: [],
      trueAgyAccountOptions: [],
      agyAccountOptions: [],
      agyAccountValue: [],
      getheringName: "",
      auditer: "",
      startTime: systemConfig.getCurrentWeek()[0] + " 00:00:00",
      endTime: systemConfig.getCurrentWeek()[1] + " 23:59:59",
      defaulttypep: "currentWeek",
      startPassTime: "",
      endPassTime: "",
      groupOptions: [],
      groupValue: [],
      statusOptions: statusOptions,
      filterArr: statusOptions,
      statusValue: [],
      tableData: [],
      total: 0,
      orderNoText: "",
      isym: true,
      submitLoading: false,
      withdrawSourceList: [],
      isNowDowning: true, //文件导出
      deposit: {
        marginRight: "75px", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      tempUrl: "",
      orderNo: "", //订单号
      staticData: {}, //统计
      depositAmount: null,
      auditAmount: null,
      lockStatus: "",
      lockStatusList: [
        { label: this.$t("锁定"), value: 1 },
        { label: this.$t("未锁定"), value: 0 },
      ],
      curOrderId: "",
      methodType: "",
      inMailType: null,
      inMailTypeList: [
        {
          label: this.$t("流水不足"),
          value: 1,
        },
        {
          label: this.$t("违规下注"),
          value: 2,
        },
        {
          label: this.$t("优惠套利"),
          value: 3,
        },
        {
          label: this.$t("注单未回传"),
          value: 4,
        },
      ],
      currencyProtocol: "",
      isExempt: "",
      minDrawingAmount: "",
      maxDrawingAmount: "",
      auditUser: "",
      orderChangeDialogInfo: {
        orderChangeShow: false,
        textarea: "",
      },
      manulForm: {},
      connected: false,
      commonRule: systemConfig.rules.commonRule,
      manulWithdrawVisible: false,
      manulDetailRules: {
        relatedOrderno: [{required:true,message:this.$t('请输入订单号'),trigger:"blur"}],
      },
      cuiTime: 0,
      ebAadToPayBool: false,
    };
  },
  components: {
    TimeEvery,
    CopyButton,
    StartAndEndTimeSelector,
  },
  created () {
    this.tansferDate()
    this.init();
  },
  mounted () {
    const clipboard = new Clipboard(".clip");
    let self = this;
    clipboard.on("success", function (e) {
      switch (self.copyFlag) {
        case 1:
          self.copied1 = true;
          self.copied2 = false;
          self.copied3 = false;
          self.copied4 = false;
          break;
        case 2:
          self.copied2 = true;
          self.copied1 = false;
          self.copied3 = false;
          self.copied4 = false;
          break;
        case 3:
          self.copied3 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied4 = false;
          break;
        case 4:
          self.copied4 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied3 = false;
          break;
      }
    });
  },
  computed: {
    checkResultIsShow () {
      return (
        this.rowData.status === 2 ||
        this.rowData.status === 3 ||
        this.rowData.status === 6 ||
        this.rowData.status === 8
      );
    },
    loading () {
      return this.$store.state.searchLoading;
    },
    listReq () {
      return {
        pageNo: 1,
        pageSize: 100,
        pageSizeArr: [5, 10, 20, 50, 100, 200],
      };
    },
    fullscreenLoading () {
      return this.$store.state.fullscreenLoading;
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () { },
    },
    ...mapGetters(["hasPermission"]),
  },
  watch: {
    "$store.state.safePasswordCallbackPageEnd": function () {
      let page = this.$store.state.safePasswordCallbackPageEnd.split("_")[0];
      if (!this.$options.name || page !== this.$options.name) {
        return;
      }

      this.safePassword = this.$store.state.safePassword;
      if (
        this.tmpValue4SafeCheck.callback &&
        typeof this.tmpValue4SafeCheck.callback === "function"
      ) {
        this.tmpValue4SafeCheck.callback.apply(
          this,
          this.tmpValue4SafeCheck.args || []
        );
      }

      this.safePassword = "";
      this.tmpValue4SafeCheck = {};
    },
  },
  methods: {
    ...mapActions(["findAgentByloginName"]),
    translate(num) {
      let str
      switch (num) {
        case 2: {
          str = this.$t('第2次')
          break
        }
        case 3: {
          str = this.$t('第3次')
          break
        }
        default: {
          str = this.$t('第{num}次', { num })
        }
      }
      return str
    },
    tansferDate() {
      // 目标时区，东8区
      let targetTimezone = -8
      // 当前时区与中时区时差，以min为维度
      let _dif = new Date().getTimezoneOffset()
      // 本地时区时间 + 时差  = 中时区时间
      // 目标时区时间 + 时差 = 中时区时间
      // 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
      // 东8区时间
      let east8time = new Date().getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
      console.log('new Date(east8time)---', new Date(east8time))
      console.log('new Date---', new Date())
      return east8time
    },
    handleConfirm() {
      if(!this.rowData.lockStatus){
        this.$message.warning(this.$t('订单未锁定，无法进行操作!'))
        return false
      }
      if(this.rowData.lockOperator!==this.$store.state.user.username){
        this.$message.warning(this.$t('订单并非你锁定，请先锁定订单再操作!'))
        return false
      }
      // const submit = () => this.changeStatus(null, 1, null, true)
      // this.$confirm('变更失败后状态无法撤回，是否进行变更？', '变更订单状态', { center: true }).then(() => submit())
      this.orderChangeDialogInfo.orderChangeShow = true;
    },
    lastPass(){
      if(!this.rowData.lockStatus){
        this.$message.warning(this.$t('订单未锁定，无法进行操作!'))
        return false
      }
      if(this.rowData.lockOperator!==this.$store.state.user.username){
        this.$message.warning(this.$t('订单并非你锁定，请先锁定订单再操作!'))
        return false
      }
      this.$axios
        .post(systemConfig.urls.updateExemptMemo, {
          exemptMemo: this.rowData.exemptMemo,
          id: this.rowData.id,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: this.$t("保存免审备注成功！"),
            });
            this.getData();
          }
        }).catch(()=>{
          this.$message({
            type: "error",
            message: this.$t("保存免审备注失败！"),
          })
        })
        .finally(() => {
          this.detailShow = false;
        });
    },
    orderChangeConfirm () {
      this.changeStatus(null, 1, null, true)
    },
    orderChangeClose () {
      this.orderChangeDialogInfo.textarea = ""
    },
    init () {
      if (this.$route.query.status) {
        this.statusValue = [parseInt(this.$route.query.status)];
      }
      if (this.$route.params.source == "moneySheet") {
        let obj = this.$route.params;
        this.startTime = obj.startTime;
        this.endTime = obj.endTime;
        this.search();
        return;
      }
      this.getData();
      this.getMemberOptions();
      /* this.getTodayWithdraw() */
      this.getAgyAccount([]);
      this.getChildAgent();
    },
    async handleChangeFail () {
      const { id } = this.rowData;
      const data = {
        id,
        status: 0,
        memo: null,
        memowithdraw: null,
        changeMemo: this.orderChangeDialogInfo.textarea,
      };
      this.submitLoading = true;
      const { res } = await this.$axios.POST(
        this.$urls.updateAccStatusSucToFail,
        data,
        { headers: { securepwd: this.safePassword || null } }
      );
      this.submitLoading = false;
      if (res) {
        this.$message.success(this.$t('变更成功'))
        this.orderChangeDialogInfo.orderChangeShow = false
        this.detailShow = false
        this.getData()
      }
    },
    handleMethodType (val) {
      this.currencyProtocol = "";
      this.ebAadToPayBool = val === 3
    },
    toggleTo (row) {
      const { currencyProtocol, hash } = row;
      const url = currencyProtocol.includes("TRC")
        ? systemConfig.toggleTotTrc + hash
        : systemConfig.toggleToDomain + hash;
      window.open(url);
      // window.open(systemConfig.toggleToDomain + url)
    },
    setTimeRefresh (val) {
      clearInterval(this.timeOut);
      switch (parseInt(val)) {
        case 5:
          this.TimeFor(5);
          break;
        case 15:
          this.TimeFor(15);
          break;
        case 30:
          this.TimeFor(30);
          break;
        case 60:
          this.TimeFor(60);
          break;
        case 0:
          this.TimeFor(0);
          break;
        case 1000:
          this.getData();
          break;
      }
    },
    TimeFor (time) {
      var that = this;
      if (time == 0) {
        return;
      }
      this.timeOut = setInterval(function () {
        that.getData();
      }, time * 1000);
    },
    returnStatus (statusValue) {
      return systemConfig.returnStatus(statusValue);
    },
    spliceStr (str) {
      return systemConfig.spliceStr(str, 6);
    },
    timeFilter (row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    getStatus (urlStr) {
      var urlStrArr = urlStr.split("/");
      return urlStrArr[urlStrArr.length - 1];
    },
    // 条件查询事件
    search () {

      if (
        this.maxDrawingAmount < this.minDrawingAmount ||
        (!this.minDrawingAmount && this.maxDrawingAmount)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("提款金额最大值必须大于提款金额最小值"),
        });
        return;
      }
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("申请起始时间不能大于结束时间"),
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
      this.updateLockStatus();
      this.getData();
      /* this.getTodayWithdraw() */
    },
    async updateLockStatus () {
      await this.$axios.get(systemConfig.urls.updateAllLockStatus);
    },
    // 查询条件重置事件
    reset () {
      this.accountName = "";
      this.topAgyAccountValue = [];
      this.agyAccountValue = [];
      this.agyAccountOptions = this.trueAgyAccountOptions;
      this.getheringName = "";
      this.auditer = "";
      this.startTime = systemConfig.getCurrentWeek()[0] + " 00:00:00";
      this.endTime = systemConfig.getCurrentWeek()[1] + " 23:59:59";
      this.defaulttypep = "";
      this.$refs.searchTime0.defaultType = "";
      this.startPassTime = "";
      this.endPassTime = "";
      this.statusValue = [];
      this.groupValue = [];
      this.withdrawSourceList = [];
      this.lockStatus = this.methodType = this.curOrderId = "";
      this.isExempt = "";
      this.minDrawingAmount = "";
      this.maxDrawingAmount = "";
      this.auditUser = "";
      this.searchClass = "searchNew";
      this.extendTitle = this.$t("更多");
      this.orderNo = "";
    },
    // 更多查询toggle
    more () {
      if (this.searchClass == "searchNewTwo") {
        this.searchClass = "searchNew";
        this.extendTitle = this.$t("更多");
        this.showExtend = false;
      } else {
        this.searchClass = "searchNewTwo";
        this.extendTitle = this.$t("收起");
        this.showExtend = true;
      }
    },
    handleSizeChange (val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.getData();
    },
    handleCurrentChange (val) {
      this.listReq.pageNo = val;
      this.getData();
    },
    statusSelectChange (val) {
      this.statusValue = val;
    },
    jugeShowDetail (rowData) {
      if ([0, 1].includes(rowData.status)) {
        // 审核完成的，不需要解锁
        this.showDetail(rowData);
        return;
      }
      if (rowData.status === 2) {
        this.inMailType = rowData.inMailType;
      }
      // this.checkLockStatus(rowData);
      this.showDetail(rowData);
    },
    openLoading () {
      this.$store.state.fullscreenLoading = true;
    },
    closeLoading () {
      this.$store.state.fullscreenLoading = false;
    },
    checkLockStatus (rowData) {
      const params = { id: rowData.id };
      this.curOrderId = rowData.id;
      this.openLoading();
      this.$axios
        .get(systemConfig.urls.lockStatus, { params })
        .then((res) => {
          const { isCurrentUserLock, lockOperator, id } = res.data.msg;
          if (!isCurrentUserLock) {
            this.lock(rowData, { id, lockStatus: 1 });
          }
          if (isCurrentUserLock === 1) {
            this.showDetail(rowData);
          }
          if (isCurrentUserLock === 2) {
            this.$message.warning(this.$t("当前订单已被") + lockOperator + this.$t("锁定"));
          }
        })
        .catch((err) => {
          this.closeLoading();
        });
    },
    async lock (rowData, params) {
      await this.$axios.post(systemConfig.urls.lock, params).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('锁定成功!')
        });
        this.search();
        // this.showDetail(rowData);
      });
    },
    unLock () {
      const params = {
        id: this.curOrderId,
        lockStatus: 0,
      };
      // this.openLoading();
      this.$axios.post(systemConfig.urls.unLock, params).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('解锁成功!')
        });
        this.search();
      });
    },
    // 通过订单查询 订单详情
    showDetail (rowData) {
      this.rowData = rowData;
      this.rowData0 = Object.assign({}, rowData);
      if (
        this.rowData.status === 2 &&
        new Date().getTime() - new Date(this.rowData.createTime).getTime() <
        60000
      ) {
        this.trueStatus = 0;
      }
      let url = "/" + rowData.id;
      this.$store.state.fullscreenLoading = true;
      this.$axios.get(systemConfig.urls.getBankDataById + url).then((resp) => {
        this.detailShow = true;
        this.copied1 = false;
        this.copied2 = false;
        this.copied3 = false;
        this.copied4 = false;
        this.bankData = resp.data.accWithdraw;
        this.memo = this.rowData.memo;
        // if (rowData.status === 2) {
        //   this.auditTitle = '客服审核'
        // } else if (rowData.status === 3) {
        //   this.auditTitle = '财务审核'
        // } else {
        //   this.auditTitle = '审核详情'
        // }
        if (this.bankData.mbrBankcard) {
          this.findAgentByloginName(rowData.loginName).then(
            (agentBreadcrumb) => {
              if (
                agentBreadcrumb.status === 2 &&
                new Date().getTime() -
                new Date(agentBreadcrumb.createTime).getTime() <
                60000
              ) {
                this.trueStatus = 0;
              }
              this.$set(this.rowData, "agentBreadcrumb", agentBreadcrumb);
            }
          );
        }
      });
    },
    getTitle (status) {
      switch (status) {
        case 2: {
          return {
            title: this.$t("常规初审"),
            checkResult: this.$t("初审结果"),
          };
          break;
        }
        case 3: {
          return {
            title: this.$t("财务审核"),
            checkResult: this.$t("复审结果"),
          };
          break;
        }
        case 6: {
          return {
            title: this.$t("待定订单初审"),
            checkResult: this.$t("审核结果"),
          };
          break;
        }
        case 8: {
          return {
            title: this.$t("出款待定订单初审"),
            checkResult: this.$t("审核结果"),
          };
          break;
        }
        default: {
          return {
            title: this.$t("审核详情"),
            checkResult: this.$t("审核结果"),
          };
        }
      }
    },
    closeDetail () {
      // detailShow为false关闭时，会自动再次出发弹窗关闭时间
      // if (!this.detailShow) {
      //   // 审核完成的不存在解锁，也不需要开锁
      //   if ([2, 3].includes(this.rowData.status)) this.unLock();
      //   return
      // }
      this.detailShow = false;
      this.trueStatus = 1;
      this.depositAmount = this.auditAmount = null;
    },
    // 修改某条数据的状态 trueStatus走不同的接口
    changeStatus (status, trueStatus, id, isChangeFail = false) {
      if(!this.rowData.lockStatus){
        this.$message.warning(this.$t('订单未锁定，无法进行操作!'))
        return false
      }
      if(this.rowData.lockOperator!==this.$store.state.user.username){
        this.$message.warning(this.$t('订单并非你锁定，请先锁定订单再操作!'))
        return false
      }
      // 安全密码弹窗
      if ([1, 8].includes(trueStatus) && !this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.changeStatus);
        this.$set(this.tmpValue4SafeCheck, "args", [
          status,
          trueStatus,
          id,
          isChangeFail,
        ]);
        return;
      }
      let params = {}, url = ""
      this.isMemberUpdateStatusBool = false
      if (trueStatus === 8) {
        params = {
          id,
          status: 8,
          memo: this.memo,
        }
        url = systemConfig.urls.updateAccStatusPaymentPend
      } else {
        if (isChangeFail) {
          return this.handleChangeFail();
        }
        let isRefuse = trueStatus === 0;
        if (status === 3) {
          url = isRefuse
            ? systemConfig.urls.memberUpdateFinialStatusRefuse
            : systemConfig.urls.memberUpdateFinialStatus;
        } else if (status === 6 || status === 8) {
          url = isRefuse
            ? systemConfig.urls.updateAccStatusPendRefuse
            : systemConfig.urls.updateAccStatusPendPass;
        } else {
          url = isRefuse
            ? systemConfig.urls.memberUpdateStatusRefuse
            : systemConfig.urls.memberUpdateStatus;
          if (!isRefuse) {
            this.isMemberUpdateStatusBool = true
          }
        }
        // 通过都传1  其余传0
        if (trueStatus === 0) {
          // trueStatus = 0
          const bool = this.compareData(this.depositAmount, this.auditAmount);
          if (!bool) {
            this.$message.warning(
              this.$t("添加稽核的本金和流水需要同时填写或者同时不填写")
            );
            return;
          }
        } else if (trueStatus === 6) {
          url = systemConfig.urls.updateAccStatusPend;
        } else {
          trueStatus = 1;
        }
        if (this.rowData.isExempt && status === 3) {
        }
        const obj = {
          status: trueStatus,
          id: id,
          memo: this.memo,
          memoWithdraw: this.rowData.memoWithdraw,
        };
        params = trueStatus
          ? obj
          : {
            ...obj,
            depositAmount: this.depositAmount,
            auditAmount: this.auditAmount,
          };
        if (status === 2 && trueStatus === 0) {
          // 风控初审聚聚出款-给会员发送不同站内信泪别
          params = {
            ...params,
            inMailType: this.inMailType,
          };
        }
      }
      this.$store.state.fullscreenLoading = true;
      console.log('url', url, 'params', params)
      debugger
      this.$axios
        .post(url, params, {
          headers: { securepwd: this.safePassword || null },
        })
        .then((resp) => {
          const msg = resp.data.msg
          if (this.isMemberUpdateStatusBool && msg) {
            this.$message({
              type: "error",
              message: msg
            });
          } else {
            this.$message({
              type: "success",
              message: this.$t("状态修改成功"),
            });
          }
          bus.$emit("updateCount", true);
          this.closeDetail();
          /* this.getTodayWithdraw() */
          this.getData();
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
    },
    // 修改某条数据的备注
    changeMemo (id, flag) {
      if (!this.memo) {
        this.$message({
          type: "warning",
          message: this.$t("备注不能为空"),
        });
        return;
      }
      this.closeDetail();
      this.$axios
        .post(systemConfig.urls.memberUpdateMemo, { memo: this.memo, id: id })
        .then(() => {
          if (!flag) {
            this.$message({
              type: "success",
              message: this.$t("备注修改成功"),
            });
          }
          this.getData();
          this.memo = "";
        });
    },
    filterTag (value, row) {
      return row.status === value;
    },
    indexMethod (index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    // 获取会员options
    getMemberOptions () {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.groupOptions = resp.data.page;
      });
    },
    checkAllOrder (accountName) {
      this.accountName = accountName;
      this.detailShow = false;
      this.manulWithdrawVisible = false;
      this.connected = false;
      this.getData();
    },
    // 获取表格数据  + '&createTimeFrom=' + this.startTime + '&createTimeTo=' + this.endTime
    getData () {
      this.getCurrentRecodeTime()
      this.$store.state.searchLoading = true;
      if (this.$router.history.current.query.status && this.isym) {
        // this.statusSelectChange(parseInt(this.$router.history.current.query.status))
        this.isym = false;
      }
      let url =
        "?pageSize=" +
        this.listReq.pageSize +
        "&pageNo=" +
        this.listReq.pageNo +
        "&withdrawSourceList=" +
        this.withdrawSourceList +
        "&groupIds=" +
        this.groupValue +
        "&loginName=" +
        this.accountName +
        "&topAgyAccounts=" +
        this.topAgyAccountValue +
        "&agyAccountIds=" +
        this.agyAccountValue +
        "&statuss=" +
        this.statusValue +
        "&auditUser=" +
        this.auditer +
        "&realName=" +
        this.getheringName +
        "&orderNo=" +
        this.orderNo +
        "&lockStatus=" +
        this.lockStatus +
        "&methodType=" +
        this.methodType +
        "&isExempt=" +
        this.isExempt +
        "&minDrawingAmount=" +
        this.minDrawingAmount +
        "&maxDrawingAmount=" +
        this.maxDrawingAmount;

      if (this.startTime && this.timeType === "md") {
        url +=
          "&createTimeFrom=" +
          systemConfig.transferTimeByType(this.startTime, "mdToBj");
      } else {
        url += "&createTimeFrom=" + this.startTime;
      }
      if (this.startPassTime && this.timeType === "md") {
        url +=
          "&startPassTime=" +
          systemConfig.transferTimeByType(this.startPassTime, "mdToBj");
      } else {
        url += "&startPassTime=" + this.startPassTime;
      }
      if (this.endTime && this.timeType === "md") {
        url +=
          "&createTimeTo=" +
          systemConfig.transferTimeByType(this.endTime, "mdToBj");
      } else {
        url += "&createTimeTo=" + this.endTime;
      }
      if (this.endPassTime && this.timeType === "md") {
        url +=
          "&endPassTime=" +
          systemConfig.transferTimeByType(this.endPassTime, "mdToBj");
      } else {
        url += "&endPassTime=" + this.endPassTime;
      }
      if (!!this.methodType) {
        url += "&currencyProtocol=" + this.currencyProtocol;
      }
      this.tempUrl = url;
      this.$axios
        .get(systemConfig.urls.fundWithdrawAccList + url)
        .then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          let data = resp.data.page.list;
          this.cuiTime = resp.data.time;
          data.map(v => {
            v.orderNoText = v.orderPrefix + v.orderNo;
          });
          this.tableData = data;
          this.total = resp.data.page.totalCount;
          if (this.statusValue) {
            this.filterArr = systemConfig.getStatusArr(this.statusValue);
          }
          
        });
      this.$axios
        .get(systemConfig.urls.getAccSumDrawingAmount + url)
        .then((res) => {
          this.staticData = res.data.page;
          this.closeLoading();
        });
    },
    setThounds(val) {
      const num = val ? val : 0
      return num.toLocaleString()
    },
    statusTextFilter (status) {
      return {
        0: this.$t('拒绝'),
        1: this.$t('通过'),
        2: this.$t('初审'),
        3: this.$t('复审'),
        6: this.$t('初审待定'),
        7: this.$t('失败'),
        8: this.$t('会员出款待定'),
        9: this.$t('会员取消'),
      }[status]
    },
    typeTextFilter (type) {
      switch (type) {
        case 0:
          return this.$t("手动出款");
        case 1:
          return this.$t("自动出款");
        case 3:
          return this.$t("处理中");
      }
    },
    // 获取总代 次代数据
    getChildAgent () {
      this.$axios
        .get(systemConfig.urls.getAllChildAgentIncludeDisable)
        .then((resp) => {
          this.agyAccountOptions = resp.data.accounts;
          this.trueAgyAccountOptions = resp.data.accounts;
        });
    },
    getAgyAccount (id) {
      if (id.length > 0) {
        this.agyAccountValue = [];
        this.agyAccountOptions = [];
        const reqList = [];
        for (let i = 0; i < id.length; i++) {
          reqList.push(
            this.$axios.get(
              systemConfig.urls.getAgyAccountIncludeDisable +
              "?parentId=" +
              id[i]
            )
          );
        }
        Promise.all(reqList).then((res) => {
          let arr = [];
          for (let i of res) {
            arr = arr.concat(i.data.accounts);
          }
          this.agyAccountOptions = arr;
        });
      } else {
        this.agyAccountOptions = this.trueAgyAccountOptions;
        this.$axios
          .get(systemConfig.urls.getAgyAccountIncludeDisable + "?parentId=")
          .then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts;
          });
      }
    },
    // 获取今日存款
    getTodayWithdraw () {
      this.$axios
        .get(systemConfig.urls.getFundDepositSumWithdrawAmount + "?make=1")
        .then((resp) => {
          this.allTodayWithdraw = systemConfig.toThousands(resp.data.sum);
        });
    },
    castData (row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      var te = systemConfig.getDateDiff(date, "minute", this.timeType);
      if (te > 59) {
        te = systemConfig.getDateDiff(date, "hour", this.timeType);
        if (te > 23) {
          te = parseInt(te / 23);
          return te + this.$t("天前");
        }
        return te + this.$t("小时前");
      }
      return te + this.$t("分钟前");
    },
    handleExport () {
      // if (this.total > 10000) {
      //   this.$message.error('导出一次性不能超过一万条')
      //   return
      // }
      this.isNowDowning = false;
      this.deposit = {
        marginRight: "95px",
      };
      this.$axios
        .get(systemConfig.urls.exportWithdrowExcel + this.tempUrl)
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isNowDowning = true;
          } else {
            this.checkExportFile();
          }
        });
    },
    checkExportFile () {
      // 查看导出文件是否可下载
      this.$axios.get(systemConfig.urls.checkWithdrowIsDown).then((res) => {
        let obj = res.data.data || {};
        let fileName = obj.fileName,
          downloadFileName = obj.downloadFileName;
        if (fileName) {
          const { baseURL } = res.config;
          // 下载文件
          let SToken = localStorage.getItem("SToken");
          window.open(
            baseURL +
            `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
          );
          this.isNowDowning = true;
          this.deposit = {
            marginRight: "75px"
          };
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },
    inputUp (data) {
      // 只输入两位小数的数字
      this[data] = this[data].replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      this[data] = this[data].replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this[data] = this[data]
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this[data] = this[data].replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (this[data].indexOf(".") < 0 && this[data] != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        this[data] = parseFloat(this[data]);
      }
    },
    compareData (a, b) {
      const bool1 = !!a && !!b;
      const bool2 = !a && !b;
      const bool3 =
        bool2 &&
        ((this.isZero(a) && this.isZero(b)) ||
          (this.isNotZero(a) && this.isNotZero(b)));
      const bool4 = (!!a && this.isZero(b)) || (!!b && this.isZero(a));
      return bool1 || bool3 || bool4;
    },
    isZero (val) {
      return val === 0;
    },
    isNotZero (val) {
      return val !== 0;
    },
    mclock (rowData) {
      //此时表格里面的锁定状态已经被用户改变了
      if (rowData.lockStatus === 1) {
        //锁定
        const params = { id: rowData.id };
        this.curOrderId = rowData.id;
        // this.openLoading();
        this.$axios
          .get(systemConfig.urls.lockStatus, { params })
          .then((res) => {
            const { isCurrentUserLock, lockOperator, id } = res.data.msg;
            if (!isCurrentUserLock) {
              this.lock(rowData, { id, lockStatus: 1 });
            }
            if (isCurrentUserLock === 1) {
              // this.showDetail(rowData);
              this.lock(rowData, { id, lockStatus: 1 });
            }
            if (isCurrentUserLock === 2) {
              // this.$message.warning("当前订单已被" + lockOperator + "锁定");
              this.lock(rowData, { id, lockStatus: 1 });
            }
          })
          .catch((err) => {
            // this.closeLoading();
          });
      } else {
        //解锁
        const params = { id: rowData.id };
        this.curOrderId = rowData.id;
        // this.openLoading();
        this.$axios
          .get(systemConfig.urls.lockStatus, { params })
          .then((res) => {
            const { isCurrentUserLock, lockOperator, id } = res.data.msg;
            if (!isCurrentUserLock) {
              // this.lock(rowData, { id, lockStatus: 1 });
              this.unLock();
            }
            if (isCurrentUserLock === 1) {
              // this.showDetail(rowData);
              this.unLock();
            }
            if (isCurrentUserLock === 2) {
              // this.$message.warning("当前订单已被" + lockOperator + "锁定");
              this.$confirm(lockOperator + this.$t("正在进行审核操作，是否强制更换锁定人？"), this.$t('提示'), {
                confirmButtonText: this.$t('确认'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.lock(rowData, { id, lockStatus: 1 });
              }).catch(() => {
                rowData.lockStatus=1
                this.$message({
                  type: 'info',
                  message: this.$t('操作已取消')
                })
              });
            }
          }).catch((err) => {
            // this.closeLoading();
          });
      }
    },
    manulWithdraw () {
      this.manulWithdrawVisible = true;
    },
    closeManul () {
      this.$refs.manulForm.clearValidate();
      this.$refs.manulForm.resetFields();
      this.manulForm = {};
      this.manulWithdrawVisible = false;
      this.connected = false;
    },
    connect () {
      this.$refs.manulForm.validate((valid) => {
        if (valid) {
          let relatedOrderno = this.manulForm.relatedOrderno;
          let url = "/" + relatedOrderno.toString();
          this.$axios
            .get(systemConfig.urls.artificialAccInfo + url)
            .then((resp) => {
              const { accWithdraw } = resp.data;
              this.connected = true;
              this.copied1 = false;
              this.copied2 = false;
              this.copied3 = false;
              this.copied4 = false;
              this.manulForm = Object.assign(accWithdraw, {
                relatedOrderno: relatedOrderno,
              });
              this.memo = this.manulForm.memo;
              this.bankData = accWithdraw;
              if (this.manulForm.mbrBankcard) {
                this.findAgentByloginName(this.manulForm.loginName).then(
                  (agentBreadcrumb) => {
                    this.$set(
                      this.manulForm,
                      "agentBreadcrumb",
                      agentBreadcrumb
                    );
                  }
                );
              }
            });
        }
      })
    },
    addManul(){
      this.$refs.manulForm.validate((valid)=>{
        if(valid){
          const { relatedOrderno } = this.manulForm
          const { actualArrival } = this.bankData
          this.$axios.post(systemConfig.urls.artificialWithdrawal,{relatedOrderno, actualArrival}).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('添加人工提款订单成功！'))
              this.getData()
            }else{
              this.$message.error(this.$t('添加人工提款订单失败！'))
            }
          }).finally(()=>{
            this.closeManul()
          })
        }
      })
    },
    goDetail(row){
      this.$router.push({path: '/main/memberManage/memberDetail',query:{id:row.accountId,loginName:row.loginName,agyAccount:row.agyAccount,from:'memberwithdraw'}})
    },
    alertSet(){
      this.$axios.GET(systemConfig.urls.queryCuiDanSet).then(res=>{
        if(res.res.code===0){
          this.cuiTime = res.res.time
          this.$prompt(this.$t('催单时间'), this.$t('催单设置'), {
            cancelButtonText: this.$t('取消'),
            confirmButtonText: this.$t('保存'),
            inputType: 'number',
            inputValue: this.cuiTime,
            inputPattern: /^[1-9]\d*$/,
            inputValidator: (value)=>{
              if(!value){
                return this.$t('催单时间不能为空')
              }
            },
            inputErrorMessage: this.$t('只能输入大于0的整数'),
            customClass: 'cuiPop'
          }).then(({ value }) => {
            this.$axios.POST(systemConfig.urls.setCuiDanSet,{cuiDan:Number(value)}).then(res=>{
              if(res.res.code===0){
                this.$message.success(this.$t('设置催单时间成功！'))
              }
            })
          })
            .finally(() => {
              this.closeManul();
            });
        }
      }).catch(()=>{
        this.$message.error(this.$t('获取催单时间失败'))
      })
    },
    goDetail (row) {
      this.$router.push({
        path: "/main/memberManage/memberDetail",
        query: {
          id: row.accountId,
          loginName: row.loginName,
          agyAccount: row.agyAccount,
          from: "memberwithdraw",
        },
      });
    },
    conbain (t1, t2 = this.cuiTime) {
      let str = "";
      str = moment(new Date(t1).getTime() + t2 * 60 * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return str;
    },
    resendAccOrder(rowData, status) {
      // const obj =  params ;
      const { id, memoWithdraw } = rowData
      const params = {
          status,
          id,
          memo: this.memo,
          memoWithdraw,
        };
      this.$axios
        .post(systemConfig.urls.resendAccOrder, params)
        .then(res => {
          console.log("🚀 ~ file: MemberWithdraw.vue:2379 ~ resendAccOrder ~ res:", res)
          this.bankData = accWithdraw.id;
        });
    }
  },
  /*组件销毁的时候清除定时器*/
  destroyed: function () {
    clearInterval(this.timeOut);
  },
};
</script>

<style scoped lang="scss">
.exportList {
  height: 28px;
  line-height: 15px;
  margin-top: 1px;
}
.export-div .statistic {
  line-height: 40px;
}
.add-check {
  span {
    margin-right: 10px;
  }
  /deep/ .el-input {
    width: 20%;
    margin-right: 10px;
  }
}
.mr0 {
  margin-right: 0 !important;
}
.toggle_to_new_page {
  cursor: pointer;
  color: #409eff;
}
.floatbtn {
  position: absolute;
  right: 353px;
  top: 12px;
  height: 28px;
  line-height: 15px;
}
.floatbtn2 {
  right: 520px;
}
.red {
  color: red;
}
.gray {
  color: #999;
}
.blue {
  color: #409eff;
}
.btn {
  .moneyDescription {
    color: red;
    margin-left: -127px;
    padding: 14px;
    text-align: left;
    position: relative;
    left: 46px;
  }
  .el-form-item__content {
    margin-left: 81px !important;
  }
}
.noborder .el-form-item__content {
  border: 0;
}
.noborder .el-input__inner {
  width: 400px;
}
.cuiPop .el-message-box__content {
  display: flex;
  align-items: center;
}
.cuiPop .el-message-box__container {
  margin-right: 15px;
}
.cuiPop .el-message-box__title {
  text-align: center;
  font-size: 14px !important;
  font-weight: 600;
}
.cuiPop .el-message-box__content::after {
  display: inline-flex;
  content: '分钟';
}
.noAcc {
  right: 331px !important;
}


/deep/ .el-dialog__body form {
  width: 85%;
  // margin: 0 auto;
  padding: 0;
}
</style>
