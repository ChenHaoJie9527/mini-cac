<script setup lang="ts">
import ButtonSlot from '@/components/ButtonSlot.vue';
import isWatch from '@/components/isWatch.vue';
import isShallowRefVue from './components/isShallowRef.vue';
import isToggleVue from './components/isToggle.vue';
import useCounter from '@/components/useCounter.vue';
</script>

<template>
  <div>Hello Vitest!</div>
  <ButtonSlot>hello Vitest!</ButtonSlot>
  <isWatch />
  <isShallowRefVue />
  <isToggleVue />
  <useCounter />
</template>
