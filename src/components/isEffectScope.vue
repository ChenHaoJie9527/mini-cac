<template>
  <div>
    <p>
      {{ doubled }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, effectScope } from 'vue';
const scoped = effectScope();
const counter = ref(1);
const doubled = computed(() => counter.value * 2);
// 使用 `effectScope` API 使这些Effect效果在触发一次后停止
scoped.run(() => {
  watch(doubled, () => console.log(doubled.value));
  watchEffect(() => console.log(`Count: ${doubled.value}`));
});

counter.value = 2;

setTimeout(() => {
  scoped.stop();
  counter.value = 4;
});
/**
 * 总结：
 *    1. 第一次：counter定义为1， doubled计算得出为2 但并不会触发watch(初始化时不会触发)，而是会执行watchEffect得 Count: 2
 *    2. 第二次 counter被赋值， 触发computed重新计算 doubled为4 触发了scope里的watch 为4，由于watchEffect里的doubled被修改得 Count: 4
 *    3. 只会在setTimeout先把scope stop, 即把scope作用域里的依赖都清理了，只会的赋值也就不会再触发了
 */
</script>
