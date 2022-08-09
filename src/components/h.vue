<template>
  <MyButton :disabled="false" @customClick="customClick">MyButton</MyButton>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton';
const customClick = (event: HTMLButtonElement) => {
  console.log('event', event);
};
</script>
