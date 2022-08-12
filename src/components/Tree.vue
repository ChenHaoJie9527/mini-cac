<template>
  <ul>
    <li v-for="item of data" :key="item.key">
      {{ item.title }}
      <Tree :data="item.children" />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { watch } from 'vue';

interface TreeData {
  key: string;
  title: string;
  children: TreeData[];
}
const { data } = defineProps<{ data: TreeData[] }>();
watch(data, (data) => {
  console.log('data', data);
})
</script>
