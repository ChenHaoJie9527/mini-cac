<script setup lang="ts">
/**
 * Implement the custom directive
 * Make sure the `onClick` method only gets triggered once when clicked many times quickly
 * And you also need to support the debounce delay time option. e.g `v-debounce-click:ms`
 *
 */
function debounce(fn: any, delay: number) {
  let flag: string | number | NodeJS.Timeout | null | undefined = null;

  return (args: any) => {
    if (flag) return;
    fn.call(this, args);
    flag = setTimeout(() => {
      clearTimeout(flag as string);
      flag = null;
    }, delay);
  };
}
const VDebounceClick = {
  created(el: any, binding: { arg: any; value: any }, vnode: any, prevVnode: any) {
    const btn = el;
    const { arg, value } = binding;
    btn.addEventListener('click', debounce(value, arg));
  },
};

function onClick() {
  console.log('Only triggered once when clicked many times quickly');
}
</script>

<template>
  <button v-debounce-click:2000="onClick">Click on it many times quickly</button>
</template>
