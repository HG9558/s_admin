<template>
  <div>
    <!-- 全局组件 表格组件 -->
    <TableCom
      :hasAddBtn="false"
      :hasRemoveBtn="false"
      :hasPagination="false"
      :tableData="tableData"
      :tableColumns="tableColumns"
       v-loading='loading'
      :showLoadTime="true"
      :networkLoadTime="networkLoadTime"
      :dataSolveTime="dataSolveTime"

    >
      <el-button v-if="hasPermission('member:mbractlevel:save')" type="primary" size="small" @click="handleAdd">{{ $t('新增等级') }}</el-button>
      <el-button v-if="hasPermission('member:mbractlevel:qryStaticsRule')" type="primary" size="small" @click="getStatisticalRule">{{ $t('周期统计规则') }}</el-button>
      <el-button v-if="hasPermission('member:mbractlevel:setAutomatic')" :loading="isAutoPromotionLoading" type="primary" size="small" @click="toggleAutoPromotion">{{autoPromotion ? $t('关闭自动晋升') : $t('开启自动晋升')}}</el-button>
      <el-button v-if="hasPermission('member:mbractlevel:setDowngrade')" :loading="isAutoPromotionLoadingNew" type="primary" size="small" @click="toggleAutoPromotionNew">{{autoPromotionNew ? $t('关闭自动降级') : $t('开启自动降级')}}</el-button>
      <el-table-column width="350" fixed="right" align="left" :label="$t('晋升条件')" slot="promotionCondition">
        <p class="member-promotion-condition" slot-scope="scope">{{scope.row.id === 1 ? $t('注册成功') : getPromotionCondition(scope.row)}}</p>
      </el-table-column>
      <el-table-column width="200" fixed="right" align="center" :label="$t('恢复条件')" slot="recoverBet">
        <p class="member-promotion-condition" slot-scope="scope">{{scope.row.recoverBet||scope.row.recoverBet==0?($t('累计有效投注') + '>='+scope.row.recoverBet):''}}</p>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('是否启用')" slot="available">
        <template slot-scope="scope">
          <el-switch  v-model="scope.row.isOpen" :disabled="(scope.row.id==1||scope.row.accountCount||!hasPermission('member:mbractlevel:update'))?true:false" @change="statusChange(scope.row.isOpen,scope.row.id,scope.row.accountLevel)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('会员数')" slot="accountCount" width="120">
        <template slot-scope="scope">
          <el-button @click="jumpToMemberList(scope.row.id)" type="text" size="small" v-if="scope.row.accountCount">{{scope.row.accountCount}}</el-button>
          <template v-else>0</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('锁定会员')" slot="accountLockCount" width="120">
        <template slot-scope="scope">
          <el-button @click="jumpToMemberList(scope.row.id, 1)" type="text" size="small" v-if="scope.row.accountLockCount">{{scope.row.accountLockCount}}</el-button>
          <template v-else>0</template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('操作')" slot="operation" width="150">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('member:mbractlevel:update')" @click="handleEdit(scope.row)" type="text" size="small">[{{ $t('编辑') }}]</el-button>
          <!-- id 为1的是默认等级 不可删除 -->
          <el-button v-if="hasPermission('member:mbractlevel:delete') && scope.row.id !== 1" @click="handleDelete(scope.row.id)" type="text" size="small">[{{ $t('删除') }}]</el-button>
        </template>
      </el-table-column>
    </TableCom>
    <Form
      v-if="formVisible"
      :infoForEdit="infoForEdit"
      :formVisible.sync="formVisible"
      @submit="handleSubmit"
    />
    <StatisticalRule
      v-if="statisticalRuleVisible"
      :statisticalRuleFormModel="statisticalRuleFormModel"
      :formVisible.sync="statisticalRuleVisible"
      @submit="handleChangeStatisticalRule"
      :isSaveLimit="hasPermission('member:mbractlevel:setStaticsRule')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from './Form'
