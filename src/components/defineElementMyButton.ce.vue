<template>
  <button>{{ message }}</button>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ message: string }>();
const message = computed(() => props.message);
</script>
