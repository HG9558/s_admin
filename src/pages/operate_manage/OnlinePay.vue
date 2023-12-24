<template>
  <div class="online-pay" v-loading.fullscreen.lock="fullscreenLoading">
    <div v-show="!dialogVisible">
      <div class="search">
        <div class="search-basic">
          <div class="search-basic-item width180">
            <label>{{ $t('账户名称') }}</label>
            <input type="text" v-model="searchData.name"/>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('支付平台') }}</label>
            <input type="text" v-model="searchData.paymentName"/>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('商户号') }}</label>
            <input type="text" v-model="searchData.merNo"/>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('支持银行') }}</label>
            <input type="text" v-model="searchData.bankName"/>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('状态') }}</label>
            <el-select v-model="isEnables" multiple>
              <el-option :label="$t('启用')" value="1"></el-option>
              <el-option :label="$t('禁用')" value="0"></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('客户端') }}</label>
            <el-select v-model="devSource" :placeholder="$t('请选择')" multiple>
              <el-option label="PC" value="0"></el-option>
              <el-option label="H5" value="3"></el-option>
            </el-select>
          </div>
          <div class="div-search-btn" style="top: 50%;transform: translateY(-50%)">
            <el-button type="primary" @click.native="search()" class="wid-80">{{ $t('查询') }}</el-button>
            <el-button plain @click.native="reset()" class="wid-80">{{ $t('重置') }}</el-button>
          </div>
        </div>
        <!--<div class="search-extend" v-show="showExtend">-->

        <!--</div>-->
        <!--<div class="div-search-btn">-->
        <!---->
        <!--</div>-->
        <!--<div class="more-condition">-->
        <!--<span @click="more">{{extendTitle}}查询<i :class="[this.showExtend ? 'is-reverse': '']"-->
        <!--class="icon-more el-select__caret el-input__icon el-icon-arrow-up"></i></span>-->
        <!--</div>-->
      </div>
      <!--<div class="export-div">-->
      <!--<div class="el-button-div">-->
      <!--<el-button class="iconfont icon-add el-button-add" style="right: 0" size="mini" type="primary" @click="add">-->
      <!--新增-->
      <!--</el-button>-->
      <!--&lt;!&ndash; <el-button class="iconfont icon-export el-button-export">导出报表</el-button> &ndash;&gt;-->
      <!--</div>-->
      <!--</div>-->

      <el-row type="flex" class="row-bg" justify="end">
        <!--<el-button class="iconfont icon-add el-button-add" type="primary" @click="">-->
        <!--</el-button>-->
        <el-button icon="el-icon-circle-plus-outline" plain type="primary" size="mini" @click="add">{{ $t('新增') }}
        </el-button>
      </el-row>

      <el-table max-height="480" type="flex" :data="tableData.list"
                v-loading='loading' border fit highlight-current-row>
        <el-table-column type="index" width="60" :label="$t('序号')" :index="indexMethod"></el-table-column>
        <el-table-column prop="code" width="155" :label="$t('支付编码')"></el-table-column>
        <el-table-column prop="name" :label="$t('账户名称')">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop.prevent="view(scope.row)"
                       v-text="scope.row.name"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="merNo" width="140" :label="$t('商户号')"></el-table-column>
        <el-table-column prop="payClass" :label="$t('支付平台')"></el-table-column>
        <el-table-column :label="$t('支持会员组数')">
          <template slot-scope="scope">
            <el-tooltip class="item" :content="$t('支持会员组') + '：' + scope.row.selectedGroup" placement="bottom">
              <span style="color: #409eff">{{scope.row.mbrGroupNum}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="bankNum" :label="$t('支持银行数')">
          <template slot-scope="scope">
            <el-tooltip class="item" :content="$t('支持银行') + '：' + scope.row.bankOptions" placement="bottom">
              <span style="color: #409eff">{{scope.row.bankNum}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="payCount" :label="$t('累计存款次数')"></el-table-column>
        <el-table-column prop="depositAmount" :label="$t('累计存款金额')"></el-table-column>
        <el-table-column prop="depositAmountDaily" :label="$t('今日存款金额')"></el-table-column>
        <el-table-column
          :label="$t('来源')">
          <template slot-scope="scope">
            {{returnStatus(scope.row.devSource)}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="isEnable" label="状态"
            :filters="filterArr"
            :filter-method="filterTag"
            filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isEnable == 1 ? 'success':'danger'" v-text="scope.row.isEnable == 1 ? '启用' : '禁用' ">
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('是否启用')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isEnable" :disabled="scope.row.isDef === 0" active-color="#13ce66"
                       inactive-color="#ff4949" @change="toggleBind(scope.row)"
                       :inactive-value='0' :active-value='1'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop.prevent="editFromTable(scope.row)">[{{ $t('编辑') }}]</el-button>
            <el-button type="text" size="small" @click.capture="view(scope.row)">[{{ $t('详情') }}]</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="listReq.pageNo" :page-sizes="listReq.pageSizeArr"
          :page-size="listReq.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.totalCount">
        </el-pagination>
      </div>
    </div>

    <div v-show="dialogVisible">
      <div class="title-detail">
        <el-button size="mini" @click="paymentFormCancel('paymentForm')">{{ $t('返回') }}</el-button>
        <el-button v-show="onlyRead" @click="editFromDialog" size="mini" type="primary">{{ $t('编辑') }}</el-button>
        <span class="title">{{dialogTitle}}</span>
      </div>
      <el-form class="small-space small-title" label-position="right" label-width="120px" :model="paymentForm"
               ref="paymentForm">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('支付编码')" :rules="commonRule.notNull" prop="code">
              <el-input v-model="paymentForm.code" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('支付平台')" :rules="commonRule.notNull" prop="paymentId">
              <el-select v-model="paymentForm.paymentId" :disabled="onlyRead" @change="payInfo" class="width100p">
                <el-option v-for='item in payments' :label='item.text' :key='item.text'
                           :value='item.value'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('支付终端')">
              <el-checkbox :label="$t('PC端')" :checked=true disabled
                           v-show="paymentForm.devSourceOld === 1 || paymentForm.devSourceOld === 3"></el-checkbox>
              <el-checkbox :label="$t('移动端')" :checked=true disabled
                           v-show="paymentForm.devSourceOld === 2 || paymentForm.devSourceOld === 3"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('显示终端')" :rules="commonRule.notNull" prop="devSources">
              <el-select v-model="paymentForm.devSources" multiple>
                <el-option label="PC" value="0"></el-option>
                <el-option label="H5" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('支付域名')" prop="domainId">
              <el-select v-model="paymentForm.domainId" :disabled="onlyRead" class="width100p">
                <el-option v-for="item in paymentDomains" :label='item.text' :key="item.text"
                           :value='item.value'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('账户名称')" :rules="commonRule.notNull" prop="name">
              <el-input v-model="paymentForm.name" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('账户描述')" :rules="commonRule.notNull" prop="description">
              <el-input v-model="paymentForm.description" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('商户号')" :rules="commonRule.notNull" prop="merNo">
              <el-input v-model="paymentForm.merNo" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('排序号')"
                          :rules="[{required: true, message: $t('此处不能为空'),trigger: 'blur'},{type: 'integer', min: 1, message: $t('请输入正整数')}]"
                          prop="sort">
              <el-input type="number" v-model.number="paymentForm.sort" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('密钥')" :rules="commonRule.notNull" prop="password">
              <el-input v-model="paymentForm.password" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('支持银行')">
              <el-checkbox-group v-model="paymentForm.bankList">
                <el-checkbox style="margin-left: 30px" v-for="bank in bankOptions" :label="bank.value" :key="bank.text"
                             disabled checked
                             :value="bank.value">{{bank.text}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('状态')">
              <el-radio v-model.number="paymentForm.isEnable" :disabled="onlyRead" :label="1">{{ $t('开启') }}</el-radio>
              <el-radio v-model.number="paymentForm.isEnable" :disabled="onlyRead" :label="2">{{ $t('关闭') }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('单笔存款')">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    :rules="[{required: true, message: $t('不能为空'), trigger: 'blur'},{type: 'integer',min: 1, message: $t('不能低于0')}]"
                    prop="minLimit">
                    <el-input type="number" v-model.number="paymentForm.minLimit" :disabled="onlyRead"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="center">~</el-col>
                <el-col :span="11">
                  <el-form-item
                    :rules="[{required: true, message: $t('不能为空'), trigger: 'blur'},{type: 'integer',min: paymentForm.minLimit, message: $t('不能低于最小值')}]"
                    prop="maxLimit">
                    <el-input type="number" v-model.number="paymentForm.maxLimit" :disabled="onlyRead"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('单日最大限额')"
                          :rules="[{required: true, message: $t('不能为空'), trigger: 'blur'},{type: 'integer',min: paymentForm.maxLimit + 1, message: $t('单日最大限额大于单笔最大存款')}]"
                          prop="maxLimitDaily">
              <el-input type="number" v-model.number="paymentForm.maxLimitDaily" :disabled="onlyRead"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('适用会员组')">
              <el-radio v-model="paymentForm.mbrGroupType" :disabled="onlyRead" label="1"
                        @change="changeMbrGroupType(1)">{{ $t('全部') }}
              </el-radio>
              <el-radio v-model="paymentForm.mbrGroupType" :disabled="onlyRead" label="2"
                        @change="changeMbrGroupType(2)">{{ $t('自定义') }}
              </el-radio>
              <el-form-item prop="mbrGroupId" v-if="mbrGroupsShow && mbrGroups.length > 0">
                <el-checkbox-group v-model="paymentForm.mbrGroupId" @change="handleCheckedGroupChange">
                  <el-checkbox style="margin-left: 30px" v-for="(item, index) in mbrGroups" :key="index"
                               :label="item.id"
                               :disabled="onlyRead">{{item.groupName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="div-submit-btn">
        <el-button v-show="!onlyRead" @click="paymentFormCancel('paymentForm')">{{ $t('取消') }}</el-button>
        <el-button type="primary" v-show="!onlyRead" @click="saveOrUpdate">{{ $t('确定') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'

  export default {
    name: 'onlinePay',
    data() {
      return {
        searchData: {},
        isEnables: [],
        statusFlag: 1, // 1增加  2编辑   3查看
        onlyRead: false,
        dialogVisible: false,
        tableData: {},
        paymentForm: {isEnable: 1, mbrGroupType: '1', mbrGroupId: [], banks: [], devSources: []},
        commonRule: systemConfig.rules.commonRule,
        payments: [],
        paymentDomains: [],
        bankOptions: [],
        mbrGroups: [],
        mbrGroupsShow: false,
        filterArr: [{text: this.$t('禁用'), value: 0}, {text: this.$t('启用'), value: 1}],
        showExtend: false,
        devSource: []
      }
    },
    computed: {
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
      dialogTitle() {
        switch (this.statusFlag) {
          case 1:
            return this.$t('新增银行卡')
          case 2:
            return this.$t('编辑银行卡')
          case 3:
            return this.$t('查看银行卡')
        }
      },
      extendTitle() {
        if (this.showExtend) {
          return this.$t('收起')
        } else {
          return this.$t('更多')
        }
      }
    },
    mounted() {
      this.getData()
      this.getpayments()
      this.getpaymentDomains()
    },
    methods: {
      indexMethod(index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      more() {
        this.showExtend = !(this.showExtend)
      },
      returnStatus(statusValue) {
        return systemConfig.returnStatus(statusValue)
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
      search() {
        this.listReq.pageNo = 1
        this.getData()
      },
      add() {
        this.dialogVisible = true
        this.onlyRead = false
        this.statusFlag = 1
        this.paymentForm = {isEnable: 1, mbrGroupType: '1', mbrGroupId: [], banks: [], devSources: []}
        this.mbrGroups = []
      },
      reset() {
        this.searchData = {}
        this.isEnables = []
        this.devSource = []
      },
      // 表格状态删选
      filterTag(value, row) {
        return row.isEnable === value
      },
      // 查看
      view(row) {
        this.onlyRead = true
        this.statusFlag = 3
        this.getDetail(row)
      },
      // 编辑
      editFromTable(row) {
        this.onlyRead = false
        this.statusFlag = 2
        // 请求接口
        this.getDetail(row)
      },
      editFromDialog() {
        this.onlyRead = false
        this.statusFlag = 2
      },
      getDetail(row) {
        this.getMbrGroups()
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/info/' + row.id).then(resp => {
          this.paymentForm = {isEnable: 1, mbrGroupType: '1', mbrGroupId: [], banks: [], devSources: []}
          this.paymentForm = Object.assign(resp.data.setBacicOnlinepay, this.paymentForm)
          this.paymentForm.banks = resp.data.setBacicOnlinepay.banks
          if (this.paymentForm.devSource) {
            this.paymentForm.devSources = this.paymentForm.devSource.split(',')
          }
          if (this.paymentForm.mbrGroups) {
            this.paymentForm.mbrGroupType = '2'
            this.mbrGroupsShow = true
            let groupArr = this.paymentForm.mbrGroups.split(',')
            for (let i = 0; i < groupArr.length; i++) {
              this.paymentForm.mbrGroupId.push(parseInt(groupArr[i]))
            }
          } else {
            this.paymentForm.mbrGroupType = '1'
          }
          this.payInfo(row.paymentId)
          this.setPaytype(row.paymentId)

          this.dialogVisible = true
        })

      },
      paymentFormCancel(formName) {
        this.dialogVisible = false
        this.mbrGroupsShow = false
        this.mbrGroups = []
        this.resetForm(formName)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      toggleBind(row) {
        this.$axios.post('bkapi/onlinepay/setbaciconlinepay/updateEnable', {
          isEnable: row.isEnable,
          id: row.id
        }).then((resp) => {
          this.$message({
            type: 'success',
            message: this.$t('状态更改成功')
          })
        })
      },
      handleCheckedGroupChange(val) {
        this.paymentForm.selectedGroup = []
        let tempArr = []
        if (val.length > 0) {
          for (let i = 0; i < this.mbrGroups.length; i++) {
            for (let j = 0; j < val.length; j++) {
              if (val[j] === this.mbrGroups[i].id) {
                tempArr.push(this.mbrGroups[i].groupName)
              }
            }
          }
        }
        this.paymentForm.selectedGroup = tempArr.join(',')
      }
      ,
      changeMbrGroupType(index) {
        if (index === 1) {
          this.mbrGroups = []
          this.paymentForm.mbrGroupId = []
          this.mbrGroupsShow = false
          this.paymentForm.selectedGroup = []
        } else {
          this.getMbrGroups()
          this.mbrGroupsShow = true
        }
      },
      getMbrGroups() {
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/queryMbrGroups').then((res) => {
          this.mbrGroups = res.data.list
        })
      },
      getpayments() {
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/queryPayment').then((res) => {
          res.data.list.map((item) => {
            this.payments.push({
              text: item.payClass,
              value: item.id,
              isEnable: item.isEnable,
              payType: item.payType
            })
          })
        })
      },
      getpaymentDomains() {
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/queryDomainPay').then((res) => {
          res.data.list.map((item) => {
            this.paymentDomains.push({text: item.domainUrl, value: item.id})
          })
        })
      },
      getData() {
        this.$store.state.searchLoading = true
        if (this.isEnables.length > 0) {
          this.searchData.isEnabless = this.isEnables.join(',')
        } else {
          this.searchData.isEnabless = ''
        }
        if (this.devSource.length > 0) {
          this.devSource = this.devSource.sort()
          this.searchData.devSource = this.devSource.join(',')
        } else {
          this.searchData.devSource = ''
        }
        let data = Object.assign({
          pageSize: this.listReq.pageSize,
          pageNo: this.listReq.pageNo
        }, this.searchData)
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/queryConditions', {params: data}).then((resp) => {
          this.tableData = resp.data.page
          if (this.isEnables.length === 1 && this.isEnables[0] === '1') {
            this.filterArr = [{text: this.$t('启用'), value: 1}]
          } else if (this.isEnables.length === 1 && this.isEnables[0] === '0') {
            this.filterArr = [{text: this.$t('禁用'), value: 0}]
          } else {
            this.filterArr = [{text: this.$t('禁用'), value: 0}, {text: this.$t('启用'), value: 1}]
          }
        })
      },
      payInfo(value) {
        this.bankOptions = []
        this.setPaytype(value)
        this.$axios.get('bkapi/onlinepay/setbaciconlinepay/queryPayBanks', {params: {paymentId: value}}).then((res) => {
          res.data.list.map((item) => {
            this.bankOptions.push({text: item.bankName, value: item.id})
          })
          let tempArr = []
          let numArr = []
          for (let i = 0; i < this.bankOptions.length; i++) {
            tempArr.push(this.bankOptions[i].text)
            numArr.push(this.bankOptions[i].value)
          }
          this.paymentForm.bankOptions = tempArr.join(',')
          this.paymentForm.banks = numArr
        })
      },
      setPaytype(val) {
        for (let i = 0; i < this.payments.length; i++) {
          if (this.payments[i].value === val) {
            this.paymentForm.devSourceOld = this.payments[i].payType
          }
        }
      },
      saveOrUpdate() {
        this.$refs.paymentForm.validate(valid => {
          if (valid) {
            if (!this.mbrGroupsShow || this.paymentForm.mbrGroupId.length > 0) {
              this.$store.state.fullscreenLoading = true
              this.paymentForm.mbrGroups = this.paymentForm.mbrGroupId.join(',')
              this.paymentForm.mbrGroupType = parseInt(this.paymentForm.mbrGroupType)
              this.paymentForm.devSource = this.paymentForm.devSources.sort().join(',')
              this.$axios.post(this.paymentForm.id ? 'bkapi/onlinepay/setbaciconlinepay/update' : 'bkapi/onlinepay/setbaciconlinepay/save', this.paymentForm).then((resp) => {
                if (this.paymentForm.id) {
                  this.$message({
                    type: 'success',
                    message: this.$t('更新成功')
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: this.$t('保存成功')
                  })
                }
                this.dialogVisible = false
                this.mbrGroupsShow = false
                this.getData()
                this.paymentForm = {isEnable: 1, mbrGroupType: '1', mbrGroupId: [], banks: [], devSources: []}
                this.mbrGroups = []
                this.reset()
              })
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('请至少选择一个会员组')
              })
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss">
</style>
