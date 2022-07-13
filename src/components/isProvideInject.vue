<template>
  <div>
    <Child />
  </div>
</template>
<script setup lang="ts">
import Child from './Child.vue';
import { provide, ref } from 'vue';
const count = ref(1);
provide('count', count);
</script>
