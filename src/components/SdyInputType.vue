<template>
  <el-input v-model="money" @keyup.native="inputUp" @blur="onInputBlur" :type="type" :disabled="disabled"></el-input>
</template>

<script>
export default {
  model: {
    prop: "inputValue",
    event: "change",
  },
  data() {
    return {
      money: this.inputValue,
    };
  },
  props: ["inputValue", "type", "allowNull", "min", "disabled"], // inputValue 值， type 类型， allowNull 是否允许为空, min 最小值, disabled 是否禁用
  methods: {
    inputUp() {
      if (this.allowNull && !this.money) {
        this.money = "";
      } else if (!this.money && this.money !== 0) return;
      else {
        this.money = String(this.money);
        if (this.type === "zs") { // 只能输入整数
          this.money = this.money.replace(/[^\d]/g, ""); //清除“数字”和“.”以外的字符
          if (this.money && Number(this.money) < 0) this.money = 0;
        } else if( this.type === "zsmin"){ // 只能输入整数，且必须 >= this.min
          this.money = this.money.replace(/[^\d]/g, "")
          if (this.money < this.min || this.money === this.min) this.money = '';
        } else { // 只输入两位小数的数字
          this.money = this.money.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
          this.money = this.money.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
          this.money = this.money
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
          this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
          if (this.money.indexOf(".") < 0 && this.money != "") {
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            this.money = parseFloat(this.money);
          }
        }
      }
      this.$emit("chage", this.money);
    },
    onInputBlur() {
      const a = this.money;
      if (!a && a !== "0" && !this.allowNull) return;
      if (a || a === '0') this.money = Number(a);
      if (this.type === 'zsmin' && this.money < this.min) this.money = ''
      this.$emit("change", this.money);
    }
  },
};
</script>
