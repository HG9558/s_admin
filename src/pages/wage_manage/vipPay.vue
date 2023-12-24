<template>
  <div class="member-withdraw" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search" :class="searchClass">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input type="text" v-model="loginName" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('订单号') }}</label>
          <input type="text" v-model="orderNo" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('入款方式') }}</label>
          <el-select size="small" v-model="mark" clearable :placeholder="$t('请选择')" @change="getDesForC">
            <el-option :label="$t('线上支付')" :value="0"></el-option>
            <el-option :label="$t('公司入款')" :value="1"></el-option>
            <el-option :label="$t('普通扫码支付')" :value="2"></el-option>
            <el-option :label="$t('加密货币')" :value="3"></el-option>
            <el-option :label="$t('代理充值')" :value="4"></el-option>
            <el-option :label="$t('极速存款')" :value="5"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('收款渠道') }}</label>
          <el-select size="small" v-model="companyPayIds" :placeholder="$t('请选择')" multiple :disabled="!depositOptions.length" filterable>
            <el-option v-for="(item, index) in depositOptions" :key="index" :label="
                [
                  item.name, // 线上支付
                  item.realName+'-'+ item.bankName, // 公司入款
                  item.name,
                  `${item.bankName}-${item.category}`
                ][mark]" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select size="small" v-model="statuss" :placeholder="$t('请选择')" @change="statusSelectChange" multiple>
            <el-option :label="$t('待处理')" :value="2"></el-option>
            <el-option :label="$t('成功')" :value="1"></el-option>
            <el-option :label="$t('失败')" :value="0"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('未到账信息') }}</label>
          <el-select size="small" v-model="receivedType" :placeholder="$t('请选择')" @change="statusSelectChange">
            <el-option :label="$t('全部')" value=""></el-option>
            <el-option :label="$t('未上传')" :value="0"></el-option>
            <el-option :label="$t('有上传')" :value="1"></el-option>
          </el-select>
        </div>
        <!--最后存款时间-->
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('存款时间') }}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :width="480" :startTime.sync="startTime" :endTime.sync="endTime" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理帐号') }}</label>
          <el-select v-model="agyId" :placeholder="$t('请选择')" @change="checkAccount">
            <el-option v-for="item in commonIds" :key="item.value" :label="item.value" :value="item.key">
            </el-option>
            <el-option :key="2" :label="$t('正式代理')" :value="2" />
            <el-option :key="3" :label="$t('测试代理')" :value="3" />
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="agyId === 1">
          <label for=""></label>
          <input type="text" v-model="agyAccount" />
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select size="small" v-model="groupIds" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in listgroup" :key="item.id" :label="item.groupName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('存款人姓名') }}</label>
          <input type="text" v-model="depositUser" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width400">
          <div style="height: 20px">
            <label>{{ $t('存款金额') }}</label>
          </div>
          <el-input v-model="minDepositAmount" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
          -
          <el-input v-model="maxDepositAmount" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('审核人') }}</label>
          <input type="text" v-model="auditUser" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{ $t('审核时间') }}</label>
          </div>
          <StartAndEndTimeSelector
            ref="depositTime"
            :startTime.sync="startAuditTime"
            :endTime.sync="endAuditTime"
          />
        </div>
      </div>
    </div>

    <el-row style="background-color: #f6f7f8;padding: 15px 20px 0;margin-top: -14px" class="border-new-lrb">
      <el-col :span="12" class="tect-le color-blue" style="cursor:pointer">
        <span @click="more">{{extendTitle}}{{ $t('查询') }}<i :class="[this.showExtend ? 'el-icon-arrow-up': 'el-icon-arrow-down']" class="icon-more el-select__caret el-input__icon "></i></span>
      </el-col>
      <el-col :span="12" class="tect-ri" style="margin-bottom: 25px">
        <el-button type="primary" @click.native="search()" size="small" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" size="small" class="wid-80">{{ $t('重置') }}</el-button>
      </el-col>
    </el-row>

    <div class="export-div" style="height: 50px">
      <div class="statistic">
        <span class="s">{{ $t('今日存款') }}:{{staticData.todayDeposit?staticData.todayDeposit:'0'}}</span>
        <span class="s">{{ $t('存款金额合计') }}:{{staticData.depositAmount?staticData.depositAmount:'0'}}</span>
        <span class="s">{{ $t('手续费合计') }}:{{staticData.handlingCharge?staticData.handlingCharge:'0'}}</span>
        <span class="s">{{ $t('实际金额合计') }}:{{staticData.actualArrival?staticData.actualArrival:'0'}}</span>
      </div>
      <TimeEvery @getTime="setTimeRefresh" class="memberDespot" style="margin-right: 93px" :btn="{ label: hasPermission('fund:deposit:companyDeposit') ? $t('人工入款') : '', event: 'inEvent' }" @inEvent="handleInEvent"></TimeEvery>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="hasPermission('fund:deposit:exportExcel')&&isNowDowning" :disabled="!total" @click="handleExport">{{ $t('导出') }}</el-button>
      <el-button class="iconfont icon-export el-button-export exportList" v-if="hasPermission('fund:deposit:exportExcel')&&!isNowDowning">{{ $t('导出中') }}...</el-button>
    </div>
    <div class="search-form">
      <el-table max-height="545" :data="tableData" v-loading='loading' border style="width: 100%">
        <el-table-column label-class-name="heightThe" :label="$t('序号')" type="index" :index="indexMethod" align="center">
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('订单号')" width="200" prop="orderNo" align="center">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNoText}}</el-button>
            <CopyButton v-show="scope.row.orderNoText" :copy-content="scope.row.orderNoText+''" />
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="mark" :label="$t('入款方式')" align="center">
          <template slot-scope="scope">
            {{ [$t('线上支付'), $t('公司入款'), $t('普通扫码支付'), $t('加密货币'), $t('代理充值'),$t('极速存款')][scope.row.mark] }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="140" :label="$t('会员名')" align="center">
          <template slot-scope="scope">
            {{scope.row.loginName}}
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe"  width="120px" prop="groupName" :label="$t('会员组')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe"  width="120px" prop="depositUser" :label="$t('存款人姓名')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="tierName" :label="$t('VIP等级')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe"  width="120px" prop="agyAccount" :label="$t('上级代理')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe" width="160px" prop="createTime" :label="$t('存款时间')" align="center">
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="depositAmount" :label="$t('存款金额')" align="center">
          <template slot-scope="scope">
            {{ setThounds(scope.row.depositAmount) }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="depositCount" :label="$t('存款次数')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('存款凭证')" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.picture" alt="" height="35" @click="showPicture(scope.row.picture)">
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('调整金额')" align="center">
          <template slot-scope="scope">
            <span :style="{'color': scope.row.actualArrival - scope.row.depositAmount > 0 || scope.row.actualArrival - scope.row.depositAmount === 0 ? 'black' : 'red'}">
              {{handleToggleAmount(scope.row.actualArrival, scope.row.depositAmount)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="actualArrival" :label="$t('实际金额')" align="center">
          <template slot-scope="scope">
            {{ setThounds(scope.row.actualArrival) }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="depositAmountCr" :label="$t('USDT金额')" align="center">
          <template slot-scope="scope">
            {{ setThounds(scope.row.depositAmountCr) }}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="190" prop="payType" :label="$t('收款通道')" align="center">
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="60" prop="fundSource" :label="$t('来源')" align="center">
          <template slot-scope="scope">
            {{ scope.row.fundSource==0?'PC':(scope.row.fundSource==3)?'H5':''}}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="140" prop="ip" :label="$t('申请IP')" align="center">
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="80px" prop="status" :label="$t('状态')" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status!='-1'" :type="scope.row.status === 1 ? 'success' : (scope.row.status === 2 ? 'primary':'danger')" close-transition>{{statusTextFilter(scope.row.status)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="auditUser" :label="$t('审核人')" align="center">
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="145px" prop="auditTime" align="center" :label="$t('审核时间')" :formatter="timeFilter"></el-table-column>
        <el-table-column label-class-name="heightThe" width="145px" prop="receivedType" align="center" :label="$t('未到账信息')">
          <template slot-scope="scope">
            <span v-if="scope.row.receivedType" style="text-align: center; color: #4aa4ea; cursor: pointer;" @click="seeDetail(scope.row)">详情</span>
            <span v-else style="text-align: center;">-</span>
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="145px" prop="feedbackStr" align="center" :label="$t('问题类型')"></el-table-column>
        <el-table-column label-class-name="heightThe" width="145px" prop="depositPostscript" align="center" :label="$t('存款附言')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="memo" :label="$t('备注')" align="center">
          <template slot-scope="scope">
            <div style="" class="slh" :title="scope.row.memo">
              {{ scope.row.memo}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog :title="$t('人工入款')" :visible.sync="isShowIn" @close="onAvatarRemove()">
      <el-form label-position="right" label-width="140px" ref="inDataForm" :model="inData" :rules="inRules">
        <el-form-item :label="$t('会员账号')" prop="loginName">
          <el-input v-model="inData.loginName" :placeholder="$t('请输入会员账号')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('收款渠道')" prop="companyPayId">
          <el-select v-model="inData.companyPayId" :placeholder="$t('请选择收款渠道')">
            <el-option v-for="(item, i) in allValueTwo" :key="i" :label="item.realName?(item.realName+'-'+ item.bankName):(item.bankName)" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('存款人姓名')" prop="depositUser">
          <el-input v-model="inData.depositUser" :placeholder="$t('请输入存款人姓名')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('存款附言')">
          <el-input v-model="inData.depositPostscript" :placeholder="$t('请输入存款附言')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('存款金额')" prop="depositAmount">
          <el-input v-model="inData.depositAmount" :placeholder="$t('请输入存款金额')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('实际到账')" prop="actualArrival">
          <el-input v-model="inData.actualArrival" :placeholder="$t('请输入实际到账')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('上传凭证')">
          <div class="contactOnePc">
            <el-upload
                :file-list='defineIndustryPicList'
                list-type="picture-card"
                action=""
                :limit="1"
                :before-upload="beforeAvatarUpload"
                :on-remove="onAvatarRemove"
                :http-request="handleAvatarSuccess"
                :class="imageUrl?'hide':''">
                <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input type="textarea" v-model="inData.memo" :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
      </el-form>
      <div class="center">
        <el-button @click="isShowIn = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="inSubmitLoading" @click="handleInSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closeDetail" :title="auditTitle" :visible.sync="detailShow">
      <el-form label-position="right" label-width="120px" style="margin-left: 10px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')" class="first-line"><span>{{rowData.orderPrefix}}{{rowData.orderNo}}</span>
              <CopyButton :copy-content="(rowData.orderPrefix + rowData.orderNo+'')" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="rowData.payOrderNo">
            <el-form-item :label="rowData.mark === 3 ? rowData.currencyCode + $t('原始订单号') : $t('事件订单号')" class="first-line"><span v-if="rowData.mark === 3" class="toggle_to_new_page" @click="toggleTo(rowData)">{{rowData.payOrderNo}}</span>
              <span v-else>{{rowData.payOrderNo}}</span>
              <CopyButton style="float: right;" :copy-content="rowData.payOrderNo + ''" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('会员名称')" class="first-line"><span>{{rowData.loginName}}({{rowData.groupName}})</span>
              <span style="color:#409EFF;cursor:pointer" @click="checkAllOrder(rowData.loginName)">{{ $t('查看所有订单') }}>></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('收款通道')" class="first-line">
              <span>{{rowData.payType}}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="rowData.mark === 3" :span="24">
            <el-form-item :label="$t('参考汇率')" class="first-line">
              <span>1{{rowData.currencyCode}} = {{rowData.exchangeRate}}{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="comPanyIf && rowData.mark !== 3">
            <el-form-item :label="$t('存款人姓名')" class="first-line">
              <span>{{rowData.depositUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="comPanyIf && rowData.mark !== 3 && rowData.mark !== 5">
            <el-form-item :label="$t('存款附言')" class="first-line"><span>{{rowData.depositPostscript}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.mark === 3">
            <el-form-item :label="$t('到账金额')" class="first-line">
              <span>{{rowData.depositAmountCr}}</span>
              <span>{{rowData.currencyCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('存款金额')" class="first-line">
              <span>{{rowData.depositAmount}}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('实际到账')" class="first-line">
              <SdyInput v-if="rowData.status === 2&&hasPermission('fund:onLine:updateStatus')" v-model="actualArrival" :inputValue="actualArrival"></SdyInput>
              <span v-else>{{rowData.actualArrival}}</span>
              <!-- CNY -->
              <span>{{ currencySymbol() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.status !== 2">
            <el-form-item :label="$t('审核人')" class="first-line"><span>{{rowData.auditUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.status !== 2">
            <el-form-item :label="$t('审核时间')" class="first-line"><span>
              {{getAuditTime(rowData.auditTime)}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" class="first-line" v-if="rowData.status === 2">
              <el-input class="left" type="textarea" v-model="memo" :maxlength="400"></el-input>
            </el-form-item>
            <el-form-item :label="$t('备注')" class="first-line" v-else>
              <el-input class="left" type="textarea" v-model="memo" :maxlength="400" :disabled="rowData.status!==1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="rowData.mark===5">
            <el-form-item :label="$t('付款凭证信息')" class="first-line noborder" v-if="!rowData.fastDepositPicture">
              <el-upload class="operation-bar-item" action="" :show-file-list="true" :http-request="handleUploadImage">
                <el-button class="uploadimgbtn">{{ $t('选择图片') }}</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('付款凭证信息')" class="first-line noborder" v-if="rowData.fastDepositPicture&&rowData.fastDepositPicture.length">
              <div v-for="(item,index) in rowData.fastDepositPicture" :key="index"><img :src="item"/></div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn" v-if="rowData.status === 2&&hasPermission('fund:onLine:updateStatus')">
                  <el-button type="primary" @click.native="changeStatus(1, rowData.id)">{{ $t('通过') }}</el-button>
                  <el-button type="danger" @click.native="changeStatus(0, rowData.id)">{{ $t('拒绝') }}</el-button>
                </div>
                <div class="btn" v-else-if="rowData.status===1&&hasPermission('fund:onLine:SucToFail')">
                  <el-button type="primary" @click.native="changeFaild(rowData)">{{ $t('变更为失败') }}</el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- table栏图标点击放大 -->
    <el-dialog :visible.sync="picPreviewShow" class="center transparent">
      <img
        :src="showCurpicPath"
        alt=""
        style="max-width: 100%; min-width: 80px"
      />
    </el-dialog>

    <el-dialog :visible.sync="receivedDetail" :title="$t('未到账详情')">
      <el-form :model="receiveRowData" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="item.label + ':'" v-for="(item, index) in detailContent" :key="item.orderNo">
          <span v-if="item.key==='status'">{{ [$t('失败'),$t('成功'), $t('待处理')][receiveRowData[item.key]] }}</span>
          <span v-if="item.key==='depositPictures'">
            <img width="300px" :src="receiveRowData[item.key]"/>
          </span>
          <span v-else>{{ receiveRowData[item.key] }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="receivedDetail = false">{{ $t('确定') }}</el-button>
      </span>
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
import { mapGetters } from "vuex";
import moment from 'moment'
import { lang } from "@/i18n";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

const statusOptions = [
  { value: 2, text: lang("待处理") },
  { value: 1, text: lang("成功") },
  { value: 0, text: lang("失败") },
];
export default {
  name: "vipPay",
  mixins: [
    site,
    Mixin,
    queryStore([
      "loginName",
      "orderNo",
      "mark",
      "companyPayIds",
      "statuss",
      "startTime",
      "endTime",
      "listgroup",
      "receivedType"
    ]),
  ],
  data() {
    const validateNumber = (rule, value, callback) => value && /[^0-9\.]/g.test(value) ? callback(this.$t('请输入数字'))  : callback()
    return {
      uploadFile: "",
      pictureList: [],
      safePassword: "",
      tmpValue4SafeCheck: {},
      inData: {},
      options: [
        {
          value: "5",
          label: "5s",
        },
        {
          value: "15",
          label: "15s",
        },
        {
          value: "30",
          label: "30s",
        },
        {
          value: "60",
          label: "60s",
        },
        {
          value: "90",
          label: "停止",
        },
      ],
      comPanyIf: false,
      value: "",
      companyPayIds: [],
      depositOptions: [],
      showExtend: false,
      allTodayWithdraw: "",
      detailShow: false,
      isShowIn: false,
      rowData: {},
      bankData: "",
      memo: "",
      auditTitle: "",
      loginName: "",
      depositUser: "",
      minDepositAmount: "",
      maxDepositAmount: "",
      auditUser: "",
      topAgyAccountOptions: [],
      topAgyAccountValue: [],
      trueAgyAccountOptions: [],
      agyAccountOptions: [],
      agyAccountValue: [],
      listgroup: [],
      groupIds: [],
      orderNo: "",
      auditer: "",
      startTime: "",
      endTime: "",
      endAuditTime: "",
      startAuditTime: "",
      groupOptions: [],
      mark: [],
      statusOptions: statusOptions,
      filterArr: statusOptions,
      statuss: [],
      receivedType: '',
      tableData: [],
      total: 0,
      orderNoText: "",
      isym: true,
      PayNewOnlineDetailData: "",
      timeOut: null,
      allValueOne: "",
      allValueTwo: "",
      isNowDowning: true, //文件导出
      deposit: {
        marginRight: "95px", //导出样式
        /* marginRight:'95px' */ //下载中样式
      },
      tempUrl: "",
      agyId: "", //代理账号
      commonIds: [
        { key: 0, value: this.$t("全选") },
        { key: 1, value: this.$t("精确查询") },
      ],
      agyAccount: "",
      //更多查询
      extendTitle: this.$t("更多"),
      searchClass: "searchNew",
      //统计
      staticData: {},
      qrcodeList: [],
      inRules: {
        loginName: [{ required: true, message: this.$t('请输入会员账号'), trigger: 'blur' }],
        companyPayId: [{ required: true, message: this.$t('请选择收款渠道'), trigger: 'blur' }],
        // depositUser: [{ required: true, message: this.$t('请输入存款人姓名'), trigger: 'blur' }],
        depositAmount: [{ required: true, message: this.$t('请输入存款金额'), trigger: 'blur' }, { validator: validateNumber, trigger: 'blur' }],
        actualArrival: [{ required: true, message: this.$t('请输入实际到账'), trigger: 'blur' }, { validator: validateNumber, trigger: 'blur' }],
      },
      inSubmitLoading: false,
      crTypeList: {},
      //
      actualArrival: "",
      initActualArrival: "",
      imageUrl: "",
      showCurpicPath: "",
      picPreviewShow: false,
      defineIndustryPicList: [],
      receivedDetail: false,
      detailContent: [
        { label: this.$t('上传时间'), key: 'createTime' },
        { label: this.$t('会员账号'), key: 'loginName' },
        { label: this.$t('入款姓名'), key: 'depositUserAcc' },
        { label: this.$t('存款金额'), key: 'depositAmount' },
        { label: this.$t('状态'), key: 'status' },
        { label: this.$t('截图'), key: 'depositPictures' },
      ],
      receiveRowData: {},
    };
  },
  components: {
    TimeEvery,
    CopyButton,
    StartAndEndTimeSelector,
  },
  created() {
    this.fnGroup()
    this.setTime()
    if (this.$route.query.status) {
      this.statuss = [parseInt(this.$route.query.status)];
    }
    this.getData();
    this.getMemberOptions();
    /* this.getTodayWithdraw() */
    this.getAgyAccount([]);
    this.getChildAgent();

    /*获取收款渠道*/
    this.getOnlinePayOptions();
    this.getQrcodeList();
    this.getCrTypeList();
  },
  mounted() {
    const clipboard = new Clipboard(".clip");
    if (this.hasPermission("fund:deposit:exportExcel")) {
      this.deposit = {
        "margin-right": "75px",
      };
    }
  },
  computed: {
    loading() {
      return this.$store.state.searchLoading;
    },
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [5, 10, 20, 50, 100, 200],
      };
    },
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    timeType: {
      get: function () {
        return this.$store.state.timeType;
      },
      set: function () {},
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
    mark(n, o) {
    },
  },
  methods: {
    handleInSubmit() {
      this.$refs.inDataForm.validate(async isOk => {
        if (isOk) {
          this.inSubmitLoading = true
          let flag = false
          for(let i=0;i<this.allValueTwo.length;i++){
            if(i===this.inData.companyPayId&&flag===false){
              this.inData.mark = this.allValueTwo[i].mark
              if(this.inData.mark===0){
                this.inData.onlinePayId = this.allValueTwo[i].id
                delete this.inData.companyPayId
              }else{
                this.inData.companyPayId = this.allValueTwo[i].id
                delete this.inData.onlinePayId
              }
              flag = true
            }
          }
          // picture 字段 -- 上传凭证
          const params = {
            ...this.inData,
            picture: this.imageUrl
          }
          const { res } = await this.$axios.POST(this.$urls.companyDeposit, params)
          this.inSubmitLoading = false
          if (res) {
            this.onAvatarRemove()
            this.isShowIn = false
            this.inData = {}
            this.getData()
          }
        }
      })
    },
    handleInEvent() {
      this.isShowIn = true
    },
    getAuditTime(auditTime) {
      if (!auditTime) return ''
      if (auditTime.length > 19) {
        return auditTime.slice(0, auditTime.length - 2)
      }
      return auditTime
    },
    fnGroup() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.listgroup = resp.data.page
      });
    },
    setTime() {
      this.startTime = moment().format('YYYY-MM-DD') + " 00:00:00"
      this.endTime = moment().format('YYYY-MM-DD') + " 23:59:59"
    },
    toggleTo(row) {
      const { currencyProtocol, payOrderNo } = row
      const url = currencyProtocol.includes('TRC') ? systemConfig.toggleTotTrc + payOrderNo : systemConfig.toggleToDomain + payOrderNo
      window.open(url);
    },
    handleToggleAmount(actualArrival, depositAmount) {
      const num = actualArrival - depositAmount;
      const curNum = String(num).includes(".") ? num.toFixed(2) : num;
      return curNum ? curNum.toLocaleString() : curNum
    },
    timeFilter(row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    setTimeRefresh(val) {
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
    TimeFor(time) {
      var that = this;
      if (time == 0) {
        return;
      }
      this.timeOut = setInterval(function () {
        that.getData();
      }, time * 1000);
    },

    /*收款渠道联动和入款方式*/
    getDesForC(id) {
      this.companyPayIds = [];
      switch (id) {
        case 0:
          this.depositOptions = this.allValueOne;
          break;
        case 1:
          this.depositOptions = this.allValueTwo;
          break;
        case 2:
          this.depositOptions = this.qrcodeList;
          break;
        case 3:
          this.depositOptions = this.crTypeList;
          break;
        default:
          this.depositOptions = [];
      }
    },

    // 初始化获取收款渠道
    getOnlinePayOptions() {
      this.$axios.get(systemConfig.urls.getOnlinepayList).then((resp) => {
        // this.depositOptions = resp.data.data
        this.allValueOne = resp.data.data;
        /* 默认的时候收款渠道需要全部数据*/
        this.getOnlinePayOptionsTwo();
      });
    },
    getOnlinePayOptionsTwo() {
      this.$axios.get(systemConfig.urls.getDepositList).then((resp) => {
        // this.depositOptions = resp.data.data.concat(this.depositOptions)
        this.allValueTwo = resp.data.data;
        let arr = [].concat(this.allValueOne)
        arr.map(ws=>{
          ws.realName = ''
          ws.bankName = ws.name
          ws.mark = 0
          this.allValueTwo.push(ws)
        })
      });
    },
    getQrcodeList() {
      this.$axios.get(systemConfig.urls.getQrcodeList).then((resp) => {
        this.qrcodeList = resp.data.data;
      });
    },
    getCrTypeList() {
      this.$axios.get(systemConfig.urls.crTypeList).then((resp) => {
        const data = resp.data.data;
        const objKeys = Object.keys(data);
        let list = []
        objKeys.map(key => {
          if(data[key].length) {
            list = list.concat(data[key])
          }
        })
        this.crTypeList = list;
      });
    },

    getStatus(urlStr) {
      var urlStrArr = urlStr.split("/");
      return urlStrArr[urlStrArr.length - 1];
    },
    // 条件查询事件
    search() {
      this.getCurrentRecodeTime()
      if(this.maxDepositAmount<this.minDepositAmount||(!this.minDepositAmount&&this.maxDepositAmount)){
        this.$message({
          type: "warning",
          message: this.$t("存款金额最大值必须大于存款金额最小值"),
        });
        return
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
      if( (!this.startTime || !this.endTime) && (!this.startAuditTime || !this.endAuditTime)) {
        this.$message.warning(this.$t('请选择存款时间或审核时间'))
        return
      }
      this.listReq.pageNo = 1;
      if (this.agyId == 1) {
        // 先判断精确查找的是总代还是次代
        if (!this.agyAccount) {
          this.$message({
            type: "warning",
            message: this.$t("请输入代理账号"),
          });
          return;
        }
      }
      this.getData();
      /* this.getTodayWithdraw() */
    },
    // 查询条件重置事件
    reset() {
      this.loginName = "";
      this.depositUser = "";
      this.minDepositAmount = "";
      this.maxDepositAmount = "";
      this.auditUser = "";
      this.topAgyAccountValue = [];
      this.agyAccountValue = [];
      this.agyAccountOptions = this.trueAgyAccountOptions;
      this.orderNo = "";
      this.auditer = "";
      this.startTime = "";
      this.endTime = "";
      this.startAuditTime = "";
      this.endAuditTime = "";
      this.statuss = [];
      this.mark = [];
      this.companyPayIds = [];
      this.groupIds = [];
      this.searchClass = "searchNew";
      this.extendTitle = this.$t("更多");
      this.showExtend = false;
      this.agyAccount = "";
      this.agyId = "";
      this.picture = "";
      this.receivedType = "";
      this.setTime()
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
    statusSelectChange(val) {
      this.status = val;
    },
    // 通过订单查询 订单详情
    showDetail(rowData) {
      this.rowData = rowData;
      /*测试添加付款凭证*/
      rowData.evidence = [{src:require('../../assets/img/404.png')},{src:require('../../assets/img/404.png')}]
      this.initActualArrival = this.actualArrival = rowData.actualArrival;
      let url = "/" + rowData.id;
      this.$store.state.fullscreenLoading = true;
      /*mark 0线上支付 1公司入款 2 个人二维码 3 加密货币*/
      if (rowData.mark == 0) {
        this.$axios
          .get(systemConfig.urls.PayNewOnlineDetail + url)
          .then((resp) => {
            this.detailShow = true;
            // this.bankData = resp.data.accWithdraw
            this.memo = this.rowData.memo;
            this.PayNewOnlineDetailData = resp.data.fundDeposit;

            if (rowData.status === 2) {
              this.auditTitle = this.$t("线上支付审核");
            } else {
              this.auditTitle = this.$t("线上支付详情");
            }
          });
      } else {
        this.$axios
          .get(systemConfig.urls.PayNewCompanyDetail + url)
          .then((resp) => {
            this.detailShow = true;
            this.comPanyIf = true;
            // this.bankData = resp.data.accWithdraw
            this.memo = this.rowData.memo;
            this.rowData.fastDeposit = resp.data.fundDeposit.fastDeposit
            this.rowData.fastDepositPicture = resp.data.fundDeposit.fastDepositPicture

            if (rowData.mark === 3) {
              this.auditTitle = this.$t("加密货币入款详情");
            } else {
              if (rowData.status === 2) {
                this.auditTitle = this.$t("公司入款审核");
              } else {
                this.auditTitle = this.$t("公司入款详情");
              }
            }
          });
      }
    },
    closeDetail() {
      this.rowData = {};
      this.detailShow = false;
    },

    // 修改某条数据的状态 trueStatus走不同的接口
    changeStatus(status, id) {
      if (!this.actualArrival && this.actualArrival !== 0) {
        this.$message.warning(this.$t("请填写实际到账"));
        return;
      }
      // 安全密码弹窗
      if (status == 1 && !this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.changeStatus);
        this.$set(this.tmpValue4SafeCheck, "args", [status, id]);

        return;
      }
      // 0是拒绝 1是通过 调用不同接口
      let url =
        status === 1
          ? systemConfig.urls.updateStatus
          : systemConfig.urls.updateStatusRefuse;
      const obj = { status: status, id: id, memo: this.memo ,pictureList: this.pictureList.length?(this.pictureList):(this.rowData.fastDepositPicture)};
      const params =
        this.actualArrival === this.initActualArrival
          ? obj
          : {
              ...obj,
              actualArrival: this.actualArrival,
            };
      this.$axios
        .post(url, params, {
          headers: { securepwd: this.safePassword || null },
        })
        .then((resp) => {
          this.$message({
            type: "success",
            message: this.$t("成功"),
          });
          this.getData();
          bus.$emit("updateCount", true);
          this.changeMemo(id, 1);
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
    },
    // 修改某条数据的备注
    changeMemo(id, flag) {
      /*只做关闭，不做备注更新*/
      this.closeDetail();
    },
    changeFaild(row){
      // 安全密码弹窗
      if (!this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.changeFaild);
        this.$set(this.tmpValue4SafeCheck, "args", [row]);
        return;
      }
      this.$axios.post(systemConfig.urls.updateStatusSucToFail, {status: 0, id: row.id, memo: this.memo},{headers: { securepwd: this.safePassword || null }}).then((resp) => {
        if (resp) {
          this.$message({
            type: 'success',
            message: this.$t('操作成功'),
            position: 'top-right'
          })
        }
        this.getData()
        this.memo = ''
      }).finally(()=>{
        this.closeDetail();
        this.safePassword = ''
        this.tmpValue4SafeCheck = {};
      })
    },
    filterTag(value, row) {
      return row.status === value;
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    // 获取会员options
    getMemberOptions() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.groupOptions = resp.data.page;
      });
    },
    checkAllOrder(loginName) {
      this.loginName = loginName;
      this.detailShow = false;
      this.getData();
    },
    queryParams(obj) {
      const arr = []
      for (let key in obj) {
        arr.push(`${key}=${obj[key]}`)
      }
      return arr.join('&')
    },
    // 获取表格数据  + '&createTimeFrom=' + this.startTime + '&createTimeTo=' + this.endTime
    getData() {
      this.$store.state.searchLoading = true;
      let isTest = this.agyId == 2 ? 0 : this.agyId == 3 ? 1 : "";
      let agyAccountStr = this.agyId == 1 ? this.agyAccount : ""; //精确查询
      if (this.$router.history.current.query.status && this.isym) {
        this.statusSelectChange(
          parseInt(this.$router.history.current.query.status)
        );
        this.isym = false;
      }
      if (this.$router.history.current.query.groupId && this.isym) {
        this.groupIds = [parseInt(this.$router.history.current.query.groupId)];
        this.isym = false;
      }
      const groupIds = this.groupIds.length ? this.groupIds.join(',') : ''
      const idsKey = ["onlinePayIds", "companyPayIds", "qrCodePayIds"][this.mark]
      let url =
        "?pageSize=" +
        this.listReq.pageSize +
        "&pageNo=" +
        this.listReq.pageNo +
        `${idsKey ? `&${idsKey}=${this.companyPayIds}` : ''}`
      const params = {
        orderNoStr: this.orderNo,
        statuss: this.statuss.join(),
        loginName: this.loginName,
        depositUser: this.depositUser,
        minDepositAmount: this.minDepositAmount,
        maxDepositAmount: this.maxDepositAmount,
        auditUser: this.auditUser,
        markStr: this.mark,
        receivedType: this.receivedType,
        isTest,
        agyAccountStr,
        groupIds,
        startAuditTime: systemConfig.transferTimeByType(this.startAuditTime, this.timeType),
        endAuditTime: systemConfig.transferTimeByType(this.endAuditTime, this.timeType),
      }
      if (this.mark === 3) {
        const companyPayIds = this.companyPayIds.map(i => this.depositOptions.find(_i => _i.id === i))
        params.currencyCodes = companyPayIds.map(i => i.bankCode).join()
        params.currencyProtocols = companyPayIds.map(i => i.category).join()
      }
      if (this.startTime) {
        url +=
          "&createTimeFrom=" +
          systemConfig.transferTimeByType(this.startTime, this.timeType);
      }
      if (this.endTime) {
        url +=
          "&createTimeTo=" +
          systemConfig.transferTimeByType(this.endTime, this.timeType);
      }
      this.tempUrl = `${url}&${this.queryParams(params)}`;
      this.$axios.get(systemConfig.urls.PayNewSearch + url, { params }).then((resp) => {
        let data = resp.data.page.list;
        data.map(v => {
          v.orderNoText = v.orderPrefix + v.orderNo
        })
        this.tableData = data;
        this.total = resp.data.page.totalCount;
        if (this.status) {
          this.filterArr = systemConfig.getStatusArr(this.status);
        }
      });
      this.$axios
        .get(systemConfig.urls.getDepositSumStatistic + url, { params })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.staticData = res.data.page;
        });
    },
    setThounds(val) {
      const num = val ? val : 0
      return num.toLocaleString()
    },
    statusTextFilter(status) {
      switch (status) {
        case 0:
          return this.$t("失败");
        case 1:
          return this.$t("成功");
        case 2:
          return this.$t("待处理");
      }
    },
    typeTextFilter(type) {
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
    getChildAgent() {
      this.$axios.get(systemConfig.urls.getAllChildAgent).then((resp) => {
        this.agyAccountOptions = resp.data.accounts;
        this.trueAgyAccountOptions = resp.data.accounts;
      });
    },
    getAgyAccount(id) {
      if (id.length > 0) {
        this.agyAccountOptions = [];
        this.q.agyAccountId = [];
        for (let i = 0; i < id.length; i++) {
          this.$axios
            .get(systemConfig.urls.getAgyAccount + "?parentId=" + id[i])
            .then((resp) => {
              let tempArr = resp.data.accounts;
              if (this.agyAccountOptions.length > 0) {
                for (let k = 0; k < this.agyAccountOptions.length; k++) {
                  for (let j = 0; j < tempArr.length; j++) {
                    if (this.agyAccountOptions[k].id !== tempArr[j].id) {
                      this.agyAccountOptions = this.agyAccountOptions.concat(
                        resp.data.accounts
                      );
                    }
                  }
                }
              } else {
                this.agyAccountOptions = this.agyAccountOptions.concat(
                  resp.data.accounts
                );
              }
            });
        }
      } else {
        this.agyAccountOptions = this.trueAgyAccountOptions;
        this.$axios
          .get(systemConfig.urls.getAgyAccount + "?parentId=")
          .then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts;
          });
      }
    },
    // 获取今日取款
    getTodayWithdraw() {
      this.$axios
        .get(systemConfig.urls.getFundDepositSumWithdrawAmount + "?make=1")
        .then((resp) => {
          this.allTodayWithdraw = systemConfig.toThousands(resp.data.sum);
        });
    },
    castData(row, column) {
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
    handleExport() {
      // if (this.total > 10000) {
      //   this.$message.error('导出一次性不能超过一万条')
      //   return
      // }
      if (!this.startTime || !this.endTime) {
        this.$message.warning(this.$t('请选择存款时间'))
        return
      }
      this.isNowDowning = false;
      this.deposit = {
        marginRight: "95px",
      };
      this.$axios
        .get(systemConfig.urls.exportDepositExcel + this.tempUrl)
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
    checkExportFile() {
      // 查看导出文件是否可下载
      this.$axios.get(systemConfig.urls.checkDepositIsDown).then((res) => {
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
            marginRight: "75px",
          };
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },
    checkAccount(val) {
      this.agyAccount = "";
    },
    more() {
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
    handleUploadImage({ file }) {
      if (/^image/.test(file.type)) {
        this.uploadFile = file;
        //上传图片资源
        const formData = new FormData();
        formData.append("uploadFile", this.uploadFile);
        this.$axios
          .post(systemConfig.urls.uploadImage, formData)
          .then((res) => {
            if (res) {
              this.uploadFile = "";
              this.pictureList.push(res.data.path)
            }
          });
      } else {
        this.uploadFile = "";
        this.$message.error(this.$t("文件格式错误，只支持图片！"));
      }
    },
    // 上传凭证
    handleAvatarSuccess( { file } ) {
      const formData = new FormData();
      formData.append("uploadFile", file);
      return this.$axios
        .post(systemConfig.urls.uploadImage, formData)
        .then((res) => {
          if(res.data.code===0){
            this.$message.success(this.$t('图片上传成功！'))
            this.imageUrl = res.data.path
          }
        }).catch(()=>{
          this.onAvatarRemove()
        })
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png'  ||
        file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG / PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 3MB!');
      }
      return isJPG && isLt2M;
    },
    // handleAvatarChange(file,filelist){
	  //   // this.imageUrl=URL.createObjectURL(file.raw);
	  //   this.imageUrl = URL;
	  // },
    onAvatarRemove ( ) {
      this.imageUrl= ""
      this.defineIndustryPicList = []
      // this.clearFiles()
    },
    showPicture (path) {
      this.picPreviewShow = true
      this.showCurpicPath = path
    },
    seeDetail (row) {
      this.receivedDetail = true
      console.log(row)
      this.receiveRowData = row
    },
  },
};
</script>
<style scoped lang="scss">
.exportList{
  height: 28px;
  line-height: 15px;
  margin-top: 1px;
}
.toggle_to_new_page {
  cursor: pointer;
  color: #409eff;
}
.first-line {
  /deep/ .el-popover__reference-wrapper {
    left: auto;
    right: 0;
  }
}
.noborder{
  /deep/ .el-form-item__content{border:0;display: flex;align-items: center;}
  img{width:120px;margin-right:15px;}
  .uploadimgbtn{
    min-width:68px!important;
    width:68px!important;
    height:30px;
    line-height:30px;
    display:flex;
    align-items:center;
  }
}


.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 81px;
    line-height: 78px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }


i.el-icon-plus.avatar-uploader-icon {
  border: 1px solid #dddfe5;
  width: 503px;
  border-radius: 5px;
}

.hide /deep/.el-upload{display: none!important;}

</style>
