<template>
  <el-dialog width="75% !important" :title="$t('返利设置')" :visible="true" @close="$emit('close')">
    <el-form :validate-on-rule-change="false" class="bank-list-form" label-width="100px" label-position="right" label-suffix=":" :model="validateData" ref="form" :rules="rules">
      <el-form-item size='small' :label="$t('复制权限组')">
        <el-select v-model="cpGroup" :placeholder="$t('请选择')" @change="fnCpGroup(cpGroup)">
          <el-option value='' :label="$t('空')"></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.value" :value='item.id'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('推荐返利')">
        <br>
        <el-table max-height="480" border :data="tableDataList">
          <el-table-column :label="$t('项目')" prop="label" min-width="150px"></el-table-column>
          <el-table-column :label="item.catName" min-width="150px" v-for="(item, index) in catList" :key="item.catId">
            <template slot-scope="scope">
              <el-form-item :prop="`column${index}-${tableDataList[scope.$index].key}`">
                <el-input class="rebate-input" v-model="(formData.rebateCatDtos[index] || {})[tableDataList[scope.$index].key]"></el-input>
                <template v-if="/^rebate|topRebate$/.test(tableDataList[scope.$index].key)">
                  %
                </template>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item prop="auditType" :label="$t('稽核')">
        <el-radio-group v-model="formData.auditType">
          <el-radio :label="1">{{ $t('稽核') }}</el-radio>
          <el-radio :label="0">{{ $t('免稽核') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="auditMultiple" :label="$t('稽核倍数')" v-if="formData.auditType === 1">
        <el-input style="width: 19%" v-model.number="formData.auditMultiple" :placeholder="$t('请输入稽核倍数')"></el-input>
      </el-form-item>
      <div class="rebate-tips">
        <em class="title">{{ $t('提示') }}：</em>
        <ul class="content">
          <li>
            <em>1.</em>
            <span>{{ $t('系统默认对返利百分比为0的项目，不计算会员返利所得；') }}</span>
          </li>
          <li>
            <em>2.</em>
            <span>{{ $t('每次编辑保存后，第2日00:00 展示于会员前台[个人中心]，第2日下午14:00pm 系统拉取前一日（00:00:00 ~ 23:59:59）已结算订单的有效投注额，计算该组会员的推荐人返利所得，并生成[返利列表]') }}</span>
          </li>
        </ul>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" size="small">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit" size="small">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import systemConfig from '../../config/config'
export default {
  props: ['id','list'],
  data() {
    return {
      catList: [],
      
      formData: {
        groupId: null,
        rebateCatDtos: [],
        auditType: null,
        auditMultiple: null
      },
      cpGroup:'',
      fnCpGroupBool:false,
    }
  },
  computed: {
    tableDataList() {
      return [
        {
          label: this.$t('基础有效投注额'),
          key: 'validBet'
        },
        // {
        //   label: '个人获得返利',
        //   key: 'rebate'
        // },
        {
          label: this.$t('推荐人获得返利'),
          key: 'topRebate'
        }
      ]
    },
    validateData() {
      const data = {}
      this.catList.forEach((item, index) => {
        for (let i = 0;i < this.tableDataList.length;i++) {
          const key = this.tableDataList[i].key
          const rebateCatDto = this.formData.rebateCatDtos[index] || {}
          data[`column${index}-${key}`] = rebateCatDto[key]
        }
      })
      data.auditType = this.formData.auditType
      data.auditMultiple = this.formData.auditMultiple
      return data
    },
    rules() {
      const rules = {}
      this.catList.forEach((item, index) => {
        rules[`column${index}-validBet`] = [
          {required: true, message: this.$t('不能为空'), trigger: 'blur'},
          /* {type: 'integer', min: 0, message: '请输入0或正整数'} */
          {pattern:/^\d+$/,message: this.$t('请输入0或正整数')}　 //匹配正整数}
        ]
        rules[`column${index}-rebate`] = [
          {required: true, message: this.$t('不能为空'), trigger: 'blur'},
          //{type: 'number', min: 0, max: 100,message: '请输入0-100的数字'},
          //{pattern: /^\d+(\.\d?)?$/,message: '只能有一位小数'},//范围在0-100且至多只能有一位小数的数值
          {pattern: /^\d+(\.\d)?$/,message: this.$t('大于等于0允许1位小数')},
        ]
        rules[`column${index}-topRebate`] = [
          {required: true, message: this.$t('不能为空'), trigger: 'blur'},
          //{type: 'number', min: 0, max: 100,message: '请输入0-100的数字'},
          //{pattern: /^\d+(\.\d?)?$/,message: '只能有一位小数'},
          {pattern: /^\d+(\.\d)?$/,message: this.$t('大于等于0允许1位小数')},
        ]
      })
      rules.auditType = [
        {required: true, message: this.$t('请选择一个')}
      ]
      rules.auditMultiple = [
        {required: true, message: this.$t('不能为空'), trigger: 'blur'},
        {pattern: /^[1-9]\d*$/, message: this.$t('请输入正整数')},
      ]
      return rules
    }
  },
  created() {
    this.formData.groupId = this.id
    this.getCatList()
  },
  methods: {
    submit() {
      this.fnCpGroupBool=false;
      this.$refs.form.validate(valid => {
        if(valid){
          const {auditType, auditMultiple, rebateCatDtos} = this.formData
          this.$axios.post(systemConfig.urls.saveRebateSetting, {
            ...this.formData,
            auditMultiple: auditType ? auditMultiple : null
          })
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.$t('设置成功')
              })
              this.$emit('close')
            }
          })
        }
      })
    },
    getCatList(){
      this.$axios.get(systemConfig.urls.getRebateSettingCatList)
      .then(res => {
        this.catList = res.data.data.map(item => {
          return {
            catId: item.catId,
            catName: item.catName
          }
        })
        this.getRebateInfo()
      })
    },
    getRebateInfo(val) {
      let id=val ? val : this.id;
      this.$axios.get(systemConfig.urls.getRebateSettingInfo, {params: {groupId: id}})
      .then(res => {
        if (res) {
          const {id}=this.formData
          const {groupId}=this.formData
          let formData = res.data.data
          if(this.fnCpGroupBool){
            formData={...formData,id,groupId}
          }
          const rebateCatDtos = this.catList.map(item => {
            return {
              catId: item.catId,
              catName: item.catName,
              validBet:  null,
              // rebate: null,
              topRebate: null
            }
          })
          if (formData && formData.rebateCatDtos) {
            formData.rebateCatDtos = rebateCatDtos.map(item => {
              const cat = formData.rebateCatDtos.find(temp => temp.catId === item.catId)
              if (cat) {
                /* evaz: 去掉个人返点 */
                delete cat.rebate
                return cat
              } else {
                return item
              }
            })
            this.formData = formData
          } else {
            this.formData.rebateCatDtos = rebateCatDtos
          }
        }
      })
    },
    fnCpGroup(id){
      if (!id) {
        this.$emit('close');
        return
      }
      this.fnCpGroupBool=true;
      this.getRebateInfo(id);
    }
  }
}
</script>

<style lang="scss" scoped>
.rebate-input {
  width: 88%;
  /deep/ .el-input__inner {
    text-align: left;
  }
}
.rebate-tips {
  display: flex;
  line-height: 26px;
  .title {
    width: 110px;
    color: #333;
    text-align: right;
  }
  .content>li {
    display: flex;
  }
}
</style>


