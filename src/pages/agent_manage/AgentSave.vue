<template>
  <div >
    <el-dialog :title="titletype ==0 ? $t('批量增加'):$t('人工减少')" :visible.sync="showbill"
               @close="$emit('update:showAdjust', false)" :showAdjust="showAdjust">
      <el-form class="small-space" label-position="right" label-width="150px">
        <from-wrapper>
          <!--<el-form-item label="订单号">-->
          <!--<el-input v-model="mbrBillDetail.orderNoCompose" placeholder="订单号" ></el-input>-->
          <!--</el-form-item>-->
          <div v-if="titletype">
            <el-form-item :label="$t('调整类型')">
              <el-button disabled>{{ $t('人工减少') }}</el-button>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item :label="$t('存款类型')">
              <el-select v-model="mbrBillDetail.causeId" :placeholder="$t('存款类型')">
                <el-option v-for="item in auditCauseList" :key="item.cause" :label='item.cause' :value='item.id'></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item :label="$t('会员名')">
            <el-input v-model="selectNames" :placeholder="$t('会员名')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('调整金额')">
            <el-input type="number" v-model.number="mbrBillDetail.amount" :placeholder="$t('调整金额')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('稽核')">
            <el-row>
              <el-col :span="14">
                <el-radio v-model="mbrBillDetail.auditType" label="0">{{ $t('免稽核') }}</el-radio>
                <el-radio v-model="mbrBillDetail.auditType" label="1">{{ $t('稽核') }}</el-radio>
              </el-col>
              <el-col :span="10">
                <el-input type="number" min="1" v-model.number="mbrBillDetail.auditMultiple"
                          :disabled="mbrBillDetail.auditType==0">
                  <template slot="append">{{ $t('倍') }}</template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('备注')">
            <el-input type="textarea" v-model="mbrBillDetail.memo"></el-input>
          </el-form-item>
        </from-wrapper>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:showAdjust', false)">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="savebill">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import FromWrapper from '../../components/FromWrapper.vue'
  export default {
    components: {
      FromWrapper
    },
    data () {
      return {
        showbill: this.showAdjust,
        mbrBillDetail: {},
        auditCauseList: []
      }
    },
    props: {
      selectids: {
        type: Array,
        default: []
      },
      selectNames: {
        type: Array,
        default: []
      },
      titletype: '',
      showAdjust: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.getauditCauseList()
    },
    methods: {
      getauditCauseList () {
        this.$axios.get('/fund/report/auditCauseList').then((res) => {
          this.auditCauseList = res.data.data
        })
      },
      savebill () {
        this.mbrBillDetail.ids = this.selectids
        this.mbrBillDetail.adjustType = this.titletype
        this.$store.state.fullscreenLoading = true
        this.$axios.post('/fund/report/auditSave', this.mbrBillDetail).then((res) => {
          this.$message({
            tyep: 'success',
            message: this.$t('修改成功')
          })
          this.$emit('update:showAdjust', false)
        })
      }
    },
    watch: {
      showAdjust () {
        this.showbill = this.showAdjust
      }
    }
  }
</script>