import systemConfig from '../../../config/config'
import StatisticalRule from './StatisticalRule'
import Mixin from '@/mixins/loadTime'


const { toThousands } = systemConfig

export default {
  name: 'memberLevel',
  components: {
    Form,
    StatisticalRule
  },
  mixins: [Mixin],
  data() {
    return {
      tableColumns: [
        {
          prop: 'accountLevel',
          label: this.$t('等级'),
          width: '100'
        },
        {
          prop: 'tierName',
          label: this.$t('等级名称')
        },
        {
          slotName: 'promotionCondition',
        },
        //本周不上线
        {
          slotName: 'recoverBet',
          // prop: 'recoverBet',
          // label: '恢复条件'
        },
        {
          slotName: 'available'
        },
        {
          slotName: 'accountCount'
        },
        {
          slotName: 'accountLockCount'
        },
        {
          slotName: 'operation'
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      formVisible: false,
      autoPromotion: 0,
      autoPromotionNew: 0,
      infoForEdit: null,
      isAutoPromotionLoading: false,
      isAutoPromotionLoadingNew:false,
      statisticalRuleFormModel: null,
      statisticalRuleVisible: false,
    }
  },
  computed: {
    ...mapGetters(['hasPermission']),
    loading() {
      return this.$store.state.searchLoading
    },
  },
  created() {
    this.getAutoPromotion()
    this.getAutoPromotionNew()
    this.getTableData()
  },
  methods: {
    handleChangeStatisticalRule(params) {
      this.$axios.get(systemConfig.urls.memberLevel.setStaticsRule, {
        params
      })
      .then(() => {
        this.statisticalRuleVisible = false
        this.$message.success(this.$t('操作成功'))
      })
    },
    getStatisticalRule() {
      const instance = this.$loading()
      this.$axios.get(systemConfig.urls.memberLevel.findActLevelStaticsRule)
      .then(res => {
        const { actLevelStaticsRule, actLevelStaticsRuleDescription,downgradePromotionDay,recoverPromotionDay } = res.data.data
        this.statisticalRuleFormModel = {
          statisticalRule: actLevelStaticsRule,
          description: actLevelStaticsRuleDescription,
          downgradePromotionDay:downgradePromotionDay,
          recoverPromotionDay:recoverPromotionDay
        }
        this.statisticalRuleVisible = true
        instance.close()
      })
    },
    jumpToMemberList(actLevelId, isActivityLock = undefined) {
      this.$router.push({
        path: '/main/memberManage/memberList',
        query: {
          actLevelId,
          isActivityLock
        }
      })
    },
    toggleAutoPromotion() {
      this.isAutoPromotionLoading = true
      this.$axios.get(systemConfig.urls.memberLevel.setAutomatic, {
        params: {
          value: Number(!this.autoPromotion)
        }
      })
      .then(() => {
        this.getAutoPromotion()
      })
      .catch(() => {
        this.isAutoPromotionLoading = false
      })
    },
    toggleAutoPromotionNew() {
      this.isAutoPromotionLoadingNew = true
      this.$axios.get(systemConfig.urls.memberLevel.setAutomaticNew, {
        params: {
          value: Number(!this.autoPromotionNew)
        }
      })
        .then(() => {
          this.getAutoPromotionNew()
        })
        .catch(() => {
          this.isAutoPromotionLoadingNew = false
        })
    },
    getPromotionCondition({ promoteSign, conditions, depositMin, depositMax, validbetMin, validbetMax }) {
      const depositText = /^1|2$/.test(promoteSign) ? `${this.$t('累计最低充值')}≥${toThousands(depositMin)}` : ''
      const validbetText = /^0|2$/.test(promoteSign) ? `${this.$t('累计有效投注')}≥${toThousands(validbetMin)}` : ''
      // conditions
      const conditionsText = (depositText && validbetText) ?
        conditions ? `\n${this.$t('或')}\n` : `\n${this.$t('且')}\n` :
        ''
      return depositText + conditionsText + validbetText
    },
    getAutoPromotion() {
      this.$axios.get(systemConfig.urls.memberLevel.getAutomatic)
        .then(res => {
          this.autoPromotion = res.data.data
          this.isAutoPromotionLoading = false
        })
    },
    getAutoPromotionNew() {
      this.$axios.get(systemConfig.urls.memberLevel.getAutomaticNew)
        .then(res => {
          this.autoPromotionNew = res.data.data
          this.isAutoPromotionLoadingNew = false
        })
    },
    handleDelete(id) {
      this.$axios.get(systemConfig.urls.memberLevel.delete + '/' + id)
      .then(() => {
        this.getTableData()
      })
    },
    handleSubmit(formModel) {
      //formModel.available=formModel.available?1:0;
      if (formModel.id) {// 编辑
        this.$axios.post(systemConfig.urls.memberLevel.update, formModel)
        .then(() => {
          this.formVisible = false
          this.getTableData()
        })
      } else {// 新增
        this.$axios.post(systemConfig.urls.memberLevel.save, formModel  )
        .then(() => {
          this.formVisible = false
          this.getTableData()
        })
      }
    },
    handleEdit(row,rowId) {
      this.infoForEdit = row
      this.formVisible = true
    },
    handleAdd() {
      this.infoForEdit = null
      this.formVisible = true
    },
    getTableData(){
      this.getCurrentRecodeTime()
      this.$store.state.searchLoading = true
      this.$axios.get(systemConfig.urls.memberLevel.list)
      .then(res => {
        if(res){
          this.getNetworkLoadAndDataSolveTime(res)
          let tableList=res.data.data;
          tableList.map((val)=>{
            val['isOpen']=val.available==1 ? true :false;
          })
          this.tableData = tableList;
        }
      })
    },
    statusChange(bool,id,curindex){
      this.$store.state.searchLoading = true
      let curTableList=JSON.parse(JSON.stringify(this.tableData));
      let ids=[],available='',closeBool=true,curCloseIndex=[];
      if(bool){//开启
        curTableList.map((val,index)=>{
          if(index<=curindex&&!val.accountCount){
            val['isOpen']=true;
            ids.push(val.id);
          }
        })
        available=1;
      }else{//禁用
        curTableList.map((val,index)=>{
          if(index>=curindex&&!val.accountCount&&closeBool){//由于map没有如return的中断操作（throw 'out'拿不到想要的结果）-->closeBool阀值用于后面不进行任何操作的控制
            val['isOpen']=false;
            ids.push(val.id);
            curCloseIndex.push(index);
          }else if(index>=curindex&&val.accountCount&&closeBool){
            closeBool=false;
          }
        })
        available=0;
        if(!closeBool){
          this.tableData=curTableList;
          this.$store.state.searchLoading = false;
          setTimeout(() => {
            curCloseIndex.map((newVal,newIndex)=>{
              curTableList[newVal]['isOpen']=true;
            })
            this.$notify({title: this.$t('温馨提示'), message: this.$t('高星级存在会员，不能禁用')})
          }, 300);
          return;
        }
      }
      this.tableData=curTableList;
      this.$axios.post(systemConfig.urls.memberLevel.updateAvailableBatch,{ids:ids,available:available})
      .then(res => {
        if(res){
          this.getTableData()
        }
      })
    }
    /* statusChange(bool,id,index){
      let params={
        id:id,
        available:bool?1:0
      }
      this.$axios.post(systemConfig.urls.memberLevel.updateAvailable,params)
      .then(res => {
        if(res){
          console.log("TCL: statusChange -> res", res)
        }
      })
    } */
  }
}
</script>

<style lang="scss" scoped>
.member-promotion-condition {
  text-align: center;
  white-space: pre-wrap;
}
</style>
