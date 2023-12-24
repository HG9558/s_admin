<template>
  <div class="withdraw-clock">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="date" :left="35" :selections="searchCriteria.meta[3].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime" />
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true" :networkLoadTime="networkLoadTime" :dataSolveTime="dataSolveTime">
      <div slot="slot-title" class="export-div">
        <el-button class="memberDespot" icon="el-icon-circle-plus-outline" type="primary" size="mini" v-if="permissions.add" @click="add">{{ $t('新增') }}</el-button>
        <el-button class="memberDespot" icon="el-icon-circle-plus-set" type="primary" size="mini" v-if="!permissions.set" @click="set">{{ $t('设置') }}</el-button>
      </div>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('人工锁定次数')" slot="manualLock" align="center" :width="150">
        <template slot-scope="scope">
          <span class="blue" @click="goDetail(scope.row)">{{scope.row.manualLock}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('自动锁定次数')" slot="autoLock" align="center" :width="150">
        <template slot-scope="scope">
          <span class="blue" @click="goDetail(scope.row)">{{scope.row.autoLock}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('锁定状态')" slot="depositLock" align="center" :width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.depositLock===0">{{ $t('正常') }}</span>
          <span v-if="scope.row.depositLock===1">{{ $t('锁定') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" slot="operate" align="center">
        <template slot-scope="scope">
          <span class="blue-color pointer" v-if="permissions.unclock&&scope.row.depositLock===1" @click="unclock(scope.row)">{{ $t('解锁') }}</span>
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog @close="closeShow" :title="$t('存款锁定列表新增')" :visible.sync="addShow" class="deposit__add">
      <el-form label-position="right" label-width="auto" style="margin-left: 10px" :model="addForm" :rules="addRules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('会员账号')" prop="loginName">
              <el-input class="left" v-model="addForm.loginName" :placeholder="$t('请输入会员账号')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('锁定时长')" prop="lockMinute">
              <el-input type="number" class="left" v-model.number="addForm.lockMinute" :placeholder="$t('请输入锁定时间，单位为分钟')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('锁定原因')" class="first-line" prop="lockmemo">
              <el-input type="textarea" :rows="3" class="left" v-model="addForm.lockmemo" :placeholder="$t('请输入内容')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('发布私信')" class="" prop="send">
              <el-radio-group v-model="addForm.send">
                <el-radio :label='0'>{{ $t('否') }}</el-radio>
                <el-radio :label='1'>{{ $t('是') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="addForm.send===1" :label="$t('私信内容')" class="first-line" prop="message">
              <el-input class="left" type="textarea" v-model="addForm.message" :maxlength="400" :placeholder="$t('请输入内容')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click.native="closeAdd">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click.native="submitAdd">{{ $t('保存') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog @close="closeShow" :title="$t('存款锁定参数设置')" :visible.sync="setShow" width="60% !important">
      <el-form v-for="(item,index) in rows" :key="index" label-position="right" label-width="auto" style="margin-top: 20px" :model="setForm[index]" :rules="setRules" :ref="('setForm'+index)">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('存款方式')" prop="depositType">
              <el-select v-model="setForm[index].depositType" :placeholder="$t('请选择存款方式')" class="width100">
                <el-option v-for="(item,index) in withdrawTypes" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('有效时长')" prop="validHours">
              <el-input type="number" class="left width100" v-model.number="setForm[index].validHours" :placeholder="$t('请输入内容')"></el-input>{{ $t('小时') }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('存款未支付次数')" class="first-line" prop="notPayTimes">
              <el-input type="number" class="left width100" v-model.number="setForm[index].notPayTimes" :placeholder="$t('请输入内容')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('锁定时长')" class="first-line" prop="lockTime">
              <el-input type="number" class="left width100" v-model.number="setForm[index].lockTime" :placeholder="$t('请输入内容')"></el-input>{{ $t('分钟') }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('发布私信')" class="" prop="send">
              <el-radio-group v-model.number="setForm[index].send?Number(setForm[index].send):setForm[index].send">
                <el-radio :label='0'>{{ $t('否') }}</el-radio>
                <el-radio :label='1'>{{ $t('是') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" class="first-line">
              <el-input class="left" type="textarea" v-model="setForm[index].message" :maxlength="400" :placeholder="$t('请输入内容')"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="text-align: center;">
            <el-button type="primary" @click.native="addRow">{{ $t('添加') }}</el-button>
            <el-button type="" @click.native="deleteRow(index)">{{ $t('删除') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click.native="closeSet">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click.native="submitSet">{{ $t('保存') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog @close="closeShow" :title="$t('解锁')" :visible.sync="unclockShow">
      <el-form label-position="right" label-width="auto" style="margin-left: 10px" :model="unclockForm" :rules="unclockRules" ref="unclockForm">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('会员账号')" prop="loginName">
              <el-input class="left" v-model="unclockForm.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('锁定时长')" prop="lockMinute">
              <el-input disabled type="number" class="left width100" v-model.number="unclockForm.lockMinute"></el-input>{{ $t('分钟') }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('锁定原因')" class="first-line" prop="lockmemo">
              <el-input type="textarea" :rows="3" class="left" v-model="unclockForm.lockmemo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('是否解锁')" class="" prop="depositLock">
              <el-radio-group v-model="unclockForm.depositLock">
                <el-radio label='0'>{{ $t('是') }}</el-radio>
                <el-radio label='1'>{{ $t('否') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('解锁原因')" class="first-line" prop="unlockMemo">
              <el-input class="left" type="textarea" v-model="unclockForm.unlockmemo" :maxlength="400"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click.native="closeUnclock">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click.native="submitUnclock">{{ $t('保存') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import systemConfig from "../../config/config.js";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "WithdrawClock",
  data(){
    const number = (rule, value, callback) => {
      if (value&&(!Number.isInteger(value)||value<0)) {
        callback(new Error(this.$t('请输入正整数')));
      } else {
        callback();
      }
    };
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: null,
          endTime: null,
          depositLock: null,
          loginName: null,
          actLevelIdList: null,
        },
        meta: [
          {
            type: "text",
            label: this.$t("会员账号"),
            prop: "loginName",
          },
          {
            type: "select",
            multiple: true,
            label: this.$t("VIP等级"),
            prop: "actLevelIdList",
            options: [
            ],
          },
          {
            type: "select",
            // multiple: true,
            label: this.$t("锁定状态"),
            prop: "depositLock",
            options: [
              {
                label: this.$t("全部"),
                value: "",
              },
              {
                label: this.$t("锁定"),
                value: 1,
              },
              {
                label: this.$t("正常"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("日期"),
            slotName: "date",
            options: [
              {
                label: this.$t("今日"),
                value: "today",
              },
              {
                label: this.$t("昨日"),
                value: "yesterday",
              },
              {
                label: this.$t("本周"),
                value: "currentWeek",
              },
              {
                label: this.$t("本月"),
                value: "currentMonth",
              },
              {
                label: this.$t("近三月"),
                value: "lastThreeMonths",
              },
            ],
          },
        ],
      },
      tableData: [],
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          prop: "loginName",
          label: this.$t("会员账号"),
        },
        {
          prop: "realName",
          label: this.$t("真实姓名"),
        },
        {
          prop: "tierName",
          label: this.$t("VIP等级"),
        },
        {
          slotName: "manualLock",
        },
        {
          slotName: "autoLock",
        },
        {
          prop: "depositLock",
          label: this.$t("目前锁定状态"),
          slotName: "depositLock"
        },
        {
          slotName: "operate"
        }
      ],
      addShow:false,
      addForm: {},
      addRules: {
        loginName:[{required:true,message: this.$t("请输入会员名"),trigger:'blur'}],
        lockMinute:[
          {required:true,message: this.$t("请输入锁定时长"),trigger:'blur'},
          {validator:number},
        ],
        lockmemo:[{required:true,message: this.$t("请输入锁定原因"),trigger:'blur'}],
        send:[{required:true,message: this.$t("请选择是否发送私信"),trigger:'blur'}],
        message:[{required:true,message: this.$t("请输入私信内容"),trigger:'blur'}],
      },
      setShow: false,
      rows: [1],
      setForm: [{}],
      setRules: {
        depositType:[{required:true,message: this.$t("请选择存款方式"),trigger:'blur'}],
        validHours:[
          {required:true,message: this.$t("请输入有效时长"),trigger:'blur'},
          {validator:number},
        ],
        notPayTimes:[
          {required:true,message: this.$t("请输入未支付次数"),trigger:'blur'},
          {validator:number},
        ],
        lockTime:[
          {required:true,message: this.$t("请输入锁定时长"),trigger:'blur'},
          {validator:number},
        ],
        send:[{required:true,message: this.$t("请选择是否发布私信"),trigger:'blur'}],
      },
      unclockShow: false,
      unclockForm: {},
      unclockRules: {
        lockMinute:[
          {required:true,message: this.$t("请输入锁定时长"),trigger:'blur'},
          {validator:number},
        ],
        depositLock:[{required:true,message: this.$t("请选择是否解锁"),trigger:'blur'}]
      },
      withdrawTypes: [
        {id: 999, label: this.$t('全部')},
        {id: 1, label: this.$t('网关QQ')},
        {id: 2, label: this.$t('网关微信')},
        {id: 3, label: this.$t('网关京东')},
        {id: 4, label: this.$t('网关网银支付')},
        {id: 5, label: this.$t('网关支付宝')},
        {id: 7, label: this.$t('网关快捷支付')},
        {id: 8, label: this.$t('网关银联扫码')},
        {id: 11, label: this.$t('网关卡转卡')},
        {id: 14, label: this.$t('银行卡转卡')},
      ],
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("member:mbrdepositlock:depositlock"),
        set: hasPermission(""),
        unclock: hasPermission("member:mbrdepositlock:depositunlock"),
      };
    },
  },
  created() {
    this.getTableData()
    this.getMemberLevelList()
  },
  methods:{
    getMemberLevelList() {
      this.$axios.get(systemConfig.urls.memberLevel.list).then((res) => {
        res.data.data.map(ws=>{
          this.searchCriteria.meta[1].options.push({value:ws.id,label:ws.tierName})
        })
      });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      let ids = this.searchCriteria.keys.actLevelIdList?this.searchCriteria.keys.actLevelIdList.join(","):""
      let params = Object.assign({},this.searchCriteria.keys)
      params.actLevelIdList = ids
      this.$axios
        .get(systemConfig.urls.mbrdepositlockList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
          },
        })
        .then((res) => {
          if (res) {
            this.getNetworkLoadAndDataSolveTime(res)
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              return item;
            });
          }
        });
    },
    unclock(row){
      this.$axios
        .get(systemConfig.urls.getLockInfo, {
          params: {
            accountId:row.id
          },
        })
        .then((res) => {
          if (res) {
            this.unclockForm = Object.assign({},res.data.data)
            this.unclockForm.loginName = row.loginName
            this.unclockShow = true
          }
        });
    },
    goDetail(row) {
      this.$router.push({path:'/main/wageManage/depositLockDetail',query:{accountId:row.id}})
    },
    add(){
      this.addShow = true
    },
    set(){
      this.$axios
        .get(systemConfig.urls.getAutoLockSetting, {
          params: {
          },
        })
        .then((res) => {
          if (res) {
            this.setForm = []
            this.rows = []
            if(res.data.data&&res.data.data.length){
              res.data.data.map(ws=>{
                this.setForm.push(ws)
                this.rows.push(1)
              })
            }else{
              this.rows.push(1)
              this.setForm = [{}]
            }
            this.setShow = true
          }
        });
    },
    closeShow(done){
      this.addForm = {}
      this.addShow = false
      this.unclockForm = {}
      this.unclockShow = false
      this.setForm = [{}]
      this.rows = [1]
      this.setShow = false
      this.$refs.addForm.clearValidate()
      this.$refs.addForm.resetFields()
      this.rows.map((ws,index)=>{
        this.$refs['setForm'+index].clearValidate()
        this.$refs['setForm'+index].resetFields()
      })
      this.$refs.unclockForm.clearValidate()
      this.$refs.unclockForm.resetFields()
      if(done)done()
    },
    closeAdd(){
      this.closeShow()
    },
    submitAdd(){
      this.$refs.addForm.validate(valid=>{
        if(valid){
          this.$axios
            .post(systemConfig.urls.addDepositLock, {
              ...this.addForm
            })
            .then((res) => {
              if (res) {
                this.$message.success(this.$t('添加锁定成功！'))
                this.getTableData()
              }
            }).catch(()=>{
            this.$message.error(this.$t("添加锁定失败！"))
          }).finally(()=>{
            this.closeShow()
          })
        }
      })
    },
    closeSet(){
      this.closeShow()
    },
    submitSet(){
      let arr = []
      this.rows.map((ws,index)=>{
        this.$refs[('setForm'+index)][0].validate(valid=>{
          if(valid){
            arr.push(1)
          }else{
            arr.push(0)
          }
        })
      })
      if(arr.indexOf(0)===-1){
        this.$axios
          .post(systemConfig.urls.saveAutoLockSetting,
            this.setForm)
          .then((res) => {
            if (res) {
              this.$message.success(this.$t('设置成功！'))
            }
          }).catch(()=>{
          this.$message.error(this.$t("设置失败！"))
        }).finally(()=>{
          this.closeShow()
        })
      }
    },
    addRow(){
      this.rows.push(1)
      this.setForm.push({})
    },
    deleteRow(i) {
      if(this.rows.length>1){
        this.rows.splice(i,1)
        this.setForm.splice(i,1)
      }
    },
    closeUnclock(){
      this.closeShow()
    },
    submitUnclock(){
      this.$refs.unclockForm.validate(valid=>{
        if(valid){
          this.$axios
            .post(systemConfig.urls.depositUnlock, {
              ...this.unclockForm
            })
            .then((res) => {
              if (res) {
                this.$message.success(this.$t('解锁成功！'))
                this.getTableData()
              }
            }).catch(()=>{
            this.$message.error(this.$t("解锁失败！"))
          }).finally(()=>{
            this.closeShow()
          })
        }
      })
    },
    getPaymentPlatforms () {
      this.$axios.get(systemConfig.urls.onlinePayListList).then((res) => {
        this.paymentPlatforms = res.data.data
        this.payments = this.payments.filter(item => this.paymentPlatforms[item.id] && this.paymentPlatforms[item.id].length > 0)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.withdraw-clock{
  .blue{color: #3a8ee6;}
  .blue:hover{cursor: pointer;}
  .export-div{display: flex;justify-content: flex-end;}
  .width100{width: 130px!important;}
  ::v-deep .first-line .el-form-item__content{border: 0;}
}
.deposit__add {
  ::v-deep .el-col {
    height: 90px;
  }
}
</style>
