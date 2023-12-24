<!-- 代理管理 - 代理报表 -综合报表-->
<template>
  <div class="game-data-sheet">
    <!--查询条件-->
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('时间') }}</label>
          </div>
          <StartAndEndTimeSelector :left="40" type="date" ref="searchTime" :selections="timeSelections" :startTime.sync="startTime" :endTime.sync="endTime" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <input class="normalipt" type="text" v-model="agyAccount" v-trim @keyup.enter="search()" :label="$t('请输入')"/>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('部门') }}</label>
          <el-select v-model="departmentid" :label="$t('请选择')" clearable>
            <el-option v-for="item in departmentidOpt" :key="item.id" :label="item.departmentName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理等级') }}</label>
          <el-select v-model="agentLevel" :label="$t('请选择')" clearable>
            <el-option v-for="item in levelList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="div-search-btn" style="top: 50%;transform: translateY(-50%)">
        <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div v-loading='loading' style="min-height:570px;">
      <div v-if="staticalAnalysisShow" class="staticAnalysis">
        <div class="goback" @click.stop="nowBack">{{ $t('返回') }}</div>
        <div class="eachOne" v-for="(item,index) in statisticalData" :key="index">
          <p class="up">
            <span class="l"><i :class="['icon',item.icon]"></i><i>{{item.name}}</i></span>
            <span class="r">{{ $t('合计') }}：{{item.depositAmountSum}}{{ currencyText() }}</span>
          </p>
          <ul>
            <li v-for="(inItem,inIndex) in item.list" :key="inIndex">
              <p>{{inItem.payname}}</p>
              <p class="p2">{{inItem.depositAmountTotal}}{{ currencyText() }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="JSON.stringify(tableData)=='{}'" style="line-height:50px;text-align:center;color:#909399;">
        {{ $t('您尚未选择查询条件') }}
      </div>
      <div v-else-if="!staticalAnalysisShow" class="totalMessageLeft">
        <!--总展示-->
        <div v-show="pageFlag==='mainPage'" class="totalShow">
          <div class="statistics">
            <div class="statistics-cell">
              <span class="iconfont icon-yinli"></span>
              <span class="money" :class="[allTotal.totalProfit > 0 ? 'green': (allTotal.totalProfit < 0 ? 'red' : '')]">{{toThousands(allTotal.totalProfit)}}</span>
              <h3>{{ $t('净盈利') }}<el-tooltip class="item" effect="dark" :content="$t('公司净盈利=-总盈亏-总红利-资金调整-总任务返利-平台费-服务费。首页净盈利数据未扣除代理平台/服务费')" placement="bottom">
                  <span class="iconfont icon-wenhao"></span>
                </el-tooltip>
              </h3>
            </div>
            <div class="statistics-cell" style="cursor:pointer;">
              <span class="iconfont icon-5"></span>
              <span class="money" :class="[allTotal.totalNewMbrs > 0 ? 'green': (allTotal.totalNewMbrs < 0 ? 'red' : '')]">{{allTotal.totalNewMbrs || 0}}</span>
              <h3>{{ $t('新增会员') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-5"></span>
              <span class="money" :class="[allTotal.totalDepositBalanceNum > 0 ? 'green': (allTotal.totalDepositBalanceNum < 0 ? 'red' : '')]">{{allTotal.totalDepositBalanceNum || 0}}</span>
              <h3>{{ $t('存款人数') }}</h3>
            </div>
            <!-- <div class="statistics-cell" @click="toMemberWithdraw" style="cursor:pointer;"> -->
            <div class="statistics-cell">
              <span class="iconfont icon-wallet"></span>
              <span class="money" :class="[allTotal.totalDrawAmountNum > 0 ? 'green': (allTotal.totalDrawAmountNum < 0 ? 'red' : '')]">{{allTotal.totalDrawAmountNum || 0}}</span>
              <h3>{{ $t('提款人数') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.totalBonusAmountNum > 0 ? 'green': (allTotal.totalBonusAmountNum < 0 ? 'red' : '')]">{{allTotal.totalBonusAmountNum || 0}}</span>
              <h3>{{ $t('优惠人数') }}</h3>
            </div>
          </div>
          <div class="statistics">
            <div class="statistics-cell">
              <span class="iconfont icon-yinli"></span>
              <span class="money" :class="[allTotal.totalActiveMbrs > 0 ? 'green': (allTotal.totalActiveMbrs < 0 ? 'red' : '')]">{{allTotal.totalActiveMbrs || 0}}</span>
              <h3>{{ $t('活跃人数') }}</h3>
            </div>
            <div class="statistics-cell" style="cursor:pointer;">
              <span class="iconfont icon-5"></span>
              <span class="money" :class="[allTotal.totalNewDeposits > 0 ? 'green': (allTotal.totalNewDeposits < 0 ? 'red' : '')]">{{allTotal.totalNewDeposits || 0}}</span>
              <h3>{{ $t('首存人数') }}</h3>
            </div>
            <div class="statistics-cell" style="cursor:pointer;">
              <span class="iconfont icon-5"></span>
              <span class="money" :class="[allTotal.totalNewDeposits > 0 ? 'green': (allTotal.totalNewDeposits < 0 ? 'red' : '')]">{{toThousands(allTotal.totalNewDepositAmount) || 0}}</span>
              <h3>{{ $t('首存金额') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-5"></span>
              <span class="money" :class="[allTotal.totalDepositBalance > 0 ? 'green': (allTotal.totalDepositBalance < 0 ? 'red' : '')]">{{toThousands(allTotal.totalDepositBalance)}}</span>
              <h3>{{ $t('存款金额') }}</h3>
            </div>
            <!-- <div class="statistics-cell" @click="toMemberWithdraw" style="cursor:pointer;"> -->
            <div class="statistics-cell">
              <span class="iconfont icon-wallet"></span>
              <span class="money" :class="[allTotal.totalDrawAmount > 0 ? 'green': (allTotal.totalDrawAmount < 0 ? 'red' : '')]">{{toThousands(allTotal.totalDrawAmount)}}</span>
              <h3>{{ $t('提款金额') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.totalBonusAmount > 0 ? 'green': (allTotal.totalBonusAmount < 0 ? 'red' : '')]">{{toThousands(allTotal.totalBonusAmount)}}</span>
              <h3>{{ $t('所有优惠') }}</h3>
            </div>
          </div>
          <div class="statistics" style="width:78%;">
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.betCount > 0 ? 'green': (allTotal.betCount < 0 ? 'red' : '')]">{{allTotal.betCount}}</span>
              <h3>{{ $t('总注单数量') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.calculateProfit > 0 ? 'green': (allTotal.calculateProfit < 0 ? 'red' : '')]">{{toThousands(allTotal.calculateProfit)}}</span>
              <h3>{{ $t('资金调整') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.serviceCost > 0 ? 'green': (allTotal.serviceCost < 0 ? 'red' : '')]">{{toThousands(allTotal.serviceCost)}}</span>
              <h3>{{ $t('服务费') }}</h3>
            </div>
            <div class="statistics-cell">
              <span class="iconfont icon-hongli"></span>
              <span class="money" :class="[allTotal.cost > 0 ? 'green': (allTotal.cost < 0 ? 'red' : '')]">{{toThousands(allTotal.cost)}}</span>
              <h3>{{ $t('平台费') }}</h3>
            </div>
          </div>
        </div>
      </div>
      <!--导出按钮  其他一些展示内容-->
      <div :class="[this.pageFlag === 'mainPage' ? 'totalMessageright' : 'gobackButon', 'totalMessageGoback']" v-show="haveTableDataBool">
        <Snapshots v-model="snapshots" displayKey="displayName" @change="handleSnapshotsChange" class="bread" />
        <div style="float: right">
          <el-button v-show="permissions.agentExport&&pageFlag!=='memberPage' && pageFlag!=='memberDetailPage' && pageFlag!=='mainPage' && pageFlag!=='agyDetailPage'&& pageFlag!=='merchantsPage'" class="iconfont icon-export el-button-export export" @click="handleAgentExport" :loading="isExportingAgent">{{isExportingAgent ? $t('导出中') : $t('代理线导出')}}
          </el-button>
          <el-button v-show="permissions.save&& pageFlag!=='memberPage' && pageFlag!=='memberDetailPage'" class="iconfont icon-export el-button-export export" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导出当前表单')}}
          </el-button>
          <el-button v-show="permissions.save&& pageFlag==='mainPage'" class="iconfont icon-export el-button-export export mart15" @click="handleExportDate" :loading="isExportingDate">{{isExportingDate ? $t('导出中') : $t('日期渠道表单')}}
          </el-button>
          <el-button v-show="pageFlag==='timePage'" class="iconfont icon-back back" @click="closeBtn">
            {{ $t('返回') }}
          </el-button>
        </div>
      </div>
      <!-- 首页 -->
      <div class="search-form" v-show="pageFlag==='mainPage'">
        <el-table :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'mainPage')">
          <el-table-column :label="$t('日期')" align="center" sortable='custom' prop="createTime">
            <template slot-scope="scope">
              <el-button @click="showTimePage(scope.row.createTime)" type="text" size="small">{{filterTime(scope.row.createTime)}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewMbrs" :label="$t('新增会员')" sortable='totalNewMbrs'>
          </el-table-column>
          <el-table-column align='center' prop="totalDepositBalanceNum" :label="$t('存款人数')" sortable='totalNewDeposits'>
          </el-table-column>
          <el-table-column align='right' prop="totalDepositBalance" :label="$t('存款金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewDeposits" :label="$t('首存人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalNewDepositAmount" :label="$t('首存金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalDrawAmountNum" :label="$t('提款人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalDrawAmount" :label="$t('提款金额')">
          </el-table-column>
          <el-table-column align='right' prop="totalProfit" :label="$t('净盈利')">
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column align='center' prop="totalActiveMbrs" :label="$t('活跃人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalTaskBonusAmount" :label="$t('总任务返利')" sortable='custom'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmount" :label="$t('总优惠')" sortable='custom'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBetMbrs" :label="$t('投注人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalValidBets" :label="$t('有效投注金额')">
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column align='right' prop="totalPayout" :label="$t('总盈亏')">
          </el-table-column>
          <!-- <el-table-column align='right' prop="serviceCost" label="总服务费">
          </el-table-column>
          <el-table-column align='right' prop="cost" label="总平台费">
          </el-table-column> -->
        </el-table>
      </div>
      <!-- 股东 -->
      <div class="search-form" v-show="pageFlag==='timePage'">
        <el-table :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'timePage')">
          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount=== $t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount}}</span>
              <el-button v-else @click="handleTopAgentClick(scope.row)" type="text" size="small">
                {{scope.row.agyAccount}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewMbrs" :label="$t('新增会员')" sortable='totalNewMbrs'>
          </el-table-column>
          <el-table-column align='center' prop="totalDepositBalanceNum" :label="$t('存款人数')" sortable='totalNewDeposits'>
          </el-table-column>
          <el-table-column align='right' prop="totalActualarrival" :label="$t('存款金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewDeposits" :label="$t('首存人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalNewDepositAmount" :label="$t('首存金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalDrawAmountNum" :label="$t('提款人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalDrawAmount" :label="$t('提款金额')">
          </el-table-column>
          <el-table-column align='right' prop="totalProfit" :label="$t('净盈利')">
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column align='center' prop="totalActiveMbrs" :label="$t('活跃人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBetMbrs" :label="$t('投注人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmount" :label="$t('所有优惠')" sortable='custom'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalValidBets" :label="$t('有效投注金额')">
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column align='right' prop="totalPayout" :label="$t('总盈亏')">
          </el-table-column>
          <!-- <el-table-column align='right' prop="serviceCost" label="总服务费">
          </el-table-column>
          <el-table-column align='right' prop="cost" label="总平台费">
          </el-table-column> -->
          <el-table-column align='center' prop="totalSubAgentNum" :label="$t('下级代理')">
          </el-table-column>
          <el-table-column align='center' prop="totalSubMbrNum" :label="$t('下级会员')">
          </el-table-column>
          <el-table-column align='center' prop="ctRatio" :label="$t('存提比例')"></el-table-column>
          <el-table-column align='center' prop="lsRatio" :label="$t('流水比例')"></el-table-column>
          <el-table-column align='center' prop="syRatio" :label="$t('输赢比例')"></el-table-column>
          <el-table-column align='center' prop="yhRatio" :label="$t('优惠比例')"></el-table-column>
          <el-table-column align='center' prop="ctDiffer" :label="$t('存提差')"></el-table-column>
        </el-table>
      </div>
      <!-- 部门 -->
      <div class="search-form" v-show="pageFlag==='agyDetailPage'">
        <el-table :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'agyDetailPage')">
          <el-table-column :label="$t('部门（类别）')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.cateGory===$t('小计') || scope.row.cateGory===$t('总计')">{{scope.row.cateGory}}</span>
              <el-button v-else @click="handleAgyDetailClick(scope.row)" type="text" size="small">
                {{scope.row.cateGory || $t('其他')}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column prop="totalNewMbrs" :label="$t('新增会员')" sortable='totalNewMbrs' align='center'>
          </el-table-column>
          <el-table-column prop="totalDepositBalanceNum" :label="$t('存款人数')" sortable='totalNewDeposits' align='center'>
          </el-table-column>
          <el-table-column prop="totalDepositBalance" :label="$t('存款金额')" align='right'>
          </el-table-column>
          <el-table-column prop="totalNewDeposits" :label="$t('首存人数')" align='center'>
          </el-table-column>
          <el-table-column prop="totalDrawAmountNum" :label="$t('提款人数')" align='center'>
          </el-table-column>
          <el-table-column prop="totalDrawAmount" :label="$t('提款金额')" align='right'>
          </el-table-column>
          <el-table-column prop="totalProfit" :label="$t('净盈利')" align='center'>
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column prop="totalActiveMbrs" :label="$t('活跃人数')" align='center'>
          </el-table-column>
          <el-table-column prop="totalBetMbrs" :label="$t('投注人数')" align='center'>
          </el-table-column>
          <el-table-column prop="totalBonusAmount" :label="$t('所有优惠')" align='center'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
          </el-table-column>
          <el-table-column prop="totalValidBets" :label="$t('有效投注金额')" align='right'>
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column prop="totalPayout" :label="$t('总盈亏')" align='right'>
          </el-table-column>
          <!-- <el-table-column align='right' prop="serviceCost" label="总服务费">
          </el-table-column>
          <el-table-column align='right' prop="cost" label="总平台费">
          </el-table-column> -->
          <el-table-column prop="totalSubAgentNum" :label="$t('下级代理')" align='center'>
          </el-table-column>
          <el-table-column prop="totalSubMbrNum" :label="$t('下级会员')" align='center'>
          </el-table-column>
          <el-table-column prop="ctRatio" :label="$t('存提比例')" align='center'></el-table-column>
          <el-table-column prop="lsRatio" :label="$t('流水比例')" align='center'></el-table-column>
          <el-table-column prop="syRatio" :label="$t('输赢比例')" align='center'></el-table-column>
          <el-table-column prop="yhRatio" :label="$t('优惠比例')" align='center'></el-table-column>
          <el-table-column prop="ctDiffer" :label="$t('存提差')" align='center'></el-table-column>
        </el-table>
      </div>
      <!-- 标签-招商 -->
      <div class="search-form" v-show="pageFlag==='merchantsPage'">
        <el-table :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'merchantsPage')">
          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount===$t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount || '其他'}}</span>
              <el-button v-else @click="handleAgentClick(scope.row)" type="text" size="small">
                {{scope.row.agyAccount || $t('其他')}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewMbrs" :label="$t('新增会员')" sortable='totalNewMbrs'>
          </el-table-column>
          <el-table-column align='center' prop="totalDepositBalanceNum" :label="$t('存款人数')" sortable='totalNewDeposits'>
          </el-table-column>
          <el-table-column align='right' prop="totalActualarrival" :label="$t('存款金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewDeposits" :label="$t('首存人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalDrawAmountNum" :label="$t('提款人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalDrawAmount" :label="$t('提款金额')">
          </el-table-column>
          <el-table-column align='right' prop="totalProfit" :label="$t('净盈利')">
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column align='center' prop="totalActiveMbrs" :label="$t('活跃人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBetMbrs" :label="$t('投注人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmount" :label="$t('所有优惠')" sortable='custom'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalValidBets" :label="$t('有效投注金额')">
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column align='right' prop="totalPayout" :label="$t('总盈亏')">
          </el-table-column>
          <el-table-column align='right' prop="serviceCost" :label="$t('总服务费')">
          </el-table-column>
          <el-table-column align='right' prop="cost" :label="$t('总平台费')">
          </el-table-column>
          <el-table-column align='center' prop="totalSubAgentNum" :label="$t('下级代理')">
          </el-table-column>
          <el-table-column align='center' prop="totalSubMbrNum" :label="$t('下级会员')">
          </el-table-column>
        </el-table>
      </div>
      <!--  下级代理及会员 -->
      <div class="search-form" v-show="pageFlag==='memberPage' || pageFlag === 'memberDetailPage'">
        <!-- 汇总 -->
        <template>
          <div class="summary">
            <el-table stripe border show-summary :data="viewTableData" :summary-method="getSummaries" style="margin-bottom: 20px;overflow-x: auto;">
              <el-table-column :label="$t('视图')" align="center" fixed="left">
                <template slot-scope="{ row }">
                  <el-button type="text" size="small" :disabled="isSubAgentShow ? row.agyAccount === $t('下级代理') : row.agyAccount === $t('直属会员')" @click="showMemberPage(row.agyAccount === '下级代理')">
                    {{ row.agyAccount }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
              </el-table-column>
              <el-table-column align='center' prop="totalNewMbrs" :label="$t('新增会员')">
              </el-table-column>
              <el-table-column align='center' prop="totalDepositBalanceNum" :label="$t('存款人数')">
              </el-table-column>
              <el-table-column align='right' prop="totalActualarrival" :label="$t('存款金额')">
              </el-table-column>
<!--              <el-table-column align='right' prop="totalActualarrival" label="存款实际到账金额">-->
<!--              </el-table-column>-->
              <el-table-column align='center' prop="totalNewDeposits" :label="$t('首存人数')">
              </el-table-column>
              <el-table-column align='right' prop="totalNewDepositAmount" :label="$t('首存金额')">
              </el-table-column>
              <el-table-column align='center' prop="totalDrawAmountNum" :label="$t('提款人数')">
              </el-table-column>
              <el-table-column align='right' prop="totalDrawAmount" :label="$t('提款金额')" :formatter="thousandsFormatter">
              </el-table-column>
              <el-table-column align='right' prop="totalProfit" :label="$t('净盈利')" :formatter="thousandsFormatter">
              </el-table-column>
              <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
              </el-table-column>
              <el-table-column align='center' prop="totalActiveMbrs" :label="$t('活跃人数')">
              </el-table-column>
              <el-table-column align='center' prop="totalBonusAmount" :label="$t('所有优惠')" :formatter="thousandsFormatter">
              </el-table-column>
              <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
              </el-table-column>
              <el-table-column align='center' prop="totalBetMbrs" :label="$t('投注人数')">
              </el-table-column>
              <el-table-column align='right' prop="totalValidBets" :label="$t('有效投注金额')" :formatter="thousandsFormatter">
              </el-table-column>
              <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
              </el-table-column>
              <el-table-column align='center' prop="totalPayout" :label="$t('总盈亏')" :formatter="thousandsFormatter">
              </el-table-column>
              <el-table-column align='center' prop="serviceCost" :label="$t('总服务费')" :formatter="thousandsFormatter"></el-table-column>
              <el-table-column align='right' prop="cost" :label="$t('总平台费')">
                <template slot-scope="scope">
                  <span>{{scope.row.cost || '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column align='right' prop="netwinlose" :label="$t('净输赢冲销')">
                <template slot-scope="scope">
                  <span>{{scope.row.netwinlose || '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <h3 class="member-page-export" style="margin-bottom: 20px;">{{ isSubAgentShow ? $t('下级代理') : $t('直属会员') }}
            <div style="float: right">
              <el-button v-show="permissions.save" class="iconfont icon-export el-button-export export" @click="handleExport" :loading="isExporting">{{isExporting ? $t('导出中') : $t('导出当前表单')}}
              </el-button>
            </div>
          </h3>
        </template>
        <!-- 具体会员报表 -->
        <el-table v-if="isSubAgentShow" :data="tableData.list" border @sort-change="handleSortChange($event,'memberPage')">

          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount===$t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount}}</span>
              <el-button v-else type="text" size="small" @click="handleChildAgent(scope.row)">
                {{scope.row.agyAccount}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column align='center' prop="totalNewMbrs" :label="$t('新增会员')" sortable='totalNewMbrs'>
          </el-table-column>
          <el-table-column align='center' prop="totalDepositBalanceNum" :label="$t('存款人数')" sortable='totalNewDeposits'>
          </el-table-column>
          <el-table-column align='right' prop="totalActualarrival" :label="$t('存款金额')">
          </el-table-column>
<!--          <el-table-column align='right' prop="totalActualarrival" label="存款实际到账金额">-->
<!--          </el-table-column>-->
          <el-table-column align='center' prop="totalNewDeposits" :label="$t('首存人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalNewDepositAmount" :label="$t('首存金额')">
          </el-table-column>
          <el-table-column align='center' prop="totalDrawAmountNum" :label="$t('提款人数')">
          </el-table-column>
          <el-table-column align='right' prop="totalDrawAmount" :label="$t('提款金额')">
          </el-table-column>
          <el-table-column align='right' prop="totalProfit" :label="$t('净盈利')">
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column align='center' prop="totalActiveMbrs" :label="$t('活跃人数')">
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmount" :label="$t('所有优惠')" sortable='custom'>
          </el-table-column>
          <el-table-column align='center' prop="totalBonusAmountNum" :label="$t('优惠人数')">
          </el-table-column>
          <!-- --------------- -->
          <el-table-column align='center' prop="totalBetMbrs" :label="$t('投注人数')">
          </el-table-column>
          <!-- --------------- -->
          <el-table-column align='right' prop="totalValidBets" :label="$t('有效投注金额')">
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column align='right' prop="totalPayout" :label="$t('总盈亏')">
          </el-table-column>
          <el-table-column align='center' prop="totalSubAgentNum" :label="$t('下级代理')">
          </el-table-column>
          <el-table-column align='center' prop="totalSubMbrNum" :label="$t('下级会员')">
          </el-table-column>
          <el-table-column align='center' prop="ctRatio" :label="$t('存提比例')"></el-table-column>
          <el-table-column align='center' prop="lsRatio" :label="$t('流水比例')"></el-table-column>
          <el-table-column align='center' prop="syRatio" :label="$t('输赢比例')"></el-table-column>
          <el-table-column align='center' prop="yhRatio" :label="$t('优惠比例')"></el-table-column>
          <el-table-column align='center' prop="ctDiffer" :label="$t('存提差')"></el-table-column>
          <el-table-column align='center' prop="sumDepositAndWithdrawal" :label="$t('存提和')"></el-table-column>
          <el-table-column align='center' prop="serviceCost" :label="$t('总服务费')"></el-table-column>
          <el-table-column align='right' :label="$t('总平台费')">
            <template slot-scope="scope">
              <span>{{scope.row.cost || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' prop="netwinlose" :label="$t('净输赢冲销')">
            <template slot-scope="scope">
              <span>{{scope.row.netwinlose || '--'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'memberPage')">
          <el-table-column :label="$t('会员')" align="center">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.loginName==='小计' || scope.row.loginName==='总计'">{{scope.row.loginName}}</span> -->
              <!-- <el-button v-else @click="handleMemberClick(scope.row)" type="text" size="small">{{scope.row.loginName}}
              </el-button> -->
              <span>{{scope.row.loginName}}</span>
              <GlobalComponentTestLabel :id="scope.row.tagencyId" />
            </template>
          </el-table-column>
          <el-table-column align='center' prop="winloseLastTime" :label="$t('总盈亏更新时间')">
          </el-table-column>
          <el-table-column prop="totalProfit" :label="$t('净盈利')" sortable='custom' align='center'>
          </el-table-column>
          <el-table-column prop="totalActualarrival" :label="$t('存款金额')" sortable='custom' align='right'>
          </el-table-column>
<!--          <el-table-column align='right' prop="totalActualarrival" label="存款实际到账金额">-->
<!--          </el-table-column>-->
          <el-table-column prop="totalDrawAmount" :label="$t('提款金额')" align='right'>
          </el-table-column>
          <el-table-column align='right' prop="calculateProfit" :label="$t('资金调整')">
          </el-table-column>
          <el-table-column prop="totalBonusAmount" :label="$t('所有优惠')" align='center'>
          </el-table-column>
          <el-table-column prop="totalValidBets" :label="$t('有效投注金额')" align='right'>
          </el-table-column>
          <el-table-column align='right' prop="betCount" :label="$t('总注单数量')">
          </el-table-column>
          <el-table-column prop="totalPayout" :label="$t('总盈亏')" sortable='custom' align='right'>
          </el-table-column>
          <el-table-column prop="parentAgyAccount" :label="$t('上级代理')" align='center'></el-table-column>
          <el-table-column prop="cateGory" :label="$t('部门（类别）')" align='center'></el-table-column>
          <el-table-column prop="ctRatio" :label="$t('存提比例')" align='center'></el-table-column>
          <el-table-column prop="lsRatio" :label="$t('流水比例')" align='center'></el-table-column>
          <el-table-column prop="syRatio" :label="$t('输赢比例')" align='center'></el-table-column>
          <el-table-column prop="yhRatio" :label="$t('优惠比例')" align='center'></el-table-column>
          <el-table-column prop="ctDiffer" :label="$t('存提差')" align='center'></el-table-column>
        </el-table>
      </div>
      <!-- <div class="search-form" v-show="pageFlag==='memberDetailPage'">
        <el-table :data="tableData.list" border style="width: 100%" @sort-change="handleSortChange($event,'memberDetailPage')">
          <el-table-column label="时间">
            <template slot-scope="scope">
              <span>{{filterTime(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalProfit" label="净盈利" sortable='custom' align='right'>
          </el-table-column>
          <el-table-column prop="totalDepositBalance" label="存款" sortable='custom' align='right'>
          </el-table-column>
          <el-table-column prop="friendsTransAmountTotal" label="好友转帐出款" align='right'>
          </el-table-column>
          <el-table-column prop="friendsRecepitAmountTotal" label="好友转帐入款" align='right'>
          </el-table-column>
          <el-table-column prop="fundAdjust" label="资金调整" align='right'>
          </el-table-column>
          <el-table-column prop="totalDrawAmount" label="提款" sortable='custom' align='right'>
          </el-table-column>
          <el-table-column prop="totalBonusAmount" label="红利" align='right'>
          </el-table-column>
          <el-table-column prop="totalRebate" label="总返利" align='right'>
          </el-table-column>
          <el-table-column prop="totalPayout" label="盈亏" sortable='custom' align='right'>
          </el-table-column>
          <el-table-column align='right' prop="totalTaskBonus" label="总任务返利">
          </el-table-column>
          <el-table-column prop="totalValidBets" label="奖池派彩" align='right'>
          </el-table-column>
        </el-table>
      </div> -->
      <!--公共的下面的分页-->
      <div class="pagination" style="margin-bottom: 20px" v-show="haveTableDataBool && !loading">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount">
        </el-pagination>
      </div>
      <!-- <div class="pagination" v-if="pageFlag==='agyDetailPage'&&!loading">
        <el-pagination
          background
          @size-change="handleSizeInnerChange"
          @current-change="handleCurrentInnerChange"
          :current-page="listReqInner.pageNo"
          :page-sizes="listReqInner.pageSizeArr"
          :page-size="listReqInner.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="innerTableData.totalCount">
        </el-pagination>
      </div> -->
      <div class="intTime">
        <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
        <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
      </div>
    </div>
    <el-dialog :title="$t('代理线导出')" :visible.sync="AgentExportVisible" center :before-close="clearAgentExport">
      <el-form class="form-wrapper" label-position="right" label-width="auto" label-suffix=":" ref="agentExportForm" :model="agentExportForm" :rules="rules">
        <el-form-item prop="agyAccount" :label="$t('代理账号')">
          <el-input v-model="agentExportForm.agyAccount" :label="$t('请输入代理账号')" style="width: 200px;"></el-input>
          <el-button @click="check">{{ $t('核对信息') }}</el-button>
        </el-form-item>
        <el-form-item v-if="agentExportForm.count||agentExportForm.count===0" :label="$t('代理总计')" class="red">{{agentExportForm.count}}</el-form-item>
        <el-form-item prop="agentLineExportTypes" :label="$t('数据选择')">
          <el-checkbox-group v-model="agentExportForm.agentLineExportTypes">
            <el-checkbox :label="1">{{ $t('总代') }}</el-checkbox>
            <el-checkbox :label="2">{{ $t('一级代理') }}</el-checkbox>
            <el-checkbox :label="3">{{ $t('二级代理') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="button_footer">
          <el-button @click="handleCancel">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('确定导出') }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../../config/config.js";
import queryStore from "../../../mixins/queryStore";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import { mapGetters } from "vuex";
import moment from "moment";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

export default {
  name: "moneySheet",
  mixins: [
    site,
    Mixin,
    queryStore([
      "startTime",
      "endTime",
      "agentType",
      "agyAccount",
      "membername",
    ]),
  ],
  components: { StartAndEndTimeSelector },
  data() {
    return {
      timeSelections: [
        {
          label: this.$t("今日"),
          value: "today",
        },
        {
          label: this.$t("昨日"),
          value: "yesterday",
        },
        {
          label: this.$t("本周"),
          value: "currentWeek",
        },
        {
          label: this.$t("上周"),
          value: "lastWeek",
        },
        {
          label: this.$t("本月"),
          value: "currentMonth",
        },
      ],
      startTime: moment().subtract(6, "day").format("YYYY-MM-DD"),
      endTime: moment().format("YYYY-MM-DD"),
      innerTableData: {},
      tableData: {},
      pageFlag: "",
      gridData: [],
      allTotal: {},
      agyAccount: "",
      membername: "",
      agentType: 1,
      departmentid: null,
      departmentidOpt: [],
      agentLevel:null,
      levelList: [
        {label:this.$t('股东'),id:0},
        {label:this.$t('总代'),id:1},
        {label:this.$t('一级代理'),id:2},
        {label:this.$t('二级代理'),id:3},
      ],
      commonIds: [
        { key: 0, value: this.$t("全选") },
        { key: 1, value: this.$t("精确查询") },
      ],
      listReqInner: {
        pageSize: 15,
        pageNo: 1,
        pageSizeArr: [5, 10, 15, 20, 50, 100],
      },
      /* listReq:{
          pageSize: 15,
          pageNo: 1,
        },
        oldTableList:[],
        enterNum:0,
        loadingBool:false,//下拉加载图标展示*/
      saveStartTime: "", //保存当前开始时间
      saveEndTime: "",
      orderBy: "", //升降序字段
      staticalAnalysisShow: false, //统计分析页是否展示
      statisticalData: {},
      recodeSelectParams: {},
      loading: false,
      snapshots: [],
      viewTableData: [],
      isSubAgentShow: true,
      isExporting: false,
      isExportingDate: false,
      recodeParams: {},
      recodeMoudle: "",
      isExportingAgent: false,
      AgentExportVisible: false,
      agentExportForm:{agentLineExportTypes:[1,2,3]},
      rules:{
        agyAccount: [{required:true,message:this.$t('请输入代理账号'),trigger:'blur'}],
        agentLineExportTypes: [{required:true,message:this.$t('请选择数据类型'),trigger:'blur'}],
      }
    };
  },
  created() {
    this.getAllDepartmentList()
    /* window.onscroll=()=>{
        this.$scrToBottom.scrollTo('newlistReq',this,'handleSizeChange')
      } */
  },
  mounted() {
    /* if (!this.useQueryStoreCache) {
        this.startTime = systemConfig.transferTimeByType(systemConfig.getSevendayAgo() + ' '  + "00:00:00", this.timeType)
        this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' '  + "23:59:59", this.timeType)
      }
      /* this.showMainPage() */
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [10, 100, 300, 500, 1000],
      };
    },

    /* loading:  {
        get: function () {
          return this.$store.state.searchLoading
        },
        set: function () {
        }
      }, */
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () {},
    },
    permissions() {
      const { hasPermission } = this;
      return {
        save: hasPermission("agent:report:comviewexport"),
        agentExport: hasPermission("agent:report:agentlintexport"),
      };
    },
    currentLayer() {
      return this.snapshots.slice(-1)[0];
    },
    currentLevel() {
      // 当前在第几层
      return this.snapshots.length;
    },
    ...mapGetters(["hasPermission"]),
    haveTableDataBool() {
      return !!(
        (this.tableData.list && this.tableData.list.length) ||
        this.viewTableData.length
      );
    },
  },
  methods: {
    handleAgentExport(){
      this.AgentExportVisible = true
    },
    clearAgentExport(done){
      this.agentExportForm = {agentLineExportTypes:[1,2,3]}
      this.$refs.agentExportForm.clearValidate()
      this.$refs.agentExportForm.resetFields()
      if(done)done()
    },
    check(){
      this.$refs.agentExportForm.validateField('agyAccount',(msg)=>{
        if(!msg){
          this.$axios.post(systemConfig.urls.agentLineReportExportCount,this.agentExportForm).then((res)=>{
            if(res.data.code===0){
              this.agentExportForm.count = res.data.count
              this.$forceUpdate()
            }
          })
        }
      })
    },
    handleCancel(){
      this.clearAgentExport()
      this.isExportingAgent = false
      this.AgentExportVisible = false
    },
    handleSubmit(){
      this.$refs.agentExportForm.validate(valid=>{
        if(valid){
          this.recodeMoudle='agentLineListModel'
          this.isExportingAgent = true;
          this.$axios
            .post(systemConfig.urls.agentLineReportExport, {
                startTime:this.startTime+' 00:00:00',
                endTime:this.endTime+' 23:59:59',
                module: this.recodeMoudle,
                ...this.agentExportForm
              })
            .then((res) => {
              let isDownBool = res.data.data;
              if (isDownBool) {
                this.$message({
                  type: "warning",
                  message: isDownBool,
                });
                this.isExportingAgent = false;
              } else {
                this.handleCancel()
                this.checkExportFile();
              }
            });
        }
      })
    },
    thousandsFormatter(row, column, cellValue) {
      return this.toThousands(cellValue)
    },
    async getAllDepartmentList() {
      const obj = await this.$axios.GET(this.$urls.newAggentList.alldDepartmentList)
      const { res, response} = obj
      this.getNetworkLoadAndDataSolveTime(response)
      if (res) {
        const { data } = res
        data.unshift({ id: '', departmentName: this.$t('全部') })
        this.departmentidOpt = data
      }
    },
    checkAgy(val) {
      if (this.agentType !== "") {
        this.agentType = 1;
      }
    },
    checkAccount(val) {
      this.agyAccount = "";
    },
    filterTime(time) {
      if (!time) {
        return;
      }
      if (!time.length === 8) {
        return;
      }
      let str1 = time.substr(0, 4);
      let str2 = time.substr(4, 2);
      let str3 = time.substr(6, 2);
      return str1 + "/" + str2 + "/" + str3;
    },
    handleSizeChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.switchChange();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.switchChange();
    },
    switchChange() {
      switch (this.pageFlag) {
        case "mainPage":
          this.getMainPageList();
          break;
        case "timePage":
          this.getTimePageList();
          break;
        case "agyDetailPage":
          this.getAgyDetailPageList();
          break;
        case "merchantsPage":
          this.showMerchantsPage();
          break;
        case "memberPage":
        case "memberDetailPage":
          // this.getMemberPageList()
          this.isSubAgentShow
            ? this.getSubordinateList()
            : this.getMemberPageList();
          break;
      }
    },
    // 总代的会员
    handleSizeInnerChange(val) {
      this.listReqInner.pageNo = 1;
      this.listReqInner.pageSize = val;
      this.getAgyDetailMemberPageList();
      // this.showAgyDetailPage()
    },
    handleCurrentInnerChange(val) {
      this.listReqInner.pageNo = val;
      this.getAgyDetailMemberPageList();
      // this.showAgyDetailPage()
    },
    toThousands(money) {
      return systemConfig.toThousands(money);
    },
    getStatistic() {
      // 统计数据
      this.$axios
        .get(systemConfig.urls.agentReport.totalInfo, {
          params: {
            startTime: this.startTime + " 00:00:00",
            endTime: this.endTime + " 23:59:59",
            departmentid: this.departmentid
          },
        })
        .then((resp) => {
          this.allTotal = resp.data.info;
        });
    },
    reset() {
      this.startTime = "";
      this.endTime = "";
      this.membername = "";
      this.agyAccount = "";
      this.agentType = 1;
      this.agentLevel = null
      this.departmentid = null;
      this.resetOrderBy();
      this.btsSmId = 10;
      this.tableData = {};
      //this.oldTableList=[];
      this.staticalAnalysisShow = false;
      this.statisticalData = {};
      this.loading = false;
    },
    search() {
      this.getCurrentRecodeTime()
      if (!this.startTime || !this.endTime) {
        this.$message({
          type: "warning",
          message: this.$t("请输入完整的时间段"),
        });
        this.tableData = {};
        return;
      }
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("起始时间不能大于结束时间"),
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
      // if (agentType === 1 && !this.agyAccount) {
      //   this.$message({
      //     type: "warning",
      //     message: "请输入代理账号",
      //   });
      //   return;
      // }
      this.snapshots = [];
      this.statisticalData = {};
      if (this.staticalAnalysisShow) {
        let params = {
          startTime: this.startTime + " 00:00:00",
          endTime: this.endTime + " 23:59:59",
          isTest: this.agentType == 2 ? 0 : this.agentType == 3 ? 1 : "",
          agyAccountStr: this.agentType == 1 ? this.agyAccount : "",
          departmentid: this.departmentid
        };
        this.getStatistData(params);
        return;
      }
      this.loading = true;
      this.resetPagenation();
      this.resetInnerPagenation();
      if(this.agyAccount){
        let url = this.agentLevel===null?("?agyAccount=" + this.agyAccount):("?agyAccount=" + this.agyAccount+"&agentLevel="+this.agentLevel)
          this.$axios
              .get(
                systemConfig.urls.agentReport.judgeTagency + url
              )
              .then(({ data }) => {
                // 先判断股东还是非股东  //  parentId 0为股东
                const { id, parentId, cateGory, agyAccount } = data.info;
                const firstSnapObj = {
                  agyId: undefined,
                  displayName: this.$t("股东"),
                  returnPageFlag: "agyDetailPage",
                };
                if (!parentId) {
                  let arr = [firstSnapObj];
                  arr.push({
                    parentId,
                    agyId: id,
                    agyAccount,
                    loginName: agyAccount, // 会员名也在agyAccount返回
                    displayName: `${this.$t('股东')} ${agyAccount}`,
                    returnPageFlag: "memberPage",
                  });
                  this.getExceptSearch(arr, parentId, id);
                } else {
                  this.getBannerList(
                    "agent",
                    this.agyAccount,
                    firstSnapObj,
                    data.info,
                    agyAccount
                  );
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.data.msg);
              });
      }else if(this.agentLevel===0){
        // 查询该段时间所有/测试代理/正式代理
          this.showTimePage("", this.agentType);
      }else if(this.agentLevel&&this.agentLevel!==0){
          this.handleAgyDetailClick({})
      }else{
        // 进入首页
        this.showMainPage();
      }
    },
    getExceptSearch(arr, parentId, id) {
      this.snapshots = arr;
      // parentId是判断跳转总代页面还是自代页面  再根据id去获取table数据  isisCagency传0
      this.loading = false;
      if (parentId === 0) {
        this.showAgyDetailPage("", id);
      } else {
        this.showMemberPage();
      }
    },
    getBannerList(
      searchType,
      searchName,
      firstSnapObj,
      dataInfo,
      agyAccountName
    ) {
      this.$axios
        .get(
          searchType === "agent"
            ? systemConfig.urls.getAgentBanner
            : systemConfig.urls.getMbrBanner,
          {
            params: {
              [searchType === "agent" ? "agyAccount" : "loginName"]: searchName,
            },
          }
        )
        .then(({ data }) => {
          const bannerList = data.data.filter(
            ({ bannerType }) => bannerType === "agent"
          );
          let arr = [firstSnapObj];
          const bool = bannerList.length > 1;
          // isCagency 1， agyId 上级代理id，cateGory 部门
          const cateGoryName = bool
            ? bannerList[1].category
            : dataInfo.category;
          const stlist = [this.$t("一"), this.$t("二"), this.$t("三"), this.$t("四"), this.$t("五")];
          const pageFlagList = ["memberPage", "memberDetailPage"];
          let bannerListArr = bannerList.map(
            ({ bannerType, id, parentId, agyAccount }, index) => {
              const text = !index
                ? this.$t("股东")
                : index === 1
                ? this.$t("总代理")
                : this.$t("{num}级代理", { num: stlist[index - 2] });
              return {
                parentId,
                agyId: id,
                agyAccount,
                loginName: agyAccount, // 会员名也在agyAccount返回
                displayName: `${
                  bannerType === "mbr" ? this.$t("会员") : text
                }${agyAccount}`,
                returnPageFlag:
                  index > 1 ? pageFlagList[1] : pageFlagList[index],
              };
            }
          );
          const baseObj = {
            displayName: cateGoryName || this.$t("其他"),
            returnPageFlag: "merchantsPage",
            isCagency: 1,
            cateGory: cateGoryName || this.$t("其他"),
          };
          const labelInsert = {
            // agyId: bannerList[0].id,
            parentId: bannerList[0].id,
            ...baseObj,
          };
          const len = bannerListArr.length - 2;
          let endObj = {
            agyId: dataInfo.id,
            ...baseObj,
            displayName: `${
              len < 0 ? this.$t("总代理") : stlist[len] + this.$t("级代理")
            } ${agyAccountName}`,
            parentId: dataInfo.parentId,
            returnPageFlag: "memberDetailPage",
            cateGory: "",
          };
          bannerListArr.splice(1, 0, labelInsert);
          bannerListArr.push(endObj);
          arr.push(...bannerListArr);
          this.getExceptSearch(arr, dataInfo.parentId);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeBtn() {
      this.resetPagenation();
      this.resetInnerPagenation();
      this.reset();
      this.snapshots = [];
      this.tableData.list = [];
      this.startTime = systemConfig.transferTimeByType(
        systemConfig.getSevendayAgo() + " " + "00:00:00",
        this.timeType
      );
      this.endTime = systemConfig.transferTimeByType(
        systemConfig.getToday() + " " + "23:59:59",
        this.timeType
      );
      this.showMainPage();
    },
    // 返回按钮事件
    handleSnapshotsChange() {
      this.agyAccount = "";
      this.agentType = 1;
      this.pageFlag = this.currentLayer.returnPageFlag;
      this.resetPageNo();
      this.resetOrderBy();
      this.returnBtn();
    },
    returnBtn() {
      switch (this.pageFlag) {
        case "timePage": //
          this.startTime = this.saveStartTime;
          this.endTime = this.saveEndTime;
          this.showMainPage();
          break;
        case "agyDetailPage": // 返回股东
          this.showTimePage("");
          // this.showTimePage('')
          break;
        case "merchantsPage": // 返回标签
          this.showMerchantsPage();
          break;
        case "memberPage": // 返回部门
          this.showAgyDetailPage();
          break;
        case "memberDetailPage": // 返回总代理及子代理
          this.isSubAgentShow = true;
          this.setChildAgent();
          break;
      }
    },
    getMainPageList() {
      /* if(this.tableData.totalCount&&this.listReq.pageSize-20>=this.tableData.totalCount){//条数大于tableData.list总数，则停止
          return ;
        } */
      this.loading = true;
      const params = {
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        orderBy: this.orderBy,
        departmentid: this.departmentid
      };
      this.recodeParams = JSON.parse(JSON.stringify(params));
      this.recodeMoudle = "totalListByDay";
      this.$axios
        .get(systemConfig.urls.agentReport.totalListByDay, { params })
        .then(resp => {
          this.getNetworkLoadAndDataSolveTime(resp)
          let page = JSON.parse(JSON.stringify(resp.data.page));
          page.list = page.list.map((item) => {
            const arr = [
              "totalDepositBalance",
              "totalNewDepositAmount",
              "totalDrawAmount",
              "totalProfit",
              "totalYouhuiBonusAmount",
              "totalValidBets",
              "totalPayout",
              "totalBonusAmount",
              "calculateProfit",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.tableData = page;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    getTimePageList() {
      this.loading = true;
      // agentType用于区分是否选择了代理账号的正式代理、测试代理
      const { agentType } = this;
      const currentAgentId = this.currentLayer.agyId;
      const isTest = currentAgentId === 3;
      const params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        isCagency: this.agentLevel?1:0,
        orderBy: this.orderBy,
        // cateGory: "",
        departmentid: this.departmentid,
        agyId: agentType > 1 ? currentAgentId : "",
      };
      this.agentLevel!==null?(params.agentLevel = this.agentLevel):null
      if (agentType === 2 || agentType === 3) {
        params['isTest']= agentType > 1 ? isTest : false
      }
      this.getTanencyList(params);
    },
    getTanencyList(params) {
      this.recodeParams = JSON.parse(JSON.stringify(params));
      this.recodeMoudle = "tagencyList";
      this.$axios
        .get(systemConfig.urls.agentReport.tagencyList, {
          params,
        })
        .then((resp) => {
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = [
              "totalActualarrival",
              "totalDrawAmount",
              "totalPayout",
              "totalProfit",
              "totalBonusAmount",
              "totalValidBets",
              "cost",
              "serviceCost",
              "totalSubMbrNum",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.tableData = resp.data.page;
          this.loading = false;
        });
    },
    getAgyDetailPageList() {
      this.loading = true;
      const params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        isCagency: 1,
        agyId: this.currentLayer.agyId,
        orderBy: this.orderBy,
      };
      this.recodeParams = JSON.parse(JSON.stringify(params));
      this.recodeMoudle = "categoryList";
      this.$axios
        .get(systemConfig.urls.agentReport.categoryList, {
          params,
        })
        .then((resp) => {
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = [
              "totalDepositBalance",
              "totalDrawAmount",
              "totalPayout",
              "totalProfit",
              "totalBonusAmount",
              "totalValidBets",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.tableData = resp.data.page;
          this.loading = false;
        });
    },
    getAgyDetailMemberPageList() {
      this.loading = true;
      // 根据总代查询会员列表
      this.$axios
        .get(systemConfig.urls.moneyMemberList, {
          params: {
            startTime: this.startTime + " 00:00:00",
            endTime: this.endTime + " 23:59:59",
            pageSize: this.listReqInner.pageSize,
            pageNo: this.listReqInner.pageNo,
            isCagency: 1,
            agyId: this.currentLayer.agyId,
            departmentid: this.departmentid,
            orderBy: this.orderBy,
          },
        })
        .then((resp) => {
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = [
              "fundAdjust",
              "friendsTransAmountTotal",
              "friendsRecepitAmountTotal",
              "totalTaskBonus",
              "totalBonusAmount",
              "totalDepositBalance",
              "totalDrawAmount",
              "totalValidBets",
              "totalPayout",
              "totalProfit",
              "totalRebate",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.loading = false;
          this.innerTableData = resp.data.page;
        });
    },
    getSubordinateList() {
      this.loading = true;
      const { currentLayer } = this;
      const params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        isCagency: 1,
        agyId: currentLayer.agyId,
        orderBy: this.orderBy,
        cateGory: currentLayer.cateGory === this.$t("其他") ? 0 : (this.departmentid),
      };
      this.getTanencyList(params);
    },
    getMemberPageList() {
      const { currentLayer } = this;
      this.loading = true;
      const params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        agyId: currentLayer.agyId,
        departmentid: this.departmentid,
        orderBy: this.orderBy,
      };
      this.recodeParams = JSON.parse(JSON.stringify(params));
      this.recodeMoudle = "memberList";
      this.$axios
        .get(systemConfig.urls.agentReport.memberList, {
          params,
        })
        .then((resp) => {
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = [
              "totalDepositBalance",
              "totalDrawAmount",
              "totalPayout",
              "totalProfit",
              "totalBonusAmount",
              "totalValidBets",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.tableData = resp.data.page;
          this.tableData.list.map(ws=>{
            if(!ws.cateGory||ws.cateGory==null){
              ws.cateGory = this.$t("其他")
            }
          })
          this.loading = false;
        });
    },
    getMemberDetailPageList() {
      this.loading = true;
      // let url =
      //   "?pageSize=" +
      //   this.listReq.pageSize +
      //   "&pageNo=" +
      //   this.listReq.pageNo +
      //   "&startTime=" +
      //   this.startTime +
      //   " 00:00:00" +
      //   "&endTime=" +
      //   this.endTime +
      //   " 23:59:59" +
      //   "&loginName=" +
      //   this.currentLayer.loginName +
      //   "&orderBy=" +
      //   this.orderBy;
      const params = {
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        loginName: this.currentLayer.loginName,
        orderBy: this.orderBy,
      };
      this.$axios
        .get(systemConfig.urls.moneyMainPage, { params })
        .then((resp) => {
          resp.data.page.list = resp.data.page.list.map((item) => {
            const arr = [
              "fundAdjust",
              "friendsTransAmountTotal",
              "friendsRecepitAmountTotal",
              "totalTaskBonus",
              "totalBonusAmount",
              "totalDepositBalance",
              "totalDrawAmount",
              "totalValidBets",
              "totalPayout",
              "totalProfit",
              "totalRebate",
            ];
            for (let key of arr) {
              item[key] = this.toThousands(item[key]);
            }
            return item;
          });
          this.tableData = resp.data.page;
          this.loading = false;
          /* if(this.tableData.list.length==this.oldTableList.length){
            this.oldTableList=this.tableData.list
          } */
        });
    },
    showMainPage() {
      this.resetPageNo();
      this.resetOrderBy();
      this.getStatistic();
      this.loading = true;
      this.pageFlag = "mainPage";
      this.getMainPageList();
    },
    // 查代理
    showTimePage(time, agentType) {
      this.saveStartTime = this.startTime;
      this.saveEndTime = this.endTime;
      this.resetPageNo();
      this.resetOrderBy();
      this.loading = true;
      this.pageFlag = "timePage";
      if (time) {
        let str1 = time.substr(0, 4); // 2018
        let str2 = time.substr(4, 2); // 10
        let str3 = time.substr(6, 2); // 01
        this.startTime = str1 + "-" + str2 + "-" + str3 + " ";
        this.endTime = str1 + "-" + str2 + "-" + str3 + " ";
        this.agentType = 1;
        this.agyAccount = "";
        this.btsSmId = 10;
      }
      this.snapshots = [
        {
          agyId: agentType, // agentType是2、3的时候可用于agyId参数查询正式和测试代理
          displayName: (this.agentLevel===0||!this.agentLevel)?this.$t("股东"):this.$t("代理"),
          returnPageFlag: "agyDetailPage",
        },
      ];
      this.getTimePageList();
    },
    // 面包屑
    async getAgentBanner() {
      await this.$axios
        .get(systemConfig.urls.agentReport.getAgentBanner, {
          params: {
            // agyAccount:
          },
        })
        .then((resp) => {
          this.allTotal = resp.data.info;
        });
    },
    handleTopAgentClick(row) {
      this.resetPageNo();
      this.resetOrderBy();
      this.snapshots.push({
        ...row,
        returnPageFlag: "memberPage",
        displayName: ((this.agentLevel===0||!this.agentLevel)?this.$t("股东"):this.$t("代理"))+` ${row.agyAccount}`,
      });
      this.showAgyDetailPage();
    },
    showAgyDetailPage() {
      this.resetPageNo();
      this.resetOrderBy();
      this.loading = true;
      this.pageFlag = "agyDetailPage";
      // this.innerTableData = {}
      this.getAgyDetailPageList();
      // this.getAgyDetailMemberPageList()
    },
    handleAgyDetailClick(row) {
      this.resetPageNo();
      this.resetOrderBy();
      this.snapshots.push({
        ...row,
        returnPageFlag: "merchantsPage",
        displayName: row.cateGory || this.$t("其他"),
      });
      this.showMerchantsPage();
    },
    showMerchantsPage() {
      this.pageFlag = "merchantsPage";
      this.loading = true;
      const { parentId, cateGory } = this.currentLayer;
      // agentType用于区分是否选择了代理账号的正式代理、测试代理
      // const { agentType } = this;
      let cateGory0 = null
      this.departmentidOpt.forEach(item=>item.id===this.departmentid?(cateGory0=item.departmentid):null)
      const params = {
        startTime: this.startTime + " 00:00:00",
        endTime: this.endTime + " 23:59:59",
        pageSize: this.listReq.pageSize,
        pageNo: this.listReq.pageNo,
        isCagency: 1,
        agyId: parentId,
        orderBy: this.orderBy,
        departmentid: this.departmentid,
        cateGory: cateGory0===this.$t('全部')?null:cateGory0,
        agentLevel: this.agentLevel?this.agentLevel:null
      };
      this.getTanencyList(params);
    },
    handleAgentClick(row) {
      this.snapshots.push({
        ...row,
        returnPageFlag: "memberDetailPage",
        displayName: (this.agentLevel!==0&&this.agentLevel)?`${row.agyAccount}`:`${this.$t('总代理')} ${row.agyAccount}`,
      });
      this.showMemberPage();
    },
    isInteger(val) {
      return typeof val === 'number' && val%1 === 0
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('总计')
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          const isInteger = this.isInteger(sums[index])
          if (!isInteger) {
            sums[index] = sums[index].toFixed(2)
          }
          const arr = [
            "totalDrawAmount",
            "totalPayout",
            "totalProfit",
            "totalBonusAmount",
            "totalValidBets",
          ]
          if (arr.includes(column.property)) {
            sums[index] = this.toThousands(sums[index])
          }
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    getMoneyTotalList() {
      const { currentLayer } = this;
      this.viewTableData = [];
      this.$axios
        .get(systemConfig.urls.agentReport.subAgentTotalViewList, {
          params: {
            startTime: this.startTime + " 00:00:00",
            endTime: this.endTime + " 23:59:59",
            pageSize: this.listReq.pageSize,
            pageNo: this.listReq.pageNo,
            isCagency: 1,
            agyId: currentLayer && currentLayer.agyId,
            // cateGory: "",
            departmentid: this.departmentid
          },
        })
        .then(({ data }) => {
          this.viewTableData = data.data
        });
    },
    showMemberPage(isSubAgentShow = true) {
      this.resetPageNo();
      this.resetOrderBy();
      this.loading = true;
      this.pageFlag = "memberDetailPage";
      this.isSubAgentShow = isSubAgentShow;
      if (this.currentLevel > 0) {
        this.getMoneyTotalList();
      }
      if (isSubAgentShow) {
        // 根据代理查询下级代理列表
        this.getSubordinateList();
      } else {
        // 根据代理查询直属会员列表
        this.getMemberPageList();
      }
    },
    handleMemberClick(row) {
      this.snapshots.push({
        ...row,
        returnPageFlag: "memberPage",
        displayName: `会员${row.loginName}`,
      });
      this.showMemberDetailPage();
    },
    showMemberDetailPage() {
      this.resetPageNo();
      this.loading = true;
      this.pageFlag = "memberDetailPage";
      this.getMemberDetailPageList();
    },
    resetPageNo() {
      this.listReq.pageNo = 1;
      this.listReqInner.pageNo = 1;
    },
    resetPagenation() {
      this.listReq.pageNo = 1;
      //this.listReq.pageSize = 10
    },
    resetInnerPagenation() {
      this.listReqInner.pageNo = 1;
      //this.listReqInner.pageSize = 20
    },
    resetOrderBy() {
      this.orderBy = "";
    },
    twoNumber(row, column, cellValue) {
      return systemConfig.saveTwoNumber(cellValue);
    },
    twoNumber2(row, column, cellValue) {
      return systemConfig.saveTwoNumber(cellValue) + "%";
    },
    /* scrollToTop(){
        this.$scrToBottom.scrollToTop();
      }, */
    // toMemberWithdraw(){
    //   this.$router.push({name:'会员提款',params:{
    //     startTime:this.startTime+'',endTime:this.endTime,source:'moneySheet'
    //   }})
    // },
    // toLoseWinSheet(){
    //   this.$router.push({name:'输赢报表',params:{
    //     startTime:this.startTime,endTime:this.endTime,source:'moneySheet'
    //   }})
    // },
    handleSortChange({ prop, order }, whichTable) {
      if (prop) {
        this.orderBy = prop + " " + (order == "descending" ? "desc" : "asc");
      } else {
        this.orderBy = "";
      }
      switch (whichTable) {
        case "mainPage":
          this.getMainPageList();
          break;
        case "timePage":
          this.getTimePageList();
          break;
        case "agyDetailPage":
          this.getAgyDetailPageList();
          break;
        case "merchantsPage":
          this.showMerchantsPage();
          break;
        case "memberPage":
          // this.getMemberPageList()
          this.isSubAgentShow
            ? this.getSubordinateList()
            : this.getMemberPageList();
          break;
        case "memberDetailPage":
          this.getMemberDetailPageList();
          break;
      }
    },
    //   enterStatisticalAnalysis(){//统计分析页
    //     this.staticalAnalysisShow=true;
    //     let params={
    //       startTime: this.startTime+' 00:00:00',
    //       endTime: this.endTime+' 23:59:59'
    //     }
    //     this.recodeSelectParams=params;
    //     this.getStatistData(params);
    //   },
    getStatistData(params) {
      this.loading = true;
      this.$axios
        .get(systemConfig.urls.agentReport.totalInfo, { params })
        .then((res) => {
          let arr = res.data.page;
          arr.map((val) => {
            switch (val.type) {
              case "1": {
                //支付宝
                val["icon"] = "alipay_icon";
                val["name"] = this.$t("支付宝");
                break;
              }
              case "2": {
                //微信
                val["icon"] = "wechat_icon";
                val["name"] = this.$t("微信");
                break;
              }
              case "3": {
                //网银支付
                val["icon"] = "internetBank_icon";
                val["name"] = this.$t("网银支付");
                break;
              }
              case "4": {
                //极速支付
                val["icon"] = "fast_icon";
                val["name"] = this.$t("极速支付");
                break;
              }
              case "5": {
                //其他支付
                val["icon"] = "other_icon";
                val["name"] = this.$t("其他支付");
                break;
              }
              case "6": {
                //加密货币
                val["icon"] = "crPay_icon";
                val["name"] = this.$t("加密货币");
                break;
              }
            }
          });
          this.loading = false;
          this.statisticalData = arr;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    nowBack() {
      //返回按钮
      this.staticalAnalysisShow = false;
      this.startTime = this.recodeSelectParams.startTime;
      this.endTime = this.recodeSelectParams.endTime;
      /* this.search('closeStatic'); */
    },
    handleExportDate(){
      this.recodeMoudle = 'tagencyListByDay'
      this.handleExport('date')
    },
    handleExport(type) {
      type==='date'?null:(this.isExporting = true);
      type==='date'?(this.isExportingDate = true):null;
      this.$axios
        .get(systemConfig.urls.agentReport.comReportExport, {
          params: {
            module: this.recodeMoudle,
            ...this.recodeParams,
            isCagency: type==='date'?0:null
          },
        })
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isExporting = false;
            this.isExportingDate = false;
          } else {
            this.checkExportFile();
          }
        });
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      this.$axios
        .get(systemConfig.urls.agentReport.checkFile, {
          params: {
            module: this.recodeMoudle,
          },
        })
        .then((res) => {
          const obj = res.data.data || {};
          const fileName = obj.fileName,
            downloadFileName = obj.downloadFileName;
          if (fileName) {
            const { baseURL } = res.config;
            // 下载文件
            let SToken = localStorage.getItem("SToken");
            window.open(
              baseURL +
                `/${systemConfig.urls.agentReport.downloadExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isExporting = false;
            this.isExportingAgent = false;
            this.isExportingDate = false;
            /* instance.close() */
          } else {
            window.setTimeout(this.checkExportFile, 1000);
          }
        });
    },
    handleChildAgent(row) {
      // this.snapshots
      const textArr = [this.$t("一"), this.$t("二"), this.$t("三"), this.$t("四"), this.$t("五")];
      const text = textArr[this.snapshots.length - 4] || "n";
      this.snapshots.push({
        ...row,
        returnPageFlag: "memberDetailPage",
        displayName: `${text} ${this.$t('级代理')} ${row.agyAccount}`,
      });
      this.setChildAgent();
    },
    setChildAgent() {
      this.resetPageNo();
      this.resetOrderBy();
      this.loading = true;
      this.pageFlag = "memberDetailPage";
      if (this.currentLevel > 0) {
        this.getMoneyTotalList();
        this.getSubordinateList();
      }
    },
  },
  watch: {
    pageFlag(n, o) {
    },
  },
};
</script>
<style lang="scss">
.mt50 {
  margin-top: 50px;
}

@media screen and (max-width: 1460px) {
  .game-data-sheet {
    .width180 {
      width: 150px !important;
      input {
        width: 150px !important;
      }
    }
  }
}

.caijin {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
  }
}
.totalMessageLeft {
  width: calc(100% - 270px);
  display: inline-block;
  margin-bottom: 10px;
}
.totalMessageright {
  position: relative;
  top: -105px;
  width: 250px;
  text-align: right;
  display: inline-block;
}
.gobackButon {
  display: block;
  position: inherit;
  margin: 10px 0;
  height: 32px;
  line-height: 32px;
  .bread {
    display: inline-block;
    /deep/ .el-breadcrumb__item {
      display: inline-block;
      line-height: 32px;
    }
  }
}
.totalMessageGoback,
.member-page-export {
  .export,
  .back {
    background-color: #469ad0 !important;
    color: #fff;
  }
}
.member-page-export {
  margin-bottom: 20px;
  line-height: 32px;
}
.statistics {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  .statistics-cell {
    position: relative;
    flex: 1;
    margin-right: 20px;
    height: 58px;
    background: #f0f3f9;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      background: #e6f0fa;
    }
    h3 {
      position: absolute;
      bottom: 8px;
      left: 10px;
    }
    .money {
      position: absolute;
      top: 10px;
      left: 10px;
      font-weight: bold;
      font-size: 16px;
    }
    .icon-wenhao {
      font-size: 14px;
      cursor: pointer;
    }
    .icon-5,
    .icon-wallet,
    .icon-hongli,
    .icon-paicai,
    .icon-caijin,
    .icon-yinli,
    .el-icon-sold-out {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #b5b4c2;
      font-size: 24px;
    }
  }
}
.tableToTop {
  position: absolute;
  right: 82px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
.staticAnalysis {
  position: relative;
  margin-top: 70px;
  .goback {
    width: 100px;
    position: absolute;
    right: 0;
    top: -37px;
    text-align: center;
    border: 1px solid black;
    height: 20px;
    line-height: 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  .eachOne {
    margin-top: 10px;
    font-weight: bolder;
    .up {
      padding-bottom: 10px;
      border-bottom: 1px solid rgb(220, 220, 220);
      line-height: 18px;
      height: 18px;
      margin-bottom: 10px;
      .l {
        float: left;
      }
      .r {
        float: right;
      }
    }
    ul {
      padding-left: 10px;
      margin-top: 15px;
      li {
        display: inline-block;
        min-width: 150px;
        height: 60px;
        background-color: #f2f3f8;
        border-radius: 5px;
        margin: 0 20px 10px 0;
        padding: 5px;
        box-sizing: border-box;
        p {
          height: 25px;
          line-height: 25px;
          color: #999999;
          text-align: center;
        }
        .p2 {
          color: #333333;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}
.summary {
  /deep/ .el-table {
    overflow-x: auto !important;
  }
  .el-table__header-wrapper,
  .el-table__body-wrapper,
  .el-table__footer-wrapper {
    overflow: visible !important;
  }
  .el-table::after {
    position: relative !important;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow: visible !important;
  }
}
.normalipt{font-size: 12px;}
.normalipt::-webkit-input-placeholder{font-size: 12px;color: #cacada;}
.normalipt::-moz-placeholder{   /* Mozilla Firefox 19+ */
  font-size: 12px;color: #cacada;}
.normalipt:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
  font-size: 12px;color: #cacada;}
.normalipt:-ms-input-placeholder{  /* Internet Explorer 10-11 */
  font-size: 12px;color: #cacada;}
  .red{color:red;}
  .red .el-form-item__label{color:red;}
  .mart15{margin-top: 15px;}
</style>
