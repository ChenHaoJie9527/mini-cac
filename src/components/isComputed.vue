<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ plusOne }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
const count = ref(1);
const plusOne = computed({
  get() {
    return count.value + 1;
  },
  set() {
    return count.value++;
  },
});
plusOne.value++;
</script>
