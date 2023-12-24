<template>
  <div>
    <el-tabs type="border-card" ref="eltaps" v-if="isShowSysSet.show">
      <el-tab-pane :label="$t('站点设置')" v-if="hasPermission('setting:syssetting:StationSetQry')||hasPermission('setting:syssetting:StationSetEdit')">
        <el-form :model="sysSetObj" ref="sysSetObj" label-width="auto" class="sys-setting-form">
          <!-- <from-wrapper :width="900"> -->
          <el-form-item :label="$t('管理后台查询数据默认天数')">
            <el-input type="number" v-model.number="sysSetObj.defaultQueryDays" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('前端页面会员查询数据默认天数')">
            <el-input type="number" v-model.number="sysSetObj.memberQueryDays" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label=" $t('自动删除已读站内信天数')">
            <el-input type="number" v-model.number="sysSetObj.autoDeleteDays" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('管理员密码过期天数')">
            <el-input type="number" v-model.number="sysSetObj.passwordExpireDays" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('代理域名解析地址')">
            <el-input v-model="sysSetObj.agentDomainAnalysisSite" disabled></el-input>
          </el-form-item>
          <el-form-item class="uploader blue" :label="$t('站点logo图片')">
            <input :style='logoStyleObject' type="text" class="filename" readonly="" v-model="inputLogoName">
            <input type="button" name="file" class="button" :value="$t('浏览')">
            <input ref="lg" type="file" accept="image/*" @change="getLogoFile($event)">
            <span class="upload-span" v-show="picShow" @click="previewImgOpen(sysSetObj.logoPath)">{{ $t('查看已上传的图片') }}</span>
          </el-form-item>
          <el-form-item class="uploader blue" :label="$t('页面Title图片')">
            <input :style='titleStyleObject' type="text" class="filename" readonly="" v-model="inputTitleName">
            <input type="button" name="file" class="button" :value="$t('浏览')">
            <input ref="te" type="file" accept=".ico" @change="getTitleFile($event)">
            <span class="upload-span" v-show="mbShow" @click="previewImgOpen(sysSetObj.titlePath)">{{ $t('查看已上传的图片') }}</span>
          </el-form-item>
          <el-form-item :label="$t('网站统计代码(PC版)')">
            <el-input type="textarea" v-model="sysSetObj.websiteCodePc" auto-complete="off" :rows="5"></el-input>
          </el-form-item>
          <el-form-item :label="$t('网站统计代码(移动版)')">
            <el-input type="number" v-model="sysSetObj.websiteCodeMb" auto-complete="off" :rows="5"></el-input>
          </el-form-item>

           <el-form-item :label="$t('首页外跳开关配置（移动版）')">
            <el-switch v-model="sysSetObj.forwardSwitch" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item :label="$t('阿聊logo')">
            <el-upload
              :file-list='aliaoList' list-type="picture-card" action=""
              :limit="1"
              :before-upload="beforeAvatarUpload"
              :on-remove="onAvatarRemoveAliao"
              :http-request="handleAvatarSuccessAliaoLogo"
              :class="sysSetObj.chatLogo ?'hide':''">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item :label="$t('首页外跳地址配置（移动版）')">
            <el-input type="textarea" v-model="sysSetObj.forwardUrl" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('客服配置代码1(PC版)')">
            <el-input type="textarea" v-model="sysSetObj.configCodePc" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('客服配置代码1(移动版)')">
            <el-input type="textarea" v-model="sysSetObj.configCodeMb" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
           <el-form-item :label="$t('客服配置代码2(PC版)')">
            <el-input type="textarea" v-model="sysSetObj.configCodePc1" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('客服配置代码2(移动版)')">
            <el-input type="textarea" v-model="sysSetObj.configCodeMb1" auto-complete="off" :rows="2"></el-input>
          </el-form-item>

          <el-form-item :label="$t('联系方式') + 1">
            <!-- pc上传图片 -->
            <div class="contactOnePc">
              <div>{{ $t('PC端上传图片') }}</div>
              <el-upload
              :file-list='pcIconSkypeList' list-type="picture-card" action=""
              :limit="1"
              :before-upload="beforeAvatarUpload"
              :on-remove="onAvatarRemove3"
              :http-request="handleAvatarSuccess3"
              :class="sysSetObj.pcIconSkype ?'hide':''">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <!-- 移动端上传图片 -->
            <div>{{ $t('APP端上传图片') }}</div>
              <el-upload :file-list='appIconSkypeList' list-type="picture-card" action="" :limit="1"
                :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove4" :http-request="handleAvatarSuccess4"
                :class="sysSetObj.appIconSkype ? 'hide':''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            <span class="mw110">{{ $t('联系方式') + 1 + $t('名称') }}</span><el-input v-model="sysSetObj.titleSkype" :placeholder="$t('请输入联系方式名称')" clearable></el-input>
            <div>
              <el-radio-group v-model="sysSetObj.configSkypeType">
                <el-radio label="0">{{ $t('复制联系人') }}</el-radio>
                <el-radio label="1">{{ $t('访问联系人') }}</el-radio>
              </el-radio-group>
            </div>
            <!-- <span  class="mw110">{{ $t('联系人名称') }}</span><el-input type="textarea" v-model="sysSetObj.configSkype" auto-complete="off" :rows="2" :placeholder="$t('可添加多个联系方式，用英文逗号分割')"></el-input> -->
            <span class="mw110">{{ $t('联系人名称') }}</span><el-input v-model="sysSetObj.configSkype" :placeholder="$t('请输入联系人名称')" clearable></el-input>
            <div v-show="sysSetObj.configSkypeType === '1'"><span class="mw110">{{ $t('联系人访问链接') }}</span><el-input v-model="sysSetObj.configSkypeLink" :placeholder="$t('请输入联系人访问链接')"  clearable></el-input></div>
          </el-form-item>
          <el-form-item :label="$t('联系方式') + 2">
               <!-- pc上传图片 -->
               <div class="contactOnePc">
              <div>{{ $t('PC端上传图片') }}</div>
              <el-upload :file-list='pcIconTelegramList' list-type="picture-card" action="" :limit="1"
                :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove5" :http-request="handleAvatarSuccess5"
                :class="sysSetObj.pcIconTelegram ?'hide':''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <!-- 移动端上传图片 -->
            <div>{{ $t('APP端上传图片') }}</div>
              <el-upload :file-list='appIconTelegramList' list-type="picture-card" action="" :limit="1"
                :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove6" :http-request="handleAvatarSuccess6"
                :class="sysSetObj.appIconTelegram ? 'hide':''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            <!-- <el-input v-model="sysSetObj.titleTelegram" :placeholder="$t('请输入标题')" clearable></el-input>
            <el-input type="textarea" v-model="sysSetObj.configTelegram" auto-complete="off" :rows="2" :placeholder="$t('可添加多个联系方式，用英文逗号分割')"></el-input> -->
            <span class="mw110">{{ $t('联系方式') + 2 + $t('名称') }}</span><el-input v-model="sysSetObj.titleTelegram" :placeholder="$t('请输入联系方式名称')" clearable></el-input>
            <div>
              <el-radio-group v-model="sysSetObj.configTelegramType">
                <el-radio label="0">{{ $t('复制联系人') }}</el-radio>
                <el-radio label="1">{{ $t('访问联系人') }}</el-radio>
              </el-radio-group>
            </div>
            <span class="mw110">{{ $t('联系人名称') }}</span><el-input v-model="sysSetObj.configTelegram" :placeholder="$t('请输入联系人名称')" clearable></el-input>
            <div v-show="sysSetObj.configTelegramType === '1'"><span class="mw110">{{ $t('联系人访问链接') }}</span><el-input v-model="sysSetObj.configTelegramLink" :placeholder="$t('请输入联系人访问链接')"  clearable></el-input></div>
          </el-form-item>

          <el-form-item :label="$t('联系方式') + 3">
            <div class="contactOnePc">
              <div>{{ $t('PC端上传图片') }}</div>
              <el-upload :file-list='pcIconFlygramList' list-type="picture-card" action="" :limit="1"
                :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove7" :http-request="handleAvatarSuccess7"
                :class="sysSetObj.pcIconFlygram ? 'hide':''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <!-- 移动端上传图片 -->
            <div>{{ $t('APP端上传图片') }}</div>
              <el-upload :file-list='appIconFlygramList' list-type="picture-card" action="" :limit="1"
                :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove8" :http-request="handleAvatarSuccess8"
                :class="sysSetObj.appIconFlygram ? 'hide':''">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            <el-input v-model="sysSetObj.titleFlygram" :placeholder="$t('请输入标题')" clearable></el-input>
            <el-input type="textarea" v-model="sysSetObj.configFlygram" auto-complete="off" :rows="2" placeholder="可添加多个联系方式，用英文逗号分割"></el-input>
            <span class="mw110">{{ $t('联系方式') + 3 + $t('名称') }}</span><el-input v-model="sysSetObj.titleFlygram" :placeholder="$t('请输入联系方式名称')" clearable></el-input>
            <div>
              <el-radio-group v-model="sysSetObj.configFlygramType">
                <el-radio label="0">{{ $t('复制联系人') }}</el-radio>
                <el-radio label="1">{{ $t('访问联系人') }}</el-radio>
              </el-radio-group>
            </div>
            <span class="mw110">{{ $t('联系人名称') }}</span><el-input v-model="sysSetObj.configFlygram" :placeholder="$t('请输入联系人名称')" clearable></el-input>
            <div v-show="sysSetObj.configFlygramType === '1'"><span class="mw110">{{ $t('联系人访问链接') }}</span><el-input v-model="sysSetObj.configFlygramLink" :placeholder="$t('请输入联系人访问链接')"  clearable></el-input></div>
          </el-form-item>
          <el-form-item :label="$t('PC首页展示域名')">
            <el-input type="textarea" v-model="sysSetObj.showWebSite" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('购买USDT网站')">
            <el-input type="textarea" v-model="sysSetObj.usdtBuyUrl" auto-complete="off" :rows="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('虚拟在线人数')">
            <el-input type="text" v-model="sysSetObj.baseOnlineNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:StationSetEdit')" class="save-btn" type="primary" @click="savesysSetObj">{{ $t('保存') }}</el-button>
          </el-form-item>
          <!-- </from-wrapper> -->
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('数据库加密')" v-if="hasPermission('sys:encrypt:info')">
        <el-form :model="sysEncryptObj" ref="sysEncryptObj" label-width="220px" class="sys-setting-form">
          <!-- <from-wrapper :width="900"> -->
          <el-form-item :label="$t('加密内容')">
            {{ $t('所有会员的电话号码') }}
            <!-- 所有会员的真实姓名、电话、邮箱、微信、QQ、银行卡开户地址、银行账号 -->
          </el-form-item>

          <el-form-item :label="$t('开启数据库加密')">
            <el-switch v-model="sysEncryptObj.value" active-value="1" inactive-value="0" :disabled="!hasPermission('sys:encrypt:update')">
            </el-switch>
          </el-form-item>

          <el-form-item :label="$t('安全密码')">
            <el-input v-model="sysEncryptObj.securepwd" type="password" :placeholder="$t('请输入安全密码')"></el-input>
            <span style="color: #999;">*{{ $t('开启加密后，数据库中的上述加密内容将根据加密秘钥处理为加密密文，防止用户信息被恶意泄露。') }}</span>
          </el-form-item>

          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('sys:encrypt:update')" class="save-btn" type="primary" @click="saveSysEncryptObj">{{ $t('保存') }}</el-button>
          </el-form-item>
          <!-- </from-wrapper> -->
        </el-form>
      </el-tab-pane>
      <!-- 邮箱设置 ========================================== -->
      <el-tab-pane :label="$t('邮箱设置')" v-if="hasPermission('setting:syssetting:MailContent')">
        <el-form :model="sysEmailSetObj" ref="sysEmailSetObj" label-width="225px" class="sys-setting-form" v-loading='messageLoading'>
          <el-form-item :label="$t('邮件标题')">
            <el-input v-model="sysEmailSetObj.mailSubject" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('邮件内容')">
            <el-input type="textarea" v-model="sysEmailSetObj.mailContent" auto-complete="off" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:updateMailContent')" class="save-btn" type="primary" @click="savesysEmailSetObj">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 短信设置 ========================================== -->
      <el-tab-pane :label="$t('短信设置')" v-if="hasPermission('setting:syssetting:SmsSetQry')">
        <el-form :model="sysSmsSetObj" ref="sysSmsSetObj" label-width="225px" class="sys-setting-form" v-loading='messageLoading'>
          <!-- <from-wrapper :width="900"> -->

          <el-form-item :label="$t('渠道选择')">
            <el-radio-group v-model="sysSmsSetObj.platformName" @change="smsChange">
              <el-radio :label="item" v-for="(item,index) in smsList" :key="index">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('本平台发送状态')">
            <el-radio-group v-model="sysSmsSetObj.available">
              <el-radio :label="1">{{ $t('开通') }}</el-radio>
              <el-radio :label="0">{{ $t('关闭') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('排序号')">
            <el-input v-model.number="sysSmsSetObj.sort" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('短信网关地址')" v-if="sysSmsSetObj.platformName != 'Telesign'">
            <el-input v-model="sysSmsSetObj.getwayAddress" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="sysSmsSetObj.platformId !== 11" :label="$t('短信用户接口名')">
            <el-input v-model="sysSmsSetObj.interfaceName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="sysSmsSetObj.platformId !== 11" :label="$t('短信接口密码')">
            <el-input type="psaaword" v-model="sysSmsSetObj.interfacePassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('短信发送方名称')">
            <el-input v-model="sysSmsSetObj.sendName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('短信模板')">
            <el-input v-model="sysSmsSetObj.template" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('测试接收短信')">
            <el-row>
              <el-col :span="4">
                <el-select v-model="sysSmsSetObj.mobileAreaCode">
                  <el-option :label="$t('中国')" value="86"></el-option>
                  <el-option :label="$t('台湾')" value="886"></el-option>
                  <el-option :label="$t('越南')" value="84"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input style="width:calc(100% - 12px);margin-left: 12px" v-model="sysSmsSetObj.mobile"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button style="width:calc(100% - 12px);margin-left: 12px" @click="sysSmstest">{{ $t('测试') }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 验证码位数:传信专属 -->
          <el-form-item v-if="sysSmsSetObj.platformId === 11 || sysSmsSetObj.platformId === 13 " :label="$t('验证码位数')">
            <el-radio-group v-model="sysSmsSetObj.codeLength">
              <el-radio :label="4">4位</el-radio>
              <el-radio :label="5">5位</el-radio>
              <el-radio :label="6">6位</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 国家选择:传信专属 -->
          <el-form-item v-if="sysSmsSetObj.platformId === 11 || sysSmsSetObj.platformId === 13" :label="$t('国家选择')">
            <div v-for="item of sysSmsSetObj.languageInterfaceArr" :key="item.language">
              <el-checkbox v-model="item.enable" :true-label="1" :false-label="0">{{ item.name }}</el-checkbox>
              <div>
                <label>短信用户接口名</label><el-input v-model="item.interfaceName" auto-complete="off"></el-input>
              </div>
              <div>
                <label>短信接口密码</label><el-input v-model="item.interfacePassword" auto-complete="off"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:SmsSetEdit')" class="save-btn" type="primary" @click="savesysSmsSetObj">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('注册设置')" v-if="hasPermission('setting:syssetting:RegisterSetQry')">
        <div class="registerSet">
          <span class="dtext">{{ $t('是否允许前台注册') }}</span>
          <el-radio v-model="accWebRegister" :label="1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="accWebRegister" :label="0">{{ $t('禁用') }}</el-radio>
        </div>
        <div class="registerSet">
          <span class="dtext">{{ $t('是否允许重名注册') }}</span>
          <el-radio v-model="sysRegSetObj.realNameRepeat" :label="1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="sysRegSetObj.realNameRepeat" :label="0">{{ $t('禁用') }}</el-radio>
        </div>
        <div class="registerSet">
          <span class="dtext">{{ $t('同IP注册限制') }}</span>
          <el-input type="number" style="width: 40%" v-model="sysRegSetObj.loginIp" :placeholder="$t('相同IP最多可注册账号数量，为0时不限制')"></el-input>
        </div>
        <div class="registerSet">
          <span class="dtext">{{ $t('同设备注册限制') }}</span>
          <el-input type="number" style="width: 40%" v-model="sysRegSetObj.deviceUuid" :placeholder="$t('相同设备最多可注册账号数量，为0时不限制')"></el-input>
        </div>
        <div class="registerSet">
          <span class="dtext">{{ $t('注册方式') }}</span>
          <el-checkbox v-model="registed" :label="0" disabled>{{ $t('普通模式') }}</el-checkbox>
          <el-checkbox v-model="sysRegSetObj.registerMethod" :label="1">{{ $t('快捷模式（需开通短信服务）') }}</el-checkbox>
        </div>

        <!-- <from-wrapper :width="900"> -->
        <div class="RegTab sys-setting-form">
          <el-row class="rowd">
            <el-col :span="4" class="rowd font-bold border-right">{{ $t('注册项目名称') }}</el-col>
            <el-col :span="10">
              <el-col :span="24" class="font-bold border-right">{{ $t('会员注册') }}</el-col>
              <el-col :span="12" class="bg-subitem border-right">{{ $t('是否必填') }}</el-col>
              <el-col :span="12" class="bg-subitem border-right">{{ $t('是否默认注册项') }}</el-col>
            </el-col>
            <el-col :span="10">
              <el-col :span="24" class="font-bold">{{ $t('代理注册') }}
              </el-col>
              <el-col :span="12" class="bg-subitem border-right">{{ $t('是否必填') }}</el-col>
              <el-col :span="12" class="bg-subitem ">{{ $t('是否默认注册项') }}</el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('账号') }}<span style="color: #F56C6C">({{ $t('必选') }})</span></el-col>
            <el-col :span="10">
              <el-col :span="12" class=" border-right">
                <el-checkbox disabled v-model="ture"></el-checkbox>
              </el-col>
              <el-col :span="12" class=" border-right">
                <el-checkbox disabled v-model="ture"></el-checkbox>
              </el-col>
            </el-col>
            <el-col :span="10">
              <el-col :span="12" class=" border-right">
                <el-checkbox disabled v-model="ture"></el-checkbox>
              </el-col>
              <el-col :span="12">
                <el-checkbox disabled v-model="ture"></el-checkbox>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('登录密码') }}<span style="color: #F56C6C">({{ $t('必选') }})</span></el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox disabled v-model="ture"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox disabled v-model="ture"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox disabled v-model="ture"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox disabled v-model="ture"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('验证码') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="captchareg1" @change="captchareg1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="captchareg2" @change="captchareg2Change" :disabled="sysRegSetObj.captchareg === 2"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="captchareg3" @change="captchareg3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="captchareg4" @change="captchareg4Change" :disabled="sysRegSetObj.agentCaptchareg === 2"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('重复登录密码') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="reLoginPwd1" @change="reLoginPwd1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="reLoginPwd2" @change="reLoginPwd2Change" :disabled="sysRegSetObj.reLoginPwd === 2"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="reLoginPwd3" @change="reLoginPwd3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="reLoginPwd4" @change="reLoginPwd4Change" :disabled="sysRegSetObj.agentReLoginPwd === 2"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('真实姓名') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="trueName1" @change="trueName1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="trueName2" :disabled="sysRegSetObj.realName === 2" @change="trueName2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="trueName3" @change="trueName3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="trueName4" :disabled="sysRegSetObj.agentRealName === 2" @change="trueName4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('手机') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="mobile1" @change="mobile1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="mobile2" :disabled="sysRegSetObj.mobile === 2" @change="mobile2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="mobile3" @change="mobile3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="mobile4" :disabled="sysRegSetObj.agentMobile === 2" @change="mobile4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('短信验证') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox :disabled="!sysRegSetObj.mobile" :true-label="2" :false-label="0" v-model="sysRegSetObj.mobileCaptchareg" @change="mobileCaptcharegChange"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              -
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox :disabled="!sysRegSetObj.agentMobile" :true-label="2" :false-label="0" v-model="sysRegSetObj.agentMobileCaptchareg" @change="agentMobileCaptcharegChange"></el-checkbox>
            </el-col>
            <el-col :span="5">
              -
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="4" class=" border-right">{{ $t('邮箱验证') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email1" @change="email1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email2" :disabled="sysRegSetObj.mailCaptchareg === 2" @change="email2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email3" @change="email3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="email4" :disabled="sysRegSetObj.agentMailCaptchareg === 2" @change="email4Change"></el-checkbox>
            </el-col>
          </el-row> -->

           <el-row>
            <el-col :span="4" class=" border-right">{{ $t('邮箱') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email1" @change="email1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email2" :disabled="sysRegSetObj.email === 2" @change="email2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="email3" @change="email3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="email4" :disabled="sysRegSetObj.agentEmail === 2" @change="email4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('邮箱验证') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox  :disabled="!sysRegSetObj.email" :true-label="2" :false-label="0" v-model="sysRegSetObj.mailCaptchareg" @change="mailCaptcharegChange"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              -
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox :disabled="!sysRegSetObj.agentEmail" :true-label="2" :false-label="0" v-model="sysRegSetObj.agentMailCaptchareg" @change="agentMobileCaptcharegChange"></el-checkbox>
            </el-col>
            <el-col :span="5">
              -
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4" class=" border-right">QQ</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="qq1" @change="qq1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="qq2" :disabled="sysRegSetObj.qq === 2" @change="qq2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="qq3" @change="qq3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="qq4" :disabled="sysRegSetObj.agentQQ === 2" @change="qq4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('微信') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="wechat1" @change="wechat1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="wechat2" :disabled="sysRegSetObj.weChat === 2" @change="wechat2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="wechat3" @change="wechat3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="wechat4" :disabled="sysRegSetObj.agentWechat === 2" @change="wechat4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">Whatsapp</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="whatsapp1" @change="whatsapp1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="whatsapp2" :disabled="sysRegSetObj.whatsapp === 2" @change="whatsapp2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="whatsapp3" @change="whatsapp3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="whatsapp4" :disabled="sysRegSetObj.agentWhatsapp === 2" @change="whatsapp4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">Telegram</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="telegram1" @change="telegram1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="telegram2" :disabled="sysRegSetObj.telegram === 2" @change="telegram2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="telegram3" @change="telegram3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="telegram4" :disabled="sysRegSetObj.agentTelegram === 2" @change="telegram4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('地址') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="address1" @change="address1Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="address2" :disabled="sysRegSetObj.address === 2" @change="address2Change"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="address3" @change="address3Change"></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="address4" :disabled="sysRegSetObj.agentAddress === 2" @change="address4Change"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class=" border-right">{{ $t('邀请码') }}</el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="promotion1" @change="promotionChange1"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="promotion2" :disabled="sysRegSetObj.promotion===2" @change="promotionChange2"></el-checkbox>
            </el-col>
            <el-col :span="5" class=" border-right">
              <el-checkbox v-model="promotion3" disabled></el-checkbox>
            </el-col>
            <el-col :span="5">
              <el-checkbox v-model="promotion4" disabled></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="border-right">{{ $t('服务条款') }}</el-col>
            <el-col :span="10" class="border-right">
              <span class="iconfont icon-editTem"></span>
              <el-button type="text" size="mini" @click="showTerms(true,hasPermission('setting:syssetting:RegisterSetEdit'))">{{ $t('编辑') }}</el-button>
            </el-col>
            <el-col :span="10">
              <span class="iconfont icon-editTem"></span>
              <el-button type="text" size="mini" @click="showTerms(false,hasPermission('setting:syssetting:RegisterSetEdit'))">{{ $t('编辑') }}</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button v-if="hasPermission('setting:syssetting:RegisterSetEdit')" style="margin-top:30px;margin-left: 45%;margin-bottom: 45px" class="save-btn" type="primary" @click="savesysRegSetObj">{{ $t('保存') }}
        </el-button>
        <!-- </from-wrapper> -->
      </el-tab-pane>
      <el-tab-pane :label="$t('推广设置')" v-if="hasPermission('setting:syssetting:PromotionSetQry')">
        <el-form :model="promotionSettingObj" ref="promotionSetting" label-width="240px" class="sys-setting-form" :rules="promotionSettingRules" style="width: 700px;">
          <!-- <from-wrapper :width="900"> -->
          <el-form-item :label="$t('语音线路')">
            <el-radio-group v-model="outCallPlatform">
              <el-radio label="1">Blink</el-radio>
              <el-radio label="2">Rowave</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('用户类型')" prop="account.type">
            <el-radio-group v-model="promotionSettingObj.account.type">
              <el-radio :label="0">{{ $t('会员') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('推广域名')" prop="account.siteUrlId">
            <el-select v-model="promotionSettingObj.account.siteUrlId" :placeholder="$t('请选择推广域名')">
              <el-option v-for="item in siteUrlList" :key="item.id" :label="item.siteUrl" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('用户类型')" prop="agent.type">
            <el-radio-group v-model="promotionSettingObj.agent.type">
              <el-radio :label="1">{{ $t('代理') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('推广域名')" prop="agent.siteUrlId">
            <el-select v-model="promotionSettingObj.agent.siteUrlId" :placeholder="$t('请选择推广域名')">
              <el-option v-for="item in siteUrlList" :key="item.id" :label="item.siteUrl" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('用户类型')" prop="channel.type">
            <el-radio-group v-model="promotionSettingObj.channel.type">
              <el-radio :label="2">{{ $t('渠道') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('推广域名')" prop="channel.siteUrlId">
            <el-select v-model="promotionSettingObj.channel.siteUrlId" :placeholder="$t('请选择推广域名')">
              <el-option v-for="item in siteUrlList" :key="item.id" :label="item.siteUrl" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('好友推荐')" prop="friendRelegationPromotion">
            <el-radio-group v-model="promotionSettingObj.friendRelegationPromotion">
              <el-radio label="0">归属官方代理</el-radio>
              <el-radio label="1">归属上级代理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:PromotionSetEdit')" class="save-btn" type="primary" @click="savePromotionSetting">{{ $t('保存') }}</el-button>
          </el-form-item>
          <!-- </from-wrapper> -->
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('出入款设置')" v-if="hasPermission('setting:syssetting:PaySetQry')">
        <el-form :model="otherObj" label-width="300px" class="sys-setting-form" ref="otherSetting" :rules="otherSettingRules" style="width: 800px;">
          <!-- <from-wrapper :width="900"> -->
          <!-- <el-form-item label="出款设置" style="color: #606266;">
              (默认达到存款稽核才能出款)
            </el-form-item> -->
          <el-form-item :label="$t('充值完善条件')">
            <el-checkbox-group v-model="depositCondition">
              <el-checkbox :label="1">{{ $t('实名') }}</el-checkbox>
              <el-checkbox :label="2">{{ $t('短信') }}</el-checkbox>
              <el-checkbox :label="3">{{ $t('邮件') }}</el-checkbox>
              <el-checkbox :label="4">{{ $t('谷歌验证') }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('提款完善条件')">
            <el-checkbox-group v-model="withdrawCondition">
              <el-checkbox :label="1">{{ $t('实名') }}</el-checkbox>
              <el-checkbox :label="2">{{ $t('短信') }}</el-checkbox>
              <el-checkbox :label="3">{{ $t('邮件') }}</el-checkbox>
              <el-checkbox :label="4">{{ $t('谷歌验证') }}</el-checkbox>
              <el-checkbox :label="5">{{ $t('支付密码') }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('是否启用自动出款')" prop="payAutomatic">
            <el-radio-group v-model="otherObj.payAutomatic">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('是否启用支付宝出款')" prop="alipayEnable">
            <el-radio-group v-model="otherObj.alipayEnable">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('未通过稽核出款')" prop="isMultipleOpen">
            <el-radio-group v-model="otherObj.isMultipleOpen">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="$t('不可提款时间段')" prop="limitTime">
            <el-radio-group v-model="otherObj.isWithdrawLimitTimeOpen">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
            <div style="width: 540px;margin-bottom: 10px;" v-for="(item,index) in otherObj.withdrawLimitTimeDtoList" :key="index">
              <el-time-picker v-model="item.startTime" :picker-options="{format:'HH:mm'}" value-format="HH:mm" format="HH:mm"></el-time-picker>
              -
              <el-time-picker v-model="item.endTime" :picker-options="{format:'HH:mm',selectableRange: item.startTime?(`${item.startTime}:60 - 23:59:59`):('00:00:00 - 23:59:59')}" value-format="HH:mm" format="HH:mm"></el-time-picker>
              <el-button style="padding: 7px;min-width: 30px;" :icon="index===0?'el-icon-plus':'el-icon-minus'" @click="addLimitTime(index)"></el-button>
            </div>
          </el-form-item>
          <el-form-item :label="$t('自动出款单笔最高限额')" prop="payMoney" v-show="otherObj.payAutomatic">
            <el-input type="number" v-model.number="otherObj.payMoney"></el-input>
          </el-form-item>
          <el-form-item :label="$t('入款通道自动屏蔽')" prop="isAutoDisableOpen">
            <el-radio-group v-model="otherObj.isAutoDisableOpen" @change="handleChangeAutoDisableOpen">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('入款未处理订单自动转回失败设置时间')" prop="failureTime">
            <el-input type="number" v-model.number="otherObj.failureTime"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="failur-red">
              {{ $t('注') + ':' + $t('三方回调时间不一定及时') + ',' + $t('如果设置时间短回调未过来就把订单变成失败') + ',' + $t('后续无法重新变更成功') + ',' + $t('请悉知') }}
            </div>
          </el-form-item>
          <el-form-item :label="$t('指定时间内')" v-if="otherObj.isAutoDisableOpen" prop="autoDisableDuration">
            <el-select v-model="otherObj.autoDisableDuration" :placeholder="$t('请选择')">
              <el-option
                v-for="(item, index) in autoDisableDurationArr"
                :key="index"
                :label="index + 1 + $t('分钟')"
                :value="index + 1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('触发次数')" v-if="otherObj.isAutoDisableOpen" prop="autoDisableTimes">
            <el-select v-model="otherObj.autoDisableTimes" :placeholder="$t('请选择')">
              <el-option
                v-for="(item, index) in autoDisableDurationArr"
                :key="index"
                :label="index + 1 + $t('次')"
                :value="index + 1">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('自动开启时间')" v-if="otherObj.isAutoDisableOpen" prop="autoOpenTime">
            <el-select v-model="otherObj.autoOpenTime" :placeholder="$t('请选择')">
              <el-option
                v-for="item in autoOpenTimeArr"
                :key="item.lable"
                :label="item.lable"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:PaySetEdit')" class="save-btn" type="primary" @click="submitWithdraw">{{ $t('保存') }}</el-button>
          </el-form-item>
          <!-- </from-wrapper> -->
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('AI推荐设置')" v-if="hasPermission('setting:syssetting:AiRecommend')">
        <el-form :model="aiObj" label-width="300px" class="sys-setting-form" ref="aiSetting" :rules="aiSettingRules" style="width: 600px;">
          <el-form-item :label="$t('个人中心推荐设置') + ':'">
          </el-form-item>
          <el-form-item :label="$t('是否启用推荐')" prop="isEnble">
            <el-radio-group v-model="aiObj.isEnble">
              <el-radio :label="1">{{ $t('禁用') }}</el-radio>
              <el-radio :label="0">{{ $t('启用') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:AiRecommendEdit')" class="save-btn" type="primary" @click="submitAi">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('好友转账设置')" v-if="hasPermission('setting:syssetting:FriendTransSetQry')">
        <el-form :model="friObj" label-width="320px" class="sys-setting-form" ref="friToggleSetting" :rules="friToggleSettingRules" style="width: 680px">
          <!-- <from-wrapper :width="900"> -->
          <el-form-item :label="$t('好友转账设置')" style="color: #606266;">
          </el-form-item>
          <el-form-item :label="$t('是否启用好友转账')" prop="friendsTransAntomatic">
            <el-radio-group v-model="friObj.friendsTransAntomatic">
              <el-radio :label="1">{{ $t('启用') }}</el-radio>
              <el-radio :label="0">{{ $t('禁用') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('是否启用好友转账')">
            <el-select v-model="friObj.payAutomatic" :placeholder="$t('请选择')">
              <el-option
                :label="$t('自动审核')"
                :value="1">
              </el-option>
              <el-option
                :label="$t('手动审核')"
                :value="0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('好友转账单笔最高限额')" prop="friensTransMaxAmount" v-show="friObj.friendsTransAntomatic">
            <el-input type="number" v-model.number="friObj.friensTransMaxAmount"></el-input>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:FriendTransSetEdit')" class="save-btn" type="primary" @click="submitFriendWithdraw">{{ $t('保存') }}</el-button>
          </el-form-item>
          <!-- </from-wrapper> -->
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('APP推送设置')" v-if="hasPermission('setting:syssetting:FriendTransSetQry')">
        <el-form :model="APPObj" label-width="200px" class="sys-setting-form" ref="appSetting" :rules="appSettingRules" style="width: 500px">
          <el-form-item :label="$t('推送APPKEY')" prop="pushKey">
            <el-input v-model="APPObj.pushKey"></el-input>
          </el-form-item>
          <el-form-item :label="$t('密钥')" prop="secret">
            <el-input v-model="APPObj.secret"></el-input>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:FriendTransSetEdit')" class="save-btn" type="primary" @click="submitAPPsetting">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('原生投注设置')" v-if="hasPermission('setting:syssetting:NativeSportsQry')">
        <div class="open-title mr-b">{{ $t('轮播模块启停') }}</div>
        <div class="mr-b">
          <span class="open-label">{{ $t('轮播模块启用') }}</span>
          <el-switch v-model="nativeSports.isOpenCarousel" active-value="1" inactive-value="0" @change="handleNativeChange('isOpenCarousel')"></el-switch>
        </div>
        <div class="open-line mr-b"></div>
        <div class="open-title mr-b">{{ $t('公告模块启停') }}</div>
        <div class="mr-b">
          <span class="open-label">{{ $t('公共模块启用') }}</span>
          <el-switch v-model="nativeSports.isOpenNotice" active-value="1" inactive-value="0" @change="handleNativeChange"></el-switch>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('合营计划设置')" v-if="hasPermission('setting:syssetting:venturePlanSetQry')">
        <el-form label-width="240px" class="sys-setting-form" style="width: 600px" ref="ventureForm" :model="ventureForm" :rules="commonRule">
          <el-form-item :label="$t('上传合营计划图片')" :rules="commonRule.notNull">
            <el-upload :file-list='venturePlanPicList' list-type="picture-card" action="" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove" :http-request="handleAvatarSuccess1" :class="venturePlanPic?'hide':''">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('上传定义行业图片')" :rules="commonRule.notNull">
            <el-upload :file-list='defineIndustryPicList' list-type="picture-card" action="" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onAvatarRemove2" :http-request="handleAvatarSuccess2" :class="defineIndustryPic?'hide':''">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label-width="0" class="center">
            <el-button v-if="hasPermission('setting:syssetting:venturePlanSetEdit')" class="save-btn" type="primary" @click="submitUnisetting">{{ $t('保存') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- <el-tab-pane :label="$t('短信验证码设置')">
       <el-form :model="messSwi" label-width="300px" class="sys-setting-form" style="width: 600px;">
         <el-form-item :label="$t('客户端绑定手机号与银行卡验证码')">
           <el-radio-group v-model="messSwi.smsVfySecurityBindAndBank">
                  <el-radio label="1">{{ $t('展示') }}</el-radio>
                  <el-radio label="0">{{ $t('关闭') }}</el-radio>
           </el-radio-group>
         </el-form-item>
         <span class="opOfcl"> {{ $t('注') }} : {{ $t('关闭则注册登录') }} 、{{ $t('找回密码') }}、{{ ($t('未绑定手机号皆不校验手机号且屏蔽展示项')) }}</span>
           <el-form-item :label="$t('代理端绑定手机号与银行卡验证码')">
           <el-radio-group v-model="messSwi.smsVfySecurityAgentRegister">
             <el-radio label="1">{{ $t('展示') }}</el-radio>
             <el-radio label="0">{{ $t('关闭') }}</el-radio>
           </el-radio-group>
         </el-form-item>
         <span class="opOfcl" > {{ $t('注') }} : {{ $t('关闭则注册登录') }} 、{{ $t('找回密码') }}、{{ ($t('未绑定手机号皆不校验手机号且屏蔽展示项')) }}</span>


         <el-form-item :label="$t('客户端绑定邮箱')">
           <el-radio-group v-model="messSwi.mailCaptchareg">
             <el-radio label="1">{{ $t('展示') }}</el-radio>
             <el-radio label="0">{{ $t('关闭') }}</el-radio>
           </el-radio-group>
         </el-form-item>


         <el-form-item label-width="0" class="center">
           <el-button class="save-btn" type="primary" @click="submtMess">{{ $t('保存') }}</el-button>
         </el-form-item>
       </el-form>
     </el-tab-pane> -->
     <el-tab-pane :label="$t('短信验证码设置')">
          <div class="RegTab sys-setting-form">
          <el-row >
            <el-col :span="4" class="font-bold border-right">{{ $t('项目') }}</el-col>
            <el-col :span="10">
              <el-col :span="24" class="font-bold border-right">{{ $t('会员端') }}</el-col>
            </el-col>
            <el-col :span="10">
              <el-col :span="24" class="font-bold">{{ $t('代理端') }}
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" class="border-right">{{ $t('验证方式') }}</el-col>
            <el-col :span="10" class="border-right">
              <el-checkbox-group v-model="authMethod" @change="authMethodChange">
                <el-checkbox  v-for="item in authMethodList" :label="item.k" :key="item.k">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="10" >
              <el-checkbox-group v-model="agentAuthMethod" @change="agentAuthMethodChange">
                <el-checkbox  v-for="item in agentAuthMethodList" :label="item.k" :key="item.k">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          </div>

           <el-button class="save-btn" type="primary" @click="submtMess" style="margin-top:30px;margin-left: 45%;margin-bottom: 45px">{{ $t('保存') }}</el-button>

     </el-tab-pane>

    </el-tabs>
    <el-dialog :visible.sync="showTermservice" @close="close" width="78% !important">
      <el-form label-position="right" label-width="auto">
        <el-form-item :label="$t('强制显示网站服务条款')">
          <el-radio v-model="radio" :label="1">{{ $t('是') }}</el-radio>
          <el-radio v-model="radio" :label="0">{{ $t('否') }}</el-radio>
          <el-button style="display: block;margin-left: 0px" type="text" v-show="radio===1" disabled>
            ({{ $t('勾选是，则新用户注册时将先看到网站详细服务条款，必须同意后才可继续注册') }})
          </el-button>
        </el-form-item>
        <p style="margin-bottom: 10px;">{{ $t('网站服务条款') }}：</p>
        <el-input type="textarea" v-model="memo" auto-complete="off" :rows="20"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveTerms">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <Overlay v-show="previewImgShow" @click.native="previewImgClose"></Overlay>
    <div v-show="previewImgShow" class="preview-img">
      <p><i class="el-icon-error" @click="previewImgClose"></i></p>
      <img style="height:300px" :src="uploadSrc">

    </div>

    <div class="intTime intTimeTwo">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>

<script type="text/babel">
import systemConfig from "../../config/config.js";
import Overlay from "../../components/Overlay.vue";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "systemSetting",
  components: { Overlay },
  data() {
    return {
      commonRule: systemConfig.rules.commonRule,
      messageLoading: false,
      ture: true,
      sysSetObj: {},
      sysEncryptObj: {
        value: 0,
        securepwd: "",
      },
      sysEmailSetObj: {},
      otherObj: {
        payAutomatic: 0,
        payMoney: 0,
        alipayEnable: 0,
        isMultipleOpen: 0,
        isAutoDisableOpen: 0,
        withdrawLimitTimeDtoList: [{startTime:'',endTime:''}],
        payAutomatic: 0,
        failureTime: 0,
      },
      autoDisableDurationArr: [],
      autoOpenTimeArr: [
        {
          lable: '手动开启',
          value: 0
        },
        {
          lable: '5分钟',
          value: 5
        },
        {
          lable: '10分钟',
          value: 10
        },
        {
          lable: '20分钟',
          value: 20
        },
        {
          lable: '30分钟',
          value: 30
        },
        {
          lable: '60分钟',
          value: 60
        },
        {
          lable: '2小时',
          value: 120
        },
        {
          lable: '3小时',
          value: 180
        },
        {
          lable: '4小时',
          value: 240
        },
        {
          lable: '1天',
          value: 1440
        },
      ],
      //
      depositCondition: [],
      withdrawCondition: [],
      aiObj: {isEnble:null},
      friObj: {
        friendsTransAntomatic: 0,
        friensTransMaxAmount: 0,
        // 是否自动审核 0-禁用 1-启用
        payAutomatic: 1,
      },
      authMethodList: [
        { k: 'smsVfySecurityBindAndBank', label:  this.$t('短信验证') },
        { k: 'mailVfySecurityBindAndBank', label:  this.$t('邮箱验证') },
        { k: 'googleVfySecurityBindAndBank', label:  this.$t('谷歌验证') },
        { k: 'close', label:  this.$t('关闭') },
      ],
      agentAuthMethodList: [
        { k: 'smsVfySecurityAgentBindAndBank', label:  this.$t('短信验证') },
        { k: 'mailVfySecurityAgentBindAndBank', label:  this.$t('邮箱验证') },
        { k: 'googleVfySecurityAgentBindAndBank', label:  this.$t('谷歌验证') },
        { k: 'close', label:  this.$t('关闭') },
      ],
      messSwi: {
        // 0-禁用 1-启用
        smsVfySecurityBindAndBank: 1, // 客户端短信
        smsVfySecurityAgentBindAndBank: 1, // 代理端短信
        mailVfySecurityBindAndBank: 0, // 客户端邮箱验证码绑定
        mailVfySecurityAgentBindAndBank: 0, // 代理端邮箱验证码绑定
        googleVfySecurityBindAndBank: 0, // 客户端google验证码绑定
        googleVfySecurityAgentBindAndBank: 0, // 代理端google验证码绑定
      },
      authMethod: ['close'],
      agentAuthMethod: ['close'],
      siteUrlList: [],
      promotionSettingObj: {
        account: {
          type: 0,
          siteUrlId: null,
        },
        agent: {
          type: 1,
          siteUrlId: null,
        },
        channel: {
          type: 2,
          siteUrlId: null,
        },
        friendRelegationPromotion: "0",
      },
      outCallPlatform: "",
      promotionSettingRules: {
        "account.type": { required: true, message: this.$t("请选择一个") },
        "account.siteUrlId": { required: true, message: this.$t("请选择一个") },
        "agent.type": { required: true, message: this.$t("请选择一个") },
        "agent.siteUrlId": { required: true, message: this.$t("请选择一个") },
        "channel.type": { required: true, message: this.$t("请选择一个") },
        "channel.siteUrlId": { required: true, message: this.$t("请选择一个") },
        friendRelegationPromotion: { required: true, message: this.$t("请选择一个") },
        memo: { required: true, message: this.$t("请填写备注") },
      },
      otherSettingRules: {
        payAutomatic: { required: true, message: this.$t("请选择一个") },
        alipayEnable: { required: true, message: this.$t("请选择一个") },
        isMultipleOpen: { required: true, message: this.$t("请选择一个") },
        isAutoDisableOpen: { required: true, message: this.$t("请选择一个") },
        autoDisableDuration: { required: true, message: this.$t("请选择一个") },
        autoDisableTimes: { required: true, message: this.$t("请选择一个") },
        autoOpenTime: { required: true, message: this.$t("请选择一个") },
        payMoney: {
          required: true,
          type: "integer",
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (this.otherObj.payAutomatic) {
              if (/^\d+$/.test(value)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入正整数")));
              }
            }
            callback();
          },
        },
        failureTime: {
          required: true,
          type: "integer",
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (this.otherObj.payAutomatic) {
              if (/^\d+$/.test(value)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入正整数")));
              }
            }
            callback();
          },
        },
        // cishu: {validator: (rule, value, callback) => {
        //     if (value<0) {
        //       callback(new Error("请输入大于0的整数"));
        //     }
        //     callback();
        //   },}
        limitTime: {
          trigger: "blur",
          validator: (rule,value,callback) => {
            if(this.otherObj.withdrawLimitTimeDtoList.length){
              let arr = this.otherObj.withdrawLimitTimeDtoList
              arr.map(ws=>{
                if(ws.startTime&&!ws.endTime||!ws.startTime&&ws.endTime){
                  callback(new Error(this.$t("请输入完整的不可提款时间段！")));
                }
                if(ws.startTime&&ws.endTime){
                  if(ws.startTime.slice(0,3)>ws.endTime.slice(0,3)||(ws.startTime.slice(0,3)===ws.endTime.slice(0,3)&&ws.startTime.slice(3)>=ws.endTime.slice(3))){
                    callback(new Error(this.$t("开始时间不能早于结束时间！")));
                  }
                }
              })
              callback()
            }
            callback()
          }
        }
      },
      aiSettingRules: {
        isEnble: {required: true, message: this.$t("请选择是否推荐")}
      },
      friToggleSettingRules: {
        friendsTransAntomatic: { required: true, message: this.$t("请选择一个") },
        friensTransMaxAmount: {
          required: true,
          type: "integer",
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (this.friObj.friendsTransAntomatic) {
              if (/^\d+$/.test(value)) {
                callback();
              } else {
                callback(new Error(this.$t("请输入正整数")));
              }
            }
            callback();
          },
        },
      },
      smsList: [],
      sysSmsSetObj: {},
      sysRegSetObj: {
        // 0无 1默认 2必填默认
        loginName: 2,
        address: 0,
        captchareg: 2,
        email: 0,
        loginPwd: 2,
        mobile: 0,
        qq: 0,
        realName: 0,
        reLoginPwd: 2,
        weChat: 0,
        mobileCaptchareg: 0,
        mailCaptchareg: 0,
        agentLoginName: 2,
        agentAddress: 0,
        agentCaptchareg: 2,
        agentEmail: 0,
        agentLoginPwd: 2,
        agentMobile: 0,
        agentQQ: 0,
        agentRealName: 0,
        agentReLoginPwd: 2,
        agentWechat: 0,
        agentMobileCaptchareg: 0,
        agentMailCaptchareg: 0,
        registerMethod: 0,
        deviceUuid: 0,
        loginIp: 0
      },
      logoFile: "",
      titleFile: "",
      showTermservice: false,
      flag: true, // true会员注册的条款   false代理注册的条款
      radio: 1,
      memo: "",
      termServise: {},
      inputLogoName: "",
      inputTitleName: "",
      previewImgShow: false,
      uploadSrc: "",
      accWebRegister: "",
      registed: true,
      sysSmsSetObjArr: [],
      APPObj:{},
      appSettingRules: {
        pushKey:[{required:true,message:this.$t('请输入秘钥'),trigger:'blur'}],
        secret:[{required:true,message:this.$t('请输入') + 'secret',trigger:'blur'}],
      },
      nativeSports: {
        isOpenCarousel: '0',
        isOpenNotice: '0'
      },
      ventureForm: {},
      venturePlanPic:null,
      defineIndustryPic:null,
      venturePlanPicList: [],
      defineIndustryPicList: [],
      pcIconSkypeList: [],
      appIconSkypeList: [],
      pcIconTelegramList: [],
      appIconTelegramList: [],
      pcIconFlygramList: [],
      appIconFlygramList: [],
      aliaoList: [],
    };
  },
  created() {
    this.getStationSet();
    this.getEncryptSet();
    this.getRegisterSet();
    this.otherSet();
    this.friendSet();
    this.getSiteUrlList();
    this.getPromotionSet();
    this.getSmsList();
    this.getMailSet();
    this.getAiRecommendSet();
    this.getAPPSetting();
    this.queryNativeSports()
    this.queryVenturePlanSet()
    this.getSmsVfySecurityConfig()
    this.autoDisableDurationArr.length =  10
  },
  computed: {
    logoStyleObject() {
      return this.sysSetObj.logoPath !== "" ? { "padding-left": "150px" } : "";
    },
    titleStyleObject() {
      return this.sysSetObj.titlePath !== "" ? { "padding-left": "150px" } : "";
    },
    picShow() {
      return this.sysSetObj && this.sysSetObj.logoPath;
    },
    mbShow() {
      return this.sysSetObj && this.sysSetObj.titlePath;
    },
    captchareg1: {
      get: function () {
        return this.sysRegSetObj.captchareg > 1 ? true : false;
      },
      set: function () {},
    },
    captchareg2: {
      get: function () {
        return this.sysRegSetObj.captchareg > 0 ? true : false;
      },
      set: function () {},
    },
    captchareg3: {
      get: function () {
        return this.sysRegSetObj.agentCaptchareg > 1 ? true : false;
      },
      set: function () {},
    },
    captchareg4: {
      get: function () {
        return this.sysRegSetObj.agentCaptchareg > 0 ? true : false;
      },
      set: function () {},
    },
    reLoginPwd1: {
      get: function () {
        return this.sysRegSetObj.reLoginPwd > 1 ? true : false;
      },
      set: function () {},
    },
    reLoginPwd2: {
      get: function () {
        return this.sysRegSetObj.reLoginPwd > 0 ? true : false;
      },
      set: function () {},
    },
    reLoginPwd3: {
      get: function () {
        return this.sysRegSetObj.agentReLoginPwd > 1 ? true : false;
      },
      set: function () {},
    },
    reLoginPwd4: {
      get: function () {
        return this.sysRegSetObj.agentReLoginPwd > 0 ? true : false;
      },
      set: function () {},
    },
    trueName1: {
      get: function () {
        return this.sysRegSetObj.realName > 1 ? true : false;
      },
      set: function () {},
    },
    trueName2: {
      get: function () {
        return this.sysRegSetObj.realName > 0 ? true : false;
      },
      set: function () {},
    },
    trueName3: {
      get: function () {
        return this.sysRegSetObj.agentRealName > 1 ? true : false;
      },
      set: function () {},
    },
    trueName4: {
      get: function () {
        return this.sysRegSetObj.agentRealName > 0 ? true : false;
      },
      set: function () {},
    },
    mobile1: {
      get: function () {
        return this.sysRegSetObj.mobile > 1 ? true : false;
      },
      set: function () {},
    },
    mobile2: {
      get: function () {
        return this.sysRegSetObj.mobile > 0 ? true : false;
      },
      set: function () {},
    },
    mobile3: {
      get: function () {
        return this.sysRegSetObj.agentMobile > 1 ? true : false;
      },
      set: function () {},
    },
    mobile4: {
      get: function () {
        return this.sysRegSetObj.agentMobile > 0 ? true : false;
      },
      set: function () {},
    },
    email1: {
      get: function () {
        return this.sysRegSetObj.email > 1 ? true : false;
      },
      set: function () {},
    },
    email2: {
      get: function () {
        return this.sysRegSetObj.email > 0 ? true : false;
      },
      set: function () {},
    },
    email3: {
      get: function () {
        return this.sysRegSetObj.agentEmail > 1 ? true : false;
      },
      set: function () {},
    },
    email4: {
      get: function () {
        return this.sysRegSetObj.agentEmail > 0 ? true : false;
      },
      set: function () {},
    },
    qq1: {
      get: function () {
        return this.sysRegSetObj.qq > 1 ? true : false;
      },
      set: function () {},
    },
    qq2: {
      get: function () {
        return this.sysRegSetObj.qq > 0 ? true : false;
      },
      set: function () {},
    },
    qq3: {
      get: function () {
        return this.sysRegSetObj.agentQQ > 1 ? true : false;
      },
      set: function () {},
    },
    qq4: {
      get: function () {
        return this.sysRegSetObj.agentQQ > 0 ? true : false;
      },
      set: function () {},
    },
    wechat1: {
      get: function () {
        return this.sysRegSetObj.weChat > 1 ? true : false;
      },
      set: function () {},
    },
    wechat2: {
      get: function () {
        return this.sysRegSetObj.weChat > 0 ? true : false;
      },
      set: function () {},
    },
    wechat3: {
      get: function () {
        return this.sysRegSetObj.agentWechat > 1 ? true : false;
      },
      set: function () {},
    },
    wechat4: {
      get: function () {
        return this.sysRegSetObj.agentWechat > 0 ? true : false;
      },
      set: function () {},
    },
    whatsapp1: {
      get: function () {
        return this.sysRegSetObj.whatsapp > 1 ? true : false;
      },
      set: function () {},
    },
    whatsapp2: {
      get: function () {
        return this.sysRegSetObj.whatsapp > 0 ? true : false;
      },
      set: function () {},
    },
    whatsapp3: {
      get: function () {
        return this.sysRegSetObj.agentWhatsapp > 1 ? true : false;
      },
      set: function () {},
    },
    whatsapp4: {
      get: function () {
        return this.sysRegSetObj.agentWhatsapp > 0 ? true : false;
      },
      set: function () {},
    },
    telegram1: {
      get: function () {
        return this.sysRegSetObj.telegram > 1 ? true : false;
      },
      set: function () {},
    },
    telegram2: {
      get: function () {
        return this.sysRegSetObj.telegram > 0 ? true : false;
      },
      set: function () {},
    },
    telegram3: {
      get: function () {
        return this.sysRegSetObj.agentTelegram > 1 ? true : false;
      },
      set: function () {},
    },
    telegram4: {
      get: function () {
        return this.sysRegSetObj.agentTelegram > 0 ? true : false;
      },
      set: function () {},
    },
    address1: {
      get: function () {
        return this.sysRegSetObj.address > 1 ? true : false;
      },
      set: function () {},
    },
    address2: {
      get: function () {
        return this.sysRegSetObj.address > 0 ? true : false;
      },
      set: function () {},
    },
    address3: {
      get: function () {
        return this.sysRegSetObj.agentAddress > 1 ? true : false;
      },
      set: function () {},
    },
    address4: {
      get: function () {
        return this.sysRegSetObj.agentAddress > 0 ? true : false;
      },
      set: function () {},
    },
    promotion1: {
      get: function () {
        return this.sysRegSetObj.promotion > 1 ? true : false;
      },
      set: function () {},
    },
    promotion2: {
      get: function () {
        return this.sysRegSetObj.promotion > 0 ? true : false;
      },
      set: function () {},
    },
    promotion3: {
      get: function () {
        return null
      },
      set: function () {},
    },
    promotion4: {
      get: function () {
        return null
      },
      set: function () {},
    },
    isShowSysSet() {
      const { hasPermission } = this;
      return {
        show:
          hasPermission("setting:syssetting:StationSetQry") ||
          hasPermission("setting:syssetting:StationSetEdit") ||
          hasPermission("setting:syssetting:MailContent") ||
          hasPermission("setting:syssetting:updateMailContent") ||
          hasPermission("setting:syssetting:MailSetQry") ||
          hasPermission("setting:syssetting:MailSetEdit") ||
          hasPermission("setting:syssetting:SmsSetQry") ||
          hasPermission("setting:syssetting:SmsSetEdit") ||
          hasPermission("setting:syssetting:RegisterSetQry") ||
          hasPermission("setting:syssetting:RegisterSetEdit") ||
          hasPermission("setting:syssetting:PromotionSetQry") ||
          hasPermission("setting:syssetting:PromotionSetEdit") ||
          hasPermission("setting:syssetting:PaySetQry") ||
          hasPermission("setting:syssetting:PaySetEdit") ||
          hasPermission("setting:syssetting:AiRecommend") ||
          hasPermission("setting:syssetting:FriendTransSetQry") ||
          hasPermission("setting:syssetting:FriendTransSetEdit"),
      };
    },
    ...mapGetters(["hasPermission"]),
  },
  methods: {
    /* 原生投注设置 */
    async handleNativeChange(type) {
      const { isOpenCarousel, isOpenNotice } = this.nativeSports
      const body = { isOpenCarousel, isOpenNotice }
      const { res } = await this.$axios.POST(this.$urls.nativeSportsSet.set, body)
      if (res) {
        this.$message.success(this.$t('操作成功'))
        this.queryNativeSports()
      }
    },
    /* 获取原生投注设置 */
    async queryNativeSports() {
      const { res } = await this.$axios.GET(this.$urls.nativeSportsSet.query)
      if (res) {
        const { data: { isOpenCarousel, isOpenNotice } } = res
        this.nativeSports.isOpenCarousel = isOpenCarousel
        this.nativeSports.isOpenNotice = isOpenNotice
      }
    },
    /*获取短信配置*/
    async getSmsList() {
      await this.$axios.get(systemConfig.urls.querySmsSet).then((res) => {
        this.sysSmsSetObjArr = res.data.data.map(item => {
          item.mobileAreaCode = "86" // 测试按钮功能单独使用，保存按钮后台不处理
          // platformId=11为传信通道
          if (item.platformId === 11 || item.platformId === 13) {
            if (item.languageInterface) {
              item.languageInterfaceArr = JSON.parse(item.languageInterface)
            } else {
              item.languageInterfaceArr = [
                {name: '马来西亚',"language":"ms","enable":0,"interfaceName":"","interfacePassword":""},
                {name: '印度尼西亚',"language":"id","enable":0,"interfaceName":"","interfacePassword":""},
                {name: '澳大利亚',"language":"au","enable":0,"interfaceName":"","interfacePassword":""},
                {name: '菲律宾',"language":"ph","enable":0,"interfaceName":"","interfacePassword":""},
                {name: '越南',"language":"vi","enable":0,"interfaceName":"","interfacePassword":""},
                {name: '其他国家',"language":"other","enable":0,"interfaceName":"","interfacePassword":""},
              ]
            }
          }
          return item
        });
        this.sysSmsSetObj = JSON.parse(JSON.stringify(this.sysSmsSetObjArr))[0];
        console.log('this.sysSmsSetObj===', this.sysSmsSetObj)
        this.smsList = [];
        res.data.data.forEach((item) => {
          this.smsList.push(item.platformName);
        });
      });
    },
    smsChange(val) {
      let t = this.sysSmsSetObjArr;
      t.map((item) => {
        if (item.platformName == val) {
          this.sysSmsSetObj = JSON.parse(JSON.stringify(item));
        }
      });
    },
    close() {
      this.showTermservice = false;
      this.memo = "";
    },
    previewImgOpen(src) {
      this.previewImgShow = true;
      this.uploadSrc = src;
    },
    previewImgClose() {
      this.previewImgShow = false;
      this.uploadSrc = "";
    },
    getWebTerms() {
      this.$axios.get(systemConfig.urls.queryWebTerms).then((res) => {
        this.termServise = res.data.data;
        if (this.flag) {
          this.radio = this.termServise.memberDisplayTermsOfWebsite;
          this.memo = this.termServise.memberServiceTermsOfWebsite;
        } else {
          this.radio = this.termServise.agentDisplayTermsOfWebsite;
          this.memo = this.termServise.agentServiceTermsOfWebsite;
        }
      });
    },
    saveTerms() {
      if (!this.memo) {
        this.$message({
          type: "warning",
          message: this.$t("条款不能为空"),
        });
        return;
      }
      if (this.flag) {
        this.termServise.memberDisplayTermsOfWebsite = this.radio;
        this.termServise.memberServiceTermsOfWebsite = this.memo;
      } else {
        this.termServise.agentDisplayTermsOfWebsite = this.radio;
        this.termServise.agentServiceTermsOfWebsite = this.memo;
      }
      this.$axios
        .post(systemConfig.urls.modifyWebTerms, this.termServise)
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("修改成功"),
          });
          this.close();
        });
    },
    submitWithdraw() {
      if (!this.otherObj.payAutomatic) {
        this.otherObj.payMoney = 0;
      }
      this.$refs.otherSetting.validate((valid) => {
        if (valid) {
          let params = {
            ...this.otherObj,
            ...{ depositCondition: this.depositCondition },
            ...{ withdrawCondition: this.withdrawCondition },
          };
          this.otherObj.withdrawLimitTimeDtoList.map((ws,index)=>{
            if(!ws.startTime&&!ws.endTime||ws.startTime===""&&ws.endTime===""||ws.startTime==='null'&&ws.endTime==='null'){
              if(this.otherObj.withdrawLimitTimeDtoList.length===1){
                params.withdrawLimitTimeDtoList = []
              }else{
                params.withdrawLimitTimeDtoList.splice(index,1)
              }
            }
          })
          this.$axios
            .post(systemConfig.urls.systemOtherSetModify, params)
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("修改成功"),
              });
            });
        }
      });
    },
    submitAi(){
      this.$refs.aiSetting.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.modifyAiRecommendSet, this.aiObj)
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("设置成功"),
              });
            });
        }
      });
    },
    submtMess(){
      this.$axios
        .post(systemConfig.urls.modifySmsVfySecurityConfig, this.messSwi)
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("设置成功"),
          });
        });
    },
    submitFriendWithdraw() {
      if (!this.friObj.friendsTransAntomatic) {
        this.friObj.friensTransMaxAmount = 0;
      }
      this.$refs.friToggleSetting.validate((valid) => {
        if (valid) {
          this.$axios
            .post(systemConfig.urls.systemFriToggleSetModify, this.friObj)
            .then((res) => {
              this.$message({
                type: "success",
                message: this.$t("修改成功"),
              });
            });
        }
      });
    },
    showTerms(flag, limit) {
      if (!limit) {
        return;
      }
      this.showTermservice = true;
      this.flag = flag;
      this.getWebTerms();
    },
    async getPromotionSet() {
      this.$axios.get(systemConfig.urls.queryPromotionOutCall).then((res) => {
        if (res) {
          this.outCallPlatform = JSON.parse(
            res.data.outCallPlatform
          ).outCallPlatform;
        }
      });
      await this.$axios
        .get(systemConfig.urls.queryPromotionSetForSysSetting)
        .then((res) => {
          if (res) {
            this.promotionSettingObj = res.data;
            this.promotionSettingObj.agent.siteUrlId =
              this.promotionSettingObj.agent.siteUrlId || null;
            this.$nextTick(() => {
              this.$refs.promotionSetting.clearValidate();
            });
          }
        })
      this.$axios.get(systemConfig.urls.queryFriendRelegationSet).then((res) => {
        if (res) {
          const data = JSON.parse(res.data.friendRelegationPromotion).friendRelegationPromotion
          this.$set(this.promotionSettingObj, 'friendRelegationPromotion', data)
        }
      });
    },
    savePromotionSetting() {
      this.$refs.promotionSetting.validate((valid) => {
        if (valid) {
          Promise.all([
            this.$axios.post(
              systemConfig.urls.promotionSetForSysSetting,
              this.promotionSettingObj.account
            ),
            this.$axios.post(
              systemConfig.urls.promotionSetForSysSetting,
              this.promotionSettingObj.agent
            ),
            this.$axios.post(
              systemConfig.urls.promotionSetForSysSetting,
              this.promotionSettingObj.channel
            ),
            this.$axios.post(systemConfig.urls.promotionSetOutCall, {
              outCallPlatform: this.outCallPlatform,
            }),
            this.$axios.post(systemConfig.urls.modifyFriendRelegationSet, {
              friendRelegationPromotion: this.promotionSettingObj.friendRelegationPromotion,
            }),
          ]).then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: this.$t("保存成功"),
              });
            }
          });
        }
      });
    },
    getSiteUrlList() {
      this.$axios
        .get(systemConfig.urls.getSiteUrlListForSysSetting)
        .then((res) => {
          this.siteUrlList = res.data.data;
        });
    },
    getRegisterSet() {
      this.$axios.get(systemConfig.urls.queryRegisterSet).then((res) => {
        let data = JSON.parse(JSON.stringify(res.data.data));
        this.sysRegSetObj = data;
        this.sysRegSetObj.registerMethod = this.sysRegSetObj.registerMethod
          ? true
          : false;
        this.registerMethod = this.sysRegSetObj.registerMethod;
        this.accWebRegister = res.data.data.accWebRegister == 1 ? 1 : 0;
      });
    },
    getSmsSet() {
      this.$axios.get(systemConfig.urls.querySmsSet).then((res) => {
        this.sysSmsSetObj = res.data.data;
      });
    },
    getEncryptSet() {
      this.$axios.get(systemConfig.urls.querySysEncryptSet).then((res) => {
        this.sysEncryptObj = {
          value: res.data.data.sysvalue,
        };
      });
    },
    getMailSet() {
      this.$axios.get(systemConfig.urls.queryMailContent).then((res) => {
        this.sysEmailSetObj = res.data;
      });
    },
    getAiRecommendSet(){
      this.$axios
        .get(systemConfig.urls.queryAiRecommendSet)
        .then((res) => {
          this.aiObj = res.data.data;
        });
    },
    getSmsVfySecurityConfig(){
      this.$axios
      .get(systemConfig.urls.querySmsVfySecurityConfig)
      .then((res) => {
        const data = res.data.data;
        data.map(({ syskey, sysvalue }) =>{
          this.$set(this.messSwi, syskey, sysvalue ? Number(sysvalue) : sysvalue)
        })
        this.setAuthMethod()
      });
    },
    getStationSet(isChangeTitleIocn = false) {
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.queryStationSetForSystSetting)
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.sysSetObj = res.data.data;
          const data = res.data.data
          const obj = {
            'pcIconSkypeList': 'pcIconSkype',
            'appIconSkypeList': 'appIconSkype',
            'pcIconTelegramList': 'pcIconTelegram',
            'appIconTelegramList': 'appIconTelegram',
            'pcIconFlygramList': 'pcIconFlygram',
            'appIconFlygramList': 'appIconFlygram',
            'aliaoList': 'chatLogo'
          }
          Object.keys(obj).map( key => {
            if (!data[obj[key]]) return
            this[key] = [ { name:'', url: data[obj[key]] } ]
          })
          if (isChangeTitleIocn) {
            this.changeFavicon(data.titlePath)
          }
        });
    },
    otherSet() {
      this.$axios.get(systemConfig.urls.systemOtherSet).then((res) => {
        const data = res.data.data
        if (!data) return
        const solveData = {
          ...data,
          withdrawLimitTimeDtoList: data.withdrawLimitTimeDtoList.length ? data.withdrawLimitTimeDtoList : [{startTime:'',endTime:''}],
        }
        this.otherObj = solveData
        this.depositCondition = this.otherObj.depositCondition || []
        this.withdrawCondition = this.otherObj.withdrawCondition || []
      });
    },
    friendSet() {
      this.$axios.get(systemConfig.urls.systemFriToggleSet).then((res) => {
        const data = res.data.data
        if (!data) return
        this.friObj = data
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this["save" + formName]();
        } else {
          return false;
        }
      });
    },
    getLogoFile(event) {
      if (event.target.files[0]) {
        this.logoFile = event.target.files[0];
        this.inputLogoName = event.target.files[0].name;
      }
    },
    getTitleFile(event) {
      if (event.target.files[0]) {
        this.titleFile = event.target.files[0];
        this.inputTitleName = event.target.files[0].name;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 系统设置
    savesysSetObj() {
      if (
        !this.sysSetObj.defaultQueryDays ||
        this.sysSetObj.defaultQueryDays < 0
      ) {
        this.$message({
          type: "warning",
          message: this.$t("天数要大于0"),
        });
        return;
      }
      if (!this.sysSetObj.autoDeleteDays || this.sysSetObj.autoDeleteDays < 0) {
        this.$message({
          type: "warning",
          message: this.$t("天数要大于0"),
        });
        return;
      }
      if (
        !this.sysSetObj.memberQueryDays ||
        this.sysSetObj.memberQueryDays < 0
      ) {
        this.$message({
          type: "warning",
          message: this.$t("天数要大于0"),
        });
        return;
      }
      if (
        !this.sysSetObj.passwordExpireDays ||
        this.sysSetObj.passwordExpireDays < 0
      ) {
        this.$message({
          type: "warning",
          message: this.$t("天数要大于0"),
        });
        return;
      }
      let formData = new FormData();
      if (!this.sysSetObj.logoPath && !this.logoFile) {
        this.$message({
          type: "warning",
          message: this.$t("请选择一张图片"),
        });
        return;
      }
      if (!this.sysSetObj.titlePath && !this.titleFile) {
        this.$message({
          type: "warning",
          message: this.$t("请选择一张图片"),
        });
        return;
      }
      if (!this.sysSetObj.configCodePc) {
        this.$message({
          type: "warning",
          message: this.$t("客服配置代码不能为空"),
        });
        return;
      }
      if (!this.sysSetObj.configCodeMb) {
        this.$message({
          type: "warning",
          message: this.$t("客服配置代码不能为空"),
        });
        return;
      }
      if (!this.sysSetObj.websiteCodePc) {
        this.$message({
          type: "warning",
          message: this.$t("配置代码不能为空"),
        });
        return;
      }
      if (!this.sysSetObj.websiteCodeMb) {
        this.$message({
          type: "warning",
          message: this.$t("配置代码不能为空"),
        });
        return;
      }
      if (!this.sysSetObj.forwardUrl) {
        this.$message({
          type: "warning",
          message: this.$t("配置外跳地址不能为空"),
        });
        return;
      }
      if (this.logoFile) {
        formData.append("logoPicFile", this.logoFile);
      }
      if (this.titleFile) {
        formData.append("titlePicFile", this.titleFile);
      }
      let stationSet = { ...this.sysSetObj }
      formData.append("stationSet", JSON.stringify(stationSet));
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post(systemConfig.urls.modifyStationSet, formData, config)
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("修改成功"),
          });
          this.getStationSet(true);
          this.inputTitleName = "";
          this.inputLogoName = "";
        });
    },
    // 数据库加密
    saveSysEncryptObj() {
      if (!this.sysEncryptObj.securepwd) {
        this.$message({
          type: "warning",
          message: this.$t("安全密码不能为空"),
        });
        return;
      }
      this.$axios
        .get(systemConfig.urls.sysEncryptUpdate, {
          params: this.sysEncryptObj,
        })
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("修改成功"),
          });
          this.getEncryptSet();
        });
    },
    // 邮件设置
    savesysEmailSetObj() {
      if (!this.sysEmailSetObj.mailSubject) {
        this.$message({
          type: "warning",
          message: this.$t("邮件标题不能为空"),
        });
        return;
      }
      if (!this.sysEmailSetObj.mailContent) {
        this.$message({
          type: "warning",
          message: this.$t("邮件内容不能为空"),
        });
        return;
      }
      this.$axios
        .post(systemConfig.urls.modifyMailSave, this.sysEmailSetObj)
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("修改成功"),
          });
          this.getMailSet();
        });
    },
    // 短信设置
    async savesysSmsSetObj() {
      if (this.sysSmsSetObj.platformName != "Telesign") {
        if (!this.sysSmsSetObj.getwayAddress) {
          this.$message({
            type: "warning",
            message: this.$t("短信网关地址不能为空"),
          });
          return;
        }
      }
      if (!this.sysSmsSetObj.interfaceName) {
        this.$message({
          type: "warning",
          message: this.$t("短信用户接口名不能为空"),
        });
        return;
      }
      if (!this.sysSmsSetObj.interfacePassword) {
        this.$message({
          type: "warning",
          message: this.$t("短信接口密码不能为空"),
        });
        return;
      }
      // if (!this.sysSmsSetObj.sendName) {
      //   this.$message({
      //     type: 'warning',
      //     message: '短信发送方名称不能为空'
      //   })
      //   return
      // }
      if (!this.sysSmsSetObj.template) {
        this.$message({
          type: "warning",
          message: this.$t("短信模版不能为空"),
        });
        return;
      }
      // if (!this.checkPhoneNumberAreaList.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "支持国家设置不能为空",
      //   });
      //   return;
      // }
      this.messageLoading = true;
      const platformName = this.sysSmsSetObj.platformName;
      console.log('this.sysSmsSetObj======', this.sysSmsSetObj)
      if (this.sysSmsSetObj.platformId === 11 || this.sysSmsSetObj.platformId  === 13) {
        this.sysSmsSetObj.languageInterface = JSON.stringify(this.sysSmsSetObj.languageInterfaceArr)
      }
      await this.$axios.post(systemConfig.urls.modifySmsSet, {
        smsConfigs: [this.sysSmsSetObj],
      });
      await this.getSmsList();
      this.$set(this.sysSmsSetObj, "platformName", platformName);
      this.smsChange(platformName);
      this.messageLoading = false;
      this.$message({
        type: "success",
        message: this.$t("修改成功"),
      });
    },
    sysEmailtest() {
      if (!this.sysEmailSetObj.mailReceiver) {
        this.$message({
          type: "warning",
          message: this.$t("测试邮件不能为空"),
        });
        return;
      }
      if (
        !/^[\\*\w]+@([a-zA-Z0-9-]+.){1,2}(com|cn|org|gov.cn|net|edu.cn)$/.test(
          this.sysEmailSetObj.mailReceiver
        )
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请输入正确的邮箱"),
        });
        return;
      }
      this.$axios
        .get(systemConfig.urls.testReceiveMail, { params: this.sysEmailSetObj })
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("发送成功"),
          });
        });
    },
    sysSmstest() {
      if (!this.sysSmsSetObj.mobile) {
        this.$message({
          type: "warning",
          message: this.$t("测试手机不能为空"),
        });
        return;
      }
      this.$axios
        .get(systemConfig.urls.testReceiveSms, { params: this.sysSmsSetObj })
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("发送成功"),
          });
        });
    },
    savesysRegSetObj() {
      const { registerMethod, loginIp, deviceUuid } = this.sysRegSetObj
      if (loginIp && loginIp < 0) return this.$message.error(this.$t('同IP注册限制不能小于0'))
      if (deviceUuid && deviceUuid < 0) return this.$message.error(this.$t('同设备注册限制不能小于0'))
      Promise.all([
        this.$axios.post(
          systemConfig.urls.modifyRegisterSet,
          { ...this.sysRegSetObj, registerMethod: registerMethod ? 1 : 0 }
        ),
        this.$axios.post(systemConfig.urls.modifyAccWebRegister, {
          accWebRegister: this.accWebRegister,
        }),
      ])
        .then((res) => {
          this.$message({
            type: "success",
            message: this.$t("修改成功"),
          });
          this.getRegisterSet();
        })
        .catch((err) => {
          this.$message({
            type: "warning",
            message: err.data.msg,
          });
        });
    },
    trueName1Change() {
      if (this.sysRegSetObj.realName === 1) {
        this.sysRegSetObj.realName = 2;
      } else {
        this.sysRegSetObj.realName
          ? (this.sysRegSetObj.realName = 0)
          : (this.sysRegSetObj.realName = 2);
      }
    },
    trueName2Change() {
      this.sysRegSetObj.realName
        ? (this.sysRegSetObj.realName = 0)
        : (this.sysRegSetObj.realName = 1);
    },
    trueName3Change() {
      if (this.sysRegSetObj.agentRealName === 1) {
        this.sysRegSetObj.agentRealName = 2;
      } else {
        this.sysRegSetObj.agentRealName
          ? (this.sysRegSetObj.agentRealName = 0)
          : (this.sysRegSetObj.agentRealName = 2);
      }
    },
    trueName4Change() {
      this.sysRegSetObj.agentRealName
        ? (this.sysRegSetObj.agentRealName = 0)
        : (this.sysRegSetObj.agentRealName = 1);
    },
    captchareg1Change(value) {
      // if (value) {
      //   this.sysRegSetObj.mobileCaptchareg = 0
      // }
      if (this.sysRegSetObj.captchareg === 1) {
        this.sysRegSetObj.captchareg = 2;
      } else {
        this.sysRegSetObj.captchareg
          ? (this.sysRegSetObj.captchareg = 0)
          : (this.sysRegSetObj.captchareg = 2);
      }
    },
    captchareg2Change(value) {
      // if (value) {
      //   this.sysRegSetObj.mobileCaptchareg = 0
      // }
      this.sysRegSetObj.captchareg
        ? (this.sysRegSetObj.captchareg = 0)
        : (this.sysRegSetObj.captchareg = 1);
    },
    captchareg3Change(value) {
      if (value) {
        this.sysRegSetObj.agentMobileCaptchareg = 0;
      }
      if (this.sysRegSetObj.agentCaptchareg === 1) {
        this.sysRegSetObj.agentCaptchareg = 2;
      } else {
        this.sysRegSetObj.agentCaptchareg
          ? (this.sysRegSetObj.agentCaptchareg = 0)
          : (this.sysRegSetObj.agentCaptchareg = 2);
      }
    },
    captchareg4Change(value) {
      if (value) {
        this.sysRegSetObj.agentMobileCaptchareg = 0;
      }
      this.sysRegSetObj.agentCaptchareg
        ? (this.sysRegSetObj.agentCaptchareg = 0)
        : (this.sysRegSetObj.agentCaptchareg = 1);
    },
    reLoginPwd1Change() {
      if (this.sysRegSetObj.reLoginPwd === 1) {
        this.sysRegSetObj.reLoginPwd = 2;
      } else {
        this.sysRegSetObj.reLoginPwd
          ? (this.sysRegSetObj.reLoginPwd = 0)
          : (this.sysRegSetObj.reLoginPwd = 2);
      }
    },
    reLoginPwd2Change() {
      this.sysRegSetObj.reLoginPwd
        ? (this.sysRegSetObj.reLoginPwd = 0)
        : (this.sysRegSetObj.reLoginPwd = 1);
    },
    reLoginPwd3Change() {
      if (this.sysRegSetObj.agentReLoginPwd === 1) {
        this.sysRegSetObj.agentReLoginPwd = 2;
      } else {
        this.sysRegSetObj.agentReLoginPwd
          ? (this.sysRegSetObj.agentReLoginPwd = 0)
          : (this.sysRegSetObj.agentReLoginPwd = 2);
      }
    },
    reLoginPwd4Change() {
      this.sysRegSetObj.agentReLoginPwd
        ? (this.sysRegSetObj.agentReLoginPwd = 0)
        : (this.sysRegSetObj.agentReLoginPwd = 1);
    },
    mobile1Change() {
      if (this.sysRegSetObj.mobile === 2) {
        this.sysRegSetObj.mobile = 0;
        this.sysRegSetObj.mobileCaptchareg = 0;
      } else {
        this.sysRegSetObj.mobile = 2;
      }
    },
    mobile2Change() {
      if (this.sysRegSetObj.mobile) {
        this.sysRegSetObj.mobile = 0;
        this.sysRegSetObj.mobileCaptchareg = 0;
      } else {
        this.sysRegSetObj.mobile = 1;
      }
    },
    mobile3Change() {
      if (this.sysRegSetObj.agentMobile === 2) {
        this.sysRegSetObj.agentMobile = 0;
        this.sysRegSetObj.agentMobileCaptchareg = 0;
      } else {
        this.sysRegSetObj.agentMobile = 2;
      }
    },
    mobile4Change() {
      if (this.sysRegSetObj.agentMobile) {
        this.sysRegSetObj.agentMobile = 0;
        this.sysRegSetObj.agentMobileCaptchareg = 0;
      } else {
        this.sysRegSetObj.agentMobile = 1;
      }
    },
    email1Change() {
      if (this.sysRegSetObj.email === 2) {
        this.sysRegSetObj.email = 0;
        this.sysRegSetObj.mailCaptchareg = 0;
      } else {
        this.sysRegSetObj.email = 2;
      }
    },
    email2Change() {
      if (this.sysRegSetObj.email) {
        this.sysRegSetObj.email = 0;
        this.sysRegSetObj.mailCaptchareg = 0;
      } else {
        this.sysRegSetObj.email = 1;
      }
    },
    email3Change() {
      if (this.sysRegSetObj.agentEmail === 2) {
        this.sysRegSetObj.agentEmail = 0;
        this.sysRegSetObj.agentMailCaptchareg = 0;
      } else {
        this.sysRegSetObj.agentEmail = 2;
      }
    },
    email4Change() {
      if (this.sysRegSetObj.agentEmail) {
        this.sysRegSetObj.agentEmail = 0;
        this.sysRegSetObj.agentMailCaptchareg = 0;
      } else {
        this.sysRegSetObj.agentEmail = 1;
      }
    },
    // email1Change() {
    //   if (this.sysRegSetObj.mailCaptchareg === 1) {
    //     this.sysRegSetObj.mailCaptchareg = 2;
    //   } else {
    //     this.sysRegSetObj.mailCaptchareg = this.sysRegSetObj.mailCaptchareg ? 0 : 2
    //   }
    // },
    // email2Change() {
    //   this.sysRegSetObj.mailCaptchareg = this.sysRegSetObj.mailCaptchareg ? 0 : 1
    // },
    // email3Change() {
    //   if (this.sysRegSetObj.agentMailCaptchareg  === 1) {
    //     this.sysRegSetObj.agentMailCaptchareg  = 2;
    //   } else {
    //     this.sysRegSetObj.agentMailCaptchareg = this.sysRegSetObj.agentMailCaptchareg ? 0 : 2
    //   }
    // },
    // email4Change() {
    //   this.sysRegSetObj.agentMailCaptchareg = this.sysRegSetObj.agentMailCaptchareg ? 0 : 1
    // },
    mobileCaptcharegChange(value) {
      // if (value) {
      //   this.sysRegSetObj.captchareg = 0
      // }
    },
    agentMobileCaptcharegChange(value) {
      if (value) {
        this.sysRegSetObj.agentCaptchareg = 0;
      }
    },
    mailCaptcharegChange(value) {
      // if (value) {
      //   this.sysRegSetObj.mailCaptcharegChange = 0
      // }
    },
    agentMailCaptchareg(value) {
      if (value) {
        this.sysRegSetObj.agentMailCaptchareg = 0;
      }
    },

    qq1Change() {
      if (this.sysRegSetObj.qq === 1) {
        this.sysRegSetObj.qq = 2;
      } else {
        this.sysRegSetObj.qq
          ? (this.sysRegSetObj.qq = 0)
          : (this.sysRegSetObj.qq = 2);
      }
    },
    qq2Change() {
      this.sysRegSetObj.qq
        ? (this.sysRegSetObj.qq = 0)
        : (this.sysRegSetObj.qq = 1);
    },
    qq3Change() {
      if (this.sysRegSetObj.agentQQ === 1) {
        this.sysRegSetObj.agentQQ = 2;
      } else {
        this.sysRegSetObj.agentQQ
          ? (this.sysRegSetObj.agentQQ = 0)
          : (this.sysRegSetObj.agentQQ = 2);
      }
    },
    qq4Change() {
      this.sysRegSetObj.agentQQ
        ? (this.sysRegSetObj.agentQQ = 0)
        : (this.sysRegSetObj.agentQQ = 1);
    },
    wechat1Change() {
      if (this.sysRegSetObj.weChat === 1) {
        this.sysRegSetObj.weChat = 2;
      } else {
        this.sysRegSetObj.weChat
          ? (this.sysRegSetObj.weChat = 0)
          : (this.sysRegSetObj.weChat = 2);
      }
    },
    wechat2Change() {
      this.sysRegSetObj.weChat
        ? (this.sysRegSetObj.weChat = 0)
        : (this.sysRegSetObj.weChat = 1);
    },
    wechat3Change() {
      if (this.sysRegSetObj.agentWechat === 1) {
        this.sysRegSetObj.agentWechat = 2;
      } else {
        this.sysRegSetObj.agentWechat
          ? (this.sysRegSetObj.agentWechat = 0)
          : (this.sysRegSetObj.agentWechat = 2);
      }
    },
    wechat4Change() {
      this.sysRegSetObj.agentWechat
        ? (this.sysRegSetObj.agentWechat = 0)
        : (this.sysRegSetObj.agentWechat = 1);
    },
    whatsapp1Change() {
      if (this.sysRegSetObj.whatsapp === 1) {
        this.sysRegSetObj.whatsapp = 2;
      } else {
        this.sysRegSetObj.whatsapp
          ? (this.sysRegSetObj.whatsapp = 0)
          : (this.sysRegSetObj.whatsapp = 2);
      }
    },
    whatsapp2Change() {
      this.sysRegSetObj.whatsapp
        ? (this.sysRegSetObj.whatsapp = 0)
        : (this.sysRegSetObj.whatsapp = 1);
    },
    whatsapp3Change() {
      if (this.sysRegSetObj.agentWhatsapp === 1) {
        this.sysRegSetObj.agentWhatsapp = 2;
      } else {
        this.sysRegSetObj.agentWhatsapp
          ? (this.sysRegSetObj.agentWhatsapp = 0)
          : (this.sysRegSetObj.agentWhatsapp = 2);
      }
    },
    whatsapp4Change() {
      this.sysRegSetObj.agentWhatsapp
        ? (this.sysRegSetObj.agentWhatsapp = 0)
        : (this.sysRegSetObj.agentWhatsapp = 1);
    },
    telegram1Change() {
      if (this.sysRegSetObj.telegram === 1) {
        this.sysRegSetObj.telegram = 2;
      } else {
        this.sysRegSetObj.telegram
          ? (this.sysRegSetObj.telegram = 0)
          : (this.sysRegSetObj.telegram = 2);
      }
    },
    telegram2Change() {
      this.sysRegSetObj.telegram
        ? (this.sysRegSetObj.telegram = 0)
        : (this.sysRegSetObj.telegram = 1);
    },
    telegram3Change() {
      if (this.sysRegSetObj.agentTelegram === 1) {
        this.sysRegSetObj.agentTelegram = 2;
      } else {
        this.sysRegSetObj.agentTelegram
          ? (this.sysRegSetObj.agentTelegram = 0)
          : (this.sysRegSetObj.agentTelegram = 2);
      }
    },
    telegram4Change() {
      this.sysRegSetObj.agentTelegram
        ? (this.sysRegSetObj.agentTelegram = 0)
        : (this.sysRegSetObj.agentTelegram = 1);
    },
    address1Change() {
      if (this.sysRegSetObj.address === 1) {
        this.sysRegSetObj.address = 2;
      } else {
        this.sysRegSetObj.address
          ? (this.sysRegSetObj.address = 0)
          : (this.sysRegSetObj.address = 2);
      }
    },
    address2Change() {
      this.sysRegSetObj.address
        ? (this.sysRegSetObj.address = 0)
        : (this.sysRegSetObj.address = 1);
    },
    address3Change() {
      if (this.sysRegSetObj.agentAddress === 1) {
        this.sysRegSetObj.agentAddress = 2;
      } else {
        this.sysRegSetObj.agentAddress
          ? (this.sysRegSetObj.agentAddress = 0)
          : (this.sysRegSetObj.agentAddress = 2);
      }
    },
    address4Change() {
      this.sysRegSetObj.agentAddress
        ? (this.sysRegSetObj.agentAddress = 0)
        : (this.sysRegSetObj.agentAddress = 1);
    },
    changeFavicon(src) {
      // document.head = document.head || document.getElementsByTagName('HEAD')[0]
      var link = document.createElement("link");
      var oldLink = document.getElementById("dynamic-favicon");
      link.id = "dynamic-favicon";
      link.rel = "shortcut icon";
      link.href = src;
      if (oldLink) {
        document.getElementsByTagName("head")[0].removeChild(oldLink);
      }
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    getAPPSetting(){
      this.$axios
        .get(systemConfig.urls.getAPPSetting)
        .then((res) => {
          this.APPObj = res.data.data
        });
    },
    submitAPPsetting(){
      let data = Object.assign({},this.APPObj)
      this.$refs.appSetting.validate(valid=>{
        if(valid){
          this.$axios.post(systemConfig.urls.saveAPPSetting,data).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('保存APP推送设置成功！'))
              this.getAPPSetting()
            }else{
              this.$message.error(this.$t('保存APP推送设置失败！'))
            }
          })
        }
      })
    },
    addLimitTime(i){
      if(i===0){
        this.otherObj.withdrawLimitTimeDtoList.push({startTime:'',endTime:''})
      }else{
        this.otherObj.withdrawLimitTimeDtoList.splice(i,1)
      }
    },
    promotionChange1(value) {
      if (this.sysRegSetObj.promotion === 1) {
        this.sysRegSetObj.promotion = 2;
      } else {
        this.sysRegSetObj.promotion
          ? (this.sysRegSetObj.promotion = 0)
          : (this.sysRegSetObj.promotion = 2);
      }
    },
    promotionChange2(value) {
      this.sysRegSetObj.promotion
        ? (this.sysRegSetObj.promotion = 0)
        : (this.sysRegSetObj.promotion = 1);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'||file.type==='image/png'||file.type==='image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error(this.$t('文件格式错误，只支持图片！'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('上传头像图片大小不能超过 2MB!'));
      }
      return isJPG && isLt2M;
    },
    setPic({file, pic, venturePlanPic}) {
      this[pic] = file
      const formData = new FormData();
      formData.append("uploadFile", file);
      return this.$axios
        .post(systemConfig.urls.uploadImage, formData)
        .then((res) => {
          if(res.data.code===0){
            this.$message.success(this.$t('图片上传成功！'))
            this[venturePlanPic] = res.data.path;
          }else{
            this[venturePlanPic] = ''
          }
        }).catch(()=>{
          this[venturePlanPic] = ''
        })
    },
    setUploadImg (file, pic, sys) {
      if (sys) this[sys][pic] = file;
      if (!sys) this[pic] = file;
      const formData = new FormData();
      formData.append("uploadFile", file);
      return this.$axios
        .post(systemConfig.urls.uploadImage, formData)
        .then((res) => {
          if(res.data.code===0){
            this.$message.success(this.$t('图片上传成功！'))
            if (sys) this[sys][pic] = res.data.path;
            if (!sys) this[pic] = res.data.path;
          }else{
            if (sys) this[sys][pic] = '';
            if (!sys) this[pic] = '';
          }
        }).catch(()=>{
          if (sys) this[sys][pic] = '';
          if (!sys) this[pic] = '';
        })
    },
    handleAvatarSuccess1({ file }) {
      return this.setUploadImg(file, 'venturePlanPic')
    },
    onAvatarRemove(){
      this.venturePlanPic = ''
      this.venturePlanPicList = []
    },
    handleAvatarSuccess2({ file }) {
      return this.setUploadImg(file, 'defineIndustryPic')
    },
    onAvatarRemove2(){
      this.defineIndustryPic = ''
      this.defineIndustryPicList = []
    },
    handleAvatarSuccess3({ file }) {
      return this.setUploadImg(file, 'pcIconSkype', 'sysSetObj')
    },
    onAvatarRemove3(){
      this.sysSetObj.pcIconSkype = ''
      this.pcIconSkypeList = []
    },
    onAvatarRemoveAliao(){
      this.sysSetObj.chatLogo = ''
      this.aliaoList = []
    },
    handleAvatarSuccess4({ file }) {
      return this.setUploadImg(file, 'appIconSkype', 'sysSetObj')
    },
    onAvatarRemove4(){
      this.sysSetObj.appIconSkype = ''
      this.appIconSkypeList = []
    },
    handleAvatarSuccess5({ file }) {
      return this.setUploadImg(file, 'pcIconTelegram', 'sysSetObj')
    },
    onAvatarRemove5(){
      this.sysSetObj.pcIconTelegram = ''
      this.pcIconTelegramList = []
    },
    handleAvatarSuccess6({ file }) {
      return this.setUploadImg(file, 'appIconTelegram', 'sysSetObj')
    },
    onAvatarRemove6(){
      this.sysSetObj.appIconTelegram = ''
      this.appIconTelegramList = []
    },
    handleAvatarSuccess7({ file }) {
      return this.setUploadImg(file, 'pcIconFlygram', 'sysSetObj')
    },
    onAvatarRemove7(){
      this.sysSetObj.pcIconFlygram = ''
      this.pcIconFlygramList = []
    },
    handleAvatarSuccess8({ file }) {
      return this.setUploadImg(file, 'appIconFlygram', 'sysSetObj')
    },
    onAvatarRemove8(){
      this.sysSetObj.appIconFlygram = ''
      this.appTitleSkypeList = []
    },
    handleAvatarSuccessAliaoLogo({ file }) {
      return this.setUploadImg(file, 'chatLogo', 'sysSetObj')
    },
    onAvatarRemoveAliaoLogo(){
      this.sysSetObj.chatLogo = ''
      this.aliaoList = []
    },
    submitUnisetting(){
      this.$refs.ventureForm.validate(valid=>{
        if(valid){
          let postData = {
            venturePlanPic:this.venturePlanPic,
            defineIndustryPic:this.defineIndustryPic,
          }
          this.$axios.post(systemConfig.urls.venturePlanSet,postData).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('合营计划设置成功！'))
            }
          })
        }
      })
    },
    queryVenturePlanSet() {
      this.$axios.get(systemConfig.urls.queryVenturePlanSet).then(res=>{
        if (res.data.code===0) {
          this.venturePlanPic = res.data.data.venturePlanPic
          this.defineIndustryPic = res.data.data.defineIndustryPic
          this.venturePlanPicList = [{name:'',url:res.data.data.venturePlanPic}]
          this.defineIndustryPicList = [{name:'',url:res.data.data.defineIndustryPic}]
        }
      })
    },
    //上传图片
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    handleChangeAutoDisableOpen (val) {
      if (!val) {
        this.otherObj.autoDisableDuration = ''
        this.otherObj.autoDisableTimes = ''
        this.otherObj.autoOpenTime = ''
      }
    },
    setAuthMethod() {// 判断自定义设置值
      const authList = ['smsVfySecurityBindAndBank', 'mailVfySecurityBindAndBank', 'googleVfySecurityBindAndBank']
      const agentAList = ['smsVfySecurityAgentBindAndBank', 'mailVfySecurityAgentBindAndBank', 'googleVfySecurityAgentBindAndBank']
      let arr = [], agentArr = []
      authList.map(key => {
       this.messSwi[key] && arr.push(key)
      })
      agentAList.map(key => {
       this.messSwi[key] && agentArr.push(key)
      })
      this.authMethod = arr.length ? arr : ['close']
      this.agentAuthMethod = agentArr.length ? agentArr : ['close']
    },
    authMethodChange(list) {
      const arr = ['smsVfySecurityBindAndBank', 'mailVfySecurityBindAndBank', 'googleVfySecurityBindAndBank']
      this.setAuth(arr, list, 'authMethod')
    },
    agentAuthMethodChange (list) {
      const arr = ['smsVfySecurityAgentBindAndBank', 'mailVfySecurityAgentBindAndBank', 'googleVfySecurityAgentBindAndBank']
      this.setAuth(arr, list, 'agentAuthMethod')
    },
    setAuth (arr, list, data) {// 判定是否选中“关闭”，是否最后一个选中“关闭”
      const bool = list.includes('close')
      let bool1 = false
      if (bool) {
        const closeIndex = list.findIndex(v => v === 'close')
        const b = closeIndex === list.length - 1
        if (b) {
          this[data] = ['close']
          bool1 = true
        } else {
          const newList = JSON.parse(JSON.stringify(list));
          newList.splice(closeIndex, 1)
          this[data] = newList
        }
      } else {
        this[data] = !list.length ? ['close'] : list
      }
      arr.map(key => {
        this.messSwi[key] = bool1 ? 0 : (list.includes(key) ? 1 : 0)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.sys-setting-form {
  width: 1000px;
  margin: 0 auto;
}
.email-tips {
  .el-form-item__label {
    color: #333;
  }
  .el-form-item__content {
    color: #333;
  }
}
.RegTab {
  border: solid 1px #e0e0e0;
  border-bottom: none;
  color: #333;
  .rowd {
    height: 100px;
  }
  .el-row {
    .rowd {
      height: 100px;
      line-height: 100px;
    }
    div {
      display: block;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .el-col {
      border-bottom: solid 1px #e0e0e0;
    }
  }
  .el-button--primary {
    margin-left: 40%;
    margin-top: 30px;
  }
}
.registerSet {
  width: 900px;
  margin: 0 auto 10px;
  font-weight: bold;
  .dtext {
    margin-right: 20px;
  }
}
.open-title {
  font-weight: bold;
}
.mr-b {
  margin-bottom: 25px;
}
.open-label {
  margin-right: 25px;
}
.open-line {
  border-bottom: 1px solid #aaa;
}
.hide /deep/.el-upload{display: none!important;}

// 联系方式标题栏样式
.el-input.el-input--small.el-input--suffix {
    width: 200px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.intTime.intTimeTwo {
  position: absolute;
  right: 45px;
}

// 国家短信设置
// .box-card {
//   width: 100%;
// }
// .areaName {
//   font-size: 25px !important;
//   font-weight: 900;
//   padding-bottom: 20px;
// }
// .interval {
//   margin: 15px 0;
// }
// .el-checkbox {
//   // padding-right: 138px;
//   width: 333px;
// }
// .el-checkbox + .el-checkbox {
//   margin-left: 0px;
// }
// .el-checkbox-group {
//  position: relative;
//  right: 0px;
// }
.opOfcl {
    color: red;
    position: relative;
    left: 451px;
    bottom: 42px;
}
.mw110 {
  display: inline-block;
  min-width: 110px;
}
.failur-red {
  color: red;
}
</style>
