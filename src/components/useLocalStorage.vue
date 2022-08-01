<script setup lang="ts">
import { ref, Ref, watchEffect, watch } from 'vue';

/**
 * Implement the composable function
 * Make sure the function works correctly
 */
function useLocalStorage(key: string, initialValue: any, resetVal = false) {
  const res: Ref<any> = ref(localStorage.getItem(key) ?? initialValue);
  const _resetVal = ref(resetVal);
  // 立即调用回调函数 并收集依赖 依赖发生变化时 调用函数
  watchEffect(() => {
    localStorage.setItem(key, res.value);
  });
  watch(_resetVal, () => {
    if (_resetVal.value === true) {
      res.value = initialValue;
      localStorage.removeItem(key);
    }
  });
  return [res, _resetVal] as const;
}

const [counter, _resetVal] = useLocalStorage('counter', 0);

// We can get localStorage by triggering the getter:
console.log(counter.value);

// And we can also set localStorage by triggering the setter:

const update = () => counter.value++;
const reset = () => {
  _resetVal.value = true;
};
</script>

<template>
  <p>Counter: {{ counter }}</p>
  <button @click="update">Update</button>
  <button @click="reset">清空storage</button>
</template>
