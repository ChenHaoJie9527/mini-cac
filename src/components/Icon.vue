<template>
  <div :style="style" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup >
import { computed } from 'vue';
const props = defineProps({size: '', color: ''});
const style = computed(() => {
  if (props.size && props.color) {
    return {
      fontSize: props.size + 'px',
      color: props.color,
    };
  }
  return {
    fontSize: '16px',
    color: 'red',
  };
});
</script>
