<!-- <template>
  <div>
    {{ count }}
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
const count = inject('count', 0);
</script> -->

<!-- ----------- 生命周期测试 -->
<script setup lang="ts">
import { onMounted, inject, onUnmounted } from 'vue';

const timer = inject<any>('timer');
const count = inject<any>('count');
onMounted(() => {
  timer.value = window.setInterval(() => {
    count.value++;
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<template>
  <div>
    <p>Child Component: {{ count }}</p>
  </div>
</template>
