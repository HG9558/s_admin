operateAnalyze/balanceRecord<template>
  <div class="game-data-sheet">
    <!--查询条件-->
    <div class="search">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            type="date"
            ref="searchTime"
            :width="420"
            :left="40"
            :selections="timeSelections"
            :startTime.sync="startTime"
            :endTime.sync="endTime"
            :default-type-p="defaultTypeP"
          />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <el-select v-model="agentType" :placeholder="$t('请选择')" @change="checkAccount">
            <el-option
              v-for="item in commonIds"
              :key="item.value"
              :label="item.value"
              :value="item.key">
            </el-option>
            <!-- agentType是2、3的时候可用于agyId参数查询正式和测试代理 -->
            <el-option :key="2" :label="$t('正式代理')" :value="2" />
            <el-option :key="3" :label="$t('测试代理')" :value="3" />
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="agentType === 1">
          <label for=""></label>
          <input type="text" v-model="agyAccount" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="!staticalAnalysisShow">
          <label>{{ $t('会员帐号') }}</label>
          <el-select v-model="accountId" :placeholder="$t('请选择')" @change="checkAgy">
            <el-option
              v-for="item in commonIds"
              :key="item.value"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="accountId===1">
          <label for=""></label>
          <input type="text" v-model="membername" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理会员') }}</label>
          <el-select v-model="agyMemberId" :placeholder="$t('请选择')" @change="checkAgyMember">
            <el-option
              v-for="item in agyMembers"
              :key="item.value"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="agyMemberId===1">
          <label for=""></label>
          <input type="text" v-model="agymembername" v-trim @keyup.enter="search()" />
        </div>
      </div>
      <div class="div-search-btn" style="top: 60%;transform: translateY(-50%)">
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
    <div v-else-if="!staticalAnalysisShow">
      <!--总展示-->
      <div v-show="pageFlag==='mainPage'" class="statistics">
      <div class="statistics-cell">
        <span class="iconfont icon-yinli"></span>
        <span class="money" :class="[allTotal.totalProfit > 0 ? 'green': (allTotal.totalProfit < 0 ? 'red' : '')]">{{toThousands(allTotal.totalProfit)}}</span>
        <!-- content="公司净盈利 = -总盈亏 - 总红利 - 任务返利 - 总返利" -->
        <h3>{{ $t('净盈利') }}<el-tooltip class="item" effect="dark" :content="$t('公司净盈利') + '=' + ' -' + $t('总盈亏') + ' - ' + $t('总红利') + ' - ' + $t('任务返利') + ' - ' + $t('总返利')" placement="bottom">
          <span class="iconfont icon-wenhao"></span>
        </el-tooltip>
        </h3>
      </div>
      <div  v-if="permissions.save" class="statistics-cell" style="cursor:pointer;" @click="enterStatisticalAnalysis">
        <span class="iconfont icon-5"></span>
        <span class="money" :class="[allTotal.totalDepositBalance > 0 ? 'green': (allTotal.totalDepositBalance < 0 ? 'red' : '')]">{{toThousands(allTotal.totalDepositBalance)}}</span>
        <h3>{{ $t('总存款') }}</h3>
      </div>
      <div v-else class="statistics-cell">
        <span class="iconfont icon-5"></span>
        <span class="money" :class="[allTotal.totalDepositBalance > 0 ? 'green': (allTotal.totalDepositBalance < 0 ? 'red' : '')]">{{toThousands(allTotal.totalDepositBalance)}}</span>
        <h3>{{ $t('总存款') }}</h3>
      </div>
      <!-- <div class="statistics-cell" @click="toMemberWithdraw" style="cursor:pointer;"> -->
      <div class="statistics-cell">
        <span class="iconfont icon-wallet"></span>
        <span class="money" :class="[allTotal.totalDrawAmount > 0 ? 'green': (allTotal.totalDrawAmount < 0 ? 'red' : '')]">{{toThousands(allTotal.totalDrawAmount)}}</span>
        <h3 >{{ $t('总提款') }}</h3>
      </div>
      <div class="statistics-cell">
        <span class="iconfont icon-hongli"></span>
        <span class="money" :class="[allTotal.totalBonusAmountOnline > 0 ? 'green': (allTotal.totalBonusAmountOnline < 0 ? 'red' : '')]">{{toThousands(allTotal.totalBonusAmountOnline)}}</span>
        <h3>{{ $t('线上红利') }}</h3>
      </div>
      <div class="statistics-cell">
        <span class="iconfont icon-hongli"></span>
        <span class="money" :class="[allTotal.totalBonusAmountOffline > 0 ? 'green': (allTotal.totalBonusAmountOffline < 0 ? 'red' : '')]">{{toThousands(allTotal.totalBonusAmountOffline)}}</span>
        <h3>{{ $t('线下红利') }}</h3>
      </div>
      <div class="statistics-cell">
        <span class="iconfont icon-hongli"></span>
        <span class="money" :class="[allTotal.totalBonusAmount > 0 ? 'green': (allTotal.totalBonusAmount < 0 ? 'red' : '')]">{{toThousands(allTotal.totalBonusAmount)}}</span>
        <h3>{{ $t('总红利') }}</h3>
      </div>
      <div class="statistics-cell">
        <span class="el-icon-sold-out"></span>
        <span class="money" :class="[allTotal.totalRebate > 0 ? 'green': (allTotal.totalRebate < 0 ? 'red' : '')]">{{toThousands(allTotal.totalRebate)}}</span>
        <h3>{{ $t('总返利') }}</h3>
      </div>
      <!-- <div class="statistics-cell"  @click="toLoseWinSheet" style="cursor:pointer;"> -->
      <div class="statistics-cell">
        <span class="iconfont icon-paicai"></span>
        <span class="money" :class="[allTotal.totalPayout > 0 ? 'green': (allTotal.totalPayout < 0 ? 'red' : '')]">{{toThousands(allTotal.totalPayout)}}</span>
        <h3>{{ $t('总盈亏') }}<el-tooltip class="item" effect="dark" :content="$t('玩家派彩') + '：' + $t('负数公司赢') + '，' + $t('正数玩家赢')" placement="bottom">
          <span class="iconfont icon-wenhao"></span>
        </el-tooltip>
        </h3>
      </div>
      <div class="statistics-cell">
        <span class="iconfont icon-paicai"></span>
        <span class="money" :class="[allTotal.totalTaskBonus > 0 ? 'green': (allTotal.totalTaskBonus < 0 ? 'red' : '')]">{{toThousands(allTotal.totalTaskBonus)}}</span>
        <h3>{{ $t('总任务返利') }}<el-tooltip class="item" effect="dark" content="" placement="bottom">
          <!-- <span class="iconfont icon-wenhao"></span> -->
        </el-tooltip>
        </h3>
      </div>
      <div class="statistics-cell">
        <span class="iconfont icon-caijin"></span>
        <span class="money" :class="[allTotal.totalJackpotPayout > 0 ? 'green': (allTotal.totalJackpotPayout < 0 ? 'red' : '')]">{{toThousands(allTotal.totalJackpotPayout)}}</span>
        <!-- content="公司净盈利 = -盈亏 - 红利" -->
        <h3>{{ $t('奖池彩金') }}<el-tooltip v-show="allTotal.totalJackpotPayout!==0" class="item" effect="dark" :content="$t('公司净盈利') + '=' + ' -' + $t('盈亏') + ' - ' + $t('红利')" placement="bottom">
          <div slot="content">
            <div class="caijin">
              <span>{{ $t('平台') }}</span>
              <span>{{ $t('彩金') }}</span>
            </div>
            <div class="caijin" v-for="(item, index) in gridData" :key="index">
              <span>{{item.platform}}</span>
              <span>{{item.totalJackpotPayout}}</span>
            </div>
          </div>
          <span class="iconfont icon-wenhao"></span>
        </el-tooltip>
        </h3>
      </div>
      </div>
      <!--导出按钮  其他一些展示内容-->
      <div class="row items-center" style="padding: 20px 0;">
        <Snapshots
          v-model="snapshots"
          displayKey="displayName"
          @change="handleSnapshotsChange"
        />

        <span v-show="pageFlag==='mainPage'" style="line-height: 50px;color: #409EFF;">{{ $t('提示：按日期查询，若某天没有资金流水记录将不显示') }}</span>

        <div style="flex: 1;"></div>

        <el-button
          v-show="currentLevel > 2"
          class="iconfont icon-export el-button-export"
          @click="closeBtn"
        >
          {{ $t('返回首页') }}
        </el-button>
        <el-button v-if="!permissions.export && isNowDowning" type="primary" :disabled="!tableData.totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{ $t('导出') }}
        </el-button>
        <el-button v-else-if="!permissions.export && !isNowDowning" type="primary" class="iconfont icon-export el-button-export" size="mini">{{ $t('导出中') }}...
        </el-button>
        <!-- <el-button v-show="pageFlag!=='mainPage'" class="iconfont icon-export el-button-export" @click="returnBtn">返回</el-button> -->
        <!-- <el-button v-show="mainPage" class="iconfont icon-export el-button-export">导出</el-button> -->
      </div>
      <div class="search-form" v-show="pageFlag==='mainPage'">
        <el-table
          :data="tableData.list"
          border
          style="width: 100%"
          @sort-change="handleSortChange($event,'mainPage')">
          <el-table-column :label="$t('日期')" align="center" sortable='custom' prop="createTime">
            <template slot-scope="scope">
              <el-button @click="showTimePage(scope.row.createTime)" type="text" size="small">{{filterTime(scope.row.createTime)}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalProfit"
            :label="$t('净盈利')"
            sortable='custom'
            >
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalDepositBalance"
            :label="$t('总存款')"
            sortable='custom'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="friendsTransAmountTotal"
            :label="$t('总好友转帐出款')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="friendsRecepitAmountTotal"
            :label="$t('总好友转帐入款')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="fundAdjust"
            :label="$t('资金调整')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalDrawAmount"
            :label="$t('总提款')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalBonusAmountOnline"
            :label="$t('线上红利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalBonusAmountOffline"
            :label="$t('线下红利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalActualReward"
            :label="$t('好友返利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalBonusAmount"
            :label="$t('总红利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalHuPengReward"
            :label="$t('呼朋唤友')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalRebate"
            :label="$t('总返利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalPayout"
            :label="$t('总盈亏')"
            sortable='custom'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalTaskBonus"
            :label="$t('总任务返利')">
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalJackpotPayout"
            :label="$t('奖池派彩')">
          </el-table-column>
        </el-table>
      </div>
      <div class="search-form" v-show="pageFlag==='timePage'">
        <el-table
          :data="tableData.list"
          border
          style="width: 100%"
          @sort-change="handleSortChange($event,'timePage')"
          >
          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount===$t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount}}</span>
              <el-button v-else @click="handleTopAgentClick(scope.row)" type="text" size="small">
                {{scope.row.agyAccount}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId"/>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalProfit"
            :label="$t('净盈利')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDepositBalance"
            :label="$t('总存款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsTransAmountTotal"
            :label="$t('好友转帐出款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsRecepitAmountTotal"
            :label="$t('好友转帐入款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="fundAdjust"
            :label="$t('资金调整')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDrawAmount"
            :label="$t('提款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOnline"
            :label="$t('线上红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOffline"
            :label="$t('线下红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmount"
            :label="$t('总红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalRebate"
            :label="$t('总返利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalPayout"
            :label="$t('盈亏')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalTaskBonus"
            :label="$t('总任务返利')">
          </el-table-column>
          <el-table-column
            prop="totalJackpotPayout"
            :label="$t('奖池派彩')"
            align='center'>
          </el-table-column>
        </el-table>
      </div>
      <div class="search-form" v-show="pageFlag==='agyDetailPage'">
        <el-table
          :data="tableData.list"
          border
          style="width: 100%"
          @sort-change="handleSortChange($event,'agyDetailPage')">
          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount===$t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount}}</span>
              <el-button v-else @click="handleAgentClick(scope.row)" type="text" size="small">
                {{scope.row.agyAccount}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId"/>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalProfit"
            :label="$t('净盈利')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDepositBalance"
            :label="$t('存款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsTransAmountTotal"
            :label="$t('好友转帐出款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsRecepitAmountTotal"
            :label="$t('好友转帐入款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="fundAdjust"
            :label="$t('资金调整')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDrawAmount"
            :label="$t('提款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOnline"
            :label="$t('线上红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOffline"
            :label="$t('线下红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmount"
            :label="$t('总红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalRebate"
            :label="$t('总返利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalPayout"
            :label="$t('盈亏')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalTaskBonus"
            :label="$t('总任务返利')">
          </el-table-column>
          <el-table-column
            prop="totalJackpotPayout"
            :label="$t('奖池派彩')"
            align='center'>
          </el-table-column>
        </el-table>
      </div>
      <div class="search-form" v-show="pageFlag==='memberPage'">
        <template v-if="currentLevel > 0">
          <el-table
            stripe
            border
            show-summary
            :sum-text="$t('总计')"
            :data="viewTableData"
            style="margin-bottom: 20px;"
          >
            <el-table-column :label="$t('视图')" align="center">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  size="small"
                  :disabled="isSubAgentShow ? row.agyAccount === $t('下级代理') : row.agyAccount === $t('直属会员')"
                  @click="showMemberPage(row.agyAccount === $t('下级代理'))"
                >
                  {{ row.agyAccount }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="totalProfit"
              :label="$t('净盈利')"
              sortable='custom'
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalDepositBalance"
              :label="$t('存款')"
              sortable='custom'
              align='center'>
            </el-table-column>
            <el-table-column
              prop="friendsTransAmountTotal"
              :label="$t('好友转帐出款')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="friendsRecepitAmountTotal"
              :label="$t('好友转帐入款')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="fundAdjust"
              :label="$t('资金调整')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalDrawAmount"
              :label="$t('提款')"
              sortable='custom'
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalBonusAmountOnline"
              :label="$t('线上红利')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalBonusAmountOffline"
              :label="$t('线下红利')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalActualReward"
              :label="$t('好友返利')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalBonusAmount"
              :label="$t('总红利')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalRebate"
              :label="$t('总返利')"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="totalPayout"
              :label="$t('盈亏')"
              sortable='custom'
              align='center'>
            </el-table-column>
            <el-table-column
              align='center'
              prop="totalTaskBonus"
              :label="$t('总任务返利')">
            </el-table-column>
            <el-table-column
              prop="totalJackpotPayout"
              :label="$t('奖池派彩')"
              align='center'>
            </el-table-column>
          </el-table>

          <h3 style="margin-bottom: 20px;">{{ isSubAgentShow ? $t('下级代理') : $t('直属会员') }}</h3>
        </template>

        <el-table
          v-if="isSubAgentShow"
          :data="tableData.list"
          border
          style="width: 100%"
          @sort-change="handleSortChange($event,'agyDetailPage')">
          <el-table-column :label="$t('代理')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.agyAccount===$t('小计') || scope.row.agyAccount===$t('总计')">{{scope.row.agyAccount}}</span>
              <el-button v-else @click="handleAgentClick(scope.row)" type="text" size="small">
                {{scope.row.agyAccount}}
                <GlobalComponentTestLabel :id="scope.row.agyId" :parentId="scope.row.parentId"/>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalProfit"
            :label="$t('净盈利')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDepositBalance"
            :label="$t('存款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsTransAmountTotal"
            :label="$t('好友转帐出款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsRecepitAmountTotal"
            :label="$t('好友转帐入款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="fundAdjust"
            :label="$t('资金调整')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDrawAmount"
            :label="$t('提款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOnline"
            :label="$t('线上红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOffline"
            :label="$t('线下红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmount"
            :label="$t('总红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalRebate"
            :label="$t('总返利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalPayout"
            :label="$t('盈亏')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalTaskBonus"
            :label="$t('总任务返利')">
          </el-table-column>
          <el-table-column
            prop="totalJackpotPayout"
            :label="$t('奖池派彩')"
            align='center'>
          </el-table-column>
        </el-table>
        <el-table
          v-else
          :data="tableData.list"
          border
          style="width: 100%"
          @sort-change="handleSortChange($event,'memberPage')">
          <el-table-column
            align="center"
            :label="$t('会员名')">
            <template slot-scope="scope">
              <span v-if="scope.row.loginName===$t('小计') || scope.row.loginName===$t('总计')">{{scope.row.loginName}}</span>
              <el-button v-else @click="handleMemberClick(scope.row)" type="text" size="small">{{scope.row.loginName}}
              </el-button>
              <GlobalComponentTestLabel :id="scope.row.tagencyId"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalProfit"
            :label="$t('净盈利')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDepositBalance"
            :label="$t('存款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsTransAmountTotal"
            :label="$t('好友转帐出款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="friendsRecepitAmountTotal"
            :label="$t('好友转帐入款')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="fundAdjust"
            :label="$t('资金调整')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalDrawAmount"
            :label="$t('提款')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOnline"
            :label="$t('线上红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmountOffline"
            :label="$t('线下红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalBonusAmount"
            :label="$t('总红利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalRebate"
            :label="$t('总返利')"
            align='center'>
          </el-table-column>
          <el-table-column
            prop="totalPayout"
            :label="$t('盈亏')"
            sortable='custom'
            align='center'>
          </el-table-column>
          <el-table-column
            align='center'
            prop="totalTaskBonus"
            :label="$t('总任务返利')">
          </el-table-column>
          <el-table-column
            prop="totalJackpotPayout"
            :label="$t('奖池派彩')"
            align='center'>
          </el-table-column>
        </el-table>
      </div>
      <div class="search-form" v-show="pageFlag==='memberDetailPage'">
        <el-table border :data="memberSelf">
          <el-table-column v-for="(item, i) in memberSelfColumn" :key="i" align="center" v-bind="item">
            <template slot-scope="scope">
              <div v-if="item.prop === 'detail'">
                <el-button type="text" @click="handleViewDetail(scope.row)">{{ $t('查看详情') }}</el-button>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-table border :data="memberSelfView" class="member-top" :show-summary="true">
          <el-table-column v-for="(item, i) in memberSelfViewColumn" :key="i" align="center" v-bind="item">
            <template slot-scope="scope">
              <div v-if="item.prop === 'agyAccount'">
                <el-button type="text" :disabled="selfBtnIndex === scope.$index" @click="handleSlefBtnClick(scope)">{{scope.row[item.prop]}}</el-button>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="member-top" style="margin-bottom: 20px;">
          <h3 slot="header">{{selfBtnIndex === 0 ? $t('代理会员') : $t('会员')}}</h3>
        </div>
        <el-table border :data="memberNext" v-loading="memberNextLoading">
          <el-table-column v-for="(item, i) in memberNextColumn" :key="i" align="center" v-bind="item">
            <template slot-scope="scope">
              <div v-if="item.prop === 'detail'">
                <el-button type="text" @click="handleViewDetail(scope.row)">{{ $t('查看详情') }}</el-button>
              </div>
              <div v-else-if="item.prop === 'loginName'">
                <el-button type="text" @click="handleNextBtnClick(scope.row)">{{scope.row[item.prop]}}</el-button>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--公共的下面的分页-->
      <div class="pagination" style="margin-bottom: 20px" v-show="!loading">
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
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    </div>
    <el-dialog :visible.sync="showViewDetail" :title="viewDetailTitle">
      <el-table border :data="memberSelfDetail" v-loading ="viewDetail.loading">
        <el-table-column v-for="(item, i) in memberSelfDetailColumn" :key="i" align="center" v-bind="item">
          <template slot-scope="scope">
            <div>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="margin-top: 20px">
        <el-pagination
          background
          @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange"
          :current-page.sync="viewDetail.pageNo"
          :page-size.sync="viewDetail.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="viewDetail.totalCount">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'
  import queryStore from '../../mixins/queryStore'
  import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
  import { mapGetters } from 'vuex'
  import fileExport from "../../mixins/fileExport";
  import moment from "moment";
  import Mixin from '@/mixins/loadTime'
  import site from '@/mixins/site'

  export default {
    name: 'moneySheet',
    mixins: [site, fileExport, Mixin, queryStore(['startTime', 'endTime', 'agentType', 'agyAccount', 'accountId', 'membername'])],
    components: {StartAndEndTimeSelector},
    data() {
      return {
        isNowDowning: true, //文件导出
        timeSelections: [
          {
            label: this.$t('今日'),
            value: 'today'
          },
          {
            label: this.$t('昨日'),
            value: 'yesterday'
          },
          {
            label: this.$t('本周'),
            value: 'currentWeek'
          },
          {
            label: this.$t('上周'),
            value: 'lastWeek'
          },
          {
            label: this.$t('本月'),
            value: 'currentMonth'
          }
        ],
        startTime: moment().format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD"),
        defaultTypeP: 'today',
        innerTableData: {},
        tableData: {},
        pageFlag: 'mainPage',
        gridData: [],
        allTotal: {},
        agyAccount: '',
        membername: '',
        agymembername: '',
        agentType: '',
        accountId: '',
        agyMemberId: '',
        commonIds: [{key: 0, value: this.$t('全选')}, {key: 1, value: this.$t('精确查询')}],
        agyMembers: [{key: 0, value: this.$t('全选')}, {key: 1, value: this.$t('精确查询')}],
        listReqInner: {
          pageSize: 15,
          pageNo: 1,
          pageSizeArr: [ 5, 10, 15, 20, 50, 100]
        },
        saveStartTime:'',//保存当前开始时间
        saveEndTime:'',
        orderBy:'',//升降序字段
        staticalAnalysisShow:false,//统计分析页是否展示
        statisticalData:{},
        recodeSelectParams:{},
        loading:false,
        snapshots: [],
        viewTableData: [],
        memberSelf: [],
        memberSelfView: [],
        memberSelfDetail: [],
        memberNext: [],
        memberSelfColumn: [
          { label: this.$t('会员名'), prop: 'loginName' },
          { label: this.$t('净盈利'), prop: 'totalProfit' },
          { label: this.$t('存款'), prop: 'totalDepositBalance' },
          { label: this.$t('好友转账出款'), prop: 'friendsTransAmountTotal' },
          { label: this.$t('好友转账入款'), prop: 'friendsRecepitAmountTotal' },
          { label: this.$t('资金调整'), prop: 'fundAdjust' },
          { label: this.$t('提款'), prop: 'totalDrawAmount' },
          { label: this.$t('线上红利'), prop: 'totalBonusAmountOnline' },
          { label: this.$t('线下红利'), prop: 'totalBonusAmountOffline' },
          { label: this.$t('好友返利'), prop: 'totalActualReward' },
          { label: this.$t('总红利'), prop: 'totalBonusAmount' },
          { label: this.$t('呼朋唤友'), prop: 'totalHuPengReward' },
          { label: this.$t('总返利'), prop: 'totalRebate' },
          { label: this.$t('总任务返利'), prop: 'totalTaskBonus' },
          { label: this.$t('奖池派奖'), prop: 'totalJackpotPayout' },
          { label: this.$t('详情'), prop: 'detail' },
        ],
        memberSelfViewColumn: [
          { label: this.$t('视图'), prop: 'agyAccount' },
          { label: this.$t('净盈利'), prop: 'totalProfit' },
          { label: this.$t('存款'), prop: 'totalDepositBalance' },
          { label: this.$t('好友转账出款'), prop: 'friendsTransAmountTotal' },
          { label: this.$t('好友转账入款'), prop: 'friendsRecepitAmountTotal' },
          { label: this.$t('资金调整'), prop: 'fundAdjust' },
          { label: this.$t('提款'), prop: 'totalDrawAmount' },
          { label: this.$t('线上红利'), prop: 'totalBonusAmountOnline' },
          { label: this.$t('线下红利'), prop: 'totalBonusAmountOffline' },
          { label: this.$t('好友返利'), prop: 'totalActualReward' },
          { label: this.$t('总红利'), prop: 'totalBonusAmount' },
          { label: this.$t('总返利'), prop: 'totalRebate' },
          { label: this.$t('总任务返利'), prop: 'totalTaskBonus' },
          { label: this.$t('奖池派奖'), prop: 'totalJackpotPayout' },
        ],
        memberSelfDetailColumn: [
          { label: this.$t('时间'), prop: 'createTime' },
          { label: this.$t('净盈利'), prop: 'totalProfit' },
          { label: this.$t('存款'), prop: 'totalDepositBalance' },
          { label: this.$t('好友转账出款'), prop: 'friendsTransAmountTotal' },
          { label: this.$t('好友转账入款'), prop: 'friendsRecepitAmountTotal' },
          { label: this.$t('资金调整'), prop: 'fundAdjust' },
          { label: this.$t('提款'), prop: 'totalDrawAmount' },
          { label: this.$t('线上红利'), prop: 'totalBonusAmountOnline' },
          { label: this.$t('线下红利'), prop: 'totalBonusAmountOffline' },
          { label: this.$t('好友返利'), prop: 'totalActualReward' },
          { label: this.$t('总红利'), prop: 'totalBonusAmount' },
          { label: this.$t('总返利'), prop: 'totalRebate' },
          { label: this.$t('总任务返利'), prop: 'totalTaskBonus' },
          { label: this.$t('奖池派奖'), prop: 'totalJackpotPayout' },
        ],
        memberNextColumn: [
          { label: this.$t('会员名'), prop: 'loginName' },
          { label: this.$t('净盈利'), prop: 'totalProfit' },
          { label: this.$t('存款'), prop: 'totalDepositBalance' },
          { label: this.$t('好友转账出款'), prop: 'friendsTransAmountTotal' },
          { label: this.$t('好友转账入款'), prop: 'friendsRecepitAmountTotal' },
          { label: this.$t('资金调整'), prop: 'fundAdjust' },
          { label: this.$t('提款'), prop: 'totalDrawAmount' },
          { label: this.$t('线上红利'), prop: 'totalBonusAmountOnline' },
          { label: this.$t('线下红利'), prop: 'totalBonusAmountOffline' },
          { label: this.$t('总红利'), prop: 'totalBonusAmount' },
          { label: this.$t('总返利'), prop: 'totalRebate' },
          { label: this.$t('总任务返利'), prop: 'totalTaskBonus' },
          { label: this.$t('奖池派奖'), prop: 'totalJackpotPayout' },
          { label: this.$t('详情'), prop: 'detail' },
        ],
        isSubAgentShow: true,
        showViewDetail: false,
        memberNextLoading: false,
        viewDetailTitle: this.$t('详情数据'),
        viewDetail: {
          loading: false,
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        },
        selfBtnIndex: 0,
        recodeMoudle: ''
      }
    },
    created(){
      this.search()
    },
    mounted () {
    },
    computed: {
      useQueryStoreCache() {
        return this.$route.query.useQueryStoreCache === 'yes'
      },
      listReq() {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [10, 100, 300, 500, 1000]
        }
      },
      timeType: {
        get: function () {
          return this.$store.state.timeType
        },
        set: function () {
        }
      },
      permissions() {
        const { hasPermission } = this
        return {
          save: hasPermission('fund:onLine:depositStatisticByPay')
        }
      },
      currentLayer() {
        return this.snapshots.slice(-1)[0]
      },
      currentLevel() {
        // 当前在第几层
        return this.snapshots.length
      },
      ...mapGetters(['hasPermission'])
    },
    methods: {
      handleExport() {
        let tempUrl = ''
        this.isNowDowning = false;
        const params = {
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo,
          startTime: `${this.startTime} 00:00:00`,
          endTime: `${this.endTime} 23:59:59`,
          orderBy: this.orderBy,
        }
        if(this.startTime&&this.endTime&&(!this.agentType&&this.agentType!==0)&&(!this.accountId&&this.accountId!==0)&&(!this.agyMemberId&&this.agyMemberId!==0)){
          this.recodeMoudle = 'exportList'
          tempUrl = 'exportList'
        }else if((this.agentType||this.agentType===0)&&(!this.accountId&&this.accountId!==0)&&(!this.agyMemberId&&this.agyMemberId!==0)){
          this.snapshots = [
            {
              agyId: this.agentType, // agentType是2、3的时候可用于agyId参数查询正式和测试代理
              displayName: this.$t('总代'),
              returnPageFlag: 'agyDetailPage',
            }
          ]
          this.recodeMoudle = 'exportTagencyList'
          tempUrl = 'exportTagencyList'
          params.isCagency = 0
          params.agyId = this.agentType > 1 ? this.currentLayer.agyId : ''
          params.isTest = this.agentType > 1 ? isTest : null
        }else if(!this.agentType&&this.agentType!==0){
          this.recodeMoudle = 'agentSubMbrList'
          tempUrl = 'exportAgentSubMbrList'
          if(this.accountId===0||this.agyMemberId===0){
            params.isMbrAgyQry = this.agyMemberId !== '' ? 1 : 0
            params.loginName = this.agyMemberId === 1 ? this.agymembername : this.membername
            params.agyId = this.currentLayer && this.currentLayer.agyId
          }else if(this.accountId===1){
            this.getBannerList('mbr', this.membername)
              .then((bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    loginName: this.membername,
                    displayName: this.$t('会员') + this.membername,
                  },
                ]
                this.showMemberDetailPage()
              })
          }else if(this.agyMemberId===1){
            this.getBannerList('mbr', this.agymembername)
              .then((bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    loginName: this.agymembername,
                    returnPageFlag: 'memberDetailPage',
                    displayName: this.$t('代理会员') + this.agymembername,
                  },
                ]
                this.showMemberDetailPage()
              })
          }
        }
        this.$axios
          .get(systemConfig.urls.exportMoneySheet + tempUrl,
            {params:params})
          .then((res) => {
            let isDownBool = res.data.code;
            if (isDownBool) {
              this.$message({
                type: "warning",
                message: isDownBool,
              });
              this.isNowDowning = true;
            } else {
              this.agentCheckFile(this.recodeMoudle,systemConfig.urls.moneySheetCheckFile);
            }
          })
          .finally(() => {
            this.isNowDowning = true;
          });
      },
      checkAgyMember() {
        this.agentType = ''
        this.accountId = ''
      },
      checkAgy (val) {
        this.agentType = ''
        this.agyMemberId = ''
      },
      handleDetailSizeChange(val) {
        this.viewDetail.pageSize = val
        this.viewDetail.pageNo = 1
        this.getMoneyMainPage()
      },
      handleDetailCurrentChange(val) {
        this.viewDetail.pageNo = val
        this.getMoneyMainPage()
      },
      checkAccount (val) {
        this.agyAccount = ''
        this.accountId = ''
        this.agyMemberId = ''
        // switch(val) {
        //   case 1:
        //     this.agyAccount = ''
        //     break
        //   case 2:
        //     this.agyAccount = 'GeneralAgent'
        //     break
        //   case 3:
        //     this.agyAccount = 'TestAgent'
        //     break
        // }
      },
      getLoginName() {
        const len = this.snapshots.length
        const obj = this.snapshots[len - 1]
        return obj ? obj.loginName : ''
      },
      handleViewDetail(row) {
        const { loginName } = row
        this.showViewDetail = true
        this.viewDetailTitle = loginName + this.$t('详情数据')
        this.getMoneyMainPage(loginName)
      },
      handleNextBtnClick(row) {
        this.snapshots.push({
          ...row,
          returnPageFlag: 'memberDetailPage',
          displayName: this.$t('会员') + row.loginName
        })
        this.getMemberDetailPageList()
      },
      handleSlefBtnClick(scope) {
        const { $index } = scope
        this.selfBtnIndex = $index
        this.getMbrSubMbrList()
      },
      async getMbrSubMbrList() {
        const loginName = this.getLoginName()
        const { pageSize, pageNo } = this.listReq
        const params = {
          startTime: `${this.startTime} 00:00:00`,
          endTime: `${this.endTime} 23:59:59`,
          pageSize,
          pageNo,
          isMbrAgyQry: this.selfBtnIndex === 0 ? 1 : 0,
          loginName
        }
        this.memberNextLoading = true
        const { res } = await this.$axios.GET(systemConfig.urls.mbrSubMbrList, params)
        this.memberNextLoading = false
        if (res) {
          const { list, totalCount } = res.data
          this.memberNext = list
          this.tableData.totalCount = totalCount
        }
      },
      async getTotalInfoMbrSelf() {
        const loginName = this.getLoginName()
        const params = {
          startTime: `${this.startTime} 00:00:00`,
          endTime: `${this.endTime} 23:59:59`,
          loginName
        }
        const { res } = await this.$axios.GET(systemConfig.urls.totalInfoMbrSelf, params)
        if (res) {
          const { data } = res
          const obj = {}
          this.memberSelfColumn.forEach(i => obj[i.prop] = data[i.prop] || 0)
          obj.loginName = loginName
          this.memberSelf = [ obj ]
        }
      },
      filterTime (time) {
        if (!time) {
          return
        }
        if (!time.length===8) {
          return
        }
        let str1 = time.substr(0, 4)
        let str2 = time.substr(4, 2)
        let str3 = time.substr(6, 2)
        return str1 + '/' + str2 + '/' + str3
      },
      handleSizeChange (val) {
        this.listReq.pageNo = 1
        this.listReq.pageSize = val
        this.switchChange()
      },
      handleCurrentChange (val) {
        this.listReq.pageNo = val
        this.switchChange()
      },
      switchChange () {
        switch (this.pageFlag) {
          case 'mainPage':
            this.getMainPageList()
            break
          case 'timePage':
            this.getTimePageList()
            break
          case 'agyDetailPage':
            this.getAgyDetailPageList()
            break
          case 'memberPage':
            // this.getMemberPageList()
            this.isSubAgentShow ? this.getAgyDetailPageList() : this.getMemberPageList()
            break
          case 'memberDetailPage':
            this.getMemberDetailPageList()
            break
        }
      },
      // 总代的会员
      handleSizeInnerChange (val) {
        this.listReqInner.pageNo = 1
        this.listReqInner.pageSize = val
        this.getAgyDetailMemberPageList()
        // this.showAgyDetailPage()
      },
      handleCurrentInnerChange (val) {
        this.listReqInner.pageNo = val
        this.getAgyDetailMemberPageList()
        // this.showAgyDetailPage()
      },
      toThousands (money) {
        return systemConfig.toThousands(money)
      },
      getStatistic () {
        // 统计数据
        this.$axios.get(systemConfig.urls.findAll, {
          params: {
            startTime: this.startTime + ' 00:00:00',
            endTime: this.endTime + ' 23:59:59'
          }
        }).then((resp) => {
          this.allTotal = resp.data.info
        })
        // 平台数据
        this.$axios.get(systemConfig.urls.allDepot, {
          params: {
            startTime: this.startTime + ' 00:00:00',
            endTime: this.endTime + ' 23:59:59'
          }
        }).then((resp) => {
          this.gridData = resp.data.page
        })
      },
      reset () {
        this.startTime = ''
        this.endTime = ''
        this.defaultTypeP = ''
        this.$refs.searchTime.defaultType = ''
        this.membername = ''
        this.agyAccount = ''
        this.agentType = ''
        this.accountId = ''
        this.resetOrderBy()
        this.btsSmId = 10
        this.tableData={}
        //this.oldTableList=[];
        this.staticalAnalysisShow=false;
        this.statisticalData={}
        this.loading=false
      },
      search(){
        this.snapshots = []
        this.statisticalData={}
        this.getCurrentRecodeTime()
        /* this.enterNum=0; */
        if(!this.startTime || !this.endTime){
          this.$message({
            type: 'warning',
            message: this.$t('请输入完整的时间段')
          })
          this.tableData={};
          return
        }
        if (this.startTime && this.endTime) {
          if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
            this.$message({
              type: 'warning',
              message: this.$t('投注起始时间不能大于结束时间')
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
        if(this.staticalAnalysisShow){
          let params={
            startTime: this.startTime+' 00:00:00',
            endTime: this.endTime+ ' 23:59:59',
            isTest:this.agentType==2 ? 0 : (this.agentType ==3 ? 1 : ''),
            agyAccountStr:this.agentType==1?this.agyAccount:''
          }
          this.getStatistData(params);
          return
        }
        this.loading=true;
        this.resetPagenation()
        this.resetInnerPagenation()
        const { agentType } = this
        if (agentType === 1) {
          // 先判断精确查找的是总代还是次代
          if (!this.agyAccount) {
            this.$message({
              type: 'warning',
              message: this.$t('请输入代理账号')
            })
            this.loading=false;
            return
          }
          this.$axios.get(systemConfig.urls.judgeTagency + '?agyAccount=' + this.agyAccount).then(({ data }) => {// 先判断子代还是总代
            const { id, parentId } = data.info

            this.getBannerList('agent', this.agyAccount)
              .then((bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    agyId: id,
                    parentId,
                    displayName: `${parentId ? this.$t('代理') : this.$t('总代')}${this.agyAccount}`,
                    returnPageFlag: parentId ? 'memberDetailPage' : 'agyDetailPage',
                  },
                ]
                // parentId是判断跳转总代页面还是自代页面  再根据id去获取table数据  isisCagency传0
                this.loading=false;
                if (parentId === 0) {
                  this.showAgyDetailPage('', id)
                } else {
                  this.showMemberPage()
                }
              })
          })
          .catch(err=>{
            this.loading=false;
            this.$message.error(err.data.msg)
          })
        } else if (agentType === 0 || agentType) {
          // 查询该段时间所有总代/测试代理/正式代理
          this.showTimePage('', agentType)
        } else if (this.accountId === 0 || this.accountId === 1 || this.agyMemberId === 0 || this.agyMemberId === 1) {
          if (this.accountId === 1) {
            if (!this.membername) {
              this.$message({
                type: 'warning',
                message: this.$t('请输入会员账号')
              })
              this.loading=false
              return
            }
            this.getBannerList('mbr', this.membername)
              .then((bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    loginName: this.membername,
                    displayName: `${this.$t('会员')}${this.membername}`,
                  },
                ]
                this.showMemberDetailPage()
              })
          } else if (this.agyMemberId === 1) {
            if (!this.agymembername) {
              this.$message({
                type: 'warning',
                message: this.$t('请输入代理会员账号')
              })
              this.loading=false
              return
            }
            this.getBannerList('mbr', this.agymembername)
              .then((bannerList) => {
                this.snapshots = [
                  ...bannerList,
                  {
                    loginName: this.agymembername,
                    returnPageFlag: 'memberDetailPage',
                    displayName: `${this.$t('代理会员')}${this.agymembername}`,
                  },
                ]
                this.showMemberDetailPage()
              })
          } else {
            this.showMemberPage(false)
          }
        } else {
          // 进入首页
          this.showMainPage()
        }
      },
      getBannerList(searchType, searchName) {
        return this.$axios
          .get(
            searchType === 'agent'
              ? systemConfig.urls.getAgentBanner
              : systemConfig.urls.getMbrBanner
            ,
            {
              params: {
                [searchType === 'agent' ? 'agyAccount' : 'loginName']: searchName,
              },
            },
          )
          .then(({ data }) => {
            const bannerList = data.data.filter(({ bannerType }) => bannerType === 'agent')

            return [
              {
                agyId: undefined,
                displayName: this.$t('总代'),
                returnPageFlag: 'agyDetailPage',
              },
              ...bannerList.map(({ bannerType, id, parentId, agyAccount }) => {
                return {
                  parentId,
                  agyId: id,
                  agyAccount,
                  loginName: agyAccount, // 会员名也在agyAccount返回
                  displayName: `${
                    bannerType === 'mbr'
                      ? this.$t('会员')
                      : parentId
                          ? this.$t('代理')
                          : this.$t('总代')
                  }${agyAccount}`
                  ,
                  returnPageFlag: parentId ? 'memberDetailPage' : 'agyDetailPage',
                }
              })
            ]
          })
      },
      closeBtn() {
        this.resetPagenation()
        this.resetInnerPagenation()
        this.reset()
        this.snapshots = []
        this.startTime = systemConfig.transferTimeByType(systemConfig.getSevendayAgo() + ' '  + "00:00:00", this.timeType)
        this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' '  + "23:59:59", this.timeType)
        this.showMainPage()
      },
      // 返回按钮事件
      handleSnapshotsChange() {
        this.membername = ''
        this.agyAccount = ''
        this.agentType = ''
        this.accountId = ''
        this.agyMemberId = ''
        this.pageFlag = this.currentLayer.returnPageFlag
        this.returnBtn()
      },
      returnBtn() {
        switch (this.pageFlag) {
          case 'timePage':
            this.startTime=this.saveStartTime;
            this.endTime=this.saveEndTime;
            /* this.startTime = systemConfig.transferTimeByType(systemConfig.getSevendayAgo() + ' '  + "00:00:00", this.timeType)
            this.endTime = systemConfig.transferTimeByType(systemConfig.getToday() + ' '  + "23:59:59", this.timeType) */
            this.showMainPage()
            break
          case 'agyDetailPage':
            this.showTimePage('')
            // this.showTimePage('')
            break
          case 'memberPage':
            this.showAgyDetailPage()
            break
          case 'memberDetailPage':
            this.showMemberPage()
            break
        }
      },
      getMainPageList() {
        /* if(this.tableData.totalCount&&this.listReq.pageSize-20>=this.tableData.totalCount){//条数大于tableData.list总数，则停止
          return ;
        } */
        this.loading=true;
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&startTime=' + (this.startTime + ' 00:00:00') + '&endTime=' + (this.endTime + ' 23:59:59')+ '&orderBy='+ this.orderBy
        this.$axios.get(systemConfig.urls.moneyMainPage + url).then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          resp.data.page.list = resp.data.page.list.map(item => {
            const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate', 'totalActualReward']
            for (let key of arr) {
              item[key] = this.toThousands(item[key])
            }
            return item
          })
          this.tableData = resp.data.page
          this.loading=false;
        }).catch(res=>{
          this.loading=false;

        })
      },
      getTimePageList() {
        /* this.tableData={} */
        this.loading=true;
        // agentType用于区分是否选择了代理账号的正式代理、测试代理
        const { agentType } = this
        const currentAgentId = this.currentLayer.agyId
        const isTest = currentAgentId === 3

        this.$axios.get(systemConfig.urls.moneyTagencyList, {
          params: {
            startTime: this.startTime+' 00:00:00',
            endTime: this.endTime+' 23:59:59',
            pageSize: this.listReq.pageSize,
            pageNo: this.listReq.pageNo,
            isCagency: 0,
            agyId: agentType > 1 ? currentAgentId : '',
            isTest: agentType > 1 ? isTest : null,
            orderBy:this.orderBy,
          }
        }).then((resp) => {
          resp.data.page.list = resp.data.page.list.map(item => {
            const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
            for (let key of arr) {
              item[key] = this.toThousands(item[key])
            }
            return item
          })
          this.tableData = resp.data.page
          this.loading=false;
        })
      },
      getAgyDetailPageList() {
        this.loading=true;
        this.$axios.get(systemConfig.urls.moneyTagencyList, {
          params: {
            startTime: this.startTime+' 00:00:00',
            endTime: this.endTime+' 23:59:59',
            pageSize: this.listReq.pageSize,
            pageNo: this.listReq.pageNo,
            isCagency: 1,
            agyId: this.currentLayer.agyId,
            orderBy: this.orderBy
          }
        }).then((resp) => {
          resp.data.page.list = resp.data.page.list.map(item => {
            const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
            for (let key of arr) {
              item[key] = this.toThousands(item[key])
            }
            return item
          })
          this.tableData = resp.data.page
          this.loading=false;
        })
      },
      async getAgyDetailMemberPageList() {
        this.loading = true
        // 根据总代查询会员列表
        const { res: resp } = await this.$axios.GET(systemConfig.urls.moneyMemberList, {
          startTime: this.startTime+' 00:00:00',
          endTime: this.endTime+' 23:59:59',
          pageSize: this.listReqInner.pageSize,
          pageNo: this.listReqInner.pageNo,
          isCagency: 1,
          agyId: this.currentLayer.agyId,
          orderBy:this.orderBy
        })
        this.loading = false
        if (resp) {
          resp.page.list = resp.page.list.map(item => {
            const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
            for (let key of arr) {
              item[key] = this.toThousands(item[key])
            }
            return item
          })
          this.innerTableData = resp.page
        }
      },
      async getMemberPageList() {
        const { currentLayer } = this
        this.loading = true
        const { res: resp } = await this.$axios.GET(systemConfig.urls.moneyMemberList, {
          startTime: this.startTime+' 00:00:00',
          endTime: this.endTime+' 23:59:59',
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo,
          // isCagency: 0,
          isMbrAgyQry: this.agyMemberId !== '' ? 1 : 0,
          loginName: this.agyMemberId === 1 ? this.agymembername : this.membername,
          agyId: currentLayer && currentLayer.agyId,
          orderBy:this.orderBy,
        })
        this.loading = false
        if (resp) {
          resp.page.list = resp.page.list.map(item => {
            const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
            for (let key of arr) {
              item[key] = this.toThousands(item[key])
            }
            return item
          })
          this.tableData = resp.page
        }
      },
      async getMoneyMainPage(loginName) {
        const { pageSize, pageNo } = this.viewDetail
        loginName = loginName || this.getLoginName()
        const params = {
          pageSize,
          pageNo,
          loginName,
          startTime: `${this.startTime} 00:00:00`,
          endTime: `${this.endTime} 23:59:59`,
          orderBy: this.orderBy
        }
        this.viewDetail.loading = true
        const { res } = await this.$axios.GET(systemConfig.urls.moneyMainPage, params)
        this.viewDetail.loading = false
        if (res) {
          const { list, totalCount } = res.page
          this.memberSelfDetail = list
          this.viewDetail.totalCount = totalCount
        }
      },
      async getTotalMbrList() {
        const loginName = this.getLoginName()
        const params = {
          startTime: `${this.startTime} 00:00:00`,
          endTime: `${this.endTime} 23:59:59`,
          loginName
        }
        const { res } = await this.$axios.GET(systemConfig.urls.totalMbrList, params)
        if (res) {
          const { data } = res
          this.memberSelfView = data
        }
      },
      async getMemberDetailPageList() {
        this.loading = true
        const arr = [this.getTotalInfoMbrSelf(), this.getTotalMbrList(), this.getMbrSubMbrList()]
        await Promise.all(arr).then(() => {}, () => {})
        this.loading = false
        // let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&startTime=' + this.startTime+' 00:00:00' + '&endTime=' + this.endTime+' 23:59:59' + '&loginName=' + this.currentLayer.loginName+ '&orderBy='+ this.orderBy
        // this.$axios.get(systemConfig.urls.moneyMainPage + url).then((resp) => {
        //   resp.data.page.list = resp.data.page.list.map(item => {
        //     const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
        //     for (let key of arr) {
        //       item[key] = this.toThousands(item[key])
        //     }
        //     return item
        //   })
        //   this.tableData = resp.data.page
        //   this.loading=false;
        //   /* if(this.tableData.list.length==this.oldTableList.length){
        //     this.oldTableList=this.tableData.list
        //   } */
        // })
      },
      showMainPage() {
        this.resetPageNo()
        this.getStatistic()
        this.loading = true
        this.pageFlag = 'mainPage'
        this.getMainPageList()
      },
      // 查代理
      showTimePage (time, agentType) {
        this.saveStartTime=this.startTime;
        this.saveEndTime=this.endTime;
        this.resetPageNo()
        this.resetOrderBy()
        this.loading = true
        this.pageFlag = 'timePage'
        if (time) {
          let str1 = time.substr(0, 4) // 2018
          let str2 = time.substr(4, 2) // 10
          let str3 = time.substr(6, 2) // 01
          this.startTime = str1 + '-' + str2 + '-' + str3 + ' '
          this.endTime = str1 + '-' + str2 + '-' + str3 + ' '
          this.agentType = ''
          this.accountId = ''
          this.agyAccount = ''
          this.membername = ''
          this.btsSmId = 10
        }
        this.snapshots = [
          {
            agyId: agentType, // agentType是2、3的时候可用于agyId参数查询正式和测试代理
            displayName: this.$t('总代'),
            returnPageFlag: 'agyDetailPage',
          }
        ]
        this.getTimePageList()
      },
      handleTopAgentClick(row) {
        this.snapshots.push({
          ...row,
          returnPageFlag: 'memberPage',
          displayName: `${this.$t('总代')}${row.agyAccount}`
        })
        this.showAgyDetailPage()
      },
      showAgyDetailPage () {
        this.resetPageNo()
        this.resetOrderBy()
        this.loading = true
        this.pageFlag = 'agyDetailPage'
        // this.innerTableData = {}
        this.getAgyDetailPageList()
        // this.getAgyDetailMemberPageList()
      },
      handleAgentClick(row) {
        this.snapshots.push({
          ...row,
          returnPageFlag: 'memberDetailPage',
          displayName: `${this.$t('代理')}${row.agyAccount}`
        })
        this.showMemberPage()
      },
      getMoneyTotalList() {
        const { currentLayer } = this

        this.viewTableData = []
        this.$axios
          .get(systemConfig.urls.moneyTotalList, {
            params: {
              startTime: this.startTime+' 00:00:00',
              endTime: this.endTime+' 23:59:59',
              pageSize: this.listReq.pageSize,
              pageNo: this.listReq.pageNo,
              isCagency: 1,
              agyId: currentLayer && currentLayer.agyId,
            },
          })
          .then(({ data }) => {
            this.viewTableData = data.data.map(item => {
              const arr = ['fundAdjust', 'friendsTransAmountTotal', 'friendsRecepitAmountTotal', 'totalTaskBonus', 'totalBonusAmount', 'totalDepositBalance', 'totalDrawAmount', 'totalJackpotPayout', 'totalPayout', 'totalProfit', 'totalRebate']
              for (let key of arr) {
                item[key] = this.toThousands(item[key])
              }
              return item
            })
          })
      },
      showMemberPage(isSubAgentShow = true) {
        this.resetPageNo()
        this.resetOrderBy()
        this.loading = true
        this.pageFlag = 'memberPage'
        this.isSubAgentShow = isSubAgentShow
        if (this.currentLevel > 0) {
          this.getMoneyTotalList()
        }
        if (isSubAgentShow) {
          // 根据代理查询下级代理列表
          this.getAgyDetailPageList()
        } else {
          // 根据代理查询直属会员列表
          this.getMemberPageList()
        }
      },
      handleMemberClick(row) {
        this.snapshots.push({
          ...row,
          displayName: `${this.$t('会员')}${row.loginName}`
        })
        this.showMemberDetailPage()
      },
      showMemberDetailPage () {
        this.resetPageNo()
        this.loading = true
        this.pageFlag = 'memberDetailPage'
        this.getMemberDetailPageList()
      },
      resetPageNo() {
        this.listReq.pageNo = 1
        this.listReqInner.pageNo = 1
      },
      resetPagenation() {
        this.listReq.pageNo = 1
        //this.listReq.pageSize = 10
      },
      resetInnerPagenation() {
        this.listReqInner.pageNo = 1
        //this.listReqInner.pageSize = 20
      },
      resetOrderBy(){
        this.orderBy='';
      },
      twoNumber(row, column, cellValue) {
        return systemConfig.saveTwoNumber(cellValue)
      },
      twoNumber2(row, column, cellValue) {
        return systemConfig.saveTwoNumber(cellValue) + '%'
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
      handleSortChange({prop,order},whichTable){
        if(prop){
          this.orderBy=prop+' '+ (order=='descending' ? 'desc': 'asc')
        }else{
          this.orderBy="";
        }
        switch (whichTable) {
          case 'mainPage':
            this.getMainPageList()
            break
          case 'timePage':
            this.getTimePageList()
            break
          case 'agyDetailPage':
            this.getAgyDetailPageList()
            break
          case 'memberPage':
            // this.getMemberPageList()
            this.isSubAgentShow ? this.getAgyDetailPageList() : this.getMemberPageList()
            break
          case 'memberDetailPage':
            this.getMemberDetailPageList()
            break
        }
      },
      enterStatisticalAnalysis(){//统计分析页
        this.staticalAnalysisShow=true;
        let params={
          startTime: this.startTime+' 00:00:00',
          endTime: this.endTime+' 23:59:59'
        }
        this.recodeSelectParams=params;
        this.getStatistData(params);
      },
      getStatistData(params){
        this.loading=true;
        this.$axios.get(systemConfig.urls.statistAnalysis, {params})
        .then(res=>{
          let arr=res.data.page;
          arr.map(val=>{
            switch(val.type){
              case '1' : {//支付宝
                val['icon']='alipay_icon';
                val['name']=this.$t('支付宝');
                break;
              }
              case '2' : {//微信
                val['icon']='wechat_icon';
                val['name']=this.$t('微信');
                break;
              }
              case '3' : {//网银支付
                val['icon']='internetBank_icon';
                val['name']=this.$t('网银支付');
                break;
              }
              case '4' : {//极速支付
                val['icon']='fast_icon';
                val['name']=this.$t('极速支付');
                break;
              }
              case '5' : {//其他支付
                val['icon']='other_icon';
                val['name']=this.$t('其他支付');
                break;
              }
              case '6' : {//加密货币
                val['icon']='crPay_icon';
                val['name']=this.$t('加密货币');
                break;
              }
            }
          })
          this.loading=false;
          this.statisticalData=arr;
        })
        .catch(err=>{
          this.loading=false;
        })
      },
      nowBack(){//返回按钮
        this.staticalAnalysisShow=false;
        this.startTime=this.recodeSelectParams.startTime;
        this.endTime=this.recodeSelectParams.endTime;
        /* this.search('closeStatic'); */
      }
    },
    watch:{
      accountId(val){
        if(val===0){
          this.membername='';
        }
      }
      /* startTime(n,o){
        this.oldTableList=[];
      },
      endTime(n,o){
        this.oldTableList=[];
      } */
    }
  }
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
  .member-top {
    margin-top: 35px;
  }
  .tableToTop{
    position: absolute;
    right: 82px;
    top: 10px;
    font-size: 13px;
    cursor: pointer;
  }
  .staticAnalysis{
    position: relative;
    margin-top: 70px;
    .goback{
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
    .eachOne{
      margin-top: 10px;
      font-weight: bolder;
      .up{
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(220, 220, 220);
        line-height: 18px;
        height: 18px;
        margin-bottom: 10px;
        .l{
          float: left;
        }
        .r{
          float:right;
        }
      }
      ul{
        padding-left: 10px;
        margin-top: 15px;
        li{
          display: inline-block;
          min-width: 150px;
          height: 60px;
          background-color: #f2f3f8;
	        border-radius: 5px;
          margin:0 20px 10px 0;
          padding:5px;
          box-sizing: border-box;
          p{
            height: 25px;
            line-height: 25px;
            color: #999999;
            text-align: center;
          }
          .p2{
            color: #333333;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
.statistics {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .statistics-cell {
      position: relative;
      margin: 10px 10px 0 0;
      width: 187px;
      height: 76px;
      background: #f0f3f9;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background:#e6f0fa;
      }
      h3 {
        position: absolute;
        bottom:8px;
        left:10px;
      }
      .money {
        position:absolute;
        top:10px;
        left:10px;
        font-weight: bold;
        font-size: 16px;
      }
      .icon-wenhao {
        font-size:14px;
        cursor: pointer;
      }
      .icon-5, .icon-wallet, .icon-hongli, .icon-paicai, .icon-caijin, .icon-yinli, .el-icon-sold-out {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #b5b4c2;
        font-size: 24px;
      }
    }

}
/deep/ .el-dialog {
  width: 65% !important;
}
</style>
