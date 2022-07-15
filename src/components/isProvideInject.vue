<!-- <template>
  <div>
    <Child/>
  </div>
</template>
<script setup lang="ts">
import Child from "./Child.vue";
import { provide, ref } from 'vue';
const count = ref(1);
provide('count', count);
</script> -->

<!-- -------- 声明周期例子 -->
<template>
  <div>
    <Child v-if="visible" />
    <button @click="onToggle">Toggle</button>
  </div>
</template>
<script setup lang="ts">
import Child from './Child.vue';
import { provide, ref } from 'vue';
const visible = ref(true);
const timer = ref(null);
const count = ref(0);
provide('count', count);
provide('timer', timer);
const onToggle = () => {
  visible.value = !visible.value;
}
provide;
</script>
