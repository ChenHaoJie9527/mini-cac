<template>
  <div>Mouse position is at: {{ x }}, {{ y }}</div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

function useEventListener<T extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  event: T,
  callback: (this: HTMLElement, ev: HTMLElementEventMap[T]) => void
) {
  // 组件挂载时绑定事件
  onMounted(() => {
    target.addEventListener(event, callback);
  });
  // 组件卸载时移除事件
  onUnmounted(() => {
    target.removeEventListener(event, callback);
  });
}


function useMouse() {
  const x = ref(0);
  const y = ref(0);

  useEventListener(window, 'mousemove', event => {
    x.value = event.pageX;
    y.value = event.pageY;
  });

  return {
    x,
    y,
  };
}

const { x, y } = useMouse();
</script>
<style></style>
