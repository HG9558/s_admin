<template>
  <div class="warning">
    <TableSearchBar :currentPage.sync="currentPage" :searchCriteria="searchCriteria" @reloadData="getTableData" ref="searchCom">
      <!-- 公共组件 起止时间选择器 -->
      <StartAndEndTimeSelector slot="date" :left="75" :width="450" :selections="searchCriteria.meta[0].options" :startTime.sync="searchCriteria.keys.startTime" :endTime.sync="searchCriteria.keys.endTime"/>
    </TableSearchBar>
    <TableCom :hasAddBtn="false" :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @reloadData="getTableData" class="table_data" :showLoadTime="true"
              :networkLoadTime="networkLoadTime"
              :dataSolveTime="dataSolveTime">
      <!-- 表格插槽 -->
      <el-table-column :label="$t('状态')" slot="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">{{ $t('已处理') }}</span>
          <el-tag v-if="scope.row.status===0" class="bluebtn" @click="handle(scope.row)">{{ $t('待处理') }}</el-tag>
        </template>
      </el-table-column>
    </TableCom>
    <el-dialog :visible.sync="dialogVisible" @close="close" width="30%" :title="$t('预警处理')">
      <el-form ref="form" :model="formData" :rules="rules" label-width="auto">
        <p style="margin-bottom:15px;">{{ $t('您确定已知晓预警信息并已做好相关处理工作吗？') }}</p>
        <el-form-item :label="$t('备注')" prop="memo">
          <el-input type="textarea" v-model="formData.memo" auto-complete="off" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
        <el-button @click="close">{{ $t('取消') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import systemConfig from "../../config/config.js";
import Mixin from '@/mixins/loadTime'
import site from '@/mixins/site'

export default {
  mixins: [Mixin, site],
  name: "warning",
  data(){
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      searchCriteria: {
        keys: {
          startTime: '',
          endTime: '',
          status: '',
          loginName: '',
        },
        meta: [
          {
            label: this.$t("创建时间"),
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
                label: this.$t("前日"),
                value: "beforeYesterday",
              },
              {
                label: this.$t("本周"),
                value: "currentWeek",
              },
              {
                label: this.$t("上周"),
                value: "lastWeek",
              },
            ],
          },
          {
            type: "select",
            label: this.$t("状态"),
            prop: "status",
            options: [
              {label:this.$t('待处理'),value:0},
              {label:this.$t('已处理'),value:1},
            ],
          },
          {
            type: "text",
            label: this.$t("预警会员账号"),
            prop: "loginName",
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
          prop: "createTime",
          label: this.$t("创建时间"),
        },
        {
          prop: "userName",
          label: this.$t("预警运营账号"),
        },
        {
          prop: "loginName",
          label: this.$t("预警会员账号"),
        },
        {
          prop: "content",
          label: this.$t("预警内容"),
        },
        {
          prop: "status",
          label:this.$t("状态"),
          slotName: "status"
        },
        {
          prop: "dealTime",
          label: this.$t("处理时间"),
        },
        {
          prop: "dealUser",
          label: this.$t("处理人账号"),
        },
        {
          prop: "memo",
          label: this.$t("备注"),
        },
      ],
      dialogVisible: false,
      formData:{},
      rules:{
        memo: [{required:false,message:this.$t('请输入备注'),trigger:'blur'}]
      },
    }
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        add: hasPermission("member:mbrdepositlock:depositlock"),
      };
    },
  },
  created() {
    this.getTableData()
  },
  methods:{
    getTableData() {
      this.getCurrentRecodeTime()
      let params = Object.assign({},this.searchCriteria.keys)
      this.$axios
        .get(systemConfig.urls.warningList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            ...params,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          this.tableData = []
          if (res.data.code===0) {
            const { list, totalCount,currPage } = res.data.data;
            this.totalCount = totalCount;
            this.currentPage = currPage;
            this.tableData = list.map((item,index) => {
              item.index = index + 1
              item.content = item.content + this.currencySymbol()
              return item;
            });
          }
        });
    },
    handle(row){
      this.formData = Object.assign({},row)
      this.dialogVisible = true
    },
    close(done){
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.formData = {}
      this.dialogVisible = false
      if(done)done()
    },
    submit(){
      this.getCurrentRecodeTime()
      this.$refs.form.validate(valid=>{
        if(valid){
          this.$axios.post(systemConfig.urls.dealWarningList,{id:this.formData.id,memo:this.formData.memo}).then((res) => {
            if (res.data.code===0) {
              this.$message.success(this.$t('处理成功！'))
              this.getTableData()
            }
          }).finally(()=>{
            this.close()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warning{
  .bluebtn:hover{cursor: pointer;}
}
</style>
