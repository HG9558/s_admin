<template>
  <div>
    <el-dialog :title="$t('即时稽核信息')" :visible.sync="showAdiPup" @close="$emit('update:showAdit', false)" :showAdit="showAdit" width="80%">
      <h4>{{ $t('会员名') }}：{{loginName}}</h4>
      <ol>
        <li>{{ $t('存款记录共') }} <span>{{Audit.depositCount}}</span> {{ $t('笔') }}，{{ $t('有效投注额共') }} <span>{{Audit.depositValidBet}}</span></li>
        <li>{{ $t('存款稽核点有') }} <span>{{Audit.depositCountNot}}</span>{{ $t('笔未通过') }}，{{ $t('需被扣除的行政费用') }} <span>{{Audit.depositCost}}</span></li>
        <li v-if="Audit.discountCountNot==0">{{ $t('优惠稽核点全部通过') }}</li>
        <li v-else>{{ $t('优惠稽核点有') }} {{Audit.discountCountNot}} {{ $t('笔未通过') }}，{{ $t('需被扣除优惠') }} {{Audit.discountCost}}</li>
      </ol>
      <el-row type="flex" justify="end">
        <el-popover
          ref="clearaudit"
          placement="top-start"
          width="200"
          trigger="hover"
          :content="$t('清除稽核点是指取消本次稽核所有稽核点，无条件通过本次稽核。')">
        </el-popover>
        <el-button type="text"  @click="clearAudit" v-popover:clearaudit style="margin-right: 8px">{{ $t('清除稽核点') }}</el-button>
        <router-link to="/main/memberManage/auditDetail" target="_blank" style="line-height: 40px">{{ $t('稽核规则说明') }}</router-link>
        <!-- <el-button type="text"  @click="getAuditDetail">稽核规则说明</el-button> -->
      </el-row>
      <el-table max-height="480" ref="singleTable" v-loading='loading' :data="Audit.audits"  border fit highlight-current-row>
        <el-table-column type="index" width="50" :label="$t('序号')" :index="indexMethod"></el-table-column>
        <el-table-column property="time" :label="$t('时间')" :formatter="timeFilter" width="160"></el-table-column>
        <el-table-column property="depositAmount" :label="$t('存款金额')"></el-table-column>
        <el-table-column property="depositAudit" :label="$t('存款稽核点')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === rowIndex" class="edit-input" size="small" type="number" v-model.number="scope.row.tempAudit"
                      @change="updateDiscountAudit(scope.row)"></el-input>
            <span v-else>{{ scope.row.depositAudit }}</span>
          </template>
        </el-table-column>
        <el-table-column property="administrationCost" :label="$t('行政费用')"></el-table-column>
        <el-table-column property="discountAmount" :label="$t('优惠金额')"></el-table-column>
        <el-table-column property="depositAudit" :label="$t('优惠稽核点')">
          <template slot-scope="scope">
            <el-input v-if="scope.$index === rowIndex" class="edit-input" size="small" type="number" v-model.number="scope.row.tempAudit"
                      @change="updateDiscountAudit(scope.row)"></el-input>
            <span v-else>{{ scope.row.discountAudit }}</span>
          </template>
        </el-table-column>
        <el-table-column property="discountDeduct" :label="$t('优惠扣除')"></el-table-column>
        <el-table-column property="depositOutBalance" :label="$t('输光余额')"></el-table-column>
        <el-table-column property="validBet" :label="$t('有效投注额')"></el-table-column>
        <!-- <el-table-column property="depositBalance" label="余额"></el-table-column> -->
        <el-table-column property="amountAudit" :formatter="updateDiscountAudit" :label="$t('稽核金额')"></el-table-column>
        <el-table-column property="status" :label="$t('稽核状态')">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'warning'" v-text="scope.row.status === 1 ? $t('通过') : $t('不通过')">
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="status" :label="$t('修改稽核')">
          <template slot-scope="scope">
            <el-button @click="changeEdit(scope)" type="text" size="small">[{{ $t('编辑') }}]</el-button>
            <el-button @click="chancleEdit(scope)" type="text" size="small">[{{ $t('取消') }}]</el-button></template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="$emit('update:showAdit', false)">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateaudit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import systemConfig from '../../config/config'
  export default {
    components: {

    },
    data () {
      return {
        showAdiPup: this.showAdit,
        Audit: {},
        editAudit: false,
        amountAudit: '',
        rowIndex: ''
      }
    },
    props: {
      showAdit: {
        type: Boolean,
        default: false
      },
      loginName: {
        type: String,
        default: ''
      }
    },
    computed: {
      listReq () {
        return {
          pageNo: 1,
          pageSize: 10,
          pageSizeArr: [5, 10, 20, 50, 100, 200]
        }
      },
      loading () {
        return this.$store.state.searchLoading
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      getAuditDetail () {

      },
      indexMethod (index) {
        return index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize
      },
      timeFilter (row, column) {
        var date = row[column.property]
        if (date == null || date === '') {
          return ''
        }
        return systemConfig.timeFilter(date)
      },
      changeEdit (scope) {
        this.rowIndex = scope.$index
        scope.row.tempAudit = ''
      },
      chancleEdit (scope) {
        this.rowIndex = ''
        scope.row.tempAudit = null
      },
      getList () {
        this.$store.state.searchLoading = true
        this.$axios.get(systemConfig.urls.immediatelyAudit, {params: {accountId: this.$route.query.id}}).then(res => {
          this.Audit = res.data.data
        })
      },
      updateDiscountAudit (row) {
        // if (row.depositAudit) {
        //   this.tempAudit = row.depositAudit
        //   row.discountAudit = row.depositAudit
        // }
        // if (row.discountAudit) {
        //   this.tempAudit = row.discountAudit
        //   row.depositAudit = row.discountAudit
        // }
        if (row.tempAudit) {
          return (row.depositAmount + row.discountAmount) * row.tempAudit
        } else {
          return row.depositAmount * row.depositAudit + row.discountAmount * row.discountAudit
        }
      },
      updateaudit () {
        for (let i = 0; i < this.Audit.audits.length; i++) {
          if (this.Audit.audits[i].tempAudit === '') {
            this.$message({
              type: 'warning',
              message: this.$t('请输入稽核倍数')
            })
            return
          }
          if (this.Audit.audits[i].tempAudit!==null) {
            if (!(/(^[0-9]\d*$)/.test(this.Audit.audits[i].tempAudit))) {
              this.$message({
                type: 'warning',
                message: this.$t('存款稽核倍数只能为整数')
              })
              return
            }
            this.Audit.audits[i].depositAudit = this.Audit.audits[i].tempAudit
            this.Audit.audits[i].discountAudit = this.Audit.audits[i].tempAudit
          }
        }
        for (let i = 0; i < this.Audit.audits.length; i++) {
          this.Audit.audits[i].tempAudit = ''
        }
        this.$store.state.fullscreenLoading = true
        this.$axios.post(systemConfig.urls.auditUpdate, this.Audit.audits).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('成功')
          })
          this.$emit('update:showAdit', false)
        })
      },
      clearAudit () {
        this.$axios.get(systemConfig.urls.auditClear, {params: {accountId: this.$route.query.id}}).then(res => {
          this.getList()
        })
      }
    },
    watch: {
      showAdit () {
        this.showAdiPup = this.showAdit
        this.editAudit = false
      }
    }
  }
</script>
