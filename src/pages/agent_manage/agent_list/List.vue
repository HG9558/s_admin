<template>
<!-- 代理管理：代理列表 -->
  <div class="body">
    <!-- 全局组件 表格搜索栏-->
    <TableSearchBar
      :currentPage.sync="currentPage"
      :searchCriteria="searchCriteria"
      :meta="serchMeta"
      @reloadData="getTableData"
      ref="searchCom"
    >
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector
        slot="registTime"
        :left="110"
        :selections="(serchMeta.find((i) => i.prop === 'registTime') || {}).options"
        :startTime.sync="searchCriteria.keys.createTimeFrom"
        :endTime.sync="searchCriteria.keys.createTimeTo"
      />
    </TableSearchBar>
    <div class="table-operation-btns-wrapper-self">
      <slot name="slot-title"></slot>
      <div class="table-operation-btns">
        <el-button type="danger" @click="handleUpdateFeeModel" v-if="permissions.updateFeeModel"
          >{{ $t('修改结算模式') }}</el-button
        >
        <el-button type="primary" @click="handleAddAgent" v-if="permissions.addD">{{ $t('新增代理') }}</el-button>
        <el-button type="primary" @click="handleAddStaff" v-if="permissions.addY">{{ $t('新增员工') }}</el-button>
        <el-button
          type="primary"
          icon="el-icon-download"
          :loading="exportLoading"
          :disabled="tableData.length === 0"
          v-if="permissions.export"
          @click="hasExportBtn"
          >{{ $t('导出') }}</el-button
        >
        <slot></slot>
      </div>
    </div>
    <!-- 全局组件 表格组件 -->
    <TableCom
      ref="table"
      :hasRemoveBtn="false"
      :hasAddBtn="false"
      :tableData="tableData"
      :totalCount="totalCount"
      :pageSize.sync="pageSize"
      :tableColumns="tableColumns"
      :currentPage.sync="currentPage"
      @selection-change="handleSelectionChange"
      @reloadData="getTableData"
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"
    >
      <el-table-column type="selection" slot="selection" align="center"> </el-table-column>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('代理账号')" slot="agyAccount" align="center">
        <template slot-scope="scope">
          <span @click="handleShowDetaile(scope.row)" style="color: #589ef8; cursor: pointer">{{
            scope.row.agyAccount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('手机号')" slot="mobile" align="center" width="200">
        <template slot-scope="scope">
          <span v-if="permissions.mobile">{{ scope.row.mobile }}</span>
          <span v-else>{{
            scope.row.mobile
              ? scope.row.mobile.substr(0, 3) + '****' + scope.row.mobile.substr(scope.row.mobile.split(',').length - 4)
              : ''
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('代理等级')" slot="agentType" align="center">
        <template slot-scope="scope">
          {{ [$t('股东'), $t('总代'), $t('一级代理'), $t('二级代理')][scope.row.agentType] || '' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" slot="available" align="center">
        <template slot-scope="scope">
          {{ [$t('锁定'), $t('正常')][scope.row.available] || '' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('部门')" slot="departmentid" align="center">
        <template slot-scope="scope">
          {{ scope.row.departmentName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('属性')" slot="attributes" align="center">
        <template slot-scope="scope">
          {{ [$t('直线代理'), $t('分线代理'), $t('推广员工'), $t('招商员工')][scope.row.attributes] || '' }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="contractEnd" align="center" :label="$t('契约到期时间')" slot="contractEnd" width="150">
        <template slot-scope="scope">
          {{ getTime(scope.row.contractEnd) }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" align="center" :label="$t('注册时间')" slot="createTime" width="150">
        <template slot-scope="scope">
          {{ getTime(scope.row.createTime) }}
        </template>
      </el-table-column>
<!--      <el-table-column prop="rate" align="center" label="上级返利比例" slot="rate" width="100">-->
<!--        <template slot-scope="scope">-->
<!--          <el-input type="text" v-model="scope.row.rate" @change="validR(scope.row)" @blur="changeRate(scope.row)" style="width: 65px;" class="peript">-->
<!--            <template slot="append">%</template>-->
<!--          </el-input>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </TableCom>

    <!-- 修改结算模式 -->
    <el-dialog :title="$t('修改结算模式')" :visible.sync="showUpdateFeeModel" @close="onDialogClose">
      <div>
        <div class="center" style="margin-bottom: 20px">
          {{ $t('已选中') }}：{{ selectVal.length }}，{{ $t('直线代理') }}：{{ selectVal | feeModelF }}，{{ $t('实际修改') }}：{{ selectVal | feeModelF }}
        </div>
        <el-form ref="updateFeeModel" label-width="auto" style="width: 60%" :model="feeModelForm">
          <el-form-item :label="$t('结算模式')">
            <div>
              <el-checkbox v-model="feeModelForm.serviceRateChecked" style="display: block"> {{ $t('服务费') }} </el-checkbox>
              <label>{{ $t('存款') }}</label>
              <el-input v-model.number="feeModelForm.depositServicerate" :min="0" style="width: 24%" type="number">
                <span slot="suffix">%</span>
              </el-input>
              <label style="margin-left: 10px">{{ $t('提款') }}</label>
              <el-input v-model.number="feeModelForm.withdrawServicerate" :min="0" style="width: 24%" type="number">
                <span slot="suffix">%</span>
              </el-input>
            </div>
            <div>
              <el-checkbox v-model="feeModelForm.platformRateChecked" style="display: block"> {{ $t('平台费') }} </el-checkbox>
              <label>{{ $t('额外费用') }}</label>
              <el-input v-model.number="feeModelForm.additionalServicerate" :min="0" style="width: 53%" type="number">
                <span slot="suffix">%</span>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="center">
          <el-button type="primary" @click="handleSubmitFeeModel" :loading="feeModelLoading">{{ $t('确定') }}</el-button>
          <el-button @click="handleFeeModelCancel">{{ $t('取消') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增代理账号 -->
    <span v-if="addAgentShow" class="add_agent_show">
      <el-dialog width="60% !important" @close="closeAddAgent" :title="$t('新增代理账号')" :visible.sync="addAgentShow">
        <el-form
          class="form-wrapper"
          ref="add_form"
          label-position="right"
          :model="addAgentData"
          label-width="auto"
          :rules="addAgentRule"
        >
          <div class="half">
            <div class="self_message">
              <el-form-item :label="$t('代理账号')" prop="agyAccount">
                <el-input type="text" v-model="addAgentData.agyAccount" :placeholder="$t('请输入代理账号')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('密码')" prop="agyPwd">
                <el-input type="password" v-model="addAgentData.agyPwd" :placeholder="$t('请输入密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('安全密码')" prop="securePwd">
                <el-input type="password" v-model="addAgentData.securePwd" :placeholder="$t('请输入安全密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('手机号')" prop="mobile">
                <el-input v-model="addAgentData.mobile" @keyup.native="addAgentData.mobile=addAgentData.mobile.replace(/[^0-9]/g,'')" :placeholder="$t('请输入手机号')">
                  <el-select v-model="addAgentData.mobileAreaCode" slot="prepend" filterable style="width: 80px !important" :placeholder="$t('请选择')">
                    <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'  +' + item.mobileAreaCode + '    ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('真实姓名')" prop="realName">
                <el-input type="text" v-model="addAgentData.realName" :placeholder="$t('请输入真实姓名')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('代理属性')" prop="attributes">
                <el-radio-group v-model="addAgentData.attributes" size="small" @change="onChangeAttributesOfAdd">
                  <el-radio :label="0" border>{{ $t('直线代理') }}</el-radio><br />
                  <el-radio :label="1" border>{{ $t('分线代理') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('新注册会员组')" prop="defaultGroupId">
                <el-select v-model="addAgentData.defaultGroupId" filterable :placeholder="$t('请选择会员组')">
                  <el-option
                    v-for="(item, index) in groupList"
                    :key="index"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('批量设置会员组')" prop="setGroupId">
                <el-select v-model="addAgentData.setGroupId" filterable :placeholder="$t('请选择会员组')">
                  <el-option
                    v-for="(item, index) in groupList"
                    :key="index"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('上级代理')" v-if="addAgentData.attributes === 0" prop="parentId">
                <el-select
                  v-model="addAgentData.parentId"
                  filterable
                  :placeholder="$t('请选择上级代理')"
                  @change="onChooseAgentOfAdd"
                >
                  <el-option
                    v-for="(item, index) in superiorAgentList"
                    :key="index"
                    :label="item.agyAccount"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('佣金契约')" v-if="addAgentData.attributes === 0" prop="contractId">
                <el-select v-model="addAgentData.contractId" :placeholder="$t('请选择佣金契约')">
                  <el-option
                    v-for="(item, index) in contractList"
                    :key="index"
                    :label="item.contractName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div v-if="addAgentData.attributes === 0" prop="rebate">
                <span style="display: block; padding-bottom: 8px"
                  >{{ $t('上级返佣比例') }}：<i v-show="curAgentLevel !== null"
                    >({{ $t('你当前选择的上级代理为') }}{{ curAgentLevelText }})</i
                  ></span
                >
                <el-form-item :label="$t('总代理返佣')" prop="rebateratio">
                  <el-input
                    v-model.number="addAgentData.rebateratio"
                    type="number"
                    :disabled="curAgentLevel === 0"
                    :placeholder="$t('请输入总代理返佣比例')"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('一级代理返佣')" prop="firstagentratio">
                  <el-input
                    v-model.number="addAgentData.firstagentratio"
                    type="number"
                    :disabled="curAgentLevel === 0 || curAgentLevel === 1"
                    :placeholder="$t('请输入一级代理返佣比例')"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item :label="$t('总线代理')" v-if="addAgentData.attributes === 1" prop="parentId">
                <el-select v-model="addAgentData.parentId" filterable :placeholder="$t('请选择总线代理')">
                  <el-option
                    v-for="(item, index) in sublineAgentList"
                    :key="index"
                    :label="item.agyAccount"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="addAgentData.attributes === 0" :label="$t('契约有效期')">
                <div class="contract_limit">
                  <el-col :span="11">
                    <el-date-picker
                      type="datetime"
                      :placeholder="$t('选择日期')"
                      v-model="addAgentData.contractStart"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      type="datetime"
                      :placeholder="$t('选择日期')"
                      v-model="addAgentData.contractEnd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-col>
                </div>
              </el-form-item>
              <div class="contrac_text" v-if="addAgentData.attributes === 0">{{ $t('契约到期后该代理将使用系统默认契约') }}</div>
            </div>
          </div>
          <div class="half right">
            <div class="self_message">
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input type="text" v-model="addAgentData.email" :placeholder="$t('请输入邮箱')"></el-input>
              </el-form-item>
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="addAgentData.qq" :placeholder="$t('请输入QQ')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('微信')" prop="weChat">
                <el-input v-model="addAgentData.weChat" :placeholder="$t('请输入微信')"></el-input>
              </el-form-item>
              <el-form-item label="Skype">
                <el-input v-model="addAgentData.skype" :placeholder="$t('请输入Skype')"></el-input>
              </el-form-item>
              <el-form-item label="Telegram">
                <el-input v-model="addAgentData.telegram" :placeholder="$t('请输入Telegram')"></el-input>
              </el-form-item>
              <el-form-item label="FlyGram">
                <el-input v-model="addAgentData.flyGram" :placeholder="$t('请输入FlyGram')"></el-input>
              </el-form-item>
              <el-form-item label="Whatsapp">
                <el-input v-model="addAgentData.whatsapp" :placeholder="$t('请输入') + 'Whatsapp'"></el-input>
              </el-form-item>
              <el-form-item :label="$t('结算模式')" v-if="permissions.updateServicerate || permissions.updateadditional">
                <!-- <el-radio-group v-model="addAgentData.feeModel">
                  <el-radio :label="2">服务费</el-radio>
                  <el-radio :label="1">平台费</el-radio>
                </el-radio-group>
                <div>
                  <el-input
                    v-model.number="addAgentData.serviceRate"
                    v-show="addAgentData.feeModel === 2"
                    placeholder="请输入费率"
                    type="number"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </div> -->
                <div v-if="permissions.updateServicerate">
                  <el-checkbox v-model="feeModelForm.serviceRateChecked" style="display: block"> {{ $t('服务费') }} </el-checkbox>
                  <label>{{ $t('存款') }}</label>
                  <el-input v-model.number="feeModelForm.depositServicerate" :min="0" style="width: 35%" type="number">
                    <span slot="suffix">%</span>
                  </el-input> <br />
                  <label>{{ $t('提款') }}</label>
                  <el-input v-model.number="feeModelForm.withdrawServicerate" :min="0" style="width: 35%" type="number">
                    <span slot="suffix">%</span>
                  </el-input>
                </div>
                <div v-if="permissions.updateadditional">
                  <el-checkbox v-model="feeModelForm.platformRateChecked" style="display: block"> {{ $t('平台费') }} </el-checkbox>
                  <label>{{ $t('额外费用') }}</label>
                  <el-input
                    v-model.number="feeModelForm.additionalServicerate"
                    :min="0"
                    style="width: 60%"
                    type="number"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('钱包选择')"
                prop="walletType"
                :rules="[
                  {
                    required: true,
                    message: $t('请选择钱包类型'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-radio-group v-model="addAgentData.walletType">
                  <el-radio :label="1">{{ $t('代充钱包') }}</el-radio><br />
                  <el-radio :label="2">{{ $t('彩金钱包') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="contrac_text">{{ $t('新增代理账号同时会生成同名密码的游戏账号') }}</div>
            </div>
          </div>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitAddAgent">{{ $t('确定') }}</el-button>
          <el-button @click="closeAddAgent">{{ $t('取消') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <!-- 新增员工 -->
    <span v-if="addStaffShow">
      <el-dialog @close="closeAddStaff" :title="$t('新增员工代理账号')" :visible.sync="addStaffShow" center>
        <el-form
          class="form-wrapper"
          ref="add_staff"
          label-position="right"
          :model="addStaffData"
          label-width="auto"
          :rules="addStaffRule"
        >
          <div class="left add_staff">
            <div class="self_message add_staff_message">
              <el-form-item :label="$t('员工账号')" prop="agyAccount">
                <el-input type="text" v-model="addStaffData.agyAccount" :placeholder="$t('请输入员工账号')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('密码')" prop="agyPwd">
                <el-input type="password" v-model="addStaffData.agyPwd" :placeholder="$t('请输入密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('支付密码')" prop="securePwd">
                <el-input type="password" v-model="addStaffData.securePwd" :placeholder="$t('请输入支付密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('手机号')" prop="mobile">
                <el-input type="tel" v-model="addStaffData.mobile" @keyup.native="addStaffData.mobile=addStaffData.mobile.replace(/[^0-9]/g,'')" :placeholder="$t('请输入手机号')">
                  <el-select v-model="addStaffData.mobileAreaCode" slot="prepend" filterable style="width: 82px !important" :placeholder="$t('请选择')">
                    <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'  +' + item.mobileAreaCode + '    ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('代理属性')" class="agent_attributes" prop="attributes">
                <el-radio-group v-model="addStaffData.attributes" size="small">
                  <el-radio :label="2" border>{{ $t('推广员工') }}</el-radio>
                  <el-radio :label="3" border>{{ $t('招商员工') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('部门')" prop="departmentid">
                <div class="select_left fl">
                  <el-select v-model="addStaffData.departmentid" :placeholder="$t('请选择部门')">
                    <el-option
                      v-for="(item, index) in departmentTableData"
                      :key="index"
                      :label="item.departmentName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="right fl">
                  <el-button @click="handleManage">{{ $t('管理') }}</el-button>
                </div>
              </el-form-item>
              <el-form-item :label="$t('钱包选择')" class="agent_attributes" prop="walletType">
                <el-radio-group v-model="addStaffData.walletType" size="small">
                  <el-radio :label="1">{{ $t('代充钱包') }}</el-radio>
                  <el-radio :label="2">{{ $t('彩金钱包') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="dialog-footer mt20">
          <el-button type="primary" @click="handleSubmitAddStaff">{{ $t('确定') }}</el-button>
          <el-button @click="closeAddStaff">{{ $t('取消') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <!-- 部门管理 -->
    <el-dialog @close="closeDepartantMange" :title="$t('部门管理')" :visible.sync="departantManageShow">
      <TableCom
        ref="department_table"
        :hasRemoveBtn="false"
        :hasAddBtn="false"
        :hasPagination="false"
        :tableData="departmentTableData"
        :tableColumns="departmentTableColumn"
      >
        <el-table-column align="center" :label="$t('序号')" slot="index" fixed="left" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('股东名称')" slot="agentId" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.agentId" filterable :placeholder="$t('请选择上级代理')">
              <el-option
                v-for="(item, index) in agentShareholderList"
                :key="index"
                :label="item.agyAccount"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('名称')" slot="departmentName">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.departmentName" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('更新时间')" slot="modifyTime" width="200" fixed="right">
          <template slot-scope="scope">
            {{ getTime(scope.row.modifyTime) }}
          </template>
        </el-table-column>
        <el-table-column align="left" :label="$t('操作')" slot="operate" fixed="right">
          <template slot-scope="scope">
            <span class="cblu" v-if="scope.row.agentCount > 0">-</span>
            <span class="cblu" @click="deleteDepartmentItem(scope.$index, scope.row.id)" v-else>{{ $t('删除') }}</span>
          </template>
        </el-table-column>
      </TableCom>
      <div class="departant_manage_self_add" @click="addDepartantTableItem">+{{ $t('添加') }}</div>
      <div class="dialog-footer mt20">
        <el-button type="primary" @click="saveDepartment">{{ $t('保存') }}</el-button>
        <el-button @click="closeAddDepartment">{{ $t('返回') }}</el-button>
      </div>
    </el-dialog>
    <!-- 代理详情 -->
    <span v-if="detailShow && (lineAttributes || speratAttributes)" class="add_agent_show">
      <el-dialog width="70%!important" @close="closeAgentDetail" :title="$t('代理详情')" :visible.sync="detailShow">
        <el-form
          class="form-wrapper"
          ref="arributeForm"
          label-position="right"
          :model="detailRowData"
          label-width="auto"
          :rules="addAgentRule"
        >
          <div class="half left">
            <div class="self_message">
              <div class="text">{{ $t('个人信息') }}</div>
              <el-form-item :label="$t('真实姓名')" prop="realName">
                <el-input type="text" v-model="detailRowData.realName" :placeholder="$t('请输入真实姓名')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('手机号')" prop="mobile">
                <el-input type="text" v-model="detailRowData.mobile" @keyup.native="detailRowData.mobile=detailRowData.mobile.replace(/[^0-9]/g,'')" :placeholder="$t('请输入手机号')">
                  <el-select v-model="detailRowData.mobileAreaCode" slot="prepend" filterable style="width: 82px !important" :placeholder="$t('请选择')">
                    <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'  +' + item.mobileAreaCode + '    ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <div class="text" v-if="isShowMobile">{{ $t('联系方式') }}</div>
              <el-form-item :label="$t('邮箱')" v-if="isShowMobile">
                <el-input type="text" v-model="detailRowData.email" :placeholder="$t('请输入邮箱')"></el-input>
              </el-form-item>
              <el-form-item label="QQ" v-if="isShowMobile">
                <el-input v-model="detailRowData.qq" :placeholder="$t('请输入QQ')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('微信')" v-if="isShowMobile">
                <el-input v-model="detailRowData.weChat" :placeholder="$t('请输入微信')"></el-input>
              </el-form-item>
              <el-form-item label="Skype" v-if="isShowMobile">
                <el-input v-model="detailRowData.skype" :placeholder="$t('请输入Skype')"></el-input>
              </el-form-item>
              <el-form-item label="FlyGram" v-if="isShowMobile">
                <el-input v-model="detailRowData.flyGram" :placeholder="$t('请输入FlyGram')"></el-input>
              </el-form-item>
              <el-form-item label="Telegram" v-if="isShowMobile">
                <el-input v-model="detailRowData.telegram" :placeholder="$t('请输入Telegram')"></el-input>
              </el-form-item>
              <el-form-item label="Whatsapp" v-if="isShowMobile">
                <el-input v-model="detailRowData.whatsapp" :placeholder="$t('请输入') + 'Whatsapp'"></el-input>
              </el-form-item>
              <el-form-item :label="$t('代理属性')" prop="">
                {{ [$t('直线代理'), $t('分线代理'), $t('推广员工'), $t('招商员工')][detailRowData.attributes] }}
              </el-form-item>
              <el-form-item :label="$t('登录密码')" prop="agyPwd">
                <el-input type="password" v-model="detailRowData.agyPwd" :placeholder="$t('请输入密码')"></el-input>
              </el-form-item>
              <el-form-item v-if="lineAttributes" :label="$t('支付密码')" prop="securePwd">
                <el-input type="password" v-model="detailRowData.securePwd" :placeholder="$t('请输入支付密码')"></el-input>
              </el-form-item>
            </div>
          </div>
          <div :class="[lineAttributes || speratAttributes ? 'speart' : '', 'half right']">
            <div class="self_message">
              <el-form-item :label="$t('上级代理')" prop="parentId" v-if="lineAttributes">
                <el-select
                  v-model="detailRowData.parentId"
                  filterable
                  :placeholder="$t('请选择上级代理')"
                  @change="onChangeAgentOfDetail"
                >
                  <el-option
                    v-for="(item, index) in superiorAgentList"
                    :key="index"
                    :label="item.agyAccount"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('总线代理')" v-if="speratAttributes" prop="parentId">
                <el-select v-model="detailRowData.parentId" filterable disabled :placeholder="$t('请选择总线代理')">
                  <el-option
                    v-for="(item, index) in sublineAgentList"
                    :key="index"
                    :label="item.agyAccount"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('状态')" prop="">
                <el-select v-model="detailRowData.available" filterable :placeholder="$t('请选择状态')">
                  <el-option :label="$t('正常')" :value="1"></el-option>
                  <el-option :label="$t('锁定')" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('银行卡')" prop="" v-if="lineAttributes" class="department">
                <!-- <span class="left"></span> -->
                <div class="select_left fl">
                  {{ detailRowData.bankNum || 0 }}
                  <span style="marginright: 10px">
                    <el-button @click="handleBanknumManage(detailRowData.id)">{{ $t('管理') }}</el-button>
                  </span>
                </div>
              </el-form-item>
              <el-form-item :label="$t('注册时间')" prop="">
                {{ detailRowData.createTime }}
              </el-form-item>
              <el-form-item :label="$t('直属会员人数')" prop="">
                {{ detailRowData.accountNum }}
              </el-form-item>
              <el-form-item :label="$t('下级代理人数')" prop="" v-if="lineAttributes">
                {{ detailRowData.offlineAgentCount || 0 }}
              </el-form-item>
              <el-form-item :label="$t('契约佣金')" prop="contractId" v-if="lineAttributes">
                <el-select v-model="addAgentData.contractId" :placeholder="$t('请选择佣金契约')">
                  <el-option
                    v-for="(item, index) in contractList"
                    :key="index"
                    :label="item.contractName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('契约有效期')" class="special_time" v-if="lineAttributes">
                <div class="contract_limit">
                  <el-col :span="11">
                    <el-date-picker
                      type="datetime"
                      :placeholder="$t('选择日期')"
                      v-model="detailRowData.contractStart"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      type="datetime"
                      :placeholder="$t('选择日期')"
                      v-model="detailRowData.contractEnd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-col>
                </div>
              </el-form-item>
              <div v-if="lineAttributes" prop="rebate">
                <span style="display: block; padding-bottom: 8px"
                  >{{ $t('上级返佣比例') }}：<i v-show="curAgentLevel !== null"
                    >({{ $t('你当前选择的上级代理为') }}{{ curAgentLevelText }})</i
                  ></span
                >
                <el-form-item :label="$t('总代理返佣')" prop="rebateratio">
                  <el-input v-model.number="detailRowData.rebateratio" type="number" :placeholder="$t('请输入总代理返佣比例')">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('一级代理返佣')" prop="firstagentratio">
                  <el-input
                    v-model.number="detailRowData.firstagentratio"
                    type="number"
                    :placeholder="$t('请输入一级代理返佣比例')"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item :label="$t('结算模式')" v-if="isShowServicerate || isShowAdditional">
                <div v-if="isShowServicerate">
                  <el-checkbox v-model="feeModelForm.serviceRateChecked" style="display: block"> {{ $t('服务费') }} </el-checkbox>
                  <label>{{ $t('存款') }}</label>
                  <el-input v-model.number="feeModelForm.depositServicerate" :min="0" style="width: 35%" type="number">
                    <span slot="suffix">%</span>
                  </el-input>
                  <label style="margin-left: 10px">{{ $t('提款') }}</label>
                  <el-input v-model.number="feeModelForm.withdrawServicerate" :min="0" style="width: 35%" type="number">
                    <span slot="suffix">%</span>
                  </el-input>
                </div>
                <div v-if="isShowAdditional">
                  <el-checkbox v-model="feeModelForm.platformRateChecked" style="display: block"> {{ $t('平台费') }} </el-checkbox>
                  <label>{{ $t('额外费用') }}</label>
                  <el-input
                    v-model.number="feeModelForm.additionalServicerate"
                    :min="0"
                    style="width: 60%"
                    type="number"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item :label="$t('新注册会员组')" prop="defaultGroupId">
                <el-select v-model="detailRowData.defaultGroupId" filterable :placeholder="$t('请选择会员组')">
                  <el-option
                    v-for="(item, index) in groupList"
                    :key="index"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('批量设置会员组')" prop="setGroupId">
                <el-select v-model="detailRowData.setGroupId" filterable :placeholder="$t('请选择会员组')">
                  <el-option
                    v-for="(item, index) in groupList"
                    :key="index"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('备注')">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  :placeholder="$t('备注')"
                  v-model="detailRowData.memo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('钱包选择')"
                prop="walletType"
                :rules="[
                  {
                    required: true,
                    message: $t('请选择钱包类型'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-radio-group v-model="detailRowData.walletType">
                  <el-radio :label="1">{{ $t('代充钱包') }}</el-radio><br />
                  <el-radio :label="2">{{ $t('彩金钱包') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="dialog-footer">
          <el-button v-if="permissions.edit" type="primary" @click="handleSubmitAgentDetail">{{ $t('确定') }}</el-button>
          <el-button @click="closeAgentDetail">{{ $t('取消') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <span v-else class="add_agent_show">
      <el-dialog width="50%" @close="closeAgentDetail" :title="$t('代理详情')" :visible.sync="detailShow_other">
        <el-form
          class="form-wrapper"
          style="width: 85%"
          ref="otherAttribute"
          label-position="left"
          :model="detailRowData"
          label-width="72px"
          :rules="addAgentRule"
        >
          <div class="half left">
            <div class="self_message">
              <el-form-item :label="$t('代理属性')" class="agent_attributes" prop="">
                {{ [$t('直线代理'), $t('分线代理'), $t('推广员工'), $t('招商员工')][detailRowData.attributes] }}
              </el-form-item>
              <el-form-item :label="$t('登录密码')" class="agent_attributes" prop="agyPwd">
                <el-input type="password" v-model="detailRowData.agyPwd" :placeholder="$t('请输入密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('支付密码')" class="agent_attributes" prop="securePwd">
                <el-input type="password" v-model="detailRowData.securePwd" :placeholder="$t('请输入支付密码')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('手机号')" prop="mobile">
                <el-input type="text" v-model="detailRowData.mobile" @keyup.native="detailRowData.mobile=detailRowData.mobile.replace(/[^0-9]/g,'')" :placeholder="$t('请输入手机号')">
                  <el-select v-model="detailRowData.mobileAreaCode" slot="prepend" filterable style="width: 82px !important" :placeholder="$t('请选择')">
                    <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'  +' + item.mobileAreaCode + '    ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('注册时间')" prop="">
                {{ detailRowData.createTime }}
              </el-form-item>
              <el-form-item class="special_label" :label="$t('直属会员人数')" prop="">
                {{ detailRowData.accountNum }}
              </el-form-item>
              <el-form-item class="special_label" :label="$t('下级代理人数')" prop="">
                {{ detailRowData.offlineAgentCount || 0 }}
              </el-form-item>
            </div>
          </div>
          <div class="half right">
            <div class="self_message">
              <el-form-item :label="$t('状态')" prop="">
                <el-select v-model="detailRowData.available" filterable :placeholder="$t('请选择状态')">
                  <el-option :label="$t('正常')" :value="1"></el-option>
                  <el-option :label="$t('锁定')" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('部门')" prop="" class="department">
                <div class="select_left fl">
                  <el-select v-model="detailRowData.departmentid" :placeholder="$t('请选择部门')">
                    <el-option
                      v-for="(item, index) in departmentTableData"
                      :key="index"
                      :label="item.departmentName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="right fl">
                  <el-button @click="handleManage">{{ $t('管理') }}</el-button>
                </div>
              </el-form-item>
              <el-form-item :label="$t('备注')">
                <el-input
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  :placeholder="$t('备注')"
                  v-model="detailRowData.memo"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('钱包选择')"
                prop="walletType"
                :rules="[
                  {
                    required: true,
                    message: $t('请选择钱包类型'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-radio-group v-model="detailRowData.walletType">
                  <el-radio :label="1">{{ $t('代充钱包') }}</el-radio>
                  <el-radio :label="2">{{ $t('彩金钱包') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="dialog-footer">
          <el-button v-if="permissions.edit" type="primary" @click="handleSubmitAgentDetail">{{ $t('确定') }}</el-button>
          <el-button @click="closeAgentDetail">{{ $t('取消') }}</el-button>
        </div>
      </el-dialog>
    </span>
    <!-- 银行卡详情 -->
    <el-dialog
      class="bank_detail"
      @close="closeAddStaff"
      title="
"
      :visible.sync="bankShow"
      center
    >
      <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">{{ $t('银行卡') }}</el-menu-item>
        <el-menu-item index="2">{{ $t('加密货币钱包') }}</el-menu-item>
      </el-menu>
      <div v-if="menuIndex === '1'">
        <TableCom
          ref="table"
          :hasRemoveBtn="false"
          :hasAddBtn="false"
          :hasPagination="false"
          :tableData="tableBankData"
          :tableColumns="tableBankColumns"
        >
          <!-- 表格插槽 -->
          <el-table-column :label="$t('状态')" slot="status" fixed="right" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status">{{ $t('启用') }}</el-tag>
              <el-tag v-else type="danger">{{ $t('禁用') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('是否启用')" slot="status" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.available"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                disabled
              >
              </el-switch>
            </template>
          </el-table-column>
        </TableCom>
      </div>
      <div v-else>
        <STableCom :loading="usdtLoading" :tableData="tableUsdtData" :tableColumns="tableUsdtColumns"></STableCom>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";
import fileExport from "../../../mixins/fileExport";
import moment from "moment";
import _ from "lodash";
import Mixin from '@/mixins/loadTime'

export default {
  components: { StartAndEndTimeSelector },
  mixins: [fileExport, Mixin],
  data() {
    return {
      groupList: [],
      searchCriteria: {
        keys: {
          agyAccount: null,
          mobile: null,
          realName: null,
          agentType: null,
          available: null,
          attributes: null,
          createTimeFrom: null,
          createTimeTo: null,
          departmentid: null,
          feeModel: null,
          agyTopAccount: null,
          contractId: null,
        },
      },
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      departmentList: [],
      exportLoading: false,
      addAgentShow: false,
      addStaffShow: false,
      departantManageShow: false,
      contractList: [],
      options: [],
      addAgentData: {
        agyAccount: null,
        agyPwd: null,
        securePwd: null,
        realName: null,
        attributes: null,
        mobileAreaCode: '86',
        mobile: null,
        parentId: null,
        contractId: null,
        contractStart: null,
        contractEnd: null,
        email: null,
        qq: null,
        weChat: null,
        skype: null,
        flyGram: null,
        // feeModel: 2,
        walletType: 1,
        telegram: null,
        rebateratio: null,
        firstagentratio: null,
      },
      addStaffData: {
        mobileAreaCode: '86',
        agyAccount: null,
        agyPwd: null,
        securePwd: null,
        attributes: null,
        departmentid: null,
        walletType: 1,
      },
      departmentData: {
        departmentName: null,
        agentCount: null,
        modifyTime: null,
        agentId: null,
      },
      // 部门管理
      departmentTableData: [],
      saveDepartmentTableData: [],
      attributes: "",
      sublineAgentList: [],
      superiorAgentList: [],
      agentShareholderList: [],
      detailRowData: {},
      detailShow: false,
      detailShow_other: false,
      bankShow: false,
      usdtLoading: false,
      tableBankData: [],
      tableUsdtData: [],
      selectDepartmentOptions: [],
      selectcontractOptions: [],
      selectVal: [],
      feeModelForm: {
        serviceRateChecked: false,
        platformRateChecked: true,
        depositServicerate: 2, // 服务费存款比例
        withdrawServicerate: 2, // 服务费提款比例
        additionalServicerate: 0, // 平台费额外比例
        // feeModel: 2,
        // serviceRate: null
      },
      feeModelLoading: false,
      showUpdateFeeModel: false,
      menuIndex: '1',
      curAgentLevel: null,
      isShowServicerate: false,
      isShowAdditional: false,
      isShowMobile: false,
      mobileAreaCodeList: [],
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    tableUsdtColumns() {
      return [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 50 },
        { label: this.$t('钱包名称'), prop: 'walletName', width: 90 },
        { label: this.$t('币种'), prop: 'currencyCode', width: 70 },
        { label: this.$t('协议类型'), prop: 'currencyProtocol', width: 70 },
        { label: this.$t('钱包地址'), prop: 'walletAddress' },
        { label: this.$t('绑定日期'), prop: 'createTime' },
      ]
    },
    tableBankColumns() {
      return [
        { label: this.$t('序号'), render: (h, row, scope) => h('span', scope.$index + 1), width: 50 },
        {
          prop: "realName",
          label: this.$t("开户姓名"),
          width: "80",
        },
        {
          prop: "bankName",
          label: this.$t("开户银行"),
          width: "100",
        },
        {
          prop: "province",
          label: this.$t("开户地址"),
          width: "80",
        },
        {
          prop: "cardNo",
          label: this.$t("开户账号"),
          width: "140",
        },
        {
          prop: "createTime",
          label: this.$t("绑定日期"),
          width: "140",
        },
        {
          slotName: "status", // 状态
        },
        {
          slotName: "available", // 是否启用
        },
      ]
    },
    addStaffRule() {
      return {
        agyAccount: [
          { required: true, message: this.$t("输入6~10位数字、字母或数字与字母组合"), trigger: "change" },
          { validator: this.matchSixTen, trigger: "blur" }
        ],
        agyPwd: [
          { required: true, message: this.$t("请输入密码"), trigger: "change" },
          { validator: this.v_agyPwd, trigger: "blur" }
        ],
        securePwd: [
          { required: true, message: this.$t("请输入支付密码"), trigger: "change" },
          { validator: this.v_agyPwd, trigger: "blur" }
        ],
        attributes: [
          { required: true, message: this.$t("请选择代理属性"), trigger: "change" },
        ],
        walletType: [
          { required: true, message: this.$t("请选择钱包"), trigger: "change" },
        ],
        parentId: [
          { required: true, message: this.$t("请选择代理"), trigger: "change" },
        ],
        mobile: [
          { validator: this.v_mobile, trigger: 'blur' }
        ]
      }
    },
    addAgentRule() {
      var v_realName = (rule, value, callback) => {
        if (value) {
          if (value && (value.length < 2 || value.length > 30)) {
            return callback(new Error(this.$t("输入2-30位字符长度的姓名")));
          } else if (!/[\u4e00-\u9fa5]|[a-zA-Z]|[ ]|[·]/ig.test(value)) {
            return callback(new Error(this.$t("姓名必须是汉字、字母、空格或·中的一种或多种的组合")));
          }
        }
        callback()
      }
      var v_email = (rule, value, callback) => {
        if (value && !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ig.test(value)) {
          callback(new Error(this.$t("邮箱格式不合法")));
        }
        else {
          callback();
        }
      }
      var v_qq = (rule, value, callback) => {
        if (value && (value.length < 5 || value.length > 15 || isNaN(value))) {
          callback(new Error(this.$t("qq号码必须为5-15位数字组成")));
        }
        else {
          callback();
        }
      }
      var v_weChat = (rule, value, callback) => {
        if (value && (!/[0-9]|[a-z]|[A-Z]|[_]/ig.test(value) || value.length < 5 || value.length > 20)) {
          callback(new Error(this.$t("微信号码必须为5-20位字母、数字、下划线或组合")));
        }
        else {
          callback();
        }
      }
      const v_contractId = (rule, value, callback) => {
        const { contractId } = this.addAgentData
        if (!contractId) {
          callback(this.$t('请选择佣金契约'))
        } else {
          callback()
        }
      }
      var validRebate = (rule, value, callback) => {
        if (value < 0 || value > 100) {
          callback(new Error(this.$t('请输入小于或等于100的正数')));
        } else {
          callback();
        }
      };
      return {
        defaultGroupId: [
          { required: true, message: this.$t("请选择会员组"), trigger: "blur" }
        ],
        agyAccount: [
          { required: true, message: this.$t("输入6~10位数字、字母或数字与字母组合"), trigger: "change" },
          { validator: this.matchSixTen, trigger: "blur" }
        ],
        agyPwd: [
          { required: true, message: this.$t("请输入密码"), trigger: "blur" },
          { validator: this.v_agyPwd, trigger: "blur" }
        ],
        securePwd: [
          { required: true, message: this.$t("请输入支付密码"), trigger: "blur" },
          { validator: this.v_agyPwd, trigger: "blur" }
        ],
        mobile: [
          { validator: this.v_mobile, trigger: "blur" }
        ],
        realName: [
          { validator: v_realName, trigger: "blur" }
        ],
        email: [{ validator: v_email, trigger: "blur" }],
        qq: [{ validator: v_qq, trigger: "blur" }],
        weChat: [{ validator: v_weChat, trigger: "blur" }],
        attributes: [
          { required: true, message: this.$t("请选择代理属性"), trigger: "change" },
        ],
        parentId: [
          { required: true, message: this.$t("请选择代理"), trigger: "change" },
        ],
        contractId: [
          { required: true, validator: v_contractId, trigger: "change" },
        ],
        rebateratio: [
          { required: true, message: this.$t("请输入总代理返佣比例"), trigger: "blur" },
          { validator: validRebate, trigger: "blur" },
        ],
        firstagentratio: [
          { required: true, message: this.$t("请输入一级代理返佣比例"), trigger: "blur" },
          { validator: validRebate, trigger: "blur" },
        ],
      }
    },
    departmentTableColumn() {
      return [
        {
          slotName: "index",
        },
        // {
        //   prop: "id",
        //   label: "id",
        // },
        {
          slotName: "agentId", // 股东名称
        },
        {
          slotName: "departmentName", // 名称
        },
        {
          slotName: "modifyTime", //更新时间
        },
        {
          prop: "agentCount",
          label: this.$t("代理人数"),
          width: "100",
        },
        {
          slotName: "operate",
        },
      ]
    },
    tableColumns() {
      return [
        { slotName: 'selection' },
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          slotName: "agyAccount", // 代理账号
        },
        {
          prop: 'realName',
          label: this.$t("姓名"),
          width: "100",
        },
        {
          width: "200",
          prop: 'mobile',
          label: this.$t("手机号"),
          slotName: 'mobile'
        },
        {
          prop: "agyTopAccount",
          label: this.$t("上级代理"),
          width: "100",
        },
        {
          slotName: "agentType", //代理等级
        },
        {
          prop: "accountNum",
          label: this.$t("直属会员人数"),
          width: "100",
        },
        {
          prop: "directAgentCount",
          label: this.$t("下级代理人数"),
          width: "100",
        },
        {
          slotName: "available", // "0 锁定 1 正常
        },
        {
          slotName: "departmentid", // 部门id
        },
        {
          label: this.$t('结算模式'),
          render: (h, row) => h('span', { 1: this.$t('平台费'), 2: this.$t('服务费'), 3: this.$t('服务费')+this.$t('平台费') }[row.feeModel]),
        },
        {
          slotName: "attributes",
        },
        {
          label: this.$t('代理域名'),
          prop: 'domainUrl'
        },
        {
          label: this.$t('佣金契约'),
          prop: 'contractname'
        },
        {
          label: this.$t('给总代返佣比例'),
          render: (h, row) => {
            const { rebateratio } = row
            let str = ''
            if (rebateratio === null) {
              str = '-'
            } else {
              str = rebateratio + '%'
            }
            return h('span', str)
          },
        },
        {
          label: this.$t('给一级代理返佣比例'),
          render: (h, row) => {
            const { firstagentratio } = row
            let str = ''
            if (firstagentratio === null) {
              str = '-'
            } else {
              str = firstagentratio + '%'
            }
            return h('span', str)
          },
        },
        {
          label: this.$t('上级返利比例'),
          prop: 'rate',
          slotName: "rate",
        },
        {
          slotName: "contractEnd",
        },
        {
          slotName: "createTime", // -- 注册时间
        },
        {
          label: this.$t('备注'),
          prop: 'memo'
        },
        {
          label: this.$t('佣金钱包余额'),
          prop: 'walletBalance'
        },
        {
          label: this.$t('代充钱包余额'),
          prop: 'rechargeWallet'
        },
        {
          label: this.$t('彩金钱包余额'),
          prop: 'payoffWallet'
        }
      ]
    },
    serchMeta() {
      return [
          {
            type: "text",
            label: this.$t("代理账号"),
            prop: "agyAccount",
          },
          {
            type: "text",
            label: this.$t("手机号"),
            prop: "mobile",
          },
          {
            type: "text",
            label: this.$t("姓名"),
            prop: "realName",
          },
          {
            // 代理等级
            type: "select",
            label: this.$t("代理等级"),
            prop: "agentType",
            clearable: true,
            options: [
              // 0 股东 1总代 2 一级代理 3 二级代理
              {
                label: this.$t("股东"),
                value: 0,
              },
              {
                label: this.$t("总代"),
                value: 1,
              },
              {
                label: this.$t("一级代理"),
                value: 2,
              },
              {
                label: this.$t("二级代理"),
                value: 3,
              },
            ],
          },
          {
            // 状态
            type: "select",
            label: this.$t("状态"),
            prop: "available",
            clearable: true,
            options: [
              {
                label: this.$t("锁定"),
                value: 0,
              },
              {
                label: this.$t("正常"),
                value: 1,
              },
            ],
          },
          {
            type: "select",
            label: this.$t("选择契约"),
            prop: "contractId",
            clearable: true,
            options: this.selectcontractOptions,
          },
          {
            // 结算模式
            type: "select",
            label: this.$t("结算模式"),
            prop: "feeModel",
            clearable: true,
            options: [
              {
                label: this.$t("服务费"),
                value: 2,
              },
              {
                label: this.$t("平台费"),
                value: 1,
              },
              {
                label: this.$t("服务费")+this.$t("平台费"),
                value: 3,
              },
            ],
          },
          {
            type: "select",
            label: this.$t("代理属性"),
            prop: "attributes",
            clearable: true,
            options: [
              // 0 直线代理 1分线代理  2 推广员工 3招商员工
              {
                label: this.$t("直线代理"),
                value: 0,
              },
              {
                label: this.$t("分线代理"),
                value: 1,
              },
              {
                label: this.$t("推广员工"),
                value: 2,
              },
              {
                label: this.$t("招商员工"),
                value: 3,
              },
            ],
          },
          {
            label: this.$t("注册时间"),
            prop: 'registTime',
            slotName: "registTime",
            options: [
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
            ],
          },
          {
            type: "select",
            label: this.$t("部门"),
            slotName: "departmentid",
            options: this.selectDepartmentOptions,
            prop: "departmentid"
          },
          {
            type: "text",
            label: this.$t("上级代理"),
            prop: "agyTopAccount",
          },
        ]
    },
    curAgentLevelText() {
      const { curAgentLevel } = this
      return curAgentLevel === 0 ? this.$t('股东') : curAgentLevel === 1 ? this.$t('总代') : curAgentLevel === 2 ? this.$t('一级代理') : '-'
    },
    permissions() {
      const { hasPermission } = this;
      return {
        edit: hasPermission("agent:account:update"),
        addD: hasPermission("agent:account:agentSave"),
        updateFeeModel: hasPermission("agent:account:updateFeeModel"),
        addY: hasPermission("agent:account:saveEmployee"),
        export: hasPermission("agent:account:exportv"),
        mobile: hasPermission("agent:contact:mobile"),
        name: hasPermission("agent:contact:name"),
        updateadditional: hasPermission("agent:account:updateadditional"),
        updateServicerate: hasPermission("agent:account:updateServicerate"),
      };
    },
    lineAttributes() {
      return this.detailRowData.attributes === 0;
    },
    speratAttributes() {
      return this.detailRowData.attributes === 1;
    },
  },
  filters: {
    feeModelF(val) {
      return val.filter(i => i.attributes === 0).length
    }
  },
  created() {
    this.init();
  },
  methods: {
    getMobileAreaCode() {
      this.$axios.GET(systemConfig.urls.getMobileAreaCode).then(({ res }) => {
        if (res) {
          this.mobileAreaCodeList = res.mobileAreaCodes
        }
      })
    },
    v_mobile (rule, value, callback) {
      if (value) {
        if (!/^\d*$/.test(value)) return callback(new Error(this.$t("请输入数字类型")));
        if (this.addAgentShow) {
          const { mobileAreaCode } = this.addAgentData
          const { bool, text } = this.judgeCurrentMobilLength(mobileAreaCode, value)
          if (!mobileAreaCode) return callback(new Error(this.$t("请选择区号")));
          if (!bool) return callback(new Error(this.$t('当前电话号长度不在有效范围内') + text));
          callback()
        } else if (this.addStaffShow) {
          const { mobileAreaCode } = this.addStaffData
          const { bool, text } = this.judgeCurrentMobilLength(mobileAreaCode, value)
          if (!mobileAreaCode) return callback(new Error(this.$t("请选择区号")));
          if (!bool) return callback(new Error(this.$t('当前电话号长度不在有效范围内') + text));
          callback()
        } else {
          const { mobileAreaCode } = this.detailRowData
          const { bool, text } = this.judgeCurrentMobilLength(mobileAreaCode, value)
          if (!mobileAreaCode) return callback(new Error(this.$t("请选择区号")));
          if (!bool) return callback(new Error(this.$t('当前电话号长度不在有效范围内') + text));
          callback()
        }
      } else {
        callback()
      }
    },
    // v_mobile (rule, value, callback) {
    //   if (value) {
    //     if (value && (value.length !== 11 || !/[\d\*]{11}/.test(value))) {
    //       return callback(new Error(this.$t("输入11位数字的手机号码")));
    //     } else if (!/^1/ig.test(value) || ((this.detailShow_other || this.detailShow) && value.indexOf('*') > -1 && (value !== this.detailRowData.mobile2.substr(0, 3) + '****' + this.detailRowData.mobile2.substr(7)))) {
    //       return callback(new Error(this.$t("手机号码必须是以1开头的11位数字")));
    //     }
    //   }
    //   callback()
    // },
    v_agyPwd (rule, value, callback) {
      if (value.length < 6 || value.length > 18) {
        callback(new Error(this.$t("输入{num}位数字、字母或数字与字母组合", { num: '6~18' })));
      } else {
        if (!/[0-9]|[a-z]|[A-Z]/ig.test(value)) {
          callback(new Error(this.$t("输入{num}位数字、字母或数字与字母组合", { num: '6~18' })));
        } else {
          callback();
        }
      }
    },
    matchSixTen(rule, value, callback) {
      if (systemConfig.matchSixTen(value)) {
        callback();
      } else {
        callback(new Error(this.$t("输入{num}位数字、字母或数字与字母组合", { num: '6~10' })));
      }
    },
    onChangeAgentOfDetail(id) {
      const cur = this.superiorAgentList.find(item => item.id === id)
      this.curAgentLevel = cur.agentType
    },
    onChangeAttributesOfAdd() {
      this.addAgentData.rebateratio = null
      this.addAgentData.firstagentratio = null
      this.curAgentLevel = null
    },
    onChooseAgentOfAdd(id) {
      const cur = this.superiorAgentList.find(item => item.id === id)
      this.curAgentLevel = cur.agentType
      switch (cur.agentType) {
        case 0:  // 股东
          this.addAgentData.rebateratio = 0
          this.addAgentData.firstagentratio = 0
          break;
        case 1: // 总代
          this.addAgentData.rebateratio = null
          this.addAgentData.firstagentratio = 0
          break;
        case 2: // 一级代理
          this.addAgentData.rebateratio = null
          this.addAgentData.firstagentratio = null
          break;
        // case 3: // 二级代理
        //   break;
      }
    },
    async init() {
      // 新增代理中使用
      const query = this.$route.query
      const contractId = query && query.contractId  || null
      await this.getAllContractList(); // 获取契约佣金列表
      if (contractId) {
        this.$set(this.searchCriteria.keys, 'contractId', Number(contractId))
      }
      this.getAlldDepartmentList(); // 获取所有部门
      this.getTableData(); // 获取列表
      // 新增代理中使用
      this.getAllContractList(); // 获取契约佣金列表
      this.getSuperiorAgentList(); // 获取直线代理
      this.getSublineAgentList(); // 获取分线代理
      this.getGroupList()
      this.getMobileAreaCode()
    },
    getGroupList() {
      this.$axios.get(systemConfig.urls.groupListAll, { params: { pageSize: 999, pageNo: 1 } }).then(res => {
        if (res.data.code === 0) {
          res.data.page.map(ws => {
            this.groupList.push({ label: ws.groupName, id: ws.id })
          })
        }
      })
    },
    onDialogClose() {
      this.feeModelForm = this.$options.data().feeModelForm
    },
    setFeeModelForm(data) {
      const { feeModel, depositServicerate, withdrawServicerate, additionalServicerate } = data
      this.feeModelForm.depositServicerate = depositServicerate
      this.feeModelForm.withdrawServicerate = withdrawServicerate
      this.feeModelForm.additionalServicerate = additionalServicerate
      if (feeModel === 1) {
        this.feeModelForm.serviceRateChecked = false
        this.feeModelForm.platformRateChecked = true
      } else if (feeModel === 2) {
        this.feeModelForm.serviceRateChecked = true
        this.feeModelForm.platformRateChecked = false
      } else if (feeModel === 3) {
        this.feeModelForm.serviceRateChecked = true
        this.feeModelForm.platformRateChecked = true
      }
    },
    getFeeModelForm() {
      const {
        serviceRateChecked,
        platformRateChecked,
        depositServicerate,
        withdrawServicerate,
        additionalServicerate,
      } = this.feeModelForm
      const formData = {
        depositServicerate,
        withdrawServicerate,
        additionalServicerate,
      }
      if (!serviceRateChecked && platformRateChecked) {
        formData.feeModel = 1
      } else if (serviceRateChecked && !platformRateChecked) {
        formData.feeModel = 2
      } else if (serviceRateChecked && platformRateChecked) {
        formData.feeModel = 3
      } else {
        formData.feeModel = null
      }
      return formData
    },
    async submitFeeModel() {
      const formData = this.getFeeModelForm()
      const data = {
        ids: this.selectVal.filter(i => i.attributes === 0).map(i => i.id),
        ...formData,
      }
      this.feeModelLoading = true
      const { res } = await this.$axios.POST(this.$urls.newAggentList.updateFeeModel, data)
      this.feeModelLoading = false
      if (res) {
        this.$message.success(this.$t('操作成功'))
        this.handleFeeModelCancel()
        this.getTableData()
      } else {
        this.$message.error(this.$t('操作失败'))
      }
    },
    handleSubmitFeeModel() {
      this.$refs.updateFeeModel.validate(isOk => {
        if (isOk) {
          this.$confirm(this.$t('确定进行更改吗？'), this.$t('确认操作'), { center: true }).then(() => {
            this.submitFeeModel()
          })
        }
      })
    },
    handleFeeModelCancel() {
      this.showUpdateFeeModel = false
    },
    handleSelectionChange(val) {
      this.selectVal = val
      console.log('this.selectVal:', this.selectVal)
    },
    handleMenuSelect(index) {
      this.menuIndex = index
    },
    async getUsdtList(id) {
      this.usdtLoading = true
      const { res } = await this.$axios.GET(this.$urls.newAggentList.agyCryptocurrenciesList, { id })
      this.usdtLoading = false
      if (res) {
        this.tableUsdtData = res.data
      }
    },
    getAlldDepartmentList() {
      this.$axios
        .get(systemConfig.urls.newAggentList.alldDepartmentList)
        .then((res) => {
          const data = res.data.data;
          const selectDepartmentOptions = data.map((item) => {
            return {
              label: item.departmentName,
              value: item.id,
            };
          });
          // this.searchCriteria.meta.find(i => i.prop === 'departmentid').options = selectDepartmentOptions;
          this.selectDepartmentOptions = selectDepartmentOptions
          this.saveDepartmentTableData = _.cloneDeep(data);
          this.departmentTableData = _.cloneDeep(data);
        });
    },
    getTime(val) {
      if (!val) return;
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.newAggentList.tableList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...this.searchCriteria.keys,
            // orderBy: "",
          },
        })
        .then((res) => {
          if (res) {
            this.getNetworkLoadAndDataSolveTime(res)
            const { list, totalCount, currPage } = res.data.page;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            this.tableData = list.map((item) => {
              item.createTime = systemConfig.transferTimeByType(
                item.createTime,
                "bj"
              );
              item.reviewTime = systemConfig.transferTimeByType(
                item.reviewTime,
                "bj"
              );
              item.contractEnd = new Date(item.contractEnd).getTime()
              return item;
            });
          }
        });
    },
    getDepartmentName(id) {
      if (!id) return "";
      const name =
        this.departmentTableData.find((item) => (item.id = id)) || {};
      return name.departmentName || "";
    },
    handleUpdateFeeModel() {
      if (!this.selectVal.length) return this.$message.warning(this.$t('请选择代理账号'))
      this.feeModelForm.serviceRate = null
      this.showUpdateFeeModel = true
    },
    handleAddAgent() {
      this.addAgentShow = true;
    },
    handleAddStaff() {
      this.addStaffShow = true;
      this.getAgentShareholderList(); // 获取所有股东
    },
    closeAddAgent() {
      this.curAgentLevel = null
      this.resetAddAgentData();
      this.addAgentShow = false;
    },
    closeAddStaff() {
      this.resetAddStaffData();
      this.addStaffShow = false;
    },
    handleSubmitAddAgent() {
      this.$refs.add_form.validate((valid) => {
        if (valid) {
          const submit = () => {
            const contractStart = this.addAgentData.contractStart;
            const contractEnd = this.addAgentData.contractEnd;
            if (contractStart && contractEnd) {
              if (
                new Date(contractStart).getTime() >
                new Date(contractEnd).getTime()
              ) {
                this.$message({
                  type: "warning",
                  message: this.$t("申请起始时间不能大于结束时间"),
                });
                return;
              }
            } else {
              if (this.addAgentData.attributes === 0) {
                this.$message({
                  type: "warning",
                  message: this.$t("请选择契约有效期"),
                });
                return;
              }
            }
            const formData = this.getFeeModelForm()
            const params = {
              ...this.addAgentData,
              ...formData,
              contractStart: contractStart ? moment(contractStart).format("YYYY-MM-DD HH:mm:ss") : null,
              contractEnd: contractEnd ? moment(contractEnd).format("YYYY-MM-DD HH:mm:ss") : null,
            };
            this.$axios
              .post(systemConfig.urls.newAggentList.agentSave, params)
              .then((res) => {
                this.$message.success(this.$t('操作成功'))
                this.closeAddAgent();
                this.getTableData();
              }, () => this.$message.error(this.$t('操作失败')));
          }
          this.$confirm(this.$t('确定进行修改吗？'), this.$t('确认操作'), { center: true }).then(() => submit())
        }
      });
    },
    resetAddAgentData() {
      this.addAgentData = this.$options.data().addAgentData;
      this.feeModelForm = this.$options.data().feeModelForm;
    },
    resetAddStaffData() {
      this.addStaffData = this.$options.data().addStaffData;
    },
    async hasExportBtn() {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        ...this.searchCriteria.keys,
      }
      this.exportLoading = true
      const { res } = await this.$axios.GET(this.$urls.agentApply.agentListExport, params)
      if (res) {
        await this.agentCheckFile('agentListExcel')
      }
      this.exportLoading = false
    },
    handleSubmitAddStaff() {
      this.$refs.add_staff.validate((valid) => {
        if (valid) {
          const params = {
            ...this.addStaffData,
          };
          this.$axios
            .post(systemConfig.urls.newAggentList.saveEmployee, params)
            .then((res) => {
              this.closeAddStaff();
              this.getTableData();
            });
        }
      });
    },
    closeDepartantMange() {
      this.departantManageShow = false;
    },
    addDepartantTableItem() {
      const item = _.cloneDeep(this.departmentData);
      this.departmentTableData.push(item);
    },
    saveDepartment() {
      const params = this.departmentTableData;
      this.$axios
        .post(systemConfig.urls.newAggentList.addDepartment, params)
        .then((res) => {
          this.closeDepartantMange();
          this.getAlldDepartmentList();
        });
    },
    closeAddDepartment() {
      this.departantManageShow = false;
      this.departmentTableData = this.saveDepartmentTableData;
    },
    deleteDepartmentItem(index, id) {
      if (id || id === 0) {
        const params = {
          id: id,
        };
        this.$axios
          .post(systemConfig.urls.newAggentList.deleteDepartment, params)
          .then((res) => {
            this.getAlldDepartmentList();
          });
      } else {
        this.departmentTableData.splice(index, 1);
      }
    },
    async getAllContractList() {
      // 所有契约列表
     await this.$axios
        .get(systemConfig.urls.agentApply.allContractList)
        .then((res) => {
          this.contractList = res.data.data;
          let arr = []
          this.contractList.map(item => {
            arr.push(
              {
                label: item.contractName,
                value: item.id,
              }
            )
          })
          this.selectcontractOptions = arr
          this.addAgentData.contractId = res.data.data[0].id
        });
    },
    getSuperiorAgentList() {
      this.$axios
        .get(systemConfig.urls.agentApply.superiorAgentList)
        .then((res) => {
          this.superiorAgentList = res.data.data;
        });
    },
    getSublineAgentList() {
      this.$axios
        .get(systemConfig.urls.agentApply.sublineAgentList)
        .then((res) => {
          this.sublineAgentList = res.data.data;
        });
    },
    setInitData(whichKey, data, val) {
      const arr = [];
      data.forEach((value) => {
        arr.push({ id: value.id, value: value[val] });
      });
      this[whichKey] = arr;
    },
    operateAgentAttributes(val) {
      this.attributes = val;
    },
    handleManage() {
      this.departantManageShow = true;
      this.getAlldDepartmentList();
    },
    handleBanknumManage(id) {
      this.bankShow = true;
      this.getBankInfo(id);
      this.getUsdtList(id);
    },
    getBankInfo(id) {
      this.$axios
        .get(systemConfig.urls.newAggentList.agyBankList, { params: { id } })
        .then((res) => {
          const list = res.data.data;
          this.tableBankData = list.map((item) => {
            item.status = item.available;
            item.createTime = systemConfig.transferTimeByType(
              item.createTime,
              "bj"
            );
            return item;
          });
        });
    },
    handleSubmitAgentDetail() {
      const bool = this.lineAttributes || this.speratAttributes;
      const refName = bool ? "arributeForm" : "otherAttribute";
      this.$refs[refName].validate((valid) => {
        if (valid) {
          // if(this.detailRowData.agyPwd==="111111"){
          //   this.detailRowData.agyPwd = null
          // }
          // if(this.detailRowData.securePwd==="111111"){
          //   this.detailRowData.securePwd = null
          // }
          const submit = () => {
            if (this.detailRowData.mobile2 && this.detailRowData.mobile === this.detailRowData.mobile2.substr(0, 3) + '****' + this.detailRowData.mobile2.substr(7)) {
              this.detailRowData.mobile = this.detailRowData.mobile2
            }
            let { agyPwd, securePwd, mobile, realName, contractStart, contractEnd } = this.detailRowData
            if (!contractStart || contractStart === "Invalid date") {
              this.detailRowData.contractStart = ""
            } else {
              this.detailRowData.contractStart = moment(contractStart).format("YYYY-MM-DD HH:mm:ss");
            }
            if (!contractEnd || contractEnd === "Invalid date") {
              this.detailRowData.contractEnd = ""
            } else {
              this.detailRowData.contractEnd = moment(contractEnd).format("YYYY-MM-DD HH:mm:ss");
            }
            const { name: PName, mobile: PMobile } = this.permissions
            mobile = !PMobile && /\*/.test(mobile) ? null : mobile
            realName = !PName && /\*/.test(realName) ? null : realName
            const feeFormData = this.getFeeModelForm()
            const params = {
              ...this.detailRowData,
              ...feeFormData,
              mobile,
              realName,
              contractId: this.addAgentData.contractId,
              agyPwd: agyPwd === '111111' ? null : agyPwd,
              securePwd: securePwd === '111111' ? null : securePwd
            };
            this.$axios
              .post(systemConfig.urls.newAggentList.updateAgent, params)
              .then(() => {
                this.$message.success(this.$t('操作成功'))
                this.closeAgentDetail();
                this.getTableData();
              }, () => this.$message.error(this.$t('操作失败')));
          }
          this.$confirm(this.$t('确定进行更改吗？'), this.$t('操作确认'), { center: true }).then(() => submit())
        }
      });
    },
    getAgentShareholderList() {
      this.$axios
        .get(systemConfig.urls.newAggentList.agentShareholderList)
        .then((res) => {
          this.agentShareholderList = res.data.data;
        });
    },
    handleShowDetaile(row) {
      const p1 = new Promise((resolve => {
        this.getAgyAccountInfo(row.id).then((d) => {
          resolve(d)
        })
      }))
      const p2 = new Promise((resolve => {
        this.$axios.get(systemConfig.urls.agentViewOther + `/` + row.id).then(res => {
          resolve(res.data)
        })
      }))
      Promise.all([p1, p2]).then(result => {
        console.log(result)
        this.addAgentData.contractId = result[0].contractId
        const { other } = result[1]
        if (other) {
          // const { email, flyGram, qq, skype, telegram, weChat } = other
          // this.detailRowData = { ...this.detailRowData, email, flyGram, qq, skype, telegram, weChat }
          this.setFeeModelForm(other)
          this.isShowServicerate = other.isShowServicerate
          this.isShowAdditional = other.isShowAdditional
          this.isShowMobile = other.isShowMobile
        }
        if (result[0].attributes === 0 || result[0].attributes === 1) {
          this.detailShow = true;
        } else {
          this.detailShow_other = true;
        }
      })
    },
    async getAgyAccountInfo(id) {
      let d;
      await this.$axios
        .get(systemConfig.urls.newAggentList.agyAccountInfo, { params: { id } })
        .then((res) => {
          this.detailRowData = res.data.data
          this.detailRowData.mobile2 = res.data.data.mobile
          // this.setFeeModelForm(res.data.data)
          if (!res.data.data.securePwd) {
            this.detailRowData.securePwd = "111111"
          }
          if (!res.data.data.agyPwd) {
            this.detailRowData.agyPwd = "111111"
          }
          if (res.data.data.mobile) {
            this.detailRowData.mobile = this.detailRowData.mobile.substr(0, 3) + '****' + this.detailRowData.mobile.substr(7)
          }
          d = res.data.data;
        });
      return d;
    },
    closeAgentDetail() {
      this.curAgentLevel = null
      this.detailShow = false;
      this.detailShow_other = false;
      this.$refs["arributeForm"] ? this.$refs["arributeForm"].clearValidate() : null;
      this.$refs["otherAttribute"] ? this.$refs["otherAttribute"].clearValidate() : null;
      this.feeModelForm = this.$options.data().feeModelForm
    },
    validR(row) {
      if (!/(^[1-9]\d*$)/.test(row.rate)) {
        this.$message.error(this.$t('上级返佣比例必须为正整数'))
        this.getTableData()
        return false
      }
    },
    changeRate(row) {
      if (!/(^[1-9]\d*$)/.test(row.rate)) {
        return false
      }
      this.$axios.get(systemConfig.urls.updateAgentRate, { params: { id: row.id, rate: row.rate } }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('修改上级返利比例成功！')
          this.getTableData()
        } else {
          this.getTableData()
        }
      }).catch(() => {
        this.getTableData()
      })
    },
    judgeCurrentMobilLength (mobileAreaCode, mobile) {
      let text
      if(mobileAreaCode && mobile) {
        const currentLengthLimit = this.mobileAreaCodeList.find(v => v.mobileAreaCode === mobileAreaCode)
        const { maxlen, minlen } = currentLengthLimit
        if (mobile.length < minlen || mobile.length > maxlen) {
          const numLimit = Number(minlen) === Number(maxlen) ? minlen : minlen + '~'  + maxlen
          text = '(' + numLimit + this.$t('位') + ')'
          return {
            bool: false,
            text
          }
        }
      }
      return {
        bool: true,
        text
      }
    }
  },
  watch: {
    "addAgentData.attributes": {
      handler(n, o) {
        this.$set(this.addAgentData, "parentId", null);
        if (n === 1) {
          this.$set(this.addAgentData, "contractId", null);
        }
      },
      // deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
#linkDialog {
  span.el-dialog__header {
    text-align: center;
  }
  .el-dialog__headerbtn {
    display: none;
  }
  #linkMember {
    font-size: 14px !important;
    font-weight: bold;
    min-height: 30px;
    line-height: 30px;
    margin: -20px 0 10px 0;
  }
  .selectLinkMember {
    font-size: 14px !important;
    padding-left: 15px;
    .el-radio-group {
      label {
        display: inline-block;
        min-width: 30%;
        margin: 5px 0;
      }
    }
  }
}
.percentage {
  position: absolute;
  right: 18px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.table-operation-btns-wrapper-self {
  position: relative;
  overflow: hidden;
  padding: 10px 0;
  margin-bottom: -20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  .table-operation-btns {
    flex: 1;
    display: flex;
    padding-bottom: 10px;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-end;
  }
}
.form-wrapper {
  width:100%;
  display: flex;
  justify-content: flex-start;
  .half {
    width: 50%;
    .self_message {
      // padding-left: 20px;
      .agent_attributes {
        /deep/ .el-radio__input {
          display: none !important;
        }
        /deep/ .el-form-item__label {
          width: 72px !important;
        }
        /deep/ .el-form-item__content {
          // float: right;
          // margin-top: -30px;
          .el-radio {
            padding: 9px 10px 1px 5px;
          }
        }
      }
      .department {
        position: relative;
        .right {
          position: absolute;
          right: -65px;
        }
      }
    }
    .text {
      font-weight: 800;
      font-size: 14px !important;
      margin-left: -25px;
      margin-bottom: 20px;
    }
  }
  .left {
    margin-right: 10px;
    .time {
      /deep/ .el-form-item__label {
        width: 80px !important;
        margin-left: -10px !important;
      }
      .contract_limit {
        overflow: hidden;
        margin-top: 35px;
      }
    }
    .ridao {
      /deep/ .el-radio__label {
        font-size: 12px !important;
      }
    }
    .w270 {
      /deep/ .el-form-item__content {
        width: 270px !important;
        font-weight: normal;
      }
    }
  }
  .speart {
    margin-top: 32px;
  }
  .special_label {
    /deep/ .el-form-item__label {
      width: 90px !important;
    }
  }
  .special_time {
    /deep/ .el-form-item__content {
      margin-left: 80px !important;
      margin-top: 35px;
      width: 380px;
    }
  }
  .contract {
    /deep/ .el-form-item__content {
      margin-left: 20px !important;
      width: 380px;
    }
  }
  .add_staff {
    width: 80%;
    margin: 0 auto;
    position: relative;
    .add_staff_message {
      .fl {
        float: left;
      }
      .select_left {
        margin-right: 10px;
      }
    }
  }
  .contrac_text {
    color: #ec4e2e;
    margin: 0 0 18px 90px;
    width: 280px;
  }
}
.dialog-footer {
  display: block;
  text-align: center;
}
.mt20 {
  margin-top: 20px;
}

.departant_manage_self_add {
  margin: 10px 0 30px;
  border: 1px solid #ebeef4;
  line-height: 27px;
  text-align: center;
  cursor: pointer;
}
.add_agent_show {
  /deep/ .el-dialog {
    width: 828px !important;
  }
}
.cblu {
  color: #507fd2;
  cursor: pointer;
}
.bank_detail {
  /deep/ .el-dialog--center {
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 40px;
    }
  }
}
.add_agent_show {
  /deep/ .el-form-item--small.el-form-item {
    margin-bottom: 30px;
  }
}
/deep/ .el-dialog__body form {
  width: 95%;
}
.peript /deep/.el-input-group__append{padding:0 5px;}
</style>
