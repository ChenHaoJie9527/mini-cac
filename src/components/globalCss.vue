<template>
  <p>Hello Vue.js</p>
</template>

<style scoped>
p {
  font-size: 20px;
  color: red;
  text-align: center;
  line-height: 50px;
}

/*
  :global 伪类选择器 全局选择器 可以在局部组件中使用该伪类影响全局的某个元素
  文档地址：https://staging-cn.vuejs.org/api/sfc-css-features.html#scoped-css
*/
:global(body) {
  width: 100vw;
  height: 100vh;
  background-color: burlywood;
}
</style>
