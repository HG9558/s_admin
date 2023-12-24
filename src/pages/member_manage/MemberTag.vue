<template>
  <div class="memberTag">
    {{ $t('会员标签') }}
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom"></TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div">
        <el-button class="memberDespot" icon="el-icon-circle-plus-outline" type="primary" size="mini" v-if="permissions.add" @click="add">{{ $t('新增标签') }}</el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('状态')" slot="isAvailable" align="center">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.name!==$t('新会员')" v-model="scope.row.isAvailable" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row, $event)"></el-switch>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" slot="operate" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.name!==$t('新会员')" class="blue-color pointer" @click="addMember(scope.row)">{{ $t('添加会员') }}</span>
          <span v-if="scope.row.name!==$t('新会员')&&scope.row.isSetRule" class="blue-color pointer" @click="addRule(scope.row)">{{ $t('规则') }}</span>
          <span v-if="scope.row.name===$t('新会员')">-</span>
          <span v-if="scope.row.name!==$t('新会员')" class="blue-color pointer" @click="editRule(scope.row)">{{ $t('编辑') }}</span>
          <span v-if="scope.row.name!==$t('新会员')" class="blue-color pointer" @click="delRule(scope.row)">{{ $t('删除') }}</span>
        </template>
      </el-table-column>
    </TableCom>

    <el-dialog :visible.sync="addVisible" @close="close" width="50%" :title="extitle">
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item :label="$t('标签名称')" prop="name" :rules="[{ required: true, message: $t('请输入'), trigger: 'blur' }]">
          <el-input type="text" v-model="addForm.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('是否设定规则')" prop="isSetRule">
          <el-radio-group v-model="addForm.isSetRule">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('标签状态')" prop="isAvailable">
          <el-switch v-model="addForm.isAvailable" :inactive-value='0' :active-value='1'>
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAdd">{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addMVisible" @close="closeM" width="50%" :label="$t('添加会员')">
      <el-form ref="addMForm" :model="addMForm" :rules="addMRules">
        <el-form-item :label="$t('会员账号')" prop="name">
          <el-input type="textarea" v-model="addMForm.userNames" :placeholder="$t('请输入会员账号并用“，”隔开')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddM">{{ $t('保存') }}</el-button>
        <el-button @click="cancelAddM">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addRVisible" @close="closeR" width="50%" :title="$t('新增标签规则-免审')">
      <el-form ref="addRForm" :model="addRForm" :rules="addRRules">
        <TableCom :hasAddBtn="false" :hasRemoveBtn="false" class="table_data" :table-data="tableDataR" :table-columns="tableColumnsR">
          <!-- 表格插槽 -->
          <el-table-column :label="$t('免审金额')" slot="num" align="center">
            <template slot-scope="scope">
              <el-input type="number" min="0" v-model.number="scope.row.num" @change="change1(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('启用状态')" slot="isAvailable" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isAvailable" :active-value="1" :inactive-value="0" @change="change2(scope.row)"></el-switch>
            </template>
          </el-table-column>
        </TableCom>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddR">{{ $t('保存') }}</el-button>
        <el-button @click="cancelAddR">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Mixin from '@/mixins/loadTime'
import systemConfig from "../../config/config";
import {mapGetters} from "vuex";

