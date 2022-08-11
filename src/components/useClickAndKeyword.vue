<template>
  <!-- 添加按键修饰符让即使 Alt 或 Shift 被一同按下时也会触发 -->
  <button @click.alt="click1" @click.shift>click1</button>
  <!-- 添加按键修饰符让有且只有 Shift 被按下的时候才触发 -->
  <button @click.shift.exact="click2">click2</button>
  <!-- 添加按键修饰符让没有任何系统修饰符被按下的时候才触发 -->
  <button @click.exact="click3">click3</button>
</template>
<script lang="ts" setup>
const click1 = () => {
  console.log('click1');
};
const click2 = () => {
  console.log('click2');
};
const click3 = () => {
  console.log('click3');
};
</script>
