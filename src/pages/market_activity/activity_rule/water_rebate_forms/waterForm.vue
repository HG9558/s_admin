<template>
  <div class="activity-rule-form-wrapper">
    <h5 class="activity-rule-header">
      {{ $t('活动规则') }}
      <el-button
        class="activity-rule-header_btn ml15"
        type="primary"
        @click="saveTotal"
        >{{ $t('保存') }}</el-button
      >
      <el-button class="activity-rule-header_btn" @click="$router.go(-1)"
        >{{ $t('返回') }}</el-button
      >
    </h5>
    <div style="position: relative">
      <div class="leftNav">
        <ul>
          <li
            :class="[agyIndex == -1 ? 'selectOn' : '', 'lnv']"
            @click="allAgy"
          >
            <span>{{ $t('全部会员') }}</span>
          </li>
          <li
            :class="[agyIndex == index ? 'selectOn' : '', 'lnv']"
            v-for="(item, index) in allAgentDtoList"
            :key="index"
          >
            <span @click="getCurAgy(item, index)">{{ item.agentAccount }}</span
            ><i class="lnvImg" @click="deleteCurAgy(item.agentId, index)"></i>
          </li>
        </ul>
        <el-button type="primary" @click="addAgentRule">{{ $t('新增代理规则') }}</el-button>
      </div>
      <el-form
        ref="form"
        v-loading="!isFormLoadingCompleted"
        class="activity-rule-body ml250"
        :model="formModel"
        label-width="100px"
        label-suffix=":"
        :rules="rules"
      >
        <!-- 公共表单 开始 -->
        <el-form-item
          class="activity-rule-inline-block"
          prop="ruleName"
          :label="$t('规则名称')"
          v-if="agyIndex == -1"
        >
          <el-input
            v-model="formModel.ruleName"
            :placeholder="$t('请输入规则名称')"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="agyIndex == -1"
          class="activity-rule-inline-block"
          prop="actTmplId"
          :label="$t('规则类别')"
        >
          <el-select
            v-model="formModel.actTmplId"
            :placeholder="$t('请选择规则类别')"
            disabled
          >
            <el-option
              :key="item.id"
              :value="item.id"
              :label="item.tmplName"
              v-for="item in activityCategories"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="agyIndex == -1" prop="available" :label="$t('是否启用')">
          <el-radio-group
            v-model="formModel.available"
            :placeholder="$t('请选择是否启用')"
          >
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="agyIndex == -1" prop="isAudit" :label="$t('是否审核')">
          <el-radio-group
            v-model="formModel.isAudit"
            :placeholder="$t('请选择是否审核')"
          >
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="agyIndex == -1" prop="passIfReview" label="会员首存稽核不通过是否发返水">
          <el-radio-group
            v-model="formModel.passIfReview"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 公共表单 结束 -->
        <!-- rule表单 -->
        <component
          :is="ruleFormMeta.component"
          :rule="formModel.rule"
          v-if="isFormLoadingCompleted"
          @getDate="getDate"
          :layIndex="layIndex"
          :memberLevelGroup="memberLevelGroup"
        />
      </el-form>
    </div>
    <el-dialog
      :title="$t('代理选择')"
      :visible.sync="addAgentDialogVisible"
      width="30%"
      center
    >
      <span class="agentHeader">
        <el-input v-model="agyAccount" :placeholder="$t('请输入代理账号')"></el-input>
        <el-button @click="getTableData">{{ $t('搜索') }}</el-button>
        <el-button type="primary" @click="saveAddAgent">{{ $t('保存') }}</el-button>
      </span>
      <div>
        <TableCom
          :hasAddBtn="false"
          :hasRemoveBtn="false"
          :tableData="tableData"
          :totalCount="totalCount"
          :pageSize.sync="pageSize"
          :tableColumns="tableColumns"
          :currentPage.sync="currentPage"
          @reloadData="getTableData"
        >
          <!-- 表格插槽 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('操作')"
            slot="operation"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!selectIds.includes(scope.row.id)"
                @click="selectAgy(scope.row)"
                type="text"
                size="small"
                >{{ $t('选中') }}</el-button
              >
              <el-button v-else type="text" size="small" class="selected"
                >{{ $t('已选中') }}</el-button
              >
            </template>
          </el-table-column>
        </TableCom>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isNumber } from "../../../../config/utils";
