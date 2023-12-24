<template>
    <el-form>
        <el-table max-height="480" border :data="tableDataList" class="selfTable">
            <el-table-column v-if="addMore" :label="$t('层级')" prop="depth" min-width="60px" align="center"></el-table-column>
            <el-table-column :label="$t('项目')" prop="label" min-width="150px" align="center">
                <template slot-scope="scope">
                    <div style="line-height:30px;">{{ $t('基础有效投注额') }}</div>
                    <div style="line-height:30px;">{{ $t('推荐人获得返利') }}</div>
                </template>
            </el-table-column>
            <el-table-column :label="item.catName" min-width="150px" v-for="(item, index) in tableDataList[0].catDtoList" :key="index" align="center" :current-row-key="nowIndex">
                <template slot-scope="scope">
                    <input class="rebate-input" v-model="tableDataList[scope.$index].catDtoList[index].validBet" @keyup="regIsInteger({tableIndex:scope.$index,catIndex:index,val:tableDataList[scope.$index].catDtoList[index].validBet})"></input>
                    <input class="rebate-input mr13" v-model="tableDataList[scope.$index].catDtoList[index].topRebate" @keyup="regIsDoint({tableIndex:scope.$index,catIndex:index,val:tableDataList[scope.$index].catDtoList[index].topRebate})"></input>
                    %
                </template>
            </el-table-column>
            <!-- <el-table-column label="继续增加返利"  min-width="100px" align="center">
                <template slot-scope="scope">
                    <el-button class="pad" @click="returnInit"  v-if="tableDataList.length>2">重置</el-button>
                    <el-button v-else class="pad" @click="add">添加层级</el-button>
                </template>
            </el-table-column> -->
            <el-table-column v-if="addMore" :label="$t('继续增加返利')"  min-width="100px" align="center">
                <template slot="header" slot-scope="scope">
                    <el-button :class='["pad",tableDataList.length<3?"select":""] ' :disabled="tableDataList.length==3" @click="add">{{ $t('添加层级') }}</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button :disabled="tableDataList.length-1!=scope.$index||scope.$index==0" :class="['pad',(tableDataList.length-1==scope.$index)&&scope.$index!=0?'delete':'']" @click="deleteInit">{{ $t('删除') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script >
import init from './rule-template'
export default {
    props: {
      layerIndex: String | Number,
      boolEnter: Boolean,
      addMore: {
        type: Boolean,
        default: true,
      },
    },
    inject:['formData','getRuleScopeDtosTemplate'],
    data(){
        return {
            nowIndex:0,
            catList:[],
            tableDataList: [],
            ruleTemplate:{},
            levelDtoList:[],
            saveInitTemplate:'',
            timer2:'',
        }
    },
    created(){
        this.initTable();
    },
    methods:{
        initTable(){
            this.catList=this.formData.catList
            this.saveInitTemplate=JSON.stringify(this.getRuleScopeDtosTemplate());
            let bool=this.formData.formModel.rule.levelDtoList || this.formData.rebateDate.levelDtoList
            let obj //编辑判断是否存在
            if(bool){
                /* obj=this.formData.formModel.rule.levelDtoList.find(val=>{
                    return val.level==this.layerIndex;
                }); */
                let curObj=this.formData.rebateDate?this.formData.rebateDate:this.formData.formModel.rule;
                obj=curObj.levelDtoList.find(val=>{
                    return val.level==this.layerIndex;
                });
            }

            if(bool&&obj){//编辑
             if (obj.catDtoList) {
               this.tableDataList=[
                  {
                    depth: 1,
                    catDtoList: obj.catDtoList.length?(obj.catDtoList):(JSON.parse(init).ruleScopeDtosTemplate.levelDtoList[0].depthDtoList[0].catDtoList)
                  }
                ]
             } else if (obj.depthDtoList&&obj.depthDtoList[0]&&obj.depthDtoList[0].catDtoList) {
                this.tableDataList=[
                  {
                    depth: 1,
                    catDtoList: obj.depthDtoList[0].catDtoList
                  }
                ]
              } else {
               if(this.ruleTemplate.levelDtoList&&this.ruleTemplate.levelDtoList!==undefined){
                 this.tableDataList = this.ruleTemplate.levelDtoList[0].depthDtoList
               }else{
                 this.tableDataList = JSON.parse(init.ruleScopeDtosTemplate).levelDtoList[0].depthDtoList
               }
              }
            }else{//新增
                this.ruleTemplate=JSON.parse(this.saveInitTemplate);
                this.levelDtoList=this.ruleTemplate.levelDtoList;
                this.tableDataList=this.ruleTemplate.levelDtoList[0].depthDtoList
                this.validateData();
            }
        },
        validateData() {
            const data = {}
            let currentObj=this.levelDtoList.find((val,index)=>{
                return val.level==this.layerIndex;
            })
            if(!currentObj){
               this.tableDataList=JSON.parse(this.saveInitTemplate).levelDtoList[0].depthDtoList
               return
            }
            this.tableDataList=currentObj.depthDtoList
        },
        add(){
            if(this.tableDataList.length>=3){
                this.$message(this.$t('最多只能添加三层'));
            }else{
                let obj=JSON.parse(this.saveInitTemplate).levelDtoList[0].depthDtoList[0]
                obj['depth']=this.tableDataList.length+1;
                this.tableDataList.push(obj);
            }
        },
        deleteInit(){
            this.tableDataList=this.tableDataList.splice(0,this.tableDataList.length-1)
        },
        regIsInteger({tableIndex,catIndex,val}){
            let curValue=Number(val)
                if (val === ''||!Number.isInteger(curValue)) {//整数
                    this.tableDataList[tableIndex].catDtoList[catIndex].validBet=null
                }else{
                    this.tableDataList[tableIndex].catDtoList[catIndex].validBet=curValue
                }
        },
        regIsDoint({tableIndex,catIndex,val}){
            let curValue=Number(val)
            if(val === '')curValue=null
            let pointIndex=String(curValue).indexOf('.');
            let time=500
            if(pointIndex!=-1){
                time=700
            }
            if(this.timer2){
                clearTimeout(this.timer2)
            }
            this.timer2=setTimeout(() => {
                if(curValue&&curValue!=0){
                    if(pointIndex!=-1){//有小数位数
                        this.tableDataList[tableIndex].catDtoList[catIndex].topRebate=String(curValue).slice(0,pointIndex+3)
                    }else{
                        this.tableDataList[tableIndex].catDtoList[catIndex].topRebate=curValue
                    }
                }else{
                  if(curValue===0){
                    this.tableDataList[tableIndex].catDtoList[catIndex].topRebate=0
                  }else{
                    this.tableDataList[tableIndex].catDtoList[catIndex].topRebate=null
                  }
                }
                time=200;
            }, time);
        }
    },
    watch:{
        layerIndex(n,o){
            if(n!=o){
                this.initTable();
            }
        },
        tableDataList:{
            handler(n,o){
                let obj=JSON.parse(this.saveInitTemplate);
                obj.levelDtoList[0].depthDtoList=n;
                obj.levelDtoList[0].level=this.layerIndex;
                this.$emit('getData',obj);
            },
            deep:true,
        }
    }
}
</script>

<style lang="scss" scoped>
.activity-rebate-form-item {
  margin: 0;
  width: 100%;
  display: flex;
  padding: 14px 0;
  align-items: center;
  .activity-rebate-platform {
    width: 100px;
    text-align: left;
    text-indent: 20px;
  }
  .activity-rebate-input {
    flex: 1;
    padding: 0;
  }
  /deep/ .el-form-item__content {
    display: flex;
  }
  /deep/ .el-form-item__error {
    right: 0;
    text-align: right;
  }
}
.rebate-input {
    margin-left: -9px;
    width: 80%;
    border: 1px solid rgb(220, 223, 230);
    line-height: 32px;
    text-align: center;
}
.rebate-input:focus{
    border-color: rgb(64, 158, 255);
}
.mr13{
    margin-left: 4px;
    margin-top: 3px;
}
.selfTable{
    /deep/ .el-button{
        padding: 9px 15px !important;
    }
    .select,.select:hover{
        background-color: rgb(102, 177, 255);
        color:white;
    }
    .delete,.delete:hover{
        color:white;
        background: rgb(245, 108, 108);
    }
}
</style>
