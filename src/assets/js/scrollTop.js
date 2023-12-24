export default {
  scrollTo:(val,that,fun)=>{//val:数据对象 that:this fun:将要调用的查询函数
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    //变量windowHeight是可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
    if(scrollTop+windowHeight==scrollHeight){
        let bool,num=that.enterNum+1;
        if(val=='loseWinSheet'){
          that.$root.$emit('enterNum',num)
          bool=that.tableData.length>that.oldTableList.length
        }else{
          that.enterNum++;
          bool=that.tableData.list?that.tableData.list.length>that.oldTableList.length:true;
        }
        if(num==1||(num>=2&&bool)){
          scrollTop=num==1?scrollTop-13:scrollTop-150
          window.scrollTo(0,scrollTop)
          if(val!="loseWinSheet"){
              that.oldTableList=that.tableData.list;
              that[val].pageSize+=20;
              that[fun]();
          }else{
            let curPageSize=that.pageSize+20
            that.$root.$emit('scrollTop',{oldTableList:that.tableData,pageSize:curPageSize})
            that[fun](curPageSize)
          }
        }
    }
  },
  scrollToTop(){
      window.scrollTo(0,0);
  }
}