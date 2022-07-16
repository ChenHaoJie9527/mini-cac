<template>
  <div>
    {{ count }}
  </div>
  <button ref="btn" @click="onClick">点击</button>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const btn = ref<HTMLButtonElement>();
const onClick = () => {
  count.value++;
  console.log(count.value === 1);
};
</script>
