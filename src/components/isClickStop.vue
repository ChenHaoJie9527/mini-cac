<template>
  <div @click="click1">
    <div @click.stop="click2">click me</div>
  </div>
</template>
<script setup lang="ts">
const click1 = () => {
  console.log('click1');
}
const click2 = () => {
  console.log('click2');
}
</script>