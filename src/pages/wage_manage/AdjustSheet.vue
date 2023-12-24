<template>
  <div class="adjust-sheet">
    <div class="search" style="display: flex;justify-content: space-between">
      <div class="search-basic clearfix" style="overflow: visible;">
        <div class="search-basic-item width180">
          <label>{{ $t('会员名') }}</label>
          <input type="text" v-model="memberAccount" v-trim @keyup.enter="search()"/>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('总代') }}</label>
          <el-select size="small" v-model="topAgyAccountValue" :placeholder="$t('请选择')" @change="getAgyAccount" multiple filterable clearable>
            <el-option
              v-for="item in topAgyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id"
            >
              {{item.agyAccount}}<GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('代理') }}</label>
          <el-select size="small" v-model="agyAccountValue" :placeholder="$t('请选择')" multiple filterable clearable>
            <el-option
              v-for="item in agyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id"
            >
              {{item.agyAccount}}<GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('类型') }}</label>
          <el-select size="small" v-model="categoryValue" :placeholder="$t('请选择')" >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="categoryValue=='AA'">
          <label></label>
          <el-select size="small" v-model="auditAddTypes" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in handleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="categoryValue=='AM'">
          <label></label>
          <el-select size="small" v-model="reduceTypes" :placeholder="$t('请选择')" multiple >
            <el-option
              v-for="item in handleReducs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180">
          <label>{{ $t('状态') }}</label>
          <el-select size="small" v-model="statusValue" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
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
      <div style="display: flex; align-items: flex-end; padding-bottom: 15px;">
        <el-button type="primary" @click.native="search()" size="small" class="wid-80">{{ $t('查询') }}</el-button>
        <el-button type="danger" @click.native="reset()" size="small" class="wid-80">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="end"><!--  || hasPermission('fund:audit:reduce')  -->
      <el-button v-if="hasPermission('fund:audit:add') || hasPermission('fund:audit:reduce')" icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="manyCheck">{{ $t('批量审核') }}</el-button>
      <el-button v-if="hasPermission('fund:audit:add') || hasPermission('fund:audit:reduce')" icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="manualAdjust">{{ $t('人工调整') }}</el-button>
      <el-button size="small" v-if="hasPermission('fund:audit:export')" :disabled="!total" @click="handleExport" :loading="isExporting">
          {{isExporting ? $t('导出中') : $t('导 出') }}
      </el-button>
    </el-row>
    <div class="search-form">
      <el-table max-height="480"
        :data="tableData"
        v-loading='loading'
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
           :label="$t('序号')"
           type="index"
          align="center"
           :index="indexMethod">
        </el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('订单号')" width="200px" align="center">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">{{scope.row.orderNo}}</el-button>
            <CopyButton :copy-content="scope.row.orderNo"/>
          </template>
        </el-table-column>
        <el-table-column
          label-class-name="heightThe"
          prop="loginName"
          :label="$t('会员名')"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            {{scope.row.loginName}}
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         align="center"
                         prop="agyAccount"
                         :label="$t('所属代理')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="beforeBalance"
                         align="right"
                         :label="$t('原主账户余额')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="amount"
                         align="right"
                         :label="$t('调整金额')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         align="right"
                         prop="afterBalance"
                         :label="$t('现主账户余额')">
        </el-table-column>

        <el-table-column label-class-name="heightThe"
                         prop="causeName"
                         align="center"
                         :label="$t('调整类型')">
        </el-table-column>
        <!-- <el-table-column label-class-name="heightThe"
                         prop="depositTypeText"
                         label="调整类型">
        </el-table-column> -->
        <el-table-column label-class-name="heightThe"
                         prop="auditAddType"
                         align="center"
                         :label="$t('调整方式')">
            <template slot-scope="scope">
              <!-- {{showAddType(scope.row.auditAddType)}} -->
              {{translate(scope.row.adjustType,scope.row.financialCode)}}
            </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="createUser"
                         align="center"
                         :label="$t('申请人')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="isCalculateProfit"
                         align="center"
                         :label="$t('是否计入会员数据')">
          <template slot-scope="scope">
                {{scope.row.isCalculateProfit===true?$t('是'):$t('否')}}
          </template>
        </el-table-column>
        <el-table-column  :label="$t('是否参与账目核对')" prop="isCalculateCheck" label-class-name="heightThe" align="center">
          <template slot-scope="scope">
                {{scope.row.isCalculateCheck ? $t('是') : $t('否')}}
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="createTime"
                         align="center"
                         width="140"
                         :formatter="timeFilter"
                         :label="$t('申请时间')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         width="80px"
                         prop="statusText"
                         :label="$t('状态')"
                         align="center"
                         filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 1 ? 'success' : (scope.row.status === 2 ? 'primary':
                      (scope.row.status === 3 ? 'warning': 'danger'))"
              close-transition>{{scope.row.statusText}}
            </el-tag>
          </template>
          >
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="auditUser"
                         align="center"
                         :label="$t('审批人')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="auditTime"
                         width="140"
                         align="center"
                         :formatter="timeFilter"
                         :label="$t('审批时间')">
        </el-table-column>
        <el-table-column label-class-name="heightThe"
                         prop="memo"
                         align="center"
                         :label="$t('备注')">
          <template slot-scope="scope">{{spliceStr(scope.row.memo)}}</template>
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
        :total="total">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog @close="closeDetail"
               :title="$t('审核详情')"
               :visible.sync="detailShow">
      <el-form label-position="right" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('订单号')">
              <span id="adjustOrderNo">{{rowData.financialCode}}{{rowData.orderNo}}</span>
              <span class="copied" v-show="copied">{{ $t('已复制') }}</span>
              <span style="cursor:pointer" class="clip iconfont icon-copy"
                    data-clipboard-target="#adjustOrderNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('会员名称')" class="first-line"><span>{{rowData.loginName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('调整金额')" class="first-line"><span>{{rowData.amount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isAddTypeShow">
            <el-form-item size="small" :label="$t('调整类型')" class="first-line"><span>{{rowData.causeName}}</span>
              <span v-show="rowData.auditType===0">{{ $t('稽核') }}:{{ $t('免稽核') }}</span>
              <span v-show="rowData.auditType===1">{{ $t('稽核') }}:{{rowData.auditMultiple}}{{ $t('倍') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('调整方式')" class="first-line"><span>{{translate(rowData.adjustType,rowData.financialCode)}}</span></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('活动类型')" class="first-line"><span>{{transTypeOptions(rowData.activityId)}}</span></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('活动名称')" class="first-line"><span>{{transActivityOptions(rowData.activityId)}}</span></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否计入会员数据')" prop="isCalculateProfit" :rules="[{ required: true, message: $t('请选择是否计入会员数据'), trigger: 'blur' }]">
              <el-radio v-model="rowData.isCalculateProfit" :label='false' :disabled="rowData.status !== 2">{{ $t('否') }}</el-radio>
              <el-radio v-model="rowData.isCalculateProfit" :label='true' :disabled="rowData.status !== 2">{{ $t('是') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否参与账目核对')" prop="isCalculateCheck" :rules="[{ required: true, message: $t('是否参与账目核对'), trigger: 'blur' }]">
              <el-radio v-model="rowData.isCalculateCheck" :label='false' :disabled="rowData.status !== 2">{{ $t('否') }}</el-radio>
              <el-radio v-model="rowData.isCalculateCheck" :label='true' :disabled="rowData.status !== 2">{{ $t('是') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" :label="$t('备注')" class="first-line">
              <el-input class="left" type="textarea" v-model="memo" :maxlength="400" :disabled="rowData.status !== 2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" style="margin-bottom:0">
              <div class="div-submit-btn">
                <div class="btn" v-if="rowData.status === 2&&hasPermission('fund:audit:update')">
                  <el-button type="primary" @click.native="changeStatus(1, rowData)">{{ $t('通过') }}</el-button>
                  <el-button type="danger" @click.native="changeStatus(0, rowData)">{{ $t('拒绝') }}</el-button>
                </div>
                <!-- <div class="btn" v-else>
                  <el-button type="primary" @click.native="changeMemo(rowData.id, 0)">修改备注</el-button>
                </div> -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog @close="manualClose" :title="$t('人工调整')" :visible.sync="manualShow">
      <el-form ref="manualForm" :model="postData" label-position="right" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('调整类型')">
              <el-radio v-if="hasPermission('fund:audit:add')" v-model="postData.adjustType" :label='0' @change="resetPost('add')">{{ $t('增加') }}</el-radio>
              <el-radio v-if="hasPermission('fund:audit:reduce')" v-model="postData.adjustType" :label='1' @change="resetPost('decrese')">{{ $t('减少') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 1">
            <el-form-item :label="$t('会员名称')" prop="loginName" :rules="[{required: postData.reduceType === 5, message: $t('请输入会员名称'), trigger: 'blur'}]">
              <el-input size="small" style="width:calc(100% - 120px)" v-model="postData.loginName" :placeholder="$t('多个会员使用半角逗号隔开')"/>
              <el-button size="small" type="primary" @click="checkAmount">{{ $t('查询余额') }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 0">
            <el-form-item :label="$t('发送给')" prop="manualName" :rules="[{required: true, validator: manualNameValidator(), trigger: 'blur'}]">
              <el-input type="textarea" @change="manualNameTips = ''" v-model="postData.manualName" :placeholder="postData.auditAddType === 4 ? $t('请输入会员名称') : $t('多个会员使用半角逗号隔开')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 0">
            <el-form-item label="">
              <p class="select-p" v-show="selectList.length == 0?false:true"><span class="span" v-for="(item, index) in selectList" :key="index"><span>{{item.loginName || item.agyAccount}}</span><span
                class="iconfont icon-close" @click="deleteSelect(index)"></span></span>{{ $t('选择') }}{{selectList.length}}{{ $t('条') }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 1">
            <el-form-item :label="$t('钱包余额')">
              <el-input size="small" type="text" disabled="" v-model="postData.walletAmount"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="adjustLabel" prop="amount" :rules="[{required: true, message: $t('请输入金额'), trigger: 'blur'}]">
              <el-input size="small" type="number" v-model.number="postData.amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"><!-- add -->
            <el-form-item :label="$t('调整方式')">
               <el-col :span="10" style="margin-left:5px;"  v-if="postData.adjustType === 0">
                  <el-select size="small" v-model="postData.auditAddType" style="width:100%">
                    <el-option v-for="item in handleOptions" :key="item.value" :label='item.label'
                               :value='item.value'></el-option>
                  </el-select>
              </el-col>
              <el-col :span="10" style="margin-left:5px;"  v-else>
                  <el-select size="small" v-model="postData.reduceType" style="width:100%">
                    <el-option v-for="item in handleReducs" :key="item.value" :label='item.label'
                               :value='item.value'></el-option>
                  </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.auditAddType === 4 || postData.reduceType === 5">
            <el-form-item :label="$t('返利类型')" prop="rewardType" :rules="[{required: true, message: $t('请输选择返利类型'), trigger: 'blur'}]">
              <el-col :span="10">
                <el-select size="small" v-model="postData.rewardType" style="width:100%">
                  <el-option v-for="item in rewardTypeList" :key="item.value" :label='item.label' :value='item.value'></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.auditAddType === 4">
            <el-form-item :label="$t('绑定好友')" prop="subLoginName" :rules="[{required: true, message: $t('请输入绑定好友名称'), trigger: 'blur'}]">
              <el-col :span="10">
                <el-input size="small" type="text" v-model="postData.subLoginName"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col v-if="showAct">
            <el-col :span="12">
              <el-form-item :label="$t('活动类型')">
                <el-select size="small" v-model="postData.rewardType" style="width:100%" @change="changeRewardType">
                  <el-option v-for="item in typeOptions" :key="item.id" :label='item.tmplName' :value='item.id'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col v-if="showAct">
            <el-col :span="12">
              <el-form-item :label="$t('活动名称')">
                <el-select size="small" v-model="postData.activityId" style="width:100%"  @change='$forceUpdate()'>
                  <el-option v-for="item in activityOptions" :key="item.id" :label='item.activityName' :value='item.id'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 0">
            <el-form-item :label="$t('稽核')">
              <el-row v-if="!postData.adjustType">
                <el-col :span="12">
                  <el-radio v-model="postData.auditType" :label='0'>{{ $t('免稽核') }}</el-radio>
                  <el-radio v-model="postData.auditType" :label='1'>{{ $t('稽核') }}</el-radio>
                </el-col>
                <el-col :span="12" v-if="postData.auditType === 1">
                  <el-form-item prop="auditMultiple" :rules="multipleWaterRules">
                    <el-input type="number" v-model="postData.auditMultiple">
                      <template slot="append">{{ $t('倍') }}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="postData.adjustType === 1">
            <el-form-item :label="$t('稽核')">
              <el-popover ref="clearjii" placement="right" width="200" trigger="hover" :content="content"></el-popover>
              <el-checkbox v-model.number="postData.isClear" :true-label="1" v-popover:clearjii>{{ $t('清除稽核点') }}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否计入会员数据')+ ':'" prop="isCalculateProfit" :rules="[{ required: true, message: $t('请选择是否计入会员数据'), trigger: 'blur' }]">
              <el-radio v-model="postData.isCalculateProfit" :label='false'>{{ $t('否') }}</el-radio>
              <el-radio v-model="postData.isCalculateProfit" :label='true'>{{ $t('是') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否参与账目核对')+ ':'" prop="isCalculateCheck" :rules="[{ required: true, message: $t('请选择是否参与账目核对'), trigger: 'blur' }]">
              <el-radio :disabled="isCalculateDisabled" v-model="postData.isCalculateCheck" :label='false'>{{ $t('否') }}</el-radio>
              <el-radio :disabled="isCalculateDisabled" v-model="postData.isCalculateCheck" :label='true'>{{ $t('是') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('备注')" prop="memo" :rules="[{ required: (postData.auditAddType === 4 || postData.reduceType === 5) ? false : true, message: $t('请输入备注'), trigger: 'blur' }]">
              <el-input size="small" type="text" v-model="postData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="manualClose">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click.native="handleManualSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="checkedReset" width="70%"
               :title="$t('多人选择')"
               :visible.sync="chooseMoreShow">
      <el-form label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('会员组')" class="mb0">
              <el-radio v-model="isAccAll" label="true" @change="groupAllChange">{{ $t('全部') }}</el-radio>
              <el-radio v-model="isAccAll" label="false" @change="groupDiyChange">{{ $t('自定义') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" class="mb0">
              <el-checkbox-group v-model="groupCheckList" v-show="groupShow" @change="groupCheckChange">
                <el-checkbox v-for="(item, index) in accGroup" :key="index" :label="item.id">{{item.groupName}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('总代理')" class="mb0">
              <el-radio v-model="isAgyTopAll" label="true" @change="agyTopAllChange">{{ $t('全部') }}</el-radio>
              <el-radio v-model="isAgyTopAll" label="false" @change="agyTopDiyChange">{{ $t('自定义') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" class="mb0">
              <el-checkbox-group v-model="topAgyCheckList" v-show="topAgyShow" @change="getChildAgyAccount" style="max-height:200px;overflow-y:auto">
                <el-checkbox style="margin-left: 30px" v-for="(item, index) in topAgyAccountOptions" :key="index" :label="item.id">{{item.agyAccount}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('子代理')" class="mb0">
              <el-checkbox v-model="isAgyAll" v-show="!topAgyShow">{{ $t('全部') }}</el-checkbox>
              <el-radio v-model="agyAll" label="true" @change="agyAllChange" v-show="topAgyCheckList.length>0">{{ $t('全部') }}
              </el-radio>
              <el-radio v-model="agyAll" label="false" @change="agyDiyChange" v-show="topAgyCheckList.length>0">{{ $t('自定义') }}
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" class="mb0">
              <el-checkbox-group v-model="agyCheckList" v-show="childAgyShow" style="max-height:200px;overflow-y:auto">
                <el-checkbox style="margin-left: 30px" v-for="(item, index) in agyAccountOptions" :key="index" :label="item.id">{{item.agyAccount}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('可选择会员')" class="mb0">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange" v-show="checkedData.length>0">{{ $t('全选') }}
              </el-checkbox>
              <el-checkbox-group v-model="checkedAllData" @change="handleCheckedChange" v-show="checkedData.length>0"
                                 style="max-height:200px;overflow-y:auto">
                <el-checkbox style="margin-left: 30px" v-for="(item,index) in checkedData" :label="item" :key="index">
                  {{item.loginName || item.agyAccount}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="checkedReset">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click.native="getChecked">{{ $t('选择') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="closeManyCheck" width="70%"
               :title="$t('批量审核')"
               :visible.sync="manyCheckVisible">
      <el-form :model="manyCheckForm" ref="manyCheckForm" :rules="manyCheckRule">
        <el-form-item :label="$t('当前选中数据')">
          <span>{{manyCheckForm.num}} {{ $t('条') }}</span>
        </el-form-item>
        <el-form-item :label="$t('是否计入会员数据')" prop="isCalculateProfit">
          <el-radio-group v-model="manyCheckForm.isCalculateProfit">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input type="textarea" :rows="2" :placeholder="$t('请输入备注')" v-model="manyCheckForm.memo"></el-input>
        </el-form-item>
      </el-form>
      <div class="div-submit-btn">
        <el-button @click.native="manyCheckFalse">{{ $t('拒绝') }}</el-button>
        <el-button type="primary" @click.native="manyCheckTrue">{{ $t('通过') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import systemConfig from '../../config/config.js'
  import Clipboard from 'clipboard'
  import {mapGetters} from 'vuex'
  import queryStore from '../../mixins/queryStore'
  import CopyButton from '../../components/CopyButton'
  import StartAndEndTimeSelector from '../../components/StartAndEndTimeSelector'
  import { checkNumberAndDecimals } from '../../config/utils'
  import { lang } from "@/i18n"
  import Mixin from '@/mixins/loadTime'


  const checkNumberAndTwoDecimal = function(value) {
    return checkNumberAndDecimals(value, 2)
  }
  const statusOption = [{text: lang('通过'), value: 1}, {text: lang('待处理'), value: 2}, {text: lang('拒绝'), value: 0}]
  export default {
    name: 'adjustSheet',
    mixins: [Mixin, queryStore(['memberAccount', 'topAgyAccountValue', 'agyAccountValue', 'categoryValue', 'statusValue', 'startTime', 'endTime'])],
    components: {StartAndEndTimeSelector, CopyButton},
    data() {
      return {
        safePassword: "",
        tmpValue4SafeCheck:{},
        extendTitle: this.$t('更多'),
        /* searchClass: 'searchNew', */
        detailShow: false, // 弹框显示boolean
        copied: false,
        rowData: '',
        bankData: '',
        memo: '',
        topAgyAccountOptions: [],
        trueAgyAccountOptions: [],
        topAgyAccountValue: [],
        agyAccountOptions: [],
        agyAccountValue: [],
        memberAccount: '',
        startTime: '',
        isym: true,
        endTime: '',
        groupValue: '',
        statusOptions: statusOption,
        filterArr: statusOption,
        statusValue: '',
        categoryOptions: [
          {
            value: '',
            label: this.$t('全部')
          },
          {
            value: 'AA',
            label: this.$t('人工增加')
          },
          {
            value: 'AM',
            label: this.$t('人工减少')
          },
        // {
        //   value: 'FA',
        //   label: this.$t('好友返利')
        // }
        ],
        categoryValue: '',
        typeOptions: [],
        activityOptions0: [],
        activityOptions: [],
        handleOptions:[
          {
            label:this.$t('优惠添加'),
            value:0,
          },
          // {
          //   label: '推荐返利',
          //   value: 4,
          // },
          {
            label:this.$t('额度补回'),
            value:1,
          },
          /* {
            label:'入款冲销',
            value:2,
          }, */
          {
            label:this.$t('其他'),
            value:3,
          },
          // {
          //   label:'代理充值',
          //   value:4,
          // }
        ],
        rewardTypeList: [
          {
            label: this.$t('首存返利'),
            value: 3,
          },
          {
            label: this.$t('投注返利'),
            value: 4,
          },
          {
            label: this.$t('VIP返利'),
            value: 5,
          },
          {
            label: this.$t('充值返利'),
            value: 6,
          }
        ],
        handleReducs:[
          {
            label:this.$t('风控扣款'),
            value:0,
          },
          {
            label:this.$t('优惠冲销'),
            value:1,
          },
          // {
          //   label:'返利冲销',
          //   value:5,
          // },
          {
            label:this.$t('额度冲销'),
            value:2,
          },
          {
            label:this.$t('入款冲销'),
            value:3,
          },
          {
            label:this.$t('其他'),
            value:4,
          }
        ],
        typeValue: [],
        tableData: [],
        total: 0,
        showExtend: false,
        isAddTypeShow: false,
        manualShow: false,
        manualNameTips: '',
        postData: {
          auditType: 0,
          ids: [],
          financialCode: '',
          manualName: '',
          adjustType: 0,
          loginName: '',
          walletAmount: '',
          amount: '',
          depositType: 1,
          auditMultiple: '',
          memo: '',
          auditAddType:0,
          reduceType:'',
          catId: '',
          activityId: '',
          rewardType: '',
          subLoginName: '',
          isCalculateCheck: true,
        },
        inputContent: '',
        mbrList: [], // 搜索的会员list
        selectList: [], // 选择结果的list
        chooseMoreShow: false,
        checkAll: false,
        checkedData: [],
        checkedAllData: [],
        isAccAll: 'true',
        groupShow: false,
        groupCheckList: [],
        accGroup: [],
        isAgyTopAll: 'true',
        isAgyAll: true,
        agyAll: 'true',
        childAgyShow: false,
        topAgyCheckList: [],
        topAgyShow: false,
        topAgyGroup: [],
        agyShow: false,
        agyGroup: [],
        agyCheckList: [],
        content: this.$t('勾选后将清除该会员当前所有未通过的流水稽核'),
        isExporting: false,
        tempUrl:'',
        auditAddTypes:[],
        reduceTypes:[],
        multipleSelection: [],
        manyCheckVisible: false,
        manyCheckForm: {isCalculateProfit:null,memo:null},
        manyCheckRule: {
          isCalculateProfit: [
            {required:true,message:this.$t('请选择是否计入会员数据'),trigger:'blur'}
          ]
        },
        multipleWaterRules: {
          validator: (rule, value, callback) => {
            const { auditMultiple, auditAddType} = this.postData
            if (!auditAddType) {
              if (checkNumberAndDecimals(auditMultiple)  && auditMultiple >= 1) {
                callback();
              } else {
                callback(new Error(this.$t("只允许填写大于0的正整数")));
              }
              return
            }
            if (checkNumberAndTwoDecimal(auditMultiple)  && auditMultiple >= 0) {
              callback();
            } else {
              callback(new Error(this.$t("只允许填写大于0，且最多2位小数")));
            }
          },
          trigger: "blur",
        },
      }
    },
    created() {
      this.getAgyAccount([])
      this.getChildAgent()
      // this.getactivityList()
      this.getMbrList()
      this.getActivityType()
      this.getActivityOptions()
    },
    mounted() {
      if (!this.useQueryStoreCache) {
        this.$refs.searchTime.handleTimeQuickSelect('today')
      }
      this.getData()
      const clipboard = new Clipboard('.clip')
      let self = this
      clipboard.on('success', function (e) {
        self.copied = true
      })
    },
    computed: {
      showAct() {
        return this.postData.auditAddType === 0 || this.postData.reduceType === 1
      },
      useQueryStoreCache() {
        return this.$route.query.useQueryStoreCache === 'yes'
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
      adjustLabel() {
        if (this.postData.adjustType === 0) {
          return this.$t('增加金额')
        } else {
          return this.$t('减少金额')
        }
      },
      isCalculateDisabled () {
        return (!this.postData.adjustType && !this.postData.auditAddType) || (this.postData.adjustType && this.postData.reduceType === 1 )
      },
      ...mapGetters(['hasPermission'])
    },
    methods: {
      manualNameValidator() {
        return (rule, value, callback) => {
          if (!value) return callback(this.$t('请输入需要调整的会员'))
          if (this.manualNameTips) return callback(this.manualNameTips)
          callback()
        }
      },
      getActivityType() {
        this.$axios.get(systemConfig.urls.getActivityType).then((resp) => {
          let arr = resp.data.page;
          let index = arr.findIndex((val) => {
            return val.tmplCode == "AQ0000011";
          });
          index != -1 && arr.splice(index, 1);
          this.typeOptions = arr;
        });
      },
      getActivityOptions() {
        let url = "?pageSize=1000&pageNo=1";
        this.$axios
          .get(systemConfig.urls.activityIntroduction.list + url)
          .then((resp) => {
            this.activityOptions0 = resp.data.data.list;
            this.activityOptions = resp.data.data.list;
          });
      },
      handleCheckAllChange(val) {
        this.checkedAllData = val ? this.checkedData : []
      },
      handleCheckedChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.checkedData.length
      },
      // 获取会员options
      getMemberOptions() {
        this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
          this.accGroup = resp.data.page
        })
      },
      groupAllChange() {
        this.groupShow = false
        this.groupCheckList = []
        this.getSelectList()
      },
      groupCheckChange() {
        this.getSelectList()
      },
      groupDiyChange() {
        this.groupShow = true
        this.groupCheckList = []
        this.getMemberOptions()
      },
      // 获取总代和总代的代理
      // getAgyAccount(id) {
      //   this.$axios.get(systemConfig.urls.getAgyAccount + '?parentId=' + id).then((resp) => {
      //     if (!id) {
      //       this.topAgyGroup = resp.data.accounts
      //     } else {
      //       for (let j = 0; j < resp.data.accounts.length; j++) {
      //         this.agyGroup.push(resp.data.accounts[j])
      //       }
      //     }
      //   })
      // },
      // 获取子代理
      getChildAgyAccount() {
        this.agyGroup = []
        this.getSelectList()
        this.getAgyAccount(this.topAgyCheckList)
        // for (let i = 0; i < this.topAgyCheckList.length; i++) {
        //   this.getAgyAccount(this.topAgyCheckList[i])
        // }
      },
      agyTopAllChange() {
        this.topAgyCheckList = []
        this.agyCheckList = []
        this.topAgyShow = false
        this.childAgyShow = false
        this.isAgyTopAll = 'true'
        this.agyAll = 'true'
        this.isAgyAll = true
        this.getSelectList()
      },
      getSelectList() {
        let url = '?groupIds=' + this.groupCheckList + '&tagencyIds=' + this.topAgyCheckList + '&cagencyIds=' + this.agyCheckList
        this.$axios.get(systemConfig.urls.searchMbr + url).then((resp) => {
          let data = resp.data.page.list
          for (let i = 0; i < data.length; i++) {
            data[i].value = data[i].loginName
          }
          this.checkedData = data
        })
      },
      agyTopDiyChange() {
        this.topAgyShow = true
        this.isAgyTopAll = 'false'
        this.isAgyAll = false
        this.topAgyCheckList = []
        this.getAgyAccount([])
      },
      agyAllChange() {
        this.childAgyShow = false
        this.agyCheckList = []
        this.getSelectList()
      },
      agyDiyChange() {
        this.childAgyShow = true
        this.getSelectList()
      },
      chooseMore() {
        this.chooseMoreShow = true
        this.checkedData = this.mbrList
      },
      searchSelect(item) {
        this.selectList.push(item)
        let length1 = this.selectList.length
        this.selectList = this.unique(this.selectList)
        let length2 = this.selectList.length
        if (length1 !== length2) {
          this.$message({
            type: 'warning',
            message: this.$t('重复选择')
          })
        }
        this.inputContent = ''
      },
      getChecked() {
        this.selectList = this.unique(this.selectList.concat(this.checkedAllData))
        this.checkedReset()
      },
      // 去重
      unique(array) {
        var res = []
        for (var i = 0, len = array.length; i < len; i++) {
          var current = array[i]
          if (res.indexOf(current) === -1) {
            res.push(current)
          }
        }
        return res
      },
      checkedReset() {
        this.chooseMoreShow = false
        setTimeout(() => {
          this.checkAll = false
          this.checkedData = []
          this.checkedAllData = []
          this.topAgyCheckList = []
          this.agyCheckList = []
          this.isAccAll = 'true'
          this.groupShow = false
          this.isAgyTopAll = 'true'
          this.agyAll = 'true'
          this.topAgyShow = false
          this.isAgyAll = true
          this.childAgyShow = false
        }, 100)
      },
      deleteSelect(index) {
        this.selectList.splice(index, 1)
      },
      getMbrList() {
        this.$axios.get(systemConfig.urls.searchMbr).then((resp) => {
          let data = resp.data.page.list
          for (let i = 0; i < data.length; i++) {
            data[i].value = data[i].loginName
          }
          this.mbrList = data
        })
      },
      querySearchAsync(queryString, cb) {
        var results = queryString ? this.mbrList.filter(this.createStateFilter(queryString)) : this.mbrList
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random)
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      checkAmount() {
        const { pattern, message} = systemConfig.rules.memberInfoRule.newAccountName[1]

        this.postData.loginName.split(',').map(ws=>{
          if (!pattern.test(ws)) {
            this.$message({
              type: 'warning',
              message
            })
            return
          }
        })
        let postdata = this.postData.loginName.split(',')
        delete postdata.loginName
        this.$axios.post(systemConfig.urls.queryAccountBalance,postdata).then((res) => {
          if (!res.data.info) {
            this.$message({
              type: 'warning',
              message: this.$t('会员不存在')
            })
            return
          } else {
            let arr = []
            this.postData.ids = []
            res.data.info.map(ws=>{
              this.postData.ids.push(ws.id)
              arr.push(ws.balance)
            })
            this.postData.walletAmount = arr.join(',')
          }
        })
      },
      /* getactivityList() {
        this.$axios.get(systemConfig.urls.activityListAll).then((res) => {
          this.activityList = res.data.data
        })
      }, */
      manualAdjust() {
        this.manualShow = true
      },
      manualClose() {
        this.manualShow = false
        this.selectList = []
        this.agyAccountOptions = this.trueAgyAccountOptions
        this.postData = {
          auditType: 0,
          ids: [],
          financialCode: '',
          manualName: '',
          adjustType: 0,
          loginName: '',
          walletAmount: '',
          amount: '',
          depositType: 1,
          auditMultiple: '',
          memo: '',
          auditAddType:0,
          reduceType:'',
          catId: '',
          activityId: '',
          rewardType: '',
          subLoginName: '',
          isCalculateCheck: true,
        }
      },

      safePasswordInputedAfter: function (safePassword) {
        this.safePassword=safePassword;
        if(this.tmpValue4SafeCheck.firstStep){
          this.manualSubmit();
        } else {
          this.changeStatus(this.tmpValue4SafeCheck.status,this.tmpValue4SafeCheck.rowData);
        }
      },
      handleManualSubmit() {
        this.$refs.manualForm.validate(isOk => {
          if (isOk) this.manualSubmit()
        })
      },
      async manualSubmit() {
        const { pattern, message} = systemConfig.rules.memberInfoRule.newAccountName[1]
        const { adjustType } = this.postData
        if (!pattern.test(this.postData.name)) {
          this.$message({
            type: 'warning',
            message
          })
          return
        }
        if (!checkNumberAndTwoDecimal(this.postData.amount) || this.postData.amount<=0) {
          this.$message({
            type: 'warning',
            message: this.$t('调整金额应大于0且允许两位小数')
          })
          return
        }
        if (adjustType === 0) {
          if (this.postData.auditType === 1) {
            if (!checkNumberAndTwoDecimal(this.postData.auditMultiple)) {
              this.$message({
                type: 'warning',
                message: this.$t('稽核倍数应为大于0且允许2位小数的数字')
              })
              return
            }
            if(this.postData.auditMultiple < 0 || this.postData.auditMultiple>999){
              this.$message({
                type: 'warning',
                message: this.$t('稽核倍数范围为') + '1-999'
              })
              return
            }
          }
        }
        if (adjustType === 1) {
          if (this.postData.amount > this.postData.walletAmount) {
            this.$message({
              type: 'warning',
              message: this.$t('减少金额不能大于钱包金额')
            })
            return
          }
        }
        if ((this.postData.auditAddType !== 4 && this.postData.reduceType !== 5) && !this.postData.memo) {
          this.$message({
            type: 'warning',
            message: this.$t('备注不能为空')
          })
          return
        }
        // 提交调整申请
        if (adjustType === 0) {
          if(this.postData.depositType === 3) {
            this.postData.financialCode = 'FA'
          } else {
            this.postData.financialCode = 'AA'
          }
        } else {
          this.postData.financialCode = 'AM'
        }

        // 安全密码弹窗
        if(!this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.manualSubmit);
          this.$set(this.tmpValue4SafeCheck,"args", []);
          return;
        }
        let url = this.postData.adjustType === 0 ? systemConfig.urls.auditAdd : systemConfig.urls.auditRuduce
        let params = null
        if (this.postData.auditAddType === 4 || this.postData.reduceType === 5) {
          url = this.postData.auditAddType === 4 ? systemConfig.urls.manualFriendRebateReward : systemConfig.urls.reduceFriendRebateReward
          params = {
            type: this.postData.adjustType,
            loginName: this.postData.manualName || this.postData.loginName,
            amount: this.postData.amount,
            rewardType: this.postData.rewardType,
            memo: this.postData.memo,
            audit: this.postData.auditType,
          }
          if (this.postData.auditAddType === 4) {
            params.subLoginName = this.postData.subLoginName
            params.auditMultiple = this.postData.auditMultiple
          }
        }
        const loading = this.$loading({ fullscreen: true })
        let submit = safePassword => this.$axios.post(url,this.postData,{ headers: {securepwd: safePassword} }).then((res) => {
            this.$message.success(this.$t('操作成功'))
            this.manualClose()
            this.getData()
          }, () => {})
        if (params) {
          submit = safePassword => this.$axios.get(url, { params },{ headers: {securepwd: safePassword} }).then((res) => {
            this.$message.success(this.$t('操作成功'))
            this.manualClose()
            this.getData()
          }, () => {})
        }
        const safePassword = this.safePassword
        if (adjustType === 0) {
          const { res, err } = await this.$axios.POST(this.$urls.checkUserNames, { userNames: this.postData.manualName })
          if (res) {
            this.postData.ids = this.unique(res.msg)
          } else {
            const { msg } = err.data
            this.manualNameTips = msg
            this.$refs.manualForm.validateField('manualName')
            this.manualClose()
            loading.close()
            return
          }
        }
        await submit(safePassword)
        this.safePassword=""
        this.tmpValue4SafeCheck={}
        loading.close()
      },
      resetPost(flag) {
        this.postData = {
          auditType: 0,
          ids: [],
          financialCode: '',
          manualName: '',
          adjustType: 0,
          loginName: '',
          walletAmount: '',
          amount: '',
          depositType: 1,
          auditMultiple: '',
          memo: '',
          auditAddType:0,
          reduceType:'',
          catId: '',
          activityId: '',
          rewardType: '',
          subLoginName: '',
          isCalculateCheck: true,
        }
        if (flag === 'add') {
          this.postData.adjustType = 0
          this.postData.depositType=1
          this.$set(this.postData,'auditAddType',0)
          this.selectList = []
          this.postData.reduceType=''
        }
        if (flag === 'decrese') {
          this.postData.adjustType = 1
          this.postData.auditAddType = ""
          this.postData.depositType=""
          this.$set(this.postData,'reduceType',0)
        }
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
      timeFilter(row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        return systemConfig.transferTimeByType(date, this.timeType)
      },
      // 条件查询事件
      search() {
        this.getCurrentRecodeTime()
        if (this.startTime && this.endTime) {
          if (new Date(this.startTime).getTime() > new Date(this.endTime).getTime()) {
            this.$message({
              type: 'warning',
              message: this.$t('申请起始时间不能大于结束时间')
            })
            return
          }
        }
        if(this.categoryValue&&!this.auditAddTypes.length&&!this.reduceTypes.length){
          this.$message({
              type: 'warning',
              message: this.$t('请选择对应类型')
            })
            return
        }
        if (!this.startTime) {
          this.startTime = ''
        }
        if (!this.endTime) {
          this.endTime = ''
        }
        this.listReq.pageNo = 1
        this.getData()
      },
      // 弹框显示
      showDetail(rowData) {
        let url = '/' + rowData.id
        this.$axios.get(systemConfig.urls.auditInfo + url).then((resp) => {
          this.detailShow = true
          this.copied = false
          this.rowData = resp.data.info
          this.memo = this.rowData.memo
          if (this.rowData.depositType === 0) {
            this.rowData.depositTypeText = this.$t('其他')
          } else if (this.rowData.depositType === 1) {
            this.rowData.depositTypeText = this.$t('人工存款')
          } else if (this.rowData.depositType === 2) {
            this.rowData.depositTypeText = this.$t('优惠活动')
          }
          if (this.rowData.financialCode === 'AA') {
            if (this.rowData.auditType == null) {
              this.rowData.auditType = 0
            }
            this.isAddTypeShow = true
          }
          if (this.rowData.financialCode === 'AM') {
            this.isAddTypeShow = false
          }
        })
      },
      // 弹框关闭
      closeDetail() {
        this.detailShow = false
      },


      // 改变某条数据的状态
      changeStatus(status, rowData) {
        if (!this.memo) {
          this.$message({
            type: 'warning',
            message: this.$t('备注不能为空')
          })
          return
        }

        // 安全密码弹窗
        if(status==1 && !this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
          this.$set(this.tmpValue4SafeCheck,"callback", this.changeStatus);
          this.$set(this.tmpValue4SafeCheck,"args", [status,rowData]);
          return;
        }


        let url = status==1 ? systemConfig.urls.fundAuditUpdateStatus : systemConfig.urls.fundAuditUpdateStatusRefuse;

        this.$axios.post(url, [{...this.rowData, memo: this.memo, status: status}],{headers: {securepwd: this.safePassword || null}}).then((resp) => {
          this.$message({
            type: 'success',
            message: this.$t('状态修改成功')
          })
          this.getData()
          // this.changeMemo(rowData.id, 1)
        }).finally(()=>{
          this.detailShow = false
          this.safePassword="";
          this.tmpValue4SafeCheck={};
        })
      },
      // 改变某条记录的备注  flag :1 修改状态  0修改备注
      changeMemo(id, flag) {
        if (!this.memo) {
          this.$message({
            type: 'warning',
            message: this.$t('备注不能为空')
          })
          return
        }
        this.$store.state.fullscreenLoading = true
        this.closeDetail()
        this.$axios.post(systemConfig.urls.fundAuditUpdateMemo, {memo: this.memo, id: id}).then((resp) => {
          if (!flag) {
            this.$message({
              type: 'success',
              message: this.$t('备注修改成功')
            })
          }
          this.getData()
          this.safePassword="";
          this.tmpValue4SafeCheck={}
        })
      },
      // 条件重置
      reset() {
        this.agyAccount = ''
        this.memberAccount = ''
        this.topAgyAccountValue = []
        this.agyAccountValue = []
        this.agyAccountOptions = this.trueAgyAccountOptions
        this.categoryValue = ''
        this.typeValue = []
        this.statusValue = []
        this.startTime = ''
        this.endTime = ''
      },
      // 更多查询
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
      filterTag(value, row) {
        return row.status === value
      },
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      // 获取总代 次代数据
      getChildAgent() {
        this.$axios.get(systemConfig.urls.getAllChildAgentIncludeDisable).then((resp) => {
          this.agyAccountOptions = resp.data.accounts
          this.trueAgyAccountOptions = resp.data.accounts
        })
      },
      getAgyAccount(ids) {
        if (ids.length > 0) {
          this.agyAccountValue = []
          this.agyAccountOptions = []
          const requestArr = ids.map(item => {
            return this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable + '?parentId=' + item)
          })
          Promise.all(requestArr)
          .then(arr => {
            let agyAccountOptions = []
            for (let i = 0;i < arr.length;i++) {
              const item = arr[i].data.accounts
              agyAccountOptions = [...agyAccountOptions, ...item]
            }
            this.agyAccountOptions = agyAccountOptions
          })
        } else {
          this.agyAccountOptions = this.trueAgyAccountOptions
          this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable + '?parentId=').then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts
          })
        }
      },
      // 获取会员数据  + '&createTimeFrom=' + this.startTime + '&createTimeTo=' + this.endTime
      getData(parentId) {
        this.$store.state.searchLoading = true
        let reduceTypes,auditAddTypes
        if(this.auditAddTypes.length){
         auditAddTypes=this.auditAddTypes.join(',')
        }
        if(this.reduceTypes.length){
         auditAddTypes=this.reduceTypes.join(',')
        }
        if (this.$router.history.current.query.loginName && this.isym) {
          this.memberAccount = this.$router.history.current.query.loginName
          this.isym = false
        }
        let url = '?pageSize=' + this.listReq.pageSize + '&pageNo=' + this.listReq.pageNo + '&loginName=' + this.memberAccount + '&tagencyIds=' + this.topAgyAccountValue + '&cagencyIds=' + this.agyAccountValue + '&financialCodes=' + this.categoryValue + '&depositTypes=' + this.typeValue + '&statuss=' + this.statusValue+'&reduceTypes='+this.reduceTypes+'&auditAddTypes='+this.auditAddTypes
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
        this.tempUrl=url;
        this.$axios.get(systemConfig.urls.fundReportAuditList + url).then((resp) => {
          let accountData = resp.data.page.list
          this.getNetworkLoadAndDataSolveTime(resp)
          for (var i = 0; i < accountData.length; i++) {
            accountData[i].orderNo = accountData[i].financialCode + accountData[i].orderNo
            if (accountData[i].financialCode === 'AM') {
              accountData[i].financialCodeText = this.$t('人工减少')
            } else if (accountData[i].financialCode === 'AA') {
              accountData[i].financialCodeText = this.$t('人工增加')
            } else if (accountData[i].financialCode === 'FA') {
              accountData[i].financialCodeText = this.$t('好友返利')
            }
            if (accountData[i].depositType === 0) {
              accountData[i].depositTypeText = this.$t('其他')
            } else if (accountData[i].depositType === 1) {
              accountData[i].depositTypeText = this.$t('人工存款')
            } else if (accountData[i].depositType === 3) {
              accountData[i].depositTypeText = this.$t('推广存入')
            }
            if (accountData[i].status !== 1) {
              accountData[i].beforeBalance = null
              accountData[i].afterBalance = null
            }
            if (accountData[i].status === 0) {
              accountData[i].statusText = this.$t('拒绝')
            } else if (accountData[i].status === 1) {
              accountData[i].statusText = this.$t('通过')
            } else if (accountData[i].status === 2) {
              accountData[i].statusText = this.$t('待处理')
            }
          }
          if (this.statusValue) {
            this.filterArr = systemConfig.getStatusArr(this.statusValue)
          }
          accountData.map(v => {
            v.beforeBalance = (v.beforeBalance || 0).toLocaleString()
            v.amount = (v.amount || 0).toLocaleString()
            v.afterBalance = (v.afterBalance || 0).toLocaleString()
          })
          this.tableData = accountData
          this.total = resp.data.page.totalCount
        })
      },
      showAddType(val){
        switch(val){
          case 0 : {
            return this.$t('优惠添加')
            break
          }
          case 1 : {
            return this.$t('额度补回')
            break
          }
          case 2 : {
            return this.$t('入款冲销')
            break
          }
          default : ''
        }
      },
      handleExport() {
        this.isExporting = true
        this.$axios.get(systemConfig.urls.exportFundReport+this.tempUrl)
        .then(res => {
          let isDownBool = res.data.data
          if (isDownBool) {
            this.$message({
              type: 'warning',
              message: isDownBool
            })
            this.isExporting = false
          } else {
            this.checkExportFile()
          }
        })
      },
      checkExportFile() {// 查看导出文件是否可下载
        /* const instance = this.$loading({
          fullscreen: true,
          text: '文件生成中...'
        }) */
        this.$axios.get(systemConfig.urls.checkFundAudit)
        .then(res => {
          const obj=res.data.data||{};
          const fileName=obj.fileName,downloadFileName=obj.downloadFileName;
          if (fileName) {
            const { baseURL } = res.config
            // 下载文件
            let SToken=localStorage.getItem('SToken')
            window.open(baseURL + `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`)
            this.isExporting=false;
            /* instance.close() */
          } else {
            window.setTimeout(this.checkExportFile, 1000)
          }
        })
      },
      translate(value,financialCode){
        let arr=financialCode=='AA' ? this.handleOptions:this.handleReducs
        let text
        arr.map(item=>{
          if(item.value==value){
            text=item.label
          }
        })
        return text
      },
      transTypeOptions(v){
        let str,id
        this.activityOptions0.map(ws=>{
          if(ws.id===v){
            id=ws.actTmplId
          }
        })
        this.typeOptions.map(ws=>{
          if(ws.id===id){
            str=ws.tmplName
          }
        })
        return str
      },
      transActivityOptions(v){
        let str
        this.activityOptions0.map(ws=>{
          if(ws.id===v){
            str=ws.activityName
          }
        })
        return str
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      manyCheck(){
        if(!this.multipleSelection.length){
          this.$message.error(this.$t('请至少选择一条数据'))
          return false
        }
        let pass = true
        this.multipleSelection.map(ws=>{
          if(ws.status!==2){
            pass=false
          }
        })
        if(pass===false){
          this.$message.error(this.$t('只能处理状态为待处理的订单'))
          return false
        }
        this.manyCheckForm.num = this.multipleSelection.length
        this.manyCheckVisible = true
      },
      closeManyCheck(done){
        this.$refs.manyCheckForm.clearValidate()
        this.$refs.manyCheckForm.resetFields()
        this.manyCheckForm = {isCalculateProfit:null,memo:null}
        this.manyCheckVisible = false
        if(done)done()
      },
      manyCheckTrue(){
        this.$refs.manyCheckForm.validate(valid=>{
          if(valid){
            // 安全密码弹窗
            if(!this.safePassword) {
              this.$store.commit("safePasswordShow", true);
              this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
              this.$set(this.tmpValue4SafeCheck,"callback", this.manyCheckTrue);
              this.$set(this.tmpValue4SafeCheck,"args", [1,this.manyCheckForm]);
              return;
            }
            let postData = []
            this.multipleSelection.map(ws=>{
              postData.push(ws)
            })
            postData.map(ws=>{
              ws = Object.assign(ws,{...this.manyCheckForm, status: 1})
            })
            this.$axios.post(systemConfig.urls.fundAuditUpdateStatus, postData,{headers: {securepwd: this.safePassword || null}}).then((resp) => {
              this.$message({
                type: 'success',
                message: this.$t('批量通过成功！')
              })
              this.getData()
            }).finally(()=>{
              this.safePassword="";
              this.tmpValue4SafeCheck={};
              this.multipleSelection = []
              this.closeManyCheck()
            })
          }
        })
      },
      manyCheckFalse(){
        this.$refs.manyCheckForm.validate(valid=>{
          if(valid){
            // 安全密码弹窗
            if(!this.safePassword) {
              this.$store.commit("safePasswordShow", true);
              this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
              this.$set(this.tmpValue4SafeCheck,"callback", this.manyCheckFalse);
              this.$set(this.tmpValue4SafeCheck,"args", [0,this.manyCheckForm]);
              return;
            }
            let postData = []
            this.multipleSelection.map(ws=>{
              postData.push(ws)
            })
            postData.map(ws=>{
              ws = Object.assign(ws,{...this.manyCheckForm, status: 0})
            })
            this.$axios.post(systemConfig.urls.fundAuditUpdateStatusRefuse, postData,{headers: {securepwd: this.safePassword || null}}).then((resp) => {
              this.$message({
                type: 'success',
                message: this.$t('批量拒绝成功！')
              })
              this.getData()
            }).finally(()=>{
              this.safePassword="";
              this.tmpValue4SafeCheck={};
              this.multipleSelection = []
              this.closeManyCheck()
            })
          }
        })
      },
      changeRewardType(v){
        console.log(v)
        this.postData.activityId = null
        this.activityOptions = []
        this.activityOptions0.map(ws=>{
          if(ws.actTmplId===v){
            this.activityOptions.push(ws)
          }
        })
      },
    },
    watch:{
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
      categoryValue(n){
        if(n=='AA'){
          this.reduceTypes=''
          this.auditAddTypes=[0]
        }else if(n=='AM'){
          this.reduceTypes=[0]
          this.auditAddTypes=''
        }else{
          this.reduceTypes=[]
          this.auditAddTypes=[]
        }
      },
      showAct(bool) {
        if (!bool) {
          this.postData.rewardType = this.postData.activityId = ''
        }
      },
      isCalculateDisabled (n, o) {
        if (n) this.$set(this.postData, 'isCalculateCheck', true)
      }
    }
  }
</script>
<style lang="scss">
  .select-p {
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
    .icon-close {
      margin-left: 2px;
    }
    .span {
      background-color: #f5f5f5;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      margin-right: 2px;
      padding: 2px;
      display: inline-block;
      line-height: 16px;
    }
  }
</style>

<style>
.adjust-sheet .el-table-column--selection .cell{
  text-align: center;
  padding-left: 14px!important;
}

</style>
