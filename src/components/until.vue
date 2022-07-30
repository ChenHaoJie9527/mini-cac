<script setup lang="ts">
import { ref, Ref } from 'vue';

const count = ref(0);

/**
 * 利用async await语法糖特性 会返回Promise then的回调结果
 * toBe 形成闭包 对initial有引用 所以在调用toBe时，将参数赋值给initial 并resolve出去
 */

function until(initial: Ref<number>) {
  function toBe(value: number) {
    return new Promise(resolve => {
      initial.value = value;
      resolve(initial.value);
    });
  }

  return {
    toBe,
  };
}

async function increase() {
  count.value = 0;
  setInterval(() => {
    count.value++;
  }, 1000);
  await until(count).toBe(3);
  console.log(count.value === 3); // Make sure the output is true
}
</script>

<template>
  <p @click="increase">Increase</p>
</template>
