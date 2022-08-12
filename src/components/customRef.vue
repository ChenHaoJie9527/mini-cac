<template>
  <input type="text" v-model="val" />
</template>
<script setup lang="ts">
import { customRef, watch } from 'vue';

// 防抖 ref 函数
function useDebounceRef(value: string, delay = 500) {
  let _timer: any = null;
  //customRef: 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式
  return customRef((track, trigger) => {
    /**
     * track() 应该在 get() 方法中调用
     * trigger() 应该在 set() 中调用
     * 事实上，你对何时调用、是否应该调用他们有完全的控制权
     */
    return {
      get() {
        track();
        return value;
      },
      set(newVal: string) {
        clearTimeout(_timer);
        _timer = setTimeout(() => {
          value = newVal;
          trigger();
        }, delay);
      },
    };
  });
}
const val = useDebounceRef('123');

watch(val, (value) => {
  console.log('value', value);
});
</script>
