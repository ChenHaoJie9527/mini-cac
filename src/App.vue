<script setup lang="ts">
import ButtonSlot from "@/components/ButtonSlot.vue";
import isWatch from "@/components/isWatch.vue";
import isShallowRefVue from "./components/isShallowRef.vue";
</script>

<template>
  <div>Hello Vitest!</div>
  <ButtonSlot> hello Vitest! </ButtonSlot>
  <isWatch />
  <isShallowRefVue />
</template>
