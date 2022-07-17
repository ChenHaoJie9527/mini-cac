<template>
  <Teleport to="body">
    <span>
      {{ msg }}
    </span>
  </Teleport>
</template>
<script setup lang="ts">
import { Teleport } from 'vue';
const msg = 'hello vue';
</script>