import systemConfig from "../../../../config/config.js";
import WaterRebateRuleForm from "./Rule";
import WaterRebateRuleTemplate from "./rule-template";
export default {
  components: {
    WaterRebateRuleForm
  },
  provide() {
    const instance = this;
    return {
      formData: instance.$data
    };
  },
  data() {
    return {
      formModel: {
        ruleName: null,
        actTmplId: null,
        available: 1,
        isAudit: 1,
        rule: null,
        passIfReview: 0,
      },
      rules: {
        ruleName: { required: true, message: this.$t("请输入规则名称"), trigger: "blur" }
      },
      activityCategories: [],
      rangeGroup: [],
      initRangeGroup: [],
      catList: [],
      rebateDate: {},
      initAgyData: {},
      agyIndex: -1,
      allAgentDtoList: [],
      addAgentDialogVisible: false,
      agyAccount: "", //代理账号
      tableColumns: [
        {
          label: this.$t("代理账号"),
          prop: "agyAccount",
          width: "180",
          fixed: "left",
          align: "center"
        },
        {
          label: this.$t("代理姓名"),
          prop: "realName",
          width: "180",
          fixed: "left",
          align: "center"
        },
        {
          label: this.$t("上级代理"),
          prop: "agyTopAccount",
          width: "180",
          fixed: "left",
          align: "center"
        },
        {
          slotName: "operation"
        }
      ],
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: null,
      selectIds: [],
      rowList: [],
      selectOnList: [],
      layIndex: 0,
      initRebatesLevelListDtos: {},
      memberLevelGroup: [],
      allLevelDtoList: [],
      allAgentDtoList: [],
      saveParams: [],
      agentSavePamas: [],
      saveBool: false,
      deleteAgentIds: [],
      allMemeberWriteSet: true
    };
  },
  computed: {
    id() {
      return Number(this.$route.query.id);
    },
    actTmplId() {
      return Number(this.$route.query.actTmplId);
    },
    tmplName() {
      return this.$route.query.tmplName;
    },
    tmplCode() {
      return this.$route.query.tmplCode;
    },
    isFormLoadingCompleted() {
      const { formModel, rangeGroup } = this;
      return formModel.rule && rangeGroup.length;
    },
    ruleFormMeta() {
      return {
        component: "WaterRebateRuleForm",
        ...WaterRebateRuleTemplate
      };
    },
    getRebatesNeDtoTemplate() {
      return JSON.parse(this.ruleFormMeta.rebatesNeDtoTemplate);
    }
  },
  created() {
    this.setInitData();
  },
  methods: {
    setInitData() {
      this.getMemberLevel().then(() => {
        this.getActivityCategories().then(() => {
          this.formModel.actTmplId = this.actTmplId;
          const { id } = this;
          if (id) {
            this.$axios
              .get(systemConfig.urls.activityRule.list + `/${id}`)
              .then(res => {
                const formModel = res.data.data;
                formModel.rule = JSON.parse(formModel.rule);
                formModel.passIfReview = formModel.rule.passIfReview ? formModel.rule.passIfReview : 0;
                this.allAgentDtoList = JSON.parse(
                  JSON.stringify(formModel.rule.rebatesNeDto.agentDtoList || [])
                );
                this.formModel = formModel;
                this.initAgyData = JSON.stringify(formModel);
                this.getInitTemplate();
                this.initLevelDtoList(formModel.rule);
              });
          } else {
            let formModel = { available: 0, isAudit: 0, passIfReview: 0 };
            formModel.rule = JSON.parse(this.ruleFormMeta.ruleTemplate);
            this.allLevelDtoList = JSON.parse(JSON.stringify(formModel.rule));
            this.initAgyData = JSON.stringify(formModel);
            this.formModel = formModel;
            this.getInitTemplate();
            this.initLevelDtoList(formModel.rule);
          }
          this.formModel.actTmplId = this.actTmplId;
        });
      });
      this.findRangeGroup();
    },
    getDate(val) {
      this.layIndex = val;
    },
    getMemberLevel() {
      return this.$axios.get(systemConfig.urls.memberLevel.list).then(res => {
        this.memberLevelGroup = res.data.data;
      });
    },
    initLevelDtoList(rule) {
      rule.rebatesNeDto.levelDtoList = this.memberLevelGroup.map(level => {
        const levelDto =
          rule.rebatesNeDto.levelDtoList.find(
            item => item.accountLevel === level.id
          ) || this.getRebatesNeDtoTemplate.levelDtoList[0];
        return {
          accountLevel: level.id,
          ...levelDto
        };
      });
      this.formModel.rule = rule;
      this.rangeGroup = this.initRangeGroup;
    },
    findRangeGroup() {
      this.$axios.get(systemConfig.urls.findGameTypes).then(res => {
        const gameTypes = res.data.page;
        this.catList = gameTypes.map(item => {
          return {
            id: item.id,
            catName: item.catName
          };
        });
        //console.log("TCL: findRangeGroup -> gameTypes", gameTypes)
        const arr = gameTypes.map(({ id: catId }) => {
          return this.$axios
            .get(systemConfig.urls.activityRule.getPlatforms, {
              params: {
                catId
              }
            })
            .then(res => res.data.tDepots);
        });
        Promise.all(arr).then(res => {
          this.initRangeGroup = res
            .map((item, index) => {
              const { id: catId, catName } = gameTypes[index];
              return {
                catId,
                platforms: item || [],
                isCheckedAll: false,
                catName,
                depots: []
              };
            })
            .filter(item => item.platforms.length);
          this.rangeGroup = JSON.parse(JSON.stringify(this.initRangeGroup));
        });
      });
    },
    getActivityCategories() {
      return this.$axios
        .get(systemConfig.urls.activityRule.category)
        .then(res => {
          this.activityCategories = res.data.page;
        });
    },
    addAgentRule() {
      this.addAgentDialogVisible = true;
      this.agyAccount = "";
      this.pageNo = 1;
      this.pageSize = 10;
      this.selectIds = this.allAgentDtoList.map(item => item.agentId); //已选中
      this.getTableData();
    },
    //会员返水代理设置
    getCurAgy({ levelDtoList, agentId, agentAccount }, index) {
      this.agyIndex = index;
      this.layIndex = 0;
      this.agentSavePamas[index] = { agentId, agentAccount };
      let rule = {
        scope: false,
        period: false,
        rebatesNeDto: {
          levelDtoList: levelDtoList || []
        }
      };
      this.rangeGroup = [];
      this.initLevelDtoList(rule);
    },
    //删除某个会员返水代理设置
    deleteCurAgy(agentId, index) {
      this.allAgentDtoList.splice(index, 1);
    },
    allAgy(save) {
      this.agyIndex = -1;
      this.layIndex = 0;
      let rule = this.allLevelDtoList;
      this.rangeGroup = [];
      this.initLevelDtoList(rule);
    },
    getTableData() {
      let params = {
        agyAccount: this.agyAccount,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.$axios
        .get(systemConfig.urls.activityRule.getAgent, { params })
        .then(res => {
          let reData = res.data.data;
          this.totalCount = reData.totalCount;
          this.tableData = reData.list;
        });
    },
    saveAddAgent() {
      let newArray = [];
      /* this.selectIds.map(id=>{
        this.deleteAgentIds.map((agentId,index,array)=>{
          if(id==agentId){
            array.splice(index,1);
          }
        })
      }) */
      this.allAgentDtoList = this.allAgentDtoList.concat(this.selectOnList);
      this.addAgentDialogVisible = false;
    },
    selectAgy({ id, agyAccount }) {
      let levelDtoList = [
        {
          accountLevel: 1,
          multipleWater: 0,
          rebatesLevelListDtos: this.initRebatesLevelListDtos
        }
      ];
      this.selectIds.push(id);
      this.selectOnList.push({
        agentId: id,
        agentAccount: agyAccount,
        levelDtoList: levelDtoList
      });
    },
    getInitTemplate() {
      let initData = JSON.parse(this.initAgyData);
      //保存初始rebatesLevelListDtos
      this.initRebatesLevelListDtos = initData.rule.rebatesNeDto.levelDtoList[0].rebatesLevelListDtos.map(
        item => {
          item.donateRatio = "";
          return item;
        }
      );
    },
    handleSave(rule) {
      /* this.$refs.form.validate(valid => {
       if (valid) { */
      const formModel = JSON.parse(JSON.stringify(this.formModel));
      /* const { tmplCode } = this */
      const { rangeGroup } = this;
      const { levelDtoList, agentDtoList } = rule.rebatesNeDto;
      const catPlatformMapper = {};
      for (const range of rangeGroup) {
        catPlatformMapper[range.catId] = range.platforms.map(
          plat => plat.depotId
        );
      }
      this.filterData(rule, levelDtoList, catPlatformMapper);
      agentDtoList.map((item, index) => {
        this.filterData(
          rule,
          item.levelDtoList,
          catPlatformMapper,
          true,
          index
        );
      });
      rule.rebatesNeDto.agentDtoList = agentDtoList.filter(
        (item, index) => item.levelDtoList.length
      );
      this.save();
    },
    filterData(rule, levelDtoList, catPlatformMapper, bool, index) {
      levelDtoList.forEach(item => {
        let { rebatesLevelListDtos } = item;
        // 筛选掉没设置返水的平台
        rebatesLevelListDtos = rebatesLevelListDtos.filter(({ donateRatio }) =>
          isNumber(donateRatio)
        );
        // 筛选掉旧数据中已被禁用的平台
        rebatesLevelListDtos = rebatesLevelListDtos.filter(
          ({ catId, depotId }) =>
            catPlatformMapper[catId] &&
            catPlatformMapper[catId].includes(depotId)
        );
        item.rebatesLevelListDtos = rebatesLevelListDtos;
      });
      if (!bool) {
        // 筛选掉没配置返水的会员层级
        let arr = levelDtoList.filter(level => {
          return level.rebatesLevelListDtos.some(item =>
            isNumber(item.donateRatio)
          );
        });
        if (!arr.length) {
          this.allMemeberWriteSet = false;
        } else {
          this.allMemeberWriteSet = true;
          rule.rebatesNeDto.levelDtoList = arr;
        }
      } else {
        rule.rebatesNeDto.agentDtoList[
          index
        ].levelDtoList = levelDtoList.filter(level => {
          return level.rebatesLevelListDtos.some(item =>
            isNumber(item.donateRatio)
          );
        });
      }
    },
    saveTotal() {
      this.allLevelDtoList.rebatesNeDto.agentDtoList = this.allAgentDtoList;
      this.handleSave(this.allLevelDtoList);
    },
    save() {
      //层级会员，默认为1
      this.formModel.rule.scope = 1;
      const newRule = JSON.parse(JSON.stringify(this.allLevelDtoList))
      newRule.passIfReview = this.formModel.passIfReview
      let params = {
        ...this.formModel,
        rule: JSON.stringify(newRule)
      };
      if (!this.formModel.ruleName) {
        this.$message({
          type: "warning",
          message: this.$t("规则名称不能为空")
        });
        return;
      }
      if (!this.allMemeberWriteSet) {
        this.$message({
          type: "warning",
          message: this.$t("请至少设置全部会员中某一层级的返水")
        });
        return;
      }
      const loading = this.$loading({ fullscreen: true });
      this.$axios
        .post(
          this.id
            ? systemConfig.urls.activityRule.update
            : systemConfig.urls.activityRule.save,
          params
        )
        .then(() => {
          this.$router.go(-1);
        })
        .finally(() => {
          loading.close();
        });
    }
  },
  watch: {
    agyAccount(n, o) {
      this.currentPage = 1;
      this.pageSize10;
    },
    addAgentDialogVisible(n, o) {
      if (!n) {
        this.tableData = [];
        this.selectIds = [];
        this.selectOnList = [];
      }
    },
    "formModel.rule": {
      handler(n, o) {
        if (this.agyIndex == -1) {
          this.allLevelDtoList = n;
        } else {
          this.allAgentDtoList[this.agyIndex] = {
            ...this.agentSavePamas[this.agyIndex],
            levelDtoList: n.rebatesNeDto.levelDtoList
          };
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .activity-rule-inline-block {
  display: inline-block;
  & + .activity-rule-inline-block {
    margin-left: 40px;
  }
}
.activity-rule-form-wrapper {
  padding: 40px;
  position: relative;
}
.activity-rule-header {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  .activity-rule-header_btn {
    float: right;
  }
  .ml15 {
    margin-left: 15px;
  }
}
.leftNav {
  width: 240px;
  position: absolute;
  .lnv {
    box-sizing: border-box;
    border-right: 4px solid white;
    overflow: hidden;
    span {
      width: 180px;
      height: 50px;
      display: inline-block;
      line-height: 50px;
      text-align: center;
      float: left;
      cursor: pointer;
    }
    .lnvImg {
      display: inline-block;
      width: 50px;
      height: 50px;
      float: left;
      cursor: pointer;
    }
  }
  .el-button /deep/ {
    width: 160px;
    margin-left: 15px;
    margin-top: 15px;
  }
  .selectOn {
    background-color: rgb(230, 247, 255);
    border-right-color: rgb(24, 144, 255);
    color: rgb(24, 144, 255);
  }
}
.activity-rule-body {
  padding: 30px;
  border: 1px solid #eee;
}
.ml250 {
  margin-left: 250px;
}
.activity-rule-footer {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  .activity-rule-footer_save {
    margin-left: 30px;
  }
}
/deep/ .el-dialog {
  .el-dialog__body {
    padding-bottom: 70px;
    .agentHeader {
      .el-input {
        width: 40%;
        margin-right: 10px;
      }
    }
  }
  .selected {
    color: black;
  }
}
</style>
