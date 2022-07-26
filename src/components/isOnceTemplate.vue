<template>
  <span v-once>{{ count }}</span>
</template>
<script setup lang="ts">
// v-once: 仅渲染元素和组件一次，并跳过之后的更新
// 在随后的重新渲染，元素/组件及其所有子项将被当作静态内容并跳过渲染。这可以用来优化更新时的性能。
import { ref } from 'vue';
const count = ref(0);
setInterval(() => {
  count.value++;
}, 1000);
</script>
