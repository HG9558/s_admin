<template>
    <el-input v-model="money" @keyup.native="inputUp()" @blur="onInputBlur" :type="type"></el-input>
</template>

<script>
export default {
    model: {
        prop: 'inputValue',
        event: 'change'
    },
    data () {
        return {
            money: this.inputValue
        }
    },
    props: ['inputValue'],
    methods: {
        inputUp () {// 只输入两位小数的数字
            if (!this.money && this.money !== 0) return
            this.money = String(this.money)
            this.money = this.money.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
	        this.money = this.money.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	        this.money = this.money.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
	        if(this.money.indexOf(".")< 0 && this.money !=""){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
               this.money= parseFloat(this.money);
            }
            this.$emit('chage', this.money)
        },
        onInputBlur () {
            const a = this.money
            if (!a && a !== '0') return
            this.money = Number(a)
            this.$emit('change', this.money)
        }
    }
}
</script>