<template>
 <div>
   <!--标签-->
     <el-tabs  v-model="editableTabsValue" type="card"  @edit="handleTabsEdit" @tab-click="tabClick">
       <el-tab-pane
         :key="index"
         v-for="(item, index) in editableTabs"
         :label="item.title"
         :name="item.name"
       >
       </el-tab-pane>
     </el-tabs>
   <Base  :or=true  :otherData="otherData"  :commissionSign="commissionSign"   :name="index" v-show="editableTabsValue  == index.toString()"  :index="index"  @getData="getPullData"
            :add="isAdd" :headerLength='headerLength' :tableData="tableData" :allDataNeed="allDataNeed" :headerArr="headerArr" :dataRulesMin="datarules" />
   <!--<div>-->
     <!--<el-button>返回</el-button>-->
     <!--<el-button @click="saves([])">保存</el-button>-->
   <!--</div>-->
 </div>
</template>

<script>
  import Base from '../../components/ServiceSettingBase'
  import systemConfig from '../../config/config'
  export default {
    name: 'ServiceSetting',
    data() {
      return {
        commissionSign: 0,
        otherData: {},
        editableTabs: [
          {
          title: this.$t('基础阶段'),
          name: '0'
         },
          {
            title: this.$t('阶段1'),
            name: '1'
          },
          {
            title: this.$t('阶段2'),
            name: '2'
          },
          {
            title: this.$t('阶段3'),
            name: '3'
          },
          {
            title: this.$t('阶段4'),
            name: '4'
          },
          {
            title: this.$t('阶段5'),
            name: '5'
          },
          {
            title: this.$t('阶段6'),
            name: '6'
          }],
        isAdd:false,
        index:0,
        tabIndex: 0,
        tableData: [
        ],
        temPlateData:[],
        headerLength:0,
        headerArr:[],
        editableTabsValue: '0',
        allData:[],
        allDataNeed:{},
        needId:'',
        datarules:[]
      }
    },
    computed:{

    },
    created(){
       this.init()
    },
    components:{
      Base
    },
    methods: {
      getPullData(data){
        this.allData[parseInt(data.index)] = data.list
        this.saves(this.allData)
      },

      init(){
          this.getTableList()
      },
      saves(){
       let data = this.allData
        this.$axios.post(systemConfig.urls.getPlatformClassSave, {id:'',commissionDtos:data}).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('修改成功')
          })
        })
      },
      getTableList(){
        var data = {
          params:{
          }
        }
        this.$axios.get(systemConfig.urls.getPlatformClass,data).then((res) => {
          let data = res.data.data
          let arr = []
          data.forEach((item,index)=>{
             if(item.detailsDtoList)
             {
               let sim = item.detailsDtoList
                sim.forEach((y)=>
                {
                   y.isShow = 0
                })
               arr.push(item.detailsDtoList.length)
             }
          })
          this.temPlateData = data
          this.tableData = data
          this.headerLength = Math.max.apply(null, arr)
          for(var i =0;i<this.headerLength;i++)
          {
              this.headerArr.push({
                 value:0
              })
          }
          this.tableData = data
        })
        this.$axios.get(systemConfig.urls.getPlatformClassRule,data).then((res) => {
          this.datarules = res.data.data.commissionDtosMin
        })
        this.$axios.get(systemConfig.urls.getPlatformClassInfo,data).then((res) => {

            if(res.data.data)
            {
              this.needId = res.data.data.id
              if(JSON.parse(res.data.data.commissionText) != null && JSON.parse(res.data.data.commissionText).length > 0)
              {
                this.allData = JSON.parse(res.data.data.commissionText)
                this.allDataNeed = this.allData[0]
                this.tableData = this.allData[0].depotListDtos
                this.tabIndex = this.editableTabs.length
              }
            }
        })
      },
      //点击tab
      tabClick(data){

        this.index = data.index
        this.isAdd = false
        let arr = []
        this.temPlateData.forEach((item)=>{
            let brr = []
            item.detailsDtoList.forEach((yy)=>{
              brr.push(Object.assign({},yy,{name:1}))
            })
            arr.push(Object.assign({},item,{'detailsDtoList':brr}))
        })
        this.tableData = arr
        if(parseInt(data.index) > 0){
          this.otherData = this.allData[parseInt(data.index) -1 ]
        }

        if(this.allData[parseInt(data.index)]){
          this.allDataNeed = this.allData[parseInt(data.index)]
          this.tableData = this.allData[parseInt(data.index)].depotListDtos
        }else{
          this.allDataNeed = []
        }
      },
      //编辑tab
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          if(newTabName > 6){
            this.$message({
              type: 'error',
              message: this.$t('最多支持7个呀')
            })
            --this.tabIndex
            return
          }
          this.editableTabs.push({
            title: this.$t('阶段')+(newTabName),
            name: newTabName
          });
          this.editableTabsValue = newTabName;
          this.tableData = this.temPlateData
          this.index = newTabName
          this.isAdd = true
        }
        if (action === 'remove') {
          --this.tabIndex
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
          this.deleteIndex(parseInt(targetName)-1)
        }
      },
      // 删除tab
      deleteIndex(index){
        let data = {
          id: this.needId,
          stage:index
        }
        this.$axios.post(systemConfig.urls.getPlatformClassDelete, data).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('修改成功')
          })
        })
      }
    }
  }
</script>

