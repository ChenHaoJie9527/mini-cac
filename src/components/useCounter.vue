<script setup lang="ts">
import { ref } from 'vue';
interface UseCounterOptions {
  min?: number;
  max?: number;
}

function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const count = ref(initialValue);
  // Infinity 无穷大
  // -Infinity 无穷小
  const { max = Infinity, min = -Infinity } = options;
  // + 法
  function inc(val = 1) {
    // Math.min 比较数值中最小的数。如果任一参数不能转换为数值，则返回NaN
    return (count.value = Math.min(max, count.value + val));
  }
  // - 法
  function dec(val = 1) {
    // 返回给定的一组数字中的最大值。如果给定的参数中至少有一个参数无法被转换成数字，则会返回 NaN
    return (count.value = Math.max(min, count.value - val));
  }
  // 重置
  function reset(val = initialValue) {
    return (count.value = val);
  }

  return {
    inc,
    dec,
    reset,
    count,
  };
}
/**
 * 第一个参数为默认起始值
 * 第二个参数为区间配置参数
 * 最大值不能 > 11 最小值不能 < 5
 */
const { count, inc, dec, reset } = useCounter(6, { min: 5, max: 11 });
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="inc()">inc</button>
  <button @click="dec()">dec</button>
  <button @click="reset()">reset</button>
</template>
