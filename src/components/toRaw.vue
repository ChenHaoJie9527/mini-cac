<template>
  <div>
    {{}}
  </div>
</template>
<script setup lang="ts">
import {reactive, isReactive, toRaw} from "vue";
const state = {count: 1};
const reactiveState = reactive(state);
/**
 * toRaw: 根据一个 Vue 创建的代理返回其原始对象
 * 使用范围：reactive、readonly、shallowReactive、shallowReadonly
 * 这是一个可以用于临时读取而不引起代理访问/跟踪开销，
 * 或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。
 */
console.log(toRaw(reactiveState) === state); // 期望获得的值： true

const info = {count: 1};
const reactiveInfo = reactive(info);

/**
 * isReactive: 用于判断是否为代理对象
 * toRaw：将响应对象转为原始对象
 */
console.log(isReactive(toRaw(reactiveInfo))); // 期望获得的值： false
</script>