<!-- 支付配置 - 入款管理 - 支付列表： -->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabList" :key="item.name"></el-tab-pane>
    </el-tabs>
    <!--银行卡-->
    <div class="condition-container" v-show="activeName === 'first'">
      <div class="condition">
        <div class="condition-child" :class="[bankOrder === '' ? '' : 'bg-focus']" @click="bankOrderClick">
          <span class="span-first">{{ $t('按银行名称排序') }}</span
          ><span class="span-top" :class="[bankOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[bankOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[xianhongOrder === '' ? '' : 'bg-focus']" @click="xianhongOrderClick">
          <span class="span-first">{{ $t('按限红排序') }}</span
          ><span class="span-top" :class="[xianhongOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[xianhongOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[timeOrder === '' ? '' : 'bg-focus']" @click="timeOrderClick">
          <span class="span-first">{{ $t('按时间排序') }}</span
          ><span class="span-top" :class="[timeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[timeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[statusOrder === '' ? '' : 'bg-focus']" @click="statusOrderClick">
          <span class="span-first">{{ $t('按照启用状态排序') }}</span
          ><span class="span-top" :class="[statusOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[statusOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
      </div>
      <div class="operate">
        <el-button
          v-if="hasPermission('setting:company:save')"
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="addBankcard"
          >{{ $t('新增') }}
        </el-button>
      </div>
    </div>
    <!--自动入款平台-->
    <div class="condition-container" v-show="activeName === 'second'">
      <div class="condition">
        <div class="condition-child" :class="[typeOrder === '' ? '' : 'bg-focus']" @click="typeOrderClick">
          <span class="span-first">{{ $t('按类型排序') }}</span
          ><span class="span-top" :class="[typeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[typeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[xianhongOrder === '' ? '' : 'bg-focus']" @click="xianhongOrderClick">
          <span class="span-first">{{ $t('按限红排序') }}</span
          ><span class="span-top" :class="[xianhongOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[xianhongOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[timeOrder === '' ? '' : 'bg-focus']" @click="timeOrderClick">
          <span class="span-first">{{ $t('按时间排序') }}</span
          ><span class="span-top" :class="[timeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[timeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[statusOrder === '' ? '' : 'bg-focus']" @click="statusOrderClick">
          <span class="span-first">{{ $t('按照启用状态排序') }}</span
          ><span class="span-top" :class="[statusOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[statusOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
      </div>
      <div class="operate">
        <el-button
          v-if="hasPermission('setting:fastPay:save')"
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="addPlatform"
          >{{ $t('新增') }}
        </el-button>
      </div>
    </div>
    <!--线上支付-->
    <div class="condition-container" v-show="activeName === 'third'">
      <div class="condition">
        <div class="condition-child" :class="[typeOrder === '' ? '' : 'bg-focus']" @click="typeOrderClick">
          <span class="span-first">{{ $t('按类型排序') }}</span
          ><span class="span-top" :class="[typeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[typeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <!-- <div class="condition-child no-border-right" :class="[channelOrder===''? '': 'bg-focus']" @click="channelOrderClick"><span class="span-first">按渠道排序</span><span class="span-top" :class="[channelOrder==='asc' ? 'focus1': '']"></span><span class="span-bottom" :class="[channelOrder==='desc' ? 'focus2': '']"></span></div> -->
        <div class="condition-child" :class="[xianhongOrder === '' ? '' : 'bg-focus']" @click="xianhongOrderClick">
          <span class="span-first">{{ $t('按限红排序') }}</span
          ><span class="span-top" :class="[xianhongOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[xianhongOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[timeOrder === '' ? '' : 'bg-focus']" @click="timeOrderClick">
          <span class="span-first">{{ $t('按时间排序') }}</span
          ><span class="span-top" :class="[timeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[timeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[statusOrder === '' ? '' : 'bg-focus']" @click="statusOrderClick">
          <span class="span-first">{{ $t('按照启用状态排序') }}</span
          ><span class="span-top" :class="[statusOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[statusOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
      </div>
      <div class="operate">
        <el-button v-if="hasPermission('setting:onlinepay:paytype')" class="adminTration" @click="getAllPaylist">{{ $t('管理') }}</el-button>
        <el-button
          v-if="hasPermission('setting:onlinepay:save')"
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="addPayType"
          >{{ $t('新增') }}
        </el-button>
      </div>
    </div>
    <!--普通扫码支付-->
    <div class="condition-container" v-show="activeName === 'fourth'">
      <div class="condition">
        <div class="condition-child" :class="[typeOrder === '' ? '' : 'bg-focus']" @click="typeOrderClick">
          <span class="span-first">{{ $t('按扫码方式排序') }}</span
          ><span class="span-top" :class="[typeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[typeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <!-- <div class="condition-child no-border-right" :class="[channelOrder===''? '': 'bg-focus']" @click="channelOrderClick"><span class="span-first">按渠道排序</span><span class="span-top" :class="[channelOrder==='asc' ? 'focus1': '']"></span><span class="span-bottom" :class="[channelOrder==='desc' ? 'focus2': '']"></span></div> -->
        <div class="condition-child" :class="[xianhongOrder === '' ? '' : 'bg-focus']" @click="xianhongOrderClick">
          <span class="span-first">{{ $t('按限红排序') }}</span
          ><span class="span-top" :class="[xianhongOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[xianhongOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[timeOrder === '' ? '' : 'bg-focus']" @click="timeOrderClick">
          <span class="span-first">{{ $t('按时间排序') }}</span
          ><span class="span-top" :class="[timeOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[timeOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
        <div class="condition-child" :class="[statusOrder === '' ? '' : 'bg-focus']" @click="statusOrderClick">
          <span class="span-first">{{ $t('按照启用状态排序') }}</span
          ><span class="span-top" :class="[statusOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[statusOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
      </div>
      <div class="operate">
        <el-button
          v-if="hasPermission('setting:qrcodepay:save')"
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="addQrcodePay"
          >{{ $t('新增') }}
        </el-button>
      </div>
    </div>
    <!--加密货币-->
    <div class="condition-container" v-show="activeName === 'fifth'">
      <div class="condition">
        <!-- <div class="condition-child" :class="[typeOrder===''? '': 'bg-focus']" @click="typeOrderClick"><span
          class="span-first">按扫码方式排序</span><span class="span-top" :class="[typeOrder==='asc' ? 'focus1': '']"></span><span
          class="span-bottom" :class="[typeOrder==='desc' ? 'focus2': '']"></span></div>
        <div class="condition-child" :class="[xianhongOrder===''? '': 'bg-focus']" @click="xianhongOrderClick"><span
          class="span-first">按限红排序</span><span class="span-top"
                                               :class="[xianhongOrder==='asc' ? 'focus1': '']"></span><span
          class="span-bottom" :class="[xianhongOrder==='desc' ? 'focus2': '']"></span></div>
        <div class="condition-child" :class="[timeOrder===''? '': 'bg-focus']" @click="timeOrderClick"><span
          class="span-first">按时间排序</span><span class="span-top" :class="[timeOrder==='asc' ? 'focus1': '']"></span><span
          class="span-bottom" :class="[timeOrder==='desc' ? 'focus2': '']"></span></div> -->
        <div class="condition-child" :class="[statusOrder === '' ? '' : 'bg-focus']" @click="statusOrderClick">
          <span class="span-first">{{ $t('按照启用状态排序') }}</span
          ><span class="span-top" :class="[statusOrder === 'asc' ? 'focus1' : '']"></span
          ><span class="span-bottom" :class="[statusOrder === 'desc' ? 'focus2' : '']"></span>
        </div>
      </div>
      <div class="operate">
        <el-button
          v-if="hasPermission('setting:cryptocurrencies:save')"
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="addCrPay"
        >
          {{ $t('新增') }}
        </el-button>
      </div>
    </div>
    <div class="search-form" v-if="activeName === 'first'">
      <el-table  key="firstTableDataList" :data="firstTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="bankName" align="center" width="100" :label="$t('银行名称')"> </el-table-column>
        <el-table-column prop="realName" align="center" width="100" :label="$t('姓名')"> </el-table-column>
        <el-table-column width="160" align="center" prop="bankAccount" :label="$t('银行卡号')"> </el-table-column>
        <el-table-column align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer2(scope.row.groupList) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" :label="$t('每日已收款/最大限额')">
          <template slot-scope="scope">
            <span :class="[scope.row.depositAmount > scope.row.dayMaxAmout ? 'red' : 'green']">{{
              scope.row.depositAmount
            }}</span
            >/<span>{{ scope.row.dayMaxAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" width="180" :label="$t('创建时间')"> </el-table-column>
        <el-table-column align="center" width="80" :label="$t('推荐')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isRecommend"
              @change="toggleIsRecommend(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isHot"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('热门')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="toggleIsHot(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isRecommend"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:company:available')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:company:update')"
              class="blue-color pointer"
              @click="editBankcard(scope.row)"
              >[{{ $t('编辑银行卡') }}]
            </span>
            <span
              v-if="hasPermission('setting:company:delete')"
              v-show="scope.row.available === 0"
              class="blue-color pointer"
              @click="deleteBankcard(scope.row)"
              >[{{ $t('删除') }}]
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-if="activeName === 'second'">
      <el-table  key="secondTableDataList"  :data="secondTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="name" width="100" align="center" :label="$t('类型')"> </el-table-column>
        <el-table-column align="center" width="180" :label="$t('支持银行')">
          <template slot-scope="scope">
            <span>{{ transferBankCardList(scope.row.deposits) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer2(scope.row.groupList) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" :label="$t('每日已收款/最大限额')">
          <template slot-scope="scope">
            <span :class="[scope.row.depositAmount > scope.row.dayMaxAmout ? 'red' : 'green']">{{
              scope.row.depositAmount || 0
            }}</span
            >/<span>{{ scope.row.dayMaxAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amountType" align="center" :label="$t('单笔限额')">
          <template slot-scope="scope">
            <div>
              <div v-for="(item, i) in scope.row.deposits" :key="i">
                <span>{{ item.minAmout }}</span> - <span>{{ item.maxAmout }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" :label="$t('固定金额')">
          <template slot-scope="scope">
            <div>
              <div v-for="(item, i) in scope.row.deposits" :key="i">
                <span>{{ item.fixedAmount }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" width="180" :label="$t('创建时间')"> </el-table-column>
        <el-table-column align="center" width="80" :label="$t('推荐')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isRecommend"
              @change="toggleIsRecommend(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isHot"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('热门')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="toggleIsHot(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isRecommend"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:fastPay:available')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:fastPay:update')"
              class="blue-color pointer"
              @click="editPlatform(scope.row)"
              >[{{ $t('编辑银行卡') }}]
            </span>
            <span
              v-if="hasPermission('setting:fastPay:delete')"
              v-show="scope.row.available === 0"
              class="blue-color pointer"
              @click="deletePlatform(scope.row)"
              >[{{ $t('删除') }}]
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-if="activeName === 'third'">
      <el-table key="thirdTableDataList" :data="thirdTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column width="100" align="center" :label="$t('支付类型')">
          <template slot-scope="scope">
            <span>{{ transfer(scope.row.paymentType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platfromName" width="100" align="center" :label="$t('支付渠道')"> </el-table-column>
        <el-table-column width="100" align="center" :label="$t('渠道logo')">
          <template slot-scope="scope">
            <img width="60px" :src="scope.row.logoUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="name" width="100" align="center" :label="$t('商户名称')"> </el-table-column>
        <el-table-column align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer2(scope.row.groupList) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" :label="$t('每日已收款/最大限额')">
          <template slot-scope="scope">
            <span :class="[scope.row.depositAmount > scope.row.dayMaxAmout ? 'red' : 'green']">{{
              scope.row.depositAmount
            }}</span
            >/<span>{{ scope.row.dayMaxAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130" :label="$t('单笔限额')">
          <template slot-scope="scope">
            <div>{{ scope.row.minAmout }} - {{ scope.row.maxAmout }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="fixedAmount" align="center" :label="$t('固定金额')"> </el-table-column>
        <el-table-column prop="createTime" width="180" align="center" :label="$t('创建时间')"> </el-table-column>
        <el-table-column align="center" width="80" :label="$t('推荐')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isRecommend"
              @change="toggleIsRecommend(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isHot"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('热门')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="toggleIsHot(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isRecommend"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:onlinepay:available')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" :label="$t('是否外跳')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isJump"
              @change="toggleIsJump(scope.row)"
              :inactive-value="0"
              :active-value="1"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column
          width="80"
          align="center"
          label="safari浏览器">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isIOSWakeUpSafari"
                       @change="toggleSafari(scope.row)"
                       :inactive-value='false' :active-value='true' :disabled="hasPermission('')">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column width="160" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:onlinepay:update')"
              class="blue-color pointer"
              @click="editPayType(scope.row)"
              >[{{ $t('编辑支付') }}]</span
            >
            <span
              v-if="hasPermission('setting:onlinepay:delete')"
              v-show="scope.row.available === 0"
              class="blue-color pointer"
              @click="deletePayType(scope.row)"
              >[{{ $t('删除') }}]</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-if="activeName === 'fourth'">
      <el-table key="fourthTableDataList" :data="fourthTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="bankNamesStr" width="100" align="center" :label="$t('扫码方式')"> </el-table-column>
        <el-table-column prop="name" width="100" align="center" :label="$t('渠道名称')"> </el-table-column>
        <el-table-column width="120" align="center" :label="$t('二维码')">
          <template slot-scope="scope">
            <img :src="scope.row.qrImgUrl" style="width: 80px; height: 80px" />
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer2(scope.row.groupList) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" :label="$t('每日已收款/最大限额')">
          <template slot-scope="scope">
            <span :class="[scope.row.depositAmount > scope.row.dayMaxAmout ? 'red' : 'green']">{{
              scope.row.depositAmount
            }}</span
            >/<span>{{ scope.row.dayMaxAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" :label="$t('单笔限额')">
          <template slot-scope="scope">
            <div>{{ scope.row.minAmout }} - {{ scope.row.maxAmout }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="fixedAmount" align="center" :label="$t('固定金额')"> </el-table-column>
        <el-table-column prop="createTime" width="180" align="center" :label="$t('创建时间')"> </el-table-column>
        <el-table-column align="center" width="80" :label="$t('推荐')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isRecommend"
              @change="toggleIsRecommend(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isHot"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('热门')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="toggleIsHot(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isRecommend"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:qrcodepay:available')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:qrcodepay:update')"
              class="blue-color pointer"
              @click="editQrcodePay(scope.row)"
              >[{{ $t('编辑支付') }}]</span
            >
            <span
              v-if="hasPermission('setting:qrcodepay:delete')"
              v-show="scope.row.available === 0"
              class="blue-color pointer"
              @click="deleteQrcodePay(scope.row)"
              >[{{ $t('删除') }}]</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-if="activeName === 'fifth'">
      <el-table key="fifthTableDataList" :data="fifthTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="bankCode" width="100" align="center" :label="$t('币种')"> </el-table-column>
        <el-table-column prop="category" width="100" align="center" :label="$t('协议类型')"> </el-table-column>
        <!-- -- -->
        <el-table-column width="100" align="center" :label="$t('渠道logo')">
          <template slot-scope="scope">
            <img width="60px" :src="scope.row.logoUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="showName" width="100" align="center" :label="$t('商户名称')"> </el-table-column>
        <!-- -- -->
        <el-table-column align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer2(scope.row.groupList) }}</span>
          </template>
        </el-table-column>
        <!-- -- -->
        <!-- <el-table-column width="200" align="right" :label="$t('每日已收款')">
          <template slot-scope="scope">
            <span>{{ scope.row.depositAmount }}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="200" align="center" :label="$t('每日已收款/最大限额')">
          <template slot-scope="scope">
            <span :class="[scope.row.depositAmount > scope.row.dayMaxAmout ? 'red' : 'green']">{{
              scope.row.depositAmount
            }}</span
            >/<span>{{ scope.row.dayMaxAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130" :label="$t('单笔限额')">
          <template slot-scope="scope">
            <div>{{ scope.row.minAmout }} - {{ scope.row.maxAmout }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fixedAmount" align="center" :label="$t('固定金额')"> </el-table-column> -->
        <!-- -- -->
        <el-table-column prop="createTime" width="180" align="center" :label="$t('创建时间')"> </el-table-column>
        <el-table-column align="center" width="80" :label="$t('推荐')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isRecommend"
              @change="toggleIsRecommend(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isHot"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" :label="$t('热门')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="toggleIsHot(scope.row)"
              :inactive-value="false"
              :active-value="true"
              :disabled="scope.row.isRecommend"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:cryptocurrencies:available')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="160" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:cryptocurrencies:update')"
              class="blue-color pointer"
              @click="editCrPay(scope.row)"
              >[{{ $t('编辑') }}]
            </span>
            <span
              v-if="hasPermission('setting:cryptocurrencies:delete')"
              v-show="scope.row.available === 0"
              class="blue-color pointer"
              @click="deleteCrPay(scope.row)"
              >[{{ $t('删除') }}]
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-form" v-if="activeName === 'sixth'">
      <el-table key="sixthTableDataList" :data="sixthTableDataList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="name" align="center" :label="$t('支付客服')"> </el-table-column>
        <el-table-column prop="groupIds" align="center" :label="$t('使用会员组')">
          <template slot-scope="scope">
            <span>{{ transfer3(scope.row.groupIds) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" :label="$t('最后编辑时间')"> </el-table-column>
        <el-table-column align="center" prop="todatCount" :label="$t('当日点击量')"> </el-table-column>
        <el-table-column align="center" :label="$t('启用')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              @change="togglestate(scope.row)"
              :inactive-value="0"
              :active-value="1"
              :disabled="!hasPermission('setting:smallAmountLine:update')"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <span
              v-if="hasPermission('setting:smallAmountLine:update')"
              class="blue-color pointer"
              @click="editXiaoe(scope.row)"
              >[{{ $t('编辑') }}]
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>

    <el-dialog @close="closeBankcard('bankcard')" :title="dialogTitle" :visible.sync="addBankcardShow">
      <el-form
        v-if="addBankcardShow"
        label-position="right"
        label-width="auto"
        style="margin-left: 20px"
        :model="postData"
        ref="bankcard"
      >
        <el-row>
          <!-- 银行类型： 选择澳洲，不展示"开户姓名"。/ 开户银行只展示PAYID及银行账户 -->
          <el-col :span="24">
            <el-form-item :label="$t('银行类型') + ':'" :rules="bankAddRule.areaCode" prop="areaCode">
              <el-select v-model="postData.areaCode" :placeholder="$t('选择银行')">
                <el-option
                  v-for="item in bankTypeList"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('开户姓名') + ':'" :rules="realNameRule[postData.areaCode]" prop="realName">
              <el-input type="text" :placeholder="$t('请输入收款卡姓名')" v-model="postData.realName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('开户银行') + ':'" :rules="bankAddRule.bankName" prop="bankName">
              <el-select v-model="postData.bankName" :placeholder="$t('选择银行')" @change="changeBankName">
                <el-option v-for="item in bankList[postData.areaCode]" :label='item.bankName' :key="item.bankCode"
                           :value='item.bankName'></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="$t('上传渠道logo') + ':'">
              <el-upload action="" :show-file-list="false" :http-request="handleBankUploadImage">
                <img v-if="postData.logoUrl" :src="postData.logoUrl" style="width: 80px; height: 80px" />
                <i v-else class="el-icon-plus qrcode-pay__upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-show="['MY'].includes(postData.areaCode)">
            <el-form-item label="开户银行区域" >
              <el-input type="text" placeholder="请输入银行省份" v-model="postData.province" maxlength="60" class="ceBan pdn10"></el-input>
              <el-input type="text" placeholder="请输入银行城市" v-model="postData.city" maxlength="60" class="ceBan"></el-input>
            </el-form-item>
          </el-col>
          <!-- 开户银行,选择"银行账户"类型，展示BSB码，限制长度为10个数字。/ 选择PAYID, 不展示BSB码-->
          <!--开户账号，选择银行账户时，只可输入数字及长度60 / 选择PAYID, 可输入英文字母/数字/符号（ - _ . @）控制长度60 -->
          <el-col :span="24">
            <!-- bankAddRule[['CN', 'MY'].includes(this.postData.areaCode) ? 'account' : (showBsb ? 'bankAccountAstBank' : 'ausAccount')] -->
            <el-form-item :label="$t('开户帐号') + ':'" :rules="bankAccountRule[postData.areaCode]" prop="bankAccount">
            <el-input type="text" v-model="postData.bankAccount" :placeholder="$t(`请输入1位到{numLimit}位卡号`, { numLimit })" :maxLength="`${numLimit}`"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="!notShowBankBranch">
            <el-form-item :label="getBankBranchText()" :rules="getBankBranchRule()" prop="bankBranch">
              <el-input type="text" v-model="postData.bankBranch" :maxlength="limitLength"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              :label="$t('单日最大限额')"
              prop="dayMaxAmout"
              :rules="[
                { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                { type: 'number', min: postData.maxAmout + 1, message: $t('单日最大限额大于单笔最大存款') },
              ]"
            >
              <el-input size="small" type="text" v-model.number="postData.dayMaxAmout" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('单笔限额')">
              <el-col :span="11">
                <el-form-item
                  :rules="[
                    { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                    { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                    { type: 'number', min: 1, max: postData.maxAmout, message: $t('不能高于右区间限额') },
                  ]"
                  prop="minAmout"
                >
                  <el-input size="small" type="text" v-model.number="postData.minAmout" />
                </el-form-item>
              </el-col>
              <el-col :span="2" style="height: 30px; text-align: center">~</el-col>
              <el-col :span="11">
                <el-form-item
                  :rules="[
                    { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                    { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                    { type: 'number', min: postData.minAmout, message: $t('不能低于左区间限额') },
                    { type: 'number', max: postData.dayMaxAmout, message: $t('不能大于单日最大限额') },
                  ]"
                  prop="maxAmout"
                >
                  <el-input size="small" type="text" v-model.number="postData.maxAmout" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('返还手续费')">
              <el-radio v-model="postData.feeWay" :label="0" @change="feeChange"
                >{{ $t('按比例') }}
                <el-form-item
                  v-if="postData.feeWay === 0"
                  style="display: inline-block; width: 120px"
                  prop="feeScale"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { type: 'number', max: 100, message: $t('比例不能大于100') },
                    { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    size="small"
                    :disabled="postData.feeWay === 1"
                    v-model.number="postData.feeScale"
                  />
                  %,<span style="width:50px;display:inline-block;text-align:center">{{ $t('最多') }}</span>
                </el-form-item>
                <el-form-item
                  v-if="postData.feeWay === 0"
                  style="display: inline-block; width: 120px; margin-left: 80px"
                  prop="feeTop"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    size="small"
                    :disabled="postData.feeWay === 1"
                    v-model.number="postData.feeTop"
                  />
                </el-form-item>
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item>
              <el-radio v-model="postData.feeWay" :label="1" @change="feeChange"
                >{{ $t('固定') }}
                <el-form-item
                  v-if="postData.feeWay === 1"
                  style="display: inline-block; width: 120px"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                  prop="feeFixed"
                >
                  <el-input
                    size="small"
                    type="number"
                    :disabled="postData.feeWay === 0"
                    v-model.number="postData.feeFixed"
                  />
                </el-form-item>
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('推荐')">
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('热门')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('状态')">
              <el-radio v-model="postData.available" :label="1">{{ $t('启用') }}</el-radio>
              <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <MemberGroupChecker v-model="postData.groupIds" :isEdit="!!postData.id" v-if="addBankcardShow" />
          </el-col>

          <!-- 银行卡 -->
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('上传凭证')" prop="certType">
              <el-radio v-model="postData.certType" :label="2">{{ $t('必填') }}</el-radio>
              <el-radio v-model="postData.certType" :label="0">{{ $t('不填') }}</el-radio>
              <el-radio v-model="postData.certType" :label="1">{{ $t('非必填') }}</el-radio>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closeBankcard('bankcard')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addBankCardSubmit()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="70% !important"
      @close="closePlatform('platform')"
      :title="dialogTitle"
      :visible.sync="addPlatformShow"
    >
      <el-form
        v-if="addPlatformShow"
        :inline="true"
        label-position="right"
        label-width="130px"
        style="margin-left: 20px"
        :model="postData"
        ref="platform"
      >
        <!-- <el-row>
          <el-col :span="24"> -->
        <el-form-item :label="$t('收款渠道')" :rules="commonRule.shouldSelect" prop="payId">
          <el-select v-model="postData.payId" :placeholder="$t('选择收款渠道')">
            <el-option
              v-for="item in shortcutPayList"
              :label="item.payName"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24"> -->
        <el-form-item :label="$t('支付名称')" prop="name">
          <el-input type="text" :placeholder="$t('自定义支付名称')" v-model="postData.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('前台名称')">
          <el-input type="text" :placeholder="$t('前台名称')" v-model="postData.showName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('显示方式')" :rules="commonRule.shouldSelect" prop="alipayFlg">
          <el-select v-model="postData.alipayFlg" :placeholder="$t('选择显示方式')" :disabled="postData.payId === 15">
            <el-option
              v-for="item in alipayFlgList"
              :label="item.alipayFlgName"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24"> -->
        <el-form-item v-if="postData.payId !== 15" :label="$t('密钥')" :rules="commonRule.notNull" prop="password">
          <el-input type="text" v-model="postData.password" :placeholder="$t('输入商户key')"></el-input>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24"> -->
        <el-form-item :label="$t('接入商公司ID')" :rules="commonRule.notNull" prop="cid" v-if="shouldCidShow">
          <el-input type="text" v-model="postData.cid" :placeholder="$t('输入接入商公司ID')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('商户收款ID')" :rules="commonRule.notNull" prop="evebBankId" v-if="shouldCidShow">
          <el-input type="text" v-model="postData.evebBankId" :placeholder="$t('输入接入商户收款ID')"></el-input>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24" style="margin-bottom:-20px"> -->
        <br />
        <el-form-item v-if="postData.payId !== 15" :label="$t('返还手续费')">
          <el-radio v-model="postData.feeWay" :label="0" @change="feeChange"
            >{{ $t('按比例') }}
            <el-form-item
              v-if="postData.feeWay === 0"
              style="display: inline-block; width: 120px; margin-top: -10px"
              prop="feeScale"
              :rules="[
                { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                { type: 'number', message: $t('格式不正确') },
                { type: 'number', max: 100, message: $t('比例不能大于100') },
                { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
              ]"
            >
              <el-input
                type="number"
                size="small"
                :disabled="postData.feeWay === 1"
                v-model.number="postData.feeScale"
              />
              %,{{ $t('最多') }}
            </el-form-item>
            <el-form-item
              v-if="postData.feeWay === 0"
              style="display: inline-block; width: 120px; margin-left: 40px; margin-top: -10px"
              prop="feeTop"
              :rules="[
                { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                { type: 'number', message: $t('格式不正确') },
                { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
              ]"
            >
              <el-input type="number" size="small" :disabled="postData.feeWay === 1" v-model.number="postData.feeTop" />
            </el-form-item>
          </el-radio>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24" style="margin-bottom:-20px"> -->
        <el-form-item v-if="postData.payId !== 15" style="margin-bottom: 0">
          <el-radio v-model="postData.feeWay" :label="1" @change="feeChange"
            >{{ $t('固定') }}
            <el-form-item
              v-if="postData.feeWay === 1"
              style="display: inline-block; width: 120px; margin-top: -10px"
              :rules="[
                { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                { type: 'number', message: $t('格式不正确') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
              ]"
              prop="feeFixed"
            >
              <el-input
                size="small"
                type="number"
                :disabled="postData.feeWay === 0"
                v-model.number="postData.feeFixed"
              />
            </el-form-item>
          </el-radio>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="24" style="margin-bottom:-20px"> -->
        <br />
        <el-col v-if="postData.payId !== 15" :span="24" style="margin-bottom: -20px">
          <el-form-item :label="$t('推荐')">
            <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="true">{{
              $t('启用')
            }}</el-radio>
            <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="false">{{
              $t('禁用')
            }}</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="postData.payId !== 15" :span="24" style="margin-bottom: -20px">
          <el-form-item :label="$t('热门')">
            <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="true">{{
              $t('启用')
            }}</el-radio>
            <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="false">{{
              $t('禁用')
            }}</el-radio>
          </el-form-item>
        </el-col>
        <el-form-item :label="$t('状态')" style="margin-bottom: -0px">
          <el-radio v-model="postData.available" :label="1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
        </el-form-item>
        <br />
        <MemberGroupChecker v-model="postData.groupIds" :isEdit="!!postData.id" v-if="addPlatformShow" style="margin-bottom: -0px" />
        <br />
        <el-form-item v-if="postData.payId !== 15" :label="$t('限额模式')" style="margin-bottom: -0px">
          <el-radio v-model="postData.amountType" :label="0">{{ $t('单笔限额') }}</el-radio>
          <el-radio v-model="postData.amountType" :label="1">{{ $t('固定金额') }}</el-radio>
        </el-form-item>
        <br />
        <!-- 自动入款平台 -->
        <el-form-item :label="$t('上传凭证')" style="margin-bottom: -0px">
          <el-radio v-model="postData.certType" :label="0">{{ $t('不填') }}</el-radio>
          <el-radio v-model="postData.certType" :label="1">{{ $t('非必填') }}</el-radio>
        </el-form-item>


        <el-form-item
          :label="$t('每日限额')"
          :rules="commonRule.notNull"
          prop="fastDWDayMaxAmout"
          v-if="postData.payId === 15"
        >
          <el-input
            type="number"
            v-model.number="postData.fastDWDayMaxAmout"
            :placeholder="$t('输入每日限额')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('固定金额')"
          :rules="commonRule.douhao"
          prop="fastDWAmount"
          v-if="postData.payId === 15"
        >
          <el-input v-model="postData.fastDWAmount" :placeholder="$t('输入固定金额，请用,隔开')"></el-input>
        </el-form-item>
        <!-- </el-col>
      </el-row> -->
      </el-form>
      <!-- 银行卡列表 -->
      <BankList
        :tableData="postData.deposits"
        :payId="postData.payId"
        :amountType="postData.amountType"
        :alipayFlgAuth="postData.alipayFlg"
        ref="bankList"
        v-if="addPlatformShow && postData.payId !== 15"
      />
      <div class="div-submit-btn">
        <el-button @click.native="closePlatform('platform')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addPlatformSubmit()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closePayType('paytype')" :title="dialogTitle" :visible.sync="addPayTypeShow">
      <el-form
        v-if="addPayTypeShow"
        class="small-space small-title"
        label-position="right"
        label-width="180px"
        :model="postData"
        ref="paytype"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('支付类型')">
              <el-select v-model="postData.paymentType" @change="payTypeChange">
                <el-option v-for="item in payments" :label="item.label" :key="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('支付平台')">
              <el-select v-model="postData.platfromName" @change="terminalTypeChange">
                <el-option
                  v-for="(item, index) in paymentPlatformsList"
                  :label="item.platfromName"
                  :key="index"
                  :value="item.platfromName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('上传渠道logo') + ':'">
              <el-upload action="" :show-file-list="false" :http-request="handlePayUploadImage">
                <img v-if="postData.logoUrl" :src="postData.logoUrl" style="width: 80px; height: 80px" />
                <i v-else class="el-icon-plus qrcode-pay__upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('前台名称')">
              <el-input type="text" :placeholder="$t('前台名称')" v-model="postData.showName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('商户名称')" :rules="commonRule.notNull" prop="name">
              <el-input type="text" v-model="postData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('商户号')" :rules="commonRule.notNull" prop="merNo">
              <el-input type="text" v-model="postData.merNo"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="支持终端">
              <el-checkbox label="PC端" :checked=true disabled
                           v-show="postData.terminalType === 1 || postData.terminalType === 3"></el-checkbox>
              <el-checkbox label="移动端" :checked=true disabled
                           v-show="postData.terminalType === 2 || postData.terminalType === 3"></el-checkbox>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <!-- devSource 设备来源 PC:0 H5:3 -->
            <el-form-item :label="$t('显示终端')">
              <el-select
                v-model="postData.devSource"
                multiple
                :disabled="postData.id ? (postData.terminalType === 3 ? false : true) : true"
              >
                <el-option label="PC" value="0"></el-option>
                <el-option label="H5" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.platfromCode === 'PANZI' || postData.platfromCode === 'SAASOPS_PAY'">
            <el-form-item
              :label="$t('商户收款ID')"
              :rules="commonRule.notNull"
              prop="bankId"
              v-if="postData.platfromCode === 'PANZI'"
            >
              <el-input v-model="postData.bankId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('商户收款ID')" prop="bankId" v-else>
              <el-input v-model="postData.bankId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('密钥')" :rules="commonRule.notNull" prop="password">
              <el-input v-model="postData.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -10px" v-if="PCBankOptions.length">
            <el-form-item :label="$t('PC支持渠道')">
              <el-checkbox
                class="payList-checkbox"
                v-for="bank in PCBankOptions"
                :label="bank.id"
                :key="bank.bankName"
                v-model="checked"
                disabled
                :value="bank.id"
                >{{ bank.bankName }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -10px" v-if="H5BankOptions.length">
            <el-form-item :label="$t('H5支持渠道')">
              <el-checkbox
                class="payList-checkbox"
                v-for="bank in H5BankOptions"
                :label="bank.id"
                :key="bank.bankName"
                v-model="checked"
                disabled
                :value="bank.id"
                >{{ bank.bankName }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('单日最大存款限额')"
              :rules="[
                { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                { type: 'number', min: postData.maxAmout + 1, message: $t('单日最大限额大于单笔最大存款') },
              ]"
              prop="dayMaxAmout"
            >
              <el-input type="text" v-model.number="postData.dayMaxAmout"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('限额模式')" 
              :rules="[
                { type: 'array', required: true, message: $t('请至少选择一个限额模式'), trigger: 'change' }
              ]" prop="amountType">
              <el-checkbox-group v-model="postData.amountType">
                <el-checkbox :label="0">{{ $t('单笔限额') }}</el-checkbox>
                <el-checkbox :label="1">{{ $t('固定金额') }}</el-checkbox>
              </el-checkbox-group>
              <!-- <el-radio v-model="postData.amountType" :label="0">{{ $t('单笔限额') }}</el-radio>
              <el-radio v-model="postData.amountType" :label="1">{{ $t('固定金额') }}</el-radio> -->
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.amountType && postData.amountType.includes(1)">
            <el-form-item :label="$t('固定金额')" prop="fixedAmount" :rules="fixedAmountRules">
              <el-input type="text" v-model="postData.fixedAmount" :placeholder="$t('请输入固定金额')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px" v-if="postData.amountType && postData.amountType.includes(0)">
            <el-form-item :label="$t('单笔存款')">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      { type: 'number', min: 1, message: $t('不能低于0') },
                    ]"
                    prop="minAmout"
                  >
                    <el-input type="text" v-model.number="postData.minAmout"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="center">~</el-col>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      ,
                      { type: 'number', min: postData.minAmout, message: $t('不能低于最小值') },
                      { type: 'number', max: postData.dayMaxAmout, message: $t('不能高于单日最大限额') },
                    ]"
                    prop="maxAmout"
                  >
                    <el-input type="text" v-model.number="postData.maxAmout"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('推荐')">
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('热门')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('是否外跳')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isJump" :label="1">{{ $t('是') }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isJump" :label="0">{{ $t('否') }}</el-radio>
            </el-form-item>
          </el-col>

          <!-- 线上支付 -->
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('状态')">
              <el-radio v-model="postData.available" :label="1">{{ $t('开启') }}</el-radio>
              <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('上传凭证')">
              <el-radio v-model="postData.certType" :label="0">{{ $t('不填') }}</el-radio>
              <el-radio v-model="postData.certType" :label="1">{{ $t('非必填') }}</el-radio>
            </el-form-item>
          </el-col>


          <el-col :span="24" style="margin-bottom: -20px">
            <MemberGroupChecker v-model="postData.groupIds" :isEdit="!!postData.id" v-if="addPayTypeShow" />
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closePayType('paytype')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addPayTypeSubmit()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closeQrcodePay('qrcodePay')" :title="dialogTitle" :visible.sync="addQrcodePayShow">
      <el-form
        v-if="addQrcodePayShow"
        class="small-space small-title"
        label-position="right"
        label-width="180px"
        :model="postData"
        ref="qrcodePay"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('渠道名称')" :rules="commonRule.notNull" prop="name">
              <el-input type="text" v-model="postData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('扫码方式')" :rules="commonRule.notNull" prop="bankIds">
              <el-select v-model="postData.bankIds" multiple>
                <el-option
                  v-for="(item, index) in qrcodePayTypeList"
                  :label="item.bankName"
                  :key="index"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('二维码')" :rules="commonRule.notNull" prop="qrImgUrl">
              <el-upload action="" :show-file-list="false" :http-request="handleUploadImage">
                <img v-if="postData.qrImgUrl" :src="postData.qrImgUrl" style="width: 80px; height: 80px" />
                <i v-else class="el-icon-plus qrcode-pay__upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('单日最大存款限额')"
              :rules="[
                { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                { type: 'number', min: postData.maxAmout + 1, message: $t('单日最大限额大于单笔最大存款') },
              ]"
              prop="dayMaxAmout"
            >
              <el-input type="text" v-model.number="postData.dayMaxAmout"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('限额模式')">
              <el-radio v-model="postData.amountType" :label="0">{{ $t('单笔限额') }}</el-radio>
              <el-radio v-model="postData.amountType" :label="1">{{ $t('固定金额') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.amountType === 1">
            <el-form-item :label="$t('固定金额')" prop="fixedAmount" :rules="fixedAmountRules">
              <el-input type="text" v-model="postData.fixedAmount" :placeholder="$t('请输入固定金额')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px" v-else>
            <el-form-item :label="$t('单笔存款')">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      { type: 'number', min: 1, message: $t('不能低于0') },
                    ]"
                    prop="minAmout"
                  >
                    <el-input type="text" v-model.number="postData.minAmout"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="center">~</el-col>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      ,
                      { type: 'number', min: postData.minAmout, message: $t('不能低于最小值') },
                      { type: 'number', max: postData.dayMaxAmout, message: $t('不能高于单日最大限额') },
                    ]"
                    prop="maxAmout"
                  >
                    <el-input type="text" v-model.number="postData.maxAmout"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('返还手续费')">
              <el-radio v-model="postData.feeWay" :label="0" @change="feeChange"
                >{{ $t('按比例') }}
                <el-form-item
                  v-if="postData.feeWay === 0"
                  style="display: inline-block; width: 120px; margin-top: -10px"
                  prop="feeScale"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { type: 'number', max: 100, message: $t('比例不能大于100') },
                    { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    size="small"
                    :disabled="postData.feeWay === 1"
                    v-model.number="postData.feeScale"
                  />
                  %,{{ $t('最多') }}
                </el-form-item>
                <el-form-item
                  v-if="postData.feeWay === 0"
                  style="display: inline-block; width: 120px; margin-left: 40px; margin-top: -10px"
                  prop="feeTop"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { required: postData.feeWay === 0, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    size="small"
                    :disabled="postData.feeWay === 1"
                    v-model.number="postData.feeTop"
                  />
                </el-form-item>
              </el-radio>
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <el-radio v-model="postData.feeWay" :label="1" @change="feeChange"
                >{{ $t('固定') }}
                <el-form-item
                  v-if="postData.feeWay === 1"
                  style="display: inline-block; width: 120px; margin-top: -10px"
                  :rules="[
                    { pattern: /^\d+(\.\d)?$/, message: $t('大于等于0允许1位小数') },
                    { type: 'number', message: $t('格式不正确') },
                    { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                  ]"
                  prop="feeFixed"
                >
                  <el-input
                    size="small"
                    type="number"
                    :disabled="postData.feeWay === 0"
                    v-model.number="postData.feeFixed"
                  />
                </el-form-item>
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('推荐')">
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('热门')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')">
              <el-radio v-model="postData.available" :label="1">{{ $t('开启') }}</el-radio>
              <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <MemberGroupChecker v-model="postData.groupIds" :isEdit="!!postData.id" v-if="addQrcodePayShow" />
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closeQrcodePay('qrcodePay')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addQrcodePaySubmit()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closeCrPay('crPay')" :title="dialogTitle" :visible.sync="addCrPayShow">
      <el-form
        v-if="addCrPayShow"
        class="small-space small-title"
        label-position="right"
        label-width="140px"
        :model="postData"
        ref="crPay"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('币种')" :rules="commonRule.notNull" prop="currencyCode">
              <el-select
                v-model="postData.currencyCode"
                :disabled="!!postData.id"
                @change="handleCrPayTypeKey"
                clearable
              >
                <el-option v-for="(item, index) in crPayTypeListKeys" :key="index" :value="item" :label="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('协议类型')" :rules="commonRule.notNull" prop="bankIds">
              <el-select v-model="postData.bankIds" :disabled="!!postData.id" @change="crXyTypeChange">
                <el-option
                  v-for="(item, index) in curCrPayTypeList"
                  :key="index"
                  :label="item.category"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <el-col :span="24">
            <el-form-item :label="$t('上传渠道logo') + ':'">
              <el-upload action="" :show-file-list="false" :http-request="handlePayUploadImage">
                <img v-if="postData.logoUrl" :src="postData.logoUrl" style="width: 80px; height: 80px" />
                <i v-else class="el-icon-plus qrcode-pay__upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <!-- <el-col :span="24">
            <el-form-item
              prop="minAmout"
              :label="$t('单笔最低限额')"
              :rules="[
                { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
              ]"
            >
              <el-input type="text" maxlength="10" v-model.number="postData.minAmout"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- -- -->
          <el-col :span="24">
            <el-form-item :label="$t('前台名称')">
              <el-input type="text" :placeholder="$t('前台名称')" v-model="postData.showName"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="postData.currencyCode !== 'USDT'" :span="24">
            <el-form-item :label="$t('商户收款ID')" prop="bankId">
              <el-input type="text" v-model="postData.bankId"></el-input>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <el-col :span="24">
            <el-form-item :label="$t('商户号')" :rules="commonRule.notNull" prop="merNo">
              <el-input type="text" v-model="postData.merNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('显示终端')">
              <el-select
                v-model="postData.devSource"
                multiple
              >
                <el-option label="PC" value="0"></el-option>
                <el-option label="H5" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('密钥')" :rules="commonRule.notNull" prop="password">
              <el-input type="text" v-model="postData.password"></el-input>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <el-col :span="24">
            <el-form-item
              :label="$t('单日最大存款限额')"
              :rules="[
                { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                { type: 'number', min: postData.maxAmout + 1, message: $t('单日最大限额大于单笔最大存款') },
              ]"
              prop="dayMaxAmout"
            >
              <el-input type="text" v-model.number="postData.dayMaxAmout"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('限额模式')" 
              :rules="[
                { type: 'array', required: true, message: $t('请至少选择一个限额模式'), trigger: 'change' }
              ]" prop="amountType">
              <!-- <el-checkbox-group v-model="postData.amountType">
                <el-checkbox :label="0">{{ $t('单笔限额') }}</el-checkbox>
                <el-checkbox :label="1">{{ $t('固定金额') }}</el-checkbox>
              </el-checkbox-group> -->
              <span>{{ $t('单笔限额') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('单笔存款')">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      { type: 'number', min: 1, message: $t('不能低于0') },
                    ]"
                    prop="minAmout"
                  >
                    <el-input type="text" v-model.number="postData.minAmout"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="center">~</el-col>
                <el-col :span="11">
                  <el-form-item
                    :rules="[
                      { pattern: /^[1-9]\d*$/, message: $t('请输入正整数') },
                      { required: true, message: $t('此处不能为空'), trigger: 'blur' },
                      ,
                      { type: 'number', min: postData.minAmout, message: $t('不能低于最小值') },
                      { type: 'number', max: postData.dayMaxAmout, message: $t('不能高于单日最大限额') },
                    ]"
                    prop="maxAmout"
                  >
                    <el-input type="text" v-model.number="postData.maxAmout"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('推荐')">
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isHot" v-model="postData.isRecommend" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('热门')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="true">{{
                $t('启用')
              }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isHot" :label="false">{{
                $t('禁用')
              }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')">
              <el-radio v-model="postData.available" :label="1">{{ $t('开启') }}</el-radio>
              <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
            </el-form-item>
          </el-col>
          <!-- -- -->
          <!-- <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('是否外跳')">
              <el-radio :disabled="postData.isRecommend" v-model="postData.isJump" :label="1">{{ $t('是') }}</el-radio>
              <el-radio :disabled="postData.isRecommend" v-model="postData.isJump" :label="0">{{ $t('否') }}</el-radio>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" style="margin-bottom: -20px">
            <el-form-item :label="$t('上传凭证')">
              <el-radio v-model="postData.certType" :label="0">{{ $t('不填') }}</el-radio>
              <el-radio v-model="postData.certType" :label="1">{{ $t('非必填') }}</el-radio>
            </el-form-item>
          </el-col> -->
          <!-- -- -->
          <el-col :span="24" style="margin-bottom: -20px">
            <MemberGroupChecker v-model="postData.groupIds" :isEdit="!!postData.id" v-if="addCrPayShow" />
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closeCrPay('crPay')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addCrPaySubmit()">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closeXiaoe('xiaoe')" :title="dialogTitle" :visible.sync="addXiaoeShow">
      <el-form
        v-if="addXiaoeShow"
        class="small-space small-title"
        label-position="right"
        label-width="180px"
        :model="postData"
        ref="xiaoe"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('支付客服')" :rules="commonRule.notNull">
              {{ postData.name }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')" :rules="commonRule.notNull" prop="available">
              <el-radio v-model="postData.available" :label="1">{{ $t('开启') }}</el-radio>
              <el-radio v-model="postData.available" :label="0">{{ $t('禁用') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员组')" :rules="commonRule.notNull" prop="group">
              <el-radio v-model="postData.group" :label="0">{{ $t('全选') }}</el-radio>
              <el-radio v-model="postData.group" :label="1">{{ $t('自定义') }}</el-radio>
            </el-form-item>
            <ul v-if="postData.group == 1">
              <el-checkbox-group v-model="postData.groupList" style="display: flex; flex-wrap: wrap">
                <li v-for="(item, i) in groupLists" :key="i" style="padding: 3px">
                  <el-checkbox :label="item.id.toString()">{{ item.value }}</el-checkbox>
                </li>
              </el-checkbox-group>
            </ul>
          </el-col>

        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="closeXiaoe('xiaoe')" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="addXiaoeSubmit()" v-if="hasPermission('setting:onlinepay:paytype')">{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
    <!--启用按钮-->
    <Overlay v-show="closeNoteShow"></Overlay>
    <div v-show="closeNoteShow" class="bank-dialog">
      <div class="bank-dialog-header">{{ $t('提示') }}<i class="el-icon-close" @click="closeNote"></i></div>
      <div class="bank-dialog-content">
        <span>{{ noteContent }}</span>
      </div>
      <div class="bank-dialog-button">
        <el-button class="left-btn" @click.native="closeNote" size="small">{{ $t('取消') }}</el-button>
        <el-button class="right-btn" type="primary" size="small" @click.native="toggleSubmit">{{
          $t('确定')
        }}</el-button>
      </div>
    </div>
    <!--删除按钮-->
    <el-dialog class="delete-dialog" :title="$t('提示')" :visible.sync="deleteNoteShow">
      <div>
        <span>{{ noteContent }}</span>
      </div>
      <div class="div-submit-btn">
        <el-button @click.native="deleteNoteShow = false" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" size="small" @click.native="deleteSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 管理的弹窗 -->
    <el-dialog
      :title="$t('管理')"
      :visible.sync="tration"
      width="30%">

      <el-form ref="form" label-width="225px">
        <el-form-item :label="item.name" v-for="(item, index) in onlineManageList" :key="item.id">
            <el-radio-group v-model="manageList[index]">
              <el-radio :label="1">{{ $t('热门') }}</el-radio>
              <el-radio :label="2">{{ $t('推荐') }}</el-radio>
              <el-radio :label="3">{{ $t('不显示') }}</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="tration = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitOnlineMange">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import systemConfig from '../../config/config.js'
import Overlay from '../../components/Overlay.vue'
import BankList from './BankList'
import MemberGroupChecker from './MemberGroupChecker'
import { mapGetters } from 'vuex'
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: 'payList',
  data() {
    return {
      toggle: null,
      bankOrder: '', // desc降序  asc升序
      xianhongOrder: '',
      timeOrder: '',
      statusOrder: 'desc',
      typeOrder: '',
      channelOrder: '',
      activeName: 'first',
      total: 0,
      firstTableDataList: [],
      secondTableDataList: [],
      thirdTableDataList: [],
      fourthTableDataList: [],
      fifthTableDataList: [],
      sixthTableDataList: [],
      addBankcardShow: false,
      addPlatformShow: false,
      shortcutPayList: [],
      bankList: {
        'CN': [],
        'AUD': [],
        'MY': [],
      },
      bankTypeList: [
        {
          label: this.$t('中国'),
          value: 'CN'
        },
        {
          label: this.$t('澳洲'),
          value: 'AUD'
        },
        {
          label: this.$t('马来西亚'),
          value: 'MY'
        },
        {
          label: this.$t('越南'),
          value: 'VN'
        },
        {
          label: this.$t('菲律宾'),
          value: 'PH'
        },
        {
          label: this.$t('印尼'),
          value: 'ID'
        },
      ],
      postData: {
        feeWay: 1,
        available: 1,
        amountType: 0,
        feeFixed: null,
        devSource: [],
        areaCode: 'CN',
      },
      commonRule: systemConfig.rules.commonRule,
      bankAddRule: systemConfig.rules.bankAddRule,
      sortItem: '', // value = "银行   1 按银行名称排序，2 按限红排序 3 按时间排序   线上  value = "1 按类型排序，2 按渠道排序 3 按限红排序 4 按时间排序
      sortBy: '',
      noteContent: '',
      closeNoteShow: false,
      deleteBankcardBool: false, // 删除操作
      rowData: '',
      deleteNoteShow: false,
      baseUrl: systemConfig.urls.bankpayList,
      addPayTypeShow: false,
      addQrcodePayShow: false,
      addCrPayShow: false,
      addXiaoeShow: false,
      groupLists: [],
      dialogTitle: '',
      crPayTypeList: [],
      qrcodePayTypeList: [],
      payments: [
        { id: 1, label: 'QQ' },
        { id: 2, label: this.$t('微信') },
        { id: 3, label: this.$t('京东') },
        { id: 4, label: this.$t('网银支付') },
        { id: 5, label: this.$t('支付宝') },
        { id: 7, label: this.$t('快捷支付') },
        { id: 8, label: this.$t('银联扫码') },
        { id: 11, label: this.$t('银行卡') },
        { id: 14, label: this.$t('银行卡转卡') },
        { id: 16, label: this.$t('聚合支付') },
        { id: 17, label: 'EBPAY' },
        { id: 18, label: 'TOPAY' },
        { id: 19, label: this.$t('极速存款JSPAY') },
        { id: 20, label: this.$t('数字人民币') },
        { id: 21, label: 'EeziePay' },
        { id: 22, label: this.$t('钱包转账') },
        { id: 23, label: this.$t('电子钱包') },
        { id: 26, label: 'GOPAY' },
        { id: 27, label: 'TELCO PIN' },
      ],
      bankOptions: [],
      paymentPlatforms: '',
      paymentPlatformsList: [],
      checked: true,
      alipayFlgList: [
        { alipayFlgName: this.$t('银行卡转卡'), value: '0' },
        { alipayFlgName: this.$t('支付宝转卡'), value: '1' },
        { alipayFlgName: this.$t('数字人民币'), value: '2' },
        { alipayFlgName: this.$t('电子钱包'), value: '3' }
      ],
      crPayTypeListKeys: [],
      curCrPayTypeList: [],
      showBsb: false,
      notShowBankBranch: false,
      // 管理弹窗Manage
      tration: false,
      // 单选按钮
      option: 9,
      onlineManageList: [],
      manageList: [],
      recodeManageList: [],
      realNameRule: {
        'CN': systemConfig.rules.commonRule.realNameContainEnglishAndVietnamName,
        'AUD': systemConfig.rules.commonRule.realNameAustrlia,
        'MY': systemConfig.rules.commonRule.realNameAustrlia
      },
      bankAccountRule: {
        'CN': systemConfig.rules.bankAddRule.account,
        'AUD': systemConfig.rules.bankAddRule.bankAccountAstBank,
        'MY': systemConfig.rules.bankAddRule.bankAccountAstBank
      },
      amountSType: [],
      tableTimer: null
    }
  },
  computed: {
    ...mapGetters(['hasPermission']),
    fixedAmountRules() {
      return [{ required: true, message: this.$t('请输入固定金额'), trigger: 'blur' }, { validator: (rule, value, callback) => {
        if (value && /[^0-9\.,]/g.test(value)) {
          return callback(this.$t('请输入数字'))
        }
        callback()
      }
      }]
    },
    tabList() {
    const tabs = [
      {
        name: 'first',
        label: this.$t('银行卡'),
        permission: 'setting:company:list'
      },
      {
        name: 'second',
        label: this.$t('自动入款平台'),
        permission: 'setting:fastPay:list'
      },
      {
        name: 'third',
        label: this.$t('线上支付'),
        permission: 'setting:onlinepay:list'
      },
      {
        name: 'fourth',
        label: this.$t('普通扫码支付'),
        permission: 'setting:qrcodepay:list'
      },
      {
        name: 'fifth',
        label: this.$t('加密货币'),
        permission: 'setting:cryptocurrencies:list'
      },
      {
        name: 'sixth',
        label: this.$t('小额客服线'),
        permission: 'setting:cryptocurrencies:list'
      },
    ]
    return tabs.filter(item => this.hasPermission(item.permission))
  },
  shouldCidShow() {
    const item = this.shortcutPayList.find(item => item.id === this.postData.payId)
    return item && [9, 10, 13].includes(item.paymentType)
  },
  PCBankOptions() {
    return this.bankOptions.filter(item => item.clientType === 1 || item.clientType === 3)
  },
  H5BankOptions() {
    return this.bankOptions.filter(item => item.clientType === 2 || item.clientType === 3)
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
  bankTypeCN() {
    return this.postData.areaCode === 'CN'
  },
   numLimit () { // 开户帐号长度限制
      // 中国 19 ， 马来/澳洲 60
      return ['CN'].includes(this.postData.areaCode) ? 19 : 60
    }
  },
  components: {
    Overlay, BankList, MemberGroupChecker
  },
  created() {
    this.getGroupLists()
  },
  mounted() {
    if (this.tabList.length) {
      this.handleClick(this.tabList[0])
    }

    this.getPaymentPlatforms()
    this.getShortcutPayList()
    this.getCrPayTypeList()
    this.getQrcodePayTypeList()

    this.initBankList()
    //this.getData()
  },
  watch: {
    postData: {
      handler (val) {
        if(val.payId===15){
          this.postData.alipayFlg='0'
        }
        this.notShowBankBranch = val.bankName === 'PAYID'
        this.showBsb = val.bankName === this.$t('银行账户')
        if (val.areaCode !== 'MY') {
          delete this.postData.province
          delete this.postData.city
        }
      },
      deep: true
    },
    'postData.areaCode' (val, old) {
      if ( this.dialogTitle === this.$t('新增银行卡') || val !== old) {
        this.postData.areaCode && this.$set(this.postData, 'bankName', this.bankList[this.postData.areaCode][0].bankName)
      }
      switch (val) {
        case 'CN': {
          this.setCN()
          break
        }
        case 'AUD': {
          this.setAud()
          break
        }
        case 'MY': {
          this.setMY()
          break
        }
      }
    },
    showBsb(val) {
      this.$set(this.bankAccountRule, 'AUD', val ? this.bankAddRule.bankAccountAstBank : this.bankAddRule.ausAccount)
    }
  },
  methods: {
    beforeLogoUpload(files) {
      console.log('files---', files)
    },
    async initBankList() {
      await this.fnbankcard('CN')
      await this.fnbankcard('AUD')
      await this.fnbankcard('MY')
      await this.fnbankcard('VN')
      await this.fnbankcard('PH')
      await this.fnbankcard('ID')
      if(this.postData.areaCode) this.postData.bankName = this.bankList[this.postData.areaCode][0].bankName
    },
    getCrPayTypeList() {
      this.$axios
        .get(systemConfig.urls.crTypeList)
        .then(res => {
          const data = res.data.data
          this.crPayTypeListKeys = Object.keys(data) || []
          this.crPayTypeList = data
        })
    },
    handleCrPayTypeKey(key) {
      // if (!key) {
      //   this.$set(this.postData, 'bankIds', '')
      //   this.curCrPayTypeList = []
      // }
      this.$set(this.postData, 'bankIds', '')
      this.curCrPayTypeList = []
      if (key) {
        this.curCrPayTypeList = this.crPayTypeList[key]
      }
    },
    getQrcodePayTypeList() {
      this.$axios
        .get(systemConfig.urls.qrTypeList)
        .then(({ data }) => {
          this.qrcodePayTypeList = data.data
        })
    },
    handlePayUploadImage({ file }) {
      if (/^image/.test(file.type)) {
        const formData = new FormData()
        formData.append('uploadFile', file)
        this.$axios.post(systemConfig.urls.uploadImage, formData)
          .then(({ data }) => {
            this.$forceUpdate()
            this.postData.logoUrl = data.path
          })
      } else {
        this.$message.error(this.$t('文件格式错误，只支持图片！'))
      }
    },
    handleBankUploadImage({ file }) {
      if (/^image/.test(file.type)) {
        const formData = new FormData()
        formData.append('uploadFile', file)
        this.$axios.post(systemConfig.urls.uploadImage, formData)
          .then(({ data }) => {
            this.$forceUpdate()
            this.postData.logoUrl = data.path
          })
      } else {
        this.$message.error(this.$t('文件格式错误，只支持图片！'))
      }
    },
    handleUploadImage({ file }) {
      if (/^image/.test(file.type)) {
        const formData = new FormData()
        formData.append('uploadFile', file)
        this.$axios.post(systemConfig.urls.uploadImage, formData)
          .then(({ data }) => {
            this.postData.qrImgUrl = data.path
          })
      } else {
        this.$message.error(this.$t('文件格式错误，只支持图片！'))
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
    toggleIsJump(rowData) {
      this.rowData = rowData
      const { id, isJump } = rowData
      this.$axios.post(systemConfig.urls.onlineUpdateJump, { id, isJump }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success(this.$t('操作成功'))
        } else {
          this.rowData.isJump = isJump === 0 ? 1 : 0
        }
      }).catch((error) => {
        this.rowData.isJump = isJump === 0 ? 1 : 0
      })
      },
      togglestate(rowData) {
      this.toggle = 1
      this.rowData = rowData
      // rowData里面的值已经变了
      this.closeNoteShow = true
      if (!rowData.available) {
        this.noteContent = {
          first: this.$t('是否禁用该银行卡！'),
          second: this.$t('是否禁用该银行卡！'),
          third: this.$t('是否禁用该支付类型！'),
          fourth: this.$t('是否禁用该二维码！'),
          fifth: this.$t('是否禁用该加密货币！'),
          sixth: this.$t('是否禁用该小额客服线！'),
        }[this.activeName]
      } else {
        this.noteContent = this.$t('启用后将恢复之前配置的会员组！')
      }
    },
    toggleIsRecommend(rowData) {
      this.toggle = 2
      this.rowData = rowData
      // rowData里面的值已经变了
      this.closeNoteShow = true
      if (rowData.isRecommend === false) {
        this.noteContent = this.$t('是否禁用推荐！')
      } else {
        this.noteContent = this.$t('启用后将恢复之前的推荐配置！')
      }
    },
    toggleIsHot(rowData) {
      this.toggle = 3
      this.rowData = rowData
      // rowData里面的值已经变了
      this.closeNoteShow = true
      if (rowData.isHot === false) {
        this.noteContent = this.$t('是否禁用热门！')
      } else {
        this.noteContent = this.$t('启用后将恢复之前的热门配置！')
      }
    },
    // toggleSafari (rowData) {
    //   this.rowData = rowData
    //   // rowData里面的值已经变了
    //   this.$axios.post(systemConfig.urls.updateSafariStatus, {id: this.rowData.id, available: this.rowData.available,isRecommend:this.rowData.isRecommend,isHot:this.rowData.isHot}).then((res) => {
    //     if (res.data.msg === 'success') {
    //       this.$message({
    //         type: 'success',
    //         message: '操作成功'
    //       })
    //       this.closeNoteShow = false
    //     }
    //   }).catch((error) => {
    //     this.rowData.available = this.rowData.available === 0 ? 1 : 0
    //   })
    // },
    closeNote() {
      // toggle还原
      if (this.toggle === 1) {
        this.rowData.available = this.rowData.available === 0 ? 1 : 0
      }
      if (this.toggle === 2) {
        this.rowData.isRecommend = this.rowData.isRecommend === false ? true : false
      }
      if (this.toggle === 3) {
        this.rowData.isHot = this.rowData.isHot === false ? true : false
      }
      this.closeNoteShow = false
    },
    toggleSubmit() {
      const url = {
        first: systemConfig.urls.changeBankcardStatus,
        second: systemConfig.urls.changePlatformStatus,
        third: systemConfig.urls.onlinePayupdateStatus,
        fourth: systemConfig.urls.qrCodeAvailable,
        fifth: systemConfig.urls.crAvailable,
        sixth: systemConfig.urls.lineServiceUpdate,
      }[this.activeName]

        this.$axios.post(url, { id: this.rowData.id, available: this.rowData.available, isRecommend: this.rowData.isRecommend, isHot: this.rowData.isHot }).then((res) => {
          if (res.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: this.$t('操作成功')
            })
            this.closeNoteShow = false
          }
        }).catch((error) => {
          this.rowData.available = this.rowData.available === 0 ? 1 : 0
        })
      },
    editBankcard(rowData) {
      this.dialogTitle = this.$t('编辑银行卡')
      this.$axios.get(systemConfig.urls.companyDepositInfo + rowData.id).then((res) => {
        if (res.data.data) {
          res.data.data.groupIds = res.data.data.groupIds || []
          this.postData = res.data.data
          this.addBankcardShow = true
        }
      })
    },
    editPlatform(rowData) {
      this.dialogTitle = this.$t('编辑自动入款平台')
      this.$axios.get(systemConfig.urls.autoIncomeInfo, { params: { id: rowData.id } }).then((res) => {
        if (res.data.data) {
          res.data.data.groupIds = res.data.data.groupIds || []
          this.postData = res.data.data
          this.addPlatformShow = true
        }
      })
    },
    editPayType(rowData) {
      this.dialogTitle = this.$t('编辑支付类型')
      this.$axios.get(systemConfig.urls.onlinePayInfo + rowData.id).then((res) => {
        if (res.data.data) {
          res.data.data.groupIds = res.data.data.groupIds || []
         
          // 限额模式 amountType: 0：单笔限额， 1:固定金额， 2: 单笔限额 + 固定金额（全选）
          const { amountType } = res.data.data
          const amountSType = amountType === 2 ? [0, 1] : [amountType]
          this.postData = {
            ...res.data.data,
            amountType: amountSType
          }

          this.paymentPlatformsList = this.paymentPlatforms[this.postData.paymentType]
          this.postData.devSource = this.postData.devSource.split(',')
          // this.terminalTypeChange(this.postData.payName)
          this.addPayTypeShow = true
          
        }
      })
    },
    editQrcodePay(rowData) {
      this.dialogTitle = this.$t('编辑扫码支付')
      this.$axios.get(systemConfig.urls.qrCodePayInfo, {
        params: {
          id: rowData.id,
        },
      }).then((res) => {
        if (res.data.data) {
          res.data.data.groupIds = res.data.data.groupIds || []
          this.postData = res.data.data
          this.addQrcodePayShow = true
        }
      })
    },
    editCrPay(rowData) {
      this.dialogTitle = this.$t('编辑加密货币')
      this.$axios.get(systemConfig.urls.crPayInfo, {
        params: {
          id: rowData.id,
        },
      }).then((res) => {
        if (res.data.data) {
          const { category, bankCode } = rowData

          res.data.data.groupIds = res.data.data.groupIds || []
          this.handleCrPayTypeKey(bankCode)
          // 限额模式 amountType: 0：单笔限额， 1:固定金额， 2: 单笔限额 + 固定金额（全选）
          const { amountType } = res.data.data
          const amountSType = amountType === 2 ? [0, 1] : [amountType]

          console.log('category===', category)
          console.log('bankCode===', bankCode)
          console.log('this.curCrPayTypeList===', this.curCrPayTypeList)
          const protocol = this.curCrPayTypeList.find(item => item.category === category && item.bankCode === bankCode)
          this.postData = {
            ...res.data.data,
            amountType: amountSType,
            // bankIds: res.data.data.bankIds[0]
            bankIds: protocol.id
          }

          this.postData.devSource = this.postData.devSource && this.postData.devSource.split(',')

          this.addCrPayShow = true
        }
      })
    },
    deleteBankcard(rowData) {
      this.rowData = rowData
      this.deleteNoteShow = true
      this.noteContent = this.$t('是否删除该银行卡！')
    },
    deletePlatform(rowData) {
      this.rowData = rowData
      this.deleteNoteShow = true
      this.noteContent = this.$t('是否删除该平台！')
    },
    deletePayType(rowData) {
      this.rowData = rowData
      this.deleteNoteShow = true
      this.noteContent = this.$t('是否删除该支付类型！')
    },
    deleteQrcodePay(rowData) {
      this.rowData = rowData
      this.deleteNoteShow = true
      this.noteContent = this.$t('是否删除该扫码支付！')
    },
    deleteCrPay(rowData) {
      this.rowData = rowData
      this.deleteNoteShow = true
      this.noteContent = this.$t('是否删除该加密货币！')
    },
    deleteSubmit() {
      let url = null
      switch (this.activeName) {
        case 'first':
          url = systemConfig.urls.deleteBankCard + this.rowData.id
          break
        case 'second':
          url = systemConfig.urls.autoIncomeDeletePlatform
          break
        case 'third':
          url = systemConfig.urls.onlinePayDelete + this.rowData.id
          break
        case 'fourth':
          url = systemConfig.urls.qrCodeDelete
          break
        case 'fifth':
          url = systemConfig.urls.crDelete
          break
      }
      this.$axios.get(url, { params: { id: this.rowData.id } }).then((res) => {
        if (res.data.msg === 'success') {
          this.$message({
            type: 'success',
            message: this.$t('操作成功')
          })
          this.deleteNoteShow = false
          this.getData()
        }
      })
    },
    // 获取中国开户银行list
    async fnbankcard(areaCode) {
      await this.$axios.post(systemConfig.urls.bankList, { areaCode }).then((res) => {
        const arr = []
        res.data.banks.map((value) => {
          arr.push({ id: value.id, bankName: value.bankName })
        })
        this.$set(this.bankList, areaCode, arr)
      })
    },
    feeChange(val) {
      if (val) {
        // 0-->1 比例--》固定
        this.postData.feeScale = ''
        this.postData.feeTop = ''
      } else {
        this.postData.feeFixed = 0
      }
    },
    getData() {
      // pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo+ '
      this.$store.state.searchLoading = true
      let url = '?&sortItem=' + this.sortItem + '&sortBy='
      if (this.activeName === 'first') {
        switch (this.sortItem) {
          case 1:
            url += this.bankOrder
            break
          case 2:
            url += this.xianhongOrder
            break
          case 3:
            url += this.timeOrder
            break
          case 5:
            url += this.statusOrder
            break
        }
      }
      if (this.activeName === 'second') {
        switch (this.sortItem) {
          case 1:
            url += this.typeOrder
            break
          case 2:
            url += this.xianhongOrder
            break
          case 3:
            url += this.timeOrder
            break
          case 5:
            url += this.statusOrder
            break
        }
      }
      if (this.activeName === 'third') {
        switch (this.sortItem) {
          case 1:
            url += this.typeOrder
            break
          case 2:
            url += this.channelOrder
            break
          case 3:
            url += this.xianhongOrder
            break
          case 4:
            url += this.timeOrder
            break
          case 5:
            url += this.statusOrder
            break
        }
      }
      if (this.activeName === 'fourth') {
        switch (this.sortItem) {
          case 1:
            url += this.typeOrder
            break
          case 2:
            url += this.channelOrder
            break
          case 3:
            url += this.xianhongOrder
            break
          case 4:
            url += this.timeOrder
            break
          case 5:
            url += this.statusOrder
            break
        }
      }
      if (this.activeName === 'fifth') {
        switch (this.sortItem) {
          case 5:
            url += this.statusOrder
            break
        }
      }
      this.getTableList(url)
    },
    getTableList(url) {
      if (this.tableTimer) clearTimeout(this.tableTimer)
      this.tableTimer = setTimeout(() => {
        this.getCurrentRecodeTime()
        this[this.activeName + 'TableDataList'] = []
        this.$axios.get(this.baseUrl + url).then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          let arr = res.data.data.map(item => {
            item.available = item.available ? 1 : 0
            item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
            return item
          })
          this[this.activeName + 'TableDataList'] = arr
        })
      }, 500)
    },
    getShortcutPayList() {
      this.$axios.get(systemConfig.urls.onlinePayShortcutPayList).then((res) => {
        this.shortcutPayList = res.data.data
      })
    },
    getPaymentPlatforms() {
      this.$axios.get(systemConfig.urls.onlinePayListList).then((res) => {
        this.paymentPlatforms = res.data.data
        this.payments = this.payments.filter(item => this.paymentPlatforms[item.id] && this.paymentPlatforms[item.id].length > 0)
      })
    },
    payTypeChange(value) {
      this.postData.payName = ''
      this.postData.platfromName = ''
      this.postData.platfromCode = ''
      this.postData.terminalType = ''
      this.postData.baseBanks = ''
      this.bankOptions = []
      this.password = ''
      if (this.paymentPlatforms) {
        this.paymentPlatformsList = this.paymentPlatforms[value]
      }
    },
    crXyTypeChange(value) {
      this.postData.devSource = ['0', '3']
    },
    terminalTypeChange(value) {
      if (this.paymentPlatformsList.length > 0) {
        this.paymentPlatformsList.forEach((item => {
          if (value == item.platfromName) {
            this.postData.terminalType = item.terminalType
            if (item.terminalType === 1) {
              this.postData.devSource = ['0']
            } else if (item.terminalType === 2) {
              this.postData.devSource = ['3']
            } else {
              this.postData.devSource = ['0', '3']
            }
            this.postData.platfromCode = item.platfromCode
            this.bankOptions = item.baseBanks
            this.postData.payId = item.id
          }
        }))
      }
      this.$forceUpdate()
    },
    closeBankcard(formName) {
      this.addBankcardShow = false
      this.resetForm(formName)
    },
    closePlatform(formName) {
      this.addPlatformShow = false
      this.resetForm(formName)
    },
    closePayType(formName) {
      this.addPayTypeShow = false
      this.resetForm(formName)
    },
    closeQrcodePay(formName) {
      this.addQrcodePayShow = false
      this.resetForm(formName)
    },
    closeCrPay(formName) {
      this.addCrPayShow = false
      this.resetForm(formName)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    resetPagenation() {
      this.listReq.pageNo = 1
      this.listReq.pageSize = 10
    },
    handleClick(tab, event) {
      this.resetOrder()
      this.sortItem = ''
      this.statusOrder = 'desc'
      switch (tab.name) {
        case 'first':
          this.activeName = 'first'
          this.baseUrl = systemConfig.urls.bankpayList
          this.sortItem = 5
          this.getData()
          break
        case 'second':
          this.activeName = 'second'
          this.baseUrl = systemConfig.urls.autoIncomeList
          this.sortItem = 5
          this.getData()
          break
        case 'third':
          this.activeName = 'third'
          this.baseUrl = systemConfig.urls.onlinePayList
          this.sortItem = 5
          this.getData()
          break
        case 'fourth':
          this.activeName = 'fourth'
          this.baseUrl = systemConfig.urls.qrCodePayList
          this.sortItem = 5
          this.getData()
          break
        case 'fifth':
          this.activeName = 'fifth'
          this.baseUrl = systemConfig.urls.crPayList
          this.sortItem = 5
          this.getData()
          break
        case 'sixth':
          this.activeName = 'sixth'
          this.baseUrl = systemConfig.urls.lineService
          this.getData()
          break
      }
    },
    addBankcard() {
      this.addBankcardShow = true
      this.dialogTitle = this.$t('新增银行卡')
      this.postData = {
        areaCode: 'CN',
        feeWay: 1,
        available: 1,
        isHot: false,
        isRecommend: false,
        certType: 1,
        feeFixed: null,
        devSource: []
      }
    },
    addPlatform() {
      this.addPlatformShow = true
      this.dialogTitle = this.$t('新增自动入款平台')
      this.postData = {
        feeWay: 1,
        available: 1,
        isHot: false,
        isRecommend: false,
        certType: 1,
        amountType: 0,
        feeFixed: null,
      }
    },
    addPayType() {
      this.addPayTypeShow = true
      this.dialogTitle = this.$t('新增支付类型')
      this.bankOptions = []
      this.postData = {
        feeWay: 1,
        available: 1,
        isHot: false,
        isRecommend: false,
        certType: 1,
        isJump: 1,
        amountType: [0],
        feeFixed: null,
        devSource: [],
      }
    },
    addQrcodePay() {
      this.addQrcodePayShow = true
      this.dialogTitle = this.$t('新增扫码类型')
      this.postData = {
        feeWay: 1,
        qrImgUrl: '',
        available: 1,
        isHot: false,
        isRecommend: false,
        amountType: 0,
        feeFixed: null,
        bankIds: [],
      }
    },
    addCrPay() {
      this.addCrPayShow = true
      this.dialogTitle = this.$t('新增加密货币')
      this.postData = {
        merNo: null,
        available: 1,
        isHot: false,
        isRecommend: false,
        minAmout: null,
        bankIds: [],
        amountType: [0],
      }
    },
    // 银行卡
    addBankCardSubmit() {
      this.$refs.bankcard.validate(valid => {
        if (valid) {
          if (!this.postData.bankName) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择开户银行')
            })
            return
          } else if (this.postData.groupIds.length == 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择会员组')
            })
            return
          } else {
            this.bankList[this.postData.areaCode].forEach((item) => {
              if (item.bankName === this.postData.bankName) {
                this.postData.bankId = item.id
              }
            })
            delete this.postData.devSource
            this.$store.state.fullscreenLoading = true
            let url = this.postData.id ? systemConfig.urls.updateBankCard : systemConfig.urls.saveBankCard
            this.$axios.post(url, this.postData).then((res) => {
              this.getData()
              this.closeBankcard('bankcard')
            })
          }
        }
      })
    },
    addPlatformSubmit() {
      let isPlatformValid = false
      let bankListValidateResult = null
      if (this.$refs.bankList) {
        this.$refs.bankList.validate(result => {
          bankListValidateResult = result
        })
      }
      this.$refs.platform.validate(valid => {
        isPlatformValid = valid
      })
      if (this.postData.groupIds.length == 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择会员组')
        })
        return
      }
      if (this.postData.alipayFlg === '1' && bankListValidateResult && bankListValidateResult.length > 1) {
        this.$message.warning(this.$t('支付宝转卡显示方式仅支持添加一张银行卡！'))
        return
      }
      if (isPlatformValid && bankListValidateResult) {
        let url = this.postData.id ? systemConfig.urls.autoIncomeUpdatePlatform : systemConfig.urls.autoIncomeSavePlatform
        this.$axios.post(url, {
          ...this.postData,
          deposits: bankListValidateResult
        }).then((res) => {
          this.getData()
          this.closePlatform('platform')
        })
      } else if (isPlatformValid) {
        // delete this.postData.alipayFlg
        let url = this.postData.id ? systemConfig.urls.fastDepositWithdrawUpdate : systemConfig.urls.fastDepositWithdrawSave
        this.$axios.post(url, { ...this.postData }).then((res) => {
          if (res.data.code === 0) {
            this.$message.success(this.$t('操作成功！'))
            this.getData()
            this.closePlatform('platform')
          }
        })
      }
    },
    addPayTypeSubmit() {
      this.$refs.paytype.validate(valid => {
        if (valid) {
          if (!this.postData.paymentType) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择支付类型')
            })
            return
          } else if (!this.postData.platfromCode) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择支付平台')
            })
          } else if (this.postData.devSource.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择显示终端')
            })
          } else if (this.postData.groupIds.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择会员组')
            })
          } else {
            this.$store.state.fullscreenLoading = true
            this.postData.devSource = this.postData.devSource.join(',')
            const amountType = this.postData.amountType.length === 1 ? this.postData.amountType[0] : 2
            let url = this.postData.id ? systemConfig.urls.onlinePayUpdate : systemConfig.urls.onlinePaySave
            this.$axios.post(url, {...this.postData, amountType }).then(() => {
              this.getData()
              this.closePayType('paytype')
            })
          }
        }
      })
    },
    addQrcodePaySubmit() {
      this.$refs.qrcodePay.validate(valid => {
        if (valid) {
          if (this.postData.groupIds.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择会员组')
            })
          } else {
            const { postData } = this
            this.$store.state.fullscreenLoading = true
            let url = postData.id ? systemConfig.urls.qrCodeUpdate : systemConfig.urls.qrCodeSave
            this.$axios.post(url, postData).then((res) => {
              this.getData()
              this.closeQrcodePay('qrcodePay')
            })
          }
        }
      })
    },
    addCrPaySubmit() {
      this.$refs.crPay.validate(valid => {
        if (valid) {
          if (this.postData.groupIds.length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('请选择会员组')
            })
          } else {
            const { postData } = this
            this.$store.state.fullscreenLoading = true
            let url = postData.id ? systemConfig.urls.crUpdate : systemConfig.urls.crSave
            const amountType = this.postData.amountType.length === 1 ? this.postData.amountType[0] : 2
            const devSource = this.postData.devSource.join(',')
            const params = {
              ...postData,
              bankIds: [postData.bankIds],
              amountType,
              devSource,
            }
            this.$axios.post(url, params).then((res) => {
              this.getData()
              this.closeCrPay('crPay')
            })
          }
        }
      })
    },
    resetOrder() {
      this.bankOrder = '' // desc降序  asc升序
      this.xianhongOrder = ''
      this.timeOrder = ''
      this.typeOrder = ''
      this.channelOrder = ''
      this.postData = {}
    },
    bankOrderClick() {
      switch (this.activeName) {
        case 'first':
          this.sortItem = 1
          break
      }
      // 置空其他排序
      this.xianhongOrder = ''
      this.timeOrder = ''
      this.typeOrder = ''
      this.channelOrder = ''
      this.statusOrder = ''
      if (!this.bankOrder) {
        this.bankOrder = 'asc'
      } else if (this.bankOrder === 'asc') {
        this.bankOrder = 'desc'
      } else if (this.bankOrder === 'desc') {
        this.bankOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    xianhongOrderClick() {
      switch (this.activeName) {
        case 'first':
          this.sortItem = 2
          break
        case 'second':
          this.sortItem = 2
          break
        case 'third':
          this.sortItem = 3
          break
        case 'fourth':
          this.sortItem = 3
          break
      }
      // 置空其他排序
      this.bankOrder = '' // desc降序  asc升序
      this.timeOrder = ''
      this.typeOrder = ''
      this.channelOrder = ''
      this.statusOrder = ''
      if (!this.xianhongOrder) {
        this.xianhongOrder = 'asc'
      } else if (this.xianhongOrder === 'asc') {
        this.xianhongOrder = 'desc'
      } else if (this.xianhongOrder === 'desc') {
        this.xianhongOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    timeOrderClick() {
      switch (this.activeName) {
        case 'first':
          this.sortItem = 3
          break
        case 'second':
          this.sortItem = 3
          break
        case 'third':
          this.sortItem = 4
          break
        case 'fourth':
          this.sortItem = 4
          break
      }
      // 置空其他排序
      this.bankOrder = '' // desc降序  asc升序
      this.xianhongOrder = ''
      this.typeOrder = ''
      this.channelOrder = ''
      this.statusOrder = ''
      if (!this.timeOrder) {
        this.timeOrder = 'asc'
      } else if (this.timeOrder === 'asc') {
        this.timeOrder = 'desc'
      } else if (this.timeOrder === 'desc') {
        this.timeOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    statusOrderClick() {
      this.sortItem = 5
      // 置空其他排序
      this.bankOrder = '' // desc降序  asc升序
      this.xianhongOrder = ''
      this.typeOrder = ''
      this.channelOrder = ''
      this.timeOrder = ''
      if (!this.statusOrder) {
        this.statusOrder = 'asc'
      } else if (this.statusOrder === 'asc') {
        this.statusOrder = 'desc'
      } else if (this.statusOrder === 'desc') {
        this.statusOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    typeOrderClick() {
      switch (this.activeName) {
        case 'second':
          this.sortItem = 1
          break
        case 'third':
          this.sortItem = 1
          break
        case 'fourth':
          this.sortItem = 1
          break
      }
      this.bankOrder = '' // desc降序  asc升序
      this.xianhongOrder = ''
      this.timeOrder = ''
      this.channelOrder = ''
      this.statusOrder = ''
      if (!this.typeOrder) {
        this.typeOrder = 'asc'
      } else if (this.typeOrder === 'asc') {
        this.typeOrder = 'desc'
      } else if (this.typeOrder === 'desc') {
        this.typeOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    channelOrderClick() {
      switch (this.activeName) {
        case 'third':
          this.sortItem = 2
          break
      }
      this.bankOrder = '' // desc降序  asc升序
      this.xianhongOrder = ''
      this.timeOrder = ''
      this.typeOrder = ''
      if (!this.channelOrder) {
        this.channelOrder = 'asc'
      } else if (this.channelOrder === 'asc') {
        this.channelOrder = 'desc'
      } else if (this.channelOrder === 'desc') {
        this.channelOrder = ''
        this.sortItem = ''
      }
      this.getData()
    },
    transfer(type) {
      const payment = this.payments.find(item => item.id === type)
      if (payment) {
        return payment.label
      } else {
        return ''
      }
    },
    transfer2(list) {
      let tempList = []
      if (list && list.length > 0) {
        list.map((item) => {
          if (item) {
            tempList.push(item.groupName)
          }
        })
      }
      return tempList.join()
    },
    transfer3(str) {
      let arr = str ? (str.split(',')) : [], tempList = []
      arr.map(ws => {
        this.groupLists.map(w => {
          if (ws == w.id) {
            tempList.push(w.value)
          }
        })
      })
      return tempList.join(',')
    },
    transferBankCardList(list = []) {
      return list.map(item => {
        return `${item.bankName}(${item.realName})`
      }).join('、')
    },
    getGroupLists() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        resp.data.page.forEach((value) => {
          this.groupLists.push({ id: value.id, value: value.groupName })
        })
      })
    },
    editXiaoe(row) {
      let obj = Object.assign({ groupList: [] }, row)
      obj.group = obj.groupIds ? (obj.groupIds.split(',').length === this.groupLists.length ? 0 : 1) : null
      obj.groupList = (obj.group === 0 || !obj.group) ? [] : (obj.groupIds.split(','))
      this.postData = Object.assign({}, obj)
      this.addXiaoeShow = true
      this.dialogTitle = this.$t('编辑')
    },
    closeXiaoe(formName) {
      this.addXiaoeShow = false
      this.resetForm(formName)
    },
    addXiaoeSubmit() {
      this.$refs.xiaoe.validate(valid => {
        if (valid) {
          this.postData.groupIds = []
          if (this.postData.group == 0) {
            this.groupLists.map(ws => {
              this.postData.groupIds.push(ws.id)
            })
          } else {
            this.postData.groupList.map(ws => {
              this.postData.groupIds.push(ws)
            })
          }
          this.postData.groupIds = this.postData.groupIds.join(',')
          this.$axios.post(systemConfig.urls.lineServiceUpdate, this.postData).then((res) => {
            if (res.data.code === 0) {
              this.$message.success(this.$t('编辑成功！'))
              this.getData()
            }
          }).finally(() => {
            this.closeXiaoe('xiaoe')
          })
        }
      })
    },
      // 管理弹窗
    getAllPaylist () {
      this.$store.state.fullscreenLoading = true
      this.$axios.get(systemConfig.urls.getALLPayTypelist).then((resp) => {
        this.$store.state.fullscreenLoading = false
        const { code, data } = resp.data
        if (code === 0) {
          this.tration = true
          const filterCodeArr = ['ebayPayList', 'topPayList', 'otherPayList']
          let filterArr = []
          data.map(item => {
            if (!filterCodeArr.includes(item.code)) {
              filterArr.push(item)
            }
          })
          let arr = JSON.parse(JSON.stringify(filterArr));
          this.manageList = []
          arr.map((item, index) => {
            item.selfCode = item.code
            this.manageList[index] = item.isHot ? 1 : (item.isRecommend ? 2 : 3)
          })
          this.onlineManageList = filterArr
          this.recodeManageList = JSON.parse(JSON.stringify(this.manageList));
        }
      })
      .finally(() => {
        this.$store.state.fullscreenLoading = false
      })
    },
    submitOnlineMange () {
      let arr = [], submitChangeManageList = []
      this.manageList.map((val, index) => {
        if (val !== this.recodeManageList[index]) {
          arr.push(index)
        }
      })
      arr.map(index => {
        const num = this.manageList[index]
        submitChangeManageList.push({
          id: this.onlineManageList[index].id,
          isHot: num === 1 ? 1 : 0,
          isRecommend: num === 2 ? 1 : 0,
          isShow: num === 3 ? 0 : 1,
        })
      })
      if (submitChangeManageList.length === 0) {
        this.tration = false
        return
      }
      this.updataOnlineManage(submitChangeManageList)
    },
    updataOnlineManage (arr) {
      const paramsArr = arr.map(item => {
        return this.$axios.post(systemConfig.urls.updatePaytypeList, item)
      })
      Promise.all(paramsArr).then(() => {
        this.tration = false
      })
    },
    // 支行地址-名称
    getBankBranchText () {
      return this.showBsb ? this.$t('BSB码') : (['CN', 'AUD'].includes(this.postData.areaCode) ? this.$t('开户支行地址') : this.$t('支行名称'))
    },
    // 支行地址-校验
    getBankBranchRule () {
      return this.showBsb ? this.bankAddRule.bankBranchBsb : (['CN', 'AUD'].includes(this.postData.areaCode) ? this.commonRule.cnAndEnAndVietnam : [])
    },
    // 支行地址-长度限制
    limitLength () {
      return this.showBsb ? 10 : (['CN'].includes(this.postData.areaCode) ? 100 : 60)
    },
    changeBankName(val) {
      this.showBsb = val === this.$t('银行账户')
    },
    setCN () {
      this.showBsb = false
      this.deleteProvinceCity()
    },
    setAud () {
      this.showBsb = this.postData.bankName === this.$t('银行账户')
      this.deleteProvinceCity()
    },
    setMY () {
      this.showBsb = false
    },
    deleteProvinceCity () {
      delete this.postData.province
      delete this.postData.city
    },
  }
}

</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.qrcode-pay__upload-icon {
  width: 80px;
  height: 80px;
  font-size: 14px;
  line-height: 80px;
  border-radius: 6px;
  color: #d9d9d9;
  border: 1px dashed #d9d9d9;
}

.el-form-item .el-form-item__content .payList-checkbox {
  margin-left: 0;
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
}

.delete-dialog {
  .el-dialog {
    width: 30% !important;
  }
}

.small-title {
  border: 0;
}

.condition-container {
  overflow: hidden;
  height: 34px;
  margin-bottom: 10px;

  .condition {
    .condition-child {
      width: 160px;
      float: left;
      line-height: 28px;
      cursor: pointer;
      color: #4b4f56;
      border: 1px solid #eee;
      position: relative;
      text-align: center;

      .span-first {
        padding-right: 10px;
      }

      .span-top {
        width: 0;
        height: 0;
        position: absolute;
        top: 7px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid #ccc;
      }

      .span-bottom {
        width: 0;
        height: 0;
        position: absolute;
        bottom: 7px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #ccc;
      }

      &:first-of-type {
        border-right: none;
      }

      &:last-of-type {
        border-left: none;
      }

      .focus1 {
        border-bottom-color: #409eff;
      }

      .focus2 {
        border-top-color: #409eff;
      }
    }

    .no-border-right {
      border-right: none;
    }

    .bg-focus {
      color: #409eff;
      background: #ecf5ff;
      // border-color: #b3d8ff;
    }
  }

  .operate {
    float: right;
    button {
      min-width: 100px;
      height: 28px;
    }
  }
}

@media screen and (max-width: 1366px) {
  .group-width {
    width: 260px;
    display: inline-block;
  }
}

.bank-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 22%;
  height: 160px;
  margin: auto;
  line-height: 30px;
  z-index: 3501;

  .el-icon-close {
    position: absolute;
    right: 4px;
    top: 6px;
    font-size: 18px;
    color: #fff;
  }

  .bank-dialog-header {
    height: 30px;
    background: #fff;
    padding: 15px;
    padding-bottom: 10px;
    color: #303133;
    font-size: 18px !important;
    border-radius: 4px 4px 0 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  }

  .bank-dialog-content {
    color: #606266;
    border-top: none;
    padding: 0 15px 75px 15px;
    padding-bottom: 75px;
    background: #fff;
    border-radius: 0 0 4px 4px;

    span {
      font-size: 14px !important;
    }
  }

  .bank-dialog-button {
    position: absolute;
    right: 10px;
    bottom: 10px;

    button {
      padding: 9px 15px;
      height: 32px;
    }
  }
  // 管理弹窗
  .el-dialog .el-dialog__body{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .blank {
    margin-right: 45px;
    font-size: 14px;

  }
}
.el-dialog .el-dialog__body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: flex-end;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -ms-flex-wrap: wrap;
  -ms-flex-line-pack: stretch;
  flex-direction: column;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: center;
  align-content: center;
}

.el-radio-group.bnm {
    margin-right: -27px;
}
.ceBan.el-input.el-input--small {
   width: 50%;
}
.pdn10 {
  padding-bottom: 10px;
}
</style>
