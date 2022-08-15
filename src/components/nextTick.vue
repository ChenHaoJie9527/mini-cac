<template>
  <div>
    {{ count }}
  </div>
  <button ref="btn" @click="onClick">{{ count }}</button>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';

const count = ref(0);
const btn = ref<HTMLButtonElement>();
const onClick = async () => {
  count.value++;
  await nextTick();
  console.log(count.value === 1);
  console.log(+btn.value?.textContent! === 1);
};
</script>
