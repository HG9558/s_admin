<template>
  <div>
    <h3 class="title-big">
      {{ $t('代理详情') }}
      <div class="agent-detail-btns">
        <el-button type="primary" @click="handleSendMessage">{{ $t('发站内信') }}</el-button>
        <el-button type="primary" @click="handleSendMessage">{{ $t('人工调整') }}</el-button>
        <el-button type="primary" @click="handleResetBtn('login')" v-if="enableReset">{{ $t('重置登录密码') }}</el-button>
        <el-button type="primary" @click="handleResetBtn('draw')" v-if="enableReset">{{ $t('重置提款密码') }}</el-button>
        <el-button @click="$router.push({path: '/main/agentManage/agentList'})">{{ $t('返回') }}</el-button>
      </div>
    </h3>
    <!-- 基本资料 -->
    <h3 class="title-small">
      {{ $t('基本资料') }}
      <template v-if="isEditPattern">
        <el-button @click="$refs.BasicData.handleCancel" size="mini">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="$refs.BasicData.handleEditSave" size="mini">{{ $t('确认') }}</el-button>
      </template>
      <el-button type="text" icon="el-icon-edit" @click="isEditPattern = true" v-else>{{ $t('修改') }}</el-button>
    </h3>
    <BasicData ref="BasicData" :id="id" :isEditPattern.sync="isEditPattern" :dataNeed="dataNeed"
               @refresh="getAgentInfo"/>
    <!-- 银行卡资料 -->
    <h3 class="title-small">{{ $t('银行卡资料') }}
      <el-button type="info" icon="el-icon-plus" @click="handleBankCardDialogShow()" v-if="bankCardList.length < 6">{{ $t('新增') }}
      </el-button>
    </h3>
    <BankCardList :tableData="bankCardList" @edit="handleBankCardDialogShow" @reloadData="getBankCardList"/>
    <!--佣金设置-->
    <!-- <h3 class="title-small">佣金资料

    </h3>
    <el-tabs class="tab" v-model="editableTabsValue" type="card" @tab-click="tabClick">
      <el-tab-pane
        :key="item.name"
        v-for="(item) in editableTabs"
        :label="item.title"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <Base
      :or=false
      :add="isAdd"
      :name="index"
      :index="index"
      @getData="getPullData"
      :tableData="tableData"
      :otherData="otherData"
      :allDataNeed="allDataNeed"
      :headerLength='headerLength'
      :commissionSign="commissionSign"
      :netProfitRate="netProfitRate"
      v-show="editableTabsValue  == index.toString()"
      :headerArr="headerArr" :dataRulesMin="datarules"
    /> -->
    <!-- 新增/编辑 银行卡 -->
    <el-dialog
      :title="(bankCardInfo ? $t('编辑') : $t('新增')) + $t('银行卡')"
      :visible.sync="isBankCardDialogShow"
      width="30%"
    >
      <FormTemplateForBankCard :formData="bankCardInfo" :agyAccount="agyAccount" @submit="handleBankCardSubmit"
                               v-if="isBankCardDialogShow"/>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      :title="$t('重置密码')"
      :visible.sync="isResetPasswordShow"
      width="25%!important"
    >
      <el-form ref="form" :model="resetPasswordForm" label-position="top" label-width="80px"
               :rules="resetPasswordForm.rules">
        <el-form-item prop="password" :label="$t(`请输入新的{text}密码`, { text: resetForWho === 'login' ? $t('登陆') : $t('提款') })">
          <el-input v-model="resetPasswordForm.password" type="password" :placeholder="$t('密码为6~18位数字字母组合')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
				<el-button @click="isResetPasswordShow = false">{{ $t('取消') }}</el-button>
				<el-button type="primary" @click="handleReset">{{ $t('保存') }}</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
  import BasicData from './BasicData'
  import BankCardList from './BankCardList'
  import FormTemplateForBankCard from './FormTemplateForBankCard'
  import Base from '../../../components/ServiceSettingBase'
  import systemConfig from '../../../config/config'

  export default {
    components: {BasicData, BankCardList, FormTemplateForBankCard, Base},
    data() {
      return {
        otherData: {},
        netProfitRate:0,
        editableTabs: [
          {
            title: this.$t('基础阶段'),
            name: '0'
          },
          {
            title: this.$t('阶段') + '1',
            name: '1'
          },
          {
            title: this.$t('阶段') + '2',
            name: '2'
          },
          {
            title: this.$t('阶段') + '3',
            name: '3'
          },
          {
            title: this.$t('阶段') + '4',
            name: '4'
          },
          {
            title: this.$t('阶段') + '5',
            name: '5'
          },
          {
            title: this.$t('阶段') + '6',
            name: '6'
          }],
        isAdd: false,
        index: 0,
        tabIndex: 0,
        tableData: [],
        temPlateData: [],
        headerLength: 0,
        headerArr: [],
        editableTabsValue: '0',
        allData: [],
        allDataNeed: {},
        needId: '',
        datarules: [],
        dataNeed: {},
        commissionSign: 0,
        bankCardList: [],
        bankCardInfo: null,
        isEditPattern: false,
        isResetPasswordShow: false,
        isBankCardDialogShow: false,
        resetForWho: null,
        resetPasswordForm: {
          password: null,
          rules: {
            password: [
              {required: true, message: this.$t('不能为空')},
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                message: this.$t('请输入6-18位数字与字母的组合，不能是纯数字或字母'),
                trigger: 'blur'
              },
              {
                validator: (rule, value, callback) => {
                  if (value === this.dataNeed.agyAccount) {
                    callback(new Error(this.$t('账号密码不能相同')))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }
        },
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      enableReset() {
        return this.id * 1 > 4
      },
      agyAccount() {
        return this.$route.query.agyAccount
      },
    },
    watch: {
      isResetPasswordShow(value) {
        if (!value) {
          this.resetPasswordForm.password = null
        }
      }
    },
    created() {
      this.getBankCardList()
      this.getAgentInfo()
      this.initMe()
    },
    methods: {
      handleBankCardSubmit(params) {
        // 根据bankCardInfo判断新增还是编辑
        const {bankCardInfo} = this
        const bankCard = this.bankCardList.find(item => item.cardNo === params.cardNo)
        if (!bankCardInfo && bankCard) {
          this.$notify({title: this.$t('温馨提示'), message: this.$t('该银行卡已添加')})
        } else {
          this.$axios.post(bankCardInfo ? 'bkapi/agent/account/agyBankUpdate' : 'bkapi/agent/account/agyBankSave ', {
            accountId: this.id,
            ...params
          })
            .then(res => {
              if (res) {
                this.isBankCardDialogShow = false
                this.getBankCardList()
              }
            })
        }
      },
      handleBankCardDialogShow(bankCardInfo) {
        this.bankCardInfo = bankCardInfo ? JSON.parse(JSON.stringify(bankCardInfo)) : bankCardInfo
        this.isBankCardDialogShow = true
      },
      handleReset() {
        const {resetForWho} = this
        const urls = {
          'login': 'bkapi/agent/account/agyAccountPassword',
          'draw': 'bkapi/agent/account/agyAccountFundPassword'
        }
        this.$refs.form.validate(result => {
          if (result) {
            this.$axios.post(urls[resetForWho], {
              id: this.id,
              agyPwd: this.resetPasswordForm.password,
              securePwd: this.resetPasswordForm.password
            })
              .then(res => {
                if (res) {
                  this.isResetPasswordShow = false
                  this.$message(this.$t('修改成功'))
                }
              })
          }
        })
      },
      handleResetBtn(resetForWho) {
        this.resetForWho = resetForWho
        this.isResetPasswordShow = true
      },
      handleSendMessage() {
      },
      getBankCardList() {
        this.$axios.get('bkapi/agent/account/agyBankList', {
          params: {
            id: this.id
          }
        })
          .then(res => {
            if (res) {
              this.bankCardList = res.data.data.map(item => {
                item.createTime = systemConfig.transferTimeByType(item.createTime, 'bj')
                return item
              })
            }
          })
      },
      initMe() {
        this.getTableHeader()
      },
      //点击tab
      tabClick(data) {
        this.index = data.index
        this.isAdd = false
        // const object2 = Object.assign({}, this.temPlateData)
        let arr = []
        this.temPlateData.forEach((item) => {
          let brr = []
          item.detailsDtoList.forEach((yy) => {
            brr.push(Object.assign({}, yy, {name: 1}))
          })
          arr.push(Object.assign({}, item, {'detailsDtoList': brr}))
        })
        this.tableData = arr
        if (parseInt(data.index) > 0) {
          this.otherData = this.allData[parseInt(data.index) - 1]
        }

        if (this.allData[parseInt(data.index)]) {
          this.allDataNeed = this.allData[parseInt(data.index)]
          this.tableData = this.allData[parseInt(data.index)].depotListDtos
        } else {
          this.allDataNeed = []
        }
      },
      // 1.  画表头
      getTableHeader() {
        this.$axios.get(systemConfig.urls.getPlatformClass).then((res) => {
          let data = res.data.data
          let arr = []
          data.forEach((item, index) => {
            if (item.detailsDtoList) {
              let sim = item.detailsDtoList
              sim.forEach((y) => {
                y.isShow = 0
              })
              arr.push(item.detailsDtoList.length)
            }
          })
          this.temPlateData = data
          this.tableData = data
          this.headerLength = Math.max.apply(null, arr)
          for (var i = 0; i < this.headerLength; i++) {
            this.headerArr.push({
              value: 0
            })
          }
          this.tableData = data
        })

      },
      //父子交互
      getPullData(data) {
        this.allData[parseInt(data.index)] = data.list
        this.agentSave(this.allData)
      },
      agentSave() {
        let data = this.allData
        this.$axios.post(systemConfig.urls.agentSave, {
          accountId: this.id,
          commissionDtos: data
        }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('修改成功')
          })
        })
      },
      //佣金
      getAgentInfo() {
        this.$axios.get('bkapi/agent/account/agyAccountInfo', {params: {id: this.id}})
          .then(res => {
            if (res) {
              res.data.data.createTime = systemConfig.transferTimeByType(res.data.data.createTime, 'bj')
              this.dataNeed = res.data.data
              this.commissionSign = res.data.data.commissionSign
              let commission = res.data.data.commission
              this.needId = res.data.data.id
              if (commission != null) {
                if (JSON.parse(commission.commissionText).length > 0) {
                  this.allData = JSON.parse(commission.commissionText)
                  this.allDataNeed = this.allData[0]
                  this.tableData = this.allData[0].depotListDtos
                  this.tabIndex = this.editableTabs.length
                }
              }

            }
          })
        this.$axios.get(systemConfig.urls.agentAgyCommissionCompareInfo, {params: {id: this.id}})
          .then(res => {
            this.datarules = res.data.data.commissionDtosMax
            this.netProfitRate = res.data.netProfitRate
          })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .title-big {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-top: 30px;
    border-bottom: 1px solid #eee;
    text-indent: 10px;
    overflow: hidden;
    .agent-detail-btns {
      float: right;
    }
  }

  .title-small {
    overflow: hidden;
    margin-top: 40px;
    text-indent: 10px;
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    border: 1px solid lightgray;
    border-bottom: 0;
    background-color: #f6f6f6;
    color: #4b4f56;
    .el-button {
      float: right;
      margin-right: 10px;
      line-height: 8px;
      margin-top: 2px;
      /deep/ span {
        font-size: 14px;
      }
    }
    .tab {
      background-color: #fff;
    }
  }
</style>


