<template>
  <my-button-defined message="myButtonDefined" @click="onHandleClick"></my-button-defined>
</template>

<script setup lang="ts">
import { defineCustomElement } from 'vue';
import defineElementMyButton from '@/components/defineElementMyButton.ce.vue';
function defineElement() {
  // 自定义元素
  return defineCustomElement(defineElementMyButton);
}
const MyButtonDefineElement = defineElement();
// 注册自定义元素
customElements.define('my-button-defined', MyButtonDefineElement);
const onHandleClick = () => {
  console.log('111111');
};
</script>
