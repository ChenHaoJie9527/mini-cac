<template>
  <p>{{ state ? '1' : '2' }}</p>
  <button @click="() => !isRef(toggle) && toggle()">toggle</button>
</template>
<script setup lang="ts">
import { isRef, ref, unref } from 'vue';
function useToggle(initialValue = false) {
  const state = ref(initialValue);
  function toggle() {
    state.value = !unref(state);
  }
  return [state, toggle];
}
let [state, toggle] = useToggle(false);
</script>
