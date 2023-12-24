<template>
  <div class="bonus-list" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search ui-fix3" style="display: flex;justify-content: space-between;padding: 20px 20px 16px;">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input type="text" v-model="q.accountName" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <!--@change="getAgyAccount"-->
          <label>{{ $t('总代') }}</label>
          <el-select v-model="q.parentAgyAccountId" multiple filterable clearable :placeholder="$t('请选择')" @change="getAgyAccount">
            <el-option v-for="(item, index) in topAgyAccountOptions" :key="index" :label="item.agyAccount" :value="item.id">
              {{item.agyAccount}}
              <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理') }}</label>
          <el-select v-model="q.agyAccountId" :placeholder="$t('请选择')" multiple filterable clearable>
            <el-option v-for="(item, index) in agyAccountOptions" :key="index" :label="item.agyAccount" :value="item.id">
              {{item.agyAccount}}
              <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('类型') }}</label>
          <el-select v-model="q.opTypeName" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in typeOptions" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('客户端') }}</label>
          <el-select v-model="q.devSource" :placeholder="$t('请选择')" multiple>
            <el-option label="PC" value="0"></el-option>
            <el-option label="H5" value="3"></el-option>
            <el-option label="APP" value="2"></el-option>
          </el-select>
        </div>

        <!--最后创建时间-->
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('创建时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :startTime.sync="startTime" :endTime.sync="endTime" />
        </div>
      </div>
      <div style="display: flex;align-items: flex-end; padding-bottom: 18px;white-space: nowrap">
        <el-button type="primary" @click.native="search()" :loading="searchLoading" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <el-row class="row-bg" type="flex" justify="end">
      <el-col :span="6" style="text-align: right">
        <!-- <el-button class="filter-item iconfont icon-export el-button-export" size="mini">导出报表</el-button> -->
      </el-col>
    </el-row>
    <el-table type="flex" :data="tableData.list" border fit highlight-current-row v-loading="loading">
      <el-table-column type="index" :label="$t('序号')" :index="indexMethod" width="60" align="center"></el-table-column>
      <el-table-column prop="accountName" :label="$t('会员名')" align="center">
        <template slot-scope="scope">
          {{scope.row.accountName}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column prop="parentAgyAccount" :label="$t('总代')" align="center">
        <template slot-scope="scope">
          {{scope.row.parentAgyAccount}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column prop="agyAccount" :label="$t('代理')" align="center">
        <template slot-scope="scope">
          {{scope.row.agyAccount}}
          <GlobalComponentTestLabel :id="scope.row.tagencyId" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('类型')" width="150" align="center">
        <template slot-scope="scope">{{returnType(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('金额')" align='right'>
        <template slot-scope="scope">{{ toThousands(scope.row.amount) }}</template>
      </el-table-column>
      <el-table-column prop="beforeBalance" :label="$t('主账户原额度')" align='right'>
        <template slot-scope="scope">{{ toThousands(scope.row.beforeBalance) }}</template>
      </el-table-column>
      <el-table-column prop="afterBalance" :label="$t('主账户现额度')" align='right'>
        <template slot-scope="scope">{{ toThousands(scope.row.afterBalance) }}</template>
      </el-table-column>
      <el-table-column :label="$t('客户端')" align="center">
        <template slot-scope="scope">{{returnStatus(scope.row.devSource)}}</template>
      </el-table-column>
      <el-table-column prop="auditTime" width="150" :label="$t('操作时间')" :formatter="timeFilter" align="center"></el-table-column>
      <el-table-column :label="$t('操作')" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openInnerDialog(scope.row)">[{{ $t('查看') }}]</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount">
      </el-pagination>
    </div>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <!--提款dialog-->
    <el-dialog @close="withdrawCancle" :title="$t('提款详情')" :visible.sync="withdrawShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span id="withdrawOrder">{{detailObj.financialCode}}{{detailObj.orderNo}}</span>
              <span class="copied" v-show="copied2">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=2" class="clip iconfont icon-copy" data-clipboard-target="#withdrawOrder"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名称')" class="first-line">
              <span>{{detailObj.accountName}}({{detailObj.groupName}})</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('所属代理')" class="first-line"><span>{{ detailObj.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('开户姓名')" class="first-line"><span id="withdrawRealName">{{detailObj.realName}}</span>
              <span class="copied" v-show="copied3">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=3" class="clip iconfont icon-copy" data-clipboard-target="#withdrawRealName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('开户帐号')" class="first-line"><span id="withdrawCardNo">{{detailObj.cardNo}}</span>
              <span class="copied" v-show="copied4">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=4" class="clip iconfont icon-copy" data-clipboard-target="#withdrawCardNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款银行')" class="first-line"><span id="withdrawBankName">{{detailObj.bankName}}</span>
              <span class="copied" v-show="copied5">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=5" class="clip iconfont icon-copy" data-clipboard-target="#withdrawBankName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('开户银行')" class="first-line"><span id="withdrawAddress">{{detailObj.address}}</span>
              <span class="copied" v-show="copied6">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=6" class="clip iconfont icon-copy" data-clipboard-target="#withdrawAddress"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('提款金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账手续费')" class="first-line"><span>{{detailObj.handlingCharge}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('行政扣款')" class="first-line"><span>{{detailObj.cutAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('扣除优惠')" class="first-line"><span>{{detailObj.discountAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际出款')" class="first-line"><span>{{detailObj.actualArrival}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核人')" class="first-line"><span>{{detailObj.auditUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核时间')" class="first-line"><span>{{detailObj.auditTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--入款dialog-->
    <el-dialog @close="depositCancle" :title="$t('入款详情')" :visible.sync="depositShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span id="depositOrder">{{detailObj.financialCode}}{{detailObj.orderNo}}</span>
              <span class="copied" v-show="copied1">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" @click="copyFlag=1" class="clip iconfont icon-copy" data-clipboard-target="#depositOrder"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名称')" class="first-line">
              <span>{{detailObj.accountName}}({{detailObj.groupName}})</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款帐号')" class="first-line"><span>{{detailObj.account}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际到帐')" class="first-line"><span>{{detailObj.actualArrival}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核人')" class="first-line"><span>{{detailObj.auditUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核时间')" class="first-line"><span>{{detailObj.auditTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--转出dialog-->
    <el-dialog @close="transoutCancle" :title="$t('转出详情')" :visible.sync="transoutShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('转账单号')" class="first-line"><span>{{detailObj.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账类型')" class="first-line"><span>{{returnType(detailObj)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名')" class="first-line"><span>{{detailObj.accountName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('代理')" class="first-line">
              <span>{{ detailObj.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('真实姓名')" class="first-line"><span>{{detailObj.realName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('主账号余额')" class="first-line"><span>{{ $t('转前') }} {{detailObj.beforeBalance}}, {{ $t('转后') }} {{detailObj.afterBalance}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('平台总余额')" class="first-line"><span>{{ $t('转前') }} {{detailObj.depotBeforeBalance}}, {{ $t('转后') }} {{detailObj.depotAfterBalance}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')" class="first-line"><span>{{transferStatus(detailObj.status)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--转入dialog-->
    <el-dialog @close="transinCancle" :title="$t('转入详情')" :visible.sync="transinShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('转账单号')" class="first-line"><span>{{detailObj.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账类型')" class="first-line"><span>{{returnType(detailObj)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名')" class="first-line"><span>{{detailObj.accountName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('代理')" class="first-line">
              <span>{{ detailObj.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('真实姓名')" class="first-line"><span>{{detailObj.realName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转账金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('主账号余额')" class="first-line"><span>{{ $t('转前') }} {{detailObj.beforeBalance}}, {{ $t('转后') }} {{detailObj.afterBalance}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('平台总余额')" class="first-line"><span>{{ $t('转前') }} {{detailObj.depotBeforeBalance}}, {{ $t('转后') }} {{detailObj.depotAfterBalance}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')" class="first-line"><span>{{transferStatus(detailObj.status)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--人工增加dialog-->
    <el-dialog @close="manualAddCancle" :title="$t('人工增加')" :visible.sync="manualAddShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{detailObj.financialCode}}{{detailObj.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员帐号')" class="first-line"><span>{{detailObj.accountName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('增加金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('类型')" class="first-line"><span>{{detailObj.type}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('稽核')" class="first-line">
              <span v-show="detailObj.auditType==='0'">{{ $t('免稽核') }}</span>
              <span v-show="detailObj.auditType==='1'">{{ $t('稽核') }}{{detailObj.auditMultiple}}{{ $t('倍') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--人工减少dialog-->
    <el-dialog @close="ManualDecreseCancle" :title="$t('人工减少')" :visible.sync="manualDecreseShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{detailObj.financialCode}}{{detailObj.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员帐号')" class="first-line"><span>{{detailObj.accountName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('减少金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('类型')" class="first-line"><span>{{detailObj.type}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否清除稽核')" class="first-line">
              <span v-show="detailObj.isClear==='0'">{{ $t('否') }}</span>
              <span v-show="detailObj.isClear==='1'">{{ $t('是') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--红利dialog-->
    <el-dialog @close="bonusCancle" :title="$t('红利详情')" :visible.sync="bonusShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('会员帐号')" class="first-line">
              <span>{{detailObj.accountName}}({{detailObj.groupName}})</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('代理')" class="first-line">
              <span>{{ detailObj.agentBreadcrumb }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('优惠名称')" class="first-line"><span>{{detailObj.type}}</span><span>{{ $t('类型') }} : {{detailObj.tmplName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('申请金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('优惠金额')" class="first-line"><span>{{detailObj.bonusAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('审核状态')" class="first-line"><span>{{transfer(detailObj.status)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--好友返利dialog-->
    <el-dialog @close="rebateAddCancle" :title="$t('好友返利')" :visible.sync="rebateAddShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{detailObj.financialCode}}{{detailObj.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员帐号')" class="first-line"><span>{{detailObj.accountName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('增加金额')" class="first-line"><span>{{detailObj.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('类型')" class="first-line"><span>{{detailObj.type}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('稽核')" class="first-line">
              <span v-show="detailObj.auditType==='0'">{{ $t('免稽核') }}</span>
              <span v-show="detailObj.auditType==='1'">{{ $t('稽核') }}{{detailObj.auditMultiple}}{{ $t('倍') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line"><span>{{detailObj.memo}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--好友返利dialog-->
    <el-dialog @close="friendTransferCancel" :title="$t('好友转帐详情')" :visible.sync="isFriendTransferShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('转账类型')" class="first-line"><span>{{ $t('好友转账') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转款会员')" class="first-line"><span>{{mbrFreindTransDetail.transLoginName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('转款金额')" class="first-line"><span>{{mbrFreindTransDetail.transAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('余额信息')" class="first-line">
              <el-table :data="[mbrFreindTransDetail]">
                <el-table-column :label="$t('转款')" align='center'>
                  <template slot-scope="scope">
                    {{ $t('主账户余额') }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('转款前')" align='right' prop="transBeforeBalance"></el-table-column>
                <el-table-column :label="$t('转款后')" align='right' prop="transAfterBalance"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款会员')" class="first-line"><span>{{mbrFreindTransDetail.receiptLoginName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款金额')" class="first-line"><span>{{mbrFreindTransDetail.transAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('余额信息')" class="first-line">
              <el-table :data="[mbrFreindTransDetail]">
                <el-table-column :label="$t('收款')" align='center'>
                  <template>
                    {{ $t('主账户余额') }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('收款前')" align='right' prop="receiptBeforeBalance"></el-table-column>
                <el-table-column :label="$t('收款后')" align='right' prop="receiptAfterBalance"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import systemConfig from "../../config/config.js";
import Clipboard from "clipboard";
import queryStore from "../../mixins/queryStore";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import Mixin from '@/mixins/loadTime'

export default {
  name: "balanceRecord",
  mixins: [Mixin,queryStore(["q", "startTime", "endTime"])],
  components: { StartAndEndTimeSelector },
  data() {
    return {
      q: {
        parentAgyAccountId: [],
        agyAccountId: [],
        opTypeName: [],
        accountName: "",
        devSource: [],
      },
      postData: {},
      typeOptions: [
        { value: "0", label: this.$t("提款") },
        { value: "1", label: this.$t("入款") },
        { value: "2", label: this.$t("转出") },
        { value: "3", label: this.$t("转入"),},
        { value: "4", label: this.$t("人工增加") },
        { value: "5", label: this.$t("人工减少") },
        { value: "6", label: this.$t("红利") },
        { value: "11", label: this.$t("好友返利") },
        { value: "8", label: this.$t("好友转帐") },
        { value: "9", label: this.$t("全民代理") },
        { value: "10", label: this.$t("免转钱包") },
        { value: "12", label: this.$t("反波胆下注") },
        { value: "13", label: this.$t("反波胆派彩") },
        { value: "14", label: this.$t("反波胆撤单") },
        { value: "15", label: this.$t("充值返上级") },
      ],
      showExtend: false,
      startTime: "",
      endTime: "",
      agyAccountOptions: [],
      topAgyAccountOptions: [],
      trueAgyAccountOptions: [],
      tableData: {},
      /* balanceRecord:{}, */
      innerVisible: false,
      detailObj: {},
      mbrFreindTransDetail: {},
      withdrawShow: false,
      depositShow: false,
      transoutShow: false,
      transinShow: false,
      manualAddShow: false,
      manualDecreseShow: false,
      bonusShow: false,
      rebateAddShow: false,
      isFriendTransferShow: false,
      copyFlag: 0,
      copied1: false,
      copied2: false,
      copied3: false,
      copied4: false,
      copied5: false,
      copied6: false,
      //下拉刷新
      /* listReq:{
          pageSize: 20,
          pageNo: 1,
        },
        oldTableList:[],//上一次主页展示数据
        enterNum:0,
        loadingBool:false,//下拉加载图标展示 */
      saveStartTime: "", //保存当前开始时间
      saveEndTime: "",
      searchLoading: false,
    };
  },
  created() {
    /* window.onscroll=()=>{
        this.$scrToBottom.scrollTo('listReq',this,'handleSizeChange')
      } */
    this.getAgyAccount([]);
    this.getChildAgent();
  },
  mounted() {
    this.resetTime()
    this.getData();
    const clipboard = new Clipboard(".clip");
    let self = this;
    clipboard.on("success", function (e) {
      switch (self.copyFlag) {
        case 1:
          self.copied1 = true;
          self.copied2 = false;
          self.copied3 = false;
          self.copied4 = false;
          self.copied5 = false;
          self.copied6 = false;
          break;
        case 2:
          self.copied2 = true;
          self.copied1 = false;
          self.copied3 = false;
          self.copied4 = false;
          self.copied5 = false;
          self.copied6 = false;
          break;
        case 3:
          self.copied3 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied4 = false;
          self.copied5 = false;
          self.copied6 = false;
          break;
        case 4:
          self.copied4 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied3 = false;
          self.copied5 = false;
          self.copied6 = false;
          break;
        case 5:
          self.copied5 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied3 = false;
          self.copied4 = false;
          self.copied6 = false;
          break;
        case 6:
          self.copied6 = true;
          self.copied1 = false;
          self.copied2 = false;
          self.copied3 = false;
          self.copied4 = false;
          self.copied5 = false;
          break;
      }
    });
  },
  computed: {
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    loading() {
      return this.$store.state.searchLoading;
    },
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [10, 100, 300, 500, 1000],
      };
    },
    /* listReq() {
        return this.$store.state.listReq
      }, */
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () {},
    },
    extendTitle() {
      if (this.showExtend) {
        return this.$t("收起");
      } else {
        return this.$t("更多");
      }
    },
  },
  methods: {
    ...mapActions({
      findAgentByloginName(dispatch) {
        dispatch("findAgentByloginName", this.detailObj.accountName).then(
          (agentBreadcrumb) => {
            this.$set(this.detailObj, "agentBreadcrumb", agentBreadcrumb);
          }
        );
      },
    }),
    toThousands(money) {
      return systemConfig.toThousands(money);
    },
    resetTime() {
      if (!this.useQueryStoreCache) {
        this.$refs.searchTime.handleTimeQuickSelect("today");
      }
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    transfer(value) {
      switch (value) {
        case "0":
          return this.$t("拒绝");
        case "1":
          return this.$t("通过");
        case "2":
          return this.$t("待处理");
      }
    },
    transferStatus(value) {
      switch (value) {
        case "0":
          return this.$t("冻结");
        case "1":
          return this.$t("成功");
        case "2":
          return this.$t("失败");
      }
    },
    openInnerDialog(rowData) {
      this.detailObj = rowData;
      switch (rowData.opTypeName) {
        case "0":
          this.withdrawShow = true;
          this.findAgentByloginName();
          break;
        case "1":
          this.depositShow = true;
          break;
        case "2":
          this.transoutShow = true;
          this.findAgentByloginName();
          break;
        case "3":
          this.transinShow = true;
          this.findAgentByloginName();
          break;
        case "4":
          this.manualAddShow = true;
          break;
        case "5":
          this.manualDecreseShow = true;
          break;
        case "6":
          this.bonusShow = true;
          this.findAgentByloginName();
          break;
        case "7":
          this.rebateAddShow = true;
          break;
        case "8":
          this.isFriendTransferShow = true;
          this.getFriendTransferDetail();
          break;
        default:
          return "";
      }
    },
    getFriendTransferDetail() {
      const { mbdId } = this.detailObj;
      this.$axios
        .get(systemConfig.urls.balanceRecord.detail + mbdId)
        .then((res) => {
          this.mbrFreindTransDetail = res.data.mbrFreindTransDetail;
        });
    },
    depositCancle() {
      this.depositShow = false;
      this.copied1 = false;
      this.detailObj = {};
    },
    withdrawCancle() {
      this.withdrawShow = false;
      this.copied2 = false;
      this.copied3 = false;
      this.copied4 = false;
      this.copied5 = false;
      this.copied6 = false;
      this.detailObj = {};
    },
    transoutCancle() {
      this.transoutShow = false;
      this.detailObj = {};
    },
    transinCancle() {
      this.transinShow = false;
      this.detailObj = {};
    },
    manualAddCancle() {
      this.manualAddShow = false;
      this.detailObj = {};
    },
    ManualDecreseCancle() {
      this.ManualDecreseShow = false;
      this.detailObj = {};
    },
    bonusCancle() {
      this.bonusShow = false;
      this.detailObj = {};
    },
    rebateAddCancle() {
      this.rebateAddShow = false;
      this.detailObj = {};
    },
    friendTransferCancel() {
      this.isFriendTransferShow = false;
      this.detailObj = {};
    },
    returnStatus(statusValue) {
      return systemConfig.returnStatus(statusValue);
    },
    returnType(rowData) {
      if (!rowData.opTypeName) {
        return "";
      } else {
        switch (rowData.opTypeName) {
          case "0":
            return this.$t("提款") + " ：" + rowData.type;
          case "1":
            return this.$t("入款") + " ：" + rowData.type;
          case "2":
            return this.$t("转出") + " : " + this.$t("主账户转") + rowData.type;
          case "3":
            return this.$t("转入") + " ：" + rowData.type + this.$t("转主账户");
          case "4":
            return this.$t("人工增加") + " ：" + rowData.type;
          case "5":
            return this.$t("人工减少");
          case "6":
            return this.$t("红利") + " ：" + rowData.type;
          // case "8":
          //   return "好友转帐 ：" + rowData.type;
          case "11":
            return this.$t("好友返利") + " ：" + rowData.type;
          // case "12":
          //   return "反波胆下注 ：" + rowData.type;
          // case "13":
          //   return "反波胆派彩 ：" + rowData.type;
          // case "14":
          //   return "反波胆撤单 ：" + rowData.type;
          default:
            return rowData.type;
        }
      }
    },
    more() {
      this.showExtend = !this.showExtend;
    },
    reset() {
      this.q = {
        parentAgyAccountId: [],
        agyAccountId: [],
        opTypeName: [],
        accountName: "",
        devSource: [],
      };
      this.resetTime()
      this.agyAccountOptions = this.trueAgyAccountOptions;
      //下拉刷新还原
      /* this.tableData={}
        this.enterNum=0;
        this.listReq.pageSize=20;
        this.oldTableList=[]; */
    },
    getChildAgent() {
      this.$axios
        .get(systemConfig.urls.getAllChildAgentIncludeDisable)
        .then((resp) => {
          this.agyAccountOptions = resp.data.accounts;
          this.trueAgyAccountOptions = resp.data.accounts;
        });
    },
    getAgyAccount(id) {
      if (id.length > 0) {
        this.agyAccountOptions = [];
        this.q.agyAccountId = [];
        Promise.all(
          id.map((i) =>
            this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable, {
              params: {
                parentId: i,
              },
            })
          )
        ).then((res) => {
          this.agyAccountOptions = res.reduce((prev, curr) => {
            prev.push(...curr.data.accounts);
            return prev;
          }, []);
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
    handleSizeChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.getData();
    },
    timeFilter(row, column) {
      var date = row[column.property];
      if (date == null || date === "" || date === "0") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    search() {
      this.getCurrentRecodeTime()
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("操作起始时间不能大于结束时间"),
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
      /* //点击查询按钮，下拉刷新数据还原
        this.listReq.pageSize = 20
        this.oldTableList=[];
        this.enterNum=0;
        this.tableData={} */
      //查询数据
      this.getData();
    },
    getData() {
      /* if(this.tableData.totalCount&&this.listReq.pageSize-20>=this.tableData.totalCount){//条数大于tableData.list总数，则停止
          return ;
        } */
      /* this.$store.state.searchLoading = true */
      this.postData = [];
      Object.keys(this.q).forEach((key) => {
        if (this.q[key].length > 0) {
          if (Array.isArray(this.q[key])) {
            this.postData[key] = this.q[key].sort().join(",");
          } else {
            this.postData[key] = this.q[key];
          }
        } else {
          this.postData[key] = "";
        }
      });
      let url =
        "?pageSize=" + this.listReq.pageSize + "&pageNo=" + this.listReq.pageNo;
      if (this.startTime && this.timeType === "md") {
        url +=
          "&startTime=" +
          systemConfig.transferTimeByType(this.startTime, "mdToBj");
      } else {
        url += "&startTime=" + this.startTime;
      }
      if (this.endTime && this.timeType === "md") {
        url +=
          "&endTime=" + systemConfig.transferTimeByType(this.endTime, "mdToBj");
      } else {
        url += "&endTime=" + this.endTime;
      }
      let data = Object.assign({}, this.postData);
      this.searchLoading = true
      this.$axios
        .get(systemConfig.urls.billRecordList + url, {
          params: data,
        })
        .then((resp) => {
          this.getNetworkLoadAndDataSolveTime(resp)
          this.searchLoading = false;
          this.tableData = resp.data.page;
        })
        .catch(() => {
          this.searchLoading = false;
        })
    },
    /* scrollToTop(){
        this.$scrToBottom.scrollToTop();
      } */
  },
};
</script>

<style lang="scss" scoped>
.tableToTop {
  position: absolute;
  right: 110px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
</style>

