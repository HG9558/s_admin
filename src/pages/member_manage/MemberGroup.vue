<template>
  <div class="member-group" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search">
      <div class="search-basic">
        <div class="search-basic-item width180">
          <label>{{ $t('会员组') }}</label>
          <el-select
            v-model="q.groupId"
            :placeholder="$t('请选择')"
            multiple
            size="small"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select
            v-model="q.available"
            :placeholder="$t('请选择')"
            multiple
            size="small"
          >
            <!--<el-option label="全选" value=""></el-option>-->
            <el-option :label="$t('禁用')" value="0"></el-option>
            <el-option :label="$t('启用')" value="1"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('升级锁定') }}</label>
          <el-select
            v-model="q.isLockUpgrade"
            :placeholder="$t('请选择')"
            size="small"
          >
            <!--<el-option label="全选" value=""></el-option>-->
            <el-option :label="$t('全部')" value=""></el-option>
            <el-option :label="$t('正常')" value="0"></el-option>
            <el-option :label="$t('锁定')" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="div-search-btn" style="top: 60%; transform: translateY(-50%)">
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
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button
        v-if="hasPermission('member:mbrgroup:bankDifferentName')"
        style="margin-right: 20px;"
        type="primary"
        size="mini"
        @click="bankSet"
        >{{ $t('银行卡设置') }}</el-button
      >
      <el-upload
        class="upload-demo"
        action=""
        :http-request="handleUploadImage"
        :file-list="fileList"
        :show-file-list="false"
        list-type="picture"
      >
        <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
      </el-upload>
      <el-button
        style="margin-left: 20px; width: 100px"
        v-if="hasPermission('member:mbrgroup:save')"
        icon="el-icon-circle-plus-outline"
        type="primary"
        size="mini"
        @click="add"
        >{{ $t('新增') }}</el-button
      >
    </el-row>

    <el-table
      type="flex"
      :data="tableData.list"
      @sort-change="sortevtg"
      v-loading="loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label-class-name="heightThe"
        type="index"
        :label="$t('序号')"
        :index="indexMethod"
        align="center"
        width="45px"
      ></el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="groupName"
        :label="$t('会员组')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.groupName
          }}<span v-if="scope.row.groupDone == 0">({{ $t('未完成') }})</span>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        :label="$t('晋升条件')"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.deposit">
              {{ $t('累计存款') }}>={{ scope.row.deposit }}
            </div>
            <div v-if="scope.row.depositTimes">
              {{ $t('累计存款次数') }}>={{ scope.row.depositTimes }}
            </div>
            <div v-if="scope.row.companyWinLose">
              {{ $t('累计公司输赢') }}>={{ scope.row.companyWinLose }}
            </div>
            <div v-if="scope.row.validBet">
              {{ $t('累计有效投注') }}>={{ scope.row.validBet }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="mbrNums"
        :label="$t('会员数')"
        align="center"
      >
        <template slot-scope="scope">
          <span
            class="blue-color pointer"
            @click="
              $router.push(
                '/main/memberManage/memberList?groupId=' + scope.row.groupId
              )
            "
          >
            {{ scope.row.mbrNums }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="depositFee"
        :label="$t('线上入款收取手续费')"
        align="center"
      ></el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="feeTimes"
        :label="$t('存款限免次数')"
        :formatter="feeTimes"
        align="center"
      ></el-table-column>
      <!-- 人民币取款限额 -->
      <el-table-column
        label-class-name="heightThe"
        :label="$t('取款限额')"
        :formatter="wlowQuotaRange"
        width="110px"
        align="center"
      ></el-table-column>
      <el-table-column
        label-class-name="heightThe"
        :label="$t('加密货币取款限额')"
        :formatter="wlowUsdtRange"
        width="110px"
        align="center"
      ></el-table-column>
      <el-table-column
        label-class-name="heightThe"
        :label="$t('支付宝取款限额')"
        :formatter="zfbRange"
        width="110px"
        align="center"
      ></el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="withdrawalFee"
        :label="$t('取款手续费')"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.chargeFeeAvailable ? scope.row.withdrawalFee : "" }}
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        prop="wfeeTimes"
        :label="$t('取款限免次数')"
        :formatter="wfeeTimes"
        align="center"
      ></el-table-column>

       <el-table-column
        label-class-name="heightThe"
        prop="sort"
        :label="$t('排序')"
        align="center"
      ></el-table-column>

      <!-- 未完成存款和取款就是禁用de  -->
      <el-table-column
        label-class-name="heightThe"
        :label="$t('是否启用')"
        prop="available"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-show="scope.row.id !== 1"
            v-model="scope.row.available"
            :disabled="
              !hasPermission('member:mbrgroup:update') ||
              scope.row.groupDone === 0
            "
            @change="toggle(scope.row)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        :label="$t('升级锁定')"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isLockUpgrade"
            :disabled="!hasPermission('member:mbrgroup:update')"
            @change="handleUpdateLock(scope.row)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="heightThe"
        :label="$t('操作')"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="hasPermission('member:mbrgroup:update')"
            class="blue-color pointer"
            @click="update(scope.row)"
            >[{{ $t('编辑') }}]</span
          >
          <span
            v-if="hasPermission('member:mbrdepositcond:info')"
            class="blue-color pointer"
            @click="deposit(scope.row.groupId)"
            >[{{ $t('存款设置') }}]</span
          >
          <span
            v-if="hasPermission('member:mbrwithdrawalcond:info')"
            class="blue-color pointer"
            @click="withdrawal(scope.row)"
            >[{{ $t('取款设置') }}]</span
          >
          <!-- <el-button v-if="hasPermission('member:mbrrebate:info')" type="text" size="small" @click="openRebate(scope.row.id)">[返利设置]</el-button> -->
          <span
            v-if="hasPermission('member:mbrgroup:delete')"
            class="blue-color pointer"
            v-show="scope.row.mbrNums == 0 && scope.row.isDef == 0"
            @click="deleteGro(scope.row)"
            >[{{ $t('删除') }}]
          </span>
          <!--</div>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listReq.pageNo"
        :page-sizes="listReq.pageSizeArr"
        :page-size="listReq.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount"
      >
      </el-pagination>
    </div>
      <div class="intTime">
        <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
        <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
      </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      @close="mbrGroupCancel('mbrGroup')"
    >
      <el-form
        class="small-space edit"
        label-position="top"
        ref="mbrGroup"
        :model="mbrGroup"
        :rules="commonRule"
      >
        <el-form-item
          size="small"
          :label="$t('会员组')"
          prop="groupName"
          :rules="[
            { required: true, message: $t('不能为空') },
            { max: 16, message: $t('会员组名最大长度为16位') },
          ]"
        >
          <el-input
            v-model="mbrGroup.groupName"
            :placeholder="$t('会员组')"
          ></el-input>
        </el-form-item>

        <el-form-item
          size="small"
          :label="$t('排序')"
          prop="sort">
          <el-input
            v-model="mbrGroup.sort"
            :placeholder="$t('数字越小越靠前')"
            type="text"
            maxlength="10"
            onkeyup="value=value.replace(/^[^0-9]|[^\d]+/g,'')">
          </el-input>
        </el-form-item>

        <el-form-item
          size="small"
          :label="$t('晋升条件')"
          prop="deposit"
          :rules="[
            { required: true, message: $t('不能为空') },
            {
              validator: (rule, value, callback) => {
                const {
                  deposit: _deposit,
                  depositTimes,
                  companyWinLose,
                  validBet,
                } = this.mbrGroup;
                if (!_deposit && _deposit !== 0)
                  return callback($t('请输入累计存款'));
                if (!depositTimes && depositTimes !== 0)
                  return callback($t('请输入累计存款笔数'));
                if (!companyWinLose && companyWinLose !== 0)
                  return callback($t('请输入累计公司输赢'));
                if (!validBet && validBet !== 0)
                  return callback($t('请输入累计有效投注'));
                callback();
              },
            },
          ]"
        >
          <el-input
            type="number"
            v-model="mbrGroup.deposit"
            :placeholder="$t('累计存款')">
            <template slot="prepend">
              <span class="blue-color">
                {{ $t('累计存款') }}>=
                </span>
            </template>
          </el-input>
          <el-input
            type="number"
            v-model="mbrGroup.depositTimes"
            :placeholder="$t('累计存款笔数')"
            ><template slot="prepend"
              ><span class="blue-color">{{ $t('累计存款笔数') }}>=</span></template
            ></el-input
          >
          <el-input
            type="number"
            v-model="mbrGroup.companyWinLose"
            :placeholder="$t('累计公司输赢')"
            ><template slot="prepend"
              ><span class="blue-color">{{ $t('累计公司输赢') }}>=</span></template
            ></el-input
          >
          <el-input
            type="number"
            v-model="mbrGroup.validBet"
            :placeholder="$t('累计有效投注')"
            ><template slot="prepend"
              ><span class="blue-color">{{ $t('累计有效投注') }}>=</span></template
            ></el-input
          >
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('备注')"
          prop="memo"
          :rules="commonRule.notNull"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="$t('请输入内容')"
            v-model="mbrGroup.memo"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mbrGroupCancel('mbrGroup')" size="small"
          >{{ $t('取消') }}</el-button
        >
        <el-button type="primary" @click="saveMbrGourp" size="small"
          >{{ $t('保存') }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('存款设置')"
      :visible.sync="depositFormVisible"
      @close="depositSettingCancel('mbrDeposit')"
      width="70%"
    >
      <el-form
        class="small-space form-content mb-text-right"
        label-position="right"
        :model="mbrDepositCond"
        ref="mbrDeposit"
        :rules="commonRule"
      >
        <el-form-item size="small" :label="$t('复制权限组')">
          <el-select
            v-model="cpGroup"
            :placeholder="$t('请选择')"
            @change="fnCpGroup(cpGroup, 'depositSet')"
          >
            <el-option value="" :label="$t('空')"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" :label="$t('公司入款是否返还手续费')">
          <el-switch
            v-model.number="mbrDepositCond.feeEnable"
            :inactive-value="0"
            :active-value="1"
          ></el-switch>
          <!-- <span>返还金额请在<span @click="jump" style="color: #409eff;cursor:pointer">支付列表</span>中设置</span> -->
        </el-form-item>
        <el-form-item size="small" :label="$t('线上入款是否收取手续费')">
          <el-switch
            v-model="mbrDepositCond.feeAvailable"
            :inactive-value="0"
            :active-value="1"
            @change="setMbrDepositCondNull"
          ></el-switch>
        </el-form-item>
        <el-form-item size="small" :label="$t('公司入款是否开启存款姓名')">
          <el-switch
            v-model="mbrDepositCond.depositName"
            :inactive-value="0"
            :active-value="1"
          ></el-switch>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('限免周期')"
          prop="feeHours"
          :rules="setMbrDepositCondNullFlag ? null : commonRule.shouldSelect"
        >
          <el-radio-group
            v-model="mbrDepositCond.feeHours"
            :disabled="setMbrDepositCondNullFlag"
          >
            <el-radio
              :label="item.label"
              v-for="item in feeHoursOptions"
              :key="item.label"
              >{{ item.text }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item size='small' :label="$t('时限')/小时" prop="feeHours"
                        :rules="[{required: !setMbrDepositCondNullFlag, message: '不能为空'},{type: 'integer', min: 1, message: '请输入大于0的正整数'}]">
            <el-input :disabled="setMbrDepositCondNullFlag" type="number" v-model.number="mbrDepositCond.feeHours"></el-input>
          </el-form-item> -->
        <el-form-item
          size="small"
          :label="$t('限免次数')"
          prop="feeTimes"
          :rules="[
            { required: !setMbrDepositCondNullFlag, message: $t('不能为空') },
            { type: 'integer', min: 0, message: $t('请输入整数') },
          ]"
        >
          <el-input
            :disabled="setMbrDepositCondNullFlag"
            type="number"
            v-model.number="mbrDepositCond.feeTimes"
          ></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('手续费比例')"
          prop="feeScale"
          :rules="[
            { required: !setMbrDepositCondNullFlag, message: $t('不能为空') },
            {
              type: 'number',
              min: 0,
              max: 100,
              message: $t('请输入0-100之间的整数'),
            },
          ]"
        >
          <el-input
            :disabled="setMbrDepositCondNullFlag"
            type="number"
            v-model.number="mbrDepositCond.feeScale"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
          <!-- label="手续费上限金额CNY" -->
        <el-form-item
          size="small"
          :label="$t('手续费上限金额') + currencySymbol()"
          prop="feeTop"
          :rules="[
            { required: !setMbrDepositCondNullFlag, message: $t('不能为空') },
            { type: 'number', min: 1, message: $t('请输入大于0的正数') },
          ]"
        >
          <el-input
            :disabled="setMbrDepositCondNullFlag"
            type="number"
            v-model.number="mbrDepositCond.feeTop"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 存款条件设置 -->
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="depositSettingCancel('mbrDeposit')"
          size="small"
          style="width: 145px"
          >{{ $t('取消') }}</el-button
        >
        <!-- 新增权限 -->
        <el-button
          v-if="
            hasPermission('member:mbrdepositcond:save') && !mbrDepositCond.id
          "
          type="primary"
          @click="saveOrUpdateMbrDeposit('add')"
          size="small"
          >{{ $t('新增并设置取款') }}</el-button
        >
        <!-- 修改权限 -->
        <el-button
          v-else-if="hasPermission('member:mbrdepositcond:update')"
          type="primary"
          @click="saveOrUpdateMbrDeposit('update')"
          size="small"
          >{{ $t('保存并设置取款') }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('取款设置')"
      class="withdrawal"
      :visible.sync="withdrawalFormVisible"
      @close="withdrawSettingCancel('mbrWithdraw')"
      width="70%"
    >
      <el-form
        class="small-space form-content mb-text-right"
        :model="mbrWithdrawalCond"
        :rules="commonRule"
        ref="mbrWithdraw"
        label-position="right"
      >
        <el-form-item size="small" :label="$t('复制权限组')">
          <el-select
            v-model="cpGroup"
            :placeholder="$t('请选择')"
            @change="fnCpGroup(cpGroup, 'withdrawSet')"
          >
            <el-option value="" :label="$t('空')"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 人民币取款限额 -->
        <div class="dialog-title">{{ currencyType() }} {{ $t('取款限额') }}</div>
        <!-- label="单笔最低限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最低限额') + currencySymbol()"
          prop="lowQuota"
          :rules="commonRule.numberRule"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.lowQuota"
          ></el-input>
        </el-form-item>
        <!-- label="单笔最高限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最高限额') + currencySymbol()"
          prop="topQuota"
          :rules="[
            { required: true, message: $t('不能为空'), trigger: 'blur' },
            {
              type: 'integer',
              min: mbrWithdrawalCond.lowQuota,
              message: $t('不能低于最低限额'),
            },
          ]"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.topQuota"
          ></el-input>
        </el-form-item>

        <div class="dialog-title">{{ $t('加密货币取款限额') }}</div>
        <!-- label="单笔最低限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最低限额') + currencySymbol()"
          prop="lowQuota"
          :rules="commonRule.numberRule"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.lowUsdt"
          ></el-input>
        </el-form-item>
        <!-- label="单笔最高限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最高限额') + currencySymbol()"
          prop="topQuota"
          :rules="[
            { required: true, message: $t('不能为空'), trigger: 'blur' },
            {
              type: 'integer',
              min: mbrWithdrawalCond.lowUsdt,
              message: $t('不能低于最低限额'),
            },
          ]"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.topUsdt"
          ></el-input>
        </el-form-item>
        <div class="dialog-title">{{ $t('支付宝取款限额') }}</div>
        <!-- label="单笔最低限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最低限额') + currencySymbol()"
          prop="lowQuota"
          :rules="commonRule.numberRule"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.lowAlipayQuota"
          ></el-input>
        </el-form-item>
        <!-- label="单笔最高限额CNY" -->
        <el-form-item
          size="small"
          :label="$t('单笔最高限额') + currencySymbol()"
          prop="topQuota"
          :rules="[
            { required: true, message: $t('不能为空'), trigger: 'blur' },
            {
              type: 'integer',
              min: mbrWithdrawalCond.lowUsdt,
              message: $t('不能低于最低限额'),
            },
          ]"
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.topAlipayQuota"
          ></el-input>
        </el-form-item>

        <div class="dialog-title">{{ $t('每日取款限额') }}</div>

        <el-form-item size="small" :label="$t('是否限制')">
          <el-switch
            v-model="mbrWithdrawalCond.feeAvailable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="0"
            :active-value="1"
            @change="setlimitNull"
          ></el-switch>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('每日允许取款次数')"
          prop="withDrawalTimes"
          :rules="[
            {
              required: transferToBoolean(mbrWithdrawalCond.feeAvailable),
              message: $t('不能为空'),
              trigger: 'blur',
            },
            { type: 'integer', min: 1, message: $t('请输入大于0的正整数') },
          ]"
        >
          <el-input
            :disabled="!transferToBoolean(mbrWithdrawalCond.feeAvailable)"
            type="number"
            v-model.number="mbrWithdrawalCond.withDrawalTimes"
          ></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('每日取款限额')"
          prop="withDrawalQuota"
          :rules="[
            {
              required: transferToBoolean(mbrWithdrawalCond.feeAvailable),
              message: $t('不能为空'),
              trigger: 'blur',
            },
            { type: 'integer', min: 1, message: $t('请输入大于0的正整数') },
          ]"
        >
          <el-input
            :disabled="!transferToBoolean(mbrWithdrawalCond.feeAvailable)"
            type="number"
            v-model.number="mbrWithdrawalCond.withDrawalQuota"
          ></el-input>
        </el-form-item>
        <!--        <div class="dialog-title">极速取款-->
        <!--        </div>-->
        <!--        <el-form-item size='small' label="单笔保证金按比例收费" prop=""-->
        <!--                      :rules="[{required: false, message: '不能为空', trigger: 'blur'},{type: 'integer', min: 1, message: '请输入大于0的正整数'}]">-->
        <!--          <el-input type="number"-->
        <!--                    v-model.number="mbrWithdrawalCond.fastWithdrawFeePercent"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item size='small' label="单笔保证金固定收费" prop=""-->
        <!--                      :rules="[{required: false, message: '不能为空', trigger: 'blur'},{type: 'integer', min: 1, message: '请输入大于0的正整数'}]">-->
        <!--          <el-input type="number"-->
        <!--                    v-model.number="mbrWithdrawalCond.fastWithdrawFeeAmount"></el-input>-->
        <!--        </el-form-item>-->
        <div class="dialog-title">{{ $t('手续费设置') }}</div>
        <el-form-item size="small" :label="$t('是否收取手续费')">
          <el-switch
            v-model="mbrWithdrawalCond.chargeFeeAvailable"
            :inactive-value="0"
            :active-value="1"
          ></el-switch>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('限免周期')"
          prop="feeHours"
          :rules="
            mbrWithdrawalCond.chargeFeeAvailable
              ? commonRule.shouldSelect
              : null
          "
        >
          <el-radio-group
            v-model="mbrWithdrawalCond.feeHours"
            :disabled="!mbrWithdrawalCond.chargeFeeAvailable"
          >
            <el-radio
              :label="item.label"
              v-for="item in feeHoursOptions"
              :key="item.label"
              >{{ item.text }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('限免次数')"
          prop="feeTimes"
          :rules="
            mbrWithdrawalCond.chargeFeeAvailable ? commonRule.numberRule : null
          "
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.feeTimes"
            :disabled="!mbrWithdrawalCond.chargeFeeAvailable"
          ></el-input>
        </el-form-item>
          <!-- label="手续费上限金额CNY" -->
        <el-form-item
          size="small"
          :label="$t('手续费上限金额') + currencySymbol()"
          prop="feeTop"
          :rules="
            mbrWithdrawalCond.chargeFeeAvailable ? commonRule.numberRule : null
          "
        >
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.feeTop"
            :disabled="!mbrWithdrawalCond.chargeFeeAvailable"
          ></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('按比例收费')"
          prop="feeScale"
          :rules="
            mbrWithdrawalCond.chargeFeeAvailable
              ? [
                  {
                    required: mbrWithdrawalCond.feeWay === 0,
                    message: $t('不能为空'),
                    trigger: 'blur',
                  },
                  {
                    type: 'integer',
                    min: 1,
                    max: 100,
                    message: '请输入0-100之间的正整数',
                  },
                ]
              : null
          "
        >
          <el-input
            type="number"
            :disabled="
              !mbrWithdrawalCond.chargeFeeAvailable ||
              mbrWithdrawalCond.feeWay === 1
            "
            v-model.number="mbrWithdrawalCond.feeScale"
          >
            <el-radio
              class="radio"
              v-model.number="mbrWithdrawalCond.feeWay"
              @change="feeChange(0)"
              :label="0"
              :disabled="!mbrWithdrawalCond.chargeFeeAvailable"
              slot="prepend"
            ></el-radio>
            <el-button slot="append">%</el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('固定收费')"
          prop="feeFixed"
          :rules="
            mbrWithdrawalCond.chargeFeeAvailable
              ? [
                  {
                    required: mbrWithdrawalCond.feeWay === 1,
                    message: $t('不能为空'),
                    trigger: 'blur',
                  },
                  {
                    type: 'integer',
                    max: mbrWithdrawalCond.feeTop,
                    message: $t('不能高于上限金额'),
                  },
                ]
              : null
          "
        >
          <el-input
            :disabled="
              !mbrWithdrawalCond.chargeFeeAvailable || !mbrWithdrawalCond.feeWay
            "
            type="number"
            v-model.number="mbrWithdrawalCond.feeFixed"
          >
            <el-radio
              class="radio"
              v-model.number="mbrWithdrawalCond.feeWay"
              @change="feeChange(1)"
              :label="1"
              :disabled="!mbrWithdrawalCond.chargeFeeAvailable"
              slot="prepend"
            ></el-radio>
            <el-tooltip
              slot="append"
              class="item"
              effect="light"
              :content="$t('按比例收费和固定收费选择互斥；默认选择按比例收费')"
              placement="right"
            >
              <el-button>≤{{ mbrWithdrawalCond.feeTop }}</el-button>
            </el-tooltip>
          </el-input>
        </el-form-item>

        <div class="dialog-title">{{ $t('取款稽核设置') }}</div>
        <el-form-item
          size="small"
          :label="$t('存款稽核')"
          prop="withDrawalAudit"
          :rules="auditMultipleRule"
        >
          <el-input
            :placeholder="$t('存款稽核')"
            type="number"
            v-model="mbrWithdrawalCond.withDrawalAudit"
          >
            <i slot="suffix" style="font-size: 16px; line-height: 30px">{{ $t('倍') }}</i>
            <template slot="append">
              <el-popover
                ref="popover1"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="$t('会员取款时候针对会员存款的默认稽核倍数，默认为1，若设置为0则不稽核；')"
              ></el-popover>
              <el-button v-popover:popover1>?</el-button>
            </template>
          </el-input>
        </el-form-item>
          <!-- label="放宽额度CNY" -->
        <el-form-item
          size="small"
          :label="$t('放宽额度') + currencySymbol()"
          prop="overFee"
          :rules="commonRule.numberRule"
        >
            <!-- placeholder="放宽额度CNY" -->
          <el-input
            :placeholder="$t('放宽额度') + currencySymbol()"
            type="number"
            v-model.number="mbrWithdrawalCond.overFee"
          >
            <template slot="append">
              <el-popover
                ref="popoveroverFee"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="$t('会员取款时候判定是否输光的条件；默认为5；')"
              ></el-popover>
              <el-button v-popover:popoveroverFee>?</el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="dialog-title" style="display: inline-block">
          {{ $t('返利钱包提款限额') }}
        </div>
        <el-form-item size="small" class="back-money-limit">
          <el-input
            type="number"
            v-model.number="mbrWithdrawalCond.rebateMinimum"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="withdrawSettingCancel('mbrWithdraw')" size="small"
          >{{ $t('取消') }}</el-button
        >
        <el-button
          v-if="
            hasPermission('member:mbrwithdrawalcond:save') &&
            !mbrWithdrawalCond.id
          "
          type="primary"
          @click="saveOrUpdateMbrWithdrawal('add')"
          size="small"
          >{{ $t('新增') }}</el-button
        >
        <el-button
          v-else-if="hasPermission('member:mbrwithdrawalcond:update')"
          type="primary"
          @click="saveOrUpdateMbrWithdrawal('update')"
          size="small"
          >{{ $t('保存') }}</el-button
        >
      </div>
    </el-dialog>
    <RebateSetting
      :id="idForRebateSetting"
      :list="list"
      v-if="isRebateSettingShow"
      @close="isRebateSettingShow = false"
    />
    <el-dialog
      :title="$t('银行卡参数设置')"
      class="withdrawal"
      :visible.sync="bankFormVisible"
      @close="bankSettingCancel('bankForm')"
      width="70%"
    >
      <el-form
        class="small-space form-content mb-text-right"
        :model="bankForm"
        :rules="commonRule"
        ref="bankForm"
        label-position="top"
      >
        <el-form-item
          size="small"
          :label="$t('是否启用不同名银行卡')"
          prop="bankDifferentName"
          :rules="commonRule.shouldSelect"
        >
          <el-radio-group v-model="bankForm.bankDifferentName">
            <el-radio
              :label="item.label"
              v-for="item in ifOptions"
              :key="item.label"
              >{{ item.text }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('不同名银行卡数量')"
          prop="bankDifferentNumber"
          :rules="commonRule.numberRule"
        >
          <el-input
            type="number"
            v-model.number="bankForm.bankDifferentNumber"
          ></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          :label="$t('指定会员组级别')"
          prop="id"
          :rules="commonRule.notNull"
        >
          <el-select v-model="bankForm.id" :placeholder="$t('请选择')">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>{{ $t('移至该层级的会员不允许移出') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankSettingCancel('bankForm')" size="small"
          >{{ $t('关闭') }}</el-button
        >
        <el-button type="primary" @click="saveOrUpdateBank" size="small"
          >{{ $t('保存') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../config/config";
import { checkNumberAndDecimals } from "../../config/utils";

import vc from "../../public/lib";
import RebateSetting from "./RebateSetting";
import queryStore from "../../mixins/queryStore";
import { mapGetters } from "vuex";
import _ from "lodash";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

export default {
  name: "memberGroup",
  mixins: [queryStore(["q"]), Mixin, site],
  components: { RebateSetting },
  data() {
    return {
      fileList: [],
      postData: {},
      vc,
      list: [],
      tableData: {},
      dialogTitle: "",
      sort: '',
      dialogFormVisible: false,
      depositFormVisible: false,
      withdrawalFormVisible: false,
      q: {},
      cpGroup: "",
      mbrGroup: {},
      mbrWithdrawalCond: { withDrawalAudit: 1 },
      mbrDepositCond: {},
      isCreate: false,
      commonRule: systemConfig.rules.commonRule,
      setMbrDepositCondNullFlag: true,
      setlimitNullFlag: true,
      idForRebateSetting: null,
      isRebateSettingShow: false,
      feeHoursOptions: [
        {
          text: this.$t("自然日"),
          label: 1,
        },
        {
          text: this.$t("自然周"),
          label: 2,
        },
        {
          text: this.$t("自然月"),
          label: 3,
        },
      ],
      bankFormVisible: false,
      bankForm: {},
      ifOptions: [
        { label: 1, text: this.$t("是") },
        { label: 0, text: this.$t("否") },
      ],
      levelList: [],
      auditMultipleRule: {
        validator: (rule, value, callback) => {
          const { withDrawalAudit } = this.mbrWithdrawalCond;
          if (
            checkNumberAndDecimals(withDrawalAudit, 2) &&
            withDrawalAudit >= 0
          ) {
            callback();
          } else {
            callback(new Error(this.$t("大于等于0且允许2位小数")));
          }
        },
        trigger: "blur",
      },

    };
  },
  created() {
    this.fnGroup();
    this.getList();
  },
  computed: {
    ...mapGetters(["hasPermission"]),
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
  },
  methods: {
    handleUpdateLock(row) {
      this.$store.state.searchLoading = true;
      this.mbrGroup = row;
      this.saveMbrGourpSubmit();
    },
    handleUploadImage({ file }) {
      if (file.name.indexOf(".xlsx") != -1) {
        const formData = new FormData();
        formData.append("file", file);
        this.$axios
          .post(systemConfig.urls.uploadExcel, formData)
          .then(({ data }) => {
            this.$message.success(this.$t("上传成功"));
            // this.postData.qrImgUrl = data.path
          });
      } else {
        this.$message.error(this.$t("文件格式错误，只支持excel！"));
      }
    },
    jump() {
      this.$router.push("/main/operateManage/payList");
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    sortevtg(orders) {
      if (orders.order === "ascending") {
        this.q.orderBy = orders.prop + " asc";
      } else {
        this.q.orderBy = orders.prop + " desc";
      }
      this.getList();
    },
    toggle(row) {
      this.$store.state.searchLoading = true;
      this.$axios
        .post(systemConfig.urls.mbrUpdateAvailable, {
          id: row.id,
          available: row.available,
        })
        .then((res) => {
          /* this.listReq.pageNo = 1 */
          this.getList("updateStatus");
        })
        .catch((err) => {
          this.getList();
          this.$store.state.searchLoading = false;
        });
    },
    transferToBoolean(val) {
      return systemConfig.transferToBoolean(val);
    },
    filterTag(value, row) {
      return row.available === value;
    },
    handleSizeChange(val) {
      this.listReq.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.getList();
    },
    fnGroup() {
      this.list = [];
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        resp.data.page.forEach((value) => {
          this.list.push({ id: value.id, value: value.groupName });
        });
      });
    },
    add() {
      this.dialogTitle = this.$t("新增会员组");
      this.mbrGroup = {};
      this.dialogFormVisible = true;
      this.isCreate = true;
    },
    update(row) {
      this.dialogTitle = this.$t("编辑会员组");
      this.mbrGroup = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    async saveMbrGourpSubmit() {
      this.$store.state.fullscreenLoading = true;
      const { res } = await this.$axios.POST(
        this.mbrGroup.id
          ? systemConfig.urls.mbrGroupUpdate
          : systemConfig.urls.mbrGroupSave,
        {
          ...this.mbrGroup,
          sort: this.mbrGroup.sort ? Number(this.mbrGroup.sort) : this.mbrGroup.sort
        }
      );
      if (res) {
        this.getList();
      }
    },
    saveMbrGourp() {
      this.$refs.mbrGroup.validate(async (valid) => {
        if (valid) {
          this.saveMbrGourpSubmit().then(() => this.mbrGroupCancel("mbrGroup"));
        }
      });
    },
    deposit(groupId) {
      //存款设置
      this.getDepositInfo(groupId);
      this.depositFormVisible = true;
    },
    withdrawal(row) {
      this.getWithdrawalInfo(row.groupId);
      this.withdrawalFormVisible = true;
    },
    openRebate(id) {
      //设置返利
      this.idForRebateSetting = id;
      this.isRebateSettingShow = true;
    },
    getDepositInfo(id) {
      //获取存款信息
      this.$axios.get(systemConfig.urls.mbrDepositCondInfo + id).then((res) => {
        this.mbrDepositCond = res.data.mbrDepositCond;
        // if (!this.mbrGroup.id) {
        this.mbrGroup.id = id;
        // }
        if (this.mbrDepositCond.feeAvailable) {
          this.setMbrDepositCondNullFlag = false;
        } else {
          this.setMbrDepositCondNullFlag = true;
        }
      });
    },
    saveOrUpdateMbrDeposit(whickOption) {
      this.$refs.mbrDeposit.validate((valid) => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          if (whickOption == "update" && !this.mbrDepositCond.id) {
            this.$message({
              type: "warning",
              message: "暂无存款设置，请确认新增权限，进行新增",
            });
            return;
          }
          let url = this.mbrDepositCond.id
            ? systemConfig.urls.mbrDepositCondUpdate
            : systemConfig.urls.mbrDepositCondSave;
          if (this.mbrGroup.id) {
            this.mbrDepositCond.groupId = this.mbrGroup.id;
          }
          this.$axios.post(url, this.mbrDepositCond).then((resp) => {
            this.depositFormVisible = false;
            this.getList();
            this.getWithdrawalInfo(this.mbrGroup.id);
            this.withdrawalFormVisible = true;
            this.depositSettingCancel("mbrDeposit");
          });
        } /* else {
            this.$message({
              type: 'warning',
              message: '请输入完整的信息'
            })
          } */
      });
    },
    getWithdrawalInfo(id) {
      this.$axios
        .get(systemConfig.urls.mbrWithdrawCondInfo + id)
        .then((res) => {
          this.mbrWithdrawalCond = res.data.mbrWithdrawalCond;
          //设置默认值
          if (!this.mbrWithdrawalCond.id) {
            this.mbrWithdrawalCond.groupId = id;
            this.mbrWithdrawalCond.manageFee = 50;
            this.mbrWithdrawalCond.feeHours = 1;
            this.mbrWithdrawalCond.withDrawalAudit = 1;
            this.mbrWithdrawalCond.overFee = 5;
          }
          if (!res.data.mbrWithdrawalCond.feeWay) {
            this.mbrWithdrawalCond.feeWay = 0;
          }
          if (this.mbrWithdrawalCond.feeAvailable) {
            this.setMbrWithdrawCondNullFlag = true;
          } else {
            this.setMbrWithdrawCondNullFlag = false;
          }
        });
    },
    saveOrUpdateMbrWithdrawal(whickOption) {
      this.$refs.mbrWithdraw.validate((valid) => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          if (whickOption == "update" && !this.mbrWithdrawalCond.id) {
            this.$message({
              type: "warning",
              message: "暂无取款设置，请确认新增权限，进行新增",
            });
            return;
          }

          let url = this.mbrWithdrawalCond.id
            ? systemConfig.urls.mbrWithdrawCondUpdate
            : systemConfig.urls.mbrWithdrawCondSave;
          if (this.mbrGroup.id) {
            this.mbrWithdrawalCond.groupId = this.mbrGroup.id;
          }
          const copyCond = JSON.parse(JSON.stringify(this.mbrWithdrawalCond));
          // const params = _.omit(copyCond, ['feeAvailable', 'withDrawalTimes', 'withDrawalQuota'])
          const params = _.omit(copyCond, []);

          this.$axios.post(url, params).then((resp) => {
            this.withdrawalFormVisible = false;
            this.getList();
            //this.openRebate(this.mbrWithdrawalCond.groupId),//设置返利
            this.withdrawSettingCancel("mbrWithdraw");
          });
        } /* else {
            this.$message({
              type: 'warning',
              message: '请输入完整的信息'
            })
          } */
      });
    },
    mbrGroupCancel(formName) {
      this.dialogFormVisible = false;
      this.resetForm(formName);
    },
    withdrawSettingCancel(formName) {
      this.withdrawalFormVisible = false;
      this.cpGroup = "";
      this.resetForm(formName);
    },
    depositSettingCancel(formName) {
      this.cpGroup = "";
      this.depositFormVisible = false;
      this.resetForm(formName);
    },
    bankSettingCancel(formName) {
      this.bankFormVisible = false;
      this.resetForm(formName);
    },
    saveOrUpdateBank() {
      this.$refs.bankForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.bankDifferentName, { ...this.bankForm })
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("银行卡设置成功"),
              });
            })
            .catch((err) => {
              this.$message({
                type: "success",
                message: this.$t("银行卡设置失败"),
              });
            })
            .finally(() => {
              this.bankFormVisible = false;
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setMbrDepositCondNull() {
      this.setMbrDepositCondNullFlag = !this.setMbrDepositCondNullFlag;
    },
    setlimitNull() {
      this.setlimitNullFlag = !this.setlimitNullFlag;
    },
    feeChange(flag) {
      if (flag === 0) {
        this.mbrWithdrawalCond.feeFixed = null;
      } else {
        this.mbrWithdrawalCond.feeScale = null;
      }
    },
    deleteGro(row) {
      this.$axios
        .post(systemConfig.urls.mbrGroupDelete, { ids: [row.id] })
        .then((resp) => {
          this.$message({
            type: "success",
            message: this.$t("删除成功"),
          });
          this.getList();
          this.fnGroup();
        });
    },
    reset() {
      this.postData = {};
      this.q = { available: [], groupId: [] };
    },
    search() {
      this.listReq.pageNo = 1;
      this.getList();
    },
    getList(updateStatus) {
      this.$store.state.searchLoading = true;
      this.postData = [];
      Object.keys(this.q).forEach((key) => {
        if (this.q[key].length > 0) {
          if (Array.isArray(this.q[key])) {
            this.postData[key + "List"] = this.q[key].join(",");
          } else {
            this.postData[key] = this.q[key];
          }
        } else {
          this.postData[key] = "";
          this.postData[key + "List"] = "";
        }
      });
      let data = Object.assign(
        {
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo,
        },
        this.postData
      );
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.mbrGroupTablelist, {
          params: data,
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = res.data.page;
          if (updateStatus) {
            this.$message({
              type: "success",
              message: this.$t("状态更新成功"),
            });
          }
        });
    },
    QuotaRange(row) {
      if (row.lowQuota && row.topQuota) {
        return row.lowQuota + "-" + row.topQuota;
      } else {
        return "";
      }
    },
    feeTimes(row) {
      if (row.feeTimes && row.feeHours) {
        const option = this.feeHoursOptions.find(
          (item) => item.label === row.feeHours
        );
        return row.feeTimes + "/" + (option ? option.text : "");
      } else {
        return "";
      }
    },
    wfeeTimes(row) {
      if (row.chargeFeeAvailable && row.wfeeTimes && row.wfeeHours) {
        const option = this.feeHoursOptions.find(
          (item) => item.label === row.wfeeHours
        );
        return row.wfeeTimes + "/" + (option ? option.text : "");
      } else {
        return "";
      }
    },
    zfbRange(row) {
      const { wlowAlipayQuota, wtopAlipayQuota } = row;
      return typeof wlowAlipayQuota === "number" &&
        typeof wtopAlipayQuota === "number"
        ? `${wlowAlipayQuota}-${wtopAlipayQuota}`
        : ``;
    },
    wlowUsdtRange(row) {
      const { wlowUsdt, wtopUsdt } = row;
      return wlowUsdt && wtopUsdt ? `${wlowUsdt}-${wtopUsdt}` : ``;
    },
    wlowQuotaRange(row) {
      if (row.wlowQuota && row.wtopQuota) {
        return row.wlowQuota + "-" + row.wtopQuota;
      } else {
        return "";
      }
    },
    fnCpGroup(params, source) {
      //复制会员组
      if (source == "withdrawSet") {
        //取款
        if (!params) {
          this.mbrWithdrawalCond = { withDrawalAudit: 1 };
          this.withdrawSettingCancel("mbrWithdraw");
          return;
        }
        this.$axios
          .get(systemConfig.urls.mbrWithdrawCondInfo + params)
          .then((res) => {
            const { id } = this.mbrWithdrawalCond;
            const { groupId } = this.mbrWithdrawalCond;
            this.mbrWithdrawalCond = {
              ...res.data.mbrWithdrawalCond,
              id,
              groupId,
            };
          });
      } else if (source == "depositSet") {
        //存款
        if (!params) {
          this.depositSettingCancel("mbrDeposit");
          return;
        }
        this.$axios
          .get(systemConfig.urls.mbrDepositCondInfo + params)
          .then((res) => {
            const { id } = this.mbrDepositCond;
            const { groupId } = this.mbrDepositCond;
            this.mbrDepositCond = { ...res.data.mbrDepositCond, id, groupId };
          });
      }
    },
    statusFilter(status) {
      if (status) {
        return this.$t("启用");
      } else {
        return this.$t("禁用");
      }
    },
    bankSet() {
      this.bankFormVisible = true;
    },
  },
};
</script>

<style lang="scss">
.withdrawal {
  .radio .el-radio__label {
    display: none;
  }
}
.member-group {
  .dialog-title {
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #666666;
  }
}
.el-form-item__content .el-input-group {
  padding-bottom: 20px;
}
</style>
