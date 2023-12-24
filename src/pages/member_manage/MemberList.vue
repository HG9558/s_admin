<template>
<!-- 会员管理： 会员列表 -->
  <div class="member-list" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search" :class="searchClass">
      <div class="search-basic">
        <div class="search-basic-item width180" v-if="searchList.name.ok">
          <label>{{searchList.name.label}}</label>
          <input type="text" v-model="q.loginNameList" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.nameTrue.ok">
          <label>{{searchList.nameTrue.label}}</label>
          <input type="text" v-model="q.realName" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.ph.ok">
          <label>{{searchList.ph.label}}</label>
          <input type="text" v-model="q.mobile" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.email.ok">
          <label>{{searchList.email.label}}</label>
          <input type="text" v-model="q.email" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.reAdd.ok">
          <label>{{searchList.reAdd.label}}</label>
          <input type="text" v-model="q.registerUrl" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.agyAccount.ok">
          <label>{{searchList.agyAccount.label}}</label>
          <input type="text" v-model="q.agyAccount" v-trim @keyup.enter="search()" />
        </div>
        <!--会员星级-->
        <div class="search-basic-item width180" v-if="searchList.memberLevel.ok">
          <div style="height: 20px">
            <label>{{searchList.memberLevel.label}}</label>
          </div>
          <el-select v-model="actLevelIdList" multiple clearable>
            <el-option :key="item.id" :value="item.id" :label="item.tierName" v-for="item in memberLevelList"></el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.reOri.ok">
          <label>{{searchList.reOri.label}}</label>
          <el-select size="small" v-model="q.registerSource" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in registerSourceOptions" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.local.ok">
          <label>{{searchList.local.label}}</label>
          <el-select size="small" v-model="q.loginSource" :placeholder="$t('请选择')" multiple>
            <el-option label="PC" value="0"></el-option>
            <el-option label="H5" value="3"></el-option>
          </el-select>
        </div>
        <!-- 去掉代理下拉选择框 改为文本框搜索代理名称 -->
        <!-- <div class="search-basic-item width180" v-if="searchList.allDe.ok">
          <label>{{searchList.allDe.label}}</label>
          <el-select size="small" v-model="q.tagencyId" :placeholder="$t('请选择')" @change="getAgyAccount" multiple>
            <el-option
              v-for="item in topAgyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.chDe.ok">
          <label>{{searchList.chDe .label}}</label>
          <el-select size="small" v-model="q.cagencyId" :placeholder="$t('请选择')" multiple>
            <el-option
              v-for="item in agyAccountOptions"
              :key="item.id"
              :label="item.agyAccount"
              :value="item.id">
            </el-option>
          </el-select>
        </div> -->
        <div class="search-basic-item width180" v-if="searchList.memLi.ok">
          <label>{{searchList.memLi.label}}</label>
          <el-select size="small" v-model="q.groupId" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in listgroup" :key="item.id" :label="item.groupName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.status.ok">
          <label>{{searchList.status.label}}</label>
          <el-select size="small" v-model="q.available" :placeholder="$t('请选择')" multiple>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.onliMem.ok">
          <label>{{searchList.onliMem.label}}</label>
          <el-select size="small" v-model="q.isOnline" :placeholder="$t('请选择')" multiple @change="watchOnline">
            <el-option v-for="item in onlineOptions" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="search-basic-item width180" v-if="searchList.qq.ok">
          <label>{{searchList.qq.label}}</label>
          <input type="text" v-model="q.qq" v-trim @keyup.enter="search()" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.loginIp.ok">
          <label>{{searchList.loginIp.label}}</label>
          <input type="text" v-model="q.loginIp" v-trim @keyup="$event.keyCode === 13 && search();q.loginIp && (q.loginIp = q.loginIp.replace(/[^0-9a-zA-Z.:]/g,''))" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.registerIp.ok">
          <label>{{searchList.registerIp.label}}</label>
          <input type="text" v-model="q.registerIp" v-trim @keyup="$event.keyCode === 13 && search();q.registerIp && (q.registerIp=q.registerIp.replace(/[^0-9a-zA-Z.:]/g,''))" />
        </div>
        <div class="search-basic-item width180" v-if="searchList.supLoginName.ok">
          <label>{{searchList.supLoginName.label}}</label>
          <input type="text" v-model="q.supLoginName" v-trim @keyup.enter="search()" />
        </div>
        <!-- 昵称搜索 -->
        <!-- <div class="search-basic-item width180" v-if="searchList.nickName.ok">
          <label>{{searchList.nickName.label}}</label>
          <input type="text" v-model="q.nickName" v-trim @keyup.enter="search()" />
        </div> -->
        <!--最后注册时间-->
        <div class="search-basic-item" v-if="searchList.orT.ok">
          <div style="height: 20px">
            <label>{{searchList.orT.label}}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="110" :width="470" :startTime.sync="registerTime" :endTime.sync="registerTimeEnd" />
        </div>
        <!--首存时间-->
        <div class="search-basic-item" v-if="searchList.firstT.ok">
          <div style="height: 20px">
            <label>{{searchList.firstT.label}}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="110" :width="470" :startTime.sync="depositTimeStart" :endTime.sync="depositTimeEnd" />
        </div>
        <!--最后登录时间-->
        <div class="search-basic-item" v-if="searchList.lastT.ok">
          <div style="height: 20px">
            <label>{{searchList.lastT.label}}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="100" :width="470"  :startTime.sync="loginTime" :endTime.sync="loginTimeEnd" />
        </div>

        <!--最后投注时间-->
        <div class="search-basic-item">
          <div style="height: 20px">
            <label>{{searchList.betDate.label}}</label>
          </div>
          <StartAndEndTimeSelector ref="searchTime" :left="100" :width="470"  :startTime.sync="betDateStart" :endTime.sync="betDateEnd" />
        </div>

        <!--余额范围-->
        <div class="search-basic-item width400" v-if="searchList.accountBalance.ok">
          <div style="height: 20px">
            <label>{{searchList.accountBalance.label}}</label>
          </div>

          <el-input v-model="q.minBalance" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
          -
          <el-input v-model="q.maxBalance" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
        </div>

        <!--推荐好友数范围-->
        <div class="search-basic-item width400" v-if="searchList.accountPromotionNum.ok">
          <div style="height: 20px">
            <label>{{searchList.accountPromotionNum.label}}</label>
          </div>

          <el-input v-model="q.minPromotionNum" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
          -
          <el-input v-model="q.maxPromotionNum" v-trim type="text" style="width: 48%;" @keyup.enter.native="search()"></el-input>
        </div>

        <!--代理会员级别-->
        <!-- <div class="search-basic-item width180" v-if="searchList.parentLoginName.ok">
          <div style="height: 20px">
            <label>{{searchList.parentLoginName.label}}</label>
          </div>
          <el-select v-model="agentLevelId" multiple clearable>
            <el-option :key="item.id" :value="item.id" :label="item.tierName" v-for="item in agentLevelList"></el-option>
          </el-select>
        </div> -->
        <!-- 银行卡 -->
        <div class="search-basic-item width180">
          <label>{{ $t('银行卡')  }}</label>
          <input type="text" v-model="q.cardNo" v-trim @keyup.enter="search()" />
        </div>
        <!-- 端口 -->
        <div class="search-basic-item width180">
          <div style="height: 20px">
            <label>{{ $t('端口')  }}</label>
          </div>
          <el-select v-model="q.loginType" clearable>
            <el-option :key="item.value" :value="item.value" :label="item.label" v-for="item in loginTypeList"></el-option>
          </el-select>
        </div>
        <!-- 会员标签 -->
        <div class="search-basic-item width180">
          <div style="height: 20px">
            <label>{{ $t('会员标签')  }}</label>
          </div>
          <el-select v-model="q.labelid" clearable>
            <el-option :key="item.value" :value="item.value" :label="item.label" v-for="item in tagflagList"></el-option>
          </el-select>
        </div>
        <!-- 推荐人筛选 -->
        <div class="search-basic-item width180">
          <label>{{ $t('推荐人筛选') }}</label>
          <el-select
            v-model="q.isParentLoginName"
            :placeholder="$t('请选择')"
            size="small"
          >
            <!--<el-option label="全选" value=""></el-option>-->
            <el-option :label="$t('全部')" value=" "></el-option>
            <el-option :label="$t('是')" value="1"></el-option>
            <el-option :label="$t('否')" value="0"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-row style="background-color: #f6f7f8;padding: 5px 20px 15px;" class="border-new-lrb">
      <el-col :span="12" class="tect-le color-blue" style="cursor:pointer">
        <span @click="more">{{extendTitle}}{{ $t('查询')  }}<i :class="[this.showExtend ? 'el-icon-arrow-up': 'el-icon-arrow-down']" class="icon-more el-select__caret el-input__icon "></i></span>
      </el-col>
      <el-col :span="12" class="tect-ri">
        <el-button type="primary" @click.native="search()" size="small" class="wid-80">{{ $t('查询')  }}</el-button>
        <el-button @click.native="reload()" size="small" type="danger" class="wid-80">{{ $t('重置')  }}</el-button>
      </el-col>
    </el-row>

    <el-row class="row-bg" type="flex" justify="end">
      <div class="onlineNum">{{ $t('实时在线人数')  }}：<span>{{onlineNum}}</span></div>
      <el-col :span="10" v-show="showGroupedit">
        <el-select v-model="mbrAccount.groupId" class="mar-ri-10" :placeholder="$t('会员组')" size="mini" @change="fngroupIdUpdate(mbrAccount.groupId)" style="width:100px">
          <el-option v-for="item in listgroup" :key="item.value" :label='item.groupName' :value='item.id'></el-option>
        </el-select>
        <el-select v-model="mbrAccount.available" class="mar-ri-10" @change="fngroupavaiUpdate(mbrAccount.available)" size="mini" style="width:100px">
          <el-option value="1" key="1" :label="$t('启用')"></el-option>
          <el-option value="0" key="0" :label="$t('禁用')"></el-option>
          <el-option value="2" key="2" :label="$t('余额冻结')"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="showbilldetail(0)">{{  $t('人工增加')  }}</el-button>
        <el-button type="primary" size="mini" class="mar-ri-10" @click="showMessage">{{  $t('群发站内信')  }}</el-button>
      </el-col>
      <el-col :span="13 " style="text-align: right" class="btnw">
        <el-button v-if="permissions.messSend" size="mini" style="margin-left: 10px" @click="messageForAll" type="primary" icon="el-icon-plus">
          {{  $t('短信群发')  }}
        </el-button>
        <el-button v-if="permissions.add" icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="add">{{  $t('新增')  }}
        </el-button>
        <el-button v-if="permissions.batchUpdateActLevel" icon="el-icon-setting" type="primary" size="mini" @click="handleBatchUpdateMemberLevelClick">{{  $t('批量调级')  }}
        </el-button>
        <el-button v-if="permissions.changeGroup" icon="el-icon-setting" type="primary" size="mini" @click="handleMoveBtn">{{  $t('批量转移')  }}
        </el-button>
        <el-button v-if="permissions.export && isNowDowning" type="primary" :disabled="!tableData.totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{  $t('导出')  }}
        </el-button>
        <el-button v-else-if="permissions.export && !isNowDowning" type="primary" class="iconfont icon-export el-button-export" size="mini">{{  $t('导出中')  }}...
        </el-button>
      </el-col>
    </el-row>
    <el-table max-height="480" ref="table" type="flex" :data="tableData.list" v-loading='loading' @selection-change="handleSelectionChange" @sort-change="sortevt" border fit highlight-current-row :default-sort="{prop: 'registerTime', order: 'descending'}">
      <el-table-column
        label-class-name="heightThe" type="selection" width="45px"></el-table-column>
      <!-- <el-table-column>

      </el-table-column> -->
      <el-table-column align="center" label-class-name="heightThe" type="index" :label="$t('序号')" :index="indexMethod" width="45px"></el-table-column>
      <el-table-column label-class-name="heightThe" :prop="i.prop" :label="i.label" :width="i.width" v-for="(i,index) in tableList" :sortable="q.loginNameList ? false : i.sortable" :key="index" :align="i.align || 'center'" :sort-orders="['ascending', 'descending']">
        <template slot-scope="scope">
          <div v-if="i.name == 'available'">
            {{availableTransform(scope.row.available)}}
          </div>
          <div v-else-if="i.name == 'loginName'" style="text-align: center;">
            <router-link :to="{ path: '/main/memberManage/memberDetail',query: { id: scope.row.id, loginName: scope.row.loginName, agyAccount: scope.row.agyAccount } }">
              <span style="margin-right: 5px" class="iconfont icon-dot" :class="[scope.row.isOnline ? 'online': 'notOnline']">
              </span>{{scope.row.loginName}}
              <GlobalComponentTestLabel :id="scope.row.tagencyId" />
            </router-link>
          </div>
          <div v-else-if="i.name == 'cagencyId'">
            <el-popover placement="top" width="100" trigger="hover" :content="scope.row.category">
              <span slot="reference">{{ scope.row.agyAccount }}</span>
            </el-popover>
          </div>
          <div v-else-if="i.name == 'totalBalance'">
            <el-popover placement="right" width="400" trigger="click">
              <div v-if="balances.length ==0" style="text-align: center">
                <i class="el-icon-loading"></i>
              </div>
              <el-table max-height="480" type="flex" :data="balances" v-else>
                <el-table-column align="center" label-class-name="heightThe" prop="depotName" sortable :label="$t('游戏平台')"></el-table-column>
                <el-table-column align="right" label-class-name="heightThe" prop="balance" :label="$t('平台余额')"></el-table-column>
              </el-table>

              <span class="blue-color pointer" @click="fntotalBalace(scope)" slot="reference">
                {{scope.row.totalBalance}}
              </span>
            </el-popover>
          </div>
          <div v-else-if="i.prop == 'tierName'">
            <i class="material-icons" style="font-size: 16px;vertical-align: text-bottom" v-if="scope.row.isActivityLock">lock</i>
            {{scope.row.tierName}}
          </div>
          <div v-else-if="i.name == 'registerTime'">
            <span :formatter="timeFilterNew(scope.row.registerTime)"> {{timeFilterNew(scope.row.registerTime)}} </span>
          </div>
          <!-- <div v-else-if="i.name == 'depositTime' ">
            <span :formatter="timeFilterNew(scope.row.depositTime)">{{timeFilterNew(scope.row.depositTime) }}</span>
          </div> -->
          <div v-else-if="i.name == 'loginTime'">
            <span :formatter="timeFilterNew(scope.row.loginTime)">{{timeFilterNew(scope.row.loginTime)}} </span>
          </div>
          <div v-else-if="i.name == 'offLineTime'">
            <span>{{scope.row.offLineTime}}</span>
          </div>
          <div v-else-if="i.name == 'agyFlag'">
            <span>{{scope.row.agyflag === 1 ? $t('代理会员') : $t('普通会员')}} </span>
          </div>
          <div v-else-if="i.name === 'loginType'">
            {{ loginTypeF(scope.row[i.prop]) }}
          </div>
          <div v-else>
            {{scope.row[i.prop]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('三公返利比例')" width="120" v-if="sanGongFlag">
        <template slot-scope="scope">
          <div class="center">{{scope.row.rebateRatio||0}}%</div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')" v-if="permissions.addBalance || permissions.reduceBalance || (permissions.call && user.telExtNo) || permissions.callRecord" width="280px">
        <template slot-scope="scope">
          <span class="blue-color pointer" @click="changeRecoveryAmount(scope.row.id, scope.row.loginName)" v-if="hasPermission('member:mbraccount:recoverBalance')">
            [{{  $t('一键回收')  }}]
          </span>
          <span class="blue-color pointer" @click="manualAdjust({bal: scope.row.totalBalance, viewId: null, titletype: 0, selectids: [scope.row.id], selectNames: [scope.row.loginName]})" v-if="permissions.addBalance">
            [{{  $t('增加余额')  }}]
          </span>
          <span class="blue-color pointer" @click="manualAdjust({bal: scope.row.totalBalance, viewId: scope.row.id + '', titletype: 1, selectids: [scope.row.id], selectNames: [scope.row.loginName]})" v-if="permissions.reduceBalance">
            [{{  $t('减少余额')  }}]
          </span>
          <span class="blue-color pointer" v-if="hasPermission('member:mbraccount:call')&&user.telExtNo" @click="call(scope.row.id)">
            [{{  $t('呼叫')  }}]
          </span>
          <span class="blue-color pointer" @click="getCallRecode(scope.row.id)" v-if="hasPermission('member:mbraccount:callrecord')">
            [{{  $t('呼叫记录')  }}]
          </span>
          <span class="blue-color pointer" @click="setSanGong(scope.row.id,scope.row.rebateRatio)" v-if="sanGongFlag">
            [{{  $t('返利设置')  }}]
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block pagination">
      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount">
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog :title="$t('新增会员')" :visible.sync="dialogAddMember" @close="mbrAddCancel('mbrAddAccount')">
      <el-form class="small-space form-content" label-position="right" :model="mbrAccount" :rules="memberInfoRule" style="margin-left: 20px" ref="mbrAddAccount" label-width="auto">
        <el-form-item :label="$t('会员名')" prop="loginName" :rules="memberInfoRule.accountName" size="small">
          <el-input v-model="mbrAccount.loginName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="loginPwd" :rules="memberInfoRule.password" size="small">
          <el-input v-model="mbrAccount.loginPwd" :type="passtype"></el-input>
          <span @click="toglepasstype" class="iconfont" :class="passtype==='password'?'icon-passhide':'icon-passshow'"></span>
        </el-form-item>
        <el-form-item :label="$t('会员组')" prop="groupId" :rules="commonRule.changeNotNull" size="small">
          <el-select v-model="mbrAccount.groupId">
            <el-option v-for="item in listgroup" :key="item.value" :label='item.groupName' :value='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('上级代理')" prop="cagencyId" :rules="commonRule.changeNotNull" size="small">
          <el-select v-model="mbrAccount.cagencyId">
            <el-option v-for="item in agyAccountOptions" :key="item.id" :label='item.agyAccount' :value='item.id'>
              {{item.agyAccount}}
              <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('真实姓名')" prop="realName" :rules="memberInfoRule.nameNoNeed" size="small">
          <el-input v-model="mbrAccount.realName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('联系电话')" prop="mobile" :rules="specialRule.mobileNoNeed" size="small" class="member_mobile_form">
          <el-select v-model="mbrAccount.mobileAreaCode" filterable :placeholder="$t('请选择')" class="member_mobile_area_code">
            <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'+' + item.mobileAreaCode + '      ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
          </el-select>
          <el-input v-model="mbrAccount.mobile" :maxlength="11" class="member_mobile" @keyup.native="mbrAccount.mobile=mbrAccount.mobile.replace(/[^0-9]/g,'')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="memo" :rules="commonRule.notNull" size="small">
          <el-input v-model="mbrAccount.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mbrAddCancel('mbrAddAccount')" size="small">{{  $t('取消')  }}</el-button>
        <el-button type="primary" @click="saveMbrAccount" size="small">{{  $t('确定')  }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="totalBalaceView">
      <el-table max-height="480" type="flex" :data="balances">
        <el-table-column prop="depotName" sortable :label="$t('游戏平台')"></el-table-column>
        <el-table-column prop="balance" :label="$t('平台余额')"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="isMoveDialogShow" :label="$t('转移会员组')" @closed="moveGroupCancel">
      <el-form :model="moveGroupForm" :rules="moveGroupRules" ref="moveGroup">
        <el-form-item prop="groupId" :label="$t('转至会员组')">
          <el-select v-model="moveGroupForm.groupId">
            <el-option v-for="item in listgroup" :key="item.value" :label='item.groupName' :value='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="memo" :label="$t('备注')">
          <el-input type="textarea" rows="5" v-model="moveGroupForm.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveGroupCancel" size="small">{{  $t('取消')  }}</el-button>
        <el-button type="primary" @click="saveMoveGroup" size="small">{{  $t('确定')  }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :label="$t('呼叫纪录')" :visible.sync="recodePage.dialogShow">
      <el-table :data="recodePage.dataList" border style="width: 100%">
        <el-table-column align="center" prop="sortNum" :label="$t('序号')" width="100"></el-table-column>
        <el-table-column align="center" prop="beginTime" :label="$t('拨出时间')" width="380"></el-table-column>
        <el-table-column align="center" prop="userName" :label="$t('呼叫人')"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-pagination v-show="recodePage.totalCountCall>recodePage.pageSize" :page-sizes="recodePage.pageSizeArr" :page-size='5' :current-page.sync="recodePage.currPage" layout=" sizes, prev, pager, next, jumper" @current-change="handerRecodeCurrentChange" @size-change="handerRecodeSizeChange" :total="recodePage.totalCountCall">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :label="$t('三公返利设置')" :visible.sync="sanGongDialogShow" class="sanGong">
      <el-form :model="sanGongForm" :rules="sanGongRule" ref="sanGongSet">
        <el-form-item :label="$t('三公返利比例')" prop="rebateRatio">
          <el-input :placeholder="curValue" v-model="sanGongForm.rebateRatio"></el-input>&nbsp;&nbsp;%
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveSanGong" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateSanGong" size="small">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :label="$t('群发短信提醒')" center :visible.sync="messageAllShow" class="messageVoice">
      <div class="up">
        <span class="fz15">
          {{ $t('选中会员') }} ：{{selsectMember}}
        </span>
        <span class="fz15">
          {{ $t('无手机号') }} ：{{noneMobil}}
        </span>
        <span class="fz15">
          {{ $t('实发数量') }} ：{{sendNum}}
        </span>
      </div>
      <div class="down">
        <p class="fz15 md15">{{ $t('发送内容') }}：</p>
        <el-input type="textarea" :rows="6" v-model="textContent" maxlength="200"></el-input>&nbsp;
        <span class="word-number">{{textContent ? 200 - textContent.length : 200}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageAllShow=false" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateAllMessage" size="small">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>

    <adjust-type :isManualOperation="true" v-if="isAdjustTypeShow" :showAdjust.sync="isAdjustTypeShow" :bal="adjustTypeParams.bal" :viewId="adjustTypeParams.viewId" :titletype="adjustTypeParams.titletype" :selectids="adjustTypeParams.selectids" :selectNames="adjustTypeParams.selectNames">
    </adjust-type>
    <BatchUpdateMemberLevel v-if="batchUpdateMemberLevelVisible" :formVisible.sync="batchUpdateMemberLevelVisible" :memberLevelList="memberLevelList" :selections="selections" @submit="handleBatchUpdateMemberLevel" />
    <adjust-type :showAdjust.sync="showbill" :titletype=0 :selectids="selectids" :selectNames="selectNames">
    </adjust-type>
    <!-- <SafePasswordInput v-on:safePasswordInputed="safePasswordInputedAfter"></SafePasswordInput> -->

  </div>
</template>

<script>

import vc from "../../public/lib";
import systemConfig from "../../config/config";
import adjustType from "./TypeAdjust.vue";
import { mapGetters } from "vuex";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import queryStore from "../../mixins/queryStore";
import BatchUpdateMemberLevel from "./member_level/BatchUpdate";
var getOnlineCountTimer1 = null
var getOnlineCountTimer2 = null
import Mixin from '@/mixins/loadTime'

export default {
  name: "memberList",
  mixins: [
    queryStore([
      "q",
      "registerTime",
      "registerTimeEnd",
      "loginTime",
      "loginTimeEnd",
    ]),
    Mixin
  ],
  components: {
    adjustType,
    BatchUpdateMemberLevel,
    StartAndEndTimeSelector,
    // SafePasswordInput
  },
  data() {
    var validateMobial = (rule, value, callback) => {
      if (!value && value !== 0) {
        callback();
      } else {
        const chRex = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        const taiRex = /09\d{8}/;
        const commonRex =  /\d{1,60}/;
        let chBool = true;
        let taiBool = true;
        let commonBool = true;
        const { mobileAreaCode} = this.mbrAccount
        if (mobileAreaCode === "86") {
          chBool = chRex.test(value);
        } else if (mobileAreaCode === "886") {
          taiBool = taiRex.test(value);
        } else {
          commonBool = commonRex.test(value)
        }
        const currentLengthLimit = this.mobileAreaCodeList.find(v => v.mobileAreaCode === mobileAreaCode)
        const { maxlen, minlen } = currentLengthLimit
        if (!chBool || !taiBool || !commonBool) {
          callback(new Error(this.$t("请输入正确的电话号码")));
        } else if (value.length < minlen || value.length > maxlen) {
          const numLimit = Number(minlen) === Number(maxlen) ? minlen : minlen + '~'  + maxlen
          callback(new Error(this.$t('当前电话号长度不在有效范围内') + '(' + numLimit + this.$t('位') + ')'));
        }
        else {
          callback();
        }
      }
    };

    return {
      safePassword: "",
      tmpValue4SafeCheck: {},
      messageAllShow: false,
      moveGroupRules: {
        groupId: { required: true, message: this.$t("请选择一项") },
        memo: { required: true, message: this.$t("请输入内容"), trigger: "blur" },
      },
      moveGroupForm: {
        groupId: null,
        memo: null,
      },
      isMoveDialogShow: false,
      selections: [],
      extendTitle: this.$t("更多"),
      searchClass: "searchNew",
      searchList: {
        name: {
          label: this.$t("会员名"),
          ok: false,
        },
        nameTrue: {
          label: this.$t("真实姓名"),
          ok: false,
        },
        ph: {
          label: this.$t("手机号码"),
          ok: false,
        },
        email: {
          label: this.$t("邮箱"),
          ok: false,
        },
        reAdd: {
          label: this.$t("注册网址"),
          ok: false,
        },
        agyAccount: {
          label: this.$t("代理"),
          ok: false,
        },
        reOri: {
          label: this.$t("注册来源"),
          ok: false,
        },
        local: {
          label: this.$t("客户端"),
          ok: false,
        },
        allDe: {
          label: this.$t("总代"),
          ok: false,
        },
        chDe: {
          label: this.$t("代理"),
          ok: false,
        },
        memLi: {
          label: this.$t("会员组"),
          ok: false,
        },
        status: {
          label: this.$t("状态"),
          ok: false,
        },
        onliMem: {
          label: this.$t("在线会员"),
          ok: false,
        },
        qq: {
          label: "QQ",
          ok: false,
        },
        loginIp: {
          label: this.$t("登录") + "IP",
          ok: false,
        },
        registerIp: {
          label: this.$t("注册") + "IP",
          ok: false,
        },
        supLoginName: {
          label: this.$t("推荐人"),
          ok: false,
        },
        orT: {
          label: this.$t("注册时间"),
          ok: false,
        },
        firstT: {
          label: this.$t('首存时间'),
          ok: false
        },
        lastT: {
          label: this.$t("最后登录时间"),
          ok: false,
        },
        betDate: {
          label: this.$t("最后投注时间"),
          ok: false,
        },
        memberLevel: {
          label: this.$t("会员星级"),
          ok: false,
        },
        accountPromotionNum: {
          label: this.$t("推荐好友数范围"),
          ok: false,
        },
        accountBalance: {
          label: this.$t("余额范围"),
          ok: false,
        },
        // nickName: {
        //   label: this.$t("昵称"),
        //   ok: false,
        // },
        // parentLoginName: {
        //   label: this.$t("代理会员级别"),
        //   ok: false,
        // },
        labelid: {
          label: this.$t("会员标签"),
          ok: false,
        },
      },
      tableList: {
        loginName: {
          label: this.$t("会员名"),
          ok: false,
          name: "loginName",
          prop: "loginName",
          width: 140,
        },
        realName: {
          label: this.$t("真实姓名"),
          ok: false,
          name: "realName",
          prop: "realName",
        },
        agyAccount: {
          label: this.$t("代理"),
          ok: false,
          name: "cagencyId",
          prop: "agyAccount",
        },
        groupName: {
          label: this.$t("会员组"),
          ok: false,
          name: "groupId",
          prop: "groupName",
        },
        totalBalance: {
          sortable: "custom",
          label: this.$t("钱包余额"),
          ok: false,
          name: "totalBalance",
          prop: "totalBalance",
          align: 'right'
        },
        agyFlag: {
          label: this.$t("会员身份"),
          ok: false,
          name: "agyFlag",
          prop: "agyflag",
        },
        labelid: {
          label: this.$t("会员标签"),
          ok: false,
          name: "labelid",
          prop: "labelid",
        },
        parentLoginName: {
          label: this.$t("推荐人"),
          ok: false,
          name: "parentLoginName",
          prop: "parentLoginName",
        },
        promotionNum: {
          sortable: "custom",
          label: this.$t("推荐好友数"),
          ok: false,
          name: "promotionNum",
          prop: "promotionNum",
        },
        registerTime: {
          sortable: "custom",
          label: this.$t("注册时间"),
          ok: false,
          name: "registerTime",
          prop: "registerTime",
          width: 190,
        },
        depositTime: {
          sortable: "custom",
          label: this.$t("首存时间"),
          ok: false,
          name: "depositTime",
          prop: "depositTime",
          width: 190,
        },
        tierName: {
          label: this.$t("会员星级"),
          ok: false,
          name: "actLevelId",
          prop: "tierName",
          width: 100,
        },
        loginTime: {
          sortable: "custom",
          label: this.$t("最后登录时间"),
          ok: false,
          name: "loginTime",
          prop: "loginTime",
          width: 190,
        },
        betPoint: {
          sortable: "custom",
          label: this.$t("投注比"),
          ok: true,
          name: "betPoint",
          prop: "betPoint",
          width: 190,
        },
        offLineTime: {
          sortable: "custom",
          label: this.$t("最后在线时间"),
          ok: true,
          name: "offLineTime",
          prop: "offLineTime",
          width: 190,
        },
        loginArea: {
          sortable: "custom",
          label: this.$t("最后登录地区"),
          ok: false,
          name: "loginArea",
          prop: "loginArea",
          width: 160,
        },
        loginType: {
          label: this.$t("最后登录端口"),
          ok: true,
          name: "loginType",
          prop: "loginType",
        },
        betDate: {
          label: this.$t("最后投注日"),
          ok: true,
          name: "betDate",
          prop: "betDate",
        },
        available: {
          label: this.$t("状态"),
          ok: false,
          name: "available",
          prop: "available",
        },
      },
      isAdjustTypeShow: false,
      adjustTypeParams: {
        bal: null,
        viewId: null,
        titletype: null,
        selectids: null,
        selectNames: null,
      },
      vc,
      tempUrl: "",
      postData: [],
      dialogAddMember: false,
      totalBalaceView: false,
      q: {
        loginNameList: "",
        orderBy: "registerTime desc",
        registerSource: [],
        tagencyId: [],
        cagencyId: [],
        groupId: [],
        available: [],
        isOnline: [],
        loginSource: [],
        agyAccount: "",
        supLoginName: "",
        minBalance: "",
        maxBalance: "",
        minPromotionNum: "",
        maxPromotionNum: "",
        loginType: ""
      },
      registerSourceOptions: [
        { id: 0, label: "PC" },
        { id: 3, label: "wap" },
        { id: 4, label: "app" },
        { id: 1, label: this.$t("管理后台") },
        { id: 5, label: this.$t("代理后台") },
        { id: 6, label: this.$t("帮好友注册") },
      ],
      tableData: {
        list: null,
      },
      listgroup: [],
      listTagent: [],
      listCagent: [],
      mbrAccount: {
        groupId: "",
        cagencyId: "",
        memo: null,
        mobileAreaCode: "86",
        rebateRatio: "0.00",
      },
      showGroupedit: false,
      showbill: false,
      selectids: [],
      selectNames: [],
      mbrBillDetail: {},
      auditCauseList: [],
      balances: [],
      passtype: "password",
      showmore: false,
      filtelistgroup: [],
      isym: true,
      memberInfoRule: systemConfig.rules.memberInfoRule,
      commonRule: systemConfig.rules.commonRule,
      specialRule: {
        mobileNoNeed: [{ validator: validateMobial, trigger: "blur" }],
      },
      sendMessageShow: false,
      inputTextarea: "",
      inputTitle: "",
      agyAccountOptions: [],
      topAgyAccountOptions: [],
      showExtend: false,
      statusOptions: [
        {
          value: 2,
          label: this.$t("余额冻结"),
        },
        {
          value: 1,
          label: this.$t("开启"),
        },
        {
          value: 0,
          label: this.$t("禁用"),
        },
      ],
      onlineOptions: [
        { id: 1, label: this.$t("在线") },
        { id: 0, label: this.$t("离线") },
      ],
      loginTime: `${systemConfig.getCurrentWeek()[0]} 00:00:00`,
      loginTimeEnd: `${systemConfig.getCurrentWeek()[1]} 23:59:59`,
      depositTimeStart: '',
      depositTimeEnd: '',
      betDateStart: '',
      betDateEnd: '',
      registerTime: '',
      registerTimeEnd: '',
      recodePage: {
        accountId: "",
        dialogShow: false,
        pageShow: true,
        pageSizeArr: [5, 10, 15, 20],
        pageNo: 1,
        pageSize: 5,
        totalCountCall: 0,
        dataList: [
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
          {
            sortNum: "1",
            time: "2018-5-24",
            callName: "hank",
          },
        ],
      },
      pageRecodeSize: 10, //
      isNowDowning: true, //文件导出
      actLevelIdList: [],
      agentLevelId: [],
      isActivityLock: "",
      memberLevelList: [],
      agentLevelList: [],
      loginTypeList: [
        { label: 'PC', value: '0' },
        { label: 'WAP', value: '1' },
        { label: this.$t('移动端') + '-IOS', value: '2' },
        { label: this.$t('移动端') + '-Android', value: '3' },
      ],
      tagflagList: [],
      batchUpdateMemberLevelVisible: false,
      sanGongDialogShow: false,
      sanGongForm: {
        id: "",
        rebateRatio: "",
      },
      curValue: "",
      sanGongRule: {
        rebateRatio: systemConfig.rules.rebateRatioReg,
      },
      selsectMember: null,
      noneMobil: null,
      sendNum: null,
      textContent: "",
      messIds: [],
      saveAccoutIds: [],
      gatherArray: [
        {
          pageNo: 1,
          selectIds: [],
        },
      ],
      onlineNum: 0,
      setGetOnlineCountTimer2: false,
      mobileAreaCodeList: [],
    };
  },
  computed: {
    inputName() {
      return this.selectNames.join();
    },
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
    user() {
      return this.$store.state.user;
    },
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("member:mbraccount:save"),
        changeGroup: hasPermission("member:mbraccount:changeMbrGroup"),
        export: hasPermission("member:mbraccount:export"),
        addBalance: hasPermission("fund:audit:mbradd"),
        reduceBalance: hasPermission("fund:audit:mbrreduce"),
        memberLevel: hasPermission("member:activitylevel:info"),
        call: hasPermission("member:mbraccount:call"),
        callRecord: hasPermission("member:mbraccount:callrecord"),
        batchUpdateActLevel: hasPermission(
          "member:mbraccount:batchUpdateActLevel"
        ),
        messSend: hasPermission("member:mbraccount:massTexting"),
        amount: hasPermission("member:mbraccount:recoverBalance"),
      };
    },
    sanGongFlag() {
      return this.$store.getters.getSanGongFlag("sanGongFlg");
    },
  },
  created() {
    const { agyAccount, actLevelId, isActivityLock, agentLevelId, groupId } = this.$route.query;

    this.fnGroup();
    this.getChildAgent();
    this.listReq.pageNo = 1;
    this.getAgyAccount([]);
    groupId && (this.q.groupId = [+groupId])
    this.q.agyAccount = agyAccount || "";
    this.actLevelIdList = actLevelId ? [Number(actLevelId)] : [];
    this.isActivityLock = Number(isActivityLock) || "";
    this.agentLevelId = agentLevelId ? [ agentLevelId * 1] : []
    if (groupId || agentLevelId || actLevelId) {
      this.loginTime = ''
      this.loginTimeEnd = ''
    }
    // this.getList();     //默认进入页面不查询，点击查询按钮才查询
    /*新版权限*/
    this.initAuth();
    this.getMemberLevelList();
    this.getAgentLevelList();
    // setTimeout(() => {
    //   this.search()
    // }, 150)
    this.getTagflagList()
    this.getOnlineNum()
    getOnlineCountTimer1 = setInterval(()=>{
      this.getOnlineNum()
    },10000),
    this.getList()
    this.getMobileAreaCode()
    // this.resetNewMemberCount()
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

    showbill() {
      if (!this.showbill) {
        this.getList();
      }
    },
    pageNo(n, o) {
      let bool = false,
        curIndex = 0;
      this.gatherArray.map((obj, index) => {
        if (obj.pageNo == n) {
          bool = true;
          curIndex = index;
        }
      });
      if (bool) {
      } else {
        this.gatherArray;
      }
      this.accountIds = [];
    },
  },
  methods: {
    getMobileAreaCode() {
      this.$axios.GET(systemConfig.urls.getMobileAreaCode).then(({ res }) => {
        if (res) {
          this.mobileAreaCodeList = res.mobileAreaCodes
        }
      })
    },
    loginTypeF(val) {
      return (this.loginTypeList.find(i => i.value == val) || {}).label
    },
    //去除换行和空格
    clearBr(key) {
      key = key.replace(/<\/?.+?>/g, "");
      key = key.replace(/[\r\n]/g, "");
      key = key.replace(/\s+/g, "");
      return key;
    },
    updateAllMessage() {
      let regContext = this.clearBr(this.textContent);
      if (!regContext) {
        this.textContent = this.clearBr(this.textContent);
        this.$message({
          type: "warning",
          message: this.$t("请输入需要发送的内容"),
        });
        return;
      }
      if (!this.sendNum) {
        this.$message({
          type: "warning",
          message: this.$t("无实发数量"),
        });
        return;
      }
      let data = Object.assign({ content: this.textContent }, this.postData);
      this.$store.state.searchLoading = true;
      this.messageAllShow = false;
      this.$axios
        .get(systemConfig.urls.massTexting + this.tempUrl, {
          params: data,
        })
        .then((resp) => {
          if (resp) {
            this.$message({
              type: "success",
              message: resp.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$store.state.searchLoading = false;
        });
    },
    moveAllMessage() {
      this.messageAllShow = false;
    },
    messageForAll() {
      this.$store.state.searchLoading = true;
      this.textContent = "";
      //this.sendNum=this.selsectMember=this.noneMobil=0;
      this.messageAllShow = true;
      this.setUrlAndPostData();
      let data = Object.assign({}, this.postData);
      this.$axios
        .get(systemConfig.urls.memberLevel.getNumSendMessage + this.tempUrl, {
          params: data,
        })
        .then((res) => {
          let data = res.data.msg || {};
          this.sendNum = data.accWithMobile || 0;
          this.selsectMember = data.totalAcc || 0;
          this.noneMobil = data.accWithoutMobile || 0;
        })
        .catch((err) => {
          this.$store.state.searchLoading = false;
        });
    },
    setSanGong(id, num) {
      this.sanGongDialogShow = true;
      this.curValue = num;
      this.sanGongForm.id = id;
    },
    moveSanGong() {
      this.sanGongDialogShow = false;
      this.sanGongForm = this.$options.data().sanGongForm;
    },
    updateSanGong() {
      this.$refs.sanGongSet.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.memberLevel.updateSanGong, {
              ...this.sanGongForm,
            })
            .then(() => {
              this.$message.success(this.$t("操作成功"));
              this.moveSanGong();
              this.getList();
            });
        }
      });
    },
    handleBatchUpdateMemberLevel(params) {
      this.$axios
        .post(systemConfig.urls.memberLevel.batchUpdateActLevel, params)
        .then(() => {
          this.batchUpdateMemberLevelVisible = false;
          this.$message.success(this.$t("操作成功"));
          this.getList();
        });
    },
    getMemberLevelList() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then((res) => {
        this.memberLevelList = res.data.data;
      });
    },
    getAgentLevelList() {
      this.$axios.get(systemConfig.urls.mbrAccountLevellist).then((res) => {
        const { data } = res.data
        data.unshift({ id: 'member', tierName: this.$t('普通会员') })
        this.agentLevelList = data;
      });
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      /* const instance = this.$loading({
          fullscreen: true,
          text: '文件生成中...'
        }) */
      this.$axios.get(systemConfig.urls.checkMbrExportFile).then((res) => {
        const obj = res.data.data || {};
        const fileName = obj.fileName,
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
          /* instance.close() */
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },

    handleExport() {
      // 安全密码弹窗
      if (!this.safePassword) {
        this.$store.commit("safePasswordShow", true);
        this.$store.commit("safePasswordCallbackPageBegin", this.$options.name);
        this.$set(this.tmpValue4SafeCheck, "callback", this.handleExport);
        this.$set(this.tmpValue4SafeCheck, "args", []);

        return;
      }
      this.isNowDowning = false;
      /* this.$store.state.fullscreenLoading = true */
      this.$axios
        .get(systemConfig.urls.exportMbrAccountInfo + this.tempUrl, {
          params: Object.assign({}, this.postData),
          headers: { securepwd: this.safePassword },
        })
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
          /* this.$store.state.fullscreenLoading = false */
        })
        .finally(() => {
          this.isNowDowning = true;
        });
    },
    handleBatchUpdateMemberLevelClick() {
      if (this.selections.length === 0) {
        this.$message(this.$t("请至少选择一项"));
        return;
      }
      this.batchUpdateMemberLevelVisible = true;
    },
    handleMoveBtn() {
      if (this.selections.length === 0) {
        this.$message(this.$t("请至少选择一项"));
        return;
      }
      this.isMoveDialogShow = true;
    },
    moveGroupCancel() {
      this.isMoveDialogShow = false;
      this.$refs.moveGroup.resetFields();
    },
    saveMoveGroup() {
      const accountIds = this.selections.map((item) => item.id);
      this.$refs.moveGroup.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.memberChangeGroup, {
              accountIds,
              ...this.moveGroupForm,
            })
            .then((res) => {
              if (res) {
                this.moveGroupCancel();
                this.getList();
              }
            });
        }
      });
    },
    handleSelectionChange(val) {
      this.selections = val;
      //this.accountIds.push()
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    initAuth() {
      this.FoeNewAuth(4, this.tableList);
      this.FoeNewAuth(5, this.searchList);
    },
    /*权限*/
    /*获取第一页*/
    FoeNewAuth(id, data) {
      /* 4表格  5搜索条件*/
      this.$axios
        .get(systemConfig.urls.memberListInitAuthGet + "?typeId=" + id)
        .then((res) => {
          if (id == 4) {
            this.pareDataObj(data, res.data.items);
          } else {
            this.pareData(data, res.data.items);
          }
        });
    },
    /*根据name比对，隐藏和显示对应字段*/
    pareData(localData, getData) {
      for (var k in localData) {
        for (var i = 0; i < getData.length; i++) {
          if (this.$t(localData[k].label) == this.$t(getData[i].name)) {
            this.$set(localData[k], "ok", true);
          }
        }
      }
    },
    /*表格组件根据数据源去展示隐藏*/
    pareDataObj(localData, getData) {
      // console.log(localData)
      // console.log(getData)
      /*第一个for循环不可以做删除逻辑的处理 这样实时改变了元数据，造成报错，先做数据状态编辑*/
      for (var k in localData) {
        // console.log('----------------')
        for (var i = 0; i < getData.length; i++) {
          // console.log(localData[k].label + '--' + getData[i].name)
          if (this.$t(localData[k].name) == this.$t(getData[i].columnName)) {
            // console.log(localData[k].label + '--' + getData[i].name)
            this.$set(localData[k], "ok", true);
          } else {
            // console.log('===')
            // console.log(localData[k].label + '--' + getData[i].name)
          }
        }
      }
      //
      /*进行删除*/
      for (var b in localData) {
        if (localData[b].ok != true) {
          this.$delete(localData, b);
        }
      }
    },
    timeFilter(row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    timeFilterNew(date) {
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    availableTransform(available) {
      switch (available) {
        case 2:
          return this.$t("余额冻结");
        case 1:
          return this.$t("启用");
        case 0:
          return this.$t("禁用");
      }
    },
    sortevt({ prop, order }) {
      const p = prop === 'totalBalance' ? 'balance' : prop
      this.q.orderBy = p ? p + " " + order.match(/asc|desc/) : "";
      this.getList();
    },
    mbrAddCancel(formName) {
      this.dialogAddMember = false;
      this.mbrAccount.mobileAreaCode = "86";
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toggleshmore() {
      this.showmore = !this.showmore;
    },
    toglepasstype() {
      if (this.passtype === "password") {
        this.passtype = "text";
      } else {
        this.passtype = "password";
      }
    },
    manualAdjust(adjustTypeParams) {
      this.adjustTypeParams = adjustTypeParams;
      this.$nextTick(() => {
        this.isAdjustTypeShow = true;
      });
    },
    selsecMsg(arr) {
      //勾选
      this.selsectMember = arr.length;
      if (arr.length) {
        arr.map((val) => {
          if (val.isVerifyMoblie) {
            this.messIds.push(val.id);
          } else if (!val.isVerifyMoblie) {
            this.noneMobil += 1;
          }
        });
      }
      this.sendNum = this.selsectMember - this.noneMobil;
    },
    fngroupIdUpdate(groupId) {
      this.$confirm(this.$t("确定要提交批量操作吗?"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(systemConfig.urls.groupIdUpdate, {
              ids: this.selectids,
              groupId: groupId,
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("批量更新会员组成功"),
              });
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: this.$t("取消批量更新会员组"),
          });
        });
    },
    fngroupavaiUpdate(available) {
      this.$confirm(this.$t("确定要提交批量操作会员状态吗?"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(systemConfig.urls.availableUpdate, {
              ids: this.selectids,
              available: available,
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("批量更新会员状态成功"),
              });
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: this.$t("取消批量操作会员状态"),
          });
        });
    },
    sendMessageCancel() {
      this.sendMessageShow = false;
    },
    getIdArr(selectids) {
      let idArr = [];
      for (let i = 0; i < selectids.length; i++) {
        idArr.push({ id: selectids[i] });
      }
      return idArr;
    },
    search() {
      if (this.registerTime && this.registerTimeEnd) {
        if (
          new Date(this.registerTime).getTime() >
          new Date(this.registerTimeEnd).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("注册起始时间不能大于结束时间"),
          });
          return;
        }
      }
      if (this.loginTime && this.loginTimeEnd) {
        if (
          new Date(this.loginTime).getTime() >
          new Date(this.loginTimeEnd).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("登录起始时间不能大于结束时间"),
          });
          return;
        }
      }
      if (this.depositTimeStart && this.depositTimeEnd) {
        if (
          new Date(this.depositTimeStart).getTime() >
          new Date(this.depositTimeEnd).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("首存起始时间不能大于结束时间"),
          });
          return;
        }
      }
      if (this.betDateStart && this.betDateEnd) {
        if (
          new Date(this.betDateStart).getTime() >
          new Date(this.betDateEnd).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("最后头逐日起始时间不能大于结束时间"),
          });
          return;
        }
      }
      if (!this.registerTime) {
        this.registerTime = "";
      }
      if (!this.registerTimeEnd) {
        this.registerTimeEnd = "";
      }
      if (!this.loginTime) {
        this.loginTime = "";
      }
      if (!this.loginTimeEnd) {
        this.loginTimeEnd = "";
      }
      if (!this.depositTimeStart) this.depositTimeStart = ''
      if (!this.depositTimeEnd) this.depositTimeEnd = ''
      if (!this.betDateStart) this.betDateStart = ''
      if (!this.betDateEnd) this.betDateEnd = ''
      this.listReq.pageNo = 1;
      this.getList();
      if(this.setGetOnlineCountTimer2&&!getOnlineCountTimer2){
        getOnlineCountTimer2 = setInterval(()=>{
          this.getList()
        },10000)
      }
    },
    messageReset() {
      this.inputTitle = "";
      this.inputTextarea = "";
    },
    sendMessage() {
      if (!this.inputTitle) {
        this.$message({
          type: "warning",
          message: this.$t("站内信标题不能为空"),
        });
        return;
      }
      if (!this.inputTextarea) {
        this.$message({
          type: "warning",
          message: this.$t("站内信内容不能为空"),
        });
        return;
      }
      let savaData = {
        title: this.inputTitle,
        context: this.inputTextarea,
        mbrList: this.getIdArr(this.selectids),
      };
      this.$store.state.fullscreenLoading = true;
      this.$axios.post(systemConfig.urls.saveMessage, savaData).then((resp) => {
        this.$message({
          message: this.$t("成功增加站内信"),
          type: "success",
        });
        this.sendMessageShow = false;
        this.messageReset();
      });
    },
    fntotalBalace(scope) {
      this.balances = [];
      this.$axios
        .get(systemConfig.urls.balances + scope.row.id)
        .then((res) => {
          this.balances = res.data.page;
          // this.totalBalaceView = true
        })
        .catch((err) => {
          if (err.data.code === 2001) {
            this.$message.error(err.data.msg);
          }
        });
    },
    showMessage() {
      this.sendMessageShow = true;
    },
    showbilldetail(type) {
      this.showbill = true;
    },
    filterLock(value, row) {
      return row.isLock === value;
    },
    filterAvailable(value, row) {
      return row.available === value;
    },
    filtelistgroups(value, row) {
      return row.groupName === value;
    },
    fnGroup() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.listgroup = resp.data.page;
        this.filtelistgroup = resp.data.page;
      });
    },
    getChildAgent() {
      this.$axios.get(systemConfig.urls.getAllChildAgent).then((resp) => {
        this.agyAccountOptions = resp.data.accounts;
        this.trueAgyAccountOptions = resp.data.accounts;
      });
    },
    getAgyAccount(id) {
      if (id.length > 0) {
        this.agyAccountOptions = [];
        this.q.cagencyId = [];
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
    handleSizeChange(val) {
      this.listReq.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.getList();
    },
    add() {
      this.dialogAddMember = true;
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
    saveMbrAccount() {
      this.$refs.mbrAddAccount.validate((valid) => {
        if (valid) {
          this.$axios
            .get(systemConfig.urls.memberCheck, {
              params: { loginName: this.mbrAccount.loginName },
            })
            .then((res) => {
              if (res.data.msg) {
                this.$message({
                  type: "warning",
                  message: this.$t("用户名已存在"),
                });
              } else {
                this.$store.state.fullscreenLoading = true;
                this.$axios
                  .post(systemConfig.urls.memberSave, this.mbrAccount)
                  .then((res) => {
                    this.dialogAddMember = false;
                    this.$message({
                      type: "success",
                      message: this.$t("新增会员成功"),
                    });
                    this.getList();
                    this.mbrAccount = {
                      groupId: "",
                      cagencyId: "",
                      memo: null,
                      mobileAreaCode: "86",
                      rebateRatio: "0.00",
                    };
                  });
              }
            });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("请填写正确的信息"),
          });
        }
      });
    },
    reload() {
      this.postData = [];
      this.q = {
        orderBy: "registerTime desc",
        registerSource: [],
        cagencyId: [],
        groupId: [],
        available: [],
        isOnline: [],
        tagencyId: [],
        loginSource: [],
        supLoginName: "",
        agyAccount: "",
        loginType: ""
      };
      this.agyAccountOptions = [];
      this.loginTime = "";
      this.loginTimeEnd = "";
      this.depositTimeStart = "";
      this.depositTimeEnd = "";
      this.betDateStart = "";
      this.betDateEnd = "";
      this.registerTime = "";
      this.registerTimeEnd = "";
      this.actLevelIdList = [];
      this.isActivityLock = "";
      this.getChildAgent();
    },
    setUrlAndPostData() {
      this.postData = [];
      if (this.$router.history.current.query.loginName && this.isym) {
        this.q.loginNameList = this.$router.history.current.query.loginName;
        this.isym = false;
      }
      if (this.$router.history.current.query.groupId && this.isym) {
        this.q.groupId = [parseInt(this.$router.history.current.query.groupId)];
        this.isym = false;
      }
      let url =
        "?pageSize=" + this.listReq.pageSize + "&pageNo=" + this.listReq.pageNo;
      if (this.registerTime && this.timeType === "md") {
        url +=
          "&registerTime=" +
          systemConfig.transferTimeByType(this.registerTime, "mdToBj");
      } else {
        url += "&registerTime=" + this.registerTime;
      }
      if (this.registerTimeEnd && this.timeType === "md") {
        url +=
          "&registerTimeEnd=" +
          systemConfig.transferTimeByType(this.registerTimeEnd, "mdToBj");
      } else {
        url += "&registerTimeEnd=" + this.registerTimeEnd;
      }
      if (this.loginTime && this.timeType === "md") {
        url +=
          "&loginTime=" +
          systemConfig.transferTimeByType(this.loginTime, "mdToBj");
      } else {
        url += "&loginTime=" + this.loginTime;
      }
      if (this.loginTimeEnd && this.timeType === "md") {
        url +=
          "&loginTimeEnd=" +
          systemConfig.transferTimeByType(this.loginTimeEnd, "mdToBj");
      } else {
        url += "&loginTimeEnd=" + this.loginTimeEnd;
      }
      if (this.depositTimeStart && this.timeType === "md") {
        url +=
          "&depositTimeStart=" +
          systemConfig.transferTimeByType(this.depositTimeStart, "mdToBj");
      } else {
        url += "&depositTimeStart=" + this.depositTimeStart;
      }
      if (this.betDateStart && this.timeType === "md") {
        url +=
          "&betDateStart=" +
          systemConfig.transferTimeByType(this.betDateStart, "mdToBj");
      } else {
        url += "&betDateStart=" + this.betDateStart;
      }
      if (this.depositTimeEnd && this.timeType === "md") {
        url +=
          "&depositTimeEnd=" +
          systemConfig.transferTimeByType(this.depositTimeEnd, "mdToBj");
      } else {
        url += "&depositTimeEnd=" + this.depositTimeEnd;
      }
      if (this.betDateEnd && this.timeType === "md") {
        url +=
          "&betDateEnd=" +
          systemConfig.transferTimeByType(this.betDateEnd, "mdToBj");
      } else {
        url += "&betDateEnd=" + this.betDateEnd;
      }
      if (this.permissions.memberLevel) {
        url += "&actLevelIdList=" + this.actLevelIdList.join(",");
        url += "&isActivityLock=" + this.isActivityLock;
      }
      if (this.agentLevelId.length > 0) {
        const agentLevelId = this.agentLevelId
        const hasMember = agentLevelId.find(i => i === 'member')
        const agyLevelIds = agentLevelId.filter(i => typeof i === 'number')
        let agyflags
        if (hasMember) {
          agyflags = `0`
        }
        if (agyLevelIds.length) {
          url += `&agyLevelIds=${agyLevelIds.join()}`
          agyflags = agyflags ? `${agyflags},1` : `1`
        }
        url += `&agyflags=${agyflags}`
      }
      this.tempUrl = url;
      Object.keys(this.q).forEach((key) => {
        if (this.q[key].length > 0||key==='labelid') {
          if (Array.isArray(this.q[key])) {
            this.postData[key + "List"] = this.q[key].join(",");
          } else {
            if (key === "loginNameList") {
              this.postData[key] = this.q[key].replace(/，/g, ",");
            } else {
              this.postData[key] = this.q[key];
            }
          }
        } else {
          this.postData[key] = "";
          this.postData[key + "List"] = "";
        }
      });
    },
    getList() {
      if(this.$store.state.searchLoading)return false;
      this.$store.state.searchLoading = true;
      this.setUrlAndPostData();
      let data = Object.assign({}, this.postData);
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.mbrAccountTablelist + this.tempUrl, {
          params: data,
        })
        .then((res) => {
          this.getNetworkLoadAndDataSolveTime(res)
          res.data.page.list.map(ws=>{
            this.tagflagList.map(w=>{
              if(w.value===ws.labelid){
                ws.labelid = w.label
              }
            })
            ws.totalBalance = (ws.totalBalance || 0).toLocaleString()
          })
          this.tableData = res.data.page;
          if (this.q.loginNameList) {
            this.$refs.table.clearSort();
          }
        })
        .catch(() => {
          this.$store.state.searchLoading = false;
          this.overRequestTime()
        })
      this.showGroupedit = false;
    },
    //呼叫接口
    call(id, mobile) {
      this.$axios
        .get(systemConfig.urls.call + "?accountId=" + id)
        .then((res) => {
          this.$notify({
            title: res.data.code === 0 ? res.data.msg : res.data.data.msg,
          });
        });
    },
    getCallRecode(id, pageIndex) {
      //获取拨打纪录列表
      this.recodePage.accountId = id;
      /* let pageNo=pageIndex?(pageIndex-1):0, */
      let pageNo = pageIndex ? pageIndex : 1,
        pageSize = this.recodePage.pageSize;
      let url =
        "?accountId=" + id + "&pageNo=" + pageNo + "&pageSize=" + pageSize;
      this.$axios.get(systemConfig.urls.getRecodeCall + url).then((res) => {
        let resData = res.data.data.list;
        if (resData.length > 0) {
          this.recodePage.dialogShow = true;
          resData.map((val, index) => {
            val["sortNum"] = index + 1;
          });
          this.recodePage.dataList = resData;
          this.recodePage.totalCountCall = res.data.data.totalCount;
        } else {
          this.$notify({
            message: this.$t("暂无呼叫纪录"),
          });
          this.recodePage.dialogShow = false;
        }
      });
    },
    handerRecodeCurrentChange(val) {
      this.recodePage.pageNo = val;
      this.getCallRecode(this.recodePage.accountId, this.recodePage.pageNo);
    },
    handerRecodeSizeChange(val) {
      this.recodePage.pageSize = val;
      this.getCallRecode(this.recodePage.accountId, this.recodePage.pageNo);
    },
    getTagflagList(){
      this.$axios.get(systemConfig.urls.mbrlabelList).then((res) => {
        if(res.data.code===0){
          res.data.page.map(ws=>{
            this.tagflagList.push({label:ws.name,value:ws.id})
            localStorage.setItem('tagflagList',JSON.stringify(this.tagflagList))
          })
        }
      });
    },
    watchOnline(v){
      console.log(v,v.includes(1))
      if(v.includes(1)){
        this.setGetOnlineCountTimer2 = true
      }else{
        this.setGetOnlineCountTimer2 = false
        clearInterval(getOnlineCountTimer2)
        getOnlineCountTimer2 = null
      }
    },
    getOnlineNum(){
      this.$axios.GET(systemConfig.urls.countOnline).then(res=>{
        console.log(res)
        if(res.res.code===0){
          this.onlineNum = res.res.count
        }
      })
    },
    changeRecoveryAmount (id, loginName) {
      let params = {
        id,
        loginName
      }
       this.$axios.post(systemConfig.urls.recoverBalance, params).then(res=>{
        this.$message({
          type: 'success',
          message: res.data.msg
        })
      })
      .finally(() => {
        this.getList()
      })
    },
  },
};
</script>

<style scoped lang="scss">
.sanGong {
  /deep/ .el-dialog {
    width: 30% !important;
    margin-top: 27vh !important;

    .el-input {
      width: 60%;
    }

    .dialog-footer {
      padding-right: 50px;
    }

    .el-form-item__error {
      left: 93px;
    }
  }
}
.messageVoice {
  /deep/ .el-dialog {
    .fz15 {
      display: inline-block;
      margin-right: 15px;
      margin-bottom: 15px;
      font-size: 15px;
    }
    .word-number {
      float: right;
      margin-top: 5px;
    }
  }
}
.member_mobile_form {
  /deep/ .el-form-item__content {
    display: flex;
    .member_mobile_area_code {
      width: 90px;
      margin-right: 15px;
    }
    .el-form-item__error {
      margin-left: 90px;
    }
  }
}
.btnw {
  button {
    // width: 100px;
  }
}
.onlineNum{
  position: absolute;
  left: 10px;
  top:10px;
  span{color: #3a8ee6;}
}
</style>
