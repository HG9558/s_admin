<template>
  <div class="body">
    <!-- 全局组件 表格组件 -->
    <TableCom :hasAddBtn="!!permissions.add"
    :hasRemoveBtn="false" :tableData="tableData" :totalCount="totalCount" :pageSize.sync="pageSize" :tableColumns="tableColumns" :currentPage.sync="currentPage" @add="setContract('add')" @reloadData="getTableData" :showLoadTime="true"
    :networkLoadTime="networkLoadTime"
    :dataSolveTime="dataSolveTime">
      <el-button v-if="permissions.export && isNowDowning" :disabled="!totalCount" class="iconfont icon-export el-button-export" size="mini" @click="handleExport">{{ $t('导出') }}
      </el-button>
      <el-button v-else-if="permissions.export && !isNowDowning" class="iconfont icon-export el-button-export" size="mini">{{ $t('导出中') }}...
      </el-button>
      <!-- 表格插槽 -->
      <el-table-column :label="$t('活跃用户设置')" slot="validbetmax" align="center">
      <el-table-column :label="$t('签约人数')" slot="contractCount" align="center">
        <template slot-scope="scope">
          <div style="color: #3f99f7;cursor: pointer;" @click="toggleTo(scope.row.id)">{{scope.row.contractCount}}</div>
        </template>
      </el-table-column>
        <template slot-scope="scope">
          {{ $t('周期内累计投注额') }} ≥ {{scope.row.validbetmax}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('操作')" slot="operate" align="center" width="180">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: space-around">
            <span class="blue-color pointer" v-if="permissions.info" @click="setContract('info', scope.row)">
              {{ $t('查看') }}
            </span>
            <span class="blue-color pointer" v-if="permissions.edit" @click="setContract('edit', scope.row)">
              {{ $t('修改') }}
            </span>
            <span class="blue-color pointer" v-if="permissions.delete" @click="deleteContract(scope.row)">
              {{ $t('删除') }}
            </span>
          </div>
        </template>
      </el-table-column>
    </TableCom>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import systemConfig from "../../../config/config";
import StartAndEndTimeSelector from "../../../components/StartAndEndTimeSelector";

import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "agentDomain",
  components: { StartAndEndTimeSelector },
  data() {
    return {
      tableData: [],
      tableColumns: [
        {
          type: "index",
          label: this.$t("序号"),
          fixed: "left",
        },
        {
          prop: "contractName",
          label: this.$t("策略名称"),
        },
        {
          prop: "commissionCap",
          label: this.$t("佣金比例上限"),
        },
        // {
        //   prop: "contractCount",
        //   label: "签约人数",
        // },
        {
          slotName: "contractCount",
        },
        {
          slotName: "validbetmax",
        },
        {
          prop: "modifyTime",
          label: this.$t("更新时间"),
        },
        {
          slotName: "operate",
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      isNowDowning: true   //文件导出
    };
  },
  computed: {
    ...mapGetters(["hasPermission"]),
    permissions() {
      const { hasPermission } = this;
      return {
        info: hasPermission("agent:contract:info"),
        edit: hasPermission("agent:contract:update"),
        add: hasPermission("agent:contract:add"),
        export: hasPermission("agent:contract:export"),
        delete: hasPermission("agent:contract:delete"),
      };
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleExport(){
      this.isNowDowning = false;
      this.$axios
        .get(systemConfig.urls.agentContract.agentContractExport)
        .then((res) => {
          let isDownBool = res.data.data;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: isDownBool,
            });
            this.isNowDowning = true;
          } else {
            this.checkExportFile();
          }
        }).finally(() => {
        this.isNowDowning = true;
      });
    },
    checkExportFile() {
      // 查看导出文件是否可下载
      /* const instance = this.$loading({
          fullscreen: true,
          text: '文件生成中...'
        }) */
      this.$axios.get(systemConfig.urls.agentApply.agyAccountReviewExportCheck,{
        params: {
          module: "agentContractExcel"
        }
      }).then((res) => {
        const obj = res.data.data || {};
        const fileName = obj.fileName,
          downloadFileName = obj.downloadFileName;
        if (fileName) {
          const { baseURL } = res.config;
          // 下载文件
          let SToken = localStorage.getItem("SToken");
          window.open(
            baseURL +
            `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
          );
          this.isNowDowning = true;
          /* instance.close() */
        } else {
          window.setTimeout(this.checkExportFile, 1000);
        }
      });
    },
    handleSubmit(formModel) {
      this.$axios
        .post(systemConfig.urls.agentDomian.add, formModel)
        .then(() => {
          this.isAddDomianShow = false;
          this.getTableData();
        });
    },
    getTableData() {
      this.getCurrentRecodeTime()
      this.$axios
        .get(systemConfig.urls.agentContract.contractList, {
          params: {
            pageSize: this.pageSize,
            pageNo: this.currentPage,
          },
        })
        .then(res => {
          this.getNetworkLoadAndDataSolveTime(res)
          if (res) {
            const { list, totalCount } = res.data.page;
            this.totalCount = totalCount;
            this.tableData = list.map((item) => {
              item.modifyTime = systemConfig.transferTimeByType(
                item.modifyTime,
                "bj"
              );
              return item;
            });
          }
        });
    },
    setContract(text, rowData) {
      this.$router.push({
        path: '/main/agentManage/contractManage/AddorEdit',
        query: {
          curOperate: text,
          rowData: JSON.stringify(rowData)
        }
      })
    },
    deleteContract({id}) {
        // this.$axios.post(systemConfig.urls.agentApply.contractDelete, {ids: ids}).then((resp) => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功'
        //   })
        // })
      this.$axios.post(systemConfig.urls.agentApply.contractDelete, {id})
      .then(res => {
        if(res){
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          this.getTableData()
        }
        return
      })
    },
    toggleTo (id) {
      this.$router.push({
        path: '/main/agentManage/agentList',
        query: {contractId: id}
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-list-breadcrumb {
  float: left;
  display: flex;
  align-items: center;
}
.dialog-footer {
  display: block;
  text-align: center;
}
.table-operation-btns-wrapper-self {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
  margin-bottom: -20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  .table-operation-btns {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-end;
  }
}

</style>
