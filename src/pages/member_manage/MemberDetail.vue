<template>
  <div class="member-detail" v-loading.fullscreen.lock="fullscreenLoading" style="margin-top: -20px;min-width: 1100px;">
    <div class="first">
      <el-button class="return-btn" size="mini" @click="$router.back()">{{ $t('返回') }}</el-button>
      <el-button v-if="hasPermission('member:mbraccount:updateAccountAgent')" @click="angleEdit" plain size="mini" type="primary">{{ $t('代理') }}/{{ $t('推荐人编辑') }}
      </el-button>
      <el-button @click="fnpwdUpdate()" plain size="mini" type="primary" v-if="otherAll.four.ok">{{ $t('重置登录密码') }}</el-button>
      <el-button @click="sendMessage" plain size="mini" type="primary" v-if="otherAll.one.ok">{{ $t('发送站内信') }}</el-button>
      <el-button @click="authMessageShow=true" v-if="otherAll.six.ok" plain size="mini" type="primary">{{ $t('验证信息') }}</el-button>
      <el-button v-if="hasPermission('member:mbrbankcard:save')" @click="handleShowBank" plain size="mini" type="primary">{{ $t('新增银行卡') }}</el-button>
      <el-button plain size="mini" @click="saveInfo" type="primary">{{ $t('保存') }}</el-button>
      <el-button plain size="mini" type="primary" @click="resetMemberGoogle">{{ $t('重置谷歌验证') }}</el-button>
      <!-- <el-button plain size="mini" type="primary" @click="resetMemberGoogle">{{ $t('重置支付密码') }}</el-button> -->
      <span>{{ $t('会员详情') }}</span>
    </div>
    <!-- 基本资料 -->
    <div class="second" v-if="hyzl.big.ok&&hasPermission('member:basicinfo:view')">
      <el-row class="row-header">
        <span>{{hyzl.big.label}}</span>
      </el-row>
      <el-row class="row" style="max-height: 220px;">
        <el-col style="border-right: 1px solid lightgray;" :span="6">
          <div class="content1">
            <div class="item" v-if="hyzl.name.ok">
              <span class="left">{{hyzl.name.label}}</span>
              <span class="right">{{mbrAccount.loginName}}
                <GlobalComponentTestLabel :id="tagencyId" />
              </span>
            </div>
            <div class="item" v-if="hyzl.reOri.ok">
              <span class="left">{{hyzl.reOri.label}}</span>
              <!-- <span class="right" v-if="hyzl.emailEdit.ok">{{mbrAccount.email || '未填写'}}{{isEmailChecked}}</span> -->
              <span class="right1"><input type="text" v-model="mbrAccountPost.email" :disabled="hyzl.emailEdit.ok" /></span>
            </div>
            <div class="item" v-if="hyzl.dSex.ok">
              <span class="left">{{hyzl.dSex.label}}</span>
              <!-- <span class="right" v-if="hyzl.emailEdit.ok">{{mbrAccount.email || '未填写'}}{{isEmailChecked}}</span> -->
              <span class="right1">
                <!--                <input type="text" v-model="mbrAccountPost.gender"-->
                <!--                                          :disabled="hyzl.sexEdit.ok"/>-->

                <el-select :disabled="hyzl.sexEdit.ok?'disabled':false" v-model="mbrAccountPost.gender" size="mini">
                  <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </div>
            <div class="item" v-if="hyzl.dBirthday.ok">
              <span class="left">{{hyzl.dBirthday.label}}</span>
              <!-- <span class="right" v-if="hyzl.emailEdit.ok">{{mbrAccount.email || '未填写'}}{{isEmailChecked}}</span> -->
              <span class="right1">
                <!--                <input type="text" v-model="mbrAccountPost.birthday"-->
                <!--                                          :disabled="hyzl.birthdayEdit.ok"/>-->
                <el-date-picker v-model="mbrAccountPost.birthday" :disabled="hyzl.birthdayEdit.ok" type="date" :value-format="valueFormat" @change="birChange" :placeholder="$t('选择日期')">
                </el-date-picker>
              </span>
            </div>
            <div class="item" v-if="hyzl.status.ok">
              <span class="left">{{hyzl.status.label}}</span>
              <span class="right">
                <el-tooltip class="item" effect="dark" :content="mbrAccount.registerIp" placement="top-start">
                  <el-button class="tooltip-btn" type="text" size="small">{{mbrAccount.registerIp || '--'}}</el-button>
                  <!-- <span class="right">{{mbrAccount.registerIp}}</span> -->
                </el-tooltip>
              </span>
            </div>
            <!--<div style="height:20px"></div>-->
          </div>
        </el-col>
        <el-col style="border-right: 1px solid lightgray;" :span="6">
          <div class="content1">
            <div class="item" v-if="hyzl.referrer.ok">
              <span class="left">{{hyzl.referrer.label}}</span>
              <span class="right">{{mbrAccount.referrer}}</span>
            </div>
            <div class="item" v-if="hyzl.reAdd.ok">
              <span class="left">{{hyzl.reAdd.label}}</span>
              <!-- <span class="right" v-if="hyzl.nameEdit.ok">{{mbrAccount.realName}}</span> -->
              <span class="right1"><input type="text" v-model="mbrAccountPost.realName" :disabled="hyzl.nameEdit.ok" /></span>
            </div>
            <div class="item" v-if="hyzl.memLi.ok">
              <span class="left">{{hyzl.memLi.label}}</span>
              <!-- <span class="right" v-if="hyzl.wxEdit.ok">{{mbrAccount.weChat || '未填写'}}</span> -->
              <span class="right1"><input type="text" v-model="mbrAccountPost.weChat" :disabled="hyzl.wxEdit.ok" /></span>
            </div>
            <div class="item" v-if="hyzl.email.ok">
              <span class="left">{{hyzl.email.label}}</span>
              <span class="right">
                <el-tooltip class="item" effect="dark" :content="mbrAccount.registerUrl" placement="top-start">
                  <el-button class="tooltip-btn" type="text" size="small">{{mbrAccount.registerUrl || '--'}}</el-button>
                </el-tooltip>
              </span>
            </div>
            <div class="item" v-if="hyzl.promotionUrl.ok">
              <span class="left">{{hyzl.promotionUrl.label}}</span>
              <span class="right" :title="mbrAccount.promotionH5Url">
                <el-tooltip class="item" effect="dark" :content="mbrAccount.promotionH5Url" placement="top-start">
                  <el-button class="tooltip-btn" type="text" size="small">{{mbrAccount.promotionH5Url || '--'}}</el-button>
                </el-tooltip>
                <el-popover placement="bottom-start" trigger="click">
                  <!-- 全局组件 qrcode -->
                  <qrcode :value="mbrAccount.promotionH5Url" :options="{ size: 150 }"></qrcode>
                  <el-button type="text" size="small" style="position:absolute; right: 10px;top: 6px" slot="reference">{{ $t('二维码') }}</el-button>
                </el-popover>
              </span>
            </div>
            <!--<div style="height:20px"></div>-->
          </div>
        </el-col>
        <el-col style="border-right: 1px solid lightgray;" :span="6">
          <div class="content1">
            <div class="item" v-if="hyzl.chDe.ok">
              <span class="left" style="width: 60px">{{hyzl.chDe.label}}</span>
              <!-- <span class="right" v-if="hyzl.telEdit.ok">{{mbrAccount.mobile || '未填写'}}{{isMobileChecked}}</span> -->
              <span class="right1" style="width: calc(100% - 80px)">
                <div class="mobile">
                  <el-select v-model="mbrAccountPost.mobileAreaCode" filterable :placeholder="$t('请选择')" :disabled="hyzl.telEdit.ok" @change="getcode" style="width: 75px;">
                    <el-option v-for="item in mobileAreaCodeList" :key="item.id" :label="'+' + item.mobileAreaCode + '    ' + item.countryName + ' ' + item.englishName" :value="item.mobileAreaCode"></el-option>
                  </el-select>
                  <input class="mobile_input" style="width: 80px" type="text" v-model="mbrAccountPost.mobile" :disabled="hyzl.telEdit.ok" oninput="value=value.replace(/[^0-9]/g,'')" />
                  <span class="blue-color pointer" v-if="hasPermission('member:mbraccount:mobileHistory')" @click="handlePhoneRecord">{{ $t('绑定记录') }}</span>
                </div>
              </span>
            </div>
            <div class="item" v-if="hyzl.ph.ok">
              <span class="left" style="width: 60px;">{{hyzl.ph.label}}</span>
              <!-- <span class="right" v-if="hyzl.qqEdit.ok">{{mbrAccount.qq || '未填写'}}</span> -->
              <span class="right1"><input type="text" v-model="mbrAccountPost.qq" :disabled="hyzl.qqEdit.ok" /></span>
            </div>
            <div class="item" v-if="hyzl.allDe.ok">
              <span class="left">{{hyzl.allDe.label}}</span>
              <span class="right">{{time1(mbrAccount.loginTime)}}</span>
            </div>
            <div class="item" v-if="hyzl.lastOn.ok">
              <span class="left">{{hyzl.lastOn.label}}</span>
              <span class="right">{{time1(mbrAccount.offLineTime)}}</span>
            </div>
            <div class="item" v-if="hyzl.promotionNum.ok">
              <span class="left">{{hyzl.promotionNum.label}}</span>
              <span class="right">
                <el-popover placement="bottom-start" trigger="click" :disabled="!hyzl.referrer.ok && !mbrAccount.promotionNum">
                  <el-table max-height="480" :data="recommendAccountList" border>
                    <el-table-column type="index" :label="$t('序号')"></el-table-column>
                    <el-table-column :label="$t('会员账号')" prop="loginName"></el-table-column>
                  </el-table>
                  <el-button type="text" size="small" slot="reference">{{mbrAccount.promotionNum || 0}}</el-button>
                </el-popover>
              </span>
            </div>
            <div class="item" v-if="hyzl.agyflag.ok">
              <span class="left">{{hyzl.agyflag.label}}</span>
              <span class="right">{{mbrAccount.agyflag === 1 ? '代理会员' : '普通会员'}}</span>
            </div>
            <!--<div style="height:20px"></div>-->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="content1">
            <div class="item" v-if="hyzl.nameTrue.ok">
              <span class="left">{{hyzl.nameTrue.label}}</span>
              <span class="right">{{bankCardAndCrCount || 0}}<el-button v-if="permissions.bankCard || permissions.crPay" @click="viewBankCardOrCrPay" type="text" size="small" style="position:absolute; right: 10px;top:2px">{{ $t('管理') }}</el-button></span>
            </div>
            <div class="item" v-if="hyzl.local.ok">
              <span class="left">{{hyzl.local.label}}</span>
              <span class="right">{{ time1(mbrAccount.registerTime)}}</span>
            </div>
            <div class="item" v-if="hyzl.onliMem.ok">
              <span class="left">{{hyzl.onliMem.label}}</span>
              <!-- <span class="right">{{ mbrAccount.loginIp }}</span> -->
              <span class="right">
                <el-tooltip class="item" effect="dark" :content="mbrAccount.loginIp" placement="top-start">
                  <el-button class="tooltip-btn" type="text" size="small">{{mbrAccount.loginIp || '--'}}</el-button>
                </el-tooltip>
              </span>
            </div>
            <div class="item" v-if="hyzl.isOnline.ok">
              <span class="left">{{hyzl.isOnline.label}}</span>
              <span class="right">{{isOnline}}</span>
            </div>
            <div class="item" v-if="hasPermission('member:mbraccount:loginLockView')">
              <span class="left">{{ $t('登陆锁定') }}</span>
              <span :class="[mbrAccount.loginLock ? 'lock-status' : '' , 'right']" mbrAccount.loginLock>{{mbrAccount.loginLock ? $t('已锁定') : $t('未锁定')}}
                <el-button v-if="hasPermission('member:mbraccount:loginLockUpdate') && mbrAccount.loginLock" @click="changeLockStatus" type="text" size="small" style="position:absolute; right: 10px;top:2px">{{ $t('人工解锁') }}</el-button>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 账户资料 -->
    <div class="third">
      <el-row v-if="hasPermission('member:basicinfo:view2')||hasPermission('member:basicinfo:view3')">
        <el-col class="row-header w49" style="margin-top: 0" v-if="qtzlNew.big.ok&&hasPermission('member:basicinfo:view2')">
          <span>{{qtzlNew.big.label}}</span>
          <span style="cursor: pointer;" @click="toggleMemberActivityLock">
            <i class="material-icons" style="font-size: 16px;vertical-align: text-bottom">{{qtzl.isActivityLock ? 'lock_open' : 'lock'}}</i>
            {{qtzl.isActivityLock ? $t('解锁会员星级') : $t('锁定会员星级')}}
          </span>
          <!-- <span @click="otherInfoPostEdit" v-show="!thirdEdit" class="iconfont icon-editTem">编辑</span>
          <el-button @click.native="otherInfoPostSubmit" v-show="thirdEdit" size="mini" type="primary" class="left">确定
          </el-button>
          <el-button @click.native="otherInfoPostCancel" v-show="thirdEdit" size="mini" class="right">取消</el-button> -->
        </el-col>
        <el-col style="width:2%;height:30px" v-if="qtzlNew.big.ok&&hasPermission('member:basicinfo:view2')"></el-col>
        <el-col class="row-header w49" style="margin-top: 0" v-if="fksh.big.ok&&hasPermission('member:basicinfo:view3')">
          <span>{{fksh.big.label}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="w49 second-content" v-if="qtzlNew.big.ok&&hasPermission('member:basicinfo:view2')">
          <el-row type="flex" class="row">
            <el-col :span="12">
              <div class="content row-br">
                <div class="item" v-if="qtzlNew.name.ok">
                  <span class="left">{{qtzlNew.name.label}}</span>
                  <span class="right">{{qtzl.totalBalance || 0}}
                    <el-button type="text" @click="changeRecoveryAmount"  v-if="hasPermission('member:mbraccount:recoverBalance')">[{{ $t('一键回收') }}]</el-button>
                  </span>
                </div>
                <div class="item" v-if="qtzlNew.nameTrue.ok">
                  <span class="left">{{qtzlNew.nameTrue.label}}</span>
                  <span class="right">
                    <el-select v-model="qtzl.groupId" :disabled="qtzlNew.oneEdit.ok?'disabled':false" size="mini">
                      <el-option v-for="item in listgroup" :key="item.value" :label='item.value' :value='item.id'></el-option>
                    </el-select>
                  </span>
                </div>
                <div class="item" v-if="qtzlNew.actLevelId.ok">
                  <span class="left">
                    {{qtzlNew.actLevelId.label}}
                    <!-- 会员星级自动升级记录 -->
                    <el-popover v-if="hasPermission('member:mbraccount:accountAutoLog')" width="500" trigger="click" placement="right" :title="$t('星级变更记录')">
                      <a slot="reference" href="javascript:;" style="margin-top: 4px; font-size: 14px;" class="el-icon-question"></a>

                      <AutoLevelUp :accountId="id" />
                    </el-popover>
                  </span>
                  <span class="right">
                    <el-select :disabled="qtzlNew.actLevelModify.ok?'disabled':false" v-model="qtzl.actLevelId" size="mini">
                      <el-option :disabled="!item.available" :value="item.id" :key="item.id" :label="item.tierName" v-for="item in memberLevelList"></el-option>
                    </el-select>
                  </span>
                </div>
                <!--<div style="height:20px"></div>-->
              </div>
            </el-col>
            <el-col :span="12">
              <div class="content">
                <div class="item" v-if="qtzlNew.email.ok">
                  <span class="left">{{qtzlNew.email.label}}</span>
                  <span class="right">
                    <el-select :disabled="qtzlNew.twoEdit.ok?'disabled':false" v-model="qtzl.available" size="mini">
                      <el-option :value="1" key="1" :label="$t('启用')"></el-option>
                      <el-option :value="0" key="0" :label="$t('禁用')"></el-option>
                      <el-option :value="2" key="2" :label="$t('余额冻结')"></el-option>
                    </el-select>
                  </span>
                </div>
                <!-- 代理的两个选择框 -->
                <div class="item" v-if="qtzlNew.reAdd.ok">
                  <span class="left">{{qtzlNew.reAdd.label}}</span>
                  <span class="right">
                    <!-- <el-select :disabled="!qtzlNew.threeEdit.ok || tagencyId === 4" v-model="qtzl.tagencyId" -->
                    <el-select :disabled="true" v-model="qtzl.tagencyId" @change="getAgyAccount(qtzl.tagencyId,false)" size="mini" value-key="value">
                      <el-option v-for="item in listTagent" :key="item.value" :label='item.value' :value="item.id">{{item.value}}
                        <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <div class="item" v-if="qtzlNew.reOri.ok">
                  <span class="left">{{qtzlNew.reOri.label}}</span>
                  <span class="right">
                    <!-- <el-select :disabled="!qtzlNew.fourEdit.ok || tagencyId === 4" v-model="qtzl.cagencyId" size="mini" -->
                    <el-select :disabled="true" v-model="qtzl.cagencyId" size="mini" value-key="value">
                      <el-option v-for="item in listCagent" :key="item.value" :label='item.value' :value="item.id">{{item.value}}
                        <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
                      </el-option>
                    </el-select>
                  </span>
                </div>
                <!-- <div class="item">
                  <span class="left"></span>
                  <span class="right"></span>
                </div> -->
                <!--<div style="height:20px"></div>-->
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col style="width:2%;height:30px" v-if="qtzlNew.big.ok&&hasPermission('member:basicinfo:view2')"></el-col>
        <el-col class="w49 second-content" v-if="fksh.big.ok&&hasPermission('member:basicinfo:view3')">
          <el-row type="flex" class="row">
            <el-col :span="12" v-show="controlAudit.length">
              <div class="content row-br">
                <div class="item" v-for="(item,index) in controlAudit" :key="index" v-show="index<=3&&item.ok">
                  <span class="left">{{item.label}}</span>
                  <span class="right" v-if="item.label!==$t('会员标签')">{{item.count || 0}}
                    <el-button type="text" size="small" @click.native="viewControl(item)">{{ $t('查看') }}</el-button>
                  </span>
                  <div class="right" v-else>
                    <el-select v-model="item.count">
                      <el-option :label="item.label" :value="item.value" v-for="(item, i) in tagList" :key="i"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="content">
                <div class="item" v-for="(item,index) in controlAudit.slice(4)" :key="index" v-show="item.ok">
                  <span class="left">{{item.label}}</span>
                  <span class="right">{{item.count || 0}}
                    <el-button type="text" size="small" @click.native="viewControl(item)">{{ $t('查看') }}</el-button>
                  </span>
                </div>
              </div>
              <!-- <div class="content" v-if="hasPermission('member:mbraccount:list') || hasPermission('member:mbraccount:info')">
                <div class="item">
                  <span class="left">入款防刷</span>
                  <span class="right">
                    <el-select v-model="mbrAccountPost.depositLock">
                      <el-option :label="$t('正常')" :value="0"></el-option>
                      <el-option :label="$t('冻结')" :value="1"></el-option>
                    </el-select>
                  </span>
                </div>
              </div> -->
              <div class="content" v-if="fksh.agyLevelId.ok && this.mbrAccount.agyflag === 1">
                <div class="item">
                  <span class="left">{{fksh.agyLevelId.label}}</span>
                  <span class="right">
                    <el-select v-model="mbrAccountPost.agyLevelId" :disabled="!hasPermission('member:agentlevel:update')">
                      <el-option :label="item.tierName" :value="item.id" v-for="(item, i) in agentLevelList" :key="i"></el-option>
                    </el-select>
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!--备注four-->
    <div class="third four" v-if="otherAll.name.ok">
      <el-row>
        <el-col class="row-header">
          <span>{{otherAll.name.label}}</span>
          <span v-if="hasPermission('member:mbrmemo:save')" @click="memoadd" class="iconfont icon-add">{{ $t('新增') }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="second-content" style="border: 1px solid rgb(211, 211, 211);border-top: none;">
          <el-table max-height="480" type="flex" :data="memotable.list" stripe class="beizhu">
            <el-table-column align="center" label-class-name="heightThe" type="index" :index="indexMethod" width="60" :label="$t('序号')"></el-table-column>
            <el-table-column align="center" label-class-name="heightThe" prop="memoTime" :label="$t('备注时间')" width="160">
              <template slot-scope="scope">{{timeFilter(scope.row.memoTime)}}</template>
            </el-table-column>
            <el-table-column align="center" label-class-name="heightThe" :label="$t('备注内容')">
              <template slot-scope="scope">{{sliceStr(scope.row.memo)}}</template>
            </el-table-column>
            <el-table-column align="center" label-class-name="heightThe" :label="$t('操作人')" width="160">
              <template slot-scope="scope">
                <span>{{scope.row.oprUserName}}({{scope.row.roleName}})</span>
              </template>
            </el-table-column>
            <el-table-column v-if="hasPermission('member:mbrmemo:delete')" align="center" label-class-name="heightThe" :label="$t('操作')" width="160">
              <template slot-scope="scope">
                <el-button v-if="hasPermission('member:mbrmemo:delete')" @click.native="deleteMemo([scope.row.id])" size="mini" type="text" class="left">{{ $t('删除') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination layout="prev, pager, next" style="float: right; margin: 6px 0;" :page-size="memoPageSize" :current-page="memoPageNo" :total="memotable.totalCount" @size-change="handleMemoSizeChange" @current-change="handleMemoCurrentChange">
          </el-pagination>

          <!-- <div v-show="memotableOut.length>3" style="text-align:center;height:20px;">
            <el-button @click.native="memoshow" size="mini" type="text" class="left">查看更多</el-button>
          </div> -->
        </el-col>
      </el-row>
    </div>
    <!--游戏管理five-->
    <div class="five" v-if="otherAll.nameTrue.ok">
      <el-row class="row-header">
        <span>{{otherAll.nameTrue.label}}</span>
      </el-row>
      <el-table max-height="480" :data="gameData.list" stripe class="beizhu" style="border: 1px solid rgb(211, 211, 211);border-top: none;border-bottom: none;width: 100%">
        <el-table-column align="center" label-class-name="heightThe" prop="platform" :label="$t('游戏平台')">
        </el-table-column>
        <el-table-column align="center" label-class-name="heightThe" prop="balance" :label="$t('余额')">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="refreshMonney(scope)">{{ $t('刷新') }}</el-button>
            {{scope.row.balance}}
            <i class="el-icon-question" v-if="scope.row.platform===$t('AG电子')||scope.row.platform===$t('AG真人')" :title="$t('AG电子与AG真人共用一个账户余额')"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label-class-name="heightThe" prop="player" :label="$t('游戏账号')">
        </el-table-column>
        <el-table-column align="center" label-class-name="heightThe" prop="enableTransfer" :label="$t('转账')">
          <template slot-scope="scope">
            {{scope.row.enableTransfer===true?$t('启用'):$t('禁用')}}
          </template>
        </el-table-column>
        <el-table-column align="center" label-class-name="heightThe" prop="accountName" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button v-show="scope.row.opterate.enableLoggingOut" type="text" size="small" @click.native="forceLogout(scope)">{{ $t('退出') }}
            </el-button>
            <el-button v-show="scope.row.opterate.enableLock" type="text" size="small" @click.native="forceLock(scope)">
              {{ $t('锁定') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="margin-bottom: 20px" v-show="gameData.list">
        <el-pagination @size-change="handleSizeDepotPageChange" @current-change="handleNoDepotPageChange" :current-page="depotPageNo" :page-sizes="listReq.pageSizeArr" :page-size="depotPageSize" layout="total, sizes, prev, pager, next, jumper" :total="gameData.totalCount">
        </el-pagination>
      </div>
      <!--<div style="height: 20px;"></div>-->
    </div>
    <!--资产信息six-->
    <div class="second" v-if="zcxx.big.ok&&hasPermission('member:basicinfo:view4')">
      <el-row class="row-header">
        <span>{{zcxx.big.label}}</span>
      </el-row>
      <el-row type="flex" class="row">
        <el-col :span="6" v-if="zcxx.name.ok||zcxx.status.ok||zcxx.status4.ok||zcxx.batn.ok||zcxx.ph.ok">
          <div class="content row-br">
            <div class="item" v-if="zcxx.name.ok">
              <span class="left">{{zcxx.name.label}}</span>
              <span class="right">{{fundTotal.onlinedepositNum || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.status.ok">
              <span class="left">{{zcxx.status.label}}</span>
              <span class="right">{{fundTotal.offlinedepositNum || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.status4.ok">
              <span class="left">{{zcxx.status4.label}}</span>
              <span class="right">{{fundTotal.adjustNum || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.batn.ok">
              <span class="left">{{zcxx.batn.label}}</span>
              <span class="right">{{fundTotal.bonusAmountNum || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.ph.ok">
              <span class="left">{{zcxx.ph.label}}</span>
              <span class="right">{{fundTotal.bonusNum || 0}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6" v-if="zcxx.reOri.ok||zcxx.nameTrue.ok||zcxx.email.ok||zcxx.bat.ok||zcxx.allDe.ok">
          <div class="content row-br">
            <div class="item" v-if="zcxx.reOri.ok">
              <span class="left">{{zcxx.reOri.label}}</span>
              <span class="right">{{fundTotal.onlinedepositAmounts || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.nameTrue.ok">
              <span class="left">{{zcxx.nameTrue.label}}</span>
              <span class="right">{{fundTotal.offlinedepositAmounts || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.email.ok">
              <span class="left">{{zcxx.email.label}}</span>
              <span class="right">{{fundTotal.pamounts || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.bat.ok">
              <span class="left">{{zcxx.bat.label}}</span>
              <span class="right">{{fundTotal.bonusAmountTotal || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.allDe.ok">
              <span class="left">{{zcxx.allDe.label}}</span>
              <span class="right">{{fundTotal.bonusAmounts || 0}}</span>
            </div>
          </div>
        </el-col>
        <!-- 资产信息 -->
        <el-col :span="6">
          <div class="content  row-br">
            <div class="item" v-if="zcxx.local.ok">
              <span class="left">{{zcxx.local.label}}</span>
              <span class="right">{{fundTotal.withDrawNum || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.chDe.ok">
              <span class="left">{{zcxx.chDe.label}}</span>
              <span class="right">{{fixedTwo(betTotal.bet)}}</span>
            </div>
            <div class="item" v-if="zcxx.reAdd.ok">
              <span class="left">{{zcxx.reAdd.label}}</span>
              <span class="right">{{fixedTwo(betTotal.payout)}}</span>
            </div>
            <div class="item">
              <span class="left">{{ $t('今天待发放返水金额') }}</span>
              <span class="right">{{fundTotal.mbrWaterRateYestday || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.recommend.ok">
              <span class="left">{{zcxx.recommend.label}}</span>
              <span class="right">{{fundTotal.friendsNum || 0}}</span>
            </div>
            <div class="item">
              <span class="left">{{ $t('呼朋唤友') }}</span>
              <span class="right">{{ fundTotal.huPengNum || 0 }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="content">
            <div class="item" v-if="zcxx.status3.ok">
              <span class="left">{{zcxx.status3.label}}</span>
              <span class="right">{{fundTotal.withdrawdrawingAmounts || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.status5.ok">
              <span class="left">{{zcxx.status5.label}}</span>
              <span class="right">{{fixedTwo(betTotal.validBet)}}</span>
            </div>
            <div class="item">
              <span class="left">{{ $t('账目核对') }}</span>
              <span class="right">{{ accountCheck }}
                <span v-if="hasPermission('member:mbraccount:change')">
                  <el-button type="text" size="small" @click.native="editAccountVisible=true">{{ $t('调整') }}</el-button>
                </span>
              </span>
            </div>
            <div class="item">
              <span class="left">{{ $t('今天产生返水金额') }}</span>
              <span class="right">{{fundTotal.mbrWaterRate || 0}}</span>
            </div>
            <div class="item" v-if="zcxx.memLi.ok">
              <span class="left">{{zcxx.memLi.label}}</span>
              <span class="right">{{auditPass}}
                <el-button type="text" size="small" @click.native="showAdit=true">{{ $t('查看') }}</el-button>
              </span>
            </div>
            <div class="item" v-if="zcxx.income.ok">
              <span class="left">{{zcxx.income.label}}</span>
              <span class="right">{{fundTotal.friendsReward || 0}}</span>
            </div>
            <div class="item">
              <span class="left">{{ $t('呼朋唤友返佣') }}</span>
              <span class="right">{{ fundTotal.huPengReward || 0 }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--会员日志seven-->
    <div class="second" v-if="otherAll.ph.ok&&hasPermission('member:basicinfo:view5')">
      <el-row class="row-header">
        <span>{{otherAll.ph.label}}</span>
      </el-row>
      <el-row class="second-header">
        <el-col v-if="otherAll.email.ok" :span="2" class="pointer" @click.native="tabClick('first', false)" :class="[activeName === 'first' ? 'active': '']">{{ $t('资金流水') }}
        </el-col>
        <el-col v-if="otherAll.reAdd.ok" :span="2" class="pointer" @click.native="tabClick('second', false)" :class="[activeName === 'second' ? 'active': '']">{{ $t('转账记录') }}
        </el-col>
        <el-col v-if="otherAll.reOri.ok" :span="2" class="pointer" @click.native="tabClick('third', false)" :class="[activeName === 'third' ? 'active': '']">{{ $t('存款记录') }}
        </el-col>
        <el-col v-if="otherAll.local.ok" :span="2" class="pointer" @click.native="tabClick('four', false)" :class="[activeName === 'four' ? 'active': '']">{{ $t('提款记录') }}
        </el-col>
        <el-col v-if="otherAll.task.ok" :span="2" class="pointer" @click.native="tabClick('eight', false)" :class="[activeName === 'eight' ? 'active': '']">{{ $t('任务返利') }}
        </el-col>
        <el-col v-if="otherAll.allDe.ok" :span="2" class="pointer" @click.native="tabClick('five', false)" :class="[activeName === 'five' ? 'active': '']">{{ $t('红利记录') }}
        </el-col>
        <el-col v-if="otherAll.allDe.ok" :span="2" class="pointer" @click.native="tabClick('nine', false)" :class="[activeName === 'nine' ? 'active': '']">{{ $t('好友返利') }}
        </el-col>
        <el-col v-if="otherAll.chDe.ok" :span="2" class="pointer" @click.native="tabClick('six', false)" :class="[activeName === 'six' ? 'active': '']">{{ $t('资料变更') }}
        </el-col>
        <el-col v-if="otherAll.memLi.ok" :span="2" class="pointer" @click.native="tabClick('seven', false)" :class="[activeName === 'seven' ? 'active': '']">{{ $t('登录日志') }}
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
      <div class="table-div">
        <el-table max-height="480" :data="memberData.list" v-show="activeName === 'first'" v-loading='loading' stripe style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="financialCodeName" :label="$t('类型')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="amount" :label="$t('金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('主账号原额度')">
            <template slot-scope="scope">
              {{amountFilter1(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('游戏账号原额度')">
            <template slot-scope="scope">
              {{amountFilter2(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('时间')">
            <template slot-scope="scope">
              {{timeFilter(scope.row.orderTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="memo" :label="$t('备注')">
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-show="activeName === 'second'" v-loading='loading' stripe style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单号')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('转出平台')">
            <template slot-scope="scope">
              {{transformFilter(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('转入平台')">
            <template slot-scope="scope">
              {{transformFilter2(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="amount" :label="$t('转账金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('账户金额变动')">
            <template slot-scope="scope">
              {{amountFilter1(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="modifyTime" :label="$t('操作日期')">
            <template slot-scope="scope">
              {{getMoment(scope.row.modifyTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('状态')">
            <template slot-scope="scope">
              {{scope.row.status===0? $t('冻结'):(scope.row.status===1?$t('成功'): $t('失败'))}}
              <!--<el-button v-if="scope.row.status!==1" type="text" size="small">详情</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'third'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单号')">
            <template slot-scope="scope">
              {{ scope.row.orderPrefix + scope.row.orderNo}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('充值方式')">
            <template slot-scope="scope">
              {{scope.row.mark === 0 ? $t('线上') : $t('公司')}}
            </template>
          </el-table-column>
          <!--<el-table-column align="center" label-class-name="heightThe"-->
          <!--prop="onlinePayName"-->
          <!--:label="$t('收款渠道')">-->
          <!--<template slot-scope="scope">-->
          <!--{{scope.row.mark===1?scope.row.depositType : scope.row.onlinePayName}}-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" label-class-name="heightThe" prop="payType" :label="$t('收款渠道')">
            <!--<template slot-scope="scope">-->
            <!--{{scope.row.mark===1?scope.row.depositType : scope.row.onlinePayName}}-->
            <!--</template>-->
          </el-table-column>

          <el-table-column align="center" label-class-name="heightThe" prop="depositAmount" :label="$t('充值金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="actualArrival" :label="$t('实际金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="createTime" :label="$t('充值时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="status" :label="$t('状态')" :filters="depositStatusMapper.map((item, index) => ({ text: item, value: index }))" :filter-method="(value, row) => row.status === value">
            <template slot-scope="scope">
              {{depositStatusMapper[scope.row.status]}}
              <!-- <el-button v-if="scope.row.status!==1" type="text" size="small">详情</el-button> -->
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="memo" :label="$t('备注')">
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'four'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单号')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('提款银行')">
            <template slot-scope="{ row }">
              {{row.methodType === 0 ? row.bankName : row.currencyCode}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('分行信息')">
            <template slot-scope="{ row }">
              {{row.methodType === 0 ? row.address : row. walletName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="drawingAmount" :label="$t('提款金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="passTime" :label="$t('提款时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.passTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('状态')">
            <template slot-scope="scope">
              {{statusFilter2(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="memo" :label="$t('备注')">
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'five'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="activityName" :label="$t('红利名称')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="bonusAmount" :label="$t('红利金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="applicationTime" :label="$t('添加时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.applicationTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="auditUser" :label="$t('添加人')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="status" :label="$t('状态')">
            <template slot-scope="scope">
              {{statusFilter3(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="applicationMemo" :label="$t('备注')">
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'six'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('变更项目')">
            <template slot-scope="scope">
              {{fiveItemChange1(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('变更前')">
            <template slot-scope="scope">
              {{fiveItemChange2(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('变更后')">
            <template slot-scope="scope">
              {{fiveItemChange3(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="createTime" :label="$t('时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('状态')">
            <template slot-scope="scope">
              {{fiveItemChange4(scope.row)}}
            </template>
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'nine'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('返利类型')">
            <template slot-scope="scope">
              {{getType(scope.row.rewardType)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('返利金额')" prop="reward"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" :label="$t('添加时间')" prop="createTime" />
          <el-table-column align="center" label-class-name="heightThe" :label="$t('添加人')" prop="creater" />
          <el-table-column align="center" label-class-name="heightThe" :label="$t('备注')" prop="memo" />
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'seven'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="loginIp" :label="$t('登录IP')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="loginTime" :label="$t('时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.loginTime)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="loginUrl" :label="$t('登录网址')">
          </el-table-column>
        </el-table>
        <el-table max-height="480" :data="memberData.list" v-loading='loading' stripe v-show="activeName === 'eight'" style="width: 100%">
          <el-table-column align="center" label-class-name="heightThe" prop="orderNo" :label="$t('订单号')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="taskName" :label="$t('任务名称')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="bonusAmount" :label="$t('领取金额')">
          </el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="time" :label="$t('领取时间')">
            <template slot-scope="scope">
              {{getMoment(scope.row.time)}}
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label-class-name="heightThe"
                           :label="$t('状态')">
            <template>
              {{'已发放'}}
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <div class="pagination" v-if=" memberData.list && memberData.list.length>0">
      <el-pagination @size-change="handleSizePageChange" @current-change="handleNoPageChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="memberData.totalCount">
      </el-pagination>
    </div>

    <el-dialog :title="$t('发送站内信')" :visible.sync="sendMessageShow" @close="sendMessageCancel">
      <div style="width: 90%;margin: 0 auto;text-align: center;margin-left: -5px">
        <div><label class="label" style="text-align: right;margin-right: 10px">{{ $t('会员名') }}</label>
          <el-input size="small" style="width:70%" v-model="messagePost.inputName" disabled class="input"></el-input>
        </div>
        <!-- <div class="mt20"><label class="label" style="text-align: right;margin-right: 10px">站内信标题</label>
          <el-input size="small" style="width:70%" v-model="messagePost.inputTitle"></el-input>
        </div> -->
        <div class="mt20">
          <label class="label" style="text-align: right;margin-right: 10px">{{ $t('站内信内容') }}</label>
          <div class="el-input el-input--small" style="width:70%">
            <input type="text" class="el-input__inner" v-model.lazy="messagePost.inputTextarea">
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="sendMessageCancel">{{ $t('取消') }}</el-button>
        <el-button size="small" type="primary" @click="sendMessageSubmit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="bankTitle" :visible.sync="showAddBank">
      <el-form ref="bankForm" :model="bankForm" label-width="150px" :rules="bankRules">
        <el-form-item :label="$t('银行类型')" prop="areaCode">
          <el-select v-model="bankForm.areaCode" @change="handleAreaCodeChange">
            <el-option :label="$t('中国')" value="CN"></el-option>
            <el-option :label="$t('台湾')" value="TW"></el-option>
            <el-option :label="$t('澳洲')" value="AUD"></el-option>
            <el-option :label="$t('越南')" value="VN"></el-option>
            <el-option :label="$t('马来')" value="MY"></el-option>
            <!-- <el-option label="新加坡" value="SG"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('提现账号类型')" prop="bankType">
          <el-select v-model="bankForm.bankType" @change="handleTypeChange">
            <el-option :label="$t('银行卡')" :value="1"></el-option>
            <el-option label="USDT" :value="3"></el-option>
            <el-option
              v-show="bankForm.areaCode === 'CN' || bankForm.areaCode === 'TW' || bankForm.areaCode === 'VN'"
              :label="$t('支付宝')" :value="2">
            </el-option>
            <el-option v-show="bankForm.areaCode === 'AUD'" label="PAYID" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="bankForm.bankType !== 3">
          <el-form-item :label="$t('真实姓名')" prop="realName">
            <el-input disabled v-model="mbrAccountPost.realName"></el-input>
          </el-form-item>
        </template>
        <template v-if="bankForm.bankType === 1">
          <el-form-item :label="$t('银行账户')" prop="cardNo" key="cardNo">
            <el-input type="number" v-model="bankForm.cardNo" :placeholder="$t('请输入银行卡号')"></el-input>
          </el-form-item>
          <el-form-item v-if="bankForm.areaCode === 'AUD'" label="BSB" prop="address" key="addressBsb">
            <el-input v-model="bankForm.address" :placeholder="$t('请输入') + 'BSB'"></el-input>
          </el-form-item>
          <template v-else>
            <el-form-item :label="$t('开户银行')" prop="bankCardId" key="bankCardId">
              <el-select v-model="bankForm.bankCardId" :placeholder="$t('请选择')">
                <el-option v-for="(item, i) in banksList" :key="i" :label="item.bankName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="bankForm.areaCode === 'CN'" :label="$t('开户银行区域')" prop="city" key="city">
              <el-select v-model="bankForm.province" :placeholder="$t('请选择省份')" @change="handleProvChange">
                <el-option v-for="(item, i) in provsList" :key="i" :label="item.prov" :value="item.prov"></el-option>
              </el-select>
              <el-select v-model="bankForm.city" :placeholder="$t('请选择城市')">
                <el-option v-for="(item, i) in citiysList" :key="i" :label="item.city" :value="item.city"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="bankForm.areaCode !== 'CN'" :label="$t('开户银行区域')" key="cityInp">
              <el-input v-model="bankForm.province" :placeholder="$t('请输入省份')" style="width:240px"></el-input>
              <el-input v-model="bankForm.city" :placeholder="$t('请输入城市')" style="width:240px"></el-input>
            </el-form-item>
            <el-form-item v-if="bankForm.areaCode !== 'MY'" :label="$t('支行名称')" prop="address" key="address">
              <el-input v-model="bankForm.address" :placeholder="$t('请输入支行名称')"></el-input>
            </el-form-item>
            <el-form-item v-if="bankForm.areaCode === 'MY'" :label="$t('支行名称')" key="addressMY">
              <el-input v-model="bankForm.address" :placeholder="$t('请输入支行名称')"></el-input>
            </el-form-item>
          </template>
        </template>
        <template v-if="bankForm.bankType === 2">
          <el-form-item :label="$t('支付宝账号')" prop="cardNo" key="cardNob">
            <el-input v-model="bankForm.cardNo" :placeholder="$t('请输入支付宝账号')"></el-input>
          </el-form-item>
        </template>
        <template v-if="bankForm.bankType === 3">
          <el-form-item :label="$t('协议类型')" prop="currencyProtocol" key="currencyProtocol">
            <el-select v-model="bankForm.currencyProtocol" :placeholder="$t('请选择')">
              <el-option :label="$t('以太坊') + '(TRC20)'" value="TRC20"></el-option>
              <el-option :label="$t('波场')+ '(ERC20)'" value="ERC20"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('钱包类型')" prop="walletId" key="walletId">
            <el-select v-model="bankForm.walletId" @change="handleTypeChange" :placeholder="$t('请选择')">
              <el-option v-for="(item, i) in walletsList" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('钱包地址')" prop="walletAddress" key="walletAddress">
            <el-input v-model="bankForm.walletAddress" :placeholder="$t('请输入钱包地址')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('确认地址')" prop="walletAddress2" key="walletAddress2">
            <el-input v-model="bankForm.walletAddress2" :placeholder="$t('请确认钱包地址')"></el-input>
          </el-form-item>
        </template>
        <template v-if="bankForm.bankType === 4">
          <el-form-item label="PAYID" prop="cardNo" key="cardNoP">
            <el-input v-model="bankForm.cardNo" :placeholder="$t('请输入') + 'PAYID'"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer">
          <el-button @click="handleCloseDialog">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="handleBankSubmit" :loading="bankSumbitLoading">{{ $t('保存') }}</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="$t('验证信息')" :visible.sync="authMessageShow" @close="sendMessageCancel" class="auth">
      <div class="authMessage" v-loading="authLoading">
        <div v-if="hyzl.name.ok"><label class="label" style="text-align: right;margin-right: 10px">{{ $t('用户名') }}：</label>
          <el-input size="small" style="width:65%" v-model="mbrAccount.loginName" disabled class="input"></el-input>
          <a href="javascript:void(0)">
            <span class="authSpan">
              <img style="width:17px;height:17px;visibility:hidden;" src='' />
            </span>
            <span class="authSpan w50">
            </span>
          </a>
        </div>
        <div class="mt20" v-for="(item,i) in authItem" :key="i">
          <label class="label" style="text-align: right;margin-right: 10px">{{item.label}}：</label>
          <el-input size="small" style="width:65%" v-model="authMessage[item.key]" class="input" v-if="item.type=='number'" @input="inputAuthData(item.key,authMessage[item.key])" :placeholder="$t('请输入')"></el-input>
          <el-input :type="item.type" size="small" style="width:65%" v-model="authMessage[item.key]" class="input" v-else @change="deleteTextBlank(item.key,authMessage[item.key])" :placeholder="$t('请输入')"></el-input>
          <a href="javascript:void(0)">
            <span class="authSpan">
              <img style="width:17px;height:17px" v-if="getAuthData[item.key]" :src="authImg(getAuthData[item.key]).src">
              <img style="width:17px;height:17px;visibility:hidden;" v-else src='' />
            </span>
            <span :class="['authSpan','w50',authImg(getAuthData[item.key]).class]">
              {{authImg(getAuthData[item.key]).remind}}
            </span>
          </a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleAuthMessage">{{ $t('取消') }}</el-button>
        <el-button size="small" type="primary" @click="sendAuthMessageSubmit" :disabled="authDisable">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="onlyRead ? $t('查看个人信息') : $t('编辑个人信息')" :visible.sync="memberInfoShow" @close="memberInfoCancel('memberInfoForm')">
      <el-form class="small-space form-content" label-position="right" ref="memberInfoForm" :model="mbrAccount" :rules="memberInfoRule" label-width="80px">
        <el-form-item :label="$t('真实姓名')" prop="realName" :rules="memberInfoRule.name">
          <el-input :disabled="onlyRead" v-model="mbrAccount.realName" :placeholder="$t('真实姓名')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('联系电话')" prop="mobile" :rules="memberInfoRule.mobile">
          <el-input :disabled="onlyRead" type="number" v-model.number="mbrAccount.mobile" :placeholder="$t('电话号码')" :maxlength="maxLengthObj.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('邮箱')" prop="email" :rules="memberInfoRule.email">
          <el-input :disabled="onlyRead" v-model="mbrAccount.email" :placeholder="$t('邮箱地址')" :maxlength="maxLengthObj.email"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq" :rules="memberInfoRule.qq">
          <el-input :disabled="onlyRead" type="number" v-model.number="mbrAccount.qq" :placeholder="$t('QQ号码')" :maxlength="maxLengthObj.qq"></el-input>
        </el-form-item>
        <el-form-item :label="$t('微信')" prop="weChat" :rules="memberInfoRule.wechat">
          <el-input :disabled="onlyRead" v-model="mbrAccount.weChat" :placeholder="$t('微信号')" :maxlength="maxLengthObj.wechat"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="onlyRead" type="primary" @click="fnaccountinfo(false)">{{ $t('编辑') }}</el-button>
        <el-button @click="memberInfoCancel('memberInfoForm')">{{ $t('取消') }}</el-button>
        <el-button v-show="!onlyRead" type="primary" @click="memberInfoSave">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('游戏账户信息')" :visible.sync="membergamewalletview">
      <div class="dialog-header">
        <span>{{ $t('会员名') }}：{{ mbrWallet.loginName || 0}}</span>
        <span>{{ $t('总余额') }}:{{ mbrWallet.totalBalance || 0 }}</span>
        <span>{{ $t('钱包余额') }}：{{ mbrWallet.balance || 0}}</span>
        <el-button type="warning" size="mini" v-show="walletTableList.length>0" @click="fnwalletbatchRecover">{{ $t('批量回收') }}
        </el-button>
      </div>

      <el-table max-height="480" type="flex" :data="walletTableList" @selection-change="walletRecoverSelectionChange" v-loading='recoverLoading' border fit highlight-current-row>
        <el-table-column label-class-name="heightThe" type="selection" width="40"></el-table-column>
        <el-table-column label-class-name="heightThe" type="index" :index="indexMethod" :label="$t('序号')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="depotName" sortable :label="$t('游戏平台')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginName" :label="$t('游戏账号')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="balance" :label="$t('平台余额')"></el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('操作')" min-width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="fnwalletRecover(scope.row)">{{ $t('回收余额') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog @close="operateCancel" width="30%" :title="$t('确认回收?')" :visible.sync="innerVisible" append-to-body>
        <div slot="footer" class="dialog-footer">
          <el-button @click="operateCancel">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="submitRecover">{{ $t('确认') }}</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog class="wd100-set" :title="$t('查看银行卡及钱包')" :visible.sync="banklistview">
      <div class="dialog-header" style="margin-bottom: 30px;">
        <el-tabs v-model="activeListView" @tab-click="handleTabClick">
          <el-tab-pane v-if="permissions.bankCard" name="bankCard" :label="$t('银行卡')"></el-tab-pane>
          <el-tab-pane v-if="permissions.crPay" name="crPay" :label="$t('加密货币钱包')"></el-tab-pane>
          <el-tab-pane v-if="permissions.crPay" name="crPayAddress" :label="$t('加密货币存款钱包地址')"></el-tab-pane>
          <el-tab-pane v-if="permissions.crPay" name="bankCardRecord" :label="$t('银行卡和支付宝绑定历史记录')"></el-tab-pane>
          <el-tab-pane v-if="permissions.bankCard" name="zfbRecord" :label="$t('支付宝')"></el-tab-pane>
          <el-tab-pane v-if="permissions.bankCard" name="electronicWallet" :label="$t('电子钱包')"></el-tab-pane>
          <el-tab-pane v-if="permissions.bankCard" name="otherPo" :label="$t('其他钱包')"></el-tab-pane>
        </el-tabs>
        <!-- <el-button type="primary" size="mini" @click="bankcardAdd">新增银行卡</el-button> -->
      </div>
      <el-table max-height="480"
                type="flex"
                :data="banktablelist"
                border
                fit
                highlight-current-row
                v-if="activeListView == 'crPay' ||
                      activeListView === 'bankCard' ||
                      activeListView === 'bankCardRecord' ||
                      activeListView === 'zfbRecord' ||
                      activeListView === 'electronicWallet' ||
                      activeListView === 'otherPo'"
                      v-loading="bankCardLoading">
        <!-- <el-table-column label-class-name="heightThe" type="selection" width="45px" key="selection"></el-table-column> -->
        <el-table-column key="index" type="index" width="45px" :label="$t('序号')" :index="indexMethod" label-class-name="heightThe">
        </el-table-column>

        <template v-if="activeListView === 'otherPo' ">
          <el-table-column  align="center" label-class-name="heightThe" prop="address" key="address" :label="$t('钱包类型')"></el-table-column>
          <el-table-column  align="center" label-class-name="heightThe" prop="cardNo" key="cardNo" :label="$t('钱包地址')"></el-table-column>
        </template>

        <template v-if="activeListView === 'bankCard' || activeListView === 'bankCardRecord'">
          <el-table-column align="center" label-class-name="heightThe" prop="realName" key="realName" :label="$t('开户姓名')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="bankName" key="bankName" :label="$t('开户银行')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="province" key="province" :label="$t('开户地址')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="bsbCode" key="bsbCode" :label="$t('BSB码')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="address" key="address" :label="$t('开户支行')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="cardNo" key="cardNo" width="160px" :label="$t('开户账号')"></el-table-column>
        </template>


        <template v-if="activeListView === 'electronicWallet' " >
          <el-table-column align="center" label-class-name="heightThe" prop="realName" key="realName" :label="$t('姓名')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="cardNo" key="cardNo" :label="$t('账号')"></el-table-column>
        </template>

        <template v-else-if="activeListView === 'crPay'">
          <el-table-column align="center" label-class-name="heightThe" prop="walletName" key="walletName" :label="$t('钱包名称')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="currencyCode" key="currencyCode" :label="$t('币种')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="currencyProtocol" key="currencyProtocol" :label="$t('协议类型')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="walletAddress" key="walletAddress" :label="$t('钱包地址')"></el-table-column>
        </template>
        <template v-else-if="activeListView === 'zfbRecord'">
          <el-table-column align="center" label-class-name="heightThe" prop="cardNo" key="cardNo1" :label="$t('支付宝账号')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="realName" key="realName1" :label="$t('支付宝姓名')"></el-table-column>
          <el-table-column align="center" label-class-name="heightThe" prop="bindTimePhoneNum" key="bindTimePhoneNum" :label="$t('手机号码')"></el-table-column>
        </template>
        <el-table-column  align="center" v-if="activeListView !== 'bankCardRecord'" label-class-name="heightThe" prop="available" key="status" :label="$t('状态')" :filters="[{ text: $t('禁用'), value: 0 }, { text: $t('启用'), value: 1 }, { text: $t('余额冻结'), value: 2}]" :filter-method="filterTag" filter-placement="bottom-end" width="100">
          <template slot-scope="scope">
            <el-tag  :type="scope.row.available == 1 ? 'primary' : scope.row.available == 0 ? 'warning':'danger'">
              {{statusFilter(scope.row.available)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" width="150" key="createTime" :label="$t('绑定日期')">
          <template slot-scope="{ row }">
            {{time1(row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column v-if="
            (activeListView === 'bankCard'
              ? hasPermission('member:mbrbankcard:available')
              : hasPermission('member:cryptocurrencies:available')) && !['bankCardRecord'].includes(activeListView)
          " label-class-name="heightThe" :label="$t('是否启用')" prop="available" key="available" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.available" active-color="#13ce66" inactive-color="#ff4949" :inactive-value='0' :active-value='1' @change="togglebankavai(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="activeListView === 'bankCardRecord'" :label="$t('解绑日期')" prop="updateTime"></el-table-column>
        <el-table-column v-if="['bankCardRecord'].includes(activeListView)" :label="$t('操作人')" prop="updater"></el-table-column>
        <el-table-column label-class-name="heightThe" :label="$t('操作')" key="operations" v-if="!['bankCardRecord'].includes(activeListView)">
          <template slot-scope="scope">
            <div>
              <!-- <el-button type="text" style="margin-left: 10px" size="small" @click="bankcardupdata(scope.row)">[编辑]
              </el-button> -->
              <el-button v-if="
                  activeListView === 'bankCard' || activeListView === 'zfbRecord'
                    ? hasPermission('member:mbrbankcard:delete')
                    : hasPermission('member:cryptocurrencies:delete')
                " type="text" size="small" @click="bankcarddelete(scope.row)">
                [{{ $t('删除') }}]
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table max-height="480" type="flex" :data="banktableCrPayAddresslist" v-loading="bankCardLoading" border fit highlight-current-row v-if="activeListView === 'crPayAddress'">
        <el-table-column label-class-name="heightThe" prop="address" key="address" :label="$t('钱包地址')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="name" key="name" :label="$t('协议类型')" align="center"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="link" key="link" :label="$t('查询链接')" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_blank" rel="noopener noreferrer">
              {{scope.row.link}}
            </a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-if="activeListView !== 'crPayAddress'" :total="crPayPager.totalCount" :page-size="crPayPager.pageSize" :current-page="crPayPager.pageNo" :page-sizes="[5,10,20,50,100,200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleCrPaySizeChange" @current-change="handleCrPayCurrentChange">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog :title="bankfromtitle" :visible.sync="addbankview" @close="bankAddCancel('mbrBankcard')" width="70%" style="margin-left: 20px">
      <el-form class="small-space form-content" :model="mbrBankcard" :rules="bankAddRule" ref="mbrBankcard" label-position="right" label-width="120px">
        <el-form-item :label="$t('会员名')" :rules="commonRule.notNull">
          <el-input v-model="mbrAccount.loginName" disabled :placeholder="$t('会员名')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('开户银行')" prop="bankCardId" :rules="commonRule.changeNotNull">
          <el-select v-model="mbrBankcard.bankCardId" :placeholder="$t('选择银行')">
            <el-option v-for="item in bankList" :label='item.bankName' :key="item.bankCode" :value='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('开户支行省份')" prop="province" :rules="commonRule.changeNotNull">
          <el-select v-model="mbrBankcard.province" :placeholder="$t('选择省份')" @change="fncitylist(mbrBankcard.province)">
            <el-option v-for="item in provlist" :label='item.value' :key="item.value" :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('开户支行市/区')" prop="city" :rules="commonRule.changeNotNull">
          <el-select v-model="mbrBankcard.city" :placeholder="$t('选择市/区')">
            <el-option v-for="item in citylist" :label='item.value' :key="item.value" :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('开户支行地址')" prop="address" :rules="commonRule.chinese">
          <el-input v-model="mbrBankcard.address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('开户姓名')" prop="realName" :rules="commonRule.notNull">
          <el-input v-model="mbrBankcard.realName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('开户账号')" prop="cardNo" :rules="bankAddRule.account">
          <el-input v-model="mbrBankcard.cardNo" :maxlength="maxLengthObj.bankAccount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('状态')">
          <el-radio v-model="mbrBankcard.available" :label="1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="mbrBankcard.available" :label="0">{{ $t('禁用') }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bankAddCancel('mbrBankcard')">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveNewBankcard">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog class="wd100-set" :title="$t('详细备注信息')" :visible.sync="mbrmemoshow" width="70%">
      <el-row class="second-header" style="border-top:1px solid;box-sizing:none;border-color:  #ebeef5">
        <el-col :span="2" class="pointer" @click.native="memoTabClick('')" :class="[memoActiveName === '' ? 'active': '']">{{ $t('全部') }}
        </el-col>
        <el-col :span="2" class="pointer" v-for="(item, index) in sortTitle" :key="index" @click.native='memoTabClick(item.roleId, false)' :class="[memoActiveName === item.roleId ? 'active': '']">{{item.roleName}}
        </el-col>
      </el-row>
      <!--<el-table max-height="480" type="flex" :data="memotable.list" border fit highlight-current-row>-->
      <!--<el-table-column label-class-name="heightThe" type="index" :index="indexMethod" width="40"></el-table-column>-->
      <!--<el-table-column label-class-name="heightThe" prop="memoTime" :label="$t('备注时间')" width="160">-->
      <!--<template slot-scope="scope">{{timeFilter(scope.row.memoTime)}}</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label-class-name="heightThe" prop="memo" :label="$t('备注内容')"></el-table-column>-->
      <!--<el-table-column label-class-name="heightThe" prop="oprUserName" :label="$t('备注人')" width="120"></el-table-column>-->
      <!--</el-table>-->
      <!--<el-collapse accordion>-->
      <!--<el-collapse-item v-for="(i,index) in memotable.list" :key="index">-->
      <!--<template slot="title">-->
      <!--<span style="color: #9E9E9E">-->
      <!--{{timeFilter(i.memoTime)}}-->
      <!--</span>-->
      <!--<span style="color: #9E9E9E;margin-left: 40px">-->
      <!--{{i.oprUserName}}-->
      <!--</span>-->
      <!--</template>-->

      <!--</el-collapse-item>-->
      <!--</el-collapse>-->

      <div v-for="(i,index) in memotable.list" :key="index" class="mix">
        <div class="new-he">
          <span> {{timeFilter(i.memoTime)}}</span>
          <span> {{timeFilter(i.oprUserName)}}</span>
        </div>
        <div class="new-bo">
          <div :class="index == isHide?'auto-h':'shl'">
            {{i.memo}}
          </div>
          <div class="fh" @click="hideSx(index)">
            <i :class="index == isHide?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination @size-change="handleMemoSizeChange" @current-change="handleMemoCurrentChange" :current-page="memoPageNo" :page-sizes="listReq.pageSizeArr" :page-size="memoPageSize" layout="total, sizes, prev, pager, next, jumper" :total="memotable.totalCount">
        </el-pagination>
      </div>
      <!--<div style="height: 20px;"></div>-->
    </el-dialog>
    <el-dialog class="confirm-save" :title="$t('提示')" :visible.sync="isConfirmSaveShow" @close="isConfirmSaveShow = false">
      {{ $t('保存本次已编辑内容') }}：{{confirmTips}}？
      <div slot="footer" class="dialog-footer">
<!--        <el-button @click="savingCompeleteHook()">不保存并离开</el-button>-->
        <el-button type="default" @click="saveEditedContent">{{ $t('关闭') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('新增备注')" :visible.sync="mbrmemoaddshow" @close="memoCancel('addMemo')">
      <el-form style="margin-left: 0" class="small-space from-content" label-position="right" label-width="150px" :model="mbrMemo" ref="addMemo" :rules="commonRule">
        <el-form-item :label="$t('操作人')">
          <el-input v-model="mbrMemo.oprUserName" disabled :placeholder="$t('操作人')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('操作时间')">
          <el-input v-model="mbrMemo.memoTime" disabled :placeholder="$t('操作时间')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('备注内容')" prop="memo" :rules="commonRule.notNull">
          <el-input type="textarea" v-model="mbrMemo.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memoCancel('addMemo')">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="savememo">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog class="wd100-set" :title="$t('加入白名单')" :visible.sync="whiteSheetDialogShow" @close="closeWhiteSheet">
      <el-form class="small-space from-content" label-position="right" label-width="150px">
        <el-form-item :label="$t('会员名')">
          <el-input v-model="mbrAccount.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input type="textarea" v-model="whiteSheetMemo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWhiteSheet">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveWhiteSheet">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog class="wd100-set" :title="$t('会员登录信息')" :visible.sync="loginrecordShow">
      <el-table max-height="480" type="flex" :data="logintablelist" border fit highlight-current-row>
        <!--<el-table-column label-class-name="heightThe" type="selection" width="40"></el-table-column>-->
        <el-table-column label-class-name="heightThe" type="index" width="40" :label="$t('序号')" :index="indexMethod"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginName" :label="$t('会员名')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginTime" sortable :label="$t('登陆时间')">
          <template slot-scope="scope">{{timeFilter(scope.row.loginTime)}}</template>
        </el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginIp" :label="$t('登陆IP')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginArea" :label="$t('登录区域')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="loginUrl" :label="$t('登录网址')"></el-table-column>
        <el-table-column label-class-name="heightThe" prop="onlineTimeStr" sortable :label="$t('在线时长')"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleLoginSizeChange" @current-change="handleLoginCurrentChange" :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr" :page-size="listReq.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logRecordTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <!--风控审核-->
    <el-dialog class="wd100-set" :title="auditTitle" v-if="hasPermission('member:basicinfo:view3')" :visible.sync="controlAuditShow" @close="viewControlCancel" width="70%">
      <el-table max-height="480" type="flex" :data="controlAuditData.list" border fit highlight-current-row>
        <el-table-column label-class-name="heightThe" v-for="(column, index) in columnArr" :key="index" :label="column.label" :prop="column.prop" align="center">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleControlAuditSizeChange" @current-change="handleControlAuditCurrentChange" :current-page="auditPageNo" :page-sizes="[5,10,20,50,100,200]" :page-size="auditPageSize" layout="total, sizes, prev, pager, next, jumper" :total="controlAuditData.totalCount">
        </el-pagination>
      </div>
      <div style="width:100%;height:20px"></div>
    </el-dialog>
    <audit v-if="showAdit" :showAdit.sync="showAdit" :loginName="this.getName"></audit>
    <el-dialog :title="$t('会员代理/推荐人编辑')" :visible.sync="angleShow" class="agentSet">
      <p>{{ $t('当前代理') }}： {{ $route.query.agyAccount }}</p>
      <div class="upper">
        <span class="left" style="margin-right:10px;">{{ $t('代理') }}：</span>
        <span class="right">
          <el-select clearable filterable v-model="childAgentId" :disabled="!!supLoginName" size="mini" value-key="value">
            <el-option v-for="item in listCagent" :key="item.value" :label='item.value' :value="item.id">{{item.value}}
              <GlobalComponentTestLabel :id="item.id" :parentId="item.parentId" />
            </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <span class="left" style="margin-right: -2px;">{{ $t('推荐人') }}：</span>
        <span class="right">
          <el-input v-model="supLoginName" size="mini" style="width: 50%;" :placeholder="$t('请输入推荐人')"></el-input>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="angleHide" size="small">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="angleUpdate" size="small">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showPhoneRecord"
      :title="$t('电话-绑定记录')"
    >
      <TableCom
        :has-add-btn="false"
        :has-remove-btn="false"
        :table-data="phoneReaord.list"
        :table-columns="phoneReaord.clomns"
        :table-loading="phoneReaord.loading"
        :current-page.sync="phoneReaord.pageNo"
        :page-size="phoneReaord.pageSize"
        :total-count="phoneReaord.totalCount"
        @reloadData="getPhoneRecord"
      ></TableCom>
    </el-dialog>
    <el-dialog class="wd100-set" :title="$t('账目调整')" :visible.sync="editAccountVisible" @close="closeAccount">
      <el-form class="small-space from-content" label-position="right" label-width="150px" :model="accountForm" ref="accountForm" :rules="accountRules">
        <el-form-item :label="$t('类型')" prop="type">
          <el-radio v-model="accountForm.type" :label="1">{{ $t('增加') }}</el-radio>
          <el-radio v-model="accountForm.type" :label="2">{{ $t('减少') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('调整金额')" prop="adjustment" :rules="commonRule.numberRuleE">
          <el-input v-model.number="accountForm.adjustment"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAccount">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveAccount">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import AdjustType from "./TypeAdjust.vue";
import Audit from "./OnlineAudit.vue";
import systemConfig from "../../config/config";
import localAuthData from "../../config/authConfigSet";
import { mapGetters } from "vuex";
import AutoLevelUp from "./MemberDetailAutoLevelUp";
import moment from "moment";
import { lang } from "@/i18n";

export default {
  name: "memberDetail",
  components: {
    Audit,
    AdjustType,
    AutoLevelUp,
  },
  data() {
    return {
      basicColumn: [{ label: lang("会员名"), prop: "loginName" }],
      safePassword: "",
      tmpValue4SafeCheck: {},
      sexOptions: [
        {
          value: "",
          label: lang("请选择"),
        },
        {
          value: lang("男"),
          label: lang("男"),
        },
        {
          value: lang("女"),
          label: lang("女"),
        },
      ],
      crPayPager: {
        pageNo: 1,
        pageSize: 10,
        totalCount: null,
      },
      activeListView: "bankCard",
      bankCardAndCrCount: 0,
      // 存款记录状态 0: '拒绝' 1: '通过' 2: '待处理'
      depositStatusMapper: [lang("失败"), lang("成功"), lang("待处理")],
      angleOb: {},
      angleShow: false,
      specialValues: {},
      isHide: 100,
      otherAll: "",
      hyzl: "",
      qtzlNew: "",
      fksh: "",
      zcxx: "",
      qtzl: "" /*其他资料单独掉api*/,
      tagencyId: null,
      id: "",
      getName: "",
      listgroup: [],
      listTagent: [],
      listCagent: [],
      phoneReaord: {
        list: [],
        clomns: [
          { label: lang('手机号'), prop: 'mobile' },
          { label: lang('绑定日期'), prop: 'createTime' },
          { label: lang('解绑日期'), prop: 'updateTime' },
          { label: lang('操作人'), prop: 'updater' },
        ],
        loading: false,
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      disabledTagent: true,
      memberInfoShow: false,
      disabledEditGroup: true,
      disabledAvailable: true,
      showPhoneRecord: false,
      onlyRead: false,
      membergamewalletview: false,
      mbrAccount: {},
      accountInfo: {},
      confirmTips: null,
      shouldBasicInfoBeSave: false,
      shouldAccountInfoBeSave: false,
      shouldDepositLockBeSave: false,
      shouldAgyLevelIdBeSave: false,
      shouldAuditInfoBeSave: false,
      bankCardLoading: false,
      isConfirmSaveShow: false,
      savingCompeleteHook: null,
      recommendAccountList: [],
      logreg: {},
      logLogin: {},
      mbrcard: {},
      mbrWallet: {},
      banktablelist: [],
      showAdit: false,
      banklistview: false,
      addbankview: false,
      bankfromtitle: "",
      mbrmemoshow: false,
      mbrmemoaddshow: false,
      bankSumbitLoading: false,
      walletTableList: [],
      recoverLoading: true,
      walletTableMultipleSelection: [],
      bankList: [],
      provlist: [],
      citylist: [],
      mbrBankcard: {
        available: 1,
      },
      mbrMemo: {},
      memotable: {},
      memotableOut: [],
      loginrecordShow: false,
      logintablelist: [],
      showbillAudit: false,
      showBillAddAudit: false,
      memberInfoRule: systemConfig.rules.memberInfoRule,
      bankAddRule: systemConfig.rules.bankAddRule,
      commonRule: systemConfig.rules.commonRule,
      maxLengthObj: systemConfig.rules.maxLength,
      getAgentCount: 0,
      memoTotal: 0,
      logRecordTotal: 0,
      oprRecordTotasl: 0,
      innerVisible: false,
      rowData: {},
      fundTotal: {},
      betTotal: {},
      isWhiteSheet: false,
      whiteSheetDialogShow: false,
      whiteSheetMemo: "",
      whiteSheetData: {},
      secondEdit: false,
      thirdEdit: false,
      fourEdit: false,
      groupValue: "",
      gameData: {},
      mbrAccountPost: {
        gender: null,
        birthday: null,
        mbrAccountPost: null,
      },
      otherInfoPost: {},
      activeName: "first",
      memoActiveName: "",
      tabData: {},
      memberData: {
        list: [],
        totalCount: 0
      },
      messagePost: {},
      bankForm: {
        areaCode: 'CN',
        bankType: 1,
        city: null
      },
      sendMessageShow: false,
      authMessageShow: false,
      showAddBank: false,
      banksList: [],
      provsList: [],
      citiysList: [],
      walletsList: [],
      controlAudit0: [],
      controlAudit: [],
      tagList: [],
      auditPageNo: 1,
      auditPageSize: 10,
      auditTitle: "",
      controlAuditShow: false,
      controlAuditData: {},
      controlData: {},
      columnArr: [],
      memoPageNo: 1,
      memoPageSize: 5,
      sortTitle: [],
      depotPageNo: 1,
      depotPageSize: 10,
      isAuditPassed: false,
      comData: "",
      memberLevelList: [],
      faAgentId: "",
      childAgentId: "",
      supLoginName: "",
      mbrChangeKeys: [],
      authMessage: {
        realName: "",
        mobile: "",
        cardNo: "",
        weChat: "",
        qq: "",
      },
      authItem: [
        { key: "realName", label: lang("姓名"), type: "text" },
        { key: "mobile", label: lang("电话"), type: "number" },
        { key: "cardNo", label: lang("银行卡号"), type: "number" },
        { key: "weChat", label: lang("微信"), type: "text" },
        { key: "qq", label: "QQ", type: "number" },
      ],
      getAuthData: {},
      authLoading: false,
      authDisable: true,
      agentLevelList: [],
      banktableCrPayAddresslist: [],
      isSave: false,
      editAccountVisible: false,
      accountForm: {},
      accountRules: {
        type: [{required: true,message:lang('请选择类型'),trigger:'blur'}],
      },
      onceAccountClick: false,
      payIdShow: false,
      mobileAreaCodeList: [],
      isAutomaticDelete: 1,
    }
  },
  created() {
    this.initData();
  },
  computed: {
    accountCheck() {
      const { bonusAmounts, bonusAmountTotal, amounts, offlinedepositAmounts, onlinedepositAmounts, withdrawdrawingAmounts, adjustment } = this.fundTotal
      const { payout } = this.betTotal
      const total = bonusAmounts + bonusAmountTotal + amounts + offlinedepositAmounts + onlinedepositAmounts + payout - withdrawdrawingAmounts + adjustment
      return total.toFixed(2)
    },
    bankRules() {
      const { areaCode, bankType, province, city, walletAddress } = this.bankForm
      const cityValidator = (rule, value, callback) => {
        if (!province) return callback(this.$t('请选择省份'))
        if (!city) return callback(this.$t('请选择城市'))
        callback()
      }
      const isMY = areaCode === 'MY'
      const isVN = areaCode === 'VN'
      const isAUD = areaCode === 'AUD'
      const cardNoV = (rule, value, callback) => {
        const isBank = bankType === 1
        const isZfb = bankType === 2
        const text = isMY ? 'MY' : isVN ? 'VN' : 'PAYID'
        if (!value) return callback(isBank ? this.$t('请输入银行卡号') : isZfb ? this.$t('请输入支付宝账号') : this.$t('请输入') + text)
        const len = value.length
        if (isMY || isAUD) {
          if(len < 1 || len > 60) return callback(this.$t('请输入1-60位'))
        } else if (isVN) {
          if(len < 6 || len > 20) return callback(this.$t('请输入6-20位'))
        } else {
          if (isBank && (len > 19 || len < 16)) return callback(this.$t('请输入16-19位'))
          if (!isBank && (len > 32 || len < 10)) return callback(this.$t('长度只能为10-32位'))
          if (!isBank && !isZfb && (len > 60)) return callback(this.$t('长度只能为1-60位'))
        }
        callback()
      }
      const walletAddress2V = (rule, value, callback) => {
        if (!value) return callback(this.$t('请确认钱包地址'))
        if (walletAddress !== value) return callback(this.$t('输入的钱包地址不一致'))
        callback()
      }
      const addressV = (rule, value, callback) => {
        if (isMY) return callback()
        const isBsb = areaCode === 'AUD' && bankType === 1
        if (!value) return callback(!isBsb ? this.$t('请输入支行名称') : this.$t('请输入BSB'))
        if (isBsb) {
          if (!/^\d{1,10}$/.test(value)) return callback('请输入1-10位数字')
        }
        callback()
      }
      return {
        bankType: [ { required: true, message: this.$t('请选择'), trigger: 'change' } ],
        cardNo: [ { required: true, validator: cardNoV, trigger: 'blur' } ],
        bankCardId: [ { required: true, message: this.$t('请选择'), trigger: 'change' } ],
        city: [ { required: true, validator: cityValidator, trigger: 'change' } ],
        address: [ { required: true, validator: addressV, trigger: 'blur' } ],
        currencyProtocol: [ { required: true, message: this.$t('请选择'), trigger: 'change' } ],
        walletId: [ { required: true, message: this.$t('请选择'), trigger: 'change' } ],
        walletAddress: [ { required: true, message: this.$t('请输入钱包地址'), trigger: 'blur' } ],
        walletAddress2: [ { required: true, validator: walletAddress2V, trigger: 'blur' } ]
      }
    },
    bankTitle() {
      return this.$t('新增银行卡')
    },
    permissions() {
      const { hasPermission } = this;

      const bankCardPerms = [
        "member:mbrbankcard:list",
        "member:mbrbankcard:info",
        "member:mbrbankcard:delete",
        "member:mbrbankcard:available",
      ];

      const crPayPerms = [
        "member:cryptocurrencies:list",
        "member:cryptocurrencies:info",
        "member:cryptocurrencies:delete",
        "member:cryptocurrencies:available",
      ];

      return {
        crPay: crPayPerms.some((p) => hasPermission(p)),
        bankCard: bankCardPerms.some((p) => hasPermission(p)),
      };
    },
    onlineTag() {
      return this.mbrAccount.isOnline ? "success" : "info";
    },
    valueFormat() {
      return "yyyy-MM-dd";
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
    loading() {
      return this.$store.state.searchLoading;
    },
    isOnline() {
      return this.mbrAccount.isOnline === 1 ? this.$t("是") : this.$t("否");
    },
    timeType() {
      return this.$store.state.timeType;
    },
    sToken() {
      return window.localStorage.getItem("SToken");
    },
    auditPass() {
      return this.isAuditPassed === false ? this.$t("不通过") : this.$t("通过");
    },
    isMobileChecked() {
      return this.mbrAccount.isVerifyMoblie === 1 ? `(${this.$t('已验证')})` : "";
    },
    isEmailChecked() {
      return this.mbrAccount.isVerifyEmail === 1 ? `(${this.$t('已验证')})` : "";
    },
    ...mapGetters(["hasPermission"]),
  },
  methods: {
    getMobileAreaCode() {
      this.$axios.GET(systemConfig.urls.getMobileAreaCode).then(({ res }) => {
        if (res) {
          this.mobileAreaCodeList = res.mobileAreaCodes
        }
      })
    },
    saveInfo(){
      this.mbrChangeKeys = [];
      const basicInfoMapper = {
        realName: this.$t("姓名"),
        email: this.$t("邮箱"),
        weChat: this.$t("微信"),
        mobile: this.$t("电话"),
        mobileAreaCode: this.$t("区号"),
        qq: "QQ",
        gender: this.$t("性别"),
        birthday: this.$t("出生日期"),
      };
      const accountInfoMapper = {
        groupId: this.$t("会员组"),
        available: this.$t("状态"),
        tagencyId: this.$t("总代"),
        cagencyId: this.$t("代理"),
        actLevelId: this.$t("会员星级"),
      };
      const { mbrAccount, mbrAccountPost, accountInfo, qtzl, mobileAreaCodeList } = this;
      const { mobileAreaCode, mobile } = mbrAccountPost
      if (mobileAreaCode && mobile) {
        const currentLengthLimit = mobileAreaCodeList.find(v => v.mobileAreaCode === mobileAreaCode)
        const { maxlen, minlen } = currentLengthLimit
        if (mobile.length < minlen || mobile.length > maxlen) {
          const numLimit = Number(minlen) === Number(maxlen) ? minlen : minlen + '~'  + maxlen
          this.$message.error(this.$t('当前电话号长度不在有效范围内') + '(' + numLimit + this.$t('位') + ')')
          return
        }
      }
      const arr = [];
      for (let i in basicInfoMapper) {
        if (mbrAccount[i] !== mbrAccountPost[i]) {
          this.shouldBasicInfoBeSave = true;
          arr.push(basicInfoMapper[i]);
        }
      }

      for (let i in accountInfoMapper) {
        if (accountInfo[i] !== qtzl[i]) {
          this.shouldAccountInfoBeSave = true;
          arr.push(accountInfoMapper[i]);
        }
      }
      this.controlAudit.map((ws,index)=>{
        if(ws.label===this.$t('会员标签')){
          if(ws.count!==this.controlAudit0[index].count){
            this.shouldAuditInfoBeSave = true;
            arr.push(this.$t('会员标签'))
          }
        }
      })
      // 入款防刷-单独处理
      if (mbrAccount.depositLock !== mbrAccountPost.depositLock) {
        this.shouldDepositLockBeSave = true;
        arr.push(this.$t("入款防刷"));
      }
      // 代理会员级别-单独处理
      if (mbrAccount.agyLevelId !== mbrAccountPost.agyLevelId) {
        this.shouldAgyLevelIdBeSave = true;
        arr.push(this.$t("代理会员级别"));
      }

      arr.map((val) => {
        for (let key in basicInfoMapper) {
          if (val == basicInfoMapper[key]) {
            this.mbrChangeKeys.push(key);
          }
        }
      });
      if (arr.length) {
        this.confirmTips = arr.join("、");
        this.isConfirmSaveShow = true;
      }
    },
    handleBankSubmit() {
      const submit = async () => {
        const { bankType, currencyProtocol, walletAddress, walletId } = this.bankForm
        const isUsdt = bankType === 3
        const url = this.$urls.memberDetail[isUsdt ? 'cryptoCurrenciesSave' : 'saveBankCard']
        let data
        if (isUsdt) {
          const walletName = (this.walletsList.find(i => i.id === walletId) || {}).name
          data = {
            accountId: this.id,
            currencyCode: 'USDT',
            currencyProtocol,
            walletAddress,
            walletId,
            walletName
          }
        } else {
          data = { accountId: this.id, ...this.bankForm ,realName: this.mbrAccountPost.realName}
        }
        this.bankSumbitLoading = true
        const { res } = await this.$axios.POST(url, data)
        this.bankSumbitLoading = false
        if (res) {
          this.$message.success(this.$t('操作成功'))
          this.handleInitData()
        }
      }
      this.$refs.bankForm.validate(isOk => isOk && submit())
    },
    handleCloseDialog() {
      this.handleInitData()
    },
    handleInitData() {
      this.showAddBank = false
      setTimeout(() => {
        this.bankForm = this.$options.data().bankForm
      }, 200)
    },
    handleAreaCodeChange() {
      this.$refs.bankForm.clearValidate()
      this.bankForm.bankType = 1
      this.getBankInitData()
    },
    handleTypeChange() {
      this.$refs.bankForm.clearValidate()
      this.getBankInitData()
    },
    handleShowBank() {
      this.showAddBank = true
      this.getBankInitData()
    },
    getBankInitData() {
      const { bankType } = this.bankForm
      if (bankType === 1) {
        this.getBanks()
        this.getProvs()
      }
      if (bankType === 3) {
        this.cryptoCurrenciesList()
      }
    },
    handleProvChange() {
      this.bankForm.city = null
      this.getCitys()
    },
    async cryptoCurrenciesList() {
      const { res } = await this.$axios.GET(this.$urls.memberDetail.cryptoCurrenciesList)
      if (res) {
        this.walletsList = res.cryptoCurrenciesList
      }
    },
    async getCitys() {
      const { province: prov } = this.bankForm
      const { res } = await this.$axios.GET(this.$urls.memberDetail.getCitys, { prov })
      if (res) {
        this.citiysList = res.citys
      }
    },
    async getProvs() {
      const { res } = await this.$axios.GET(this.$urls.memberDetail.getProvs)
      if (res) {
        this.provsList = res.provs
      }
    },
    async getBanks() {
      const { areaCode } = this.bankForm
      const { res } = await this.$axios.GET(this.$urls.memberDetail.getBanks, { areaCode })
      if (res) {
        this.banksList = res.banks.filter(i => i.bankName !== this.$t('支付宝'))
      }
    },
    getTagflagList() {
      this.$axios.get(systemConfig.urls.mbrlabelList).then(({ data }) => {
        if(data.code === 0) {
          this.tagList = data.page.map(item => ({ label: item.name, value: item.id }));
        }
      }).catch((error) => {
        // 因为运营反馈此接口时常会有请求失败的情况，所以在失败时再尝试多请求一次，就多一次尝试就好，不需要递归
        setTimeout(() => {
          this.$axios.get(systemConfig.urls.mbrlabelList).then(({ data }) => {
            if(data.code === 0) {
              this.tagList = data.page.map(item => ({ label: item.name, value: item.id }));
            }
          })
        }, 2000)
      })
    },
    handlePhoneRecord() {
      this.showPhoneRecord = true
      this.getPhoneRecord()
    },
    async getPhoneRecord() {
      const { pageNo, pageSize } = this.phoneReaord
      const params = {
        pageNo,
        pageSize
      }
      this.phoneReaord.loading = true
      const { res } = await this.$axios.GET(`${this.$urls.accountMobileList}/${this.id}`, params)
      this.phoneReaord.loading = false
      if (res) {
        const { list, totalCount } = res.page
        this.phoneReaord.list = list
        this.phoneReaord.totalCount = totalCount
      }
    },
    changeLockStatus() {
      const params = {
        id: this.id,
        loginLock: 0,
      };
      this.$axios
        .get(systemConfig.urls.loginLockUpdate, { params })
        .then(() => {
          this.getInfo(this.id);
        });
    },
    getMoment(val) {
      if (!val) return;
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    birChange(val) {
      this.mbrAccountPost.birthday = val ? val : "";
    },
    sexChange(val) {
    },
    initData() {
      this.id = this.$route.query.id;
      this.getName = this.$route.query.loginName;
      this.$store.state.indexActive = "3-1-1";
      this.getTagflagList()
      this.getAgyAccount("", false, true);
      this.getInfo(this.id);
      this.fnGroup();
      this.fnbankcard();
      this.fnprovlist();
      // this.getWhiteSheet()
      this.tabClick("first");
      // this.queryAccountAuditList(this.id)
      this.getMemoList();
      this.getDepotOperatList();
      this.getMemberLevelList();
      this.getRecommendAccountList();
      //this.getAuditStatus()
      /*权限初始化*/
      const initLocalAuthData = JSON.parse(JSON.stringify(localAuthData));
      this.hyzl = initLocalAuthData.memberList.hyzl;
      this.qtzlNew = initLocalAuthData.memberList.qtzlNew;
      this.fksh = initLocalAuthData.memberList.fksh;
      this.zcxx = initLocalAuthData.memberList.zcxx;
      this.otherAll = initLocalAuthData.memberList.otherAll;
      this.initAuth();
      this.getUserStatusChange();
      this.getAgentLevelList();
      this.getMobileAreaCode()
    },
    angleHide() {
      this.angleShow = false;
      /* this.faAgentId=this.qtzl.tagencyId;
        this.childAgentId=this.qtzl.cagencyId */
    },
    angleUpdate() {
      const { id, childAgentId, supLoginName } = this;
      const updateMethod = () => {
        let params = {
          id,
          supLoginName,
          cagencyId: childAgentId,
        };

        this.$axios
          .post(systemConfig.urls.updateAccountAgent, params)
          .then((res) => {
            if (res) {
              this.angleShow = false;
              this.$message({
                type: "success",
                message: this.$t("代理/推荐人编辑成功"),
              });
              //this.initData();
              this.getInfo(this.id);
            }
          });
      };

      if (!childAgentId) {
        this.$message({
          type: "warning",
          message: this.$t("代理不可为空"),
        });
        return;
      }

      if (supLoginName) {
        this.$axios
          .get(systemConfig.urls.bonusList.findOneMbrLevelAndAgyInfo, {
            params: {
              loginName: supLoginName,
            },
          })
          .then(({ data }) => {
            if (data.data) {
              updateMethod();
            } else {
              this.$message({
                type: "error",
                message: this.$t("推荐人不存在"),
              });
            }
          });
      } else {
        updateMethod();
      }
    },
    // 获取加密货币存款钱包地址
    async getQueryAddress() {
      this.bankCardLoading = true
      const { res } = await this.$axios.GET(this.$urls.queryAddress, { userId: this.id })
      this.bankCardLoading = false
      if (res) {
        const data = res.data
        const obj = {
          ERC: {
            link: "https://etherscan.io",
            name: `${this.$t("以太坊")}(ERC20)`
          },
          TRC: {
            link: "https://tronscan.org",
            name: `${this.$t("波场")}(TRC20)`
          }
        };
        data.map((item) => {
          item.link = obj[item.type].link
          item.name = obj[item.type].name
        });
        this.banktableCrPayAddresslist = data
      }
    },
    angleEdit() {
      this.angleShow = true;
      this.faAgentId = this.qtzl.tagencyId || "";
      this.childAgentId = this.qtzl.cagencyId || "";
      this.supLoginName = this.mbrAccount.referrer || "";
    },
    getUserStatusChange() {
      this.$axios
        .get(systemConfig.urls.memberLevel.viewData + "/" + this.id)
        .then((res) => {
          this.specialValues = res.data.viewData;
        });
    },
    toggleMemberActivityLock() {
      const isActivityLock = this.qtzl.isActivityLock ? 0 : 1;
      this.$axios
        .post(systemConfig.urls.memberLevel.activityLock, {
          id: Number(this.id),
          isActivityLock,
        })
        .then((res) => {
          this.qtzl.isActivityLock = isActivityLock;
        });
    },
    getMemberLevelList() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then((res) => {
        this.memberLevelList = res.data.data;
      });
    },
    saveEditedContent() {
      const arr = [];
      if (this.shouldBasicInfoBeSave) {
        arr.push(this.mbrPostSubmit());
      }
      if (this.shouldAccountInfoBeSave) {
        arr.push(this.otherInfoPostSubmit());
      }
      if (this.shouldDepositLockBeSave) {
        arr.push(this.updateDepositLock());
      }
      if (this.shouldAgyLevelIdBeSave) {
        arr.push(this.updateMbrAgentLevel())
      }
      if(this.shouldAuditInfoBeSave){
        arr.push(this.auditTagInfo())
      }
      Promise.all(arr).then((res) => {
        if (res.indexOf(undefined) === -1) {
          // this.savingCompeleteHook();
          this.$message({
            type: "success",
            message: this.$t("编辑个人信息成功"),
          });
          this.isConfirmSaveShow = false;
          this.initData();
        } else {
          this.isConfirmSaveShow = false;
        }
      });
    },
    hideSx(index) {
      if (index == this.isHide) {
        this.isHide = 100;
        return;
      }
      this.isHide = index;
    },

    initAuth() {
      this.getDetailauth();
    },

    /*新版权限*/
    getDetailauth() {
      this.$axios
        .get(systemConfig.urls.memberListInitAuthGetDetail)
        .then((res) => {
          this.comData = res.data.items;
          this.pareData(this.hyzl, res.data.items, true);
          this.pareData(this.qtzlNew, res.data.items, true);

          this.pareData(this.fksh, res.data.items, true);
          this.pareData(this.zcxx, res.data.items, true);
          this.pareData(this.otherAll, res.data.items, true).then(() => {
            this.queryAccountAuditList(this.id);
          });
          this.mbrPostEdit();
          this.otherInfoPostEdit();
        });
    },

    resetMemberGoogle() {
      const params ={
        id: this.id
      }
      this.$axios
        .get(systemConfig.urls.resetMemberGoogle, { params })
        .then(res => {
          const { msg, code } = res.data
          code === 0 && this.$message.success(msg)
        })
    },

    Trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    /*根据name比对，隐藏和显示对应字段*/
    pareData(localData, getData, ifx) {
      return new Promise((resolve, reject) => {
        for (var k in localData) {
          for (var i = 0; i < getData.length; i++) {
            if (this.Trim(localData[k].key) == getData[i].columnKey) {
              this.$set(localData[k], "ok", true);

              /*具体的字段是否需要修改权限*/

              /* true 为禁用 false 可编辑*/

              // if (localData[k].meta == true) {
              //   this.$set(localData[k], 'ok', true)
              // }
              if (ifx) {
                if (localData[k].meta == true) {
                  this.$set(localData[k], "ok", true);
                }
              } else {
                if (localData[k].meta == true) {
                  this.$set(localData[k], "ok", false);
                }
              }
            }
          }
        }
        resolve();
      });
    },

    /*新版权限*/

    //改版开始
    handleCrPaySizeChange(val) {
      this.crPayPager.pageNo = 1;
      this.crPayPager.pageSize = val;
      this.getBankCardOrCrPay();
    },
    handleCrPayCurrentChange(val) {
      this.crPayPager.pageNo = val;
      this.getBankCardOrCrPay();
    },
    handleControlAuditSizeChange(val) {
      this.auditPageNo = 1;
      this.auditPageSize = val;
      this.viewControl(this.controlData, true);
    },
    handleControlAuditCurrentChange(val) {
      this.auditPageNo = val;
      this.viewControl(this.controlData, true);
    },
    handleSizeDepotPageChange(val) {
      this.depotPageNo = 1;
      this.depotPageSize = val;
      this.getDepotOperatList();
    },
    handleNoDepotPageChange(val) {
      this.depotPageNo = val;
      this.getDepotOperatList();
    },
    sliceStr(str) {
      if (str.length > 60) {
        return str.slice(0, 60) + "...";
      } else {
        return str;
      }
    },
    getAuditStatus() {
      let url = "?accountId=" + this.id;
      this.$axios.get(systemConfig.urls.audtiStatus + url).then((resp) => {
        this.isAuditPassed = resp.data.data.isPassed;
      });
    },
    fixedTwo(val) {
      return systemConfig.saveTwoNumber(val);
    },
    forceLogout(scope) {
      let url = "?accountId=" + this.id + "&platformId=" + scope.row.platformId;
      this.$axios
        .post(systemConfig.urls.depotOperatLogout + url)
        .then((resp) => {
          this.$message({
            type: "success",
            message: this.$t("强制退出成功"),
          });
        });
    },
    forceLock(scope) {
      let url = "?accountId=" + this.id + "&platformId=" + scope.row.platformId;
      this.$axios.post(systemConfig.urls.depotOperatLock + url).then((resp) => {
        this.$message({
          type: "success",
          message: this.$t("强制锁定成功"),
        });
      });
    },
    refreshMonney(scope) {
      this.$store.state.searchLoading = true;
      let url = "?accountId=" + this.id + "&platformId=" + scope.row.platformId;
      this.$axios.post(systemConfig.urls.flushBalance + url).then((resp) => {
        this.$message({
          type: "success",
          message: this.$t("余额刷新成功"),
        });
        scope.row.balance = resp.data.data;
      });
    },
    getRecommendAccountList() {
      this.$axios
        .get("bkapi/member/mbraccount/recommendAccounts", {
          params: { accountId: this.id },
        })
        .then((res) => {
          if (res) {
            this.recommendAccountList = res.data.data;
          }
        });
    },
    getDepotOperatList() {
      this.$store.state.searchLoading = true;
      let url =
        "?accountId=" +
        this.id +
        "&pageNo=" +
        this.depotPageNo +
        "&pageSize=" +
        this.depotPageSize;
      this.$axios.get(systemConfig.urls.depotOperatList + url).then((resp) => {
        let obj = resp.data.data;
        obj.list = obj.list.filter((item) => !!item);
        this.gameData = obj;
      });
    },
    viewControl(obj, flag) {
      this.controlData = obj;
      if (!flag) {
        this.auditPageNo = 1;
      }
      this.controlAuditShow = true;
      const add = {
        label: this.$t("上级代理"),
        prop: "agyAccount",
      };
      const arr = JSON.parse(JSON.stringify(this.basicColumn));
      if (obj.registerIp !== "sameRealName") arr.splice(0, 0, add);
      switch (obj.registerIp) {
        case "registerIp":
          this.auditTitle = `${this.$t("风控审核")}--${this.$t('同注册IP')})`;
          this.columnArr = arr.concat({ label: this.$t("同注册IP"), prop: "item" });
          break;
        case "loginIp":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同登录IP');
          this.columnArr = arr.concat({ label: this.$t("同登录IP"), prop: "item" });
          break;
        case "agent":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同一代理');
          this.columnArr = this.basicColumn.concat({
            label: this.$t("同一代理"),
            prop: "item",
          });
          break;
        case "email":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同一邮箱');
          this.columnArr = this.basicColumn.concat({
            label: this.$t("同一邮箱"),
            prop: "item",
          });
          break;
        case "qq":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同一QQ');
          this.columnArr = this.basicColumn.concat({
            label: this.$t("同一QQ"),
            prop: "item",
          });
          break;
        case "deviceUuid":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同一设备');
          const conArr = [ { label: this.$t("同一设备"), prop: "item" }, { label: this.$t('登录时间'), prop: 'createtime' } ]
          this.columnArr = arr.concat(conArr);
          break;
        case "sameRealName":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('同姓名');
          this.columnArr = arr.concat({ label: this.$t("同姓名"), prop: "item" });
          break;
        case "labelid":
          this.auditTitle = this.$t("风控审核") + '--' + this.$t('会员标签');
          this.columnArr = arr.concat({ label: this.$t("会员标签"), prop: "item" });
          break;
      }
      const isDeviceUuid = obj.registerIp === 'deviceUuid'
      let url =
        "?accountId=" +
        this.id +
        "&keys=" +
        obj.registerIp +
        "&item=" +
        (!isDeviceUuid ? obj.item : null) +
        "&pageNo=" +
        this.auditPageNo +
        "&pageSize=" +
        this.auditPageSize;

      this.$axios
        .get(systemConfig.urls.queryAccountAuditInfo + url)
        .then((resp) => {
          this.controlAuditData = resp.data.data;
        });
    },
    viewControlCancel() {
      this.controlAuditShow = false;
      this.controlAuditData = {};
    },
    /*风控审核*/
    queryAccountAuditList(id) {
      this.$axios
        .get(systemConfig.urls.queryAccountAuditList + "?accountId=" + id)
        .then((resp) => {
          let arr = resp.data.data;
          // 给arr 加上 label和 ok
          let values = Object.values(this.fksh);
          const newArr = [];
          values.forEach((val) => {
            var item = arr.find((x) => x.registerIp === val.controlMatch);
            if (!item) return;
            item["label"] = val.label;
            item["ok"] = val.ok;
            newArr.push(item);
          });
          this.controlAudit0 = [].concat(JSON.parse(JSON.stringify(newArr)))
          this.controlAudit = newArr;
        });
    },
    fiveItemChange1(obj) {
      if (obj.logDto) {
        return obj.logDto.item;
      } else {
        return "";
      }
    },
    fiveItemChange2(obj) {
      if (obj.logDto) {
        return obj.logDto.beforeChange;
      } else {
        return "";
      }
    },
    fiveItemChange3(obj) {
      if (obj.logDto) {
        return obj.logDto.afterChange;
      } else {
        return "";
      }
    },
    fiveItemChange4(obj) {
      if (obj.logDto) {
        return obj.logDto.status;
      } else {
        return "";
      }
    },
    sendMessage() {
      this.sendMessageShow = true;
      this.messagePost.inputName = this.getName;
    },
    sendMessageSubmit() {
      if (!this.messagePost.inputTextarea) {
        this.$message({
          type: "warning",
          message: this.$t("站内信内容不能为空"),
        });
        return;
      }
      const savaData = new FormData();
      // debugger
      savaData.append("isSign", 1);
      savaData.append("isAutomaticDelete", 1);
      savaData.append("loginNameList", this.messagePost.inputName);
      savaData.append(
        "textContent",
        `<p>${this.messagePost.inputTextarea}</p>`
      );
      this.$store.state.fullscreenLoading = true;
      this.$axios
        .post(systemConfig.urls.messageBoard.sendMessage, savaData)
        .then((resp) => {
          this.$message({
            message: this.$t("成功增加站内信"),
            type: "success",
          });
          this.sendMessageCancel();
        });
    },
    sendMessageCancel() {
      this.sendMessageShow = false;
      this.messagePost = {};
    },
    statusFilter2(obj) {
      switch (obj.status) {
        case 0:
          return this.$t("拒绝");
        case 1:
          return this.$t("通过");
        case 2:
          return this.$t("待处理");
        case 3:
          return this.$t("出款中");
        case 4:
          return this.$t("人工审核中");
        case 5:
          return this.$t("自动出款中");
        case 6:
          return this.$t("需求待定");
        case 7:
          return this.$t("失败");
        case 8:
          return this.$t("会员出款待定");
        case 9:
          return this.$t("会员取消");
        default:
          return "";
      }
    },
    statusFilter3(obj) {
      switch (obj.status) {
        case 0:
          return this.$t("拒绝");
        case 1:
          return this.$t("通过");
        case 2:
          return this.$t("待处理");
        default:
          return "";
      }
    },
    // 获取返利类型
    getType(type) {
      switch(type) {
        case 3:
          return this.$t('首存返利')
        case 4:
          return this.$t('投注返利')
        case 5:
          return this.$t('VIP返利')
        case 6:
          return this.$t('充值返利')
        default:
          return ''
      }
    },
    transformFilter(obj) {
      if (obj.opType === 0) {
        return this.$t("主账户");
      } else {
        return obj.depotName;
      }
    },
    transformFilter2(obj) {
      if (obj.opType === 0) {
        return obj.depotName;
      } else {
        return this.$t("主账户");
      }
    },
    amountFilter1(obj) {
      if (obj.beforeBalance || obj.afterBalance) {
        if (obj.opType === 0) {
          return obj.beforeBalance + ">>>" + obj.afterBalance;
        } else {
          return obj.beforeBalance + ">>>" + obj.afterBalance;
        }
      } else {
        return this.$t("无");
      }
    },
    amountFilter2(obj) {
      if (
        (obj.financialCode === "BI" || obj.financialCode === "BO") &&
        (obj.depotBeforeBalance || obj.depotAfterBalance)
      ) {
        if (obj.opType === 0) {
          return obj.depotBeforeBalance + ">>>" + obj.depotAfterBalance;
        } else {
          return obj.depotBeforeBalance + ">>>" + obj.depotAfterBalance;
        }
      } else {
        return this.$t("无");
      }
    },
    // 会员日志的分页事件
    handleSizePageChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.tabClick(this.activeName, true);
    },
    handleNoPageChange(val) {
      this.listReq.pageNo = val;
      this.tabClick(this.activeName, true);
    },
    // 详细备注的分页事件
    handleMemoSizeChange(val) {
      this.memoPageNo = 1;
      this.memoPageSize = val;
      this.getMemoList();
    },
    handleMemoCurrentChange(val) {
      this.memoPageNo = val;
      this.getMemoList();
    },
    memoTabClick(tab, flag) {
      this.memoActiveName = tab;
      this.memotable = {};
      if (!flag) {
        this.memoPageNo = 1;
      }
      this.getInnerMemoList(tab);
    },
    tabClick(tab, flag) {
      this.activeName = tab;
      this.memberData = {
        list: [],
        totalCount: 0
      };
      if (!flag) {
        this.listReq.pageNo = 1;
      }
      let url = "";
      let needLoginName = false
      switch (tab) {
        case "first":
          url = systemConfig.urls.fundList;
          break;
        case "second":
          url = systemConfig.urls.manageList;
          break;
        case "third":
          url = systemConfig.urls.depositList;
          break;
        case "four":
          url = systemConfig.urls.withdrawList;
          break;
        case "five":
          url = systemConfig.urls.memberDetailBonusList;
          break;
        case "six":
          url = systemConfig.urls.accountLogList;
          break;
        case "seven":
          url = systemConfig.urls.logLoginRecord;
          break;
        case "eight":
          url = systemConfig.urls.taskList;
          break;
        case 'nine':
          url = systemConfig.urls.incomeLogList
          needLoginName = true
          break
      }
      this.$store.state.searchLoading = true;
      url +=
        "?accountId=" +
        this.id +
        "&pageSize=" +
        this.listReq.pageSize +
        "&pageNo=" +
        this.listReq.pageNo;
      url = needLoginName ? url + '&loginName=' + this.specialValues.loginName : url
      this.$axios.get(url).then((resp) => {
        this.memberData = resp.data.page;
      });
    },

    mbrPostEdit() {
      this.secondEdit = true;
      this.pareData(this.hyzl, this.comData, false);
    },
    mbrPostSubmit() {
      if (this.mbrAccountPost.realName !== this.mbrAccount.realName) {
        if (
          (this.mbrAccountPost.realName &&
          !systemConfig.rules.commonRule.realNameContainEnglishAndVietnamName[1].pattern.test(
            this.mbrAccountPost.realName
          ) || !this.mbrAccountPost.realName)
        ) {
          this.$message({
            type: "warning",
            message: this.$t("请输入正确的真实姓名"),
          });
          return;
        }
      }
      if (
        this.mbrAccountPost.mobile !== this.mbrAccount.mobile ||
        this.mbrAccountPost.mobileAreaCode !== this.mbrAccount.mobileAreaCode
      ) {
        let bool = true;
        const mobileAreaCode = this.mbrAccountPost.mobileAreaCode;
        const mobile = this.mbrAccountPost.mobile;
        if (mobileAreaCode === "86" && mobile) {
          bool = systemConfig.rules.memberInfoRule.mobile[1].pattern.test(
            mobile
          );
        }
        if (mobileAreaCode === "886" && mobile) {
          bool = systemConfig.rules.memberInfoRule.taiWanMobile[1].pattern.test(
            mobile
          );
        }
        if (!bool) {
          this.$message({
            type: "warning",
            message: this.$t("请输入正确的电话"),
          });
          return;
        }
      }

      if (this.mbrAccountPost.email !== this.mbrAccount.email) {
        if (
          this.mbrAccountPost.email &&
          !systemConfig.rules.memberInfoRule.email[1].pattern.test(
            this.mbrAccountPost.email
          )
        ) {
          this.$message({
            type: "warning",
            message: this.$t("请输入正确的邮箱"),
          });
          return;
        }
      }

      if (this.mbrAccountPost.qq !== this.mbrAccount.qq) {
        if (
          this.mbrAccountPost.qq &&
          !systemConfig.rules.memberInfoRule.qq[1].pattern.test(
            this.mbrAccountPost.qq
          )
        ) {
          this.$message({
            type: "warning",
            message: this.$t("QQ号应为5~15位数字"),
          });
          return;
        }
      }

      if (this.mbrAccountPost.weChat !== this.mbrAccount.weChat) {
        if (
          this.mbrAccountPost.weChat &&
          !systemConfig.rules.memberInfoRule.wechat[1].pattern.test(
            this.mbrAccountPost.weChat
          )
        ) {
          this.$message({
            type: "warning",
            message: this.$t("微信号应为在5~20位字母、数字、下划线或组合"),
          });
          return;
        }
      }

      this.$store.state.fullscreenLoading = true;
      //this.mbrAccountPost.id = this.id
      let data = JSON.parse(JSON.stringify(this.mbrAccountPost));
      let postData = {};
      for (const key in data) {
        this.mbrChangeKeys.forEach((val) => {
          if (val == key) {
            postData[key] = data[key];
          }
        });
      }
      if (postData.mobile) {
        // 特殊处理，如果号码改变，且满足条件，则带上区域
        postData.mobileAreaCode = this.mbrAccountPost.mobileAreaCode;
      }
      postData.id = this.id;
      return this.$axios
        .post(systemConfig.urls.memberInfoSave, postData)
        .then((res) => {
          return res;
        });
    },
    auditTagInfo(){
      this.$store.state.fullscreenLoading = true;
      let item = this.controlAudit.filter((v)=>{return v.label===this.$t("会员标签")})
      let { tagencyId, cagencyId } = this.specialValues;
      this.$axios
        .post(systemConfig.urls.otherInfoPost, Object.assign(this.qtzl, {
          tagencyId,
          cagencyId,
        },{labelid: item[0].count}))
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("编辑个人信息成功"),
          });
          this.memberInfoShow = false;
          this.getInfo(this.id);
          this.initAuth();
        });
    },
    mbrPostCancel() {
      this.secondEdit = false;
      this.pareData(this.hyzl, this.comData, true);
      /*取消的时候已经修改的数据需要初始化*/
      // this.huxx(this.id)
    },
    updateDepositLock() {
      const postData = {
        id: this.id,
        depositLock: this.mbrAccountPost.depositLock,
      };
      return this.$axios
        .post(systemConfig.urls.updateDepositLockStatus, postData)
        .then((res) => {
          return res;
        });
    },
    updateMbrAgentLevel() {
      const postData = {
        id: this.id,
        agyLevelId: this.mbrAccountPost.agyLevelId,
      };
      return this.$axios
        .post(systemConfig.urls.updateMbrAgentLevel, postData)
        .then((res) => {
          return res;
        });
    },
    otherInfoPostEdit() {
      this.thirdEdit = true;
      this.pareData(this.qtzlNew, this.comData, false);
    },
    otherInfoPostSubmit() {
      /* if (!this.qtzl.cagencyId) {
          this.$message({
            type: 'warning',
            message: '提交的信息不能为空'
          })
          return
        } */
      this.$store.state.fullscreenLoading = true;
      let { tagencyId, cagencyId } = this.specialValues;
      return this.$axios
        .post(
          Object.assign(systemConfig.urls.otherInfoPost),
          Object.assign(this.qtzl, {
            tagencyId,
            cagencyId,
          })
        )
        .then((res) => {
          return res;
        });
    },
    otherInfoPostCancel() {
      this.thirdEdit = false;
      this.pareData(this.qtzlNew, this.comData, true);
      /*取消的时候 总代 子代 已经修改的数据需要初始化*/
      this.qtzlData(this.id);
    },
    // 注册时间转换 最后登录时间转换
    time1(time) {
      if (time) {
        return systemConfig.transferTimeByType(time, this.timeType);
      } else {
        return "";
      }
    },
    //改版结束
    operateCancel() {
      this.innerVisible = false;
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    filterTag(value, row) {
      return row.available === value;
    },

    handleLoginSizeChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.loginrecord();
    },
    handleLoginCurrentChange(val) {
      this.listReq.pageNo = val;
      this.loginrecord();
    },
    statusFilter(status) {
      if (status === 0) {
        return this.$t("禁用");
      } else if (status === 1) {
        return this.$t("启用");
      } else {
        return this.$t("余额冻结");
      }
    },
    getWhiteSheet() {
      this.$axios
        .get(systemConfig.urls.findFundWhiteListOne + this.id)
        .then((resp) => {
          this.isWhiteSheet = !!resp.data.data;
          if (resp.data.data) {
            this.whiteShetData = resp.data.data;
            this.isWhiteSheet = true;
          } else {
            this.isWhiteSheet = false;
          }
        });
    },
    openWhiteSheet() {
      this.whiteSheetDialogShow = true;
    },
    closeWhiteSheet() {
      this.whiteSheetDialogShow = false;
      this.whiteSheetMemo = "";
    },
    saveWhiteSheet() {
      // if (!this.whiteSheetMemo) {
      //   this.$message({
      //     type: 'warning',
      //     message: this.$t('备注信息不能为空')
      //   })
      //   return
      // }
      // this.$store.state.fullscreenLoading = true
      // let data = {'accountId': this.id, 'memo': this.whiteSheetMemo}
      // this.$axios.post(systemConfig.urls.addFundWhiteList, data).then(resp => {
      //   this.$message({
      //     type: 'success',
      //     message: this.$t('加入白名单成功')
      //   })
      //   this.whiteSheetMemo = ''
      //   this.whiteSheetDialogShow = false
      //   this.isWhiteSheet = true
      //   this.getWhiteSheet()
      // })
    },
    removeWhiteSheet() {
      // this.$store.state.fullscreenLoading = true
      // this.$axios.get(systemConfig.urls.deleteFundWhiteList + this.whiteShetData.id).then(resp => {
      //   this.$message({
      //     type: 'success',
      //     message: this.$t('移出白名单成功')
      //   })
      // })
      // this.isWhiteSheet = false
    },
    timeFilter(str) {
      return systemConfig.timeFilter(str);
    },
    loginrecord() {
      this.loginrecordShow = true;
      this.$axios
        .get(systemConfig.urls.logLoginRecord + this.id, {
          params: {
            pageSize: this.listReq.pageSize,
            pageNo: this.listReq.pageNo,
          },
        })
        .then((res) => {
          this.logintablelist = res.data.page.list;
          this.logRecordTotal = res.data.page.totalCount;
        });
    },
    deleteMemo(ids) {
      this.$axios
        .post(systemConfig.urls.mbrMemoDelete, {
          ids,
        })
        .then(() => {
          this.handleMemoCurrentChange(1);
        });
    },
    memoadd() {
      this.mbrMemo.oprUserName = this.$store.state.user.username;
      this.mbrMemo.oprRoleName = this.$store.state.user.roleName;
      this.mbrMemo.accountId = this.id;
      this.mbrMemo.memoTime = systemConfig.transferTimeByType(
        systemConfig.getToday() + " " + systemConfig.getHourMinuteSecond(),
        this.timeType
      );
      this.mbrmemoaddshow = true;
    },
    savememo() {
      this.$refs.addMemo.validate((valid) => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          this.$axios
            .post(
              this.mbrMemo.id
                ? systemConfig.urls.mbrMemoUpdate
                : systemConfig.urls.mbrMemoSave,
              this.mbrMemo
            )
            .then((res) => {
              this.mbrmemoaddshow = false;
              if (this.mbrMemo.id) {
                this.$message({
                  type: "success",
                  message: this.$t("更新成功"),
                });
              } else {
                this.$message({
                  type: "success",
                  message: this.$t("保存成功"),
                });
              }
              this.getMemoList();
            });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("请填写完整的信息"),
          });
        }
      });
    },
    memoshow() {
      this.mbrmemoshow = true;
      this.getInnerMemoList("");
      this.memoActiveName = "";
    },
    getInnerMemoList(roleId) {
      let url =
        "?accountId=" +
        this.id +
        "&pageNo=" +
        this.memoPageNo +
        "&pageSize=" +
        this.memoPageSize +
        "&roleId=" +
        roleId;
      this.$axios.get(systemConfig.urls.innerMemoList + url).then((res) => {
        this.memotable = res.data.page.sortPage;
        this.sortTitle = res.data.page.sort;
      });
    },
    getMemoList() {
      this.$axios
        .get(systemConfig.urls.mbrMemoList, {
          params: {
            accountId: this.id,
            pageNo: this.memoPageNo,
            pageSize: this.memoPageSize,
          },
        })
        .then((res) => {
          this.memotable = res.data.page;
        });
    },
    bankcardAdd() {
      this.addbankview = true;
      this.bankfromtitle = this.$t("添加银行卡");
      this.mbrBankcard = {
        realName: this.mbrAccount.realName,
        available: 1,
      };
    },
    bankcardupdata(row) {
      this.addbankview = true;
      this.bankfromtitle = this.$t("编辑银行卡");
      this.mbrBankcard = row;
    },
    memberInfoCancel(formName) {
      this.memberInfoShow = false;
      this.resetForm(formName);
    },
    bankAddCancel(formName) {
      this.addbankview = false;
      this.resetForm(formName);
    },
    memoCancel(formName) {
      this.mbrmemoaddshow = false;
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    bankcarddelete(row) {
      this.$prompt(this.$t("您正在进行重要操作，请输入安全密码"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        inputType: "password",
      })
        .then(({ value }) => {
          this.$store.state.fullscreenLoading = true;
          this.$axios
            .post(systemConfig.urls.authPwd, { securepwd: value, id: this.id })
            .then((res) => {
              const urlMapper = {
                bankCard: systemConfig.urls.cardDelete,
                zfbRecord: systemConfig.urls.cardDelete,
                crPay: systemConfig.urls.memberCrDelete,
                otherPo: systemConfig.urls.cardDelete,
                electronicWallet: systemConfig.urls.cardDelete,
              };
              this.$axios
                .post(urlMapper[this.activeListView], { ids: [row.id] })
                .then((res) => {
                  this.$message({
                    type: "success",
                    message: this.$t("删除成功"),
                  });
                  this.getBankCardOrCrPay();
                  this.huxx(this.id);
                });
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: this.$t("取消输入"),
          });
        });
    },
    // 获取省份
    fnprovlist() {
      this.$axios.post(systemConfig.urls.listPro).then((res) => {
        res.data.provs.map((value) => {
          this.provlist.push({ value: value.prov });
        });
      });
    },
    // 获取市
    fncitylist(prov) {
      this.$set(this.mbrBankcard, "city", "");
      this.citylist = [];
      this.$axios
        .post(systemConfig.urls.listCity, { prov: prov })
        .then((res) => {
          res.data.citys.map((value) => {
            this.citylist.push({ value: value.city });
          });
        });
    },
    // 获取开户银行list
    fnbankcard() {
      console.log('1-------')
      this.$axios.post(systemConfig.urls.bankList).then((res) => {
        res.data.banks.map((value) => {
          this.bankList.push({ id: value.id, bankName: value.bankName });
        });
      });
    },
    saveNewBankcard() {
      this.mbrBankcard.accountId = this.id;
      this.mbrBankcard.bankName = this.bankList.find(
        (item) => item.id === this.mbrBankcard.bankCardId
      ).bankName;
      this.$refs.mbrBankcard.validate((valid) => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          this.$axios
            .post(
              this.mbrBankcard.id
                ? systemConfig.urls.bankCardUpdate
                : systemConfig.urls.bankCardSave,
              this.mbrBankcard
            )
            .then((res) => {
              this.addbankview = false;
              this.getBankCardOrCrPay();
              if (this.mbrBankcard.id) {
                this.$message({
                  type: "success",
                  message: this.$t("更新成功"),
                });
              } else {
                this.$message({
                  type: "success",
                  message: this.$t("保存成功"),
                });
              }
              //刷新个人数据
              this.huxx(this.id);
            });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("请填写正确的信息"),
          });
        }
      });
    },
    viewBankCardOrCrPay() {
      const { permissions } = this;
      this.activeListView = permissions.bankCard ? "bankCard" : "crPay";
      this.getBankCardOrCrPay();
    },
    handleTabClick() {
      this.crPayPager.pageNo = 1;
      this.banktablelist = [];
      if (this.activeListView === "crPayAddress") {
        // 获取加密货币存款钱包地址
        this.getQueryAddress();
        return;
      }
      this.getBankCardOrCrPay();
    },
    async getBankCardOrCrPay() {
      const { bankCardList: bankCard, memberCrList: crPay, historyList: bankCardRecord, otherPayAccountList: otherPo } = this.$urls
      const urlMapper = {
        bankCard,
        crPay,
        bankCardRecord,
        zfbRecord: bankCard,
        otherPo,
        electronicWallet: bankCard,
      };
      const activeListView = this.activeListView
      this.banklistview = true;
      const params = {
        pageSize: this.crPayPager.pageSize,
        pageNo: this.crPayPager.pageNo,
        userId: this.id,
      };
      if (['bankCard', 'zfbRecord', 'electronicWallet'].includes(activeListView)) {
        const o = {
          'bankCard': 1,
          'zfbRecord': 2,
          'electronicWallet': 4
        }
        params.bankType = o[activeListView]
      }

      this.bankCardLoading = true
      const { res } = await this.$axios.GET(urlMapper[activeListView], params)
      this.bankCardLoading = false
      if (res) {
        const { list, totalCount } = res.page
        const data = list && JSON.parse(JSON.stringify(list))
        data.map(item => {
          item.bsbCode = item.bankName === '银行账户' ? item.address : ''
        })
        this.banktablelist = data
        this.crPayPager.totalCount = totalCount
      }
    },
    fntransferbillrecord() {
      this.$router.push({
        path: "/main/wageManage/transformSheet?loginName=" + this.getName,
      });
    },
    fnaccountbillAudit(type) {
      this.$router.push({
        path: "/main/wageManage/adjustSheet?loginName=" + this.getName,
      });
    },
    linkoperateOprmsg() {
      this.$router.push({
        path: `/main/operateManage/memberMessage?loginName=${this.getName}`,
      });
    },
    fnwalletview() {
      this.membergamewalletview = true;
      this.$axios.get(systemConfig.urls.walletInfo + this.id).then((res) => {
        this.mbrWallet = res.data.mbrWallet;
      });
      this.wallettable();
    },
    wallettable() {
      this.$axios
        .get(systemConfig.urls.walletList, {
          params: {
            userId: this.id,
            pageSize: this.$store.state.listReq.pageSize,
            pageNo: this.$store.state.listReq.pageNo,
          },
        })
        .then((res) => {
          this.walletTableList = res.data.page.list;
          for (let i = 0; i < this.walletTableList.length; i++) {
            if (this.walletTableList[i].isTransfer == 0) {
              this.walletTableList[i].balance = this.$t("获取余额失败");
            }
          }
          this.recoverLoading = false;
        });
    },
    // 批量回收
    fnwalletbatchRecover() {
      if (this.walletTableMultipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: this.$t("请选择回收数据"),
        });
        return;
      }
      this.innerVisible = true;
    },
    // 单条回收
    fnwalletRecover(row) {
      this.rowData = row;
      this.innerVisible = true;
    },
    submitRecover() {
      if (this.rowData.accountId) {
        let depotIds = [];
        depotIds.push(this.rowData.depotId);
        this.recover(depotIds, this.rowData.accountId);
      } else {
        let depotIds = [];
        for (let j = 0; j < this.walletTableMultipleSelection.length; j++) {
          depotIds.push(this.walletTableMultipleSelection[j].depotId);
        }
        this.recover(depotIds, this.id);
      }
    },
    // 回收方法
    recover(depotIds, accountId) {
      let recoverData = { depotIds: depotIds, accountId: accountId };
      this.$store.state.fullscreenLoading = true;
      this.$axios
        .post(systemConfig.urls.walletRecover, recoverData)
        .then((resp) => {
          this.$message({
            type: "success",
            message: this.$t("回收成功"),
          });
          this.rowData = {};
          this.innerVisible = false;
          this.wallettable();
        });
    },
    walletRecoverSelectionChange(val) {
      this.walletTableMultipleSelection = val;
    },
    fnagentModify() {
      this.disabledTagent = false;
    },
    // 修改代理
    fnagentUpdate() {
      this.$axios
        .post(systemConfig.urls.agentUpdate, {
          id: this.id,
          cagencyId: this.mbrAccount.cagencyId,
        })
        .then((res) => {
          this.$message({
            type: "success",
            messae: this.$t("修改成功"),
          });
          this.disabledTagent = true;
        });
    },
    // 修改会员组
    fngroupIdUpdate() {
      this.$axios
        .post(systemConfig.urls.groupIdUpdate, {
          ids: [this.id],
          groupId: this.mbrAccount.groupId,
        })
        .then((res) => {
          this.$message({
            type: "success",
            messae: this.$t("修改成功"),
          });
          this.disabledEditGroup = true;
        });
    },
    // 修改状态
    fnavailableUpdate() {
      this.$axios
        .post(systemConfig.urls.accAvailableUpdate, {
          ids: [this.id],
          available: this.mbrAccount.available,
        })
        .then((res) => {
          this.$message({
            type: "success",
            messae: this.$t("修改成功"),
          });
          this.disabledAvailable = true;
        });
    },
    // 编辑个人信息
    memberInfoSave() {
      this.$refs.memberInfoForm.validate((valid) => {
        if (valid) {
          this.$store.state.fullscreenLoading = true;
          this.$axios
            .post(systemConfig.urls.memberInfoSave, this.mbrAccount)
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("编辑个人信息成功"),
              });
              this.memberInfoShow = false;
              this.getInfo(this.id);
            });
        }
      });
    },
    togglebankavai(row) {
      const urlMapper = {
        bankCard: systemConfig.urls.bankCardAvailable,
        zfbRecord: systemConfig.urls.bankCardAvailable,
        crPay: systemConfig.urls.memberCrAvailable,
        otherPo: systemConfig.urls.bankCardAvailable,
      };
      this.$axios
        .post(urlMapper[this.activeListView], {
          id: row.id,
          available: row.available,
          accountId: Number(this.id),
          loginName: this.getName,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("状态修改成功"),
          });
        });
    },

    verifyPassword(type) {
      if (type === 0) {
        this.fnpwdUpdate();
      } else if (type === 1) {
        this.fnsecPwdUpdate();
      } else {
        this.fnsyncPwdUpdate();
      }
    },
    // verifyPassword(type) {
    //   this.$prompt('您正在进行重要操作，请输入安全密码', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputType: 'password'
    //   }).then(({value}) => {
    //     this.$axios.post(systemConfig.urls.authPwd, {securepwd: value, id: this.id}).then((res) => {
    //       if (type === 0) {
    //         this.fnpwdUpdate()
    //       } else if (type === 1) {
    //         this.fnsecPwdUpdate()
    //       } else {
    //         this.fnsyncPwdUpdate()
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '取消输入'
    //     })
    //   })
    // },
    fnpwdUpdate() {
      this.$prompt(this.$t("输入新的登录密码"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        inputType: "password",
      }).then(({ value }) => {
        // 安全密码弹窗
        if (!this.safePassword) {
          this.$store.commit("safePasswordShow", true);
          this.$store.commit(
            "safePasswordCallbackPageBegin",
            this.$options.name
          );
          this.$set(
            this.tmpValue4SafeCheck,
            "callback",
            this.fnpwdUpdateSkipPrompt
          );
          this.$set(this.tmpValue4SafeCheck, "args", [value]);
          return;
        }
      });
    },
    fnpwdUpdateSkipPrompt(value) {
      this.$axios
        .post(
          systemConfig.urls.pwdUpdate,
          { loginPwd: value, id: this.id },
          { headers: { securepwd: this.safePassword } }
        )
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("重置登录密码成功"),
          });
        })
        .finally(() => {
          this.safePassword = "";
          this.tmpValue4SafeCheck = {};
        });
    },
    fnsecPwdUpdate() {
      this.$prompt(this.$t("输入新的提款密码"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        inputType: "password",
      })
        .then(({ value }) => {
          this.$axios
            .post(systemConfig.urls.secPwdUpdate, {
              securePwd: value,
              id: this.id,
            })
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("重置提款密码成功"),
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("取消输入"),
          });
        });
    },
    fnsyncPwdUpdate() {
      this.$confirm(this.$t("确定要同步所有游戏密码吗?"), this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
        //          inputType: 'password'
      })
        .then(() => {
          this.$axios
            .post(systemConfig.urls.syncPwdUpdate, { id: this.id })
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("重置同步游戏密码成功"),
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: this.$t("取消同步"),
          });
        });
    },
    fnaccountinfo(type) {
      if (type) {
        this.memberInfoShow = true;
        this.onlyRead = type;
      } else {
        this.$prompt(this.$t("您正在进行重要操作，请输入安全密码"), this.$t("提示"), {
          confirmButtonText: this.$t("确定"),
          cancelButtonText: this.$t("取消"),
          inputType: "password",
        })
          .then(({ value }) => {
            this.$axios
              .post(systemConfig.urls.authPwd, {
                securepwd: value,
                id: this.id,
              })
              .then((res) => {
                this.memberInfoShow = true;
                this.onlyRead = type;
              });
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: this.$t("取消输入"),
            });
          });
      }
    },
    fnGroup() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        resp.data.page.forEach((value) => {
          this.$data.listgroup.push({ id: value.id, value: value.groupName });
        });
      });
    },
    getAgentLevelList() {
      this.$axios.get(systemConfig.urls.mbrAccountLevellist).then((res) => {
        this.agentLevelList = res.data.data;
      });
    },
    // 获取总代 次代数据
    async getAgyAccount(id, ifX, bool) {
      let paramsId = id ? id : "";
      await this.$axios
        .get(systemConfig.urls.findTopAccountLike + "?parentId=" + paramsId)
        .then((res) => {
          if (!paramsId) {
            res.data.accounts.forEach((value) => {
              this.listTagent.push({
                id: value.id,
                value: value.agyAccount,
                parentId: value.parentId,
              });
            });
          } else {
            this.listCagent = [];
            if (!ifX && !bool) {
              this.qtzl.cagencyId = "";
            } else if (bool) {
              this.childAgentId = "";
            }
            res.data.accounts.forEach((value) => {
              this.listCagent.push({
                id: value.id,
                value: value.agyAccount,
                parentId: value.parentId,
              });
            });
          }
        });
    },
    getInfo(id) {
      return Promise.all([this.zcxqData(id), this.qtzlData(id), this.huxx(id)]);
    },
    zcxqData(id) {
      /*资产详情*/
      return this.$axios.get(systemConfig.urls.memberView + id).then((res) => {
        this.fundTotal = res.data.fundTotal;
        this.betTotal = res.data.betTotal;
        this.zcxqGetDetail(id)
        this.zcxqGetDetail2(id)
        return res;
      });
    },
    async zcxqGetDetail(id) {
      const { res } = await this.$axios.GET(this.$urls.mbrWaterRateYestday + id)
      if (res) {
        this.fundTotal.mbrWaterRateYestday = res.sumAmount
        this.$forceUpdate()
      }
    },
    async zcxqGetDetail2(id) {
      const { res } = await this.$axios.GET(this.$urls.mbrWaterRate + id)
      if (res) {
        this.fundTotal.mbrWaterRate = res.sumAmount
        this.$forceUpdate()
      }
    },
    qtzlData(id) {
      /*其他资料*/
      return this.$axios
        .get(systemConfig.urls.otherMemberView + id)
        .then((res) => {
          this.logreg = res.data.logreg;
          this.logLogin = res.data.logLogin;
          this.qtzl = res.data.other;
          this.tagencyId = this.qtzl.tagencyId;
          this.accountInfo = JSON.parse(JSON.stringify(res.data.other));
          if (this.qtzl.cagencyId) {
            this.getAgyAccount(this.qtzl.tagencyId, true);
          }
          return res;
        })
        .catch((err) => {
        });
    },
    huxx(id) {
      /*会员信息*/
      return this.$axios.get(systemConfig.urls.userInfo + id).then((res) => {
        this.bankCardAndCrCount = res.data.sum;
        this.mbrAccount = res.data.mbr;
        this.mbrcard = res.data.mbrcard;
        const arr = [
          "realName",
          "mobile",
          "email",
          "qq",
          "weChat",
          "birthday",
          "gender",
          "mobileAreaCode",
          "depositLock",
          "agyLevelId"
        ];
        arr.map((key) => {
          this.$set(this.mbrAccountPost, key, this.mbrAccount[key]);
        });
        return res;
      });
    },
    getcode(val) {
      this.$set(this.mbrAccountPost, "mobileAreaCode", val);
    },
    authImg(num) {
      switch (num) {
        case "0":
          return {
            src: require("@/assets/img/empty.jpg"),
            class: "empty",
            remind: this.$t("原信息为空"),
          };
          break;
        case "1":
          return {
            src: require("@/assets/img/correct.jpg"),
            class: "correct",
            remind: this.$t("验证通过"),
          };
          break;
        case "2":
          return {
            src: require("@/assets/img/err.jpg"),
            class: "err",
            remind: this.$t("信息错误"),
          };
          break;
        case "3":
          return {
            src: require("@/assets/img/unBind.jpg"),
            class: "unBind",
            remind: this.$t("已解绑"),
          };
          break;
        default:
          return {
            src: "",
            class: "",
            remind: "",
          };
          break;
      }
    },
    inputAuthData(key, value) {
      this.authMessage[key] = systemConfig.getIntergite(value);
    },
    deleteTextBlank(key, value) {
      if (key === 'realName') {
        this.authMessage[key] = value.trim()
        return
      }
      this.authMessage[key] = systemConfig.deleteBlank(value);
    },
    cancleAuthMessage() {
      this.authLoading = false;
      this.authMessageShow = false;
      this.getAuthData = this.$options.data().getAuthData;
      this.authMessage = this.$options.data().authMessage;
    },
    sendAuthMessageSubmit() {
      /* let bool=true
        for(let key in this.authMessage){
          if(this.authMessage[key]){
            bool=false
          }
        }
        if(bool){
          this.$message({
            type:'warning',
            message:'请至少输入一项需验证信息'
          })
          return
        } */
      if (this.authLoading) {
        return;
      }
      this.authLoading = true;
      let params = {
        id: this.id,
        ...this.authMessage,
      };
      this.$axios
        .get(systemConfig.urls.memberDetail.chkUserInfo, { params: params })
        .then((res) => {
          this.authLoading = false;
          this.getAuthData = res.data.msg;
        })
        .catch(() => {
          this.authLoading = false;
        });
    },
    closeAccount(){
      this.$refs.accountForm.clearValidate()
      this.$refs.accountForm.resetFields()
      this.accountForm = {}
      this.editAccountVisible = false
    },
    saveAccount(){
      this.$refs.accountForm.validate(valid=>{
        if(valid&&this.onceAccountClick===false){
          this.onceAccountClick = true
          this.accountForm.adjustment = this.accountForm.type===2?(0-this.accountForm.adjustment):(Number(this.accountForm.adjustment))
          this.$axios.post(systemConfig.urls.updateAdjustment,{accountId:Number(this.id),adjustment:this.accountForm.adjustment}).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('账目调整成功'))
              this.getInfo(this.id);
            }
          }).finally(()=>{
            this.closeAccount()
            this.onceAccountClick = false
          })
        }
      })
    },
    changeRecoveryAmount () {
      let params = {
        id: Number(this.id),
        loginName: this.getName,
      }
       this.$axios.post(systemConfig.urls.recoverBalance, params).then(res=>{
        this.$message({
          type: 'success',
          message: res.data.msg
        })
        const { balance } = res.data
        if (balance || balance === 0) {
          this.$set(this.qtzl, 'totalBalance', res.data.balance)
        }
      })
      .catch((e) => {
        this.$set(this.qtzl, 'totalBalance', e.data.balance)
      });
    }
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
    authMessageShow(n, o) {
      if (!n) {
        this.cancleAuthMessage();
      }
    },
    authMessage: {
      handler(n) {
        let bool = true;
        for (let key in n) {
          if (n[key] || n[key] === 0) {
            bool = false;
          }
        }
        this.authDisable = bool;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-date-editor {
  width: 140px !important;
}
.confirm-save {
  /deep/ .el-dialog {
    width: 30% !important;
    border-radius: 4px;
  }

  /deep/ .el-dialog__header {
    background-color: #fff;
    border-radius: 4px 4px 0 0;

    .el-dialog__title {
      color: #333;
      font-size: 16px;
    }
  }

  /deep/ .el-dialog__body {
    font-size: 14px !important;
  }
}

.tooltip-btn {
  padding: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  width: 230px;
  color: #000;
  text-decoration: none;
  cursor: default;
}

.auto-h {
  width: 95%;
  display: inline-block;
  /*overflow: auto;*/
  word-break: break-all;
  word-wrap: break-word;
  /*white-space: pre-wrap;*/
}

.mix {
  border-bottom: 1px solid #eee;
}

.new-he {
  padding: 10px 0;
}

.new-bo {
  padding: 10px 0;
}

.shl {
  width: 95%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}

.fh {
  width: 3%;
  display: inline-block;
  text-align: right;
}

.mbr-detail {
  .main-info {
    .row-main {
      position: relative;

      .row-btn {
        position: absolute;
        right: 0;
        top: 10px;

        button {
          width: 112px;
          height: 32px;
        }
      }

      .login-info {
        font-size: 14px;
        color: #999;
      }

      .id-info {
        line-height: 48px;
        font-size: 14px;

        .id {
          margin: 0 20px;
        }
      }
    }

    .main-info-header {
      line-height: 50px;
      position: relative;
      border-bottom: 1px solid #e6ebf5;

      span {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }

      button {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 96px;
        height: 32px;
      }
    }
  }

  .basic-info,
  .wage-info,
  .other-info {
    margin-top: 20px;
    border: 1px solid #e6ebf5;

    h2 {
      font-size: 14px;
      background: #f6f7f8;
      color: #333;
      line-height: 40px;
      padding-left: 20px;
      border-bottom: 1px solid #e6ebf5;
    }

    .info-item {
      line-height: 60px;
      padding-left: 50px;
      font-size: 14px;

      label {
        width: 60px;
        display: inline-block;
        text-align: right;
        color: #999;
        margin-right: 20px;
      }

      .icon-wenhao {
        color: #9d9d9d;
      }

      span {
        margin-right: 10px;
      }

      button {
        margin: 0 20px;
      }
    }
  }
}

.dialog-header {
  position: relative;
  line-height: 40px;
  height: 40px;

  span {
    margin-right: 20px;
  }

  button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

.w49 {
  width: 49%;
}

.mt20 {
  margin-top: 20px;
}

.label {
  width: 100px;
  display: inline-block;
}

.add-service {
  position: absolute;
  top: 30px;
  height: 50px;
  line-height: 40px;
  z-index: 3;
  width: 100%;
  background: #d18080;
  padding: 4px;
  transition: top 1s, display 1s;

  input {
    margin-left: 30px;
    height: 30px;
    width: calc(100% - 90px);
    border-radius: 4px;
  }

  button {
    line-height: 2px !important;
  }
}

.second-header {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  color: rgb(75, 79, 86);
  background: rgb(246, 247, 248);
  border: 1px solid rgb(211, 211, 211);
  border-top: none;
  border-bottom: none;
  text-align: center;

  .active {
    color: rgb(68, 126, 217);
    background: #fff;
    border-bottom: none;
  }
}

.row-header {
  height: 34px;
  line-height: 34px;
  position: relative;
  border: 1px solid rgb(211, 211, 211);
  margin-top: 10px;
  background: #f6f6f6;

  span {
    position: absolute;
    font-size: 13px;

    &:nth-child(1) {
      left: 30px;
      font-weight: bold;
      color: rgb(75, 79, 86);
    }

    &:nth-child(2) {
      right: 20px;
      color: #409eff;
    }
  }

  button {
    position: absolute;
    width: 60px;
    height: 24px;
    line-height: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  .left {
    right: 90px;
  }

  .right {
    right: 20px;
  }
}

.el-button--text {
  text-decoration: underline;
}

.member-detail {
  .el-select {
    width: 140px;

    /deep/ .el-input .el-input__inner {
      height: 30px !important;
    }
  }

  .first {
    position: relative;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgb(211, 211, 211);

    > span {
      font-size: 16px;
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    button {
      float: right;
      margin-top: 10px;
    }

    .return-btn {
      width: 80px;
      margin-left: 10px;
    }
  }

  .icon-editTem,
  .icon-add {
    cursor: pointer;
  }

  .second,
  .second-content {
    .el-table__header th {
      background: none;
    }

    .row-br {
      border-right: 1px solid rgb(211, 211, 211);
    }

    .table-div {
      border: 1px solid rgb(211, 211, 211);
      border-top: none;
      padding: 10px;
    }

    .row {
      border: 1px solid rgb(211, 211, 211);
      border-top: none;

      input {
        width: 100%;
        height: 24px;
        border: 1px solid rgb(211, 211, 211);
        border-radius: 4px;
        padding-left: 10px;
        font-size: 12px;
        font-family: "Microsoft YaHei";
      }

      .content {
        .item {
          height: 40px;
          line-height: 40px;
          position: relative;

          .left {
            position: absolute;
            left: 30px;
          }

          .right {
            position: absolute;
            right: 20px;

            .el-input__inner {
              width: 160px;
            }
          }

          &:nth-child(even) {
            background: rgb(246, 246, 246);
          }
        }
      }

      .content1 {
        /*margin-top: 20px;*/
        .item {
          position: relative;
          padding: 2px 0;
          line-height: 40px;
          height: 40px;

          .left {
            display: inline-block;
            vertical-align: top;
            width: 110px;
            text-align: left;
            text-indent: 30px;
            margin-right: 6px;
            color: #666666;
          }

          .right {
            display: inline-block;
            width: calc(100% - 140px);
            /*line-height: 28px;*/
            text-align: left;
            //border: 1px solid rgb(211, 211, 211);
            border-radius: 4px;
            /deep/ .el-button--text {
              text-decoration: none;
            }
          }

          .right1 {
            display: inline-block;
            width: calc(100% - 140px);
            /*line-height: 28px;*/
            text-align: left;
            //border: 1px solid rgb(211, 211, 211);
            border-radius: 4px;
            .mobile {
              display: flex;
              /deep/ .el-select {
                margin-right: 10px;
              }
              .mobile_input {
                height: 26px;
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
  }
}

#beizhu {
  .el-table__header-wrapper {
    background: red;
  }
}

.content1 .item:nth-child(even) {
  background-color: #f6f6f6;
}

.agentSet {
  /deep/ .el-dialog {
    width: 22% !important;

    .el-dialog__body {
      padding-left: 50px;
      box-sizing: border-box;

      p {
        margin-bottom: 15px;
      }

      .upper {
        margin-bottom: 10px;
      }
    }
  }
}

.auth {
  .authMessage {
    width: 100%;
    margin: 0 auto;
    text-align: center;

    a {
      color: black;
      display: inline-block;
      min-width: 91px;

      .authSpan {
        display: inline-block;
        margin-left: 5px;
        position: relative;

        img {
          width: 17px;
          position: relative;
          top: 5px;
        }
      }

      .w50 {
        min-width: 50px;
        text-align: left;
      }

      .empty {
        color: rgb(245, 163, 0);
      }

      .unBind {
        color: rgb(144, 144, 152);
      }

      .correct {
        color: rgb(103, 194, 58);
      }

      .err {
        color: rgb(250, 85, 85);
      }
    }

    .hiddenShow {
      visibility: hidden;
    }
  }

  /deep/ .el-dialog__footer {
    text-align: center !important;
  }
}
.lock-status {
  color: red;
}
</style>
