<template>
  <div class="level-box">
    <div class="btn-box">
      <el-button
        type="primary"
        @click="handlAddLevel"
      >
        {{ $t('新增代理级别') }}
      </el-button>
    </div>
    <el-table max-height="600" ref="table" type="flex" :data="levelList" v-loading='loading' @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column align="center" label-class-name="heightThe" :prop="item.prop" :width="item.width" :label="item.label" v-for="(item, i) in clomns" :key="i">
        <template slot-scope="scope">
          <div v-if="item.name === 'id'">{{scope.$index + 1}}</div>
          <div v-else-if="item.name === 'menu'" class="blue-color">
            <span class="poiter" @click="handleDelete(scope.row)" v-if="scope.row.accountLevel !== 0">{{ $t('删除') }}</span>
          </div>
          <div v-else-if="item.name === 'memNum'" class="blue-color">
            <span class="poiter" @click="handleMemNum(scope.row)">{{scope.row[item.prop]}}</span>
          </div>
          <div v-else>
            {{scope.row[item.prop]}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <el-dialog :title="$t('新增代理级别')" :visible.sync="showAdd" center :close-on-click-modal="false" @close="clearForm">
      <div>
        <el-form ref="addFrom" :model="levelForm" :rules="formRules" label-position="top">
          <el-form-item :label="$t('等级名称')" prop="tierName">
            <el-input v-model="levelForm.tierName" :placeholder="$t('请输入不超过10个汉字或20个英文字符')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('等级')" prop="accountLevel">
            <el-input v-model="levelForm.accountLevel"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="handlAddForm" :loading="addLoading">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('温馨提示')" :visible.sync="tipsShow" center>
      <div class="tips-text">{{ $t('该会员级别下有会员存在，不允许删除') }}</div>
      <div class="tips-text">{{ $t('如要删除，请把该级别的会员移到别的级别下') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tipsShow = false">{{ $t('知道了') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import systemConfig from "../../config/config";
import Mixin from '@/mixins/loadTime'

export default {
  mixins: [Mixin],
  name: "AgentLevel",
  data() {
    const valiTierName = (rule, value, callback) => {
      if ((/[a-zA-Z]/.test(value) && value.length > 20) || (/[\u4e00-\u9fa5]/.test(value) && value.length > 10)) {
        callback(this.$t('请输入不超过10个汉字或20个英文字符'))
      } else {
        callback()
      }
    }
    const valiAccountLevel = (rule, value, callback) => {
      if (/\D/.test(value)) {
        callback(this.$t('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      levelList: [],
      clomns: [
        { label: this.$t('序号'), name: 'id', width: 100 },
        { label: this.$t('级别名称'), prop: 'tierName' },
        { label: this.$t('会员数'), prop: 'memNum', name: 'memNum' },
        { label: this.$t('操作'), name: 'menu', width: 180 },
      ],
      loading: false,
      addLoading: false,
      showAdd: false,
      tipsShow: false,
      levelForm: {
        tierName: '',
        accountLevel: ''
      },
      formRules: {
        tierName: [
          { required: true, message: this.$t('请输入等级名称'), trigger: 'blur' },
          { validator: valiTierName, trigger: 'blur' }
        ],
        accountLevel: [
          { required: true, message: this.$t('请输入等级'), trigger: 'blur' },
          { validator: valiAccountLevel, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleMemNum(item) {
      const { memNum, id } = item
      if (memNum === 0) return
      this.$router.push({
        path: '/main/memberManage/memberList',
        query: {
          agentLevelId: id
        }
      })
    },
    clearForm() {
      const resetForm = {}
      for (let key in this.levelForm) {
        resetForm[key] = ''
      }
      this.levelForm = resetForm
    },
    async saveMbrLevel() {
      this.addLoading = true
      const [res] = await this.$axios.post(systemConfig.urls.addMbrAgentLevel, this.levelForm).then(res => [res.data, null], err => [null, err])
      this.addLoading = false
      if (res && res.code === 0) {
        this.$message.success(this.$t('新增会员等级成功'))
        this.showAdd = false
        this.getLevel()
      }
    },
    handlAddForm() {
      this.$refs.addFrom.validate(valid => {
        if (valid) {
          this.saveMbrLevel()
        }
      })
    },
    handlAddLevel() {
      this.showAdd = true
    },
    async deleteLevel(id) {
      const [res] = await this.$axios.get(`${systemConfig.urls.delMbrAgentLevel}?id=${id}`).then(res => [res.data, null], err => [null, err])
      if (res && res.code === 0) {
        this.$message.success(this.$t('删除成功'))
        this.getLevel()
      }
    },
    handleDelete(item) {
      const { memNum, id } = item
      if (memNum > 0) {
        this.tipsShow = true
      } else {
        this.deleteLevel(id)
      }
    },
    handleSelectionChange() {},
    getLevel() {
      this.loading = true
      this.$axios.get(systemConfig.urls.mbrAccountLevellist).then(res => {
        this.getNetworkLoadAndDataSolveTime(res)
        this.levelList = res.data.data
        this.loading = false
      }, err => {
        this.loading = false
      })
    },
    init() {
      this.getLevel()
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.level-box {
  padding-top: 0px;
}
.btn-box {
  text-align: right;
  padding-bottom: 10px;
}
.blue-color {
  color: #409eff;
}
.poiter {
  cursor: pointer;
}
.tips-text {
  text-align: center;
  font-size: 14px !important;
  line-height: 30px;
}
/deep/ .el-dialog__body {
  padding: 25px 25px 0 !important;
}
/deep/ .el-table__body td {
  padding: 10px !important;
}
</style>
