<template>
  <div class="box">hello vue</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const colorList = ref(['blue', 'yellow', 'red', 'green']);
const theme = ref('red');
setInterval(() => {
  theme.value = colorList.value[Math.floor(Math.random() * 4)];
}, 1000);
</script>
<style scoped>
.box {
  color: v-bind('theme');
}
</style>
