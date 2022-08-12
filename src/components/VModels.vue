<template>
  <div>
    <input type="text" v-oh-model="val" />
    <span>{{ val }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, Directive } from 'vue';

const VOhModel: Directive = {
  mounted(el: HTMLInputElement, binding) {
    const { value: modelValue } = binding;
    el.value = modelValue;
    el.addEventListener('input', (event: any) => {
      val.value = event.target.value;
    });
  },
};
const val = ref('vue');
</script>
