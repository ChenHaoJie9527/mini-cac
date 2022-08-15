<template>
  <div>
    <h1>msg</h1>
    <p>
      <button @click="updateRef(count - 1)">减少</button>
      {{ count }}
      <button @click="updateRef(count + 1)">增加</button>
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, reactive } from 'vue';
const initial = ref(0);
const count = ref(0);

// 挑战1：更新 ref
const updateRef = (value: number) => {
  count.value = value;
};
</script>
