<template>
<div class="div">
    <p class="first"><img src="../assets/img/404.png"></p>
    <p class="second">{{ $t('找不到页面') }}</p>
    <p class="third">{{ $t('抱歉, 您访问的页面迷路了') }}...<a href="/#/main">{{ $t('返回首页') }}</a></p>
</div>
</template>
<style lang="scss">
.div {
    text-align: center;
    .second {
        font-size: 24px;
        line-height: 80px;
        color:#999;
    }
    .third {
        font-size: 14px;
        color: #989898;
    }
}
</style>
