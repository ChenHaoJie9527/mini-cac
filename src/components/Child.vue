<template>
  <div>
    {{ count }}
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
const count = inject('count', 0);
</script>
