<template>
  <div class="withdraw-manage">
    <div v-show="!dialogVisible">
      <el-tabs v-model="activeMethodType" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in withdrawMethods"
          :label="item.label"
          :key="item.value"
          :name="item.value"
        >
        </el-tab-pane>
      </el-tabs>

      <el-row type="flex" class="row-bg" justify="end">
        <!--<el-button class="iconfont icon-add el-button-add" type="primary" @click="">-->
        <!--</el-button>-->
        <el-button
          v-if="
            activeMethodType !== '1'
              ? hasPermission('merchant:fundMerchantPay:save')
              : hasPermission('merchant:fundMerchantPay:cryptocurrencies:save')
          "
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="mini"
          @click="add"
          style="width: 100px;"
          >{{ $t('新增') }}
        </el-button>
      </el-row>

      <div class="search-form">
        <el-table
          max-height="480"
          v-loading="loading"
          :data="tableData.list"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            type="index"
            width="60"
            :label="$t('序号')"
            align="center"
            :index="indexMethod"
          ></el-table-column>

          <template v-if="activeMethodType === '3'">
            <el-table-column
              :label="$t('钱包类型')"
              align="center"
              key="currencyCode"
              prop="currencyCode"
            ></el-table-column>
          </template>

          <template v-if="activeMethodType !== '1'">
            <el-table-column
              v-if="activeMethodType!=='3'"
              :label="$t('商户名称')"
              align="center"
              key="merchantName"
              prop="merchantName"
            ></el-table-column>
            <el-table-column
              :label="$t('商户号')"
              align="center"
              key="merchantNo"
              prop="merchantNo"
            ></el-table-column>
            <el-table-column key="url" prop="url" align="center" :label="$t('接口地址')"></el-table-column>
            <el-table-column key="devSource" align="center" :label="$t('来源')">
              <template slot-scope="scope">
                {{ returnStatus(scope.row.devSource) }}
              </template>
            </el-table-column>
          </template>

          <template v-else>
            <el-table-column
              align="center"
              :label="$t('币种')"
              key="currencyCode"
              prop="currencyCode"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$t('协议类型')"
              key="currencyProtocol"
              prop="currencyProtocol"
            ></el-table-column>
          </template>

          <el-table-column :label="$t('是否启用')" align="center" width="100" key="available">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.available"
                @change="toggleBind(scope.row)"
                :disabled="
                  activeMethodType !== '1'
                    ? !hasPermission('merchant:fundMerchantPay:available')
                    : !hasPermission('merchant:fundMerchantPay:cryptocurrencies:available')
                "
                :inactive-value="0"
                :active-value="1"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('操作')" width="250" key="operation">
            <template slot-scope="scope">
              <span
                v-if="
                  activeMethodType !== '1'
                    ? hasPermission('merchant:fundMerchantPay:update')
                    : hasPermission('merchant:fundMerchantPay:cryptocurrencies:update')
                "
                class="blue-color pointer"
                @click.stop.prevent="edit(scope.row)"
                >[{{ $t('编辑') }}]</span>
              <span
                v-if="activeMethodType !== '1'"
                class="blue-color pointer"
                @click.capture="view(scope.row)"
                >[{{ $t('详情') }}]</span>
            </template>
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
          :total="tableData.totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <div v-show="dialogVisible">
      <div class="title-detail">
        <el-button size="mini" @click="merchantCancel('merchant')"
          >{{ $t('返回') }}</el-button
        >
        <el-button
          v-show="onlyRead && hasPermission('merchant:fundMerchantPay:update')"
          @click="toSubmit"
          size="mini"
          type="primary"
          >{{ $t('编辑') }}</el-button
        >
        <span class="title">{{ dialogTitle }}</span>
      </div>
      <el-form
        class="small-space small-title"
        label-position="right"
        label-width="220px"
        :model="merchantForm"
        ref="merchant"
        :rules="commonRule"
      >
        <template v-if="activeMethodType !== '1' && activeMethodType!=='3'">
          <el-form-item
            :label="$t('商户名称')"
            prop="merchantName"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantName"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('商户号')"
            prop="merchantNo"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantNo"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('代付渠道')"
            prop="channelId"
            :rules="commonRule.notNull"
          >
            <el-select v-model="merchantForm.channelId" :disabled="onlyRead">
              <el-option
                v-for="(item, index) in channelIds"
                :key="index"
                :label="item.channelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('商户KEY')"
            prop="merchantKey"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantKey"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('显示终端')"
            :rules="commonRule.notNull"
            prop="devSources"
          >
            <el-select
              v-model="merchantForm.devSources"
              :placeholder="$t('请选择')"
              :disabled="onlyRead"
              multiple
            >
              <el-option label="PC" value="0"></el-option>
              <el-option label="H5" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="merchantForm.channelId === 2"
            :label="$t('商户收款ID')"
            prop="bankId"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.bankId"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('排序号')" prop="sort" :rules="commonRule.notNull">
            <el-input
              type="number"
              v-model.number="merchantForm.sort"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('接口地址')" prop="url" :rules="commonRule.notNull">
            <el-input v-model="merchantForm.url" :disabled="onlyRead"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="activeMethodType === '3'">
          <el-form-item
            :label="$t('钱包类型')"
            prop="currencyCode"
            :rules="commonRule.notNull"
          >
            <el-select v-model="merchantForm.currencyCode" :disabled="onlyRead">
              <el-option label="EBPAY" value="EBPAY"></el-option>
              <el-option label="TOPAY" value="TOPAY"></el-option>
              <el-option label="GOPAY" value="GOPAY"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('商户号')"
            prop="merchantNo"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantNo"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('商户KEY')"
            prop="merchantKey"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantKey"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('出款ID')"
            prop="bankId"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.bankId"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('显示终端')"
            :rules="commonRule.notNull"
            prop="devSources"
          >
            <el-select
              v-model="merchantForm.devSources"
              :placeholder="$t('请选择')"
              :disabled="onlyRead"
              multiple
            >
              <el-option label="PC" value="0"></el-option>
              <el-option label="H5" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('接口地址')" prop="url" :rules="commonRule.notNull">
            <el-input v-model="merchantForm.url" :disabled="onlyRead"></el-input>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item
            :label="$t('币种')"
            prop="currencyCode"
          >
            <el-select v-model="merchantForm.currencyCode" :disabled="onlyRead" :placeholder="$t('请选择币种')" @change="handleCurrencyCodeChange">
              <el-option
                v-for='(item, index) in channelIds'
                :key='index'
                :value='item'
                :label='item'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('协议类型')"
            prop="currencyProtocol"
          >
            <el-select v-model="merchantForm.currencyProtocol" :disabled="onlyRead" :placeholder="$t('请选择协议')">
              <el-option
                v-for='(item, index) in currencyProtocolOptions'
                :key='index'
                :value='item.currencyProtocol'
                :label='item.currencyProtocol'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('商户号')"
            prop="merchantNo"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantNo"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('商户KEY')"
            prop="merchantKey"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.merchantKey"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="activeMethodType === '4'">
          <el-form-item
            :label="$t('出款ID')"
            prop="bankId"
            :rules="commonRule.notNull"
          >
            <el-input
              v-model="merchantForm.bankId"
              :disabled="onlyRead"
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item
          :label="$t('状态')"
          prop="available"
          :rules="commonRule.changeNotNull"
        >
          <el-radio
            v-model="merchantForm.available"
            :disabled="onlyRead"
            :label="1"
            >{{ $t('启用') }}</el-radio
          >
          <el-radio
            v-model="merchantForm.available"
            :disabled="onlyRead"
            :label="0"
            >{{ $t('禁用') }}</el-radio
          >
        </el-form-item>
        <el-form-item :label="$t('适用会员组')" prop="ids">
          <el-checkbox
            :disabled="onlyRead"
            v-model="groupCheckAll"
            @change="handleGroupCheckAllChange"
            >{{ $t('全选') }}</el-checkbox
          >
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group
            v-model="merchantForm.ids"
            @change="handleGroupCheckedChange"
          >
            <el-checkbox
              style="margin-left: 30px"
              :disabled="onlyRead"
              v-for="group in listgroup"
              :label="group.id"
              :key="group.id"
              >{{ group.groupName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <template v-if="activeMethodType === '4'">
          <el-form-item :label="$t('每日限额')" prop="dayMaxAmount" :rules="commonRule.notNull">
            <el-input v-model="merchantForm.dayMaxAmount" :disabled="onlyRead" :placeholder="$t('请输入金额')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('固定金额')" prop="fixedAmount" :rules="commonRule.notNull">
            <el-input v-model="merchantForm.fixedAmount" :disabled="onlyRead" :placeholder="$t('请输入前度固定金额选项，请用 , 隔开')"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="div-submit-btn">
        <el-button v-show="!onlyRead" @click="merchantCancel('merchant')"
          >{{ $t('取消') }}</el-button
        >
        <el-button
          type="primary"
          v-show="!onlyRead"
          @click="saveMerchant('merchant')"
          >{{ $t('确定') }}</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import systemConfig from "../../config/config";
import queryStore from "../../mixins/queryStore";
import { mapGetters } from "vuex";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

export default {
  name: "withdrawManage",
  mixins: [
    site,
    Mixin,
    queryStore(["merchantNo", "merchantName", "statusValue", "devSource"])
  ],
  data() {
    return {
      activeMethodType: '0',
      statusValue: [],
      statusOptions: [
        {
          value: 0,
          label: this.$t("禁用")
        },
        {
          value: 1,
          label: this.$t("启用")
        }
      ],
      dialogVisible: false,
      onlyRead: false,
      statusFlag: 1, // 1 新增   2 查看   3编辑
      merchantNo: "",
      merchantName: "",
      tableData: {},
      listgroup: [],
      dialogTitle: "",
      commonRule: systemConfig.rules.commonRule,
      merchantForm: {
        ids: [],
        merchantName: "",
        url: "",
        merchantNo: "",
        merchantKey: "",
        sort: "",
        available: 1,
        devSources: []
      },
      groupCheckAll: false,
      channelIds: [],
      devSource: [],
      listReq: {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [5, 10, 20, 50, 100, 200]
      },
      currencyProtocolOptions: [],
      payListCr: []
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    loading() {
      return this.$store.state.searchLoading;
    },
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    withdrawMethods() {
      return [
        {
          // label: '人民币',
          label: this.currencyType(),
          value: '0',
          perm: 'merchant:fundMerchantPay:all',
        },
        {
          label: this.$t('加密货币'),
          value: '1',
          perm: 'merchant:fundMerchantPay:cryptocurrencies:all',
        },
        {
          label: this.$t('支付宝'),
          value: '2',
          perm: 'merchant:fundMerchantPay:all',
        },
        {
          label: this.$t('其他钱包'),
          value: '3',
          perm: 'merchant:fundMerchantPay:all',
        },
        {
          label: 'C2C',
          value: '4',
          perm: 'merchant:fundMerchantPay:all',
        },
        {
          label: '数字人民币',
          value: '5',
          perm: 'merchant:fundMerchantPay:all',
        },
        {
          label: '电子钱包',
          value: '7',
          perm: 'merchant:fundMerchantPay:all',
        },
      ].filter(({ perm }) => this.hasPermission(perm))
    },
  },
  mounted() {
    const { withdrawMethods } = this

    if (withdrawMethods.length) {
      this.activeMethodType = withdrawMethods[0].value
    }
    this.getData();
  },
  methods: {
    handleCurrencyCodeChange(currencyCode) {
      this.currencyProtocolOptions = this.payListCr[currencyCode]
    },
    returnStatus(statusValue) {
      return systemConfig.returnStatus(statusValue);
    },
    handleTabClick() {
      this.listReq.pageNo = 1
      this.tableData.list = []
      this.tableData.totalCount = null
      this.getData()
    },
    getData() {
      this.getCurrentRecodeTime()
      let url =
        "?pageSize=" +
        this.listReq.pageSize +
        "&pageNo=" +
        this.listReq.pageNo +
        "&devSource=" +
        this.devSource +
        "&merchantName=" +
        this.merchantName +
        "&merchantNo=" +
        this.merchantNo +
        "&availables=" +
        this.statusValue +
        "&methodType=" +
        this.activeMethodType;
      this.$store.state.searchLoading = true;
      this.$axios
        .get(systemConfig.urls.findFundMerchantPayListPage + url)
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = res.data.page;
        });
    },
    indexMethod(index) {
      return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
    },
    toSubmit() {
      this.statusFlag = 3;
      this.onlyRead = false;
    },
    toggleBind({ id, available }) {
      this.$axios
        .get(systemConfig.urls.updateFundMerchantPayAvailable, {
          params: {
            id,
            available,
            methodType: this.activeMethodType,
          },
        })
        .then(resp => {
          this.$message({
            type: "success",
            message: this.$t("状态更改成功")
          });
          this.getData();
        });
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
    filterTag(value, row) {
      return row.available === value;
    },
    search() {
      // this.getCurrentRecodeTime()
      this.listReq.pageNo = 1;
      this.getData();
    },
    add() {
      this.dialogVisible = true;
      this.onlyRead = false;
      this.statusFlag = 1;
      const bool = this.activeMethodType !== '1'&&this.activeMethodType !== '3'
      this.dialogTitle = bool ? this.$t("新增商户") : (this.activeMethodType !== '3'?this.$t('新增加密货币'):this.$t('新增钱包'));
      this.currencyProtocolOptions = []
      this.getGroup();
      this.getIdsorPallistCr(bool)
    },
    // 查看
    view(row) {
      this.statusFlag = 2;
      this.onlyRead = true;
      this.dialogVisible = true;
      this.dialogTitle = this.$t("商户详情");
      this.getGroup();
      this.getDetail(row.id);
      this.getChannelIds();
    },
    // 编辑
    edit(row) {
      this.statusFlag = 3;
      this.onlyRead = false;
      this.dialogVisible = true;
      const bool = this.activeMethodType !== '1'
      this.dialogTitle = bool ? this.$t("编辑商户") : this.$t('编辑加密货币');
      this.getGroup();
      this.getDetail(row.id);
      this.getIdsorPallistCr(bool)
    },
    getIdsorPallistCr (bool) {
      if (bool) {
        this.getChannelIds();
        return
      }
      this.findTChannelPayListCr()
    },
    findTChannelPayListCr() {
      this.$axios.get(systemConfig.urls.findTChannelPayListCr, {
        params: {
          methodType: 1,
        },
      }).then(resp => {
        const data = resp.data.data
        this.channelIds = Object.keys(data);
        this.payListCr = data;
      });
    },
    getChannelIds() {
      this.$axios.get(systemConfig.urls.getChannelIds, {
        params: {
          methodType: this.activeMethodType,
        },
      }).then(resp => {
        this.channelIds = resp.data.data;
      });
    },
    reset() {
      this.merchantNo = "";
      this.merchantName = "";
      this.statusValue = [];
      this.devSource = [];
    },
    saveMerchant(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.merchantForm.ids.length > 0) {
            this.$store.state.fullsceenLoading = true;
            this.merchantForm.devSource = this.merchantForm.devSources
              .sort()
              .join(",");

            if (this.activeMethodType === '1') {
              this.merchantForm.channelId = this.currencyProtocolOptions.find(item => item.currencyProtocol === this.merchantForm.currencyProtocol).id
            }
            if (this.activeMethodType === '3') {
              this.merchantForm.channelId = 8
              this.merchantForm.currencyProtocol = ''
              this.merchantForm.sort = 0
            }
            if (this.activeMethodType === '4') {
              const item = this.channelIds.find(item => item.id === this.merchantForm.channelId)
              this.merchantForm.currencyCode = item.currencyCode
            }

            this.$axios
              .post(
                this.merchantForm.id
                  ? systemConfig.urls.updateFundMerchantPay
                  : systemConfig.urls.addFundMerchantPay,
                {
                  ...this.merchantForm,
                  methodType: this.activeMethodType,
                }
              )
              .then(resp => {
                if (this.merchantForm.id) {
                  this.$message({
                    type: "success",
                    message: this.$t("更新成功")
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: this.$t("保存成功")
                  });
                }
                this.getData();
                this.resetForm("merchant");
                this.groupCheckAll = false;
                this.dialogVisible = false;
                this.merchantForm = {
                  ids: [],
                  merchantName: "",
                  url: "",
                  merchantNo: "",
                  merchantKey: "",
                  sort: "",
                  available: 1,
                  devSources: []
                };
              });
          } else {
            this.$message({
              type: "warning",
              message: this.$t("请至少选择一个会员组")
            });
          }
        }
      });
    },
    getDetail(id) {
      this.$axios
        .get(systemConfig.urls.findFundMerchantPayOne + id)
        .then(resp => {
          let tempObj = resp.data.data;
          if ((tempObj.devSource || []).length > 1) {
            let tempArr = tempObj.devSource.split(",");
            tempObj.devSources = [].concat(tempArr[0]).concat(tempArr[1]);
          } else {
            let tempArr2 = [];
            tempArr2.push(tempObj.devSource);
            tempObj.devSources = tempArr2;
          }
          if (this.activeMethodType === '1') {
            this.handleCurrencyCodeChange(tempObj.currencyCode)
          }
          this.merchantForm = tempObj;
          this.groupCheckAll =
            this.merchantForm.ids.length === this.listgroup.length;
        });
    },
    merchantCancel(formName) {
      this.resetForm(formName);
      this.dialogVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getGroup() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then(resp => {
        this.listgroup = resp.data.page;
      });
    },
    handleGroupCheckAllChange(val) {
      // 需要重新构造一个ids对比
      let idList = [];
      this.listgroup.map(item => {
        idList.push(item.id);
      });
      this.merchantForm.ids = val ? idList : [];
    },
    handleGroupCheckedChange() {
      let checkedCount = this.merchantForm.ids.length;
      this.groupCheckAll = checkedCount === this.listgroup.length;
    }
  }
};
</script>
<style scoped lang="scss">
/deep/ .el-tabs__header {
  margin-bottom: 0;
}
</style>

