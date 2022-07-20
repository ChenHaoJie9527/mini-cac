<template>
  <button>{{ props.type }}</button>
</template>
<script setup lang="ts">
interface Props {
  type: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
});
</script>