export default {
  mixins: [Mixin],
  name: "MemberTag",
  data(){
    return {
      commonRule: systemConfig.rules.commonRule,
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          name: '',
          isAvailable: '',
        },
        meta: [
          {
            type: "text",
            label: this.$t("标签名字"),
            prop: "name",
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "isAvailable",
            options: [
              {label:this.$t('禁用'),value:0},
              {label:this.$t('开启'),value:1},
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          prop: "index",
          label: this.$t("序号"),
        },
        {
          prop: "name",
          label: this.$t("标签名称"),
        },
        {
          prop: "isAvailable",
          slotName: "isAvailable"
        },
        {
          prop: "operate",
          slotName: "operate",
        },
      ],
      tableDataR: [],
      tableColumnsR: [
        {
          prop: "type",
          label: this.$t("出款方式"),
        },
        {
          prop: "num",
          slotName: "num",
        },
        {
          prop: "isAvailable",
          slotName: "isAvailable"
        },
      ],
      addVisible: false,
      addForm: {},
      addRules: {
        name: [{required:true,message:this.$t('请输入标签名称'),trigger:'blur'}],
        isSetRule: [{required:true,message:this.$t('请选择是否设定标签规则'),trigger:'blur'}],
        status: [{required:true,message:this.$t('请选择标签状态'),trigger:'blur'}],
      },
      addMVisible: false,
      addMForm: {},
      addMRules: {
        name: [{required:true,message: this.$t('请输入会员账号'),trigger:'blur'}],
      },
      addRVisible: false,
      addRForm: {},
      addRRules: {

      },
      extitle:'',

    }
  },
  created() {
    this.getTableData()
  },
  methods:{
    getTableData() {
      this.getCurrentRecodeTime()
      let params = Object.assign({},this.searchCriteria.keys)
      this.$axios
        .get(systemConfig.urls.mbrlabel, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
          },
        })
        .then((res) => {
          this.tableData = []
          if (res) {
            const { list, totalCount,currPage } = res.data.page;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            this.getNetworkLoadAndDataSolveTime(res)
            this.tableData = list.map((item,index) => {
              item.index = index+1
              item.isSetRule===true?(item.isSetRule=1):(item.isSetRule=0)
              item.isAvailable===true?(item.isAvailable=1):(item.isAvailable=0)
              return item;
            });
          }
        });
    },
    add(){
      this.extitle = this.$t('新增标签')
      this.addVisible = true
    },
    saveAdd(){
      console.log(this.$refs.addForm)
      this.$refs.addForm.validate((valid) => {
        if(valid){
          let data = Object.assign({},this.addForm)
          if(this.extitle===this.$t('编辑')){
            this.$axios
              .post(systemConfig.urls.updateMbrlabel, data)
              .then((res) => {
                if (res.data.code===0) {
                  this.$message.success(this.$t('编辑标签成功'))
                  this.getTableData()
                }
              }).finally(()=>{
              this.close()
            })
          }else{
            if(!data.isAvailable&&data.isAvailable!==0)data.isAvailable = 0
            this.$axios
              .post(systemConfig.urls.saveMbrlabel, data)
              .then((res) => {
                if (res.data.code===0) {
                  this.$message.success(this.$t('新增标签成功'))
                  this.getTableData()
                }
              }).finally(()=>{
              this.close()
            })
          }
        }
      })
    },
    close(done){
      this.$refs.addForm.clearValidate()
      this.$refs.addForm.resetFields()
      this.addForm = {}
      this.addVisible = false
      if(done)done()
    },
    handleStatusChange(row, available){
      console.log(available)
      let nowstatus = available
      this.$axios.post(systemConfig.urls.updateMbrlabelAvailable,{id:row.id,isAvailable:nowstatus}).then(res=>{
        if(res.data.code===0){
          this.$message.success(this.$t('修改状态成功'))
          this.getTableData()
        }else{
          row.isAvailable = nowstatus===1?0:1
          this.$message.error(this.$t('修改状态失败'))
        }
      }).catch(()=>{
        row.isAvailable = nowstatus===1?0:1
        this.$message.error(this.$t('修改状态失败'))
      })
    },
    addMember(row){
      this.addMForm = Object.assign({},row)
      this.addMVisible = true
    },
    addRule(row){
      this.addRForm = Object.assign({},row)
      this.tableDataR.push({index:1,type:this.$t('支付宝'),num:this.addRForm.aliPayWithdrawal,isAvailable:this.addRForm.isExemptAliPay===true?1:0})
      this.tableDataR.push({index:2,type:this.$t('银行卡'),num:this.addRForm.bankWithdrawal,isAvailable:this.addRForm.isExemptBank===true?1:0})
      this.addRVisible = true
    },
    saveAddM(){
      this.$refs.addMForm.validate(valid=>{
        if(valid){
          this.$axios.post(systemConfig.urls.setMbrLabel,{labelid:this.addMForm.id,userNames:this.addMForm.userNames}).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('添加会员成功'))
              this.getTableData()
            }else{
              this.$message.error(this.$t('添加会员失败'))
            }
          }).catch(()=>{
            this.$message.error(this.$t('添加会员失败'))
          }).finally(()=>{
            this.closeM()
          })
        }
      })
    },
    closeM(done){
      this.$refs.addMForm.clearValidate()
      this.$refs.addMForm.resetFields()
      this.addMForm = {}
      this.addMVisible  = false
      if(done)done()
    },
    cancelAddM(){
      this.closeM()
    },
    saveAddR(){
      this.$refs.addRForm.validate(valid=>{
        if(valid){
          this.$axios.post(systemConfig.urls.updateMbrlabel,
            {
              name:this.addRForm.name,
              id:this.addRForm.id,
              aliPayWithdrawal:this.addRForm.aliPayWithdrawal,
              bankWithdrawal:this.addRForm.bankWithdrawal,
              isExemptAliPay:this.addRForm.isExemptAliPay,
              isExemptBank:this.addRForm.isExemptBank,
            }
          ).then(res=>{
            if(res.data.code===0){
              this.$message.success(this.$t('新增标签规则成功'))
              this.getTableData()
            }else{
              this.$message.error(this.$t('新增标签规则失败'))
            }
          }).catch(()=>{
            this.$message.error(this.$t('新增标签规则失败'))
          }).finally(()=>{
            this.closeR()
          })
        }
      })
    },
    closeR(done){
      this.$refs.addRForm.clearValidate()
      this.$refs.addRForm.resetFields()
      this.addRForm = {}
      this.tableDataR = []
      this.addRVisible  = false
      this.$refs.editForm.clearValidate()
      this.$refs.editForm.resetFields()
      this.editForm = {}
      this.editFormVisible  = false
      if(done)done()
    },
    cancelAddR(){
      this.closeR()
    },
    change1(row){
      if(row.index===1){
        this.addRForm.aliPayWithdrawal=row.num
      }
      if(row.index===2){
        this.addRForm.bankWithdrawal=row.num
      }
    },
    change2(row){
      if(row.index===1){
        this.addRForm.isExemptAliPay=row.isAvailable
      }
      if(row.index===2){
        this.addRForm.isExemptBank=row.isAvailable
      }
    },
    editRule(row){
      this.extitle = this.$t('编辑')
      this.addForm = Object.assign({},row)
      this.addVisible = true
    },
    delRule(row){
      const h = this.$createElement;
      this.$msgbox({
        title:this.$t('删除'),
        customClass: 'msgbox',
        showCancelButton: true,
        cancelButtonText: this.$t('取消'),
        confirmButtonText: this.$t('确定'),
        message: h('div', null, [
          h('p', { style: 'fontSize: 16px' }, this.$t('确认删除这条会员标签吗?')),
          h('p', { style: 'color: red' }, this.$t('备注：标签被删除后，该标签下的用户，会自动被标记到 新会员标签下面'))
        ]),
      }).then(() => {
        this.$axios.post(systemConfig.urls.deleteMbrlabel,{id:row.id}).then(res=>{
          if(res.data.code===0){
            this.$message({
              type: 'success',
              message: this.$t('删除成功')
            });
            this.getTableData()
          }
        })
      })
    },
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: !hasPermission(""),
      };
    },
  },
}
</script>

<style lang="scss" scoped>
.memberTag{
  .blue{color: #3a8ee6;}
  .blue:hover{cursor: pointer;}
  .export-div{display: flex;justify-content: flex-end;}
  .width100{width: 130px!important;}
  ::v-deep .first-line .el-form-item__content{border: 0;}
}
</style>
<style>
/*.msgbox .el-message-box__title{font-size: 16px!important;}*/
</style>
