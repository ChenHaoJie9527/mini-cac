<template>
  <MyButton :disabled="false" @customClick="customClick">MyButton</MyButton>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton';
const customClick = () => {
  console.log('onClick');
};
</script>
